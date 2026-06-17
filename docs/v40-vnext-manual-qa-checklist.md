# v40-vNext Manual QA Checklist

This checklist is for the isolated v40-vNext preview lane used in the pilot run.

- Route: `/journey-v40-vnext-preview.html`
- Branch: `feature/v37-preview-shell`
- Protected routes/files: `journey.html`, `/journey-v39-preview.html`, `src/journey-v39-*`, v40-lite files
- Pilot flow: 11 visible steps
- Hidden for pilot: final execution memo step / `final-call-plan-card`

## 0. Pre-check

- [ ] Open the latest Vercel preview for the PR.
- [ ] Navigate directly to `/journey-v40-vnext-preview.html`.
- [ ] Confirm the page title shows `C1바이오 영업팀장 AI 리더십 Lab Journey`.
- [ ] Confirm the route is the isolated v40-vNext preview route.

## 1. Protected route guard

Confirm v40-vNext changes do not leak into protected routes.

- [ ] `/journey.html` still opens the operating route and does not show v40-vNext labels.
- [ ] `/journey-v39-preview.html` still opens the v39 preview route and does not show v40-vNext labels.
- [ ] `/journey-v40-lite-preview.html` still opens the v40-lite route and is not overwritten by v40-vNext.

## 2. Step 1 entry gate

The pilot flow requires only team and name/nickname before moving beyond Step 1.

- [ ] Step 1 shows team selection.
- [ ] Step 1 shows name/nickname input.
- [ ] Without team selection, the bottom `다음 단계` button does not move to Step 2 and shows the entry-gate message.
- [ ] Without name/nickname, the bottom `다음 단계` button does not move to Step 2 and shows the entry-gate message.
- [ ] Without team and name/nickname, the flow-strip chips do not allow direct movement to Step 2 or later.
- [ ] Without team and name/nickname, the progress-coach phase cards do not allow movement to later phases.
- [ ] After entering team and name/nickname, Step 2 and later steps can be selected freely.
- [ ] Representative situation and role agreement remain useful but are not mandatory for navigation.

Expected entry-gate message:

```text
1단계에서 팀과 이름/닉네임을 먼저 입력해 주세요. 2단계부터는 자유롭게 이동할 수 있습니다.
```

## 3. Progress coach panel QA

Confirm the progress coach panel helps participants understand where they are and what they should produce.

- [ ] `팀장 역할 진행 코치` appears above the step body on every visible v40-vNext step.
- [ ] The current step number is displayed with the format `n / 11`.
- [ ] The progress bar or step indicator advances when moving forward and backward across steps.
- [ ] `이번 단계 코칭 포인트` accurately describes the action for the current step.
- [ ] `산출물` accurately describes the output for the current step.
- [ ] `팀장 역할 진행 상태` reflects team name, name/nickname, representative situation, and role agreement status.
- [ ] Long representative situation text is shortened without breaking the card layout.
- [ ] The four phase cards are visible:
  - [ ] 준비·역할
  - [ ] 성과관리
  - [ ] 업무관리
  - [ ] 사람관리
- [ ] Clicking each phase card moves to that phase's first visible step after the Step 1 entry gate is satisfied.
- [ ] Phase status labels show `완료`, `진행 중`, or `예정` correctly.
- [ ] The panel remains readable on mobile/tablet and does not push the main task too far below the fold.

## 4. Step 4 research-to-output flow

Expected storage key:

```text
ckd.v40-vnext.pharmaStrategyResearch.v1
```

Confirm all locked research output fields are still present and the duplicated NotebookLM source-registration section does not appear.

- [ ] Step 5 shows `1단계: Perplexity로 최신 공개자료와 URL 찾기` inside the research lab.
- [ ] Perplexity prompt asks for latest public sources and URLs only.
- [ ] Pasted Perplexity output produces `분리된 웹 소스 URL`.
- [ ] The duplicate `NotebookLM 소스 등록하기` section does not appear.
- [ ] Research lab shows `3단계: NotebookLM 소스 기반 전략 과제 압축`.
- [ ] `NotebookLM 결과 항목별로 정리하기` fills 추진 과제 1/2/3, 우리 팀 실행 영향, 2주 실행관리 질문과 KPI 후보, and 주의해야 할 표현 where matching headings are present.
- [ ] LM Studio 보고서/슬라이드/인포그래픽 prompts are concise output-format instructions, not long pasted content repeats.
- [ ] Copy buttons still work after changing topic, team situation, and pasted outputs.
- [ ] Values remain saved in localStorage after navigating away and returning to the research lab in the same browser.

