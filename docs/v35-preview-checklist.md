# v35 Preview Verification Checklist

이 문서는 `v35` 독립 실행 전환 전, preview 경로에서 반드시 확인해야 할 항목을 정리한 수동 QA 체크리스트입니다.

핵심 원칙:

- `src/full-flow-journey-v34.tsx`는 수정하지 않는다.
- `src/journey-active.tsx`는 아직 수정하지 않는다.
- `src/full-flow-journey-v35.tsx`의 마지막 `import './full-flow-journey-v34';`는 유지한다.
- v35 preview가 통과되기 전까지 운영 화면은 계속 v34로 작동해야 한다.
- Google Sheets 저장 연동은 v35 preview에 아직 연결하지 않는다.

---

## 1. QA 전제 조건

### 1-1. 권장 확인 URL

최종 검증과 교육생 공유에는 production domain을 사용한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
```

운영 화면 직접 경로:

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey.html
```

v35 preview 화면 직접 경로:

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

주의:

- suffix가 붙은 deployment URL은 특정 배포본을 가리킬 수 있다.
- 최신 commit 반영 여부를 확인하려면 production domain 또는 Vercel 최신 deployment URL을 사용한다.
- 화면이 이상하면 먼저 시크릿 창 또는 캐시 비우기 후 재확인한다.

### 1-2. 권장 확인 환경

| 항목 | 기준 |
|---|---|
| Desktop browser | Chrome 최신 버전 우선 |
| Mobile/Tablet | 실제 교육장 사용 기기 또는 responsive mode |
| DevTools | Console, Application > Local Storage 확인 가능해야 함 |
| Network | 배포 직후 propagation 지연 가능성 고려 |

---

## 2. 배포 전 자동 smoke check

배포 전 아래 명령을 실행한다.

```bash
npm run smoke:v35
```

이 명령은 다음을 순서대로 실행한다.

```bash
npm run smoke:v35:static
npm run typecheck
npm run build
npm run smoke:v35:dist
```

각 명령을 분리해서 확인할 수도 있다.

```bash
npm run smoke:v35:static
npm run typecheck
npm run build
npm run smoke:v35:dist
```

### 2-1. 정적 smoke 자동 확인 범위

`npm run smoke:v35:static`은 화면을 직접 열기 전에 아래 구조를 자동으로 확인한다.

- 필수 파일 존재 여부
- `package.json` smoke script 연결
- `journey.html`과 `journey-v35-preview.html` entry 연결
- `vite.config.ts`의 `journeyV35Preview` build input 유지
- `vercel.json`의 `/` → `/journey.html` redirect 유지
- `full-flow-journey-v35.tsx`의 v34 위임 import 유지
- v35 app의 Shell/router/state 조립 구조 유지
- `V35_STORAGE_KEYS` 전체 key 유지
- v35 preview config에서 v34 운영 key `c1bio_flow_` 미사용
- `V35_APP_STEPS` 9개 step id 유지
- router `case 0`~`case 8` 유지
- `J01-entry`~`J09-presentation-checklist` 저장 key 유지
- `V35PreviewSmokePanel`, `V35PreviewDebugPanel` 연결 유지
- `v35-preview-smoke-panel`, `v35-preview-debug-panel` test id 유지
- `scripts/smoke-v35-dist.mjs` 존재 및 `smoke:v35:dist` script 연결

### 2-2. dist smoke 자동 확인 범위

`npm run smoke:v35:dist`는 `npm run build` 이후 아래 산출물을 확인한다.

- `dist` 디렉터리 존재
- `dist/assets` 디렉터리 존재
- build된 JavaScript asset 존재
- `dist/journey.html` 존재
- `dist/journey-v35-preview.html` 존재
- production HTML이 `/src/...` dev entry를 직접 참조하지 않는지 확인
- production HTML에 `/assets/*.js` module script가 존재하는지 확인

### 2-3. 원격 smoke check

Vercel 배포 완료 후 아래 명령을 실행한다.

```bash
npm run smoke:v35:remote
```

GitHub Actions에서 수동 실행할 수도 있다.

