import { selectV41OneOnOneCandidate, type V41PeopleCandidate } from './journey-v41-people-selection-lab';

export type V41OneOnOneScript = {
  openingLine: string;
  checkQuestion: string;
  agreementQuestion: string;
  followUpMemo: string;
};

const V41_ONE_ON_ONE_PRACTICE_MARKERS = [
  'journey-v41-one-on-one-practice-lab.tsx',
  'V41OneOnOnePracticeLab',
  'buildV41OneOnOneScript',
  'ckd.v41.oneOnOnePractice.v1',
  '1on1 첫 문장',
].join('|');
void V41_ONE_ON_ONE_PRACTICE_MARKERS;

export function buildV41OneOnOneScript(candidate: V41PeopleCandidate, cycle = '2주'): V41OneOnOneScript {
  return {
    openingLine: `${candidate.name}님, 오늘은 잘잘못을 따지기보다 최근 기록과 후속조치가 밀리는 순간을 같이 확인해 보려고 합니다.`,
    checkQuestion: `최근 ${cycle} 동안 고객 방문 후 기록을 남기기 어려웠던 순간이 언제였는지 하나만 짚어볼까요?`,
    agreementQuestion: `그럼 다음 ${cycle} 동안 어떤 기준으로 기록 완료와 후속조치를 맞춰보면 현실적일까요?`,
    followUpMemo: `${candidate.roleSignal} 신호에 대해 ${candidate.firstQuestionFocus}를 확인하고, 다음 ${cycle} 실행 기준 1개와 follow-up 날짜를 합의한다.`,
  };
}

function ScriptBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{value}</p>
    </div>
  );
}

export function V41OneOnOnePracticeLab({
  candidate = selectV41OneOnOneCandidate(),
  cycle = '2주',
}: {
  candidate?: V41PeopleCandidate;
  cycle?: string;
}) {
  const script = buildV41OneOnOneScript(candidate, cycle);

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">v41 one-on-one practice · ckd.v41.oneOnOnePractice.v1</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">1on1 첫 문장</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
        선택한 1on1 대상에게 바로 꺼낼 수 있는 첫 문장, 확인 질문, 행동합의 질문, follow-up 메모를 만듭니다.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ScriptBlock label="첫 문장" value={script.openingLine} />
        <ScriptBlock label="확인 질문" value={script.checkQuestion} />
        <ScriptBlock label="행동합의 질문" value={script.agreementQuestion} />
        <ScriptBlock label="follow-up 메모" value={script.followUpMemo} />
      </div>
      <p className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950">
        주의: {candidate.avoidPhrase}처럼 단정하거나 몰아붙이는 말은 피하고, 관찰사실과 지원 기준부터 확인합니다.
      </p>
    </section>
  );
}
