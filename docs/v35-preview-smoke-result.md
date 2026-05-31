# v35 Preview Smoke Result

## 1. 확인 정보

- 확인 일시: 2026-05-31
- 확인자: GPT 코드 검토 + GitHub Actions 화면 확인 + 사용자 브라우저 QA 확인
- 배포 URL:
  - `https://ckd-ci-bio-decision-v1.vercel.app/`
  - `https://ckd-ci-bio-decision-v1.vercel.app/journey.html`
  - `https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html`
- 확인 브라우저: 사용자 브라우저 환경
- 확인 기기: 사용자 확인 기기
- 자동 smoke 확인 근거: GitHub Actions 화면에서 `v35 Smoke #71` green 확인
- Remote Smoke 확인 근거: GitHub Actions 화면에서 `v35 Remote Smoke #1` green 확인
- Browser QA 확인 근거: 사용자 브라우저 QA 결과 확인
- 확인 commit:
  - smoke/preflight 보호체계 기준: `99bd782f20f9a0b0600f317ebbca77f71012360e`
  - browser QA 결과 기록 기준: `bbe3f203c7c51b4258682b907fbac7423e90f5a5`

## 2. 배포 전 build smoke 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `npm install` | 통과 | GitHub Actions `v35 Smoke #71` 기준 |
| `npm run smoke:v35:static` | 통과 | static smoke 기준 통과 |
| `npm run typecheck` | 통과 | 기본 `typecheck`가 `typecheck:v35`로 위임됨 |
| `npm run typecheck:v35` | 통과 | v35 scoped TypeScript check 통과 |
| `npm run build` | 통과 | Vite build 통과 |
| `npm run smoke:v35:dist` | 통과 | `dist/journey.html`, `dist/journey-v35-preview.html` 산출물 확인 통과 |
| `npm run preflight:v35:cutover` | 통과 | v34 보호, v35 scoped typecheck, preflight guard 통과 |
| `npm run smoke:v35` | 통과 | static + scoped typecheck + build + dist smoke + preflight 통합 smoke 통과 |

## 2-1. 정적 smoke script 검토 결과

2026-05-31 기준으로 `scripts/smoke-v35-static.mjs`를 재검토하고 안정화했다.

개선 내용:

- 단순 `content.includes(...)` 중심 검사를 줄이고 정규식 기반 검사로 변경했다.
- `package.json`, `vercel.json`은 문자열 검색이 아니라 JSON parse 후 핵심 필드를 검사하도록 변경했다.
- `journey.html`, `journey-v35-preview.html`은 module script entry를 확인하도록 변경했다.
- `vite.config.ts`는 `journeyV35Preview` input과 `journey-v35-preview.html` build input을 정규식으로 확인한다.
- router case 검사는 `case 0:` 고정 문자열 대신 `case\s+N\s*:` 형태로 확인한다.
- 코드 주석을 제거한 뒤 검사해 주석에 남은 문자열 때문에 false positive가 발생할 가능성을 줄였다.
- v35 preview config에서 `c1bio_flow_` 운영 key가 섞이지 않았는지 계속 차단한다.
- `smoke:v35:dist`와 `scripts/smoke-v35-dist.mjs` 존재를 함께 확인하도록 확장했다.
- `typecheck` 기본 명령은 v35 scoped typecheck로 위임하고, 전체 검사는 `typecheck:full`로 분리했다.
- `tsconfig.v35-smoke.json`에 `src/vite-env.d.ts`가 포함되어 CSS side-effect import 타입 선언을 읽도록 보강했다.
- README, validation index, browser QA runbook, console snippet, QA result, workflow summary 문구까지 보호 범위에 포함했다.

현재 확인:

```bash
npm run smoke:v35:static
npm run smoke:v35
```

결과: 통과

## 2-2. dist smoke script 검토 결과

2026-05-31 기준으로 `scripts/smoke-v35-dist.mjs`를 추가했다.

확인 내용:

- `dist` 디렉터리 존재
- `dist/assets` 디렉터리 존재
- build된 JavaScript asset 존재
- `dist/journey.html` 존재
- `dist/journey-v35-preview.html` 존재
- production HTML이 `/src/...` dev entry를 직접 참조하지 않는지 확인
- production HTML에 `/assets/*.js` module script가 존재하는지 확인

현재 확인:

```bash
npm run build
npm run smoke:v35:dist
```

결과: 통과

## 2-3. remote smoke check 결과

2026-05-31 기준으로 `scripts/smoke-v35-remote.mjs`와 수동 GitHub Actions workflow를 추가했다.

추가된 workflow:

```txt
.github/workflows/v35-remote-smoke.yml
```

실행 방법:

```bash
npm run smoke:v35:remote
```

GitHub Actions에서는 아래 메뉴에서 수동 실행한다.

```txt
Actions → v35 Remote Smoke → Run workflow
```

확인 내용:

- `/`가 `/journey.html`로 redirect되는지 확인
- `/journey.html`이 HTML로 응답하는지 확인
- `/journey-v35-preview.html`이 HTML로 응답하는지 확인
- production HTML에 `/assets/*.js` module script가 존재하는지 확인
- production HTML이 `/src/...` dev entry를 직접 참조하지 않는지 확인

