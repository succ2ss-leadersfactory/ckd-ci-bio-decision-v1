import { V38CustomerJudgmentLab } from './journey-v38-customer-judgment-lab';

type JudgmentFrameItem = {
  title: string;
  signal: string;
  teamLeaderQuestion: string;
  nextMove: string;
  className: string;
};

type LabBlockItem = {
  title: string;
  description: string;
};

const CUSTOMER_DATA_JUDGMENT_FRAME: JudgmentFrameItem[] = [
  {
    title: '기회성 Data',
    signal: '고객군의 잠재력, 자료 요청, 관심 표현처럼 기회로 읽힐 수 있는 신호입니다.',
    teamLeaderQuestion: '이 신호가 실제 행동 의지로 이어지고 있는가, 아니면 잠재력만 큰 상태인가?',
    nextMove: '반응성·실행 가능성 Data와 함께 보고 집중 후보인지 확인합니다.',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
  {
    title: '반응성 Data',
    signal: '최근 콜 반응, 질문 증가, 후속 미팅 동의·보류처럼 고객의 현재 반응을 보여주는 신호입니다.',
    teamLeaderQuestion: '고객은 지금 설득을 기다리는가, 확인 질문을 원하는가, 아니면 속도 조절이 필요한가?',
    nextMove: '좋은 반응과 주의 신호를 분리하고 고객의 다음 질문을 예상합니다.',
    className: 'border-cyan-200 bg-cyan-50 text-cyan-950',
  },
  {
    title: '실행 가능성 Data',
    signal: '최근 방문, 접촉 성공률, 후속조치 완료율, CRM 기록처럼 2주 안에 움직일 수 있는지를 보여주는 신호입니다.',
    teamLeaderQuestion: '이 고객은 지금 팀원이 실제로 준비하고 실행할 수 있는 고객인가?',
    nextMove: '실행 가능 고객과 준비가 더 필요한 고객을 분리합니다.',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-950',
  },
  {
    title: '리스크 Data',
    signal: '관계 수준, 컴플라이언스 민감도, 고객 부담·피로감처럼 접근 방식의 안전선을 정하는 신호입니다.',
    teamLeaderQuestion: '기회가 커 보여도 표현·자료·접촉 강도에서 넘지 말아야 할 선은 무엇인가?',
    nextMove: '승인된 자료 범위, 표현 안전선, 접촉 강도를 먼저 점검합니다.',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    title: '판단 유보 Data',
    signal: '정보 부족, CRM 기록 부족, 보류 이유 불명확처럼 결론보다 확인이 먼저 필요한 신호입니다.',
    teamLeaderQuestion: '지금 결론을 내리면 과잉해석이 되는 Data는 무엇인가?',
    nextMove: '우선순위 결정보다 부족한 정보와 확인 질문을 먼저 정리합니다.',
    className: 'border-slate-200 bg-slate-50 text-slate-800',
  },
];

const CUSTOMER_DATA_LAB_BLOCKS: LabBlockItem[] = [
  {
    title: 'Block 0. 고객 Data 판단 프레임',
    description: '기회성·반응성·실행 가능성·리스크·판단 유보 Data를 나누어 고객 신호를 읽습니다.',
  },
  {
    title: 'Block 1. 좋은 신호와 주의 신호 구분',
    description: '좋아 보이는 Data와 실제 실행을 막는 신호를 분리합니다.',
  },
  {
    title: 'Block 2. 판단 유보 Data 확인',
    description: '단정하기 어려운 정보, 빠진 정보, 추가 확인 질문을 정리합니다.',
  },
  {
    title: 'Block 3. 우선순위 판단 기준',
    description: '집중·유지·보류·정보 보완 중 어디에 가까운지 판단할 준비를 합니다.',
  },
  {
    title: 'Block 4. AI 분석 프롬프트 준비',
    description: 'AI에게 넘길 수 있는 안전한 입력 범위와 기대 출력 구조를 준비합니다.',
  },
];

export function V39CustomerJudgmentLab() {
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-slate-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Customer Data Judgment Frame</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">고객 Data 판단 프레임</h2>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-700">
              6단계는 고객을 점수화하거나 등급화하는 단계가 아닙니다. 고객 Data에서 믿을 수 있는 신호와 아직 부족한 정보를 구분하고,
              2주 안에 실행 가능한 다음 행동을 판단하는 단계입니다.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-xs font-black leading-5 text-cyan-800 shadow-sm">
            판단 기준: 설득 · 확인 · 보류 · 정보 보완
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {CUSTOMER_DATA_JUDGMENT_FRAME.map((item) => (
            <article key={item.title} className={`rounded-2xl border p-4 ${item.className}`}>
              <p className="text-sm font-black">{item.title}</p>
              <p className="mt-2 text-xs font-bold leading-5 opacity-90">{item.signal}</p>
              <div className="mt-3 rounded-xl bg-white/75 p-3 text-xs font-bold leading-5 text-slate-800">
                <p className="font-black text-slate-950">팀장 판단 질문</p>
                <p className="mt-1">{item.teamLeaderQuestion}</p>
              </div>
              <p className="mt-3 text-xs font-black leading-5">다음 행동: {item.nextMove}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">6단계 진행 구조</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
              이번 단계에서는 먼저 Data를 안전하게 읽는 관점을 세우고, 아래 고객 유형 A~F 분석에서 실제 신호를 분류합니다.
              고객별 우선순위 선택과 AI 분석 프롬프트 생성은 이후 단계에서 확장합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-black leading-5 text-slate-700">
            실제 고객명·병원명·의료진명·제품명·내부 수치는 입력하지 않습니다.
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {CUSTOMER_DATA_LAB_BLOCKS.map((block) => (
            <article key={block.title} className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black text-cyan-700">{block.title}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-700">{block.description}</p>
            </article>
          ))}
        </div>
      </section>

      <V38CustomerJudgmentLab />
    </section>
  );
}
