# v41 Baseline Browser QA Confirmation

## Purpose

This document records the user-confirmed browser baseline before restarting any v41 optimization work.

The confirmation is intentionally recorded before code cleanup so that future optimization work can be judged against the real pre-optimization participant experience instead of a reconstructed or simplified shell.

## Confirmation status

- Confirmation status: confirmed by user
- Confirmation timing: after PR #4 was closed and before renewed optimization work
- Confirmed route: `/journey-v41-preview.html`
- Active working branch: `feature/v37-preview-shell`
- Current branch head when this confirmation was recorded: `0c1ac8e9a44fc1d3e81054e8afc401c36269b526`
- Frozen visual baseline commit: `d4d52efc0b5071fc1ed2c70a21935b9e913ee347`
- Frozen visual baseline short SHA: `d4d52ef`

## User-confirmed interpretation

The checked preview is treated as the pre-optimization normal version.

Future work must preserve the visible journey content and interaction flow. A change is not acceptable if it makes the preview look like a newly rebuilt clean shell, removes existing step content, or breaks the Step 5 to Step 10 continuity.

## Confirmed baseline expectations

The baseline is expected to preserve the following.

1. The participant entry experience at the start of the journey.
2. The 10-step journey structure.
3. The current v41 step labels.
4. The current Step 5 to Step 10 execution and people-management continuity.
5. The existing v41 lab components and behavior.
6. The independent preview route `/journey-v41-preview.html`.
7. The protected production and legacy preview routes.

## Current v41 flow to protect

1. 시작하기
2. 팀원 보기
3. 질문 다듬기
4. 시장 변화 읽기
5. 팀 기준 만들기
6. 업무관리 실행계획 만들기
7. 할 일·줄일 일
8. 업무 경계 나누기
9. 1on1 대상 고르기
10. 1on1 첫 문장

## Step 5 to Step 10 continuity to protect

- Step 5 selects team strategy task, CSF, KPI, and initiative candidate.
- Step 6 creates the execution plan and execution cycle.
- Step 7 converts the execution plan into priority and reduction flow.
- Step 8 converts the flow into task boundaries and people signals.
- Step 9 selects the 1on1 target from boundary and people signals.
- Step 10 creates opening line, check questions, and action agreement using the execution cycle.

## Protected routes and files

Do not modify these as part of renewed v41 optimization unless an explicit separate cutover decision is made.

- `/journey.html`
- `/ckd-ai-lab.html`
- `/journey-v39-preview.html`
- `/journey-v40-vnext-preview.html`
- `src/journey-active.tsx`
- `src/full-flow-journey-v34.tsx`
- `src/full-flow-journey-v35.tsx`
- `src/journey-v38-app-preview.tsx`
- `src/journey-v39-*`
- `src/journey-v40-vnext-*`

## Required next action before code cleanup

Before changing v41 code, add or strengthen a v41 preservation smoke guard that checks for the protected step labels and continuity markers. The guard should fail if the preview is reduced to placeholders or a clean shell.

## Optimization gate

A v41 optimization patch may proceed only when all of the following are true.

- The patch has a narrow, named purpose.
- The patch does not alter participant-visible screens unless explicitly approved.
- The v41 smoke guard still passes.
- Existing protected route smoke checks still pass.
- Browser QA confirms the preview still matches the user-confirmed baseline.

## Decision rule

If a proposed change improves code structure but changes the user-confirmed browser flow, stop the optimization and treat the change as a product redesign proposal, not as cleanup.
