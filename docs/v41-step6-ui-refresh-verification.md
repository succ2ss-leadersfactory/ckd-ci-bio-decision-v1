# v41 Step 6 UI Refresh Verification

## Purpose

This document records a visible Step 6 UI refresh checkpoint after the Step 6 task-management workflow updates.

The branch contains Step 6 controls in `src/journey-v41-task-execution-bridge-lab.tsx` that separate raw AI output from extracted work-breakdown fields.

## Expected visible Step 6 UI markers

The Step 6 screen should show the following controls in the AI work-breakdown section:

- `AI 업무분해 프롬프트 만들기`
- `프롬프트 복사하기`
- `AI 결과에서 필요한 항목 추출하기`

The Step 6 screen should distinguish raw AI output from extracted fields:

- `AI 결과 붙여넣기 · 원문 보관`
- `AI 업무분해 초안 · 업무 단위 후보만`
- `업무별 완료 기준`
- `6단계에서 제외한 업무`

The final work-breakdown section should show this required field:

- `최종 선택한 업무 단위 3~5개`

The finalization button must not create the final execution plan or Step 7 handoff memo if `selectedWorkItems` is empty.

Expected alert text:

```text
최종 선택한 업무 단위 3~5개를 먼저 작성해 주세요. AI 결과를 붙여넣었다면 “AI 결과에서 필요한 항목 추출하기”를 누른 뒤, 실제로 사용할 업무 단위만 최종 선택 영역에 남겨 주세요.
```

## Step 6 extraction flow

```text
AI 결과 붙여넣기 · 원문 보관
→ AI 결과에서 필요한 항목 추출하기
→ 3번 업무 단위 후보는 AI 업무분해 초안으로 분리
→ 5번 완료 조건은 업무별 완료 기준으로 분리
→ 6번 제외 업무는 6단계에서 제외한 업무로 분리
→ 최종 선택한 업무 단위 3~5개로 압축·수정
→ 관리할 업무과제와 업무분해 확정하기
→ 최종 실행계획 + 7단계 전달 메모 생성
```

## Boundary rule

Raw AI output remains a source record only. Step 6 extraction may copy only relevant sections into draft fields. Step 6 finalization requires human-selected work items.

This checkpoint intentionally does not modify protected routes:

- `/journey.html`
- `/ckd-ai-lab.html`
- `/journey-v39-preview.html`
- `/journey-v40-vnext-preview.html`
