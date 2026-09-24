'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CaseBoard() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    try {
      const record = JSON.parse(
        window.localStorage.getItem('vice-files:v1:case-001') ?? 'null'
      ) as { status?: string } | null;
      setUnlocked(record?.status === 'complete');
    } catch {
      setUnlocked(false);
    }
  }, []);
  return (
    <main className='case-board'>
      <header className='case-board__header'>
        <Link href='/dashboard'>Return to terminal</Link>
        <p>Case 001 / Connection map</p>
        <h1>The Night Run</h1>
      </header>
      {unlocked ? (
        <section
          className='case-board__canvas'
          aria-label='Case 001 evidence connection board'
        >
          <svg
            className='case-board__lines'
            viewBox='0 0 1000 580'
            aria-hidden='true'
          >
            <path d='M498 285C390 280 348 160 230 140M500 285C615 300 675 165 804 145M500 285C432 370 375 430 230 455M500 285C600 362 690 420 805 455' />
          </svg>
          <article className='board-node board-node--case'>
            <span>Case file</span>
            <h2>001</h2>
            <p>Traffic Camera 04</p>
          </article>
          <article className='board-node board-node--vehicle'>
            <span>Vehicle</span>
            <h2>Midnight Sentinel</h2>
            <p>Front grille verified</p>
          </article>
          <article className='board-node board-node--location'>
            <span>Location</span>
            <h2>Vice Beach</h2>
            <p>Coastal route</p>
          </article>
          <article className='board-node board-node--person'>
            <span>Signal owner</span>
            <h2>The Ghost</h2>
            <p>Identity unconfirmed</p>
          </article>
          <article className='board-node board-node--evidence'>
            <span>Evidence</span>
            <h2>Grille match</h2>
            <p>Recovered visual connection</p>
          </article>
          <div className='case-board__legend'>
            <span>
              <i className='case-board__pink' />
              Confirmed
            </span>
            <span>
              <i className='case-board__cyan' />
              Under surveillance
            </span>
            <span>
              <i className='case-board__amber' />
              Unverified
            </span>
          </div>
        </section>
      ) : (
        <section className='case-board__locked'>
          <p>Connection map encrypted.</p>
          <h2>Close Case 001 to expose the board.</h2>
          <Link href='/cases/001'>Open case file</Link>
        </section>
      )}
    </main>
  );
}
