import { useContext, type ReactNode, createContext } from 'react';

type V41Tone = 'emerald' | 'sky' | 'cyan' | 'violet' | 'indigo' | 'amber' | 'rose' | 'slate';
type V41StepNavigator = (stepNumber: number) => void;

type V41InfoBadge = {
  label: string;
  value: ReactNode;
  tone?: V41Tone;
  icon?: string;
};

const V41_UX_COMPONENT_MARKERS = [
  'V41FlowStrip',
  'V41StepHero',
  'v41 standalone step hero',
  'v41 field-friendly flow chips',
  'v41 파일럿 10단계 전체 흐름',
  '시작',
  '팀원 보기',
  '질문 다듬기',
  '시장 읽기',
  '팀 기준',
  '업무지시',
  '할 일·줄일 일',
  '업무 경계',
  '1on1 대상',
  '첫 문장',
  '1단계 팀·이름 필수 게이트',
  'ckd.v41.participant.v1',
].join('|');
void V41_UX_COMPONENT_MARKERS;

const V41StepNavigationContext = createContext<V41StepNavigator | null>(null);

export function V41StepNavigationProvider({ onStepSelect, children }: { onStepSelect: V41StepNavigator; children: ReactNode }) {
  return <V41StepNavigationContext.Provider value={onStepSelect}>{children}</V41StepNavigationContext.Provider>;
}

const toneClass = {
  emerald: { border: 'border-emerald-100', bg: 'bg-emerald-50', text: 'text-emerald-700', textStrong: 'text-emerald-950', ring: 'ring-emerald-100' },
  sky: { border: 'border-sky-100', bg: 'bg-sky-50', text: 'text-sky-700', textStrong: 'text-sky-950', ring: 'ring-sky-100' },
  cyan: { border: 'border-cyan-100', bg: 'bg-cyan-50', text: 'text-cyan-700', textStrong: 'text-cyan-950', ring: 'ring-cyan-100' },
  violet: { border: 'border-violet-100', bg: 'bg-violet-50', text: 'text-violet-700', textStrong: 'text-violet-950', ring: 'ring-violet-100' },
  indigo: { border: 'border-indigo-100', bg: 'bg-indigo-50', text: 'text-indigo-700', textStrong: 'text-indigo-950', ring: 'ring-indigo-100' },
  amber: { border: 'border-amber-100', bg: 'bg-amber-50', text: 'text-amber-700', textStrong: 'text-amber-950', ring: 'ring-amber-100' },
  rose: { border: 'border-rose-100', bg: 'bg-rose-50', text: 'text-rose-700', textStrong: 'text-rose-950', ring: 'ring-rose-100' },
  slate: { border: 'border-slate-200', bg: 'bg-slate-50', text: 'text-slate-600', textStrong: 'text-slate-950', ring: 'ring-slate-100' },
};

function V41StatusBadge({ label, value, tone = 'slate', icon }: V41InfoBadge) {
  const toneStyles = toneClass[tone];

  return (
    <div className={`rounded-2xl border ${toneStyles.border} ${toneStyles.bg} px-4 py-3 shadow-sm`}>
      <p className={`flex items-center gap-1.5 text-xs font-black ${toneStyles.text}`}>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {label}
      </p>
      <div className={`mt-1 text-sm font-black ${toneStyles.textStrong}`}>{value}</div>
    </div>
  );
}

