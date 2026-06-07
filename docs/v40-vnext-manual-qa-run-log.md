# v40-vNext Manual QA Run Log

This file records the current verification status after adding the v40-vNext manual QA checklist.

## 1. Target

- PR: #2 `chore(v37): start isolated preview lane`
- Manual QA tracking issue: #3 `Run v40-vNext manual browser QA`
- Branch: `feature/v37-preview-shell`
- Route under test: `/journey-v40-vnext-preview.html`
- QA checklist: `docs/v40-vnext-manual-qa-checklist.md`
- Latest verified head before this log update: `75990f969e415d165a9929309cfe2e7ebebfb8bb`

## 2. Automated verification status

The following checks were confirmed successful for head `75990f969e415d165a9929309cfe2e7ebebfb8bb`.

- [x] Vercel deployment status: success
- [x] C1Bio MVP CI: success
- [x] v35 Smoke: success
- [x] v36 Smoke: success
- [x] v38 Smoke: success
- [x] v39 Smoke: success
- [x] v40-lite Smoke: success
- [x] v40-vNext Smoke: success
- [x] v40-vNext static smoke check: success
- [x] v40-vNext scoped TypeScript check: success
- [x] Vite build: success

## 3. Manual browser QA status

Manual browser QA is tracked in issue #3 and still needs to be executed in the latest Vercel preview.

- [ ] Open the latest Vercel deployment.
- [ ] Navigate to `/journey-v40-vnext-preview.html`.
- [ ] Run checklist section 0: Pre-check.
- [ ] Run checklist section 1: Protected route guard.
- [ ] Run checklist section 2: Step 1 to Step 4 basic flow.
- [ ] Run checklist section 3: Step 8 to Step 10 task management QA.
- [ ] Run checklist section 4: Step 11 to Step 12 people management storage connection.
- [ ] Run checklist section 5: Step 12 collapsible roleplay UI QA.
- [ ] Run checklist section 6: Step 13 final memo connection QA.
- [ ] Run checklist section 7: Reset and persistence QA.
- [ ] Confirm checklist section 8 pass criteria.

## 4. Critical manual QA focus

Prioritize these checks during the first browser pass.

### A. Step 11 to Step 12 data connection

Confirm the following Step 11 values appear correctly in Step 12.

- [ ] selected member
- [ ] selection reason
- [ ] observed behaviors
- [ ] risky interpretations
- [ ] 1on1 focus

Expected shared storage key:

```text
ckd.v40-vnext.peopleManagement.v2
```

### B. Step 12 roleplay card usability

Confirm Step 12 is not visually overwhelming.

- [ ] Roleplay 1 is a collapsible card.
- [ ] Roleplay 2 is a collapsible card.
- [ ] Comparison reflection is a collapsible card.
- [ ] Prompt previews remain nested inside each card.
- [ ] Conversation-log fields remain inside the correct card.
- [ ] Copy buttons still work.

### C. Step 12 to Step 13 final memo connection

After filling Step 12 roleplay/reflection fields, move to Step 13.

- [ ] Click `v40-vNext 최신 결과로 채우기`.
- [ ] Confirm roleplay-revised first sentence appears.
- [ ] Confirm final coaching sentence appears.
- [ ] Confirm roleplay-revised 2-week behavior agreement appears.
- [ ] Confirm follow-up question appears.

Expected storage keys:

```text
ckd.v40-vnext.taskManagement.v10
ckd.v40-vnext.peopleManagement.v2
ckd.v40-vnext.finalExecutionMemo.v1
```

## 5. Manual QA result summary

Fill this section after the browser pass.

- Manual QA date:
- Tester:
- Browser/device:
- Vercel deployment URL:
- Result: Pending
- Blocking issues:
- Non-blocking UX notes:
- Ready for facilitated pilot: Pending

## 6. Known limitation of this log

This run log records automated verification and provides the manual QA execution structure. The actual browser pass must be completed in the Vercel preview environment because the assistant session could not directly open and interact with the private preview route.
