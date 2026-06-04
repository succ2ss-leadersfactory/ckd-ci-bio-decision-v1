import { useState } from 'react';
import {
  type V39AiCallPlanResult,
  loadV39AiCallPlanResult,
} from './journey-v39-ai-call-plan-result-store';
import {
  type V39ComplianceCleanupResult,
  loadV39ComplianceCleanupResult,
} from './journey-v39-compliance-cleanup-result-store';
import {
  type V39CustomerJudgmentResult,
  loadV39CustomerJudgmentResult,
} from './journey-v39-customer-judgment-result-store';
import {
  type V39CustomerStrategyResult,
  loadV39CustomerStrategyResult,
} from './journey-v39-customer-strategy-result-store';
import {
  type V39DashboardResult,
  loadV39DashboardResult,
} from './journey-v39-dashboard-result-store';
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

const V39_FINAL_CARD_SMOKE_MARKERS = [
  'V39FinalCallPlanCard',
  'V39FinalExecutionCardPanel',
  '최종 2주 실행 카드를 완성하기',
  '현업 적용 카드',
  '5단계 관리 지표',
  '6단계 고객 Data 확인 List',
  '7단계 고객군 × 팀원 실행 Map',
  '8단계 팀원 역할 요약',
  '9단계 실행 대화 요약',
  '10단계 AI 실행계획 초안',
  '11단계 컴플라이언스 요약',
  '13단계 강사용 토의에 넘길 최종 실행 카드 저장',
].join('|');
void V39_FINAL_CARD_SMOKE_MARKERS;

function hasPeopleDialogue(result: V39PeopleDialogueResult) {
  return Boolean(
    result.dialoguePurposeId ||
      result.conversationSituationId ||
      result.purposeFitOpening.trim() ||
      result.dialogueCard.openingLine.trim() ||
      result.teamNorms.trim(),
  );
}

function joinList(items: string[], empty = '아직 정리되지 않았습니다.') {
  return items.length > 0 ? items.join(' · ') : empty;
}

function buildMetricSummary(result: V39DashboardResult) {
  return [
    '[5단계 관리 지표]',
    `- 팀 상황: ${joinList(result.teamSituations)}`,
    `- 핵심 실행 지표: ${joinList(result.metricSelection.selectedCoreMetricIds)}`,
    `- 함께 볼 현장 신호: ${joinList(result.metricSelection.selectedSupportMetricIds)}`,
    `- 조심할 해석: ${joinList(result.metricSelection.selectedSafetyMetricIds)}`,
    `- 왜 이 지표를 보는가: ${result.metricSelection.metricRationale || result.metricResult.additionalMetricIdea || '아직 정리되지 않았습니다.'}`,
  ].join('\n');
}

function buildCustomerDataSummary(result: V39CustomerJudgmentResult) {
  const decisions = Object.values(result.decisions).filter((decision) => (
    decision.reason.trim() ||
    decision.opportunitySignal.trim() ||
    decision.riskSignal.trim() ||
    decision.missingInfo.trim() ||
    decision.nextCheck.trim() ||
    decision.judgmentMemo.trim()
  ));

  if (decisions.length === 0) {
    return [
      '[6단계 고객 Data 확인 List]',
      `- 고객 Data 상황: ${joinList(result.customerContextSelections)}`,
      `- 분석 관점: ${joinList(result.judgmentCriteriaSelections)}`,
      '- 아직 확인 항목별 메모가 저장되지 않았습니다.',
    ].join('\n');
  }

  return [
    '[6단계 고객 Data 확인 List]',
    ...decisions.slice(0, 5).flatMap((decision, index) => [
      `${index + 1}. ${decision.customerLabel}`,
      `- 확인할 Data: ${decision.reason || decision.judgmentMemo || '아직 정리되지 않았습니다.'}`,
      `- 기회 신호: ${decision.opportunitySignal || '아직 정리되지 않았습니다.'}`,
      `- 주의/부족 정보: ${[decision.riskSignal, decision.missingInfo].filter(Boolean).join(' / ') || '아직 정리되지 않았습니다.'}`,
      `- 추가 확인 질문: ${decision.nextCheck || '아직 정리되지 않았습니다.'}`,
      '',
    ]),
  ].join('\n');
}

