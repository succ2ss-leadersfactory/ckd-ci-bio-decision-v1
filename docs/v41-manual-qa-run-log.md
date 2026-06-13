# v41 Manual QA Run Log

## Purpose

Record actual QA runs for the isolated v41 preview lane.

- v41 route: `/journey-v41-preview.html`
- protected pilot entry: `/ckd-ai-lab.html`
- protected pilot route: `/journey-v40-vnext-preview.html`
- checklist: `docs/v41-manual-qa-checklist.md`

## Current status

| Item | Status | Notes |
| --- | --- | --- |
| v41 static smoke | Pending | Run `npm run smoke:v41:static` locally. |
| v41 typecheck | Pending | Run `npm run typecheck:v41` locally. |
| v41 full smoke | Pending | Run `npm run smoke:v41` locally. |
| Browser QA | Pending | Use the checklist document. |
| Existing pilot route check | Pending | Confirm v40 pilot still opens normally. |

## Run log template

Copy this block for each QA run.

```md
## QA Run YYYY-MM-DD

- Tester:
- Device:
- Browser:
- Route tested:
- Commit SHA:
- Result: Pass / Fail / Partial

### Automated checks

| Check | Result | Notes |
| --- | --- | --- |
| npm run smoke:v41:static |  |  |
| npm run typecheck:v41 |  |  |
| npm run smoke:v41 |  |  |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access |  |  |
| existing pilot route protection |  |  |
| Step 1 gate |  |  |
| Step 4 question refinement |  |  |
| Step 5 market research |  |  |
| Step 6 team standard |  |  |
| Step 7 task instruction |  |  |
| Step 8 priority flow |  |  |
| Step 9 task boundary |  |  |
| Step 10 people selection |  |  |
| Step 11 one-on-one opening |  |  |
| v41 reset |  |  |
| storage isolation |  |  |
| tablet/mobile readability |  |  |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
|  |  |  |  |

### Decision

- Ready for review: Yes / No
- Follow-up needed:
```

## Initial run

## QA Run 2026-06-13

- Tester:
- Device:
- Browser:
- Route tested: `/journey-v41-preview.html`
- Commit SHA: `446abb551d2318c10b73f44811fa739fe5b07436`
- Result: Pending

### Notes

Initial run log created after adding the v41 manual QA checklist.
