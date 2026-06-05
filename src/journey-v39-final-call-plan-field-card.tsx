import { useState } from 'react';
import { loadV39AiCallPlanResult } from './journey-v39-ai-call-plan-result-store';
import { loadV39ComplianceCleanupResult } from './journey-v39-compliance-cleanup-result-store';
import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { loadV39DashboardResult } from './journey-v39-dashboard-result-store';
import {
  type V39FinalCallPlanResult,
  loadV39FinalCallPlanResult,
  saveV39FinalCallPlanResult,
} from './journey-v39-final-call-plan-result-store';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import { loadV39PeopleDialogueResult } from './journey-v39-people-dialogue-result-store';

const V39_FINAL_CALL_PLAN_FIELD_CARD_SMOKE_MARKERS = [
  'V39FinalCallPlanFieldCard',
  '2주 실행 메모를 완성합니다',
  '교육장에서 끝나는 카드가 아니라 다음 주 회의에서 펼쳐볼 메모입니다',
  '함께 이야기할 질문 준비',
].join('|');
void V39_FINAL_CALL_PLAN_FIELD_CARD_SMOKE_MARKERS;

function textOrEmpty(value: string) {
  return value.trim();
}

function joinNonEmpty(items: string[], fallback = '아직 정리되지 않았습니다.') {
  const filtered = items.map((item) => item.trim()).filter(Boolean);
  return filtered.length > 0 ? filtered.join('\n') : fallback;
}

function makeDefaultCard(): Partial<V39FinalCallPlanResult> {
  const dashboard = loadV39DashboardResult();
  const customerJudgment = loadV39CustomerJudgmentResult();
  const customerStrategy = loadV39CustomerStrategyResult();
  const memberRole = loadV39MemberRoleResult();
  const peopleDialogue = loadV39PeopleDialogueResult();
  const aiCallPlan = loadV39AiCallPlanResult();
  const cleanup = loadV39ComplianceCleanupResult();

  const strategies = Object.values(customerStrategy.strategies).filter((item) => item.strategy.trim() || item.risk.trim() || item.memberRole.trim());
  const roles = Object.values(memberRole.roles).filter((role) => role.assignedCustomers.trim() || role.roleMission.trim() || role.coachingFocus.trim() || role.riskGuardrail.trim() || role.callPlanPrep.trim());
  const questions = Object.values(customerJudgment.decisions).map((item) => item.nextCheck).filter(Boolean).slice(0, 3);
  const aiDraft = Object.values(aiCallPlan.items).find((item) => item.callPlanDraft.trim());

  return {
    focusCustomers: strategies.length > 0
      ? strategies.slice(0, 3).map((item) => `${item.customerLabel}: ${item.strategy || item.priority || '2주 동안 다시 확인합니다.'}`).join('\n')
      : '기록에서 반응이 보였지만 아직 더 확인해야 할 고객군을 우선 봅니다. 정보가 부족한 고객군은 설득보다 확인 질문부터 준비합니다.',
    memberRoles: roles.length > 0
      ? roles.slice(0, 6).map((role) => [
        `${role.memberLabel}`,
        `- 함께 볼 고객군/조건: ${role.assignedCustomers || '아직 정리되지 않았습니다.'}`,
        `- 맡길 일: ${role.roleMission || '아직 정리되지 않았습니다.'}`,
        `- 팀장이 도울 것: ${role.coachingFocus || role.callPlanPrep || '아직 정리되지 않았습니다.'}`,
        `- 조심할 표현: ${role.riskGuardrail || '말해도 되는 선과 자료 범위를 먼저 확인합니다.'}`,
      ].join('\n')).join('\n\n')
      : '팀원별 역할은 고객군 특성, 팀원 강점, 부담이 몰릴 가능성, 팀장이 도와야 할 부분을 함께 보고 정합니다.',
    twoWeekAction: joinNonEmpty([
      `이번에 볼 지표: ${dashboard.metricSelection.selectedCoreMetricIds.join(' · ')}`,
      aiDraft?.callPlanDraft || '1주차에는 고객군별 확인 질문과 사용 가능한 자료 범위를 정리합니다. 2주차에는 후속 반응, 방문·면담 기록, 팀원 실행 대화 결과를 함께 봅니다.',
      questions.length > 0 ? `팀원에게 더 물어볼 질문: ${questions.join(' / ')}` : '',
    ]),
    compliancePoint: cleanup.finalChecklist || cleanup.safeExpression || '실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 넣지 않습니다. 처방을 유도하거나 비교 우위를 단정하거나 허가된 범위를 넘는 표현은 쓰지 않습니다.',
    firstMessage: peopleDialogue.dialogueCard.openingLine || peopleDialogue.purposeFitOpening || '이번 2주는 많이 방문하는 것보다 고객 반응을 정확히 보고, 역할 기준과 말해도 되는 선을 함께 맞추는 데 집중해 봅시다.',
    discussionMemo: cleanup.finalCardMemo || '교육장에서는 왜 이 고객군을 먼저 봤는지, 팀원 역할이 한쪽으로 몰리지는 않았는지, 어떤 표현을 더 안전하게 고쳤는지 함께 이야기합니다.',
  };
}

