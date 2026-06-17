import { useStored } from './journey-storage';
import { V40VNextPerformanceEnhancedCascadeLabV2 } from './journey-v40-vnext-performance-enhanced-cascade-lab-v2';
import { V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY } from './journey-v40-vnext-performance-strategy-cascade-lab';

type CompactPerformanceState = Record<string, any> & {
  twoWeekFirstAction?: string;
  pauseActivity?: string;
  midCheckQuestion?: string;
  finalExecutionStandard?: string;
  teamMeetingSentenceOne?: string;
  teamMeetingSentenceTwo?: string;
  teamMeetingSentenceThree?: string;
};

const DEFAULT_COMPACT_PERFORMANCE_STATE: CompactPerformanceState = {};

const V40_VNEXT_COMPACT_PERFORMANCE_MARKERS = [
  'V40VNextPerformanceCompactCascadeLab',
  'V40VNextPerformanceEnhancedCascadeLabV2',
  '6·7단계 숨김 기본 운영',
  '우리 조의 2주 성과관리 기준 정리',
  '이번 2주 동안 기록에서 먼저 볼 것',
  '이번 2주 동안 잠시 줄일 일',
  '팀장이 중간에 물어볼 확인 질문',
  '다음 단계에서 실행 과제로 바꿀 기준',
  '2주 성과관리 기준 초안 만들기',
  'ckd.v40-vnext.performanceCascade.v1',
].join('|');
void V40_VNEXT_COMPACT_PERFORMANCE_MARKERS;

function CompactField({ label, help, placeholder, value, onChange }: { label: string; help: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p>
      <textarea
        className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function V40VNextPerformanceCompactCascadeLab() {
  const [state, setState] = useStored<CompactPerformanceState>(V40_VNEXT_PERFORMANCE_CASCADE_STORAGE_KEY, DEFAULT_COMPACT_PERFORMANCE_STATE);
  const update = (patch: Partial<CompactPerformanceState>) => setState({ ...state, ...patch });

  return (
    <section className="space-y-4">
      <V40VNextPerformanceEnhancedCascadeLabV2 />
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-950">
          <p className="font-black">우리 조의 2주 성과관리 기준 정리</p>
          <p className="mt-1 text-xs font-bold leading-5">
            기본 운영에서는 6·7단계를 진행하지 않습니다. 위에서 AI 답변을 항목별로 정리한 뒤, “2주 성과관리 기준 초안 만들기” 또는 “AI 정리 결과를 2주 기준 초안에 반영하기”를 눌러 초안을 만들고 우리 조 언어로 수정합니다.
          </p>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <CompactField
            label="이번 2주 동안 기록에서 먼저 볼 것"
            help="선택한 KPI가 실제 고객 활동 기록이나 팀원 후속 행동에 남는지 확인하는 기준입니다."
            value={state.twoWeekFirstAction ?? ''}
            onChange={(value) => update({ twoWeekFirstAction: value })}
            placeholder="예: 선택한 KPI와 연결되는 고객 질문, 후속 행동, 지원 필요 신호가 기록에 남았는지 먼저 확인한다."
          />
          <CompactField
            label="이번 2주 동안 잠시 줄일 일"
            help="성과 기준과 직접 연결되지 않거나 팀원 부담만 늘리는 활동을 줄입니다."
            value={state.pauseActivity ?? ''}
            onChange={(value) => update({ pauseActivity: value })}
            placeholder="예: 방문 수만 늘리는 반복 활동과 KPI에 직접 연결되지 않는 장문 보고는 잠시 줄인다."
          />
          <CompactField
            label="팀장이 중간에 물어볼 확인 질문"
            help="추궁이 아니라 사실·부족 정보·지원 필요를 확인하는 질문으로 씁니다."
            value={state.midCheckQuestion ?? ''}
            onChange={(value) => update({ midCheckQuestion: value })}
            placeholder="예: 이번 주 기록에서 확인 가능한 사실, 아직 부족한 정보, 팀장 지원이 필요한 부분은 무엇인가요?"
          />
          <CompactField
            label="다음 단계에서 실행 과제로 바꿀 기준"
            help="성과관리 기준을 다음 단계의 실행 과제화로 연결하는 한 문장입니다."
            value={state.finalExecutionStandard ?? ''}
            onChange={(value) => update({ finalExecutionStandard: value })}
            placeholder="예: 선택 KPI와 연결되는 증거가 빠진 활동을 먼저 확인하고, 금요일 점검에서 막힌 이유와 지원 필요 사항을 공유한다."
          />
        </div>
      </section>
    </section>
  );
}
