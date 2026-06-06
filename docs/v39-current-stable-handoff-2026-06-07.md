# v39 Current Stable Handoff — 2026-06-07

## 1. Project

```text
종근당/C1바이오 영업팀장 AI 리더십 Lab Journey 웹앱
```

Repository:

```text
succ2ss-leadersfactory/ckd-ci-bio-decision-v1
```

Branch:

```text
feature/v37-preview-shell
```

Active preview route:

```text
/journey-v39-preview.html
```

Production route remains untouched:

```text
/journey.html
```

## 2. Latest verified stable commit

Latest verified commit before this refresh:

```text
d02ede4829d7c11489b9fdfdb7e60aab40a53954
```

Commit message:

```text
Add v39 browser QA result template
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

## 3. Protected files and route

Do not modify:

```text
journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

All current work is scoped to:

```text
/journey-v39-preview.html
```

## 4. Current v39 product identity

The v39 journey is not an AI answer generator.

It is a leadership judgment and AI-assisted reflection lab for C1Bio sales team leaders.

Core message:

```text
AI 없이도 할 수 있다.
그러나 AI를 활용하면 더 빠르게, 더 넓게, 더 구조적으로 정리할 수 있다.
AI는 답을 대신 정하는 도구가 아니라, 팀장의 판단을 정리하고 넓히는 도구다.
```

## 5. Current v39 full flow

```text
1단계: 입장·역할 부여
2단계: AI 안전선
3단계: 프롬프트 기본 실습
4단계: AI 전략 리서치
5단계: 우리 팀 관리 지표 선정
6단계: 고객 Data 확인 List
7단계: 고객군별 2주 대응 방향
8단계: 코칭 대상 선정
9단계: 팀원 온도차와 실행 대화
10단계: AI 실행계획 Prompt
11단계: 컴플라이언스 위험 표현 제거
12단계: 최종 2주 실행 카드
13단계: 강사용 토의 질문
```

## 6. Current core continuity

The intended learning flow is:

```text
우리 팀 고민
→ AI가 이해할 수 있는 구조화 질문
→ 공개자료 기반 변화 신호
→ 우리 팀 관리 지표
→ 고객 Data에서 확인할 단서
→ 고객군별 2주 대응 방향
→ 먼저 1on1로 맞춰볼 코칭 대상
→ 실행 대화 첫마디와 합의 기준
→ AI 실행계획 Prompt
→ 컴플라이언스 점검
→ 최종 2주 실행 카드
→ 강사용 토의 질문
```

## 7. Major completed work in this stabilization pass

### Step 3 optimized prompt practice

Added:

```text
src/journey-v39-prompt-practice-optimized-lab.tsx
```

v39 route now uses:

```text
V39PromptPracticeOptimizedLab
```

Old component remains preserved but is no longer wired into v39 route:

```text
src/journey-v39-prompt-practice-lab.tsx
```

Step 3 now avoids:

```text
사내 시스템/CRM
고객군 × 팀원 실행 Map
신규 접점 실행 Map
팀원 역할 보완
8단계 기록 보완 담당
8단계 팀원별 역할 미션과 지원 포인트
실행 Map → 역할 보완
```

### Step 3 bridge alignment

Updated:

```text
src/journey-v39-prompt-concern-bridge-card.tsx
```

The bridge now supports:

```text
관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정
코칭 대상 선정 → 실행 대화 첫마디 → 2주 실행계획
```

### Step 5-7 safe storage

Updated:

```text
src/journey-v39-dashboard-result-store.ts
src/journey-v39-customer-judgment-result-store.ts
src/journey-v39-customer-strategy-result-store.ts
```

They now use:

```text
getJson
setJson
removeStoredPrefix
```

instead of direct `window.localStorage.*` calls.

### v39 full reset

Updated:

```text
src/journey-v39-app-preview.tsx
```

Reset now clears all v39-scoped saved values:

```text
removeStoredPrefix('ckd.v39.')
```

