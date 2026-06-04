import { V39AiCallPlanLab } from './journey-v39-ai-call-plan-lab';
import { loadV39AiCallPlanResult } from './journey-v39-ai-call-plan-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';

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
  const memberRoleResult = loadV39MemberRoleResult();
  const aiCallPlanResult = loadV39AiCallPlanResult();
  const savedRoleCount = Object.values(memberRoleResult.roles).filter((role) => role.roleMission.trim()).length;
  const savedCallPlanCount = Object.values(aiCallPlanResult.items).filter((item) => (
    item.callPlanDraft.trim() ||
    item.riskMemo.trim() ||
    item.cleanupFocus.trim()
  )).length;

  return {
    memberRoleUpdatedAt: memberRoleResult.updatedAt,
    aiCallPlanUpdatedAt: aiCallPlanResult.updatedAt,
    savedRoleCount,
    peopleDialogueReady: hasPeopleDialogueResult(),
    savedCallPlanCount,
  };
}

export function V39AiCallPlanUxLab() {
  const status = getAiCallPlanStatus();
  const roleStateLabel = status.memberRoleUpdatedAt ? '8단계 결과 있음' : '8단계 결과 없음';
  const dialogueStateLabel = status.peopleDialogueReady ? '9단계 결과 있음' : '9단계 결과 없음';
  const saveStateLabel = status.aiCallPlanUpdatedAt ? '저장 내용 있음' : '아직 작성 전';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">10단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">팀원 역할과 실행 대화를 AI 실행계획 프롬프트로 연결합니다</h2>
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

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">8단계 역할 방향과 9단계 실행 대화를 묶어 AI에 붙여넣을 실행계획 프롬프트를 준비합니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">팀원별 역할 미션, 코칭 초점, 리스크 안전선, 목적에 맞게 바꾼 첫마디입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">11단계 컴플라이언스 점검 대상이 될 AI 실행계획 초안과 위험 메모입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">정리된 역할 수</p>
            <p className="mt-1">{status.savedRoleCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">실행계획 저장 항목</p>
            <p className="mt-1">{status.savedCallPlanCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 사용 기준</p>
            <p className="mt-1">답을 맡기지 않고, 팀장이 작성한 맥락을 검토·확장하는 용도로 사용합니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: AI에 붙여넣을 실행계획 프롬프트, AI 실행계획 초안, 위험 메모, 11단계 점검 초점. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        </div>
      </section>

      <V39AiCallPlanLab />
    </section>
  );
}
