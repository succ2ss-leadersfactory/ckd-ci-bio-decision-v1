# V41 CI Optimization Status

## Current automated guard

The v41 workflow uses the aggregate command:

```bash
npm run smoke:v41
```

This command includes static smoke, v41 typecheck, and build.

## Browser QA reminder

Automated checks are green, but browser QA is still required before review readiness.

Required browser checks:

1. Open `/journey-v41-preview.html`.
2. Confirm Step 1 gate behavior.
3. Complete Step 5 to Step 10 data-flow QA.
4. Confirm Step 10 reflects the execution cycle selected in Step 6.
5. Confirm protected v40 routes remain unchanged.
6. Confirm v41 storage isolation.

## Latest automation baseline

Latest verified head: `ca6ecc7690f854958f30994b343b884ce3fee84d`.

All automated smoke checks passed on this head.
