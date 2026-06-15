# v41 Storage Scope Audit

## Purpose

This document records the storage-scope audit before any v41 code optimization.

This is a documentation-only checkpoint. It does not change component code, route behavior, storage behavior, layout, labels, state shape, or the visible 10-step v41 journey.

## Source of truth

- Repository: `succ2ss-leadersfactory/ckd-ci-bio-decision-v1`
- Working branch: `feature/v37-preview-shell`
- PR: `#2 chore(v37): start isolated preview lane`
- Baseline route: `/journey-v41-preview.html`
- Frozen visual baseline commit: `d4d52efc0b5071fc1ed2c70a21935b9e913ee347`
- Audit input head: `b7a49175f31e5bbaba14ab2dd99c7affbd71c0b9`
- Existing storage map: `docs/v41-storage-key-usage-map.md`

## Files checked

- `src/journey-v41-app-preview.tsx`
- `src/journey-v41-lab-storage-scope.tsx`
- `src/journey-v41-prompt-practice-review-lab.tsx`
- `src/journey-v41-pharma-research-data.ts`
- `src/journey-v41-pharma-strategy-research-lab.tsx`
- `src/journey-v41-research-strategy-trimmed-lab.tsx`
- `src/journey-v41-performance-compact-cascade-lab.tsx`
- `src/journey-v41-performance-ai-expansion-lab.tsx`
- `src/journey-v41-task-execution-bridge-lab.tsx`
- `src/journey-v41-task-priority-flow-lab.tsx`
- `src/journey-v41-task-boundary-coordination-lab.tsx`
- `src/journey-v41-people-selection-lab.tsx`
- `src/journey-v41-one-on-one-practice-lab.tsx`
- `scripts/smoke-v41-static.mjs`

## Audit questions and decisions

### 1. Is `V41LabStorageScope` mounted in the visible v41 flow?

Decision: **No active mount confirmed in the visible 10-step v41 app.**

`src/journey-v41-lab-storage-scope.tsx` defines `V41LabStorageScope` and `V41_STORAGE_SCOPE_KEYS`, but `src/journey-v41-app-preview.tsx` mounts the visible steps directly through `screens` and does not wrap the visible flow with `V41LabStorageScope`.

Current meaning:

- The file is retained as an inherited v40-vNext bridge/isolation helper.
- It is covered by `scripts/smoke-v41-static.mjs` as a preservation marker.
- It should not be treated as the active storage lifecycle for the visible v41 route unless a future commit explicitly imports and mounts it.

Optimization rule:

- Do not delete or rewrite `V41LabStorageScope` during low-risk optimization.
- Before mounting it later, add a reset-scope guard and browser QA because it temporarily copies v41 scoped values into v40-vNext source keys and restores them on unmount.

### 2. Is `ckd.v41.finalExecutionMemo.v1` active, reserved, or bridge-only?

Decision: **Reserved / bridge-only in the current visible v41 10-step flow.**

`ckd.v41.finalExecutionMemo.v1` is defined only as part of the inherited scope pair in `V41_STORAGE_SCOPE_KEYS`:

```text
ckd.v40-vnext.finalExecutionMemo.v1 -> ckd.v41.finalExecutionMemo.v1
```

No active Step 1~10 owner/writer or reader was confirmed in the visible v41 app files checked for this audit.

Current meaning:

- It should remain documented in `docs/v41-storage-key-usage-map.md` because the storage-scope helper still defines it.
- It should not be counted as an active visible Step 10 output key.
- It should not be removed until a parity audit confirms whether v40-vNext final memo behavior must be preserved or intentionally dropped from v41.

Optimization rule:

- Keep `ckd.v41.finalExecutionMemo.v1` as a reserved bridge key for now.
- Do not merge it into `ckd.v41.peopleManagement.v2` during low-risk optimization.
- If a future Step 10+ final memo is reintroduced, decide whether to reuse this key or version-bump it with an explicit migration note.

### 3. Should `ckd.v41.performanceCascade.aiExpansion.v1` stay separate from `ckd.v41.performanceCascade.v1`?

Decision: **Yes. Keep it separate.**

`ckd.v41.performanceCascade.v1` is the authoritative Step 5 handoff key. It stores the team strategy task, CSF, KPI, initiative, and execution-standard fields that Step 6 reads.

`ckd.v41.performanceCascade.aiExpansion.v1` stores the optional AI expansion artifact: AI prompt, AI result, and human review. It is useful for learning and review, but it is not the confirmed handoff state used by Step 6.

Current meaning:

- `performanceCascade.v1` = confirmed human-selected cascade state.
- `performanceCascade.aiExpansion.v1` = optional AI expansion/reference artifact.

