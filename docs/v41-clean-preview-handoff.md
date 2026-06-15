# v41 Clean Preview Handoff

This document keeps PR #4 narrow while preserving the next implementation steps for the v41 preview lane.

## Current PR scope

PR #4 is a clean foundation PR. It intentionally avoids importing the broad historical preview-lane changes from PR #2.

Current changed files:

- `package.json`
- `src/journey-shell.tsx`
- `src/journey-storage.ts`
- `src/journey-v41-ux-components.tsx`
- `tsconfig.v41-smoke.json`

## Current validation

- `C1Bio MVP CI`: success
- `v35 Smoke`: success
- `typecheck:v41` script is available for scoped v41 type checking

## Guardrails

Do not modify the following protected routes or files in this clean PR:

- `ckd-ai-lab.html`
- `journey.html`
- `journey-v39-preview.html`
- `journey-v40-vnext-preview.html`
- `src/journey-v39-*`
- `src/journey-v40-vnext-*`

## Next safe commit order

### 1. Add v41 typecheck workflow

Add `.github/workflows/v41-typecheck.yml` locally or through the GitHub web editor.

It should run only:

```bash
npm run typecheck:v41
```

Do not add `vite.config.ts` v41 input in this step.

### 2. Add route and config together

Add these files in the same follow-up commit:

- `journey-v41-preview.html`
- `src/journey-v41-preview-config.ts`

Only after `journey-v41-preview.html` exists should `vite.config.ts` add the v41 preview input.

### 3. Add app shell

Add `src/journey-v41-app-preview.tsx`.

The app shell must use:

- `V41StepHero` from `src/journey-v41-ux-components.tsx`
- `V41FlowStrip` from `src/journey-v41-ux-components.tsx`
- `removeStoredPrefix('ckd.v41.')` from `src/journey-storage.ts`

It must not import `src/journey-v39-*` files.

### 4. Add v41 labs

Add only v41-owned files:

- `src/journey-v41-*.tsx`
- `src/journey-v41-*.ts`

Storage keys must remain under `ckd.v41.*`.

### 5. Add full smoke workflow

Only after route, app, config, labs, and static smoke script exist, add:

- `scripts/smoke-v41-static.mjs`
- `.github/workflows/v41-smoke.yml`
- `smoke:v41` script in `package.json`

## Review checklist before each commit

Before every commit, confirm the diff does not include:

- protected route files
- `src/journey-v39-*`
- `src/journey-v40-vnext-*`
- unrelated docs or workflow files
