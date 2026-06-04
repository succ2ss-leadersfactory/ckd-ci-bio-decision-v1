import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';
import { V39PeopleDialogueLab } from './journey-v39-people-dialogue-lab';

const V39_PEOPLE_DIALOGUE_UX_SMOKE_MARKERS = [
  '9단계 진행 가이드',
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

export function V39PeopleDialogueUxLab() {
  const savedRoleCount = getSavedRoleCount();
  const dialogueSaved = hasSavedDialogueResult();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">9단계 · 팀원에게 꺼낼 첫마디 다듬기</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">팀원이 방어적으로 듣지 않도록, 첫마디부터 다시 잡아봅니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[25rem]">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">앞에서 잡은 역할</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{savedRoleCount}개 이어 쓸 수 있음</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">대화 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{dialogueSaved ? '메모 남김' : '아직 비어 있음'}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">지금 바꿀 것</p>
            <p className="mt-1">평소처럼 꺼내던 말을 팀원이 받아들일 수 있는 실행 대화의 첫 문장으로 바꿉니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞에서 확인한 내용</p>
            <p className="mt-1">8단계에서 정한 팀원별 역할, 코칭 초점, 조심해야 할 표현입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 화면에서 이어 쓸 내용</p>
            <p className="mt-1">10단계에서 AI에 물어볼 때 들어갈 대화 목적과 첫마디입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          평소처럼 꺼내는 말이 팀원에게는 압박이나 비교로 들릴 수 있습니다. 이번 화면에서는 대화 상황, 대화 목적, 평소 첫마디, 실제로 사용할 첫 문장까지만 정리하면 됩니다.
        </div>
      </section>

      <V39PeopleDialogueLab />
    </section>
  );
}
