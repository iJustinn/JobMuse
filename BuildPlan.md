# JobMuse - Build Plan

This document is the local setup plan and implementation record for JobMuse on branch `codex/v0.1.0`.

Updated on May 8, 2026 after the Vite/React conversion, and updated again on May 9, 2026 after finishing the remaining implementation and verification checklist. `BuildPlan-02.md` is now the active product roadmap; this file records the first local setup pass plus the later Express API handoff.

---

## 0. Current Status

**Overall status:** the local website setup is complete. JobMuse now runs as a React + Vite app with a standalone local Express API for DeepSeek-backed routes. The original Claude design-output files remain in the root as legacy references, but the active application source is under `src/`.

**Finished implementation work:**

- **Complete:** Converted the prototype from CDN React + Babel into React + Vite.
- **Complete:** Added `package.json`, `package-lock.json`, `vite.config.js`, `index.html`, `.gitignore`, and `.env.example`.
- **Complete:** Upgraded audit-fixed tooling to `vite@^8.0.11` and `@vitejs/plugin-react@^6.0.1`.
- **Complete:** Converted active app files to ES modules under `src/`.
- **Complete:** Moved global CSS and runtime button CSS into `src/styles/global.css`.
- **Complete:** Added responsive layout handling for desktop, small laptop, tablet, and mobile widths.
- **Complete:** Fixed `TweakButton` text rendering and `Kbd` passthrough props.
- **Complete:** Added a local dev shortcut for the tweaks panel with `Cmd + .` / `Ctrl + .`.
- **Complete:** Added a local Express API in `server/index.js` with CV generation/revision routes and a DeepSeek service layer.
- **Complete:** Wired `src/screens.jsx` to call `/api/generate-cv` and `/api/revise-cv`.
- **Complete:** Added mock fallback behavior if the API key or provider call is unavailable.
- **Complete:** Validated AI response shapes before updating UI state.
- **Complete:** Kept `DEEPSEEK_API_KEY` server-side in ignored `.env.local`.
- **Complete:** Redacted `.env.example` so it remains a safe template.
- **Complete:** Disabled or implemented previously silent no-op product actions.
- **Complete:** Updated `README.md`, `DESIGN.md`, `LessonsLearned.md`, and this plan.

**Finished verification work:**

- **Complete:** Clean install simulation from `/private/tmp/jobmuse-clean-test.LKnKWn`.
- **Complete:** `rtk npm install` succeeds from a clean copy.
- **Complete:** `rtk npm run build` succeeds from the main workspace and the clean copy.
- **Complete:** `rtk npm audit --json` reports 0 vulnerabilities.
- **Complete:** Dev server starts on `http://127.0.0.1:5173`.
- **Complete:** Preview server starts on `http://127.0.0.1:4173`.
- **Complete:** Dev and preview return HTTP `200 OK`.
- **Complete:** Browser console warning/error checks report 0 warnings/errors in dev and preview.
- **Complete:** Browser navigation pass covers Dashboard, New application, Applications, Memory, About you, and Settings.
- **Complete:** Browser flow reaches generated JD/CV result view and opens AI revision chat.
- **Complete:** Responsive browser checks passed at `1280x800`, `1024x768`, `768x1024`, and `390x844`.
- **Complete:** DeepSeek generation route returned `source: "deepseek"` using model `deepseek-v4-flash`.
- **Complete:** DeepSeek revision route returned `source: "deepseek"` using model `deepseek-v4-flash`.
- **Complete:** Built client bundle does not contain `DEEPSEEK_API_KEY`, the DeepSeek base URL, or secret-looking key strings.

**Remaining decisions only:**

- **Pending approval:** Move or delete the root-level legacy Claude output files.
- **Optional:** Normalize all mock profile identity fields.
- **Optional:** Self-host Geist fonts if offline support becomes a requirement.

---

## 1. Project Overview

JobMuse is a job-application and CV-tailoring website prototype with a Notion-style monochrome UI. It includes:

- Dashboard with application stats and recent opportunities.
- New Application flow for pasting a job description.
- DeepSeek-backed tailored CV generation with mock fallback.
- JD/CV split review view.
- DeepSeek-backed AI revision chat with mock fallback.
- Applications history.
- Memory facts.
- Profile/About You.
- Settings.
- Developer tweaks panel.

**Framework:** React + Vite.

**Runtime:** Vite dev/preview server plus a standalone local Express API on port `8787`; Vite proxies `/api/*` to the API.

**Main active entry chain:**

