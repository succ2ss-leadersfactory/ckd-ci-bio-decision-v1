# v35 Cutover Gates

이 문서는 v35 preview를 운영 경로로 전환하기 전에 반드시 통과해야 하는 기준을 정리한다.

## 현재 원칙

- `src/full-flow-journey-v34.tsx`는 수정하지 않는다.
- `src/journey-active.tsx`는 아직 수정하지 않는다.
- `src/full-flow-journey-v35.tsx`의 마지막 `import './full-flow-journey-v34';`는 v35 독립 실행 검증 전까지 유지한다.
- Google Sheets 저장 연동은 v35 preview 검증 후 별도 단계에서 진행한다.

## Gate 1. 코드 구조 검증

| 기준 | 상태 | 메모 |
|---|---|---|
| v35 preview app 파일 존재 | 완료 | `src/full-flow-journey-v35-app.tsx` |
| preview config 분리 | 완료 | `src/journey-v35-preview-config.ts` |
| preview state hook 분리 | 완료 | `src/journey-v35-preview-state.ts` |
| preview router 분리 | 완료 | `src/journey-v35-preview-router.tsx` |
| preview step wrapper 분리 | 완료 | `src/journey-v35-preview-steps.tsx` |
| preview panel 분리 | 완료 | `src/journey-v35-preview-panels.tsx` |
| preview type 분리 | 완료 | `src/journey-v35-preview-types.ts` |
| preview HTML build input 등록 | 완료 | `vite.config.ts`의 `journeyV35Preview` |
| 루트 redirect 설정 | 완료 | `vercel.json`의 `/` → `/journey.html` |
| 배포 URL 가이드 문서화 | 완료 | `docs/v35-deployment-url-guide.md` |
| v35 smoke script 등록 | 완료 | `package.json`의 `smoke:v35` |
| smoke 자동화 가이드 문서화 | 완료 | `docs/v35-smoke-automation-guide.md` |

## Gate 2. 운영 v34 보호 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| `/` 루트 접속 | `/journey.html`로 redirect됨 | 대기 |
| `/journey.html` 정상 표시 | 기존 v34 화면이 정상 동작 | 대기 |
| 기존 localStorage 영향 없음 | `c1bio_flow_*` key가 유지됨 | 대기 |
| 기존 Google Sheets 저장 유지 | 기존 저장 흐름이 깨지지 않음 | 대기 |
| console error 없음 | 운영 경로 console error 없음 | 대기 |

## Gate 3. v35 preview 화면 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| `/journey-v35-preview.html` 정상 표시 | preview shell 표시 | 대기 |
| Step 0~8 이동 | Next/Prev 이동 정상 | 대기 |
| Debug JSON 표시 | 저장 상태 표시 정상 | 대기 |
| preview reset 동작 | preview key만 삭제 | 대기 |
| console error 없음 | preview 경로 console error 없음 | 대기 |

## Gate 4. v35 저장 흐름 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| `J01-entry` 저장 | savedState 반영 | 대기 |
| `J02-prompt` 저장 | savedState 반영 | 대기 |
| `J03-strategy-issue-review` 저장 | savedState 반영 | 대기 |
| `J04-source-check` 저장 | savedState 반영 | 대기 |
| `J05-notebook-source-prep` 저장 | savedState 반영 | 대기 |
| `J06-notebook-readiness-check` 저장 | savedState 반영 | 대기 |
| `J07-studio-report` 저장 | savedState 반영 | 대기 |
| `J08-studio-slides` 저장 | savedState 반영 | 대기 |
| `J09-presentation-checklist` 저장 | savedState 반영 | 대기 |

## Gate 5. 전환 가능 판정

아래 조건이 모두 충족되기 전에는 `full-flow-journey-v35.tsx`에서 v34 import를 제거하지 않는다.

- `npm run smoke:v35`가 통과된다.
- 루트 경로 `/`가 `/journey.html`로 정상 redirect된다.
- 운영 경로 `/journey.html`이 정상이다.
- preview 경로 `/journey-v35-preview.html`이 정상이다.
- Step 0~8이 모두 이동된다.
- J01~J09 저장이 모두 확인된다.
- preview 저장 key가 운영 저장 key와 분리되어 있다.
- console error가 없다.
- 모바일 또는 태블릿 화면에서 주요 입력과 버튼이 사용 가능하다.

## Gate 6. 전환 순서

1. `npm run smoke:v35`를 실행한다.
2. `docs/v35-preview-smoke-result.md`에 실제 확인 결과를 기록한다.
3. 발견 이슈를 수정한다.
4. preview 재검증을 통과한다.
5. `src/full-flow-journey-v35.tsx`에서 v35 app 실행 전환을 검토한다.
6. `journey-active.tsx`는 마지막 단계까지 유지한다.
7. 전환 후 즉시 `/journey.html`에서 회귀 검증을 진행한다.

## 금지 작업

- v35 preview 검증 전 `src/full-flow-journey-v34.tsx` 수정 금지
- v35 preview 검증 전 `src/journey-active.tsx` 수정 금지
- v35 preview 검증 전 `import './full-flow-journey-v34';` 제거 금지
- Google Sheets 연동을 v35 preview 검증 전에 추가 금지
