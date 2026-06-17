# v39 Steps 1-7 Browser QA Checklist

## 1. Purpose

This checklist is for browser QA on the v39 preview journey, focusing on Steps 1-7.

Route under test:

```text
/journey-v39-preview.html
```

The goal is to confirm that the early flow is smooth, safe, and consistent before the learner enters the Step 8 coaching target selection flow.

## 2. Protected scope

Do not test against or modify the production route:

```text
/journey.html
```

Protected files remain untouched:

```text
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

## 3. Verified baseline before this checklist

Latest verified commit before this checklist:

```text
d8ca8b2aeb508c45f93392e38858faa37c73b3f6
```

Actions result:

```text
C1Bio MVP CI: success
v39 Smoke: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v40-lite Smoke: success
```

## 4. General QA environment

Recommended browser checks:

```text
Chrome desktop
Edge desktop
Android Chrome or Samsung Internet
Tablet viewport if available
```

Minimum viewport checks:

```text
Mobile width: 390px or similar
Tablet width: 768px or similar
Desktop width: 1280px or similar
```

Before starting:

```text
Open /journey-v39-preview.html
Click 진행 초기화
Refresh the page
Confirm the app starts from 1단계
```

## 5. Global checks for Steps 1-7

For every step from 1 to 7, verify:

```text
No blank screen
No infinite loading
No obvious layout collapse
Next / Previous navigation works
Step navigation does not jump to production route
No developer-only wording appears to learners
No CRM standalone wording appears as primary label
No actual customer / hospital / doctor / product / internal numeric data is requested
```

Preferred terminology on learner screens:

```text
영업활동 기록
방문·면담 기록
고객 활동 Data
사내 영업활동 시스템
고객 Data
후속조치 기록
```

Avoid visible learner wording:

```text
CRM 기록
CRM Data
CRM 분석
CRM상 고객 등급
CRM 기록 품질
```

## 6. Step 1 QA: 입장·역할 부여

Screen title intent:

```text
오늘은 C1바이오 영업팀장 역할로 판단합니다
```

Check actions:

```text
1. Select a team from the team dropdown.
2. Enter a nickname or non-sensitive name.
3. Check the role acceptance checkbox.
4. Move to Step 2.
5. Go back to Step 1 and confirm entered values remain.
6. Refresh and confirm values remain.
7. Click 진행 초기화 and confirm values are cleared.
```

Pass criteria:

```text
Team and name save without screen crash.
Role acceptance state is retained until reset.
Reset clears participant and progress values.
```

## 7. Step 2 QA: AI 안전선

Screen title intent:

```text
AI를 쓰기 전에 말해도 되는 선부터 확인합니다
```

Check actions:

```text
1. Read the AI safety notice.
2. Confirm it warns against actual customer names, hospital names, medical staff names, product names, internal sales / prescription numbers, and personal information.
3. Confirm the message frames AI as a judgment-support tool, not an answer-deciding tool.
4. Move to Step 3 and back.
```

Pass criteria:

```text
Safety guidance is visible before AI practice.
The screen does not encourage entering sensitive or real-world customer data.
Navigation remains smooth.
```

## 8. Step 3 QA: 프롬프트 기본 실습

Screen title intent:

```text
AI에게 잘 묻기 전에, 내 고민을 먼저 정리합니다
```

Check actions:

```text
1. Confirm the screen explains role, context, request, and output format.
2. Enter or generate a structured prompt using non-sensitive fictional or generalized data.
3. Confirm the flow does not ask for real customer / product / hospital names.
4. Move to Step 4 and back.
5. Refresh and confirm relevant input remains if the step saves data.
```

Pass criteria:

```text
Learner can understand the difference between a loose question and a structured prompt.
No sensitive real data is required.
The step does not crash on refresh.
```

## 9. Step 4 QA: AI 전략 리서치

Screen title intent:

```text
공개자료에서 변화 신호를 찾고, 우리 팀 질문으로 바꿉니다
```

Check actions:

```text
1. Confirm Step 4 frames research as public-source learning, not confidential analysis.
2. Confirm learner can connect strategic research to team questions.
3. Confirm Step 4 provides a bridge into Step 5 management metrics.
4. Move to Step 5 and back.
```

Pass criteria:

```text
The screen encourages public and non-sensitive research only.
Research is converted into management questions, not just copied summaries.
The Step 4 to Step 5 transition feels natural.
```

## 10. Step 5 QA: 우리 팀 관리 지표 선정

Screen title intent:

```text
우리 팀 관리 지표 선정
```

Core meaning:

```text
Step 5 turns the Step 4 strategic signals into management metrics for the team.
```

Check actions:

```text
1. Select team situation items.
2. Select core management metrics.
3. Select supporting field signals.
4. Select safety / interpretation caution metrics if available.
5. Enter a short rationale for why these metrics matter.
6. Save or allow auto-save.
7. Refresh the page.
8. Confirm selections and rationale remain.
9. Move to Step 6 and confirm Step 6 can reference Step 5 context.
```

Pass criteria:

```text
Step 5 data remains after refresh.
No storage error breaks the screen.
The learner can tell why selected metrics matter.
Step 6 can build on Step 5.
```

Storage regression check:

```text
Step 5 result store should use getJson / setJson / removeStoredPrefix.
Direct window.localStorage calls should not return.
```

## 11. Step 6 QA: 고객 Data 확인 List

Screen title intent:

```text
고객의 무엇을 확인할 것인가
```

Core meaning:

```text
Step 6 is not customer ranking.
Step 6 converts Step 5 metrics into customer Data evidence and questions.
```

Check actions:

```text
1. Confirm Step 6 displays or refers to Step 5 management metric context.
2. Select customer Data evidence cards.
3. Enter notes for what to confirm in customer activity Data.
4. Confirm the screen does not ask the learner to grade or label real customers.
5. Save or allow auto-save.
6. Refresh the page.
7. Confirm saved customer Data check items remain.
8. Move to Step 7 and confirm Step 7 can reference Step 6 context.
```

Pass criteria:

```text
Step 6 stays focused on evidence and questions.
It does not become customer evaluation or customer ranking.
Saved items survive refresh.
Step 7 can read Step 6 context.
```

Storage regression check:

```text
Step 6 result store should use getJson / setJson / removeStoredPrefix.
Direct window.localStorage calls should not return.
```

## 12. Step 7 QA: 고객군별 2주 대응 방향

Screen title intent:

```text
고객군별 2주 대응 방향
```

Core meaning:

```text
Step 7 uses Step 6 customer Data evidence to organize two-week response directions.
Step 7 is not team member assignment.
Step 7 is not customer grading.
```

Check actions:

```text
1. Confirm Step 7 references Step 6 customer Data check results.
2. Review customer group / condition cards.
3. Confirm F is treated as 안전선 점검 조건, not a customer group.
4. Enter or review two-week direction notes.
5. Confirm team member assignment wording does not dominate this step.
6. Save or allow auto-save.
7. Refresh the page.
8. Confirm saved two-week directions remain.
9. Move to Step 8 and confirm the next step is 코칭 대상 선정.
```

Pass criteria:

```text
Step 7 clearly separates evidence from two-week response direction.
Step 7 does not force customer group × team member assignment.
Saved direction remains after refresh.
Step 8 opens as coaching target selection.
```

Storage regression check:

```text
Step 7 result store should use getJson / setJson / removeStoredPrefix.
Direct window.localStorage calls should not return.
```

## 13. Reset QA

After completing at least Steps 1, 5, 6, and 7:

```text
1. Click 진행 초기화.
2. Confirm the app returns to Step 1.
3. Refresh the page.
4. Confirm Step 1 remains clean.
5. Move to Steps 5, 6, and 7.
6. Confirm old management metrics, customer Data check items, and two-week directions are cleared.
```

Pass criteria:

```text
removeStoredPrefix('ckd.v39.') clears all v39-scoped saved results.
No previous learner data leaks into a fresh run.
```

## 14. Browser console check

Open browser dev tools console during QA.

Pass criteria:

```text
No uncaught exceptions during navigation.
No localStorage access exception breaks the app.
No JSON parse error causes blank screen.
No React crash boundary or blank root.
```

## 15. Final QA pass criteria

Steps 1-7 are ready for pilot use if:

```text
All seven steps render without blank screens.
Navigation works forward and backward.
Refresh keeps expected saved values.
진행 초기화 clears all v39 saved values.
Step 5 feeds Step 6.
Step 6 feeds Step 7.
Step 7 feeds Step 8 as 코칭 대상 선정.
No real customer / hospital / medical staff / product / internal numeric data is requested.
No direct customer grading or ranking is encouraged.
No CRM standalone wording is used as the main learner-facing term.
```
