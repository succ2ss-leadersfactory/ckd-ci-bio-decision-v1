# v40-vNext Manual QA Checklist

This checklist is for the isolated v40-vNext preview lane.

- Route: `/journey-v40-vnext-preview.html`
- Branch: `feature/v37-preview-shell`
- Protected routes/files: `journey.html`, `/journey-v39-preview.html`, `src/journey-v39-*`, v40-lite files
- Core flow: performance management → task management → people management → final 2-week execution memo

## 0. Pre-check

- [ ] Open the latest Vercel preview for the PR.
- [ ] Navigate directly to `/journey-v40-vnext-preview.html`.
- [ ] Confirm the page title shows `C1바이오 영업팀장 AI 리더십 Lab Journey v40-vNext`.
- [ ] Confirm the screen explains that v39 is protected and this route is v40-vNext only.
- [ ] Click `v40-vNext 입력 초기화` before the test run.

## 1. Protected route guard

Confirm v40-vNext changes do not leak into protected routes.

- [ ] `/journey.html` still opens the operating route and does not show v40-vNext labels.
- [ ] `/journey-v39-preview.html` still opens the v39 preview route and does not show v40-vNext labels.
- [ ] `/journey-v40-lite-preview.html` still opens the v40-lite route and is not overwritten by v40-vNext.

## 2. Progress coach panel QA

Confirm the new v40-vNext progress coach panel helps participants understand where they are and what they should produce.

- [ ] `지금 단계 코치` appears above the step body on every v40-vNext step.
- [ ] The current step number is displayed as `현재 위치` with the format `n / 13`.
- [ ] The progress bar advances when moving forward and backward across steps.
- [ ] `이번 단계 행동` accurately describes the action for the current step.
- [ ] `완성 산출물` accurately describes the output for the current step.
- [ ] `다음 단계 미리보기` shows the next step title, or `최종 정리 완료` on Step 13.
- [ ] `조별 진행 상태` shows group name, team/table, representative situation, and role agreement status.
- [ ] The representative situation is shortened without breaking the card layout when the text is long.
- [ ] The four phase cards are visible:
  - [ ] 준비·리서치
  - [ ] 성과관리
  - [ ] 업무관리
  - [ ] 사람관리·통합
- [ ] Clicking each phase card moves to that phase's first step.
- [ ] Phase status labels show `완료`, `진행 중`, or `예정` correctly.
- [ ] The panel remains readable on mobile/tablet and does not push the main task too far below the fold.

## 3. Step 1 to Step 4 basic flow

### Step 1 · 조별 역할 잡기

- [ ] Select a group name.
- [ ] Select a team/table.
- [ ] Enter `우리 조가 다룰 대표 상황`.
- [ ] Check the role agreement box.
- [ ] Confirm language uses `우리 조` rather than individual-only phrasing.

### Step 2 · 말해도 되는 선 확인

- [ ] Confirm the compliance notice includes no-entry items such as actual customer names, hospital names, product names, actual sales data, prescription data, team member real names, internal strategy, personal information, evaluation grades, unapproved efficacy, off-label implications, prescription-inducing language, competitor disparagement, and definitive superiority claims.

### Step 3 · AI 질문 다듬기

- [ ] Confirm the prompt practice step asks the group to structure the question rather than directly asking AI for an answer.
- [ ] Confirm the safety line remains visible or clearly referenced.

### Step 4 · 영업전략 리서치 산출물 만들기

Confirm all locked research output fields are still present.

- [ ] Perplexity 리서치 질문
- [ ] Perplexity 답변 / `perplexityAnswer`
- [ ] NotebookLM 소스 묶음 / `notebookSourceBundle`
- [ ] NotebookLM 소스 기반 종합 답변 / `notebookLmAnswer`
- [ ] 전략 이슈 3개 / `issueOne`, `issueTwo`, `issueThree`
- [ ] 우리 팀 영향 / `teamImpact`
- [ ] 관리 지표로 바꿀 실행 질문 / `metricBridgeQuestions`
- [ ] Studio 보고서 초안 / `studioReportDraft`
- [ ] Studio 슬라이드 구성안 / `studioSlideOutline`
- [ ] Studio 인포그래픽 초안 / `studioInfographicDraft`
- [ ] 전략회의 메모 / `strategyMeetingMemo`
- [ ] 예상 질문 / `expectedQuestions`
- [ ] 주의 표현 / `complianceCaution`

## 4. Step 8 to Step 10 task management QA

### Step 8 · 업무관리 1

- [ ] Select an ambiguous task instruction.
- [ ] Review expected team member reactions.
- [ ] Select what is missing from the instruction.
- [ ] Confirm the expert standard is visible.
- [ ] Compare group choice with the expert recommendation.
- [ ] Decide the final reflected standard.
- [ ] Copy the AI prompt for task execution draft.
- [ ] Paste a sample AI draft.
- [ ] Fill in `수정한 업무지시문`.
- [ ] Fill in `완료 기준`.
- [ ] Fill in `팀장이 지원할 부분`.
- [ ] Confirm the seven task management elements are reflected: background, purpose, scope, priority, schedule, completion criteria, mid-check.

### Step 9 · 업무관리 2

- [ ] Confirm the Step 8 selected instruction is visible.
- [ ] Select execution task candidates.
- [ ] Select work to do first.
- [ ] Select work to reduce temporarily.
- [ ] Copy the AI prompt for execution flow.
- [ ] Paste the full AI draft.
- [ ] Use or verify the item split flow.
- [ ] Confirm the three-step work flow is populated.
- [ ] Confirm bottleneck signal is populated.
- [ ] Confirm mid-check question is populated.
- [ ] Write the 30-second execution declaration.
- [ ] Copy final flow review prompt.
- [ ] Paste AI review opinion.
- [ ] Fill in one final revision point.