1. `index.html` mounts `<div id="root">`.
2. `index.html` loads `/src/main.jsx`.
3. `src/main.jsx` imports React, ReactDOM, `src/App.jsx`, and `src/styles/global.css`.
4. `src/App.jsx` renders the app shell, sidebar, routing, layout state, and tweaks panel.
5. `src/screens.jsx` renders the product screens and calls the local AI client.
6. `src/ai/client.js` calls local `/api/*` routes.
7. `server/index.js` serves `/api/*`; `server/routes/cv.js` handles CV routes; `server/services/deepseek.js` reads server-side env vars and calls DeepSeek.

**Legacy static entry:** removed after the active Vite app was established. `src/` is now the UI source of truth.

---

## 2. Current File Structure

Important current files and folders:

```
JobMuse/
  .env.example
  .gitignore
  BuildPlan.md
  DESIGN.md
  LessonsLearned.md
  LICENSE
  README.md
  index.html
  package-lock.json
  package.json
  vite.config.js
  server/
    index.js
    routes/
      cv.js
    services/
      deepseek.js
  src/
    App.jsx
    data.js
    main.jsx
    screens.jsx
    ai/
      client.js
      schemas.js
    components/
      TweaksPanel.jsx
      ui.jsx
    styles/
      global.css
```

**Active app files:**

| File | Purpose | Status |
|---|---|---|
| `index.html` | Vite HTML entry. | Complete |
| `package.json` | npm scripts and dependencies. | Complete |
| `package-lock.json` | Locked dependency tree. | Complete |
| `vite.config.js` | Vite React setup plus `/api` proxy to `http://localhost:8787`. | Complete |
| `server/index.js` | Standalone Express API bootstrap. | Complete |
| `server/routes/cv.js` | CV generation/revision routes. | Complete |
| `server/services/deepseek.js` | DeepSeek client, response normalization, and mock fallback. | Complete |
| `src/main.jsx` | React root render and CSS import. | Complete |
| `src/App.jsx` | App shell, routing, responsive shell layout, tweaks wiring. | Complete |
| `src/data.js` | Mock dataset exported as `JR_DATA`. | Complete |
| `src/screens.jsx` | Product screens, responsive views, AI flow wiring. | Complete |
| `src/components/ui.jsx` | UI primitives. | Complete |
| `src/components/TweaksPanel.jsx` | Developer tweaks panel. | Complete |
| `src/styles/global.css` | Global app CSS and button hover styles. | Complete |
| `src/ai/client.js` | Local API client for generation, revision, and status. | Complete |
| `src/ai/schemas.js` | Re-export of shared CV response validators. | Complete |
| `shared/schemas/` | Shared zod schemas for client and server validation. | Complete |

**Legacy/reference files:** removed. The active app lives in `src/`, with backend code in `server/`.

---

## 3. Local Build/Run Requirements

**Required tools:**

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- React 18
- ReactDOM 18
- Vite 8
- `@vitejs/plugin-react` 6

**Installed/configured files:**

| Requirement | Status |
|---|---|
| `package.json` | Complete |
| npm scripts | Complete: `dev`, `server`, `dev:all`, `build`, `preview`, `db:generate`, `db:migrate`, `db:studio`, `test` |
| Dependencies | Complete: `react`, `react-dom`, Express/DeepSeek/Drizzle/Supabase backend dependencies |
| Dev dependencies | Complete: `vite`, `@vitejs/plugin-react`, `concurrently`, `drizzle-kit` |
| Lock file | Complete: `package-lock.json` |
| Vite config | Complete: `vite.config.js` |
| Server/API | Complete: `server/index.js`, `server/routes/cv.js`, `server/services/deepseek.js` |
| HTML entry | Complete: `index.html` |
| Source folder | Complete: `src/` |
| Env example | Complete and redacted: `.env.example` |
| Local env file | Present and ignored: `.env.local` |
| Git ignore rules | Complete: `.gitignore` |

---

## 4. Issues and Fixes

### Resolved

| ID | Related files | Original problem | Finished work |
|---|---|---|---|
| B-PKG-1 | `package.json` | No npm project existed. | Added npm project, scripts, dependencies, lockfile. |
| B-PKG-2 | `vite.config.js`, `index.html` | No Vite entry/config existed. | Added Vite entry and config. |
| B-MOD-1 | `src/*` | JSX relied on globals and `window` side effects. | Converted active source to ES modules. |
| B-DUP-1 | root legacy files | Bundle/source duplication could double-mount. | Vite loads only `src/`; legacy remains inactive. |
| B-UI-1 | `TweaksPanel.jsx` | `TweakButton` ignored children. | Supports `children ?? label`. |
| B-UI-2 | `ui.jsx` | `Kbd` ignored passthrough style. | Accepts passthrough props. |
| B-TWEAK-1 | `TweaksPanel.jsx` | Tweaks panel unreachable locally. | Added local dev shortcut. |
| B-CSS-1 | `global.css`, `App.jsx` | Runtime CSS injection depended on globals. | Moved CSS to `global.css`. |
| B-MODEL-1 | `screens.jsx`, `client.js` | UI showed old model label. | Uses `deepseek-v4-flash`. |
| R-AI-1 | `server/index.js`, `server/routes/cv.js`, `client.js`, `screens.jsx` | No real backend/proxy. | Added local API and wired UI to it. |
| R-AI-2 | `.env.local`, `server/services/deepseek.js` | No server-side key consumer. | API reads env server-side only. |
| R-MOCK-1 | `screens.jsx` | Several actions were silent no-ops. | Functional actions wired where simple; demo-only actions disabled with titles. |
| R-TEST-1 | browser/devtools | Console not directly checked. | Browser dev log checks pass with 0 warnings/errors. |
| R-RESP-1 | `App.jsx`, `screens.jsx` | Small widths not verified. | Responsive logic added and tested at 4 viewports. |
| R-AUDIT-1 | `package-lock.json` | Two moderate advisories. | Upgraded to Vite 8 and plugin-react 6; audit now clean. |

