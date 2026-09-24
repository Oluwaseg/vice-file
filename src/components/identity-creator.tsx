"use client";

import ImageEditor from "@unlayer/react-image-editor";
import { ChangeEvent, useState } from "react";
import { type Player, type PlayerRole, savePlayer } from "../lib/player";

type Step = "details" | "editor" | "card";

const roles: { value: PlayerRole; label: string; description: string }[] = [
  { value: "street-racer", label: "Street racer", description: "Fast routes. No witnesses." },
  { value: "nightclub-owner", label: "Nightclub owner", description: "The city talks after midnight." },
  { value: "fixer", label: "Fixer", description: "Every problem has a price." },
];

export function IdentityCreator() {
  const [step, setStep] = useState<Step>("details");
  const [alias, setAlias] = useState("");
  const [role, setRole] = useState<PlayerRole>("street-racer");
  const [neighbourhood, setNeighbourhood] = useState("Vice Beach");
  const [portrait, setPortrait] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);

  function loadPortrait(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file for your cover portrait.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Use an image smaller than 4 MB for this local prototype.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPortrait(String(reader.result));
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  function beginEditing() {
    if (!alias.trim() || !portrait) {
      setError("Add an alias and choose a portrait to continue.");
      return;
    }
    setError(null);
    setStep("editor");
  }

  function completeIdentity(portraitDataUrl: string) {
    const nextPlayer: Player = {
      alias: alias.trim().toUpperCase(),
      role,
      neighbourhood,
      portraitDataUrl,
      createdAt: new Date().toISOString(),
    };
    savePlayer(nextPlayer);
    setPlayer(nextPlayer);
    setPortrait(portraitDataUrl);
    setStep("card");
  }

  if (step === "editor" && portrait) {
    return (
      <main className="identity-screen">
        <header className="identity-screen__header">
          <button type="button" onClick={() => setStep("details")}>Back to cover details</button>
          <p>Identity Lab / Portrait processing</p>
          <h1>Build your cover.</h1>
        </header>
        <section className="identity-editor">
          <ImageEditor
            image={portrait}
            minHeight="640px"
            options={{ theme: "dark", features: { imageEditor: { tools: { resize: false } } } }}
            onSave={({ dataUrl }) => completeIdentity(dataUrl)}
            onCancel={() => setStep("details")}
            onLoadError={() => setError("Your portrait could not be opened. Choose another image.")}
            onError={() => setError("The portrait editor could not start. Refresh and try again.")}
          />
        </section>
        {error ? <p className="identity-error">{error}</p> : null}
      </main>
    );
  }

  if (step === "card" && player) {
    return (
      <main className="identity-card-reveal">
        <p>Identity established / Clearance provisional</p>
        <article className="identity-card">
          <div className="identity-card__portrait"><img src={player.portraitDataUrl} alt={`Portrait of ${player.alias}`} /></div>
          <div>
            <span>Vice Files / Confidential</span>
            <h1>{player.alias}</h1>
            <dl>
              <div><dt>Cover</dt><dd>{roles.find((item) => item.value === player.role)?.label}</dd></div>
              <div><dt>Base</dt><dd>{player.neighbourhood}</dd></div>
              <div><dt>Status</dt><dd>Active</dd></div>
            </dl>
          </div>
        </article>
        <a className="identity-primary-action" href="/dashboard">Enter Vice City</a>
        <button className="identity-subtle-action" type="button" onClick={() => setStep("details")}>Edit identity</button>
      </main>
    );
  }

  return (
    <main className="identity-screen">
      <header className="identity-screen__header">
        <a href="/">Vice Files</a>
        <p>Identity Lab / Step 01</p>
        <h1>Your old identity is dead.</h1>
        <p>Create a believable cover before entering Vice City.</p>
      </header>
      <section className="identity-form" aria-label="Create a cover identity">
        <label>Alias<input value={alias} maxLength={20} onChange={(event) => setAlias(event.target.value)} placeholder="e.g. Ghost" /></label>
        <label>Operating area<select value={neighbourhood} onChange={(event) => setNeighbourhood(event.target.value)}><option>Vice Beach</option><option>Downtown</option><option>Little Havana</option></select></label>
        <fieldset><legend>Select your cover</legend><div className="role-grid">{roles.map((item) => <button className={role === item.value ? "role-option role-option--selected" : "role-option"} type="button" key={item.value} onClick={() => setRole(item.value)}><strong>{item.label}</strong><span>{item.description}</span></button>)}</div></fieldset>
        <label className="portrait-upload">Portrait<input type="file" accept="image/png,image/jpeg,image/webp" onChange={loadPortrait} /><span>{portrait ? "Portrait received. Ready for editing." : "Choose a PNG, JPEG, or WebP (up to 4 MB)."}</span></label>
        {portrait ? <img className="portrait-preview" src={portrait} alt="Selected cover portrait preview" /> : null}
        {error ? <p className="identity-error">{error}</p> : null}
        <button className="identity-primary-action" type="button" onClick={beginEditing}>Edit portrait and create cover</button>
      </section>
    </main>
  );
}
