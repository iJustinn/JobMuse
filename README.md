# JobMuse

Open-source job application and CV-tailoring prototype.

## Local Development

Prerequisites:

- Node.js `^20.19.0` or `>=22.12.0`
- npm

Install dependencies:

```bash
npm install
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

## AI Configuration

The app uses a local Express API service for DeepSeek V4 Flash. Browser code calls local `/api/*` routes only; `DEEPSEEK_API_KEY` stays in `.env.local` and is never exposed through Vite client env vars. Vite proxies `/api` to `http://localhost:8787` during dev and preview.

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then set:

```text
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
API_PORT=8787
```

Available local API routes:

- `GET /api/ai-status`
- `POST /api/generate-cv`
- `POST /api/revise-cv`
- `POST /api/cv/generate`
- `POST /api/cv/revise`

If the key or provider request is unavailable, the UI falls back to local mock output instead of breaking the flow.

## Project Notes

- `index.html` and `src/main.jsx` are the Vite entry points.
- `src/App.jsx`, `src/screens.jsx`, and files under `src/components/` are the active source files.
- `server/index.js` starts the local Express API. CV routes live in `server/routes/cv.js`, and DeepSeek calls live in `server/services/deepseek.js`.
- `shared/schemas/` contains zod schemas reused by the client and server.
- The old root-level Claude prototype files have been removed; edit `src/` as the UI source of truth.
- `BuildPlan.md` documents the first local setup pass. `BuildPlan-02.md` tracks the product implementation roadmap.
