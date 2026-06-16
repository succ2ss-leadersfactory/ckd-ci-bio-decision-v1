# v41 Storage Key Usage Map

## Purpose

This document maps current v41 localStorage keys before any storage-related optimization.

This is a documentation-only checkpoint. It does not change storage behavior, screen flow, route behavior, or component code.

Future optimization must update this map before renaming, merging, removing, or changing the semantics of any `ckd.v41.*` key.

## Source of truth

- Repository: `succ2ss-leadersfactory/ckd-ci-bio-decision-v1`
- Working branch: `feature/v37-preview-shell`
- Frozen visual baseline commit: `d4d52efc0b5071fc1ed2c70a21935b9e913ee347`
- Current Step 6 folded AI-review option head: `fc823f11e61d882610ec713568911ca5280ec23f`
- Baseline route: `/journey-v41-preview.html`
- Shared helper: `src/journey-storage.ts`
- Storage isolation helper: `src/journey-v41-lab-storage-scope.tsx`

## Active v41 storage keys

| Storage key | Primary owner / writer | Reader / downstream dependency | Journey scope | Notes |
|---|---|---|---|---|
| `ckd.v41.participant.v1` | `src/journey-v41-app-preview.tsx` | `src/journey-v41-app-preview.tsx`, navigation/entry checks | Step 1 entry gate | Stores team/name or equivalent participant identity fields and representative situation. Must not be merged with lab state. |
| `ckd.v41.progress.v1` | `src/journey-v41-app-preview.tsx` | `src/journey-v41-app-preview.tsx`, journey shell progress flow | Current step progress | Stores current step index. Must remain lightweight and independent from participant/lab data. |
| `ckd.v41.promptPracticeReview.v2` | `src/journey-v41-prompt-practice-review-lab.tsx` | Same lab; optional inherited storage scope bridge | Step 3 질문 다듬기 | Stores selected situation, basic/model prompt outputs, memo, prompt parts, checks, and caution rewrite. |
| `ckd.v41.pharmaStrategyResearch.v1` | `src/journey-v41-pharma-research-data.ts`, `src/journey-v41-pharma-strategy-research-lab.tsx` | `src/journey-v41-research-strategy-trimmed-lab.tsx`, `src/journey-v41-performance-compact-cascade-lab.tsx`, `src/journey-v41-performance-ai-expansion-lab.tsx` | Step 4 시장 변화 읽기 → Step 5 팀 기준 만들기 | Feeds market/research topic into Step 5 as reference context only. It should guide direction, not become the main generation criterion for CSF/KPI. |
| `ckd.v41.performanceCascade.v1` | `src/journey-v41-performance-compact-cascade-lab.tsx` | `src/journey-v41-task-execution-bridge-lab.tsx` | Step 5 → Step 6 | Stores selected team strategy task, CSF, KPI, initiative, and execution standard fields. It is the main Step 5 confirmed handoff key. Step 6 reads it as an input, not as a target to rewrite. |
| `ckd.v41.performanceCascade.aiExpansion.v1` | `src/journey-v41-performance-ai-expansion-lab.tsx` | `src/journey-v41-performance-ai-expansion-lab.tsx`, `src/journey-v41-task-execution-bridge-lab.tsx` | Step 5 AI expansion → Step 6 reviewed handoff | Keeps the same v1 key but now stores a staged AI expansion funnel: team-task prompt/result/selection, CSF prompt/result/selection, KPI prompt/result/selection/evidence/cycle, and final human review summary. Step 6 may use the final human review summary as optional reference material for managed-task/work-output/work-breakdown only. In the Step 6 UI, this remains a folded optional control inside the AI work-breakdown card, not a standalone required block. Raw AI output remains reference-only. |
| `ckd.v41.taskManagement.v10` | `src/journey-v41-task-execution-bridge-lab.tsx`, `src/journey-v41-task-priority-flow-lab.tsx`, `src/journey-v41-task-boundary-coordination-lab.tsx` | `src/journey-v41-people-selection-lab.tsx`, `src/journey-v41-one-on-one-practice-lab.tsx` | Step 6~8 → Step 9~10 | Main task-management continuity key. Step 6 writes selectable managed-task fields such as `managementTaskType`, `selectedTaskCandidate`, `managementTask`, `managementTaskReason`, `includedWorkScope`, `excludedWorkScope`, and a recommended `executionCycle` used only as a planning reference before Step 7 finalizes real checkpoints. The current managed-task type model uses five expert-classified conversion types: 기준 정렬형, 산출물 작성형, 기록·현황 정리형, 누락·품질 보완형, 다음 행동 연결형. It also writes `selectedOutput`, `outputLocation`, `completionStandard`, `outputKpiConnection`, `outputCsfConnection`, `workBreakdownDraft`, `selectedWorkItems`, `workItemCompletionCriteria`, `excludedWorkItems`, and `step6HandoffToStep7`. Step 7 should convert those work units into sequence, roles, checkpoints, workload adjustment, and work-instruction draft. Step 8 should convert the execution flow into task boundaries, bottlenecks, and escalation criteria. |
| `ckd.v41.peopleManagement.v2` | `src/journey-v41-people-selection-lab.tsx`, `src/journey-v41-one-on-one-practice-lab.tsx` | Same two labs | Step 9~10 | Stores selected 1on1 member, observed fact, interpretation, conversation purpose, opening line, check questions, action agreement, and follow-up memo. |
| `ckd.v41.finalExecutionMemo.v1` | No active Step 1~10 owner confirmed in the current map | No active Step 1~10 reader confirmed in the current map | Reserved / inherited scope only | Defined in `V41_STORAGE_SCOPE_KEYS` as a v40-vNext scoped bridge. Do not remove or rename without a parity audit. |

