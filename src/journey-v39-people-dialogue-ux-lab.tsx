import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';
import { V39PeopleDialogueLab } from './journey-v39-people-dialogue-lab';

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
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">9단계 진행 가이드</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">대화 상황을 고르고, 첫마디를 실행 대화로 바꿉니다</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[25rem]">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">8단계 역할 결과</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{savedRoleCount}개 반영 가능</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">9단계 저장 상태</p>
              <p className="mt-1 text-sm font-black text-violet-950">{dialogueSaved ? '저장 내용 있음' : '아직 작성 전'}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">이 단계에서 하는 일</p>
            <p className="mt-1">평소 첫마디를 목적에 맞는 실행 대화로 바꿉니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">이전 단계에서 가져온 것</p>
            <p className="mt-1">8단계 팀원 역할 방향과 코칭 초점입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 단계로 넘길 것</p>
            <p className="mt-1">10단계 AI 실행계획 프롬프트에 반영할 대화 목적과 첫마디입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          최소 결과물: 대화 상황 선택, 대화 목적 선택, 평소 첫마디 확인, 실제로 사용할 첫 문장 저장. 선택 입력은 시간이 있을 때 보완해도 됩니다.
        </div>
      </section>

      <V39PeopleDialogueLab />
    </section>
  );
}
