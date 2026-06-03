import { useMemo, useState } from 'react';
import {
  type V39MemberRoleResult,
  loadV39MemberRoleResult,
} from './journey-v39-member-role-result-store';
import {
  type V39PeopleDialogueResult,
  loadV39PeopleDialogueResult,
} from './journey-v39-people-dialogue-result-store';
import {
  type V39AiCallPlanResultItem,
  loadV39AiCallPlanResult,
  normalizeV39AiCallPlanResultItem,
  saveV39AiCallPlanResult,
} from './journey-v39-ai-call-plan-result-store';

function hasDialogueCard(result: V39PeopleDialogueResult) {
  return Object.values(result.dialogueCard).some((value) => value.trim());
}

function buildPeopleDialogueSummary(result: V39PeopleDialogueResult) {
  const lines: string[] = [];

  if (result.cultureShiftSelections.length > 0) lines.push(`- 일하는 방식 변화 선택: ${result.cultureShiftSelections.length}개`);
  if (result.leaderFeelingSelections.length > 0) lines.push(`- 팀장 당혹감 선택: ${result.leaderFeelingSelections.length}개`);
  if (result.newGenSignalSelections.length > 0) lines.push(`- 현재 변화 신호: ${result.newGenSignalSelections.length}개`);
  if (result.existingMemberSignalSelections.length > 0) lines.push(`- 기존 팀원 부담 신호: ${result.existingMemberSignalSelections.length}개`);
  if (result.conflictTypeSelections.length > 0) lines.push(`- 갈등 유형: ${result.conflictTypeSelections.length}개`);
  if (result.dialogueStrategySelections.length > 0) lines.push(`- 팀장 대화 전략: ${result.dialogueStrategySelections.length}개`);
  if (result.conversationSituationId) lines.push(`- 선택한 대화 상황 ID: ${result.conversationSituationId}`);
  if (result.dialoguePurposeId) lines.push(`- 선택한 대화 목적 ID: ${result.dialoguePurposeId}`);
  if (result.familiarOpeningId || result.familiarOpeningCustom.trim()) lines.push(`- 평소 첫마디: ${result.familiarOpeningCustom || result.familiarOpeningId}`);
  if (result.perceivedByNewGen) lines.push(`- 신세대 팀원에게 들릴 수 있는 의미: ${result.perceivedByNewGen}`);
  if (result.perceivedByExistingMember) lines.push(`- 기존 팀원에게 들릴 수 있는 의미: ${result.perceivedByExistingMember}`);
  if (result.missingInformation) lines.push(`- 빠진 정보: ${result.missingInformation}`);
  if (result.purposeFitOpening) lines.push(`- 목적에 맞게 바꾼 첫마디: ${result.purposeFitOpening}`);

  if (hasDialogueCard(result)) {
    lines.push('- 팀원 실행 대화 카드: 작성됨');
    if (result.dialogueCard.targetMember) lines.push(`  · 대상 팀원: ${result.dialogueCard.targetMember}`);
    if (result.dialogueCard.expectedReaction) lines.push(`  · 예상 반응: ${result.dialogueCard.expectedReaction}`);
    if (result.dialogueCard.openingLine) lines.push(`  · 팀장이 먼저 꺼낼 말: ${result.dialogueCard.openingLine}`);
    if (result.dialogueCard.agreementCriteria) lines.push(`  · 합의할 실행 기준: ${result.dialogueCard.agreementCriteria}`);
    if (result.dialogueCard.leaderSupport) lines.push(`  · 팀장이 지원할 것: ${result.dialogueCard.leaderSupport}`);
    if (result.dialogueCard.avoidPhrase) lines.push(`  · 피해야 할 말: ${result.dialogueCard.avoidPhrase}`);
    if (result.dialogueCard.alternativePhrase) lines.push(`  · 대체 문장: ${result.dialogueCard.alternativePhrase}`);
  }

  if (result.teamNorms.trim()) {
    lines.push('- 우리 팀 실행 대화 규범:');
    lines.push(result.teamNorms);
  }

  return lines.length > 0 ? lines.join('\n') : '아직 9단계 팀원 실행 대화 결과가 저장되지 않았습니다.';
}

