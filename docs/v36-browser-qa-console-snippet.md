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
    'ckd-v36-lab-customer-call-plan',
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
    '고객군 판단',
    '본사 요청 현장 번역',
    '이해관계자 메시지',
    '성과대화 감별',
    '1on1 코칭',
    'Wrap-up',
  ];

  const bodyText = document.body.innerText || '';
  const allStorageKeys = [...coreStorageKeys, ...labStorageKeys];

  const storageSnapshot = Object.fromEntries(
    allStorageKeys.map((key) => [key, localStorage.getItem(key)])
  );

  const missingCoreStorageKeys = coreStorageKeys.filter((key) => localStorage.getItem(key) === null);
  const missingLabStorageKeys = labStorageKeys.filter((key) => localStorage.getItem(key) === null);
  const missingRequiredTextMarkers = requiredTextMarkers.filter((marker) => !bodyText.includes(marker));
  const visibleLabMarkers = labTextMarkers.filter((marker) => bodyText.includes(marker));

  const result = {
    route: location.pathname,
    routePass: location.pathname.includes('journey-v36-preview'),
    screenPass: missingRequiredTextMarkers.length === 0,
    coreStoragePass: missingCoreStorageKeys.length === 0,
    fullLabStoragePassAfterAllInputs: missingLabStorageKeys.length === 0,
    missingRequiredTextMarkers,
    visibleLabMarkers,
    missingCoreStorageKeys,
    missingLabStorageKeys,
    storageSnapshot,
  };

  console.table({
    route: result.route,
    routePass: result.routePass,
    screenPass: result.screenPass,
    coreStoragePass: result.coreStoragePass,
    fullLabStoragePassAfterAllInputs: result.fullLabStoragePassAfterAllInputs,
    missingRequiredTextMarkers: result.missingRequiredTextMarkers.join(', ') || 'none',
    visibleLabMarkers: result.visibleLabMarkers.join(', ') || 'none',
    missingCoreStorageKeys: result.missingCoreStorageKeys.join(', ') || 'none',
    missingLabStorageKeys: result.missingLabStorageKeys.join(', ') || 'none',
  });

  console.log('v36 QA result:', result);
  return result;
})();
```

## 판정 기준

### Step 1만 입력한 직후

- `routePass`는 `true`여야 한다.
- `screenPass`는 `true`여야 한다.
- `coreStoragePass`는 `true`여야 한다.
- Lab 저장 키들은 아직 없을 수 있다.

### Step 7~13 Lab 입력 후

- `fullLabStoragePassAfterAllInputs`는 `true`여야 한다.
- `missingLabStorageKeys`는 `none`이어야 한다.
- 각 Lab을 방문한 화면에서는 해당 Lab 이름이 `visibleLabMarkers`에 포함되어야 한다.

## 결과 기록

실행 결과를 `docs/v36-preview-qa-result.md`에 기록한다.

```text
Console snippet routePass:
Console snippet screenPass:
Console snippet coreStoragePass:
fullLabStoragePassAfterAllInputs:
missingRequiredTextMarkers:
missingCoreStorageKeys:
missingLabStorageKeys:
visibleLabMarkers:
Notes:
```
