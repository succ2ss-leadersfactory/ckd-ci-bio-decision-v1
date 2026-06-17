import { V40LiteAiWorkflow, V40_LITE_EMPTY_AI_DRAFT } from './journey-v40-lite-ai-workflow';
import { V40_LITE_DEFAULT_STEP5_METRICS, type V40LiteStep5Metrics } from './journey-v40-lite-store';

const DECISION_QUESTIONS = [
  '방문 이후 후속 행동이 실제로 이어지고 있는가?',
  '고객 반응 기록이 다음 실행으로 연결되고 있는가?',
  '팀원별 준비 수준 차이가 실행 차이로 이어지고 있는가?',
  '활동량은 많은데 다음 행동 약속이 부족한가?',
  '특정 팀원에게 실행 부담이 몰리고 있는가?',
];

const TEAM_SITUATIONS = [
  '방문 건수는 늘었지만 후속 실행 기록이 약하다',
  '고객 반응은 있는데 실제 필요 수준은 불분명하다',
  '팀원별로 고객 질문을 다루는 수준이 다르다',
  '일부 팀원은 활동은 많은데 정리가 늦다',
  '고객 반응을 팀 내에서 공유하는 방식이 제각각이다',
];

const BEHAVIOR_SIGNALS = [
  '활동은 많은데 후속 정리가 약한 팀원',
  '고객 반응은 잘 얻지만 다음 행동 연결이 약한 팀원',
  '준비는 꼼꼼하지만 실행 속도가 느린 팀원',
  '고객 질문을 부담스러워하는 팀원',
  '혼자 판단하고 공유가 늦은 팀원',
];

const LEADER_ACTIONS = [
  '1:1 대화 준비',
  '고객 반응 확인 질문 준비',
  '후속 실행 체크 문장 준비',
  '역할 재정렬 대화 준비',
  '작은 실행 약속 만들기',
];

function mergeStep5Metrics(metrics: V40LiteStep5Metrics): V40LiteStep5Metrics {
  return {
    ...V40_LITE_DEFAULT_STEP5_METRICS,
    ...metrics,
    metricAiDraft: metrics.metricAiDraft ?? V40_LITE_EMPTY_AI_DRAFT,
    actionAiDraft: metrics.actionAiDraft ?? V40_LITE_EMPTY_AI_DRAFT,
    aiDraft: metrics.aiDraft ?? V40_LITE_EMPTY_AI_DRAFT,
    teamSituations: Array.isArray(metrics.teamSituations) ? metrics.teamSituations : [],
    selectedBehaviorSignals: Array.isArray(metrics.selectedBehaviorSignals) ? metrics.selectedBehaviorSignals : [],
  };
}

