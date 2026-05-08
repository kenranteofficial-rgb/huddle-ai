import { useState } from 'react';
import { Message } from '../types';

interface ChatPanelProps {
  channelName: string;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatPanel({ channelName, messages, onSendMessage }: ChatPanelProps) {
  const [draft, setDraft] = useState('');

  return (
    <section className="panel chat-panel">
      <div className="section-header">
        <h2>{channelName}</h2>
        <span>Instant messaging with rich thread context</span>
      </div>

      <div className="chat-history">
        {messages.map((message) => (
          <article key={message.id} className="chat-message">
            <strong>{message.author}</strong>
            <p>{message.content}</p>
            <span>{message.timestamp}</span>
          </article>
        ))}
      </div>

      <div className="message-input">
        <input
          placeholder="Type a message or share a link..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            if (draft.trim()) {
              onSendMessage(draft.trim());
              setDraft('');
            }
          }}
        >
          Send
        </button>
      </div>
    </section>
  );
}
