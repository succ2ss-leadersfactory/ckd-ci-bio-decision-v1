# v35 Deployment URL Guide

이 문서는 v35 preview 검증과 운영 URL 공유 시 혼동을 줄이기 위한 URL 사용 기준을 정리한다.

## 1. 권장 확인 URL

### 운영 화면

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
```

루트 경로 `/`는 `vercel.json` 설정에 의해 `/journey.html`로 redirect된다.

직접 경로는 다음과 같다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey.html
```

### v35 preview 화면

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

## 2. 주의할 URL

아래와 같이 suffix가 붙은 URL은 특정 배포본을 가리킬 수 있다.

```txt
https://ckd-ci-bio-decision-v1-xxxxxxx.vercel.app/
```

새 commit 이후에는 새로운 배포 URL이 생성될 수 있으므로, 이전 suffix URL로 접속하면 최신 commit이 반영되지 않은 화면을 볼 수 있다.

따라서 교육 운영 또는 최종 검증에는 가능하면 production domain을 사용한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
```

## 3. 확인 순서

1. GitHub commit 반영 후 Vercel 배포가 완료되었는지 확인한다.
2. production domain 루트로 접속한다.
3. `/journey.html`로 이동되는지 확인한다.
4. AI Research 전략 화면이 표시되는지 확인한다.
5. `/journey-v35-preview.html`에서 preview 화면이 표시되는지 확인한다.
6. 문제가 있으면 사용 중인 URL이 최신 production domain인지 먼저 확인한다.

## 4. 배포 후 원격 smoke check

Vercel 배포가 완료된 뒤 아래 명령을 실행한다.

```bash
npm run smoke:v35:remote
```

기본 확인 대상은 production domain이다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app
```

다른 Vercel preview URL을 확인해야 할 때는 환경변수로 base URL을 지정한다.

```bash
V35_REMOTE_BASE_URL=https://ckd-ci-bio-decision-v1-xxxxxxx.vercel.app npm run smoke:v35:remote
```

원격 smoke check는 다음을 확인한다.

| 항목 | 확인 내용 |
|---|---|
| `/` | `/journey.html`로 최종 redirect되는지 확인 |
| `/journey.html` | 운영 Journey HTML이 배포 산출물로 제공되는지 확인 |
| `/journey-v35-preview.html` | v35 preview HTML이 배포 산출물로 제공되는지 확인 |
| HTML script | `/assets/*.js` module script가 존재하는지 확인 |
| dev entry 차단 | production HTML이 `/src/...` entry를 직접 참조하지 않는지 확인 |

주의:

- 이 명령은 배포 완료 후 실행한다.
- CI 기본 `npm run smoke:v35`에는 포함하지 않는다.
- 배포 직후 Vercel propagation 지연이 있으면 잠시 후 다시 실행한다.

## 5. 교육생 공유 URL

교육생에게 공유할 기본 URL은 아래로 통일한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
```

강사 또는 개발자가 v35 preview를 확인할 때만 아래 URL을 사용한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

## 6. 현재 라우팅 기준

| 경로 | 용도 |
|---|---|
| `/` | `/journey.html`로 redirect |
| `/journey.html` | 운영 Journey 화면 |
| `/journey-v35-preview.html` | v35 preview 독립 실행 검증 화면 |
| `/instructor-live.html` | 강사용 live 화면 |

## 7. 확인 메모

- 이전 deployment suffix URL은 최신 commit이 반영되지 않았을 수 있다.
- 루트 redirect가 보이지 않으면 Vercel 재배포가 완료되었는지 먼저 확인한다.
- 최신 배포 확인 후에도 문제가 있으면 브라우저 캐시를 비우거나 시크릿 창에서 확인한다.
