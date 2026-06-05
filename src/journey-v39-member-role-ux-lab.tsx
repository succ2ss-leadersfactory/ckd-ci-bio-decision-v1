import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { V39MemberRoleLab } from './journey-v39-member-role-lab';

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
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">8단계 · 팀원이 실제로 움직일 수 있게 역할을 다듬습니다</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">누구에게 시킬지가 아니라, 어떻게 움직이게 할지를 정합니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">7단계에서 “어디에 먼저 움직일지”와 “어느 팀원이 함께 보면 좋을지”를 잡았습니다. 이 화면에서는 같은 배정을 다시 반복하지 않습니다. 팀원이 바로 움직일 수 있도록 맡길 일, 준비할 것, 팀장이 도와줄 것, 중간에 확인할 질문, 조심할 표현을 작게 나눠 봅니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 lg:w-[42rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">팀에서 보인 신호</p>
              <p className="mt-1 text-sm font-black text-sky-950">{memberSignalCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">2주 행동 방향</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{strategyCount}건</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-black text-amber-700">함께 볼 팀원</p>
              <p className="mt-1 text-sm font-black text-amber-950">{memberConnectionCount}건</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">역할 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedRoleCount}건</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">2주 행동을 팀원이 움직일 수 있는 일로 바꿉니다</p>
          <p className="mt-1">7단계가 “이번 2주 동안 어디에 어떻게 움직일 것인가”를 정했다면, 8단계는 “그 일을 맡은 팀원이 바로 시작하려면 무엇이 필요하고, 팀장은 어디를 도와야 하는가”를 정리하는 화면입니다.</p>
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

        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 화면에서 할 일</p>
            <p className="mt-1">고객군과 팀원 연결을 다시 정하는 것이 아니라, 팀원이 실제로 할 수 있는 일로 잘게 나눕니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞 화면에서 가져온 것</p>
            <p className="mt-1">2주 행동 방향, 함께 볼 팀원 후보, 아직 풀어야 할 조건, 조심해야 할 지점입니다.</p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
            <p className="font-black">여기서 새로 쓸 것</p>
            <p className="mt-1">팀원에게 맡길 일, 준비할 것, 팀장이 도와줄 것, 중간에 확인할 질문, 조심할 표현입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 화면에서 쓸 것</p>
            <p className="mt-1">9단계에서 팀원에게 어떻게 말할지 정할 때 사용할 역할, 지원 방식, 확인 질문, 조심할 표현입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">같은 배정을 다시 쓰는 화면이 아닙니다</p>
          <p className="mt-1">7단계에서 “누가 함께 보면 좋을지”를 정했다면, 여기서는 “그 사람이 부담 없이 움직이게 하려면 무엇을 도와야 하는지”를 봅니다. 핵심은 재배정이 아니라 실행이 되게 만드는 것입니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소로 남길 것</p>
          <p className="mt-1">담당 고객군이나 조건, 팀원에게 맡길 일, 준비할 것, 팀장이 도와줄 것, 중간 확인 질문, 조심할 표현을 남기면 충분합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          자동 배정표를 만드는 화면이 아닙니다. 팀원이 실제로 움직일 수 있도록 일을 작게 나누고, 팀장이 도와야 할 지점을 분명히 하는 시간입니다.
        </div>
      </section>

      <V39MemberRoleLab />
    </section>
  );
}
