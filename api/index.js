import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { OpenAI } from 'openai';
import { initDb, createMessage, getMessages, getAllChannels, createChannel } from './db.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const port = process.env.PORT || 4000;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('Missing OPENAI_API_KEY in environment');
  process.exit(1);
}

const openai = new OpenAI({ apiKey });

initDb();

// Initialize default channels
createChannel('all-huddle', 'All Huddle', 'General team meeting');
createChannel('design-room', 'Design Room', 'Sketches and decks');
createChannel('product-sync', 'Product Sync', 'Roadmap discussion');

app.use(cors());
app.use(express.json());

// REST API endpoints
app.get('/api/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const messages = getMessages(channelId, 100);
  res.json({ messages });
});

app.get('/api/channels', (req, res) => {
  const channels = getAllChannels();
  res.json({ channels });
});

app.post('/api/ai/summarize', async (req, res) => {
  try {
    const { transcript } = req.body;
    const message = `Create a succinct meeting summary from the following transcript:\n\n${transcript}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [{ role: 'user', content: message }],
      max_tokens: 300,
    });

    const summary = response.choices[0]?.message?.content || 'No summary generated';
    res.json({ summary });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.post('/api/ai/subtitles', async (req, res) => {
  try {
    const { transcript } = req.body;
    const message = `Generate subtitle-style lines for the following meeting transcript:\n\n${transcript}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [{ role: 'user', content: message }],
      max_tokens: 200,
    });

    const subtitles = response.choices[0]?.message?.content || 'No subtitles generated';
    res.json({ subtitles });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.post('/api/ai/notes', async (req, res) => {
  try {
    const { transcript } = req.body;
    const message = `Extract key action items, speaker highlights, and decisions from the meeting transcript:\n\n${transcript}`;
    const response = await openai.chat.completions.create({
      model: 'gpt-4-mini',
      messages: [{ role: 'user', content: message }],
      max_tokens: 300,
    });

    const notes = response.choices[0]?.message?.content || 'No notes generated';
    res.json({ notes });
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

// WebSocket events for messaging and WebRTC
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join-channel', (channelId) => {
    socket.join(`channel:${channelId}`);
    console.log(`${socket.id} joined channel ${channelId}`);
  });

  socket.on('send-message', (channelId, author, content) => {
    const message = createMessage(channelId, author, content);
    io.to(`channel:${channelId}`).emit('new-message', message);
  });

  socket.on('offer', (data) => {
    io.to(`channel:${data.channelId}`).emit('offer', { ...data, from: socket.id });
  });

  socket.on('answer', (data) => {
    io.to(`channel:${data.channelId}`).emit('answer', { ...data, from: socket.id });
  });

  socket.on('ice-candidate', (data) => {
    io.to(`channel:${data.channelId}`).emit('ice-candidate', { ...data, from: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Serve frontend
app.use(express.static('dist'));
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

httpServer.listen(port, () => {
  console.log(`Huddle AI running on http://localhost:${port}`);
});
