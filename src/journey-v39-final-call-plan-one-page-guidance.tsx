const V39_FINAL_CALL_PLAN_ONE_PAGE_GUIDANCE_SMOKE_MARKERS = [
  'V39FinalCallPlanOnePageGuidance',
  '최종 카드는 보고서가 아니라 1페이지 실행 카드입니다',
  '각 항목은 1~2줄로 작성하세요',
  '교육장을 나간 뒤 바로 펼쳐볼 2주 실행 메모입니다',
].join('|');
void V39_FINAL_CALL_PLAN_ONE_PAGE_GUIDANCE_SMOKE_MARKERS;

export function V39FinalCallPlanOnePageGuidance() {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-700">12단계 · 가져갈 메모를 한 장으로 줄입니다</p>
      <h2 className="mt-1 text-xl font-black text-slate-950">교육장을 나간 뒤 바로 펼쳐볼 2주 실행 메모입니다</h2>
      <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">
        멋진 보고서를 쓰는 시간이 아닙니다. 다음 주 팀 회의와 1on1에서 바로 볼 수 있도록, 어디를 볼지, 누가 무엇을 맡을지, 어떤 말로 시작할지, 어떤 표현은 피할지만 짧게 남깁니다.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">분량 기준</p>
          <p className="mt-1">각 항목은 1~2줄이면 충분합니다. 길게 쓰기보다, 내일 바로 꺼내 볼 수 있게 줄입니다.</p>
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
          <p className="font-black">반드시 남길 것</p>
          <p className="mt-1">이번에 볼 지표, 먼저 확인할 고객군, 팀원별 역할, 우선 1on1 대상, 첫 문장, 피해야 할 표현입니다.</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          <p className="font-black">피할 것</p>
          <p className="mt-1">보고서처럼 길게 정리하지 않습니다. 팀 회의와 1on1에서 실제로 말하고 확인할 문장만 남깁니다.</p>
        </div>
      </div>
    </section>
  );
}
