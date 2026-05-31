# v36 Preview QA Result

## QA status

Status: Automated checks passed / Pending browser QA

## Scope

- Route: `/journey-v36-preview.html`
- Feature: v36 preview shell + 3 Full Labs + 2 Lite+ Labs + 1 Wrap-up Lab
  - Step 7: CustomerCallPlanLab
  - Step 9: HqTranslationLab
  - Step 10: StakeholderMessageLab
  - Step 11: PerformanceDialogueLab
  - Step 12: OneOnOneCoachingLab
  - Step 13: WrapUpLab
- Operating route protection: `/journey.html` remains v34
- v35 preview protection: `/journey-v35-preview.html` remains v35
- Verified commit: `3ad44056992c38501cc5ce17d071f16e6378ef81`

## Automated checks

| Check | Status | Notes |
|---|---|---|
| `npm run smoke:v36:static` | PASS | Run through v36 Smoke workflow |
| `npm run typecheck:v36` | PASS | Includes all v36 Lab files added so far |
| `npm run build` | PASS | Run through v36 Smoke workflow |
| `npm run smoke:v36:dist` | PASS | Confirms dist bundle includes v36 route markers |
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
| Step 1 entry save/restore | Pending | Participant and progress storage |
| Step 7 CustomerCallPlanLab | Pending | Full Lab end-to-end check |
| Step 9 HqTranslationLab | Pending | Lite+ Lab end-to-end check |
| Step 10 StakeholderMessageLab | Pending | Lite+ Lab end-to-end check |
| Step 11 PerformanceDialogueLab | Pending | Full Lab end-to-end check |
| Step 12 OneOnOneCoachingLab | Pending | Full Lab end-to-end check |
| Step 13 WrapUpLab | Pending | 7-day plan, 30-day criteria, declaration, copy output |
| Facilitator summaries | Pending | Summary and discussion questions across Labs |
| Console snippet | Pending | Follow `docs/v36-browser-qa-console-snippet.md` and add Step 13 storage key if needed |
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
Step 7 CustomerCallPlanLab:
Step 9 HqTranslationLab:
Step 10 StakeholderMessageLab:
Step 11 PerformanceDialogueLab:
Step 12 OneOnOneCoachingLab:
Step 13 WrapUpLab:
localStorage restore:
Console snippet pass:
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
6. Step 7, Step 9, Step 10, Step 11, Step 12, and Step 13 checks pass on desktop and one mobile/tablet viewport.
7. Console snippet evidence is recorded after Lab input.
