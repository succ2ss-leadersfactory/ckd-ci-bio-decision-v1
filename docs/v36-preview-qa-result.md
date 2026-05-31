# v36 Preview QA Result

## QA status

Status: Pending browser QA

## Scope

- Route: `/journey-v36-preview.html`
- Feature: v36 preview shell + CustomerCallPlanLab
- Operating route protection: `/journey.html` remains v34
- v35 preview protection: `/journey-v35-preview.html` remains v35

## Automated checks

| Check | Status | Notes |
|---|---|---|
| `npm run smoke:v36:static` | Pending | Run through v36 Smoke workflow |
| `npm run typecheck:v36` | Pending | Run through v36 Smoke workflow |
| `npm run build` | Pending | Run through v36 Smoke workflow |
| `npm run smoke:v36` | Pending | Integrated v36 check |
| `npm run smoke:v35` | Pending | Regression guard |

## Browser QA checklist

| Area | Status | Notes |
|---|---|---|
| `/journey.html` regression | Pending | Must remain v34 operating route |
| `/journey-v35-preview.html` regression | Pending | Must remain v35 preview route |
| `/journey-v36-preview.html` render | Pending | Must render v36 title and 13-step flow |
| Step 1 entry save/restore | Pending | `ckd-v36-participant`, `ckd-v36-progress` |
| Step 7 CustomerCallPlanLab render | Pending | Full Lab screen |
| Customer A-D cards | Pending | A/B/C/D cards and data |
| Team member 6 cards | Pending | Fixed 6 team members |
| Focus/deprioritized dropdowns | Pending | Choice updates prompt |
| Member role assignment | Pending | Role edits persist |
| Prompt copy | Pending | Copy success/failure message |
| AI paste area | Pending | Long text input and restore |
| Review checklist | Pending | 8 criteria and count update |
| Risk expression checklist | Pending | Risk count update |
| Field revision area | Pending | Text input and restore |
| Final 2-week call plan | Pending | 10 output fields |
| Facilitator summary | Pending | Choice summary, review summary, discussion questions |
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
Prompt copy:
AI paste area:
Review checklist:
Risk expression checklist:
Final call plan fields:
localStorage restore:
Mobile/tablet layout:
Console errors:

Notes:
```

## Decision gate

v36 PR should remain Draft until:

1. v36 Smoke workflow passes.
2. v35 Smoke remains passing.
3. Browser QA is recorded in this document.
4. `/journey.html` and `/journey-v35-preview.html` regression checks pass.
5. CustomerCallPlanLab Step 7 checks pass on at least desktop and one mobile/tablet viewport.
