# v36 Preview QA Result

## QA status

Status: Automated checks passed / Pending full browser QA

## Scope

- Route: `/journey-v36-preview.html`
- Feature: v36 full 13-step Lab Journey preview
- Operating route protection: `/journey.html` remains v34
- v35 preview protection: `/journey-v35-preview.html` remains v35
- Verified commit: `fbb4685bec8a1ae1860b2ce03d158e77a6f8a10d` or later

## Implemented v36 steps

| Step | Lab | Status |
|---:|---|---|
| 1 | 입장 | Implemented |
| 2 | AI 안전선 | Implemented |
| 3 | 좋은 질문 만들기 | Implemented |
| 4 | AI Research 전략 Lab | Implemented |
| 5 | Source Check | Implemented |
| 6 | 팀원 Dashboard 분석 | Implemented / first-pass accepted |
| 7 | 고객군 판단 | Implemented |
| 8 | 실행행동 Map | Implemented |
| 9 | 본사 요청 현장 번역 | Implemented |
| 10 | 이해관계자 메시지 | Implemented |
| 11 | 성과대화 감별 | Implemented |
| 12 | 1on1 코칭 | Implemented |
| 13 | Wrap-up | Implemented |

## Automated checks

| Check | Status | Notes |
|---|---|---|
| `C1Bio MVP CI` | PASS | Existing CI remained passing |
| `v35 Smoke` | PASS | Regression guard passed |
| `v36 Smoke` | PASS | v36 route and typecheck passed |
| `Vercel` | PASS | Deployment status success |

## Browser QA checklist

| Area | Status | Notes |
|---|---|---|
| `/journey.html` regression | Pending | Must remain v34 operating route |
| `/journey-v35-preview.html` regression | Pending | Must remain v35 preview route |
| `/journey-v36-preview.html` render | Pending | Must render v36 title and 13-step flow |
| Step 1 Entry | Pending | Role acceptance, participant storage |
| Step 2 AI Safety | Pending | Risk types, safe rewrite, declaration |
| Step 3 Prompt Practice | Pending | `일반 질문 선택`, `질문 진단`, `좋은 질문 조건` wording |
| Step 4 Research Strategy | Pending | Perplexity → NotebookLM → Studio report/slides |
| Step 5 Source Check | Pending | Step 4 output import and risk expression check |
| Step 6 Dashboard Analysis | Pending | Causal diagnosis and prompt linkage |
| Step 7 Customer Call Plan | Pending | Focus/deprioritized segment and final call plan |
| Step 8 Action Map | Pending | Step 7 import and member action map |
| Step 9 HQ Translation | Pending | HQ language to field execution language |
| Step 10 Stakeholder Message | Pending | Stakeholder-specific messages |
| Step 11 Performance Dialogue | Pending | AI answer paste, review, final dialogue |
| Step 12 1on1 Coaching | Pending | Member intervention and coaching questions |
| Step 13 Wrap-up | Pending | 7-day plan, 30-day criteria, declaration, copy output |
| localStorage restore | Pending | Refresh after input should preserve values |
| Console snippet | Pending | Follow `docs/v36-browser-qa-console-snippet.md` |
| Mobile/tablet layout | Pending | No major overflow or blocked controls |
| Console errors | Pending | No blocking runtime errors |

## Required evidence

Record actual evidence after deployment/browser QA.

```text
Date:
Tester:
Deployment URL:
Browser:
Device:

/journey.html regression:
/journey-v35-preview.html regression:
/journey-v36-preview.html render:
Step 1 Entry:
Step 2 AI Safety:
Step 3 Prompt Practice:
Step 4 Research Strategy:
Step 5 Source Check:
Step 6 Dashboard Analysis:
Step 7 Customer Call Plan:
Step 8 Action Map:
Step 9 HQ Translation:
Step 10 Stakeholder Message:
Step 11 Performance Dialogue:
Step 12 OneOnOneCoaching:
Step 13 WrapUp:
localStorage restore:
Console snippet pass:
Mobile/tablet layout:
Console errors:

Final decision:
Notes:
```

## Decision options

- `PASS`: full browser QA passed, ready for first preview freeze
- `PASS WITH NOTES`: usable for pilot, minor UX/content notes remain
- `FAIL`: blocking render/storage/navigation issue found
