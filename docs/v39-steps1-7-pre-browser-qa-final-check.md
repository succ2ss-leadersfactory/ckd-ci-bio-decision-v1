# v39 Steps 1-7 Pre-Browser QA Final Check

## 1. Purpose

This document is the final code-and-flow checkpoint before running browser QA on Steps 1-7 of the v39 preview journey.

Route under test:

```text
/journey-v39-preview.html
```

The goal is to confirm that the early journey now follows the intended learner flow and no longer carries old work-allocation or CRM-first wording.

## 2. Verified baseline before this note

Latest verified commit before this note:

```text
079e0203fe9eba38caf46d1aaa629e352d2b79a7
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

## 3. Protected scope

Do not modify or test against the production route:

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

## 4. Current intended flow for Steps 1-7

The optimized early journey should now read as:

```text
1단계: 입장·역할 부여
2단계: AI 안전선
3단계: 프롬프트 기본 실습
4단계: AI 전략 리서치
5단계: 우리 팀 관리 지표 선정
6단계: 고객 Data 확인 List
7단계: 고객군별 2주 대응 방향
8단계: 코칭 대상 선정
```

The conceptual flow is:

```text
우리 팀 고민
→ AI가 이해할 수 있는 구조화 질문
→ 공개자료 기반 변화 신호
→ 우리 팀 관리 지표
→ 고객 Data에서 확인할 단서
→ 고객군별 2주 대응 방향
→ 먼저 1on1로 맞춰볼 코칭 대상
```

## 5. Step 1 final check

Step 1 should establish the learner role without asking for sensitive information.

Check:

```text
영업팀장 역할 부여
팀명 선택
이름/닉네임 입력
역할 수락 체크
```

Avoid:

```text
실제 고객명
실제 병원명
의료진명
제품명
내부 수치
개인정보
```

## 6. Step 2 final check

Step 2 should make the AI safety line clear before any AI prompt practice.

Required safety idea:

```text
실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
AI는 판단을 대신 정하는 도구가 아니라, 팀장의 생각을 정리하고 넓히는 도구입니다.
```

## 7. Step 3 final check

Step 3 now uses:

```text
V39PromptPracticeOptimizedLab
```

The previous component is preserved but should not be wired into the v39 route:

```text
V39PromptPracticeLab
```

Step 3 should focus on:

```text
우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기
일반 질문과 구조화 질문의 차이
역할·맥락·요청·출력 형식
4단계 AI 전략 리서치로 넘길 질문
```

Required preferred terms:

```text
영업활동 기록
방문·면담 기록
고객 활동 Data
사내 영업활동 시스템
고객 Data
후속조치 기록
```

Forbidden old flow terms:

```text
사내 시스템/CRM
고객군 × 팀원 실행 Map
신규 접점 실행 Map
팀원 역할 보완
8단계 기록 보완 담당
8단계 팀원별 역할 미션과 지원 포인트
실행 Map → 역할 보완
```

## 8. Step 4 final check

Step 4 should turn public research into team-level questions.

Check that the learner sees the bridge from Step 3:

```text
3단계에서 선택한 우리 팀 고민
4단계 AI 전략 리서치 연결
```

Step 4 should not encourage using confidential customer or internal sales data.

## 9. Step 5 final check

Step 5 should convert strategic signals into management metrics.

Check:

```text
관리 지표 선정
고객 Data 확인 List로 넘길 기준
```

Storage check:

```text
src/journey-v39-dashboard-result-store.ts
```

Required storage helper pattern:

```text
getJson
setJson
removeStoredPrefix
```

Direct localStorage calls should not return:

```text
window.localStorage.setItem
window.localStorage.getItem
window.localStorage.removeItem
```

## 10. Step 6 final check

Step 6 should convert Step 5 metrics into evidence and questions.

Step 6 meaning:

```text
고객 Data에서 무엇을 확인할 것인가?
```

Step 6 should not mean:

```text
고객 평가
고객 등급화
팀원별 역할 배분 준비
```

Required current wording idea:

```text
8단계에서는 이 대응 방향을 실행으로 옮기기 위해 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다.
```

Forbidden old wording:

```text
8단계에서 팀원별 역할과 지원 포인트를 정할 재료입니다
팀원별 영업활동 기록 품질 차이
```

Storage check:

```text
src/journey-v39-customer-judgment-result-store.ts
```

Required storage helper pattern:

```text
getJson
setJson
removeStoredPrefix
```

## 11. Step 7 final check

Step 7 should convert customer Data evidence into two-week response directions.

Step 7 meaning:

```text
6단계의 고객 Data 단서를 바탕으로 이번 2주 동안 다시 확인할 묶음과 행동 방향을 정하는 단계
```

Step 7 should not mean:

```text
고객군 × 팀원 2주 실행 Map
팀원 연결 후보 확정
팀원별 역할과 지원 포인트 확정
업무배분 또는 담당 배정
```

Required current wording ideas:

```text
다음 단계: 코칭 대상 선정
8단계에서 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다
고객 Data 증거는 고객군이 아닙니다
```

Forbidden old wording:

```text
고객군 × 팀원 2주 실행 Map
팀원 연결 기준
실제 연결 후보
8단계는 역할 보완으로 이어집니다
팀원 연결 후보
팀원별 역할과 지원 포인트
팀원 연결도 확정 배정
```

Storage check:

```text
src/journey-v39-customer-strategy-result-store.ts
```

Required storage helper pattern:

```text
getJson
setJson
removeStoredPrefix
```

## 12. Reset final check

The v39 reset button should clear all v39-scoped saved values:

```text
removeStoredPrefix('ckd.v39.')
```

This should clear:

```text
participant info
progress
Step 3 prompt practice result
Step 5 dashboard result
Step 6 customer Data check result
Step 7 customer strategy result
later v39 result stores using the same prefix
```

## 13. Smoke and readiness guards now active

Current guard scripts:

```text
scripts/smoke-v39-static.mjs
scripts/audit-v39-readiness.mjs
```

They now check:

```text
v39 route uses V39PromptPracticeOptimizedLab
old V39PromptPracticeLab is not wired into v39 route
Step 3 does not expose old work-allocation flow wording
Step 5-7 stores use safe storage helpers
Step 6-7 point toward coaching target selection
Step 8 remains coaching target selection
Step 9 uses coaching target context for execution dialogue
```

## 14. Browser QA sequence

Recommended browser QA run:

```text
1. Open /journey-v39-preview.html.
2. Click 진행 초기화.
3. Complete Step 1 with a team and nickname.
4. Review Step 2 safety line.
5. In Step 3, choose a team concern and copy the structured prompt.
6. Move to Step 4 and confirm the selected concern appears in the bridge card.
7. Move to Step 5 and select management metrics.
8. Refresh and confirm Step 5 saved data remains.
9. Move to Step 6 and confirm the Step 5 metric context is visible.
10. Select customer Data evidence and write a missing information / next check note.
11. Refresh and confirm Step 6 saved data remains.
12. Move to Step 7 and confirm selected Step 6 evidence appears as two-week response direction material.
13. Save a Step 7 response direction and refresh.
14. Move to Step 8 and confirm the screen is 코칭 대상 선정, not 업무배분 or 역할배치.
15. Click 진행 초기화 and confirm all v39 saved values are cleared.
```

## 15. Pass criteria

Steps 1-7 can proceed to pilot browser QA if:

```text
All Actions remain green.
Steps 1-7 render without blank screens.
Step 3 uses the optimized prompt practice screen.
Step 3 to Step 4 bridge works.
Step 5 to Step 6 context works.
Step 6 to Step 7 evidence flow works.
Step 7 to Step 8 coaching target flow works.
Reset clears all v39 scoped values.
No CRM-first or old work-allocation wording appears in learner-facing screens.
```
