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
9. `localStorage` persistence, responsive layout, empty/loading/error states

### Deliberately defer

- Authentication, a database, uploads to cloud storage
- AI-generated narratives or evaluation
- Multiplayer, real-time functionality, maps, sound effects
- Multiple full cases (design the data model to support them)
- Social sharing, payments, complex achievements

**Definition of done:** a fresh user can create an identity, finish Case 001, see its linked suspect/vehicle/location records, refresh the page, and still see their progress.

## 3. Primary user flow

```text
LANDING
  → create identity (details + portrait edit)
  → identity card reveal
  → dashboard
  → Case 001 briefing
  → evidence lab (annotate image)
  → answer deductions
  → scoring / case resolution
  → case board + unlocked intelligence records
```

Keep the main call-to-action obvious at every step. The first minute should show: **upload → edit → identity reveal → active investigation**.

## 4. Case 001: The Night Run

**Premise:** At 02:17, a car leaves a warehouse near Vice Beach. The player must identify the vehicle, location, and suspicious item.

### Required case data

- `case-001` title, briefing, objectives, completion status
- One original/licensed evidence image with three intentional clues
- Correct answers: vehicle, location, and clue region
- Records unlocked on completion: `red-comet`, `vice-beach`, `the-ghost`
- Target annotation rectangle expressed in image-relative coordinates (`x`, `y`, `width`, `height` from 0 to 1)

### Evaluation approach

Do not use AI evaluation for the MVP. On submission:

1. Record the user annotation's bounding rectangle.
2. Calculate overlap with the target rectangle (intersection-over-union or target coverage).
3. Combine annotation score with the two selected answers.
4. Pass at a forgiving threshold (for example 60%) and show actionable feedback.

This makes image manipulation demonstrably part of gameplay while keeping the result deterministic.

## 5. Technical architecture

This repository is already a Next.js + TypeScript + Tailwind project. Keep it frontend-only for the first slice.

```text
src/
  app/                         # routes and page composition
  components/
    ui/                        # buttons, panels, status chips, dialogs
    identity/                  # identity form, card, portrait editor wrapper
    cases/                     # briefing, evidence lab, questions, result
    database/                  # record cards and record details
  data/
    cases.ts                   # authored case/evidence/clue definitions
    records.ts                 # authored suspects, vehicles, locations
  lib/
    storage.ts                 # versioned localStorage reads/writes
    scoring.ts                 # pure overlap and case-score functions
    types.ts                   # Player, CaseProgress, Annotation, Record
  hooks/                       # client-side player state hook
public/
  images/                      # project-owned/licensed evidence and textures
```

### State to persist

```ts
type Player = {
  alias: string;
  role: "street-racer" | "club-owner" | "fixer";
  neighbourhood: string;
  portraitDataUrl?: string;
  createdAt: string;
};

type CaseProgress = {
  caseId: string;
  status: "locked" | "active" | "complete";
  answers: Record<string, string>;
  annotation?: { x: number; y: number; width: number; height: number };
  editedEvidenceDataUrl?: string;
  score?: number;
};
```

Store a versioned single application state under a project-specific key, e.g. `vice-files:v1`. Validate missing/corrupt data and provide a reset-progress control in the profile/settings area.

### Image-editor integration decision

The chosen editor must support: client-side rendering in Next.js, loading a local/user image, exporting an edited image, and exposing annotation geometry (or a practical equivalent). Prototype this integration before designing the entire Evidence Lab around it.

- Dynamically import browser-only editor code to avoid server-rendering failures.
- Wrap it behind an `ImageEditor` component so a library change stays local.
- Preserve original image dimensions and normalise annotation coordinates before scoring.
- If the editor cannot expose drawing/shape coordinates, overlay a purpose-built selectable bounding-box interaction for the scoring objective while still using the editor for visual editing.

## 6. Routes and screen responsibilities

