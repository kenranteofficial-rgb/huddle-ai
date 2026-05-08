import { Channel } from '../types';

interface SidebarProps {
  channels: Channel[];
  selectedChannel: string;
  onSelectChannel: (id: string) => void;
}

export function Sidebar({ channels, selectedChannel, onSelectChannel }: SidebarProps) {
  return (
    <aside className="sidebar panel">
      <div className="brand">
        <div className="brand-logo" />
        <div className="brand-title">
          <span>Huddle AI</span>
          <span>Meetings, media, messaging</span>
        </div>
      </div>

      <section>
        <h2>Group Channels</h2>
        <ul className="channel-list">
          {channels.map((channel) => (
            <li
              key={channel.id}
              className={`channel-card ${channel.id === selectedChannel ? 'active' : ''}`}
              onClick={() => onSelectChannel(channel.id)}
            >
              <strong>{channel.name}</strong>
              <span>{channel.description}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Shared Files</h2>
        <ul className="file-list">
          <li className="file-card">
            <strong>Presentation.pdf</strong>
            <span>Updated 3 min ago</span>
          </li>
          <li className="file-card">
            <strong>Weeknotes.docx</strong>
            <span>Shared with design team</span>
          </li>
          <li className="file-card">
            <strong>Launch video.mp4</strong>
            <span>Ready to preview</span>
          </li>
        </ul>
      </section>
    </aside>
  );
}
