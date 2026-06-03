import { useMemo, useState } from 'react';
import { V38MemberRoleLab } from './journey-v38-member-role-lab';
import { loadV39DashboardResult, type V39DashboardResult } from './journey-v39-dashboard-result-store';
import {
  type V39CustomerStrategyResult,
  loadV39CustomerStrategyResult,
} from './journey-v39-customer-strategy-result-store';

function joinOrEmpty(items: string[]) {
  return items.length > 0 ? items.join(' / ') : '아직 저장된 값이 없습니다';
}

type RoleRecommendationDraft = {
  memberId: string;
  roleCandidate: string;
  coachingFocus: string;
  caution: string;
};

type StrategyRoleHint = {
  memberRole: string;
  customerLabels: string[];
  priorities: string[];
  strategyCount: number;
  risks: string[];
};

function readableMemberLabel(memberId: string) {
  const labels: Record<string, string> = {
    'kim-jaeho': '김재호 차장',
    'kim-moonho': '김문호 차장',
    'yoo-heegwan': '유희관 과장',
    'lee-daeun': '이대은 대리',
    'shin-jaeyoung': '신재영 대리',
    'park-jaeuk': '박재욱 사원',
    'moon-gyowon': '문교원 사원',
  };
  return labels[memberId] ?? memberId;
}

function buildRoleRecommendationDrafts(result: V39DashboardResult): RoleRecommendationDraft[] {
  const selectedMembers = result.memberResult.selectedMemberTypeIds.slice(0, 2);
  const coreMetrics = result.metricSelection.selectedCoreMetricIds;
  const supportMetrics = result.metricSelection.selectedSupportMetricIds;
  const safetyMetrics = result.metricSelection.selectedSafetyMetricIds;
  const signalText = result.memberResult.rawAiSignalResult;
  const finalPrep = result.memberResult.rawAiPrepResult;

  if (selectedMembers.length === 0) return [];

  return selectedMembers.map((memberId) => {
    const label = readableMemberLabel(memberId);
    const roleCandidate = coreMetrics.length > 0
      ? `${label}에게 ${coreMetrics[0]}을 중심으로 고객 후속 행동을 구체화하는 역할을 맡기는 초안입니다.`
      : `${label}에게 2주 실행 과정에서 고객 반응을 관찰하고 다음 행동을 정리하는 역할을 맡기는 초안입니다.`;
    const coachingFocus = supportMetrics.length > 0
      ? `${supportMetrics[0]}을 기준으로 실행 전후의 차이를 짧게 점검하고, 필요한 지원을 1on1에서 확인합니다.`
      : signalText
        ? '5단계에서 저장한 선택 유형 신호를 바탕으로 관찰 가능한 행동과 확인 질문을 함께 정리합니다.'
        : '팀원이 역할을 이해했는지, 다음 행동을 자기 언어로 설명할 수 있는지 확인합니다.';
    const caution = safetyMetrics.length > 0
      ? `${safetyMetrics[0]}을 놓치지 않도록 표현, 자료 활용, 보고 기준을 함께 확인합니다.`
      : finalPrep
        ? 'AI가 제안한 준비물은 초안이므로 실제 팀원에게 맞게 문장과 실행 단위를 조정합니다.'
        : '역할 추천은 자동 배정이 아니라 팀장 판단을 돕는 초안입니다. 팀원 성향을 단정하지 않습니다.';

    return {
      memberId,
      roleCandidate,
      coachingFocus,
      caution,
    };
  });
}

function buildStrategyRoleHints(strategyResult: V39CustomerStrategyResult): StrategyRoleHint[] {
  const hintsByRole = new Map<string, StrategyRoleHint>();

  for (const strategy of Object.values(strategyResult.strategies)) {
    if (!strategy.memberRole || !strategy.strategy.trim()) continue;
    const current = hintsByRole.get(strategy.memberRole) ?? {
      memberRole: strategy.memberRole,
      customerLabels: [],
      priorities: [],
      strategyCount: 0,
      risks: [],
    };

    current.customerLabels.push(strategy.customerLabel);
    if (strategy.priority && !current.priorities.includes(strategy.priority)) current.priorities.push(strategy.priority);
    if (strategy.risk && current.risks.length < 2) current.risks.push(strategy.risk);
    current.strategyCount += 1;
    hintsByRole.set(strategy.memberRole, current);
  }

  return Array.from(hintsByRole.values()).slice(0, 6);
}

