import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { V39MemberRoleLab } from './journey-v39-member-role-lab';

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
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">8단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 전략을 팀원 역할과 코칭 포인트로 바꿉니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">5단계 팀 신호</p>
              <p className="mt-1 text-sm font-black text-sky-950">{memberSignalCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">7단계 고객 전략</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{strategyCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">8단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedRoleCount}개 역할</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">고객 대응 전략을 팀원별 역할, 코칭 초점, 준비물로 바꿉니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">5단계 팀 실행진단과 7단계 고객 대응 전략입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">9단계 실행 대화와 10단계 AI 실행계획에 반영할 역할 기준입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 담당 고객군, 역할 미션, 코칭 초점, 리스크 안전선, 콜플랜 준비물. 자동 배정이 아니라 팀장 판단을 돕는 역할 초안입니다.
        </div>
      </section>

      <V39MemberRoleLab />
    </section>
  );
}
