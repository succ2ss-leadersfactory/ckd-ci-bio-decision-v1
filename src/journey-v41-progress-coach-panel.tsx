import { V41_VISIBLE_APP_STEPS } from './journey-v41-preview-config';

const V41_PROGRESS_COACH_MARKERS = [
  'V41ProgressCoachPanel',
  '지금 할 일',
  '현재 단계에서 하나만 확인하세요',
  'v41 progress coach copy refined',
  'v41 파일럿 11단계 기준',
  '12단계 최종 실행 메모 숨김 유지',
  '진행 정보',
  '바로 이동',
  '팀',
  '이름/닉네임',
  '1단계 팀·이름 필수 게이트',
  'ckd.v41.participant.v1',
].join('|');
void V41_PROGRESS_COACH_MARKERS;

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
  shortLabel: string;
  range: [number, number];
  description: string;
  tone: string;
};

const PHASES: Phase[] = [
  { label: '준비·역할', shortLabel: '준비', range: [0, 3], description: '역할·안전선·질문', tone: 'border-sky-200 bg-sky-50 text-sky-900' },
  { label: '성과관리', shortLabel: '성과', range: [4, 5], description: '시장 변화·2주 기준', tone: 'border-emerald-200 bg-emerald-50 text-emerald-900' },
  { label: '업무관리', shortLabel: '업무', range: [6, 8], description: '실행 과제·업무 경계', tone: 'border-amber-200 bg-amber-50 text-amber-900' },
  { label: '사람관리', shortLabel: '사람', range: [9, 10], description: '1on1 대상·첫 문장', tone: 'border-indigo-200 bg-indigo-50 text-indigo-900' },
];

const STEP_GUIDES = [
  { action: '팀과 이름을 입력합니다.', output: '팀 / 이름' },
  { action: '이대호 팀장과 팀원 7명을 확인합니다.', output: '역할 이해' },
  { action: 'AI에 넣기 전 가려야 할 정보를 확인합니다.', output: '입력 기준' },
  { action: '막연한 고민을 AI 질문으로 바꿉니다.', output: '수정한 질문' },
  { action: '시장 변화에서 우리 팀 질문을 뽑습니다.', output: '성과 질문' },
  { action: '전사전략을 팀 기준과 2주 실행 기준으로 바꿉니다.', output: 'CSF·KPI·2주 기준' },
  { action: '성과 기준을 업무지시로 바꿉니다.', output: '업무지시문' },
  { action: '먼저 할 일과 잠시 줄일 일을 정합니다.', output: '업무 흐름' },
  { action: '혼자 할 일과 연결할 일을 나눕니다.', output: '업무 경계' },
  { action: '먼저 이야기할 팀원을 고릅니다.', output: '1on1 대상' },
  { action: '1on1 첫 문장과 행동 합의를 준비합니다.', output: '첫 문장·합의' },
];

function phaseStatus(currentStep: number, phase: Phase) {
  if (currentStep > phase.range[1]) return '완료';
  if (currentStep >= phase.range[0]) return '진행';
  return '예정';
}

function currentPhase(currentStep: number) {
  return PHASES.find((phase) => currentStep >= phase.range[0] && currentStep <= phase.range[1]) ?? PHASES[0];
}

function shortSituation(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '선택 입력';
  return trimmed.length > 42 ? `${trimmed.slice(0, 42)}…` : trimmed;
}

function participantIdentityReady(participant: ParticipantSummary) {
  return Boolean(participant.groupName.trim() && participant.tableName.trim());
}

function showEntryGateMessage() {
  window.alert('1단계에서 팀과 이름/닉네임을 먼저 입력해 주세요. 2단계부터는 자유롭게 이동할 수 있습니다.');
}

export function V41ProgressCoachPanel({ currentStep, participant, onStepSelect }: ProgressCoachPanelProps) {
  const current = V41_VISIBLE_APP_STEPS[currentStep] ?? V41_VISIBLE_APP_STEPS[0];
  const guide = STEP_GUIDES[currentStep] ?? STEP_GUIDES[0];
  const phase = currentPhase(currentStep);
  const identityReady = participantIdentityReady(participant);

  return (
    <section className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-700">지금 할 일</p>
          <h2 className="mt-1 text-lg font-black leading-tight text-slate-950 md:text-xl">{guide.action}</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-500">현재 단계에서 하나만 확인하세요. 필요한 영역은 오른쪽 카드로 바로 이동할 수 있습니다.</p>
        </div>
        <div className="w-fit rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
          {currentStep + 1} / {V41_VISIBLE_APP_STEPS.length} · {phase.label}
        </div>
      </div>

      {!identityReady ? <div className="mb-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-900">팀과 이름/닉네임을 입력하면 2단계 이후를 자유롭게 선택할 수 있습니다.</div> : null}

      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-black text-slate-500">진행 정보</p>
          <div className="mt-3 space-y-1.5 text-sm font-bold leading-6 text-slate-700">
            <p><span className="font-black text-slate-950">팀:</span> {participant.groupName || '미선택'}</p>
            <p><span className="font-black text-slate-950">이름:</span> {participant.tableName || '미입력'}</p>
            <p><span className="font-black text-slate-950">상황:</span> {shortSituation(participant.representativeSituation)}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-xs font-black text-cyan-700">이번 단계 산출물</p>
          <p className="mt-2 text-sm font-black leading-6 text-cyan-950">{guide.output}</p>
          <p className="mt-2 text-xs font-bold leading-5 text-cyan-800">{current.title}</p>
        </div>

        <div className="grid gap-2 md:grid-cols-4">
          {PHASES.map((item) => {
            const status = phaseStatus(currentStep, item);
            const active = item.label === phase.label;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  if (!identityReady && item.range[0] > 0) {
                    showEntryGateMessage();
                    return;
                  }
                  onStepSelect(item.range[0]);
                }}
                className={`rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${active ? item.tone : 'border-slate-200 bg-white text-slate-700'}`}
              >
                <p className="text-[11px] font-black">{status}</p>
                <p className="mt-1 text-sm font-black">{item.shortLabel}</p>
                <p className="mt-1 text-xs font-bold leading-5 opacity-80">{item.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
