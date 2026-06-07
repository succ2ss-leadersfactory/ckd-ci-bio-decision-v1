# v39 Browser QA Result Template

## 1. QA Target

Repository:

```text
succ2ss-leadersfactory/ckd-ci-bio-decision-v1
```

Branch:

```text
feature/v37-preview-shell
```

Route:

```text
/journey-v39-preview.html
```

Tested commit:

```text
b0e43829205e97f65d3476647f53b72c1fdb872a
```

Actions status before browser QA:

```text
C1Bio MVP CI: success
v39 Smoke: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v40-lite Smoke: success
```

v39 Smoke now includes:

```text
static smoke
readiness audit
scoped TypeScript check
Vite build
dist smoke
local preview route smoke for /journey-v39-preview.html
```

## 2. Deployment URL

Fill in the actual Vercel URL used for QA:

```text
https://<deployment-host>/journey-v39-preview.html
```

QA date:

```text
YYYY-MM-DD
```

Tester:

```text
Name
```

Browser/device:

```text
Chrome desktop / Edge desktop / Android Chrome / Samsung Internet / tablet etc.
```

## 3. First Load Result

| Check | Result | Note |
|---|---|---|
| Page loads without 404 | Pass / Fail |  |
| No 502 Bad Gateway | Pass / Fail |  |
| No blank screen | Pass / Fail |  |
| Header shows C1바이오 영업팀장 AI 리더십 Lab Journey | Pass / Fail |  |
| Route is /journey-v39-preview.html, not /journey.html | Pass / Fail |  |
| Browser console has no uncaught error | Pass / Fail |  |
| Common flow strip shows participant-friendly labels | Pass / Fail |  |

## 4. Step 1 Result — 오늘 역할 잡기

| Check | Result | Note |
|---|---|---|
| Team dropdown works | Pass / Fail |  |
| Name/nickname input works | Pass / Fail |  |
| Role acceptance checkbox works | Pass / Fail |  |
| Next navigation works | Pass / Fail |  |
| Refresh keeps expected state | Pass / Fail |  |
| No sensitive data request appears | Pass / Fail |  |

## 5. Step 2 Result — 말해도 되는 선 확인

| Check | Result | Note |
|---|---|---|
| Safety message is visible | Pass / Fail |  |
| Prohibits actual customer/hospital/medical staff/product/internal numbers/personal data | Pass / Fail |  |
| AI is framed as judgment support, not answer decision | Pass / Fail |  |
| Navigation works | Pass / Fail |  |

## 6. Step 3 Result — AI 질문 다듬기

| Check | Result | Note |
|---|---|---|
| “우리 팀에서 제일 걸리는 장면을 하나 고릅니다” appears | Pass / Fail |  |
| Concern selection works | Pass / Fail |  |
| Prompt fields are prefilled | Pass / Fail |  |
| Copy prompt button works | Pass / Fail |  |
| No “사내 시스템/CRM” wording appears | Pass / Fail |  |
| No “고객군 × 팀원 실행 Map” wording appears | Pass / Fail |  |
| No “팀원 역할 보완” wording appears | Pass / Fail |  |

## 7. Step 4 Result — 시장 변화에서 질문 찾기

| Check | Result | Note |
|---|---|---|
| Step 3 selected concern appears in bridge card | Pass / Fail |  |
| Public research framing is clear | Pass / Fail |  |
| No confidential data request appears | Pass / Fail |  |
| Step 4 to Step 5 transition is clear | Pass / Fail |  |

## 8. Step 5 Result — 이번 2주에 볼 기준 정하기

| Check | Result | Note |
|---|---|---|
| Metric selection works | Pass / Fail |  |
| Rationale input works | Pass / Fail |  |
| Refresh keeps Step 5 data | Pass / Fail |  |
| Step 6 can read Step 5 context | Pass / Fail |  |
| No localStorage console error | Pass / Fail |  |
| Wording focuses on what to watch over two weeks | Pass / Fail |  |

## 9. Step 6 Result — 고객 기록에서 단서 찾기

| Check | Result | Note |
|---|---|---|
| Step 5 metric context appears | Pass / Fail |  |
| Customer record evidence selection works | Pass / Fail |  |
| Missing information / next check notes work | Pass / Fail |  |
| Refresh keeps Step 6 data | Pass / Fail |  |
| Wording says customer is not being ranked or graded | Pass / Fail |  |
| Wording points toward 1on1 target selection | Pass / Fail |  |
| No old “팀원별 역할과 지원 포인트” wording appears | Pass / Fail |  |

## 10. Step 7 Result — 2주 동안 다시 볼 흐름 정하기

