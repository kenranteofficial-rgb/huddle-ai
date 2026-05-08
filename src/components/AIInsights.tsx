import { useEffect, useState } from 'react';
import { fetchMeetingNotes, fetchMeetingSubtitles, fetchMeetingSummary } from '../lib/ai';

interface AIInsightsProps {
  messages: { id: string; author: string; content: string; timestamp: string }[];
}

export function AIInsights({ messages }: AIInsightsProps) {
  const [summary, setSummary] = useState('Loading AI meeting summary...');
  const [subtitles, setSubtitles] = useState('Loading AI subtitles...');
  const [notes, setNotes] = useState('Loading AI notes...');

  useEffect(() => {
    const transcript = messages.map((message) => `${message.author}: ${message.content}`).join('\n');

    fetchMeetingSummary(transcript).then(setSummary).catch(() => setSummary('AI summary unavailable.'));
    fetchMeetingSubtitles(transcript).then(setSubtitles).catch(() => setSubtitles('AI subtitles unavailable.'));
    fetchMeetingNotes(transcript).then(setNotes).catch(() => setNotes('AI notes unavailable.'));
  }, [messages]);

  return (
    <section className="panel ai-panel">
      <div className="section-header">
        <h2>AI Meeting Insights</h2>
        <span>Notes, subtitles, and recording highlights updated live.</span>
      </div>

      <div className="badge">AI assisted</div>
      <ul className="bullet-list">
        <li className="ai-note">
          <div>
            <strong>Meeting summary</strong>
            <span>{summary}</span>
          </div>
        </li>
        <li className="ai-note">
          <div>
            <strong>Live subtitles</strong>
            <span>{subtitles}</span>
          </div>
        </li>
        <li className="ai-note">
          <div>
            <strong>Action notes</strong>
            <span>{notes}</span>
          </div>
        </li>
      </ul>
    </section>
  );
}