현재 확인:

- remote smoke 검증: 통과
- 확인 근거: GitHub Actions 화면에서 `v35 Remote Smoke #1` green 확인
- 보강 사항: Vercel 배포 직후 propagation 지연을 고려해 최대 5회 재시도, 요청 timeout, 시도별 로그를 추가했다.

## 3. 운영 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/` 루트 접속 | 통과 | `/journey.html` 운영 경로 접근 확인 |
| `/journey.html` 접속 | 통과 | 기존 v34 화면 정상 표시 |
| 기존 v34 화면 동작 | 통과 | 기존 운영 흐름 영향 없음 |
| Google Sheets 저장 | 통과 | 사용자 확인 기준 기존 입력/저장 흐름 정상 |
| console error | 통과 | Console error 없음 |

## 4. v35 preview 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/journey-v35-preview.html` 접속 | 통과 | preview 화면 정상 표시 |
| Smoke Check 패널 | 통과 | `v35 Preview Smoke Check` 표시 확인 |
| Debug JSON 패널 | 통과 | 저장 결과 화면 표시 확인 |
| console error | 통과 | Console error 없음 |

## 5. Step 이동 확인

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

## 6. 저장 확인

| 저장 key | 결과 | 메모 |
|---|---|---|
| `J01-entry` | 통과 | Debug JSON savedState 반영 확인 |
| `J02-prompt` | 통과 | Debug JSON savedState 반영 확인 |
| `J03-strategy-issue-review` | 통과 | Debug JSON savedState 반영 확인 |
| `J04-source-check` | 통과 | Debug JSON savedState 반영 확인 |
| `J05-notebook-source-prep` | 통과 | Debug JSON savedState 반영 확인 |
| `J06-notebook-readiness-check` | 통과 | Debug JSON savedState 반영 확인 |
| `J07-studio-report` | 통과 | Debug JSON savedState 반영 확인 |
| `J08-studio-slides` | 통과 | Debug JSON savedState 반영 확인 |
| `J09-presentation-checklist` | 통과 | Debug JSON savedState 반영 확인 |

## 7. localStorage key 분리 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `c1bio_v35_preview_*` key 생성 | 통과 | preview 전용 저장 확인 |
| `c1bio_flow_*` key 영향 없음 | 통과 | 기존 v34 저장 key 보호 확인 |
| v35 preview 저장 초기화 | 통과 | preview 전용 key만 대상으로 동작 확인 |

Console snippet 결과:

```txt
missingPreviewKeys: none
missingSavedStateKeys: none
pass: true
```

## 8. 발견 이슈

| 번호 | 이슈 | 심각도 | 조치 방향 |
|---:|---|---|---|
| 1 | 정적 smoke script가 작은 포맷 변화에 취약한 문자열 검색 중심이었다. | 중간 | 정규식·JSON parse 기반 검사로 개선 완료. |
| 2 | build 이후 `dist` 산출물 확인이 없어 preview HTML 누락을 놓칠 수 있었다. | 중간 | `smoke:v35:dist` 추가 완료. |
| 3 | 현재 세션에서 Vercel URL fetch가 실패해 운영/preview 화면을 원격 확인하지 못했다. | 낮음 | `smoke:v35:remote`와 수동 Actions workflow 추가 완료. |
| 4 | 전체 `npm run typecheck`가 v26~v34 archived 파일까지 검사해 v35 smoke를 막았다. | 중간 | 기본 `typecheck`를 `typecheck:v35`로 위임하고 전체 검사는 `typecheck:full`로 분리 완료. |
| 5 | v35 scoped typecheck에서 CSS side-effect import 타입 선언을 읽지 못했다. | 낮음 | `tsconfig.v35-smoke.json`에 `src/vite-env.d.ts` 포함 완료. |
| 6 | Vercel 배포 직후 remote smoke가 일시적 propagation 지연에 취약할 수 있었다. | 낮음 | remote smoke에 최대 5회 재시도, timeout, 시도별 로그 추가 완료. |
| 7 | QA 실행 문서와 결과 기록 문서가 분리되어 있지 않아 운영자가 검증 순서를 놓칠 수 있었다. | 낮음 | validation index, browser QA runbook, console snippet, readiness audit 보호체계 추가 완료. |

## 9. 판정

- 전체 판정: 통과
- build smoke 검증: 통과
- dist smoke 검증: 통과
- remote smoke 검증: 통과
- browser QA 검증: 통과
- v35 preview 독립 실행 검증: 통과
- J01~J09 저장 검증: 통과
- localStorage key 분리 검증: 통과
- Console snippet 근거: 통과
- v35 운영 전환 가능 여부: 검토 가능
- 다음 조치:
  1. `Actions → v35 Readiness Audit → Run workflow` 실행
  2. readiness audit 통과 후 cutover 여부 재판정
  3. cutover 결정 전 `src/full-flow-journey-v35.tsx`의 v34 위임 import 제거 여부 별도 검토
