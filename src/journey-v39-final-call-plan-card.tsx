import { useState } from 'react';
import {
  type V39ComplianceCleanupResult,
  loadV39ComplianceCleanupResult,
} from './journey-v39-compliance-cleanup-result-store';
import {
  type V39MemberRoleResult,
  loadV39MemberRoleResult,
} from './journey-v39-member-role-result-store';
import {
  type V39PeopleDialogueResult,
  loadV39PeopleDialogueResult,
} from './journey-v39-people-dialogue-result-store';
import {
  type V39FinalCallPlanResult,
  loadV39FinalCallPlanResult,
  saveV39FinalCallPlanResult,
} from './journey-v39-final-call-plan-result-store';

function hasPeopleDialogue(result: V39PeopleDialogueResult) {
  return Boolean(
    result.dialoguePurposeId ||
      result.conversationSituationId ||
      result.purposeFitOpening.trim() ||
      result.dialogueCard.openingLine.trim() ||
      result.teamNorms.trim(),
  );
}

function buildRoleSummary(result: V39MemberRoleResult) {
  const savedRoles = Object.values(result.roles).filter((role) => role.roleMission.trim());
  if (savedRoles.length === 0) return '아직 8단계 팀원 역할 결과가 저장되지 않았습니다.';
  return savedRoles
    .map((role, index) => [
      `${index + 1}. ${role.memberLabel}`,
      `- 담당 고객군: ${role.assignedCustomers || '아직 정리되지 않았습니다.'}`,
      `- 역할 미션: ${role.roleMission || '아직 정리되지 않았습니다.'}`,
      `- 코칭 초점: ${role.coachingFocus || '아직 정리되지 않았습니다.'}`,
      `- 리스크 안전선: ${role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}`,
    ].join('\n'))
    .join('\n\n');
}

function buildPeopleDialogueSummary(result: V39PeopleDialogueResult) {
  if (!hasPeopleDialogue(result)) return '아직 9단계 실행 대화 결과가 저장되지 않았습니다.';
  return [
    '[9단계 실행 대화 결과]',
    `- 선택한 대화 상황 ID: ${result.conversationSituationId || '미선택'}`,
    `- 선택한 대화 목적 ID: ${result.dialoguePurposeId || '미선택'}`,
    `- 평소 첫마디: ${result.familiarOpeningCustom || result.familiarOpeningId || '미작성'}`,
    `- 신세대 팀원에게 들릴 수 있는 의미: ${result.perceivedByNewGen || '미작성'}`,
    `- 기존 팀원에게 들릴 수 있는 의미: ${result.perceivedByExistingMember || '미작성'}`,
    `- 빠진 정보: ${result.missingInformation || '미작성'}`,
    `- 목적에 맞게 바꾼 첫마디: ${result.purposeFitOpening || result.dialogueCard.openingLine || '미작성'}`,
    `- 합의할 실행 기준: ${result.dialogueCard.agreementCriteria || '미작성'}`,
    `- 팀장이 지원할 것: ${result.dialogueCard.leaderSupport || '미작성'}`,
    result.teamNorms ? `- 우리 팀 실행 대화 규범:\n${result.teamNorms}` : '- 우리 팀 실행 대화 규범: 미작성',
  ].join('\n');
}

function buildFinalCardSummary(cleanup: V39ComplianceCleanupResult, people: V39PeopleDialogueResult, roles: V39MemberRoleResult) {
  return [
    '[12단계 최종 실행 카드 입력 자료]',
    '',
    '[8단계 팀원 역할 요약]',
    buildRoleSummary(roles),
    '',
    buildPeopleDialogueSummary(people),
    '',
    '[11단계 컴플라이언스 정리 결과]',
    `- 위험 유형 요약: ${cleanup.riskTypes || '아직 작성되지 않았습니다.'}`,
    `- 안전하게 수정한 문장: ${cleanup.safeExpression || '아직 작성되지 않았습니다.'}`,
    `- 최종 체크리스트: ${cleanup.finalChecklist || '아직 작성되지 않았습니다.'}`,
    `- 최종 카드 메모: ${cleanup.finalCardMemo || '아직 작성되지 않았습니다.'}`,
  ].join('\n');
}