function buildCallPlanContextPrompt(roleResult: V39MemberRoleResult, peopleDialogueResult: V39PeopleDialogueResult) {
  const savedRoles = Object.values(roleResult.roles).filter((role) => role.roleMission.trim());
  const peopleDialogueSummary = buildPeopleDialogueSummary(peopleDialogueResult);

  if (savedRoles.length === 0) {
    return [
      '아직 8단계 팀원 역할 결과가 저장되지 않았습니다.',
      '먼저 8단계에서 담당 고객군, 역할 미션, 코칭 초점, 리스크 안전선, 콜플랜 준비물을 정리하세요.',
      '',
      '9단계 팀원 실행 대화 결과:',
      peopleDialogueSummary,
    ].join('\n');
  }

  return [
    '아래 내용은 교육용 가상 고객군, 팀원 역할, 실행 대화 결과입니다.',
    '실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 수치, 개인정보는 포함하지 않습니다.',
    '',
    '8단계 팀원 역할 결과:',
    ...savedRoles.flatMap((role, index) => [
      `${index + 1}. ${role.memberLabel}`,
      `- 담당 고객군: ${role.assignedCustomers || '아직 정리되지 않았습니다.'}`,
      `- 역할 미션: ${role.roleMission || '아직 정리되지 않았습니다.'}`,
      `- 코칭 초점: ${role.coachingFocus || '아직 정리되지 않았습니다.'}`,
      `- 리스크 안전선: ${role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}`,
      `- 콜플랜 준비물: ${role.callPlanPrep || '방문 전 확인 질문과 사용 가능한 자료 범위 확인'}`,
      '',
    ]),
    '9단계 팀원 실행 대화 결과:',
    peopleDialogueSummary,
    '',
    'AI Call Plan 요청 시 위 내용을 바탕으로 고객군별 2주 콜 우선순위, 팀원별 실행 역할, 방문 전 질문, 팀원 실행 대화 포인트, 컴플라이언스 안전 표현, 리스크 점검표를 작성해 주세요.',
    '단, 팀원을 세대 특성으로 단정하지 말고 선택한 대화 목적, 역할 기준, 지원 방식, 책임 범위, 실행 대화 규범을 함께 반영해 주세요.',
  ].join('\n');
}

function buildInitialCallPlanSaveState(): Record<string, V39AiCallPlanResultItem> {
  if (typeof window === 'undefined') return {};
  const saved = loadV39AiCallPlanResult();
  return {
    callPlanDraft: normalizeV39AiCallPlanResultItem(saved.items.callPlanDraft, 'callPlanDraft', 'AI Call Plan 초안'),
  };
}

