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
| v41 static smoke | Pass | GitHub Actions `v41 Smoke` run `27514252366` completed successfully. |
| v41 typecheck | Pass | GitHub Actions `v41 Smoke` run `27514252366` completed `npm run typecheck:v41` successfully. |
| v41 full smoke | Pass | GitHub Actions `v41 Smoke` run `27514252366` completed `npm run smoke:v41` successfully. |
| v41 route access | Pass | `/journey-v41-preview.html` opens after adding v41 to Vite build inputs. |
| Browser QA | Partial | Route access, protected pilot routes, Step 1 gate, 10-screen navigation, and v41 reset were partially confirmed. Current Step 5~10 data flow still needs a fresh browser QA run. |
| Existing pilot route check | Pass | `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html` confirmed by user browser check. |
| v40→v41 content/function parity | Gap found | User confirmed v41 does not yet carry over all v40 content depth and feature behavior. Needs dedicated parity audit before review readiness. |
| Preview redeploy | Requested | Triggered fresh Vercel preview deployments during v41 route and flow stabilization. |

## Current v41 browser QA scope

The current v41 preview has 10 screens:

1. 시작하기
2. 팀원 보기
3. 질문 다듬기
4. 시장 변화 읽기
5. 팀 기준 만들기
6. 업무관리 실행계획 만들기
7. 할 일·줄일 일
8. 업무 경계 나누기
9. 1on1 대상 고르기
10. 1on1 첫 문장

## Step 5~10 data-flow checks

| Flow | Expected result |
| --- | --- |
| Step 5 → Step 6 | Selected team strategy task, CSF, KPI, and initiative appear in the execution-planning screen. |
| Step 6 → Step 7 | Execution cycle, final execution plan, evidence, and check questions appear in the priority/reduction screen. |
| Step 7 → Step 8 | Priority tasks, reduced tasks, 3-step flow, bottleneck signal, and mid-check question appear in the boundary screen. |
| Step 8 → Step 9 | Boundary declaration, member tasks, leader checks, bottleneck signal, and people signal appear in the 1on1 target screen. |
| Step 9 → Step 10 | Selected member preparation, observed fact, interpretation, purpose, risk to avoid, and first question focus appear in the opening-line screen. |
| Step 6 → Step 10 | Execution cycle selected in Step 6 appears in Step 10 question/action-agreement generation. |

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
| Step 2 team profile view |  |  |
| Step 3 question refinement |  |  |
| Step 4 market research |  |  |
| Step 5 team criteria selection |  |  |
| Step 6 execution planning |  |  |
| Step 7 priority/reduction flow |  |  |
| Step 8 task boundary |  |  |
| Step 9 1on1 target selection |  |  |
| Step 10 one-on-one opening |  |  |
| Step 5→10 data flow |  |  |
| Step 10 execution cycle reflection |  |  |
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

## Stabilization baseline

## QA Run 2026-06-15 — CI workflow confirmation

- Tester: GitHub Actions
- Device: `ubuntu-latest`
- Browser: Not executed in browser
- Route tested: Repository-level v41 smoke workflow
- Commit SHA: `0b553346017e49e027bf45d3f3798cf170a0bdfa`
- Workflow run: `v41 Smoke` / `27514252366`
- Result: Partial

### Automated checks

