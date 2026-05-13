# Lessons Learned

Persistent project-specific troubleshooting notes for future Codex runs.

## Entries

### 2026-05-08 - Local dev commands need approval outside sandbox
- Context: Installing npm dependencies and starting Vite for JobMuse.
- Symptom: `rtk npm install` hung silently in the sandbox, and `rtk npm run dev -- --host 127.0.0.1` failed with `listen EPERM`.
- Cause: Network package installation and localhost port binding require approval outside the sandbox in this workspace.
- Fix: Rerun `rtk npm install` and `rtk npm run dev -- --host 127.0.0.1` with escalated permissions.
- Reuse: Try escalation promptly when npm install hangs without output or Vite reports `EPERM` while binding localhost.

### 2026-05-09 - Keep env examples secret-free
- Context: Preparing DeepSeek local API configuration for JobMuse.
- Symptom: `.env.example` was populated with a real API key instead of a blank template value.
- Cause: The template file and the local ignored env file were easy to confuse during setup.
- Fix: Copy the populated values into `.env.local`, redact `.env.example`, and verify `.env.local` is ignored by git.
- Reuse: Before any secret-backed test, check that real keys live only in ignored env files and never in templates, docs, `src/`, or build output.

### 2026-05-09 - Vite audit fix needs matching React plugin
- Context: Resolving npm audit advisories after converting JobMuse to Vite.
- Symptom: `npm audit fix --force` upgraded Vite to 8, but clean `npm install` failed because `@vitejs/plugin-react@4.7.0` only declared peer support through Vite 7.
- Cause: The audit fix changed Vite across a major version without updating the matching Vite React plugin.
- Fix: Upgrade `@vitejs/plugin-react` to `^6.0.1`, then rerun clean install, build, and audit.
- Reuse: After any semver-major audit fix, run a clean-copy `npm install` rather than trusting the already-mutated local `node_modules`.

### 2026-05-09 - RTK direct-run checks need path comparison
- Context: Starting the standalone Express API through `rtk npm run server` and `rtk node server/index.js`.
- Symptom: The server command appeared to run, but there was no listener on port `8787`; direct `node` invocation exited without binding.
- Cause: `import.meta.url === file://${process.argv[1]}` was brittle under RTK/path handling.
- Fix: Compare `fileURLToPath(import.meta.url)` to `path.resolve(process.argv[1])`, and load dotenv with `{ quiet: true }` so server startup logs stay readable.
- Reuse: For ESM CLI entry files, use `fileURLToPath` plus `path.resolve` instead of stringifying `file://` paths.

### 2026-05-09 - Revision chat must mutate the CV, not just the log
- Context: The CV revision chat said "Updated Summary" after prompts like "get rid of summary section."
- Symptom: The chat response claimed success, but the Summary section still rendered unchanged in the CV pane.
- Cause: The revision route/client contract only returned `reply` and `patch`; `ChatPanel` appended a patch label without updating the `cv` state.
- Fix: Return and validate a revised `cv` body for revisions, apply it in `NewApplication`, and keep a shared local transformer for mock/offline fallback.
- Reuse: For generated-edit features, the response contract must include the edited artifact or a machine-applicable patch, not only explanatory prose.

### 2026-05-09 - Resume-backed seed data should stay source-faithful
- Context: Replacing the generic prototype seed data with a private resume-backed seed and the Cresta Data Science Intern JD.
- Symptom: The JD asks for Pandas, NumPy, Scikit-learn, TensorFlow/PyTorch, cloud, Spark, and Hadoop, but the supplied resume does not explicitly list those tools.
- Cause: Tailoring can accidentally invent keyword matches when the target JD is richer than the source resume.
- Fix: Use JD signals for highlighting, but keep resume-backed memory and fallback CV bullets limited to documented facts from the DOCX.
- Reuse: When seeding user-owned data from a resume, separate "JD asks for this" from "the resume supports this" so generated fallback content does not overclaim.

### 2026-05-13 - Git submodule writes need escalation in Google Drive worktrees
- Context: Adding `career-ops` as a git submodule for the filesystem adapter phase.
- Symptom: `rtk git submodule add https://github.com/santifer/career-ops.git career-ops` failed with `.git/index.lock: Operation not permitted`.
- Cause: The sandbox could read the repo but could not write Git metadata under the Google Drive-backed worktree.
- Fix: Rerun the same `rtk git submodule` command with escalated permissions.
- Reuse: Escalate promptly when submodule or index-mutating git commands fail with `.git/index.lock: Operation not permitted` in this workspace.
