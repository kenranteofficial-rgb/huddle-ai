export function MeetingControls() {
  return (
    <section className="panel meeting-controls">
      <h2>Live Controls</h2>
      <p>Manage the meeting flow, recordings, and sharing state.</p>

      <div className="control-buttons">
        <button type="button" className="control-button primary">
          Start Call
        </button>
        <button type="button" className="control-button">
          Share Screen
        </button>
        <button type="button" className="control-button">
          Record
        </button>
      </div>

      <div className="control-meter">
        <div />
      </div>
      <p>Engagement: 85%</p>
    </section>
  );
}
