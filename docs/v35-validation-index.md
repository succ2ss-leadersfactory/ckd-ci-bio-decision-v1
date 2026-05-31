# v35 Validation Document Index

v35 preview 검증과 cutover 검토 전에 확인할 문서와 실행 순서를 정리한다.

## 1. 실행 순서

| 순서 | 작업 | 참조 문서 | 기록 위치 |
|---:|---|---|---|
| 1 | 자동 smoke 실행 | `docs/v35-smoke-automation-guide.md` | `v35 Smoke` Actions |
| 2 | 원격 smoke 실행 | `docs/v35-deployment-url-guide.md` | `v35 Remote Smoke` Actions |
| 3 | 브라우저 QA 수행 | `docs/v35-browser-qa-runbook.md` | `docs/v35-browser-qa-result.md` |
| 4 | Console snippet 실행 | `docs/v35-browser-qa-console-snippet.md` | `docs/v35-browser-qa-result.md` |
| 5 | 최종 결과 반영 | `docs/v35-preview-smoke-result.md` | smoke result 문서 |
| 6 | readiness audit 실행 | `docs/v35-smoke-automation-guide.md` | `v35 Readiness Audit` Actions |
| 7 | cutover 검토 | `docs/v35-cutover-gates.md` | 별도 판단 |

## 2. GitHub Actions

```txt
Actions → v35 Smoke → Run workflow
Actions → v35 Remote Smoke → Run workflow
Actions → v35 Readiness Audit → Run workflow
```

## 3. 브라우저 QA URL

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
https://ckd-ci-bio-decision-v1.vercel.app/journey.html
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

## 4. 필수 통과 기준

- v34 운영 화면 영향 없음
- v35 preview 독립 실행 통과
- Step 0~8 이동 통과
- J01~J09 저장 모두 확인
- localStorage key 분리 확인
- Console snippet 결과 통과

Console snippet 기대값:

```txt
missingPreviewKeys: none
missingSavedStateKeys: none
pass: true
```

## 5. 결과 문서 최종 판정

`docs/v35-browser-qa-result.md`에 아래가 기록되어야 한다.

```txt
브라우저 QA 전체 판정: 통과
v34 운영 영향 여부: 영향 없음
v35 preview 독립 실행 여부: 통과
J01~J09 저장 여부: 모두 확인
localStorage key 분리 여부: 분리 확인
Console snippet 근거: 통과
cutover 검토 가능 여부: 검토 가능
```

`docs/v35-preview-smoke-result.md`에도 브라우저 QA 최종 결과를 반영한다.

## 6. 현재 판정

브라우저 QA 결과와 readiness audit이 완료되기 전까지 cutover는 진행하지 않는다.
