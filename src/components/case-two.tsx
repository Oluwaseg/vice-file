"use client";

import ImageEditor from "@unlayer/react-image-editor";
import { type MouseEvent, useState } from "react";
import { CaseAccessGuard } from "./case-access-guard";

const PHONE_EVIDENCE = "/evidence/case-002-device.svg";
const PHONE_TARGET = { x: 0.5, y: 0.47 };

export function CaseTwoEvidence() {
  const [saved, setSaved] = useState(false);
  const [sender, setSender] = useState("");
  const [meetingPoint, setMeetingPoint] = useState("");
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  function markPhone(event: MouseEvent<HTMLImageElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    setMarker({ x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height });
  }

  const phoneMarked = marker ? Math.hypot(marker.x - PHONE_TARGET.x, marker.y - PHONE_TARGET.y) < 0.22 : false;
  const score = Number(sender === "ghost") * 40 + Number(meetingPoint === "solstice-pier") * 30 + Number(phoneMarked) * 30;

  function submit() {
    if (!sender || !meetingPoint || !marker) { setError("Confirm the sender, meeting point, and phone marker first."); return; }
    window.localStorage.setItem("vice-files:v1:case-002", JSON.stringify({ status: "complete", score }));
    setError(null); setSubmitted(true);
  }

  return <CaseAccessGuard requiredCase="case-001"><main className="evidence-lab"><header className="evidence-lab__header"><a href="/cases/002" className="evidence-lab__back">Return to briefing</a><p>Case 002 / Recovered device</p><h1>The Missing Driver</h1><p className="evidence-lab__description">The photo is incomplete. Enhance it, annotate it, then reconstruct the route.</p></header><section className="evidence-lab__editor">{!editorReady ? <div className="editor-loading"><span>Decrypting recovered device</span><i /></div> : null}<ImageEditor image={PHONE_EVIDENCE} minHeight="640px" options={{ theme: "dark", features: { imageEditor: { tools: { resize: false, stickers: false, frame: false } } } }} onLoad={() => setEditorReady(true)} onSave={() => { setSaved(true); setError(null); }} onLoadError={() => setError("The recovered-device image could not be loaded.")} onError={() => setError("The Evidence Lab could not start. Try refreshing.")} /></section>{error ? <p className="evidence-lab__error">{error}</p> : null}{saved && !submitted ? <section className="analysis-checkpoint"><div><p className="analysis-checkpoint__eyebrow">Device export recorded / Reconstruct the contact</p><h2>Who was driving?</h2><p>Connect the recovered device to the route from Case 001.</p></div><div className="analysis-grid"><fieldset><legend>Likely sender</legend><div className="answer-options"><button type="button" className={sender === "ghost" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setSender("ghost")}>The Ghost</button><button type="button" className={sender === "viper" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setSender("viper")}>Viper</button><button type="button" className={sender === "lucia" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setSender("lucia")}>Lucia</button></div></fieldset><fieldset><legend>Next meeting point</legend><div className="answer-options"><button type="button" className={meetingPoint === "solstice-pier" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setMeetingPoint("solstice-pier")}>Solstice Pier</button><button type="button" className={meetingPoint === "orchid-warehouse" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setMeetingPoint("orchid-warehouse")}>Orchid Warehouse</button><button type="button" className={meetingPoint === "downtown" ? "answer-option answer-option--selected" : "answer-option"} onClick={() => setMeetingPoint("downtown")}>Downtown</button></div></fieldset></div><div className="clue-marker"><p>Mark the recovered phone. Click the image to verify the physical evidence.</p><div className="clue-marker__image clue-marker__image--phone"><img src={PHONE_EVIDENCE} onClick={markPhone} alt="A person holding a phone in neon light. Click the phone." />{marker ? <span style={{ left: `${marker.x * 100}%`, top: `${marker.y * 100}%` }} aria-hidden="true" /> : null}</div></div><button className="evidence-lab__submit" type="button" onClick={submit}>Submit reconstruction</button></section> : null}{submitted ? <section className="case-result"><p>Case 002 / Filed</p><h2>{score >= 60 ? "The driver has a name." : "The route is still incomplete."}</h2><strong>{score}% investigation score</strong><p>{phoneMarked ? "The device links The Ghost to Solstice Pier." : "Your answers are recorded, but the device marker needs review."}</p><a href="/dashboard">Return to terminal</a></section> : null}</main></CaseAccessGuard>;
}
