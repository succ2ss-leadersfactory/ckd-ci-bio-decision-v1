import { V39TeamSevenCoachingMap } from './journey-v39-team-seven-coaching-map';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS = [
  'V39TeamSevenCoachingUxWrapper',
  '코칭 대상 선정',
  '7명 팀원 유형 참고',
  '실제 고민 팀원 익명 등록 가능',
  '누구와 먼저 1on1을 해야 하는지 정합니다',
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
        eyebrow="8단계 · 코칭 대상 선정"
        icon="👥"
        title="누구와 먼저 1on1을 해야 하는지 정합니다"
        tone="indigo"
        description="7단계에서 정리한 고객군별 2주 대응 방향을 바로 팀원 배치표로 바꾸지 않습니다. 먼저 7명의 팀원 유형을 참고해, 이번 2주 안에 먼저 대화가 필요한 1~2명을 고릅니다. 실제 고민 중인 팀원이 있다면 익명으로 등록할 수 있습니다. 핵심은 일을 나누는 것이 아니라, 지금 대화가 필요한 신호를 놓치지 않는 것입니다."
        badges={[
          { label: '참조 모델', value: '7명 유형', tone: 'indigo', icon: '👥' },
          { label: '직접 등록', value: '익명 가능', tone: 'sky', icon: '✍️' },
          { label: '우선 1on1', value: '1~2명', tone: 'emerald', icon: '💬' },
          { label: '다음 단계', value: '대화 설계', tone: 'violet', icon: '➡️' },
        ]}
      />

      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '👥', title: '7명 팀원 유형 보기', body: '현재 신호, 강점, 리스크, 팀장 질문을 훑으며 실제 팀원과 비슷한 장면을 떠올립니다.' },
            { icon: '✍️', title: '실제 고민 팀원 익명 등록', body: '실명과 민감정보 없이 역할, 관찰 신호, 강점, 리스크, 팀장 고민 질문만 적을 수 있습니다.' },
            { icon: '💬', title: '우선 1on1 1~2명 선정', body: '선택 이유와 9단계로 넘길 코칭 초점까지만 정리합니다. 대화 스크립트는 다음 단계에서 만듭니다.' },
          ]}
        />

        <div className="mt-3">
          <V39MinimumChecklist
            tone="indigo"
            items={[
              '7명 팀원 유형 확인',
              '실제 고민 팀원 익명 등록 여부 판단',
              '우선 1on1 대상 1~2명',
              '선택 이유',
              '9단계로 넘길 코칭 초점',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            이번 화면은 사람을 평가하거나 줄 세우는 화면이 아닙니다. 팀원의 성격을 단정하지 말고, 관찰 가능한 신호와 팀장이 먼저 확인해야 할 대화 필요성을 정리합니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 평가등급, 개인정보는 입력하지 않습니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39TeamSevenCoachingMap />
    </section>
  );
}
