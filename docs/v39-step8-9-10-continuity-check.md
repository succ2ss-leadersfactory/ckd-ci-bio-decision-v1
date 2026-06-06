# v39 Step 8-9-10 Continuity Check

## 1. Purpose

This note records the continuity check across Steps 8, 9, and 10 in the v39 preview journey.

The purpose is to confirm that the new Step 8 coaching target selection flow now connects correctly into Step 9 execution dialogue and Step 10 AI execution plan prompt.

## 2. Verified stable commit before this note

Commit verified before this note:

```text
5c5a3ac2a611a57647b2464b5fa67641d9bda5c7
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

## 3. Step 8 source

Step 8 source file:

```text
src/journey-v39-team-seven-coaching-map.tsx
```

Step 8 profile file:

```text
src/journey-v39-team-seven-coaching-profiles.ts
```

Step 8 source loader:

```text
loadV39TeamSevenCoachingMapResult()
```

Step 8 provides:

```text
우선 1on1 대상
1on1 코칭 목적
선택 이유
9단계로 넘길 코칭 초점
단정하면 안 되는 해석/주의할 지점
AI 판단 정리
```

## 4. Step 9 connection

Step 9 file:

```text
src/journey-v39-people-dialogue-lab.tsx
```

Step 9 now reads Step 8 through:

```text
loadV39TeamSevenCoachingMapResult()
```

Step 9 displays:

```text
8단계 우선 1on1 대상
8단계 코칭 초점을 대화 카드로 가져오기
```

Step 9 uses Step 8 to prefill or influence:

```text
대상 팀원
예상 반응
팀장이 오해하기 쉬운 지점
팀원이 실제로 확인하고 싶은 것
내가 실제로 사용할 첫마디
팀장의 답변 문장
피해야 할 말
대체 문장
```

Step 9 AI prompt includes:

```text
[8단계 코칭 대상 선정 요약]
```

This keeps the role distinction clear:

```text
Step 8 = who to talk with and why
Step 9 = how to open and structure the conversation
```

## 5. Step 10 connection

Step 10 file:

```text
src/journey-v39-ai-call-plan-lab.tsx
```

Step 10 reads Step 8 through:

```text
loadV39TeamSevenCoachingMapResult()
```

Step 10 reads Step 9 through:

```text
loadV39PeopleDialogueResult()
```

Step 10 prompt includes:

```text
8단계 코칭 대상 선정 요약
9단계 실행 대화 요약
```

The Step 10 prompt asks AI to generate:

```text
2주 실행계획 요약
팀 회의 설명 문장
고객군별 실행 방향
코칭 대상별 실행 대화 문장
중간 점검 질문
리스크·컴플라이언스 점검 후보
```

## 6. Continuity conclusion

The intended continuity is now:

```text
8단계: 누구와 먼저 1on1을 해야 하는가?
9단계: 그 사람에게 어떻게 첫 대화를 열 것인가?
10단계: 고객 대응 방향과 실행 대화를 포함해 2주 실행계획 초안을 어떻게 펼칠 것인가?
```

This confirms that v39 no longer treats the Step 8 result as a work-allocation or member-role result in the Step 9 and Step 10 flow.

## 7. Smoke and marker caution

The Step 10 file still contains internal smoke marker strings for backward compatibility checking. These marker strings are not learner-facing screen text.

The active smoke script strips internal `SMOKE_MARKERS` blocks before old visible wording checks.

Therefore, future checks should distinguish between:

```text
Internal smoke marker strings
Visible learner or instructor screen text
Actual data source imports
```

The important regression to avoid is restoring Step 9 or Step 10 to:

```text
loadV39MemberRoleResult()
journey-v39-member-role-result-store
8단계 역할 결과
역할 정리 결과
고객군 × 팀원 실행 Map
```

## 8. Next recommended work

Recommended next step:

```text
Browser QA on /journey-v39-preview.html for Steps 8, 9, and 10.
```

Browser QA should verify:

```text
Step 8: select 1 to 2 priority 1on1 targets
Step 9: selected targets appear in the Step 8 to Step 9 connection block
Step 9: target focus can be applied to the dialogue card
Step 9: saved dialogue result remains available after refresh
Step 10: 8단계 코칭 대상 선정 요약 and 9단계 실행 대화 요약 appear in the execution prompt
Step 10: refresh buttons reload Step 8 and Step 9 saved results
```
