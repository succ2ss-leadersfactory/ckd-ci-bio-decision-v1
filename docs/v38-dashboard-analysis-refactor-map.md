# v38 Dashboard Analysis Lab 리팩터링 맵

이 문서는 `journey-v38-dashboard-analysis-lab.tsx`가 다시 비대해지거나 데이터·파서·프롬프트·UI가 서로 꼬이지 않도록 하기 위한 유지보수 기준이다.

## 1. 현재 책임 분리 구조

| 파일 | 담당 책임 | 수정 예시 |
|---|---|---|
| `src/journey-v38-dashboard-analysis-data.ts` | 교육 콘텐츠 데이터 | 팀원 유형 추가, 팀원 순서 변경, 상황 선택지 수정, 지표 후보 수정, 준비물 선택지 수정 |
| `src/journey-v38-dashboard-analysis-parsers.ts` | AI 결과 자동분리 로직 | AI 추천 지표 파싱 개선, 팀원별 신호 분리 개선, 준비물 초안 분리 개선 |
| `src/journey-v38-dashboard-analysis-prompts.ts` | 외부 AI에 복사할 프롬프트 생성 | 지표 추천 프롬프트 수정, 팀원 신호 정리 프롬프트 수정, 준비물 생성 프롬프트 수정 |
| `src/journey-v38-dashboard-analysis-ui.tsx` | 공통 반복 UI 하위 컴포넌트 | 지표 선택 카드, 검토 입력칸, 준비물 입력칸, 7명 유형 카드 표시 방식 수정 |
| `src/journey-v38-selected-member-prep-panel.tsx` | 선택 유형별 신호 분리 정리 패널 | 팀원별 관찰 신호, 강점 신호, 우려 신호, 확인 질문, 단정 금지 입력칸 수정 |
| `src/journey-v38-action-deliverable-picker.tsx` | 팀장 행동 선택 카드 | 추천 준비물 선택 버튼, 행동 결과물 체크박스, 선택 상태 표시 방식 수정 |
| `src/journey-v38-final-member-prep-card.tsx` | 최종 유형별 다음 행동 준비물 카드 | AI 준비물 초안, 최종 준비물 입력칸 수정 |
| `src/journey-v38-dashboard-analysis-lab.tsx` | 화면, 상태, 사용자 진행 흐름 | 입력 UI 배치, 버튼, 안내문, 화면 섹션 순서, 사용자 상호작용 수정 |
| `scripts/smoke-v38-static.mjs` | 정적 보호 기준 | 주요 문구, import 구조, 데이터 순서, 모듈 존재 여부 보호 |
| `scripts/smoke-v38-dist.mjs` | 빌드 결과 보호 기준 | 실제 bundle에 포함되어야 할 사용자 화면 문구와 금지 문구 확인 |

## 2. 수정 원칙

### 2.1 데이터 수정은 data 파일에서만 한다

팀원 카드, 상황 선택지, 지표, 준비물 선택지, 추천 준비물 매핑은 `journey-v38-dashboard-analysis-data.ts`에서 수정한다.

예시:

- 문교원 사원의 프로필 수정
- 팀원 카드 순서 변경
- MZ세대 관련 상황 선택지 추가
- 안전선 지표 추가
- 팀장 행동 선택지 추가

이런 수정은 컴포넌트 파일에서 직접 하지 않는다.

### 2.2 자동분리 로직 수정은 parsers 파일에서만 한다

아래 기능은 `journey-v38-dashboard-analysis-parsers.ts`에서 수정한다.

- 표 형식 AI 결과 분리
- 섹션 제목 인식
- 팀원 이름 기준 분리
- 선택 유형별 준비물 초안 분리
- 자동분리 실패 안내 문구

컴포넌트는 파서 결과를 받아 상태에 채우는 역할만 한다.

### 2.3 프롬프트 문구 수정은 prompts 파일에서만 한다

아래 문구는 `journey-v38-dashboard-analysis-prompts.ts`에서 수정한다.

- AI 지표 추천 프롬프트
- AI 신호 정리 프롬프트
- AI 준비물 생성 프롬프트
- AI에게 요구하는 출력 형식
- 금지 표현 안내 방식

컴포넌트 안에 긴 프롬프트 배열을 다시 만들지 않는다.

### 2.4 공통 UI 수정은 해당 UI 컴포넌트 파일에서 먼저 검토한다

공통 UI는 다음 파일에서 관리한다.