function buildCopyText(result: V39FinalCallPlanResult) {
  return [
    '[2주 실행 메모]',
    '',
    '[먼저 볼 고객군/조건]',
    result.focusCustomers || '미작성',
    '',
    '[팀원별 역할과 지원]',
    result.memberRoles || '미작성',
    '',
    '[이번 2주에 할 일]',
    result.twoWeekAction || '미작성',
    '',
    '[말해도 되는 선]',
    result.compliancePoint || '미작성',
    '',
    '[팀원에게 꺼낼 첫 문장]',
    result.firstMessage || '미작성',
    '',
    '[함께 이야기할 질문 메모]',
    result.discussionMemo || '미작성',
  ].join('\n');
}

export function V39FinalCallPlanFieldCard() {
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(() => loadV39FinalCallPlanResult());

  const savePatch = (patch: Partial<V39FinalCallPlanResult>) => {
    setResult((current) => {
      const next = { ...current, ...patch };
      saveV39FinalCallPlanResult(next);
      return next;
    });
  };

  const fillFromSavedSteps = () => {
    savePatch(makeDefaultCard());
  };

  const copyMemo = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText(result));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const filledCount = [
    result.focusCustomers,
    result.memberRoles,
    result.twoWeekAction,
    result.compliancePoint,
    result.firstMessage,
    result.discussionMemo,
  ].filter((value) => value.trim()).length;

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">12단계 · 2주 실행 메모</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">2주 실행 메모를 완성합니다</h2>
          <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-700">
            교육장에서 끝나는 카드가 아니라 다음 주 회의와 1on1에서 펼쳐볼 메모입니다. 고객에게 무엇을 더 확인할지, 팀원에게 무엇을 맡길지, 어떤 말로 시작할지, 어디까지 말해도 되는지를 짧게 남깁니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={fillFromSavedSteps}>
            앞에서 저장한 내용으로 채우기
          </button>
          <button type="button" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-emerald-800" onClick={copyMemo}>
            {copied ? '2주 실행 메모 복사 완료' : '2주 실행 메모 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
          <p className="font-black text-emerald-700">지금 할 일</p>
          <p className="mt-1">앞에서 남긴 기록을 팀 회의와 1on1에서 쓸 수 있는 말로 줄입니다.</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
          <p className="font-black text-emerald-700">앞에서 가져온 것</p>
          <p className="mt-1">관리 지표, 고객 활동 기록의 단서, 2주 행동 방향, 팀원 역할, 첫 문장, 말해도 되는 선입니다.</p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
          <p className="font-black text-emerald-700">다음 화면에서 쓸 것</p>
          <p className="mt-1">왜 이렇게 판단했는지, 어디가 막힐 수 있는지, 함께 물어볼 질문입니다.</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
        <p className="font-black">현재 작성된 항목: {filledCount} / 6</p>
        <p className="mt-1">완벽하게 쓰는 것보다, 현장에서 다시 펼쳐볼 수 있을 만큼 짧고 분명하게 남기는 것이 중요합니다.</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-black text-slate-600">[필수] 먼저 볼 고객군 또는 조건</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.focusCustomers} onChange={(event) => savePatch({ focusCustomers: event.target.value })} placeholder="예: 반응은 있었지만 다음 만남 이유가 아직 약한 고객군은 자료 요청 목적을 먼저 확인한다." />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-black text-slate-600">[필수] 팀원별 역할과 팀장이 도울 것</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.memberRoles} onChange={(event) => savePatch({ memberRoles: event.target.value })} placeholder="예: 김민재 프로는 다음 접점 고객군을 맡되, 방문 전 질문과 사용 가능한 자료 범위를 팀장이 함께 점검한다." />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-black text-slate-600">[필수] 이번 2주에 실제로 할 일</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.twoWeekAction} onChange={(event) => savePatch({ twoWeekAction: event.target.value })} placeholder="예: 1주차에는 확인 질문과 자료 범위를 정리하고, 2주차에는 후속 반응과 팀원 실행 대화 결과를 같이 본다." />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-black text-slate-600">[필수] 말해도 되는 선</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.compliancePoint} onChange={(event) => savePatch({ compliancePoint: event.target.value })} placeholder="예: 실제 고객명, 병원명, 제품명, 내부 수치는 쓰지 않는다. 처방 유도나 비교 우위 단정처럼 들리는 표현은 빼고 말한다." />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-black text-slate-600">[필수] 팀원에게 꺼낼 첫 문장</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.firstMessage} onChange={(event) => savePatch({ firstMessage: event.target.value })} placeholder="예: 이번 2주는 방문 숫자를 늘리는 것보다 고객 반응을 정확히 보고, 우리가 말해도 되는 선 안에서 다음 접점을 만드는 데 집중해 봅시다." />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-black text-slate-600">[선택] 함께 이야기할 질문 메모</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.discussionMemo} onChange={(event) => savePatch({ discussionMemo: event.target.value })} placeholder="예: 왜 이 고객군을 먼저 봤는지, 특정 팀원에게 일이 몰리지는 않았는지, 어떤 표현을 더 안전하게 고쳤는지 토의한다." />
        </label>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
        최종 메모에도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다. AI가 쓴 문장도 팀장이 현장에서 책임질 수 있는 말로 고쳐 적습니다.
      </div>
    </section>
  );
}