```txt
Actions → v35 Remote Smoke → Run workflow
```

확인 내용:

- `/`가 `/journey.html`로 redirect되는지 확인
- `/journey.html`이 HTML로 응답하는지 확인
- `/journey-v35-preview.html`이 HTML로 응답하는지 확인
- production HTML에 `/assets/*.js` module script가 존재하는지 확인
- production HTML이 `/src/...` dev entry를 직접 참조하지 않는지 확인

---

## 3. 운영 경로 수동 확인

운영 경로는 기존 v34가 정상인지 확인하는 단계다. v35 preview와 별개로 반드시 먼저 확인한다.

| 번호 | 확인 항목 | 기대 결과 | 결과 |
|---:|---|---|---|
| 1 | `/` 접속 | `/journey.html`로 이동된다. | 미확인 |
| 2 | `/journey.html` 접속 | 기존 운영 Journey 화면이 표시된다. | 미확인 |
| 3 | v34 주요 화면 이동 | 기존 흐름이 깨지지 않는다. | 미확인 |
| 4 | 기존 입력/저장 흐름 | 기존 Google Sheets 저장 연동이 유지된다. | 미확인 |
| 5 | Console 확인 | 신규 error가 없다. | 미확인 |
| 6 | Local Storage 확인 | 기존 `c1bio_flow_*` key가 유지된다. | 미확인 |

보류 기준:

- `/journey.html`이 열리지 않는다.
- v34 화면 대신 v35 preview가 열린다.
- 기존 저장 연동이 깨진다.
- console에 실행을 막는 error가 발생한다.

---

## 4. v35 preview 수동 QA 시나리오

### 4-1. 시작 전 localStorage 초기화

검증 전 시크릿 창을 사용하거나, 기존 preview key를 삭제한다.

삭제 대상:

```txt
c1bio_v35_preview_*
```

주의:

```txt
c1bio_flow_*
```

위 key는 v34 운영 key이므로 삭제하지 않는다.

### 4-2. preview 화면 진입

접속 URL:

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

| 번호 | 확인 항목 | 기대 결과 | 결과 |
|---:|---|---|---|
| 1 | 페이지 로드 | v35 preview 화면이 열린다. | 미확인 |
| 2 | 상단/본문 렌더링 | 빈 화면이 아니다. | 미확인 |
| 3 | Smoke Check 패널 | `v35 Preview Smoke Check` 패널이 보인다. | 미확인 |
| 4 | Debug JSON 패널 | 저장 상태 확인 패널이 보인다. | 미확인 |
| 5 | Console 확인 | 실행을 막는 error가 없다. | 미확인 |

보류 기준:

- 흰 화면만 나온다.
- SmokePanel 또는 DebugPanel이 보이지 않는다.
- Step 버튼이 작동하지 않는다.
- console에 React runtime error가 발생한다.

---

## 5. Step 0~8 이동 확인

Next / Prev 버튼으로 전체 단계가 이동되는지 확인한다.

| Step | 화면 | 기대 결과 | 결과 |
|---:|---|---|---|
| 0 | 입장 | 참여자/세션 입력 화면이 표시된다. | 미확인 |
| 1 | 좋은 질문 만들기 | 프롬프트 실습 화면이 표시된다. | 미확인 |
| 2 | 전략 이슈 검토 | 전략 이슈 메모 입력 화면이 표시된다. | 미확인 |
| 3 | Source Check | 출처 확인 체크 화면이 표시된다. | 미확인 |
| 4 | NotebookLM Source Prep | 소스 준비 텍스트가 생성된다. | 미확인 |
| 5 | NotebookLM Readiness Check | readiness 점검 입력 화면이 표시된다. | 미확인 |
| 6 | Studio Report Output | 보고서 산출 결과 입력 화면이 표시된다. | 미확인 |
| 7 | Studio Slide Deck Output | 슬라이드 산출 결과 입력 화면이 표시된다. | 미확인 |
| 8 | Presentation Checklist | 발표 준비 체크리스트 화면이 표시된다. | 미확인 |