## v40-vNext to v41 scoped bridge keys

`src/journey-v41-lab-storage-scope.tsx` defines inherited localStorage bridge pairs. These pairs are high-risk because they temporarily copy scoped v41 state into v40-vNext source keys and then restore the source snapshot on unmount.

| v40-vNext source key | v41 scoped key | Status |
|---|---|---|
| `ckd.v40-vnext.promptPracticeReview.v2` | `ckd.v41.promptPracticeReview.v2` | Inherited scoped bridge |
| `ckd.v40-vnext.pharmaStrategyResearch.v1` | `ckd.v41.pharmaStrategyResearch.v1` | Inherited scoped bridge |
| `ckd.v40-vnext.performanceCascade.v1` | `ckd.v41.performanceCascade.v1` | Inherited scoped bridge |
| `ckd.v40-vnext.taskManagement.v10` | `ckd.v41.taskManagement.v10` | Inherited scoped bridge |
| `ckd.v40-vnext.peopleManagement.v2` | `ckd.v41.peopleManagement.v2` | Inherited scoped bridge |
| `ckd.v40-vnext.finalExecutionMemo.v1` | `ckd.v41.finalExecutionMemo.v1` | Reserved / inherited scoped bridge |

## Continuity chain

The current storage continuity is:

1. `ckd.v41.participant.v1` starts the participant journey.
2. `ckd.v41.progress.v1` stores current step movement.
3. `ckd.v41.promptPracticeReview.v2` supports Step 3 prompt practice.
4. `ckd.v41.pharmaStrategyResearch.v1` captures Step 4 market/research context.
5. `ckd.v41.performanceCascade.v1` converts Step 4 context into Step 5 confirmed team strategy/CSF/KPI/initiative selections.
6. `ckd.v41.performanceCascade.aiExpansion.v1` stores the staged Step 5 AI expansion funnel and final human review summary.
7. `ckd.v41.taskManagement.v10` now carries the pure task-management chain: Step 6 expert-classified managed-task type, recommended management period, work output, and work breakdown → Step 7 execution sequence, responsibility, checkpoint, workload adjustment, and instruction draft → Step 8 task boundary, bottleneck response, and escalation criteria.
8. `ckd.v41.peopleManagement.v2` converts the later people-management step into Step 9~10 1on1 target, first sentence, questions, and action agreement.

## Step 5 AI expansion funnel

Step 5 AI expansion is now a three-stage judgment funnel inside the existing `ckd.v41.performanceCascade.aiExpansion.v1` key.

```text
Stage 1: additional team strategy task candidates
→ human selects selectedAiTeamTask
Stage 2: CSF candidates for selectedAiTeamTask
→ human selects selectedAiCsf
Stage 3: KPI candidates for selectedAiCsf
→ human selects selectedAiKpi, selectedAiEvidence, selectedAiCycle
→ finalAiExpansionReview / review for Step 6
```

Step 4 context-weight rule:

- Step 4 market/research context is a reference compass, not the main generation criterion.
- Stage 1 may use Step 4 context to keep direction, but it should prioritize team-level execution and confirmation.
- Stage 2 should prioritize the selected additional team strategy task over repeating enterprise wording.
- Stage 3 should prioritize the selected CSF, field evidence, and 2~4 week manageability over enterprise-level outcome metrics.

Compatibility rule:

- The existing `prompt`, `result`, and `review` fields remain for Step 6 compatibility.
- The latest stage prompt/result may still mirror into `prompt` and `result`.
- Step 6 may use `review` only as optional human-reviewed reference material.

## Step 6 expert-classified managed-task type model

Step 6 uses task types based on how Step 5 performance criteria become manageable work. These are not people-management categories and are not final schedule/checkpoint categories.

