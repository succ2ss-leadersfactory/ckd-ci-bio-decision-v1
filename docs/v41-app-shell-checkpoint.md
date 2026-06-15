# v41 App Shell Checkpoint

This checkpoint records the clean v41 foundation state after adding the v41 preview config, app shell, route HTML, and Vite preview input.

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
- `src/journey-v41-preview-config.ts`
- `src/journey-v41-ux-components.tsx`
- `tsconfig.v41-smoke.json`
- `vite.config.ts`

## Current validation

As of head `0f3d283bf96da432a979966cba5e7fdd87eabbb7`, before the route-guard tightening commits:

- `v41 Typecheck`: success
- `v41 Foundation Smoke`: success
- `C1Bio MVP CI`: success
- `v35 Smoke`: success

After each new commit, re-check the latest head SHA workflow runs before claiming validation.

## Current v41 foundation

The following v41-only pieces are now present:

- `journey-v41-preview.html`
- `src/journey-v41-preview-config.ts`
- `src/journey-v41-app-preview.tsx`
- `src/journey-v41-ux-components.tsx`
- `src/journey-shell.tsx`
- `src/journey-storage.ts`

The app shell must continue to use v41-owned UX/config files and must not import `src/journey-v39-*` or `src/journey-v40-vnext-*` files.

## Stabilization guards now covered

- `journey-v41-preview.html` must keep the v41 title, root, visible marker, and v41 app script entry.
- `vite.config.ts` must keep `journeyV41Preview` only after the HTML route exists.
- `src/journey-v41-app-preview.tsx` must import `./index.css` so the standalone preview entry keeps Tailwind styling.
- Protected route files must not contain v41 preview app markers.

## Next safe order

1. Confirm latest CI on the current head SHA.
2. Add v41 lab files under `src/journey-v41-*` only.
3. Replace placeholder step screens in `src/journey-v41-app-preview.tsx` with the real 10-step v41 flow.
4. Add static smoke and full `smoke:v41` only after route, app, config, labs, and static smoke script exist.

## Guardrails

Do not modify protected route files or import v39/v40 files into the v41 clean lane.