추가 확인:

- Step 0에서 Prev를 눌러도 화면이 깨지지 않는다.
- Step 8에서 Next를 눌러도 화면이 깨지지 않는다.
- 새로고침 후 마지막 step이 유지되는지 확인한다.

---

## 6. 단계별 입력·저장 QA

각 단계에서 최소 입력 후 저장 버튼을 클릭한다. 저장 후 Debug JSON의 `savedState`에 해당 key가 누적되는지 확인한다.

| Step | 저장 key | 최소 입력 예시 | 기대 결과 | 결과 |
|---:|---|---|---|---|
| 0 | `J01-entry` | 이름: `테스트팀장`, 세션: `QA` | `savedState.J01-entry` 생성 | 미확인 |
| 1 | `J02-prompt` | 기본 프롬프트 복사 또는 저장 버튼 클릭 | `savedState.J02-prompt` 생성 | 미확인 |
| 2 | `J03-strategy-issue-review` | 전략 이슈 1개 입력 | `savedState.J03-strategy-issue-review` 생성 | 미확인 |
| 3 | `J04-source-check` | 체크 1개 선택, 위험 메모 입력 | `savedState.J04-source-check` 생성 | 미확인 |
| 4 | `J05-notebook-source-prep` | 생성 텍스트 확인 후 저장 | `savedState.J05-notebook-source-prep` 생성 | 미확인 |
| 5 | `J06-notebook-readiness-check` | readiness 결과 1줄 입력 | `savedState.J06-notebook-readiness-check` 생성 | 미확인 |
| 6 | `J07-studio-report` | 보고서 요약 1줄 입력 | `savedState.J07-studio-report` 생성 | 미확인 |
| 7 | `J08-studio-slides` | 슬라이드 요약 1줄 입력 | `savedState.J08-studio-slides` 생성 | 미확인 |
| 8 | `J09-presentation-checklist` | 체크 1개 선택, 한 줄 메시지 입력 | `savedState.J09-presentation-checklist` 생성 | 미확인 |

보류 기준:

- 저장 버튼 클릭 후 Debug JSON이 갱신되지 않는다.
- 저장 key가 누락된다.
- 저장 후 새로고침 시 입력값이 사라진다.
- v35 preview 저장 중 `c1bio_flow_*` key가 변경된다.

---

## 7. localStorage key 분리 확인

브라우저 개발자도구의 Application > Local Storage에서 아래 key들이 생성되는지 확인한다.

| key | 기대 결과 | 결과 |
|---|---|---|
| `c1bio_v35_preview_step` | 생성됨 | 미확인 |
| `c1bio_v35_preview_participant` | 생성됨 | 미확인 |
| `c1bio_v35_preview_state` | 생성됨 | 미확인 |
| `c1bio_v35_preview_strategy_notes` | 생성됨 | 미확인 |
| `c1bio_v35_preview_source_checks` | 생성됨 | 미확인 |
| `c1bio_v35_preview_source_risk` | 생성됨 | 미확인 |
| `c1bio_v35_preview_readiness_result` | 생성됨 | 미확인 |
| `c1bio_v35_preview_report_summary` | 생성됨 | 미확인 |
| `c1bio_v35_preview_report_link_or_file_name` | 생성됨 | 미확인 |
| `c1bio_v35_preview_slides_summary` | 생성됨 | 미확인 |
| `c1bio_v35_preview_slides_link_or_file_name` | 생성됨 | 미확인 |
| `c1bio_v35_preview_presentation_checks` | 생성됨 | 미확인 |
| `c1bio_v35_preview_presentation_one_liner` | 생성됨 | 미확인 |
| `c1bio_v35_preview_presentation_manager_request` | 생성됨 | 미확인 |

추가 확인:

- v35 preview 화면 조작 중 `c1bio_flow_*` key가 새로 생성되거나 변경되지 않는다.
- v35 preview 저장 초기화 기능이 있다면 `c1bio_v35_preview_*`만 삭제한다.
- v34 운영 화면의 저장값과 v35 preview 저장값이 섞이지 않는다.

