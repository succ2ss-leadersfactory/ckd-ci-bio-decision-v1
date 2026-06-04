import { loadV39FinalCallPlanResult } from './journey-v39-final-call-plan-result-store';
import { V39InstructorDiscussionLab } from './journey-v39-instructor-discussion-lab';

function getInstructorDiscussionStatus() {
  const result = loadV39FinalCallPlanResult();
  const completedFieldCount = [
    result.focusCustomers,
    result.memberRoles,
    result.twoWeekAction,
    result.compliancePoint,
    result.firstMessage,
    result.discussionMemo,
  ].filter((value) => value.trim()).length;

  return {
    finalUpdatedAt: result.updatedAt,
    completedFieldCount,
    hasExecutionPriority: result.twoWeekAction.trim().length > 0,
    hasFirstMessage: result.firstMessage.trim().length > 0,
    hasCompliancePoint: result.compliancePoint.trim().length > 0,
  };
}

export function V39InstructorDiscussionUxLab() {
  const status = getInstructorDiscussionStatus();
  const finalCardStateLabel = status.finalUpdatedAt ? '12단계 최종 카드 있음' : '12단계 최종 카드 없음';
  const discussionReadyLabel = status.completedFieldCount >= 5 ? '토의 준비 충분' : '보완 필요';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">13단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">최종 실행 카드를 강사용 토의 질문으로 전환합니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
              <p className="text-xs font-black text-cyan-700">12단계 카드 상태</p>
              <p className="mt-1 text-sm font-black text-cyan-950">{finalCardStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">토의 자료 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">{status.completedFieldCount}개 항목</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">강사용 운영 준비</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{discussionReadyLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">최종 실행 카드의 판단 근거, 보완 지점, 실행 대화, 안전 문장 수정 이유를 토의 질문으로 전환합니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">12단계 최종 2주 실행 카드의 고객군, 팀원 역할, 실행 우선순위, 안전선, 첫 문장입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">강사가 디브리핑에서 사용할 핵심 질문과 참여자 판단을 확장할 토의 포인트입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">실행 우선순위</p>
            <p className="mt-1">{status.hasExecutionPriority ? '저장됨' : '미작성'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀원 첫 문장</p>
            <p className="mt-1">{status.hasFirstMessage ? '저장됨' : '미작성'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">컴플라이언스 안전선</p>
            <p className="mt-1">{status.hasCompliancePoint ? '저장됨' : '미작성'}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 고객 실행 판단 질문, 팀원 역할 배정 질문, 실행 대화 첫마디 질문, 컴플라이언스 안전선 질문, 현업 실행 전환 질문. 이 단계는 평가가 아니라 디브리핑과 현업 적용을 돕는 운영 자료입니다.
        </div>
      </section>

      <V39InstructorDiscussionLab />
    </section>
  );
}
