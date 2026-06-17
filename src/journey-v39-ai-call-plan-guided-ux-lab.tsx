import { V39AiCallPlanUxLab } from './journey-v39-ai-call-plan-ux-lab';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_AI_CALL_PLAN_GUIDED_UX_SMOKE_MARKERS = [
  'V39AiCallPlanGuidedUxLab',
  '새로 쓰지 말고, 앞 단계 결과를 AI 질문으로 자동 조립합니다',
  '빠진 정보만 보완하세요',
  'AI에게 2주 실행 초안을 부탁할 질문을 만듭니다',
  '내 메모 묶음 → AI 초안 → 팀장 수정',
  '앞에서 적은 메모를 AI에게 한 번 정리시켜 봅니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_AI_CALL_PLAN_GUIDED_UX_SMOKE_MARKERS;

export function V39AiCallPlanGuidedUxLab() {
  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={10} />
      <V39StepHero
        eyebrow="10단계 · AI에게 한 번 정리시켜 보기"
        icon="✨"
        title="앞에서 적은 메모를 AI에게 한 번 정리시켜 봅니다"
        tone="sky"
        description="지표, 고객 기록에서 본 단서, 2주 방향, 먼저 만날 팀원, 첫 문장을 처음부터 다시 쓰지 않습니다. 앞에서 남긴 메모를 하나로 묶어 AI에게 보여주고, 2주 실행 초안을 받아 봅니다. 단, AI가 쓴 문장은 완성본이 아닙니다. 다음 화면에서 팀장이 다시 고칩니다."
        badges={[
          { label: '지금 할 일', value: '메모 묶기', tone: 'sky', icon: '✨' },
          { label: '줄일 일', value: '처음부터 다시 쓰기', tone: 'emerald', icon: '↩️' },
          { label: '다음', value: '말해도 되는 선 점검', tone: 'amber', icon: '🛡️' },
        ]}
      />

      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '📝', title: '앞에서 적은 메모', body: '지표, 고객 기록, 2주 방향, 먼저 만날 팀원, 첫 문장을 가져옵니다.' },
            { icon: '✨', title: 'AI가 정리한 초안', body: 'AI에게 2주 실행 메모를 한 번 정리해 달라고 부탁합니다.' },
            { icon: '🧑‍💼', title: '팀장이 다시 고치기', body: 'AI 문장은 그대로 쓰지 않고, 다음 화면에서 표현과 안전선을 다시 봅니다.' },
          ]}
        />

        <div className="mt-3">
          <V39MinimumChecklist
            tone="sky"
            items={[
              'AI에게 보여줄 내 메모',
              'AI가 정리한 2주 초안',
              '조심스러운 표현',
              '다음 화면에서 고칠 부분',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            AI에게 결정을 맡기지 않습니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI가 쓴 문장은 팀장이 고쳐야 할 초안으로만 봅니다.
          </V39SafetyStrip>
        </div>
      </section>

      <div className="v39-ai-call-plan-core">
        <style>{`
          .v39-ai-call-plan-core > section > section:nth-child(1) {
            display: none;
          }
        `}</style>
        <V39AiCallPlanUxLab />
      </div>
    </section>
  );
}
