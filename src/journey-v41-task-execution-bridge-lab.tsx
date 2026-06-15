export type V41TaskExecutionStage = 'plan' | 'priority' | 'boundary';

export type V41StrategyInput = {
  strategicTask: string;
  csf: string;
  kpi: string;
  initiative: string;
  cycle: string;
};

export type V41TaskExecutionSnapshot = {
  stage: V41TaskExecutionStage;
  title: string;
  executionSentence: string;
  savedAt: string;
  items: string[];
};

const V41_TASK_EXECUTION_BRIDGE_MARKERS = [
  'journey-v41-task-execution-bridge-lab.tsx',
  'V41TaskExecutionBridgeLab',
  'V41TaskExecutionStage',
  'V41TaskExecutionSnapshot',
  'buildV41TaskExecutionSnapshot',
  'ckd.v41.taskExecutionBridge.v1',
  '업무관리 실행계획 만들기',
  '할 일·줄일 일',
  '업무 경계 나누기',
].join('|');
void V41_TASK_EXECUTION_BRIDGE_MARKERS;

export const V41_DEFAULT_STRATEGY_INPUT: V41StrategyInput = {
  strategicTask: 'GLP-1 비만 포트폴리오 실행력을 현장 단위로 높인다',
  csf: '고객 반응 기록과 후속조치 품질을 팀 공통 기준으로 맞춘다',
  kpi: '후속조치 지연 0건, 다음 행동 명확 기록 90% 이상',
  initiative: '고객 반응 → 다음 행동 → 팀장 점검으로 이어지는 2주 실행 루틴',
  cycle: '2주',
};

const doItems = [
  '방문 후 고객 반응을 사실 문장으로 3줄 이내 기록한다',
  '기록 마지막 줄에 다음 행동과 예정일을 반드시 남긴다',
  '팀장은 주 2회 지연·누락 기록만 짧게 확인한다',
];

const reduceItems = [
  '방문 사실만 남기고 다음 행동이 없는 메모',
  '회의에서 CRM 기록을 다시 설명하는 시간',
  '목적 없이 길어지는 기록 양식 수정 논의',
];

const managerBoundaryItems = [
  '성과기준과 완료 기준을 정한다',
  '지연·누락 신호를 보고 우선 지원 대상을 고른다',
  '1on1에서 해석보다 관찰 사실을 먼저 확인한다',
];

const memberBoundaryItems = [
  '방문 목적과 고객 반응을 직접 기록한다',
  '다음 행동과 follow-up 예정일을 스스로 업데이트한다',
  '막히는 고객군과 필요한 지원을 구체적으로 요청한다',
];

function createExecutionSentence(input: V41StrategyInput) {
  return `${input.cycle} 동안 ${input.csf}는 기준으로 삼고, ${input.kpi}를 확인하며, ${input.initiative}을 반복한다.`;
}

function getStageTitle(stage: V41TaskExecutionStage) {
  if (stage === 'plan') return '업무관리 실행계획 만들기';
  if (stage === 'priority') return '할 일·줄일 일';
  return '업무 경계 나누기';
}

function getStageItems(stage: V41TaskExecutionStage, input: V41StrategyInput) {
  if (stage === 'plan') return [input.strategicTask, input.csf, input.kpi, input.initiative];
  if (stage === 'priority') return [...doItems, ...reduceItems];
  return [...managerBoundaryItems, ...memberBoundaryItems];
}

export function buildV41TaskExecutionSnapshot(stage: V41TaskExecutionStage, input: V41StrategyInput = V41_DEFAULT_STRATEGY_INPUT): V41TaskExecutionSnapshot {
  return {
    stage,
    title: getStageTitle(stage),
    executionSentence: createExecutionSentence(input),
    savedAt: new Date().toISOString(),
    items: getStageItems(stage, input),
  };
}

function StageCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <h4 className="text-sm font-black text-slate-950">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm font-bold leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-cyan-700">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function V41TaskExecutionBridgeLab({
  stage = 'plan',
  input = V41_DEFAULT_STRATEGY_INPUT,
  savedAt,
  onSaveSnapshot,
}: {
  stage?: V41TaskExecutionStage;
  input?: V41StrategyInput;
  savedAt?: string;
  onSaveSnapshot?: (snapshot: V41TaskExecutionSnapshot) => void;
}) {
  const executionSentence = createExecutionSentence(input);
  const title = getStageTitle(stage);

  return (
    <section className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v41 task execution bridge · ckd.v41.taskExecutionBridge.v1</p>
          <h3 className="mt-2 text-xl font-black text-slate-950">{title}</h3>
        </div>
        <div className="flex flex-col items-start gap-2 md:items-end">
          <button
            type="button"
            className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-cyan-800"
            onClick={() => onSaveSnapshot?.(buildV41TaskExecutionSnapshot(stage, input))}
          >
            이 단계 저장
          </button>
          {savedAt ? <p className="text-xs font-bold text-cyan-700">저장됨: {new Date(savedAt).toLocaleString('ko-KR')}</p> : null}
        </div>
      </div>

      <p className="mt-3 rounded-2xl bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950">{executionSentence}</p>

      {stage === 'plan' ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <StageCard title="성과기준" items={[input.strategicTask, input.csf, input.kpi]} />
          <StageCard title="실행주기" items={[input.initiative, `${input.cycle} 단위 점검`, '기록 품질과 후속조치 지연을 함께 본다']} />
        </div>
      ) : null}

      {stage === 'priority' ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <StageCard title="먼저 할 일" items={doItems} />
          <StageCard title="잠시 줄일 일" items={reduceItems} />
        </div>
      ) : null}

      {stage === 'boundary' ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <StageCard title="팀장이 확인할 일" items={managerBoundaryItems} />
          <StageCard title="팀원이 직접 맡을 일" items={memberBoundaryItems} />
        </div>
      ) : null}
    </section>
  );
}
