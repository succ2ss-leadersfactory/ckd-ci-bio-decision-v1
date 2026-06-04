import { loadV39AiCallPlanResult } from './journey-v39-ai-call-plan-result-store';
import { V39ComplianceCleanupLab } from './journey-v39-compliance-cleanup-lab';
import { loadV39ComplianceCleanupResult } from './journey-v39-compliance-cleanup-result-store';

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
  const aiCallPlanStateLabel = status.aiCallPlanUpdatedAt ? '10단계 결과 있음' : '10단계 결과 없음';
  const cleanupStateLabel = status.cleanupUpdatedAt ? '저장 내용 있음' : '아직 작성 전';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-rose-700">11단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">AI 실행계획 초안을 안전한 실행 문장으로 정리합니다</h2>
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
            <p className="mt-1">AI 실행계획 초안에서 컴플라이언스 위험 표현과 팀원 실행 대화 리스크를 찾아 수정합니다.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">10단계 AI 실행계획 초안, 위험 메모, 다음 단계 점검 초점입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">12단계 최종 실행 카드에 반영할 안전 문장, 체크리스트, 최종 카드 메모입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">정리된 안전 항목</p>
            <p className="mt-1">{status.cleanupFieldCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">핵심 점검 기준</p>
            <p className="mt-1">처방 유도, 비교 우위 단정, 허가 외 표현, 민감정보, 팀원 부담 전가 표현을 확인합니다.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">리더 판단 기준</p>
            <p className="mt-1">AI 문장을 그대로 쓰지 않고, 팀장이 최종 책임자로 안전 문장으로 재작성합니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 위험 유형 요약, 안전하게 수정한 문장, 최종 체크리스트, 최종 카드 메모. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        </div>
      </section>

      <V39ComplianceCleanupLab />
    </section>
  );
}
