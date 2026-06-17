import { useStored } from './journey-storage';
import { V40VNextTaskExecutionDesignLab } from './journey-v40-vnext-task-management-lab';

const PERFORMANCE_STORAGE_KEY = 'ckd.v40-vnext.performanceCascade.v1';

const V40_VNEXT_TASK_EXECUTION_BRIDGE_MARKERS = [
  'V40VNextTaskExecutionBridgeLab',
  '5단계 성과관리 압축 산출물 → 6단계 업무관리 실행 과제화',
  '이번 2주 동안 먼저 볼 성과 신호',
  '8단계 업무관리로 넘길 실행 기준',
  'ckd.v40-vnext.performanceCascade.v1',
].join('|');
void V40_VNEXT_TASK_EXECUTION_BRIDGE_MARKERS;

type PerformanceState = Record<string, any> & {
  twoWeekFirstAction?: string;
  pauseActivity?: string;
  midCheckQuestion?: string;
  finalExecutionStandard?: string;
};

const DEFAULT_PERFORMANCE_STATE: PerformanceState = {};

function line(label: string, value?: string) {
  return (
    <p>
      <span className="font-black text-slate-700">{label}: </span>
      <span>{value?.trim() || '미작성'}</span>
    </p>
  );
}

export function V40VNextTaskExecutionBridgeLab() {
  const [performanceState] = useStored<PerformanceState>(PERFORMANCE_STORAGE_KEY, DEFAULT_PERFORMANCE_STATE);
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm leading-6 text-cyan-950">
          <p className="font-black">성과관리에서 업무관리로 넘긴 실행 기준</p>
          <p className="mt-1 text-xs font-bold leading-5">
            기본 운영에서는 6·7단계를 숨겼기 때문에, 5단계 마지막에 작성한 압축 산출물을 업무관리의 출발점으로 사용합니다.
          </p>
        </div>
        <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          {line('이번 2주 동안 먼저 볼 성과 신호', performanceState.twoWeekFirstAction)}
          {line('잠시 줄일 활동', performanceState.pauseActivity)}
          {line('팀장 중간 점검 질문', performanceState.midCheckQuestion)}
          {line('업무관리로 넘길 실행 기준', performanceState.finalExecutionStandard)}
        </div>
      </section>
      <V40VNextTaskExecutionDesignLab />
    </section>
  );
}
