# JobMuse - Build Plan 02 (Make it real)

This is the follow-up to `BuildPlan-01.md`. That plan got the React + Vite scaffold, AI proxy, and prototype UI running locally with mock data and disabled actions. **This plan turns that working shell into a real, multi-user product.**

The current site renders, navigates, calls DeepSeek for CV generation/revision, and looks correct at four viewports. **Almost everything else is mocked.** Refresh the page and every action you took is gone. The current public seed user is hard-coded demo data in `src/data.js`; real resume-backed seed data must stay in ignored local files. Every list (applications, memory facts, settings) is still a static array. Many buttons are disabled with `title="… not implemented in this local prototype yet."`

The work below is large. Treat it as a roadmap: each phase is shippable on its own, and Phases 1–10 cover the minimum for a real product. Phases 11+ are productisation (billing, email, telemetry, deploy).

Authoritative grounding:
- `src/data.js` (mock dataset, single user)
- `src/screens.jsx` (every screen — disabled buttons listed inline)
- `src/App.jsx` (route state, sidebar)
- `src/ai/client.js`, `server/index.js`, `server/routes/cv.js`, and `server/services/deepseek.js` (the live local AI path)
- `shared/schemas/` (zod schemas reused by browser and server code)
- `package.json` (Vite 8, React 18, plugin-react 6, Express, Drizzle, Supabase client, zod)
- `vite.config.js` (Vite + React + `/api` proxy to the local Express API)

---

## 0. Current Status

**Real today (carry-overs from `BuildPlan-01.md`):**

- React + Vite app, Vite 8, React 18.3.1, plugin-react 6.
- Local Express API in `server/index.js` on port `8787`; Vite proxies `/api` to it.
- CV generation/revision routes in `server/routes/cv.js`, backed by `server/services/deepseek.js`.
- The old `server/aiProxy.js` compatibility wrapper has been removed; `vite.config.js` proxies `/api` to the standalone Express server.
- DeepSeek `chat/completions` calls with strict-JSON prompting, response normalization, and validators in `shared/schemas/cv.js`.
- Mock fallback when no API key is set or DeepSeek errors.
- `DEEPSEEK_API_KEY` lives only in `.env.local` (server-side); the client bundle is verified clean of secrets.
- Drizzle/Supabase database scaffold exists in `server/db/`, with generated migrations under `server/db/migrations/`.
- Shared zod schemas exist for CV, profile, memory, application, settings, and JD signals.
- `npm run server`, `npm run dev:all`, `db:generate`, `db:migrate`, and `db:studio` scripts are present.
- Responsive layout at 1280×800, 1024×768, 768×1024, 390×844.
- Result panes for Job description, Tailored CV, and Revise with AI are user-resizable on desktop, with stacked fallback on narrow/mobile layouts.
- The active CV can download as a local, selectable text PDF from the browser. This is enough for the current prototype; persisted, server-side PDF export remains Phase 8.
- 0 console warnings, 0 npm audit advisories.

**Mock today (everything below is the scope of this plan):**

The "Fakeness inventory" in §3 is the full catalogue. The headlines:

- No accounts, no auth, no sessions. Single hard-coded user.
- No database. Refreshing the page resets every interaction.
- Applications list, memory facts, dashboard stats, JD signals, match score, CV diff, and settings are all static arrays in `src/data.js`.
- Profile inputs use `defaultValue` (uncontrolled) and "Save changes" only sets local React state.
- The 7-phase progress bar in CV generation is cosmetic — it ticks even when DeepSeek returns in 800ms.
- AI chat revisions now mutate the displayed CV in the local/live response path, but the change is still session-only until persistence and revision history land.
- Disabled buttons (per `screens.jsx` `title=` attributes): Apply, Edit, Replace photo, Discard, Add fact, New category, Open original JD, workspace switcher. PDF now has a client-side text download for the active CV, but the persisted server-side export in Phase 8 is still the product-grade target.
- Two search inputs (sidebar `Search…`, History `Search company or role…`) have no `onChange`.
- Settings rows render, but no row writes anywhere; `ToggleStub` flips a local React state only.
- The active public seed identity uses non-private demo data; real resume-backed local seed data is intentionally ignored. Profile fields are still uncontrolled and not persisted.

**Direction this plan recommends (full rationale in §4):**

- Backend: use the real Node + Express service in `server/`, served beside Vite in dev via `vite.proxy`.
- Database + auth + file storage: **Supabase** as the default. Postgres + Supabase Auth + Supabase Storage in one managed service, with row-level security from day one. (Alternative: Neon + better-auth + S3-compatible storage — listed as decision D-DB-1.)
- ORM: **Drizzle ORM** for type-safe SQL with shared schema between client and server.
- Routing: **React Router v6** to replace the `useState` route in `src/App.jsx`.
- Server state: **TanStack Query** for fetch caching, optimistic updates, retries.
- Forms: **react-hook-form + zod** with the same zod schemas reused by the server.
- PDF export: **Playwright** server-side, rendering the same React CV component to a print stylesheet (most ATS-faithful path; alternatives in D-PDF-1).
- Hosting: **Vercel** for the frontend + the API routes (Vite SSG-style build for `/`, Express adapter for `/api/*`); alternative: split frontend on Vercel + backend on Fly.io / Render (D-HOST-1).

---

## 1. Goal

"Fully functional" means a real user — not a hard-coded seed profile — can land on the site, sign up, paste a job description, get a CV, save it, see it in their history next session, edit their memory facts, export a PDF, and pay for the product. Concretely:

1. **Sign up / log in** with email + password and at least one OAuth provider.
2. **Persisted profile** that survives logout/refresh, with photo upload.
3. **Persisted memory facts** with full CRUD, categories, manual + import sources.
4. **Persisted applications**: every "Generate CV" creates a row; status (Draft/Applied/Interview/Offer/Rejected/Ghosted) is editable; notes per application; deep link to the original JD URL.
5. **Real JD signal extraction**: signals come from DeepSeek (or rule-based fallback), not a static array.
6. **Real CV tailoring**: revisions in the chat actually mutate the CV state and that mutation is what gets saved/exported.
7. **Real match score**: computed from CV-vs-JD overlap + AI judgment, not the literal `87`.
8. **Real PDF export**: ATS-readable, single-column, no images.
9. **Resume upload → memory facts**: drop a PDF/DOCX, get parsed bullets into Memory.
10. **Working search** in History and Memory, plus a global ⌘K search.
11. **Real settings**: every Settings row writes through to a `user_settings` row.
12. **Account deletion + data export** (GDPR/CCPA hygiene; non-negotiable for a tool that holds CVs).
13. **Email** at minimum for signup confirmation, password reset.
14. **Telemetry + error tracking** wired but minimal.
15. **Deployable**: one command from a fresh clone gets a working dev environment; one push deploys.

Stretch (this plan describes but defers to later phases):
16. Billing (Stripe) — the sidebar already advertises "Free until graduation. Then $9/mo."
17. Email notifications (status reminders, interview prep).
18. Cover letter generation.
19. Multi-CV / multi-resume profiles.
20. Team / workspace support (the workspace switcher is currently disabled).

---

## 2. Why this is bigger than `BuildPlan-01.md`

`BuildPlan-01.md` was scaffolding. The deliverable was "the page renders." This plan is a real backend, schema design, identity, file storage, and at least nine new persistent surfaces. Estimate: 6–10 weeks of focused work for one engineer to reach Phases 1–10. Phases 11+ are weeks more.

Three constraints worth surfacing early:

