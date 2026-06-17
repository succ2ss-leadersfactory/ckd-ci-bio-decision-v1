# v39 Preview Readiness Report

## 1. 요약 판단

현재 `feature/v37-preview-shell` 브랜치의 v39 preview는 고객 시연 전 자동 검증 기준을 통과한 상태입니다.

최신 확인 커밋:

```text
3e5388d7c0aac2968f2903eb743c7e5dbfd134c0
```

기준 안정 커밋:

```text
b3670327ea965a9e430795af94b40e6f482f0aab
```

현재 판단:

```text
Go 후보
```

단, 최종 Go 판단 전에는 `docs/v39-preview-qa-checklist.md` 기준으로 실제 브라우저 수동 QA를 1회 완료해야 합니다.

## 2. CI 상태

최신 확인 커밋 기준 자동 검증 결과는 다음과 같습니다.

| Workflow | 상태 |
|---|---:|
| C1Bio MVP CI | success |
| v35 Smoke | success |
| v36 Smoke | success |
| v38 Smoke | success |
| v39 Smoke | success |

v39 Smoke에는 다음 검증이 포함됩니다.

```bash
npm run smoke:v39:static
npm run audit:v39:readiness
npm run typecheck:v39
npm run build
npm run smoke:v39:dist
```

## 3. 보호 파일 준수 여부

아래 보호 파일은 변경하지 않습니다.

```text
journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

운영 route `/journey.html`도 변경하지 않습니다. 신규 검증과 시연 준비는 `/journey-v39-preview.html`에 한정됩니다.

## 4. v39 신규·수정 파일 현황

### 문서

```text
docs/v39-preview-qa-checklist.md
docs/v39-preview-readiness-report.md
docs/v39-preview-manual-qa-run.md
```

### 검증 스크립트

```text
scripts/audit-v39-readiness.mjs
scripts/smoke-v39-static.mjs
scripts/smoke-v39-dist.mjs
```

### 설정·앱 엔트리

```text
journey-v39-preview.html
src/journey-v39-app-preview.tsx
src/journey-v39-preview-config.ts
tsconfig.v39-smoke.json
```

### v39 wrapper / lab

```text
src/journey-v39-dashboard-analysis-lab.tsx
src/journey-v39-customer-judgment-lab.tsx
src/journey-v39-customer-priority-lab.tsx
src/journey-v39-member-role-lab.tsx
src/journey-v39-people-dialogue-lab.tsx
src/journey-v39-ai-call-plan-lab.tsx
src/journey-v39-compliance-cleanup-lab.tsx
src/journey-v39-final-call-plan-card.tsx
src/journey-v39-instructor-discussion-lab.tsx
```

### v39 result store

```text
src/journey-v39-dashboard-result-store.ts
src/journey-v39-customer-judgment-result-store.ts
src/journey-v39-customer-strategy-result-store.ts
src/journey-v39-member-role-result-store.ts
src/journey-v39-people-dialogue-result-store.ts
src/journey-v39-ai-call-plan-result-store.ts
src/journey-v39-compliance-cleanup-result-store.ts
src/journey-v39-final-call-plan-result-store.ts
```

## 5. 현재 5~13단계 설계 구조

| 단계 | 화면 | 현재 구현 요지 |
|---:|---|---|
| 5 | 팀원 실행진단 | 팀 실행 Data를 보고 핵심 지표·보완 지표·안전선 지표를 저장 |
| 6 | 고객 Data 분석 | 고객 Data에서 기회·착시·리스크·판단 유보 신호를 구분 |
| 7 | 고객 유형별 대응 전략 | 6단계 판단을 고객별 2주 대응 전략으로 정리 |
| 8 | 팀원별 역할 방향 | 5·7단계 결과를 팀원별 역할, 코칭 초점, 안전선으로 전환 |
| 9 | 팀원 온도차와 실행 대화 | 대화 상황, 대화 목적 8유형, 평소 첫마디, 팀원 인식, 개선 첫마디를 저장 |
| 10 | AI 콜플랜 결과물 요청 | 8·9단계 결과를 바탕으로 AI Call Plan 요청 맥락을 생성 |
| 11 | 컴플라이언스 위험 표현 제거 | AI Call Plan 초안과 사람관리 대화 표현을 안전 문장으로 수정 |
| 12 | 최종 2주 콜플랜 카드 | 8·9·11단계 결과를 최종 실행 카드로 통합 |
| 13 | 강사용 토의 질문 | 12단계 결과를 강사용 디브리핑 질문으로 전환 |

## 6. 5→13단계 연결 구조

현재 v39 preview의 핵심 연결 흐름은 다음과 같습니다.

```text
5단계 팀원 실행진단 결과 저장
→ 8단계 팀원 역할 방향에 연결

