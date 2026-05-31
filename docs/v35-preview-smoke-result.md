# v35 Preview Smoke Result

## 1. 확인 정보

- 확인 일시: 2026-05-31
- 확인자: GPT 코드 검토
- 배포 URL:
  - `https://ckd-ci-bio-decision-v1.vercel.app/`
  - `https://ckd-ci-bio-decision-v1.vercel.app/journey.html`
  - `https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html`
- 확인 브라우저: 미확인
- 확인 기기: 미확인

## 2. 배포 전 build smoke 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `npm install` | 미확인 | 의존성 설치 확인 필요 |
| `npm run smoke:v35:static` | 실행 대기 | 정적 smoke script를 fragile하지 않도록 개선 완료 |
| `npm run typecheck` | 미확인 | TypeScript 검사 확인 필요 |
| `npm run build` | 미확인 | Vite build 확인 필요 |
| `npm run smoke:v35` | 실행 대기 | static + typecheck + build 통합 확인 필요 |

## 2-1. 정적 smoke script 사전 검토 결과

2026-05-31 기준으로 `scripts/smoke-v35-static.mjs`를 재검토하고 안정화했다.

개선 내용:

- 단순 `content.includes(...)` 중심 검사를 줄이고 정규식 기반 검사로 변경했다.
- `package.json`, `vercel.json`은 문자열 검색이 아니라 JSON parse 후 핵심 필드를 검사하도록 변경했다.
- `journey.html`, `journey-v35-preview.html`은 module script entry를 확인하도록 변경했다.
- `vite.config.ts`는 `journeyV35Preview` input과 `journey-v35-preview.html` build input을 정규식으로 확인한다.
- router case 검사는 `case 0:` 고정 문자열 대신 `case\s+N\s*:` 형태로 확인한다.
- 코드 주석을 제거한 뒤 검사해 주석에 남은 문자열 때문에 false positive가 발생할 가능성을 줄였다.
- v35 preview config에서 `c1bio_flow_` 운영 key가 섞이지 않았는지 계속 차단한다.

남은 확인:

```bash
npm run smoke:v35:static
npm run smoke:v35
```

## 3. 운영 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/` 루트 접속 | 미확인 | `/journey.html`로 redirect되는지 확인 |
| `/journey.html` 접속 | 미확인 | 기존 v34 화면 정상 표시 여부 |
| 기존 v34 화면 동작 | 미확인 | 기존 운영 흐름 유지 여부 |
| Google Sheets 저장 | 미확인 | 기존 저장 연동 유지 여부 |
| console error | 미확인 | 브라우저 console 확인 |

## 4. v35 preview 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/journey-v35-preview.html` 접속 | 미확인 | preview 화면 표시 여부 |
| Smoke Check 패널 | 미확인 | `v35 Preview Smoke Check` 표시 여부 |
| Debug JSON 패널 | 미확인 | 저장 결과 화면 표시 여부 |
| console error | 미확인 | 브라우저 console 확인 |

## 5. Step 이동 확인

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

## 6. 저장 확인

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

## 7. localStorage key 분리 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `c1bio_v35_preview_*` key 생성 | 미확인 | preview 전용 저장 여부 |
| `c1bio_flow_*` key 영향 없음 | 미확인 | 기존 v34 저장 key 보호 여부 |
| v35 preview 저장 초기화 | 미확인 | preview key만 삭제되는지 확인 |

## 8. 발견 이슈

| 번호 | 이슈 | 심각도 | 조치 방향 |
|---:|---|---|---|
| 1 | 정적 smoke script가 작은 포맷 변화에 취약한 문자열 검색 중심이었다. | 중간 | 정규식·JSON parse 기반 검사로 개선 완료. |
| 2 | 현재 세션에서 Vercel URL fetch가 실패해 운영/preview 화면을 원격 확인하지 못했다. | 낮음 | 브라우저 또는 Vercel 빌드 로그에서 직접 확인 필요. |

## 9. 판정

- 전체 판정: 실행 검증 대기
- build smoke 검증: 실행 대기
- v35 preview 독립 실행 검증: 미확인
- v35 운영 전환 가능 여부: 아직 불가
- 다음 조치:
  1. `npm run smoke:v35:static` 실행
  2. `npm run smoke:v35` 실행
  3. Vercel Production 재배포 후 `/`, `/journey.html`, `/journey-v35-preview.html` 확인
  4. v34 운영 화면 영향 없음 확인
  5. v35 preview Step 0~8 이동 및 J01~J09 저장 확인
