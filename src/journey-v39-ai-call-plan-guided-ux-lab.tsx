import { V39AiCallPlanUxLab } from './journey-v39-ai-call-plan-ux-lab';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_AI_CALL_PLAN_GUIDED_UX_SMOKE_MARKERS = [
  'V39AiCallPlanGuidedUxLab',
  '새로 쓰지 말고, 앞 단계 결과를 AI 질문으로 자동 조립합니다',
  '빠진 정보만 보완하세요',
  'AI에게 2주 실행 초안을 부탁할 질문을 만듭니다',
  '내 메모 묶음 → AI 초안 → 팀장 수정',
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
        eyebrow="10단계 · AI에게 2주 실행 초안을 부탁할 질문을 만듭니다"
        icon="✨"
        title="새로 쓰지 말고, 앞 단계 결과를 하나의 질문으로 묶습니다"
        tone="sky"
        description="지표, 고객 활동 기록의 단서, 2주 행동 방향, 팀원 역할, 실행 대화 내용을 처음부터 다시 쓰지 않습니다. 앞에서 남긴 메모를 AI에게 붙여넣을 질문으로 묶고, 빠진 정보만 보완합니다. AI 초안은 완성본이 아니라 다음 단계에서 고쳐 볼 재료입니다."
        badges={[
          { label: '해야 할 일', value: '질문 묶기', tone: 'sky', icon: '✨' },
          { label: '하지 않아도 되는 일', value: '처음부터 작성', tone: 'emerald', icon: '↩️' },
          { label: '다음 점검', value: '말해도 되는 선', tone: 'amber', icon: '🛡️' },
        ]}
      />

      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '📝', title: '내 메모 묶음', body: '앞 단계에서 만든 지표, 고객 활동 기록, 팀원 역할, 대화 문장을 가져옵니다.' },
            { icon: '✨', title: 'AI 초안', body: 'AI에게 2주 실행 초안을 정리해 달라고 부탁합니다.' },
            { icon: '🧑‍💼', title: '팀장 수정', body: 'AI 초안은 다음 화면에서 표현과 안전선을 다시 고칩니다.' },
          ]}
        />

        <div className="mt-3">
          <V39MinimumChecklist
            tone="sky"
            items={[
              'AI에게 붙여넣을 질문',
              'AI가 정리한 2주 실행 초안',
              '위험해 보이는 문장',
              '다음 화면에서 꼭 점검할 부분',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            AI에게 결정을 맡기는 화면이 아닙니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI 초안은 팀장이 고쳐야 할 초안으로만 봅니다.
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
