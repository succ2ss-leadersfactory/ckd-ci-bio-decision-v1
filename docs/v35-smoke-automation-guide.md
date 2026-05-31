# v35 Smoke Automation Guide

이 문서는 v35 preview를 운영 전환하기 전, 자동 smoke check·remote smoke·브라우저 QA·readiness audit을 어떤 순서로 수행할지 정리한다.

핵심 원칙:

- v35 cutover는 자동 smoke 통과만으로 진행하지 않는다.
- v35 remote smoke, 브라우저 QA, console snippet 근거, readiness audit까지 모두 통과해야 cutover 검토가 가능하다.
- `src/full-flow-journey-v34.tsx`와 `src/journey-active.tsx`는 cutover 전까지 수정하지 않는다.
- `src/full-flow-journey-v35.tsx`의 마지막 `import './full-flow-journey-v34';`는 독립 실행 검증 전까지 유지한다.

---

## 1. 현재 사용 가능한 명령

현재 `package.json`에는 아래 명령이 등록되어 있다.

```bash
npm run smoke:v35:static
npm run typecheck
npm run typecheck:v35
npm run typecheck:full
npm run build
npm run smoke:v35:dist
npm run smoke:v35:remote
npm run preflight:v35:cutover
npm run smoke:v35
npm run audit:v35:readiness
```

각 명령의 역할은 다음과 같다.

| 명령 | 역할 |
|---|---|
| `npm run smoke:v35:static` | v35 preview 구조, entry, storage key, workflow, QA 문서 보호 검사 |
| `npm run typecheck` | 현재는 `typecheck:v35`로 위임 |
| `npm run typecheck:v35` | `tsconfig.v35-smoke.json` 기준 v35 scoped TypeScript 검사 |
| `npm run typecheck:full` | 전체 repository TypeScript 검사. archived 파일 오류가 있으므로 v35 smoke gate에는 사용하지 않음 |
| `npm run build` | Vite build |
| `npm run smoke:v35:dist` | `dist/journey.html`, `dist/journey-v35-preview.html`, `/assets/*.js` 산출물 검사 |
| `npm run smoke:v35:remote` | Vercel production URL 원격 검사 |
| `npm run preflight:v35:cutover` | cutover 전 보호장치 검사 |
| `npm run smoke:v35` | static + typecheck:v35 + build + dist + preflight 통합 검사 |
| `npm run audit:v35:readiness` | smoke result, browser QA result, console snippet 근거 최종 검사 |

---

## 2. 통합 smoke 실행 내용

`npm run smoke:v35`는 아래 순서로 실행된다.

```bash
npm run smoke:v35:static
npm run typecheck:v35
npm run build
npm run smoke:v35:dist
npm run preflight:v35:cutover
```

주의:

- v35 smoke에서는 전체 `tsc --noEmit`를 직접 실행하지 않는다.
- 전체 검사가 필요한 경우 별도 명령 `npm run typecheck:full`로 수행한다.
- v35 안정화 단계에서는 archived v26~v34 파일의 과거 TypeScript 오류가 v35 smoke를 막지 않도록 `tsconfig.v35-smoke.json`을 사용한다.

---

## 3. 정적 smoke 검사 범위

`npm run smoke:v35:static`은 다음 항목을 확인한다.

- 필수 파일 존재 여부
- `package.json` smoke/typecheck/readiness script 연결
- `journey.html` → `/src/journey-active.tsx` entry 연결
- `journey-v35-preview.html` → `/src/journey-v35-app-preview.tsx` entry 연결
- `vite.config.ts`의 `journeyV35Preview` build input 유지
- `vercel.json`의 `/` → `/journey.html` root redirect 유지
- `src/full-flow-journey-v35.tsx`의 v34 위임 import 유지
- v35 app의 `JourneyShell`, `renderV35PreviewStep`, `useV35PreviewState` 조립 구조 유지
- `V35_STORAGE_KEYS` 전체 key 유지
- v34 운영 key인 `c1bio_flow_`를 v35 preview config에서 사용하지 않는지 확인
- `V35_APP_STEPS` 9개 step id 유지
- `renderV35PreviewStep`의 `case 0:`~`case 8:` 유지
- `J01-entry`~`J09-presentation-checklist` 저장 key 유지
- `V35PreviewSmokePanel`과 `V35PreviewDebugPanel` 연결 유지
- `v35-preview-smoke-panel`, `v35-preview-debug-panel` test id 유지
- `docs/v35-browser-qa-result.md` 핵심 판정 항목 유지
- `docs/v35-browser-qa-console-snippet.md` 핵심 스니펫 항목 유지
- `.github/workflows/v35-smoke.yml`, `.github/workflows/v35-remote-smoke.yml`, `.github/workflows/v35-readiness-audit.yml` 유지

