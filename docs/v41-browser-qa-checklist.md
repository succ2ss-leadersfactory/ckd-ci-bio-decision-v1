# v41 Browser QA Checklist

Target route: `/journey-v41-preview.html`

Use a cache-busting query when checking a new commit:

```text
/journey-v41-preview.html?v=<short-sha>
```

## Global checks

- [ ] No development/version banner is visible above the app.
- [ ] Protected routes are not affected: `/journey.html`, `/ckd-ai-lab.html`, `/journey-v39-preview.html`, `/journey-v40-vnext-preview.html`.
- [ ] The visible journey has 10 steps.
- [ ] Only the overall journey uses the word `단계` as the main navigation unit.
- [ ] Internal work units read as activities, decisions, work, or practice rather than nested journey steps where already revised.
- [ ] Local storage keys remain in the v41 namespace.

## Step 1. 시작하기

- [ ] Team selection works.
- [ ] Name/nickname input works.
- [ ] The next button is gated until required fields are entered.
- [ ] Reset button clears v41 input only.

## Step 2. 팀원 보기

- [ ] The team leader profile is visible.
- [ ] Seven team member cards are visible.
- [ ] Each member card shows career, role, work style, communication style, strength, risk, and note.
- [ ] Member cards show the `9단계에서 다시 볼 신호` connection label.
- [ ] The visual emphasis helps connect Step 2 to Step 9 people-management selection.

## Step 3. 질문 다듬기

- [ ] Stage overview hero appears after the flow strip.
- [ ] Prompt practice input and copy actions work.
- [ ] The screen language focuses on work context rather than tool operation only.

## Step 4. 시장 변화 읽기

- [ ] Stage overview hero appears after the flow strip.
- [ ] The market research flow infographic is visible.
- [ ] Inner sections use activity labels such as `활동 ①`.
- [ ] Strategy task selection works.
- [ ] URL extraction and copy action work.
- [ ] Prompt preview boxes are compact enough not to dominate the screen.
- [ ] The handoff card to Step 5 is visible at the bottom.

## Step 5. 팀 기준 만들기

- [ ] Team strategy task, team CSF, and team KPI can be written or selected.
- [ ] AI expansion remains clearly separate from confirmed team criteria.
- [ ] The handoff card to Step 6 is visible.

## Step 6. 업무관리 실행계획 만들기

- [ ] Work-management infographic is visible.
- [ ] Current-step emphasis highlights the work-task and output area.
- [ ] Step 5 criteria are available as context.
- [ ] The user can define managed task, output, work units, completion criteria, and excluded work.
- [ ] The handoff card to Step 7 is visible.

## Step 7. 업무 순서·업무지시

- [ ] Work-management infographic is visible.
- [ ] Current-step emphasis highlights the work-instruction area.
- [ ] Decision-led options are visible.
- [ ] AI prompt/result panels are visually distinct.
- [ ] Textarea focus state is visible.
- [ ] The handoff card to Step 8 is visible.

## Step 8. 업무 경계·병목 대응

- [ ] Work-management infographic is visible.
- [ ] Current-step emphasis highlights the boundary/bottleneck area.
- [ ] Work issue and people issue are separated.
- [ ] Observation-only handoff to Step 9 is visible.

## Step 9. 사람관리 1: 대상 선택

- [ ] People-management infographic is visible.
- [ ] Current-step emphasis highlights observation, interpretation separation, and conversation focus.
- [ ] Member cards align conceptually with Step 2 profile information.
- [ ] A selected member, observed behavior, risky interpretation, and 1on1 focus can be saved.
- [ ] The handoff card to Step 10 is visible.

## Step 10. 사람관리 2: 1on1 실천

- [ ] People-management infographic is visible.
- [ ] Current-step emphasis highlights opening line, check questions, action agreement, and follow-up.
- [ ] Selected roleplay reaction style is visually clear.
- [ ] Roleplay panels are visually distinct.
- [ ] AI prompt/result panels are compact and readable.
- [ ] Final people-management memo is generated and editable.

## Acceptance notes

- [ ] The experience feels like a team leader judgment journey, not a tool tutorial.
- [ ] The learner can understand what each step receives and passes to the next step.
- [ ] Browser QA confirms that the visible v41 path is isolated from protected operating routes.
