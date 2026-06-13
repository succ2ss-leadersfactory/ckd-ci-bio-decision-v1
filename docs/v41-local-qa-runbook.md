# v41 Local QA Runbook

## Purpose

This runbook explains how to verify the isolated v41 preview lane on a local PC or notebook before review.

- v41 route: `/journey-v41-preview.html`
- protected pilot entry: `/ckd-ai-lab.html`
- protected pilot route: `/journey-v40-vnext-preview.html`
- checklist: `docs/v41-manual-qa-checklist.md`
- run log: `docs/v41-manual-qa-run-log.md`

## 1. Update local branch

```bash
git checkout feature/v37-preview-shell
git pull
```

## 2. Install dependencies

```bash
npm install
```

If dependencies are already installed and `package-lock.json` is current, this step should be fast.

## 3. Run v41 automated checks

```bash
npm run smoke:v41:static
npm run typecheck:v41
npm run smoke:v41
```

Expected result:

- `smoke:v41:static` passes.
- `typecheck:v41` passes.
- `smoke:v41` completes the static smoke, typecheck, and build flow.

## 4. Start local dev server

```bash
npm run dev
```

Open the local URL shown by Vite. Then visit:

```text
/journey-v41-preview.html
```

## 5. Browser QA flow

Use `docs/v41-manual-qa-checklist.md`.

Minimum browser QA path:

1. Open `/journey-v41-preview.html`.
2. Confirm Step 1 team/name gate.
3. Complete Step 4 through Step 11 with short sample inputs.
4. Confirm the data flows from:
   - Step 6 to Step 7
   - Step 7 to Step 8
   - Step 8 to Step 9
   - Step 9 to Step 10
   - Step 10 to Step 11
5. Click `v41 입력 초기화`.
6. Confirm v41 values are cleared.

## 6. Protected route check

Open these routes after v41 QA:

```text
/ckd-ai-lab.html
/journey-v40-vnext-preview.html
```

Expected result:

- Existing pilot still opens normally.
- v41 labels do not appear in the v40 pilot screen.
- v41 reset does not intentionally clear existing v40 pilot data.

## 7. Storage isolation check

In browser devtools, check Local Storage.

Expected v41 keys:

```text
ckd.v41.participant.v1
ckd.v41.progress.v1
ckd.v41.promptPracticeReview.v2
ckd.v41.pharmaStrategyResearch.v1
ckd.v41.performanceCascade.v1
ckd.v41.taskManagement.v10
ckd.v41.peopleManagement.v2
```

## 8. Record results

Update `docs/v41-manual-qa-run-log.md` with:

- Date
- Tester
- Device
- Browser
- Commit SHA
- Automated check results
- Browser QA result
- Issues found
- Ready for review decision

## 9. Review decision

Keep PR #2 as draft until:

- `npm run smoke:v41` passes locally.
- Manual browser QA is recorded.
- Existing v40 pilot route is confirmed unchanged.
