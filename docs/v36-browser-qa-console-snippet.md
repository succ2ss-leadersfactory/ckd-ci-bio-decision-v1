# v36 Browser QA Console Snippet

## 목적

이 스니펫은 `/journey-v36-preview.html`에서 화면 마커와 localStorage 저장 키가 정상인지 빠르게 확인하기 위한 브라우저 콘솔용 점검 코드이다.

## 사용 위치

```text
/journey-v36-preview.html
```

## Console snippet

브라우저 개발자도구 Console에 아래 코드를 붙여넣는다.

```js
(() => {
  const coreStorageKeys = [
    'ckd-v36-participant',
    'ckd-v36-progress',
  ];

  const labStorageKeys = [
    'ckd-v36-lab-ai-safety',
    'ckd-v36-lab-prompt-practice',
    'ckd-v36-lab-research-strategy-v2',
    'ckd-v36-lab-source-check',
    'ckd-v36-lab-dashboard-analysis',
    'ckd-v36-lab-customer-call-plan',
    'ckd-v36-lab-action-map',
    'ckd-v36-lab-hq-translation',
    'ckd-v36-lab-stakeholder-message',
    'ckd-v36-lab-performance-dialogue',
    'ckd-v36-lab-one-on-one-coaching',
    'ckd-v36-wrap-up',
  ];

  const requiredTextMarkers = [
    '종근당/C1바이오 영업팀장 AI 리더십 Lab Journey v36 Preview',
    'AI 안전선',
  ];

  const labTextMarkers = [
    '좋은 질문 만들기 Lab',
    '일반 질문 선택',
    'AI Research 전략 Lab',
    'Source Check Lab',
    '팀원 Dashboard 분석 Lab',
    '고객군 판단',
    '실행행동 Map Lab',
    '본사 요청 현장 번역',
    '이해관계자 메시지',
    '성과대화 감별',
    '1on1 코칭',
    'Wrap-up',
  ];

  const bodyText = document.body.innerText || '';
  const currentStorageKeys = Object.keys(localStorage).filter((key) => key.startsWith('ckd-v36'));

  const markerResults = [...requiredTextMarkers, ...labTextMarkers].map((marker) => ({
    marker,
    presentOnCurrentScreen: bodyText.includes(marker),
  }));

  const storageResults = [...coreStorageKeys, ...labStorageKeys].map((key) => ({
    key,
    exists: localStorage.getItem(key) !== null,
    bytes: localStorage.getItem(key)?.length || 0,
  }));

  const summary = {
    url: location.href,
    title: document.title,
    bodyLength: bodyText.length,
    hasRoot: Boolean(document.querySelector('#root')),
    visibleButtons: Array.from(document.querySelectorAll('button')).map((button) => button.innerText).filter(Boolean).slice(0, 30),
    visibleInputs: document.querySelectorAll('input, textarea, select').length,
    currentStorageKeys,
    markerResults,
    storageResults,
  };

  console.table(markerResults);
  console.table(storageResults);
  console.log('v36 QA summary:', summary);
  return summary;
})();
```

## 해석 기준

- `hasRoot`가 `true`여야 한다.
- `bodyLength`가 지나치게 작으면 빈 화면 가능성이 있다.
- 현재 화면에 보이는 단계의 marker는 `presentOnCurrentScreen: true`여야 한다.
- `storageResults.exists`는 사용자가 해당 Lab을 방문하거나 입력한 이후 `true`가 될 수 있다.
- 13단계 전체 marker는 한 화면에 모두 표시되지 않을 수 있으므로, 각 단계 이동 후 필요한 marker만 확인한다.

## 전체 저장값 초기화 스니펫

```js
Object.keys(localStorage)
  .filter((key) => key.startsWith('ckd-v36'))
  .forEach((key) => localStorage.removeItem(key));
location.reload();
```
