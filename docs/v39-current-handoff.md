# v39 Current Handoff Note

본 문서는 「종근당/C1바이오 영업팀장 AI 리더십 Lab Journey 웹앱」 v39 preview 작업의 최신 인수인계 메모다.

## 1. 최신 안정 기준

문서 업데이트 기준 커밋:

```txt
942a34379f98a42224f2fe054779df5d3ea84b04
```

커밋 메시지:

```txt
Reference v39 current handoff in README
```

최신 확인 결과:

```txt
C1Bio MVP CI: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v39 Smoke: success
v40-lite Smoke: success
```

v39 Smoke 핵심 단계:

```txt
Run v39 static smoke check: success
Run v39 scoped TypeScript check: success
Build Vite app: success
Run integrated v39 smoke check: success
```

## 2. 작업 기준

저장소:

```txt
succ2ss-leadersfactory/ckd-ci-bio-decision-v1
```

작업 브랜치:

```txt
feature/v37-preview-shell
```

v39 preview route:

```txt
/journey-v39-preview.html
```

운영 route:

```txt
/journey.html
```

## 3. 반드시 보호할 파일과 route

아래 파일과 route는 수정하지 않는다.

```txt
journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

## 4. v39 제품 정체성

이 웹앱은 AI 답변 생성기가 아니다.

종근당/C1바이오 영업팀장이 자신의 현업 고민을 AI를 활용해 구조화하고, 관리 지표·고객 Data·팀원 역할·실행 대화·컴플라이언스 안전선·최종 실행 카드로 발전시키는 교육용 Lab Journey다.

핵심 메시지:

```txt
AI 없이도 할 수 있다.
그러나 AI를 활용하면 더 빠르게, 더 넓게, 더 구조적으로 정리할 수 있다.
```

AI는 답을 대신 정하는 도구가 아니라, 팀장의 판단을 정리하고 넓히는 도구다.

## 5. 5~13단계 연결 흐름

```txt
5단계 지표
→ 6단계 증거
→ 7단계 대응군/점검 조건
→ 8단계 팀원 역할
→ 9단계 실행 대화
→ 10단계 AI 실행계획 초안
→ 11단계 안전 문장
→ 12단계 최종 실행 카드
→ 13단계 강사용 토의
```

단계별 역할:

| 단계 | 역할 |
|---:|---|
| 5 | 우리 팀 관리 지표 선정 |
| 6 | 고객 Data에서 확인할 증거 정리 |
| 7 | 고객군 후보/점검 조건별 2주 대응 방향 정리 |
| 8 | 팀원별 실행 보완 Map 작성 |
| 9 | 팀원이 받아들일 수 있는 실행 대화 첫 문장 작성 |
| 10 | 5~9단계 결과를 AI 실행계획 프롬프트로 통합 |
| 11 | AI 실행계획 초안의 위험 표현을 안전 문장으로 수정 |
| 12 | 최종 2주 실행 카드 작성 |
| 13 | 강사용 판단 근거·보완 지점·토의거리 정리 |

## 6. 주요 보완 완료 사항

### 6단계

- 기존 “확인 신호” 표현을 “고객 Data 증거 카드” 기준으로 정리했다.
- AI 결과 붙여넣기 후 `AI 결과 1차 분리 정리`가 표시되도록 했다.
- `기회로 볼 수 있는 경우` 섹션이 정상 분리되도록 보완했다.

### 7단계

- 6단계 고객 Data 증거가 고객군이 아니라 판단 재료임을 명확히 했다.
- F는 고객군이 아니라 `안전선 점검 조건`으로 정리했다.
- AI 2주 실행 Map 초안 기능을 추가했다.
- 7단계 AI 결과 1차 분리 정리 기능을 추가했다.

### 8단계

- 7단계 고객군별 2주 대응 방향을 팀원 역할 보완으로 연결했다.
- 역할 미션이 비어 있어도 담당 고객군, 콜플랜 준비물, 팀장 지원 포인트, 리스크 안전선 중 하나라도 있으면 이후 단계에서 반영되도록 기준을 맞췄다.

### 9단계

- 8단계 역할 보완 결과를 실제 대화 재료 카드로 표시했다.
- 실행 지시가 아니라 실행 대화라는 메시지를 강화했다.

### 10단계

- 5~9단계 결과를 AI 실행계획 프롬프트로 통합했다.
- 8단계 역할 미션 없이도 부분 입력이 프롬프트에 반영되도록 했다.

### 11단계

- 10단계 AI 실행계획 초안이 없어도 위험 메모나 점검 초점이 있으면 점검 대상으로 반영되도록 했다.
- 제약영업 컴플라이언스와 팀원 실행 대화 리스크를 함께 점검하도록 했다.

### 12단계

- 11단계 안전 문장, 최종 체크리스트, 최종 카드 메모가 최종 카드 안전 기준으로 이어지도록 했다.
- 8단계 부분 입력도 역할 반영 수에 포함되도록 했다.

### 13단계

- 12단계 최종 카드를 판단 근거·보완 지점·토의거리로 나누어 강사용 디브리핑 자료로 전환했다.
- `updatedAt`이 없어도 필드 값이 있으면 최종 카드 맥락으로 판단하도록 했다.

## 7. v39 검증/QA 문서

핵심 문서:

```txt
docs/v39-5-13-flow-qa-checklist.md
docs/v39-browser-qa-runbook.md
docs/v39-browser-qa-result.md
docs/v39-browser-qa-console-snippet.md
docs/v39-remote-smoke-result.md
docs/v39-current-handoff.md
```

## 8. v39 Remote Smoke 상태

추가된 명령:

```bash
npm run smoke:v39:remote
```

추가된 workflow:

```txt
.github/workflows/v39-remote-smoke.yml
```

실행 위치:

```txt
Actions → v39 Remote Smoke → Run workflow
```

기본 base URL:

```txt
https://ckd-ci-bio-decision-v1.vercel.app
```

현재 상태:

```txt
workflow 및 summary 구조 추가 완료
JSON 리포트 생성 경로 추가 완료
Step Summary 표 구조 반영 완료
실제 workflow_dispatch 수동 실행은 아직 미실행
```

실행 후 기록 문서:

```txt
docs/v39-remote-smoke-result.md
```

## 9. 남은 필수 확인

아래는 아직 수동 확인이 필요하다.

1. GitHub Actions에서 `v39 Remote Smoke` 수동 실행
2. Step Summary의 `pass`, `failureCount`, route별 `missingMarkers`, `forbiddenMarkers`, `errors` 확인
3. 결과를 `docs/v39-remote-smoke-result.md`에 기록
4. `/journey-v39-preview.html` 브라우저 수동 QA 수행
5. `docs/v39-browser-qa-console-snippet.md` 실행
6. 결과를 `docs/v39-browser-qa-result.md`에 기록

## 10. 다음 작업 추천

우선순위 1:

```txt
Actions → v39 Remote Smoke → Run workflow
```

우선순위 2:

```txt
/journey-v39-preview.html 브라우저 수동 QA
```

우선순위 3:

```txt
v39 Browser QA Result 문서 업데이트
```

## 11. 주의 사항

- 운영 route `/journey.html`은 건드리지 않는다.
- v39 preview 작업은 `/journey-v39-preview.html` 기준으로만 진행한다.
- 참여자 화면에서 `CRM 기록`, `CRM Data`, `CRM 분석`, `CRM상 고객 등급`, `CRM 기록 품질` 표현은 피한다.
- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보 입력 금지 안내를 유지한다.
- 고객을 평가·등급화하거나 처방 가능성을 단정하는 표현을 피한다.
- AI는 정답이 아니라 팀장 판단을 넓히고 정리하는 도구로 유지한다.