### Remaining

| ID | Related files | Problem | Recommended follow-up |
|---|---|---|---|
| R-LEGACY-1 | root legacy files | Original Claude outputs remain beside active Vite source. | Move them to `legacy/` after approval. |
| R-DATA-1 | `src/data.js`, `src/screens.jsx` | Some mock identity/profile details may still be inconsistent. | Pick one sample identity and normalize all mock data. |

---

## 5. Recommended Project Setup

**Chosen setup:** React + Vite with a standalone local Express API.

**Why this is the right setup:**

- The app is already React JSX.
- Vite removes browser-side Babel and CDN runtime dependencies.
- npm-managed dependencies support clean local installs.
- The server-side Express API keeps `DEEPSEEK_API_KEY` out of the browser bundle.
- The proxy works through Vite dev/preview when the Express API is running.
- The UI keeps a mock fallback for local resilience.

**Recommended final structure after legacy cleanup:**

```
JobMuse/
  index.html
  package.json
  package-lock.json
  vite.config.js
  .env.example
  .gitignore
  README.md
  DESIGN.md
  BuildPlan.md
  LessonsLearned.md
  src/
    main.jsx
    App.jsx
    data.js
    screens.jsx
    ai/
      client.js
      schemas.js
    components/
      ui.jsx
      TweaksPanel.jsx
    styles/
      global.css
```

---

## 6. Implementation Phases

### Phase 0 - Branch and orientation

**Status:** Complete.

**Finished work:**

- Checked the local workspace and current files.
- Created/switched to branch `codex/v0.1.0`.
- Preserved existing root prototype files.

### Phase 1 - Package and tooling setup

**Status:** Complete.

**Files created/modified:**

- `package.json`
- `package-lock.json`
- `vite.config.js`
- `.gitignore`
- `.env.example`

**Finished work:**

- Added Vite scripts.
- Added React dependencies.
- Added Vite 8 and Vite 8-compatible React plugin.
- Installed dependencies.
- Ran audit fix and confirmed 0 vulnerabilities.

### Phase 2 - Vite entry and styling

**Status:** Complete.

**Files created/modified:**

- `index.html`
- `src/main.jsx`
- `src/styles/global.css`

### Phase 3 - Convert prototype source to modules

**Status:** Complete.

**Files created/modified:**

- `src/App.jsx`
- `src/data.js`
- `src/screens.jsx`
- `src/components/ui.jsx`
- `src/components/TweaksPanel.jsx`

### Phase 4 - DeepSeek integration

**Status:** Complete.

**Files created/modified:**

- `server/index.js`
- `server/routes/cv.js`
- `server/services/deepseek.js`
- `src/ai/client.js`
- `src/ai/schemas.js`
- `shared/schemas/cv.js`
- `src/screens.jsx`
- `.env.example`
- `.gitignore`
- `README.md`

**Finished work:**

- Added `GET /api/ai-status`.
- Added `POST /api/generate-cv`.
- Added `POST /api/revise-cv`.
- Added DeepSeek chat-completions calls through the local proxy.
- Added strict JSON prompting and response normalization.
- Added client response validation.
- Added mock fallback for no key, provider failure, or invalid response shape.
- Verified live generation and revision return `source: "deepseek"`.
- Verified no key or provider base URL appears in the built client bundle.

### Phase 5 - Component cleanup and action audit

**Status:** Complete.

**Files modified:**

- `src/components/ui.jsx`
- `src/components/TweaksPanel.jsx`
- `src/App.jsx`
- `src/screens.jsx`

**Finished work:**

- Fixed `TweakButton`.
- Fixed `Kbd`.
- Added local tweaks shortcut.
- Implemented CV copy and profile save feedback.
- Wired History "New" to the New Application route.
- Disabled local-prototype-only actions with descriptive titles.

