import { loadV39FinalCallPlanResult } from './journey-v39-final-call-plan-result-store';
import { V39InstructorDiscussionLab } from './journey-v39-instructor-discussion-lab';

const V39_INSTRUCTOR_DISCUSSION_UX_SMOKE_MARKERS = [
  '13단계 진행 가이드',
  '최종 실행 카드를 강사용 토의 질문으로 전환합니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
].join('|');
void V39_INSTRUCTOR_DISCUSSION_UX_SMOKE_MARKERS;

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
  const finalCardStateLabel = status.finalUpdatedAt ? '최종 카드 있음' : '최종 카드 없음';
  const discussionReadyLabel = status.completedFieldCount >= 5 ? '토의 가능' : '조금 더 보완 필요';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">13단계 · 판단을 함께 뜯어볼 질문 만들기</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">마지막으로, 팀장의 판단을 함께 이야기할 질문으로 바꿉니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
              <p className="text-xs font-black text-cyan-700">최종 카드</p>
              <p className="mt-1 text-sm font-black text-cyan-950">{finalCardStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">토의거리</p>
              <p className="mt-1 text-sm font-black text-violet-950">{status.completedFieldCount}개 항목</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">운영 준비</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{discussionReadyLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
            <p className="font-black">지금 바꿀 것</p>
            <p className="mt-1">최종 카드의 판단 근거, 아쉬운 지점, 현장 적용 리스크를 토의 질문으로 바꿉니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">12단계에서 정리한 고객군, 팀원 역할, 2주 실행 우선순위, 첫마디, 피해야 할 표현입니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">수업에서 이어갈 것</p>
            <p className="mt-1">강사가 디브리핑에서 던질 핵심 질문과 참여자 판단을 넓혀볼 토의 포인트입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">실행 우선순위</p>
            <p className="mt-1">{status.hasExecutionPriority ? '정리됨' : '미작성'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀원에게 꺼낼 말</p>
            <p className="mt-1">{status.hasFirstMessage ? '정리됨' : '미작성'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">조심할 표현</p>
            <p className="mt-1">{status.hasCompliancePoint ? '정리됨' : '미작성'}</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          이 화면은 평가표가 아닙니다. 왜 그렇게 판단했는지, 현장에 가져가면 어디서 막힐지, 더 안전하게 바꾸려면 무엇을 손봐야 할지를 이야기하기 위한 자료입니다.
        </div>
      </section>

      <V39InstructorDiscussionLab />
    </section>
  );
}
