# v39 Preview QA Checklist

## 1. 문서 목적

이 문서는 `journey-v39-preview.html` 고객 시연 전 수동 QA를 위한 체크리스트입니다.  
v39는 운영 route와 v34/v35/v38 안정 파일을 보호하면서, 5단계부터 13단계까지 결과 저장과 다음 단계 연결을 v39 전용 wrapper와 store로 확장한 preview 흐름입니다.

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

### 5단계: 팀원 실행진단

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 5단계 상단 | v39 전용 저장 패널 표시 | [ ] |
| 입력 | 우리 팀 상황, 핵심 지표, 보완 지표, 안전선 지표, 지표 선택 이유 입력 가능 | [ ] |
| 저장 | 저장 후 값 유지 | [ ] |
| localStorage | `ckd.v39.dashboardAnalysis.result.v1` 저장 | [ ] |

### 6단계: 고객 Data 분석

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 고객 Data 판단 프레임 | 기회성·반응성·실행 가능성·리스크·판단 유보 Data 안내 표시 | [ ] |
| 고객별 판단 | 고객별 신호와 2주 판단 메모 정리 가능 | [ ] |
| 프롬프트 | AI 고객 신호 분리 프롬프트 생성 및 복사 가능 | [ ] |
| localStorage | `ckd.v39.customerJudgment.result.v1` 저장 | [ ] |

### 7단계: 고객 유형별 대응 전략

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 6단계 연결 | 6단계 고객 판단 결과가 7단계 상단에 표시 | [ ] |
| 전략 저장 | 고객별 대응 전략, 부족한 정보, 리스크, 2주 판단 메모 입력 가능 | [ ] |
| 초안 | 6단계 판단으로 전략 초안 채우기 동작 | [ ] |
| localStorage | `ckd.v39.customerStrategy.result.v1` 저장 | [ ] |

### 8단계: 팀원별 역할 방향

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 7단계 연결 | 7단계 고객 대응 전략이 8단계 상단에 표시 | [ ] |
| 5단계 연결 | 5단계 팀 실행진단 결과도 표시 | [ ] |
| 역할 저장 | 담당 고객군, 역할 미션, 코칭 초점, 리스크 안전선, 콜플랜 준비물 입력 가능 | [ ] |
| localStorage | `ckd.v39.memberRole.result.v1` 저장 | [ ] |

### 9단계: 팀원 온도차와 실행 대화

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 상단 안내 | 팀장의 첫마디를 목적에 맞게 바꾸는 흐름 표시 | [ ] |
| Block 0~3 | 나 때는 말이야, 지금은 말이야, 왜 대화의 시작을 바꿔야 하는가 표시 | [ ] |
| 대화 상황 | 팀장이 직면한 소통 상황 선택 가능 | [ ] |
| 대화 목적 | 일을 맡기는 대화, 기준과 경계를 정하는 대화 등 8유형 선택 가능 | [ ] |
| 첫마디 개선 | 평소 첫마디, 팀원 인식, 목적에 맞는 첫마디 정리 가능 | [ ] |
| localStorage | `ckd.v39.peopleDialogue.result.v1` 저장 | [ ] |

### 10단계: AI 콜플랜 결과물 요청

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 8단계 연결 | 팀원 역할 결과 표시 | [ ] |
| 9단계 연결 | 실행 대화 요약, 대화 목적, 첫마디가 표시 | [ ] |
| 프롬프트 | AI Call Plan 프롬프트 복사 가능 | [ ] |
| localStorage | `ckd.v39.aiCallPlan.result.v1` 저장 | [ ] |

### 11단계: 컴플라이언스 위험 표현 제거

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 10단계 연결 | AI Call Plan 초안이 컴플라이언스 점검 대상 문장으로 표시 | [ ] |
| 사람관리 안전선 | 팀원 부담 전가, 세대 단정 표현 점검 포함 | [ ] |
| 안전 문장 | 위험 유형, 안전 문장, 최종 체크리스트, 최종 카드 메모 입력 가능 | [ ] |
| localStorage | `ckd.v39.complianceCleanup.result.v1` 저장 | [ ] |

### 12단계: 최종 2주 콜플랜 카드

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 8단계 연결 | 팀원 역할 요약 표시 | [ ] |
| 9단계 연결 | 실행 대화 요약 표시 | [ ] |
| 11단계 연결 | 컴플라이언스 요약 표시 | [ ] |
| 최종 카드 저장 | 집중 고객군, 역할, 2주 실행, 안전선, 첫 문장, 토의 메모 저장 가능 | [ ] |
| localStorage | `ckd.v39.finalCallPlan.result.v1` 저장 | [ ] |

### 13단계: 강사용 토의 질문

| 점검 항목 | 기대 결과 | 확인 |
|---|---|---|
| 12단계 연결 | 최종 실행 카드 요약 표시 | [ ] |
| 토의 질문 | 고객 실행 판단, 팀원 역할, 실행 대화 첫마디, 컴플라이언스 안전선, 현업 실행 전환 질문 표시 | [ ] |
| 토의 요약 | 토의 요약 복사 가능 | [ ] |
| 평가 오해 방지 | 평가 자료가 아니라 토의 운영 자료라는 문구 표시 | [ ] |

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

12단계 저장
→ 13단계 상단 표시 확인
```

## 7. localStorage key 점검

브라우저 개발자 도구에서 아래 key가 충돌 없이 생성되는지 확인합니다.

```text
ckd.v39.dashboardAnalysis.result.v1
ckd.v39.customerJudgment.result.v1
ckd.v39.customerStrategy.result.v1
ckd.v39.memberRole.result.v1
ckd.v39.peopleDialogue.result.v1
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
- 5→13단계 저장·연결 흐름 정상
- 기존 운영 route와 보호 파일 유지

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
