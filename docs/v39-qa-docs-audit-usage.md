# v39 QA Docs Audit Usage

## 1. 목적

`audit-v39-qa-docs.mjs`는 v39 고객 시연 전 필요한 QA 문서들이 저장소에 모두 존재하고, 핵심 섹션을 포함하는지 확인하는 보조 audit 스크립트입니다.

## 2. 현재 상태

현재 자동 CI와 v39 Smoke는 아래 커밋 기준 통과했습니다.

```text
122770e9c3e1dc6cf0c7aa17908078002cc221f0
```

확인 상태:

```text
C1Bio MVP CI: success
v35 Smoke: success
v36 Smoke: success
v38 Smoke: success
v39 Smoke: success
```

## 3. 대상 문서

이 audit은 아래 문서들의 존재와 핵심 marker를 확인합니다.

```text
docs/v39-preview-qa-checklist.md
docs/v39-preview-readiness-report.md
docs/v39-preview-manual-qa-run.md
docs/v39-preview-manual-qa-execution-guide.md
```

## 4. 실행 방법

현재 `package.json`에는 별도 npm script로 등록하지 않았습니다.  
필요할 경우 아래 명령으로 직접 실행합니다.

```bash
node scripts/audit-v39-qa-docs.mjs
```

정상 결과:

```text
v39 QA docs audit passed
```

실패 시:

```text
v39 QA docs audit failed
```

누락된 문서 또는 marker가 출력됩니다.

## 5. package.json 미등록 사유

`package.json`에 `audit:v39:qa-docs`를 등록하려는 시도는 도구 안전 검사에서 차단되었습니다.  
따라서 현재는 npm script에 연결하지 않고 독립 실행 스크립트로 유지합니다.

향후 로컬 개발 환경에서 필요하면 아래 script를 추가할 수 있습니다.

```json
"audit:v39:qa-docs": "node scripts/audit-v39-qa-docs.mjs"
```

## 6. 권장 사용 시점

아래 상황에서 실행합니다.

```text
고객 시연 전 QA 문서 확인
수동 QA 실행 전 문서 누락 확인
Readiness Report 갱신 후 문서 구조 확인
Manual QA Run 갱신 후 핵심 섹션 확인
```

## 7. 최종 수동 QA와의 관계

이 audit은 문서 존재와 구조만 확인합니다. 실제 브라우저 동작은 확인하지 않습니다.

브라우저 수동 QA 결과는 아래 문서에 기록합니다.

```text
docs/v39-preview-manual-qa-run.md
```
