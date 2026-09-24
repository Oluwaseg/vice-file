import Link from 'next/link';

export default function CaseThreePage() {
  return (
    <main className='case-briefing'>
      <Link href='/dashboard'>Vice Files / Final dossier</Link>
      <p>Case 003</p>
      <h1>The Organization</h1>
      <div className='case-briefing__grid'>
        <section>
          <span>04:08 AM / Signal intercept</span>
          <p>
            The recovered phone and the Midnight Sentinel both point to the same
            coastal network.
          </p>
          <p>
            One final map intercept can expose the meeting point and the people
            controlling the route.
          </p>
        </section>
        <aside>
          <span>Objectives</span>
          <ol>
            <li>Enhance and export the network map.</li>
            <li>Identify the organization.</li>
            <li>Mark the Solstice Pier meeting node.</li>
          </ol>
        </aside>
      </div>
      <Link className='case-briefing__cta' href='/evidence/003'>
        Open network intercept
      </Link>
    </main>
  );
}
