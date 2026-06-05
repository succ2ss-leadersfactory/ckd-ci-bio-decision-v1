import { loadV39FinalCallPlanResult } from './journey-v39-final-call-plan-result-store';
import { V39InstructorDiscussionLab } from './journey-v39-instructor-discussion-lab';

const V39_INSTRUCTOR_DISCUSSION_UX_SMOKE_MARKERS = [
  '13단계 진행 가이드',
  '최종 실행 카드를 강사용 토의 질문으로 전환합니다',
  '판단 근거·보완 지점·토의거리로 나누어 봅니다',
  '판단 근거',
  '보완 지점',
  '토의거리',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '교육장에서 함께 이야기할 질문거리로 바꿉니다',
  '왜 그렇게 판단했는지, 어디가 막힐지 함께 봅니다',
].join('|');
void V39_INSTRUCTOR_DISCUSSION_UX_SMOKE_MARKERS;

function hasFinalCardContext(result: { focusCustomers: string; memberRoles: string; twoWeekAction: string; compliancePoint: string; firstMessage: string; discussionMemo: string }) {
  return Boolean(
    result.focusCustomers.trim() ||
      result.memberRoles.trim() ||
      result.twoWeekAction.trim() ||
      result.compliancePoint.trim() ||
      result.firstMessage.trim() ||
      result.discussionMemo.trim(),
  );
}

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
  const hasFinalCard = Boolean(result.updatedAt || hasFinalCardContext(result));

  return {
    finalUpdatedAt: result.updatedAt,
    hasFinalCard,
    completedFieldCount,
    hasExecutionPriority: result.twoWeekAction.trim().length > 0,
    hasFirstMessage: result.firstMessage.trim().length > 0,
    hasCompliancePoint: result.compliancePoint.trim().length > 0,
    hasDiscussionMemo: result.discussionMemo.trim().length > 0,
  };
}

export function V39InstructorDiscussionUxLab() {
  const status = getInstructorDiscussionStatus();
  const finalCardStateLabel = status.hasFinalCard ? '실행 메모 있음' : '실행 메모 없음';
  const discussionReadyLabel = status.completedFieldCount >= 5 ? '함께 이야기할 준비됨' : '조금 더 보완 필요';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">13단계 · 교육장에서 함께 이야기할 질문거리로 바꿉니다</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">왜 그렇게 판단했는지, 어디가 막힐지 함께 봅니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">
              마지막 화면은 채점표가 아닙니다. 팀장이 어떤 근거로 2주 실행 메모를 만들었는지, 현장에 가져가면 어디서 막힐 수 있는지, 표현이나 역할 배분을 어떻게 더 안전하게 고칠 수 있는지 함께 이야기하기 위한 질문을 정리합니다.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3">
              <p className="text-xs font-black text-cyan-700">2주 실행 메모</p>
              <p className="mt-1 text-sm font-black text-cyan-950">{finalCardStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">이야기할 거리</p>
              <p className="mt-1 text-sm font-black text-violet-950">{status.completedFieldCount}개 항목</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">마무리 상태</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{discussionReadyLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">근거, 걱정되는 부분, 함께 물어볼 질문으로 나눕니다</p>
          <p className="mt-1">최종 실행 메모를 다시 읽는 화면이 아닙니다. “왜 이렇게 봤는가”, “현장에서 어디가 막힐 수 있는가”, “다른 팀장이라면 무엇을 다르게 볼 수 있는가”를 나눠 보는 화면입니다.</p>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
            <p className="font-black">왜 그렇게 봤는가</p>
            <p className="mt-1">관리 지표, 고객 활동 기록, 2주 행동 방향, 팀원 역할이 서로 어떻게 이어졌는지 확인합니다.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">어디가 막힐 수 있는가</p>
            <p className="mt-1">고객 기록이 부족한 부분, 특정 팀원에게 일이 몰리는 부분, 1on1 목적이 흐린 부분, 말해도 되는 선이 빠진 부분을 봅니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">함께 물어볼 질문</p>
            <p className="mt-1">강사가 던질 질문이자, 참여자들이 서로의 판단을 넓혀 볼 질문입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">2주 동안 먼저 할 일</p>
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
          이 화면은 평가표가 아닙니다. 교육장을 나간 뒤 실제 팀 회의와 1on1에서 어디가 어려울지, 어떤 표현을 더 안전하게 바꿀지, 팀장이 무엇을 다시 확인해야 할지 이야기하기 위한 자료입니다.
        </div>
      </section>

      <V39InstructorDiscussionLab />
    </section>
  );
}
