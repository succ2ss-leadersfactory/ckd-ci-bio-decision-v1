import { loadV39ComplianceCleanupResult } from './journey-v39-compliance-cleanup-result-store';
import { V39FinalCallPlanCard } from './journey-v39-final-call-plan-card';
import { loadV39FinalCallPlanResult } from './journey-v39-final-call-plan-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';

function getFinalCallPlanStatus() {
  const memberRoleResult = loadV39MemberRoleResult();
  const peopleDialogueResult = loadV39PeopleDialogueResult();
  const cleanupResult = loadV39ComplianceCleanupResult();
  const finalCardResult = loadV39FinalCallPlanResult();

  const roleCount = Object.values(memberRoleResult.roles).filter((role) => role.roleMission.trim()).length;
  const hasPeopleDialogue = Boolean(
    peopleDialogueResult.updatedAt ||
    peopleDialogueResult.purposeFitOpening.trim() ||
    peopleDialogueResult.dialogueCard.openingLine.trim() ||
    peopleDialogueResult.teamNorms.trim(),
  );
  const hasCleanup = Boolean(
    cleanupResult.updatedAt ||
    cleanupResult.safeExpression.trim() ||
    cleanupResult.finalChecklist.trim(),
  );
  const finalFieldCount = [
    finalCardResult.focusCustomers,
    finalCardResult.memberRoles,
    finalCardResult.twoWeekAction,
    finalCardResult.compliancePoint,
    finalCardResult.firstMessage,
    finalCardResult.discussionMemo,
  ].filter((value) => value.trim()).length;

  return {
    roleCount,
    hasPeopleDialogue,
    hasCleanup,
    finalFieldCount,
    finalUpdatedAt: finalCardResult.updatedAt,
  };
}

export function V39FinalCallPlanUxCard() {
  const status = getFinalCallPlanStatus();
  const peopleStateLabel = status.hasPeopleDialogue ? '9단계 결과 있음' : '9단계 결과 없음';
  const cleanupStateLabel = status.hasCleanup ? '11단계 결과 있음' : '11단계 결과 없음';
  const finalStateLabel = status.finalUpdatedAt ? '저장 내용 있음' : '아직 작성 전';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">12단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">고객 실행·팀원 역할·안전 문장을 2주 실행 카드로 통합합니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">8단계 역할 반영</p>
              <p className="mt-1 text-sm font-black text-sky-950">{status.roleCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">9·11단계 반영</p>
              <p className="mt-1 text-sm font-black text-violet-950">{peopleStateLabel} · {cleanupStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">12단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{finalStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">집중 고객군, 팀원 역할, 2주 실행 우선순위, 컴플라이언스 포인트, 팀원에게 말할 첫 문장을 하나의 카드로 통합합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">8단계 역할 요약, 9단계 실행 대화, 11단계 안전 문장과 최종 체크리스트입니다.</p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">13단계 강사용 토의 질문을 만들기 위한 최종 실행 카드와 토의 메모입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">작성된 카드 항목</p>
            <p className="mt-1">{status.finalFieldCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">카드 품질 기준</p>
            <p className="mt-1">고객 실행만이 아니라 팀원 수용성, 실행 대화, 안전 표현까지 함께 담습니다.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">13단계 연결</p>
            <p className="mt-1">최종 카드의 판단 근거와 보완 지점을 강사용 토의 질문으로 전환합니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 집중 고객군 요약, 팀원별 역할 요약, 2주 실행 우선순위, 컴플라이언스 포인트, 팀원에게 말할 첫 문장, 강사용 토의 메모. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        </div>
      </section>

      <V39FinalCallPlanCard />
    </section>
  );
}