1. **AI cost.** Today the proxy calls DeepSeek on every Generate and every chat turn. A signed-up user clicking around will multiply that. Add server-side rate limiting, per-user quotas, and a cheap "cache by JD-hash" before opening sign-up.
2. **Data sensitivity.** A CV is PII. Whoever holds it must be able to export and delete it. Plan for that in the schema and the API from Phase 1, not retrofitted.
3. **One-engineer surface area.** "Real product" has a long tail of small surfaces (settings, search, account UI, password reset, email templates). Don't try to ship them all at once — Phases 1–6 cover the must-haves.

---

## 3. Fakeness inventory

Every mocked surface, with the file and line where it lives. This is the work list.

### 3.1 Identity & persistence

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-AUTH-1 | No accounts | n/a (absence) | Single hard-coded user from `src/data.js:3–10`. Same user for every browser. | Sign up / log in flow, sessions, OAuth. |
| F-PERSIST-1 | No database | n/a (absence) | All data is static module exports in `src/data.js`. Refresh wipes any state. | Postgres-backed CRUD for users, applications, memory, CVs, settings, files. |
| F-PROFILE-1 | Profile inputs uncontrolled | `screens.jsx:1072–1084` | `<Input defaultValue={...}/>` × 9 — typing changes the input but no `onChange`, no controlled state, no save. | `react-hook-form` controlled inputs writing to `user_profile`. |
| F-PROFILE-2 | "Save changes" is a state flip | `screens.jsx:1088` | `onClick={() => setSaved(true)}` — only changes the button label. | `PATCH /api/profile` + invalidate React Query. |
| F-PROFILE-3 | "Discard" disabled | `screens.jsx:1087` | `disabled title="Form reset is not implemented…"` | Reset form to last persisted values via `react-hook-form` `reset()`. |
| F-PROFILE-4 | "Replace photo" disabled | `screens.jsx:1068` | Disabled button. | Upload to Supabase Storage, write `avatar_url` on `users`. |
| F-PROFILE-5 | Mock identity still static | `screens.jsx`, `src/data.js` | Seed profile comes from a hard-coded public demo object; any real local resume seed is ignored and not user-owned database rows. | All values come from `users` row. |

### 3.2 Applications (the History tab + the New Application flow)

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-APPS-1 | Application list is static | `src/data.js:12–23`, `screens.jsx:73, 840` | 10 hard-coded rows. | `applications` table; `GET /api/applications` paginated. |
| F-APPS-2 | History search input no-op | `screens.jsx:854` | `<Input placeholder="Search company or role…">` with no `onChange`. | Server-side ILIKE / FTS query, debounced client search. |
| F-APPS-3 | Status not editable | `screens.jsx:923` | `<StatusDot/> {a.status}` — read-only. | Click → dropdown → `PATCH /api/applications/:id`. |
| F-APPS-4 | Application detail view missing | `screens.jsx:905–930` | Row has `cursor: "pointer"` but no `onClick`. | Route `/app/:id` rendering JD + CV + revision history + notes. |
| F-APPS-5 | "New" doesn't create a record | `screens.jsx:856` | `onClick={() => go?.("new")}` only routes; no DB write happens until generation completes — and even then nothing is persisted. | `POST /api/applications` returns id; redirect to `/app/:id`. |
| F-APPS-6 | Match score is invented | `src/data.js`, `server/services/deepseek.js` (`clampMatch`) | DeepSeek can return any number; otherwise hard-coded fallback score. | Compute from CV/memory–vs–JD overlap (skills, role title, fit signals) + AI confidence; store on the record. |

### 3.3 Memory facts

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-MEM-1 | Memory facts static | `src/data.js:25–55` | 17 hard-coded facts across 6 categories. | `memory_facts` table; `GET /api/memory`. |
| F-MEM-2 | "Add fact" disabled | `screens.jsx:1007` | Disabled button. | Modal → `POST /api/memory`. |
| F-MEM-3 | "New category" disabled | `screens.jsx:989` | Disabled button. | Categories live on the row (free-text) or a separate `memory_categories` table — see D-MEM-1. |
| F-MEM-4 | Per-row chevron does nothing | `screens.jsx:1033–1035` | Row has `cursor: "text"` but no editor. | Inline edit or right-side detail panel; `PATCH /api/memory/:id`. |
| F-MEM-5 | "Source" labels are decorative | `data.js` `source: "resume.pdf"` etc. | No file backing the labels. | Source is either `manual` or a foreign key to an uploaded `files` row. |
| F-MEM-6 | Memory passed to AI but never selected | `src/screens.jsx`, `server/services/deepseek.js` | The full memory dump goes to DeepSeek every time. | Score relevance per JD signal, send only the top-N facts to keep prompt cost down. |

### 3.4 The CV / JD / Chat trio

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-CV-1 | The 7-phase progress bar is decorative | `screens.jsx:211–267` | `phases` ticks every 380ms while DeepSeek runs once. | Either remove and show one spinner with status text, or stream real progress events from the server (Server-Sent Events). |
| F-CV-2 | Chat revisions are session-only edits | `screens.jsx`, `shared/cvRevisions.js`, `server/services/deepseek.js` | Fixed for the current session: revision responses include a revised CV body and the client applies it. Still fake as product behavior because no `cv_revisions` row, revert UI, or before/after diff exists. | Server returns a JSON Patch (RFC 6902) or a typed diff; client applies it, persists a `cv_revisions` row, and shows before/after highlighting. |
| F-CV-3 | "Edit" CV inline disabled | `screens.jsx:718` | Disabled button. | Click → contenteditable section or modal with `react-hook-form`. |
| F-CV-4 | PDF export is local-only | `screens.jsx` | The active CV can now download as a selectable text PDF in the browser, but it is not backed by persisted CV ids, print routes, or user filename settings. | `POST /api/cv/:id/pdf` → returns an `application/pdf` blob from the persisted CV; client downloads. |
| F-CV-5 | "Apply" disabled | `screens.jsx:388` | Disabled button. | Open the original JD URL (stored on the `applications` row) in a new tab; track click in `application_events`. |
| F-CV-6 | Open original JD disabled | `screens.jsx:676` | Disabled button. | Same as F-CV-5 — needs `original_url` on the `applications` row. |
| F-CV-7 | "What changed vs. your base CV" is static | `screens.jsx:794–798`, `data.js:132–137` | `D.cvChanges` is a hand-written list. | Computed by diffing the generated CV against the user's base CV (also stored). |
| F-CV-8 | "Pulled X facts from memory" is invented | `screens.jsx:375` | `Object.values(D.memory).flat().length - 6`. | Returned by the AI proxy; based on actual selected facts. |
| F-CV-9 | "v1 · draft" pill is a decoration | `screens.jsx:715` | Static text. | Real version count from `cv_revisions`; `draft` reflects `applications.status === "Draft"`. |
| F-CV-10 | Highlight phrases hard-coded | `screens.jsx:737, 783` | `[{ phrase: "designer's eye" }, ...]` baked into the renderer. | Phrases come from the AI response (alongside the CV text). |
| F-CV-11 | Suggestion chips hard-coded | `screens.jsx:450–456` | 5 fixed suggestions with hard-coded replies. | Generate suggestions per CV/JD pair from the AI, or remove. |

### 3.5 Dashboard & navigation

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-DASH-1 | Stats invented | `screens.jsx:74–79` | "This week: 3", "Reply rate: 34%", "industry avg 12%". | Computed from `applications` + `application_events`. |
| F-DASH-2 | Subtitle invented | `screens.jsx:85` | "Three drafts open. Two interviews this week. One offer waiting on you." | Computed from real status counts. |
| F-DASH-3 | Memory snapshot static | `screens.jsx:159–164` | Reads from `D.memory`. | Read from `memory_facts` aggregated by category. |
| F-NAV-1 | Sidebar search no-op | `App.jsx:215–219` | `<input placeholder="Search…">` with no handler. | Global ⌘K modal with FTS over applications + memory + CVs. |
| F-NAV-2 | Sidebar `route` is `useState` | `App.jsx:49, 73–83` | Navigation state lives only in memory; `⌘K` jumps to `new` but the URL never changes. | React Router v6 with browser history. |
| F-NAV-3 | Workspace switcher disabled | `App.jsx:189–206` | Disabled button. | Defer to phase 17 (teams) or remove from UI. |