Optimization rule:

- Do not merge these keys during helper cleanup.
- Do not allow AI expansion output to overwrite the confirmed cascade state automatically.
- A future optimization may add a clearer UI note that Step 6 uses the confirmed selection, not the raw AI expansion text.

### 4. Should `ckd.v41.taskManagement.v10` be split or kept shared?

Decision: **Keep it shared for now.**

`ckd.v41.taskManagement.v10` is the main continuity key for Step 6~8 and downstream Step 9~10.

Current responsibility chain:

1. Step 6 writes the confirmed team standard, execution cycle, execution tasks, evidence, mid-check questions, final execution plan, task instruction draft, default people signal, and boundary declaration.
2. Step 7 extends the same key with selected priority tasks, selected reduce tasks, flow steps, bottleneck signal, mid-check question, and execution declaration.
3. Step 8 extends the same key with boundary coordination fields, risk boundary, boundary declaration, and people signal.
4. Step 9 reads the same key to select a 1on1 target from the task boundary and people signal.
5. Step 10 reads the same key to reflect the Step 6 execution cycle and Step 8 boundary/people signal in the 1on1 opening flow.

Current meaning:

- The shared key is intentional for continuity across the task-management sequence.
- Splitting it would be a higher-risk migration because Step 6, Step 7, Step 8, Step 9, and Step 10 all depend on parts of the same evolving object.

Optimization rule:

- Keep `ckd.v41.taskManagement.v10` shared through the next low-risk helper cleanup phase.
- Any future split must be done as a dedicated migration with field-by-field mapping and browser QA.

### 5. Is v41 reset scoped correctly at the current code level?

Decision: **Current visible reset is scoped by prefix to `ckd.v41.*`.**

`src/journey-v41-app-preview.tsx` uses `removeStoredPrefix('ckd.v41.')` for the v41 reset button.

Current meaning:

- The visible reset should remove only `ckd.v41.*` keys.
- It should not remove `ckd.v40-vnext.*` keys because the prefix is different.
- This still deserves a dedicated guard in the next step because storage-scope helper behavior and reset behavior should not drift.

Optimization rule:

- Next recommended step remains `test(v41): guard storage reset scope`.
- The guard should prove that a v41 reset removes `ckd.v41.*` keys while preserving `ckd.v40-vnext.*` keys.

## Confirmed active v41 key model

| Key | Current audit status | Optimization decision |
|---|---|---|
| `ckd.v41.participant.v1` | Active visible Step 1 participant key | Keep separate from lab state |
| `ckd.v41.progress.v1` | Active visible journey progress key | Keep separate from participant/lab state |
| `ckd.v41.promptPracticeReview.v2` | Active Step 3 lab key | Keep as-is |
| `ckd.v41.pharmaStrategyResearch.v1` | Active Step 4 research key and Step 5 input | Keep as-is |
| `ckd.v41.performanceCascade.v1` | Active Step 5 confirmed cascade and Step 6 input | Keep as authoritative handoff |
| `ckd.v41.performanceCascade.aiExpansion.v1` | Active optional Step 5 AI expansion artifact | Keep separate from confirmed cascade |
| `ckd.v41.taskManagement.v10` | Active shared Step 6~8 key and Step 9~10 input | Keep shared until dedicated migration |
| `ckd.v41.peopleManagement.v2` | Active Step 9~10 people-management key | Keep shared across Step 9 and Step 10 |
| `ckd.v41.finalExecutionMemo.v1` | Reserved / bridge-only in current visible 10-step flow | Keep documented; do not remove yet |

## Storage continuity conclusion

The current visible v41 flow should continue to be protected as:

```text
ckd.v41.pharmaStrategyResearch.v1
→ ckd.v41.performanceCascade.v1
→ ckd.v41.taskManagement.v10
→ ckd.v41.peopleManagement.v2
```

This audit confirms that the above chain is the main Step 4~10 continuity path. The `V41LabStorageScope` bridge helper and `ckd.v41.finalExecutionMemo.v1` should remain preserved but should not drive the next low-risk refactor.

## Safe next step

Proceed to:

```text
test(v41): guard storage reset scope
```

The next guard should confirm:

1. `removeStoredPrefix('ckd.v41.')` removes v41 keys only.
2. `ckd.v40-vnext.*` keys survive a v41 reset.
3. participant/progress keys are not mixed with lab-state keys.
4. storage-scope bridge keys remain documented before any future mount or migration decision.

## Non-goals for this audit

This audit intentionally did not:

- change TypeScript or React code,
- rewrite Step components,
- change labels or layout,
- rename storage keys,
- split storage state,
- remove inherited bridge helpers,
- change protected routes.
