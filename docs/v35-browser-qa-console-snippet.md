# v35 Browser QA Console Snippet

이 문서는 v35 preview 브라우저 QA 중 localStorage key 분리와 J01~J09 저장 상태를 빠르게 확인하기 위한 콘솔 스니펫이다.

사용 위치:

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

사용 방법:

1. `/journey-v35-preview.html`에 접속한다.
2. Step 0~8을 이동하며 각 단계 저장을 수행한다.
3. 브라우저 개발자도구를 연다.
4. Console 탭에 아래 스니펫을 붙여넣고 실행한다.
5. 출력된 결과를 `docs/v35-browser-qa-result.md`의 근거로 사용한다.

---

## Console snippet

```js
(() => {
  const requiredPreviewKeys = [
    'c1bio_v35_preview_step',
    'c1bio_v35_preview_participant',
    'c1bio_v35_preview_state',
    'c1bio_v35_preview_strategy_notes',
    'c1bio_v35_preview_source_checks',
    'c1bio_v35_preview_source_risk',
    'c1bio_v35_preview_readiness_result',
    'c1bio_v35_preview_report_summary',
    'c1bio_v35_preview_report_link_or_file_name',
    'c1bio_v35_preview_slides_summary',
    'c1bio_v35_preview_slides_link_or_file_name',
    'c1bio_v35_preview_presentation_checks',
    'c1bio_v35_preview_presentation_one_liner',
    'c1bio_v35_preview_presentation_manager_request',
  ];

  const requiredSavedStateKeys = [
    'J01-entry',
    'J02-prompt',
    'J03-strategy-issue-review',
    'J04-source-check',
    'J05-notebook-source-prep',
    'J06-notebook-readiness-check',
    'J07-studio-report',
    'J08-studio-slides',
    'J09-presentation-checklist',
  ];

  const allKeys = Object.keys(localStorage).sort();
  const previewKeys = allKeys.filter((key) => key.startsWith('c1bio_v35_preview_'));
  const v34FlowKeys = allKeys.filter((key) => key.startsWith('c1bio_flow_'));

  let savedState = {};
  const rawSavedState = localStorage.getItem('c1bio_v35_preview_state');
  try {
    savedState = rawSavedState ? JSON.parse(rawSavedState) : {};
  } catch (error) {
    console.error('Failed to parse c1bio_v35_preview_state:', error);
  }

  const savedStateKeys = Object.keys(savedState).sort();
  const missingPreviewKeys = requiredPreviewKeys.filter((key) => !previewKeys.includes(key));
  const missingSavedStateKeys = requiredSavedStateKeys.filter((key) => !savedStateKeys.includes(key));

  const result = {
    checkedAt: new Date().toISOString(),
    url: window.location.href,
    currentStep: localStorage.getItem('c1bio_v35_preview_step'),
    previewKeysFound: previewKeys,
    missingPreviewKeys,
    v34FlowKeysFound: v34FlowKeys,
    savedStateKeysFound: savedStateKeys,
    missingSavedStateKeys,
    pass: missingPreviewKeys.length === 0 && missingSavedStateKeys.length === 0,
    note: 'v34FlowKeysFound may exist from prior v34 use; pass/fail depends on whether these keys were created or changed during v35 preview QA.',
  };

  console.log('v35 Browser QA localStorage result:', result);
  console.table({
    previewKeys: `${previewKeys.length}/${requiredPreviewKeys.length}`,
    missingPreviewKeys: missingPreviewKeys.join(', ') || 'none',
    savedStateKeys: `${savedStateKeys.length}/${requiredSavedStateKeys.length}`,
    missingSavedStateKeys: missingSavedStateKeys.join(', ') || 'none',
    v34FlowKeysFound: v34FlowKeys.join(', ') || 'none',
    pass: result.pass,
  });

  return result;
})();
```

---

## 판정 기준

### 통과 가능

아래 조건을 모두 만족하면 `docs/v35-browser-qa-result.md`의 저장·key 분리 항목을 통과로 기록할 수 있다.

- `missingPreviewKeys`가 비어 있다.
- `missingSavedStateKeys`가 비어 있다.
- `savedStateKeysFound`에 `J01-entry`부터 `J09-presentation-checklist`까지 모두 있다.
- v35 preview 조작 중 `c1bio_flow_*` key가 새로 생성되거나 변경되지 않았다.

### 보류

아래 조건 중 하나라도 있으면 cutover 검토를 보류한다.

- `missingPreviewKeys`가 남아 있다.
- `missingSavedStateKeys`가 남아 있다.
- `c1bio_v35_preview_state` JSON parse error가 발생한다.
- v35 preview 조작 중 `c1bio_flow_*` key가 새로 생성되거나 변경되었다.
- 브라우저 console에 runtime error가 있다.

---

## QA 결과 기록 예시

`docs/v35-browser-qa-result.md`에는 아래처럼 기록한다.

```txt
J01~J09 저장 여부: 모두 확인
localStorage key 분리 여부: 분리 확인
메모: Console snippet 실행 결과 missingPreviewKeys none, missingSavedStateKeys none.
```
