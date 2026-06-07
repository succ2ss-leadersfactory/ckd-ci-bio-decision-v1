# v40-vNext Browser QA Console Snippets

Use these snippets only during manual QA for the isolated v40-vNext preview route.

- Route: `/journey-v40-vnext-preview.html`
- Tracking issue: #3 `Run v40-vNext manual browser QA`
- Run log: `docs/v40-vnext-manual-qa-run-log.md`

## 1. Open the browser console

In the Vercel preview page, open DevTools and use the Console tab.

- Windows/Linux Chrome or Edge: `F12` or `Ctrl + Shift + J`
- macOS Chrome or Edge: `Cmd + Option + J`

## 2. Confirm you are on the v40-vNext route

```js
(() => {
  const ok = location.pathname.endsWith('/journey-v40-vnext-preview.html');
  console.table({
    path: location.pathname,
    isV40VNextPreview: ok,
    title: document.title,
  });
  return ok;
})();
```

Expected:

- `isV40VNextPreview` should be `true`.
- The title should include `v40-vNext`.

## 3. Inspect all v40-vNext localStorage keys

```js
(() => {
  const rows = Object.keys(localStorage)
    .filter((key) => key.startsWith('ckd.v40-vnext.'))
    .sort()
    .map((key) => ({
      key,
      length: localStorage.getItem(key)?.length ?? 0,
      preview: (localStorage.getItem(key) || '').slice(0, 120),
    }));
  console.table(rows);
  return rows;
})();
```

Expected keys after a full test run should include at least:

```text
ckd.v40-vnext.participant.v1
ckd.v40-vnext.progress.v1
ckd.v40-vnext.taskManagement.v10
ckd.v40-vnext.peopleManagement.v2
ckd.v40-vnext.finalExecutionMemo.v1
```

## 4. Check Step 11 → Step 12 people-management connection

Run this after completing Step 11 and entering Step 12.

```js
(() => {
  const key = 'ckd.v40-vnext.peopleManagement.v2';
  const raw = localStorage.getItem(key);
  const data = raw ? JSON.parse(raw) : null;
  const result = {
    key,
    exists: Boolean(data),
    selectedMemberId: data?.selectedMemberId || '(missing)',
    observedBehaviorCount: Array.isArray(data?.observedBehaviors) ? data.observedBehaviors.length : 0,
    riskyInterpretationCount: Array.isArray(data?.riskyInterpretations) ? data.riskyInterpretations.length : 0,
    oneOnOneFocus: data?.oneOnOneFocus || '(missing)',
    selectionReason: data?.selectionReason || '(missing)',
  };
  console.table(result);
  return result;
})();
```

Expected:

- `exists` should be `true`.
- `selectedMemberId` should not be `(missing)`.
- `oneOnOneFocus` should not be `(missing)`.
- `selectionReason` should not be `(missing)` after Step 11.

## 5. Check roleplay fields after Step 12

Run this after filling the Step 12 roleplay and reflection fields.

```js
(() => {
  const data = JSON.parse(localStorage.getItem('ckd.v40-vnext.peopleManagement.v2') || '{}');
  const result = {
    roleplayOneLog: Boolean(data.roleplayOneLog),
    roleplayTwoLog: Boolean(data.roleplayTwoLog),
    aiCoachLearning: Boolean(data.aiCoachLearning),
    finalCoachingSentence: Boolean(data.finalCoachingSentence),
    revisedFirstSentenceAfterRoleplay: Boolean(data.revisedFirstSentenceAfterRoleplay),
    revisedAgreementAfterRoleplay: Boolean(data.revisedAgreementAfterRoleplay),
    followUpQuestion: Boolean(data.followUpQuestion),
  };
  console.table(result);
  return result;
})();
```

Expected:

- The fields you filled in Step 12 should show `true`.
- For the Step 13 connection check, at least these should be `true`:
  - `finalCoachingSentence`
  - `revisedFirstSentenceAfterRoleplay`
  - `revisedAgreementAfterRoleplay`
  - `followUpQuestion`

## 6. Check Step 13 final memo after clicking latest-result fill button

