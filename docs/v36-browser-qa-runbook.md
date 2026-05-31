# v36 Browser QA Runbook

## 목적

이 문서는 `journey-v36-preview.html`의 브라우저 QA 절차를 정의한다. v36은 v34 운영 route와 v35 안정 preview를 건드리지 않는 독립 preview이다.

## 보호 원칙

- `/journey.html`은 v34 운영 route로 유지한다.
- `/journey-v35-preview.html`은 v35 안정 preview로 유지한다.
- `/journey-v36-preview.html`에서만 v36 실습 고도화를 검증한다.
- 다음 파일은 수정하지 않는다.
  - `src/full-flow-journey-v34.tsx`
  - `src/journey-active.tsx`
  - `src/full-flow-journey-v35.tsx`

## 사전 확인

```bash
npm run smoke:v36
npm run smoke:v35
```

두 명령이 모두 통과해야 브라우저 QA를 진행한다.

## QA 대상 route

```text
/journey-v36-preview.html
```

## Step 1. 진입 화면 확인

확인 항목:

- v36 제목이 표시된다.
- C1바이오 영업팀장 역할 부여 문구가 표시된다.
- AI 안전선 안내가 표시된다.
- 이름 입력이 가능하다.
- 팀명 입력이 가능하다.
- 역할 수락 체크박스가 동작한다.
- 새로고침 후 이름, 팀명, 체크 상태가 localStorage에서 복구된다.

localStorage 확인 키:

```text
ckd-v36-participant
ckd-v36-progress
```

## Step 2~6. Placeholder flow 확인

확인 항목:

- AI 안전선
- 좋은 질문 만들기
- AI Research 전략 Lab
- Source Check
- 팀원 Dashboard 분석

각 단계에서 다음을 확인한다.

- 단계 제목이 13단계 흐름과 일치한다.
- Previous / Next 버튼이 동작한다.
- AI 안전선 안내가 반복 노출된다.
- 화면 깨짐이 없다.

## Step 7. 고객군 판단 / 콜플랜 Lab 확인

### 7-1. 상황 제시

- “2주 고객군 판단과 콜플랜 설계” 문구가 표시된다.
- 고객 압박이 아니라 정보 제공 품질, 후속조치, CRM 기록 기준 중심으로 안내한다.

### 7-2. 고객군 A~D 카드

다음 카드가 모두 표시되어야 한다.

- A군: 반응 상승 고객군
- B군: 관심은 있으나 지연되는 고객군
- C군: 안정적 기존 관계 고객군
- D군: 반응 낮고 이슈 민감 고객군

각 카드에는 다음 항목이 있어야 한다.

- 반응 신호
- 기회
- 리스크
- 주의점

### 7-3. 팀원 6명 카드

다음 팀원이 모두 표시되어야 한다.

- 신재영 대리
- 이대은 대리
- 박재욱 사원
- 유희관 과장
- 김문호 차장
- 김재호 차장

각 카드에는 다음 항목이 있어야 한다.

- 실행 신호
- 추천 역할

### 7-4. 리더의 1차 판단

확인 항목:

- 2주 집중 고객군 선택 dropdown이 동작한다.
- 제외 또는 후순위 고객군 선택 dropdown이 동작한다.
- 선택 이유 textarea 입력이 가능하다.
- 포기 비용과 리스크 textarea 입력이 가능하다.
- 입력 후 새로고침해도 localStorage에서 복구된다.

### 7-5. 팀원별 역할 배분

확인 항목:

- 6명 각각에 대해 역할 입력란이 표시된다.
- 기본 추천 역할이 들어 있다.
- 역할 수정이 가능하다.
- 수정 내용이 프롬프트에 반영된다.

### 7-6. AI 프롬프트 생성/복사

확인 항목:

- 프롬프트 영역이 표시된다.
- 선택한 집중 고객군과 후순위 고객군이 프롬프트에 반영된다.
- 선택 이유와 포기 비용이 프롬프트에 반영된다.
- 팀원별 역할이 프롬프트에 반영된다.
- 프롬프트 복사 버튼이 동작한다.
- 복사 성공 또는 실패 안내 문구가 표시된다.

프롬프트 안전선 확인:

