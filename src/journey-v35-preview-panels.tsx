import type { ParticipantInfo } from './journey-entry';
import type { JsonRecord } from './journey-storage';
import type { IssueNote } from './journey-components';

export type V35StorageKeys = Record<string, string>;

export type V35PreviewSmokePanelProps = {
  step: number;
  storageKeys: V35StorageKeys;
  onReset: () => void;
};

export function V35PreviewSmokePanel({ step, storageKeys, onReset }: V35PreviewSmokePanelProps) {
  return (
    <aside className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-slate-700" data-testid="v35-preview-smoke-panel">
      <h3 className="font-bold text-slate-900">v35 Preview Smoke Check</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <div>
          <b>실행 경로</b>
          <p>/journey-v35-preview.html 전용</p>
        </div>
        <div>
          <b>현재 step</b>
          <p>{step}</p>
        </div>
        <div>
          <b>운영 연결</b>
          <p>journey-active.tsx 미사용</p>
        </div>
        <div>
          <b>Google Sheets</b>
          <p>아직 미연동</p>
        </div>
      </div>
      <p className="mt-3 font-semibold text-cyan-800">저장 key: {Object.values(storageKeys).join(', ')}</p>
      <button className="mt-3 rounded-xl border border-cyan-700 bg-white px-4 py-2 font-semibold text-cyan-800" type="button" onClick={onReset}>
        v35 preview 저장 초기화
      </button>
    </aside>
  );
}

export type V35PreviewDebugPanelProps = {
  participant: ParticipantInfo;
  savedState: JsonRecord;
  notes: IssueNote[];
  sourceChecks: string[];
  sourceRisk: string;
  readinessResult: string;
  reportSummary: string;
  reportLinkOrFileName: string;
  slidesSummary: string;
  slidesLinkOrFileName: string;
  presentationChecks: string[];
  presentationOneLiner: string;
  presentationManagerRequest: string;
};

export function V35PreviewDebugPanel({
  participant,
  savedState,
  notes,
  sourceChecks,
  sourceRisk,
  readinessResult,
  reportSummary,
  reportLinkOrFileName,
  slidesSummary,
  slidesLinkOrFileName,
  presentationChecks,
  presentationOneLiner,
  presentationManagerRequest,
}: V35PreviewDebugPanelProps) {
  const debugPayload = {
    participant,
    savedState,
    notes,
    sourceChecks,
    sourceRisk,
    readinessResult,
    reportSummary,
    reportLinkOrFileName,
    slidesSummary,
    slidesLinkOrFileName,
    presentationChecks,
    presentationOneLiner,
    presentationManagerRequest,
  };

  return (
    <aside className="mt-4 rounded-2xl border bg-white p-4 text-sm shadow-sm" data-testid="v35-preview-debug-panel">
      <h3 className="font-bold text-slate-900">v35 Preview Debug JSON</h3>
      <p className="mt-1 text-slate-600">화면 전환과 저장 결과를 개발자도구 없이 확인하기 위한 preview 전용 패널입니다.</p>
      <pre className="mt-3 max-h-72 overflow-auto rounded-xl bg-slate-100 p-3 text-xs leading-relaxed text-slate-800">
        {JSON.stringify(debugPayload, null, 2)}
      </pre>
    </aside>
  );
}
