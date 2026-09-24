'use client';

import ImageEditor from '@unlayer/react-image-editor';
import Link from 'next/link';
import { type MouseEvent, useState } from 'react';
import { CaseAccessGuard } from './case-access-guard';

const MAP_EVIDENCE = '/evidence/case-003-map.svg';
const PIER_TARGET = { x: 0.497, y: 0.67 };

export function CaseThreeEvidence() {
  const [saved, setSaved] = useState(false);
  const [group, setGroup] = useState('');
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  function markPier(event: MouseEvent<HTMLImageElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    setMarker({
      x: (event.clientX - box.left) / box.width,
      y: (event.clientY - box.top) / box.height,
    });
  }
  const markerCorrect = marker
    ? Math.hypot(marker.x - PIER_TARGET.x, marker.y - PIER_TARGET.y) < 0.14
    : false;
  const score =
    Number(group === 'velvet-circle') * 55 + Number(markerCorrect) * 45;
  function submit() {
    if (!group || !marker) {
      setError('Name the organization and mark its meeting point first.');
      return;
    }
    window.localStorage.setItem(
      'vice-files:v1:case-003',
      JSON.stringify({ status: 'complete', score })
    );
    setError(null);
    setSubmitted(true);
  }
  return (
    <CaseAccessGuard requiredCase='case-002'>
      <main className='evidence-lab'>
        <header className='evidence-lab__header'>
          <Link href='/cases/003' className='evidence-lab__back'>
            Return to briefing
          </Link>
          <p>Case 003 / Network intercept</p>
          <h1>The Organization</h1>
          <p className='evidence-lab__description'>
            The routes are converging. Edit the map, then expose who is behind
            them.
          </p>
        </header>
        <section className='evidence-lab__editor'>
          {!editorReady ? (
            <div className='editor-loading'>
              <span>Decoding network intercept</span>
              <i />
            </div>
          ) : null}
          <ImageEditor
            image={MAP_EVIDENCE}
            minHeight='640px'
            options={{
              theme: 'dark',
              features: {
                imageEditor: {
                  tools: { resize: false, stickers: false, frame: false },
                },
              },
            }}
            onLoad={() => setEditorReady(true)}
            onSave={() => {
              setSaved(true);
              setError(null);
            }}
            onLoadError={() =>
              setError('The network intercept could not be loaded.')
            }
            onError={() =>
              setError('The Evidence Lab could not start. Try refreshing.')
            }
          />
        </section>
        {error ? <p className='evidence-lab__error'>{error}</p> : null}
        {saved && !submitted ? (
          <section className='analysis-checkpoint'>
            <div>
              <p className='analysis-checkpoint__eyebrow'>
                Map export recorded / Identify the network
              </p>
              <h2>Who owns the route?</h2>
              <p>
                The Ghost, the Sentinel, and the pier all point to one
                operation.
              </p>
            </div>
            <div className='analysis-grid'>
              <fieldset>
                <legend>Organization</legend>
                <div className='answer-options'>
                  <button
                    type='button'
                    className={
                      group === 'velvet-circle'
                        ? 'answer-option answer-option--selected'
                        : 'answer-option'
                    }
                    onClick={() => setGroup('velvet-circle')}
                  >
                    The Velvet Circle
                  </button>
                  <button
                    type='button'
                    className={
                      group === 'orchid-group'
                        ? 'answer-option answer-option--selected'
                        : 'answer-option'
                    }
                    onClick={() => setGroup('orchid-group')}
                  >
                    Orchid Group
                  </button>
                  <button
                    type='button'
                    className={
                      group === 'coastal-union'
                        ? 'answer-option answer-option--selected'
                        : 'answer-option'
                    }
                    onClick={() => setGroup('coastal-union')}
                  >
                    Coastal Union
                  </button>
                </div>
              </fieldset>
              <fieldset>
                <legend>Meeting signal</legend>
                <p className='analysis-copy'>
                  The cyan node marks the meeting point. Annotate it on the map
                  before filing the intercept.
                </p>
              </fieldset>
            </div>
            <div className='clue-marker'>
              <p>Mark Solstice Pier on the recovered intelligence map.</p>
              <div className='clue-marker__image clue-marker__image--map'>
                <img
                  src={MAP_EVIDENCE}
                  onClick={markPier}
                  alt='Intelligence map. Click the cyan Solstice Pier node.'
                />
                {marker ? (
                  <span
                    style={{
                      left: `${marker.x * 100}%`,
                      top: `${marker.y * 100}%`,
                    }}
                    aria-hidden='true'
                  />
                ) : null}
              </div>
            </div>
            <button
              className='evidence-lab__submit'
              type='button'
              onClick={submit}
            >
              File final intercept
            </button>
          </section>
        ) : null}
        {submitted ? (
          <section className='case-result'>
            <p>Case 003 / Resolved</p>
            <h2>
              {score >= 60
                ? 'You found the connection.'
                : 'The network remains obscured.'}
            </h2>
            <strong>{score}% investigation score</strong>
            <p>
              {markerCorrect
                ? 'The Velvet Circle is now linked to Solstice Pier and the Midnight Sentinel.'
                : 'The organization is exposed, but the meeting node needs a closer look.'}
            </p>
            <Link href='/finale'>View case resolution</Link>
          </section>
        ) : null}
      </main>
    </CaseAccessGuard>
  );
}
