# v41 Visible Step to Component Map

## Purpose

This document freezes the current visible v41 10-step route-to-component mapping before deeper optimization.

This is a documentation-only checkpoint. It does not change component code, layout, copy, storage keys, state shape, route behavior, or the visible v41 learner flow.

## Source of truth

- Repository: `succ2ss-leadersfactory/ckd-ci-bio-decision-v1`
- Working branch: `feature/v37-preview-shell`
- PR: `#2 chore(v37): start isolated preview lane`
- Route: `/journey-v41-preview.html`
- App entry: `src/journey-v41-app-preview.tsx`
- Step labels: `src/journey-v41-preview-config.ts`
- Frozen visual baseline commit: `d4d52efc0b5071fc1ed2c70a21935b9e913ee347`
- Current Step 7 decision-led update head: `3d9c6b1b6bd313574fa1bb369eab28922472c56e`
- Current Step 8 boundary-bottleneck update head: `2778a56c40a0a723031bad35181899ebae91f00c`

## Protected routes and files

This mapping must not be used as a reason to modify the protected routes or legacy preview files.

Protected routes:

```text
/journey.html
/ckd-ai-lab.html
/journey-v39-preview.html
/journey-v40-vnext-preview.html
```

Protected source families:

```text
src/journey-active.tsx
src/full-flow-journey-v34.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
src/journey-v39-*
src/journey-v40-vnext-*
```

## Current 10-step mapping

| Visible step | Label | Component / source | Storage touched | Preservation note |
|---:|---|---|---|---|
| 1 | 시작하기 | `EntryStep` inside `src/journey-v41-app-preview.tsx` | `ckd.v41.participant.v1`, `ckd.v41.progress.v1` | Entry gate for team/name. Keep participant and progress separate from lab state. |
| 2 | 팀원 보기 | `RoleTeamIntroStep` / member profile section inside `src/journey-v41-app-preview.tsx` | none directly beyond progress | Static team/member profile review. Do not replace with a placeholder or remove member details. |
| 3 | 질문 다듬기 | `V41PromptPracticeReviewLab` in `src/journey-v41-prompt-practice-review-lab.tsx` | `ckd.v41.promptPracticeReview.v2` | Prompt-practice lab. Keep current scenario and review structure. |
| 4 | 시장 변화 읽기 | `V41ResearchStrategyTrimmedLab` → `V41PharmaStrategyResearchLab` | `ckd.v41.pharmaStrategyResearch.v1` | Market/research context source for Step 5. |
| 5 | 팀 기준 만들기 | `V41PerformanceCompactCascadeLab` + `V41PerformanceAiExpansionLab` | `ckd.v41.performanceCascade.v1`, `ckd.v41.performanceCascade.aiExpansion.v1` | Confirmed cascade and optional AI expansion remain separate. |
| 6 | 업무관리 실행계획 만들기 | `V41TaskExecutionBridgeLab` | reads `ckd.v41.performanceCascade.v1` and reviewed `ckd.v41.performanceCascade.aiExpansion.v1`; writes `ckd.v41.taskManagement.v10` | Pure task-management bridge: converts Step 5 criteria into work output, output location, completion standard, KPI connection check, CSF reflection check, work breakdown, and Step 7 handoff. |
| 7 | 업무 순서·업무지시 | `V41TaskPriorityFlowLab` | `ckd.v41.taskManagement.v10` | Converts Step 6 work units into a decision-led sequence, role/responsibility matrix, checkpoints, workload adjustment, AI-assisted work-instruction draft, review checklist, and Step 8 handoff. Legacy smoke marker retained: `할 일·줄일 일`. |
| 8 | 업무 경계·병목 대응 | `V41TaskBoundaryCoordinationLab` | `ckd.v41.taskManagement.v10` | Converts Step 7 work instruction and handoff into task boundaries, process bottleneck signals, escalation criteria, leader intervention criteria, and observation-only Step 9 handoff. Legacy smoke marker retained: `업무 경계 나누기`. |
| 9 | 1on1 대상 고르기 | `V41PeopleSelectionLab` | reads `ckd.v41.taskManagement.v10`; writes `ckd.v41.peopleManagement.v2` | Starts the people-management layer after the task-management work is complete. |
| 10 | 1on1 첫 문장 | `V41OneOnOnePracticeLab` | reads `ckd.v41.taskManagement.v10`; reads/writes `ckd.v41.peopleManagement.v2` | Creates opening line, check questions, action agreement, and follow-up memo using the execution cycle. |

## App-level mounting structure

The visible v41 app currently builds the flow through the `screens` array in `src/journey-v41-app-preview.tsx`.

Current screen order:

```text
EntryStep
RoleTeamIntroStep
V41PromptPracticeReviewLab
V41ResearchStrategyTrimmedLab
V41PerformanceCompactCascadeLab / V41PerformanceAiExpansionLab
V41TaskExecutionBridgeLab
V41TaskPriorityFlowLab
V41TaskBoundaryCoordinationLab
V41PeopleSelectionLab
V41OneOnOnePracticeLab
```

## Critical Step 5~10 handoff chain

The following chain must remain intact during optimization:

```text
Step 5: ckd.v41.performanceCascade.v1
→ Step 6~8: ckd.v41.taskManagement.v10
→ Step 9~10: ckd.v41.peopleManagement.v2
```

