import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';
import { V39PeopleDialogueLab } from './journey-v39-people-dialogue-lab';

const V39_PEOPLE_DIALOGUE_UX_SMOKE_MARKERS = [
  '9단계 진행 가이드',
  '팀원 온도차와 실행 대화',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '실행 지시가 아니라 실행 대화',
  '나 때는 말이야',
  '지금은 말이야',
  '8단계 역할 미션과 지원 포인트',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '10단계 AI 실행계획 프롬프트',
].join('|');
void V39_PEOPLE_DIALOGUE_UX_SMOKE_MARKERS;

function hasSavedDialogueResult() {
  const result = loadV39PeopleDialogueResult();
  return Boolean(
    result.conversationSituationId ||
      result.dialoguePurposeId ||
      result.familiarOpeningId ||
      result.purposeFitOpening.trim() ||
      result.dialogueCard.openingLine.trim() ||
      result.teamNorms.trim(),
  );
}

function getSavedRoleCount() {
  const roleResult = loadV39MemberRoleResult();
  return Object.values(roleResult.roles).filter((role) => role.roleMission.trim()).length;
}

function getSavedSupportCount() {
  const roleResult = loadV39MemberRoleResult();
  return Object.values(roleResult.roles).filter((role) => role.coachingFocus.trim() || role.callPlanPrep.trim() || role.riskGuardrail.trim()).length;
}

export function V39PeopleDialogueUxLab() {
  const savedRoleCount = getSavedRoleCount();
  const savedSupportCount = getSavedSupportCount();
  const dialogueSaved = hasSavedDialogueResult();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">9단계 진행 가이드 · 팀원 온도차와 실행 대화</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">8단계 역할 미션과 지원 포인트를 팀원이 받아들일 수 있는 첫 문장으로 바꿉니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">7단계에서 고객군별 대응 방향과 1차 연결 후보를 정했고, 8단계에서 역할·지원 포인트·점검 질문을 보완했습니다. 이제 그 내용을 팀원에게 어떻게 꺼낼지 정리합니다. 핵심은 실행 지시가 아니라 실행 대화입니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:w-[34rem]">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">8단계 역할 미션</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{savedRoleCount}개 이어 쓸 수 있음</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">지원·점검 포인트</p>
              <p className="mt-1 text-sm font-black text-sky-950">{savedSupportCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">대화 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{dialogueSaved ? '메모 남김' : '아직 비어 있음'}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 팀원에게 직접 역할을 설명하고, 왜 맡기는지 말하고, 실행 기준과 지원 방식을 대화로 조율할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 좋아지는 점</p>
            <p className="mt-1">8단계 역할 기준을 바탕으로 내 첫마디가 기존 팀원과 MZ·저연차 팀원에게 어떻게 다르게 들릴지 미리 보고, 지원 방식과 책임 범위를 담은 대화 문장으로 빠르게 바꿀 수 있습니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">평소처럼 꺼내던 말을 팀원이 받아들일 수 있는 실행 대화의 첫 문장으로 바꿉니다. 나 때는 말이야식 표현을 지금은 말이야식 실행 기준으로 전환합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">8단계에서 정한 팀원별 역할 미션, 지원 포인트, 점검 질문, 조심해야 할 표현입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">10단계 AI 실행계획 프롬프트에 들어갈 대화 목적, 첫마디, 합의 기준, 팀장 지원 문장입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">실행 지시가 아니라 실행 대화입니다</p>
          <p className="mt-1">같은 역할 배정도 “일단 해보세요”로 시작하면 압박으로 들릴 수 있고, “왜 이 역할인지, 어디까지 하면 되는지, 무엇을 지원할지”로 시작하면 실행 기준으로 들릴 수 있습니다. 이 차이를 AI로 미리 점검합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소 결과물</p>
          <p className="mt-1">대화 상황 1개, 대화 목적 1개, 평소 첫마디 1개, 팀원에게 들릴 수 있는 의미, 실제로 사용할 첫 문장, 마지막 확인 질문을 남기면 충분합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          평소처럼 꺼내는 말이 팀원에게는 압박이나 비교로 들릴 수 있습니다. 이번 화면에서는 대화 상황, 대화 목적, 평소 첫마디, 실제로 사용할 첫 문장까지만 정리하면 됩니다.
        </div>
      </section>

      <V39PeopleDialogueLab />
    </section>
  );
}
