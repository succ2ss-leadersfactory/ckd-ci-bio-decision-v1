# v36 Preview QA Result

## QA status

Status: Automated checks passed / Pending browser QA

## Scope

- Route: `/journey-v36-preview.html`
- Feature: v36 preview shell + 3 Full Labs
  - Step 7: CustomerCallPlanLab
  - Step 11: PerformanceDialogueLab
  - Step 12: OneOnOneCoachingLab
- Operating route protection: `/journey.html` remains v34
- v35 preview protection: `/journey-v35-preview.html` remains v35
- Verified commit: `b6174799e47981787a4dc652a776141de383961a`

## Automated checks

| Check | Status | Notes |
|---|---|---|
| `npm run smoke:v36:static` | PASS | Run through v36 Smoke workflow |
| `npm run typecheck:v36` | PASS | Includes CustomerCallPlanLab, PerformanceDialogueLab, OneOnOneCoachingLab |
| `npm run build` | PASS | Run through v36 Smoke workflow |
| `npm run smoke:v36:dist` | PASS | Confirms dist bundle includes v36 route and user-visible v36 markers |
| `npm run smoke:v36` | PASS | Integrated v36 check |
| `npm run smoke:v35` | PASS | Regression guard passed |
| `C1Bio MVP CI` | PASS | Existing CI remained passing |
| `Vercel` | PASS | Deployment status success |

## Browser QA checklist

| Area | Status | Notes |
|---|---|---|
| `/journey.html` regression | Pending | Must remain v34 operating route |
| `/journey-v35-preview.html` regression | Pending | Must remain v35 preview route |
| `/journey-v36-preview.html` render | Pending | Must render v36 title and 13-step flow |
| Step 1 entry save/restore | Pending | `ckd-v36-participant`, `ckd-v36-progress` |
| Step 7 CustomerCallPlanLab render | Pending | Full Lab screen |
| Step 7 customer A-D cards | Pending | A/B/C/D cards and data |
| Step 7 team member 6 cards | Pending | Fixed 6 team members |
| Step 7 focus/deprioritized dropdowns | Pending | Choice updates prompt |
| Step 7 member role assignment | Pending | Role edits persist |
| Step 7 prompt copy | Pending | Copy success/failure message |
| Step 7 AI paste area | Pending | Long text input and restore |
| Step 7 review checklist | Pending | 8 criteria and count update |
| Step 7 risk expression checklist | Pending | Risk count update |
| Step 7 final call plan | Pending | 10 output fields |
| Step 11 PerformanceDialogueLab render | Pending | Full Lab screen |
| Step 11 member selection | Pending | Selected member data changes |
| Step 11 prompt copy | Pending | Copy success/failure message |
| Step 11 AI paste area | Pending | Long text input and restore |
| Step 11 review checklist | Pending | 8 criteria and count update |
| Step 11 risk sentence checklist | Pending | Risk count update |
| Step 11 final dialogue plan | Pending | 7 output fields |
| Step 12 OneOnOneCoachingLab render | Pending | Full Lab screen |
| Step 12 member selection | Pending | Selected member data changes |
| Step 12 prompt copy | Pending | Copy success/failure message |
| Step 12 AI paste area | Pending | Long text input and restore |
| Step 12 review checklist | Pending | 8 criteria and count update |
| Step 12 risk coaching expression checklist | Pending | Risk count update |
| Step 12 final coaching plan | Pending | 8 output fields |
| Facilitator summaries | Pending | Summary and discussion questions across Full Labs |
| Console snippet | Pending | Follow `docs/v36-browser-qa-console-snippet.md`; extend manually for Step 11/12 storage keys if needed |
| Mobile/tablet layout | Pending | No major overflow or blocked controls |
| Console errors | Pending | No blocking runtime errors |

## Required evidence

Record actual evidence after deployment/browser QA.

```text
Date:
Tester:
Deployment URL:
Browser:
Device:

/journey.html regression:
/journey-v35-preview.html regression:
/journey-v36-preview.html render:
Step 1 entry save/restore:
Step 7 CustomerCallPlanLab render:
Step 7 prompt copy:
Step 7 AI paste area:
Step 7 review/risk checklist:
Step 7 final call plan fields:
Step 11 PerformanceDialogueLab render:
Step 11 prompt copy:
Step 11 AI paste area:
Step 11 review/risk checklist:
Step 11 final dialogue plan fields:
Step 12 OneOnOneCoachingLab render:
Step 12 prompt copy:
Step 12 AI paste area:
Step 12 review/risk checklist:
Step 12 final coaching plan fields:
localStorage restore:
Console snippet pass:
missingTextMarkers:
missingStorageKeys:
storageKeysPresentAfterInput:
Mobile/tablet layout:
Console errors:

Notes:
```

## Decision gate

v36 PR should remain Draft until:

1. v36 Smoke workflow passes. ✅
2. v35 Smoke remains passing. ✅
3. Vercel deployment succeeds. ✅
4. Browser QA is recorded in this document.
5. `/journey.html` and `/journey-v35-preview.html` regression checks pass.
6. CustomerCallPlanLab Step 7 checks pass on at least desktop and one mobile/tablet viewport.
7. PerformanceDialogueLab Step 11 checks pass on at least desktop and one mobile/tablet viewport.
8. OneOnOneCoachingLab Step 12 checks pass on at least desktop and one mobile/tablet viewport.
9. Console snippet evidence is recorded after Full Lab input.