The broader strategy-to-people continuity is:

```text
ckd.v41.pharmaStrategyResearch.v1
→ ckd.v41.performanceCascade.v1
→ ckd.v41.taskManagement.v10
→ ckd.v41.peopleManagement.v2
```

## Component-specific optimization rules

### Step 1: `EntryStep`

Allowed later:

- extract simple helper names only,
- keep `ckd.v41.participant.v1` and `ckd.v41.progress.v1` separate,
- keep the entry gate behavior.

Not allowed:

- removing team/name gate,
- merging participant and progress state,
- changing reset behavior beyond a guarded v41-only reset scope.

### Step 2: `RoleTeamIntroStep`

Allowed later:

- extract static member data only if the rendered text stays equivalent,
- extract card wrapper only if layout and copy are unchanged.

Not allowed:

- shortening the member profiles,
- replacing the team view with a placeholder,
- changing the visible profile categories.

### Step 3: `V41PromptPracticeReviewLab`

Allowed later:

- tidy imports/types,
- extract repeated field/card helpers if copy and behavior stay unchanged.

Not allowed:

- changing the prompt criteria,
- changing `ckd.v41.promptPracticeReview.v2`,
- removing caution/rewrite guidance.

### Step 4: `V41ResearchStrategyTrimmedLab` / `V41PharmaStrategyResearchLab`

Allowed later:

- keep the wrapper thin,
- tidy helper imports.

Not allowed:

- breaking the `ckd.v41.pharmaStrategyResearch.v1` handoff,
- removing the Perplexity/NotebookLM/Studio flow markers,
- changing the research-to-performance handoff semantics.

### Step 5: `V41PerformanceCompactCascadeLab` / `V41PerformanceAiExpansionLab`

Allowed later:

- extract low-risk shared UI wrappers,
- keep AI expansion as optional review/reference.

Not allowed:

- merging `ckd.v41.performanceCascade.aiExpansion.v1` into `ckd.v41.performanceCascade.v1`,
- auto-applying AI expansion output to confirmed cascade state,
- changing direct manual selection of team task, CSF, KPI, and initiative.

### Step 6: `V41TaskExecutionBridgeLab`

Allowed later:

- keep Step 5 handoff readable,
- keep Step 5 criteria as input only,
- refine work-output and work-breakdown wording,
- preserve downstream-compatible `ckd.v41.taskManagement.v10` handoff fields.

Not allowed:

- re-evaluating or rewriting Step 5 team strategy task, CSF, or KPI,
- creating new CSF/KPI candidates,
- generating coaching questions, people-signal judgments, 1on1 targets, motivation messages, or team-member capability judgments,
- designing detailed role assignment, schedule, workload adjustment, bottleneck response, or escalation criteria in Step 6; those belong to Step 7~8,
- removing execution cycle,
- removing final execution plan or task instruction draft handoff.

### Step 7: `V41TaskPriorityFlowLab`

Allowed later:

- convert Step 6 work units into execution sequence,
- let participants choose execution sequence criteria instead of free-writing a full sequence,
- use a role/responsibility matrix for 주 실행, 팀장 확인, 협업 방식,
- let participants choose checkpoint timing, evidence, and questions,
- let participants choose workload reductions instead of writing all reductions manually,
- generate a work-instruction draft from selected decisions,
- use a review checklist before finalizing the instruction,
- prepare only Step 8 handoff candidates for boundary and bottleneck review.

Not allowed:

- redoing Step 6 work-output/work-breakdown,
- re-evaluating Step 5 performance criteria,
- generating people-management or coaching content,
- turning Step 7 bottleneck candidates into final escalation criteria,
- making free writing the primary learner action.

### Step 8: `V41TaskBoundaryCoordinationLab`

Allowed later:

- convert Step 7 execution flow and `step7HandoffToStep8` into task boundaries,
- add process bottlenecks and escalation criteria,
- add team-leader intervention criteria,
- separate task-management issues that should not be treated as people-management issues,
- keep bottleneck descriptions at the process/work level,
- send only observation facts into Step 9.

Not allowed:

- turning process bottlenecks into judgments about team-member attitude, motivation, or capability,
- selecting 1on1 targets before Step 9,
- generating coaching messages,
- redefining KPI, CSF, strategy task, or performance targets.

### Step 9: `V41PeopleSelectionLab`

Allowed later:

- read Step 8 task-boundary context,
- explicitly transition from task-management facts to people-management preparation.

Not allowed:

- changing `ckd.v41.peopleManagement.v2` without migration,
- auto-selecting a 1on1 target from Step 8 without user choice,
- treating Step 8 process bottlenecks as personality, attitude, or motivation judgments.

### Step 10: `V41OneOnOnePracticeLab`

Allowed later:

- refine opening-line phrasing,
- keep execution cycle reflection,
- keep shared helper extraction low-risk.

Not allowed:

- removing Step 9 preparation inputs,
- bypassing the action-agreement section,
- writing final memo into `ckd.v41.finalExecutionMemo.v1` without an explicit storage migration.

## Legacy smoke label note

The current navigation labels have been refreshed for Step 7 and Step 8, but these older labels remain in marker text and historical QA docs so existing smoke guards can detect accidental removal of the inherited flow:

```text
할 일·줄일 일
업무 경계 나누기
```
