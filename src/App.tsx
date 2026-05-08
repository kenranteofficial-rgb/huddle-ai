import { useMemo, useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { Sidebar } from './components/Sidebar';
import { MeetingArea } from './components/MeetingArea';
import { MediaPanel } from './components/MediaPanel';
import { AIInsights } from './components/AIInsights';
import { MeetingControls } from './components/MeetingControls';
import { Channel, MediaItem, Message } from './types';

const channels: Channel[] = [
  { id: 'all-huddle', name: 'All Huddle', description: 'General team meeting', unread: 3 },
  { id: 'design-room', name: 'Design Room', description: 'Sketches and decks', unread: 0 },
  { id: 'product-sync', name: 'Product Sync', description: 'Roadmap discussion', unread: 2 },
];

const initialMessages: Message[] = [
  { id: '1', author: 'Lina', content: 'Welcome to the weekly huddle! Share your screen when ready.', timestamp: '09:02' },
  { id: '2', author: 'Alex', content: 'I just uploaded the new pitch deck.', timestamp: '09:03' },
  { id: '3', author: 'Mia', content: 'Can we also review the AI action items?', timestamp: '09:04' },
];

const mediaItems: MediaItem[] = [
  { id: 'deck', title: 'Product Deck', type: 'presentation', detail: '14 slides' },
  { id: 'recording', title: 'Meeting Recording', type: 'video', detail: '32 min' },
  { id: 'notes', title: 'Shared Notes', type: 'document', detail: 'AI summary ready' },
];

function App() {
  const [selectedChannel, setSelectedChannel] = useState(channels[0].id);
  const [messages, setMessages] = useState(initialMessages);
  const [activeMedia, setActiveMedia] = useState(mediaItems[0].id);

  const currentChannel = useMemo(() => channels.find((channel) => channel.id === selectedChannel) ?? channels[0], [selectedChannel]);

  const handleSendMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${prev.length + 1}`,
        author: 'You',
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="app-shell">
      <Sidebar channels={channels} selectedChannel={selectedChannel} onSelectChannel={setSelectedChannel} />

      <main className="workspace">
        <div className="workspace-top">
          <MeetingArea />
          <AIInsights messages={messages} />
        </div>

        <div className="workspace-bottom">
          <ChatPanel
            channelName={currentChannel.name}
            messages={messages}
            onSendMessage={handleSendMessage}
          />
          <div className="side-panels">
            <MediaPanel items={mediaItems} activeId={activeMedia} onSelect={setActiveMedia} />
            <MeetingControls />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
