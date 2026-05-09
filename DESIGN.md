# JobMuse — Design Guidelines

A short, opinionated guide for keeping JobMuse's UI consistent. The goal is a **Notion-like productivity feel** — light, friendly, monochrome, deferential to content. Read this before changing tokens or adding new screens.

---

## 1. Principles

1. **Content first.** UI chrome stays quiet so the user's job description, CV, and memory facts read clearly. If a control isn't earning its place, drop it.
2. **Direct copy.** Terse, action-led, no marketing voice. Verbs lead. No exclamation points. Numbers when they help.
3. **Monochrome.** No chromatic accent. Hierarchy comes from weight, size, and value — not color.
4. **One thousand no's for every yes.** No filler stats, no decorative icons, no animated sparkles unless the moment calls for it (e.g. AI generation).
5. **Density is a setting, not a default.** Components must look correct at compact, cozy, and roomy.

---

## 2. Type

- **Sans:** [Geist](https://vercel.com/font) — weights 400 / 500 / 600 / 700.
- **Mono:** Geist Mono — weights 400 / 500. Used for dates, counts, file names, keyboard shortcuts, and AI model labels.
- Loaded via Google Fonts in `JobMuse.html`.
- `font-feature-settings: "ss01", "cv11"` is on at the body level.

### Scale

| Use                          | Size   | Weight | Tracking |
|------------------------------|--------|--------|----------|
| Page title (h1)              | 22px   | 600    | -0.018em |
| Section / panel header (h2)  | 14px   | 600    | -0.005em |
| Eyebrow / category label     | 11px   | 600    |  0.06em uppercase |
| Body                         | 13.5px | 400    | -0.005em |
| Small / meta                 | 12.5px | 400    | -0.005em |
| Micro (mono dates, counts)   | 11–12px| 400/500| 0       |

Body size scales with density (`--jr-density-fs`: 13 / 14 / 15px).

---

## 3. Color

All values live as CSS custom properties on `:root` and `[data-theme="dark"]` in `JobMuse.html`. **Never hard-code colors in components — pull from tokens.**

### Light (default)

| Token            | Value      | Use                                  |
|------------------|------------|--------------------------------------|
| `--jr-bg`        | `#fbfbfa`  | Canvas                               |
| `--jr-bg-1`      | `#f4f4f2`  | Sidebar, inset surfaces, inputs      |
| `--jr-bg-2`      | `#efeeec`  | Hover                                |
| `--jr-bg-3`      | `#e7e6e3`  | Active / pressed                     |
| `--jr-card`      | `#ffffff`  | Elevated cards (CV, JD, list rows)   |
| `--jr-fg`        | `#1c1c1a`  | Body text                            |
| `--jr-fg-1`      | `#4a4a47`  | Secondary text                       |
| `--jr-fg-2`      | `#8a8a85`  | Tertiary / placeholder               |
| `--jr-fg-3`      | `#b8b8b3`  | Quaternary, decorative               |
| `--jr-border`    | `#e7e6e3`  | Default divider                      |
| `--jr-border-1`  | `#ddddd9`  | Stronger divider, button border      |
| `--jr-ink`       | `#0c0c0b`  | High-emphasis text, primary surfaces |
| `--jr-mark`      | `#ecebe7`  | Highlight pill on JD/CV phrases      |

### Dark

Mirrors the light scale with warm near-blacks (`#161614` → `#2c2c28`) and warm off-whites (`#e8e7e3` → `#4a4a45`). Toggle via `[data-theme="dark"]` on `<html>`.

### Rules

- **No saturated colors.** Whites and blacks may carry a hint of warmth; chroma stays under ~0.02.
- **No accent color.** Status, emphasis, and selection use ink/grey only. Highlights on JD signals and rewritten CV text use `--jr-mark` (a value shift), not hue.
- **Do not invent new tokens** for one-off needs. Reuse the closest scale step.

---

## 4. Spacing, radius, shadow

- **Radii:** `6px` for controls, `8–10px` for cards & panels, `999px` for pills/avatars/toggles.
- **Borders:** Always `1px solid var(--jr-border)` for dividers; `var(--jr-border-1)` for buttons and stronger separation.
- **Shadow:** Used sparingly. `--jr-shadow` for subtle lift, `--jr-shadow-lg` for floating panels (Tweaks). Cards generally use border, not shadow.
- **Density tokens:** `--jr-row-h` (28 / 32 / 40), `--jr-density-pad`, `--jr-density-gap`, `--jr-density-fs`. Set on `<html data-density="...">`.

---

## 5. Components

### Buttons (`Button` in `ui.jsx`)

Four kinds: `primary`, `bordered`, `subtle`, `ghost`. Three sizes: `sm`, `md`, `lg`.

- **`primary`** — black ink on warm white. Use **once per view** for the highest-intent action (Generate CV, Save changes, Apply on Cresta).
- **`bordered`** — neutral surface with a 1px border. Secondary actions sitting next to a primary.
- **`subtle`** — filled `--jr-bg-2`. Use when a button needs to stand out from the canvas without competing with primary.
- **`ghost`** — transparent. Toolbar / inline actions, dismissals.

Optional `icon` (left) and `iconRight`. Disabled state: 50% opacity, `not-allowed` cursor.

### Inputs

- `Input` (single-line) and `Textarea` use `--jr-bg-1` background by default. They lift to `--jr-card` on focus. Border becomes `--jr-fg-2` on focus.
- Always pair with `FieldLabel` (uppercase eyebrow, 11.5px, `--jr-fg-1`).
- Placeholder color: `--jr-fg-3`.

### Pills, status dots, kbd

- `Pill` — small filled label, mono variant for numbers/codes.
- `StatusDot` — 7px circle. Filled for active states (Applied, Interview, Offer with ring), hollow for muted (Rejected, Ghosted).
- `Kbd` — mono, bordered, used for keyboard hints (`⌘K`, `↵`, `⇧↵`).

### Rows & tables

- Lists are bordered cards; rows separated by 1px borders, no zebra. Hover: `--jr-bg-2`.
- Row height tracks `--jr-row-h`.
- Headers use the eyebrow style (uppercase, 11px, 600, tracking 0.06em).

### Highlights

When marking text inside JD or CV, wrap with `<mark className="jr-mark">`. **Never use a colored background** — use the `--jr-mark` value shift only.

---

## 6. Layout

- App shell is a CSS grid: `[sidebar 232px or 56px] | [main 1fr]`.
- Main canvas centers content for narrow screens (Dashboard, New Application input, Profile, Settings — `max-width: 720–980px`); full-width for data-heavy views (History, Memory, CV result).
- Tailored CV result has three layout variants exposed as a tweak: `split` (1:1), `cv-first` (1:1.2), `stacked` (rows). All must remain usable when the AI chat panel is open (chat docks at 360px on the right).

### Sidebar

- Brand mark, workspace switcher, search (`⌘K`), nav, footer.
- Active nav item: `--jr-bg-3` background, `--jr-ink` foreground, weight 500. Hover non-active: `--jr-bg-2`.
- Collapses to 56px (icons only).

---

## 7. Motion

- **Default transitions:** 0.12s ease for backgrounds and borders; 0.15–0.18s for layout grid changes.
- **Fade-in (`.jr-fade-in`)** — 0.35s, 4px upward translate. Use on screen mounts and one-off panels (chat opening, CV result reveal).
- **Stagger (`.jr-stagger > *`)** — apply to lists/grids of cards on entry. Delays go 0.04s → 0.34s in 0.06s steps.
- **Pulse (`.jr-pulse`)** — used on the AI generation icon and the active phase dot.
- Avoid bouncy or decorative motion. Movement should feel like UI confirming an action, not entertaining.

---

## 8. Iconography

- All icons live in `ui.jsx` under a single `Icon` component, drawn fresh as 24×24 SVG with `stroke-width: 1.5` and round joins.
- Default render size 16px, color `currentColor`.
- **Do not import external icon sets.** When a new icon is needed, add it to the `Icon` switch.
- Keep them geometric and simple — no two-tone, no fills except the brand mark and `dot`.

---

## 9. Voice & copy

- **Headings** are statements, not questions. Sentence case.
- **Subtitles** describe what the user can do here in 8–14 words.
- **Empty states** suggest the smallest next step ("Try adding something simple — a recent project, a skill…"), never marketing language.
- **AI replies** in the chat panel: 1–2 short sentences. Lead with what changed; end with a question or no closing at all.
- Avoid: "Welcome", "Awesome", "Let's", "We're excited", emoji.

---

## 10. Tweaks

In-page tweak controls live in the right-side panel. In local Vite development, press `⌘.` / `Ctrl+.` to open the panel. Current keys live in the `TWEAK_DEFAULTS` block at the top of `src/App.jsx`:

| Key         | Type                | Effect                                              |
|-------------|---------------------|-----------------------------------------------------|
| `dark`      | bool                | Theme attribute on `<html>`                         |
| `density`   | compact/cozy/roomy  | Row height, padding, body font size                 |
| `sidebar`   | expanded/collapsed  | Sidebar width                                       |
| `cvLayout`  | split/cv-first/stacked | Tailored CV result columns                       |
| `monoBrand` | bool                | Brand mark uses mono "JR" instead of glyph          |
| `showHints` | bool                | Show coach tooltips (reserved)                      |

When adding a tweak: define the default in `TWEAK_DEFAULTS`, render a control inside `<TweaksPanel>`, and read it via the `t` object. Don't bypass `setTweak` — it's how state persists.

---

## 11. File structure

```
index.html                    Vite entry. Fonts, mount point, module script.
src/main.jsx                  React root render and global CSS import.
src/styles/global.css         Tokens, base styles, scrollbars, button states,
                              transitions, and shared utility classes.
src/data.js                   Mock data (user, applications, memory, JD, CV, signals).
src/components/ui.jsx         Primitives: Icon, Button, Pill, Kbd, Input, Textarea,
                              SectionHeader, FieldLabel, StatusDot, Empty, highlightText.
src/components/TweaksPanel.jsx Tweaks shell starter (host protocol + local dev shortcut).
src/screens.jsx               Six screens + ChatPanel + JDPanel/CVPanel.
src/App.jsx                   App shell, Sidebar, route state, TweaksPanel wiring.
src/ai/client.js              Local API client for DeepSeek generation/revision routes.
src/ai/schemas.js             Re-export of shared AI response validators.
shared/schemas/               Zod schemas reused by browser and server code.
server/index.js               Local Express API bootstrap.
server/routes/cv.js           CV generation/revision routes.
server/services/deepseek.js   DeepSeek client, normalization, and mock fallback.
server/aiProxy.js             Temporary compatibility wrapper for the old Vite middleware shape.
JobMuse.html                  Original static prototype entry, kept for reference.
jobmuse-app.jsx               Original generated bundle, kept for reference.
```

**Edit files under `src/` as the active UI source of truth.** Server-side local AI behavior lives in the Express API under `server/`. `JobMuse.html` and `jobmuse-app.jsx` are legacy prototype artifacts and are not used by the Vite dev server.

---

## 12. Accessibility checklist

- All interactive elements use real `<button>` / `<input>` / `<textarea>`.
- Hit targets meet 28px minimum even at compact density (rows are 28; icon-only ghost buttons stay 26+).
- Text contrast: body on canvas exceeds 7:1 in both themes; secondary text exceeds 4.5:1.
- Focus styles: rely on the browser default for now (custom focus ring is a TODO when shipping).
- Color is never the only signal — status uses dot shape (filled / hollow / ringed) plus text.

---

## 13. What's intentionally missing

- No third color. Don't add one without revisiting the system.
- No avatars beyond initials chips.
- No illustrations or hero imagery — placeholders are an acceptable end state for now.
- No toast system yet — the chat panel itself is the feedback channel for AI revisions.

When in doubt: **less, smaller, quieter.**
