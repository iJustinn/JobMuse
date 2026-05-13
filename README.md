# JobMuse

JobMuse is a local-first React and Express GUI for [`santifer/career-ops`](https://github.com/santifer/career-ops). JobMuse owns the browser experience; `career-ops` remains the functional core for file conventions, tracker data, reports, scanner scripts, PDF generation, and mode prompts.

The app is currently in the v0.2.0 renovation phase. It is file-backed and single-user by design: the Express API reads and writes the same user-layer files that `career-ops` uses on disk.

## What changed in v0.2.0

- Added `career-ops/` as a git submodule.
- Added `CAREER_OPS_PATH` support so the API can use either the bundled submodule or an external checkout.
- Added a Setup screen backed by `GET /api/system/setup`.
- Added file parsers and writers for profile, CV, applications, pipeline, portals, story bank, article digest, reports, and scan history.
- Added job runner support for career-ops scripts with server-sent event logs.
- Added API-backed screens: Setup, Dashboard, Evaluate, Applications, Pipeline, Scan, Reports, Insights, Memory, Profile, and Settings.
- Added a conservative `oferta` mode bridge that writes a report and tracker addition, then runs `merge-tracker.mjs`.
- Kept the old DeepSeek CV endpoints as deprecated compatibility routes while the new career-ops flow is rolled in.

## Local Development

Prerequisites:

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- Git submodule support

Clone with submodules, or initialize them after cloning:

```bash
git submodule update --init
```

Install JobMuse dependencies:

```bash
npm install
```

Install the career-ops submodule dependencies:

```bash
cd career-ops
npm install
npx playwright install chromium
```

Create local environment config:

```bash
cp .env.example .env.local
```

Start the local website and API server together:

```bash
npm run dev:all
```

Open:

```text
http://localhost:5173
```

The Express API listens on:

```text
http://localhost:8787
```

Build and preview the production bundle:

```bash
npm run build
npm run server
```

In another terminal:

```bash
npm run preview
```

Preview opens at:

```text
http://localhost:4173
```

## career-ops Setup

By default JobMuse uses the bundled `career-ops/` submodule. To point at an existing checkout instead, set `CAREER_OPS_PATH` in `.env.local`:

```text
CAREER_OPS_PATH=/absolute/path/to/career-ops
```

The career-ops checkout must have the user-layer files initialized before all screens are green:

```bash
cp career-ops/config/profile.example.yml career-ops/config/profile.yml
cp career-ops/templates/portals.example.yml career-ops/portals.yml
```

You also need to create or paste your own `career-ops/cv.md`. The Setup screen reports missing files and dependency checks.

JobMuse writes only to the career-ops user layer:

- `cv.md`
- `config/profile.yml`
- `modes/_profile.md`
- `article-digest.md`
- `interview-prep/story-bank.md`
- `portals.yml`
- `data/applications.md`
- `data/pipeline.md`
- `reports/*`
- `output/*`
- `jds/*`

System-layer files such as `modes/*.md`, templates, and `.mjs` scripts are read or executed but not edited by the GUI.

## AI Configuration

The app uses a local Express API. Browser code calls local `/api/*` routes only; provider keys stay in `.env.local` and are never exposed through Vite client env vars.

Default provider:

```text
LLM_PROVIDER=deepseek
LLM_MODEL=deepseek-v4-flash
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
DEEPSEEK_TIMEOUT_MS=8000
```

Anthropic and Gemini config placeholders are present for the provider abstraction, but only DeepSeek has a live implementation in this phase:

```text
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-sonnet-4-5
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-pro
```

If the provider key is missing, the current mode bridge uses conservative mock output rather than blocking the UI.

## API Surface

Setup and system:

- `GET /api/system/setup`
- `GET /api/system/events`
- `POST /api/system/update/check`
- `POST /api/system/update/apply`
- `GET /api/system/llm`
- `PUT /api/system/llm`

Core data:

- `GET /api/profile`
- `PUT /api/profile`
- `GET /api/cv`
- `PUT /api/cv`
- `GET /api/applications`
- `GET /api/applications/:num`
- `PATCH /api/applications/:num/status`
- `PATCH /api/applications/:num/notes`
- `GET /api/pipeline`
- `POST /api/pipeline`
- `DELETE /api/pipeline/:idx`
- `GET /api/portals`
- `PUT /api/portals`
- `GET /api/story-bank`
- `PUT /api/story-bank`
- `GET /api/article-digest`
- `PUT /api/article-digest`
- `GET /api/reports`
- `GET /api/reports/:filename`

Jobs and scripts:

- `POST /api/applications/evaluate`
- `POST /api/scan`
- `GET /api/scan/history`
- `POST /api/pipeline/process`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `GET /api/jobs/:id/events`
- `POST /api/jobs/:id/cancel`
- `GET /api/insights/patterns`
- `GET /api/insights/followups`
- `GET /api/insights/health`

Deprecated compatibility routes:

- `GET /api/ai-status`
- `POST /api/generate-cv`
- `POST /api/revise-cv`
- `POST /api/cv/generate`
- `POST /api/cv/revise`

## Project Notes

- `index.html` and `src/main.jsx` are the Vite entry points.
- `src/App.jsx`, `src/screens.jsx`, `src/lib/api.js`, and files under `src/components/` are the active UI source files.
- `server/index.js` starts the local Express API.
- `server/careerOps/` contains filesystem adapters, parsers, writers, the script runner, watcher, and mode bridge.
- `server/routes/` contains the `/api/*` route modules.
- `server/services/llm/` contains the provider abstraction.
- `shared/schemas/` contains zod schemas reused by the client and server.
- `RenovationPlan.md` documents the career-ops integration plan that this phase implements.
- `docs/DESIGN.md` contains the UI/design guidelines.
