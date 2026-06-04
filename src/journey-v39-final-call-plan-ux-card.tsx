import { loadV39ComplianceCleanupResult } from './journey-v39-compliance-cleanup-result-store';
import { V39FinalCallPlanCard } from './journey-v39-final-call-plan-card';
import { loadV39FinalCallPlanResult } from './journey-v39-final-call-plan-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';

const V39_FINAL_CALL_PLAN_UX_SMOKE_MARKERS = [
  '12단계 진행 가이드',
  '고객 실행·팀원 역할·안전 문장을 2주 실행 카드로 통합합니다',
  '8단계 역할 반영',
  '9·11단계 반영',
  '12단계 저장 상태',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
].join('|');
void V39_FINAL_CALL_PLAN_UX_SMOKE_MARKERS;

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
  const peopleStateLabel = status.hasPeopleDialogue ? '대화 메모 있음' : '대화 메모 없음';
  const cleanupStateLabel = status.hasCleanup ? '안전 문장 있음' : '안전 문장 없음';
  const finalStateLabel = status.finalUpdatedAt ? '메모 남김' : '아직 비어 있음';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">12단계 · 2주 실행 카드 정리</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">이번 2주 동안 실제로 움직일 계획을 한 장으로 정리합니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">역할 반영</p>
              <p className="mt-1 text-sm font-black text-sky-950">{status.roleCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">대화·표현 반영</p>
              <p className="mt-1 text-sm font-black text-violet-950">{peopleStateLabel} · {cleanupStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">최종 카드 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{finalStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">지금 한 장으로 묶을 것</p>
            <p className="mt-1">어떤 고객군에 집중할지, 누가 무엇을 맡을지, 팀장이 어떤 말로 시작할지를 한 장에 담습니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">8단계 역할 메모, 9단계 첫마디, 11단계에서 손본 안전 문장입니다.</p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
            <p className="font-black">다음 화면에서 이어 쓸 내용</p>
            <p className="mt-1">13단계에서 함께 뜯어볼 판단 근거, 보완 지점, 토의거리입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">작성된 항목</p>
            <p className="mt-1">{status.finalFieldCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">카드 점검 기준</p>
            <p className="mt-1">고객 대응만 쓰지 않고, 팀원 수용성, 대화 첫마디, 피해야 할 표현까지 함께 봅니다.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">토의 연결</p>
            <p className="mt-1">이 카드가 왜 이렇게 나왔는지, 현장에서 어디가 막힐지 다음 화면에서 함께 봅니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          고객 대응만 적는 카드가 아닙니다. 팀원이 어떻게 움직일지, 팀장이 어떤 말로 시작할지, 어떤 표현은 피할지까지 한 장에 담으면 됩니다.
        </div>
      </section>

      <V39FinalCallPlanCard />
    </section>
  );
}
