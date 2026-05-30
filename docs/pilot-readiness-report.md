# C1바이오 AI 리더십 Lab 파일럿 준비 상태 보고서

## 1. 현재 버전

- 앱 버전: `2.0.0-content-rich`
- 저장소: `succ2ss-leadersfactory/ckd-ci-bio-decision-v1`
- 앱 유형: React/Vite 기반 교육장 실습 웹앱
- 저장 방식: localStorage 기본 + Google Sheets/Apps Script 선택 연동
- AI 방식: 외부 무료 AI 복사·붙여넣기 방식, AI API 직접 호출 없음

## 2. 개발 상태 요약

| 항목 | 상태 | 비고 |
|---|---|---|
| 참여자 앱 `/` | 준비 | 12개 화면 구성 |
| 강사용 대시보드 `/?view=instructor` | 준비 | 응답 요약, pendingSync, 원본 JSON 확인 |
| 사전점검 화면 `/?view=check` | 준비 | Google Sheets 연동 테스트 버튼 포함 |
| localStorage 저장 | 준비 | 새로고침 복원 가능 |
| Google Sheets 연동 코드 | 준비 | Apps Script Web App URL 필요 |
| Apps Script 코드 | 준비 | `apps-script/Code.gs` 포함 |
| CI Workflow | 준비 | typecheck, audit, parser smoke, build |
| 운영 문서 | 준비 | 배포, QA, 강사용 스크립트 포함 |

## 3. v2 실습 콘텐츠 반영 현황

| 화면 | 반영 내용 | 상태 |
|---|---|---|
| M-P01 입장 | 세션코드, 이름, 팀명 입력 | 반영 |
| M-P02 과정 안내 | Data Lens, Stakeholder Lens, Customer Value Lens | 반영 |
| M-P03 AI 안전선 카드 | 6개 카드, 정답, 해설 | 반영 |
| M-P04 좋은 질문 만들기 | 나쁜 질문 선택, 안전한 프롬프트 전환 | 반영 |
| M-P05 Dashboard Lab | 팀원별 지표, 고객군 A~D, 핵심 신호, Gap 가설 | 반영 |
| M-P06 실행행동 Map | 데이터 신호, 확인 사실, 필요한 행동, 팀장 지원, 2주 약속 | 반영 |
| M-P07 이해관계자 메시지 | 상사, 본사, 팀원, 동료 팀장 메시지 | 반영 |
| M-P08 성과대화 감별 | 프롬프트 생성, AI 답변 붙여넣기, 감별 기준 8개 | 반영 |
| M-P09 콜플랜 요청문 | 고객군 우선순위, 문제점 선택, 완료 기준, 중간점검 질문 | 반영 |
| M-P10 본사 요청 번역 | HQ Brief 3개, 현장 부담, CP 주의, 실행 번역 | 반영 |
| M-P11 1on1 코칭 | 페르소나 선택, 대화 목적, 질문, 행동 약속 | 반영 |
| M-P12 실행계획 | 7일 실행계획, 30일 점검 기준, 결과 복사 | 반영 |

## 4. 교육장 파일럿 전 필수 확인

### 4.1 기술 확인

- [ ] GitHub Actions CI 통과
- [ ] Vercel Production 배포 성공
- [ ] `/` 접속 성공
- [ ] `/?view=instructor` 접속 성공
- [ ] `/?view=check` 접속 성공
- [ ] `/?view=check`에서 앱 버전 `2.0.0-content-rich` 확인

### 4.2 Google Sheets 연동 확인

- [ ] Vercel 환경변수 `VITE_GOOGLE_SCRIPT_WEBAPP_URL` 등록
- [ ] Vercel Redeploy 완료
- [ ] `ping` 성공
- [ ] `setupSheetsC1Bio` 성공
- [ ] `saveParticipant` 성공
- [ ] `saveResponse` 성공
- [ ] `getDashboardData` 성공
- [ ] Google Sheets의 `Participants` 시트에 테스트 행 생성
- [ ] Google Sheets의 `Responses` 시트에 테스트 행 생성

### 4.3 참여자 플로우 확인

- [ ] 입장 화면 입력 가능
- [ ] 12개 화면 순차 이동 가능
- [ ] 프롬프트 복사 가능
- [ ] AI 답변 붙여넣기 가능
- [ ] 감별 체크리스트 선택 가능
- [ ] 실행계획 입력 가능
- [ ] 전체 결과 복사 가능
- [ ] 새로고침 후 입력값 복원 가능

### 4.4 강사용 화면 확인

- [ ] 응답 요약 표시
- [ ] pendingSync 건수 표시
- [ ] 원본 JSON 표시
- [ ] 점수, 순위, 등급 표현 없음
- [ ] 토의용으로 활용 가능한 응답 구조 확인

## 5. 현재 리스크와 보완 필요 사항

| 리스크 | 영향 | 대응 |
|---|---|---|
| Google Sheets 권한 설정 오류 | 저장 실패 | `/?view=check`에서 사전 점검 |
| 교육장 Wi-Fi 불안정 | 저장 지연 | localStorage + pendingSync 유지 |
| 무료 AI 접속 실패 | AI 실습 지연 | 샘플 답변 Bank 활용 |
| 일부 화면 입력 부담 | 시간 초과 | 강사용 스크립트의 축소 운영안 적용 |
| 대시보드가 아직 JSON 중심 | 강사용 즉시 해석 부담 | 파일럿 후 요약형 대시보드 v3 고도화 |

## 6. 파일럿 운영 권고

1차 파일럿은 완성형 서비스 검증이 아니라 교육장 사용성 검증으로 운영합니다.

확인해야 할 핵심 질문은 다음입니다.

1. 교육생이 앱 흐름을 강사 안내에 따라 무리 없이 따라오는가?
2. 프롬프트 복사 → 외부 AI → 붙여넣기 → 감별 흐름이 자연스러운가?
3. 제약영업 CP 안전선 안내가 충분히 반복되는가?
4. 영업팀장들이 실제 현업 상황과 연결해 몰입하는가?
5. 강사용 대시보드가 수업 운영에 도움이 되는가?
6. Google Sheets 저장이 안정적으로 작동하는가?

## 7. 파일럿 후 v3 개선 후보

- 강사용 대시보드 요약 카드 강화
- 화면별 응답 집계 시각화
- AI 답변 파서 정교화
- 샘플 답변 Bank UI 강화
- 모듈별 추천/필수 실습 선택 기능
- 교육생 결과 리포트 다운로드 기능
- 세션코드별 데이터 분리 강화
- 관리자용 세션 초기화 기능

## 8. 결론

현재 v2는 교육장 파일럿을 진행할 수 있는 실습 콘텐츠 반영형 MVP입니다.

단, 파일럿 전 반드시 Google Sheets 연동 테스트와 참여자 플로우 수동 테스트를 완료해야 합니다. v2의 목표는 완성형 제품 출시가 아니라, 교육장 실사용성과 저장 안정성, 실습 몰입도를 검증하는 것입니다.
