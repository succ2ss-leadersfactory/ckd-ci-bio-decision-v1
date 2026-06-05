import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';
import { loadV39TeamSevenCoachingMapResult } from './journey-v39-team-seven-coaching-map';
import { V39PeopleDialogueLab } from './journey-v39-people-dialogue-lab';

const V39_PEOPLE_DIALOGUE_UX_SMOKE_MARKERS = [
  '9단계 진행 가이드',
  '팀원 온도차와 실행 대화',
  '8단계 우선 1on1 연결 요약',
  '우선 1on1 대상',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '실행 지시가 아니라 실행 대화',
  '나 때는 말이야',
  '지금은 말이야',
  '8단계 역할 미션과 지원 포인트',
  '8단계 역할 보완 결과를 대화 재료로 가져옵니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '10단계 AI 실행계획 프롬프트',
  '팀원에게 어떻게 꺼낼지 정합니다',
  '첫마디가 달라지면 받아들이는 방식도 달라집니다',
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

function getRoleBridgeItems() {
  const roleResult = loadV39MemberRoleResult();
  return Object.values(roleResult.roles)
    .filter((role) => role.roleMission.trim() || role.coachingFocus.trim() || role.callPlanPrep.trim() || role.riskGuardrail.trim())
    .slice(0, 4);
}

function getPriorityOneOnOneItems() {
  const result = loadV39TeamSevenCoachingMapResult();
  return Object.values(result.decisions).filter((decision) => decision.priorityOneOnOne);
}

export function V39PeopleDialogueUxLab() {
  const savedRoleCount = getSavedRoleCount();
  const savedSupportCount = getSavedSupportCount();
  const dialogueSaved = hasSavedDialogueResult();
  const priorityOneOnOneItems = getPriorityOneOnOneItems();
  const roleBridgeItems = getRoleBridgeItems();

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">9단계 · 팀원에게 어떻게 꺼낼지 정합니다</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">첫마디가 달라지면 받아들이는 방식도 달라집니다</h2>
            <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">앞 화면에서 맡길 일과 지원할 부분을 정리했습니다. 이제는 그 말을 팀원에게 어떻게 꺼낼지 정합니다. 같은 일도 “일단 해보세요”로 시작하면 지시로 들리고, “왜 이 일을 함께 보려는지, 어디까지 하면 되는지, 내가 무엇을 도울지”로 시작하면 함께 맞춰 가는 대화가 됩니다.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-4 lg:w-[42rem]">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">
              <p className="text-xs font-black text-indigo-700">먼저 만날 팀원</p>
              <p className="mt-1 text-sm font-black text-indigo-950">{priorityOneOnOneItems.length}명</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-black text-emerald-700">맡길 일</p>
              <p className="mt-1 text-sm font-black text-emerald-950">{savedRoleCount}개 이어 쓸 수 있음</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">
              <p className="text-xs font-black text-sky-700">지원·확인할 점</p>
              <p className="mt-1 text-sm font-black text-sky-950">{savedSupportCount}개</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
              <p className="text-xs font-black text-violet-700">대화 메모</p>
              <p className="mt-1 text-sm font-black text-violet-950">{dialogueSaved ? '메모 남김' : '아직 비어 있음'}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">앞 화면에서 정한 역할을 말로 옮겨 봅니다</p>
          <p className="mt-1">맡길 일, 준비할 것, 팀장이 도와줄 것, 중간에 확인할 질문, 조심할 표현을 그대로 읽어 주지 않습니다. 팀원이 “왜 내가 해야 하지?”가 아니라 “무엇을 어디까지 하면 되지?”라고 이해할 수 있는 첫 문장으로 바꿉니다.</p>
        </div>

        {roleBridgeItems.length > 0 ? (
          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">앞 화면에서 가져온 역할과 지원 내용</p>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {roleBridgeItems.map((role) => (
                <div key={role.memberRoleId} className="rounded-2xl bg-white px-3 py-2 text-slate-700">
                  <p className="font-black text-slate-950">{role.memberLabel}</p>
                  <p className="mt-1"><span className="font-black text-emerald-800">함께 볼 고객군/조건: </span>{role.assignedCustomers || '아직 작성되지 않았습니다.'}</p>
                  <p className="mt-1"><span className="font-black text-emerald-800">맡길 일: </span>{role.roleMission || '아직 작성되지 않았습니다.'}</p>
                  <p className="mt-1"><span className="font-black text-emerald-800">지원·확인: </span>{role.coachingFocus || role.callPlanPrep || '아직 작성되지 않았습니다.'}</p>
                  <p className="mt-1"><span className="font-black text-emerald-800">조심할 표현: </span>{role.riskGuardrail || '아직 작성되지 않았습니다.'}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">앞 화면에서 가져온 역할과 지원 내용</p>
            <p className="mt-1">8단계에서 맡길 일과 지원할 부분을 저장하면, 이곳에 팀원과 나눌 대화의 재료가 표시됩니다.</p>
          </div>
        )}

        <div className="mt-3 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
          <p className="font-black">먼저 1on1로 맞춰볼 팀원</p>
          {priorityOneOnOneItems.length > 0 ? (
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {priorityOneOnOneItems.map((item) => (
                <div key={item.memberId} className="rounded-2xl bg-white px-3 py-2">
                  <p className="font-black text-slate-950">{item.memberLabel}</p>
                  <p className="mt-1"><span className="font-black text-indigo-800">업무배분 판단: </span>{item.allocationDecision || '미정'}</p>
                  <p className="mt-1"><span className="font-black text-indigo-800">대화 목적: </span>{item.coachingPurpose || '미정'}</p>
                  <p className="mt-1"><span className="font-black text-indigo-800">팀장이 도울 것: </span>{item.leaderSupport || '아직 작성되지 않았습니다.'}</p>
                  <p className="mt-1"><span className="font-black text-indigo-800">조심할 지점: </span>{item.riskMemo || '아직 작성되지 않았습니다.'}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-1">8단계에서 먼저 1on1로 맞춰볼 팀원 1~2명을 선택하면, 이곳에 대화 목적과 지원할 부분이 표시됩니다.</p>
          )}
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 팀원에게 직접 이유를 설명하고, 어디까지 하면 되는지 말하고, 필요한 지원을 대화로 맞출 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 정리가 빨라집니다</p>
            <p className="mt-1">AI는 내가 하려던 첫마디가 팀원에게 어떻게 들릴지 미리 보여줍니다. 그 덕분에 압박으로 들릴 말은 줄이고, 이유와 지원이 보이는 말로 빠르게 고칠 수 있습니다.</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">이 화면에서 할 일</p>
            <p className="mt-1">평소처럼 꺼내던 말을 팀원이 받아들일 수 있는 첫 문장으로 바꿉니다. “나 때는 말이야”가 아니라 “지금 필요한 기준은 이거야”로 바꾸는 연습입니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞 화면에서 가져온 것</p>
            <p className="mt-1">먼저 만날 팀원, 대화 목적, 맡길 일, 지원할 부분, 확인 질문, 조심할 표현입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">다음 화면에서 쓸 것</p>
            <p className="mt-1">10단계에서 AI에게 초안을 부탁할 때 넣을 대화 목적, 첫마디, 합의 기준, 팀장이 도와줄 내용입니다.</p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">지시가 아니라 대화로 시작합니다</p>
          <p className="mt-1">같은 역할도 “일단 해보세요”로 시작하면 부담으로 들릴 수 있습니다. “왜 이 일을 함께 보려는지, 어디까지 하면 되는지, 내가 무엇을 도울지”로 시작하면 팀원은 자기 일이 아니라 함께 맞춰갈 일로 받아들일 가능성이 커집니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">최소로 남길 것</p>
          <p className="mt-1">대화 상황 1개, 대화 목적 1개, 평소 첫마디 1개, 팀원에게 어떻게 들릴지, 실제로 사용할 첫 문장, 마지막 확인 질문만 남기면 충분합니다.</p>
        </div>

        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          평소처럼 꺼내는 말이 팀원에게는 압박이나 비교로 들릴 수 있습니다. 이번 화면에서는 긴 면담 대본을 쓰지 않습니다. 상황, 목적, 평소 첫마디, 실제로 사용할 첫 문장까지만 정리합니다.
        </div>
      </section>

      <V39PeopleDialogueLab />
    </section>
  );
}
