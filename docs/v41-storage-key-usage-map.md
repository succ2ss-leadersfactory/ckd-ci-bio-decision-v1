# v41 Storage Key Usage Map

## Purpose

This document maps current v41 localStorage keys before any storage-related optimization.

This is a documentation-only checkpoint. It does not change storage behavior, screen flow, route behavior, or component code.

Future optimization must update this map before renaming, merging, removing, or changing the semantics of any `ckd.v41.*` key.

## Source of truth

- Repository: `succ2ss-leadersfactory/ckd-ci-bio-decision-v1`
- Working branch: `feature/v37-preview-shell`
- Frozen visual baseline commit: `d4d52efc0b5071fc1ed2c70a21935b9e913ee347`
- Current Step 7 AI instruction flow head: `a85f1fcdc52fffa9f3b04bcf3423c13cc1fad121`
- Baseline route: `/journey-v41-preview.html`
- Shared helper: `src/journey-storage.ts`
- Storage isolation helper: `src/journey-v41-lab-storage-scope.tsx`

## Active v41 storage keys

| Storage key | Primary owner / writer | Reader / downstream dependency | Journey scope | Notes |
|---|---|---|---|---|
| `ckd.v41.participant.v1` | `src/journey-v41-app-preview.tsx` | `src/journey-v41-app-preview.tsx` | Step 1 entry gate | Participant identity and entry context. Must not be merged with lab state. |
| `ckd.v41.progress.v1` | `src/journey-v41-app-preview.tsx` | `src/journey-v41-app-preview.tsx` | Journey progress | Current visible step index. Must remain lightweight. |
| `ckd.v41.promptPracticeReview.v2` | `src/journey-v41-prompt-practice-review-lab.tsx` | Same lab | Step 3 | Prompt practice state. |
| `ckd.v41.pharmaStrategyResearch.v1` | `src/journey-v41-pharma-research-data.ts`, `src/journey-v41-pharma-strategy-research-lab.tsx` | Step 4~5 labs | Step 4 → Step 5 | Market/research context only. |
| `ckd.v41.performanceCascade.v1` | `src/journey-v41-performance-compact-cascade-lab.tsx` | `src/journey-v41-task-execution-bridge-lab.tsx` | Step 5 → Step 6 | Confirmed team strategy task, CSF, KPI, and initiative. Step 6 reads it as input, not as a target to rewrite. |
| `ckd.v41.performanceCascade.aiExpansion.v1` | `src/journey-v41-performance-ai-expansion-lab.tsx` | `src/journey-v41-task-execution-bridge-lab.tsx` | Step 5 AI expansion → Step 6 optional reference | Staged AI expansion funnel and final human review summary. Raw AI output remains reference-only. |
| `ckd.v41.taskManagement.v10` | `src/journey-v41-task-execution-bridge-lab.tsx`, `src/journey-v41-task-priority-flow-lab.tsx`, `src/journey-v41-task-boundary-coordination-lab.tsx` | `src/journey-v41-people-selection-lab.tsx`, `src/journey-v41-one-on-one-practice-lab.tsx` | Step 6~8 → Step 9~10 | Main task-management continuity key. Step 6 writes managed task, work output, selected work items, completion criteria, excluded work, final execution plan, and Step 7 handoff. Step 7 now writes `orderedWorkSteps`, `roleResponsibilityMap`, `scheduleCheckpoints`, `workloadAdjustments`, `step7AiPrompt`, `step7AiResult`, `step7HumanReview`, `taskInstructionDraft`, `finalTaskInstruction`, and `step7HandoffToStep8`. Step 8 reads only the task boundary / bottleneck / escalation-relevant handoff, not people-management judgments. |
| `ckd.v41.peopleManagement.v2` | `src/journey-v41-people-selection-lab.tsx`, `src/journey-v41-one-on-one-practice-lab.tsx` | Same two labs | Step 9~10 | People-management and 1on1 preparation state. |
| `ckd.v41.finalExecutionMemo.v1` | No active Step 1~10 owner confirmed | No active Step 1~10 reader confirmed | Reserved / bridge-only | `ckd.v41.finalExecutionMemo.v1` is Reserved / bridge-only. Do not merge it into `ckd.v41.peopleManagement.v2` without an explicit migration. |

## v40-vNext to v41 scoped bridge keys

`src/journey-v41-lab-storage-scope.tsx` defines inherited localStorage bridge pairs. These pairs are high-risk because they temporarily copy scoped v41 state into v40-vNext source keys and then restore the source snapshot on unmount.

| v40-vNext source key | v41 scoped key | Status |
|---|---|---|
| `ckd.v40-vnext.promptPracticeReview.v2` | `ckd.v41.promptPracticeReview.v2` | Inherited scoped bridge |
| `ckd.v40-vnext.pharmaStrategyResearch.v1` | `ckd.v41.pharmaStrategyResearch.v1` | Inherited scoped bridge |
| `ckd.v40-vnext.performanceCascade.v1` | `ckd.v41.performanceCascade.v1` | Inherited scoped bridge |
| `ckd.v40-vnext.taskManagement.v10` | `ckd.v41.taskManagement.v10` | Inherited scoped bridge |
| `ckd.v40-vnext.peopleManagement.v2` | `ckd.v41.peopleManagement.v2` | Inherited scoped bridge |
| `ckd.v40-vnext.finalExecutionMemo.v1` | `ckd.v41.finalExecutionMemo.v1` | Reserved / bridge-only |

## Continuity chain

The current storage continuity is:

