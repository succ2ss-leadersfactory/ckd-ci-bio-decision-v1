# v39 Deployment Browser QA Runbook

## 1. Purpose

This runbook is for checking the deployed v39 preview route in a real browser after the latest Actions are green.

Target route:

```text
/journey-v39-preview.html
```

Do not use this runbook against the production route:

```text
/journey.html
```

## 2. Latest stable baseline before this runbook

Verified commit before this runbook:

```text
56269504ed0d6a122d84259e0a9c58aa22b0c18d
```

Actions result:

```text
C1Bio MVP CI: success
v39 Smoke: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v40-lite Smoke: success
```

## 3. Deployment URL rule

Use the Vercel deployment URL generated from the current branch:

```text
feature/v37-preview-shell
```

The path to test must be:

```text
/journey-v39-preview.html
```

If the deployment domain changes, only the host should change. The route path should stay the same.

## 4. First-load checks

Open the deployed route and verify:

```text
Page loads without 404
No 502 Bad Gateway
No blank white screen
Title/header says C1바이오 영업팀장 AI 리더십 Lab Journey
Visible route is v39 preview, not production /journey.html
```

Open browser console and verify:

```text
No uncaught TypeError
No React blank root error
No localStorage access exception
No JSON parse exception that breaks rendering
No module loading error
```

## 5. Reset check

Click:

```text
진행 초기화
```

Then refresh the page.

Pass criteria:

```text
App returns to 1단계
Participant info is cleared
Step 3 prompt practice data is cleared
Step 5-7 stored data is cleared
Later v39 stored data is also cleared
```

Technical expectation:

```text
removeStoredPrefix('ckd.v39.')
```

## 6. Steps 1-3 browser QA

### Step 1

Verify:

```text
오늘은 C1바이오 영업팀장 역할로 판단합니다
팀명 선택 works
이름/닉네임 input works
역할 수락 checkbox works
Next navigation works
```

### Step 2

Verify:

```text
AI를 쓰기 전에 말해도 되는 선부터 확인합니다
실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보 입력 금지 안내가 보임
AI는 판단을 대신 정하는 도구가 아니라 팀장의 생각을 정리하고 넓히는 도구라는 메시지가 보임
```

### Step 3

Verify the optimized component is visible:

```text
우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기
일반 질문과 구조화 질문의 차이
역할·맥락·요청·출력 형식
4단계 AI 전략 리서치로 넘길 질문
```

Select one concern and verify:

```text
Prompt fields are prefilled
Copy button works
No old wording appears
```

Forbidden Step 3 wording:

```text
사내 시스템/CRM
고객군 × 팀원 실행 Map
신규 접점 실행 Map
팀원 역할 보완
8단계 기록 보완 담당
8단계 팀원별 역할 미션과 지원 포인트
실행 Map → 역할 보완
```

## 7. Steps 4-7 browser QA

### Step 4

Verify:

```text
3단계에서 선택한 우리 팀 고민 appears in the bridge card
4단계 AI 전략 리서치 연결 appears
Public/research framing is visible
No confidential-data request appears
```

### Step 5

Verify:

```text
관리 지표 선정 상태 appears
고객 Data 확인 List로 넘길 기준 appears
Select management metrics
Refresh keeps the selected state
```

### Step 6

Verify:

```text
고객 Data에서 확인할 단서 selection works
Step 5 metric context is visible
8단계에서는 이 대응 방향을 실행으로 옮기기 위해 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다 appears
Refresh keeps Step 6 data
```

Forbidden Step 6 wording:

```text
8단계에서 팀원별 역할과 지원 포인트를 정할 재료입니다
팀원별 영업활동 기록 품질 차이
```

### Step 7

Verify:

```text
고객군별 2주 대응 방향 appears
고객 Data 증거는 고객군이 아닙니다 appears
다음 단계: 코칭 대상 선정 appears or is clearly represented
8단계에서 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다 appears
Refresh keeps Step 7 data
```

Forbidden Step 7 wording:

```text
고객군 × 팀원 2주 실행 Map
팀원 연결 기준
실제 연결 후보
8단계는 역할 보완으로 이어집니다
팀원 연결 후보
팀원별 역할과 지원 포인트
팀원 연결도 확정 배정
```

## 8. Step 8 entry check

After Step 7, move to Step 8.

Verify:

```text
Screen title/identity is 코칭 대상 선정
7명의 팀원 유형 are shown as coaching reference models
Actual team member can be registered anonymously if the UI exposes that area
No work allocation map dominates the screen
No customer group × team member assignment appears
```

## 9. Mobile and tablet checks

Test at least one mobile or tablet viewport.

Pass criteria:

```text
Cards do not overflow horizontally
Step navigation is usable
Textareas are not too narrow
Copy buttons are tappable
진행 초기화 remains visible and usable
```

## 10. Final pass criteria

Browser QA can be marked pass if:

```text
The deployed v39 route loads successfully
Actions are green for the tested commit
Steps 1-7 complete without blank screens
Step 3 optimized prompt practice appears
Step 4 bridge reads Step 3 concern
Step 5 data persists after refresh
Step 6 reads Step 5 context and persists after refresh
Step 7 reads Step 6 evidence and persists after refresh
Step 8 opens as coaching target selection
진행 초기화 clears all v39 stored values
No CRM-first or old work-allocation wording appears
```

## 11. If QA fails

Record:

```text
Deployment URL
Browser and device
Step number
Exact visible wording or error
Console error if any
Screenshot if available
Latest tested commit SHA
```

Then fix only the v39 preview files unless the failure is in a shared helper already used by v39.

Protected files remain off-limits:

```text
journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```
