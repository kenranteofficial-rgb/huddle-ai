import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'huddle.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      channelId TEXT NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS channels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      createdAt INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channelId);
  `);
}

export function createMessage(channelId, author, content) {
  const id = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const timestamp = Date.now();

  const stmt = db.prepare(
    'INSERT INTO messages (id, channelId, author, content, timestamp) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(id, channelId, author, content, timestamp);

  return { id, channelId, author, content, timestamp };
}

export function getMessages(channelId, limit = 100) {
  const stmt = db.prepare(
    'SELECT id, author, content, timestamp FROM messages WHERE channelId = ? ORDER BY timestamp DESC LIMIT ?'
  );
  return stmt.all(channelId, limit).reverse();
}

export function getAllChannels() {
  const stmt = db.prepare('SELECT id, name, description FROM channels ORDER BY createdAt');
  return stmt.all();
}

export function createChannel(id, name, description) {
  const createdAt = Date.now();
  const stmt = db.prepare('INSERT OR IGNORE INTO channels (id, name, description, createdAt) VALUES (?, ?, ?, ?)');
  stmt.run(id, name, description, createdAt);
}

export default db;
