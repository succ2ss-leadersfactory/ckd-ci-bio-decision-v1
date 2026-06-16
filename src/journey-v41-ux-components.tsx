import { useContext, type ReactNode, createContext } from 'react';
import { V41_VISIBLE_APP_STEPS } from './journey-v41-preview-config';

type V41StepNavigator = (stepNumber: number) => void;

const V41_UX_COMPONENT_MARKERS = [
  'V41FlowStrip',
  'v41 field-friendly flow chips',
  'v41 파일럿 10단계 전체 흐름',
  'v40-vNext parity scaffold',
  '12단계 최종 실행 메모 숨김 유지',
  '시작하기',
  '팀원 보기',
  '질문 다듬기',
  '시장 변화 읽기',
  '팀 기준 만들기',
  '업무관리 실행계획',
  '업무 순서·업무지시',
  '업무 경계·병목 대응',
  '사람관리 1: 대상 선택',
  '사람관리 2: 1on1 실천',
  '1on1 대상 고르기',
  '1on1 첫 문장',
  '업무지시 만들기',
  '할 일·줄일 일',
  '업무 경계 나누기',
  '3단계 질문 다듬기 고정',
  'AI 입력 기준 별도 단계 표시 금지',
  '1단계 팀·이름 필수 게이트',
  'ckd.v41.participant.v1',
].join('|');
void V41_UX_COMPONENT_MARKERS;

const V41StepNavigationContext = createContext<V41StepNavigator | null>(null);

export function V41StepNavigationProvider({ onStepSelect, children }: { onStepSelect: V41StepNavigator; children: ReactNode }) {
  return <V41StepNavigationContext.Provider value={onStepSelect}>{children}</V41StepNavigationContext.Provider>;
}

const v41FlowItems = [
  { step: 1, label: '시작하기', shortLabel: '시작', icon: '🚪' },
  { step: 2, label: '팀원 보기', shortLabel: '팀원', icon: '👥' },
  { step: 3, label: '질문 다듬기', shortLabel: '질문', icon: '✍️' },
  { step: 4, label: '시장 변화 읽기', shortLabel: '시장 읽기', icon: '🔭' },
  { step: 5, label: '팀 기준 만들기', shortLabel: '팀 기준', icon: '🎯' },
  { step: 6, label: '업무관리 실행계획', shortLabel: '실행계획', icon: '🧩' },
  { step: 7, label: '업무 순서·업무지시', shortLabel: '업무지시', icon: '🧭' },
  { step: 8, label: '업무 경계·병목 대응', shortLabel: '경계·병목', icon: '🧱' },
  { step: 9, label: '사람관리 1: 대상 선택', shortLabel: '사람관리 1', icon: '👤' },
  { step: 10, label: '사람관리 2: 1on1 실천', shortLabel: '사람관리 2', icon: '💬' },
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
  const total = V41_VISIBLE_APP_STEPS.length;
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
