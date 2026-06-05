import { V39AiCallPlanLab } from './journey-v39-ai-call-plan-lab';
import { loadV39AiCallPlanResult } from './journey-v39-ai-call-plan-result-store';
import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';

const V39_AI_CALL_PLAN_UX_SMOKE_MARKERS = [
  '10단계 진행 가이드',
  '팀원 역할과 실행 대화를 AI 실행계획 프롬프트로 연결합니다',
  '고객 대응 방향·역할·실행 대화를 AI 실행계획 프롬프트로 연결합니다',
  '5단계 관리 지표',
  '6단계 고객 Data 확인 List',
  '7단계 고객군별 2주 대응 방향',
  '8단계 역할 결과',
  '9단계 실행 대화',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  'AI 초안은 완성본이 아닙니다',
  '10단계 저장 상태',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  'AI에게 2주 실행 초안을 부탁할 질문을 만듭니다',
  '흩어진 메모를 하나의 실행 요청으로 묶습니다',
].join('|');
void V39_AI_CALL_PLAN_UX_SMOKE_MARKERS;

function hasPeopleDialogueResult() {
  const result = loadV39PeopleDialogueResult();
  return Boolean(
    result.updatedAt ||
    result.purposeFitOpening.trim() ||
    result.teamNorms.trim() ||
    Object.values(result.dialogueCard).some((value) => value.trim()),
  );
}

function getAiCallPlanStatus() {
  const dashboardResult = loadV39DashboardResult();
  const customerJudgmentResult = loadV39CustomerJudgmentResult();
  const customerStrategyResult = loadV39CustomerStrategyResult();
  const memberRoleResult = loadV39MemberRoleResult();
  const aiCallPlanResult = loadV39AiCallPlanResult();
  const savedMetricCount = dashboardResult.metricSelection.selectedCoreMetricIds.length;
  const savedCustomerDataCount = Object.values(customerJudgmentResult.decisions).filter((decision) => (
    decision.reason.trim() ||
    decision.opportunitySignal.trim() ||
    decision.riskSignal.trim() ||
    decision.missingInfo.trim() ||
    decision.nextCheck.trim()
  )).length;
  const savedCustomerStrategyCount = Object.values(customerStrategyResult.strategies).filter((strategy) => strategy.strategy.trim() || strategy.memberRole.trim()).length;
  const savedRoleCount = Object.values(memberRoleResult.roles).filter((role) => role.roleMission.trim()).length;
  const savedCallPlanCount = Object.values(aiCallPlanResult.items).filter((item) => (
    item.callPlanDraft.trim() ||
    item.riskMemo.trim() ||
    item.cleanupFocus.trim()
  )).length;

  return {
    dashboardUpdatedAt: dashboardResult.updatedAt,
    customerJudgmentUpdatedAt: customerJudgmentResult.updatedAt,
    customerStrategyUpdatedAt: customerStrategyResult.updatedAt,
    memberRoleUpdatedAt: memberRoleResult.updatedAt,
    aiCallPlanUpdatedAt: aiCallPlanResult.updatedAt,
    savedMetricCount,
    savedCustomerDataCount,
    savedCustomerStrategyCount,
    savedRoleCount,
    peopleDialogueReady: hasPeopleDialogueResult(),
    savedCallPlanCount,
  };
}

export function V39AiCallPlanUxLab() {
  const status = getAiCallPlanStatus();
  const roleStateLabel = status.memberRoleUpdatedAt ? '역할 메모 있음' : '역할 메모 없음';
  const dialogueStateLabel = status.peopleDialogueReady ? '대화 메모 있음' : '대화 메모 없음';
  const saveStateLabel = status.aiCallPlanUpdatedAt ? '메모 남김' : '아직 비어 있음';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">10단계 · AI에게 2주 실행 초안을 부탁할 질문을 만듭니다</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">흩어진 메모를 하나의 실행 요청으로 묶습니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">지금까지 정리한 관리 지표, 고객 활동 기록의 단서, 2주 행동 방향, 팀원에게 맡길 일, 첫 대화 문장을 한 번에 모아 AI에게 초안을 부탁합니다. AI가 만든 초안은 그대로 쓰는 문서가 아닙니다. 다음 화면에서 말해도 되는 선, 현장에 맞지 않는 표현, 팀원에게 부담으로 들릴 수 있는 문장을 다시 고칩니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">정리된 역할</p>
              <p className="mt-1 text-sm font-black text-sky-950">{roleStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">대화 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{dialogueStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">초안 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{saveStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 지금까지 남긴 메모를 보고 2주 실행계획을 직접 쓸 수 있습니다. 무엇을 볼지, 어디에 움직일지, 누가 맡을지, 어떻게 말할지를 한 장으로 정리하면 됩니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 정리가 빨라집니다</p>
            <p className="mt-1">AI는 흩어진 메모를 팀 회의에서 설명할 말, 팀원에게 부탁할 말, 중간에 확인할 질문, 조심해야 할 표현으로 빠르게 나눠 줍니다. 팀장은 그 초안을 현장에 맞게 고치면 됩니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이 화면에서 할 일</p>
            <p className="mt-1">앞에서 쓴 메모를 모아 AI에게 붙여넣을 질문과, 이후 고쳐 볼 초안을 준비합니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">앞 화면에서 가져온 것</p>
            <p className="mt-1">관리 지표, 고객 활동 기록의 단서, 2주 행동 방향, 팀원에게 맡길 일, 팀원에게 꺼낼 첫 문장입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 화면에서 볼 것</p>
            <p className="mt-1">AI가 쓴 초안 중 말하면 안 되는 표현, 과하게 들리는 문장, 현장에 맞지 않는 부분입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">관리 지표</p>
            <p className="mt-1">{status.savedMetricCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">고객 기록 단서</p>
            <p className="mt-1">{status.savedCustomerDataCount}건</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">2주 행동 방향</p>
            <p className="mt-1">{status.savedCustomerStrategyCount}건</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">정리된 역할</p>
            <p className="mt-1">{status.savedRoleCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">초안 메모</p>
            <p className="mt-1">{status.savedCallPlanCount}개</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">AI 초안은 완성본이 아닙니다</p>
          <p className="mt-1">이 화면의 목적은 AI에게 결정을 맡기는 것이 아닙니다. 팀장이 정리한 내용을 초안으로 묶어 본 뒤, 다음 화면에서 위험한 표현과 현장에 맞지 않는 문장을 골라내기 위한 준비입니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소로 남길 것</p>
          <p className="mt-1">AI에게 붙여넣을 질문, AI가 만든 2주 실행 초안, 위험해 보이는 문장, 다음 화면에서 꼭 점검할 부분을 남기면 됩니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.</p>
        </div>
      </section>

      <V39AiCallPlanLab />
    </section>
  );
}
