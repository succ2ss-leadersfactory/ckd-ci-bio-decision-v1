import { V39FinalCallPlanFieldCard } from './journey-v39-final-call-plan-field-card';
import { V39FinalCallPlanUxCard } from './journey-v39-final-call-plan-ux-card';
import { V39TeamSevenFinalSummary } from './journey-v39-team-seven-final-summary';
import { V39TeamSevenFinalSync } from './journey-v39-team-seven-final-sync';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_FINAL_CALL_PLAN_TEAM_SEVEN_UX_SMOKE_MARKERS = [
  'V39FinalCallPlanTeamSevenUxCard',
  '12단계 팀원 7명 연결',
  '8단계 팀원 7명 업무배분·1on1 요약',
  '팀원 7명 요약 저장 반영',
  '팀원별로 빠뜨린 지원은 없는지 마지막으로 확인합니다',
  'V39FinalCallPlanUxCard',
  '앞 단계 결과 → 2주 실행 메모 → 복사/현업 적용',
  '교육장을 나간 뒤 펼쳐볼 2주 실행 메모를 완성합니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_FINAL_CALL_PLAN_TEAM_SEVEN_UX_SMOKE_MARKERS;
void V39FinalCallPlanUxCard;

export function V39FinalCallPlanTeamSevenUxCard() {
  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={12} />
      <V39StepHero
        eyebrow="12단계 · 2주 실행 메모를 완성합니다"
        icon="✅"
        title="교육장을 나간 뒤 펼쳐볼 2주 실행 메모를 완성합니다"
        tone="emerald"
        description="앞 단계에서 정리한 고객 활동 기록의 단서, 2주 행동 방향, 팀원 역할, 첫 문장, 말해도 되는 선을 한 장의 실행 메모로 줄입니다. 보고서처럼 길게 쓰는 것이 아니라, 다음 주 팀 회의와 1on1에서 바로 꺼내 볼 수 있는 말로 남깁니다."
        badges={[
          { label: '가져온 것', value: '앞 단계 결과', tone: 'sky', icon: '🧩' },
          { label: '완성할 것', value: '2주 실행 메모', tone: 'emerald', icon: '✅' },
          { label: '다음 활용', value: '복사/현업 적용', tone: 'violet', icon: '📋' },
        ]}
      />

      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🧩', title: '앞 단계 결과 모으기', body: '고객 단서, 2주 행동 방향, 팀원 역할, 첫 문장, 말해도 되는 선을 가져옵니다.' },
            { icon: '✅', title: '2주 실행 메모로 줄이기', body: '팀 회의와 1on1에서 바로 볼 수 있는 짧은 메모로 정리합니다.' },
            { icon: '📋', title: '복사해서 현업에 쓰기', body: '최종 메모를 복사해 교육장 이후 실행과 회고에 활용합니다.' },
          ]}
        />

        <div className="mt-3">
          <V39MinimumChecklist
            tone="emerald"
            items={[
              '먼저 볼 고객군 또는 조건',
              '팀원별 역할과 팀장이 도울 것',
              '이번 2주에 실제로 할 일',
              '말해도 되는 선',
              '팀원에게 꺼낼 첫 문장',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            최종 메모에도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI가 쓴 문장도 팀장이 현장에서 책임질 수 있는 말로 고쳐 적습니다.
          </V39SafetyStrip>
        </div>
      </section>

      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">12단계 · 팀원별로 빠뜨린 지원은 없는지 마지막으로 확인합니다</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">최종 메모를 쓰기 전에 팀원 7명의 역할과 1on1 대상을 다시 봅니다</h2>
        <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">8단계에서 정리한 팀원별 역할, 먼저 1on1로 맞춰볼 사람, 팀장이 도와야 할 부분을 마지막으로 확인합니다. 고객 대응만 남기면 실행이 막힐 수 있습니다. 누가 움직이고, 누가 지원을 받아야 하는지까지 보고 최종 메모를 작성합니다.</p>
      </section>
      <V39TeamSevenFinalSync />
      <V39TeamSevenFinalSummary />
      <V39FinalCallPlanFieldCard />
    </section>
  );
}
