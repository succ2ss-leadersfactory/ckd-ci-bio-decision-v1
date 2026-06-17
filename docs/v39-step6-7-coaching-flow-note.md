# v39 Step 6-7 Coaching Flow Alignment Note

## 1. Purpose

This note records the alignment of Steps 6 and 7 with the current v39 coaching-target flow.

The main goal is to keep the early customer Data flow from drifting back into the old work-allocation structure.

The intended flow is:

```text
5단계: 우리 팀 관리 지표 선정
6단계: 고객 Data에서 확인할 단서 선택
7단계: 고객군별 2주 대응 방향
8단계: 코칭 대상 선정
```

## 2. Verified baseline before this note

Commit verified before this note:

```text
0f53b20d3effda81c3fe2dda1329e09747a71121
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

## 3. Updated files

```text
src/journey-v39-customer-judgment-ux-lab.tsx
src/journey-v39-customer-priority-ux-lab.tsx
scripts/smoke-v39-static.mjs
```

## 4. Step 6 identity

Step 6 title intent:

```text
고객의 무엇을 확인할 것인가
```

Step 6 should mean:

```text
5단계에서 정한 관리 지표를 고객 Data에서 확인할 단서와 질문으로 바꾸는 단계
```

Step 6 should not mean:

```text
고객 평가
고객 등급화
고객 우선순위 확정
팀원별 역할 배분 준비
```

## 5. Step 6 to Step 8 wording correction

The old direction could make Step 6 look like preparation for member role allocation.

Avoid wording like:

```text
8단계에서 팀원별 역할과 지원 포인트를 정할 재료입니다
팀원별 영업활동 기록 품질 차이
```

Preferred wording:

```text
8단계에서는 이 대응 방향을 실행으로 옮기기 위해 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다.
```

## 6. Step 7 identity

Step 7 title intent:

```text
고객군별 2주 대응 방향
```

Step 7 should mean:

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

## 7. Step 7 to Step 8 wording correction

Avoid wording like:

```text
고객군 × 팀원 2주 실행 Map
팀원 연결 기준
실제 연결 후보
8단계는 역할 보완으로 이어집니다
팀원 연결 후보
팀원별 역할과 지원 포인트
팀원 연결도 확정 배정
```

Preferred wording:

```text
다음 단계: 코칭 대상 선정
8단계에서 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다
8단계의 코칭 대상 선정은 이 행동 방향을 실행으로 옮기기 위해 먼저 대화가 필요한 사람을 고르는 과정입니다
```

## 8. Conceptual distinction

The distinction to preserve is:

```text
Step 6 = What evidence should we check in customer Data?
Step 7 = How should we move for the next two weeks based on that evidence?
Step 8 = Who should the team leader talk with first to make execution possible?
```

This distinction protects the v39 experience from becoming a work-allocation tool.

The v39 journey should stay a leadership judgment and AI-assisted reflection lab.

## 9. Static smoke guard

The v39 static smoke script now checks Step 6 and Step 7 wording.

Step 6 required marker:

```text
8단계에서는 이 대응 방향을 실행으로 옮기기 위해 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다
```

Step 6 forbidden markers:

```text
8단계에서 팀원별 역할과 지원 포인트를 정할 재료입니다
팀원별 영업활동 기록 품질 차이
```

Step 7 required markers:

```text
8단계에서 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다
다음 단계
코칭 대상 선정
```

Step 7 forbidden markers:

```text
고객군 × 팀원 2주 실행 Map
팀원 연결 기준
실제 연결 후보
8단계는 역할 보완으로 이어집니다
팀원 연결 후보
팀원별 역할과 지원 포인트
팀원 연결도 확정 배정
```

## 10. Browser QA check

During browser QA, verify the following path:

```text
Step 5: select management metrics
Step 6: choose customer Data evidence and write missing information / next check questions
Step 7: convert evidence into two-week response direction
Step 8: enter coaching target selection, not work allocation
```

Pass criteria:

```text
Step 6 does not rank or grade customers.
Step 7 does not assign customers to team members.
Step 8 opens as coaching target selection.
The learner can understand why customer response direction leads to a 1on1 coaching decision.
```

## 11. Future caution

Do not remove all mentions of team members from Steps 6 and 7. It is acceptable to mention that the team leader may need to ask team members clarifying questions.

The forbidden regression is turning Step 7 into a customer-group-by-member allocation map.

Allowed:

```text
팀원에게 물어볼 질문
먼저 1on1로 맞춰볼 코칭 대상
실행을 가능하게 하기 위한 대화 필요성
```

Avoid:

```text
담당 팀원 확정
팀원 연결 후보
업무배분
고객군 × 팀원 실행 Map
역할 보완
```
