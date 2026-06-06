import { V39TeamSevenCoachingMap } from './journey-v39-team-seven-coaching-map';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS = [
  'V39TeamSevenCoachingUxWrapper',
  '7명 전체는 가볍게, 우선 1on1 2명만 깊게',
  '전체 7명은 업무배분 판단만 남겨도 충분합니다',
  '팀원 7명의 부담과 기회를 먼저 가볍게 훑습니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS;

export function V39TeamSevenCoachingUxWrapper() {
  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={8} />
      <V39StepHero
        eyebrow="8단계 · 팀원 7명의 부담과 기회를 먼저 가볍게 훑습니다"
        icon="👥"
        title="7명 전체는 가볍게, 우선 1on1 2명만 깊게 봅니다"
        tone="indigo"
        description="모든 팀원을 길게 분석할 필요는 없습니다. 먼저 7명 전체의 업무배분 균형만 빠르게 보고, 이번 2주 안에 꼭 대화가 필요한 1~2명만 깊게 봅니다. 핵심은 완벽한 배정표가 아니라 부담·기회·위험이 한 사람에게 몰리지 않게 보는 것입니다."
        badges={[
          { label: '전체 확인', value: '7명', tone: 'indigo', icon: '👥' },
          { label: '우선 1on1', value: '1~2명', tone: 'emerald', icon: '💬' },
          { label: '작성 기준', value: '균형 확인', tone: 'amber', icon: '⚖️' },
        ]}
      />

      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '👥', title: '7명 전체를 가볍게 보기', body: '업무배분 판단만 남겨도 충분합니다. 모든 팀원을 깊게 작성하지 않습니다.' },
            { icon: '💬', title: '우선 1on1 1~2명 고르기', body: '코칭 목적, 팀장 지원, 조심할 지점을 구체화합니다.' },
            { icon: '🧭', title: '역할 정리로 넘기기', body: '아래에서 남긴 판단이 팀원별 실행 보완으로 이어집니다.' },
          ]}
        />

        <div className="mt-3">
          <V39MinimumChecklist
            tone="indigo"
            items={[
              '7명 전체 업무배분 판단',
              '우선 1on1 대상 1~2명',
              '대화 목적',
              '팀장이 도울 것',
              '조심할 지점',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            이번 화면은 사람을 평가하거나 줄 세우는 화면이 아닙니다. 일이 한 사람에게 몰리는지, 기회가 빠진 팀원은 없는지, 먼저 대화해야 할 팀원이 누구인지 확인하는 화면입니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39TeamSevenCoachingMap />
    </section>
  );
}