### 3.6 JD signals & match logic

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-JD-1 | `jdSignals` static | `data.js:140–153`, `screens.jsx:692, 304` | Same 12 phrases for every JD. | Either run a server-side regex/keyword pass per JD, or have DeepSeek return signals as a structured list with `{phrase, kind, weight}`. |
| F-JD-2 | "{N} signals detected on paste" lies | `screens.jsx:304` | Always shows `D.jdSignals.length` regardless of pasted JD. | Trigger the signal extraction on paste/blur; show real count. |

### 3.7 Settings

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-SETTINGS-1 | All rows decorative | `screens.jsx:1095–1129` | Tone, length cap, file pattern, tone, etc. — none read from or write to anywhere. | `user_settings` table; `useQuery`/`useMutation` per row. |
| F-SETTINGS-2 | `ToggleStub` is per-row React state | `screens.jsx:1162–1177` | `useState(!!on)` resets on remount. | Bound to `user_settings`. |
| F-SETTINGS-3 | Account email & plan static | `screens.jsx:1124–1126` | Hard-coded email and "Student · free until graduation". | From `users` and (later) `subscriptions`. |

### 3.8 Tweaks panel

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-TWEAK-1 | Tweaks panel is dev-only | `App.jsx:112–135` | Reachable via `⌘.` shortcut; persists nothing. | Either gate behind `import.meta.env.DEV`, or persist user-relevant ones (dark mode, density) to `user_settings` and surface them in Settings. The CV layout / brand mark / coach hints are not user-facing controls. |

### 3.9 Other

| ID | Surface | File:line | What is fake | What "real" looks like |
|---|---|---|---|---|
| F-MISC-1 | "Free until graduation" card | `App.jsx:281–291` | Marketing copy. | Either implement the billing tier (D-BILL-1) or remove the card. |
| F-MISC-2 | The `delay` helper is cosmetic | `screens.jsx:21` | Used to time the fake progress bar. | Remove with F-CV-1. |
| F-MISC-3 | Sample JD prefilled | `screens.jsx:191` (`useState(D.sampleJD)`) | Every new application starts with the Cresta Data Science Intern JD. | Empty by default; show the sample only as a "Try a sample" button. |
| F-MISC-4 | No onboarding | n/a (absence) | A new account would land on a Dashboard reading the hard-coded seed profile over an empty DB. | Onboarding wizard: import resume → confirm extracted facts → land on Dashboard. |
| F-MISC-5 | No empty states for the real DB | `screens.jsx:1014–1019` (Memory has one) | Most lists have no empty state because they always have mock data. | Add empty states for History (no applications yet), Dashboard (no stats yet), Profile photo (no avatar yet). |
| F-MISC-6 | No account deletion / export | n/a (absence) | Cannot leave the app. | `POST /api/account/export`, `DELETE /api/account`. |

---

## 4. Architectural decisions

Each decision is **needed** and has a recommendation. Anything else is a delay tactic. Pick or reject before Phase 1 starts.

| ID | Decision | Recommended | Alternatives | Why this default |
|---|---|---|---|---|
| D-DB-1 | Database + auth + file storage | **Supabase** (Postgres + Auth + Storage) | Neon + better-auth + Cloudflare R2 / AWS S3; Convex; Firebase | One service covers DB, auth, RLS, file uploads, with a generous free tier and a sane SDK. The big tradeoff is vendor lock-in on Auth — RLS-based auth is hard to migrate off. If lock-in is a hard no, switch to Neon + better-auth. |
| D-ORM-1 | ORM | **Drizzle ORM** | Prisma; raw SQL via Supabase client | TS-first, lightweight, schemas live in code (shareable with client). Works fine with Supabase Postgres. |
| D-API-1 | Backend shape | **Express on Node, mounted at `server/index.js`. In dev, served by `vite.proxy`. In prod, deployed as a single Node process.** | Vite middleware plugin; Next.js 15 route handlers; Hono on Cloudflare Workers | Lowest churn from today's setup. Avoids the React Server Components / RSC migration that Next.js would force. |
| D-ROUTER-1 | Client routing | **React Router v6** | TanStack Router; Wouter | Mainstream, plays well with TanStack Query, and the only one whose API the team likely already knows. |
| D-STATE-1 | Server state | **TanStack Query (React Query) v5** | Native fetch + custom hook; SWR; RTK Query | Standard for this stack. Caching, retries, optimistic updates, invalidation are all first-class. |
| D-FORM-1 | Forms + validation | **react-hook-form + zod** (with `@hookform/resolvers`) | Formik; native `<form>` | Zod schemas can be reused on the server (the same validator that runs in `react-hook-form` runs in the Express handler). |
| D-PDF-1 | PDF export | **Server-side Playwright** rendering a print-stylesheet React route at `/print/cv/:id` | `@react-pdf/renderer` (declarative); `pdfkit`; `puppeteer` (same idea, heavier) | ATS systems strip non-text. Rendering the same React component to a print-only stylesheet means `Ctrl+P` and the server PDF look identical, and the output is real text, not images. |
| D-PARSE-1 | Resume parsing | **`pdfjs-dist` for PDF + `mammoth` for DOCX, then DeepSeek to extract memory facts** | Affinda / Sovren (paid resume parsing APIs); Textract | Good enough for MVP. Pay for a real parser only after seeing real failure rates. |
| D-AI-CHAT-1 | Chat patch shape | **JSON Patch (RFC 6902)** returned by the AI, validated server-side, applied client-side | Custom diff format; raw text replacement; have AI return the full new CV every turn | RFC 6902 is the smallest viable thing the model can generate reliably and the client can apply atomically. Falling back to "return full CV" is fine if the patch fails validation. |
| D-AI-COST-1 | AI cost control | **Per-user-per-day quota in Postgres + cache by `(jd_hash, profile_hash)` for 24h** | Stripe-metered billing per token; no quota | Without this, one curious user can rack up DeepSeek bills. Hash-cache catches the common case where someone clicks Generate twice on the same JD. |
| D-HOST-1 | Hosting | **Vercel for frontend + Express adapter for `/api/*`** | Fly.io for the whole app; Render; Railway; Cloudflare Pages + Workers | Vercel handles preview deployments per PR for free, and the serverless adapter is well-supported for Express. Move to a single VM (Fly/Render) only if WebSockets, long-lived processes, or Playwright-on-the-edge become blockers. |
| D-AUTH-METHODS-1 | Auth methods | **Email + password + Google + GitHub** | Magic link only; Passkeys; SSO | Email + password covers the long tail. Google + GitHub cover the design/eng audience this product targets. Passkeys later. |
| D-EMAIL-1 | Transactional email | **Resend** | Postmark; AWS SES; Mailgun | Best DX of the three. Bring-your-own-domain is straightforward. |
| D-OBS-1 | Observability | **Sentry (errors) + PostHog (product analytics)** | Datadog; Plausible (analytics-only); none | Both have generous free tiers and EU data-residency options. |
| D-BILL-1 | Billing (Phase 14) | **Stripe Checkout + Customer Portal** | LemonSqueezy; Paddle | Standard. Customer Portal saves you from building cancel/upgrade UI. |
| D-MEM-1 | Memory categories | **Free-text on the row, with a categories cache materialized from `DISTINCT category`** | Separate `memory_categories` table | Less schema, lets users name categories whatever they want without a migration. |
| D-MULTI-1 | Multi-CV per profile | **Defer to Phase 12.** Phase 1–10 assume one base CV per user. | Build it now | Adds a join everywhere. Not needed for v1. |

