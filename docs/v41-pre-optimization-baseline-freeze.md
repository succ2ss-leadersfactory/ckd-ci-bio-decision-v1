# v41 Pre-Optimization Baseline Freeze

## Purpose

This document freezes the pre-optimization v41 baseline before any further code cleanup or stabilization work.

The next optimization pass must preserve the existing journey content, screen flow, and data continuity. Optimization means code and validation cleanup only. It must not replace the current journey with a new clean shell.

## Frozen baseline

- Repository: `succ2ss-leadersfactory/ckd-ci-bio-decision-v1`
- Baseline branch: `feature/v37-preview-shell`
- Baseline commit: `d4d52efc0b5071fc1ed2c70a21935b9e913ee347`
- Baseline short SHA: `d4d52ef`
- Commit message shown in Vercel: `docs(v41): add latest automation baseline`
- Baseline route: `/journey-v41-preview.html`

## Non-negotiable preservation rules

The following must remain true after every optimization commit.

1. The v41 preview must keep the existing 10-step journey flow.
2. The first screen must keep the participant entry experience for team/name or equivalent existing input fields.
3. Step 1 through Step 10 labels must remain recognizable to the current participant flow.
4. Step 5 through Step 10 must keep the current data continuity.
5. No optimization commit may replace the v41 journey with a placeholder or clean shell.
6. No optimization commit may remove existing v41 lab components unless the same behavior is demonstrably preserved.
7. Browser QA must be performed before calling the optimization successful.

## Current v41 flow to preserve

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

## Step 5 to Step 10 continuity to preserve

- Step 5 selects team strategy task, CSF, KPI, and initiative candidate.
- Step 6 creates the execution plan and execution cycle.
- Step 7 converts the execution plan into priority and reduction flow.
- Step 8 converts the flow into task boundaries and people signals.
- Step 9 selects the 1on1 target from boundary and people signals.
- Step 10 creates opening line, check questions, and action agreement using the execution cycle.

## Protected routes and files

Do not modify these as part of v41 optimization unless a separate cutover decision is explicitly made.

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

## Baseline file set to inspect before optimization

At minimum, inspect these files before any optimization patch.

- `src/journey-v41-app-preview.tsx`
- `src/journey-v41-preview-config.ts`
- `src/journey-v41-ux-components.tsx`
- `src/journey-v41-progress-coach-panel.tsx`
- `src/journey-v41-prompt-practice-review-lab.tsx`
- `src/journey-v41-research-strategy-trimmed-lab.tsx`
- `src/journey-v41-performance-compact-cascade-lab.tsx`
- `src/journey-v41-performance-ai-expansion-lab.tsx`
- `src/journey-v41-task-execution-bridge-lab.tsx`
- `src/journey-v41-task-priority-flow-lab.tsx`
- `src/journey-v41-task-boundary-coordination-lab.tsx`
- `src/journey-v41-people-selection-lab.tsx`
- `src/journey-v41-one-on-one-practice-lab.tsx`

## Optimization allowed scope

Allowed only after visual baseline is confirmed.

- Remove or consolidate duplicated helper functions without changing behavior.
- Tighten storage access guards without changing storage semantics.
- Add or refine smoke guards that verify existing content is preserved.
- Narrow typecheck or smoke scope only if it still covers the existing v41 files.
- Improve documentation and QA runbooks.

## Optimization forbidden scope

Do not do the following.

- Do not rebuild v41 as a new clean shell.
- Do not replace real steps with placeholders.
- Do not delete Step 5 through Step 10 continuity.
- Do not remove participant/team entry behavior.
- Do not import from protected v39 or v40 files as a shortcut unless already present in the frozen baseline and explicitly reviewed.
- Do not claim browser QA without opening the actual preview route.

## Required QA before and after every optimization patch

### Before patch

- Open `/journey-v41-preview.html` from the frozen baseline preview.
- Capture or note the visible Step 1 entry state.
- Confirm the 10-step navigation is present.
- Confirm Step 5 through Step 10 content exists.

### After patch

- Re-open `/journey-v41-preview.html`.
- Confirm the same 10-step flow is still present.
- Confirm no screen was replaced by a placeholder.
- Confirm Step 5 through Step 10 continuity still works.
- Confirm refresh persistence for the current storage flow.
- Confirm browser console has no runtime errors.
- Confirm protected routes still open independently.

## Decision rule

If a code cleanup changes the participant experience, step labels, step content, or Step 5 to Step 10 data continuity, it is not an optimization. It is a product change and must be treated as a separate design decision.
