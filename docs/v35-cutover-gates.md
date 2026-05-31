# v35 Cutover Gates

이 문서는 v35 preview를 운영 경로로 전환하기 전에 반드시 통과해야 하는 기준을 정리한다.

v35 cutover의 핵심 목표는 다음이다.

- 기존 안정 버전 v34를 깨뜨리지 않는다.
- v35 preview 독립 실행 검증이 끝나기 전까지 운영 경로는 v34로 유지한다.
- 자동 smoke, 원격 smoke, 브라우저 QA, 저장 key 분리 검증이 모두 통과된 뒤에만 전환을 검토한다.
- 전환 후 문제가 생기면 즉시 v34 위임 구조로 되돌릴 수 있어야 한다.

---

## 0. 현재 절대 원칙

| 원칙 | 기준 |
|---|---|
| v34 보호 | `src/full-flow-journey-v34.tsx`는 수정하지 않는다. |
| 운영 entry 보호 | `src/journey-active.tsx`는 cutover 직전까지 수정하지 않는다. |
| v34 위임 유지 | `src/full-flow-journey-v35.tsx`의 마지막 `import './full-flow-journey-v34';`는 독립 실행 검증 전까지 유지한다. |
| preview 격리 | `/journey-v35-preview.html`은 운영 화면과 별도로 검증한다. |
| 저장 key 분리 | v35 preview는 `c1bio_v35_preview_*`만 사용하고 `c1bio_flow_*`를 건드리지 않는다. |
| Google Sheets 보류 | Google Sheets 저장 연동은 v35 preview 검증 후 별도 단계에서 진행한다. |

---

## 1. Gate 1 — 코드 구조 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| v35 preview app 파일 존재 | `src/full-flow-journey-v35-app.tsx` 존재 | 완료 |
| preview config 분리 | `src/journey-v35-preview-config.ts` 존재 | 완료 |
| preview state hook 분리 | `src/journey-v35-preview-state.ts` 존재 | 완료 |
| preview router 분리 | `src/journey-v35-preview-router.tsx` 존재 | 완료 |
| preview step wrapper 분리 | `src/journey-v35-preview-steps.tsx` 존재 | 완료 |
| preview panel 분리 | `src/journey-v35-preview-panels.tsx` 존재 | 완료 |
| preview type 분리 | `src/journey-v35-preview-types.ts` 존재 | 완료 |
| preview HTML build input 등록 | `vite.config.ts`에 `journeyV35Preview` 등록 | 완료 |
| 루트 redirect 설정 | `vercel.json`의 `/` → `/journey.html` 유지 | 완료 |
| v35 smoke script 등록 | `package.json`에 `smoke:v35` 등록 | 완료 |
| dist smoke script 등록 | `package.json`에 `smoke:v35:dist` 등록 | 완료 |
| remote smoke script 등록 | `package.json`에 `smoke:v35:remote` 등록 | 완료 |
| 수동 remote smoke workflow | `.github/workflows/v35-remote-smoke.yml` 존재 | 완료 |
| smoke 자동화 가이드 문서화 | `docs/v35-smoke-automation-guide.md` 존재 | 완료 |
| preview QA 체크리스트 문서화 | `docs/v35-preview-checklist.md` 최신화 | 완료 |
| 배포 URL 가이드 문서화 | `docs/v35-deployment-url-guide.md` 최신화 | 완료 |

통과 조건:

```bash
npm run smoke:v35:static
```

보류 기준:

- 필수 파일 누락
- v34 위임 import 누락
- preview router step 누락
- `c1bio_flow_*` key가 v35 preview config에 섞임
- `journey-active.tsx`가 예상과 다르게 변경됨

---

## 2. Gate 2 — 자동 build smoke 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| 정적 구조 검사 | `npm run smoke:v35:static` 통과 | 대기 |
| TypeScript 검사 | `npm run typecheck` 통과 | 대기 |
| Vite build | `npm run build` 통과 | 대기 |
| dist 산출물 검사 | `npm run smoke:v35:dist` 통과 | 대기 |
| 통합 smoke | `npm run smoke:v35` 통과 | 대기 |

