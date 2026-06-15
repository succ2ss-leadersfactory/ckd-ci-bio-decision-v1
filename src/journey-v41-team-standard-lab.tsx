type V41TeamStandardItem = {
  title: string;
  question: string;
  output: string;
};

const V41_TEAM_STANDARD_MARKERS = [
  'journey-v41-team-standard-lab.tsx',
  'V41TeamStandardLab',
  'ckd.v41.teamStandard.v1',
  '팀 기준 만들기',
  '실행계획으로 넘길 기준',
].join('|');
void V41_TEAM_STANDARD_MARKERS;

const standardItems: V41TeamStandardItem[] = [
  {
    title: '기록 기준',
    question: '고객 반응 기록에서 반드시 보여야 하는 것은 무엇인가?',
    output: '고객 반응, 다음 행동, follow-up 예정일을 한 번에 확인할 수 있어야 한다.',
  },
  {
    title: '점검 기준',
    question: '팀장이 매번 전부 보지 않고도 확인할 신호는 무엇인가?',
    output: '다음 행동 없음, follow-up 지연, 코칭 필요 여부만 우선 확인한다.',
  },
  {
    title: '대화 기준',
    question: '팀원에게 지적보다 먼저 확인할 것은 무엇인가?',
    output: '해석보다 관찰사실을 먼저 묻고, 막힌 지점을 함께 찾는다.',
  },
];

function StandardCard({ item }: { item: V41TeamStandardItem }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{item.title}</p>
      <h4 className="mt-2 text-sm font-black leading-6 text-slate-950">{item.question}</h4>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">{item.output}</p>
    </article>
  );
}

export function V41TeamStandardLab() {
  return (
    <section className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">v41 team standard · ckd.v41.teamStandard.v1</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">팀 기준 만들기</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
        실행계획으로 넘어가기 전에 팀장이 확인할 기준을 먼저 정리합니다. 기준은 많을수록 좋은 것이 아니라, 다음 행동으로 연결될 만큼만 명확해야 합니다.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {standardItems.map((item) => (
          <StandardCard key={item.title} item={item} />
        ))}
      </div>
      <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-950">
        실행계획으로 넘길 기준: 고객 반응 기록 → 다음 행동 → follow-up 점검 → 1on1 코칭 필요 여부가 이어져야 합니다.
      </div>
    </section>
  );
}
