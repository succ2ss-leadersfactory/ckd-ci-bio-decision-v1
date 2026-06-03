# v39 Development Plan

## 1. 개발 원칙

v39는 v38 안정 기준을 깨뜨리지 않고 다음 단계 기능을 실험·확장하기 위한 Preview 버전이다.

핵심 원칙:

1. `journey.html` 운영 route는 수정하지 않는다.
2. `src/full-flow-journey-v34.tsx`는 수정하지 않는다.
3. `src/journey-active.tsx`는 수정하지 않는다.
4. v35, v36, v38 안정 route는 유지한다.
5. 신규 기능은 `/journey-v39-preview.html`에서만 검증한다.
6. v39는 v38 안정 컴포넌트를 재사용하되, 신규 기능은 v39 전용 파일에서만 연결한다.

---

## 2. 현재 v39 구조

| 파일 | 역할 |
|---|---|
| `journey-v39-preview.html` | v39 Preview HTML route |
| `src/journey-v39-app-preview.tsx` | v39 Preview 독립 앱 entry |
| `src/journey-v39-dashboard-analysis-lab.tsx` | v39 전용 5단계 wrapper. v38 5단계를 감싸고 5단계 핵심 결과 수동 저장 패널을 표시 |
| `src/journey-v39-member-role-lab.tsx` | v39 전용 8단계 wrapper. 5단계 저장 결과 표시와 역할 추천 초안 제공 |
| `src/journey-v39-dashboard-result-store.ts` | v39 5단계 결과 저장 타입, normalize, save/load/clear helper |
| `tsconfig.v39-smoke.json` | v39 범위 TypeScript 검증 |
| `scripts/smoke-v39-static.mjs` | v39 정적 구조 검증 |
| `scripts/smoke-v39-dist.mjs` | v39 빌드 결과 검증 |
| `.github/workflows/v39-smoke.yml` | v39 GitHub Actions smoke workflow |
| `package.json` | `typecheck:v39`, `smoke:v39` 명령 |
| `vite.config.ts` | `journeyV39Preview` build input |

---

## 3. 현재 완료 상태

최신 안정 기준 커밋:

```text
0f64cb42aba715cd7903434d1c6a3078e5409738
```

해당 커밋 기준 CI:

- `C1Bio MVP CI`: success
- `v35 Smoke`: success
- `v36 Smoke`: success
- `v38 Smoke`: success
- `v39 Smoke`: success

완료된 범위:

- v39 route 생성
- v39 app entry 독립화
- v39 전용 participant/progress storage key 분리
- v39 5단계 wrapper 연결
- v39 dashboard result localStorage helper 추가
- v39 5단계 핵심 결과 수동 저장 패널 추가
- v39 8단계 member role bridge wrapper 추가
- 5단계 저장 결과를 8단계 상단에서 읽어 표시
- 8단계 저장 결과 기반 역할 추천 초안 추가
- v39 static smoke 추가 및 marker 보강
- v39 dist smoke 추가
- v39 typecheck 추가
- v39 GitHub Actions workflow 추가
- v38 dist smoke shared chunk 대응

---

## 4. v39 개발 목표

v39의 핵심 목표는 v38에서 고도화한 5단계 `팀원 실행진단` 결과를 이후 단계와 연결하는 것이다.

우선 개발 후보:

1. 5단계 결과 저장 구조를 실제 화면 상태와 연결
   - 우리 팀 상황 선택
   - AI 추천 지표 분리 결과
   - 최종 핵심 실행지표
   - 선택한 2명 유형
   - 유형별 신호 정리
   - 팀장 행동 선택
   - 최종 다음 행동 준비물
2. 5단계 결과를 8단계 `팀원별 역할 방향`에 연결
3. 강사용 대시보드에 5단계 선택 결과 일부 반영
4. 모바일/태블릿 UX 압축
5. 12단계 강사용 토의 질문에 MZ세대 신입사원 관리 이슈 강화

---

## 5. v39-1 완료: 5단계 결과 저장 구조 준비

완료 내용:

- `V39DashboardResult` 타입 정의
- metric result, metric selection, member result 구조 분리
- localStorage key 정의
- normalize helper 추가
- save/load/clear helper 추가
- v39 5단계 wrapper에서 저장 구조 초기화/비우기 테스트 UI 추가

---

## 6. v39-2 완료: 5단계 핵심 결과 저장 및 8단계 연결

완료 내용:

- `src/journey-v39-dashboard-analysis-lab.tsx`에 수동 저장 패널 추가
- 저장 항목:
  - 우리 팀 상황
  - 핵심 지표
  - 보완 지표
  - 안전선 지표
  - 지표 선택 이유
  - 선택 유형 ID
  - 선택 유형 신호 요약
  - 최종 다음 행동 준비물
