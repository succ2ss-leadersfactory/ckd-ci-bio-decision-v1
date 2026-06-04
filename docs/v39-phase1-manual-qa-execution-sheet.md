# v39 Phase 1 Manual QA Execution Sheet

## 1. Purpose

This document is a focused manual browser QA sheet for the v39 Phase 1 UI/UX wrapper completion state.

It is used after wrapper application to steps 5 through 13 and before deciding whether v39 can be frozen as a customer-demo candidate.

## 2. Baseline

| Item | Value |
|---|---|
| Repository | `succ2ss-leadersfactory/ckd-ci-bio-decision-v1` |
| Branch | `feature/v37-preview-shell` |
| Route | `/journey-v39-preview.html` |
| Latest document commit | `d134a81f2b2197a1c4e12f6dbd36d5c5dea6e729` |
| Latest wrapper code commit | `a8a45e8e422c329f2537bb9fb5d6f60b198bd3c2` |
| Current QA state | Pending browser QA |

## 3. Automated check status

| Workflow | Status |
|---|---|
| C1Bio MVP CI | success |
| v35 Smoke | success |
| v36 Smoke | success |
| v38 Smoke | success |
| v39 Smoke | success |

v39 Smoke passed static smoke, scoped TypeScript check, Vite build, and integrated smoke.

## 4. Wrapper coverage to verify

| Step | Screen | Wrapper file |
|---:|---|---|
| 5 | Team execution diagnosis | `src/journey-v39-dashboard-analysis-ux-lab.tsx` |
| 6 | Customer Data analysis | `src/journey-v39-customer-judgment-ux-lab.tsx` |
| 7 | Customer-type response strategy | `src/journey-v39-customer-priority-ux-lab.tsx` |
| 8 | Member role direction | `src/journey-v39-member-role-ux-lab.tsx` |
| 9 | Member execution dialogue | `src/journey-v39-people-dialogue-ux-lab.tsx` |
| 10 | AI execution plan prompt | `src/journey-v39-ai-call-plan-ux-lab.tsx` |
| 11 | Compliance cleanup | `src/journey-v39-compliance-cleanup-ux-lab.tsx` |
| 12 | Final two-week execution card | `src/journey-v39-final-call-plan-ux-card.tsx` |
| 13 | Instructor discussion questions | `src/journey-v39-instructor-discussion-ux-lab.tsx` |

## 5. End-to-end connection QA

| Flow | Expected result | Result | Notes |
|---|---|---|---|
| 5 to 8 | Step 8 reflects step 5 saved result | Pending |  |
| 6 to 7 | Step 7 reflects step 6 saved result | Pending |  |
| 7 to 8 | Step 8 reflects step 7 saved result | Pending |  |
| 8 to 9 | Step 9 reflects step 8 saved result | Pending |  |
| 8 to 10 | Step 10 reflects step 8 saved result | Pending |  |
| 9 to 10 | Step 10 reflects step 9 saved result | Pending |  |
| 10 to 11 | Step 11 reflects step 10 saved result | Pending |  |
| 11 to 12 | Step 12 reflects step 11 saved result | Pending |  |
| 12 to 13 | Step 13 reflects step 12 saved result | Pending |  |

## 6. Browser interaction QA

| Item | Expected result | Result | Notes |
|---|---|---|---|
| Step navigation | Previous, next, and direct step selection work | Pending |  |
| Text persistence | Input values remain after step movement | Pending |  |
| Refresh buttons | Saved values reload correctly | Pending |  |
| Draft-fill buttons | Drafts populate fields safely | Pending |  |
| Copy buttons | Prompt and summary copy buttons work | Pending |  |
| Progress reset | Reset clears progress as intended | Pending |  |
| Console | No fatal browser console errors | Pending |  |

## 7. Responsive QA

| View | Expected result | Result | Notes |
|---|---|---|---|
| PC Chrome | No horizontal overflow | Pending |  |
| Tablet landscape | Cards remain readable | Pending |  |
| Tablet portrait | Cards stack naturally | Pending |  |
| Mobile portrait | Main actions remain reachable | Pending |  |

## 8. Customer-facing wording QA

| Item | Expected result | Result | Notes |
|---|---|---|---|
| Internal wording | Internal development terms are not visible | Pending |  |
| Evaluation wording | The flow does not look like scoring or grading | Pending |  |
| Sensitive input | The UI does not request real field-sensitive information | Pending |  |
| AI role | AI is framed as support; leader judgment remains primary | Pending |  |

## 9. Go / No-Go

Current status:

```text
Pending Manual Browser QA
```

Go conditions:

```text
Automated CI remains success
Deployment is accessible
Protected route remains unchanged
5 to 13 saved-result connections work
No internal wording is visible
No sensitive-input request appears
No scoring or grading misunderstanding is created
PC, tablet, and mobile display are usable
No fatal console errors
```

## 10. QA record

| Item | Record |
|---|---|
| QA date/time |  |
| QA owner |  |
| Browser |  |
| Device |  |
| Confirmed URL |  |
| Confirmed commit |  |
| Final decision | Go / No-Go |
| Notes |  |
