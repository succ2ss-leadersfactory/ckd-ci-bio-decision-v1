import { V39FinalCallPlanUxCard } from './journey-v39-final-call-plan-ux-card';
import { V39TeamSevenFinalSummary } from './journey-v39-team-seven-final-summary';
import { V39TeamSevenFinalSync } from './journey-v39-team-seven-final-sync';

const V39_FINAL_CALL_PLAN_TEAM_SEVEN_UX_SMOKE_MARKERS = [
  'V39FinalCallPlanTeamSevenUxCard',
  '12단계 팀원 7명 연결',
  '8단계 팀원 7명 업무배분·1on1 요약',
  '팀원 7명 요약 저장 반영',
  '팀원별로 빠뜨린 지원은 없는지 마지막으로 확인합니다',
].join('|');
void V39_FINAL_CALL_PLAN_TEAM_SEVEN_UX_SMOKE_MARKERS;

export function V39FinalCallPlanTeamSevenUxCard() {
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">12단계 · 팀원별로 빠뜨린 지원은 없는지 마지막으로 확인합니다</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">최종 메모를 쓰기 전에 팀원 7명의 역할과 1on1 대상을 다시 봅니다</h2>
        <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">8단계에서 정리한 팀원별 역할, 먼저 1on1로 맞춰볼 사람, 팀장이 도와야 할 부분을 마지막으로 확인합니다. 고객 대응만 남기면 실행이 막힐 수 있습니다. 누가 움직이고, 누가 지원을 받아야 하는지까지 보고 최종 메모를 작성합니다.</p>
      </section>
      <V39TeamSevenFinalSync />
      <V39TeamSevenFinalSummary />
      <V39FinalCallPlanUxCard />
    </section>
  );
}
