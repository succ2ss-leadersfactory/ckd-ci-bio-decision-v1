# v39 Preview QA Checklist

## 1. 문서 목적

이 문서는 `journey-v39-preview.html` 고객 시연 전 수동 QA를 위한 체크리스트입니다.  
v39는 v38 안정 컴포넌트를 재사용하되, 5단계부터 12단계까지 결과 저장과 다음 단계 연결을 v39 전용 wrapper와 store로 확장한 preview 흐름입니다.

## 2. 현재 보호 원칙

아래 파일과 운영 route는 수정하지 않습니다.

```text
journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```

운영 route `/journey.html`은 그대로 유지합니다. 신규 검증은 `/journey-v39-preview.html`에서만 수행합니다.

## 3. 사전 자동 검증

시연 전 아래 상태를 확인합니다.

```text
C1Bio MVP CI: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v39 Smoke: success
```

v39 Smoke에는 다음 명령이 포함되어야 합니다.

```bash
npm run smoke:v39:static
npm run audit:v39:readiness
npm run typecheck:v39
npm run build
npm run smoke:v39:dist
```

## 4. 고객 시연 화면 문구 점검

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| HTML title | `C1바이오 영업팀장 AI 리더십 Lab Journey` | [ ] |
| 화면 상단/본문 | `preview`, `v39`, `DOM 후처리`, `internal`, `shell` 등 내부 개발 문구 미노출 | [ ] |
| 전체 화면 | 점수, 등급, 평가처럼 보이는 표현 미노출 | [ ] |
| 전체 화면 | 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보 입력 유도 없음 | [ ] |
| AI 관련 문구 | AI 답변 자동 적용이 아니라 팀장 판단·수정·확인 중심으로 표현 | [ ] |

## 5. 단계별 기능 QA

### 5단계: 팀 Dashboard 분석

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 5단계 상단 | v39 전용 저장 패널 표시 | [ ] |
| 입력 | 우리 팀 상황, 핵심 지표, 보완 지표, 안전선 지표, 지표 선택 이유 입력 가능 | [ ] |
| 저장 | `v39 5단계 결과 저장` 실행 후 값 유지 | [ ] |
| localStorage | `ckd.v39.dashboardAnalysis.result.v1` 저장 | [ ] |
| 초기화 | `v39 저장 구조 비우기` 실행 시 저장값 삭제 | [ ] |

### 6단계: 고객 Data 판단

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 상단 프레임 | 고객 Data 판단 프레임 표시 | [ ] |
| 고객별 판단 | 고객 유형 A~F에 대해 집중/유지/보류/정보 보완 선택 가능 | [ ] |
| 프롬프트 | AI 분석 프롬프트 생성 및 복사 가능 | [ ] |
| 저장 | 판단 이유, 다음 확인 질문, 컴플라이언스 메모 저장 | [ ] |
| localStorage | `ckd.v39.customerJudgment.result.v1` 저장 | [ ] |

### 7단계: 고객 대응 전략

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 6단계 연결 | 6단계 고객 판단 결과가 7단계 상단에 표시 | [ ] |
| 새로고침 | `6단계 판단 새로고침`으로 최신 값 반영 | [ ] |
| 전략 저장 | 8단계 연결용 우선순위, 팀원 배정 방향, 2주 대응 전략, 주의 리스크 입력 가능 | [ ] |
| 초안 | `8단계 연결 초안 가져오기` 동작 | [ ] |
| localStorage | `ckd.v39.customerStrategy.result.v1` 저장 | [ ] |

### 8단계: 팀원 역할 배정

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 7단계 연결 | 7단계 고객 대응 전략이 8단계 상단에 표시 | [ ] |
| 5단계 연결 | 5단계 Dashboard 결과도 기존처럼 표시 | [ ] |
| 역할 저장 | 담당 고객군, 역할 미션, 코칭 초점, 리스크 안전선, 콜플랜 준비물 입력 가능 | [ ] |
| 초안 | `9단계 연결 초안 가져오기` 동작 | [ ] |
| localStorage | `ckd.v39.memberRole.result.v1` 저장 | [ ] |

### 9단계: AI Call Plan

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 8단계 연결 | 팀원 역할 배정 결과가 AI Call Plan 상단에 표시 | [ ] |
| 연결 프롬프트 | 연결 프롬프트 복사 가능 | [ ] |
| 10단계 연결 저장 | AI Call Plan 초안, 위험 메모, 10단계 점검 초점 입력 가능 | [ ] |
| 초안 | `10단계 연결 초안 가져오기` 동작 | [ ] |
| localStorage | `ckd.v39.aiCallPlan.result.v1` 저장 | [ ] |