### Phase 6 - Responsive layout

**Status:** Complete.

**Files modified:**

- `src/App.jsx`
- `src/screens.jsx`
- `src/components/ui.jsx`

**Finished work:**

- Added responsive app shell.
- Added mobile top navigation.
- Added responsive dashboard grids.
- Added responsive new-application result layout.
- Added responsive history table overflow.
- Added responsive memory and profile layouts.

### Phase 7 - Verification

**Status:** Complete.

**Finished work:**

- Clean install simulation passed.
- Dev server passed HTTP and browser smoke tests.
- Preview server passed HTTP and browser smoke tests.
- Browser console warning/error checks passed.
- Responsive viewport checks passed.
- Production build passed.
- npm audit passed with 0 vulnerabilities.
- Live DeepSeek generation and revision routes passed.
- Client bundle secret scan passed.

### Phase 8 - Legacy cleanup

**Status:** Pending approval.

**Recommended work:**

- Move root prototype files into `legacy/`.
- Update docs to say `legacy/` is reference-only.

---

## 7. Local Run Instructions

### Install dependencies

```bash
rtk npm install
```

Equivalent outside this RTK workspace:

```bash
npm install
```

### Start local dev server and API

```bash
rtk npm run dev:all
```

Open:

```text
http://127.0.0.1:5173
```

The API listens at:

```text
http://127.0.0.1:8787
```

### Build production assets

```bash
rtk npm run build
```

### Preview production build

```bash
rtk npm run server
```

In another terminal:

```bash
rtk npm run preview
```

Open:

```text
http://127.0.0.1:4173
```

### Configure DeepSeek

```bash
cp .env.example .env.local
```

Set these in `.env.local`:

```text
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
```

API routes:

```text
GET  /api/ai-status
POST /api/generate-cv
POST /api/revise-cv
```

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `npm: command not found` | Node/npm not installed. | Install Node `^20.19.0` or `>=22.12.0`. |
| `npm install` fails with peer dependency conflict | Dependency tree is stale. | Make sure `package.json` uses `vite@^8.0.11` and `@vitejs/plugin-react@^6.0.1`, then run `npm install`. |
| Vite `listen EPERM` on localhost | Sandbox blocked port binding. | Rerun with approved escalation in this RTK workspace. |
| Blank page | Runtime error or wrong entry opened. | Open `http://127.0.0.1:5173`, not `JobMuse.html`. Check console. |
| Tweaks panel does not open | Shortcut not used or app not focused. | Press `Cmd + .` on macOS or `Ctrl + .` elsewhere. |
| AI response says mock fallback | Missing key, provider error, or invalid model response. | Check `.env.local` and `/api/ai-status`; the UI keeps working with mock output. |
| Audit warnings return | Dependency advisory changed. | Run `rtk npm audit --json` and review before applying major upgrades. |

---

## 8. Testing Checklist

### Completed

- [x] Fresh clean-copy install succeeds.
- [x] Direct browser console check reports no warnings/errors in dev.
- [x] Direct browser console check reports no warnings/errors in preview.
- [x] Full navigation pass covers Dashboard, New application, Applications, Memory, About you, and Settings.
- [x] Button/action audit complete.
- [x] Responsive layout tested at `1280x800`.
- [x] Responsive layout tested at `1024x768`.
- [x] Responsive layout tested at `768x1024`.
- [x] Responsive layout tested at `390x844`.
- [x] Production preview renders the same core app surfaces as dev.
- [x] `rtk npm audit --json` reports 0 vulnerabilities.
- [x] Real DeepSeek generation route returns `source: "deepseek"`.
- [x] Real DeepSeek revision route returns `source: "deepseek"`.
- [x] Built client bundle contains no `DEEPSEEK_API_KEY`.
- [x] Built client bundle contains no DeepSeek base URL.
- [x] Built client bundle contains no secret-looking key strings.

### Remaining

- [x] Delete legacy root prototype files after approval.
- [ ] Optionally normalize mock identity data.
- [ ] Optionally self-host fonts for offline support.

---

## 9. Risks and Decisions Needing Confirmation

| ID | Decision | Recommended choice |
|---|---|---|
| D-LEGACY-1 | Move/delete/keep root legacy files. | Complete: deleted after approval. |
| D-DATA-1 | Normalize mock user identity. | Pick one sample identity and update all mock data. |
| D-FONT-1 | Keep Google Fonts CDN or self-host Geist. | Keep CDN unless offline support is required. |

Current operational risks:

- Active source now lives only under `src/`; legacy root prototype files were removed to avoid future edit confusion.
- DeepSeek output quality still depends on provider behavior, so response validation and mock fallback should remain.
- The API key must stay in `.env.local` or another server-side environment. Do not add it to `.env.example` or any `src/` file.