- 저장 버튼:
  - `v39 5단계 결과 저장`
  - `v39 저장 구조 초기화 테스트`
  - `v39 저장 구조 비우기`
- `src/journey-v39-member-role-lab.tsx` 추가
- 8단계 상단에서 5단계 저장 결과 요약 표시
- v39 app에서 `member-role` 단계가 `V39MemberRoleLab`을 사용하도록 연결
- `tsconfig.v39-smoke.json`에 v39 8단계 wrapper 포함
- `smoke-v39-static.mjs`에 v39 8단계 bridge marker 추가

현재 방식은 안전성을 위해 v38 원본 5단계를 직접 수정하지 않는다. v39 전용 수동 저장 패널을 통해 먼저 데이터 구조와 단계 간 연결성을 검증한다.

---

## 7. v39-3 완료: 8단계 저장 결과 기반 역할 추천 고도화

완료 내용:

- `src/journey-v39-member-role-lab.tsx`에 저장 결과 기반 추천 초안 생성 구조 추가
- 추가 타입과 함수:
  - `RoleRecommendationDraft`
  - `readableMemberLabel`
  - `buildRoleRecommendationDrafts`
- 8단계 bridge 패널에 `저장 결과 기반 역할 추천 초안` 카드 추가
- 추천 초안은 다음 3개 필드로 제한:
  - 역할 후보
  - 코칭 초점
  - 주의할 점
- 선택 유형 ID를 한국어 인물명으로 표시
- 핵심 지표, 보완 지표, 안전선 지표, 선택 유형 신호, 최종 다음 행동 준비물을 바탕으로 추천 문장 생성
- 추천은 자동 배정이 아니라 팀장 판단을 돕는 초안이라는 안내 반영
- `smoke-v39-static.mjs`에 v39 역할 추천 marker 추가

주의:

- 고객군 자동 배정까지 확장하지 않았다.
- 팀장 판단을 대체하는 표현을 쓰지 않았다.
- 기존 v38 8단계 역할 배정 화면은 그대로 유지했다.

---

## 8. 다음 개발 범위

### v39-4: 강사용 대시보드 연결 후보 검토

목표:

- 5단계 저장 결과와 8단계 역할 추천 초안을 강사용 운영 관점에서 볼 수 있는 구조를 검토한다.
- 아직 평가나 점수화로 가지 않는다.
- 교육 운영자가 토의 흐름을 잡을 수 있는 요약 정보만 제공한다.

권장 구현 범위:

1. 기존 강사용 대시보드 구조 확인
2. v39 저장 결과를 읽을 수 있는 instructor bridge 파일 후보 검토
3. 표시 항목은 다음 정도로 제한:
   - 저장된 팀 상황 개수
   - 선택한 유형 2명
   - 핵심 지표 3개
   - 역할 추천 초안 존재 여부
4. 점수·등급·우열 비교 표현은 사용하지 않는다.
5. 강사용 화면은 토의 지원용이라는 안내를 명확히 한다.

대안:

- 강사용 대시보드 연결 전에 v39 화면 QA 문서를 먼저 추가할 수 있다.
- 실제 배포 URL에서 v39 5단계 저장 → 8단계 표시 → 역할 추천 초안 노출을 수동 QA한 뒤 대시보드 연결로 넘어가도 된다.

---

## 9. 검증 명령

v39 관련 수정 후에는 다음 명령을 기준으로 검증한다.

```bash
npm run smoke:v39:static
npm run typecheck:v39
npm run build
npm run smoke:v39:dist
```

통합 명령:

```bash
npm run smoke:v39
```

기존 안정 버전 보호를 위해 다음도 계속 확인한다.

```bash
npm run smoke:v35
npm run smoke:v36
npm run smoke:v38
```

CI 기준:

- `C1Bio MVP CI`: success
- `v35 Smoke`: success
- `v36 Smoke`: success
- `v38 Smoke`: success
- `v39 Smoke`: success

---

## 10. 다음 단계

다음 단계는 다음 두 선택지 중 하나다.

1. `v39 화면 QA 문서 추가`
   - v39 5단계 저장 패널
   - 8단계 저장 결과 표시
   - 역할 추천 초안 표시
   - v38 route 비영향 확인
2. `v39-4: 강사용 대시보드 연결 후보 검토`
   - instructor bridge 설계
   - 평가가 아닌 토의 지원용 표시 기준 정리
   - 대시보드 연결 여부 결정

권장 순서는 먼저 `v39 화면 QA 문서 추가` 후, 화면 확인을 마치고 `v39-4`로 넘어가는 것이다.
