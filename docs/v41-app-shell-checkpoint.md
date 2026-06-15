# v41 App Shell Checkpoint

This checkpoint records the current clean v41 foundation state after adding the v41 preview config and app shell.

## Current changed files

- `.github/workflows/v41-typecheck.yml`
- `docs/v41-clean-preview-handoff.md`
- `docs/v41-app-shell-checkpoint.md`
- `package.json`
- `src/journey-shell.tsx`
- `src/journey-storage.ts`
- `src/journey-v41-app-preview.tsx`
- `src/journey-v41-preview-config.ts`
- `src/journey-v41-ux-components.tsx`
- `tsconfig.v41-smoke.json`

## Current validation

- `v41 Typecheck`: success before this documentation checkpoint
- `C1Bio MVP CI`: success before this documentation checkpoint
- `v35 Smoke`: success before this documentation checkpoint

## Current v41 foundation

The following v41-only pieces are now present and typechecked together:

- `src/journey-v41-preview-config.ts`
- `src/journey-v41-app-preview.tsx`
- `src/journey-v41-ux-components.tsx`
- `src/journey-shell.tsx`
- `src/journey-storage.ts`

The app shell must continue to use v41-owned UX/config files and must not import `src/journey-v39-*` files.

## Next safe order

1. Add `journey-v41-preview.html` only.
2. Add the `vite.config.ts` v41 preview input only after the HTML route exists.
3. Add v41 lab files under `src/journey-v41-*`.
4. Add static smoke and full `smoke:v41` only after route, app, config, labs, and static smoke script exist.

## Guardrails

Do not modify protected route files or import v39/v40 files into the v41 clean lane.
