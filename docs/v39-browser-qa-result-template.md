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
4716e00b91f43d2ad6242a05cec04f5f3924de7c
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

## 4. Step 1 Result — 입장·역할 부여

| Check | Result | Note |
|---|---|---|
| Team dropdown works | Pass / Fail |  |
| Name/nickname input works | Pass / Fail |  |
| Role acceptance checkbox works | Pass / Fail |  |
| Next navigation works | Pass / Fail |  |
| Refresh keeps expected state | Pass / Fail |  |
| No sensitive data request appears | Pass / Fail |  |

## 5. Step 2 Result — AI 안전선

| Check | Result | Note |
|---|---|---|
| AI safety message is visible | Pass / Fail |  |
| Prohibits actual customer/hospital/medical staff/product/internal numbers/personal data | Pass / Fail |  |
| AI is framed as judgment support, not answer decision | Pass / Fail |  |
| Navigation works | Pass / Fail |  |

## 6. Step 3 Result — Optimized Prompt Practice

| Check | Result | Note |
|---|---|---|
| V39PromptPracticeOptimizedLab appears | Pass / Fail |  |
| “우리 팀 고민을 AI가 알아듣는 질문으로 바꾸기” appears | Pass / Fail |  |
| Concern selection works | Pass / Fail |  |
| Prompt fields are prefilled | Pass / Fail |  |
| Copy prompt button works | Pass / Fail |  |
| No “사내 시스템/CRM” wording appears | Pass / Fail |  |
| No “고객군 × 팀원 실행 Map” wording appears | Pass / Fail |  |
| No “팀원 역할 보완” wording appears | Pass / Fail |  |

## 7. Step 4 Result — AI 전략 리서치

| Check | Result | Note |
|---|---|---|
| Step 3 selected concern appears in bridge card | Pass / Fail |  |
| Public research framing is clear | Pass / Fail |  |
| No confidential data request appears | Pass / Fail |  |
| Step 4 to Step 5 transition is clear | Pass / Fail |  |

## 8. Step 5 Result — 우리 팀 관리 지표 선정

| Check | Result | Note |
|---|---|---|
| Management metric selection works | Pass / Fail |  |
| Rationale input works | Pass / Fail |  |
| Refresh keeps Step 5 data | Pass / Fail |  |
| Step 6 can read Step 5 context | Pass / Fail |  |
| No localStorage console error | Pass / Fail |  |

## 9. Step 6 Result — 고객 Data 확인 List

| Check | Result | Note |
|---|---|---|
| Step 5 metric context appears | Pass / Fail |  |
| Customer Data evidence selection works | Pass / Fail |  |
| Missing information / next check notes work | Pass / Fail |  |
| Refresh keeps Step 6 data | Pass / Fail |  |
| Wording points toward 1on1 coaching target selection | Pass / Fail |  |
| No customer ranking/grading wording appears | Pass / Fail |  |
| No old “팀원별 역할과 지원 포인트” wording appears | Pass / Fail |  |

## 10. Step 7 Result — 고객군별 2주 대응 방향

| Check | Result | Note |
|---|---|---|
| Step 6 evidence appears as two-week direction material | Pass / Fail |  |
| “고객 Data 증거는 고객군이 아닙니다” appears | Pass / Fail |  |
| Two-week direction input/save works | Pass / Fail |  |
| Refresh keeps Step 7 data | Pass / Fail |  |
| Next step is clearly 코칭 대상 선정 | Pass / Fail |  |
| No customer group × team member assignment appears | Pass / Fail |  |
| No “역할 보완” wording appears | Pass / Fail |  |

## 11. Step 8 Entry Result — 코칭 대상 선정

| Check | Result | Note |
|---|---|---|
| Step 8 title/identity is 코칭 대상 선정 | Pass / Fail |  |
| 7 team member reference models appear | Pass / Fail |  |
| Actual team member registration is anonymous or safe if used | Pass / Fail |  |
| No work allocation map dominates | Pass / Fail |  |
| No customer group × team member assignment appears | Pass / Fail |  |

## 12. Reset Result

After entering data in Steps 1, 3, 5, 6, and 7, click 진행 초기화.

| Check | Result | Note |
|---|---|---|
| App returns to Step 1 | Pass / Fail |  |
| Participant info clears | Pass / Fail |  |
| Step 3 prompt practice data clears | Pass / Fail |  |
| Step 5 metric data clears | Pass / Fail |  |
| Step 6 customer Data check data clears | Pass / Fail |  |
| Step 7 two-week direction data clears | Pass / Fail |  |
| Refresh after reset remains clean | Pass / Fail |  |

## 13. Mobile / Tablet Result

| Check | Result | Note |
|---|---|---|
| No horizontal overflow | Pass / Fail |  |
| Step navigation is usable | Pass / Fail |  |
| Textareas are usable | Pass / Fail |  |
| Buttons are tappable | Pass / Fail |  |
| Reset control is usable | Pass / Fail |  |

## 14. Final QA Decision

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

## 15. If Failed

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
