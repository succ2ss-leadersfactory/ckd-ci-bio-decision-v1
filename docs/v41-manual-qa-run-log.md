# v41 Manual QA Run Log

## Purpose

Record actual QA runs for the isolated v41 preview lane.

- v41 route: `/journey-v41-preview.html`
- protected pilot entry: `/ckd-ai-lab.html`
- protected pilot route: `/journey-v40-vnext-preview.html`
- protected legacy route: `/journey-v39-preview.html`
- protected operating route: `/journey.html`
- checklist: `docs/v41-browser-qa-checklist.md`

## Current status

| Item | Status | Notes |
| --- | --- | --- |
| v41 static smoke | Pass | Latest checked app/stabilization head `6e94a2c3dd15e287e7c90168be74711dc3d4965f` completed GitHub Actions `v41 Smoke` successfully. |
| v41 typecheck | Pass | Latest checked app/stabilization head completed `npm run typecheck:v41` successfully through `v41 Smoke`. |
| v41 build | Pass | Latest checked app/stabilization head completed `npm run build` successfully through `v41 Smoke`. |
| related protected-lane smoke | Pass | C1Bio MVP CI plus v35, v36, v38, v39, v40-lite, and v40-vNext smoke workflows completed successfully on the latest checked app/stabilization head. |
| Vercel deployment status | Pass | Vercel reported the latest preview deployment as `Ready` for the latest stabilization head. |
| Browser QA | Pass | User confirmed the latest preview browser QA is normal after checking the recommended v41 preview route and protected-route scope. |
| Existing protected route check | Pass | User confirmed normal behavior after the latest stabilization head. |
| Preview redeploy | Pass | Latest checked app/stabilization head has green CI, Vercel Ready status, and user browser confirmation. |

## Current v41 browser QA scope

The current v41 preview has 10 screens:

1. 시작하기
2. 팀원 보기
3. 질문 다듬기
4. 시장 변화 읽기
5. 팀 기준 만들기
6. 업무관리 실행계획 만들기
7. 업무 순서·업무지시
8. 업무 경계·병목 대응
9. 사람관리 1: 대상 선택
10. 사람관리 2: 1on1 실천

## Step 5~10 data-flow checks

| Flow | Expected result | Latest automated/manual result |
| --- | --- | --- |
| Step 5 → Step 6 | Selected team strategy task, CSF, KPI, and initiative appear in the execution-planning screen. | Pass — user browser confirmation for latest checked app/stabilization head |
| Step 6 → Step 7 | Execution cycle, final execution plan, evidence, and check questions appear in the priority/reduction screen. | Pass — user browser confirmation for latest checked app/stabilization head |
| Step 7 → Step 8 | Priority tasks, reduced tasks, 3-step flow, bottleneck signal, and mid-check question appear in the boundary screen. | Pass — user browser confirmation for latest checked app/stabilization head |
| Step 8 → Step 9 | Boundary declaration, member tasks, leader checks, bottleneck signal, and people signal appear in the 1on1 target screen. | Pass — user browser confirmation for latest checked app/stabilization head |
| Step 9 → Step 10 | Selected member preparation, observed fact, interpretation, purpose, risk to avoid, and first question focus appear in the opening-line screen. | Pass — user browser confirmation for latest checked app/stabilization head |
| Step 6 → Step 10 | Execution cycle selected in Step 6 appears in Step 10 question/action-agreement generation. | Pass — user browser confirmation for latest checked app/stabilization head |

## QA Run 2026-06-17 — user browser confirmation for latest stabilization head

- Tester: User browser check
- Device: User PC or notebook browser
- Browser: User browser, exact browser not specified
- Route tested: `/journey-v41-preview.html?v=6e94a2c`, protected route scope
- Commit SHA: `6e94a2c3dd15e287e7c90168be74711dc3d4965f`
- Result: Pass

### Automated checks

