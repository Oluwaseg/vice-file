# VICE FILES — Build Guide

## 1. Product decision

Build **VICE FILES**, a fictional neon-crime investigation experience:

> Create a cover identity. Examine visual evidence. Connect the clues.

This is a polished vertical slice, not a large game. The image editor is a core mechanic in identity creation and evidence analysis—not a widget placed on a page.

### Success criteria

- A user can complete a compelling first session in 3–5 minutes.
- The editor is used at least twice: identity portrait and case evidence.
- One case has a clear beginning, investigation, submission, score, and payoff.
- Progress persists locally between refreshes.
- The interface feels like a fictional intelligence terminal, not a generic dashboard.
- All artwork, names, logos, story, and audio are original or properly licensed. Use Miami/neon/noir inspiration; do not use GTA/Rockstar characters, logos, screenshots, music, or branding.

## 2. MVP boundary

### Ship in version 1

1. Landing page / short opening sequence
2. Identity creation: alias, role, neighbourhood, portrait upload
3. Portrait editor and generated identity card
4. One complete case: **Case 001 — The Night Run**
5. Evidence Lab: inspect, annotate, and submit one image
6. Multiple-choice deductions plus annotation validation
7. Case result, score, and unlocked records
8. Simple case board and intelligence database
9. Local persistence, responsive layout, and clear empty/loading/error states

### Deliberately defer

- Authentication, a database, uploads to cloud storage
- AI-generated narratives or evaluation
- Multiplayer, real-time functionality, maps, and sound effects
- Multiple full cases
- Social sharing, payments, and complex achievements

**Definition of done:** a fresh user can create an identity, finish Case 001, see its linked suspect/vehicle/location records, refresh the page, and still see their progress.

## 3. Primary user flow

Landing → create identity → identity card reveal → dashboard → Case 001 briefing → evidence lab → answer deductions → scoring and resolution → case board + unlocked intelligence records

Keep the main call-to-action obvious at every step. The first minute should show: upload, edit, identity reveal, and active investigation.

## 4. Case 001: The Night Run

**Premise:** At 02:17, a car leaves a warehouse near Vice Beach. The player must identify the vehicle, location, and suspicious item.

### Required case data

- Case title, briefing, objectives, and completion status
- One original evidence image with three intentional clues
- Correct answers for the vehicle, location, and clue region
- Records that unlock on completion
- A target annotation area for the evidence task

### Evaluation approach

Use a simple, deterministic scoring model: the user’s mark is compared with the intended clue area, then combined with the selected answers and a forgiving pass threshold. This keeps the result fair and clear while making the image editing part of the gameplay.

## 5. Product architecture

Keep the experience frontend-only for the first slice. The app should feel like a responsive intelligence terminal, with persistent player progress and a clear progression loop from identity creation to case resolution.

The key product priorities are:

- A clear landing and identity creation flow
- A single polished investigation loop
- Strong local persistence
- Distinct case, board, and database screens
- A fictional noir tone with readable, high-contrast interface design

## 6. Routes and screen responsibilities

- Landing page: atmospheric entry and resume flow
- Identity screen: player detail and portrait workflow
- Dashboard: active case, progress, and recent evidence
- Case briefing pages: story setup, objectives, and upcoming tasks
- Evidence lab: image editing, annotation, and deduction input
- Resolution screen: score, outcome, and unlocked records
- Case board: linked clue and evidence view
- Intelligence database: discovered record list and details
- Profile area: identity card and reset progress

Keep the structure lean and focused on the first playable loop. Avoid adding route complexity before the core case flow is polished.

## 7. Design system

Visual direction: modern intelligence terminal + neon coastal noir.

- Base palette: near-black and navy with slightly lighter panels
- Accent palette: hot coral/pink, electric cyan, and muted amber
- Typography: condensed display for case labels and clean sans-serif for readable interface text
- Texture: restrained grain, scanlines, map-grid notes, and timestamp metadata
- Motion: short subtle transitions and reduced-motion friendliness
- Mobile: stacked workflow, touch-safe controls, and no desktop-only assumptions

Build reusable dossier panels, evidence cards, section labels, status chips, and primary/secondary actions so the interface feels consistent across the experience.

## 8. Implementation order

### Milestone A — Foundation

- Establish the global theme and application shell
- Define the core product structure and persistence approach
- Create the introductory identity flow and navigation shell

**Checkpoint:** the app runs, routes work, and a seeded player/case can render from local data.

### Milestone B — Identity loop

- Build the landing and identity form
- Prototype the image editor and save an edited portrait
- Generate the identity-card reveal and persist the player

**Checkpoint:** a new browser session can create a player and arrive at the dashboard after refresh.

### Milestone C — Investigation loop

- Build the briefing and evidence-lab screens around the editor workflow
- Capture annotation and deduction input
- Add submission, resolution, and unlock logic

**Checkpoint:** Case 001 can be fully solved without manual state editing.

### Milestone D — World payoff

- Build the case board and intelligence database from unlocked records
- Add dashboard progress and evidence history
- Make locked content remain hidden until it is earned

**Checkpoint:** completion visibly changes more than one screen.

### Milestone E — Product finish

- Responsive and accessibility pass
- Validate reloads, malformed storage, image-load errors, and reset flow
- Confirm the visual style feels cohesive and readable on mobile and desktop

## 9. Risks and mitigations

- Image editor complexity: prove the editor flow early before expanding the case system
- Missing annotation data: keep a fallback interaction for scoring if the editor cannot expose precise geometry
- Local storage limits: keep persisted assets lean and compress if needed
- Scope creep: do not start additional cases until the first one is polished end-to-end
- Brand confusion: keep all art, names, icons, and tone original and clearly fictional
- Visual effects hurting usability: keep them decorative and maintain high contrast

## 10. Testing checklist

- New-user, returning-user, and reset-user flows
- Portrait upload accepts and rejects expected file types gracefully
- Portrait and evidence export survive refreshes
- Annotation scoring behaves correctly for perfect, partial, and missed overlap
- Incorrect answers provide useful feedback while the threshold remains forgiving
- Locked records stay hidden until completion unlocks them
- Keyboard navigation, visible focus, responsive viewports, and reduced motion remain intact

## 11. First implementation task

Start with the foundation and editor feasibility spike:

1. Set up the visual tokens and app shell
2. Define the core product data model and one authored Case 001 flow
3. Integrate a minimal image editor page that can load and export an image in the app
4. Decide whether the editor can supply usable annotation geometry

Only after that spike succeeds should the identity screens and evidence lab be built on top of it.
