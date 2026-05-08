import { useEffect, useRef, useState } from 'react';
import { sendOffer, sendAnswer, sendIceCandidate, onOffer, onAnswer, onIceCandidate } from '../lib/socket';

interface VideoStreamProps {
  channelId: string;
  userId: string;
}

export function VideoStream({ channelId, userId }: VideoStreamProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peers, setPeers] = useState<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Get local video stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error('Failed to access media devices:', error));

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const handleOffer = async (data: any) => {
      if (data.from === userId) return;

      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
      });

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendIceCandidate(channelId, event.candidate.toJSON());
        }
      };

      peerConnection.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current!);
        });
      }

      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      sendAnswer(channelId, answer);
      setPeers((prev) => new Map(prev).set(data.from, peerConnection));
    };

    const handleAnswer = async (data: any) => {
      const peer = peers.get(data.from);
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(data.answer));
      }
    };

    const handleIceCandidate = async (data: any) => {
      const peer = peers.get(data.from);
      if (peer) {
        try {
          await peer.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (error) {
          console.error('Failed to add ICE candidate:', error);
        }
      }
    };

    const unsubscribeOffer = onOffer(handleOffer);
    const unsubscribeAnswer = onAnswer(handleAnswer);
    const unsubscribeIce = onIceCandidate(handleIceCandidate);

    return () => {
      unsubscribeOffer();
      unsubscribeAnswer();
      unsubscribeIce();
    };
  }, [channelId, userId, peers]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <video ref={localVideoRef} autoPlay muted style={{ width: '100%', borderRadius: '8px' }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: '100%', borderRadius: '8px' }} />
    </div>
  );
}