통합 실행:

```bash
npm run smoke:v35
```

`smoke:v35`가 확인해야 하는 것:

- static smoke 통과
- typecheck 통과
- build 통과
- `dist/journey.html` 존재
- `dist/journey-v35-preview.html` 존재
- production HTML이 `/src/...` dev entry를 직접 참조하지 않음
- production HTML에 `/assets/*.js` module script 존재

보류 기준:

- TypeScript error 발생
- build 실패
- `dist/journey-v35-preview.html` 누락
- `dist/journey.html` 누락
- dist HTML이 `/src/...` entry를 직접 참조

---

## 3. Gate 3 — GitHub Actions 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| v35 Smoke workflow | `Actions → v35 Smoke` 통과 | 대기 |
| v35 Remote Smoke workflow | `Actions → v35 Remote Smoke` 통과 | 대기 |

실행 경로:

```txt
Actions → v35 Smoke → Run workflow
Actions → v35 Remote Smoke → Run workflow
```

v35 Smoke workflow 확인 항목:

- dependency install
- static smoke
- typecheck
- build
- dist smoke
- integrated smoke

v35 Remote Smoke workflow 확인 항목:

- production domain fetch
- `/` → `/journey.html` redirect
- `/journey.html` HTML 응답
- `/journey-v35-preview.html` HTML 응답
- `/assets/*.js` module script 확인
- `/src/...` dev entry 미사용 확인

보류 기준:

- workflow 실행 실패
- workflow가 생성되지 않음
- remote smoke가 Vercel 최신 배포를 확인하지 못함
- production domain이 이전 배포본을 가리킴

---

## 4. Gate 4 — 운영 v34 보호 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| `/` 루트 접속 | `/journey.html`로 redirect됨 | 대기 |
| `/journey.html` 정상 표시 | 기존 v34 화면이 정상 동작 | 대기 |
| v34 주요 흐름 | 기존 화면 이동과 입력이 깨지지 않음 | 대기 |
| 기존 localStorage 영향 없음 | `c1bio_flow_*` key가 유지됨 | 대기 |
| 기존 Google Sheets 저장 유지 | 기존 저장 흐름이 깨지지 않음 | 대기 |
| console error 없음 | 운영 경로 console error 없음 | 대기 |
| 모바일/태블릿 기본 사용성 | 버튼과 입력창 조작 가능 | 대기 |

보류 기준:

- `/journey.html`이 열리지 않음
- v34 화면 대신 v35 preview가 열림
- 기존 저장 연동이 깨짐
- `c1bio_flow_*` key가 손상됨
- 운영 console에 runtime error 발생

---

## 5. Gate 5 — v35 preview 화면 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| `/journey-v35-preview.html` 정상 표시 | preview shell 표시 | 대기 |
| SmokePanel 표시 | `v35 Preview Smoke Check` 패널 표시 | 대기 |
| DebugPanel 표시 | 저장 상태 확인 가능 | 대기 |
| Step 0~8 이동 | Next/Prev 이동 정상 | 대기 |
| Step 경계 처리 | Step 0 Prev, Step 8 Next에서 화면 깨짐 없음 | 대기 |
| 새로고침 복원 | 마지막 step 또는 저장 상태 유지 | 대기 |
| console error 없음 | preview 경로 runtime error 없음 | 대기 |
| 모바일/태블릿 사용성 | 주요 입력과 저장 버튼 사용 가능 | 대기 |

Step 목록:

| Step | 화면 |
|---:|---|
| 0 | 입장 |
| 1 | 좋은 질문 만들기 |
| 2 | 전략 이슈 검토 |
| 3 | Source Check |
| 4 | NotebookLM Source Prep |
| 5 | NotebookLM Readiness Check |
| 6 | Studio Report Output |
| 7 | Studio Slide Deck Output |
| 8 | Presentation Checklist |

