# Portfolio (Vite + React + TS)

Clean, minimal portfolio front end built with Vite, React, and TypeScript.

## Getting Started

- Install deps: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Structure

- `src/pages/` simple routes: Home, About, Projects, Contact
- `src/App.tsx` navigation + routing
- `src/App.css` layout and components styles

## Notes

- Removed Vite/React boilerplate assets and dropdown for a clearer, more accessible nav.
- Internal links use `react-router-dom` to avoid full page reloads.
