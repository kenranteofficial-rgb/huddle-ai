import { MediaItem } from '../types';

interface MediaPanelProps {
  items: MediaItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function MediaPanel({ items, activeId, onSelect }: MediaPanelProps) {
  return (
    <section className="panel media-panel">
      <h2>Media & Shareables</h2>
      <p>Files, recordings, and shared content available in the room.</p>
      <ul className="media-list">
        {items.map((item) => (
          <li
            key={item.id}
            className={`media-card ${item.id === activeId ? 'active' : ''}`}
            onClick={() => onSelect(item.id)}
          >
            <div>
              <strong>{item.title}</strong>
              <span>{item.type}</span>
            </div>
            <span>{item.detail}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
