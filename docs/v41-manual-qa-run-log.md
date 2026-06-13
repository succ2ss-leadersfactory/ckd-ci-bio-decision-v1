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
| Browser QA | Partial | Route access, protected pilot routes, Step 1 gate, Step 4~11 navigation, and v41 reset confirmed. Content/function parity with v40 still needs audit. |
| Existing pilot route check | Pass | `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html` confirmed by user browser check. |
| v40→v41 content/function parity | Gap found | User confirmed v41 does not yet carry over all v40 content depth and feature behavior. Needs dedicated parity audit before review readiness. |
| Preview redeploy | Requested | Triggered a fresh Vercel preview deployment after Step 3/4 merge and prompt-practice redesign updates. |

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
- Route tested: `/journey-v41-preview.html`, `/ckd-ai-lab.html`, `/journey-v40-vnext-preview.html`
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
| existing pilot route protection | Pass | `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html` confirmed by user browser check. |
| Step 1 gate | Pass | User confirmed Step 1 gate behavior. |
| Step 4~11 navigation | Pass | User confirmed Step 4~11 이동 확인 완료. |
| v41 reset | Pass | User confirmed v41 입력 초기화 확인 완료. |
| content/function parity with v40 | Gap found | User noted v40 content has not fully migrated and v41 has reduced content depth and functional differences. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| High | Route access | Vercel returned 404 for `/journey-v41-preview.html` because `vite.config.ts` did not include the v41 HTML entry. | Fixed by adding `journeyV41Preview: resolve(__dirname, 'journey-v41-preview.html')` and adding a static smoke guard. |
| High | Content/function parity | v41 route and navigation work, but v40 content depth and feature behavior are not fully carried over. | Create a v40→v41 parity audit, then migrate missing content/function step by step without touching protected v40 files. |

### Decision

- Ready for review: No
- Follow-up needed: Run local `npm run smoke:v41`, create v40→v41 content/function parity audit, migrate missing depth/features, and record final pass.
