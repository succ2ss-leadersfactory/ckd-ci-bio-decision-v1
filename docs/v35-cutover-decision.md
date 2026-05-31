# v35 Cutover Decision Note

이 문서는 `v35 Readiness Audit` 통과 이후, v35를 운영 경로로 전환할지 판단하기 위한 의사결정 기록이다.

현재 결론:

```txt
Cutover status: 검토 가능, 실행 전
권장 결정: Preview 안정 상태 유지 후 별도 승인 시 cutover 실행
```

---

## 1. 현재 통과 근거

| 항목 | 상태 | 근거 |
|---|---|---|
| v35 Smoke | 통과 | GitHub Actions `v35 Smoke` green 확인 |
| v35 Remote Smoke | 통과 | GitHub Actions `v35 Remote Smoke` green 확인 |
| Browser QA | 통과 | 사용자 브라우저 QA 결과 확인 |
| v34 운영 영향 | 영향 없음 | `/journey.html` 운영 경로 통과 |
| v35 preview 독립 실행 | 통과 | `/journey-v35-preview.html` 통과 |
| Step 0~8 이동 | 통과 | 사용자 QA 확인 |
| J01~J09 저장 | 통과 | 사용자 QA 확인 |
| localStorage key 분리 | 통과 | console snippet 결과 통과 |
| Console snippet | 통과 | `missingPreviewKeys: none`, `missingSavedStateKeys: none`, `pass: true` |
| v35 Readiness Audit | 통과 | 사용자 GitHub Actions 확인 |

---

## 2. 현재 운영 구조

현재 운영 구조는 아래와 같다.

```txt
journey.html
→ src/journey-active.tsx
→ src/full-flow-journey-v35.tsx
→ src/full-flow-journey-v34.tsx
```

즉, `v35`는 아직 운영 앱이 아니라 운영 경로에서 v34로 위임하는 staging entry 역할을 한다.

현재 v35 preview 검증 경로는 별도로 유지된다.

```txt
/journey-v35-preview.html
→ src/journey-v35-app-preview.tsx
→ src/full-flow-journey-v35-app.tsx
```

---

## 3. 선택지

### 선택 A. Preview 안정 상태 유지

내용:

- `/journey.html`은 v34 운영 경로로 유지한다.
- `/journey-v35-preview.html`은 검증 완료된 preview 경로로 유지한다.
- v35 운영 전환은 교육장 운영 일정 또는 추가 승인 시점에 별도로 진행한다.

장점:

- v34 운영 안정성을 계속 보장한다.
- v35 검증 결과를 보존한 채 추가 관찰이 가능하다.
- 교육장 파일럿 직전 리스크를 최소화한다.

단점:

- 실제 운영 경로는 아직 v35가 아니다.
- v35 전환 작업은 별도 커밋으로 남는다.

권장도:

```txt
높음 — 현재 권장안
```

---

### 선택 B. v35 운영 전환 실행

내용:

- `src/full-flow-journey-v35.tsx`의 v34 위임 import 제거를 검토한다.
- 운영 경로에서 v35 app이 실행되도록 연결한다.
- cutover 후 즉시 smoke, remote smoke, browser QA를 반복한다.

장점:

- 운영 경로가 v35로 전환된다.
- v35 검증 결과를 실제 운영 경로에 반영할 수 있다.

단점:

- v34 운영 안정성을 직접 대체한다.
- rollback 준비가 필수다.
- 전환 직후 `/journey.html` 회귀 확인이 반드시 필요하다.

권장도:

```txt
조건부 — 명시적 cutover 승인 후 진행
```

---

## 4. Cutover 실행 전 필수 확인

v35 운영 전환을 실행하려면 아래를 다시 확인한다.

- `docs/v35-validation-index.md` 기준 문서 순서 확인
- `docs/v35-cutover-gates.md` 확인
- `docs/v35-preview-smoke-result.md` 최종 통과 상태 확인
- `docs/v35-browser-qa-result.md` 최종 통과 상태 확인
- rollback 기준 확인
- 전환 직후 테스트 담당자 지정
- 운영 전환 시간대 결정
- 교육장 운영 전 충분한 재검증 시간 확보

---

## 5. Rollback 기준

cutover 후 아래 문제가 발생하면 즉시 rollback한다.

| 문제 | 조치 |
|---|---|
| `/journey.html` 흰 화면 | v34 위임 import 복구 |
| v35 runtime error | v34 위임 import 복구 |
| 기존 저장 흐름 손상 | v34 위임 import 복구 |
| Google Sheets 저장 실패 | v34 위임 import 복구 |
| Step 이동 불가 | v34 위임 import 복구 |
| 교육장 운영 중 사용 불가 | 직전 stable 배포로 되돌림 |

기본 rollback 코드:

```ts
import './full-flow-journey-v34';
```

`src/full-flow-journey-v35.tsx` 마지막에 위 위임 import를 복구한다.

---

## 6. 현재 권장 결정

현재 추천은 다음이다.

```txt
선택 A — Preview 안정 상태 유지
```

이유:

- v35는 모든 검증 gate를 통과했지만 아직 운영 전환 실행 전이다.
- v34 운영 경로가 정상이고, 교육장 운영 리스크를 최소화하는 것이 우선이다.
- cutover는 명시적 승인 후 단일 목적 커밋으로 실행하는 것이 안전하다.

---

## 7. 다음 결정 필요 사항

아래 중 하나를 선택해야 한다.

```txt
A. Preview 안정 상태 유지
B. v35 운영 전환 cutover 실행
```

B를 선택하면 다음 작업은 다음과 같다.

1. cutover commit 생성
2. `src/full-flow-journey-v35.tsx` v34 위임 import 제거 또는 v35 app 연결 방식 적용
3. `npm run smoke:v35` 재실행
4. Vercel 배포 확인
5. `/journey.html` 브라우저 회귀 QA
6. 문제 발생 시 rollback