### Step 6-7 coaching-flow alignment

Updated:

```text
src/journey-v39-customer-judgment-ux-lab.tsx
src/journey-v39-customer-priority-ux-lab.tsx
```

Current intended flow:

```text
5단계: 관리 지표 선정
6단계: 고객 Data에서 확인할 단서 선택
7단계: 고객군별 2주 대응 방향
8단계: 코칭 대상 선정
```

### Step 8 coaching target selection

Step 8 identity is now:

```text
코칭 대상 선정
```

It is not:

```text
고객군 × 팀원 실행 배치
업무배분 판단
담당 팀원 배치
팀원이 맡을 일 확정
팀원별 역할 분장
```

### Step 9 connection

Step 9 now reads Step 8 through:

```text
loadV39TeamSevenCoachingMapResult()
```

and uses:

```text
8단계 우선 1on1 대상
8단계 코칭 초점을 대화 카드로 가져오기
```

### Step 10 continuity

Step 10 reads:

```text
loadV39TeamSevenCoachingMapResult()
loadV39PeopleDialogueResult()
```

and includes:

```text
8단계 코칭 대상 선정 요약
9단계 실행 대화 요약
```

## 8. Current smoke and audit guards

Updated guards:

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
Step 10 reads Step 8 and Step 9 context
```

## 9. Preferred terminology

Use:

```text
영업활동 기록
방문·면담 기록
고객 활동 Data
사내 영업활동 시스템
고객 Data
후속조치 기록
```

Avoid learner-facing primary wording:

```text
CRM 기록
CRM Data
CRM 분석
CRM상 고객 등급
CRM 기록 품질
사내 시스템/CRM
```

## 10. Critical forbidden regression wording

Avoid restoring:

```text
고객군 × 팀원 실행 Map
고객군 × 팀원 2주 실행 Map
신규 접점 실행 Map
팀원 역할 보완
역할 보완
8단계 기록 보완 담당
8단계 팀원별 역할 미션과 지원 포인트
팀원 연결 기준
실제 연결 후보
8단계는 역할 보완으로 이어집니다
팀원 연결 후보
팀원별 역할과 지원 포인트
업무배분
담당 팀원 확정
```

## 11. Key documentation added

```text
docs/v39-coaching-target-flow-audit.md
docs/v39-step8-to-step9-connection-note.md
docs/v39-step8-9-10-continuity-check.md
docs/v39-steps1-7-storage-optimization-note.md
docs/v39-steps1-7-browser-qa-checklist.md
docs/v39-step6-7-coaching-flow-note.md
docs/v39-step3-optimized-prompt-practice-note.md
docs/v39-steps1-7-pre-browser-qa-final-check.md
docs/v39-deployment-browser-qa-runbook.md
docs/v39-current-stable-handoff-2026-06-07.md
docs/v39-browser-qa-result-template.md
```

## 12. Next recommended work

Next work should be browser QA on the deployed v39 preview route.

Target path:

```text
/journey-v39-preview.html
```

Focus path:

```text
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7 → Step 8
```

QA should verify:

```text
Step 3 optimized prompt practice appears
Step 4 bridge reads Step 3 concern
Step 5 selections persist after refresh
Step 6 reads Step 5 context and persists after refresh
Step 7 reads Step 6 evidence and persists after refresh
Step 8 opens as coaching target selection
진행 초기화 clears all v39 scoped values
No CRM-first or old work-allocation wording appears
```

Use this result template:

```text
docs/v39-browser-qa-result-template.md
```

## 13. Important note about live URL verification

Automated GitHub Actions are green for the latest verified commit.

The next required verification is manual or browser-based Vercel deployment QA using:

```text
/journey-v39-preview.html
```

If browser QA fails, record:

```text
deployment URL
browser/device
step number
visible wording or error
console error
screenshot if available
tested commit SHA
```

Then fix only v39 preview files unless the issue is in a shared helper used by v39.
