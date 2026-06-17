# v39 Step 3 Optimized Prompt Practice Note

## 1. Purpose

This note records the Step 3 optimization in the v39 preview journey.

The purpose is to simplify the Step 3 prompt practice screen and align it with the current v39 flow:

```text
관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정 → 실행 대화 → 2주 실행계획
```

## 2. Verified stable commit before this note

Commit verified before this note:

```text
4c30b790293336b39f478f25d1e3f9c89f69adff
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

## 3. Files changed in the Step 3 optimization

Added:

```text
src/journey-v39-prompt-practice-optimized-lab.tsx
```

Updated:

```text
src/journey-v39-app-preview.tsx
scripts/smoke-v39-static.mjs
scripts/audit-v39-readiness.mjs
```

The previous file remains preserved:

```text
src/journey-v39-prompt-practice-lab.tsx
```

However, the v39 preview route now uses:

```text
V39PromptPracticeOptimizedLab
```

## 4. Why a new optimized component was added

The previous Step 3 prompt practice screen contained old flow markers and wording that could pull the learner back toward the deprecated work-allocation structure.

Examples of old flow wording to avoid:

```text
사내 시스템/CRM
고객군 × 팀원 실행 Map
신규 접점 실행 Map
팀원 역할 보완
8단계 기록 보완 담당
8단계 팀원별 역할 미션과 지원 포인트
실행 Map → 역할 보완
```

The optimized component keeps Step 3 focused on:

```text
우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기
역할·맥락·요청·출력 형식
4단계 AI 전략 리서치로 넘길 질문
```

## 5. Terminology alignment

The optimized Step 3 uses the preferred v39 learner-facing terms:

```text
영업활동 기록
방문·면담 기록
고객 활동 Data
사내 영업활동 시스템
고객 Data
후속조치 기록
```

Avoid standalone or primary use of:

```text
CRM 기록
CRM Data
CRM 분석
CRM상 고객 등급
CRM 기록 품질
사내 시스템/CRM
```

## 6. Optimized Step 3 learning flow

Step 3 now asks the learner to choose or write a team concern and convert it into a structured AI prompt.

Main blocks:

```text
Block 1: 우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기
Block 2: 일반 질문과 구조화 질문의 차이
Block 3: 역할·맥락·요청·출력 형식
Block 4: 4단계 AI 전략 리서치로 넘길 질문
```

This keeps the learner experience simpler and more practical.

## 7. Step 3 to downstream flow

The optimized Step 3 explicitly supports the downstream flow:

```text
Step 3: 우리 팀 고민을 구조화 질문으로 바꾼다
Step 4: 공개자료 기반 전략 리서치로 넓힌다
Step 5: 우리 팀 관리 지표로 좁힌다
Step 6: 고객 Data에서 확인할 단서와 질문으로 바꾼다
Step 7: 고객군별 2주 대응 방향으로 정리한다
Step 8: 먼저 1on1로 맞춰볼 코칭 대상을 고른다
Step 9: 실행 대화의 첫마디와 합의 기준을 준비한다
Step 10: AI 실행계획 Prompt로 2주 실행계획 초안을 만든다
```

## 8. Safety line

The optimized Step 3 repeats the AI input safety line:

```text
실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 넣지 않습니다.
고객을 평가하거나 등급화하지 않습니다.
팀원을 성격이나 세대로 단정하지 않습니다.
AI는 답을 대신 정하지 않고, 팀장의 판단을 정리하고 넓히는 도구로 사용합니다.
```

## 9. Readiness audit fix

After switching the v39 route to the optimized Step 3 component, v39 Smoke initially failed only at the integrated readiness audit stage.

The failure pattern was:

```text
v39 static smoke: success
v39 scoped TypeScript check: success
Vite build: success
integrated v39 smoke check: failure
```

The cause was that `scripts/audit-v39-readiness.mjs` still expected the old Step 3 component:

```text
V39PromptPracticeLab
src/journey-v39-prompt-practice-lab.tsx
```

The audit was updated to expect:

```text
V39PromptPracticeOptimizedLab
src/journey-v39-prompt-practice-optimized-lab.tsx
```

## 10. Static smoke and readiness guards

The static smoke and readiness audit now guard the optimized flow.

Required markers include:

```text
V39PromptPracticeOptimizedLab
우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기
사내 영업활동 시스템
관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정
코칭 대상 선정 → 실행 대화 → 2주 실행계획
```

Forbidden regression markers include:

```text
사내 시스템/CRM
고객군 × 팀원 실행 Map
신규 접점 실행 Map
팀원 역할 보완
8단계 기록 보완 담당
8단계 팀원별 역할 미션과 지원 포인트
실행 Map → 역할 보완
```

## 11. Future caution

Do not rewire the v39 route back to:

```text
V39PromptPracticeLab
```

unless the old file is first fully aligned with the optimized v39 flow.

The current v39 route should stay on:

```text
V39PromptPracticeOptimizedLab
```

## 12. Next recommended work

Recommended next work:

```text
Browser QA for Steps 1-7 with special focus on Step 3 to Step 4 transition.
```

Browser QA should verify:

```text
Step 3: choose a concern and copy the structured prompt.
Step 4: selected concern appears in the bridge card.
Step 5: concern can be converted into management metrics.
Step 6: metric context can be converted into customer Data evidence.
Step 7: customer Data evidence can be converted into two-week response direction.
Step 8: next step opens as coaching target selection.
```