| Check | Result | Notes |
| --- | --- | --- |
| npm install | Pass | GitHub Actions job `Run v41 smoke checks` completed dependency install successfully. |
| npm run smoke:v41:static | Pass | Static v41 route, marker, QA checklist, QA run log, and protected-route guards completed successfully in CI. |
| npm run typecheck:v41 | Pass | v41 scoped TypeScript check completed successfully in CI. |
| npm run build | Pass | Vite build completed successfully in CI. |
| npm run smoke:v41 | Pass | Integrated v41 smoke command completed successfully in CI. |
| workflow summary | Pass | v41 smoke summary step completed successfully and records protected route policy plus 10-screen v41 scope. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Not run | Requires fresh Vercel browser check after cache-key refresh. |
| existing pilot route protection | Not run | Requires fresh browser check for `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html`. |
| Step 5→10 data flow | Not run | Needs browser QA using the table above. |
| Step 10 execution cycle reflection | Not run | Needs browser QA after selecting execution cycle in Step 6. |
| storage isolation | Not run | Needs browser localStorage check. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| Medium | Preview cache | v41 route script cache key still reflected the earlier smoke-fix marker. | Refreshed `/journey-v41-preview.html` cache key after CI smoke success. |

### Decision

- Ready for review: No
- Follow-up needed: Complete fresh browser QA for the 10-screen flow, verify Step 5→10 data flow, confirm Step 10 reflects the Step 6 execution cycle, and record final browser pass.

## QA Run 2026-06-15

- Tester: ChatGPT code stabilization pass
- Device: Repository-level file review
- Browser: Not executed in browser
- Route tested: `/journey-v41-preview.html`
- Commit SHA: `cd27687e97d6f0bde1e88244ffc7ffc260664a5e`
- Result: Partial

### Automated checks

| Check | Result | Notes |
| --- | --- | --- |
| npm run smoke:v41:static | Not run | Static smoke script was aligned with the current 10-screen flow and QA markers, but local/CI execution is still needed. |
| npm run typecheck:v41 | Not run | TypeScript check still needs local or CI execution. |
| npm run smoke:v41 | Not run | Full smoke still needs local or CI execution. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Not run | Vercel deployment status was checked, but browser interaction was not executed in this pass. |
| existing pilot route protection | Not run | Protected-route browser recheck still needed. |
| Step 1 gate | Not run | Fresh 10-screen browser QA still needed. |
| Step 5→10 data flow | Not run | Needs browser QA using the table above. |
| Step 10 execution cycle reflection | Not run | Needs browser QA after selecting execution cycle in Step 6. |
| storage isolation | Not run | Needs browser localStorage check. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| Medium | QA automation | Static smoke could fail if QA marker text drifted from the checklist/run log. | Added run log and QA checklist marker checks to `scripts/smoke-v41-static.mjs`; final execution still required. |

### Decision

- Ready for review: No
- Follow-up needed: Run `npm run smoke:v41:static`, `npm run typecheck:v41`, and browser QA for Step 5→10 data flow.

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
| npm run smoke:v41:static | Pending | Local checkout or CI execution still needed. |
| npm run typecheck:v41 | Pending | Local checkout or CI execution still needed. |
| npm run smoke:v41 | Pending | Local checkout or CI execution still needed. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Pass | `/journey-v41-preview.html` opens after Vite build input fix. |
| existing pilot route protection | Pass | `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html` confirmed by user browser check. |
| Step 1 gate | Pass | User confirmed Step 1 gate behavior. |
| v41 navigation | Pass | User confirmed preview navigation after route stabilization. |
| v41 reset | Pass | User confirmed v41 입력 초기화 확인 완료. |
| content/function parity with v40 | Gap found | User noted v40 content has not fully migrated and v41 has reduced content depth and functional differences. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| High | Route access | Vercel returned 404 for `/journey-v41-preview.html` because `vite.config.ts` did not include the v41 HTML entry. | Fixed by adding `journeyV41Preview: resolve(__dirname, 'journey-v41-preview.html')` and adding a static smoke guard. |
| High | Content/function parity | v41 route and navigation work, but v40 content depth and feature behavior are not fully carried over. | Create a v40→v41 parity audit, then migrate missing content/function step by step without touching protected v40 files. |

### Decision

- Ready for review: No
- Follow-up needed: Run local or CI `npm run smoke:v41`, complete fresh browser QA for the 10-screen flow, verify Step 5→10 data flow, create v40→v41 content/function parity audit, and record final pass.