function buildCustomerStrategySummary(result: V39CustomerStrategyResult) {
  const strategies = Object.values(result.strategies).filter((strategy) => strategy.strategy.trim() || strategy.memberRole.trim());
  if (strategies.length === 0) return '[7단계 고객군 × 팀원 실행 Map]\n- 아직 고객군별 대응 방향과 팀원 연결 기준이 저장되지 않았습니다.';

  return [
    '[7단계 고객군 × 팀원 실행 Map]',
    ...strategies.slice(0, 5).flatMap((strategy, index) => [
      `${index + 1}. ${strategy.customerLabel}`,
      `- 대응 강도: ${strategy.priority || '아직 정리되지 않았습니다.'}`,
      `- 2주 대응 방향: ${strategy.strategy || '아직 정리되지 않았습니다.'}`,
      `- 팀원 연결 기준/후보: ${strategy.memberRole || '아직 정리되지 않았습니다.'}`,
      `- 위험·보완 조건: ${strategy.risk || '표현·자료·접촉 강도 안전선 확인'}`,
      '',
    ]),
  ].join('\n');
}

function buildRoleSummary(result: V39MemberRoleResult) {
  const savedRoles = Object.values(result.roles).filter((role) => role.roleMission.trim());
  if (savedRoles.length === 0) return '아직 8단계 팀원 역할 결과가 저장되지 않았습니다.';
  return savedRoles
    .map((role, index) => [
      `${index + 1}. ${role.memberLabel}`,
      `- 담당 고객군: ${role.assignedCustomers || '아직 정리되지 않았습니다.'}`,
      `- 역할 미션: ${role.roleMission || '아직 정리되지 않았습니다.'}`,
      `- 팀장 지원 포인트/점검 질문: ${role.coachingFocus || '아직 정리되지 않았습니다.'}`,
      `- 리스크 안전선: ${role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}`,
      `- 콜플랜 준비물: ${role.callPlanPrep || '방문 전 확인 질문과 사용 가능한 자료 범위 확인'}`,
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

function buildAiCallPlanSummary(result: V39AiCallPlanResult) {
  const savedItems = Object.values(result.items).filter((item) => item.callPlanDraft.trim() || item.riskMemo.trim() || item.cleanupFocus.trim());
  if (savedItems.length === 0) return '아직 10단계 AI 실행계획 초안이 저장되지 않았습니다.';

  return savedItems
    .map((item, index) => [
      `${index + 1}. ${item.title}`,
      `- AI 실행계획 초안: ${item.callPlanDraft || '아직 정리되지 않았습니다.'}`,
      `- 위험 메모: ${item.riskMemo || '아직 정리되지 않았습니다.'}`,
      `- 11단계 점검 초점: ${item.cleanupFocus || '아직 정리되지 않았습니다.'}`,
    ].join('\n'))
    .join('\n\n');
}

function buildFinalCardSummary(
  dashboard: V39DashboardResult,
  customerData: V39CustomerJudgmentResult,
  customerStrategy: V39CustomerStrategyResult,
  aiCallPlan: V39AiCallPlanResult,
  cleanup: V39ComplianceCleanupResult,
  people: V39PeopleDialogueResult,
  roles: V39MemberRoleResult,
) {
  return [
    '[12단계 최종 실행 카드 입력 자료]',
    '',
    buildMetricSummary(dashboard),
    '',
    buildCustomerDataSummary(customerData),
    '',
    buildCustomerStrategySummary(customerStrategy),
    '',
    '[8단계 팀원 역할 요약]',
    buildRoleSummary(roles),
    '',
    buildPeopleDialogueSummary(people),
    '',
    '[10단계 AI 실행계획 초안]',
    buildAiCallPlanSummary(aiCallPlan),
    '',
    '[11단계 컴플라이언스 요약]',
    `- 위험 유형 요약: ${cleanup.riskTypes || '아직 작성되지 않았습니다.'}`,
    `- 안전하게 수정한 문장: ${cleanup.safeExpression || '아직 작성되지 않았습니다.'}`,
    `- 최종 체크리스트: ${cleanup.finalChecklist || '아직 작성되지 않았습니다.'}`,
    `- 최종 카드 메모: ${cleanup.finalCardMemo || '아직 작성되지 않았습니다.'}`,
  ].join('\n');
}

function buildDefaultFinalCallPlanResult(
  dashboard: V39DashboardResult,
  customerData: V39CustomerJudgmentResult,
  customerStrategy: V39CustomerStrategyResult,
  aiCallPlan: V39AiCallPlanResult,
  cleanup: V39ComplianceCleanupResult,
  people: V39PeopleDialogueResult,
  roles: V39MemberRoleResult,
  current: V39FinalCallPlanResult,
): Partial<V39FinalCallPlanResult> {
  const savedRoles = Object.values(roles.roles).filter((role) => role.roleMission.trim());
  const savedStrategies = Object.values(customerStrategy.strategies).filter((strategy) => strategy.strategy.trim() || strategy.memberRole.trim());
  const savedAiDraft = Object.values(aiCallPlan.items).find((item) => item.callPlanDraft.trim());
  const dataQuestions = Object.values(customerData.decisions).map((decision) => decision.nextCheck).filter(Boolean).slice(0, 3).join(' / ');

  return {
    focusCustomers: current.focusCustomers || (savedStrategies.length > 0
      ? savedStrategies.slice(0, 3).map((strategy) => `${strategy.customerLabel}: ${strategy.strategy || strategy.priority || '2주 대응 방향 확인'}`).join('\n')
      : '기회 신호와 실행 가능성이 함께 확인된 고객군을 우선 검토합니다. 고객 Data가 부족한 고객군은 설득보다 확인 질문 중심으로 접근합니다.'),
    memberRoles: current.memberRoles || (savedRoles.length > 0 ? buildRoleSummary(roles) : '팀원별 역할은 고객군 특성, 실행 강점, 코칭 필요점, 부담 편중 가능성을 기준으로 조정합니다.'),
    twoWeekAction: current.twoWeekAction || [
      `핵심 실행 지표: ${joinList(dashboard.metricSelection.selectedCoreMetricIds)}`,
      savedAiDraft?.callPlanDraft || '1주차에는 고객군별 확인 질문과 사용 가능한 자료 범위를 정리하고, 2주차에는 후속 반응·CRM 기록·팀원 실행 대화 결과를 함께 점검합니다.',
      dataQuestions ? `추가 확인 질문: ${dataQuestions}` : '',
    ].filter(Boolean).join('\n'),
    compliancePoint: current.compliancePoint || cleanup.finalChecklist || '실제 고객명·병원명·의료진명·제품명·매출·처방 수치 입력을 금지하고, 처방 유도·비교 우위 단정·허가 외 표현을 제거합니다.',
    firstMessage: current.firstMessage || people.dialogueCard.openingLine || people.purposeFitOpening || '이번 2주는 많이 방문하는 것보다 고객군별 반응 신호를 읽고, 역할 기준과 안전한 표현을 맞추는 데 집중합시다.',
    discussionMemo: current.discussionMemo || cleanup.finalCardMemo || '강사용 토의에서는 관리 지표, 고객 Data 확인 List, 고객군 × 팀원 실행 Map, 실행 대화 첫마디, 컴플라이언스 수정 포인트를 함께 확인합니다.',
  };
}

function V39FinalExecutionCardPanel({
  dashboardResult,
  customerJudgmentResult,
  customerStrategyResult,
  aiCallPlanResult,
  cleanupResult,
  peopleDialogueResult,
  memberRoleResult,
  onRefresh,
}: {
  dashboardResult: V39DashboardResult;
  customerJudgmentResult: V39CustomerJudgmentResult;
  customerStrategyResult: V39CustomerStrategyResult;
  aiCallPlanResult: V39AiCallPlanResult;
  cleanupResult: V39ComplianceCleanupResult;
  peopleDialogueResult: V39PeopleDialogueResult;
  memberRoleResult: V39MemberRoleResult;
  onRefresh: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [finalCardResult, setFinalCardResult] = useState(() => loadV39FinalCallPlanResult());
  const summary = buildFinalCardSummary(dashboardResult, customerJudgmentResult, customerStrategyResult, aiCallPlanResult, cleanupResult, peopleDialogueResult, memberRoleResult);
  const metricCount = dashboardResult.metricSelection.selectedCoreMetricIds.length;
  const customerDataCount = Object.values(customerJudgmentResult.decisions).filter((decision) => decision.reason.trim() || decision.nextCheck.trim()).length;
  const strategyCount = Object.values(customerStrategyResult.strategies).filter((strategy) => strategy.strategy.trim() || strategy.memberRole.trim()).length;
  const roleCount = Object.values(memberRoleResult.roles).filter((role) => role.roleMission.trim()).length;
  const peopleReady = hasPeopleDialogue(peopleDialogueResult);
  const aiDraftCount = Object.values(aiCallPlanResult.items).filter((item) => item.callPlanDraft.trim()).length;

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
    updateFinalCardResult(buildDefaultFinalCallPlanResult(dashboardResult, customerJudgmentResult, customerStrategyResult, aiCallPlanResult, cleanupResult, peopleDialogueResult, memberRoleResult, finalCardResult));
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Final Two-Week Execution Card</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">최종 2주 실행 카드를 완성하기</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            5단계 관리 지표, 6단계 고객 Data 확인 List, 7단계 고객군 × 팀원 실행 Map, 8단계 팀원 역할, 9단계 실행 대화, 10단계 AI 실행계획 초안, 11단계 컴플라이언스 안전 문장을 함께 반영해 최종 2주 실행 카드를 작성합니다.
            이 카드는 교육 후 바로 가져갈 수 있는 현업 적용 카드입니다.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-emerald-700">이 단계에서 하는 일</p>
              <p className="mt-1">고객 실행, 팀원 역할, 실행 대화, AI 초안, 안전선을 하나의 카드로 통합합니다.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-emerald-700">이전 단계에서 가져온 것</p>
              <p className="mt-1">5~11단계 전체 결과입니다.</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-emerald-700">다음 단계로 넘길 것</p>
              <p className="mt-1">13단계 강사용 토의 질문의 기준 자료입니다.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            5~11단계 저장 결과 다시 불러오기
          </button>
          <button type="button" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-emerald-800" onClick={copyFinalCardSummary}>
            {copied ? '최종 카드 요약 복사 완료' : '강사용 토의에 넘길 최종 카드 요약 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-6">
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">관리 지표</p><p className="mt-1 text-sm font-black text-slate-900">{metricCount}개</p><p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">5단계 결과</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">고객 Data</p><p className="mt-1 text-sm font-black text-slate-900">{customerDataCount}건</p><p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">6단계 결과</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">실행 Map</p><p className="mt-1 text-sm font-black text-slate-900">{strategyCount}건</p><p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">7단계 결과</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">팀원 역할</p><p className="mt-1 text-sm font-black text-slate-900">{roleCount}개</p><p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">8단계 결과</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">실행 대화</p><p className="mt-1 text-sm font-black text-slate-900">{peopleReady ? '있음' : '없음'}</p><p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">9단계 결과</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">AI 초안/안전선</p><p className="mt-1 text-sm font-black text-slate-900">초안 {aiDraftCount}개</p><p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">10·11단계 결과</p></div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-xs font-bold leading-5 text-cyan-950">
        <p className="font-black">현업 적용 카드</p>
        <p className="mt-1">최종 카드는 멋진 요약문이 아니라, 다음 2주 동안 팀장이 무엇을 보고, 누구와 어떻게 대화하고, 어떤 표현을 조심할지 들고 나가는 실행 기준입니다.</p>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-emerald-700">5단계 관리 지표</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildMetricSummary(dashboardResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-sky-700">6단계 고객 Data 확인 List</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildCustomerDataSummary(customerJudgmentResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-violet-700">7단계 고객군 × 팀원 실행 Map</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildCustomerStrategySummary(customerStrategyResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-sky-700">8단계 팀원 역할 요약</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildRoleSummary(memberRoleResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-violet-700">9단계 실행 대화 요약</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildPeopleDialogueSummary(peopleDialogueResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-amber-700">10단계 AI 실행계획 초안</p>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{buildAiCallPlanSummary(aiCallPlanResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-3">
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
              강사용 토의 화면에서 참여자의 관리 지표, 고객 Data 확인 List, 고객군 × 팀원 실행 Map, 실행 대화 첫마디, AI 초안 수정 포인트, 컴플라이언스 안전선을 확인할 수 있도록 요약을 저장합니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl border bg-cyan-50 px-4 py-2 text-xs font-black text-cyan-800" onClick={applyFinalCardDraft}>
            저장된 결과로 최종 실행 카드 채우기
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">[필수] 집중 고객군 요약</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.focusCustomers} onChange={(event) => updateFinalCardResult({ focusCustomers: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">[필수] 팀원별 역할 요약</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.memberRoles} onChange={(event) => updateFinalCardResult({ memberRoles: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">[필수] 2주 실행 우선순위</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.twoWeekAction} onChange={(event) => updateFinalCardResult({ twoWeekAction: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">[필수] 컴플라이언스 포인트</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.compliancePoint} onChange={(event) => updateFinalCardResult({ compliancePoint: event.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">[필수] 팀원에게 말할 첫 문장</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.firstMessage} onChange={(event) => updateFinalCardResult({ firstMessage: event.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">[선택] 강사용 토의 메모</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.discussionMemo} onChange={(event) => updateFinalCardResult({ discussionMemo: event.target.value })} />
          </label>
        </div>
        <div className="mt-3 rounded-2xl bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-900">
          입력 내용은 자동으로 저장됩니다. 13단계에서 이 최종 실행 카드를 바탕으로 강사용 토의 질문을 확인합니다.
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
  const [dashboardResult, setDashboardResult] = useState(() => loadV39DashboardResult());
  const [customerJudgmentResult, setCustomerJudgmentResult] = useState(() => loadV39CustomerJudgmentResult());
  const [customerStrategyResult, setCustomerStrategyResult] = useState(() => loadV39CustomerStrategyResult());
  const [aiCallPlanResult, setAiCallPlanResult] = useState(() => loadV39AiCallPlanResult());
  const [cleanupResult, setCleanupResult] = useState(() => loadV39ComplianceCleanupResult());
  const [peopleDialogueResult, setPeopleDialogueResult] = useState(() => loadV39PeopleDialogueResult());
  const [memberRoleResult, setMemberRoleResult] = useState(() => loadV39MemberRoleResult());

  const refreshResults = () => {
    setDashboardResult(loadV39DashboardResult());
    setCustomerJudgmentResult(loadV39CustomerJudgmentResult());
    setCustomerStrategyResult(loadV39CustomerStrategyResult());
    setAiCallPlanResult(loadV39AiCallPlanResult());
    setCleanupResult(loadV39ComplianceCleanupResult());
    setPeopleDialogueResult(loadV39PeopleDialogueResult());
    setMemberRoleResult(loadV39MemberRoleResult());
  };

  return (
    <V39FinalExecutionCardPanel
      dashboardResult={dashboardResult}
      customerJudgmentResult={customerJudgmentResult}
      customerStrategyResult={customerStrategyResult}
      aiCallPlanResult={aiCallPlanResult}
      cleanupResult={cleanupResult}
      peopleDialogueResult={peopleDialogueResult}
      memberRoleResult={memberRoleResult}
      onRefresh={refreshResults}
    />
  );
}
