export function MeetingArea() {
  return (
    <section className="meeting-area panel">
      <div className="video-grid">
        <article className="video-card">
          <header>
            <div>
              <h3>Live Speaker</h3>
              <p>Emma is presenting now</p>
            </div>
            <span>Live</span>
          </header>
          <div className="video-preview">Live video feed and shared presentation preview.</div>
        </article>

        <article className="video-card">
          <header>
            <div>
              <h3>Active Presentation</h3>
              <p>Marketing roadmap & product demo</p>
            </div>
            <span>Screen</span>
          </header>
          <div className="video-preview">Slides, screen share, and speaker notes rendered here.</div>
        </article>
      </div>

      <article className="video-card">
        <header>
          <div>
            <h3>Meeting Summary</h3>
            <p>AI-generated recap, actions, and follow-up items.</p>
          </div>
          <span>Auto</span>
        </header>
        <div className="video-preview">Instant notes, recording status, and subtitle preview.</div>
      </article>
    </section>
  );
}
