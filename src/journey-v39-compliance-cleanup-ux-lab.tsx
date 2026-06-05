import { loadV39AiCallPlanResult } from './journey-v39-ai-call-plan-result-store';
import { V39ComplianceCleanupLab } from './journey-v39-compliance-cleanup-lab';
import { loadV39ComplianceCleanupResult } from './journey-v39-compliance-cleanup-result-store';

const V39_COMPLIANCE_CLEANUP_UX_SMOKE_MARKERS = [
  '11단계 진행 가이드',
  'AI 실행계획 초안을 안전한 실행 문장으로 정리합니다',
  '10단계 실행계획',
  '점검 대상 문장',
  '위험 메모와 점검 초점도 점검 대상으로 가져옵니다',
  '11단계 저장 상태',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '말해도 되는 선을 확인하고 표현을 고칩니다',
  'AI가 쓴 문장을 현장에서 책임질 수 있는 말로 바꿉니다',
].join('|');
void V39_COMPLIANCE_CLEANUP_UX_SMOKE_MARKERS;

function hasAiCallPlanReviewContext(item: { callPlanDraft: string; riskMemo: string; cleanupFocus: string }) {
  return Boolean(item.callPlanDraft.trim() || item.riskMemo.trim() || item.cleanupFocus.trim());
}

function getComplianceCleanupStatus() {
  const aiCallPlanResult = loadV39AiCallPlanResult();
  const cleanupResult = loadV39ComplianceCleanupResult();
  const targetCount = Object.values(aiCallPlanResult.items).filter(hasAiCallPlanReviewContext).length;
  const cleanupFieldCount = [
    cleanupResult.riskTypes,
    cleanupResult.safeExpression,
    cleanupResult.finalChecklist,
    cleanupResult.finalCardMemo,
  ].filter((value) => value.trim()).length;

  return {
    aiCallPlanUpdatedAt: aiCallPlanResult.updatedAt,
    cleanupUpdatedAt: cleanupResult.updatedAt,
    targetCount,
    cleanupFieldCount,
  };
}

export function V39ComplianceCleanupUxLab() {
  const status = getComplianceCleanupStatus();
  const aiCallPlanStateLabel = status.aiCallPlanUpdatedAt ? 'AI 초안 있음' : 'AI 초안 없음';
  const cleanupStateLabel = status.cleanupUpdatedAt ? '메모 남김' : '아직 비어 있음';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-rose-700">11단계 · 말해도 되는 선을 확인하고 표현을 고칩니다</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">AI가 쓴 문장을 현장에서 책임질 수 있는 말로 바꿉니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">앞 화면에서 만든 AI 초안을 그대로 쓰지 않습니다. 고객에게 해서는 안 되는 말, 승인된 자료 범위를 벗어나는 말, 팀원에게 압박으로 들릴 수 있는 말을 찾아 고칩니다. 여기서 다듬은 문장과 체크리스트가 다음 화면의 최종 실행 카드 기준이 됩니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <p className="text-xs font-black text-rose-700">AI 초안</p>
              <p className="mt-1 text-sm font-black text-rose-950">{aiCallPlanStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-black text-amber-700">다시 볼 문장</p>
              <p className="mt-1 text-sm font-black text-amber-950">{status.targetCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">수정 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{cleanupStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold leading-5 text-rose-950">
          <p className="font-black">위험해 보이는 메모도 함께 봅니다</p>
          <p className="mt-1">AI 초안을 아직 붙여넣지 않았더라도, 앞 화면에서 남긴 위험 메모나 꼭 점검할 부분이 있으면 이 화면에서 함께 확인합니다.</p>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold leading-5 text-rose-950">
            <p className="font-black">이 화면에서 할 일</p>
            <p className="mt-1">처방을 유도하는 말, 비교 우위를 단정하는 말, 허가된 범위를 넘는 말, 고객을 등급처럼 표현하는 말, 팀원에게 부담을 떠넘기는 말을 찾아 안전하게 고칩니다.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">앞 화면에서 가져온 것</p>
            <p className="mt-1">AI가 만든 2주 실행 초안, 위험해 보이는 문장, 다음 화면 전에 꼭 점검할 부분입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 화면에서 쓸 것</p>
            <p className="mt-1">최종 실행 카드에 넣을 안전한 문장, 마지막 체크리스트, 팀장 메모입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">고친 항목</p>
            <p className="mt-1">{status.cleanupFieldCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">말의 기준</p>
            <p className="mt-1">단정, 비교, 압박, 과장, 민감정보, 고객 평가처럼 들리는 표현이 섞이지 않았는지 봅니다.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀장의 책임</p>
            <p className="mt-1">AI가 쓴 말이라도 현장에서 말하는 사람은 팀장입니다. 내가 책임지고 말할 수 있는 문장으로 다시 씁니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">최소로 남길 것</p>
          <p className="mt-1">위험해 보인 표현, 안전하게 고친 문장, 마지막 체크리스트, 최종 실행 카드에 넣을 메모만 남기면 됩니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.</p>
        </div>
      </section>

      <V39ComplianceCleanupLab />
    </section>
  );
}
