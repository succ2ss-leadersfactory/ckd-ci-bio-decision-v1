# v35 Cutover Decision Note

이 문서는 `v35 Readiness Audit` 통과 이후 v35 운영 전환 여부를 판단한 기록이다.

## 1. 현재 결정

```txt
Selected decision: A. Preview 안정 상태 유지
Cutover status: 검토 가능, 실행 전
Operating route: v34 유지
Preview route: v35 검증 완료 상태 유지
```

## 2. 통과 근거

| 항목 | 상태 |
|---|---|
| v35 Smoke | 통과 |
| v35 Remote Smoke | 통과 |
| Browser QA | 통과 |
| Console snippet | 통과 |
| v35 Readiness Audit | 통과 |
| v34 운영 영향 | 영향 없음 |
| Step 0~8 이동 | 통과 |
| J01~J09 저장 | 통과 |
| localStorage key 분리 | 통과 |

## 3. 선택 A 운영 방침

선택 A는 v35를 바로 운영 경로로 전환하지 않고, 검증 완료된 preview 상태로 안정 유지하는 결정이다.

운영 방침:

- `/journey.html`은 기존 v34 운영 경로로 유지한다.
- `/journey-v35-preview.html`은 v35 preview 검증 경로로 유지한다.
- v35 운영 전환은 별도 승인 전까지 실행하지 않는다.
- v35 관련 변경이 있으면 smoke, remote smoke, browser QA, readiness audit을 다시 확인한다.

## 4. 선택 B 보류

선택 B는 v35 운영 전환 실행이다.

현재는 보류한다.

선택 B는 아래 조건이 충족될 때 다시 검토한다.

- 운영 전환 승인
- 전환 시간대 결정
- 전환 직후 QA 담당자 지정
- 문제 발생 시 복구 기준 확인

## 5. 현재 판정

```txt
선택 A 확정
운영 전환 보류
v34 운영 유지
v35 preview 안정 유지
```
