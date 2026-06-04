import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { V39MemberRoleLab } from './journey-v39-member-role-lab';

const V39_MEMBER_ROLE_UX_SMOKE_MARKERS = [
  '8단계 진행 가이드',
  '고객 전략을 팀원 역할과 코칭 포인트로 바꿉니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_MEMBER_ROLE_UX_SMOKE_MARKERS;

function getSavedStrategyCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.strategy.trim()).length;
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
  const memberSignalCount = getSelectedMemberSignalCount();
  const savedRoleCount = getSavedRoleCount();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">8단계 · 사람별 역할 잡기</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 대응안을 팀원별 역할, 준비할 질문, 팀장이 도와야 할 지점으로 풀어냅니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">팀에서 보인 신호</p>
              <p className="mt-1 text-sm font-black text-sky-950">{memberSignalCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">고객 대응안</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{strategyCount}건</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">역할 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedRoleCount}건</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">지금 나눌 것</p>
            <p className="mt-1">고객 대응을 누가 맡을지, 어떤 질문을 준비할지, 팀장이 어디를 도와야 할지 정합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">5단계에서 본 팀 실행 신호와 7단계에서 정한 고객 대응안입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 화면에서 이어 쓸 내용</p>
            <p className="mt-1">9단계 대화와 10단계 AI 질문에 들어갈 팀원별 역할 기준입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          자동 배정표를 만드는 화면이 아닙니다. 팀장이 고객 상황과 팀원 상태를 함께 보고, 이번 2주 동안 맡길 역할의 초안을 잡는 과정입니다.
        </div>
      </section>

      <V39MemberRoleLab />
    </section>
  );
}
