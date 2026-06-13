# v41 Manual QA Checklist

## Purpose

Verify the isolated v41 preview lane without changing the existing pilot route.

- v41 route: `/journey-v41-preview.html`
- existing pilot entry: `/ckd-ai-lab.html`
- existing pilot route: `/journey-v40-vnext-preview.html`

## Before browser QA

Run locally when a checkout is available.

```bash
npm run smoke:v41:static
npm run typecheck:v41
npm run smoke:v41
```

Expected result:

- Static smoke passes.
- v41 typecheck passes.
- Build completes.

## Route protection

- [ ] `/journey-v41-preview.html` opens the v41 app.
- [ ] `/ckd-ai-lab.html` still opens the existing v40-vNext pilot flow.
- [ ] `/journey-v40-vnext-preview.html` still opens the existing v40-vNext app.
- [ ] v41 labels do not appear in the existing pilot screen.

## Step 1 gate

- [ ] Click Next without team/name.
- [ ] Confirm the team/name alert appears.
- [ ] Enter team and name.
- [ ] Confirm Step 2 opens.
- [ ] Confirm later steps can be selected after Step 1 is complete.

## Step-by-step browser QA

| Step | Screen | Check |
| --- | --- | --- |
| 2 | 팀원 보기 | Seven members are visible and the language is observation-focused. |
| 3 | AI 입력 기준 | Safety guidance loads and warns against sensitive information. |
| 4 | 질문 다듬기 | One-line question, structured prompt, checklist, and comparison memo work. |
| 5 | 시장 변화 읽기 | Perplexity prompt, URL extraction, NotebookLM prompt, and organization flow work. |
| 6 | 팀 기준 만들기 | CSF/KPI selection creates 2-week performance standards. |
| 7 | 업무지시 만들기 | Step 6 outputs become an actionable task instruction. |
| 8 | 할 일·줄일 일 | Priority tasks, reduce tasks, 3-step flow, and declaration work. |
| 9 | 업무 경계 나누기 | Member tasks, leader checks, coordination tasks, and boundary declaration work. |
| 10 | 1on1 대상 고르기 | Step 9 signal flows into member selection and observation/interpretation notes. |
| 11 | 1on1 첫 문장 | Opening line, check questions, action agreement, and follow-up memo work. |

## Storage isolation

Check browser localStorage.

- [ ] Participant and progress use `ckd.v41.participant.v1` and `ckd.v41.progress.v1`.
- [ ] Step 4 uses `ckd.v41.promptPracticeReview.v2`.
- [ ] Step 5 uses `ckd.v41.pharmaStrategyResearch.v1`.
- [ ] Step 6 uses `ckd.v41.performanceCascade.v1`.
- [ ] Step 7~9 use `ckd.v41.taskManagement.v10`.
- [ ] Step 10~11 use `ckd.v41.peopleManagement.v2`.
- [ ] v40 pilot keys are not intentionally cleared by v41 reset.

## Reset QA

- [ ] Click `v41 입력 초기화`.
- [ ] Confirm Step 1 values are cleared.
- [ ] Confirm Step 4~11 v41 inputs are cleared.
- [ ] Confirm existing v40 pilot route still opens normally.

## Tablet/mobile QA

- [ ] Cards do not overflow horizontally.
- [ ] Buttons are easy to tap.
- [ ] Text areas remain usable.
- [ ] Progress coach does not hide the main task area.

## Pass criteria

v41 passes manual QA when:

- v41 loads independently.
- Step 1 gate works.
- Step 4~11 data flows are usable.
- v41 storage remains separated from v40 storage.
- Existing v40 pilot route remains unchanged.
- Tablet/mobile layout is usable for facilitation.

## Run log

| Date | Tester | Environment | Result | Notes |
| --- | --- | --- | --- | --- |
| 2026-06-13 |  |  | Pending | Initial checklist created. |