| Step 6 task type | Conversion logic | Recommended period |
|---|---|---|
| 기준 정렬형 | CSF → 업무 기준 | 2주 |
| 산출물 작성형 | KPI → 확인 증거물 | 2주 |
| 기록·현황 정리형 | 실행 흔적 → 확인 가능한 현황 | 1주 |
| 누락·품질 보완형 | 성과 저해 요인 → 보완 업무 | 1주 |
| 다음 행동 연결형 | 기록 → 다음 행동 | 2주 |

`확인 체계형` is intentionally not a Step 6 type. Confirmation/checkpoint design belongs to Step 7, while bottleneck and escalation handling belongs to Step 8. Legacy stored values of `기준 통일형`, `기록 정리형`, and `누락 보완형` should be normalized to the refined names; legacy `확인 체계형` should require reselection.

## Step 6 selectable managed-task, work-output, and work-breakdown rule

Step 6 may read `ckd.v41.performanceCascade.v1` and the reviewed summary in `ckd.v41.performanceCascade.aiExpansion.v1`, but it must remain a pure task-management step.

Approved rule:

```text
Step 5 confirmed team strategy/CSF/KPI
→ Step 6 managed-task type selection based on performance-to-work conversion logic
→ managed-task candidate selection
→ short user edit of the selected managed task
→ recommended management period as a planning reference only
→ work output, output location, completion standard, KPI connection check, CSF reflection check, work breakdown
→ ckd.v41.taskManagement.v10 step6HandoffToStep7 / taskInstructionDraft
→ Step 7 execution flow and work-instruction drafting
```

Step 6 boundaries:

- Do not re-evaluate the strategy task, CSF, or KPI.
- Do not create new CSF/KPI candidates.
- Do not require free-text creation of the managed task as the primary path; use managed-task type and candidate selection first.
- Do not treat the Step 6 recommended management period as the final schedule; actual start date, midpoint check, deadline, and checkpoint design belong to Step 7.
- Do not keep `확인 체계형` as a Step 6 type; detailed checking cadence and checkpoint design belong to Step 7.
- Do not show Step 5 AI expansion as a standalone required Step 6 block. If present, it must stay folded under the Step 6 AI work-breakdown card as an optional reference.
- Do not generate coaching questions, people-signal judgments, 1on1 targets, motivation messages, or team-member capability judgments.
- Do not design detailed role assignment, schedule, workload adjustment, bottleneck response, or escalation criteria in Step 6; those belong to Step 7~8.
- Step 6 may only check whether the selected work output helps confirm the Step 5 KPI and whether the work breakdown does not miss the Step 5 CSF.

## Step 6 AI expansion handoff rule

Step 6 may read `ckd.v41.performanceCascade.aiExpansion.v1`, but the AI expansion must remain optional candidate/reference material.

Approved rule:

```text
AI-generated additional strategy/CSF/KPI candidates
→ Step 5 staged human selections and final review summary
→ Step 6 optional folded reference inside the AI work-breakdown card
→ ckd.v41.taskManagement.v10 Step 6 handoff to Step 7
```

Human review gate:

- Raw AI `result` is reference-only.
- Step 6 cannot create the AI application note from raw AI `result` alone.
- Step 5 human `review` is required before Step 6 can bring AI-expansion reference material into its work-breakdown note.
- Step 6 can proceed without Step 5 AI expansion; the default path uses only the Step 5 confirmed team strategy/CSF/KPI and the Step 6 managed task.
- The Step 6 UI must make this path look optional: default-collapsed, placed inside the AI work-breakdown card, and labeled as 선택 사항.
- Final Step 6 output may include only the Step 6 `aiExpansionAppliedNote`, not unreviewed raw AI output.

Non-goals:

- Do not auto-overwrite `ckd.v41.performanceCascade.v1` with AI expansion output.
- Do not treat raw AI output as a confirmed team standard.
- Do not send unreviewed AI candidates into Step 7, Step 8, Step 9, or Step 10.

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

These should be answered before changing storage code.

1. Is `V41LabStorageScope` currently mounted in the visible v41 app flow, or is it retained only as a parity/inheritance helper?
2. Is `ckd.v41.finalExecutionMemo.v1` intentionally reserved for future Step 10+ memo output, or should it remain bridge-only?
3. Should `ckd.v41.performanceCascade.aiExpansion.v1` remain separate from the Step 5 confirmed performance cascade key? Current decision: yes; Step 6 reads it as candidate material only.
4. Should `ckd.v41.taskManagement.v10` be split later, or is the shared Step 6~8 state intentional for continuity?

## Next safe step

Before any storage code change, add a smoke guard that checks this document continues to list every active `ckd.v41.*` storage key used by the v41 files.