---

## 5. Target architecture

```
                ┌──────────────────────────────────────────┐
                │  Browser                                  │
                │  React + Vite + React Router + TanStack   │
                │  Query + react-hook-form + zod            │
                └───────────────┬──────────────────────────┘
                                │  fetch /api/*
                                ▼
        ┌────────────────────────────────────────────────┐
        │  Node + Express (server/)                       │
        │   - /api/auth/*       (Supabase session check)  │
        │   - /api/profile      GET, PATCH                │
        │   - /api/memory       GET, POST, PATCH, DELETE  │
        │   - /api/applications GET, POST, PATCH, DELETE  │
        │   - /api/cv/generate  POST (DeepSeek)           │
        │   - /api/cv/revise    POST (DeepSeek)           │
        │   - /api/cv/:id/pdf   POST (Playwright)         │
        │   - /api/files/upload POST (Supabase Storage)   │
        │   - /api/jd/signals   POST (DeepSeek)           │
        │   - /api/account/export, /api/account/delete    │
        │   - /api/ai-status    (existing)                │
        │   - rate limit + per-user quotas                │
        │   - zod schema validation (shared with client)  │
        └───────────────┬───────────────┬────────────────┘
                        │               │
                        ▼               ▼
                ┌────────────┐    ┌────────────────────┐
                │ Supabase   │    │ DeepSeek           │
                │  Postgres  │    │  /chat/completions │
                │  Auth      │    └────────────────────┘
                │  Storage   │
                └────────────┘
```

### Folder layout (additions on top of today)

```
JobMuse/
  index.html
  package.json
  vite.config.js                    # add vite.proxy → http://localhost:8787 in dev
  drizzle.config.js                 # NEW
  .env.example                      # add SUPABASE_*, RESEND_API_KEY, etc.
  shared/                           # NEW — code reused by client + server
    schemas/
      profile.js
      memory.js
      application.js
      cv.js
      jdSignal.js
      settings.js
  server/
    index.js                        # NEW — Express bootstrap
    db/
      client.js                     # Drizzle client (postgres-js or supabase-js)
      schema.js                     # all tables
      migrations/                   # generated by drizzle-kit
    routes/
      auth.js                       # session bridge for Supabase
      profile.js
      memory.js
      applications.js
      cv.js                         # generate + revise + PDF
      files.js
      jd.js
      account.js
    services/
      deepseek.js                   # extracted from aiProxy.js
      pdf.js                        # Playwright renderer
      parse.js                      # resume parsing
      patch.js                      # JSON Patch apply/validate
      quota.js                      # per-user rate + AI cost cap
    middleware/
      auth.js                       # require session
      validate.js                   # zod → Express
      rateLimit.js
  src/
    main.jsx
    App.jsx                         # mount Router, QueryClient, Auth provider
    routes/                         # NEW
      _layout.jsx                   # the sidebar shell
      home.jsx                      # Dashboard
      new.jsx                       # NewApplication input
      app.$id.jsx                   # NEW — single-application detail
      history.jsx
      memory.jsx
      profile.jsx
      settings.jsx
      auth.signin.jsx               # NEW
      auth.signup.jsx               # NEW
      auth.callback.jsx             # NEW (OAuth)
      print.cv.$id.jsx              # NEW (print stylesheet for PDF)
    api/                            # NEW — TanStack Query hooks per resource
      profile.js
      memory.js
      applications.js
      cv.js
      files.js
      auth.js
    components/
      ui.jsx
      TweaksPanel.jsx               # gate behind import.meta.env.DEV
      OnboardingWizard.jsx          # NEW
      MemoryEditor.jsx              # NEW
      ApplicationStatusMenu.jsx     # NEW
      ResumeDropzone.jsx            # NEW
      CVDiffView.jsx                # NEW
    styles/
      global.css
      print.css                     # NEW — used by /print/cv/:id
    state/
      session.js                    # auth provider
      queryClient.js
  src/data.js                       # SHRINK — keep only constant copy/labels;
                                    # remove user, applications, memory, sampleJD
                                    # (replace with empty-state copy + onboarding seed)
  test/                             # NEW
    e2e/                            # Playwright
    unit/                           # Vitest
```

---

## 6. Data model (proposed Postgres schema)

Phase 1 should land all of this even if some columns are unused yet, because adding columns later is cheap but adding tables later is migration cost. **All tables have `id uuid pk`, `created_at`, `updated_at`. All scoped tables have `user_id uuid fk → auth.users(id)`. All scoped tables have an RLS policy `user_id = auth.uid()`.**

```sql
-- Identity owned by Supabase Auth (auth.users).
-- We mirror the bits we care about into a public.users row.
public.users(
  id uuid pk references auth.users(id),
  email citext unique,
  display_name text,
  pronouns text,
  phone text,
  location text,
  open_to_remote boolean default true,
  personal_site text,
  github text,
  linkedin text,
  default_summary text,
  avatar_url text,
  initials text,        -- derived; cached for sidebar
  created_at timestamptz, updated_at timestamptz
)

public.user_settings(
  user_id uuid pk references public.users(id),
  default_tone text default 'direct',
  cv_length_cap text default '1page',
  auto_include_projects_when_jd_mentions text,
  show_changelog boolean default true,
  auto_capture_from_cover_letters boolean default true,
  confidence_threshold numeric(3,2) default 0.65,
  forget_facts_older_than interval,
  default_export_format text default 'pdf-letter',
  filename_pattern text default '{name}__{company}__{role}.pdf',
  include_source_links boolean default false,
  density text default 'cozy',
  dark_mode boolean default false,
  cv_layout text default 'split',
  updated_at timestamptz
)

public.memory_facts(
  id uuid pk,
  user_id uuid fk,
  category text,                      -- free text per D-MEM-1
  text text not null,
  source_kind text check (source_kind in ('manual','file','linkedin','interview-prep','import')),
  source_file_id uuid fk null references public.files(id),
  confidence numeric(3,2) default 1.0, -- only < 1 for AI-extracted facts
  created_at, updated_at
)

public.applications(
  id uuid pk,
  user_id uuid fk,
  company text not null,
  role text not null,
  original_url text,
  jd_text text,
  jd_signals jsonb,                    -- [{phrase, kind, weight}]
  match_score smallint,                -- 0..100
  status text check (status in
    ('Draft','Applied','Interview','Offer','Rejected','Ghosted')) default 'Draft',
  notes text,
  applied_at timestamptz,
  created_at, updated_at
)

public.cvs(
  id uuid pk,
  application_id uuid fk references public.applications(id) on delete cascade,
  version integer not null default 1,
  body jsonb not null,                 -- the structured CV (matches shared/schemas/cv.js shape)
  changes jsonb,                       -- the "vs base CV" change list
  generated_by text default 'deepseek',
  prompt_hash text,                    -- for cache lookups
  created_at,
  unique(application_id, version)
)

public.cv_revisions(
  id uuid pk,
  cv_id uuid fk references public.cvs(id) on delete cascade,
  user_message text,
  patch jsonb not null,                -- RFC 6902 patch
  reply text,
  created_at
)

public.files(
  id uuid pk,
  user_id uuid fk,
  storage_path text not null,          -- Supabase Storage object path
  filename text,
  mime text,
  size_bytes bigint,
  kind text check (kind in ('resume','avatar','export')),
  created_at
)

public.application_events(
  id uuid pk,
  application_id uuid fk,
  kind text check (kind in
    ('created','status_changed','cv_generated','cv_revised',
     'pdf_exported','external_apply_clicked','note_added')),
  payload jsonb,
  created_at
)

public.ai_usage(
  id uuid pk,
  user_id uuid fk,
  endpoint text,                       -- 'generate-cv' | 'revise-cv' | 'jd-signals'
  prompt_tokens int, completion_tokens int,
  model text, cost_cents numeric(10,4),
  created_at
)

-- For D-AI-COST-1
public.ai_quota(
  user_id uuid pk fk,
  day date,
  generates_used int default 0,
  revises_used int default 0,
  primary key(user_id, day)
)
```