### 10단계: 컴플라이언스 정리

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 9단계 연결 | AI Call Plan 초안이 컴플라이언스 점검 대상 문장으로 표시 | [ ] |
| 위험 유형 | 처방 유도, 비교 우위 단정, 허가 외 표현 등 위험 유형 가이드 표시 | [ ] |
| 점검 프롬프트 | 점검 프롬프트 복사 가능 | [ ] |
| 11단계 연결 저장 | 위험 유형 요약, 안전 문장, 최종 체크리스트, 최종 카드 메모 입력 가능 | [ ] |
| localStorage | `ckd.v39.complianceCleanup.result.v1` 저장 | [ ] |

### 11단계: 최종 실행 카드

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 10단계 연결 | 컴플라이언스 정리 결과가 최종 실행 카드 상단에 표시 | [ ] |
| 요약 복사 | 최종 카드 요약 복사 가능 | [ ] |
| 12단계 연결 저장 | 집중 고객군, 팀원 역할, 2주 실행, 컴플라이언스 포인트, 첫 문장, 토의 메모 입력 가능 | [ ] |
| 초안 | `12단계 연결 초안 가져오기` 동작 | [ ] |
| localStorage | `ckd.v39.finalCallPlan.result.v1` 저장 | [ ] |

### 12단계: 강사용 토의

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 11단계 연결 | 최종 실행 카드 요약이 강사용 토의 화면 상단에 표시 | [ ] |
| 토의 요약 | 토의 요약 복사 가능 | [ ] |
| 평가 오해 방지 | 평가 자료가 아니라 판단 근거와 현업 적용 토의 자료라는 문구 표시 | [ ] |
| 기존 v38 토의 | 기존 디브리핑 질문과 진행 원칙 유지 | [ ] |

## 6. 연결 흐름 End-to-End QA

아래 순서로 최소 1회 전체 흐름을 확인합니다.

```text
5단계 저장
→ 8단계 상단 표시 확인

6단계 저장
→ 7단계 상단 표시 확인

7단계 저장
→ 8단계 상단 표시 확인

8단계 저장
→ 9단계 상단 표시 확인

9단계 저장
→ 10단계 상단 표시 확인

10단계 저장
→ 11단계 상단 표시 확인

11단계 저장
→ 12단계 상단 표시 확인
```

## 7. localStorage key 점검

브라우저 개발자 도구에서 아래 key가 충돌 없이 생성되는지 확인합니다.

```text
ckd.v39.dashboardAnalysis.result.v1
ckd.v39.customerJudgment.result.v1
ckd.v39.customerStrategy.result.v1
ckd.v39.memberRole.result.v1
ckd.v39.aiCallPlan.result.v1
ckd.v39.complianceCleanup.result.v1
ckd.v39.finalCallPlan.result.v1
```

## 8. 모바일/태블릿 UX QA

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 모바일 세로 화면 | 주요 카드와 입력창이 좌우 잘림 없이 표시 | [ ] |
| 태블릿 가로 화면 | 2~3열 카드가 과도하게 촘촘하지 않게 표시 | [ ] |
| 긴 textarea | 입력·스크롤·복사 동작 정상 | [ ] |
| 단계 이동 | 이전/다음/단계 선택 후 저장값 유지 | [ ] |
| 진행 초기화 | 참여자 정보와 진행 단계 초기화 정상 | [ ] |

## 9. 고객 시연 전 최종 Go / No-Go 기준

### Go

- C1Bio, v35, v36, v38, v39 Smoke 모두 success
- v39 Readiness Audit success
- 고객 시연 화면에 내부 개발 문구 없음
- 실제 민감정보 입력 유도 없음
- 5→12단계 저장·연결 흐름 정상
- 기존 v38 원본 기능 유지

### No-Go

- `journey.html` 또는 v34/v35/v38 보호 파일 변경 발견
- v39 Smoke 또는 readiness audit failure
- 시연 화면에 `preview`, `v39`, `DOM 후처리` 등 내부 문구 노출
- 실제 고객명·병원명·의료진명·제품명·내부 수치 입력을 요구하는 문구 발견
- 점수화·등급화·평가처럼 보이는 UI 또는 문구 발견

## 10. QA 기록 양식

| 항목 | 기록 |
|---|---|
| QA 일시 |  |
| QA 담당 |  |
| 확인 URL |  |
| 확인 브랜치 | `feature/v37-preview-shell` |
| 확인 커밋 |  |
| CI 상태 |  |
| 주요 발견 이슈 |  |
| 수정 필요 여부 |  |
| 최종 판단 | Go / No-Go |
