# v39 Demo Candidate Decision Memo

## 1. Current decision

```text
Status: Conditional demo candidate
Final demo freeze: Pending manual browser QA
```

## 2. Baseline

| Item | Value |
|---|---|
| Repository | `succ2ss-leadersfactory/ckd-ci-bio-decision-v1` |
| Branch | `feature/v37-preview-shell` |
| Preview route | `/journey-v39-preview.html` |
| Latest checked commit | `88e60c4b217d68083dc179be70ad8de94d42b162` |
| Operating route | `/journey.html` unchanged |

## 3. Completed items

| Item | Status |
|---|---|
| Step 5 to 13 UX wrappers | completed |
| Phase 1 completion report | completed |
| Manual QA execution sheet | completed |
| Browser QA test data | completed |
| CI verification | completed |

## 4. Automated verification

| Workflow | Status |
|---|---|
| C1Bio MVP CI | success |
| v35 Smoke | success |
| v36 Smoke | success |
| v38 Smoke | success |
| v39 Smoke | success |

v39 Smoke passed static smoke, TypeScript check, Vite build, and integrated smoke.

## 5. Remaining gate

Manual browser QA is still required before final demo freeze.

Use these documents:

```text
docs/v39-phase1-manual-qa-execution-sheet.md
docs/v39-phase1-browser-qa-test-data.md
docs/v39-phase1-ux-wrapper-completion-report.md
```

## 6. Final decision rule

```text
If browser QA passes, freeze v39 as demo candidate.
If browser QA finds issues, fix only in v39 preview, rerun CI, and repeat QA.
```

## 7. Final record template

| Item | Record |
|---|---|
| QA date/time |  |
| QA owner |  |
| Confirmed URL |  |
| Confirmed commit |  |
| PC result | Pass / Fail |
| Tablet result | Pass / Fail |
| Mobile result | Pass / Fail |
| 5 to 13 connection result | Pass / Fail |
| Console result | Pass / Fail |
| Final decision | Freeze / Hold |
| Notes |  |