| Route | Purpose | MVP status |
| --- | --- | --- |
| `/` | Atmospheric entry; begin/resume | Build |
| `/identity` | Player details and portrait workflow | Build |
| `/dashboard` | Active case, progress, recent evidence | Build |
| `/cases/001` | Briefing, evidence and questions | Build |
| `/cases/001/result` | Score, outcome, unlocked records | Build |
| `/board/001` | Linked clue/evidence view | Build, simple |
| `/database` | Discovered record list/detail | Build, simple |
| `/profile` | Identity card and reset progress | Build, simple |

Avoid building a route for every future content idea now. Use authored data and add routes only when Case 002 exists.

## 7. Design system

Visual direction: **modern intelligence terminal + neon coastal noir**.

- Base: near-black/navy; panels are slightly lighter, not flat black.
- Accent palette: hot coral/pink, electric cyan, muted amber. Use one accent as the primary action colour per screen.
- Typography: condensed display face for case labels; clean sans-serif for reading and controls.
- Texture: restrained grain, scanlines, map grid, timestamp metadata—never enough to harm contrast.
- Motion: short reveal/transitions and optional reduced-motion support.
- Mobile: vertically stacked workflow, touch-safe controls, no desktop-only case board assumptions.

Create tokens for colours, spacing, radii, shadows, and typography before composing screens. Build reusable dossier panels, evidence cards, section labels, status chips, and primary/secondary buttons.

## 8. Implementation order

### Milestone A — Foundation

- Inspect the starter app and establish the global theme/layout.
- Add types, authored Case 001/record data, and local persistence.
- Create reusable UI primitives and a temporary navigation shell.

**Checkpoint:** the app runs, routes work, and a seeded player/case can render from data.

### Milestone B — Identity loop

- Build landing and identity form.
- Integrate/prototype the image editor and save an edited portrait.
- Generate the identity-card reveal and persist the player.

**Checkpoint:** a new browser session can create a player and arrive at dashboard after refresh.

### Milestone C — Investigation loop

- Build briefing and evidence-lab screens around the final editor wrapper.
- Add annotation capture/normalisation and pure scoring tests.
- Add deduction questions, submission, resolution screen, and unlock logic.

**Checkpoint:** Case 001 can be fully solved without manual state editing.

### Milestone D — World payoff

- Build lightweight case board and database from unlocked records.
- Add dashboard progress and evidence history.
- Ensure locked records do not reveal spoilers.

**Checkpoint:** completion visibly changes more than one screen.

### Milestone E — Product finish

- Responsive and accessibility pass (keyboard, focus, alt text, contrast, reduced motion).
- Test reloads, malformed storage, image load failures, and reset flow.
- Add README: concept, setup, stack, gameplay flow, assets/attribution, deployment link.
- Build, deploy, and test the production URL on mobile and desktop.

## 9. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Editor is hard to integrate with Next.js | Prove dynamic import/export in Milestone B before proceeding. |
| Annotation data is unavailable | Use a separate normalized target-selection overlay. |
| `localStorage` data URLs exceed browser limits | Resize/compress exports; store only one or two images; later move to cloud storage. |
| Scope grows into a game | Do not start Case 002 until Case 001 is polished end-to-end. |
| Copyright/brand confusion | Original world, names, copy, art, icons, and audio; document asset sources. |
| Visual effects hurt usability | Make effects decorative, preserve contrast and readable metadata. |

## 10. Testing checklist

- New user, returning user, and reset user flows
- Portrait upload accepts/rejects expected file types and fails gracefully
- Portrait/evidence export works after a hard refresh
- Annotation score is correct for overlap, miss, and partial overlap
- Incorrect answers give useful feedback; pass threshold is forgiving
- Locked records stay hidden; completion unlocks the intended three records
- Keyboard navigation, visible focus, responsive viewports, and reduced motion
- `pnpm lint` and `pnpm build` pass before deployment

## 11. First implementation task

Start with **Milestone A plus the editor feasibility spike**:

1. Set up the visual tokens and application shell.
2. Add the core types and one authored Case 001 data file.
3. Integrate a minimal editor page that can load an image and export it in this Next.js app.
4. Decide whether the editor supplies usable annotation geometry.

Only after that spike succeeds should we build the identity screens and Evidence Lab on top of it.
