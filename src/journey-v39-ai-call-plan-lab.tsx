import { useMemo, useState } from 'react';
import { type V39DashboardResult, loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import { type V39CustomerJudgmentResult, loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { type V39CustomerStrategyResult, loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import {
  type V39MemberRoleResult,
  type V39MemberRoleResultItem,
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

const V39_AI_CALL_PLAN_LAB_SMOKE_MARKERS = [
  'V39AiCallPlanLab',
  'V39MemberRoleCallPlanPanel',
  '5단계 관리 지표',
  '6단계 고객 Data 확인 List',
  '7단계 고객군 × 팀원 실행 Map',
  '8단계 팀원 역할 결과',
  '8단계 역할 미션 없이도 지원 포인트와 안전선을 반영합니다',
  '9단계 실행 대화 요약',
  '선택한 대화 목적 ID',
  '목적에 맞게 바꾼 첫마디',
  '팀원 실행 대화 포인트',
  '9단계 저장 결과 다시 불러오기',
  'AI 초안은 완성본이 아닙니다',
  '팀 회의 설명 문장',
  '팀원별 실행 요청 문장',
  '11단계에서 위험 표현을 제거할 AI 실행계획 초안',
].join('|');
void V39_AI_CALL_PLAN_LAB_SMOKE_MARKERS;

function hasDialogueCard(result: V39PeopleDialogueResult) {
  return Object.values(result.dialogueCard).some((value) => value.trim());
}

function joinList(items: string[], empty = '아직 정리되지 않았습니다.') {
  return items.length > 0 ? items.join(' · ') : empty;
}

function hasMemberRoleContext(role: V39MemberRoleResultItem) {
  return Boolean(
    role.assignedCustomers.trim() ||
      role.roleMission.trim() ||
      role.coachingFocus.trim() ||
      role.riskGuardrail.trim() ||
      role.callPlanPrep.trim(),
  );
}

function buildDashboardSummary(result: V39DashboardResult) {
  return [
    '5단계 관리 지표:',
    `- 팀 상황: ${joinList(result.teamSituations)}`,
    `- 핵심 실행 지표: ${joinList(result.metricSelection.selectedCoreMetricIds)}`,
    `- 함께 볼 현장 신호: ${joinList(result.metricSelection.selectedSupportMetricIds)}`,
    `- 조심할 해석/안전 지표: ${joinList(result.metricSelection.selectedSafetyMetricIds)}`,
    `- 왜 이 지표를 보는가: ${result.metricSelection.metricRationale || result.metricResult.additionalMetricIdea || '아직 정리되지 않았습니다.'}`,
    `- 팀장이 더 확인할 질문: ${result.metricResult.aiRecommendedQuestions || '아직 정리되지 않았습니다.'}`,
  ].join('\n');
}

function buildCustomerJudgmentSummary(result: V39CustomerJudgmentResult) {
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
      '6단계 고객 Data 확인 List:',
      `- 선택한 고객 Data 상황: ${joinList(result.customerContextSelections)}`,
      `- 분석 관점: ${joinList(result.judgmentCriteriaSelections)}`,
      '- 아직 고객 Data 확인 항목별 메모가 저장되지 않았습니다.',
    ].join('\n');
  }

  return [
    '6단계 고객 Data 확인 List:',
    `- 선택한 고객 Data 상황: ${joinList(result.customerContextSelections)}`,
    `- 분석 관점: ${joinList(result.judgmentCriteriaSelections)}`,
    ...decisions.slice(0, 6).flatMap((decision, index) => [
      `${index + 1}. ${decision.customerLabel}`,
      `- 확인할 Data: ${decision.reason || decision.judgmentMemo || '아직 정리되지 않았습니다.'}`,
      `- 기회 신호 기준: ${decision.opportunitySignal || '아직 정리되지 않았습니다.'}`,
      `- 주의 신호/부족 정보: ${[decision.riskSignal, decision.missingInfo].filter(Boolean).join(' / ') || '아직 정리되지 않았습니다.'}`,
      `- 추가 확인 질문: ${decision.nextCheck || '아직 정리되지 않았습니다.'}`,
      `- 표현·자료 안전선: ${decision.complianceNote || '실제 고객명·병원명·의료진명·제품명·내부 수치 입력 금지'}`,
      '',
    ]),
  ].join('\n');
}

function buildCustomerStrategySummary(result: V39CustomerStrategyResult) {
  const strategies = Object.values(result.strategies).filter((strategy) => strategy.strategy.trim() || strategy.memberRole.trim());
  if (strategies.length === 0) {
    return '7단계 고객군 × 팀원 실행 Map:\n- 아직 고객군별 2주 대응 방향과 팀원 연결 기준이 저장되지 않았습니다.';
  }

  return [
    '7단계 고객군 × 팀원 실행 Map:',
    ...strategies.slice(0, 6).flatMap((strategy, index) => [
      `${index + 1}. ${strategy.customerLabel}`,
      `- 대응 강도: ${strategy.priority || '아직 정리되지 않았습니다.'}`,
      `- 2주 대응 방향: ${strategy.strategy || '아직 정리되지 않았습니다.'}`,
      `- 팀원 연결 기준/후보: ${strategy.memberRole || '아직 정리되지 않았습니다.'}`,
      `- 위험·보완 조건: ${strategy.risk || '표현·자료·접촉 강도 안전선 확인'}`,
      '',
    ]),
  ].join('\n');
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

function buildCallPlanContextPrompt(
  dashboardResult: V39DashboardResult,
  customerJudgmentResult: V39CustomerJudgmentResult,
  customerStrategyResult: V39CustomerStrategyResult,
  roleResult: V39MemberRoleResult,
  peopleDialogueResult: V39PeopleDialogueResult,
) {
  const savedRoles = Object.values(roleResult.roles).filter(hasMemberRoleContext);
  const peopleDialogueSummary = buildPeopleDialogueSummary(peopleDialogueResult);

  return [
    '당신은 제약영업 팀장의 2주 실행계획 초안을 정리하는 영업기획 담당자 관점에서 봐주세요.',
    '',
    '[중요 원칙]',
    '- AI 초안은 완성본이 아닙니다. 팀장이 현장에 맞게 수정할 실행계획 초안을 만들어 주세요.',
    '- 고객을 평가하거나 등급화하지 말고, 고객 Data의 신호와 부족 정보를 기준으로 표현해 주세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 수치, 개인정보는 포함하지 마세요.',
    '- 처방 유도, 공략, 전환 가능성, 비교 우위 단정, 허가 외 표현은 피하세요.',
    '- 팀원을 세대 특성으로 단정하지 말고, 역할 기준·지원 방식·책임 범위·실행 대화 규범을 함께 반영해 주세요.',
    '',
    buildDashboardSummary(dashboardResult),
    '',
    buildCustomerJudgmentSummary(customerJudgmentResult),
    '',
    buildCustomerStrategySummary(customerStrategyResult),
    '',
    '8단계 팀원 역할 결과:',
    savedRoles.length > 0
      ? savedRoles.flatMap((role, index) => [
        `${index + 1}. ${role.memberLabel}`,
        `- 담당 고객군: ${role.assignedCustomers || '아직 정리되지 않았습니다.'}`,
        `- 역할 미션: ${role.roleMission || '아직 정리되지 않았습니다.'}`,
        `- 팀장 지원 포인트/점검 질문: ${role.coachingFocus || '아직 정리되지 않았습니다.'}`,
        `- 리스크 안전선: ${role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}`,
        `- 콜플랜 준비물: ${role.callPlanPrep || '방문 전 확인 질문과 사용 가능한 자료 범위 확인'}`,
        '',
      ]).join('\n')
      : '- 아직 8단계 팀원 역할 결과가 저장되지 않았습니다.',
    '',
    '9단계 실행 대화 요약:',
    peopleDialogueSummary,
    '',
    '[요청]',
    '1. 위 내용을 바탕으로 2주 실행계획 초안을 작성해 주세요.',
    '2. 팀 회의 설명 문장 3개를 제안해 주세요.',
    '3. 팀원별 실행 요청 문장을 제안하되, 지시가 아니라 역할 기준·지원 방식·확인 질문이 포함된 실행 대화 문장으로 작성해 주세요.',
    '4. 고객군별로 확인할 Data, 2주 대응 방향, 부족 정보, 다음 확인 질문을 정리해 주세요.',
    '5. 팀원 실행 대화 포인트와 중간 점검 방식을 제안해 주세요.',
    '6. 컴플라이언스 점검이 필요한 위험 표현 후보를 별도로 표시해 주세요.',
    '',
    '[출력 형식]',
    'A. 2주 실행계획 요약',
    'B. 팀 회의 설명 문장',
    'C. 고객군별 실행 방향',
    'D. 팀원별 실행 요청 문장',
    'E. 중간 점검 질문',
    'F. 리스크·컴플라이언스 점검 후보',
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
  dashboardResult,
  customerJudgmentResult,
  customerStrategyResult,
  roleResult,
  peopleDialogueResult,
  onRefreshDashboard,
  onRefreshCustomerJudgment,
  onRefreshCustomerStrategy,
  onRefreshRole,
  onRefreshPeopleDialogue,
}: {
  dashboardResult: V39DashboardResult;
  customerJudgmentResult: V39CustomerJudgmentResult;
  customerStrategyResult: V39CustomerStrategyResult;
  roleResult: V39MemberRoleResult;
  peopleDialogueResult: V39PeopleDialogueResult;
  onRefreshDashboard: () => void;
  onRefreshCustomerJudgment: () => void;
  onRefreshCustomerStrategy: () => void;
  onRefreshRole: () => void;
  onRefreshPeopleDialogue: () => void;
}) {
  const savedRoles = Object.values(roleResult.roles).filter(hasMemberRoleContext);
  const savedCustomerStrategies = Object.values(customerStrategyResult.strategies).filter((strategy) => strategy.strategy.trim() || strategy.memberRole.trim());
  const [copied, setCopied] = useState(false);
  const [callPlanItems, setCallPlanItems] = useState<Record<string, V39AiCallPlanResultItem>>(buildInitialCallPlanSaveState);
  const callPlanContextPrompt = useMemo(() => buildCallPlanContextPrompt(dashboardResult, customerJudgmentResult, customerStrategyResult, roleResult, peopleDialogueResult), [dashboardResult, customerJudgmentResult, customerStrategyResult, roleResult, peopleDialogueResult]);
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
      callPlanDraft: currentCallPlan.callPlanDraft || '5단계 관리 지표, 6단계 고객 Data 확인 List, 7단계 고객군 × 팀원 실행 Map, 8단계 역할 보완, 9단계 실행 대화를 종합해 2주 실행계획 초안을 정리한다.',
      riskMemo: currentCallPlan.riskMemo || '처방 유도 표현, 비교 우위 단정, 허가 외 표현, 실제 고객·병원·의료진·처방 정보 포함 여부, 고객을 등급화하는 표현, 팀원에게 부담을 전가하는 표현을 점검한다.',
      cleanupFocus: currentCallPlan.cleanupFocus || '11단계에서 승인자료 범위, 질문 중심 표현, 가상 고객군 기준, 팀원 실행 대화 기준으로 문장을 안전하게 수정한다.',
    });
  };

  return (
    <section className="rounded-3xl border border-sky-100 bg-sky-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">AI Execution Prompt Preparation</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">AI에 붙여넣을 실행계획 프롬프트 준비하기</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            5단계 관리 지표부터 9단계 실행 대화까지의 산출물을 하나의 맥락으로 묶습니다.
            AI에게 답을 맡기는 단계가 아니라, 팀장이 정리한 판단을 실행계획 초안으로 빠르게 펼쳐보고 다음 단계에서 안전하게 고치기 위한 준비 단계입니다.
          </p>
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-sky-700">이 단계에서 하는 일</p>
              <p className="mt-1">AI에 붙여넣을 실행계획 프롬프트와 점검 대상 초안을 준비합니다.</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-sky-700">이전 단계에서 가져온 것</p>
              <p className="mt-1">5단계 관리 지표, 6단계 고객 Data 확인 List, 7단계 실행 Map, 8단계 팀원 역할, 9단계 실행 대화입니다.</p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-sky-700">다음 단계로 넘길 것</p>
              <p className="mt-1">11단계에서 위험 표현을 제거할 AI 실행계획 초안입니다.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefreshDashboard}>5단계 다시 불러오기</button>
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefreshCustomerJudgment}>6단계 다시 불러오기</button>
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefreshCustomerStrategy}>7단계 다시 불러오기</button>
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefreshRole}>8단계 다시 불러오기</button>
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefreshPeopleDialogue}>9단계 저장 결과 다시 불러오기</button>
          <button type="button" className="rounded-full bg-sky-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-sky-800" onClick={copyPrompt}>{copied ? '프롬프트 복사 완료' : 'AI에 붙여넣을 실행계획 프롬프트 복사'}</button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">5단계 관리 지표</p><p className="mt-1 text-sm font-black text-slate-900">{dashboardResult.metricSelection.selectedCoreMetricIds.length}개</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">6단계 확인 List</p><p className="mt-1 text-sm font-black text-slate-900">{Object.keys(customerJudgmentResult.decisions).length}건</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">7단계 실행 Map</p><p className="mt-1 text-sm font-black text-slate-900">{savedCustomerStrategies.length}건</p></div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">8단계 역할 결과</p><p className="mt-1 text-sm font-black text-slate-900">{savedRoles.length}개</p>{roleResult.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{roleResult.updatedAt}</p> : null}</div>
        <div className="rounded-2xl bg-white p-4 shadow-sm"><p className="text-xs font-black text-slate-500">9단계 실행 대화</p><p className="mt-1 text-sm font-black text-slate-900">{peopleDialogueCompleted ? '불러옴' : '아직 없음'}</p><p className="mt-1 text-[11px] font-bold leading-4 text-slate-500">{peopleDialogueCompleted ? '대화 목적과 첫마디가 반영됩니다.' : '9단계 저장 후 다시 불러오세요.'}</p></div>
      </div>

      <div className="mt-3 rounded-2xl border border-sky-200 bg-white px-4 py-3 text-xs font-bold leading-5 text-sky-950">
        <p className="font-black">8단계 역할 미션 없이도 지원 포인트와 안전선을 반영합니다</p>
        <p className="mt-1">역할 미션을 아직 비워 두었더라도 담당 고객군, 콜플랜 준비물, 팀장 지원 포인트, 리스크 안전선 중 하나라도 저장되어 있으면 10단계 프롬프트 입력 맥락으로 가져옵니다.</p>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        <article className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-1">
          <p className="text-sm font-black text-slate-950">5단계 관리 지표 요약</p>
          <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs font-bold leading-6 text-slate-700">{buildDashboardSummary(dashboardResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-1">
          <p className="text-sm font-black text-slate-950">6단계 고객 Data 확인 List 요약</p>
          <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs font-bold leading-6 text-slate-700">{buildCustomerJudgmentSummary(customerJudgmentResult)}</pre>
        </article>
        <article className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-1">
          <p className="text-sm font-black text-slate-950">7단계 고객군 × 팀원 실행 Map 요약</p>
          <pre className="mt-3 max-h-60 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-xs font-bold leading-6 text-slate-700">{buildCustomerStrategySummary(customerStrategyResult)}</pre>
        </article>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        {savedRoles.length === 0 ? (
          <div className="rounded-2xl bg-white p-4 text-sm font-bold text-slate-600 xl:col-span-2">8단계에서 팀원별 역할 미션, 지원 포인트, 콜플랜 준비물, 리스크 안전선 중 하나라도 정리하면, 이곳에 AI 실행계획 프롬프트 입력 맥락이 표시됩니다.</div>
        ) : savedRoles.slice(0, 6).map((role) => (
          <article key={role.memberRoleId} className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="font-black text-slate-950">{role.memberLabel}</p>
            <p className="mt-2 text-xs font-black text-sky-700">담당 고객군</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.assignedCustomers || '아직 정리되지 않았습니다.'}</p>
            <p className="mt-2 text-xs font-black text-slate-500">역할 미션</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.roleMission || '아직 정리되지 않았습니다.'}</p>
            <p className="mt-2 text-xs font-black text-slate-500">콜플랜 준비물</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.callPlanPrep || '방문 전 확인 질문과 사용 가능한 자료 범위 확인'}</p>
            <p className="mt-2 text-xs font-black text-amber-700">리스크 안전선</p>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}</p>
          </article>
        ))}
      </div>

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
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI가 만든 문장을 그대로 쓰지 않고, 다음 단계에서 컴플라이언스 위험 표현과 팀원 실행 대화 위험을 함께 점검하기 위한 대상으로 정리합니다.</p>
          </div>
          <button type="button" className="rounded-2xl border bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-800" onClick={applyCallPlanDraft}>저장된 맥락으로 실행계획 초안 채우기</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="space-y-1 md:col-span-3"><span className="text-xs font-black text-slate-500">[필수] AI 실행계획 초안</span><textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={currentCallPlan.callPlanDraft} onChange={(event) => updateCallPlanItem({ callPlanDraft: event.target.value })} /></label>
          <label className="space-y-1"><span className="text-xs font-black text-slate-500">[선택] 위험 메모</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={currentCallPlan.riskMemo} onChange={(event) => updateCallPlanItem({ riskMemo: event.target.value })} /></label>
          <label className="space-y-1 md:col-span-2"><span className="text-xs font-black text-slate-500">[필수] 다음 단계 점검 초점</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={currentCallPlan.cleanupFocus} onChange={(event) => updateCallPlanItem({ cleanupFocus: event.target.value })} /></label>
        </div>
        <div className="mt-3 rounded-2xl bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-900">입력 내용은 자동으로 저장됩니다. 11단계에서 이 실행계획 초안을 불러와 위험 표현을 제거합니다.</div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        10단계에서도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI에게 요청할 때도 교육용 가상 고객군, 팀원 역할, 실행 대화 맥락만 사용합니다.
      </div>
    </section>
  );
}

