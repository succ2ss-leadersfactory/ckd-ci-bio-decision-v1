# v35 Browser QA Result

이 문서는 v35 cutover 전 브라우저에서 직접 확인한 결과를 기록하는 전용 QA 기록지다.

주의:

- 이 문서는 실제 브라우저 확인 후에만 `통과`로 변경한다.
- 자동 smoke, remote smoke가 통과해도 이 문서가 미완료이면 cutover는 불가하다.
- v34 운영 화면 보호와 v35 preview 독립 실행 검증을 분리해서 기록한다.

---

## 1. 확인 정보

| 항목 | 결과 |
|---|---|
| 확인 일시 | 미확인 |
| 확인자 | 미확인 |
| 확인 브라우저 | 미확인 |
| 확인 기기 | 미확인 |
| 확인 네트워크 | 미확인 |
| 확인 commit | 미확인 |

확인 URL:

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
https://ckd-ci-bio-decision-v1.vercel.app/journey.html
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

---

## 2. 운영 v34 경로 QA

| 항목 | 결과 | 메모 |
|---|---|---|
| `/` 루트 접속 | 미확인 | `/journey.html`로 이동되는지 확인 |
| `/journey.html` 접속 | 미확인 | 기존 v34 운영 화면 표시 여부 |
| 기존 v34 주요 화면 이동 | 미확인 | 기존 흐름이 깨지지 않는지 확인 |
| 기존 입력/저장 흐름 | 미확인 | Google Sheets 저장 연동 유지 여부 |
| Console error | 미확인 | 실행을 막는 error가 없는지 확인 |
| `c1bio_flow_*` key 유지 | 미확인 | 운영 key가 손상되지 않는지 확인 |

보류 기준:

- `/journey.html`이 열리지 않는다.
- v34 화면 대신 v35 preview가 열린다.
- 기존 저장 연동이 깨진다.
- console runtime error가 발생한다.
- `c1bio_flow_*` key가 손상된다.

---

## 3. v35 preview 진입 QA

| 항목 | 결과 | 메모 |
|---|---|---|
| `/journey-v35-preview.html` 접속 | 미확인 | v35 preview 화면 표시 여부 |
| Smoke Check 패널 | 미확인 | `v35 Preview Smoke Check` 패널 표시 여부 |
| Debug JSON 패널 | 미확인 | 저장 상태 확인 패널 표시 여부 |
| Console error | 미확인 | 실행을 막는 error가 없는지 확인 |
| 모바일/태블릿 기본 조작 | 미확인 | 버튼과 입력창 조작 가능 여부 |

보류 기준:

- 흰 화면만 나온다.
- SmokePanel 또는 DebugPanel이 보이지 않는다.
- Step 버튼이 작동하지 않는다.
- console runtime error가 발생한다.

---

## 4. Step 0~8 이동 QA

| Step | 화면 | 결과 | 메모 |
|---:|---|---|---|
| 0 | 입장 | 미확인 |  |
| 1 | 좋은 질문 만들기 | 미확인 |  |
| 2 | 전략 이슈 검토 | 미확인 |  |
| 3 | Source Check | 미확인 |  |
| 4 | NotebookLM Source Prep | 미확인 |  |
| 5 | NotebookLM Readiness Check | 미확인 |  |
| 6 | Studio Report Output | 미확인 |  |
| 7 | Studio Slide Deck Output | 미확인 |  |
| 8 | Presentation Checklist | 미확인 |  |
| Step 0 Prev 경계 | 경계 처리 | 미확인 | 화면 깨짐 없음 확인 |
| Step 8 Next 경계 | 경계 처리 | 미확인 | 화면 깨짐 없음 확인 |
| 새로고침 후 상태 | 상태 복원 | 미확인 | 마지막 step 또는 저장 상태 유지 확인 |

---

## 5. J01~J09 저장 QA

| 저장 key | 결과 | 메모 |
|---|---|---|
| `J01-entry` | 미확인 | Step 0 저장 후 Debug JSON 확인 |
| `J02-prompt` | 미확인 | Step 1 저장 후 Debug JSON 확인 |
| `J03-strategy-issue-review` | 미확인 | Step 2 저장 후 Debug JSON 확인 |
| `J04-source-check` | 미확인 | Step 3 저장 후 Debug JSON 확인 |
| `J05-notebook-source-prep` | 미확인 | Step 4 저장 후 Debug JSON 확인 |
| `J06-notebook-readiness-check` | 미확인 | Step 5 저장 후 Debug JSON 확인 |
| `J07-studio-report` | 미확인 | Step 6 저장 후 Debug JSON 확인 |
| `J08-studio-slides` | 미확인 | Step 7 저장 후 Debug JSON 확인 |
| `J09-presentation-checklist` | 미확인 | Step 8 저장 후 Debug JSON 확인 |
| 새로고침 후 저장값 유지 | 미확인 | 입력값과 savedState 유지 확인 |

---

## 6. localStorage key 분리 QA

| 항목 | 결과 | 메모 |
|---|---|---|
| `c1bio_v35_preview_step` | 미확인 | 생성 여부 확인 |
| `c1bio_v35_preview_participant` | 미확인 | 생성 여부 확인 |
| `c1bio_v35_preview_state` | 미확인 | 생성 여부 확인 |
| `c1bio_v35_preview_*` 단계별 key | 미확인 | preview 전용 key 생성 여부 |
| `c1bio_flow_*` 생성·변경 없음 | 미확인 | v34 운영 key 보호 여부 |
| preview reset | 미확인 | `c1bio_v35_preview_*`만 삭제되는지 확인 |

보류 기준:

- v35 preview가 `c1bio_flow_*` key를 사용한다.
- v35 preview 저장 중 `c1bio_flow_*` 값이 변경된다.
- preview reset이 v34 key까지 삭제한다.

---

## 7. QA 판정

- 브라우저 QA 전체 판정: 미확인
- v34 운영 영향 여부: 미확인
- v35 preview 독립 실행 여부: 미확인
- J01~J09 저장 여부: 미확인
- localStorage key 분리 여부: 미확인
- cutover 검토 가능 여부: 아직 불가

다음 조치:

1. 위 표의 모든 `미확인`을 실제 확인 결과로 변경한다.
2. 실패 항목이 있으면 조치 방향을 기록한다.
3. 모든 항목이 통과되면 `docs/v35-preview-smoke-result.md`에도 결과를 반영한다.
4. 마지막으로 `npm run audit:v35:readiness`를 실행한다.
