export default function CaseOnePage() {
  return (
    <main className="case-briefing">
      <a href="/identity">Vice Files / Active dossier</a>
      <p>Case 001</p>
      <h1>The Night Run</h1>
      <div className="case-briefing__grid">
        <section><span>02:17 AM / Vice Beach</span><p>A traffic camera catches a dark coupe leaving the coastal district moments after an unregistered signal appears on the grid.</p><p>Someone left a route behind. Identify the vehicle before the city wakes up.</p></section>
        <aside><span>Objectives</span><ol><li>Inspect the traffic-camera evidence.</li><li>Identify the vehicle and its location.</li><li>Mark the vehicle in the image.</li></ol></aside>
      </div>
      <a className="case-briefing__cta" href="/editor">Open Evidence 04</a>
    </main>
  );
}
