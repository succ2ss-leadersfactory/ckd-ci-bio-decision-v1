import { StrategyIssueReview } from './journey-strategy-issue-review';
import { SourceCheckSection } from './journey-source-check';
import { NotebookSourcePrep } from './journey-notebook-source-prep';
import { NotebookReadinessCheck } from './journey-notebook-readiness';
import { StudioReportSection } from './journey-studio-report';
import { StudioSlidesSection } from './journey-studio-slides';
import { PresentationChecklist } from './journey-presentation-checklist';
import { buildSourcePackage, buildSourceSearchQuery, promptSourceCheck, promptStudioReport, promptStudioSlides } from './journey-utils';
import type { IssueNote } from './journey-components';
import type { V35Save } from './journey-v35-preview-types';

export type StrategyIssueReviewStepProps = {
  notes: IssueNote[];
  setNotes: (notes: IssueNote[]) => void;
  save: V35Save;
};

export function StrategyIssueReviewStep({ notes, setNotes, save }: StrategyIssueReviewStepProps) {
  return (
    <div className="grid gap-4">
      <StrategyIssueReview notes={notes} setNotes={setNotes} />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">전략 이슈 메모는 입력 즉시 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 메모를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J03-strategy-issue-review', { notes })}>
          전략 이슈 저장
        </button>
      </div>
    </div>
  );
}

export type SourceCheckStepProps = {
  sourceChecks: string[];
  setSourceChecks: (checks: string[]) => void;
  sourceRisk: string;
  setSourceRisk: (value: string) => void;
  save: V35Save;
};

export function SourceCheckStep({
  sourceChecks,
  setSourceChecks,
  sourceRisk,
  setSourceRisk,
  save,
}: SourceCheckStepProps) {
  return (
    <div className="grid gap-4">
      <SourceCheckSection checks={sourceChecks} setChecks={setSourceChecks} sourceRisk={sourceRisk} setSourceRisk={setSourceRisk} />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Source Check 입력값은 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 체크 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J04-source-check', { sourceChecks, sourceRisk })}>
          Source Check 저장
        </button>
      </div>
    </div>
  );
}

export type NotebookSourcePrepStepProps = {
  title: string;
  notes: IssueNote[];
  sourceChecks: string[];
  sourceRisk: string;
  save: V35Save;
};

export function NotebookSourcePrepStep({
  title,
  notes,
  sourceChecks,
  sourceRisk,
  save,
}: NotebookSourcePrepStepProps) {
  const searchText = buildSourceSearchQuery(title, notes);
  const packageText = buildSourcePackage({ strategyScenarioTitle: title }, notes, sourceChecks, sourceRisk);

  return (
    <div className="grid gap-4">
      <NotebookSourcePrep searchText={searchText} packageText={packageText} />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">NotebookLM 소스 준비 텍스트는 앞 단계의 전략 이슈와 Source Check 결과를 바탕으로 생성됩니다. 아래 버튼은 현재 생성 결과를 savedState에 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J05-notebook-source-prep', { searchText, packageText })}>
          Notebook Source Prep 저장
        </button>
      </div>
    </div>
  );
}

export type NotebookReadinessCheckStepProps = {
  readinessResult: string;
  setReadinessResult: (value: string) => void;
  save: V35Save;
};

export function NotebookReadinessCheckStep({
  readinessResult,
  setReadinessResult,
  save,
}: NotebookReadinessCheckStepProps) {
  const readinessPrompt = promptSourceCheck();

  return (
    <div className="grid gap-4">
      <NotebookReadinessCheck promptText={readinessPrompt} resultText={readinessResult} setResultText={setReadinessResult} />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">NotebookLM readiness result는 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 점검 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J06-notebook-readiness-check', { readinessPrompt, readinessResult })}>
          Readiness Check 저장
        </button>
      </div>
    </div>
  );
}

export type StudioReportStepProps = {
  reportSummary: string;
  setReportSummary: (value: string) => void;
  reportLinkOrFileName: string;
  setReportLinkOrFileName: (value: string) => void;
  save: V35Save;
};

export function StudioReportStep({
  reportSummary,
  setReportSummary,
  reportLinkOrFileName,
  setReportLinkOrFileName,
  save,
}: StudioReportStepProps) {
  const reportPrompt = promptStudioReport();

  return (
    <div className="grid gap-4">
      <StudioReportSection
        promptText={reportPrompt}
        summary={reportSummary}
        setSummary={setReportSummary}
        linkOrFileName={reportLinkOrFileName}
        setLinkOrFileName={setReportLinkOrFileName}
      />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Studio report 결과 요약과 파일명/링크는 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 보고서 산출 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J07-studio-report', { reportPrompt, reportSummary, reportLinkOrFileName })}>
          Studio Report 저장
        </button>
      </div>
    </div>
  );
}

export type StudioSlidesStepProps = {
  slidesSummary: string;
  setSlidesSummary: (value: string) => void;
  slidesLinkOrFileName: string;
  setSlidesLinkOrFileName: (value: string) => void;
  save: V35Save;
};

export function StudioSlidesStep({
  slidesSummary,
  setSlidesSummary,
  slidesLinkOrFileName,
  setSlidesLinkOrFileName,
  save,
}: StudioSlidesStepProps) {
  const slidesPrompt = promptStudioSlides();

  return (
    <div className="grid gap-4">
      <StudioSlidesSection
        promptText={slidesPrompt}
        summary={slidesSummary}
        setSummary={setSlidesSummary}
        linkOrFileName={slidesLinkOrFileName}
        setLinkOrFileName={setSlidesLinkOrFileName}
      />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Studio slide deck 결과 요약과 파일명/링크는 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 슬라이드 산출 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J08-studio-slides', { slidesPrompt, slidesSummary, slidesLinkOrFileName })}>
          Studio Slides 저장
        </button>
      </div>
    </div>
  );
}

export type PresentationChecklistStepProps = {
  presentationChecks: string[];
  setPresentationChecks: (checks: string[]) => void;
  presentationOneLiner: string;
  setPresentationOneLiner: (value: string) => void;
  presentationManagerRequest: string;
  setPresentationManagerRequest: (value: string) => void;
  save: V35Save;
};

export function PresentationChecklistStep({
  presentationChecks,
  setPresentationChecks,
  presentationOneLiner,
  setPresentationOneLiner,
  presentationManagerRequest,
  setPresentationManagerRequest,
  save,
}: PresentationChecklistStepProps) {
  return (
    <div className="grid gap-4">
      <PresentationChecklist
        checks={presentationChecks}
        setChecks={setPresentationChecks}
        oneLiner={presentationOneLiner}
        setOneLiner={setPresentationOneLiner}
        managerRequest={presentationManagerRequest}
        setManagerRequest={setPresentationManagerRequest}
      />
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">Presentation Checklist 입력값은 v35 preview 전용 key에 저장됩니다. 아래 버튼은 현재 발표 준비 결과를 savedState에도 명시적으로 기록합니다.</p>
        <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 font-semibold text-white" type="button" onClick={() => save('J09-presentation-checklist', { presentationChecks, presentationOneLiner, presentationManagerRequest })}>
          Presentation Checklist 저장
        </button>
      </div>
    </div>
  );
}