export function V41StepHero({
  eyebrow,
  title,
  description,
  icon,
  tone = 'emerald',
  badges,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  icon: string;
  tone?: V41Tone;
  badges: V41InfoBadge[];
}) {
  const toneStyles = toneClass[tone];

  return (
    <section className={`rounded-3xl border ${toneStyles.border} bg-white p-4 shadow-sm md:p-5`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneStyles.bg} text-2xl ring-4 ${toneStyles.ring}`} aria-hidden="true">
            {icon}
          </div>
          <div>
            <p className={`text-xs font-black uppercase tracking-wide ${toneStyles.text}`}>{eyebrow}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950 md:text-2xl">{title}</h2>
            <div className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">{description}</div>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:w-[34rem] xl:grid-cols-3">
          {badges.map((badge, index) => <V41StatusBadge key={`${badge.label}-${index}`} {...badge} />)}
        </div>
      </div>
    </section>
  );
}

const v41FlowItems = [
  { step: 1, label: '시작하기', shortLabel: '시작', icon: '🚪' },
  { step: 2, label: '팀원 보기', shortLabel: '팀원', icon: '👥' },
  { step: 3, label: '질문 다듬기', shortLabel: '질문', icon: '✍️' },
  { step: 4, label: '시장 변화 읽기', shortLabel: '시장 읽기', icon: '🔭' },
  { step: 5, label: '팀 기준 만들기', shortLabel: '팀 기준', icon: '🎯' },
  { step: 6, label: '업무지시 만들기', shortLabel: '업무지시', icon: '🧩' },
  { step: 7, label: '할 일·줄일 일', shortLabel: '우선순위', icon: '🧭' },
  { step: 8, label: '업무 경계 나누기', shortLabel: '업무 경계', icon: '🧱' },
  { step: 9, label: '1on1 대상 고르기', shortLabel: '1on1 대상', icon: '👤' },
  { step: 10, label: '1on1 첫 문장', shortLabel: '첫 문장', icon: '💬' },
];

function v41ParticipantIdentityReady() {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem('ckd.v41.participant.v1');
    if (!raw) return false;
    const participant = JSON.parse(raw) as { groupName?: string; tableName?: string };
    return Boolean(String(participant.groupName ?? '').trim() && String(participant.tableName ?? '').trim());
  } catch {
    return false;
  }
}

function guardV41StepSelect(targetStepNumber: number) {
  if (targetStepNumber <= 1) return true;
  if (v41ParticipantIdentityReady()) return true;
  window.alert('1단계에서 팀과 이름/닉네임을 먼저 입력해 주세요. 2단계부터는 자유롭게 이동할 수 있습니다.');
  return false;
}

export function V41FlowStrip({ currentStep, onStepSelect }: { currentStep: number; onStepSelect?: V41StepNavigator }) {
  const contextStepSelect = useContext(V41StepNavigationContext);
  const handleStepSelect = onStepSelect ?? contextStepSelect;
  const total = v41FlowItems.length;
  const safeCurrent = Math.min(Math.max(currentStep, 1), total);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black text-slate-500">
        <span>흐름</span>
        <span>{safeCurrent} / {total}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {v41FlowItems.map((item, index) => {
          const isCurrent = item.step === safeCurrent;
          const isDone = item.step < safeCurrent;
          const badgeClass = isCurrent
            ? 'border-cyan-300 bg-cyan-50 text-cyan-950 shadow-sm'
            : isDone
              ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900'
              : 'border-slate-100 bg-white text-slate-500 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-900';
          const chipContent = (
            <>
              <span aria-hidden="true">{item.icon}</span>
              <span className="hidden md:inline">{item.step}. {item.label}</span>
              <span className="md:hidden">{item.step}. {item.shortLabel}</span>
            </>
          );
          return (
            <div key={item.step} className="flex items-center gap-2">
              {handleStepSelect ? (
                <button
                  type="button"
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black transition ${badgeClass}`}
                  aria-current={isCurrent ? 'step' : undefined}
                  aria-label={`${item.step}단계 ${item.label}로 이동`}
                  title={`${item.step}단계 ${item.label}로 이동`}
                  onClick={() => {
                    if (!guardV41StepSelect(item.step)) return;
                    handleStepSelect(item.step);
                  }}
                >
                  {chipContent}
                </button>
              ) : (
                <div className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black ${badgeClass}`} aria-current={isCurrent ? 'step' : undefined}>
                  {chipContent}
                </div>
              )}
              {index < v41FlowItems.length - 1 ? <span className="text-xs font-black text-slate-300" aria-hidden="true">→</span> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
