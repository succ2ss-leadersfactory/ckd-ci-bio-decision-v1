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
| `src/journey-v39-dashboard-analysis-lab.tsx` | v39 전용 5단계 wrapper. v38 5단계를 감싸고 결과 저장 구조 준비 패널을 표시 |
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
06223052fc806d9e71287968e06d3ab339595abd
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
- v39 static smoke 추가
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

현재 v39 5단계 wrapper는 실제 5단계 내부 상태를 직접 저장하지 않는다. 우선 저장 구조 자체가 안전하게 작동하는지 확인하는 준비 단계다.

---

## 6. 다음 개발 범위

### v39-2: 실제 5단계 상태 저장 연결

목표:

- v39 5단계에서 생성·선택한 핵심 결과를 `V39DashboardResult` 구조에 저장한다.
- v38 원본 5단계를 크게 수정하지 않기 위해, 가능한 한 작은 prop/callback 기반 확장으로 접근한다.
- 저장 버튼 또는 자동 저장 시점을 명확히 한다.

권장 접근:

1. `V38DashboardAnalysisLab`에 선택적 callback prop을 추가한다.
   - 예: `onResultChange?: (result: PartialDashboardResult) => void`
   - v38 route에서는 prop을 넘기지 않는다.
   - v39 wrapper에서만 prop을 넘긴다.
2. 상태가 바뀔 때마다 바로 저장하지 말고, 우선 `저장하기` 버튼으로 수동 저장한다.
3. 저장 성공 후 v39 wrapper 요약 패널에 저장된 상황/지표/유형 수를 표시한다.
4. 이후 안정화되면 자동 저장으로 확장한다.

주의:

- v38 화면 문구와 흐름을 바꾸지 않는다.
- v38 storage key를 바꾸지 않는다.
- v39에서만 새 저장 key를 사용한다.
- 저장 구조는 8단계·대시보드 연동 전까지 localStorage에만 둔다.

---

## 7. 검증 명령

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

## 8. 다음 단계

다음 단계는 `v39-2: 실제 5단계 상태 저장 연결`이다.

첫 구현 단위는 다음처럼 제한한다.

1. `V38DashboardAnalysisLab`에 선택적 결과 snapshot 생성 callback 추가
2. v38 route에서는 기존 동작 유지
3. v39 wrapper에서만 snapshot을 받아 저장 버튼으로 `saveV39DashboardResult` 호출
4. v39 static smoke에 callback marker 추가
5. v39 smoke 전체 통과 확인
