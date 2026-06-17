# v41 Manual QA Checklist

## Purpose

Verify the isolated v41 preview lane without changing the existing pilot route.

- v41 route: `/journey-v41-preview.html`
- existing pilot entry: `/ckd-ai-lab.html`
- existing pilot route: `/journey-v40-vnext-preview.html`

## Before browser QA

Run locally when a checkout is available.

```bash
npm run smoke:v41
```

`npm run smoke:v41` includes:

- `npm run smoke:v41:static`
- `npm run typecheck:v41`
- `npm run build`

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
| 1 | 시작하기 | Team/name gate works and later steps remain blocked until required fields are entered. |
| 2 | 팀원 보기 | Seven members are visible in the intended order and language is observation-focused. |
| 3 | 질문 다듬기 | One-line question, structured prompt, checklist, and comparison memo work. |
| 4 | 시장 변화 읽기 | Public-source research prompt and team performance-management question flow work. |
| 5 | 팀 기준 만들기 | Team strategy task, CSF, KPI, and initiative are selected step-by-step without auto-selection. |
| 6 | 업무관리 실행계획 만들기 | Step 5 criteria become team standard, execution cycle, execution plan, evidence, and check questions. |
| 7 | 할 일·줄일 일 | Step 6 execution plan becomes priority tasks, reduced tasks, 3-step flow, and execution declaration. |
| 8 | 업무 경계 나누기 | Step 7 flow becomes member tasks, leader checks, coordination tasks, boundary declaration, and people signal. |
| 9 | 1on1 대상 고르기 | Step 8 boundary/people signal flows into direct member selection and observation/interpretation notes. |
| 10 | 1on1 첫 문장 | Step 9 preparation and Step 6 execution cycle create opening line, check questions, action agreement, and follow-up memo. |

## Storage isolation

Check browser localStorage.

- [ ] Participant and progress use `ckd.v41.participant.v1` and `ckd.v41.progress.v1`.
- [ ] Step 3 uses `ckd.v41.promptPracticeReview.v2`.
- [ ] Step 4 uses `ckd.v41.pharmaStrategyResearch.v1`.
- [ ] Step 5 uses `ckd.v41.performanceCascade.v1` and `ckd.v41.performanceCascade.aiExpansion.v1`.
- [ ] Step 6~8 use `ckd.v41.taskManagement.v10`.
- [ ] Step 9~10 use `ckd.v41.peopleManagement.v2`.
- [ ] v40 pilot keys are not intentionally cleared by v41 reset.

## Reset QA

- [ ] Click `v41 입력 초기화`.
- [ ] Confirm Step 1 values are cleared.
- [ ] Confirm Step 3~10 v41 inputs are cleared.
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
- Step 5~10 data flow is usable.
- Step 10 uses the execution cycle selected in Step 6.
- v41 storage remains separated from v40 storage.
- Existing v40 pilot route remains unchanged.
- Tablet/mobile layout is usable for facilitation.

## Run log

| Date | Tester | Environment | Result | Notes |
| --- | --- | --- | --- | --- |
| 2026-06-13 |  |  | Pending | Initial checklist created. |