| Check | Result | Notes |
| --- | --- | --- |
| C1Bio MVP CI | Pass | Latest checked app/stabilization head completed successfully. |
| v35 Smoke | Pass | Latest checked app/stabilization head completed successfully. |
| v36 Smoke | Pass | Latest checked app/stabilization head completed successfully. |
| v38 Smoke | Pass | Latest checked app/stabilization head completed successfully. |
| v39 Smoke | Pass | Latest checked app/stabilization head completed successfully. |
| v40-lite Smoke | Pass | Latest checked app/stabilization head completed successfully. |
| v40-vNext Smoke | Pass | Latest checked app/stabilization head completed successfully. |
| v41 Smoke | Pass | Latest checked app/stabilization head completed successfully. |
| Vercel deployment | Pass | Vercel reported the preview deployment as `Ready`. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Pass | User confirmed the latest preview route is normal. |
| existing pilot route protection | Pass | User confirmed normal behavior for the protected-route scope. |
| protected legacy/operating route protection | Pass | User confirmed normal behavior for the protected-route scope. |
| Step 1 gate | Pass | User confirmed browser QA is normal. |
| Step 2 team profile view | Pass | User confirmed browser QA is normal. |
| Step 3 question refinement | Pass | User confirmed browser QA is normal. |
| Step 4 market research | Pass | User confirmed browser QA is normal. |
| Step 5 team criteria selection | Pass | User confirmed browser QA is normal. |
| Step 6 execution planning | Pass | User confirmed browser QA is normal. |
| Step 7 priority/reduction flow | Pass | User confirmed browser QA is normal. |
| Step 8 task boundary | Pass | User confirmed browser QA is normal. |
| Step 9 1on1 target selection | Pass | User confirmed browser QA is normal. |
| Step 10 one-on-one opening | Pass | User confirmed browser QA is normal. |
| Step 5→10 data flow | Pass | User confirmed browser QA is normal. |
| Step 10 execution cycle reflection | Pass | User confirmed browser QA is normal. |
| v41 reset | Pass | User confirmed browser QA is normal. |
| storage isolation | Pass | User confirmed browser QA is normal. |
| tablet/mobile readability | Not checked | Optional visual check remains available on target devices. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| None | All checked areas | User reported the latest browser QA as normal. | No code action required. |

### Decision

- Ready for review: Yes, for the current v41 preview stabilization scope.
- Follow-up needed: None for the current stabilization pass. Any future visual refactor, including CSS consolidation, should be handled as a separate scoped change.

## QA Run 2026-06-17 — latest stabilization automated/deployment verification

- Tester: ChatGPT via GitHub Actions and Vercel status inspection
- Device: GitHub Actions `ubuntu-latest`; browser not executed in this environment
- Browser: Not executed; direct external Vercel DNS/browser access unavailable in the current tool environment
- Route tested: Repository-level checks for v41 plus deployment readiness for the PR preview
- Commit SHA: `95f233da404641f6f5022d9af123cb67ebebc68e`
- Result: Superseded by user browser confirmation for `6e94a2c3dd15e287e7c90168be74711dc3d4965f`

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
| Vercel deployment | Pass | Vercel reported the preview deployment as `Ready`. |

### Browser checks

| Area | Result | Notes |
| --- | --- | --- |
| v41 route access | Superseded | Replaced by the user browser confirmation run above. |
| existing pilot route protection | Superseded | Replaced by the user browser confirmation run above. |
| protected legacy/operating route protection | Superseded | Replaced by the user browser confirmation run above. |
| Step 1 gate | Superseded | Replaced by the user browser confirmation run above. |
| Step 2 team profile view | Superseded | Replaced by the user browser confirmation run above. |
| Step 3 question refinement | Superseded | Replaced by the user browser confirmation run above. |
| Step 4 market research | Superseded | Replaced by the user browser confirmation run above. |
| Step 5 team criteria selection | Superseded | Replaced by the user browser confirmation run above. |
| Step 6 execution planning | Superseded | Replaced by the user browser confirmation run above. |
| Step 7 priority/reduction flow | Superseded | Replaced by the user browser confirmation run above. |
| Step 8 task boundary | Superseded | Replaced by the user browser confirmation run above. |
| Step 9 1on1 target selection | Superseded | Replaced by the user browser confirmation run above. |
| Step 10 one-on-one opening | Superseded | Replaced by the user browser confirmation run above. |
| Step 5→10 data flow | Superseded | Replaced by the user browser confirmation run above. |
| Step 10 execution cycle reflection | Superseded | Replaced by the user browser confirmation run above. |
| v41 reset | Superseded | Replaced by the user browser confirmation run above. |
| storage isolation | Superseded | Replaced by the user browser confirmation run above. |
| tablet/mobile readability | Not checked | Optional visual check remains available on target devices. |

### Issues found

| Severity | Step | Issue | Action |
| --- | --- | --- | --- |
| None | Browser QA | Earlier pending browser QA was completed by user confirmation. | No code action required. |

### Decision

- Ready for review: Yes, superseded by user browser confirmation for the latest checked app/stabilization head.
- Follow-up needed: None for the current stabilization pass.

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

- Ready for review: Yes, for the then-current v41 preview optimization scope.
- Follow-up needed: Re-run browser QA for later stabilization heads.

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

- Ready for review: Yes, for the prior v41 preview optimization scope.
- Follow-up needed: Re-run browser QA for later stabilization heads.
