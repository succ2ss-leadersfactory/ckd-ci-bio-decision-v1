import { V39AiCallPlanUxLab } from './journey-v39-ai-call-plan-ux-lab';

const V39_AI_CALL_PLAN_GUIDED_UX_SMOKE_MARKERS = [
  'V39AiCallPlanGuidedUxLab',
  '새로 쓰지 말고, 앞 단계 결과를 AI 질문으로 자동 조립합니다',
  '빠진 정보만 보완하세요',
].join('|');
void V39_AI_CALL_PLAN_GUIDED_UX_SMOKE_MARKERS;

export function V39AiCallPlanGuidedUxLab() {
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-sky-700">10단계 입력 가이드</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">새로 쓰지 말고, 앞 단계 결과를 AI 질문으로 자동 조립합니다</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">해야 할 일</p>
            <p className="mt-1">앞에서 만든 지표, 고객 Data, 팀원 역할, 1on1 대화 내용을 하나의 프롬프트로 묶습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">하지 않아도 되는 일</p>
            <p className="mt-1">처음부터 다시 작성하지 않아도 됩니다. 빠진 정보만 보완하세요.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">주의할 점</p>
            <p className="mt-1">AI 초안은 완성본이 아닙니다. 11단계에서 위험 표현을 반드시 고칩니다.</p>
          </div>
        </div>
      </section>
      <V39AiCallPlanUxLab />
    </section>
  );
}
