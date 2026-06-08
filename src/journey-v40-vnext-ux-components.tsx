import { useContext, type ReactNode, createContext } from 'react';
import { V40_VNEXT_VISIBLE_APP_STEPS } from './journey-v40-vnext-preview-config';

type V40VNextStepNavigator = (stepNumber: number) => void;

const V40_VNEXT_UX_COMPONENT_MARKERS = [
  'V40VNextFlowStrip',
  '12단계 전체 흐름',
  '팀장 역할 시작',
  '역할·팀원 이해',
  '말해도 되는 선',
  '성과관리 1',
  '성과관리 2',
  '업무관리 1',
  '업무관리 2',
  '업무관리 3',
  '사람관리 1',
  '사람관리 2',
  '최종 실행 메모',
].join('|');
void V40_VNEXT_UX_COMPONENT_MARKERS;

const V40VNextStepNavigationContext = createContext<V40VNextStepNavigator | null>(null);

export function V40VNextStepNavigationProvider({ onStepSelect, children }: { onStepSelect: V40VNextStepNavigator; children: ReactNode }) {
  return <V40VNextStepNavigationContext.Provider value={onStepSelect}>{children}</V40VNextStepNavigationContext.Provider>;
}

const v40FlowItems = [
  { step: 1, label: '팀장 역할 시작하기', shortLabel: '팀장 역할 시작', icon: '🤝' },
  { step: 2, label: '역할과 팀원 구성 이해하기', shortLabel: '역할·팀원 이해', icon: '👥' },
  { step: 3, label: '말해도 되는 선 확인', shortLabel: '안전선 확인', icon: '🛡️' },
  { step: 4, label: 'AI 질문 다듬기', shortLabel: '질문 다듬기', icon: '✍️' },
  { step: 5, label: '성과관리 1: 시장 변화에서 성과 질문 찾기', shortLabel: '성과관리 1', icon: '🔭' },
  { step: 6, label: '성과관리 2: 전략과제·CSF·KPI 분해', shortLabel: '성과관리 2', icon: '🎯' },
  { step: 7, label: '업무관리 1: 성과 기준을 실행 과제로 바꾸기', shortLabel: '업무관리 1', icon: '🧩' },
  { step: 8, label: '업무관리 2: 우선순위와 업무 흐름 정리하기', shortLabel: '업무관리 2', icon: '🧭' },
  { step: 9, label: '업무관리 3: 혼자 해결하면 안 되는 일 구분하기', shortLabel: '업무관리 3', icon: '🧱' },
  { step: 10, label: '사람관리 1: 먼저 이야기할 팀원 고르기', shortLabel: '사람관리 1', icon: '👤' },
  { step: 11, label: '사람관리 2: 1on1 대화 설계와 실천하기', shortLabel: '사람관리 2', icon: '💬' },
  { step: 12, label: '2주 실행 메모와 복기 질문 완성하기', shortLabel: '최종 실행 메모', icon: '✅' },
];

export function V40VNextFlowStrip({ currentStep, onStepSelect }: { currentStep: number; onStepSelect?: V40VNextStepNavigator }) {
  const contextStepSelect = useContext(V40VNextStepNavigationContext);
  const handleStepSelect = onStepSelect ?? contextStepSelect;
  const total = V40_VNEXT_VISIBLE_APP_STEPS.length;
  const safeCurrent = Math.min(Math.max(currentStep, 1), total);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-4">
      <div className="mb-2 flex items-center justify-between gap-3 text-xs font-black text-slate-500">
        <span>전체 흐름</span>
        <span>{safeCurrent} / {total}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {v40FlowItems.map((item, index) => {
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
                  onClick={() => handleStepSelect(item.step)}
                >
                  {chipContent}
                </button>
              ) : (
                <div className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black ${badgeClass}`} aria-current={isCurrent ? 'step' : undefined}>
                  {chipContent}
                </div>
              )}
              {index < v40FlowItems.length - 1 ? <span className="text-xs font-black text-slate-300" aria-hidden="true">→</span> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
