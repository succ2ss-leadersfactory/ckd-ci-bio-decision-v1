# v39 Preview Readiness Report

## 1. 요약 판단

현재 `feature/v37-preview-shell` 브랜치의 v39 preview는 고객 시연 전 자동 검증 기준을 통과한 상태입니다.

최종 확인 커밋:

```text
edb4fafc70c4acc87a0c6d2224710e47f1907dcf
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

최종 확인 커밋 기준 자동 검증 결과는 다음과 같습니다.

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

아래 보호 파일은 기준 커밋 대비 변경 목록에 포함되지 않았습니다.

```text
journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

운영 route `/journey.html`도 변경하지 않았습니다. 신규 검증과 시연 준비는 `/journey-v39-preview.html`에 한정됩니다.

## 4. v39 신규·수정 파일 현황

기준 커밋 대비 주요 변경 파일은 다음과 같습니다.

### 문서

```text
docs/v39-preview-qa-checklist.md
docs/v39-preview-readiness-report.md
```

### 검증 스크립트

```text
scripts/audit-v39-readiness.mjs
scripts/smoke-v39-static.mjs
```

### 설정

```text
package.json
tsconfig.v39-smoke.json
```

### v39 앱 엔트리

```text
src/journey-v39-app-preview.tsx
```

### v39 wrapper

```text
src/journey-v39-dashboard-analysis-lab.tsx
src/journey-v39-customer-judgment-lab.tsx
src/journey-v39-customer-priority-lab.tsx
src/journey-v39-member-role-lab.tsx
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
src/journey-v39-ai-call-plan-result-store.ts
src/journey-v39-compliance-cleanup-result-store.ts
src/journey-v39-final-call-plan-result-store.ts
```

## 5. v39 설계 원칙 확인

v39는 독립적으로 모든 화면을 새로 만든 구조가 아닙니다. 안정된 v38 컴포넌트를 재사용하면서, 각 단계 상단에 v39 전용 wrapper와 저장·연결 패널을 추가한 구조입니다.

| 단계 | v39 wrapper | 재사용 v38 컴포넌트 |
|---|---|---|
| 5단계 Dashboard 분석 | `V39DashboardAnalysisLab` | `V38DashboardAnalysisLab` |
| 6단계 고객 Data 판단 | `V39CustomerJudgmentLab` | `V38CustomerJudgmentLab` |
| 7단계 고객 대응 전략 | `V39CustomerPriorityLab` | `V38CustomerPriorityLab` |
| 8단계 팀원 역할 배정 | `V39MemberRoleLab` | `V38MemberRoleLab` |
| 9단계 AI Call Plan | `V39AiCallPlanLab` | `V38AiCallPlanLab` |
| 10단계 컴플라이언스 정리 | `V39ComplianceCleanupLab` | `V38ComplianceCleanupLab` |
| 11단계 최종 실행 카드 | `V39FinalCallPlanCard` | `V38FinalCallPlanCard` |
| 12단계 강사용 토의 | `V39InstructorDiscussionLab` | `V38InstructorDiscussionLab` |

## 6. 5→12단계 연결 구조

현재 v39 preview의 핵심 연결 흐름은 다음과 같습니다.

```text
5단계 팀 Dashboard 분석 결과 저장
→ 8단계 팀원 역할 배정에 연결

6단계 고객 Data 판단 결과 저장
→ 7단계 고객 대응 전략에 연결

7단계 고객 대응 전략 결과 저장
→ 8단계 팀원 역할 배정에 연결

8단계 팀원 역할 배정 결과 저장
→ 9단계 AI Call Plan에 연결

9단계 AI Call Plan 결과 저장
→ 10단계 컴플라이언스 정리에 연결

10단계 컴플라이언스 정리 결과 저장
→ 11단계 최종 실행 카드에 연결

11단계 최종 실행 카드 결과 저장
→ 12단계 강사용 토의 화면에 연결
```

## 7. localStorage key 현황

v39 전용 저장 key는 다음과 같습니다.

| 목적 | localStorage key |
|---|---|
| 5단계 Dashboard 분석 결과 | `ckd.v39.dashboardAnalysis.result.v1` |
| 6단계 고객 판단 결과 | `ckd.v39.customerJudgment.result.v1` |
| 7단계 고객 대응 전략 결과 | `ckd.v39.customerStrategy.result.v1` |
| 8단계 팀원 역할 배정 결과 | `ckd.v39.memberRole.result.v1` |
| 9단계 AI Call Plan 결과 | `ckd.v39.aiCallPlan.result.v1` |
| 10단계 컴플라이언스 정리 결과 | `ckd.v39.complianceCleanup.result.v1` |
| 11단계 최종 실행 카드 결과 | `ckd.v39.finalCallPlan.result.v1` |

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

`audit:v39:readiness`는 민감정보 입력 금지 문구와 고객 시연 화면 내부 문구 노출 여부를 자동 점검합니다.

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
5→12단계 연결 흐름 정상
v38 원본 기능 유지
```

### No-Go 조건

```text
journey.html 또는 v34/v35/v38 보호 파일 변경 발견
v39 Smoke 또는 readiness audit failure
고객 시연 화면에 preview/v39/internal 문구 노출
실제 고객명·병원명·의료진명·제품명·내부 수치 입력 요구 문구 발견
점수화·등급화·평가처럼 보이는 UI 또는 문구 발견
5→12단계 저장·연결 흐름 중단
```

## 12. 현재 최종 판단

현재 자동 검증 기준으로는 다음 판단이 적절합니다.

```text
Conditional Go
```

조건:

```text
브라우저 수동 QA에서 5→12단계 저장·연결 흐름이 정상임을 확인할 것.
```

수동 QA가 통과하면 고객 시연용 v39 preview로 사용할 수 있습니다.
