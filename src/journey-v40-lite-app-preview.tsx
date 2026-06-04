import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell, type JourneyStep } from './journey-shell';
import { useStored } from './journey-storage';
import { V40LiteAiWorkflow } from './journey-v40-lite-ai-workflow';
import {
  V40_LITE_DEFAULT_PARTICIPANT,
  V40_LITE_DEFAULT_PROGRESS,
  V40_LITE_DEFAULT_STEP5_METRICS,
  V40_LITE_DEFAULT_STEP6_CUSTOMER_REACTION,
  V40_LITE_STORAGE_KEYS,
  type V40LiteParticipant,
  type V40LiteStep5Metrics,
  type V40LiteStep6CustomerReaction,
} from './journey-v40-lite-store';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];

const V40_LITE_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '입장·역할 확인',
    description: '오늘 실습에서 맡을 C1바이오 영업팀장 역할을 확인합니다.',
  },
  {
    id: 'lite-step5-metrics',
    title: '우리 팀에서 지금 무엇을 봐야 하나?',
    description: '이번 2주 동안 실제로 볼 지표와 현장 신호만 가볍게 추립니다.',
  },
  {
    id: 'lite-step6-customer-reaction',
    title: '고객 반응에서 무엇을 읽을까?',
    description: '고객 반응을 기회, 부족한 정보, 조심할 해석으로 나눠 봅니다.',
  },
];

function clampV40LiteStep(step: number) {
  if (!Number.isFinite(step)) return 0;
  return Math.min(Math.max(Math.trunc(step), 0), V40_LITE_STEPS.length - 1);
}

function scrollV40LiteToTop() {
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function LiteNotice() {
  return (
    <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
      <p className="font-black">v40-lite 실습 기준</p>
      <p className="mt-1">하나의 답을 고르는 화면이 아닙니다. 팀장이 현장에서 볼 것, 확인할 것, 조심할 해석을 미리 연습하는 가상 실습 도구입니다.</p>
    </div>
  );
}

function ComplianceNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      <p className="font-black">AI·제약영업 안전선</p>
      <p className="mt-1">교육용 가상 자료만 사용합니다. 실제 고객·기관·제품·성과 수치·개인 관련 정보는 입력하지 않습니다.</p>
    </div>
  );
}

