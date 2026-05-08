async function postAI(endpoint: string, payload: Record<string, any>) {
  const response = await fetch(`/api/ai/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'AI backend request failed');
  }

  return response.json();
}

export async function fetchMeetingSummary(transcript: string) {
  const data = await postAI('summarize', { transcript });
  return data.summary as string;
}

export async function fetchMeetingSubtitles(transcript: string) {
  const data = await postAI('subtitles', { transcript });
  return data.subtitles as string;
}

export async function fetchMeetingNotes(transcript: string) {
  const data = await postAI('notes', { transcript });
  return data.notes as string;
}
