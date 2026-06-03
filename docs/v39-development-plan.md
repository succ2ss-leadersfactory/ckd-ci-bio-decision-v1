# v39 Development Plan

## 1. 개발 원칙

v39는 v38 안정 기준을 깨뜨리지 않고 다음 단계 기능을 실험·확장하기 위한 Preview 버전이다.

핵심 원칙:

1. `journey.html` 운영 route는 수정하지 않는다.
2. `src/full-flow-journey-v34.tsx`는 수정하지 않는다.
3. `src/journey-active.tsx`는 수정하지 않는다.
4. v35, v36, v38 안정 route는 유지한다.
5. 신규 기능은 `/journey-v39-preview.html`에서만 검증한다.
6. v39는 처음에는 v38 안정 앱을 감싸는 안전 wrapper로 시작한다.

---

## 2. v39 초기 구조

| 파일 | 역할 |
|---|---|
| `journey-v39-preview.html` | v39 Preview HTML route |
| `src/journey-v39-app-preview.tsx` | v39 Preview 앱 entry. 현재는 v38 안정 앱을 위임 |
| `tsconfig.v39-smoke.json` | v39 범위 TypeScript 검증 |
| `scripts/smoke-v39-static.mjs` | v39 정적 구조 검증 |
| `scripts/smoke-v39-dist.mjs` | v39 빌드 결과 검증 |
| `package.json` | `typecheck:v39`, `smoke:v39` 명령 추가 |
| `vite.config.ts` | `journeyV39Preview` build input 추가 |

---

## 3. v39 개발 목표

v39의 핵심 목표는 v38에서 고도화한 5단계 `팀원 실행진단` 결과를 이후 단계와 연결하는 것이다.

우선 개발 후보:

1. 5단계 결과 저장 구조 정리
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

## 4. 첫 번째 권장 개발 범위

v39 첫 기능 개발은 아래 범위로 제한한다.

### v39-1: 5단계 결과 저장 구조 준비

목표:

- 5단계에서 생성·선택한 결과를 후속 단계가 사용할 수 있는 형태로 정리한다.
- 아직 Google Sheets 저장이나 강사용 대시보드 연동까지 바로 확장하지 않는다.
- 먼저 localStorage 기반의 안전한 구조를 만든다.

예상 산출물:

- `src/journey-v39-dashboard-result-store.ts`
- 5단계 결과 타입 정의
- 저장/불러오기 helper
- v39 전용 smoke marker

---

## 5. 검증 명령

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

---

## 6. 현재 상태

v39는 현재 안전 wrapper 단계다.

- v39 route 생성 완료
- v39 app entry 생성 완료
- v39는 v38 안정 앱을 위임
- v39 static smoke 추가
- v39 dist smoke 추가
- v39 typecheck 추가
- Vite build input 추가
- package script 추가

다음 단계는 `v39-1: 5단계 결과 저장 구조 준비`다.
