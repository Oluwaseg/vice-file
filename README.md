# VICE FILES

**Create a cover. Examine the evidence. Connect the city.**

VICE FILES is a fictional neon-noir visual investigation experience built for Unlayer's **Build with React Image Editor Challenge**. It is inspired by the energy of a coastal crime city, but uses no GTA or Rockstar characters, logos, screenshots, music, or narrative assets.

## Experience

1. Create a fictional cover identity and upload a portrait.
2. Edit the portrait with React Image Editor and receive an identity card.
3. Investigate Case 001, *The Night Run*.
4. Use React Image Editor to crop, filter, draw on, and export a night-scene evidence image.
5. Identify the vehicle and location, mark the grille, submit the finding, then unlock the connection board and intelligence database.
6. Complete Case 002, *The Missing Driver*, by editing a recovered-device image and reconstructing the next route.
7. Close Case 003, *The Organization*, by annotating an original fictional intelligence map and exposing the network.

The case state and cover identity are stored in `localStorage`; no account or backend is required for the demo.

## Local setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

For a production check:

```bash
pnpm build
```

## Stack

- Next.js + TypeScript
- Tailwind CSS
- [@unlayer/react-image-editor](https://github.com/unlayer/react-image-editor)
- Browser `localStorage` for prototype persistence

## Asset attribution

`public/evidence/case-001-traffic-camera.svg`, `public/evidence/case-002-device.svg`, and `public/evidence/case-003-map.svg` are original fictional UI/evidence illustrations created for this project.

`public/evidence/case-002-device.svg` and `public/evidence/case-003-map.svg` are original fictional UI/evidence illustrations created for this project.

All product names, copy, story entities, and interface visuals in VICE FILES are fictional and original to this project.
