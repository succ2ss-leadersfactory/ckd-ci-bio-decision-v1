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
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">8단계 진행 가이드 · 팀원별 실행 보완 Map</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 전략을 팀원 역할과 코칭 포인트로 바꿉니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">7단계에서 이미 고객군/점검 조건과 팀원 연결의 큰 배치를 정했습니다. 이 단계는 그 배정을 반복하지 않습니다. 각 팀원이 실제로 실행할 수 있도록 역할 미션, 준비물, 지원 포인트, 점검 질문, 리스크 안전선을 보완하는 화면입니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 lg:w-[42rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">팀에서 보인 신호</p>
              <p className="mt-1 text-sm font-black text-sky-950">{memberSignalCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">고객 대응안</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{strategyCount}건</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-black text-amber-700">7단계 팀원 연결</p>
              <p className="mt-1 text-sm font-black text-amber-950">{memberConnectionCount}건</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">역할 보완 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{savedRoleCount}건</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">7단계 고객군/조건을 8단계 역할 보완으로 바꿉니다</p>
          <p className="mt-1">7단계가 “이번 2주 동안 어떤 고객군/점검 조건에 어떻게 움직일 것인가”를 정했다면, 8단계는 “그 일을 맡은 팀원이 실제로 움직이려면 무엇을 준비하고, 팀장이 어디를 도와야 하는가”를 정리합니다.</p>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 고객 상황과 팀원 경험을 보고 누구에게 어떤 역할을 맡길지, 어디를 도와야 할지 판단할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 좋아지는 점</p>
            <p className="mt-1">7단계 실행 Map을 바탕으로 역할 미션, 콜플랜 준비물, 팀장 지원 포인트, 점검 질문, 리스크 안전선을 빠르게 구조화할 수 있습니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-4">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">고객군 × 팀원 실행 배치를 역할·지원 포인트·점검 질문 보완으로 바꿉니다. 누가 맡는지를 다시 정하기보다, 어떻게 실행 가능하게 만들지 정리합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">7단계 고객군/점검 조건, 2주 대응 방향, 팀원 연결 기준, 위험·보완 조건입니다.</p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
            <p className="font-black">8단계에서 새로 쓰는 것</p>
            <p className="mt-1">담당 팀원의 역할 미션, 콜플랜 준비물, 팀장 지원 포인트, 점검 질문, 리스크 안전선입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">9단계 실행 대화에서 사용할 팀원별 역할 미션, 팀장 지원 포인트, 점검 질문, 조심할 표현입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">7단계 배정을 반복하지 않습니다</p>
          <p className="mt-1">7단계가 “누구에게 무엇을 연결할지”를 정했다면, 8단계는 “그 팀원이 실행할 수 있도록 팀장이 무엇을 지원하고 어떻게 점검할지”를 보완합니다. 따라서 이 화면의 핵심은 재배정이 아니라 실행 가능성 보완입니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소 결과물</p>
          <p className="mt-1">팀원별 실행 보완 Map입니다. 담당 고객군/점검 조건, 역할 미션, 콜플랜 준비물, 팀장 지원 포인트, 점검 질문, 리스크 안전선을 남기면 충분합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          자동 배정표를 만드는 화면이 아닙니다. 팀원이 실제로 움직일 수 있도록 역할을 작게 쪼개고, 팀장이 도와야 할 지점을 분명히 하는 과정입니다.
        </div>
      </section>

      <V39MemberRoleLab />
    </section>
  );
}
