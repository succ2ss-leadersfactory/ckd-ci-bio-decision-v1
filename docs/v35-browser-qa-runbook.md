# v35 Browser QA Runbook

이 문서는 v35 preview 운영 전환 검토 전, 브라우저에서 직접 수행할 QA 절차를 정리한다.

## 1. 확인 URL

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
https://ckd-ci-bio-decision-v1.vercel.app/journey.html
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

결과 기록 문서:

```txt
docs/v35-browser-qa-result.md
docs/v35-preview-smoke-result.md
```

콘솔 스니펫 문서:

```txt
docs/v35-browser-qa-console-snippet.md
```

## 2. v34 운영 경로 확인

1. `/` 접속 후 `/journey.html`로 이동되는지 확인한다.
2. `/journey.html`에서 기존 운영 화면이 정상 표시되는지 확인한다.
3. 기존 입력과 저장 흐름이 깨지지 않는지 확인한다.
4. Console runtime error가 없는지 확인한다.
5. `c1bio_flow_*` key가 손상되지 않는지 확인한다.

기록 예시:

```txt
/ 루트 접속: 통과
/journey.html 접속: 통과
기존 v34 주요 화면 이동: 통과
기존 입력/저장 흐름: 통과
Console error: 통과
c1bio_flow_* key 유지: 통과
```

## 3. v35 preview 진입 확인

접속:

```txt
https://ckd-ci-bio-decision-v1.vercel.app/journey-v35-preview.html
```

확인 항목:

- v35 preview 화면 표시
- `v35 Preview Smoke Check` 패널 표시
- Debug JSON 패널 표시
- Step 이동 버튼 표시
- Console runtime error 없음

기록 예시:

```txt
/journey-v35-preview.html 접속: 통과
Smoke Check 패널: 통과
Debug JSON 패널: 통과
Console error: 통과
```

## 4. Step 0~8 이동 확인

| Step | 화면 |
|---:|---|
| 0 | 입장 |
| 1 | 좋은 질문 만들기 |
| 2 | 전략 이슈 검토 |
| 3 | Source Check |
| 4 | NotebookLM Source Prep |
| 5 | NotebookLM Readiness Check |
| 6 | Studio Report Output |
| 7 | Studio Slide Deck Output |
| 8 | Presentation Checklist |

추가 확인:

```txt
Step 0 Prev 경계: 통과
Step 8 Next 경계: 통과
새로고침 후 상태: 통과
```

## 5. J01~J09 저장 확인

각 Step에서 최소 입력 후 저장한다.

| Step | 저장 key | 입력 예시 |
|---:|---|---|
| 0 | `J01-entry` | 이름 `테스트팀장`, 세션 `QA` |
| 1 | `J02-prompt` | 기본 프롬프트 저장 |
| 2 | `J03-strategy-issue-review` | `전략 이슈 QA 테스트` |
| 3 | `J04-source-check` | 체크 1개, 위험 메모 입력 |
| 4 | `J05-notebook-source-prep` | 생성 텍스트 확인 후 저장 |
| 5 | `J06-notebook-readiness-check` | `Readiness QA 확인` |
| 6 | `J07-studio-report` | `보고서 QA 요약` |
| 7 | `J08-studio-slides` | `슬라이드 QA 요약` |
| 8 | `J09-presentation-checklist` | 체크 1개, 한 줄 메시지 입력 |

Debug JSON에서 `savedState`에 J01~J09가 모두 있는지 확인한다.

## 6. Console snippet 실행

Step 0~8 저장 완료 후 Console에서 아래 문서의 스니펫을 실행한다.

```txt
docs/v35-browser-qa-console-snippet.md
```

필수 기대 결과:

```txt
missingPreviewKeys: none
missingSavedStateKeys: none
pass: true
```

기록 예시:

```txt
Console snippet 실행: 통과
missingPreviewKeys: none
missingSavedStateKeys: none
savedStateKeysFound: J01-entry, J02-prompt, J03-strategy-issue-review, J04-source-check, J05-notebook-source-prep, J06-notebook-readiness-check, J07-studio-report, J08-studio-slides, J09-presentation-checklist
v34FlowKeysFound: 기존 key 변화 없음
pass: true
```

## 7. 결과 문서 업데이트

`docs/v35-browser-qa-result.md`에 아래 최종 판정을 기록한다.

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

## 8. Readiness Audit 실행

브라우저 QA 결과를 기록한 뒤 실행한다.

```txt
Actions → v35 Readiness Audit → Run workflow
```

또는 로컬에서 실행한다.

```bash
npm run audit:v35:readiness
```

통과 의미:

- 문서상 운영 전환 검토 가능 상태다.
- 운영 전환이 자동으로 수행되는 것은 아니다.

## 9. 현재 권장 진행

```txt
1. Actions → v35 Smoke → Run workflow 재확인
2. /journey.html v34 회귀 확인
3. /journey-v35-preview.html v35 preview QA 수행
4. Console snippet 실행
5. docs/v35-browser-qa-result.md 업데이트
6. docs/v35-preview-smoke-result.md 업데이트
7. Actions → v35 Readiness Audit → Run workflow
```
