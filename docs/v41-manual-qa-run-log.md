# v41 Manual QA Run Log

## Purpose

Record actual QA runs for the isolated v41 preview lane.

- v41 route: `/journey-v41-preview.html`
- protected pilot entry: `/ckd-ai-lab.html`
- protected pilot route: `/journey-v40-vnext-preview.html`
- protected legacy route: `/journey-v39-preview.html`
- protected operating route: `/journey.html`
- checklist: `docs/v41-manual-qa-checklist.md`

## Current status

| Item | Status | Notes |
| --- | --- | --- |
| v41 static smoke | Pass | Latest PR head `325c180d2a097c608eb100d9239c8aeebcbad37a` completed GitHub Actions `v41 Smoke` successfully. |
| v41 typecheck | Pass | Latest PR head completed `npm run typecheck:v41` successfully in GitHub Actions through `npm run smoke:v41`. |
| v41 full smoke | Pass | Latest PR head completed `npm run smoke:v41` successfully in GitHub Actions. |
| related protected-lane smoke | Pass | C1Bio MVP CI plus v35, v36, v38, v39, v40-lite, and v40-vNext smoke workflows completed successfully on the latest PR head. |
| v41 route access | Pass | User confirmed `/journey-v41-preview.html` opens normally. |
| Browser QA | Pass | User confirmed route access, team/name persistence, 10-step navigation, Step 5~10 data continuity, refresh persistence, scoped v41 reset, no console errors, and v39/v40 route protection. |
| Existing protected route check | Pass | User confirmed v39/v40 route impact check. |
| v40→v41 content/function parity | Managed risk | v41 is preserved as the current confirmed 10-step preview lane. Further parity expansion is out of scope for this optimization pass. |
| Preview redeploy | Pass | Latest PR head has green CI; browser QA confirmed after optimization. |

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

| Flow | Expected result | Final QA result |
| --- | --- | --- |
| Step 5 → Step 6 | Selected team strategy task, CSF, KPI, and initiative appear in the execution-planning screen. | Pass |
| Step 6 → Step 7 | Execution cycle, final execution plan, evidence, and check questions appear in the priority/reduction screen. | Pass |
| Step 7 → Step 8 | Priority tasks, reduced tasks, 3-step flow, bottleneck signal, and mid-check question appear in the boundary screen. | Pass |
| Step 8 → Step 9 | Boundary declaration, member tasks, leader checks, bottleneck signal, and people signal appear in the 1on1 target screen. | Pass |
| Step 9 → Step 10 | Selected member preparation, observed fact, interpretation, purpose, risk to avoid, and first question focus appear in the opening-line screen. | Pass |
| Step 6 → Step 10 | Execution cycle selected in Step 6 appears in Step 10 question/action-agreement generation. | Pass |

## Final QA Run 2026-06-15 — user browser confirmation after v41 optimization

- Tester: User browser check
- Device: User PC or notebook browser
- Browser: User browser, exact browser not specified
- Route tested: `/journey-v41-preview.html`, protected v39/v40 routes
- Commit SHA: `325c180d2a097c608eb100d9239c8aeebcbad37a`
- Result: Pass

### Automated checks

| Check | Result | Notes |
| --- | --- | --- |
| C1Bio MVP CI | Pass | Latest PR head completed successfully. |
| v35 Smoke | Pass | Latest PR head completed successfully. |
| v36 Smoke | Pass | Latest PR head completed successfully. |
| v38 Smoke | Pass | Latest PR head completed successfully. |
| v39 Smoke | Pass | Latest PR head completed successfully. |
| v40-lite Smoke | Pass | Latest PR head completed successfully. |
| v40-vNext Smoke | Pass | Latest PR head completed successfully. |
| v41 Smoke | Pass | Latest PR head completed successfully. |
| npm run smoke:v41:static | Pass | Covered by `v41 Smoke`. |
| npm run typecheck:v41 | Pass | Covered by `v41 Smoke`. |
| npm run smoke:v41 | Pass | Covered by `v41 Smoke`. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Pass | User confirmed `/journey-v41-preview.html` 정상 진입. |
| team/name persistence | Pass | User confirmed team/name input is retained. |
| 10-step navigation | Pass | User confirmed all 10 steps are movable. |
| Step 5→10 data flow | Pass | User confirmed Step 5~10 data connection is maintained. |
| refresh persistence | Pass | User confirmed stored values remain after refresh. |
| v41 reset | Pass | User confirmed v41 reset behavior. |
| storage isolation | Pass | User confirmed v41 reset clears only `ckd.v41.*` and does not clear `ckd.v40-vnext.*`. |
| console error check | Pass | User confirmed no console errors. |
| protected v39/v40 route impact | Pass | User confirmed no impact to v39/v40 routes. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| None | All checked areas | No issues reported in final browser QA. | No code action required. |

### Decision

- Ready for review: Yes, for the current v41 preview optimization scope.
- Follow-up needed: None for this optimization pass. Any future work should be handled as a new scoped change after preserving the current QA baseline.

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

## QA Run 2026-06-15 — latest PR-head automated stabilization

- Tester: GitHub Actions
- Device: `ubuntu-latest`
- Browser: Not executed in browser
- Route tested: Repository-level PR checks for v41 and protected-lane smoke coverage
- Commit SHA: `325c180d2a097c608eb100d9239c8aeebcbad37a`
- Result: Pass for automated checks

### Automated checks

| Check | Result | Notes |
| --- | --- | --- |
| C1Bio MVP CI | Pass | Latest PR head completed successfully. |
| v35 Smoke | Pass | Latest PR head completed successfully. |
| v36 Smoke | Pass | Latest PR head completed successfully. |
| v38 Smoke | Pass | Latest PR head completed successfully. |
| v39 Smoke | Pass | Latest PR head completed successfully. |
| v40-lite Smoke | Pass | Latest PR head completed successfully. |
| v40-vNext Smoke | Pass | Latest PR head completed successfully. |
| v41 Smoke | Pass | Latest PR head completed successfully. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Pass | Final browser QA confirmed by user after optimization. |
| existing pilot route protection | Pass | Final browser QA confirmed protected route impact check. |
| Step 5→10 data flow | Pass | Final browser QA confirmed by user after optimization. |
| Step 10 execution cycle reflection | Pass | Final browser QA confirmed by user after optimization. |
| storage isolation | Pass | Final browser QA confirmed v41 reset scope and v40-vNext preservation. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| Low | Earlier QA record | Earlier run log showed browser QA as partial before final user confirmation. | Updated current status and added final browser pass record. |

### Decision

- Ready for review: Yes, for the current v41 preview optimization scope.
- Follow-up needed: None for this optimization pass.