Run this after entering Step 13 and clicking `v40-vNext 최신 결과로 채우기`.

```js
(() => {
  const key = 'ckd.v40-vnext.finalExecutionMemo.v1';
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  const result = {
    key,
    exists: Object.keys(data).length > 0,
    performanceMemo: Boolean(data.performanceMemo),
    taskMemo: Boolean(data.taskMemo),
    boundaryMemo: Boolean(data.boundaryMemo),
    peopleMemo: Boolean(data.peopleMemo),
    followUpMemo: Boolean(data.followUpMemo),
    reviewQuestions: Boolean(data.reviewQuestions),
    peopleMemoIncludesFinalCoachingSentence: /최종 적용할 코칭 문장|final/i.test(data.peopleMemo || ''),
    peopleMemoIncludesRevisedAgreement: /역할극 후 수정한 2주 행동 합의|2주 행동 합의/i.test(data.peopleMemo || ''),
  };
  console.table(result);
  return result;
})();
```

Expected:

- `exists` should be `true`.
- All six memo sections should be `true` after clicking `v40-vNext 최신 결과로 채우기`.
- The people memo should include the final coaching sentence and roleplay-revised 2-week agreement.

## 7. Check progress coach panel text on the current screen

```js
(() => {
  const text = document.body.innerText;
  const result = {
    hasCoachPanel: text.includes('지금 단계 코치'),
    hasCurrentPosition: text.includes('현재 위치'),
    hasStepAction: text.includes('이번 단계 행동'),
    hasExpectedOutput: text.includes('완성 산출물'),
    hasNextStepPreview: text.includes('다음 단계 미리보기'),
    hasGroupStatus: text.includes('조별 진행 상태'),
    hasPhasePrep: text.includes('준비·리서치'),
    hasPhasePerformance: text.includes('성과관리'),
    hasPhaseTask: text.includes('업무관리'),
    hasPhasePeople: text.includes('사람관리·통합'),
  };
  console.table(result);
  return result;
})();
```

Expected:

- All values should be `true` on v40-vNext steps.

## 8. Reset v40-vNext data only

Use this only when starting a clean manual QA run.

```js
(() => {
  Object.keys(localStorage)
    .filter((key) => key.startsWith('ckd.v40-vnext.'))
    .forEach((key) => localStorage.removeItem(key));
  console.log('Removed v40-vNext localStorage keys only. Refresh the page to restart QA.');
})();
```

This should not remove v39 or v40-lite keys.

## 9. One-shot QA summary snapshot

Use this near the end of a manual QA pass and paste the output into the run log or Issue #3 comment if helpful.

```js
(() => {
  const read = (key) => {
    try { return JSON.parse(localStorage.getItem(key) || '{}'); } catch { return {}; }
  };
  const participant = read('ckd.v40-vnext.participant.v1');
  const progress = read('ckd.v40-vnext.progress.v1');
  const task = read('ckd.v40-vnext.taskManagement.v10');
  const people = read('ckd.v40-vnext.peopleManagement.v2');
  const final = read('ckd.v40-vnext.finalExecutionMemo.v1');
  const result = {
    path: location.pathname,
    progressStep: progress.step,
    groupName: participant.groupName,
    tableName: participant.tableName,
    representativeSituationExists: Boolean(participant.representativeSituation),
    selectedMemberId: people.selectedMemberId,
    oneOnOneFocusExists: Boolean(people.oneOnOneFocus),
    roleplayOneLogExists: Boolean(people.roleplayOneLog),
    roleplayTwoLogExists: Boolean(people.roleplayTwoLog),
    finalCoachingSentenceExists: Boolean(people.finalCoachingSentence),
    taskMemoExists: Boolean(final.taskMemo),
    boundaryMemoExists: Boolean(final.boundaryMemo),
    peopleMemoExists: Boolean(final.peopleMemo),
    finalMemoReady: Boolean(final.taskMemo && final.boundaryMemo && final.peopleMemo),
    coachPanelVisible: document.body.innerText.includes('지금 단계 코치'),
  };
  console.table(result);
  return result;
})();
```
