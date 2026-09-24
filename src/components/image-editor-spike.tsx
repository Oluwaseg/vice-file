"use client";

import ImageEditor from "@unlayer/react-image-editor";
import { type MouseEvent, useState } from "react";

const CASE_EVIDENCE = "/evidence/case-001-traffic-camera.svg";
const VEHICLE_TARGET = { x: 0.5, y: 0.65 };

export function ImageEditorSpike() {
  const [savedImage, setSavedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vehicle, setVehicle] = useState("");
  const [location, setLocation] = useState("");
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [editorReady, setEditorReady] = useState(false);

  function markClue(event: MouseEvent<HTMLImageElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setMarker({
      x: (event.clientX - bounds.left) / bounds.width,
      y: (event.clientY - bounds.top) / bounds.height,
    });
  }

  const markerCorrect = marker
    ? Math.hypot(marker.x - VEHICLE_TARGET.x, marker.y - VEHICLE_TARGET.y) < 0.32
    : false;
  const score = Number(vehicle === "midnight-sentinel") * 35 + Number(location === "vice-beach") * 30 + Number(markerCorrect) * 35;

  function submitFindings() {
    if (!vehicle || !location || !marker) {
      setError("Complete both identifications and place a marker before submitting.");
      return;
    }
    window.localStorage.setItem("vice-files:v1:case-001", JSON.stringify({ status: "complete", score }));
    setError(null);
    setSubmitted(true);
  }

  return (
    <main className="evidence-lab">
      <header className="evidence-lab__header">
        <a href="/cases/001" className="evidence-lab__back">Return to briefing</a>
        <p>Case 001 / Evidence 04</p>
        <h1>The Night Run</h1>
        <p className="evidence-lab__description">Use the editor to inspect the scene, then save your annotated evidence.</p>
      </header>
      <section className="evidence-lab__editor" aria-label="Evidence editor">
        {!editorReady ? <div className="editor-loading"><span>Loading Evidence Lab</span><i /></div> : null}
        <ImageEditor
          image={CASE_EVIDENCE}
          minHeight="640px"
          options={{ theme: "dark", features: { imageEditor: { tools: { resize: false, stickers: false, frame: false } } } }}
          onSave={({ dataUrl }) => { setSavedImage(dataUrl); setError(null); }}
          onLoad={() => setEditorReady(true)}
          onLoadError={() => setError("Evidence could not be loaded. Try refreshing the page.")}
          onError={() => setError("The image editor could not start. Check your connection and retry.")}
        />
      </section>
      {error ? <p className="evidence-lab__error">{error}</p> : null}
      {savedImage && !submitted ? (
        <section className="analysis-checkpoint">
          <div>
            <p className="analysis-checkpoint__eyebrow">Evidence received / Confirm your findings</p>
            <h2>What did you find?</h2>
            <p>Your export has been recorded. Now connect the details from the scene.</p>
          </div>
          <div className="analysis-grid">
            <fieldset><legend>Vehicle spotted</legend><div className="answer-options"><button type="button" className={vehicle === "midnight-sentinel" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setVehicle("midnight-sentinel")}>Midnight Sentinel</button><button type="button" className={vehicle === "red-comet" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setVehicle("red-comet")}>Red Comet</button><button type="button" className={vehicle === "white-phoenix" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setVehicle("white-phoenix")}>White Phoenix</button></div></fieldset>
            <fieldset><legend>Likely location</legend><div className="answer-options"><button type="button" className={location === "downtown" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setLocation("downtown")}>Downtown</button><button type="button" className={location === "vice-beach" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setLocation("vice-beach")}>Vice Beach</button><button type="button" className={location === "little-havana" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setLocation("little-havana")}>Little Havana</button></div></fieldset>
          </div>
          <div className="clue-marker"><p>Mark the Midnight Sentinel&apos;s front grille in the evidence. Click the image to place your verification marker.</p><div className="clue-marker__image"><img src={CASE_EVIDENCE} onClick={markClue} alt="Traffic-camera evidence showing the Midnight Sentinel vehicle profile and Vice Beach district route. Click the vehicle grille." />{marker ? <span style={{ left: `${marker.x * 100}%`, top: `${marker.y * 100}%` }} aria-hidden="true" /> : null}</div></div>
          <button className="evidence-lab__submit" type="button" onClick={submitFindings}>Submit findings</button>
        </section>
      ) : null}
      {submitted ? (
        <section className="case-result">
          <p>Case 001 / Filed</p><h2>{score >= 60 ? "The lead is real." : "The file remains incomplete."}</h2><strong>{score}% investigation score</strong>
          <p>{markerCorrect ? "The vehicle is now linked to the night route." : "Review the scene again: the vehicle marker missed, but your answers have been recorded."}</p>
          <a href="/dashboard">Return to terminal</a>
        </section>
      ) : null}
    </main>
  );
}
