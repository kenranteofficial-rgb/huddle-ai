# Huddle AI

A production-ready static prototype for meetings, video sharing, group channels, file/media sharing, instant messaging, and AI-powered meeting notes.

## What’s included

- React + Vite frontend
- Group channel sidebar
- Live meeting / shared presentation layout
- Chat panel with instant messaging
- Media and shareables panel
- AI insights panel for notes, subtitles, and recording summaries
- Meeting control buttons for calling, screen share, and recording

## Build & deploy

Install dependencies:

```bash
npm install
```

Create a production build:

```bash
npm run build
```

Preview production locally:

```bash
npm run preview
```

Deploy the contents of `dist/` to any static host, such as Netlify, Vercel, GitHub Pages, or Firebase Hosting.

## Backend and AI integration

1. Add your OpenAI key to `.env`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

2. Start the backend server:

```bash
npm run server
```

3. Start the frontend in development mode:

```bash
npm run dev
```

The frontend proxies `/api` requests to the backend server and uses OpenAI to generate summaries, subtitles, and notes from chat transcripts.

## Deploy full stack

1. Build the frontend:

```bash
npm run build
```

2. Start the backend in production:

```bash
npm run start
```

The backend will serve the `dist/` build and expose the AI endpoints.

## Deploy to Netlify

1. Connect the repo to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`

## Notes

This prototype is ready to host as a static SPA. AI behavior is currently simulated in `src/lib/ai.ts`; connect it to a real AI API for live meeting notes and subtitles.