- `V38MetricPicker`, `V38ReviewTextarea`, `V38PrepTextarea`, `V38TeamMemberCard`: `journey-v38-dashboard-analysis-ui.tsx`
- `V38SelectedMemberPrepPanel`: `journey-v38-selected-member-prep-panel.tsx`
- `V38ActionDeliverablePicker`: `journey-v38-action-deliverable-picker.tsx`
- `V38FinalMemberPrepCard`: `journey-v38-final-member-prep-card.tsx`

지표 카드의 표현 방식, 입력칸 스타일, 선택 카드, 최종 준비물 카드의 표시 방식은 먼저 해당 UI 컴포넌트 파일에서 처리한다.
단, 특정 화면 흐름이나 섹션 배치 자체를 바꾸는 경우에는 `journey-v38-dashboard-analysis-lab.tsx`에서 처리한다.

### 2.5 컴포넌트는 사용자 흐름만 담당한다

`journey-v38-dashboard-analysis-lab.tsx`는 다음만 담당한다.

- 화면 섹션 구성
- 상태 관리
- 버튼 클릭 처리
- 입력값 반영
- 파서 결과를 입력칸에 채우기
- 프롬프트 복사
- data, parsers, prompts, UI 컴포넌트 모듈 연결

## 3. 보호해야 할 사용자 경험 기준

v38 5단계는 다음 UX 기준을 유지한다.

1. 우리 팀 상황 선택은 처음에 선택값이 없어야 한다.
2. 우리 팀 상황 선택은 최대 3개까지 허용한다.
3. 핵심 실행지표 최종 선택은 처음에 선택값이 없어야 한다.
4. 7명 유형 카드는 다음 순서를 유지한다.
   - 김재호 차장
   - 김문호 차장
   - 유희관 과장
   - 이대은 대리
   - 신재영 대리
   - 박재욱 사원
   - 문교원 사원
5. 우리 팀 유사 유형은 2명만 선택한다.
6. 나머지 5명은 참고 자료로만 사용한다.
7. AI 결과 자동분리는 초안이며, 최종 판단은 팀장이 수정·확정한다.
8. 실제 고객명, 병원명, 의료진명, 제품명, 미승인 표현, 내부 전략 수치, 개인정보는 입력하지 않는다.

## 4. 변경 후 반드시 확인할 명령

v38 관련 수정 후에는 다음 명령을 기준으로 확인한다.

```bash
npm run smoke:v38:static
npm run typecheck:v38
npm run build
npm run smoke:v38:dist
```

가능하면 통합 명령을 사용한다.

```bash
npm run smoke:v38
```

## 5. CI 해석 기준

| 결과 | 해석 | 조치 |
|---|---|---|
| `v38 static smoke passed` | 정적 문구와 구조 보호 통과 | 다음 검증 진행 |
| `typecheck:v38` success | TypeScript 타입 안정성 통과 | build 진행 |
| `vite build` success | 번들 생성 통과 | dist smoke 진행 |
| `v38 dist smoke passed` | 실제 bundle 문구 보호 통과 | 변경 완료 가능 |

## 6. 앞으로의 권장 리팩터링 순서

1. 5단계 결과 저장 구조 점검
   - 선택 상황
   - AI 추천 지표 분리 결과
   - 최종 실행지표
   - 선택한 2명 유형
   - 유형별 신호 정리
   - 팀장 행동 선택
   - 최종 다음 행동 준비물
2. 상태 로직 hook 분리 검토
   - 단, 교육장 파일럿 전에는 과도한 hook 분리는 피한다.
3. 자동분리 파서 단위 테스트 추가
   - 표 형식
   - 불릿 형식
   - 섹션 누락 형식
   - 선택한 2명만 포함된 형식
4. 강사용 대시보드와 5단계 결과 연동 여부 점검

## 7. 현재 안정 커밋 기준

반복 UI 컴포넌트 분리, QA 체크리스트 갱신, static smoke 안정화, dist smoke 보강을 포함한 최신 안정 기준은 다음 커밋이다.

- `324614b996601286e3550817b47974fe962b6d6c`

해당 커밋에서 확인된 CI:

- `C1Bio MVP CI`: success
- `v35 Smoke`: success
- `v36 Smoke`: success
- `v38 Smoke`: success

이 안정 기준에는 다음 변경이 포함된다.

- `V38TeamMemberCard` 실제 연결
- `V38SelectedMemberPrepPanel` 실제 연결
- `V38ActionDeliverablePicker` 실제 연결
- `V38FinalMemberPrepCard` 실제 연결
- 5단계 최신 구조 기준 QA 체크리스트 갱신
- `smoke-v38-static.mjs` 진단형 구조로 안정화
- `smoke-v38-dist.mjs` 5단계 핵심 흐름 보호 marker 보강