Indexes (at least): `applications(user_id, created_at desc)`, `memory_facts(user_id, category)`, `cvs(application_id, version desc)`, `application_events(application_id, created_at desc)`, GIN on `applications.jd_signals` and `cvs.body` if querying inside JSON.

Row-level security policies on every scoped table: `user_id = auth.uid()`. The Express server uses the user's session JWT to talk to Postgres, so RLS does the access control — no need to filter in app code. (This is a primary reason to recommend Supabase.)

---

## 7. Backend API surface

Every endpoint requires a Supabase session unless noted. All requests/responses validated by zod schemas in `shared/schemas/*`. Errors return `{error: string, code: string}`.

```
GET    /api/ai-status                    # exists; expose user's quota state too
GET    /api/me                            # current user + profile
PATCH  /api/profile                       # F-PROFILE-2

GET    /api/memory                        # F-MEM-1, supports ?category, ?q
POST   /api/memory                        # F-MEM-2
PATCH  /api/memory/:id                    # F-MEM-4
DELETE /api/memory/:id

GET    /api/applications                  # F-APPS-1, supports ?status, ?q, ?cursor
POST   /api/applications                  # F-APPS-5; creates Draft app
GET    /api/applications/:id              # F-APPS-4
PATCH  /api/applications/:id              # F-APPS-3 (status, notes, original_url)
DELETE /api/applications/:id

POST   /api/cv/generate                   # body: {applicationId}; returns {cv, changes}
POST   /api/cv/:id/revise                 # body: {message}; returns {patch, reply}
POST   /api/cv/:id/pdf                    # returns application/pdf
GET    /api/cv/:id/print                  # HTML view used by Playwright

POST   /api/jd/signals                    # body: {jd}; returns [{phrase, kind, weight}]

POST   /api/files/upload                  # multipart; kind=resume|avatar
DELETE /api/files/:id

POST   /api/account/export                # zip of user's data
DELETE /api/account                       # cascading delete + auth.users delete

GET    /api/settings
PATCH  /api/settings                      # F-SETTINGS-1, F-SETTINGS-2

# Search
GET    /api/search?q=…                    # F-NAV-1; aggregates applications + memory + cvs
```

Auth endpoints are owned by the Supabase client SDK on the client; the server only verifies sessions in middleware.

---

## 8. Implementation phases

**Each phase has: files involved, work, exit criteria. Phases 1–10 are the must-haves. Phases 11+ can ship in any order.**

### Phase 1 — Backend foundation

**Files:** `server/index.js`, `server/db/client.js`, `server/db/schema.js`, `drizzle.config.js`, `package.json` (deps), `.env.example`, `vite.config.js` (proxy).

**New deps:** `express`, `cors`, `helmet`, `cookie-parser`, `zod`, `@supabase/supabase-js`, `drizzle-orm`, `drizzle-kit`, `postgres`, `dotenv`.

**Work:**
- Stand up a Supabase project (D-DB-1). Capture URL + anon key + service-role key in `.env.local`.
- Create the Postgres schema from §6 via Drizzle migrations.
- Bootstrap Express in `server/index.js` listening on `:8787`.
- Use `server/routes/cv.js` (Express router shape) for CV API routes.
- Add `vite.config.js` `server.proxy: { "/api": "http://localhost:8787" }`.
- Add `npm run server` script (`node --watch server/index.js`) and `npm run dev:all` (concurrently `vite` + `npm run server`).

**Exit criteria:**
- `npm run dev:all` starts both processes.
- `curl localhost:8787/api/ai-status` returns the JSON it does today.
- `drizzle-kit migrate` succeeds against Supabase Postgres.
- `psql` shows all tables from §6 with RLS enabled.

**Implementation status (2026-05-09):**
- Complete: dependencies, scripts, `.env.example`, `.gitignore`, standalone Express API, CV routes, DeepSeek service extraction, Vite `/api` proxy, shared zod schemas, Drizzle schema, generated migration, RLS SQL, Supabase auth middleware scaffold, request validation middleware, and removal of the obsolete `server/aiProxy.js` wrapper.
- Verified locally: `npm run build`, `npm audit`, direct Express API `/api/ai-status`, DeepSeek-backed `/api/generate-cv`, `npm run dev:all`, and Vite proxying `/api/ai-status` through `http://localhost:5173`.
- Pending external setup: create/configure the Supabase project, fill `SUPABASE_*` and `DATABASE_URL` in `.env.local`, run `npm run db:migrate`, and verify tables/RLS in Supabase or `psql`.
- Note: implementation uses `.js` files (`drizzle.config.js`, `shared/schemas/*.js`) to match the current JavaScript codebase. The Drizzle schema intentionally avoids a generated FK to `auth.users`; ownership is enforced in the Supabase RLS SQL and should be rechecked during the real Supabase migration.

### Phase 2 — Auth + sessions

**Files:** `src/state/session.js`, `src/routes/auth.signin.jsx`, `src/routes/auth.signup.jsx`, `src/routes/auth.callback.jsx`, `server/middleware/auth.js`, `server/routes/profile.js` (`GET /api/me`).

**Work:**
- Add `@supabase/auth-helpers-react` (or own `SessionProvider` around `supabase.auth.onAuthStateChange`).
- Build minimal sign-in / sign-up pages styled with the existing `ui.jsx` primitives.
- Enable Email + Password and one OAuth (Google or GitHub) in Supabase dashboard (D-AUTH-METHODS-1).
- Add a route guard wrapper that redirects unauthenticated users to `/auth/signin` for everything except `/auth/*`.
- Server middleware: read the `Authorization: Bearer <jwt>` header, call `supabase.auth.getUser`, set `req.user`. 401 if missing.
- On first-ever sign-in, server creates a `public.users` row (trigger or `POST /api/me/init`).

