import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { V39MemberRoleLab } from './journey-v39-member-role-lab';
import { V39ActionTriplet, V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_MEMBER_ROLE_UX_SMOKE_MARKERS = [
  '8단계 진행 가이드',
  '고객 전략을 팀원 역할과 코칭 포인트로 바꿉니다',
  '팀원별 실행 보완 Map',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '역할·지원 포인트·점검 질문 보완',
  '7단계 배정을 반복하지 않습니다',
  '7단계 고객군/조건을 8단계 역할 보완으로 바꿉니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '8단계에서 새로 쓰는 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '팀원이 실제로 움직일 수 있게 역할을 다듬습니다',
  '누구에게 시킬지가 아니라 어떻게 움직이게 할지 정합니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39ActionTriplet',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_MEMBER_ROLE_UX_SMOKE_MARKERS;

function getSavedStrategyCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.strategy.trim()).length;
}

function getSavedMemberConnectionCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.memberRole.trim()).length;
}

function getSelectedMemberSignalCount() {
  const dashboardResult = loadV39DashboardResult();
  return dashboardResult.memberResult.selectedMemberTypeIds.length;
}

function getSavedRoleCount() {
  const roleResult = loadV39MemberRoleResult();
  return Object.values(roleResult.roles).filter((role) => role.roleMission.trim()).length;
}

export function V39MemberRoleUxLab() {
  const strategyCount = getSavedStrategyCount();
  const memberConnectionCount = getSavedMemberConnectionCount();
  const memberSignalCount = getSelectedMemberSignalCount();
  const savedRoleCount = getSavedRoleCount();

  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={8} />
      <V39StepHero
        eyebrow="8단계 · 팀원이 실제로 움직일 수 있게 역할을 다듬습니다"
        icon="👥"
        title="누구에게 시킬지가 아니라, 어떻게 움직이게 할지를 정합니다"
        tone="indigo"
        description="7단계에서 “어디에 먼저 움직일지”와 “어느 팀원이 함께 보면 좋을지”를 잡았습니다. 이 화면에서는 같은 배정을 다시 반복하지 않습니다. 팀원이 바로 움직일 수 있도록 맡길 일, 준비할 것, 팀장이 도와줄 것, 중간에 확인할 질문, 조심할 표현을 작게 나눠 봅니다."
        badges={[
          { label: '팀에서 보인 신호', value: `${memberSignalCount}개`, tone: 'sky', icon: '📌' },
          { label: '2주 행동 방향', value: `${strategyCount}건`, tone: 'emerald', icon: '🧭' },
          { label: '함께 볼 팀원', value: `${memberConnectionCount}건`, tone: 'amber', icon: '👥' },
          { label: '역할 메모', value: `${savedRoleCount}건`, tone: 'violet', icon: '📝' },
        ]}
      />

      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">2주 행동을 팀원이 움직일 수 있는 일로 바꿉니다</p>
          <p className="mt-1">7단계가 “이번 2주 동안 어디에 어떻게 움직일 것인가”를 정했다면, 8단계는 “그 일을 맡은 팀원이 바로 시작하려면 무엇이 필요하고, 팀장은 어디를 도와야 하는가”를 정리하는 화면입니다.</p>
        </div>

        <div className="mt-3">
          <V39MiniFlow
            items={[
              { icon: '🧭', title: '2주 행동 방향 확인', body: '어디에 먼저 움직일지와 함께 볼 팀원 후보를 확인합니다.' },
              { icon: '👥', title: '역할을 작게 나누기', body: '맡길 일, 준비할 것, 팀장이 도울 것을 작게 쪼갭니다.' },
              { icon: '💬', title: '대화로 넘기기', body: '다음 화면에서 팀원에게 어떻게 꺼낼지 정합니다.' },
            ]}
          />
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 고객 상황과 팀원 경험을 함께 보며, 누구에게 어떤 일을 맡길지, 어디를 도와줘야 실행이 되는지 판단할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 정리가 빨라집니다</p>
            <p className="mt-1">AI는 맡길 일, 준비할 자료, 팀장이 도와줄 부분, 중간에 물어볼 질문, 조심해야 할 표현을 빠르게 나눠 줍니다. 팀장은 그중 현장에 맞는 것만 골라 고치면 됩니다.</p>
          </div>
        </div>

        <div className="mt-3">
          <V39ActionTriplet
            previous={{
              icon: '🧭',
              title: '2주 행동 방향과 함께 볼 팀원 후보',
              body: '고객군/점검 조건, 2주 행동 방향, 함께 보면 좋을 팀원 후보를 가져옵니다.',
            }}
            current={{
              icon: '👥',
              title: '팀원이 실제로 할 수 있는 일로 나눕니다',
              body: '맡길 일, 준비할 것, 팀장이 도와줄 것, 중간 확인 질문, 조심할 표현을 정리합니다.',
            }}
            next={{
              icon: '💬',
              title: '9단계에서 첫 문장으로 바꿉니다',
              body: '역할과 지원 내용을 팀원이 받아들일 수 있는 대화 첫 문장으로 바꿉니다.',
            }}
          />
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">같은 배정을 다시 쓰는 화면이 아닙니다</p>
          <p className="mt-1">7단계에서 “누가 함께 보면 좋을지”를 정했다면, 여기서는 “그 사람이 부담 없이 움직이게 하려면 무엇을 도와야 하는지”를 봅니다. 핵심은 재배정이 아니라 실행이 되게 만드는 것입니다.</p>
        </div>

        <div className="mt-3">
          <V39MinimumChecklist items={['담당 고객군이나 조건', '팀원에게 맡길 일', '준비할 것', '팀장이 도와줄 것', '중간 확인 질문', '조심할 표현']} tone="indigo" />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            자동 배정표를 만드는 화면이 아닙니다. 팀원이 실제로 움직일 수 있도록 일을 작게 나누고, 팀장이 도와야 할 지점을 분명히 하는 시간입니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39MemberRoleLab />
    </section>
  );
}