보류 기준:

- 흰 화면
- SmokePanel 또는 DebugPanel 미표시
- Step 중 하나라도 렌더링 실패
- Next/Prev 작동 실패
- 새로고침 후 상태 손실
- preview console runtime error

---

## 6. Gate 6 — v35 저장 흐름 검증

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
| 새로고침 후 저장값 유지 | 입력값과 savedState 유지 | 대기 |

보류 기준:

- 저장 버튼 클릭 후 Debug JSON이 갱신되지 않음
- J01~J09 중 하나라도 누락
- 저장 후 새로고침 시 데이터 손실
- 저장 중 runtime error 발생

---

## 7. Gate 7 — localStorage key 분리 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| v35 step key | `c1bio_v35_preview_step` 생성 | 대기 |
| v35 participant key | `c1bio_v35_preview_participant` 생성 | 대기 |
| v35 saved state key | `c1bio_v35_preview_state` 생성 | 대기 |
| v35 단계별 key | `c1bio_v35_preview_*` key 생성 | 대기 |
| v34 key 보호 | `c1bio_flow_*` 생성·변경 없음 | 대기 |
| preview reset | `c1bio_v35_preview_*`만 삭제 | 대기 |

반드시 확인할 v35 preview key:

```txt
c1bio_v35_preview_step
c1bio_v35_preview_participant
c1bio_v35_preview_state
c1bio_v35_preview_strategy_notes
c1bio_v35_preview_source_checks
c1bio_v35_preview_source_risk
c1bio_v35_preview_readiness_result
c1bio_v35_preview_report_summary
c1bio_v35_preview_report_link_or_file_name
c1bio_v35_preview_slides_summary
c1bio_v35_preview_slides_link_or_file_name
c1bio_v35_preview_presentation_checks
c1bio_v35_preview_presentation_one_liner
c1bio_v35_preview_presentation_manager_request
```

보류 기준:

- v35 preview가 `c1bio_flow_*` key를 사용
- v35 preview 저장 중 `c1bio_flow_*` 값 변경
- preview reset이 v34 key까지 삭제
- v35 key가 생성되지 않음

---

## 8. Gate 8 — 결과 문서화 검증

| 기준 | 통과 조건 | 상태 |
|---|---|---|
| smoke 결과 기록 | `docs/v35-preview-smoke-result.md`에 실제 결과 반영 | 대기 |
| QA 실행 정보 기록 | 확인 일시, 확인자, URL, 브라우저, 기기 기록 | 대기 |
| 실패 이슈 기록 | 발견 이슈와 조치 방향 기록 | 대기 |
| 전환 판정 기록 | cutover 가능 여부 명시 | 대기 |

보류 기준:

- 실제 결과 없이 추정으로 통과 처리
- 브라우저 QA 미기록
- 실패 이슈를 문서화하지 않음
- 원격 smoke 미확인 상태에서 전환 진행

---

## 9. Cutover 가능 판정

아래 조건이 모두 충족되기 전에는 `full-flow-journey-v35.tsx`에서 v34 import를 제거하지 않는다.

- `npm run smoke:v35`가 통과된다.
- `npm run smoke:v35:remote` 또는 `v35 Remote Smoke` workflow가 통과된다.
- 루트 경로 `/`가 `/journey.html`로 정상 redirect된다.
- 운영 경로 `/journey.html`이 정상이다.
- 기존 v34 Google Sheets 저장 흐름이 정상이다.
- preview 경로 `/journey-v35-preview.html`이 정상이다.
- Step 0~8이 모두 이동된다.
- J01~J09 저장이 모두 확인된다.
- preview 저장 key가 운영 저장 key와 분리되어 있다.
- console error가 없다.
- 모바일 또는 태블릿 화면에서 주요 입력과 버튼이 사용 가능하다.
- `docs/v35-preview-smoke-result.md`에 실제 결과가 기록되어 있다.

