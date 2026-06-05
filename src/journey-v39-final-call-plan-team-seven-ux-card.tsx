import { V39FinalCallPlanUxCard } from './journey-v39-final-call-plan-ux-card';
import { V39TeamSevenFinalSummary } from './journey-v39-team-seven-final-summary';

const V39_FINAL_CALL_PLAN_TEAM_SEVEN_UX_SMOKE_MARKERS = [
  'V39FinalCallPlanTeamSevenUxCard',
  '12단계 팀원 7명 연결',
  '8단계 팀원 7명 업무배분·1on1 요약',
].join('|');
void V39_FINAL_CALL_PLAN_TEAM_SEVEN_UX_SMOKE_MARKERS;

export function V39FinalCallPlanTeamSevenUxCard() {
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">12단계 팀원 7명 연결</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">8단계 팀원 판단을 최종 카드 앞에서 다시 확인합니다</h2>
        <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">8단계에서 정리한 팀원별 판단, 우선 1on1 대상, 지원 포인트를 최종 카드 작성 전에 확인합니다.</p>
      </section>
      <V39TeamSevenFinalSummary />
      <V39FinalCallPlanUxCard />
    </section>
  );
}