export function V39AiCallPlanLab() {
  const [dashboardResult, setDashboardResult] = useState(() => loadV39DashboardResult());
  const [customerJudgmentResult, setCustomerJudgmentResult] = useState(() => loadV39CustomerJudgmentResult());
  const [customerStrategyResult, setCustomerStrategyResult] = useState(() => loadV39CustomerStrategyResult());
  const [memberRoleResult, setMemberRoleResult] = useState(() => loadV39MemberRoleResult());
  const [peopleDialogueResult, setPeopleDialogueResult] = useState(() => loadV39PeopleDialogueResult());

  return (
    <V39MemberRoleCallPlanPanel
      dashboardResult={dashboardResult}
      customerJudgmentResult={customerJudgmentResult}
      customerStrategyResult={customerStrategyResult}
      roleResult={memberRoleResult}
      peopleDialogueResult={peopleDialogueResult}
      onRefreshDashboard={() => setDashboardResult(loadV39DashboardResult())}
      onRefreshCustomerJudgment={() => setCustomerJudgmentResult(loadV39CustomerJudgmentResult())}
      onRefreshCustomerStrategy={() => setCustomerStrategyResult(loadV39CustomerStrategyResult())}
      onRefreshRole={() => setMemberRoleResult(loadV39MemberRoleResult())}
      onRefreshPeopleDialogue={() => setPeopleDialogueResult(loadV39PeopleDialogueResult())}
    />
  );
}