function toggleLimited(current: string[], value: string, limit: number) {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (current.length >= limit) return current;
  return [...current, value];
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function ChoiceButton({ selected, disabled, children, onClick }: { selected: boolean; disabled?: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`rounded-2xl border px-4 py-3 text-left text-sm font-bold leading-6 transition ${
        selected
          ? 'border-cyan-700 bg-cyan-700 text-white shadow-sm'
          : disabled
            ? 'border-slate-200 bg-slate-100 text-slate-400'
            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 hover:bg-cyan-50'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function TextArea({ label, help, placeholder, value, onChange }: { label: string; help: string; placeholder: string; value: string; onChange: (next: string) => void }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{help}</p>
      <textarea
        className="mt-3 min-h-24 w-full rounded-2xl border bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

export function V40LiteStep5DecisionFlow({
  metrics,
  setMetrics,
}: {
  metrics: V40LiteStep5Metrics;
  setMetrics: (next: V40LiteStep5Metrics) => void;
}) {
  const current = mergeStep5Metrics(metrics);
  const update = (patch: Partial<V40LiteStep5Metrics>) => setMetrics({ ...current, ...patch });
  const requiredCount = [
    current.decisionQuestion,
    current.teamSituations.length > 0 ? 'selected' : '',
    current.coreMetric,
    current.supportSignal,
    current.safetyLine,
    current.selectedBehaviorSignals.length > 0 ? 'selected' : '',
    current.behaviorCheckQuestion,
    current.leaderAction,
    current.finalPrep,
    current.step6Handoff,
  ].filter((item) => String(item).trim().length > 0).length;

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Step 5 · v39 구조 기반 현업 판단 흐름</p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-black leading-tight text-slate-950">이번 2주, 우리 팀 실행이 어디서 끊기는지 봅니다</h2>
            <p className="mt-3 max-w-4xl text-sm font-bold leading-7 text-slate-700">
              v39의 핵심 흐름인 우리 팀 지표 정하기, 우리 팀 유사 유형 선택, AI 결과 자동분리, 팀장 행동 준비물 만들기를 유지합니다.
              다만 실제 팀장 판단 순서에 맞게 판단 질문을 먼저 잡고, 지표와 행동 신호를 근거로 팀장 개입 행동까지 한 번에 정리합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-cyan-900 shadow-sm">진행 {requiredCount} / 10</div>
        </div>
      </section>

      <Section eyebrow="1. 판단 질문" title="이번 2주에 팀장으로서 먼저 확인할 질문을 고릅니다">
        <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700">지표부터 고르지 않습니다. 먼저 “이번 2주에 무엇을 판단해야 하는가?”를 정합니다.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {DECISION_QUESTIONS.map((question) => (
            <ChoiceButton key={question} selected={current.decisionQuestion === question} onClick={() => update({ decisionQuestion: question })}>
              {question}
            </ChoiceButton>
          ))}
        </div>
      </Section>

      <Section eyebrow="2. 우리 팀 상황" title="우리 팀에 가장 가까운 상황을 1~2개 고릅니다">
        <p className="rounded-2xl bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700">v39의 상황 선택 흐름은 유지하되, 교육장에서는 1~2개만 고릅니다. 많이 고르는 것보다 지금 볼 실행 이슈를 좁히는 것이 중요합니다.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {TEAM_SITUATIONS.map((situation) => {
            const selected = current.teamSituations.includes(situation);
            return (
              <ChoiceButton
                key={situation}
                selected={selected}
                disabled={!selected && current.teamSituations.length >= 2}
                onClick={() => update({ teamSituations: toggleLimited(current.teamSituations, situation, 2) })}
              >
                {situation}
              </ChoiceButton>
            );
          })}
        </div>
      </Section>

      <Section eyebrow="3. 우리 팀 지표 정하기" title="꼭 볼 지표, 함께 볼 신호, 성급하게 보면 안 되는 기준을 정합니다">
        <div className="grid gap-3 lg:grid-cols-3">
          <TextArea
            label="꼭 볼 지표 1개"
            help="v39의 핵심 지표 3개를 교육장용으로 1개로 압축합니다."
            placeholder="예: 방문 후 후속 실행 메모"
            value={current.coreMetric}
            onChange={(coreMetric) => update({ coreMetric, primaryMetric: coreMetric })}
          />
          <TextArea
            label="함께 볼 현장 신호 1개"
            help="숫자만으로 놓칠 수 있는 팀원 움직임이나 고객 반응의 질을 봅니다."
            placeholder="예: 고객이 먼저 꺼낸 질문의 구체성"
            value={current.supportSignal}
            onChange={(supportSignal) => update({ supportSignal, fieldSignal: supportSignal })}
          />
          <TextArea
            label="성급하게 보면 안 되는 기준 1개"
            help="v39의 안전선 지표를 현장 언어로 바꿉니다."
            placeholder="예: 방문 수가 많다고 실행이 잘된 것은 아니다"
            value={current.safetyLine}
            onChange={(safetyLine) => update({ safetyLine, carefulInterpretation: safetyLine })}
          />
        </div>
      </Section>

      <V40LiteAiWorkflow
        stepTitle="5단계 AI 1차: 우리 팀 지표와 현장 신호 검토"
        contextLines={[
          'v39의 우리 팀 지표 정하기를 교육장 실습용으로 압축한 상황입니다.',
          `팀장 판단 질문: ${current.decisionQuestion || '미선택'}`,
          `우리 팀 상황: ${current.teamSituations.join(' / ') || '미선택'}`,
          '팀장이 먼저 고른 지표와 현장 신호를 AI가 검토하고 보완합니다.',
          '실제 고객명, 기관명, 제품명, 민감한 성과 수치는 AI에 넣지 않습니다.',
        ]}
        inputSummary={[
          { label: '꼭 볼 지표', value: current.coreMetric },
          { label: '함께 볼 현장 신호', value: current.supportSignal },
          { label: '성급하게 보면 안 되는 기준', value: current.safetyLine },
        ]}
        aiDraft={current.metricAiDraft}
        onAiDraftChange={(metricAiDraft) => update({ metricAiDraft })}
        finalPlaceholder="예: 이번 2주에는 방문 후 후속 실행 메모를 중심으로 보되, 고객 질문의 구체성과 다음 행동 약속 여부를 함께 확인하겠습니다."
      />

      <Section eyebrow="4. 우리 팀 유사 행동 신호" title="우리 팀에서 비슷하게 보이는 실행 신호를 1~2개 고릅니다">
        <p className="rounded-2xl bg-cyan-50 p-3 text-sm font-bold leading-6 text-cyan-900">사람을 분류하려는 것이 아닙니다. 지금 팀장이 눈여겨봐야 할 행동 신호를 고르는 단계입니다.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {BEHAVIOR_SIGNALS.map((signal) => {
            const selected = current.selectedBehaviorSignals.includes(signal);
            return (
              <ChoiceButton
                key={signal}
                selected={selected}
                disabled={!selected && current.selectedBehaviorSignals.length >= 2}
                onClick={() => update({ selectedBehaviorSignals: toggleLimited(current.selectedBehaviorSignals, signal, 2) })}
              >
                {signal}
              </ChoiceButton>
            );
          })}
        </div>
        <TextArea
          label="이 행동 신호를 보며 확인할 질문"
          help="선택한 행동 신호를 보고 팀장이 바로 물어봐야 할 질문을 적습니다."
          placeholder="예: 후속 정리가 약한 이유가 시간 부족인지, 고객 필요를 못 잡아서인지 확인해야 한다."
          value={current.behaviorCheckQuestion}
          onChange={(behaviorCheckQuestion) => update({ behaviorCheckQuestion, followUpQuestion: behaviorCheckQuestion })}
        />
      </Section>

      <Section eyebrow="5. 팀장 행동 선택" title="이번 2주에 팀장이 먼저 할 행동을 하나 고릅니다">
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {LEADER_ACTIONS.map((action) => (
            <ChoiceButton key={action} selected={current.leaderAction === action} onClick={() => update({ leaderAction: action })}>
              {action}
            </ChoiceButton>
          ))}
        </div>
      </Section>

      <V40LiteAiWorkflow
        stepTitle="5단계 AI 2차: 팀장 행동 준비물 초안 만들기"
        contextLines={[
          'v39의 AI 2차 준비물 생성을 교육장 실습용으로 압축한 상황입니다.',
          `팀장 판단 질문: ${current.decisionQuestion || '미선택'}`,
          `선택한 행동 신호: ${current.selectedBehaviorSignals.join(' / ') || '미선택'}`,
          `팀장이 선택한 행동: ${current.leaderAction || '미선택'}`,
          'AI가 만든 문장은 초안이며, 최종 문장은 팀장이 현장 언어로 수정합니다.',
          '실제 고객명, 기관명, 제품명, 민감한 성과 수치는 AI에 넣지 않습니다.',
        ]}
        inputSummary={[
          { label: '꼭 볼 지표', value: current.coreMetric },
          { label: '함께 볼 현장 신호', value: current.supportSignal },
          { label: '선택한 행동 신호', value: current.selectedBehaviorSignals.join(' / ') },
          { label: '팀장이 확인할 질문', value: current.behaviorCheckQuestion },
          { label: '팀장 행동', value: current.leaderAction },
        ]}
        aiDraft={current.actionAiDraft}
        onAiDraftChange={(actionAiDraft) => update({ actionAiDraft })}
        finalPlaceholder="예: 이번 주 고객 방문이 많았던 건 확인했어요. 다만 방문 이후 어떤 고객이 실제 다음 행동으로 이어질 가능성이 있는지 같이 정리해봅시다."
      />

      <Section eyebrow="6. 팀장 최종 준비물" title="AI 초안을 현장에서 쓸 말과 행동으로 고쳐 씁니다">
        <TextArea
          label="이번 2주 팀장 최종 준비물"
          help="팀원에게 실제로 말하거나 회의에서 사용할 문장으로 정리합니다."
          placeholder="예: 이번 2주에는 후속 실행 메모와 고객 질문의 구체성을 함께 보겠습니다. 특히 활동은 많은데 후속 정리가 약한 팀원에게는 1:1로 다음 행동 약속을 함께 정리하겠습니다."
          value={current.finalPrep}
          onChange={(finalPrep) => update({ finalPrep })}
        />
        <TextArea
          label="6단계 고객 반응 분석으로 넘길 기준"
          help="다음 단계에서 고객 반응을 읽을 때 반드시 함께 볼 기준을 적습니다."
          placeholder="예: 고객 반응은 분위기보다 후속 행동 약속과 질문의 구체성을 중심으로 보겠다."
          value={current.step6Handoff}
          onChange={(step6Handoff) => update({ step6Handoff })}
        />
      </Section>

      <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
        <p className="text-sm font-black text-cyan-100">5단계 저장 요약 · 다음 단계로 넘길 내용</p>
        <div className="mt-4 grid gap-3 text-sm leading-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">팀장 판단 질문</p>
            <p className="mt-2 text-slate-100">{current.decisionQuestion || '아직 선택 전입니다.'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">지표와 행동 신호</p>
            <p className="mt-2 text-slate-100">{current.coreMetric || '지표 미입력'} · {current.selectedBehaviorSignals.join(' / ') || '행동 신호 미선택'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">팀장 최종 준비물</p>
            <p className="mt-2 text-slate-100">{current.finalPrep || current.actionAiDraft.finalText || '아직 입력 전입니다.'}</p>
          </div>
        </div>
        <div className="mt-3 rounded-2xl bg-white/10 p-4 text-sm leading-6 text-slate-100">
          <p className="font-black text-cyan-100">6단계 연결 기준</p>
          <p className="mt-2">{current.step6Handoff || '다음 단계로 넘길 기준을 아직 작성하지 않았습니다.'}</p>
        </div>
      </section>
    </div>
  );
}
