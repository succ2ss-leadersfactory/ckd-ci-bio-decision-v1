import { V40_VNEXT_VISIBLE_APP_STEPS } from './journey-v40-vnext-preview-config';

const V40_VNEXT_PROGRESS_COACH_MARKERS = [
  'V40VNextProgressCoachPanel',
  '조별 진행 코치',
  '중복 상단 요약 제거',
  'v40-vNext 11단계 기준',
  '조별 진행 상태',
  '영역별 바로가기',
].join('|');
void V40_VNEXT_PROGRESS_COACH_MARKERS;

type ParticipantSummary = {
  groupName: string;
  tableName: string;
  representativeSituation: string;
  roleAccepted: boolean;
};

type ProgressCoachPanelProps = {
  currentStep: number;
  participant: ParticipantSummary;
  onStepSelect: (stepIndex: number) => void;
};

type Phase = {
  label: string;
  range: [number, number];
  description: string;
  tone: string;
};

const PHASES: Phase[] = [
  { label: '준비·질문', range: [0, 2], description: '역할, 안전선, AI 질문', tone: 'border-sky-200 bg-sky-50 text-sky-900' },
  { label: '성과관리', range: [3, 4], description: '시장 변화, CSF/KPI, 2주 기준', tone: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  { label: '업무관리', range: [5, 7], description: '실행 과제, 우선순위, 업무 경계', tone: 'border-amber-200 bg-amber-50 text-amber-900' },
  { label: '사람관리·통합', range: [8, 10], description: '1on1 대화와 최종 실행 메모', tone: 'border-indigo-200 bg-indigo-50 text-indigo-900' },
];

const STEP_GUIDES = [
  { action: '조 이름, 테이블, 대표 상황을 정합니다.', output: '우리 조가 다룰 대표 상황' },
  { action: 'AI에 넣으면 안 되는 민감정보를 먼저 지웁니다.', output: '말해도 되는 선 합의' },
  { action: '우리 조의 고민을 AI가 일할 수 있는 질문으로 바꿉니다.', output: '복사 가능한 AI 질문' },
  { action: '공개자료 기반 리서치를 성과관리 질문으로 연결합니다.', output: '리서치·전략회의 산출물' },
  { action: '전사전략과제를 팀 전략과제·CSF·KPI와 2주 기준으로 바꿉니다.', output: '팀 전략과제·CSF·KPI·2주 기준' },
  { action: '성과 기준을 팀원이 실행할 수 있는 업무지시로 바꿉니다.', output: '수정한 업무지시문과 완료 기준' },
  { action: '먼저 할 일, 잠시 줄일 일, 중간 확인 질문을 정합니다.', output: '업무 흐름 3단계' },
  { action: '혼자 처리할 일과 연결해야 할 일을 나눕니다.', output: '업무 경계 선언문' },
  { action: '먼저 이야기할 팀원을 고르고 관찰과 해석을 분리합니다.', output: '1on1 대상과 대화 초점' },
  { action: '1on1 첫 문장, 역할극, 행동 합의를 연습합니다.', output: '코칭 문장과 2주 행동 합의' },
  { action: '성과·업무·사람관리 결과를 하나의 메모로 묶습니다.', output: '2주 실행 메모와 복기 질문' },
];

function phaseStatus(currentStep: number, phase: Phase) {
  if (currentStep > phase.range[1]) return '완료';
  if (currentStep >= phase.range[0]) return '진행 중';
  return '예정';
}

function currentPhase(currentStep: number) {
  return PHASES.find((phase) => currentStep >= phase.range[0] && currentStep <= phase.range[1]) ?? PHASES[0];
}

function shortSituation(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '대표 상황 미작성';
  return trimmed.length > 72 ? `${trimmed.slice(0, 72)}…` : trimmed;
}

export function V40VNextProgressCoachPanel({ currentStep, participant, onStepSelect }: ProgressCoachPanelProps) {
  const current = V40_VNEXT_VISIBLE_APP_STEPS[currentStep] ?? V40_VNEXT_VISIBLE_APP_STEPS[0];
  const guide = STEP_GUIDES[currentStep] ?? STEP_GUIDES[0];
  const phase = currentPhase(currentStep);

  return (
    <section className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">조별 진행 코치</p>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-600">상단 단계 안내와 중복되는 큰 제목은 줄이고, 이 영역에서는 조별 진행 상태와 영역별 이동만 확인합니다.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
          현재 영역: {phase.label}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_1.15fr_2fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black text-slate-500">조별 진행 상태</p>
          <div className="mt-3 space-y-2 text-sm font-bold leading-6 text-slate-700">
            <p><span className="font-black text-slate-950">조:</span> {participant.groupName || '미선택'} / {participant.tableName || '미선택'}</p>
            <p><span className="font-black text-slate-950">대표 상황:</span> {shortSituation(participant.representativeSituation)}</p>
            <p><span className="font-black text-slate-950">역할 합의:</span> {participant.roleAccepted ? '완료' : '미완료'}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black text-slate-500">이번 단계 코칭 포인트</p>
          <p className="mt-2 text-sm font-black leading-6 text-slate-900">{guide.action}</p>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500">산출물: {guide.output}</p>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-400">현재 단계: {current.title}</p>
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          {PHASES.map((item) => {
            const status = phaseStatus(currentStep, item);
            const active = item.label === phase.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onStepSelect(item.range[0])}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${active ? item.tone : 'border-slate-200 bg-white text-slate-700'}`}
              >
                <p className="text-xs font-black">{status}</p>
                <p className="mt-1 text-sm font-black">{item.label}</p>
                <p className="mt-2 text-xs font-bold leading-5 opacity-80">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
