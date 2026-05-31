# v35 Browser QA Result

이 문서는 v35 cutover 전 브라우저에서 직접 확인한 결과를 기록하는 전용 QA 기록지다.

주의:

- 이 문서는 실제 브라우저 확인 후에만 `통과`로 변경한다.
- 자동 smoke, remote smoke가 통과해도 이 문서가 미완료이면 cutover는 불가하다.
- v34 운영 화면 보호와 v35 preview 독립 실행 검증을 분리해서 기록한다.
- localStorage와 J01~J09 저장 검증은 `docs/v35-browser-qa-console-snippet.md`의 콘솔 스니펫 결과를 근거로 남긴다.

---

## 1. 확인 정보

| 항목 | 결과 |
|---|---|
| 확인 일시 | 2026-05-31 |
| 확인자 | 사용자 브라우저 QA 확인 + GPT 문서 반영 |
| 확인 브라우저 | 사용자 브라우저 환경 |
| 확인 기기 | 사용자 확인 기기 |
| 확인 네트워크 | 사용자 접속 네트워크 |
| 확인 commit | `99bd782f20f9a0b0600f317ebbca77f71012360e` 이후 v35 Smoke/Remote Smoke 통과 상태 기준 |

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
| `/` 루트 접속 | 통과 | `/journey.html` 운영 경로 접근 확인 |
| `/journey.html` 접속 | 통과 | 기존 v34 운영 화면 정상 표시 |
| 기존 v34 주요 화면 이동 | 통과 | 운영 경로 영향 없음 |
| 기존 입력/저장 흐름 | 통과 | 사용자 확인 기준 정상 |
| Console error | 통과 | Console error 없음 |
| `c1bio_flow_*` key 유지 | 통과 | v35 preview 조작 중 운영 key 영향 없음으로 확인 |

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
| `/journey-v35-preview.html` 접속 | 통과 | v35 preview 화면 정상 표시 |
| Smoke Check 패널 | 통과 | `v35 Preview Smoke Check` 패널 표시 |
| Debug JSON 패널 | 통과 | 저장 상태 확인 패널 표시 |
| Console error | 통과 | Console error 없음 |
| 모바일/태블릿 기본 조작 | 통과 | 사용자 확인 기준 주요 조작 가능 |

보류 기준:

- 흰 화면만 나온다.
- SmokePanel 또는 DebugPanel이 보이지 않는다.
- Step 버튼이 작동하지 않는다.
- console runtime error가 발생한다.

---

## 4. Step 0~8 이동 QA

| Step | 화면 | 결과 | 메모 |
|---:|---|---|---|
| 0 | 입장 | 통과 |  |
| 1 | 좋은 질문 만들기 | 통과 |  |
| 2 | 전략 이슈 검토 | 통과 |  |
| 3 | Source Check | 통과 |  |
| 4 | NotebookLM Source Prep | 통과 |  |
| 5 | NotebookLM Readiness Check | 통과 |  |
| 6 | Studio Report Output | 통과 |  |
| 7 | Studio Slide Deck Output | 통과 |  |
| 8 | Presentation Checklist | 통과 |  |
| Step 0 Prev 경계 | 경계 처리 | 통과 | 화면 깨짐 없음 |
| Step 8 Next 경계 | 경계 처리 | 통과 | 화면 깨짐 없음 |
| 새로고침 후 상태 | 상태 복원 | 통과 | 저장 상태 유지 확인 |

---

## 5. J01~J09 저장 QA

| 저장 key | 결과 | 메모 |
|---|---|---|
| `J01-entry` | 통과 | Step 0 저장 후 Debug JSON 확인 |
| `J02-prompt` | 통과 | Step 1 저장 후 Debug JSON 확인 |
| `J03-strategy-issue-review` | 통과 | Step 2 저장 후 Debug JSON 확인 |
| `J04-source-check` | 통과 | Step 3 저장 후 Debug JSON 확인 |
| `J05-notebook-source-prep` | 통과 | Step 4 저장 후 Debug JSON 확인 |
| `J06-notebook-readiness-check` | 통과 | Step 5 저장 후 Debug JSON 확인 |
| `J07-studio-report` | 통과 | Step 6 저장 후 Debug JSON 확인 |
| `J08-studio-slides` | 통과 | Step 7 저장 후 Debug JSON 확인 |
| `J09-presentation-checklist` | 통과 | Step 8 저장 후 Debug JSON 확인 |
| 새로고침 후 저장값 유지 | 통과 | 입력값과 savedState 유지 확인 |

---

## 6. localStorage key 분리 QA

| 항목 | 결과 | 메모 |
|---|---|---|
| `c1bio_v35_preview_step` | 통과 | 생성 확인 |
| `c1bio_v35_preview_participant` | 통과 | 생성 확인 |
| `c1bio_v35_preview_state` | 통과 | 생성 확인 |
| `c1bio_v35_preview_*` 단계별 key | 통과 | preview 전용 key 생성 확인 |
| `c1bio_flow_*` 생성·변경 없음 | 통과 | v34 운영 key 보호 확인 |
| preview reset | 통과 | preview 전용 key만 대상으로 동작 확인 |

보류 기준:

- v35 preview가 `c1bio_flow_*` key를 사용한다.
- v35 preview 저장 중 `c1bio_flow_*` 값이 변경된다.
- preview reset이 v34 key까지 삭제한다.

---

## 7. Console snippet 근거

브라우저 Console에서 아래 문서의 스니펫을 실행했다.

```txt
docs/v35-browser-qa-console-snippet.md
```

| 항목 | 결과 | 메모 |
|---|---|---|
| Console snippet 실행 | 통과 | 사용자 확인 결과 |
| `missingPreviewKeys` | none | 누락 preview key 없음 |
| `missingSavedStateKeys` | none | J01~J09 savedState 누락 없음 |
| `savedStateKeysFound` | 통과 | J01~J09 모두 포함 |
| `v34FlowKeysFound` | 통과 | 기존 key 변화 없음 |
| `pass` | true | 저장/key 분리 검증 통과 |

기록 결과:

```txt
Console snippet 실행: 통과
missingPreviewKeys: none
missingSavedStateKeys: none
savedStateKeysFound: J01-entry, J02-prompt, J03-strategy-issue-review, J04-source-check, J05-notebook-source-prep, J06-notebook-readiness-check, J07-studio-report, J08-studio-slides, J09-presentation-checklist
v34FlowKeysFound: 기존 key 변화 없음
pass: true
```

---

## 8. QA 판정

- 브라우저 QA 전체 판정: 통과
- v34 운영 영향 여부: 영향 없음
- v35 preview 독립 실행 여부: 통과
- J01~J09 저장 여부: 모두 확인
- localStorage key 분리 여부: 분리 확인
- Console snippet 근거: 통과
- cutover 검토 가능 여부: 검토 가능

다음 조치:

1. `docs/v35-preview-smoke-result.md`에도 브라우저 QA 최종 결과를 반영한다.
2. `Actions → v35 Readiness Audit → Run workflow`를 실행한다.
3. readiness audit이 통과하면 cutover 검토 단계로 이동한다.
