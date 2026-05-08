import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(window.location.origin, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  return socket;
}

export function joinChannel(channelId: string) {
  const sock = getSocket();
  sock.emit('join-channel', channelId);
}

export function sendMessage(channelId: string, author: string, content: string) {
  const sock = getSocket();
  sock.emit('send-message', channelId, author, content);
}

export function onNewMessage(callback: (message: any) => void) {
  const sock = getSocket();
  sock.on('new-message', callback);
  return () => sock.off('new-message', callback);
}

export function sendOffer(channelId: string, offer: RTCSessionDescriptionInit) {
  const sock = getSocket();
  sock.emit('offer', { channelId, offer });
}

export function onOffer(callback: (data: any) => void) {
  const sock = getSocket();
  sock.on('offer', callback);
  return () => sock.off('offer', callback);
}

export function sendAnswer(channelId: string, answer: RTCSessionDescriptionInit) {
  const sock = getSocket();
  sock.emit('answer', { channelId, answer });
}

export function onAnswer(callback: (data: any) => void) {
  const sock = getSocket();
  sock.on('answer', callback);
  return () => sock.off('answer', callback);
}

export function sendIceCandidate(channelId: string, candidate: RTCIceCandidateInit) {
  const sock = getSocket();
  sock.emit('ice-candidate', { channelId, candidate });
}

export function onIceCandidate(callback: (data: any) => void) {
  const sock = getSocket();
  sock.on('ice-candidate', callback);
  return () => sock.off('ice-candidate', callback);
}
