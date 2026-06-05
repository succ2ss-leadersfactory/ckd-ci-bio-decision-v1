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
| 실행 commit | `0775d1c021f7143049f35c86affe5a827cec13c5` 이후 remote smoke 추가 기준 |
| base_url 입력값 | 미기록 |
| run URL | 미기록 |
| 최종 판정 | 미실행 |

## 2. 실행 방법

GitHub Actions에서 수동 실행한다.

```txt
Actions → v39 Remote Smoke → Run workflow
```

입력값:

```txt
base_url
```

기본값:

```txt
https://ckd-ci-bio-decision-v1.vercel.app
```

Preview 배포를 확인할 경우에는 해당 Vercel preview base URL을 입력한다.

예시:

```txt
https://ckd-ci-bio-decision-git-feature-v37-preview-shell-succ2ss-leadersfactorys-projects.vercel.app
```

## 3. Remote Smoke가 확인하는 것

| 구분 | 확인 내용 | 결과 | 메모 |
|---|---|---|---|
| root redirect | `/`가 `/journey.html`로 연결되는지 | 미확인 |  |
| 운영 route | `/journey.html`이 정상 HTML로 제공되는지 | 미확인 |  |
| v39 preview route | `/journey-v39-preview.html`이 정상 HTML로 제공되는지 | 미확인 |  |
| production asset | HTML이 `/assets/*.js` module script를 사용하는지 | 미확인 |  |
| dev source 차단 | production HTML이 `/src/...` dev entry를 직접 참조하지 않는지 | 미확인 |  |
| v39 marker | v39 5~13단계 핵심 marker가 asset graph에 포함되는지 | 미확인 |  |
| 금지 표현 | 주요 금지 표현이 asset graph에 포함되지 않는지 | 미확인 |  |

## 4. v39 핵심 marker 확인 기준

아래 marker가 v39 preview asset graph에서 확인되어야 한다.

| marker | 결과 | 메모 |
|---|---|---|
| `V39CustomerJudgmentUxLab` | 미확인 |  |
| `고객의 무엇을 확인할 것인가` | 미확인 |  |
| `고객 Data 증거 카드` | 미확인 |  |
| `고객군별 2주 대응 방향` | 미확인 |  |
| `AI 결과 1차 분리 정리` | 미확인 |  |
| `팀원별 실행 보완 Map` | 미확인 |  |
| `팀원 온도차와 실행 대화` | 미확인 |  |
| `AI 실행계획` | 미확인 |  |
| `컴플라이언스` | 미확인 |  |
| `최종 실행 카드` | 미확인 |  |
| `판단 근거·보완 지점·토의거리` | 미확인 |  |

## 5. 금지 표현 확인 기준

아래 표현은 v39 preview asset graph에 포함되지 않아야 한다.

| 금지 표현 | 결과 | 메모 |
|---|---|---|
| `CRM 기록` | 미확인 |  |
| `CRM Data` | 미확인 |  |
| `CRM 분석` | 미확인 |  |
| `CRM상 고객 등급` | 미확인 |  |
| `CRM 기록 품질` | 미확인 |  |
| `고객 순위표` | 미확인 |  |
| `처방 가능성` | 미확인 |  |
| `전환 가능성` | 미확인 |  |
| `집중 공략` | 미확인 |  |
| `비교 우위 단정` | 미확인 |  |
| `미승인 효능` | 미확인 |  |

## 6. Workflow Summary 확인 항목

workflow 실행 후 GitHub Actions run summary에서 아래 항목을 확인한다.

| 항목 | 결과 | 메모 |
|---|---|---|
| Checked base URL 표시 | 미확인 |  |
| Paths covered 표시 | 미확인 |  |
| What this verifies 표시 | 미확인 |  |
| Next required checks 표시 | 미확인 |  |

## 7. Job log 확인 항목

`Run v39 remote smoke check` job log에서 아래 메시지를 확인한다.

| 로그 항목 | 기대 결과 | 결과 | 메모 |
|---|---|---|---|
| `Running v39 remote smoke checks against ...` | base URL 출력 | 미확인 |  |
| `root redirect` | HTTP 2xx, final URL `/journey.html` | 미확인 |  |
| `v34 operating journey page` | HTTP 2xx | 미확인 |  |
| `v39 preview page` | HTTP 2xx | 미확인 |  |
| `fetched ... asset chunk(s)` | asset graph fetch 성공 | 미확인 |  |
| `v39 remote smoke check passed.` | 최종 통과 | 미확인 |  |

## 8. 판정 기준

### 통과

아래 조건을 모두 만족하면 통과로 기록한다.

- workflow conclusion이 `success`다.
- `/` root redirect가 `/journey.html`로 연결된다.
- `/journey.html`과 `/journey-v39-preview.html` 모두 HTTP 2xx다.
- production HTML이 `/assets/*.js` bundle을 사용한다.
- production HTML이 `/src/...` dev entry를 직접 참조하지 않는다.
- v39 핵심 marker가 asset graph에서 모두 확인된다.
- 금지 표현이 asset graph에서 발견되지 않는다.

### 조건부 통과

아래 조건은 조건부 통과로 기록할 수 있다.

- base URL이 preview 배포 URL이고 Vercel deployment propagation 지연으로 첫 실행은 실패했으나, 재실행 후 통과했다.
- asset chunk 수가 예상과 다르지만 required marker가 모두 확인되었다.
- remote smoke는 통과했으나 브라우저 수동 QA가 아직 미실행이다.

### 보류

아래 조건 중 하나라도 있으면 보류한다.

- workflow conclusion이 `failure`다.
- `/journey.html`이 v39 preview entry를 참조한다.
- `/journey-v39-preview.html`이 정상 HTML로 제공되지 않는다.
- v39 핵심 marker가 누락된다.
- 금지 표현이 asset graph에서 발견된다.
- production HTML이 `/src/...` dev entry를 직접 참조한다.

## 9. 실패 시 조치

| 실패 유형 | 우선 조치 |
|---|---|
| base URL 접속 실패 | Vercel deployment 완료 여부 확인 후 재실행 |
| root redirect 실패 | route 설정과 `journey.html` 보호 상태 확인 |
| v39 preview HTML 실패 | `/journey-v39-preview.html` 배포 여부 확인 |
| asset marker 누락 | v39 route entry와 smoke marker 문자열 확인 |
| 금지 표현 발견 | 해당 표현 위치를 검색해 현업 표현으로 교체 |
| dev source 직접 참조 | build output 또는 Vite 설정 확인 |

## 10. 다음 필수 확인

Remote Smoke는 실제 브라우저 클릭 QA를 대체하지 않는다. 통과 후 아래 문서를 기준으로 수동 QA를 수행한다.

```txt
docs/v39-browser-qa-runbook.md
docs/v39-browser-qa-console-snippet.md
docs/v39-browser-qa-result.md
```

## 11. 발견 이슈

| 번호 | 구분 | 이슈 | 심각도 | 조치 |
|---:|---|---|---|---|
| 1 |  |  |  |  |

## 12. 최종 기록

| 항목 | 결과 |
|---|---|
| Remote Smoke 전체 판정 | 미실행 |
| 브라우저 수동 QA 필요 여부 | 필요 |
| 후속 수정 필요 여부 | 미확인 |
| 최신 안정 커밋 갱신 여부 | 미확인 |