function EntryStep({ participant, setParticipant }: { participant: V40LiteParticipant; setParticipant: (next: V40LiteParticipant) => void }) {
  return (
    <div className="space-y-4">
      <LiteNotice />
      <ComplianceNotice />
      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="space-y-3">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Step 0 · 준비</p>
          <h3 className="text-xl font-black text-slate-950">C1바이오 영업팀장 역할로 들어갑니다</h3>
          <p className="text-sm leading-6 text-slate-600">이 버전은 복잡한 분석보다 교육장 실습 속도를 우선합니다. 팀장으로서 이번 2주에 무엇을 볼지, 어떤 말로 시작할지 짧게 정리해봅니다.</p>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">팀명</span>
            <select className="w-full rounded-2xl border bg-white px-3 py-3 text-sm" value={participant.teamName} onChange={(event) => setParticipant({ ...participant, teamName: event.target.value })}>
              <option value="">팀을 선택하세요</option>
              {TEAM_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">이름/닉네임</span>
            <input className="w-full rounded-2xl border px-3 py-3 text-sm" value={participant.name} onChange={(event) => setParticipant({ ...participant, name: event.target.value })} placeholder="예: 수도권중부팀장" />
          </label>
        </div>

        <label className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          <input className="mt-1" type="checkbox" checked={participant.roleAccepted} onChange={(event) => setParticipant({ ...participant, roleAccepted: event.target.checked })} />
          <span>나는 오늘 실습에서 C1바이오 영업팀장 역할로 판단하고, 현장 실행을 위한 문장을 직접 써봅니다.</span>
        </label>
      </section>
    </div>
  );
}

function LiteTextArea({
  label,
  help,
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label: string;
  help: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block rounded-3xl border bg-white p-4 shadow-sm md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-base font-black text-slate-950">{label}</span>
        {required ? <span className="rounded-full bg-cyan-50 px-2 py-1 text-[11px] font-black text-cyan-700">핵심 입력</span> : <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">선택</span>}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{help}</p>
      <textarea
        className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-600 focus:bg-white focus:ring-2 focus:ring-cyan-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function Step5LiteMetrics({ metrics, setMetrics }: { metrics: V40LiteStep5Metrics; setMetrics: (next: V40LiteStep5Metrics) => void }) {
  const filledCoreCount = [metrics.primaryMetric, metrics.fieldSignal, metrics.carefulInterpretation].filter((value) => value.trim().length > 0).length;

  return (
    <div className="space-y-4">
      <LiteNotice />
      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Step 5 Lite</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-slate-950">이번 2주, 우리 팀이 실제로 볼 것만 추립니다</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">숫자를 많이 보는 것이 목적이 아닙니다. 이번 2주 동안 팀장이 놓치지 말아야 할 지표와 현장 신호만 가볍게 정리합니다.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            핵심 입력 {filledCoreCount} / 3
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        <LiteTextArea
          required
          label="이번 2주에 꼭 볼 지표"
          help="팀장이 가장 먼저 확인할 지표를 하나만 고릅니다."
          placeholder="예: 후속 실행 메모, 고객 반응 기록, 방문 후 다음 행동 여부"
          value={metrics.primaryMetric}
          onChange={(primaryMetric) => setMetrics({ ...metrics, primaryMetric })}
        />
        <LiteTextArea
          required
          label="함께 봐야 할 현장 신호"
          help="숫자만으로는 놓칠 수 있는 팀원이나 고객 반응의 신호를 적습니다."
          placeholder="예: 팀원별 준비 수준, 고객 질문의 깊이, 후속 약속 여부"
          value={metrics.fieldSignal}
          onChange={(fieldSignal) => setMetrics({ ...metrics, fieldSignal })}
        />
        <LiteTextArea
          required
          label="조심해서 봐야 할 해석"
          help="숫자가 좋아 보여도 성급하게 판단하면 안 되는 지점을 적습니다."
          placeholder="예: 방문 수는 많지만 후속 행동이 없는 경우, 반응은 좋지만 실제 필요가 불분명한 경우"
          value={metrics.carefulInterpretation}
          onChange={(carefulInterpretation) => setMetrics({ ...metrics, carefulInterpretation })}
        />
      </div>

      <details className="rounded-3xl border bg-white p-4 shadow-sm md:p-5">
        <summary className="cursor-pointer text-sm font-black text-slate-900">팀장이 더 확인할 질문</summary>
        <div className="mt-3">
          <LiteTextArea
            label="바로 판단하지 않고 한 번 더 확인할 질문"
            help="팀원이나 고객 반응을 더 정확히 보기 위해 남겨둘 질문을 적습니다."
            placeholder="예: 이 고객 반응이 실제 니즈인지, 일시적 관심인지 무엇으로 확인할 수 있을까?"
            value={metrics.followUpQuestion}
            onChange={(followUpQuestion) => setMetrics({ ...metrics, followUpQuestion })}
          />
        </div>
      </details>

      <V40LiteAiWorkflow
        stepTitle="5단계: 우리 팀에서 지금 무엇을 봐야 하나?"
        contextLines={[
          '방문 활동 자체보다 2주 안에 이어질 후속 행동을 보려는 상황입니다.',
          '팀장은 숫자만 보지 않고 팀원 준비 수준과 고객 반응 신호를 함께 봐야 합니다.',
          '실제 고객명, 기관명, 제품명, 민감한 성과 수치는 AI에 넣지 않습니다.',
        ]}
        inputSummary={[
          { label: '이번 2주에 꼭 볼 지표', value: metrics.primaryMetric },
          { label: '함께 봐야 할 현장 신호', value: metrics.fieldSignal },
          { label: '조심해서 봐야 할 해석', value: metrics.carefulInterpretation },
          { label: '팀장이 더 확인할 질문', value: metrics.followUpQuestion },
        ]}
        aiDraft={metrics.aiDraft}
        onAiDraftChange={(aiDraft) => setMetrics({ ...metrics, aiDraft })}
        finalPlaceholder="예: 이번 2주에는 방문 수보다 후속 실행 메모와 고객의 다음 행동 신호를 먼저 보겠습니다. 다만 반응이 좋아 보여도 실제 필요가 확인되기 전에는 성급하게 움직이지 않겠습니다."
      />

      <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
        <p className="text-sm font-black text-cyan-100">저장된 Lite 판단 초안</p>
        <div className="mt-4 grid gap-3 text-sm leading-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">볼 지표</p>
            <p className="mt-2 text-slate-100">{metrics.primaryMetric || '아직 입력 전입니다.'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">현장 신호</p>
            <p className="mt-2 text-slate-100">{metrics.fieldSignal || '아직 입력 전입니다.'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">팀장 최종 문장</p>
            <p className="mt-2 text-slate-100">{metrics.aiDraft.finalText || metrics.carefulInterpretation || '아직 입력 전입니다.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step6LiteCustomerReaction({ reaction, setReaction }: { reaction: V40LiteStep6CustomerReaction; setReaction: (next: V40LiteStep6CustomerReaction) => void }) {
  const filledCoreCount = [reaction.meaningfulReaction, reaction.missingInformation, reaction.carefulReading].filter((value) => value.trim().length > 0).length;

  return (
    <div className="space-y-4">
      <LiteNotice />
      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Step 6 Lite</p>
            <h3 className="mt-2 text-2xl font-black leading-tight text-slate-950">고객 반응에서 무엇을 읽을까?</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">고객 반응을 크게 해석하기보다, 이번 2주 실행에 도움이 되는 신호와 아직 모르는 정보를 나눠 봅니다.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700">
            핵심 입력 {filledCoreCount} / 3
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        <LiteTextArea
          required
          label="의미 있어 보이는 고객 반응"
          help="이번 2주 실행으로 이어질 가능성이 있는 반응을 하나만 적습니다."
          placeholder="예: 고객이 후속 자료를 요청함, 비교 질문이 구체화됨, 다음 방문 시 논의할 주제를 먼저 언급함"
          value={reaction.meaningfulReaction}
          onChange={(meaningfulReaction) => setReaction({ ...reaction, meaningfulReaction })}
        />
        <LiteTextArea
          required
          label="아직 부족한 정보"
          help="반응만 보고 바로 움직이기 전에 더 확인해야 할 정보를 적습니다."
          placeholder="예: 실제 관심인지 의례적 반응인지, 의사결정에 누가 관여하는지, 다음 행동을 언제 할 수 있는지"
          value={reaction.missingInformation}
          onChange={(missingInformation) => setReaction({ ...reaction, missingInformation })}
        />
        <LiteTextArea
          required
          label="조심해서 읽어야 할 부분"
          help="고객 반응을 과하게 좋게 보거나, 반대로 놓칠 수 있는 지점을 적습니다."
          placeholder="예: 질문이 많다고 바로 니즈가 강한 것은 아님, 반응이 적어도 내부 검토 중일 수 있음"
          value={reaction.carefulReading}
          onChange={(carefulReading) => setReaction({ ...reaction, carefulReading })}
        />
      </div>

      <details className="rounded-3xl border bg-white p-4 shadow-sm md:p-5">
        <summary className="cursor-pointer text-sm font-black text-slate-900">팀장이 더 확인할 질문</summary>
        <div className="mt-3">
          <LiteTextArea
            label="고객 반응을 더 정확히 보기 위한 질문"
            help="팀원에게 묻거나 다음 방문에서 확인할 질문을 짧게 적습니다."
            placeholder="예: 이 반응을 다음 행동으로 연결하려면 고객에게 무엇을 더 물어봐야 할까?"
            value={reaction.nextQuestion}
            onChange={(nextQuestion) => setReaction({ ...reaction, nextQuestion })}
          />
        </div>
      </details>

      <V40LiteAiWorkflow
        stepTitle="6단계: 고객 반응에서 무엇을 읽을까?"
        contextLines={[
          '고객 반응은 좋은 신호일 수도 있지만 아직 확인이 필요한 신호일 수도 있습니다.',
          '팀장은 고객 반응을 과하게 해석하지 않고 다음 행동으로 이어질 정보만 추려야 합니다.',
          '실제 고객명, 기관명, 제품명, 민감한 성과 수치는 AI에 넣지 않습니다.',
        ]}
        inputSummary={[
          { label: '의미 있어 보이는 고객 반응', value: reaction.meaningfulReaction },
          { label: '아직 부족한 정보', value: reaction.missingInformation },
          { label: '조심해서 읽어야 할 부분', value: reaction.carefulReading },
          { label: '고객 반응을 더 정확히 보기 위한 질문', value: reaction.nextQuestion },
        ]}
        aiDraft={reaction.aiDraft}
        onAiDraftChange={(aiDraft) => setReaction({ ...reaction, aiDraft })}
        finalPlaceholder="예: 이 고객 반응은 관심 신호로 보되, 실제 필요와 다음 행동 가능성을 한 번 더 확인하겠습니다. 팀원에게는 반응의 분위기보다 고객이 다음에 무엇을 하기로 했는지를 확인해보겠습니다."
      />

      <section className="rounded-3xl border border-slate-200 bg-slate-900 p-5 text-white shadow-sm md:p-6">
        <p className="text-sm font-black text-cyan-100">저장된 고객 반응 읽기 초안</p>
        <div className="mt-4 grid gap-3 text-sm leading-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">의미 있는 반응</p>
            <p className="mt-2 text-slate-100">{reaction.meaningfulReaction || '아직 입력 전입니다.'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">부족한 정보</p>
            <p className="mt-2 text-slate-100">{reaction.missingInformation || '아직 입력 전입니다.'}</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="font-black text-cyan-100">팀장 최종 문장</p>
            <p className="mt-2 text-slate-100">{reaction.aiDraft.finalText || reaction.carefulReading || '아직 입력 전입니다.'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function V40LiteResetControl({ onReset }: { onReset: () => void }) {
  return (
    <div className="mx-auto -mt-3 mb-4 flex max-w-6xl justify-end px-4 md:px-6">
      <button
        type="button"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm hover:bg-slate-50"
        onClick={onReset}
      >
        v40-lite 진행 초기화
      </button>
    </div>
  );
}

function V40LitePreviewApp() {
  const [participant, setParticipant] = useStored(V40_LITE_STORAGE_KEYS.participant, V40_LITE_DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored(V40_LITE_STORAGE_KEYS.progress, V40_LITE_DEFAULT_PROGRESS);
  const [step5Metrics, setStep5Metrics] = useStored(V40_LITE_STORAGE_KEYS.step5Metrics, V40_LITE_DEFAULT_STEP5_METRICS);
  const [step6CustomerReaction, setStep6CustomerReaction] = useStored(V40_LITE_STORAGE_KEYS.step6CustomerReaction, V40_LITE_DEFAULT_STEP6_CUSTOMER_REACTION);
  const safeStep = clampV40LiteStep(progress.step);

  const goToStep = (nextStep: number) => {
    setProgress({ step: clampV40LiteStep(nextStep) });
    scrollV40LiteToTop();
  };

  const resetV40LiteProgress = () => {
    window.localStorage.removeItem(V40_LITE_STORAGE_KEYS.participant);
    window.localStorage.removeItem(V40_LITE_STORAGE_KEYS.progress);
    window.localStorage.removeItem(V40_LITE_STORAGE_KEYS.step5Metrics);
    window.localStorage.removeItem(V40_LITE_STORAGE_KEYS.step6CustomerReaction);
    setParticipant(V40_LITE_DEFAULT_PARTICIPANT);
    setProgress(V40_LITE_DEFAULT_PROGRESS);
    setStep5Metrics(V40_LITE_DEFAULT_STEP5_METRICS);
    setStep6CustomerReaction(V40_LITE_DEFAULT_STEP6_CUSTOMER_REACTION);
    scrollV40LiteToTop();
  };

  let stepContent = <Step6LiteCustomerReaction reaction={step6CustomerReaction} setReaction={setStep6CustomerReaction} />;
  if (safeStep === 0) stepContent = <EntryStep participant={participant} setParticipant={setParticipant} />;
  if (safeStep === 1) stepContent = <Step5LiteMetrics metrics={step5Metrics} setMetrics={setStep5Metrics} />;

  return (
    <>
      <JourneyShell
        title="C1바이오 영업팀장 AI 리더십 Lab Journey Lite"
        subtitle="팀장이 현장에서 할 판단과 말을 미리 연습해보는 축약형 실습입니다."
        steps={V40_LITE_STEPS}
        currentStep={safeStep}
        onPrev={() => goToStep(safeStep - 1)}
        onNext={() => goToStep(safeStep + 1)}
        onStepSelect={(step) => goToStep(step)}
      >
        {stepContent}
      </JourneyShell>
      <V40LiteResetControl onReset={resetV40LiteProgress} />
    </>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V40LitePreviewApp />);
}
