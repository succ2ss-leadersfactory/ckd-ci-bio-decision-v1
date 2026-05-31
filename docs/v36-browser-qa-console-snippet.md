# v36 Browser QA Console Snippet

## 목적

이 스니펫은 `/journey-v36-preview.html`에서 localStorage 저장 키와 v36 화면 마커가 정상인지 빠르게 확인하기 위한 브라우저 콘솔용 점검 코드이다.

## 사용 위치

```text
/journey-v36-preview.html
```

## Console snippet

브라우저 개발자도구 Console에 아래 코드를 붙여넣는다.

```js
(() => {
  const requiredStorageKeys = [
    'ckd-v36-participant',
    'ckd-v36-progress',
    'ckd-v36-lab-customer-call-plan',
  ];

  const bodyText = document.body.innerText || '';
  const requiredTextMarkers = [
    '종근당/C1바이오 영업팀장 AI 리더십 Lab Journey v36 Preview',
    'AI 안전선',
    '고객군 판단',
  ];

  const storageSnapshot = Object.fromEntries(
    requiredStorageKeys.map((key) => [key, localStorage.getItem(key)])
  );

  const missingTextMarkers = requiredTextMarkers.filter((marker) => !bodyText.includes(marker));
  const missingStorageKeys = requiredStorageKeys.filter((key) => localStorage.getItem(key) === null);

  const result = {
    route: location.pathname,
    pass: location.pathname.includes('journey-v36-preview') && missingTextMarkers.length === 0,
    storageKeysPresentAfterInput: missingStorageKeys.length === 0,
    missingTextMarkers,
    missingStorageKeys,
    storageSnapshot,
  };

  console.table({
    route: result.route,
    pass: result.pass,
    storageKeysPresentAfterInput: result.storageKeysPresentAfterInput,
    missingTextMarkers: result.missingTextMarkers.join(', ') || 'none',
    missingStorageKeys: result.missingStorageKeys.join(', ') || 'none',
  });

  console.log('v36 QA result:', result);
  return result;
})();
```

## 판정 기준

### Step 1만 입력한 직후

- `pass`는 `true`여야 한다.
- `ckd-v36-participant`와 `ckd-v36-progress`는 존재해야 한다.
- `ckd-v36-lab-customer-call-plan`은 Step 7 입력 전에는 없을 수 있다.

### Step 7 고객군 판단 / 콜플랜 Lab 입력 후

- `pass`는 `true`여야 한다.
- `storageKeysPresentAfterInput`은 `true`여야 한다.
- `missingTextMarkers`는 `none`이어야 한다.
- `missingStorageKeys`는 `none`이어야 한다.

## 결과 기록

실행 결과를 `docs/v36-preview-qa-result.md`에 기록한다.

```text
Console snippet pass:
missingTextMarkers:
missingStorageKeys:
storageKeysPresentAfterInput:
Notes:
```
