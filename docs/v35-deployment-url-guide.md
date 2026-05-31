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

## 4. 교육생 공유 URL

교육생에게 공유할 기본 URL은 아래로 통일한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
```

강사 또는 개발자가 v35 preview를 확인할 때만 아래 URL을 사용한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

## 5. 현재 라우팅 기준

| 경로 | 용도 |
|---|---|
| `/` | `/journey.html`로 redirect |
| `/journey.html` | 운영 Journey 화면 |
| `/journey-v35-preview.html` | v35 preview 독립 실행 검증 화면 |
| `/instructor-live.html` | 강사용 live 화면 |

## 6. 확인 메모

- 이전 deployment suffix URL은 최신 commit이 반영되지 않았을 수 있다.
- 루트 redirect가 보이지 않으면 Vercel 재배포가 완료되었는지 먼저 확인한다.
- 최신 배포 확인 후에도 문제가 있으면 브라우저 캐시를 비우거나 시크릿 창에서 확인한다.
