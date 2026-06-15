export type V41PeopleCandidate = {
  id: string;
  name: string;
  roleSignal: string;
  observedFact: string;
  possibleInterpretation: string;
  oneOnOnePurpose: string;
  avoidPhrase: string;
  firstQuestionFocus: string;
  urgency: number;
};

const V41_PEOPLE_SELECTION_MARKERS = [
  'journey-v41-people-selection-lab.tsx',
  'V41PeopleSelectionLab',
  'selectV41OneOnOneCandidate',
  'ckd.v41.peopleSelection.v1',
  '1on1 대상 고르기',
].join('|');
void V41_PEOPLE_SELECTION_MARKERS;

export const V41_PEOPLE_CANDIDATES: V41PeopleCandidate[] = [
  {
    id: 'M06',
    name: '김재호 차장',
    roleSignal: '실행지연·CRM 부실형',
    observedFact: '콜 실행은 유지되지만 CRM 기록과 후속조치율이 낮다.',
    possibleInterpretation: '업무 태도 문제가 아니라 현장 대응 이후 정리 루틴이 약할 수 있다.',
    oneOnOnePurpose: '감시가 아니라 실행 품질 기준과 기록 완료 기준을 함께 맞춘다.',
    avoidPhrase: '왜 이렇게 입력을 안 합니까?',
    firstQuestionFocus: '기록이 밀리는 실제 순간과 방해 요인 확인',
    urgency: 5,
  },
  {
    id: 'M05',
    name: '김문호 차장',
    roleSignal: '방어적 목표미달형',
    observedFact: '목표진척과 실행 속도가 모두 낮고 외부 요인 설명이 반복된다.',
    possibleInterpretation: '방어라기보다 통제 가능한 다음 행동을 아직 분리하지 못했을 수 있다.',
    oneOnOnePurpose: '외부 요인을 인정하되 이번 주 직접 바꿀 수 있는 행동을 합의한다.',
    avoidPhrase: '핑계로 들립니다.',
    firstQuestionFocus: '외부 요인과 본인이 바꿀 수 있는 행동의 분리',
    urgency: 4,
  },
  {
    id: 'M03',
    name: '박재욱 사원',
    roleSignal: '신입 위축형',
    observedFact: 'CRM 기록은 성실하지만 콜 실행률과 고객반응지수가 낮다.',
    possibleInterpretation: '역량 부족보다 접점 전 준비와 작은 성공경험이 부족할 수 있다.',
    oneOnOnePurpose: '고객 접점 전 준비 기준과 작은 성공경험을 설계한다.',
    avoidPhrase: '신입이면 더 적극적으로 해야죠.',
    firstQuestionFocus: '방문 전 가장 불안한 순간과 필요한 준비 지원',
    urgency: 3,
  },
];

export function selectV41OneOnOneCandidate(candidates: V41PeopleCandidate[] = V41_PEOPLE_CANDIDATES) {
  return [...candidates].sort((a, b) => b.urgency - a.urgency)[0] ?? V41_PEOPLE_CANDIDATES[0];
}

function CandidateCard({ candidate, selected }: { candidate: V41PeopleCandidate; selected: boolean }) {
  return (
    <article className={`rounded-2xl border p-4 ${selected ? 'border-cyan-300 bg-cyan-50' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black text-slate-500">{candidate.id} · {candidate.roleSignal}</p>
          <h4 className="mt-1 text-base font-black text-slate-950">{candidate.name}</h4>
        </div>
        {selected ? <span className="rounded-full bg-cyan-700 px-3 py-1 text-xs font-black text-white">우선</span> : null}
      </div>
      <dl className="mt-3 space-y-2 text-sm leading-6">
        <div>
          <dt className="font-black text-slate-700">관찰사실</dt>
          <dd className="font-bold text-slate-600">{candidate.observedFact}</dd>
        </div>
        <div>
          <dt className="font-black text-slate-700">1on1 목적</dt>
          <dd className="font-bold text-slate-600">{candidate.oneOnOnePurpose}</dd>
        </div>
      </dl>
    </article>
  );
}

export function V41PeopleSelectionLab({ candidates = V41_PEOPLE_CANDIDATES }: { candidates?: V41PeopleCandidate[] }) {
  const selected = selectV41OneOnOneCandidate(candidates);

  return (
    <section className="rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">v41 people selection · ckd.v41.peopleSelection.v1</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">1on1 대상 고르기</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
        업무 경계와 실행지연 신호를 기준으로 먼저 대화할 팀원을 고릅니다. 평가는 보류하고 관찰사실, 해석, 대화 목적을 분리합니다.
      </p>
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} selected={candidate.id === selected.id} />
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-950">
        첫 질문 초점: {selected.firstQuestionFocus}<br />
        피해야 할 말: {selected.avoidPhrase}
      </div>
    </section>
  );
}