function buildDefaultFinalCallPlanResult(
  cleanup: V39ComplianceCleanupResult,
  people: V39PeopleDialogueResult,
  roles: V39MemberRoleResult,
  current: V39FinalCallPlanResult,
): Partial<V39FinalCallPlanResult> {
  const savedRoles = Object.values(roles.roles).filter((role) => role.roleMission.trim());
  return {
    focusCustomers: current.focusCustomers || '기회 신호와 실행 가능성이 함께 확인된 고객군을 우선 검토합니다. 고객 Data가 부족한 고객군은 설득보다 확인 질문 중심으로 접근합니다.',
    memberRoles: current.memberRoles || (savedRoles.length > 0 ? buildRoleSummary(roles) : '팀원별 역할은 고객군 특성, 실행 강점, 코칭 필요점, 부담 편중 가능성을 기준으로 조정합니다.'),
    twoWeekAction: current.twoWeekAction || '1주차에는 고객군별 확인 질문과 사용 가능한 자료 범위를 정리하고, 2주차에는 후속 반응·CRM 기록·팀원 실행 대화 결과를 함께 점검합니다.',
    compliancePoint: current.compliancePoint || cleanup.finalChecklist || '실제 고객명·병원명·의료진명·제품명·매출·처방 수치 입력을 금지하고, 처방 유도·비교 우위 단정·허가 외 표현을 제거합니다.',
    firstMessage: current.firstMessage || people.dialogueCard.openingLine || people.purposeFitOpening || '이번 2주는 많이 방문하는 것보다 고객군별 반응 신호를 읽고, 역할 기준과 안전한 표현을 맞추는 데 집중합시다.',
    discussionMemo: current.discussionMemo || cleanup.finalCardMemo || '강사용 토의에서는 고객 실행 우선순위, 팀원 역할 배정 기준, 실행 대화 첫마디, 컴플라이언스 수정 포인트를 함께 확인합니다.',
  };
}