---

## 4. GitHub Actions 실행 순서

현재 사용하는 workflow는 3개다.

```txt
Actions → v35 Smoke → Run workflow
Actions → v35 Remote Smoke → Run workflow
Actions → v35 Readiness Audit → Run workflow
```

권장 실행 순서:

1. `v35 Smoke` 실행
2. `v35 Remote Smoke` 실행
3. 브라우저에서 `/journey.html` v34 회귀 확인
4. 브라우저에서 `/journey-v35-preview.html` v35 preview QA 수행
5. `docs/v35-browser-qa-result.md`와 `docs/v35-preview-smoke-result.md`에 실제 결과 기록
6. `v35 Readiness Audit` 실행

주의:

- `v35 Readiness Audit`은 브라우저 QA 결과가 문서에 기록되기 전에는 실패하는 것이 정상이다.
- `v35 Readiness Audit`이 초록색이 되어도 cutover를 자동 실행하지 않는다. cutover 검토 가능 상태를 의미할 뿐이다.

---

## 5. 로컬 확인 순서

배포 전 로컬에서 아래 순서로 확인한다.

```bash
npm install
npm run smoke:v35
npm run preview
```

`npm run preview` 실행 후 아래 경로를 확인한다.

```txt
http://localhost:4173/
http://localhost:4173/journey.html
http://localhost:4173/journey-v35-preview.html
```

브라우저 QA까지 로컬에서 사전 확인하려면 `docs/v35-browser-qa-console-snippet.md`의 콘솔 스니펫을 실행한다.

---

## 6. Vercel 배포 후 확인

production domain 기준으로 확인한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
https://ckd-ci-bio-decision-v1.vercel.app/journey.html
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

확인 결과는 아래 문서에 기록한다.

```txt
docs/v35-preview-smoke-result.md
docs/v35-browser-qa-result.md
```

브라우저 QA 저장/key 분리 근거는 아래 문서의 콘솔 스니펫을 사용해 기록한다.

```txt
docs/v35-browser-qa-console-snippet.md
```

---

## 7. Browser QA 필수 기록

브라우저 QA 후 반드시 아래 항목을 기록한다.

```txt
브라우저 QA 전체 판정: 통과
v34 운영 영향 여부: 영향 없음
v35 preview 독립 실행 여부: 통과
J01~J09 저장 여부: 모두 확인
localStorage key 분리 여부: 분리 확인
Console snippet 근거: 통과
cutover 검토 가능 여부: 검토 가능
```

Console snippet 근거에는 아래 결과가 남아야 한다.

```txt
missingPreviewKeys: none
missingSavedStateKeys: none
pass: true
```

---

## 8. Readiness Audit 기준

readiness audit은 아래 명령으로 실행한다.

```bash
npm run audit:v35:readiness
```

또는 GitHub Actions에서 실행한다.

```txt
Actions → v35 Readiness Audit → Run workflow
```

이 audit은 다음 문서를 확인한다.

```txt
docs/v35-preview-smoke-result.md
docs/v35-browser-qa-result.md
docs/v35-browser-qa-console-snippet.md
```

실패 기준:

- `미확인`, `대기`, `보류`, `실패`, `아직 불가`가 남아 있음
- `missingPreviewKeys`가 none/없음/0이 아님
- `missingSavedStateKeys`가 none/없음/0이 아님
- `pass`가 true/통과가 아님
- v35 운영 전환 가능 여부가 아직 불가로 남아 있음

---

## 9. 현재 판단

현재는 다음 상태다.

- `v35 Smoke` 통과 기록 있음
- `v35 Remote Smoke` 통과 기록 있음
- 브라우저 QA 결과는 아직 미기록
- console snippet 결과는 아직 미기록
- `v35 Readiness Audit`은 아직 실패 예상 상태
- cutover는 아직 불가

다음 실무 조치는 브라우저 QA 수행과 결과 문서화다.
