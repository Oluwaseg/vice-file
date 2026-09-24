import Link from 'next/link';

export default function CaseTwoPage() {
  return (
    <main className='case-briefing'>
      <Link href='/dashboard'>Vice Files / Active dossier</Link>
      <p>Case 002</p>
      <h1>The Missing Driver</h1>
      <div className='case-briefing__grid'>
        <section>
          <span>03:12 AM / Solstice Pier</span>
          <p>
            The same signal that passed through Vice Beach appears again beside
            a recovered phone.
          </p>
          <p>
            Trace the sender, identify the meeting point, and find out who drove
            the Midnight Sentinel.
          </p>
        </section>
        <aside>
          <span>Objectives</span>
          <ol>
            <li>Enhance and export the recovered-device image.</li>
            <li>Identify the sender.</li>
            <li>Verify the phone and its next destination.</li>
          </ol>
        </aside>
      </div>
      <Link className='case-briefing__cta' href='/evidence/002'>
        Open recovered device
      </Link>
    </main>
  );
}
