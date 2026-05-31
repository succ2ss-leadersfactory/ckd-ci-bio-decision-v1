# v35 Typecheck Pre-audit Notes

이 문서는 `npm run smoke:v35` 실행 전, 코드 구조상 typecheck 위험 요소를 사전에 확인한 결과를 정리한다.

## 1. 확인 목적

- `npm run typecheck` 실행 전 예상 가능한 타입 충돌을 줄인다.
- v35 preview state, router, step wrapper, 하위 컴포넌트의 props 타입 연결을 확인한다.
- 실제 실행 결과는 `docs/v35-preview-smoke-result.md`에 기록한다.

## 2. tsconfig 확인

현재 `tsconfig.json` 기준:

```txt
strict: true
jsx: react-jsx
include: ["src"]
noEmit: true
```

따라서 `src` 하위 TypeScript/TSX 파일 전체가 typecheck 대상이다.

## 3. useStored 확인

`src/journey-storage.ts`의 `useStored`는 다음을 지원한다.

- 값 직접 업데이트
- 함수형 업데이트
- localStorage 동기 저장

이로 인해 React setter 형태와의 호환성이 높아졌다.

## 4. v35 state 타입 확인

`src/journey-v35-preview-state.ts`는 `V35PreviewState` 반환 타입을 명시한다.

확인 항목:

- `step`, `setStep`
- `participant`, `setParticipant`
- `notes`, `setNotes`
- `sourceChecks`, `setSourceChecks`
- `sourceRisk`, `setSourceRisk`
- `readinessResult`, `setReadinessResult`
- `reportSummary`, `setReportSummary`
- `reportLinkOrFileName`, `setReportLinkOrFileName`
- `slidesSummary`, `setSlidesSummary`
- `slidesLinkOrFileName`, `setSlidesLinkOrFileName`
- `presentationChecks`, `setPresentationChecks`
- `presentationOneLiner`, `setPresentationOneLiner`
- `presentationManagerRequest`, `setPresentationManagerRequest`
- `save`

## 5. step wrapper props 확인

`src/journey-v35-preview-steps.tsx`의 step wrapper props는 하위 컴포넌트 props와 같은 형태를 사용한다.

확인 결과:

| wrapper | 하위 컴포넌트 | setter 형태 |
|---|---|---|
| `StrategyIssueReviewStep` | `StrategyIssueReview` | `(notes) => void` |
| `SourceCheckStep` | `SourceCheckSection` | `(checks) => void`, `(value) => void` |
| `NotebookReadinessCheckStep` | `NotebookReadinessCheck` | `(value) => void` |
| `StudioReportStep` | `StudioReportSection` | `(value) => void` |
| `StudioSlidesStep` | `StudioSlidesSection` | `(value) => void` |
| `PresentationChecklistStep` | `PresentationChecklist` | `(checks) => void`, `(value) => void` |

## 6. router 확인

`src/journey-v35-preview-router.tsx`는 `V35PreviewState`를 받아 현재 step에 맞는 화면을 렌더링한다.

확인 항목:

- Step 0: `EntryScreen`
- Step 1: `PromptPracticeScreen`
- Step 2: `StrategyIssueReviewStep`
- Step 3: `SourceCheckStep`
- Step 4: `NotebookSourcePrepStep`
- Step 5: `NotebookReadinessCheckStep`
- Step 6: `StudioReportStep`
- Step 7: `StudioSlidesStep`
- Step 8: `PresentationChecklistStep`

## 7. JourneyShell 타입 확인

`src/journey-shell.tsx`의 `JourneyStep` 타입은 다음 구조다.

```ts
{
  id: string;
  title: string;
  description?: string;
}
```

`src/journey-v35-preview-config.ts`의 `V35_APP_STEPS`는 이 구조와 일치한다.

## 8. 사전 판단

코드상 확인 기준으로는 v35 preview 관련 주요 props 연결과 state setter 구조가 일관적이다.

다만 실제 통과 여부는 반드시 아래 명령으로 확인한다.

```bash
npm run smoke:v35
```

실행 결과는 아래 문서에 기록한다.

```txt
docs/v35-preview-smoke-result.md
```
