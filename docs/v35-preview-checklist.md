# v35 Preview Verification Checklist

이 문서는 `v35` 독립 실행 전환 전, preview 경로에서 확인해야 할 항목을 정리한 체크리스트입니다.

## 배포 전 build smoke check

배포 전 아래 명령을 실행해 typecheck와 build가 모두 통과되는지 확인합니다.

```bash
npm run smoke:v35
```

이 명령은 다음을 순서대로 실행합니다.

```bash
npm run typecheck && npm run build
```

## 확인 URL 기준

최종 검증과 교육생 공유에는 production domain을 사용합니다.

```txt
https://ckd-ci-bio-decision-v1.vercel.app/
```

suffix가 붙은 deployment URL은 특정 배포본을 가리킬 수 있으므로 최신 commit이 반영되지 않았을 수 있습니다.

```txt
https://ckd-ci-bio-decision-v1-xxxxxxx.vercel.app/
```

## 확인 경로

- 루트 경로: `/` → `/journey.html` redirect 확인
- 운영 경로: `/journey.html`
- preview 경로: `/journey-v35-preview.html`

## 운영 경로 확인

- `/` 접속 시 `/journey.html`로 redirect되는지 확인한다.
- `/journey.html` 접속 시 기존 v34 화면이 정상 표시되는지 확인한다.
- `journey-active.tsx`와 `full-flow-journey-v34.tsx`가 수정되지 않았는지 확인한다.
- Google Sheets 연동이 기존처럼 유지되는지 확인한다.

## preview 경로 확인

- `/journey-v35-preview.html` 접속 시 v35 preview 화면이 표시되는지 확인한다.
- 화면에 `v35 Preview Smoke Check` 패널이 표시되는지 확인한다.
- Debug JSON 패널이 표시되는지 확인한다.

## step 이동 확인

아래 단계가 Next / Prev 버튼으로 이동되는지 확인한다.

1. 입장
2. 좋은 질문 만들기
3. 전략 이슈 검토
4. Source Check
5. NotebookLM Source Prep
6. NotebookLM Readiness Check
7. Studio Report Output
8. Studio Slide Deck Output
9. Presentation Checklist

## 저장 확인

각 단계에서 저장 버튼을 클릭한 후 Debug JSON의 `savedState`에 아래 값이 누적되는지 확인한다.

- `J01-entry`
- `J02-prompt`
- `J03-strategy-issue-review`
- `J04-source-check`
- `J05-notebook-source-prep`
- `J06-notebook-readiness-check`
- `J07-studio-report`
- `J08-studio-slides`
- `J09-presentation-checklist`

## preview 전용 저장 key 확인

브라우저 개발자도구의 Application > Local Storage에서 아래 key들이 생성되는지 확인한다.

- `c1bio_v35_preview_step`
- `c1bio_v35_preview_participant`
- `c1bio_v35_preview_state`
- `c1bio_v35_preview_strategy_notes`
- `c1bio_v35_preview_source_checks`
- `c1bio_v35_preview_source_risk`
- `c1bio_v35_preview_readiness_result`
- `c1bio_v35_preview_report_summary`
- `c1bio_v35_preview_report_link_or_file_name`
- `c1bio_v35_preview_slides_summary`
- `c1bio_v35_preview_slides_link_or_file_name`
- `c1bio_v35_preview_presentation_checks`
- `c1bio_v35_preview_presentation_one_liner`
- `c1bio_v35_preview_presentation_manager_request`

## 안전 기준

- v34 운영 파일은 수정하지 않는다.
- `journey-active.tsx`는 아직 수정하지 않는다.
- `full-flow-journey-v35.tsx`의 마지막 `import './full-flow-journey-v34';`는 유지한다.
- Google Sheets 저장 연동은 v35 preview에 아직 연결하지 않는다.
