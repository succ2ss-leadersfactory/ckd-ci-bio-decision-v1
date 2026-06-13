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
| v41 route access | Pass | `/journey-v41-preview.html` confirmed after adding v41 to Vite build inputs. |
| Browser QA | Partial | Route access confirmed. Step 1 and Step 4~11 flow still need checklist pass. |
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

- Tester: User browser check
- Device: PC or notebook browser
- Browser: Chrome-compatible browser
- Route tested: `/journey-v41-preview.html`
- Commit SHA: `2ee3852891efc1491e9fb249263c2833928d721b`
- Result: Partial

### Automated checks

| Check | Result | Notes |
| --- | --- | --- |
| npm run smoke:v41:static | Pending | Local checkout execution still needed. |
| npm run typecheck:v41 | Pending | Local checkout execution still needed. |
| npm run smoke:v41 | Pending | Local checkout execution still needed. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Pass | `/journey-v41-preview.html` opens after Vite build input fix. |
| existing pilot route protection | Pending | `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html` still need direct browser check. |
| Step 1 gate | Pending | Checklist pass still needed. |
| Step 4~11 flow | Pending | Checklist pass still needed. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| High | Route access | Vercel returned 404 for `/journey-v41-preview.html` because `vite.config.ts` did not include the v41 HTML entry. | Fixed by adding `journeyV41Preview: resolve(__dirname, 'journey-v41-preview.html')` and adding a static smoke guard. |

### Decision

- Ready for review: No
- Follow-up needed: Run local `npm run smoke:v41`, complete browser QA checklist, confirm existing pilot routes, and record final pass.
