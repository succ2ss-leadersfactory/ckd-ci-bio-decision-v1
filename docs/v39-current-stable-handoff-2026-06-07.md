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

Latest verified commit:

```text
b0e43829205e97f65d3476647f53b72c1fdb872a
```

Commit message:

```text
Fix v39 local preview smoke asset check
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

v39 Smoke now verifies:

```text
Run v39 static smoke check: success
Run v39 scoped TypeScript check: success
Build Vite app: success
Run integrated v39 smoke check: success
```

The integrated v39 smoke now includes a local Vite preview route check for:

```text
/journey-v39-preview.html
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

## 5. Current participant-facing v39 full flow

Use participant-friendly field language:

```text
1단계: 오늘 역할 잡기
2단계: 말해도 되는 선 확인
3단계: AI 질문 다듬기
4단계: 시장 변화에서 질문 찾기
5단계: 이번 2주에 볼 기준 정하기
6단계: 고객 기록에서 단서 찾기
7단계: 2주 동안 다시 볼 흐름 정하기
8단계: 먼저 이야기할 팀원 고르기
9단계: 첫 문장 준비하기
10단계: AI에게 한 번 정리시켜 보기
11단계: 말해도 되는 선 다시 보기
12단계: 2주 메모 완성하기
13단계: 함께 복기할 질문 만들기
```

Common flow strip labels are also participant-friendly:

```text
오늘 역할 잡기 → 말해도 되는 선 → AI 질문 다듬기 → 시장 변화 보기 → 볼 기준 정하기 → 고객 기록 보기 → 2주 흐름 잡기 → 1on1 대상 고르기 → 첫 문장 준비 → AI에게 정리 맡기기 → 표현 다시 보기 → 2주 메모 완성 → 함께 복기하기
```

## 6. Current core continuity

The intended learning flow is:

```text
우리 팀 고민
→ AI에게 물어볼 질문으로 다듬기
→ 공개자료에서 시장 변화와 우리 팀 질문 찾기
→ 이번 2주에 볼 기준 정하기
→ 고객 기록에서 다시 볼 단서 찾기
→ 2주 동안 다시 볼 흐름 정하기
→ 먼저 이야기할 팀원 1~2명 고르기
→ 팀원에게 꺼낼 첫 문장 준비하기
→ 앞에서 쓴 메모를 AI에게 한 번 정리시켜 보기
→ 말해도 되는 선 안에서 표현 다시 보기
→ 교육장을 나가서 볼 2주 메모 완성하기
→ 동료 팀장들과 함께 복기할 질문 만들기
```

## 7. Major completed work in this stabilization pass

### Full field-language rewrite for Steps 1-13

The v39 participant-facing copy has been rewritten from app/system language to Korean corporate field language.

Key replacements:

```text
프롬프트 기본 실습 → AI 질문 다듬기
AI 전략 리서치 → 시장 변화에서 질문 찾기
우리 팀 관리 지표 선정 → 이번 2주에 볼 기준 정하기
고객 Data 확인 List → 고객 기록에서 단서 찾기
고객군별 2주 대응 방향 → 2주 동안 다시 볼 흐름 정하기
코칭 대상 선정 → 먼저 이야기할 팀원 고르기
팀원 온도차와 실행 대화 → 첫 문장 준비하기
AI 실행계획 Prompt → AI에게 한 번 정리시켜 보기
컴플라이언스 위험 표현 제거 → 말해도 되는 선 다시 보기
최종 2주 실행 카드 → 2주 메모 완성하기
강사용 토의 질문 → 함께 복기할 질문 만들기
```

### Step 3 optimized prompt practice

Active component:

```text
src/journey-v39-prompt-practice-optimized-lab.tsx
```

Current participant language:

```text
우리 팀에서 제일 걸리는 장면을 하나 고릅니다
막연한 질문과 쓸 만한 질문은 다릅니다
AI에게 넘길 말을 필요한 만큼만 채웁니다
다음 화면에서 쓸 질문을 준비합니다
```

Old component remains preserved but is no longer wired into v39 route:

```text
src/journey-v39-prompt-practice-lab.tsx
```

### Step 5-7 safe storage

Updated stores:

```text
src/journey-v39-dashboard-result-store.ts
src/journey-v39-customer-judgment-result-store.ts
src/journey-v39-customer-strategy-result-store.ts
```

They use:

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

Reset clears all v39-scoped saved values:

```text
removeStoredPrefix('ckd.v39.')
```

### Step 6 humanized wrapper

Added:

```text
src/journey-v39-customer-judgment-humanized-ux-lab.tsx
```

The original `V39CustomerJudgmentUxLab` now re-exports the humanized wrapper for route compatibility.

Current participant language:

```text
기록을 보며 다음에 뭘 확인할지 남깁니다
고객에게 이름표를 붙이는 시간이 아닙니다
다시 볼 단서
아직 모르는 것
팀원에게 물어볼 질문
```

### Step 7 field-language rewrite

Updated:

```text
src/journey-v39-customer-priority-ux-lab.tsx
```

Current participant language:

```text
고객을 나누기보다, 어디부터 다시 볼지 정합니다
기록에서 본 단서가 곧 고객 구분은 아닙니다
이번 2주 동안 어디부터 다시 확인할지 정합니다
```

### Step 8 coaching target selection and team profiles

Updated:

```text
src/journey-v39-team-seven-coaching-ux-wrapper.tsx
src/journey-v39-team-seven-text-polish.tsx
src/journey-v39-team-seven-coaching-profiles.ts
```

Step 8 identity:

```text
먼저 이야기할 팀원 고르기
```

It is not:

```text
고객군 × 팀원 실행 배치
업무배분 판단
담당 팀원 배치
팀원이 맡을 일 확정
팀원별 역할 분장
```

The seven team member profiles were rewritten as field-realistic narrative characters for a conservative Korean pharmaceutical sales organization:

```text
김재호 차장: 현장 감각이 깊은 베테랑
김문호 차장: 말없이 떠안는 해결사
유희관 과장: 신호를 오래 보는 신중파
이대은 대리: 관계를 지키는 꾸준한 실무자
신재영 대리: 속도가 빠른 실행파
박재욱 사원: 기준이 필요한 성장 초입
문교원 사원: 의미와 기준을 묻는 MZ 신입
```

문교원 사원 is written as an MZ-style junior employee who asks for meaning, criteria, scope, and feedback timing without being stereotyped or labeled negatively.

### Step 9-13 field-language rewrite

Updated:

```text
src/journey-v39-people-dialogue-ux-lab.tsx
src/journey-v39-ai-call-plan-guided-ux-lab.tsx
src/journey-v39-compliance-cleanup-ux-lab.tsx
src/journey-v39-final-call-plan-team-seven-ux-card.tsx
src/journey-v39-instructor-discussion-ux-lab.tsx
```

Current participant language examples:

```text
첫마디가 달라지면, 팀원의 표정도 달라집니다
앞에서 적은 메모를 AI에게 한 번 정리시켜 봅니다
고객 앞에서 말해도 되는 문장인지 다시 봅니다
교육장을 나가서 바로 볼 수 있는 2주 메모를 완성합니다
왜 그렇게 봤는지, 어디서 막힐지 함께 이야기합니다
```

### Local preview route smoke

Added:

```text
scripts/smoke-v39-local-preview.mjs
```

Updated:

```text
package.json
```

New script:

```text
smoke:v39:local-preview
```

The v39 smoke chain now checks that the built app can be served through local Vite preview and that this route responds:

```text
/journey-v39-preview.html
```

The smoke checks:

```text
HTTP 200
C1바이오 영업팀장 AI 리더십 Lab Journey title
journey-root presence
built asset or v39 app entry presence
```

## 8. Current smoke and audit guards

Some hidden smoke markers remain in files to preserve static smoke and readiness audit compatibility.

Important:

```text
Hidden marker strings are not necessarily participant-facing copy.
Do not treat every marker string as visible UI language.
```

The actual participant-facing UI copy is the field-language version described above.

## 9. Preferred terminology

Use:

```text
영업활동 기록
방문·면담 기록
고객 활동 Data
사내 영업활동 시스템
고객 기록
고객 활동 기록
후속조치 기록
2주 메모
말해도 되는 선
먼저 이야기할 팀원
첫 문장
함께 복기할 질문
```

Avoid learner-facing primary wording:

```text
CRM 기록
CRM Data
CRM 분석
CRM상 고객 등급
CRM 기록 품질
사내 시스템/CRM
고객군 × 팀원 실행 Map
팀원 역할 보완
AI 실행계획 Prompt
컴플라이언스 위험 표현 제거
강사용 토의 질문
```

## 10. Critical forbidden regression wording

Avoid restoring participant-facing wording such as:

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
AI 실행계획 Prompt
컴플라이언스 위험 표현 제거
강사용 토의 질문
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
docs/v39-deployment-url-resolution-note.md
```

## 12. Next recommended work

Next work should be browser QA on the deployed v39 preview route.

Target path:

```text
/journey-v39-preview.html
```

Before browser QA, confirm latest Actions are green and v39 Smoke includes local preview route smoke.

Focus path:

```text
Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7 → Step 8 → Step 9 → Step 10 → Step 11 → Step 12 → Step 13
```

QA should verify:

```text
The common flow strip uses participant-friendly labels.
Step titles match the field-language sequence.
Step 8 team member profiles read like realistic Korean pharmaceutical sales team members.
No participant-facing old work-allocation wording appears.
No CRM-first or customer grading wording appears.
No real customer/hospital/medical staff/product/internal number input is requested.
진행 초기화 clears all v39 scoped values.
```

Use this result template:

```text
docs/v39-browser-qa-result-template.md
```

## 13. Important note about live URL verification

Automated GitHub Actions are green for the latest verified commit, and CI now verifies the route through local Vite preview.

The remaining verification is live Vercel deployment QA using:

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