판정:

| 조건 | 의미 |
|---|---|
| 모든 gate 통과 | cutover 검토 가능 |
| 하나라도 대기 | cutover 불가 |
| 하나라도 실패 | cutover 보류 및 이슈 수정 |
| v34 영향 발생 | 즉시 rollback 우선 |

---

## 10. Cutover 실행 순서

모든 gate 통과 후에만 아래 순서를 검토한다.

1. `docs/v35-preview-smoke-result.md`에 최종 통과 결과를 기록한다.
2. rollback 기준과 rollback 커밋 후보를 명확히 적는다.
3. `src/full-flow-journey-v35.tsx`에서 v34 위임 import 제거 여부를 검토한다.
4. v35 app을 운영 경로에서 실행하도록 최소 변경한다.
5. `src/journey-active.tsx`는 가능한 마지막까지 유지한다.
6. commit은 단일 목적의 작은 단위로 만든다.
7. Vercel 배포 완료 후 즉시 `/journey.html` 회귀 검증을 진행한다.
8. 문제가 있으면 즉시 v34 위임 구조로 되돌린다.

권장 cutover commit 원칙:

- 한 commit에는 한 가지 목적만 포함한다.
- 코드 변경과 문서 변경을 과도하게 섞지 않는다.
- v34 파일은 수정하지 않는다.
- 기존 stable commit을 rollback 기준으로 기록한다.

---

## 11. Rollback 기준

cutover 후 아래 문제가 발생하면 즉시 rollback한다.

| 문제 | 조치 |
|---|---|
| `/journey.html` 흰 화면 | v34 위임 import 복구 |
| v35 runtime error | v34 위임 import 복구 |
| 기존 v34 저장 흐름 손상 | v34 위임 import 복구 및 저장 영향 확인 |
| Google Sheets 저장 실패 | v34 위임 import 복구 |
| Step 이동 불가 | v34 위임 import 복구 |
| 교육장 운영 중 사용 불가 | production을 직전 stable 배포로 되돌림 |

기본 rollback 방식:

```ts
import './full-flow-journey-v34';
```

위 위임 import를 `src/full-flow-journey-v35.tsx` 마지막에 복구한다.

rollback 후 확인:

- `/journey.html` 운영 화면 정상
- Google Sheets 저장 정상
- console error 없음
- v35 preview URL은 필요 시 유지하되 운영 경로와 분리

---

## 12. 금지 작업

아래 작업은 모든 gate 통과 전까지 금지한다.

- v35 preview 검증 전 `src/full-flow-journey-v34.tsx` 수정 금지
- v35 preview 검증 전 `src/journey-active.tsx` 수정 금지
- v35 preview 검증 전 `import './full-flow-journey-v34';` 제거 금지
- Google Sheets 연동을 v35 preview 검증 전에 추가 금지
- 실제 QA 결과 없이 문서상 통과 처리 금지
- Vercel remote smoke 실패 상태에서 cutover 금지
- v35 preview가 `c1bio_flow_*` key를 사용하도록 변경 금지

---

## 13. 현재 판정

현재 기준 판정:

```txt
Cutover 불가 — 실행 검증 대기
```

이유:

- `npm run smoke:v35` 실제 통과 결과 미기록
- `v35 Remote Smoke` 실제 통과 결과 미기록
- 브라우저 QA 결과 미기록
- Step 0~8 실제 이동 결과 미기록
- J01~J09 저장 결과 미기록
- v34 운영 화면 회귀 결과 미기록

다음 조치:

1. `Actions → v35 Smoke → Run workflow`
2. `Actions → v35 Remote Smoke → Run workflow`
3. 브라우저에서 `/journey.html` v34 회귀 확인
4. 브라우저에서 `/journey-v35-preview.html` v35 preview QA 수행
5. `docs/v35-preview-smoke-result.md`에 실제 결과 반영
6. 모든 gate 통과 후 cutover 여부 재판정
