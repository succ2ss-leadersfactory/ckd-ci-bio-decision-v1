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
- `src/journey-v41-one-on-one-practice-lab.tsx`
- `src/journey-v41-people-selection-lab.tsx`
- `src/journey-v41-preview-config.ts`
- `src/journey-v41-task-execution-bridge-lab.tsx`
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
- v41 lab files are present:
  - `src/journey-v41-task-execution-bridge-lab.tsx`
  - `src/journey-v41-people-selection-lab.tsx`
  - `src/journey-v41-one-on-one-practice-lab.tsx`
- `src/journey-v41-app-preview.tsx` connects steps 6~10 to v41-owned lab components and keeps steps 1~5 as safe placeholders.
- Step 6~8 task execution snapshots persist under `ckd.v41.taskExecutionBridge.v1`.
- Step 10 one-on-one script snapshots persist under `ckd.v41.oneOnOnePractice.v1`.
- Step 9 selection remains display-only for now. A full selection-persistence patch was not applied after a connector safety block; split that work into a smaller follow-up patch.
- `scripts/smoke-v41-foundation.mjs` guards the route HTML, Vite input, app shell, lab files, persistence markers, config, UX components, storage guard, and tsconfig scope.
- `.github/workflows/v41-foundation-smoke.yml` runs when the v41 route, Vite input, mount guard, app/config/UX/lab files, or foundation smoke script change.

## Latest verified validation

As of head `75a5668cbb594ad31be2dca976c1d32b3a369a9d`, before the later persistence commits:

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

## Current step coverage

- Steps 1~5: placeholder shell remains intentionally narrow.
- Step 6: `V41TaskExecutionBridgeLab stage="plan"`
- Step 7: `V41TaskExecutionBridgeLab stage="priority"`
- Step 8: `V41TaskExecutionBridgeLab stage="boundary"`
- Step 9: `V41PeopleSelectionLab`
- Step 10: `V41OneOnOnePracticeLab`

## Current storage coverage

- `ckd.v41.participant.v1`: configured for participant identity guard.
- `ckd.v41.progress.v1`: configured for future progress tracking.
- `ckd.v41.taskExecutionBridge.v1`: active, stores Step 6~8 snapshots by stage.
- `ckd.v41.peopleSelection.v1`: configured but not yet active in the UI.
- `ckd.v41.oneOnOnePractice.v1`: active, stores Step 10 script snapshot.

## Next safe commit order

### 1. Re-check latest CI

Before adding more behavior, verify the latest head SHA workflow runs.

### 2. Add Step 9 selection persistence in a smaller patch

Use `ckd.v41.peopleSelection.v1` only. Avoid a full-file rewrite if connector safety blocks again.

### 3. Replace steps 1~5 placeholders later

Add v41-owned components for steps 1~5 only after the step 6~10 lab wiring remains green.

### 4. Add full smoke workflow

Only after route, app, config, labs, and static smoke script are stable, add:

- `scripts/smoke-v41-static.mjs`
- `.github/workflows/v41-smoke.yml`
- `smoke:v41` script in `package.json`

## Review checklist before each commit

Before every commit, confirm the diff does not include:

- protected route files
- `src/journey-v39-*`
- `src/journey-v40-vnext-*`
- unrelated workflow changes
