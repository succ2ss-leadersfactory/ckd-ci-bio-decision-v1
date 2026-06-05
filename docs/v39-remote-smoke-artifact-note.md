# v39 Remote Smoke Artifact Note

`v39 Remote Smoke` workflow는 실행 결과 JSON을 Actions artifact로 남긴다.

## 확인 위치

```txt
Actions → v39 Remote Smoke → 실행된 run → Artifacts
```

## artifact 정보

```txt
artifact name: v39-remote-smoke-result
file: v39-remote-smoke-result.json
```

## Step Summary에서 먼저 볼 값

```txt
pass: true
failureCount: 0
```

`v39 preview page` 행에서 아래 값이 모두 0인지 확인한다.

```txt
missingMarkers: 0
forbiddenMarkers: 0
errors: 0
```

## JSON에서 확인할 값

```txt
pass: true
failures: []
```

`routeResults` 안에서 다음 route가 모두 확인되어야 한다.

```txt
root redirect
v34 operating journey page
v39 preview page
```

## 결과 기록 위치

확인 결과는 아래 문서에 옮겨 적는다.

```txt
docs/v39-remote-smoke-result.md
```

## 주의

Remote Smoke는 실제 브라우저 클릭 QA를 대체하지 않는다. 통과 후 아래 문서 기준으로 브라우저 QA를 진행한다.

```txt
docs/v39-browser-qa-runbook.md
docs/v39-browser-qa-console-snippet.md
docs/v39-browser-qa-result.md
```