### Step 10 · 업무관리 3

- [ ] Confirm the Step 9 execution flow is visible again.
- [ ] Confirm execution item cards are visible.
- [ ] Classify items into four baskets:
  - [ ] 팀원이 혼자 처리할 일
  - [ ] 팀장 확인이 필요한 일
  - [ ] 다른 부서 협조가 필요한 일
  - [ ] 상위 리더에게 공유할 일
- [ ] Select why it is risky to handle alone.
- [ ] Select the team leader intervention timing.
- [ ] Copy AI coordination-message prompt.
- [ ] Paste AI coordination draft.
- [ ] Revise into group language.
- [ ] Complete the work boundary declaration.

## 5. Step 11 to Step 12 people management storage connection

Storage key to verify:

```text
ckd.v40-vnext.peopleManagement.v2
```

### Step 11 · 사람관리 1

- [ ] Confirm Step 9 and Step 10 results are visible.
- [ ] Confirm all seven inherited members are available:
  - [ ] 김재호 차장
  - [ ] 김문호 차장
  - [ ] 유희관 과장
  - [ ] 이대은 대리
  - [ ] 신재영 대리
  - [ ] 박재욱 사원
  - [ ] 문교원 사원
- [ ] Select one member to talk with first.
- [ ] Select observed behaviors.
- [ ] Select risky interpretations.
- [ ] Select one 1on1 focus.
- [ ] Write one sentence explaining why the group selected this member.

### Step 12 · 사람관리 2

Confirm the selected Step 11 data appears in Step 12.

- [ ] Selected member carries over correctly.
- [ ] Selection reason carries over correctly.
- [ ] 1on1 focus carries over correctly.
- [ ] Observed behaviors are used in prompt defaults.
- [ ] Risky interpretations are used in roleplay prompt defaults.

## 6. Step 12 collapsible roleplay UI QA

Confirm the Step 12 roleplay practice section is easier to navigate.

- [ ] `AI 역할극 리허설 1 · 내가 팀장 역할` appears as a collapsible practice card.
- [ ] Opening roleplay 1 shows the prompt copy button.
- [ ] Opening roleplay 1 shows the nested prompt preview details.
- [ ] Roleplay 1 conversation-log textarea is visible inside the card.
- [ ] `AI 역할극 리허설 2 · AI가 코칭 팀장 역할` appears as a collapsible practice card.
- [ ] Opening roleplay 2 shows the pushback-type selection.
- [ ] Opening roleplay 2 shows the prompt copy button.
- [ ] Opening roleplay 2 shows the nested prompt preview details.
- [ ] Roleplay 2 conversation-log textarea is visible inside the card.
- [ ] `역할극 후 비교 성찰` appears as a collapsible practice card.
- [ ] Opening comparison reflection shows:
  - [ ] AI 팀장의 대응에서 배울 점 1가지
  - [ ] 우리 조가 최종 적용할 코칭 문장 1개
  - [ ] 역할극 후 수정한 첫 문장
  - [ ] 역할극 후 수정한 2주 행동 합의
- [ ] Confirm copy buttons still write prompt text to the clipboard.
- [ ] Confirm no roleplay prompt asks for actual customer names, hospital names, product names, real sales data, prescription data, evaluation grades, unapproved efficacy, off-label implications, prescription-inducing language, definitive superiority claims, or competitor disparagement.

## 7. Step 13 final memo connection QA

Storage keys to verify:

```text
ckd.v40-vnext.taskManagement.v10
ckd.v40-vnext.peopleManagement.v2
ckd.v40-vnext.finalExecutionMemo.v1
```

### Step 13 · 2주 실행 메모와 복기 질문 완성하기

- [ ] Confirm `v40-vNext 13단계 · 통합 실행 메모` appears before the inherited v39 final card.
- [ ] Click `v40-vNext 최신 결과로 채우기`.
- [ ] Confirm task management outputs from Steps 8 to 10 populate the task and boundary memo fields.
- [ ] Confirm people management outputs from Steps 11 to 12 populate the people memo field.
- [ ] Confirm the people memo includes:
  - [ ] selected member
  - [ ] observed behavior
  - [ ] risky interpretation
  - [ ] 1on1 focus
  - [ ] roleplay-revised first sentence
  - [ ] final coaching sentence
  - [ ] roleplay-revised 2-week behavior agreement
  - [ ] follow-up question
- [ ] Click `2주 실행 메모 복사`.
- [ ] Paste copied text somewhere safe and confirm all six sections appear:
  - [ ] 성과관리 기준
  - [ ] 업무관리 실행 메모
  - [ ] 업무 경계와 조율 메모
  - [ ] 사람관리 1on1 메모
  - [ ] 후속 확인 메모
  - [ ] 복기 질문

## 8. Reset and persistence QA

- [ ] Refresh the browser and confirm entered v40-vNext data persists.
- [ ] Click `v40-vNext 입력 초기화`.
- [ ] Confirm v40-vNext inputs reset.
- [ ] Confirm protected routes are not reset or modified unexpectedly.

## 9. Pass criteria

The preview can be considered ready for a facilitated pilot run when all of the following are true.

- [ ] CI is green: v40-vNext smoke, scoped TypeScript check, and Vite build pass.
- [ ] v39 route remains protected.
- [ ] v40-lite route remains protected.
- [ ] Progress coach panel correctly shows current position, action, output, next step, group status, and phase navigation.
- [ ] Step 11 data correctly carries into Step 12.
- [ ] Step 12 roleplay cards are visually clear and usable.
- [ ] Step 13 pulls latest task and people results into the final memo.
- [ ] Compliance guardrails are visible and preserved in prompts.
- [ ] Group-language principle is preserved: `우리 조` language is used for outputs.