1. `ckd.v41.participant.v1` starts the participant journey.
2. `ckd.v41.progress.v1` stores current step movement.
3. `ckd.v41.promptPracticeReview.v2` supports Step 3 prompt practice.
4. `ckd.v41.pharmaStrategyResearch.v1` captures Step 4 market/research context.
5. `ckd.v41.performanceCascade.v1` converts Step 4 context into Step 5 confirmed team strategy/CSF/KPI/initiative selections.
6. `ckd.v41.performanceCascade.aiExpansion.v1` stores optional staged Step 5 AI expansion and final human review summary.
7. `ckd.v41.taskManagement.v10` carries the task-management chain: Step 6 managed task/work output/work breakdown → Step 7 sequence, role, checkpoint, workload adjustment, AI-assisted task-instruction draft, and Step 8 handoff → Step 8 task boundary, bottleneck response, and escalation criteria.
8. `ckd.v41.peopleManagement.v2` converts later people-management state into Step 9~10 1on1 target, first sentence, questions, and action agreement.

## Step 5 AI expansion funnel

Step 5 AI expansion is a three-stage judgment funnel inside `ckd.v41.performanceCascade.aiExpansion.v1`.

```text
Stage 1: additional team strategy task candidates
→ human selects selectedAiTeamTask
Stage 2: CSF candidates for selectedAiTeamTask
→ human selects selectedAiCsf
Stage 3: KPI candidates for selectedAiCsf
→ human selects selectedAiKpi, selectedAiEvidence, selectedAiCycle
→ finalAiExpansionReview / review for Step 6
```

Step 4 context remains a reference compass, not the main generation criterion. Step 6 can proceed without Step 5 AI expansion; raw AI result is reference-only.

## Step 6 selectable managed-task, work-output, and work-breakdown rule

Approved rule:

```text
Step 5 confirmed team strategy/CSF/KPI
→ Step 6 managed-task type selection
→ managed-task candidate selection
→ work output, output location, completion standard, KPI connection check, CSF reflection check
→ optional AI result pasted into aiResult
→ AI result may be separated into workBreakdownDraft, workItemCompletionCriteria, and excludedWorkItems
→ user must select final work items in selectedWorkItems
→ Step 6 finalExecutionPlan and step6HandoffToStep7
→ Step 7 execution flow and work-instruction drafting
```

Step 6 boundaries:

- Do not re-evaluate the strategy task, CSF, or KPI.
- Do not create new CSF/KPI candidates.
- Do not finalize Step 6 from raw `aiResult` or draft `workBreakdownDraft` alone; `selectedWorkItems` is required before creating `finalExecutionPlan` or `step6HandoffToStep7`.
- Do not generate coaching questions, people-signal judgments, 1on1 targets, motivation messages, or team-member capability judgments.
- Do not design detailed role assignment, schedule, workload adjustment, bottleneck response, or escalation criteria in Step 6; those belong to Step 7~8.

## Step 7 AI task-instruction flow

Step 7 is no longer primarily a `할 일·줄일 일` selection screen. The legacy label may remain as a smoke marker, but the functional purpose is:

```text
6단계 실행계획 확인
→ 업무 순서 정하기
→ 역할과 책임 정하기
→ 일정과 체크포인트 정하기
→ 업무량 조정: 이번 주기에는 잠시 줄일 일
→ AI로 업무지시 초안 만들기
→ 사람 검토 후 최종 업무지시 확정
→ 8단계 업무 경계·병목 대응으로 넘기기
```

Step 7 AI practice writes these fields under `ckd.v41.taskManagement.v10`:

- `orderedWorkSteps`
- `roleResponsibilityMap`
- `scheduleCheckpoints`
- `workloadAdjustments`
- `step7AiPrompt`
- `step7AiResult`
- `step7HumanReview`
- `taskInstructionDraft`
- `finalTaskInstruction`
- `step7HandoffToStep8`

Step 7 boundaries:

- Do not reinterpret KPI, CSF, or strategy task.
- Do not judge team-member capability, attitude, motivation, or coaching need.
- Do not deeply analyze bottleneck causes or define escalation ownership; Step 7 may only prepare `step7HandoffToStep8`.
- The final Step 7 output is a task-instruction draft that includes work background, work sequence, output, completion standard, role/responsibility, schedule/checkpoints, and temporarily reduced work.

## Optimization rules

1. Do not rename any `ckd.v41.*` key without a migration or explicit version bump.
2. Do not merge participant/progress keys with lab-state keys.
3. Do not clear v40-vNext keys from a v41 reset.
4. If reset behavior is changed, it must be limited to the intended `ckd.v41.*` scope and must be browser-QA checked.
5. Any storage schema change must update this document first.
6. Any storage schema change must strengthen `scripts/smoke-v41-static.mjs` so the map and code cannot silently drift.
7. `ckd.v41.taskManagement.v10` is shared by Step 6~8 and downstream Step 9~10; changing its shape is high risk.
8. `ckd.v41.peopleManagement.v2` is shared by Step 9~10; changing it can break the final 1on1 flow.
9. `ckd.v41.performanceCascade.aiExpansion.v1` must remain separate from `ckd.v41.performanceCascade.v1`; Step 6 can read it only as reviewed candidate material.

## Open questions before storage code optimization

1. Is `V41LabStorageScope` currently mounted in the visible v41 app flow, or is it retained only as a parity/inheritance helper?
2. Is `ckd.v41.finalExecutionMemo.v1` intentionally reserved for future Step 10+ memo output, or should it remain bridge-only?
3. Should `ckd.v41.performanceCascade.aiExpansion.v1` remain separate from the Step 5 confirmed performance cascade key? Current decision: yes; Step 6 reads it as candidate material only.
4. Should `ckd.v41.taskManagement.v10` be split later, or is the shared Step 6~8 state intentional for continuity?

## Next safe step

Before any storage code change, add or strengthen a smoke guard that checks this document continues to list every active `ckd.v41.*` storage key used by the v41 files.