---

## 8. 모바일/태블릿 QA

교육생 사용 환경을 고려해 모바일 또는 태블릿 화면을 확인한다.

| 번호 | 확인 항목 | 기대 결과 | 결과 |
|---:|---|---|---|
| 1 | 세로 화면 | 주요 버튼과 입력창이 화면 밖으로 밀리지 않는다. | 미확인 |
| 2 | 가로 화면 | 카드/패널이 과도하게 깨지지 않는다. | 미확인 |
| 3 | 터치 조작 | Next/Prev/저장 버튼이 손가락으로 누르기 쉽다. | 미확인 |
| 4 | 긴 텍스트 입력 | textarea 입력과 스크롤이 자연스럽다. | 미확인 |
| 5 | DebugPanel | 모바일에서 너무 많은 공간을 차지하지 않는다. | 미확인 |

보류 기준:

- 버튼이 화면 밖으로 나간다.
- 입력창이 작동하지 않는다.
- 저장 버튼이 보이지 않는다.
- step 이동이 모바일에서 불가능하다.

---

## 9. Console / Network QA

DevTools에서 다음을 확인한다.

| 영역 | 확인 내용 | 기대 결과 | 결과 |
|---|---|---|---|
| Console | runtime error | 없음 | 미확인 |
| Console | warning | 교육장 운영을 막는 수준 없음 | 미확인 |
| Network | HTML status | 200 또는 정상 redirect | 미확인 |
| Network | JS asset status | 200 | 미확인 |
| Network | 404 asset | 없음 | 미확인 |

보류 기준:

- React runtime error
- JS asset 404
- HTML 404
- 무한 redirect
- 저장 시 예외 발생

---

## 10. 합격 / 보류 / 전환 판단 기준

### 10-1. 합격 기준

아래 조건을 모두 만족해야 한다.

- `npm run smoke:v35` 통과
- `npm run smoke:v35:remote` 또는 `v35 Remote Smoke` workflow 통과
- `/journey.html`에서 v34 운영 화면 정상
- `/journey-v35-preview.html`에서 v35 preview 화면 정상
- Step 0~8 이동 정상
- J01~J09 저장 정상
- `c1bio_v35_preview_*`와 `c1bio_flow_*` key 분리 정상
- console에 실행을 막는 error 없음
- 모바일/태블릿에서 기본 조작 가능

### 10-2. 보류 기준

하나라도 해당하면 cutover를 보류한다.

- v34 운영 화면에 영향 발생
- `journey-active.tsx` 변경 필요 상황 발생
- v35 preview에서 흰 화면 또는 runtime error 발생
- Step 0~8 중 하나라도 렌더링 실패
- 저장 key 누락
- v35 preview가 `c1bio_flow_*` key를 사용하거나 변경
- Google Sheets 기존 저장 연동 이상
- Vercel 원격 smoke 실패

### 10-3. cutover 검토 가능 조건

아래 조건을 만족할 때만 다음 문서 기준으로 운영 전환을 검토한다.

```txt
docs/v35-cutover-gates.md
```

검토 가능 조건:

- 본 체크리스트 전 항목 합격
- `docs/v35-preview-smoke-result.md`에 실제 결과 반영 완료
- v34 rollback 기준 명확화
- v35 독립 실행 앱에서 운영 데이터 저장 방식 결정 완료

---

## 11. QA 결과 기록 양식

검증 후 아래 형식으로 `docs/v35-preview-smoke-result.md`에 반영한다.

```txt
확인 일시:
확인자:
확인 URL:
확인 브라우저:
확인 기기:

자동 smoke:
- smoke:v35:static:
- typecheck:
- build:
- smoke:v35:dist:
- smoke:v35:remote:

운영 v34:
- / redirect:
- /journey.html:
- Google Sheets 저장:

v35 preview:
- /journey-v35-preview.html:
- Step 0~8:
- J01~J09 저장:
- localStorage key 분리:
- console error:

판정:
- 전체 판정:
- cutover 가능 여부:
- 보류 사유:
- 다음 조치:
```