function V39CustomerStrategyBridgePanel({ strategyResult, onRefresh }: { strategyResult: V39CustomerStrategyResult; onRefresh: () => void }) {
  const savedStrategies = Object.values(strategyResult.strategies).filter((strategy) => strategy.strategy.trim());
  const roleHints = buildStrategyRoleHints(strategyResult);

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Customer Strategy Bridge</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">7단계 고객 대응 전략을 팀원 역할 배정에 연결</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            7단계에서 저장한 고객 유형별 우선순위, 2주 대응 전략, 팀원 배정 방향, 리스크를 8단계 역할 배정 전에 다시 확인합니다.
            이 연결은 자동 배정이 아니라 팀장이 실행 책임과 코칭 초점을 정교화하기 위한 참고 자료입니다.
          </p>
        </div>
        <button
          type="button"
          className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-emerald-800"
          onClick={onRefresh}
        >
          7단계 전략 결과 새로고침
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{strategyResult.updatedAt ? '저장 결과 있음' : '저장 결과 없음'}</p>
          {strategyResult.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{strategyResult.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장된 고객 전략</p>
          <p className="mt-1 text-sm font-black text-slate-900">{savedStrategies.length}개</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">팀원 배정 방향</p>
          <p className="mt-1 text-sm font-black text-slate-900">{roleHints.length > 0 ? `${roleHints.length}개 방향` : '아직 저장된 방향 없음'}</p>
        </div>
      </div>

      {savedStrategies.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          7단계에서 고객 유형별 2주 대응 전략을 저장하면, 이곳에 팀원 역할 배정 참고 자료가 표시됩니다.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {savedStrategies.slice(0, 6).map((strategy) => (
            <article key={strategy.customerTypeId} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-black text-slate-950">{strategy.customerLabel}</p>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-900">{strategy.priority || '우선순위 미정'}</span>
              </div>
              <p className="mt-2 text-xs font-black text-emerald-700">팀원 배정 방향</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{strategy.memberRole || '아직 선택되지 않았습니다.'}</p>
              <p className="mt-2 text-xs font-black text-slate-500">2주 대응 전략</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{strategy.strategy}</p>
              <p className="mt-2 text-xs font-black text-amber-700">주의 리스크</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{strategy.risk || '표현·자료·접촉 강도 안전선을 확인하세요.'}</p>
            </article>
          ))}
        </div>
      )}

      {roleHints.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-black text-slate-950">팀원 역할 배정 참고 초안</h3>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">아래 내용은 자동 배정이 아니라, 7단계 고객 전략에서 반복적으로 등장한 팀원 배정 방향을 묶은 참고 자료입니다.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {roleHints.map((hint) => (
              <article key={hint.memberRole} className="rounded-2xl border bg-emerald-50 p-4">
                <p className="text-sm font-black text-slate-950">{hint.memberRole}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-700">연결 고객 유형: {hint.customerLabels.join(' · ')}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-700">우선순위: {hint.priorities.length > 0 ? hint.priorities.join(' · ') : '미정'}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-amber-900">주의 리스크: {hint.risks.length > 0 ? hint.risks.join(' / ') : '표현·자료·접촉 강도 안전선 확인'}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function V39MemberRoleLab() {
  const [dashboardResult, setDashboardResult] = useState(() => loadV39DashboardResult());
  const [customerStrategyResult, setCustomerStrategyResult] = useState(() => loadV39CustomerStrategyResult());

  const summary = useMemo(() => {
    const selectedMetricCount =
      dashboardResult.metricSelection.selectedCoreMetricIds.length +
      dashboardResult.metricSelection.selectedSupportMetricIds.length +
      dashboardResult.metricSelection.selectedSafetyMetricIds.length;

    return {
      teamSituationCount: dashboardResult.teamSituations.length,
      selectedMetricCount,
      selectedMemberCount: dashboardResult.memberResult.selectedMemberTypeIds.length,
      coreMetrics: joinOrEmpty(dashboardResult.metricSelection.selectedCoreMetricIds),
      supportMetrics: joinOrEmpty(dashboardResult.metricSelection.selectedSupportMetricIds),
      safetyMetrics: joinOrEmpty(dashboardResult.metricSelection.selectedSafetyMetricIds),
      selectedMembers: joinOrEmpty(dashboardResult.memberResult.selectedMemberTypeIds.map(readableMemberLabel)),
      memberSignal: dashboardResult.memberResult.rawAiSignalResult || '아직 저장된 신호 요약이 없습니다',
      finalPrep: dashboardResult.memberResult.rawAiPrepResult || '아직 저장된 다음 행동 준비물이 없습니다',
      hasSavedResult: Boolean(dashboardResult.updatedAt),
    };
  }, [dashboardResult]);

  const roleRecommendationDrafts = useMemo(() => buildRoleRecommendationDrafts(dashboardResult), [dashboardResult]);

  const refreshDashboardResult = () => {
    setDashboardResult(loadV39DashboardResult());
  };

  const refreshCustomerStrategyResult = () => {
    setCustomerStrategyResult(loadV39CustomerStrategyResult());
  };

  return (
    <div className="space-y-4">
      <V39CustomerStrategyBridgePanel strategyResult={customerStrategyResult} onRefresh={refreshCustomerStrategyResult} />

      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">Step 5 → Step 8 Bridge</p>
            <h2 className="mt-2 text-xl font-black text-slate-950">5단계 저장 결과를 팀원 역할 방향에 연결</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              이 패널은 5단계에서 저장한 팀 상황, 실행지표, 선택 유형, 다음 행동 준비물을 8단계 역할 배정 전에 다시 보여줍니다.
              자동 배정이 아니라, 팀장이 역할 방향을 정하기 전에 판단 근거와 수정 가능한 추천 초안을 확인하도록 돕습니다.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full bg-violet-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-violet-800"
            onClick={refreshDashboardResult}
          >
            5단계 저장 결과 새로고침
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">저장 상태</p>
            <p className="mt-1 text-sm font-black text-slate-900">{summary.hasSavedResult ? '저장 결과 있음' : '저장 결과 없음'}</p>
            {dashboardResult.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{dashboardResult.updatedAt}</p> : null}
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">상황·지표·유형</p>
            <p className="mt-1 text-sm font-black text-slate-900">상황 {summary.teamSituationCount}개 · 지표 {summary.selectedMetricCount}개 · 유형 {summary.selectedMemberCount}명</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">선택 유형</p>
            <p className="mt-1 text-sm font-black text-slate-900">{summary.selectedMembers}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">핵심 지표</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{summary.coreMetrics}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">보완 지표</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{summary.supportMetrics}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">안전선 지표</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{summary.safetyMetrics}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-slate-500">지표 선택 이유</p>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{dashboardResult.metricSelection.metricRationale || '아직 저장된 이유가 없습니다'}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-black text-slate-500">선택 유형 신호 요약</p>
            <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{summary.memberSignal}</p>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-black text-slate-500">최종 다음 행동 준비물</p>
            <p className="mt-1 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{summary.finalPrep}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">역할 추천 초안</p>
            <h3 className="text-lg font-black text-slate-950">저장 결과 기반 역할 추천 초안</h3>
            <p className="text-xs font-bold leading-5 text-slate-600">추천은 자동 배정이 아니라 팀장 판단을 돕는 초안입니다. 아래 역할 후보, 코칭 초점, 주의할 점을 실제 팀원 맥락에 맞게 수정하십시오.</p>
          </div>
          {roleRecommendationDrafts.length === 0 ? (
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">5단계에서 선택 유형 ID를 저장하면 역할 추천 초안이 표시됩니다.</div>
          ) : (
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {roleRecommendationDrafts.map((draft) => (
                <div key={draft.memberId} className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                  <h4 className="text-sm font-black text-slate-950">{readableMemberLabel(draft.memberId)}</h4>
                  <div className="mt-3 space-y-2 text-sm font-bold leading-6 text-slate-700">
                    <p><span className="font-black text-violet-800">역할 후보: </span>{draft.roleCandidate}</p>
                    <p><span className="font-black text-violet-800">코칭 초점: </span>{draft.coachingFocus}</p>
                    <p><span className="font-black text-violet-800">주의할 점: </span>{draft.caution}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <V38MemberRoleLab />
    </div>
  );
}
