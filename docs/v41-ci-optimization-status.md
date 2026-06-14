# v41 CI Optimization Status

## Scope

This note records the latest automated stabilization status for the isolated v41 preview lane.

- Route: `/journey-v41-preview.html`
- Branch: `feature/v37-preview-shell`
- PR: #2
- Latest verified PR head before this note: `6879a8c6b86c4f07aadde55bf23b944c4a3f38da`

## Optimization completed

The v41 GitHub Actions workflow now runs the aggregate command once:

```bash
npm run smoke:v41
```

`npm run smoke:v41` includes:

- `npm run smoke:v41:static`
- `npm run typecheck:v41`
- `npm run build`

This avoids repeating static smoke, typecheck, and build twice inside the v41 workflow.

## Latest automated result

GitHub Actions completed successfully on PR head `6879a8c6b86c4f07aadde55bf23b944c4a3f38da`.

Passing checks observed:

- `v41 Smoke`
- `C1Bio MVP CI`
- `v35 Smoke`
- `v36 Smoke`
- `v38 Smoke`
- `v39 Smoke`
- `v40-lite Smoke`
- `v40-vNext Smoke`

## Protected route policy

No protected route or protected source file was changed by the CI optimization pass.

Protected routes remain:

- `/ckd-ai-lab.html`
- `/journey-v40-vnext-preview.html`
- `/journey.html`
- `/journey-v39-preview.html`

## Remaining manual QA

Automated checks are green, but browser QA is still required before review readiness:

1. Open `/journey-v41-preview.html` after the latest deployment.
2. Confirm Step 1 gate behavior.
3. Complete Step 5 to Step 10 data-flow QA.
4. Confirm Step 10 reflects the execution cycle selected in Step 6.
5. Confirm `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html` remain unchanged.
6. Confirm storage isolation for v41 localStorage keys.
