# v41 Step 6 UI Refresh Verification

## Purpose

This document records a visible Step 6 UI refresh checkpoint after the Step 6 task-management workflow updates.

The branch already contains the Step 6 code markers below in `src/journey-v41-task-execution-bridge-lab.tsx`, but the browser preview may still show an older deployment until a fresh branch build is triggered.

## Expected visible Step 6 UI markers

The Step 6 screen should show the following controls in the AI work-breakdown section:

- `AI 업무분해 프롬프트 만들기`
- `프롬프트 복사하기`
- `AI 결과에서 업무분해 초안 만들기`

The final work-breakdown section should show this required field:

- `최종 선택한 업무 단위 3~5개`

The finalization button must not create the final execution plan or Step 7 handoff memo if `selectedWorkItems` is empty.

Expected alert text:

```text
최종 선택한 업무 단위 3~5개를 먼저 작성해 주세요. AI 결과를 붙여넣었다면 “AI 결과에서 업무분해 초안 만들기”를 누른 뒤, 실제로 사용할 업무 단위만 최종 선택 영역에 남겨 주세요.
```

## Step 6 operating flow

```text
AI 결과 붙여넣기
→ AI 결과에서 업무분해 초안 만들기
→ AI 업무분해 초안 확인
→ 최종 선택한 업무 단위 3~5개로 압축·수정
→ 관리할 업무과제와 업무분해 확정하기
→ 최종 실행계획 + 7단계 전달 메모 생성
```

## Boundary rule

Raw AI output remains a draft/reference only. Step 6 finalization requires human-selected work items.

This checkpoint intentionally does not modify protected routes:

- `/journey.html`
- `/ckd-ai-lab.html`
- `/journey-v39-preview.html`
- `/journey-v40-vnext-preview.html`
