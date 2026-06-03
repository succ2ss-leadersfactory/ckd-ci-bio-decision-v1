import { useState } from 'react';
import { V38FinalCallPlanCard } from './journey-v38-final-call-plan-card';
import {
  type V39ComplianceCleanupResult,
  loadV39ComplianceCleanupResult,
} from './journey-v39-compliance-cleanup-result-store';
import {
  type V39FinalCallPlanResult,
  loadV39FinalCallPlanResult,
  saveV39FinalCallPlanResult,
} from './journey-v39-final-call-plan-result-store';

function buildFinalCardSummary(result: V39ComplianceCleanupResult) {
  if (!result.updatedAt) {
    return '아직 10단계 컴플라이언스 정리 결과가 저장되지 않았습니다. 10단계에서 안전 문장과 최종 체크포인트를 먼저 저장하세요.';
  }

  return [
    '[10단계 컴플라이언스 정리 결과]',
    '',
    '[위험 유형 요약]',
    result.riskTypes || '아직 작성되지 않았습니다.',
    '',
    '[안전하게 수정한 문장]',
    result.safeExpression || '아직 작성되지 않았습니다.',
    '',
    '[최종 체크리스트]',
    result.finalChecklist || '아직 작성되지 않았습니다.',
    '',
    '[최종 카드 메모]',
    result.finalCardMemo || '아직 작성되지 않았습니다.',
  ].join('\n');
}

function buildDefaultFinalCallPlanResult(cleanup: V39ComplianceCleanupResult, current: V39FinalCallPlanResult): Partial<V39FinalCallPlanResult> {
  return {
    focusCustomers: current.focusCustomers || '기회 신호와 실행 가능성이 함께 확인된 고객군을 우선 검토합니다.',
    memberRoles: current.memberRoles || '팀원별 역할은 고객군 특성, 실행 강점, 코칭 필요점을 기준으로 조정합니다.',
    twoWeekAction: current.twoWeekAction || '1주차에는 확인 질문과 사용 가능한 자료 범위를 정리하고, 2주차에는 후속 반응과 실행 기록을 점검합니다.',
    compliancePoint: current.compliancePoint || cleanup.finalChecklist || '실제 고객명·병원명·의료진명·제품명·매출·처방 수치 입력을 금지하고, 처방 유도·비교 우위 단정·허가 외 표현을 제거합니다.',
    firstMessage: current.firstMessage || '이번 2주는 많이 방문하는 것보다 고객군별 반응 신호를 읽고 안전한 다음 행동을 정하는 데 집중합시다.',
    discussionMemo: current.discussionMemo || cleanup.finalCardMemo || '강사용 토의에서는 AI 초안이 아니라 팀장이 어떤 기준으로 문장을 수정했는지 확인합니다.',
  };
}

function V39ComplianceFinalCardBridgePanel({ result, onRefresh }: { result: V39ComplianceCleanupResult; onRefresh: () => void }) {
  const [copied, setCopied] = useState(false);
  const [finalCardResult, setFinalCardResult] = useState(() => loadV39FinalCallPlanResult());
  const summary = buildFinalCardSummary(result);

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
    updateFinalCardResult(buildDefaultFinalCallPlanResult(result, finalCardResult));
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Final Card Bridge</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">10단계 컴플라이언스 정리 결과를 최종 실행 카드에 연결</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            10단계에서 저장한 위험 유형, 안전하게 수정한 문장, 최종 체크리스트, 카드 메모를 11단계 2주 콜플랜 카드 작성 전에 확인합니다.
            이 요약은 자동 완성 결과가 아니라, 팀장이 최종 카드에 안전한 문장만 반영하기 위한 참고 자료입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            10단계 정리 결과 새로고침
          </button>
          <button type="button" className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-emerald-800" onClick={copyFinalCardSummary}>
            {copied ? '최종 카드 요약 복사 완료' : '최종 카드 요약 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.updatedAt ? '정리 결과 있음' : '정리 결과 없음'}</p>
          {result.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{result.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">안전 문장</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.safeExpression.trim() ? '저장됨' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">12단계 연결</p>
          <p className="mt-1 text-sm font-black text-slate-900">{finalCardResult.updatedAt ? '최종 카드 요약 있음' : '최종 카드 요약 없음'}</p>
        </div>
      </div>

      {result.updatedAt ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-amber-700">위험 유형 요약</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.riskTypes || '아직 작성되지 않았습니다.'}</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-emerald-700">최종 체크리스트</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.finalChecklist || '아직 작성되지 않았습니다.'}</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-black text-emerald-700">안전하게 수정한 문장</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.safeExpression || '아직 작성되지 않았습니다.'}</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-black text-slate-500">최종 카드 메모</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.finalCardMemo || '아직 작성되지 않았습니다.'}</p>
          </article>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          10단계에서 11단계 연결용 컴플라이언스 정리 결과를 저장하면, 이곳에 최종 실행 카드 참고 자료가 표시됩니다.
        </div>
      )}

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">최종 실행 카드에 반영할 요약</span>
        <textarea className="mt-3 min-h-64 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={summary} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Instructor Discussion Bridge</p>
            <h3 className="text-lg font-black text-slate-950">12단계 연결용 최종 실행 카드 요약 저장</h3>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
              강사용 토의 화면에서 참여자의 판단 근거, 실행 우선순위, 안전 문장 수정 포인트를 확인할 수 있도록 요약을 저장합니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl border bg-cyan-50 px-4 py-2 text-xs font-black text-cyan-800" onClick={applyFinalCardDraft}>
            12단계 연결 초안 가져오기
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
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">팀원에게 말할 첫 문장</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.firstMessage} onChange={(event) => updateFinalCardResult({ firstMessage: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">강사용 토의 메모</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={finalCardResult.discussionMemo} onChange={(event) => updateFinalCardResult({ discussionMemo: event.target.value })} />
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        최종 카드에도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        위험 표현을 제거한 안전 문장과 팀장이 직접 확인한 체크포인트만 반영합니다.
      </div>
    </section>
  );
}

export function V39FinalCallPlanCard() {
  const [result, setResult] = useState(() => loadV39ComplianceCleanupResult());

  const refreshComplianceCleanupResult = () => {
    setResult(loadV39ComplianceCleanupResult());
  };

  return (
    <section className="space-y-4">
      <V39ComplianceFinalCardBridgePanel result={result} onRefresh={refreshComplianceCleanupResult} />
      <V38FinalCallPlanCard />
    </section>
  );
}
