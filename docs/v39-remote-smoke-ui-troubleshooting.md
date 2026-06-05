# v39 Remote Smoke UI Troubleshooting

이 문서는 GitHub Actions 화면에서 `v39 Remote Smoke` workflow가 보이지 않을 때 확인할 사항을 정리한다.

## 1. 현재 확인된 상태

저장소 default branch:

```txt
main
```

현재 `v39 Remote Smoke` workflow 파일:

```txt
.github/workflows/v39-remote-smoke.yml
```

현재 위치:

```txt
feature/v37-preview-shell
```

중요:

```txt
main branch에는 아직 .github/workflows/v39-remote-smoke.yml 파일이 없다.
```

따라서 GitHub Actions UI의 왼쪽 workflow 목록에 `v39 Remote Smoke`가 보이지 않을 수 있다.

## 2. 화면에서 먼저 확인할 것

### 1) 로그인 상태

GitHub 화면 우측 상단에 아래 버튼이 보이면 로그인하지 않은 상태다.

```txt
Sign in
Sign up
```

이 상태에서는 `Run workflow` 버튼을 사용할 수 없다.

### 2) workflow 목록

왼쪽 workflow 목록에 아래 항목만 보일 수 있다.

```txt
C1Bio MVP CI
v35 Readiness Audit
v35 Remote Smoke
v35 Smoke
v36 Smoke
v38 Smoke
v39 Smoke
v40-lite Smoke
```

`v39 Remote Smoke`가 보이지 않는다면, workflow 파일이 default branch에 아직 없기 때문일 가능성이 높다.

## 3. 왜 보이지 않는가

GitHub Actions의 `workflow_dispatch` 수동 실행 workflow는 일반적으로 default branch에 workflow 파일이 있어야 Actions UI에서 안정적으로 표시된다.

현재 `v39 Remote Smoke`는 v39 preview 개발 브랜치에 추가된 상태다.

```txt
feature/v37-preview-shell
```

그러므로 default branch인 `main`에 반영되기 전까지는 Actions UI에서 바로 실행하기 어려울 수 있다.

## 4. 선택 가능한 다음 조치

### 선택 A. 현재 상태 유지

v39 Remote Smoke는 브랜치에 보관하고, 우선 기존 자동 smoke와 문서 기반 QA만 유지한다.

사용할 문서:

```txt
docs/v39-current-handoff.md
docs/v39-browser-qa-runbook.md
docs/v39-browser-qa-console-snippet.md
docs/v39-browser-qa-result.md
```

### 선택 B. v39 Remote Smoke를 default branch에 반영

`v39 Remote Smoke`를 Actions UI에서 수동 실행하려면, 아래 파일이 default branch에 반영되어야 한다.

```txt
.github/workflows/v39-remote-smoke.yml
scripts/smoke-v39-remote.mjs
package.json
```

단, 운영 route `/journey.html`과 보호 파일은 계속 수정하지 않는다.

### 선택 C. 로컬 또는 CI에서 직접 명령 실행

브랜치를 checkout한 환경에서는 아래 명령으로 실행할 수 있다.

```bash
npm run smoke:v39:remote
```

Preview URL을 확인하려면 환경변수를 지정한다.

```bash
V39_REMOTE_BASE_URL=<preview base URL> npm run smoke:v39:remote
```

## 5. 추천

현재 v39는 preview 검증 단계이므로, 운영 route 보호를 우선한다.

추천 순서:

```txt
1. GitHub 로그인
2. 현재 Actions 목록에서 기존 v39 Smoke success 확인
3. /journey-v39-preview.html 브라우저 수동 QA 진행
4. 필요 시 v39 Remote Smoke를 main에 반영할지 별도 결정
```

## 6. 관련 문서

```txt
docs/v39-current-handoff.md
docs/v39-remote-smoke-result.md
docs/v39-remote-smoke-artifact-note.md
docs/v39-browser-qa-runbook.md
docs/v39-browser-qa-result.md
```
