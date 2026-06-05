# v39 Remote Smoke Result

이 문서는 GitHub Actions `v39 Remote Smoke` workflow 실행 결과를 기록하는 문서다.

> 현재 상태: **미실행**  
> `Actions → v39 Remote Smoke → Run workflow`를 실제로 실행한 뒤에만 `통과`, `조건부 통과`, `보류`로 변경한다.

## 1. 실행 정보

| 항목 | 결과 |
|---|---|
| 실행 일시 | 미기록 |
| 실행자 | 미기록 |
| workflow | `v39 Remote Smoke` |
| workflow file | `.github/workflows/v39-remote-smoke.yml` |
| 실행 commit | `cc9924b1853c058ba065d5efde74552ed2e6b5c8` 이후 Step Summary 보강 기준 |
| base_url 입력값 | 미기록 |
| run URL | 미기록 |
| 최종 판정 | 미실행 |

## 2. 실행 방법

GitHub Actions에서 수동 실행한다.

```txt
Actions → v39 Remote Smoke → Run workflow
```

기본 `base_url`:

```txt
https://ckd-ci-bio-decision-v1.vercel.app
```

Preview 배포를 확인할 경우에는 해당 Vercel preview base URL을 입력한다.

## 3. Step Summary 기록란

workflow 실행 후 Step Summary의 `Result`와 `Route details` 값을 아래에 옮겨 적는다.

### Result

| 항목 | 값 |
|---|---|
| checkedAt | 미기록 |
| pass | 미기록 |
| failureCount | 미기록 |

### Route details

| route | status | finalPath | moduleScripts | assetChunks | missingMarkers | forbiddenMarkers | errors |
|---|---:|---|---:|---:|---:|---:|---:|
| root redirect | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 |
| v34 operating journey page | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 |
| v39 preview page | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 | 미기록 |

### Failures

```txt
미기록
```

## 4. Remote Smoke가 확인하는 것

| 구분 | 확인 내용 | 결과 | 메모 |
|---|---|---|---|
| root redirect | `/`가 `/journey.html`로 연결되는지 | 미확인 |  |
| 운영 route | `/journey.html`이 정상 HTML로 제공되는지 | 미확인 |  |
| v39 preview route | `/journey-v39-preview.html`이 정상 HTML로 제공되는지 | 미확인 |  |
| production asset | HTML이 `/assets/*.js` module script를 사용하는지 | 미확인 |  |
| dev source 차단 | production HTML이 `/src/...` dev entry를 직접 참조하지 않는지 | 미확인 |  |
| v39 marker | v39 5~13단계 핵심 marker가 asset graph에 포함되는지 | 미확인 |  |
| 금지 표현 | 주요 금지 표현이 asset graph에 포함되지 않는지 | 미확인 |  |

## 5. 핵심 marker 확인 기준

아래 marker가 v39 preview asset graph에서 확인되어야 한다.

```txt
V39CustomerJudgmentUxLab
고객의 무엇을 확인할 것인가
고객 Data 증거 카드
고객군별 2주 대응 방향
AI 결과 1차 분리 정리
팀원별 실행 보완 Map
팀원 온도차와 실행 대화
AI 실행계획
컴플라이언스
최종 실행 카드
판단 근거·보완 지점·토의거리
```

## 6. 금지 표현 확인 기준

아래 표현은 v39 preview asset graph에 포함되지 않아야 한다.

```txt
CRM 기록
CRM Data
CRM 분석
CRM상 고객 등급
CRM 기록 품질
고객 순위표
처방 가능성
전환 가능성
집중 공략
비교 우위 단정
미승인 효능
```

## 7. 판정 기준

### 통과

아래 조건을 모두 만족하면 통과로 기록한다.

- workflow conclusion이 `success`다.
- Step Summary의 `pass`가 `true`다.
- `failureCount`가 `0`이다.
- 모든 route의 HTTP status가 2xx다.
- `/` root redirect의 finalPath가 `/journey.html`이다.
- `v39 preview page`의 `missingMarkers`, `forbiddenMarkers`, `errors`가 모두 `0`이다.

### 조건부 통과

아래 조건은 조건부 통과로 기록할 수 있다.

- base URL이 preview 배포 URL이고 Vercel propagation 지연으로 첫 실행은 실패했으나, 재실행 후 통과했다.
- asset chunk 수가 예상과 다르지만 required marker가 모두 확인되었다.
- remote smoke는 통과했으나 브라우저 수동 QA가 아직 미실행이다.

### 보류

아래 조건 중 하나라도 있으면 보류한다.

- workflow conclusion이 `failure`다.
- Step Summary의 `pass`가 `false`다.
- `failureCount`가 `1` 이상이다.
- `/journey.html`이 v39 preview entry를 참조한다.
- `/journey-v39-preview.html`이 정상 HTML로 제공되지 않는다.
- v39 핵심 marker가 누락된다.
- 금지 표현이 asset graph에서 발견된다.

## 8. 실패 시 조치

| 실패 유형 | 우선 조치 |
|---|---|
| base URL 접속 실패 | Vercel deployment 완료 여부 확인 후 재실행 |
| root redirect 실패 | route 설정과 `journey.html` 보호 상태 확인 |
| v39 preview HTML 실패 | `/journey-v39-preview.html` 배포 여부 확인 |
| asset marker 누락 | v39 route entry와 smoke marker 문자열 확인 |
| 금지 표현 발견 | 해당 표현 위치를 검색해 현업 표현으로 교체 |
| dev source 직접 참조 | build output 또는 Vite 설정 확인 |

## 9. 다음 필수 확인

Remote Smoke는 실제 브라우저 클릭 QA를 대체하지 않는다. 통과 후 아래 문서를 기준으로 수동 QA를 수행한다.

```txt
docs/v39-browser-qa-runbook.md
docs/v39-browser-qa-console-snippet.md
docs/v39-browser-qa-result.md
```

## 10. 발견 이슈

| 번호 | 구분 | 이슈 | 심각도 | 조치 |
|---:|---|---|---|---|
| 1 |  |  |  |  |

## 11. 최종 기록

| 항목 | 결과 |
|---|---|
| Remote Smoke 전체 판정 | 미실행 |
| 브라우저 수동 QA 필요 여부 | 필요 |
| 후속 수정 필요 여부 | 미확인 |
| 최신 안정 커밋 갱신 여부 | 미확인 |