function V39MemberRoleCallPlanPanel({
  roleResult,
  peopleDialogueResult,
  onRefreshRole,
  onRefreshPeopleDialogue,
}: {
  roleResult: V39MemberRoleResult;
  peopleDialogueResult: V39PeopleDialogueResult;
  onRefreshRole: () => void;
  onRefreshPeopleDialogue: () => void;
}) {
  const savedRoles = Object.values(roleResult.roles).filter((role) => role.roleMission.trim());
  const [copied, setCopied] = useState(false);
  const [callPlanItems, setCallPlanItems] = useState<Record<string, V39AiCallPlanResultItem>>(buildInitialCallPlanSaveState);
  const callPlanContextPrompt = useMemo(() => buildCallPlanContextPrompt(roleResult, peopleDialogueResult), [roleResult, peopleDialogueResult]);
  const currentCallPlan = callPlanItems.callPlanDraft ?? normalizeV39AiCallPlanResultItem(undefined, 'callPlanDraft', 'AI Call Plan 초안');
  const peopleDialogueCompleted = hasDialogueCard(peopleDialogueResult) || peopleDialogueResult.teamNorms.trim().length > 0 || peopleDialogueResult.purposeFitOpening.trim().length > 0;

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(callPlanContextPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const updateCallPlanItem = (patch: Partial<V39AiCallPlanResultItem>) => {
    setCallPlanItems((current) => {
      const next = {
        ...current,
        callPlanDraft: {
          ...normalizeV39AiCallPlanResultItem(current.callPlanDraft, 'callPlanDraft', 'AI Call Plan 초안'),
          ...patch,
        },
      };
      saveV39AiCallPlanResult({ schemaVersion: 1, updatedAt: '', items: next });
      return next;
    });
  };

  const applyCallPlanDraft = () => {
    updateCallPlanItem({
      callPlanDraft: currentCallPlan.callPlanDraft || '고객군별 2주 콜 우선순위, 팀원별 실행 역할, 팀원이 납득할 수 있는 실행 대화 포인트, 방문 전 확인 질문, 사용 가능한 자료 범위, 리스크 점검 기준을 정리한다.',
      riskMemo: currentCallPlan.riskMemo || '처방 유도 표현, 비교 우위 단정, 허가 외 표현, 실제 고객·병원·의료진·처방 정보 포함 여부, 팀원에게 부담을 전가하는 표현을 점검한다.',
      cleanupFocus: currentCallPlan.cleanupFocus || '11단계에서 문장을 승인 자료 범위, 질문 중심, 가상 고객군 기준, 팀원 실행 대화 기준으로 안전하게 수정한다.',
    });
  };

  return (
    <section className="rounded-3xl border border-sky-100 bg-sky-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">AI Execution Prompt Preparation</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">AI에 붙여넣을 실행계획 프롬프트 준비하기</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            8단계에서 정리한 팀원 역할과 9단계에서 정리한 실행 대화 결과를 바탕으로 AI에게 요청할 맥락을 정리합니다.
            AI에게 답을 맡기는 단계가 아니라, 팀장이 고객 실행과 팀원 수용성을 함께 반영해 요청 내용을 안전하게 구성하는 단계입니다.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-sky-700">이 단계에서 하는 일</p>
              <p className="mt-1">AI에 붙여넣을 실행계획 프롬프트와 점검 대상 초안을 준비합니다.</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-sky-700">이전 단계에서 가져온 것</p>
              <p className="mt-1">8단계 팀원 역할과 9단계 실행 대화 결과입니다.</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-sky-700">다음 단계로 넘길 것</p>
              <p className="mt-1">11단계에서 위험 표현을 제거할 AI 실행계획 초안입니다.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefreshRole}>
            8단계 저장 결과 다시 불러오기
          </button>
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefreshPeopleDialogue}>
            9단계 저장 결과 다시 불러오기
          </button>
          <button type="button" className="rounded-full bg-sky-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-sky-800" onClick={copyPrompt}>
            {copied ? '프롬프트 복사 완료' : 'AI에 붙여넣을 실행계획 프롬프트 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">8단계 역할 결과</p>
          <p className="mt-1 text-sm font-black text-slate-900">{roleResult.updatedAt ? '불러옴' : '아직 없음'}</p>
          {roleResult.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{roleResult.updatedAt}</p> : <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">8단계 저장 후 다시 불러오세요.</p>}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">정리된 역할</p>
          <p className="mt-1 text-sm font-black text-slate-900">{savedRoles.length}개</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">9단계 실행 대화</p>
          <p className="mt-1 text-sm font-black text-slate-900">{peopleDialogueCompleted ? '불러옴' : '아직 없음'}</p>
          <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">{peopleDialogueCompleted ? '대화 목적과 첫마디가 반영됩니다.' : '9단계 저장 후 다시 불러오세요.'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">이 단계 최소 결과물</p>
          <p className="mt-1 text-sm font-black text-slate-900">실행계획 초안</p>
          <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">11단계 점검 대상으로 저장합니다.</p>
        </div>
      </div>

      {savedRoles.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          8단계에서 팀원별 역할을 정리하면, 이곳에 AI 실행계획 프롬프트 입력 맥락이 표시됩니다.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {savedRoles.slice(0, 6).map((role) => (
            <article key={role.memberRoleId} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="font-black text-slate-950">{role.memberLabel}</p>
              <p className="mt-2 text-xs font-black text-sky-700">담당 고객군</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.assignedCustomers || '아직 정리되지 않았습니다.'}</p>
              <p className="mt-2 text-xs font-black text-slate-500">역할 미션</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.roleMission}</p>
              <p className="mt-2 text-xs font-black text-slate-500">콜플랜 준비물</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.callPlanPrep || '방문 전 확인 질문과 사용 가능한 자료 범위 확인'}</p>
              <p className="mt-2 text-xs font-black text-amber-700">리스크 안전선</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}</p>
            </article>
          ))}
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-black text-slate-950">9단계 실행 대화 요약</p>
        <pre className="mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-violet-50 p-4 text-xs font-bold leading-6 text-violet-950">{buildPeopleDialogueSummary(peopleDialogueResult)}</pre>
      </div>

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">AI에 붙여넣을 실행계획 프롬프트</span>
        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">복사한 뒤 외부 AI에 붙여넣고, 결과를 아래의 실행계획 초안 영역에 다시 정리합니다.</p>
        <textarea className="mt-3 min-h-80 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={callPlanContextPrompt} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Compliance Review Preparation</p>
            <h3 className="text-lg font-black text-slate-950">컴플라이언스 점검을 위한 실행계획 초안 정리</h3>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
              AI가 만든 문장을 그대로 쓰지 않고, 다음 단계에서 컴플라이언스 위험 표현과 팀원 실행 대화 위험을 함께 점검하기 위한 대상으로 정리합니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl border bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-800" onClick={applyCallPlanDraft}>
            저장된 맥락으로 실행계획 초안 채우기
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="space-y-1 md:col-span-3">
            <span className="text-xs font-black text-slate-500">[필수] AI 실행계획 초안</span>
            <textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={currentCallPlan.callPlanDraft} onChange={(event) => updateCallPlanItem({ callPlanDraft: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">[선택] 위험 메모</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={currentCallPlan.riskMemo} onChange={(event) => updateCallPlanItem({ riskMemo: event.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">[필수] 다음 단계 점검 초점</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={currentCallPlan.cleanupFocus} onChange={(event) => updateCallPlanItem({ cleanupFocus: event.target.value })} />
          </label>
        </div>
        <div className="mt-3 rounded-2xl bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-900">
          입력 내용은 자동으로 저장됩니다. 11단계에서 이 실행계획 초안을 불러와 위험 표현을 제거합니다.
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        10단계에서도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        AI에게 요청할 때도 교육용 가상 고객군, 팀원 역할, 실행 대화 맥락만 사용합니다.
      </div>
    </section>
  );
}

export function V39AiCallPlanLab() {
  const [memberRoleResult, setMemberRoleResult] = useState(() => loadV39MemberRoleResult());
  const [peopleDialogueResult, setPeopleDialogueResult] = useState(() => loadV39PeopleDialogueResult());

  const refreshMemberRoleResult = () => {
    setMemberRoleResult(loadV39MemberRoleResult());
  };

  const refreshPeopleDialogueResult = () => {
    setPeopleDialogueResult(loadV39PeopleDialogueResult());
  };

  return (
    <V39MemberRoleCallPlanPanel
      roleResult={memberRoleResult}
      peopleDialogueResult={peopleDialogueResult}
      onRefreshRole={refreshMemberRoleResult}
      onRefreshPeopleDialogue={refreshPeopleDialogueResult}
    />
  );
}
