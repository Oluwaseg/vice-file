'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type Player, readPlayer } from '../lib/player';

type CaseStatus = { status: 'complete'; score: number } | null;

function readCase(id: string): CaseStatus {
  try {
    return JSON.parse(
      window.localStorage.getItem(`vice-files:v1:${id}`) ?? 'null'
    ) as CaseStatus;
  } catch {
    return null;
  }
}

export function Dashboard() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [caseOne, setCaseOne] = useState<CaseStatus>(null);
  const [caseTwo, setCaseTwo] = useState<CaseStatus>(null);
  const [caseThree, setCaseThree] = useState<CaseStatus>(null);

  useEffect(() => {
    setPlayer(readPlayer());
    setCaseOne(readCase('case-001'));
    setCaseTwo(readCase('case-002'));
    setCaseThree(readCase('case-003'));
  }, []);

  const caseOneDone = caseOne?.status === 'complete';
  const caseTwoDone = caseTwo?.status === 'complete';
  const caseThreeDone = caseThree?.status === 'complete';
  const alias = player?.alias ?? 'OPERATIVE';

  function resetProgress() {
    if (
      !window.confirm(
        'Reset your cover identity and all case progress on this device?'
      )
    )
      return;
    window.localStorage.removeItem('vice-files:v1:player');
    window.localStorage.removeItem('vice-files:v1:case-001');
    window.localStorage.removeItem('vice-files:v1:case-002');
    window.localStorage.removeItem('vice-files:v1:case-003');
    setPlayer(null);
    setCaseOne(null);
    setCaseTwo(null);
    setCaseThree(null);
  }

  const nextCase = caseThreeDone
    ? {
        title: 'All files resolved',
        detail: '3 / 3 cases complete',
        href: '/finale',
        action: 'View resolution',
      }
    : caseTwoDone
      ? {
          title: 'Case 003: The Organization',
          detail: 'Network intercept / Solstice Pier',
          href: '/cases/003',
          action: 'Open Case 003',
        }
      : {
          title: 'Case 002: The Missing Driver',
          detail: 'Recovered device / Solstice Pier',
          href: '/cases/002',
          action: 'Open Case 002',
        };

  return (
    <main className='dashboard'>
      <header className='dashboard__header'>
        <Link href='/'>Vice Files</Link>
        <p>City Intelligence Archive / Live</p>
        <div>
          <span>02:41 AM</span>
          <span>Vice City</span>
        </div>
      </header>
      <section className='dashboard__hero'>
        <div>
          <p>Good evening, {alias}.</p>
          <h1>Your city is talking.</h1>
        </div>
        {player ? (
          <Image
            src={player.portraitDataUrl}
            alt={`${alias}'s cover portrait`}
            width={96}
            height={96}
            className='dashboard__hero-img'
            unoptimized
          />
        ) : null}
      </section>
      <section className='dashboard__main-grid'>
        <article className='active-case'>
          <p>Case 001</p>
          <span>001</span>
          <h2>The Night Run</h2>
          <div className='case-progress'>
            <i style={{ width: caseOneDone ? '100%' : '35%' }} />
          </div>
          <strong>
            {caseOneDone ? 'Case closed' : 'Evidence awaiting review'}
          </strong>
          <Link href={caseOneDone ? '/board/001' : '/cases/001'}>
            {caseOneDone ? 'Open connection board' : 'Continue case'}
          </Link>
        </article>
        <article className='case-status'>
          <p>Case progress</p>
          <strong>
            {caseThreeDone
              ? '3 / 3'
              : caseTwoDone
                ? '2 / 3'
                : caseOneDone
                  ? '1 / 3'
                  : '0 / 3'}
          </strong>
          <span>Files resolved</span>
          <p>
            {caseThreeDone
              ? 'The final network has been exposed.'
              : caseOneDone
                ? 'A new dossier is waiting.'
                : 'Your first dossier is waiting.'}
          </p>
          <button type='button' onClick={resetProgress}>
            Reset local progress
          </button>
        </article>
      </section>
      {caseOneDone ? (
        <section className='next-case'>
          <div>
            <p>
              {caseThreeDone
                ? 'Investigation complete'
                : 'New dossier unlocked'}
            </p>
            <h2>{nextCase.title}</h2>
            <span>{nextCase.detail}</span>
          </div>
          <Link href={nextCase.href}>{nextCase.action}</Link>
        </section>
      ) : null}
      <section className='dashboard__records'>
        <div>
          <p>Recently unlocked</p>
          <h2>
            {caseOneDone ? 'New connections found' : 'No verified connections'}
          </h2>
        </div>
        <div className='record-strip'>
          {caseOneDone ? (
            <>
              <Link href='/database#midnight-sentinel'>
                <span>Vehicle</span>
                <strong>Midnight Sentinel</strong>
              </Link>
              <Link href='/database#vice-beach'>
                <span>Location</span>
                <strong>Vice Beach</strong>
              </Link>
              <Link href='/database#ghost'>
                <span>Person of interest</span>
                <strong>The Ghost</strong>
              </Link>
            </>
          ) : (
            <p>
              Close Case 001 to expose the people, places, and vehicles in this
              file.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
