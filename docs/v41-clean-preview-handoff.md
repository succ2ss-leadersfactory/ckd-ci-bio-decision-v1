# v41 Clean Preview Handoff

This document keeps PR #4 narrow while preserving the next implementation steps for the v41 preview lane.

## Current PR scope

PR #4 is a clean foundation PR. It intentionally avoids importing the broad historical preview-lane changes from PR #2.

Current changed files:

- `.github/workflows/v41-foundation-smoke.yml`
- `.github/workflows/v41-typecheck.yml`
- `docs/v41-clean-preview-handoff.md`
- `docs/v41-app-shell-checkpoint.md`
- `journey-v41-preview.html`
- `package.json`
- `scripts/smoke-v41-foundation.mjs`
- `scripts/smoke-v41-mount-guard.mjs`
- `src/journey-shell.tsx`
- `src/journey-storage.ts`
- `src/journey-v41-app-preview.tsx`
- `src/journey-v41-preview-config.ts`
- `src/journey-v41-ux-components.tsx`
- `tsconfig.v41-smoke.json`
- `vite.config.ts`

## Current foundation status

Completed:

- v41-only UX components are present.
- v41 preview config is present.
- v41 app shell is present and uses `JourneyShell`, `V41FlowStrip`, and `V41StepHero`.
- `journey-v41-preview.html` exists with the v41 marker and app script entry.
- `vite.config.ts` now includes the v41 preview input.
- `scripts/smoke-v41-foundation.mjs` guards the route HTML, Vite input, app shell, config, UX components, storage guard, and tsconfig scope.
- `.github/workflows/v41-foundation-smoke.yml` now runs when the v41 route, Vite input, mount guard, app/config/UX files, or foundation smoke script change.

## Latest verified validation

As of head `0f3d283bf96da432a979966cba5e7fdd87eabbb7`, before the later guard/documentation commits:

- `v41 Typecheck`: success
- `v41 Foundation Smoke`: success
- `C1Bio MVP CI`: success
- `v35 Smoke`: success
- `typecheck:v41` script is available for scoped v41 type checking

After each new commit, re-check workflow runs for the latest head SHA before claiming validation.

## Guardrails

Do not modify the following protected routes or files in this clean PR:

- `ckd-ai-lab.html`
- `journey.html`
- `journey-v39-preview.html`
- `journey-v40-vnext-preview.html`
- `src/journey-active.tsx`
- `src/full-flow-journey-v34.tsx`
- `src/full-flow-journey-v35.tsx`
- `src/journey-v38-app-preview.tsx`
- `src/journey-v39-*`
- `src/journey-v40-vnext-*`

The v41 clean lane must use v41-owned files only.

## Next safe commit order

### 1. Re-check latest CI

Before adding labs, verify the latest head SHA workflow runs.

### 2. Add v41 labs

Add only v41-owned files:

- `src/journey-v41-task-execution-bridge-lab.tsx`
- `src/journey-v41-people-selection-lab.tsx`
- `src/journey-v41-one-on-one-practice-lab.tsx`

Storage keys must remain under `ckd.v41.*`.

### 3. Connect the app shell to the real 10-step flow

Replace placeholder step rendering in `src/journey-v41-app-preview.tsx` with v41-only step components.

Do not import `src/journey-v39-*` or `src/journey-v40-vnext-*` files.

### 4. Add full smoke workflow

Only after route, app, config, labs, and static smoke script exist, add:

- `scripts/smoke-v41-static.mjs`
- `.github/workflows/v41-smoke.yml`
- `smoke:v41` script in `package.json`

## Review checklist before each commit

Before every commit, confirm the diff does not include:

- protected route files
- `src/journey-v39-*`
- `src/journey-v40-vnext-*`
- unrelated workflow changes
