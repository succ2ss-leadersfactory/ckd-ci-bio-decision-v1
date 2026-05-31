# v35 Preview Smoke Result

## 1. 확인 정보

- 확인 일시:
- 확인자:
- 배포 URL:
- 확인 브라우저:
- 확인 기기:

## 2. 운영 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/journey.html` 접속 | 미확인 | 기존 v34 화면 정상 표시 여부 |
| 기존 v34 화면 동작 | 미확인 | 기존 운영 흐름 유지 여부 |
| Google Sheets 저장 | 미확인 | 기존 저장 연동 유지 여부 |
| console error | 미확인 | 브라우저 console 확인 |

## 3. v35 preview 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/journey-v35-preview.html` 접속 | 미확인 | preview 화면 표시 여부 |
| Smoke Check 패널 | 미확인 | `v35 Preview Smoke Check` 표시 여부 |
| Debug JSON 패널 | 미확인 | 저장 결과 화면 표시 여부 |
| console error | 미확인 | 브라우저 console 확인 |

## 4. Step 이동 확인

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

## 5. 저장 확인

| 저장 key | 결과 | 메모 |
|---|---|---|
| `J01-entry` | 미확인 |  |
| `J02-prompt` | 미확인 |  |
| `J03-strategy-issue-review` | 미확인 |  |
| `J04-source-check` | 미확인 |  |
| `J05-notebook-source-prep` | 미확인 |  |
| `J06-notebook-readiness-check` | 미확인 |  |
| `J07-studio-report` | 미확인 |  |
| `J08-studio-slides` | 미확인 |  |
| `J09-presentation-checklist` | 미확인 |  |

## 6. localStorage key 분리 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `c1bio_v35_preview_*` key 생성 | 미확인 | preview 전용 저장 여부 |
| `c1bio_flow_*` key 영향 없음 | 미확인 | 기존 v34 저장 key 보호 여부 |
| v35 preview 저장 초기화 | 미확인 | preview key만 삭제되는지 확인 |

## 7. 발견 이슈

| 번호 | 이슈 | 심각도 | 조치 방향 |
|---:|---|---|---|
| 1 |  |  |  |
| 2 |  |  |  |
| 3 |  |  |  |

## 8. 판정

- 전체 판정: 미확인
- v35 preview 독립 실행 검증: 미확인
- v35 운영 전환 가능 여부: 미확인
- 다음 조치:
