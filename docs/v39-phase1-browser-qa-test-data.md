# v39 Phase 1 Browser QA Test Data

## 1. Purpose

Use this document when running the browser QA pass for `/journey-v39-preview.html`.

All entries below are fictional training data. They are designed only to check whether saved values move correctly from step to step.

## 2. Participant setup

| Field | Test value |
|---|---|
| Team | `3팀` |
| Name or nickname | `QA리더01` |
| Role confirmation | checked |

## 3. Step 5 test input: team execution diagnosis

| Field group | Test value |
|---|---|
| Team situation | `이번 2주 동안 고객 방문 수는 유지됐지만 후속 실행 메모와 팀원별 실행 편차가 커졌다.` |
| Core metric reason | `단순 활동량보다 실행 후 연결 행동이 중요해졌다.` |
| Support metric reason | `팀원별 준비 수준과 고객 반응 기록의 차이를 함께 봐야 한다.` |
| Safety metric reason | `무리한 활동 확대보다 정확한 기준과 안전한 표현을 우선한다.` |
| Member signal memo | `일부 팀원은 빠르게 실행하지만 일부는 기준이 불명확해 움직임이 늦다.` |

Expected downstream check:

```text
Step 8 top status should show that step 5 team signal data exists.
```

## 4. Step 6 test input: customer data analysis

| Field group | Test value |
|---|---|
| Opportunity signal | `일부 고객군에서 설명 요청과 후속 자료 요청이 늘었다.` |
| Risk signal | `반응이 좋다는 이유만으로 즉시 우선순위를 높이면 실행 부담이 커질 수 있다.` |
| Missing information | `최근 문의가 실제 실행 가능성으로 이어지는지 추가 확인이 필요하다.` |
| Two-week direction | `반응 고객군을 넓게 보기보다 확인 질문을 통해 우선순위를 좁힌다.` |
| Compliance note | `표현은 설명 중심으로 정리하고 단정 표현은 피한다.` |

Expected downstream check:

```text
Step 7 top status should show that step 6 customer judgment data exists.
```

## 5. Step 7 test input: customer-type response strategy

| Field group | Test value |
|---|---|
| Priority customer type | `자료 요청이 있었지만 다음 행동이 불명확한 고객군` |
| Two-week strategy | `후속 질문을 통해 관심 사유와 필요 자료를 확인한다.` |
| Missing information | `의사결정 기준과 다음 미팅 가능성을 확인한다.` |
| Risk memo | `반응을 성과 가능성으로 과잉 해석하지 않는다.` |
| Next action | `팀원별로 확인 질문을 정리해 다음 방문 전 공유한다.` |

Expected downstream check:

```text
Step 8 top status should show that step 7 strategy data exists.
```

## 6. Step 8 test input: member role direction

| Field group | Test value |
|---|---|
| Member role mission | `반응 고객군의 후속 질문을 표준화하고 실행 기록을 정리한다.` |
| Coaching focus | `고객 반응을 해석하기보다 확인 질문을 먼저 던지도록 돕는다.` |
| Risk guardrail | `팀원별 실행 속도를 비교하지 않고 각자의 확인 기준을 맞춘다.` |
| Call plan preparation | `고객군별 확인 질문 3개와 다음 행동 기준을 준비한다.` |
| Leader memo | `역할 배분은 성과 압박이 아니라 실행 기준 정렬로 설명한다.` |

Expected downstream checks:

```text
Step 9 top status should show that step 8 role data exists.
Step 10 top status should show that step 8 role data exists.
```

## 7. Step 9 test input: execution dialogue

| Field group | Test value |
|---|---|
| Dialogue situation | `팀원별 실행 속도 차이가 커졌지만 공개 비교는 피해야 하는 상황` |
| Dialogue purpose | `기준과 경계를 정하는 대화` |
| Familiar opening | `이번에는 다들 속도를 좀 더 내야 합니다.` |
| Team member perception | `내가 느린 사람으로 지목됐다고 받아들일 수 있다.` |
| Purpose-fit opening | `이번 2주는 속도보다 확인 기준을 맞추는 데 집중하겠습니다.` |
| Dialogue card memo | `각자 맡은 고객군에서 어떤 질문을 확인할지 먼저 정리한다.` |

Expected downstream checks:

```text
Step 10 top status should show that step 9 dialogue data exists.
Step 12 top status should show that step 9 dialogue data exists.
```

## 8. Step 10 test input: AI execution plan prompt

| Field group | Test value |
|---|---|
| AI prompt context | `팀원 역할, 대화 목적, 2주 실행 기준을 바탕으로 실행계획 초안을 정리한다.` |
| Call plan draft | `1주차에는 고객군별 확인 질문을 정리하고, 2주차에는 후속 행동 기준을 점검한다.` |
| Risk memo | `과도한 단정, 비교, 압박 표현이 포함되지 않도록 확인한다.` |
| Cleanup focus | `안전한 표현과 팀원 수용성을 중심으로 문장을 다듬는다.` |

Expected downstream check:

```text
Step 11 top status should show that step 10 draft data exists.
```

## 9. Step 11 test input: compliance cleanup

| Field group | Test value |
|---|---|
| Risk type summary | `단정 표현과 실행 압박으로 보일 수 있는 문장을 조정한다.` |
| Safe expression | `확인 가능한 정보와 다음 행동 기준을 중심으로 표현한다.` |
| Final checklist | `단정 표현 없음, 비교 압박 없음, 민감 정보 없음, 팀원 책임 전가 없음.` |
| Final card memo | `최종 실행 카드는 고객 실행과 팀원 수용성을 함께 고려한다.` |

Expected downstream check:

```text
Step 12 top status should show that step 11 cleanup data exists.
```

## 10. Step 12 test input: final two-week execution card

| Field group | Test value |
|---|---|
| Focus customers | `자료 요청 후 다음 행동이 불명확한 고객군` |
| Member roles | `팀원별로 확인 질문과 후속 행동 기준을 나누어 맡는다.` |
| Two-week action | `1주차 기준 정리, 2주차 후속 행동 점검.` |
| Compliance point | `설명 중심 표현과 확인 가능한 정보만 사용한다.` |
| First message | `이번 2주는 많이 하는 것보다 기준을 맞추는 데 집중하겠습니다.` |
| Discussion memo | `실행 속도보다 기준 정렬이 왜 중요한지 토의한다.` |

Expected downstream check:

```text
Step 13 top status should show that step 12 final card data exists.
```

## 11. Step 13 expected discussion output

Expected discussion themes:

```text
Which customer group should be prioritized first?
What role should each member take?
How should the leader explain the two-week focus?
What wording should be avoided?
What should be checked before applying this in the field?
```

## 12. QA result recording

Record the actual browser QA result in:

```text
docs/v39-phase1-manual-qa-execution-sheet.md
```
