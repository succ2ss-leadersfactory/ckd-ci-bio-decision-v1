import { V39AiCallPlanLab } from './journey-v39-ai-call-plan-lab';
import { loadV39AiCallPlanResult } from './journey-v39-ai-call-plan-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';

const V39_AI_CALL_PLAN_UX_SMOKE_MARKERS = [
  '10단계 진행 가이드',
  '팀원 역할과 실행 대화를 AI 실행계획 프롬프트로 연결합니다',
  '8단계 역할 결과',
  '9단계 실행 대화',
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
  const roleStateLabel = status.memberRoleUpdatedAt ? '역할 메모 있음' : '역할 메모 없음';
  const dialogueStateLabel = status.peopleDialogueReady ? '대화 메모 있음' : '대화 메모 없음';
  const saveStateLabel = status.aiCallPlanUpdatedAt ? '메모 남김' : '아직 비어 있음';

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">10단계 · AI에 물어볼 실행 질문 만들기</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">팀장이 정리한 맥락을 바탕으로, AI에 맡길 질문을 정확히 써봅니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">역할 메모</p>
              <p className="mt-1 text-sm font-black text-sky-950">{roleStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">대화 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{dialogueStateLabel}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">AI 질문 메모</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{saveStateLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">지금 만들 것</p>
            <p className="mt-1">팀원 역할과 첫마디를 묶어, AI가 실행계획 초안을 잡을 수 있을 만큼 구체적인 질문을 만듭니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">팀원별 역할, 코칭 초점, 조심해야 할 표현, 목적에 맞게 고친 첫마디입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 화면에서 이어 쓸 내용</p>
            <p className="mt-1">11단계에서 손봐야 할 AI 초안, 위험해 보이는 문장, 표현 점검 포인트입니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">정리된 역할</p>
            <p className="mt-1">{status.savedRoleCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">실행 초안 메모</p>
            <p className="mt-1">{status.savedCallPlanCount}개</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI를 쓰는 기준</p>
            <p className="mt-1">결정을 맡기는 것이 아니라, 팀장이 본 맥락을 더 정리하고 빠진 부분을 점검하는 데 씁니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          이 화면에서는 AI에 붙여넣을 실행 질문, AI가 낸 실행 초안, 위험해 보이는 표현, 다음 화면에서 손볼 포인트를 남기면 됩니다. 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        </div>
      </section>

      <V39AiCallPlanLab />
    </section>
  );
}
