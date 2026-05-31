import { StrategyIssueReview } from './journey-strategy-issue-review';
import { SourceCheckSection } from './journey-source-check';
import { NotebookSourcePrep } from './journey-notebook-source-prep';
import { buildSourcePackage, buildSourceSearchQuery } from './journey-utils';
import type { JsonRecord } from './journey-storage';
import type { IssueNote } from './journey-components';

export type V35Save = (key: string, payload: JsonRecord) => void;

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
