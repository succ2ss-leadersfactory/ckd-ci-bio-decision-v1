# v41 Content and Function Parity Audit

## Purpose

Track the content and function gaps between the protected v40-vNext pilot route and the new isolated v41 preview lane.

v41 currently validates route isolation, navigation, storage separation, and a dedicated v41 file structure. It is **not yet a full content/function parity release** with v40.

## Protected source routes and files

Do not modify these while improving v41 parity:

- `/ckd-ai-lab.html`
- `/journey-v40-vnext-preview.html`
- `src/journey-v40-vnext-*.tsx`
- `src/journey-shell.tsx`
- `src/journey-v39-*.tsx`
- `/journey.html`
- `/journey-v39-preview.html`

## Target v41 route

- `/journey-v41-preview.html`

## Current browser QA baseline

| Area | Status | Notes |
| --- | --- | --- |
| v41 route access | Pass | `/journey-v41-preview.html` loads after Vite build input fix. |
| Existing pilot route protection | Pass | `/ckd-ai-lab.html` and `/journey-v40-vnext-preview.html` confirmed. |
| Step 1 gate | Pass | User confirmed. |
| Step 2 team signal depth | Improved, needs browser review | User noted the first v41 version was too shallow. v41 now adds visit, customer reaction, follow-up, coaching priority, and first coaching question per member. |
| Step 4~11 navigation | Pass | User confirmed. |
| v41 reset | Pass | User confirmed. |
| v40 content depth parity | Gap found | User noted v40 content has not fully migrated. |
| v40 function parity | Gap found | User noted feature differences remain. |

## Parity audit table

| Step | v41 file | Current status | Parity gap to check | Migration priority |
| --- | --- | --- | --- | --- |
| Step 1 gate | `src/journey-v41-app-preview.tsx` | Route/gate works | Compare v40 intro copy, participant context, and transition language. | Medium |
| Step 2 team signal | `src/journey-v41-app-preview.tsx` | Improved after user feedback | Confirm whether team member data now has enough field realism: role, territory, visit signal, customer reaction, follow-up, coaching need, risk priority, and first 1on1 question. | High |
| Step 3 AI safety | reused safety lab | Works structurally | Confirm whether v40 safety copy/guardrails are fully reflected. | Medium |
| Step 4 question refinement | `src/journey-v41-prompt-practice-review-lab.tsx` | Dedicated v41 Lab | Compare v40 prompts, examples, feedback depth, output review, and scoring/coach hints. | High |
| Step 5 market research | `src/journey-v41-pharma-strategy-research-lab.tsx` | Dedicated v41 Lab | Compare v40 research sources, market scenario depth, insight extraction, and strategy prompts. | High |
| Step 6 team standard | `src/journey-v41-performance-compact-cascade-lab.tsx` | Dedicated v41 Lab | Compare v40 performance cascade logic, team standard wording, and selection feedback. | High |
| Step 7 task instruction | `src/journey-v41-task-execution-bridge-lab.tsx` | Dedicated v41 Lab | Compare v40 task instruction details, examples, and coaching guidance. | High |
| Step 8 work priority | `src/journey-v41-task-priority-flow-lab.tsx` | Dedicated v41 Lab | Compare v40 ERRC/task-priority depth, add/drop logic, and review messages. | High |
| Step 9 task boundary | `src/journey-v41-task-boundary-coordination-lab.tsx` | Dedicated v41 Lab | Compare v40 role-boundary design, handoff guidance, and alignment prompts. | High |
| Step 10 people selection | `src/journey-v41-people-selection-lab.tsx` | Dedicated v41 Lab | Compare v40 people data, selection rationale, and feedback logic. | High |
| Step 11 one-on-one opening | `src/journey-v41-one-on-one-practice-lab.tsx` | Dedicated v41 Lab | Compare v40 1on1 dialogue practice depth, answer composition, reflection, and coaching script. | High |

## Functional parity checklist

| Function area | v41 status | Gap to verify |
| --- | --- | --- |
| Local storage isolation | Implemented | Confirm no `ckd.v40-vnext.*` keys are written by v41. |
| Reset behavior | Browser-confirmed | Confirm all v41 keys are cleared and v40 keys remain untouched. |
| Step navigation | Browser-confirmed | Confirm all step transitions preserve entered data. |
| Step 2 team signal view | Improved | Browser-check density, readability, tablet layout, and usefulness for later Step 10~11 people-management practice. |
| Input validation | Step 1 confirmed | Confirm Step 4~11 required input alerts or guidance match intended v40 behavior. |
| AI prompt output | Gap likely | Confirm v40 prompt templates, examples, and AI-ready output blocks are fully migrated. |
| Feedback/coaching hints | Gap likely | Confirm v40 feedback depth and field-language coaching are preserved. |
| Print/copy/export behavior | Unknown | Check whether v40 had copy/export functions not yet represented in v41. |
| Tablet/mobile readability | Pending | Complete visual QA after parity migration. |

## Recommended migration order

1. Step 2 team signal: review enriched member data in browser and refine field realism.
2. Step 4 question refinement: restore prompt examples, review depth, and coach hints.
3. Step 5 market research: restore source/insight/strategy depth.
4. Step 6 performance cascade: restore logic and decision feedback.
5. Step 7~9 task management: restore ERRC/task boundary depth and outputs.
6. Step 10~11 people management: restore people data, 1on1 practice depth, and reflection outputs.
7. Run static smoke and browser QA again.

## Working rule

Migrate content and functions into `src/journey-v41-*` files only. Do not edit protected v40/v39 source files.
