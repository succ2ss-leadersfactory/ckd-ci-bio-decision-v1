# v35 Smoke Automation Guide

이 문서는 v35 preview를 운영 전환하기 전, 수동 smoke check를 자동화 또는 준자동화하는 기준을 정리한다.

## 1. 현재 사용 가능한 smoke 명령

현재 `package.json`에는 아래 명령이 등록되어 있다.

```bash
npm run smoke:v35
```

실행 내용은 다음과 같다.

```bash
npm run typecheck && npm run build
```

## 2. 로컬 확인 순서

배포 전 로컬에서 아래 순서로 확인한다.

```bash
npm install
npm run smoke:v35
npm run preview
```

`npm run preview` 실행 후 아래 경로를 확인한다.

```txt
http://localhost:4173/
http://localhost:4173/journey.html
http://localhost:4173/journey-v35-preview.html
```

## 3. Vercel 배포 전 확인

GitHub에 push하기 전에 아래 조건을 확인한다.

- `npm run smoke:v35`가 통과한다.
- `vite.config.ts`에 `journeyV35Preview` input이 유지되어 있다.
- `vercel.json`에 `/` → `/journey.html` redirect가 유지되어 있다.
- `full-flow-journey-v35.tsx`의 마지막 `import './full-flow-journey-v34';`가 유지되어 있다.

## 4. Vercel 배포 후 확인

production domain 기준으로 확인한다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
https://ckd-ci-bio-decision-v1.vercel.app/journey.html
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

확인 결과는 아래 문서에 기록한다.

```txt
docs/v35-preview-smoke-result.md
```

## 5. GitHub Actions 적용 후보

향후 자동화를 적용할 경우, 다음 조건을 먼저 확인한다.

- repository에 `package-lock.json`을 추가할지 결정한다.
- lockfile을 추가하면 GitHub Actions에서는 `npm ci`를 사용할 수 있다.
- lockfile을 추가하지 않는다면 `npm install` 기반 workflow를 사용한다.
- workflow는 `npm run smoke:v35`만 실행하고 운영 배포 설정은 건드리지 않는다.

## 6. 권장 workflow 방향

초기에는 다음 순서가 안전하다.

1. 로컬에서 `npm run smoke:v35` 수동 실행
2. Vercel production domain에서 수동 화면 확인
3. smoke 결과 문서 기록
4. 필요 시 GitHub Actions 추가
5. GitHub Actions가 안정화되면 PR 또는 main push 기준으로 자동 smoke check 실행

## 7. 현재 판단

현재는 v35 독립 실행 검증 전 단계이므로, GitHub Actions 자동화보다 수동 smoke check와 문서 기록을 우선한다.
