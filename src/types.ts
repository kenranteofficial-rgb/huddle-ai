export interface Channel {
  id: string;
  name: string;
  description: string;
  unread: number;
}

export interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'presentation' | 'video' | 'document';
  detail: string;
}
