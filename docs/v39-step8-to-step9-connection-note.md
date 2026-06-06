# v39 Step 8 to Step 9 Connection Note

## 1. Purpose

This note records the Step 8 to Step 9 connection improvement in the v39 preview journey.

The key improvement is that Step 9 no longer reads the old member role result store. Step 9 now reads the Step 8 coaching target selection result directly and uses it to prepare the execution dialogue.

## 2. Verified baseline before this change

Commit verified before this note:

```text
8cb0a13a662a141f32a41cb99c7b27f23f7e03f5
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

## 3. Updated file

```text
src/journey-v39-people-dialogue-lab.tsx
```

## 4. Previous issue

Step 9 still had remnants of the old member role flow:

```text
loadV39MemberRoleResult
journey-v39-member-role-result-store
역할 정리 결과
8단계 역할 결과
```

This was inconsistent with the new Step 8 identity.

Step 8 is now:

```text
코칭 대상 선정
우선 1on1 대상
선택 이유
코칭 초점
관찰 신호와 해석의 구분
```

Therefore Step 9 should not read or display old role-allocation results.

## 5. New Step 9 behavior

Step 9 now reads Step 8 through:

```text
loadV39TeamSevenCoachingMapResult()
```

It filters saved coaching target decisions and prioritizes:

```text
priorityOneOnOne === true
```

If no priority target exists, Step 9 can still use saved coaching target memo items.

## 6. New visible Step 9 connection block

Step 9 now includes a visible connection block:

```text
8단계 코칭 초점을 대화 카드로 가져오기
```

The block displays:

```text
팀원명
선택 이유
코칭 초점
이 팀원 초점을 대화 카드에 반영
```

When the learner clicks the button, Step 9 dialogue card fields are prefilled with the selected coaching target context.

## 7. Fields connected to the dialogue card

The Step 8 target can fill or influence:

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

## 8. Prompt connection

Step 9 AI prompt now includes:

```text
[8단계 코칭 대상 선정 요약]
```

The summary includes:

```text
선택 이유
코칭 초점
주의할 해석
```

This keeps the Step 9 AI use differentiated from Step 8:

```text
Step 8 AI = who to talk with and why
Step 9 AI = how to open and structure the conversation
```

## 9. Static smoke update

The v39 static smoke script now checks for Step 8 to Step 9 connection markers:

```text
8단계 우선 1on1 대상
8단계 코칭 초점을 대화 카드로 가져오기
loadV39TeamSevenCoachingMapResult
```

It also checks that old role flow markers do not return to the visible Step 9 flow:

```text
loadV39MemberRoleResult
journey-v39-member-role-result-store
역할 정리 결과
8단계 역할 결과
```

## 10. Future caution

The Step 9 screen may still use the word `역할` inside ordinary conversation content, such as role criteria or responsibility boundaries. That is acceptable.

The forbidden regression is not every use of the word `역할`; the forbidden regression is returning Step 9 to the old Step 8 work-allocation result flow.

Avoid restoring:

```text
8단계 역할 결과
역할 정리 결과
member-role-result-store as Step 9 source
```

Prefer:

```text
8단계 우선 1on1 대상
코칭 초점
대화 카드
실행 대화
관찰 신호와 해석
```
