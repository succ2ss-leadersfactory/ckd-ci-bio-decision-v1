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
  '5단계 관리 지표',
  '6단계 고객 Data 확인 List',
  '7단계 고객군 × 팀원 실행 Map',
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
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">10단계 진행 가이드 · AI 실행계획 Prompt</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">팀원 역할과 실행 대화를 AI 실행계획 프롬프트로 연결합니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">5단계 관리 지표, 6단계 고객 Data 확인 List, 7단계 고객군 × 팀원 실행 Map, 8단계 역할 보완, 9단계 실행 대화를 하나의 맥락으로 묶어 AI 실행계획 초안을 요청합니다. AI 초안은 완성본이 아닙니다. 다음 단계에서 컴플라이언스 위험 표현과 실행 대화 위험을 반드시 고칩니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">8단계 역할 결과</p>
              <p className="mt-1 text-sm font-black text-sky-950">{roleStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">9단계 실행 대화</p>
              <p className="mt-1 text-sm font-black text-violet-950">{dialogueStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">10단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{saveStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 관리 지표, 고객 Data, 고객군 대응, 팀원 역할, 실행 대화를 종합해 2주 실행계획을 직접 만들 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 좋아지는 점</p>
            <p className="mt-1">흩어진 산출물을 한 번에 묶어 팀 회의 설명 문장, 팀원별 실행 요청 문장, 점검 질문, 리스크 보완 조건을 빠르게 초안화할 수 있습니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">앞 단계 산출물을 묶어 AI에 붙여넣을 실행계획 프롬프트와 점검 대상 초안을 준비합니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">5단계 관리 지표, 6단계 고객 Data 확인 List, 7단계 고객군 × 팀원 실행 Map, 8단계 역할 결과, 9단계 실행 대화입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">11단계에서 손봐야 할 AI 초안, 위험해 보이는 문장, 컴플라이언스 표현 점검 포인트입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">5단계 관리 지표</p>
            <p className="mt-1">{status.savedMetricCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">6단계 확인 List</p>
            <p className="mt-1">{status.savedCustomerDataCount}건</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">7단계 실행 Map</p>
            <p className="mt-1">{status.savedCustomerStrategyCount}건</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">정리된 역할</p>
            <p className="mt-1">{status.savedRoleCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">실행 초안 메모</p>
            <p className="mt-1">{status.savedCallPlanCount}개</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">AI 초안은 완성본이 아닙니다</p>
          <p className="mt-1">이 화면의 목적은 AI에게 일을 맡기는 것이 아니라, 팀장이 정리한 맥락을 실행계획 초안으로 묶어본 뒤 다음 단계에서 위험 표현과 현장 부적합 문장을 고치는 것입니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소 결과물</p>
          <p className="mt-1">AI에 붙여넣을 실행계획 프롬프트, AI 실행계획 초안, 위험 메모, 다음 단계 점검 초점을 남기면 됩니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.</p>
        </div>
      </section>

      <V39AiCallPlanLab />
    </section>
  );
}
