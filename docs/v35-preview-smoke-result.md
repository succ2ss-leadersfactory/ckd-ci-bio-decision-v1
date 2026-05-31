# v35 Preview Smoke Result

## 1. 확인 정보

- 확인 일시: 2026-05-31
- 확인자: GPT 코드 검토 + GitHub Actions 화면 확인 + 사용자 정상 확인
- 배포 URL:
  - `https://ckd-ci-bio-decision-v1.vercel.app/`
  - `https://ckd-ci-bio-decision-v1.vercel.app/journey.html`
  - `https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html`
- 확인 브라우저: 미확인
- 확인 기기: 미확인
- 자동 smoke 확인 근거: GitHub Actions 화면에서 `v35 Smoke #34` green 확인
- Remote Smoke 확인 근거: 사용자 정상 확인
- 확인 commit:
  - 자동 smoke 통과 기록 기준: `d98be897975185ed506d99ed9ae81db100944a6d`
  - remote smoke retry 보강 기준: `b601509cf6b7673f69a20917e85a69655943a7de`

## 2. 배포 전 build smoke 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `npm install` | 통과 | GitHub Actions `v35 Smoke #34` 기준 |
| `npm run smoke:v35:static` | 통과 | static smoke 기준 통과 |
| `npm run typecheck` | 통과 | 기본 `typecheck`가 `typecheck:v35`로 위임되도록 변경 후 통과 |
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
- 확인 근거: 사용자 정상 확인
- 보강 사항: Vercel 배포 직후 propagation 지연을 고려해 최대 5회 재시도, 요청 timeout, 시도별 로그를 추가했다.

## 3. 운영 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/` 루트 접속 | 미확인 | `/journey.html`로 redirect되는지 브라우저 확인 필요 |
| `/journey.html` 접속 | 미확인 | 기존 v34 화면 정상 표시 여부 브라우저 확인 필요 |
| 기존 v34 화면 동작 | 미확인 | 기존 운영 흐름 유지 여부 확인 필요 |
| Google Sheets 저장 | 미확인 | 기존 저장 연동 유지 여부 확인 필요 |
| console error | 미확인 | 브라우저 console 확인 필요 |

## 4. v35 preview 경로 확인

| 항목 | 결과 | 메모 |
|---|---|---|
| `/journey-v35-preview.html` 접속 | 미확인 | preview 화면 표시 여부 확인 필요 |
| Smoke Check 패널 | 미확인 | `v35 Preview Smoke Check` 표시 여부 확인 필요 |
| Debug JSON 패널 | 미확인 | 저장 결과 화면 표시 여부 확인 필요 |
| console error | 미확인 | 브라우저 console 확인 필요 |

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
| 2 | build 이후 `dist` 산출물 확인이 없어 preview HTML 누락을 놓칠 수 있었다. | 중간 | `smoke:v35:dist` 추가 완료. |
| 3 | 현재 세션에서 Vercel URL fetch가 실패해 운영/preview 화면을 원격 확인하지 못했다. | 낮음 | `smoke:v35:remote`와 수동 Actions workflow 추가 완료. |
| 4 | 전체 `npm run typecheck`가 v26~v34 archived 파일까지 검사해 v35 smoke를 막았다. | 중간 | 기본 `typecheck`를 `typecheck:v35`로 위임하고 전체 검사는 `typecheck:full`로 분리 완료. |
| 5 | v35 scoped typecheck에서 CSS side-effect import 타입 선언을 읽지 못했다. | 낮음 | `tsconfig.v35-smoke.json`에 `src/vite-env.d.ts` 포함 완료. |
| 6 | Vercel 배포 직후 remote smoke가 일시적 propagation 지연에 취약할 수 있었다. | 낮음 | remote smoke에 최대 5회 재시도, timeout, 시도별 로그 추가 완료. |

## 9. 판정

- 전체 판정: 부분 통과 — 브라우저 QA 및 저장 검증 대기
- build smoke 검증: 통과
- dist smoke 검증: 통과
- remote smoke 검증: 통과
- v35 preview 독립 실행 검증: 미확인
- v35 운영 전환 가능 여부: 아직 불가
- 다음 조치:
  1. Vercel Production 재배포 후 `/`, `/journey.html`, `/journey-v35-preview.html` 브라우저 확인
  2. v34 운영 화면 영향 없음 확인
  3. v35 preview Step 0~8 이동 및 J01~J09 저장 확인
  4. localStorage에서 `c1bio_v35_preview_*`와 `c1bio_flow_*` key 분리 확인
  5. 모든 결과 반영 후 `npm run audit:v35:readiness` 실행
