import { V39TeamSevenCoachingMap } from './journey-v39-team-seven-coaching-map';
import { V39TeamSevenTextPolish } from './journey-v39-team-seven-text-polish';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS = [
  'V39TeamSevenCoachingUxWrapper',
  '코칭 대상 선정',
  '7명 팀원 유형 참고',
  '실제 고민 팀원 익명 등록 가능',
  '누구와 먼저 1on1을 해야 하는지 정합니다',
  '7명 유형을 먼저 본 뒤 익명으로 추가합니다',
  'AI는 관찰 사실과 해석을 분리하는 데 사용합니다',
  '대화 스크립트는 9단계에서 만듭니다',
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
    <section className="space-y-4" data-v39-team-seven-polish="true">
      <V39TeamSevenTextPolish />
      <V39FlowStrip currentStep={8} />
      <V39StepHero
        eyebrow="8단계 · 먼저 앉아 이야기할 사람 고르기"
        icon="👥"
        title="일을 나누기 전에, 먼저 이야기할 팀원을 떠올립니다"
        tone="indigo"
        description="7단계에서 정한 방향을 곧바로 배정표로 만들지 않습니다. 먼저 7명의 장면을 보며 우리 팀에서 떠오르는 사람을 생각해 봅니다. 지금 필요한 것은 일을 맡길 사람을 정하는 것이 아니라, 팀장이 먼저 만나 확인하고 도와야 할 사람을 고르는 일입니다."
        badges={[
          { label: '먼저 볼 것', value: '7명 장면', tone: 'indigo', icon: '👥' },
          { label: '직접 추가', value: '익명으로만', tone: 'sky', icon: '✍️' },
          { label: '오늘 고를 사람', value: '1~2명', tone: 'emerald', icon: '💬' },
          { label: 'AI 사용', value: '생각 정리', tone: 'amber', icon: '🧭' },
        ]}
      />

      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '👥', title: '7명의 장면을 읽습니다', body: '업무 스타일, 고객 대응, 최근 말과 행동을 보며 실제 팀원이 떠오르는지 살펴봅니다.' },
            { icon: '✍️', title: '필요하면 익명으로 추가합니다', body: '딱 맞는 사람이 없을 때만 이름 없이 역할, 보이는 행동, 강점, 걱정되는 지점을 적습니다.' },
            { icon: '🧭', title: 'AI로 생각을 정리합니다', body: '대화문을 만들기 전에 먼저 만나야 하는 이유와 다음 화면으로 넘길 대화 초점만 정리합니다.' },
          ]}
        />

        <div className="mt-3">
          <V39MinimumChecklist
            tone="indigo"
            items={[
              '7명의 장면 훑어보기',
              '익명 추가 여부 판단',
              '먼저 1on1할 팀원 1~2명',
              '그 사람을 고른 이유',
              '다음 화면으로 넘길 대화 초점',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            이 화면은 팀원을 평가하거나 줄 세우는 시간이 아닙니다. 성격을 단정하지 말고, 실제로 보인 말과 행동만 보고 판단합니다. 실제 이름, 고객명, 기관명, 제품명, 내부 숫자, 평가등급, 개인 사정은 입력하지 않습니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39TeamSevenCoachingMap />
    </section>
  );
}
