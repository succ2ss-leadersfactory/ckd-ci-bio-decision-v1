# v41 App Shell Checkpoint

This checkpoint records the clean v41 foundation state after adding the v41 preview config, app shell, route HTML, Vite preview input, initial v41-owned lab wiring, and first persistence layer.

## Current changed files

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
- `src/journey-v41-team-standard-lab.tsx`
- `src/journey-v41-ux-components.tsx`
- `tsconfig.v41-smoke.json`
- `vite.config.ts`

## Current validation

As of code-bearing head `98f2fcb7524c290be4e1b7a01109078651ac6121`:

- `v41 Typecheck`: success
- `v41 Foundation Smoke`: success
- `C1Bio MVP CI`: success
- `v35 Smoke`: success

This checkpoint may receive documentation-only updates after that head. After each new commit, re-check the latest head SHA workflow runs before claiming validation.

## Current v41 foundation

The following v41-only pieces are now present:

- `journey-v41-preview.html`
- `src/journey-v41-preview-config.ts`
- `src/journey-v41-app-preview.tsx`
- `src/journey-v41-task-execution-bridge-lab.tsx`
- `src/journey-v41-people-selection-lab.tsx`
- `src/journey-v41-one-on-one-practice-lab.tsx`
- `src/journey-v41-team-standard-lab.tsx`
- `src/journey-v41-ux-components.tsx`
- `src/journey-shell.tsx`
- `src/journey-storage.ts`

The app shell must continue to use v41-owned UX/config/lab files and must not import `src/journey-v39-*` or `src/journey-v40-vnext-*` files.

## Step connection status

- Steps 1~4: placeholder shell remains intentionally narrow.
- Step 5: label exists in config; `V41TeamStandardLab` file exists but is not yet wired into the app shell.
- Step 6: `V41TaskExecutionBridgeLab stage="plan"`
- Step 7: `V41TaskExecutionBridgeLab stage="priority"`
- Step 8: `V41TaskExecutionBridgeLab stage="boundary"`
- Step 9: `V41PeopleSelectionLab` plus app-shell save box for the recommended candidate
- Step 10: `V41OneOnOnePracticeLab` using the saved Step 9 candidate when available

## Persistence status

- Step 6~8 snapshots are saved through `useStored` under `ckd.v41.taskExecutionBridge.v1`.
- Step 9 recommended candidate snapshot is saved through `useStored` under `ckd.v41.peopleSelection.v1`.
- Step 10 script snapshot is saved through `useStored` under `ckd.v41.oneOnOnePractice.v1`.
- All active persistence uses `journey-storage.ts` safe localStorage helpers.

## Stabilization guards now covered

- `journey-v41-preview.html` must keep the v41 title, root, visible marker, and v41 app script entry.
- `vite.config.ts` must keep `journeyV41Preview` only after the HTML route exists.
- `src/journey-v41-app-preview.tsx` must import `./index.css` so the standalone preview entry keeps Tailwind styling.
- `src/journey-v41-app-preview.tsx` must wire the Step 6~10 v41 lab components.
- `src/journey-v41-app-preview.tsx` must use `useStored` with v41-owned storage keys.
- `src/journey-v41-app-preview.tsx` must include `V41PeopleSelectionSaveBox` and `selectedCandidateId` markers.
- `src/journey-v41-team-standard-lab.tsx` is present as a v41-owned component file, but app-shell wiring is not yet claimed.
- The v41 lab files must contain their v41 storage markers and must not import v39/v40 files.
- Protected route files must not contain v41 preview app markers.

## Next safe order

1. Confirm latest CI on the current head SHA.
2. Wire `V41TeamStandardLab` into Step 5 with a minimal app-shell patch only.
3. Replace steps 1~4 placeholders with v41-owned components later.
4. Add static smoke and full `smoke:v41` only after route, app, config, labs, and static smoke script are stable.

## Guardrails

Do not modify protected route files or import v39/v40 files into the v41 clean lane.