| Check | Result | Note |
|---|---|---|
| Step 6 evidence appears as two-week direction material | Pass / Fail |  |
| Wording says evidence is not customer grading | Pass / Fail |  |
| Two-week direction input/save works | Pass / Fail |  |
| Refresh keeps Step 7 data | Pass / Fail |  |
| Next step is clearly 1on1 target selection | Pass / Fail |  |
| No customer group × team member assignment appears | Pass / Fail |  |
| No “역할 보완” wording appears | Pass / Fail |  |

## 11. Step 8 Result — 먼저 이야기할 팀원 고르기

| Check | Result | Note |
|---|---|---|
| Step 8 title/identity is 먼저 이야기할 팀원 고르기 | Pass / Fail |  |
| 7 team member narrative profiles appear | Pass / Fail |  |
| Team member profiles read like realistic Korean pharmaceutical sales team members | Pass / Fail |  |
| 문교원 사원 appears as an MZ junior who asks for meaning/criteria without being stereotyped | Pass / Fail |  |
| Actual team member registration is anonymous or safe if used | Pass / Fail |  |
| No work allocation map dominates | Pass / Fail |  |
| No customer group × team member assignment appears | Pass / Fail |  |

## 12. Step 9 Result — 첫 문장 준비하기

| Check | Result | Note |
|---|---|---|
| Selected 1on1 target context appears | Pass / Fail |  |
| First sentence preparation flow is clear | Pass / Fail |  |
| Wording focuses on how the team member may hear the message | Pass / Fail |  |
| Dialogue fields work | Pass / Fail |  |
| No long script generation is forced | Pass / Fail |  |

## 13. Step 10 Result — AI에게 한 번 정리시켜 보기

| Check | Result | Note |
|---|---|---|
| Prior notes are assembled into AI request material | Pass / Fail |  |
| Copy / paste flow works | Pass / Fail |  |
| AI output is framed as draft, not final answer | Pass / Fail |  |
| No sensitive data request appears | Pass / Fail |  |

## 14. Step 11 Result — 말해도 되는 선 다시 보기

| Check | Result | Note |
|---|---|---|
| AI draft or risky sentence review flow appears | Pass / Fail |  |
| Safe expression rewrite fields work | Pass / Fail |  |
| Wording reinforces that the team leader is responsible for final wording | Pass / Fail |  |
| No actual customer/hospital/medical staff/product/internal number request appears | Pass / Fail |  |

## 15. Step 12 Result — 2주 메모 완성하기

| Check | Result | Note |
|---|---|---|
| Final two-week memo fields appear | Pass / Fail |  |
| Prior step content is reflected where expected | Pass / Fail |  |
| Copy/use flow works | Pass / Fail |  |
| Wording feels like a field memo, not a report output | Pass / Fail |  |

## 16. Step 13 Result — 함께 복기할 질문 만들기

| Check | Result | Note |
|---|---|---|
| Reflection questions appear | Pass / Fail |  |
| Wording frames this as peer discussion, not instructor-only review | Pass / Fail |  |
| 2-week follow-up questions are clear | Pass / Fail |  |
| No evaluation/scoring language dominates | Pass / Fail |  |

## 17. Reset Result

After entering data in Steps 1, 3, 5, 6, 7, and 8, click 진행 초기화.

| Check | Result | Note |
|---|---|---|
| App returns to Step 1 | Pass / Fail |  |
| Participant info clears | Pass / Fail |  |
| Step 3 prompt practice data clears | Pass / Fail |  |
| Step 5 metric data clears | Pass / Fail |  |
| Step 6 customer record check data clears | Pass / Fail |  |
| Step 7 two-week direction data clears | Pass / Fail |  |
| Step 8 1on1 target selection data clears | Pass / Fail |  |
| Refresh after reset remains clean | Pass / Fail |  |

## 18. Mobile / Tablet Result

| Check | Result | Note |
|---|---|---|
| No horizontal overflow | Pass / Fail |  |
| Step navigation is usable | Pass / Fail |  |
| Textareas are usable | Pass / Fail |  |
| Buttons are tappable | Pass / Fail |  |
| Reset control is usable | Pass / Fail |  |

## 19. Final QA Decision

Overall result:

```text
Pass / Conditional Pass / Fail
```

Blocking issues:

```text
- None
```

Non-blocking improvement notes:

```text
- None
```

Screenshots / console logs:

```text
Attach or link if available.
```

## 20. If Failed

Record each failure using this format:

```text
Step:
Browser/device:
Visible issue:
Console error:
Expected behavior:
Actual behavior:
Screenshot:
Suggested fix scope:
```

Fix scope should remain v39 preview files unless a shared helper is the confirmed cause.

Protected files remain off-limits:

```text
journey.html
src/full-flow-journey-v34.tsx
src/journey-active.tsx
src/full-flow-journey-v35.tsx
src/journey-v38-app-preview.tsx
```
