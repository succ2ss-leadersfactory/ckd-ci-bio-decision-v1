# C1바이오 영업팀장 AI 리더십 Development Lab

종근당홀딩스 영업직군 팀장 대상 8시간 교육에서 사용하는 React/Vite 기반 교육장 실습 웹앱입니다.

이 앱은 AI 답변 생성기가 아니라, 영업팀장이 가상 제약영업 상황에서 자신의 판단을 기록하고, 외부 무료 AI 답변을 감별·수정하며, 최종 실행계획을 남기는 Development Lab 도구입니다.

## Current Version

`2.0.0-content-rich`

이번 v2에는 다음 실습 콘텐츠가 반영되어 있습니다.

- C1바이오 영업2본부 수도권중부영업팀 세계관
- 팀원 6명 페르소나와 MR 활동·성과 Dashboard
- 고객군 A~D 반응 신호와 후속조치 리스크
- AI 안전선 카드 6개와 해설
- 좋은 질문 만들기 실습
- Dashboard 해석과 Gap 가설 선택
- 팀 목표 → MR별 2주 실행행동 Map
- 상사/본사/팀원/동료 팀장 이해관계자 메시지 번역
- 성과대화 프롬프트 생성, AI 답변 붙여넣기, 감별 기준 8개
- 고객관점 콜플랜 실행 요청문
- 본사 요청 Brief 3개 → 현장 실행 번역
- MR 1on1 코칭 Lab
- 7일 실행계획, 30일 점검 기준, 전체 결과 요약 복사

## v35 검증 상태

v35 preview는 운영 전환 전 검증 단계를 통과했고, 현재 선택 A 기준으로 preview 안정 상태를 유지합니다. 현재 cutover는 진행하지 않습니다.

현재 확인 상태:

```txt
v35 Smoke: 통과
v35 Remote Smoke: 통과
Browser QA: 통과
Console snippet: 통과
v35 Readiness Audit: 통과
Selected decision: A. Preview 안정 상태 유지
Cutover status: 검토 가능, 실행 전
Operating route: v34 유지
Preview route: v35 검증 완료 상태 유지
```

먼저 확인할 문서:

```txt
docs/v35-validation-index.md
docs/v35-cutover-decision.md
```

핵심 실행 순서:

```txt
1. Actions → v35 Smoke → Run workflow
2. Actions → v35 Remote Smoke → Run workflow
3. docs/v35-browser-qa-runbook.md 기준 브라우저 QA
4. docs/v35-browser-qa-result.md 결과 기록
5. docs/v35-preview-smoke-result.md 최종 결과 반영
6. Actions → v35 Readiness Audit → Run workflow
7. cutover 실행 여부 별도 결정
8. 현재 결정은 A. Preview 안정 상태 유지
```

cutover 금지 기준:

- 브라우저 QA 미기록
- Console snippet 근거 미기록
- `v35 Readiness Audit` 실패
- `src/full-flow-journey-v35.tsx`의 v34 위임 import 제거 전 gate 미통과
- cutover 실행 승인 전 임의 운영 전환
- 선택 B 승인 전 운영 경로 전환

## Routes

- `/` 참여자 앱
- `/?view=instructor` 강사용 대시보드
- `/?view=check` 사전점검 화면
- `/journey.html` v34 보호 운영 경로
- `/journey-v35-preview.html` v35 preview 검증 경로
- `/journey-v39-preview.html` v39 5~13단계 연결 흐름 검증 경로

## Stack

React, Vite, TypeScript, Tailwind CSS, localStorage, Google Sheets + Apps Script 선택 연동 구조입니다.

## Local development

```bash
npm install
npm run dev
npm run typecheck
npm run audit:linebreaks
npm run smoke:parser
npm run build
```

v35 검증용 명령:

```bash
npm run smoke:v35
npm run smoke:v35:remote
npm run audit:v35:readiness
```

v39 검증용 명령:

```bash
npm run smoke:v39
npm run smoke:v39:remote
```

v39 원격 검증은 GitHub Actions → `v39 Remote Smoke`에서도 수동 실행할 수 있습니다. 결과는 `docs/v39-remote-smoke-result.md`에 기록합니다.

## Vercel

- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Environment Variable

Google Sheets 연동 시 Vercel에 아래 환경변수를 등록합니다.

```bash
VITE_GOOGLE_SCRIPT_WEBAPP_URL=<Apps Script Web App URL>
```

환경변수가 없으면 앱은 localStorage 모드로 정상 작동합니다.

## Google Sheets 연동

1. Google Sheets 새 파일을 만듭니다.
2. `확장 프로그램 → Apps Script`를 엽니다.
3. `apps-script/Code.gs` 내용을 붙여넣습니다.
4. `setupSheetsC1Bio`를 실행합니다.
5. Web App으로 배포합니다.
6. Web App URL을 Vercel 환경변수 `VITE_GOOGLE_SCRIPT_WEBAPP_URL`에 등록합니다.
7. Vercel에서 Redeploy합니다.
8. `/?view=check`에서 `ping → setupSheetsC1Bio → saveParticipant → saveResponse → getDashboardData` 순서로 확인합니다.

## 운영 문서

- `docs/v35-validation-index.md` v35 검증 문서 인덱스
- `docs/v35-cutover-decision.md` v35 cutover 의사결정 기록
- `docs/v35-smoke-automation-guide.md` v35 smoke 자동화 가이드
- `docs/v35-browser-qa-runbook.md` v35 브라우저 QA 실행 절차서
- `docs/v35-browser-qa-result.md` v35 브라우저 QA 결과 기록지
- `docs/v35-browser-qa-console-snippet.md` v35 브라우저 QA 콘솔 스니펫
- `docs/v35-cutover-gates.md` v35 cutover gate 기준
- `docs/v39-5-13-flow-qa-checklist.md` v39 5~13단계 연결 흐름 QA 체크리스트
- `docs/v39-browser-qa-runbook.md` v39 브라우저 수동 QA 실행 절차서
- `docs/v39-browser-qa-result.md` v39 브라우저 수동 QA 결과 기록지
- `docs/v39-browser-qa-console-snippet.md` v39 브라우저 QA 콘솔 스니펫
- `docs/v39-remote-smoke-result.md` v39 Remote Smoke 결과 기록지
- `docs/DEPLOYMENT_RUNBOOK.md` 배포 런북
- `docs/pilot-qa-checklist.md` 파일럿 전 QA 체크리스트
- `docs/manual-test-script.md` 수동 테스트 스크립트
- `docs/classroom-final-ops-checklist.md` 교육장 최종 운영 체크리스트
- `docs/facilitator-day-script.md` 강사용 당일 진행 스크립트
- `docs/pilot-readiness-report.md` 파일럿 준비 상태 보고서 템플릿

## Pilot Readiness 기준

교육장 파일럿 전 최소 통과 기준은 다음입니다.

- GitHub Actions CI 통과
- Vercel Production 배포 성공
- `/`, `/?view=instructor`, `/?view=check` 접속 성공
- `/?view=check`에서 Google Sheets 연동 5개 테스트 성공
- 참여자 플로우 12개 화면 이동 가능
- 결과 요약 복사 가능
- 강사용 대시보드에서 응답 확인 가능
- 실제 병원명, 의료진명, 제품명, 매출·처방 정보 입력 금지 문구 확인
