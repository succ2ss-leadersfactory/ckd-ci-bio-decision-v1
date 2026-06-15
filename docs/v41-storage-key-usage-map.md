# v41 Storage Key Usage Map

## Purpose

This document maps current v41 localStorage keys before any storage-related optimization.

This is a documentation-only checkpoint. It does not change storage behavior, screen flow, route behavior, or component code.

Future optimization must update this map before renaming, merging, removing, or changing the semantics of any `ckd.v41.*` key.

## Source of truth

- Repository: `succ2ss-leadersfactory/ckd-ci-bio-decision-v1`
- Working branch: `feature/v37-preview-shell`
- Frozen visual baseline commit: `d4d52efc0b5071fc1ed2c70a21935b9e913ee347`
- Current pre-storage-optimization head before this document: `a70598c0bdd1ca38b82991f447fe064089b13b5b`
- Baseline route: `/journey-v41-preview.html`
- Shared helper: `src/journey-storage.ts`
- Storage isolation helper: `src/journey-v41-lab-storage-scope.tsx`

## Active v41 storage keys

| Storage key | Primary owner / writer | Reader / downstream dependency | Journey scope | Notes |
|---|---|---|---|---|
| `ckd.v41.participant.v1` | `src/journey-v41-app-preview.tsx` | `src/journey-v41-app-preview.tsx`, navigation/entry checks | Step 1 entry gate | Stores team/name or equivalent participant identity fields and representative situation. Must not be merged with lab state. |
| `ckd.v41.progress.v1` | `src/journey-v41-app-preview.tsx` | `src/journey-v41-app-preview.tsx`, journey shell progress flow | Current step progress | Stores current step index. Must remain lightweight and independent from participant/lab data. |
| `ckd.v41.promptPracticeReview.v2` | `src/journey-v41-prompt-practice-review-lab.tsx` | Same lab; optional inherited storage scope bridge | Step 3 질문 다듬기 | Stores selected situation, basic/model prompt outputs, memo, prompt parts, checks, and caution rewrite. |
| `ckd.v41.pharmaStrategyResearch.v1` | `src/journey-v41-pharma-research-data.ts`, `src/journey-v41-pharma-strategy-research-lab.tsx` | `src/journey-v41-research-strategy-trimmed-lab.tsx`, `src/journey-v41-performance-compact-cascade-lab.tsx`, `src/journey-v41-performance-ai-expansion-lab.tsx` | Step 4 시장 변화 읽기 → Step 5 팀 기준 만들기 | Feeds market/research topic into Step 5 team strategy, CSF, KPI, and AI expansion work. |
| `ckd.v41.performanceCascade.v1` | `src/journey-v41-performance-compact-cascade-lab.tsx` | `src/journey-v41-task-execution-bridge-lab.tsx` | Step 5 → Step 6 | Stores selected team strategy task, CSF, KPI, initiative, and execution standard fields. It is the main Step 5 handoff key. |
| `ckd.v41.performanceCascade.aiExpansion.v1` | `src/journey-v41-performance-ai-expansion-lab.tsx` | Same lab; human review reference before Step 6 | Step 5 AI expansion | Stores AI prompt, result, and human review. Do not treat this as a replacement for `ckd.v41.performanceCascade.v1`. |
| `ckd.v41.taskManagement.v10` | `src/journey-v41-task-execution-bridge-lab.tsx`, `src/journey-v41-task-priority-flow-lab.tsx`, `src/journey-v41-task-boundary-coordination-lab.tsx` | `src/journey-v41-people-selection-lab.tsx`, `src/journey-v41-one-on-one-practice-lab.tsx` | Step 6~8 → Step 9~10 | Main execution-management continuity key. Stores execution cycle, final execution plan, priority/reduction flow, boundary declaration, bottleneck signal, and people signal. |
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
5. `ckd.v41.performanceCascade.v1` converts Step 4 context into Step 5 team strategy/CSF/KPI/initiative selections.
6. `ckd.v41.taskManagement.v10` converts Step 5 standards into Step 6~8 execution, priority, reduction, and boundary decisions.
7. `ckd.v41.peopleManagement.v2` converts Step 8 signals into Step 9~10 1on1 target, first sentence, questions, and action agreement.

## Optimization rules

1. Do not rename any `ckd.v41.*` key without a migration or explicit version bump.
2. Do not merge participant/progress keys with lab-state keys.
3. Do not clear v40-vNext keys from a v41 reset.
4. If reset behavior is changed, it must be limited to the intended `ckd.v41.*` scope and must be browser-QA checked.
5. Any storage schema change must update this document first.
6. Any storage schema change must strengthen `scripts/smoke-v41-static.mjs` so the map and code cannot silently drift.
7. `ckd.v41.taskManagement.v10` is shared by Step 6~8 and downstream Step 9~10; changing its shape is high risk.
8. `ckd.v41.peopleManagement.v2` is shared by Step 9~10; changing it can break the final 1on1 flow.

## Open questions before storage code optimization

These should be answered before changing storage code.

1. Is `V41LabStorageScope` currently mounted in the visible v41 app flow, or is it retained only as a parity/inheritance helper?
2. Is `ckd.v41.finalExecutionMemo.v1` intentionally reserved for future Step 10+ memo output, or should it remain bridge-only?
3. Should `ckd.v41.performanceCascade.aiExpansion.v1` remain separate from the Step 5 confirmed performance cascade key?
4. Should `ckd.v41.taskManagement.v10` be split later, or is the shared Step 6~8 state intentional for continuity?

## Next safe step

Before any storage code change, add a smoke guard that checks this document continues to list every active `ckd.v41.*` storage key used by the v41 files.