function V39FinalExecutionCardPanel({
  cleanupResult,
  peopleDialogueResult,
  memberRoleResult,
  onRefresh,
}: {
  cleanupResult: V39ComplianceCleanupResult;
  peopleDialogueResult: V39PeopleDialogueResult;
  memberRoleResult: V39MemberRoleResult;
  onRefresh: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [finalCardResult, setFinalCardResult] = useState(() => loadV39FinalCallPlanResult());
  const summary = buildFinalCardSummary(cleanupResult, peopleDialogueResult, memberRoleResult);
  const roleCount = Object.values(memberRoleResult.roles).filter((role) => role.roleMission.trim()).length;
  const peopleReady = hasPeopleDialogue(peopleDialogueResult);

  const copyFinalCardSummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const updateFinalCardResult = (patch: Partial<V39FinalCallPlanResult>) => {
    setFinalCardResult((current) => {
      const next = { ...current, ...patch };
      saveV39FinalCallPlanResult(next);
      return next;
    });
  };

  const applyFinalCardDraft = () => {
    updateFinalCardResult(buildDefaultFinalCallPlanResult(cleanupResult, peopleDialogueResult, memberRoleResult, finalCardResult));
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Final Two-Week Execution Card</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">최종 2주 실행 카드를 완성하기</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            8단계 팀원 역할, 9단계 실행 대화, 11단계 컴플라이언스 안전 문장을 함께 반영해 최종 2주 실행 카드를 작성합니다.
            최종 카드는 고객 실행만 정리하는 문서가 아니라, 팀원이 납득하고 실행할 수 있는 역할 기준과 안전한 첫마디까지 포함하는 실행 약속입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            이전 단계 결과 새로고침
          </button>
          <button type="button" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-emerald-800" onClick={copyFinalCardSummary}>
            {copied ? '최종 카드 요약 복사 완료' : '최종 카드 요약 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">팀원 역할</p>
          <p className="mt-1 text-sm font-black text-slate-900">{roleCount}개 반영</p>
          <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">8단계 결과 기준</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">실행 대화</p>
          <p className="mt-1 text-sm font-black text-slate-900">{peopleReady ? '정리 결과 있음' : '정리 결과 없음'}</p>
          <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">9단계 첫마디 기준</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">안전 문장</p>
          <p className="mt-1 text-sm font-black text-slate-900">{cleanupResult.safeExpression.trim() ? '저장됨' : '미작성'}</p>
          <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">11단계 결과 기준</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">최종 카드</p>
          <p className="mt-1 text-sm font-black text-slate-900">{finalCardResult.updatedAt ? '요약 있음' : '요약 없음'}</p>
          <p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">강사용 토의 연결</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-sky-700">8단계 팀원 역할 요약</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildRoleSummary(memberRoleResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-violet-700">9단계 실행 대화 요약</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildPeopleDialogueSummary(peopleDialogueResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-emerald-700">11단계 컴플라이언스 요약</p>
          <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{cleanupResult.finalChecklist || '아직 11단계 최종 체크리스트가 저장되지 않았습니다.'}</p>
        </article>
      </div>

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">최종 실행 카드에 반영할 요약</span>
        <textarea className="mt-3 min-h-72 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={summary} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Instructor Discussion Preparation</p>
            <h3 className="text-lg font-black text-slate-950">13단계 강사용 토의에 넘길 최종 실행 카드 저장</h3>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
              강사용 토의 화면에서 참여자의 고객 실행 우선순위, 팀원 역할, 실행 대화 첫마디, 컴플라이언스 수정 포인트를 확인할 수 있도록 요약을 저장합니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl border bg-cyan-50 px-4 py-2 text-xs font-black text-cyan-800" onClick={applyFinalCardDraft}>
            최종 실행 카드 초안 가져오기
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">집중 고객군 요약</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.focusCustomers} onChange={(event) => updateFinalCardResult({ focusCustomers: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">팀원별 역할 요약</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.memberRoles} onChange={(event) => updateFinalCardResult({ memberRoles: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">2주 실행 우선순위</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.twoWeekAction} onChange={(event) => updateFinalCardResult({ twoWeekAction: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">컴플라이언스 포인트</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.compliancePoint} onChange={(event) => updateFinalCardResult({ compliancePoint: event.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">팀원에게 말할 첫 문장</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.firstMessage} onChange={(event) => updateFinalCardResult({ firstMessage: event.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">강사용 토의 메모</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.discussionMemo} onChange={(event) => updateFinalCardResult({ discussionMemo: event.target.value })} />
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        최종 카드에도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        위험 표현을 제거한 안전 문장과 팀장이 직접 확인한 실행 대화 기준만 반영합니다.
      </div>
    </section>
  );
}

export function V39FinalCallPlanCard() {
  const [cleanupResult, setCleanupResult] = useState(() => loadV39ComplianceCleanupResult());
  const [peopleDialogueResult, setPeopleDialogueResult] = useState(() => loadV39PeopleDialogueResult());
  const [memberRoleResult, setMemberRoleResult] = useState(() => loadV39MemberRoleResult());

  const refreshResults = () => {
    setCleanupResult(loadV39ComplianceCleanupResult());
    setPeopleDialogueResult(loadV39PeopleDialogueResult());
    setMemberRoleResult(loadV39MemberRoleResult());
  };

  return (
    <V39FinalExecutionCardPanel
      cleanupResult={cleanupResult}
      peopleDialogueResult={peopleDialogueResult}
      memberRoleResult={memberRoleResult}
      onRefresh={refreshResults}
    />
  );
}
