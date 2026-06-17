# v39 Coaching Target Flow Audit

## 1. Purpose

This document records the current v39 preview flow after Step 8 was changed from a member role / work allocation screen into a coaching target selection screen.

The goal is to keep the v39 journey aligned with the educational intent:

- AI is not the answer generator.
- AI helps the sales team leader structure, widen, and review their judgment.
- Step 8 is not about assigning work to team members.
- Step 8 is about deciding who needs a 1on1 conversation first, why that person needs it, and what coaching focus should move to Step 9.

## 2. Protected routes and files

The following production route and protected files must remain untouched:

```text
/journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

All changes documented here are scoped to the v39 preview flow:

```text
/journey-v39-preview.html
```

## 3. Current stable verification point

Latest verified commit before this documentation commit:

```text
5de3259d89cda4b25ecc2e1288bc84a35c6fc146
```

Verification result:

```text
C1Bio MVP CI: success
v39 Smoke: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v40-lite Smoke: success
```

## 4. Step 8 identity

### Current title

```text
코칭 대상 선정
```

### Step 8 core question

```text
누구와 먼저 1on1을 해야 하는가?
```

### Step 8 is not

```text
고객군 × 팀원 실행 배치
업무배분 판단
담당 팀원 배치
팀원이 맡을 일 확정
팀원별 역할 분장
```

### Step 8 is

```text
팀원 유형을 참고해 실제 팀의 관찰 신호를 떠올리는 단계
우선 1on1 대상 1~2명을 고르는 단계
선택 이유와 코칭 초점을 정리하는 단계
관찰 사실과 해석을 분리하는 단계
9단계 실행 대화로 넘길 대화 초점을 준비하는 단계
```

## 5. Step 8 content structure

The Step 8 team profile data is now separated from the rendering / state logic.

### Profile data

```text
src/journey-v39-team-seven-coaching-profiles.ts
```

### Screen, state, localStorage, and prompt logic

```text
src/journey-v39-team-seven-coaching-map.tsx
```

This separation reduces collision risk when future work updates team profiles or UI logic.

## 6. Seven team member profiles

The seven team member profiles are designed to reflect realistic pharmaceutical sales team dynamics, including:

- conservative field culture
- seniority and tacit knowledge
- younger generation expectations for clarity, feedback, and growth meaning
- customer activity records
- follow-up discipline
- expression and compliance guardrails

The current profiles include:

```text
김재호 차장: 경험 많은 안정형
김문호 차장: 책임감 강한 실무형
유희관 과장: 관찰력 있는 신중형
이대은 대리: 관계 유지형
신재영 대리: 실행 빠른 추진형
박재욱 사원: 성장 초기형
문교원 사원: MZ 성장 탐색형
```

### 문교원 사원 profile lock

문교원 사원 is intentionally designed as an MZ growth-seeking junior member.

The profile should not portray MZ members as avoiding work or lacking commitment. The profile should show that this member becomes more engaged when the following are clear:

```text
왜 해야 하는지
어디까지 하면 되는지
무엇을 배우는지
어떤 기준으로 피드백 받을지
말해도 되는 표현 범위는 어디까지인지
```

The coaching interpretation should avoid stereotypes such as:

```text
MZ라서 그렇다
힘든 일을 피한다
태도가 약하다
조직 적응력이 낮다
```

The safer framing is:

```text
목적·기준·성장 포인트가 명확할 때 몰입하는 저연차 구성원
보수적인 제약영업 조직의 암묵지와 명확한 기준 요구 사이를 연결해야 하는 구성원
```

## 7. Step 8 AI use boundary

Step 8 AI is for judgment review, not dialogue creation.

### Button label

```text
AI로 코칭 필요 신호 정리하기
```

### AI should produce

```text
관찰 가능한 신호
팀장의 해석 중 확인이 필요한 부분
강점으로 볼 수 있는 부분
리스크로 볼 수 있는 부분
지금 1on1을 미루면 생길 수 있는 비용
먼저 대화할 필요성
9단계로 넘길 코칭 초점 한 줄
```

### AI should not produce in Step 8

```text
1on1 대화 스크립트
오프닝 멘트
질문 10개
팀원 반응별 응답문
피드백 문장
대화 리허설
```

These belong to Step 9.

## 8. Step 8 to Step 13 flow

The back half of the v39 journey now follows this logic:

```text
7단계: 고객군별 2주 대응 방향
8단계: 코칭 대상 선정
9단계: 실행 대화 준비
10단계: AI 실행계획 Prompt
11단계: 컴플라이언스 위험 표현 제거
12단계: 최종 2주 실행 카드
13단계: 강사용 토의 질문
```

## 9. Key integration files

### Step 10

```text
src/journey-v39-ai-call-plan-lab.tsx
src/journey-v39-ai-call-plan-ux-lab.tsx
```

Step 10 now reads Step 8 through:

```text
loadV39TeamSevenCoachingMapResult()
```

It no longer treats Step 8 as member role allocation.

### Step 12

```text
src/journey-v39-final-call-plan-card.tsx
```

Step 12 now reads and summarizes:

```text
8단계 코칭 대상 선정 요약
9단계 실행 대화 요약
```

### Step 13

```text
src/journey-v39-instructor-discussion-lab.tsx
```

Step 13 discussion questions now focus on:

```text
고객군별 2주 대응 방향의 판단 근거
코칭 대상 선정 이유
관찰 신호와 해석의 구분
우선 1on1 코칭 계획
팀원에게 꺼낼 첫 문장
컴플라이언스 수정 포인트
2주 후 리뷰 질문
```

## 10. Static smoke update

The v39 static smoke script now checks the new coaching target flow.

```text
scripts/smoke-v39-static.mjs
```

It verifies required new markers such as:

```text
8단계 코칭 대상 선정
8단계 코칭 대상 선정 요약
코칭 대상과 실행 대화를 AI 실행계획 프롬프트로 연결합니다
관찰 신호와 해석의 구분
```

It also checks that visible screen text does not regress to old work-allocation wording.

To avoid false failures, the smoke script strips internal `SMOKE_MARKERS` blocks before old wording checks.

## 11. Old wording that should not return to visible screens

Avoid restoring these expressions to visible learner or instructor screens:

```text
고객군 × 팀원 실행 Map
팀원 역할 결과
8단계 팀원 역할 요약
팀원별 역할 요약
업무배분 균형
팀원 7명 업무배분
팀원에게 맡길 일
정리된 역할
8단계 역할 결과
```

Use the following replacements:

```text
코칭 대상 선정
코칭 대상 선정 요약
우선 1on1 대상
선택 이유
코칭 초점
실행 대화
지원 방식
관찰 신호와 해석의 구분
```

## 12. Compliance and privacy guardrails

Across Steps 8 to 13, the following must remain prohibited in learner input:

```text
실명
고객명
병원명
의료진명
제품명
내부 매출·처방 수치
평가등급
개인정보
민감한 개인 사정
```

Step 8 and later screens should continue using observable, non-diagnostic language.

Avoid:

```text
성격 단정
태도 단정
세대 낙인
문제 직원 표현
```

Prefer:

```text
관찰 가능한 신호
확인할 해석
코칭 필요 신호
지원 조건
책임 범위
대화 목적
```

## 13. Next recommended work

Recommended next development steps:

1. Browser QA on `/journey-v39-preview.html` for Steps 8 to 13.
2. Check localStorage continuity from Step 8 to Step 13.
3. Review whether Step 9 dialogue preparation should prefill from Step 8 priority coaching targets.
4. Review final card store field naming in a future version. The internal `memberRoles` field is still used for compatibility, but visible labels now say `코칭 대상·실행 대화 요약`.
5. Run another full Actions check after any further code changes.