**Exit criteria:**
- A new email can sign up, receive the confirmation email (Supabase's templates are fine for now), and land on the Dashboard.
- Reload preserves the session.
- Sign-out returns to `/auth/signin`.
- `GET /api/me` returns the right user.

### Phase 3 — Profile persistence (F-PROFILE-1..5)

**Files:** `src/routes/profile.jsx` (replaces `Profile` in `screens.jsx`), `src/api/profile.js`, `server/routes/profile.js`, `shared/schemas/profile.ts`, `src/components/ResumeDropzone.jsx` (avatar), `server/routes/files.js`.

**Work:**
- Replace `defaultValue` inputs with `react-hook-form` + zod. Save → `PATCH /api/profile` → invalidate `useQuery(["me"])`.
- Implement avatar upload: Supabase Storage bucket `avatars/`, public URL, write `users.avatar_url`.
- Wire "Discard" to `reset()`.
- Remove the placeholder personal-site/GitHub/LinkedIn drift (F-PROFILE-5).

**Exit criteria:**
- Edit, save, refresh — values persist.
- Avatar upload writes a real file in Supabase Storage and shows immediately.

### Phase 4 — Memory CRUD (F-MEM-1..4)

**Files:** `src/routes/memory.jsx`, `src/api/memory.js`, `server/routes/memory.js`, `shared/schemas/memory.ts`, `src/components/MemoryEditor.jsx`.

**Work:**
- Replace `D.memory` reads with `useQuery(["memory", {category, q}])`.
- "Add fact" opens `MemoryEditor` modal → `POST /api/memory` → invalidate.
- Per-row click → inline edit (or right-side detail panel). Save → `PATCH`.
- Delete via row menu.
- Categories: free-text on the new-fact form, with a typeahead from `DISTINCT category`.
- Re-enable "New category" or remove from UI per D-MEM-1.

**Exit criteria:**
- Add, edit, delete, search, filter all work and survive refresh.
- Memory snapshot on Dashboard reflects real counts.

### Phase 5 — Applications CRUD (F-APPS-1..5)

**Files:** `src/routes/history.jsx`, `src/routes/app.$id.jsx`, `src/api/applications.js`, `server/routes/applications.js`, `shared/schemas/application.ts`, `src/components/ApplicationStatusMenu.jsx`.

**Work:**
- Replace `D.applications` reads with `useQuery(["applications", filter])`.
- Click row → `app/:id` detail route showing JD + saved CV(s) + revision history + status menu + notes.
- Status pill is a dropdown that writes through `PATCH /api/applications/:id`.
- New Application → on Generate, immediately `POST /api/applications` (Draft) and use the returned id everywhere downstream.
- Wire the History search input.

**Exit criteria:**
- New applications survive refresh.
- Status change persists; Dashboard "Two interviews this week" reflects reality.

### Phase 6 — CV generation + storage (F-CV-7..10, F-MEM-6, F-JD-1..2)

**Files:** `server/routes/cv.js`, `server/services/deepseek.js`, `server/services/quota.js`, `server/routes/jd.js`, `src/api/cv.js`, `src/routes/new.jsx`, `src/screens.jsx` (delete the now-unused logic, or split per phase).

**Work:**
- Keep prompt building in `services/deepseek.js` behind the real CV router.
- Save every generated CV to `cvs` (version starting at 1).
- Implement `/api/jd/signals` (DeepSeek call returning `[{phrase, kind, weight}]`) — drives F-JD-1, F-JD-2.
- Add prompt cache in Postgres keyed on `(user_id, sha256(jd), profile_hash)` — D-AI-COST-1.
- Add per-user-per-day quota in `ai_quota`; 429 with `X-Quota-Reset` when over.
- Replace static `D.cvChanges` with the AI-returned `changes`.
- Replace static highlight phrases with `cv.highlight` returned per section.

**Exit criteria:**
- Generating twice with the same JD is cached (no second DeepSeek call within 24h).
- Generating from a profile with empty Memory gives a sensible (if shorter) CV.
- Hitting the daily quota shows a clear UI error, not a hang.

### Phase 7 — Real CV revision via JSON Patch (F-CV-1, F-CV-2)

**Files:** `server/services/deepseek.js`, `server/services/patch.js`, `src/api/cv.js`, `src/routes/new.jsx`, `src/components/CVDiffView.jsx`.

**Work:**
- Change the revision prompt to demand a JSON Patch (RFC 6902) plus a short reply (D-AI-CHAT-1).
- Server validates the patch (`json-patch` library) against the current CV before applying. On failure, fall back to "regenerate full CV" mode.
- Client applies the patch to local `cv` state, writes a `cv_revisions` row, and shows a before/after diff for the affected section in `CVDiffView`.
- Replace the cosmetic 7-phase loader with a single status string from the server (or a real SSE stream if there's appetite — otherwise just delete the loader logic).

**Exit criteria:**
- "Tighten the summary" actually shortens the summary in the CV pane.
- The revision history lists every patch with a "Revert to before this" option.
- Refreshing the page restores the CV at the latest version.

### Phase 8 — PDF export (F-CV-4)

**Files:** `server/services/pdf.js`, `server/routes/cv.js` (`POST /api/cv/:id/pdf`), `src/routes/print.cv.$id.jsx`, `src/styles/print.css`.

**Work:**
- New route `/print/cv/:id` renders the CV with a print-only stylesheet (no sidebar, fixed page width, single column, real text, hyphenation off, no images).
- Server uses Playwright headless to navigate to that URL with the user's session cookie, `page.pdf()`, and stream the result back.
- Filename uses the `filename_pattern` from `user_settings` (F-SETTINGS-1).

**Exit criteria:**
- Generated PDF opens in Preview / Adobe and is fully selectable text.
- Pasting the PDF into a Greenhouse-style ATS form preserves structure and bullets.

### Phase 9 — Resume upload → memory facts (F-MEM-5, plus extends Phase 4)

**Files:** `server/routes/files.js`, `server/services/parse.js`, `src/components/ResumeDropzone.jsx`, `src/components/OnboardingWizard.jsx` (Phase 11).

**Work:**
- Drag-drop a PDF or DOCX → upload to Supabase Storage → server parses to text → DeepSeek extracts memory facts as `[{category, text, confidence}]` → user reviews and accepts → write to `memory_facts` with `source_file_id` pointing at the file.
- The same parser feeds the onboarding flow.

**Exit criteria:**
- Uploading a real two-page resume produces ≥10 reasonable facts that the user can confirm or reject before insert.

### Phase 10 — Settings persistence (F-SETTINGS-1..3) + Tweaks reconciliation (F-TWEAK-1)

**Files:** `src/routes/settings.jsx`, `src/api/settings.js`, `server/routes/settings.js`, `shared/schemas/settings.ts`, `src/App.jsx` (gate Tweaks behind `import.meta.env.DEV`, persist user-relevant ones).

**Work:**
- Wire every Settings row to `user_settings` via TanStack Query.
- Move `dark_mode`, `density`, `cv_layout` from the Tweaks panel into Settings; keep developer-only ones (mono brand, coach hints, replay demo) inside the Dev-only TweaksPanel.
- Implement Account → email (read), Account → delete + export (the delete + export endpoints).

**Exit criteria:**
- Toggle dark mode in Settings → persists across sessions, devices.
- Account deletion removes auth user, all rows, and all storage objects (cascade).

---

### Phase 11+ (ship in any order, one per week)

| Phase | Scope | Triggering need |
|---|---|---|
| 11 | Onboarding wizard | Without it, a new account lands on an empty Dashboard with no clear next step. |
| 12 | Multi-CV per profile | Different roles need different base CVs. (D-MULTI-1 says defer.) |
| 13 | Real match score (F-APPS-6) | Replace `clampMatch` with a real signals-based score. |
| 14 | Billing (D-BILL-1) | If the "Free until graduation" copy in `App.jsx:281–291` is to mean anything. |
| 15 | Email notifications via Resend (D-EMAIL-1) | Status reminders ("You marked Cresta as Interview 2 weeks ago") and password reset email content. |
| 16 | Cover letter generation | Adjacent feature; reuses the AI plumbing. |
| 17 | Teams / workspace (F-NAV-3) | Defer until a single-user version is solid. |
| 18 | Telemetry + error tracking (D-OBS-1) | Sentry + PostHog from day one is fine; proper dashboards later. |
| 19 | Rate limiting + abuse protection | Once sign-up is open. |
| 20 | Account-data export beyond JSON | If users ask for it. |

---

## 9. File-by-file change plan

This is a delta, not a redo. Files not listed are unchanged.

| File | Action | Reason |
|---|---|---|
| `package.json` | **Partly complete**: added backend deps (express, cors, helmet, cookie-parser, zod, @supabase/supabase-js, drizzle-orm, drizzle-kit, postgres, dotenv), `concurrently`, and scripts `server`, `dev:all`, `db:generate`, `db:migrate`, `db:studio`, `test`. Client/router/parser/test deps remain for later phases. | New backend + new client deps. |
| `vite.config.js` | **Complete**: added `server.proxy` and `preview.proxy` for `/api` to `http://localhost:8787`; removed the in-process `createAiProxyPlugin` import. | Backend now lives in its own Node process. |
| `index.html` | Unchanged. | – |
| `.env.example` | **Modify**: add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `RESEND_API_KEY`, `SENTRY_DSN`, `POSTHOG_KEY`, `STRIPE_*` (commented out until billing). Keep `DEEPSEEK_*`. | New services. |
| `.gitignore` | **Modify**: add `playwright-report/`, `test-results/`, `coverage/`. | New tools. |
| `src/main.jsx` | **Modify**: wrap `<App/>` in `<QueryClientProvider>` and `<SessionProvider>`. | TanStack Query + auth context. |
| `src/App.jsx` | **Modify**: replace the `useState("home")` route with React Router. Move sidebar to `src/routes/_layout.jsx`. Gate `<TweaksPanel>` behind `import.meta.env.DEV`. Move `dark_mode/density/cv_layout` reads to `useQuery(["settings"])`. Keep the ⌘K → `/new` shortcut. | F-NAV-2, F-TWEAK-1. |
| `src/screens.jsx` | **Split** into one file per route under `src/routes/`. Each component now consumes TanStack Query hooks instead of `D.*`. Delete the cosmetic `delay`, the 7-phase progress loop, the suggestion chips array (or move to a server-driven list), and every `disabled title="… not implemented…"` button. | F-CV-1, F-CV-3..6, F-CV-9..11, F-DASH-1..3, F-MEM-2..4, F-APPS-2..5, F-PROFILE-1..5, F-SETTINGS-1..3, F-MISC-3, F-MISC-5. |
| `src/data.js` | **Shrink**: keep only constants used as UI copy (e.g. status labels). Move `user`, `applications`, `memory`, `sampleJD`, `generatedCV`, `cvChanges`, `jdSignals` into either: an `onboarding seed` script, the test fixtures, or just delete. | F-PERSIST-1, F-MEM-1, F-APPS-1, F-JD-1. |
| `src/components/ui.jsx` | Mostly unchanged. Add a `Modal`, `Dropdown`, `Toast`, `Skeleton` — these will be needed by the new flows. | UI surface grows. |
| `src/components/TweaksPanel.jsx` | Wrap export in `if (!import.meta.env.DEV) return null` at the top of the component. | F-TWEAK-1. |
| `src/ai/client.js` | **Still needed**: rename to `src/api/cv.js`, expose TanStack Query hooks (`useGenerateCv`, `useReviseCv`). Keep the validators by re-exporting from `shared/schemas/cv.js`. | API surface migrating to TanStack Query. |
| `src/ai/schemas.js` | **Complete for Phase 1**: now re-exports from `shared/schemas/cv.js`. Shared schemas also exist for application, memory, profile, settings, and JD signals. Later TypeScript conversion remains optional. | Shared zod schemas. |
| `server/aiProxy.js` | **Complete**: removed. New entry is `server/index.js`; CV routes live in `server/routes/cv.js`; DeepSeek client lives in `server/services/deepseek.js`. | Backend cleanup. |
| `server/index.js` | **NEW**. Express bootstrap with `helmet`, `cors` (allow Vite origin), `cookie-parser`, route mounting, error handler. | Backend foundation. |
| `server/db/client.js` | **NEW**. Drizzle client over `postgres`. | DB. |
| `server/db/schema.js` | **NEW**. All tables from §6. | DB. |
| `server/db/migrations/` | **NEW**. Drizzle-generated. | DB. |
| `server/middleware/auth.js` | **NEW**. Verify Supabase JWT, populate `req.user`. | Auth. |
| `server/middleware/validate.js` | **NEW**. `validate(schema)` that runs zod on `req.body`. | Validation. |
| `server/middleware/rateLimit.js` | **NEW**. `express-rate-limit` per-IP + per-user. | Abuse. |
| `server/routes/{profile,memory,applications,cv,jd,files,account,settings}.js` | **NEW**. Per §7. | Real APIs. |
| `server/services/{deepseek,pdf,parse,patch,quota}.js` | **NEW**. | Logic split out of routes. |
| `shared/schemas/*.js` | **Complete for Phase 1**. Zod schemas reused client + server. | Single source of truth for validation. |
| `drizzle.config.js` | **Complete for Phase 1**. | Migrations config. |
| `src/routes/*.jsx` | **NEW**. One file per top-level route + auth + print + app detail. | React Router. |
| `src/api/*.js` | **NEW**. TanStack Query hooks per resource. | Server state. |
| `src/state/{session,queryClient}.js` | **NEW**. Providers. | Session + cache. |
| `test/` | **NEW**. Vitest unit, Playwright e2e for the four golden flows: sign up → onboard → generate → export. | QA. |

---

## 10. Decisions needed before any phase starts

These are blocking. Pick before opening Phase 1.

| ID | Question | Default | If you pick something else |
|---|---|---|---|
| D-DB-1 | DB + auth + storage stack | Supabase | Neon + better-auth + Cloudflare R2: rewrite the auth middleware and replace Supabase Storage calls with S3 signed-URL uploads. Schema is unchanged. |
| D-API-1 | Backend shape | Express, separate Node process | Next.js 15: throw out React Router, this plan, and start over with App Router. |
| D-PDF-1 | PDF approach | Playwright server-side | `@react-pdf/renderer` removes the Playwright dep but you maintain a parallel CV component just for PDF. |
| D-AUTH-METHODS-1 | Which auth methods at launch | Email + password + Google + GitHub | Magic-link only is simpler but kills the "I forgot my password" support load — at the cost of users hating it. |
| D-BILL-1 | Ship Phase 14 (billing) for v1? | Defer | Implement immediately if "Free until graduation" copy in `App.jsx` is a real claim, not aspiration. |
| D-MULTI-1 | Multi-CV per profile in v1 | No | Yes adds a `profiles` join everywhere, ~1 week. |
| D-SAMPLE-JD | Keep sample JD prefilled (`screens.jsx:191`) | Empty by default, add "Try the sample" button | Keep prefilled → bad demo for new users (their first action is "delete this then paste mine"). |
| D-AI-COST-1 | Cost cap before sign-up opens | 24h cache + per-user daily quota | No cap → expect surprise DeepSeek bills. |
| D-MEM-1 | Categories implementation | Free text on the row | Separate table → enforced taxonomy but a second migration the moment a user says "I want a 'Languages' category." |
| D-DEPLOY-1 | Hosting | Vercel for everything | Fly.io single VM if Playwright PDF gen needs a long-lived process / large memory. |

---

## 11. Risks

- **AI cost runaway.** Top of the list. D-AI-COST-1 must be picked before opening sign-up.
- **CV PII handling.** Account export + delete from day one. RLS must be on every table. Storage bucket policies must be private. Do not log full CV bodies in Sentry.
- **DeepSeek output drift.** Strict JSON helps but can still fail. Every endpoint must validate and fall back to a useful error (or the mock for local dev).
- **JSON Patch failures.** The model will sometimes return invalid patches. The fallback is "regenerate full CV." Track failure rates in `ai_usage` to know when to retune the prompt.
- **PDF rendering at scale.** Playwright is heavy. If concurrency becomes a problem, queue exports (BullMQ or Cloudflare Workers Queues) rather than blocking the request.
- **Resume parsing accuracy.** PDFs from Word, Pages, LaTeX, Canva all extract differently. Plan a manual confirmation step in the onboarding flow (Phase 9) — never silently insert AI-extracted facts.
- **Scope creep.** This plan deliberately defers cover letters, teams, multi-CV, and email reminders. Resist pulling them forward.
- **"Let's add Next.js while we're here."** Don't. The current Vite setup is healthy; switching frameworks doubles the work.
- **Drift between client and server schemas.** Mitigated by `shared/schemas/`. If TypeScript isn't adopted everywhere yet, at minimum keep one zod source of truth and import it from both sides.
- **Settings drift.** F-TWEAK-1 + F-SETTINGS-1 must reconcile in one phase (Phase 10), or you ship two places that set "dark mode" and they fight.

---

## 12. Local dev workflow (after Phase 1)

```bash
# one-time
cp .env.example .env.local
# fill SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL,
# DEEPSEEK_API_KEY (optional — mock fallback works without it)
rtk npm install
rtk npm run db:migrate

# every session
rtk npm run dev:all
# Vite at http://localhost:5173, Express at http://localhost:8787
# Vite proxies /api → :8787
```

Inspecting the DB:
```bash
rtk npm run db:studio   # Drizzle Studio at http://localhost:4983
```

PDF export needs Playwright browsers installed once:
```bash
npx playwright install chromium
```

---

## 13. Testing checklist

Per phase. Mark each before declaring the phase done.

**Phase 1 — Backend foundation**
- [x] `npm run server` boots clean.
- [x] `npm run dev:all` runs both, Vite proxy works (curl through 5173 to /api/ai-status).
- [ ] `drizzle-kit migrate` applies cleanly to a fresh Supabase project.
- [ ] All tables have RLS enabled (check Supabase dashboard).

**Phase 2 — Auth**
- [ ] Sign up with email; receive confirmation; confirm; land on Dashboard.
- [ ] Refresh keeps session.
- [ ] Sign out; protected routes redirect.
- [ ] Wrong password shows clear error, no crash.
- [ ] OAuth provider works end-to-end.
- [ ] `GET /api/me` returns 401 without session.

**Phase 3 — Profile**
- [ ] Edit a field, save, refresh — value persists.
- [ ] Avatar upload appears in sidebar within 1s.
- [ ] Discard restores last saved values.
- [ ] User in Browser A cannot see user in Browser B's profile (RLS proves this).

**Phase 4 — Memory**
- [ ] Add → edit → delete → search → category filter all work and survive refresh.
- [ ] Dashboard memory snapshot count matches Memory page total.
- [ ] Two users see disjoint memory.

**Phase 5 — Applications**
- [ ] New application creates a Draft row; clicking through hits `/app/:id` with all fields.
- [ ] Status change persists; Dashboard "interview / offer" counts update.
- [ ] Search finds by company and role substring.
- [ ] History pagination works at >50 rows.

**Phase 6 — CV generation + JD signals**
- [ ] First Generate hits DeepSeek (visible in `ai_usage`).
- [ ] Second Generate with same JD hits cache, no DeepSeek call.
- [ ] Quota exceeded returns 429 with a useful message; UI shows clear state.
- [ ] JD signals on the JD pane reflect the actual pasted JD (not a static list).

**Phase 7 — CV revision**
- [ ] "Tighten the summary" actually shortens the displayed summary.
- [ ] Revision history lists every patch with timestamps.
- [ ] Refresh restores the latest CV state.
- [ ] Invalid patch falls back to full regeneration without breaking the UI.

**Phase 8 — PDF export**
- [ ] PDF text is selectable.
- [ ] Pasting the CV from PDF into a plain text editor preserves bullets and section headers.
- [ ] No horizontal scrollbar on Letter and A4.

**Phase 9 — Resume parse**
- [ ] Real two-page PDF resume yields ≥10 facts.
- [ ] Confirm flow inserts only checked facts.
- [ ] Source links from inserted facts back to the uploaded `files` row.

**Phase 10 — Settings + Tweaks reconciliation**
- [ ] Toggle dark mode in Settings; reload; still dark.
- [ ] DevTools: Tweaks panel does not exist on production build (`npm run build && npm run preview`).
- [ ] Account → Delete account: every row, every storage object, the auth user gone within 5s.
- [ ] Account → Export: zip contains profile JSON, applications JSON, memory JSON, all uploaded files.

**Cross-cutting**
- [ ] Run `npm audit` after each phase; no new High/Critical advisories.
- [ ] Lighthouse on the signed-in Dashboard ≥ 90 on Performance, ≥ 95 on Accessibility.
- [ ] No `console.error` or React warnings on a 5-minute exploration.
- [ ] Bundle: `DEEPSEEK_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY` never appear in `dist/`.

---

## 14. Deployment plan

**Frontend:** Vercel project pointed at this repo. `npm run build` outputs `dist/`; Vercel serves it.

**Backend:** Vercel Serverless Functions (one function exporting the Express app via `serverless-http`) or a single Render/Fly.io service if Playwright PDF generation needs persistent memory. Deploy from the same repo, `server/` directory.

**Env vars in production:** `SUPABASE_*`, `DEEPSEEK_*`, `RESEND_API_KEY`, `SENTRY_DSN`, `POSTHOG_KEY`, plus `APP_BASE_URL` for OAuth redirects and email links.

**Preview deployments:** Vercel makes per-PR preview URLs by default. Pair them with a Supabase preview branch (or a single shared dev project) so previews talk to a real DB.

**Migrations:** run `drizzle-kit migrate` as a deploy step against the production `DATABASE_URL` (Supabase project's pooler connection string). Wrap in a transaction. Do not auto-apply destructive migrations — review.

**Rollback:** Vercel "Promote previous deployment" + a `down` migration if schema changed. Practice it once before sign-up opens.

**Smoke tests post-deploy:** the same Playwright suite as `npm run test:e2e`, pointed at the production URL with a dedicated test account. Three flows: sign up → onboard → generate. Export.

---

## 15. Fully Functional Checklist

Final summary. The site is "fully functional" when **all of these are true**:

- [ ] Two unrelated email addresses can sign up and operate completely separate accounts.
- [ ] Refresh / log out / log back in / different browser preserves all data.
- [ ] No `disabled title="… not implemented in this local prototype yet."` buttons remain in `screens.jsx`/`src/routes/`.
- [ ] No `defaultValue=` on form inputs — every field is controlled and persists.
- [ ] No reads from `src/data.js` for user-owned data; `src/data.js` shrunk to UI constants only.
- [ ] Generating the same JD twice within 24h hits the cache.
- [ ] AI revisions persist with history/revert/diff (F-CV-2 fully closed).
- [ ] PDF export downloads a file with selectable text that opens in Preview.
- [ ] Resume drop creates real, reviewable memory facts in Memory.
- [ ] Settings every row writes through and survives refresh.
- [ ] Dashboard stats reflect real applications, not literal `34%` etc.
- [ ] History search finds rows server-side; status changes persist.
- [ ] Account → Export downloads a zip with everything.
- [ ] Account → Delete removes every row, every file, and the auth user.
- [ ] All scoped tables have RLS; cross-user reads return 0 rows.
- [ ] No secrets in the client bundle (`grep -r 'SUPABASE_SERVICE\|DEEPSEEK_API\|STRIPE_SECRET\|RESEND_API' dist/` finds nothing).
- [ ] Sentry captures a real error from a real flow at least once during smoke testing.
- [ ] PostHog records the four golden events: signed_up, application_created, cv_generated, pdf_exported.
- [ ] Production deploy of all of the above behind a public URL and a shareable invite.

When every checkbox above is ticked, hand off to the marketing/launch plan. Until then, this is `BuildPlan-02.md`'s scope.
