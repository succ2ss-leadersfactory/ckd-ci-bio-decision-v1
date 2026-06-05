import { loadV39AiCallPlanResult } from './journey-v39-ai-call-plan-result-store';
import { V39ComplianceCleanupLab } from './journey-v39-compliance-cleanup-lab';
import { loadV39ComplianceCleanupResult } from './journey-v39-compliance-cleanup-result-store';

const V39_COMPLIANCE_CLEANUP_UX_SMOKE_MARKERS = [
  '11단계 진행 가이드',
  'AI 실행계획 초안을 안전한 실행 문장으로 정리합니다',
  '10단계 실행계획',
  '점검 대상 문장',
  '11단계 저장 상태',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_COMPLIANCE_CLEANUP_UX_SMOKE_MARKERS;

function getComplianceCleanupStatus() {
  const aiCallPlanResult = loadV39AiCallPlanResult();
  const cleanupResult = loadV39ComplianceCleanupResult();
  const targetCount = Object.values(aiCallPlanResult.items).filter((item) => item.callPlanDraft.trim()).length;
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
            <p className="text-xs font-black uppercase tracking-wide text-rose-700">11단계 진행 가이드 · 컴플라이언스와 실행 대화 리스크 점검</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">AI 실행계획 초안을 안전한 실행 문장으로 정리합니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">10단계에서 만든 AI 실행계획 초안을 그대로 쓰지 않고, 제약영업 컴플라이언스 위험과 팀원 실행 대화 리스크를 함께 점검합니다. 여기서 고친 안전 문장과 최종 체크리스트가 12단계 최종 실행 카드의 기준이 됩니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3">
              <p className="text-xs font-black text-rose-700">10단계 실행계획</p>
              <p className="mt-1 text-sm font-black text-rose-950">{aiCallPlanStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
              <p className="text-xs font-black text-amber-700">점검 대상 문장</p>
              <p className="mt-1 text-sm font-black text-amber-950">{status.targetCount}개</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">11단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{cleanupStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-bold leading-5 text-rose-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">AI가 만든 실행 초안에서 처방 유도, 비교 우위 단정, 허가 외 표현, 고객 등급화, 팀원 부담 전가처럼 위험한 문장을 찾아 안전하게 고칩니다.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">10단계 AI 실행계획 초안, 위험 메모, 11단계 점검 초점입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">12단계 최종 실행 카드에 넣을 안전한 문장, 최종 체크리스트, 팀장 메모입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">정리된 항목</p>
            <p className="mt-1">{status.cleanupFieldCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">표현 점검 기준</p>
            <p className="mt-1">단정, 비교, 압박, 과장, 민감정보, 고객 평가 표현이 섞이지 않았는지 확인합니다.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀장 판단 기준</p>
            <p className="mt-1">AI가 쓴 문장을 그대로 가져오지 않고, 팀장이 현장에서 책임지고 말할 수 있는 문장으로 다시 씁니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">최소 결과물</p>
          <p className="mt-1">위험 유형 요약, 안전하게 수정한 문장, 최종 체크리스트, 최종 실행 카드에 넣을 메모만 남기면 됩니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.</p>
        </div>
      </section>

      <V39ComplianceCleanupLab />
    </section>
  );
}