- 실제 고객명 입력 금지
- 병원명 입력 금지
- 의사명 입력 금지
- 내부 매출 수치 입력 금지
- 처방 수치 입력 금지
- 개인정보 입력 금지
- 미승인 효능 표현 금지
- 제품 효과 단정 금지
- 경쟁사 비방 금지
- 고객 압박 표현 금지

### 7-7. AI 답변 붙여넣기

확인 항목:

- AI 답변 붙여넣기 textarea가 표시된다.
- 긴 텍스트 입력이 가능하다.
- 새로고침 후 붙여넣은 답변이 복구된다.

### 7-8. AI 답변 감별

다음 감별 기준이 모두 표시된다.

- 고객군 데이터와 연결된 제안인가?
- 2주 안에 실행 가능한 행동인가?
- 팀원별 역할이 서로 다르게 설계되었는가?
- 팀 회의에서 바로 말할 수 있는 표현인가?
- 금지 표현이나 위험 표현이 없는가?
- 집중할 행동과 줄일 행동이 모두 있는가?
- 콜 후 24시간 내 행동이 명확한가?
- CRM 기록 기준이 구체적인가?

확인 항목:

- 체크박스가 동작한다.
- 감별 완료 수가 변경된다.
- 새로고침 후 체크 상태가 복구된다.

### 7-9. 컴플라이언스 위험 표현 제거

다음 위험 표현 후보가 표시된다.

- 효과가 확실합니다
- 경쟁 제품보다 우월합니다
- 반드시 사용해야 합니다
- 처방을 늘려야 합니다
- 고객을 설득해 전환시키십시오
- 병원별 처방 데이터를 바탕으로 압박하십시오
- 내부 전략상 반드시 밀어야 합니다

확인 항목:

- 위험 표현 체크박스가 동작한다.
- 체크된 위험 표현 수가 요약에 반영된다.

### 7-10. 현장형 수정

확인 항목:

- 현장형 수정 textarea가 표시된다.
- AI 답변에서 수정할 내용을 입력할 수 있다.
- 새로고침 후 입력값이 복구된다.

### 7-11. 최종 2주 콜플랜

다음 최종 산출물 입력란이 모두 표시된다.

1. 2주 집중 방향
2. 고객군별 접근 원칙
3. 팀원별 역할
4. 콜 전 준비자료
5. 콜 중 확인 질문
6. 콜 후 24시간 내 후속조치
7. CRM 기록 기준
8. 하지 않을 행동
9. 컴플라이언스 주의 표현
10. 팀장 회의 공유 문장

확인 항목:

- 각 입력란에 텍스트 입력이 가능하다.
- 새로고침 후 입력값이 복구된다.

### 7-12. 강사용 대시보드 요약성 정보

확인 항목:

- 선택 요약이 표시된다.
- 감별 요약이 표시된다.
- 강사용 토의 질문이 표시된다.
- 마지막 저장 시간이 표시된다.

## Step 8~13. 이후 단계 placeholder 확인

확인 항목:

- 실행행동 Map
- 본사 요청 현장 번역
- 이해관계자 메시지
- 성과대화 감별
- 1on1 코칭
- Wrap-up

각 단계에서 다음을 확인한다.

- 단계 제목이 표시된다.
- AI 안전선 안내가 표시된다.
- Previous / Next 버튼이 동작한다.
- 화면 깨짐이 없다.

## 기존 route 회귀 확인

v36 QA 후 반드시 기존 route를 확인한다.

### `/journey.html`

- 기존 운영 화면이 열린다.
- v36 화면이 나오면 실패이다.

### `/journey-v35-preview.html`

- v35 preview 화면이 열린다.
- v36 화면이 나오면 실패이다.

## QA 결과 기록 템플릿

```text
Date:
Tester:
Deployment URL:
Browser:
Device:

/journey.html regression: PASS / FAIL
/journey-v35-preview.html regression: PASS / FAIL
/journey-v36-preview.html render: PASS / FAIL
Step 1 entry save/restore: PASS / FAIL
Step 7 CustomerCallPlanLab render: PASS / FAIL
Prompt copy: PASS / FAIL
AI paste area: PASS / FAIL
Review checklist: PASS / FAIL
Risk expression checklist: PASS / FAIL
Final call plan fields: PASS / FAIL
localStorage restore: PASS / FAIL
Mobile/tablet layout: PASS / FAIL
Console errors: NONE / FOUND

Notes:
```