6단계 고객 Data 분석 결과 저장
→ 7단계 고객 유형별 대응 전략에 연결

7단계 고객 대응 전략 결과 저장
→ 8단계 팀원 역할 방향에 연결

8단계 팀원 역할 방향 결과 저장
→ 9단계 팀원 온도차와 실행 대화에 연결
→ 10단계 AI 콜플랜 결과물 요청에 연결

9단계 팀원 온도차와 실행 대화 결과 저장
→ 10단계 AI 콜플랜 결과물 요청에 연결
→ 12단계 최종 2주 콜플랜 카드에 연결

10단계 AI 콜플랜 결과 저장
→ 11단계 컴플라이언스 위험 표현 제거에 연결

11단계 컴플라이언스 위험 표현 제거 결과 저장
→ 12단계 최종 2주 콜플랜 카드에 연결

12단계 최종 2주 콜플랜 카드 결과 저장
→ 13단계 강사용 토의 질문에 연결
```

## 7. localStorage key 현황

v39 전용 저장 key는 다음과 같습니다.

| 목적 | localStorage key |
|---|---|
| 5단계 팀원 실행진단 결과 | `ckd.v39.dashboardAnalysis.result.v1` |
| 6단계 고객 판단 결과 | `ckd.v39.customerJudgment.result.v1` |
| 7단계 고객 대응 전략 결과 | `ckd.v39.customerStrategy.result.v1` |
| 8단계 팀원 역할 방향 결과 | `ckd.v39.memberRole.result.v1` |
| 9단계 팀원 실행 대화 결과 | `ckd.v39.peopleDialogue.result.v1` |
| 10단계 AI Call Plan 결과 | `ckd.v39.aiCallPlan.result.v1` |
| 11단계 컴플라이언스 정리 결과 | `ckd.v39.complianceCleanup.result.v1` |
| 12단계 최종 실행 카드 결과 | `ckd.v39.finalCallPlan.result.v1` |

Readiness Audit에서 key 존재와 중복 여부를 검증합니다.

## 8. 고객 시연 화면 안전선

v39 preview에서 유지해야 할 안전선은 다음과 같습니다.

```text
실제 고객명 입력 금지
실제 병원명 입력 금지
실제 의료진명 입력 금지
실제 제품명 입력 금지
내부 매출·처방 수치 입력 금지
개인정보 입력 금지
AI 결과 자동 적용 금지
팀장 판단·수정·확인 중심 유지
점수화·등급화·평가처럼 보이는 표현 회피
```

## 9. 고객 시연 화면 문구 기준

고객 시연 화면에는 다음 문구가 노출되면 안 됩니다.

```text
preview
v39
DOM 후처리
internal
shell
C1바이오 v39 Preview
```

HTML title은 다음 고객용 문구로 유지합니다.

```text
C1바이오 영업팀장 AI 리더십 Lab Journey
```

## 10. 남은 수동 QA 항목

자동 검증은 통과했지만, 아래 항목은 브라우저에서 직접 확인해야 합니다.

```text
5단계 저장 → 8단계 상단 표시
6단계 저장 → 7단계 상단 표시
7단계 저장 → 8단계 상단 표시
8단계 저장 → 9단계 상단 표시
9단계 저장 → 10단계 상단 표시
10단계 저장 → 11단계 상단 표시
11단계 저장 → 12단계 상단 표시
12단계 저장 → 13단계 상단 표시
```

추가로 다음 UI 동작을 확인합니다.

```text
프롬프트 복사 버튼 동작
새로고침 버튼 동작
초안 가져오기 버튼 동작
textarea 입력 유지
단계 이동 후 저장값 유지
진행 초기화 동작
모바일/태블릿 화면 좌우 잘림 여부
```

상세 체크리스트는 아래 문서를 사용합니다.

```text
docs/v39-preview-qa-checklist.md
```

## 11. Go / No-Go 기준

### Go 조건

```text
C1Bio MVP CI success
v35 Smoke success
v36 Smoke success
v38 Smoke success
v39 Smoke success
v39 Readiness Audit success
고객 시연 화면 내부 문구 미노출
민감정보 입력 유도 없음
5→13단계 연결 흐름 정상
운영 route 및 보호 파일 유지
```

### No-Go 조건

```text
journey.html 또는 보호 파일 변경 발견
v39 Smoke 또는 readiness audit failure
고객 시연 화면 내부 개발 문구 노출
실제 고객명·병원명·의료진명·제품명·내부 수치·개인정보 입력 유도
점수화·등급화·평가처럼 보이는 UI 또는 문구 발견
```