## 5. Task management QA

### 업무관리 1

- [ ] Select an ambiguous task instruction.
- [ ] Review expected team member reactions.
- [ ] Select what is missing from the instruction.
- [ ] Confirm the expert standard is visible.
- [ ] Compare team choice with the expert recommendation.
- [ ] Decide the final reflected standard.
- [ ] Copy the AI prompt for task execution draft.
- [ ] Paste a sample AI draft.
- [ ] Fill in `수정한 업무지시문`.
- [ ] Fill in `완료 기준`.
- [ ] Fill in `팀장이 지원할 부분`.

### 업무관리 2

- [ ] Confirm the selected instruction is visible.
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

### 업무관리 3

- [ ] Confirm the previous execution flow is visible again.
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
- [ ] Revise into team language.
- [ ] Complete the work boundary declaration.

## 6. People management storage connection

Storage key to verify:

```text
ckd.v40-vnext.peopleManagement.v2
```

### 사람관리 1

- [ ] Confirm task management results are visible where intended.
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
- [ ] Write one sentence explaining why the team selected this member.

### 사람관리 2

Confirm the selected people-management data appears correctly.

- [ ] Selected member carries over correctly.
- [ ] Selection reason carries over correctly.
- [ ] 1on1 focus carries over correctly.
- [ ] Observed behaviors are used in prompt defaults.
- [ ] Risky interpretations are used in roleplay prompt defaults.

## 7. Roleplay UI QA

Confirm the roleplay practice section is easier to navigate.

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
  - [ ] 우리 팀이 최종 적용할 코칭 문장 1개
  - [ ] 역할극 후 수정한 첫 문장
  - [ ] 역할극 후 수정한 2주 행동 합의
- [ ] Confirm copy buttons still write prompt text to the clipboard.
- [ ] Confirm no roleplay prompt asks for actual customer names, hospital names, product names, real sales data, prescription data, evaluation grades, unapproved efficacy, off-label implications, prescription-inducing language, definitive superiority claims, or competitor disparagement.

## 8. Hidden final memo step guard

For the pilot run, the final execution memo step is hidden but its component and storage key are preserved for future reuse.

- [ ] The visible flow ends at `사람관리 2`.
- [ ] The flow strip does not show `2주 실행 메모와 복기 질문 완성하기`.
- [ ] The progress coach shows `사람관리` as the final phase.
- [ ] Direct visible navigation does not expose `final-call-plan-card`.

## 9. Reset and persistence QA

- [ ] Refresh the browser and confirm entered v40-vNext data persists.
- [ ] Confirm protected routes are not reset or modified unexpectedly.
- [ ] Confirm localStorage keys use `ckd.v40-vnext.*`.

## 10. Pass criteria

The preview can be considered ready for a facilitated pilot run when all of the following are true.

- [ ] CI is green: v40-vNext smoke, scoped TypeScript check, and Vite build pass.
- [ ] v39 route remains protected.
- [ ] v40-lite route remains protected.
- [ ] Step 1 team and name/nickname entry gate works.
- [ ] Step 2 and later steps can be selected freely after the entry gate is satisfied.
- [ ] Progress coach panel correctly shows current step, action, output, team status, and phase navigation.
- [ ] Step 4 research-to-output flow works without duplicated NotebookLM source-registration UI.
- [ ] People-management data correctly carries into roleplay practice.
- [ ] Roleplay cards are visually clear and usable.
- [ ] Final memo step remains hidden for pilot.
- [ ] Compliance guardrails are visible and preserved in prompts.
- [ ] Team-language principle is preserved: `우리 팀` language is used for outputs.
