# RenovationPlan.md — JobMuse + career-ops integration

> **Status:** Draft proposal · **Owner:** iJustin · **Date:** 2026-05-12
>
> **Goal:** Turn JobMuse into the interactive GUI for `santifer/career-ops`. JobMuse owns the experience; career-ops owns the engine.

---

## 1. Goals and non-goals

### Goals
- Use the existing JobMuse React/Express prototype as the **only** UI surface a user touches.
- Use the open-source [`santifer/career-ops`](https://github.com/santifer/career-ops) repository as the **functional core**: data model, file conventions, evaluators (modes), scanner, PDF builder, dashboards.
- Make every career-ops feature reachable from the GUI without the user ever opening a terminal or Claude Code.
- Stay aligned with career-ops's "User Layer vs System Layer" data contract so upstream updates remain safe to pull.

### Non-goals
- Do **not** fork or rewrite career-ops. Track upstream `main`.
- Do **not** auto-submit job applications. Career-ops is explicitly human-in-the-loop; the GUI preserves that.
- Do **not** introduce a database (Postgres/Drizzle) in this phase. Career-ops is file-based; mirroring it in a DB doubles the failure modes without a payoff. Drizzle code is parked, not extended.
- Do **not** ship i18n in v1. Career-ops has DE/FR/JA/PT/RU mode dirs; we expose a language selector but only QA English on first pass.

---

## 2. The two projects, in one paragraph each

**JobMuse (this repo).** Vite + React 18 SPA with a small Express API on `:8787`. Screens: Dashboard, New application, History, Memory, Profile, Settings. Today it talks to DeepSeek via two routes (`/api/generate-cv`, `/api/revise-cv`) and falls back to a hardcoded `JR_DATA` seed in `src/data.js`. There is a Drizzle/Postgres schema (`server/db/schema.js`) and a Supabase client, but neither is wired into the running app yet.

**career-ops.** CLI-first system designed to live inside Claude Code / Gemini CLI. The user pastes a JD URL into a slash command (`/career-ops`) and the host LLM walks a "mode" — a markdown prompt in `modes/*.md` — that orchestrates file reads, web fetches, scoring, and writes. State lives in plain files inside the repo: `cv.md`, `config/profile.yml`, `data/applications.md` (markdown table of every application), `reports/{###}-{slug}-{date}.md`, `output/*.pdf`, `interview-prep/story-bank.md`, `portals.yml`. Standalone Node scripts (`scan.mjs`, `generate-pdf.mjs`, `merge-tracker.mjs`, etc.) do the deterministic work. A Go + Bubble Tea TUI in `dashboard/` reads `applications.md`.

---

## 3. Architecture decision

### Chosen approach — **Option A: filesystem adapter ("thin shell")**

The Express server treats a career-ops checkout on disk as the single source of truth. It reads and writes the same files career-ops uses, and it spawns career-ops's own `.mjs` scripts for deterministic work. For AI-driven modes (which career-ops normally executes inside Claude Code), JobMuse ships a small **mode bridge** that loads the mode's markdown, splices in inputs, calls the user-selected LLM, and writes outputs to the same canonical paths career-ops would.

```
┌────────────────────┐    HTTP/SSE     ┌──────────────────────┐    spawn      ┌──────────────────┐
│  React SPA         │ ───────────────▶│  Express API         │ ─────────────▶│  career-ops      │
│  (port 5173)       │                 │  (port 8787)         │               │  *.mjs scripts   │
│                    │◀────────────────│  - file adapters     │◀──── stdout ──│  (scan/pdf/merge)│
└────────────────────┘                 │  - script runner     │               └──────────────────┘
                                       │  - mode bridge (LLM) │
                                       └───────┬──────────────┘
                                               │ fs.read/write
                                               ▼
                                       ┌──────────────────────┐
                                       │  career-ops repo     │
                                       │  (User Layer files)  │
                                       └──────────────────────┘
```

### Why not the alternatives

| Option | Sketch | Why rejected |
|---|---|---|
| **B. Mirror into Postgres** | Drizzle schema is canonical; sync to/from career-ops markdown. | Two sources of truth always drift. Career-ops dashboard, manual edits, or upstream scripts would race the DB. Doubles the failure surface for no user-facing payoff at v1 scale (single user). |
| **C. Port career-ops into JobMuse** | Reimplement modes/scripts inside `server/`. | Loses the upstream upgrade path the project explicitly designs around (`DATA_CONTRACT.md`, `update-system.mjs`). Reintroduces a maintenance tax the open-source project is solving for us. |
| **D. Iframe the Go TUI** | Embed `dashboard/` somehow. | TUI is a terminal app; not a real option. |

### Assumptions baked into Option A (call them out)
1. The user has Node 20+ and can `git submodule update --init` (or accept an auto-clone).
2. The user has Playwright + Chromium installed (career-ops's `npm run doctor` is the gate). The GUI surfaces a setup screen if not.
3. There is one career-ops checkout per JobMuse install. Multi-workspace is a v2 concern.
4. Only one writer (GUI or human-with-editor) at a time. We add mtime checks but not full locking.

---

## 4. Repository layout

### Option 4a (recommended) — git submodule

```
JobMuse/
├── career-ops/                  ← git submodule of santifer/career-ops
│   ├── cv.md
│   ├── config/profile.yml
│   ├── modes/
│   ├── data/applications.md
│   ├── reports/
│   ├── output/
│   └── ...
├── server/
├── shared/
├── src/
└── ...
```

- One command bootstrap: `git clone --recurse-submodules ...` or `git submodule update --init`.
- Pinned to a known-good upstream commit; bumped deliberately.
- Upstream updates: `cd career-ops && node update-system.mjs check` from the GUI's Settings page.

### Option 4b — external path

Allow `CAREER_OPS_PATH=/absolute/path` in `.env.local` to point at any checkout. Useful if the user already has career-ops set up elsewhere. The submodule is the default; this is the escape hatch.

The server resolves the path once on boot via `server/config.js`:

```js
careerOps: {
  path: process.env.CAREER_OPS_PATH
    ?? path.resolve(repoRoot, "career-ops"),
  required: ["cv.md", "config/profile.yml", "modes", "data"],
}
```

A `GET /api/system/setup` route reports: path resolved, each required file present, `node_modules` installed in submodule, Playwright Chromium available, profile.yml parseable. The frontend renders this as a setup checklist before letting the user proceed.

---

## 5. The career-ops data contract (what we read/write)

Source: `DATA_CONTRACT.md` in career-ops. **JobMuse writes ONLY to the User Layer.** Everything else is system-owned.

### User Layer — writable

| Path | Format | Owner in GUI | Notes |
|---|---|---|---|
| `cv.md` | Markdown | "About you" / CV editor | Canonical CV; consumed by every mode. |
| `config/profile.yml` | YAML | Profile screen | name, email, location, timezone, target_roles, salary_target, narrative, archetypes. |
| `modes/_profile.md` | Markdown | Profile → Advanced | User-specific overrides for archetypes/scoring/negotiation. Never auto-updated. |
| `article-digest.md` | Markdown | Memory → Proof Points | Compact portfolio proof points. |
| `interview-prep/story-bank.md` | Markdown | Memory → Stories (STAR+R) | Accumulating STAR+Reflection bank. |
| `interview-prep/{company}-{role}.md` | Markdown | Interview Prep screen | Per-app intel. Written by `interview-prep` mode. |
| `portals.yml` | YAML | Settings → Portals | Scanner config: company list, careers_url, api_type, title filters. |
| `data/applications.md` | Markdown table | History screen | **Never write rows directly.** Only update status/notes of existing rows. New rows go through `merge-tracker.mjs`. |
| `data/pipeline.md` | Markdown | Dashboard → Pipeline | Pending URLs awaiting evaluation. |
| `data/scan-history.tsv` | TSV | Scan screen (read-only display) | Dedup key for scanner; only `scan.mjs` writes it. |
| `data/follow-ups.md` | Markdown | Insights → Follow-ups | Log of outreach touches. |
| `writing-samples/*` (except README) | Misc | Memory → Writing samples | Cover letters etc. used as voice references. |
| `reports/{###}-{slug}-{YYYY-MM-DD}.md` | Markdown | Report viewer | Written by evaluation modes; rendered (not edited) by GUI. |
| `output/*.pdf` | PDF | PDF actions | Written by `generate-pdf.mjs`. |
| `jds/*` | Misc | Internal cache | Stashed JD text for re-eval. |

### System Layer — read only

Everything else in the career-ops repo: `modes/*.md` (except `_profile.md`), `templates/*`, scripts (`*.mjs`, `*.sh`), `AGENTS.md`, `CLAUDE.md`, etc. The GUI may read these (the mode bridge reads `modes/oferta.md`, etc.) but must never write them.

### Canonical status enum

From `templates/states.yml`. Strict, case-insensitive validation in `shared/schemas/application.js`:

```
evaluated · applied · responded · interview · offer · rejected · discarded · skip
```

Spanish/Portuguese aliases (`aplicado`, `entrevista`, `oferta`, ...) are accepted on read and normalized on write.

### Tracker column order — easy to get wrong

- TSV addition rows in `batch/tracker-additions/*.tsv`: `# | date | company | role | **status** | score/5 | pdf | report-link | note` (status **before** score).
- Final `data/applications.md` table: `# | Date | Company | Role | Score | **Status** | PDF | Report | Notes` (status **after** score).

`merge-tracker.mjs` handles the swap. The GUI must always go through that script and never edit `applications.md` row-by-row.

---

## 6. Server layer (Express)

All new code lives under `server/`. The existing DeepSeek service and CV routes are retired (kept in git history; not deleted destructively until the bridge is verified end-to-end).

### 6.1 New modules

```
server/
├── careerOps/
│   ├── paths.js            ← absolute path resolution + presence checks
│   ├── parsers/
│   │   ├── applications.js ← parse data/applications.md → rows[]
│   │   ├── pipeline.js
│   │   ├── profile.js      ← yaml ↔ object
│   │   ├── portals.js
│   │   ├── stories.js      ← STAR+R blocks
│   │   ├── reports.js      ← front-matter + Score/URL/Legitimacy headers
│   │   └── scanHistory.js  ← TSV reader
│   ├── writers/
│   │   ├── profile.js      ← writes profile.yml + _profile.md split
│   │   ├── cv.js
│   │   ├── portals.js
│   │   ├── pipeline.js     ← append URL
│   │   ├── stories.js
│   │   └── status.js       ← in-place status edit on applications.md row
│   ├── runner.js           ← child_process.spawn wrappers
│   ├── modeBridge.js       ← load mode markdown, call LLM, persist outputs
│   └── watcher.js          ← chokidar; SSE invalidation events
├── routes/
│   ├── profile.js
│   ├── cv.js               ← rewritten
│   ├── applications.js
│   ├── pipeline.js
│   ├── portals.js
│   ├── scan.js
│   ├── reports.js
│   ├── stories.js
│   ├── insights.js
│   ├── jobs.js             ← SSE for running scripts/modes
│   └── system.js
├── services/
│   └── llm/                ← provider abstraction
│       ├── deepseek.js     ← kept; the existing client
│       ├── anthropic.js    ← new
│       └── gemini.js       ← new
└── index.js
```

### 6.2 Script runner contract

`runner.js` exposes one function per career-ops script. Each:
1. Validates the career-ops path resolved.
2. Spawns `node <script>.mjs <args>` with `cwd = careerOps.path`.
3. Streams stdout/stderr lines to an in-memory job record keyed by job id.
4. Emits events over SSE (`/api/jobs/:id/events`) so the UI can show live logs.
5. Resolves with `{ exitCode, durationMs, summary }` on completion.

Wrapped scripts (v1 set):
- `scan.mjs [--company X] [--dry-run]` → pipeline.md, scan-history.tsv.
- `generate-pdf.mjs <html> <pdf> [--format=letter|a4]` → output/*.pdf.
- `merge-tracker.mjs` → applications.md.
- `verify-pipeline.mjs` → pipeline integrity report.
- `analyze-patterns.mjs` → JSON stdout.
- `followup-cadence.mjs` → JSON stdout.
- `check-liveness.mjs` → updates reports' legitimacy block.
- `update-system.mjs check|apply` → upstream sync.

### 6.3 Mode bridge — the load-bearing piece

career-ops modes are markdown prompts authored for a Claude Code host that can read files, fetch URLs, and write files mid-conversation. JobMuse must reproduce that orchestration in plain Node.

For each supported mode, the bridge:
1. Loads the mode body (`modes/<name>.md`), `modes/_shared.md`, and `modes/_profile.md`.
2. Pre-fetches all referenced inputs in code: `cv.md`, `config/profile.yml`, JD text (fetch the URL server-side; fall back to user-pasted text), `article-digest.md`, `interview-prep/story-bank.md`, recent `reports/`.
3. Calls the LLM with a system prompt (the mode body) and a user payload (structured JSON: profile, CV, JD, story bank, etc.) plus an `expected_shape` schema for strict JSON output.
4. Validates the LLM response with a zod schema in `shared/schemas/`.
5. Persists outputs to the canonical career-ops paths:
   - Evaluation → `reports/{next-num}-{slug}-{date}.md` (rendered from the JSON via a server-side template, so we don't trust the LLM to format the markdown).
   - Tracker row → `batch/tracker-additions/{num}-{slug}.tsv` then immediately `runner.mergeTracker()`.
   - Tailored CV HTML → `/tmp/cv-{cand}-{company}.html` then `runner.generatePdf(...)`.

Modes wrapped in v1 (in priority order):
1. `oferta` — single JD evaluation (Blocks A–F + G legitimacy). The headline feature.
2. `pdf` — tailored CV HTML + PDF.
3. `auto-pipeline` — `oferta` + `pdf` + tracker merge.
4. `pipeline` — process every URL in pipeline.md.
5. `apply` — produce application-form answer pack.
6. `interview-prep` — generate `{company}-{role}.md`.
7. `deep` — company research dossier.
8. `followup` — outreach drafts.
9. `batch` — parallel evaluation of many URLs.

The bridge is intentionally **best-effort**. Modes assume Claude Code's tool-use loop; running them through one-shot LLM calls will produce less-perfect output than the native CLI. The plan accepts that — Phase 4 includes a way to deep-link from any report back to the equivalent Claude Code command, so power users can run the canonical version when they want.

### 6.4 LLM provider abstraction

`server/services/llm/` exposes a single `call({ system, user, schema }) → parsed` interface with three implementations: `deepseek` (existing), `anthropic`, `gemini`. Provider + model chosen in Settings, persisted in `.env.local`. The existing DeepSeek key path is preserved.

### 6.5 File watcher

`chokidar` watches the user-layer paths in the career-ops directory. On change, it emits an SSE event on `/api/system/events` so the SPA can invalidate its caches. This is how we tolerate the user editing applications.md from their text editor or running the Go TUI in parallel.

---

## 7. API surface

All routes mounted under `/api`. Capitalized verbs in brackets are HTTP methods.

### Profile / CV / Memory
- `[GET]/profile` — parsed profile.yml + presence of `_profile.md`.
- `[PUT]/profile` — write profile.yml; advanced overrides go to `_profile.md`.
- `[GET]/cv` — `{ raw: string, parsed: CvDocument }`.
- `[PUT]/cv` — write `cv.md`.
- `[GET]/article-digest` / `[PUT]/article-digest` — proof points.
- `[GET]/story-bank` / `[PUT]/story-bank` — STAR+R bank.

### Applications
- `[GET]/applications?status=&search=&sort=` — parsed rows from `applications.md`.
- `[GET]/applications/:num` — row + linked `reports/{num}-...md` content + PDF presence.
- `[PATCH]/applications/:num/status` — validates against canonical enum, rewrites that row only.
- `[PATCH]/applications/:num/notes` — same row, notes column only.
- `[POST]/applications/evaluate` — `{ url?, text?, mode='oferta' }` → mode bridge → new report + tracker addition. Returns a `jobId` to stream.
- `[POST]/applications/:num/pdf` — runs `pdf` mode + `generate-pdf.mjs`. Returns `jobId`.
- `[POST]/applications/:num/apply` — runs `apply` mode.
- `[POST]/applications/:num/deep` — runs `deep` mode.
- `[POST]/applications/:num/interview-prep` — runs `interview-prep` mode, writes `{company}-{role}.md`.
- `[POST]/applications/:num/followup` — drafts outreach.
- `[GET]/applications/:num/pdf` — streams the latest matching PDF for download.
- `[GET]/applications/:num/report.md` — raw markdown of the report.

### Pipeline
- `[GET]/pipeline` — pending URLs.
- `[POST]/pipeline` — append a URL.
- `[DELETE]/pipeline/:idx` — remove an entry.
- `[POST]/pipeline/process` — run the `pipeline` mode. Returns `jobId`.

### Scan
- `[GET]/portals` / `[PUT]/portals` — read/write `portals.yml`.
- `[POST]/scan` — spawn `scan.mjs` (optional `--company`, `--dry-run`). Returns `jobId`.
- `[GET]/scan/history` — last N rows of `scan-history.tsv`.

### Insights
- `[GET]/insights/patterns` — `analyze-patterns.mjs` output (status breakdown, score histogram, time-to-respond).
- `[GET]/insights/followups` — `followup-cadence.mjs` output (who to ping next).
- `[GET]/insights/health` — `verify-pipeline.mjs` output (orphan reports, missing PDFs, status drift).

### Reports
- `[GET]/reports?sort=score|date&limit=` — list with front-matter (score, URL, legitimacy, PDF, date).
- `[GET]/reports/:filename` — raw markdown.

### Jobs / events
- `[GET]/jobs` — recent runs.
- `[GET]/jobs/:id` — final result.
- `[GET]/jobs/:id/events` — SSE stream of log lines + progress.
- `[POST]/jobs/:id/cancel` — kill child process / abort LLM request.

### System
- `[GET]/system/setup` — career-ops path, required files, Playwright check, profile validity.
- `[GET]/system/events` — SSE for filesystem invalidations.
- `[POST]/system/update/check` — runs `update-system.mjs check`.
- `[POST]/system/update/apply` — runs `update-system.mjs apply` after confirmation.
- `[GET]/system/llm` — currently selected provider/model.
- `[PUT]/system/llm` — switch provider/model.

---

## 8. Frontend (React) — screen-by-screen redesign

The sidebar stays. Routes map to career-ops concepts; some screens are renamed; new screens are added.

### Existing → renovated

| Old | New | What it shows |
|---|---|---|
| Dashboard | **Dashboard** | KPI cards (counts by canonical status), score histogram, "what to do next" cards driven by `followup-cadence` + `verify-pipeline`, pipeline queue snippet, recent reports list. Replaces `JR_DATA.applications`. |
| New application | **Evaluate** | Paste JD URL or text → POST `/applications/evaluate` → live log panel (SSE) → renders the new report's Blocks A–F + score + legitimacy badge. CTA: "Generate PDF", "Add to tracker" (already done if mode auto-merged). Removes the chat-based CV revision flow in v1; the report itself is the canonical artifact. |
| History | **Applications** | Server-driven table of `applications.md`. Filter by status (canonical enum), sort by score/date, click row → drawer with report markdown + PDF preview + status editor + interview-prep + follow-up actions. |
| Memory | **Memory** | Three tabs: **Stories** (`story-bank.md` STAR+R editor), **Proof points** (`article-digest.md`), **Writing samples** (`writing-samples/` browser). The old per-category seed data is dropped; the file-backed structure replaces it. |
| About you (Profile) | **Profile** | Form for `profile.yml`. Advanced section ("Archetypes & overrides") edits `modes/_profile.md` as a markdown textarea with field hints. |
| Settings | **Settings** | Career-ops path display (read-only if submodule), LLM provider + model picker, language picker (en/de/fr/ja/pt/ru), "Run update check" button, link to setup wizard, raw `.env.local` debug. |

### New screens

- **Scan** (`/scan`) — portals.yml table editor (add/edit/disable companies), "Run scan" button + live log, scan history table.
- **Pipeline** (`/pipeline`) — pending URLs list, "Process all" button (runs pipeline mode), per-row evaluate/delete.
- **Reports** (`/reports`) — full report library with score sort, search, markdown viewer; deep-links to the application row.
- **Insights** (`/insights`) — three cards: patterns, follow-up cadence, pipeline health. Data from the three `/insights/*` endpoints.
- **Interview prep** (`/applications/:num/interview-prep`) — per-app intel viewer/editor.
- **Setup** (`/setup`) — checklist wizard shown automatically when `GET /system/setup` reports anything missing.

### Cross-cutting UI

- **Job runner toast.** Whenever a route returns a `jobId`, a global toast subscribes to its SSE stream and shows a progress bar + tail log. Click expands to a side drawer. The same drawer surfaces in /scan, /pipeline, /evaluate.
- **State store.** Replace `src/data.js` with a small fetch-based store (no Redux). One hook per resource (`useApplications`, `useProfile`, ...) that reads from `/api/*` and invalidates on `/system/events`. Keep the in-memory `JR_DATA` only for a "Demo Mode" Settings toggle that bypasses the API.
- **Theming.** Keep current dark/density tweaks. Add a "match career-ops" preset that uses career-ops dashboard colors for users who like the consistency.
- **PDF preview.** Replace the in-browser PDF builder in `src/screens.jsx` (`createCvPdf`, `buildPdfRows`, ...) with `<embed src="/api/applications/:num/pdf">`. That code can be deleted entirely once the runner-backed PDF is wired up.

---

## 9. Shared schemas (`shared/schemas/`)

New/updated zod schemas matching career-ops file shapes. The mode bridge validates LLM output against these before persisting.

```
shared/schemas/
├── profile.js          ← profile.yml { name, email, location, timezone, target_roles[], salary_target, narrative, archetypes? }
├── application.js      ← { num, date, company, role, status (enum), score (0..5), pdf, reportPath, notes }
├── cv.js               ← cv.md sections (header, summary, experience[], projects[], education, skills)
├── pipeline.js         ← { url, company?, role?, addedAt }
├── portal.js           ← { name, careers_url, scan_method, api?, scan_query?, notes?, enabled }
├── report.js           ← front-matter { score, url, legitimacy, pdf } + raw markdown body
├── story.js            ← { situation, task, action, result, reflection, tags[] }
├── modeOferta.js       ← LLM output schema for the oferta mode
├── modePdf.js          ← LLM output schema for the pdf mode
└── ...                 ← one schema per supported mode
```

The existing `shared/schemas/cv.js` already has the right shape from the DeepSeek flow; it just needs to be retargeted at `cv.md` as the persistence backend.

---

## 10. Phasing (~3 weeks total, single dev)

Each phase ends with a **verifiable** demo. No "infrastructure-only" phases.

### Phase 0 — Bootstrap (½–1 day)
- Add career-ops as `git submodule`. Pin to current `main` SHA.
- `.env.example`: `CAREER_OPS_PATH=`, `LLM_PROVIDER=deepseek`, provider keys.
- New `server/careerOps/paths.js` + `GET /api/system/setup`.
- New `/setup` route in React showing the checklist.
- **Verify:** `npm run dev:all` from a fresh clone — setup screen turns all-green after `git submodule update --init && cd career-ops && npm install && npx playwright install chromium`.

### Phase 1 — Read-only mirror (2–3 days)
- Parsers: profile.yml, cv.md, applications.md, pipeline.md, portals.yml, story-bank.md, scan-history.tsv, reports/*.
- Routes: `GET /profile`, `GET /cv`, `GET /applications`, `GET /applications/:num`, `GET /pipeline`, `GET /portals`, `GET /scan/history`, `GET /story-bank`, `GET /reports`.
- Rewire **Dashboard**, **Applications** (renamed from History), **Memory**, **Profile** to read from the new endpoints.
- Drop `JR_DATA`-driven content from those screens (keep a Demo Mode toggle).
- **Verify:** With a real career-ops repo, every existing screen shows real data and the screens that used to render seed data now reflect what's on disk. No writes yet.

### Phase 2 — Write-back for User Layer files (2–3 days)
- Writers + zod validation: profile.yml (+ `_profile.md` split), cv.md, portals.yml, story-bank.md, article-digest.md, pipeline.md (append/remove), applications.md (status/notes-only patch).
- Routes: `PUT /profile`, `PUT /cv`, `PUT /portals`, `PUT /story-bank`, `PUT /article-digest`, `POST /pipeline`, `DELETE /pipeline/:idx`, `PATCH /applications/:num/status|notes`.
- Forms in Profile, Memory, Settings (portals editor), Pipeline, Applications drawer.
- mtime ETag round-trip to avoid clobbering concurrent edits.
- File watcher + `/system/events` SSE so the SPA reacts to external changes.
- **Verify:** Edit profile.yml in a text editor, see SPA update within ~1s. Change status in SPA, see applications.md row update with no other rows touched.

### Phase 3 — Script runner integration (3–4 days)
- `server/careerOps/runner.js` + `/api/jobs/:id/events` SSE.
- Wrap: `scan.mjs`, `merge-tracker.mjs`, `verify-pipeline.mjs`, `analyze-patterns.mjs`, `followup-cadence.mjs`, `check-liveness.mjs`, `update-system.mjs`.
- Routes: `POST /scan`, `POST /jobs/:id/cancel`, `GET /insights/patterns|followups|health`, `POST /system/update/check|apply`.
- Frontend: **Scan** screen, **Insights** screen, job-runner toast/drawer.
- **Verify:** Click "Run scan" → live log streams → pipeline.md updates → Pipeline screen shows new entries without a refresh.

### Phase 4 — Mode bridge (3–5 days)
- `server/careerOps/modeBridge.js` + zod schemas per mode.
- LLM provider abstraction (`server/services/llm/`).
- Wrap modes (in order): `oferta` → `pdf` → `auto-pipeline` → `pipeline` → `apply` → `interview-prep`.
- Server-side report renderer (JSON → `reports/{num}-{slug}-{date}.md`) so we never trust the LLM to handcraft the canonical markdown header.
- Hookup of `generate-pdf.mjs` after the `pdf` mode produces HTML.
- Routes: `POST /applications/evaluate`, `POST /applications/:num/pdf|apply|interview-prep|deep|followup`, `POST /pipeline/process`.
- Frontend: **Evaluate** screen (replaces NewApplication), report viewer, per-app action buttons in the Applications drawer.
- **Verify:** Paste a real JD URL → report appears in `reports/` with Score/URL/Legitimacy header → tracker row appears in applications.md → "Generate PDF" produces a PDF in `output/` matching career-ops's filename convention.

### Phase 5 — Batch + polish (2–3 days)
- `POST /batch` with TSV upload; parallel worker pool calling `oferta` mode.
- Batch screen with per-row progress.
- Language picker → forwards to `modes/<lang>/<name>.md` when available.
- Theming pass; keyboard shortcuts.
- **Verify:** Upload a 10-URL TSV → 10 reports + 10 tracker rows in under a couple of minutes, all visible live in the Applications screen.

### Phase 6 — Hardening (1–2 days)
- Snapshot tests for every parser/writer (round-trip on real career-ops fixtures).
- Mode bridge integration tests (record/replay against a stub LLM).
- Error UX: missing files, missing Playwright, LLM provider not configured, write conflicts.
- Drizzle/Supabase code moved to `_archive/` to remove dead-import noise.
- **Verify:** `npm run test` is green; manual chaos test (delete career-ops file mid-flow) yields a friendly error not a 500.

---

## 11. Migration of existing JobMuse code

| Existing file | Disposition |
|---|---|
| `src/App.jsx` | Keep shell. Add /scan, /pipeline, /reports, /insights, /setup to NAV. Rename "New application" → "Evaluate", "History" → "Applications", "About you" → "Profile". |
| `src/screens.jsx` | Split per-screen into `src/screens/` (one file each). Delete the in-browser PDF builder. Evaluate screen is fully rewritten. |
| `src/data.js` | Demoted to demo seed; loaded only when `Settings → Demo Mode` is on. |
| `src/data.private.js` | Untouched. |
| `src/ai/client.js` | Repointed at the new endpoints (`/applications/evaluate`, etc.). |
| `server/routes/cv.js`, `server/services/deepseek.js` | Replaced by mode bridge. Old endpoints (`/api/generate-cv`, `/api/revise-cv`) kept as deprecated shims that proxy to `/api/applications/evaluate` for one release, then removed. |
| `server/db/`, Drizzle, Supabase | Parked. Not deleted destructively (commit-history reachable). Moved to `_archive/` in Phase 6 to clear the import surface. |
| `shared/cvRevisions.js` | Kept for the deprecation window, then deleted. |
| `shared/schemas/cv.js` | Reused; backing changes from JSON-in-memory to `cv.md`. |

---

## 12. Risks, mitigations, open questions

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Mode bridge output diverges from Claude Code's native run | High | Medium | Strict zod schemas; server-side markdown rendering of reports; deep-link to "open this in Claude Code" for power users; document the gap honestly in the report footer. |
| User opens the Go TUI / edits files manually mid-flow | Medium | Low | File watcher + ETag mtime checks; show "External change detected — reload?" toast. |
| `applications.md` corrupted by a careless in-place edit | Medium | High | Never write rows directly; only the `merge-tracker.mjs` path adds rows. Status/notes patches operate on a single row, validated by re-parsing the whole file before/after. |
| Status enum drift (e.g., upstream adds a 9th status) | Low | Medium | Enum is read from `templates/states.yml` at boot, not hardcoded. |
| Playwright/Chromium missing at runtime | High at first run | Medium | Setup screen blocks until present; "Run setup" CTA explains the install command. |
| LLM provider key missing | Medium | Low | Mode bridge falls back to mock output (same pattern the current `deepseek.js` uses) with a clear "mock" badge. |
| Submodule pin lag → upstream new modes invisible | Low | Low | Settings has "Run update check"; show a notification when upstream is ahead. |
| User wants to use the GUI on their existing career-ops checkout | Medium | Low | `CAREER_OPS_PATH` env var supports this. Submodule is the default, not the only path. |
| Concurrent SSE jobs flood the UI | Low | Low | Cap concurrent jobs at 4 (configurable); queue beyond. |
| Cost spike from LLM provider | Medium | Medium | Track via existing `aiUsage` shape (move to a flat log file under `data/`); show estimated cost in the job toast before kicking off batch runs. |

### Open questions for the user
1. **LLM provider default.** Stay on DeepSeek V4 Flash for v1, or default to Claude (the career-ops author's primary target)?
2. **Submodule vs. external path default.** Submodule gives one-command setup but couples our release to upstream. Acceptable?
3. **i18n.** Career-ops ships DE/FR/JA/PT/RU modes. Expose the language picker in v1 (untested), or hide until QA'd?
4. **The chat-based CV revision flow** (current "New application" → side chat) doesn't have a direct career-ops equivalent. Drop it in v1, or keep as a custom layer on top of the report?
5. **PDF preview**: career-ops's HTML CV template is its design source of truth. Are we OK letting the GUI just embed the resulting PDF, rather than re-rendering CV sections in React?

---

## 13. Success criteria (definition of done for v1)

A user with a fresh laptop can:

1. `git clone --recurse-submodules` JobMuse, run `npm install`, `npx playwright install chromium` (one-line setup script), then `npm run dev:all`.
2. Open `http://localhost:5173`, complete the setup wizard, fill in their profile, paste their CV.
3. Paste a job URL → see Blocks A–F + score + legitimacy verdict within ~30s.
4. Click "Generate PDF" → download an ATS-styled PDF that matches career-ops's reference template.
5. See the application in the Applications table with the canonical status enum.
6. Update status, add notes, write follow-ups, all from the GUI.
7. Run a scan across configured portals → see new URLs flow into the pipeline.
8. Click "Process pipeline" → batch-evaluate every pending URL.
9. View pattern analytics and follow-up reminders.
10. Pull upstream career-ops updates from Settings without losing any data in the User Layer.

Everything above happens without the user opening a terminal after the initial install.

---

## 14. Out of scope for v1 (parking lot)

- Multi-user / multi-workspace support.
- Cloud hosting; the app is local-first by design.
- Mobile UI polish (current responsive code is fine, not pretty).
- Direct LinkedIn integration (career-ops's `contacto` mode handles this; we expose it but don't add OAuth).
- Auto-submit / form-fill. Career-ops explicitly forbids it; we preserve that boundary.
- Postgres-backed multi-device sync. Revisit when there is a real second-device need.

---

## Appendix A — Quick reference: file → mode → script touchpoints

```
JD URL ──▶ POST /applications/evaluate
        ──▶ mode: oferta  ─── reads: cv.md, profile.yml, article-digest, story-bank
                          ─── writes: reports/{num}-{slug}-{date}.md
                          ─── stages: batch/tracker-additions/{num}-{slug}.tsv
        ──▶ runner: merge-tracker.mjs
                          ─── appends: data/applications.md
        ──▶ mode: pdf     ─── reads: cv.md, templates/cv-template.html
                          ─── writes: /tmp/cv-{cand}-{company}.html
        ──▶ runner: generate-pdf.mjs <html> <pdf> --format=letter
                          ─── writes: output/cv-{cand}-{company}-{date}.pdf

Scan ─────▶ POST /scan
        ──▶ runner: scan.mjs [--company X]
                          ─── reads: portals.yml, data/scan-history.tsv
                          ─── writes: data/pipeline.md, data/scan-history.tsv
```

## Appendix B — One-line install script (proposed)

```bash
git clone --recurse-submodules https://github.com/<you>/JobMuse.git \
  && cd JobMuse \
  && npm install \
  && (cd career-ops && npm install && npx playwright install chromium) \
  && cp .env.example .env.local \
  && npm run dev:all
```

---

*End of plan. Next step: confirm answers to §12 open questions, then start Phase 0.*
