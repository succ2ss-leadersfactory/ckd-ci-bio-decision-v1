import { useEffect, useMemo, useState } from 'react';
import {
  V38_FORBIDDEN_ITEMS as FORBIDDEN_ITEMS,
  V38_METRIC_OPTIONS as METRIC_OPTIONS,
} from './journey-v38-dashboard-analysis-data';
import { parseV38AiMetricSuggestion as parseAiMetricSuggestion } from './journey-v38-dashboard-analysis-parsers';
import { V38MetricPicker as MetricPicker, V38ReviewTextarea as ReviewTextarea } from './journey-v38-dashboard-analysis-ui';
import {
  createEmptyV39DashboardResult,
  saveV39DashboardResult,
} from './journey-v39-dashboard-result-store';

const V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS = 'V38DashboardAnalysisLab';
void V39_DASHBOARD_ANALYSIS_SMOKE_MARKERS;

const TEAM_SITUATION_OPTIONS = [
  '방문은 했는데, 다음 행동으로 이어지지 않는다',
  '관심 보이는 고객은 있는데, 어디부터 챙길지 헷갈린다',
  '팀원마다 움직이는 속도와 방식이 다르다',
  '늘 가던 고객만 챙기고, 새로 봐야 할 고객은 놓친다',
  '자료 설명은 했지만, 고객이 원하는 건 충분히 못 물었다',
];

const MAX_TEAM_SITUATIONS = 2;

function metricNames(ids: string[]) {
  return ids.map((id) => METRIC_OPTIONS.find((item) => item.id === id)?.name ?? id);
}

function buildV39MetricPrompt(teamSituations: string[], customSituation: string) {
  const situationLines = [
    ...teamSituations.map((item) => `- ${item}`),
    ...(customSituation.trim() ? [`- 우리 팀 추가 상황: ${customSituation.trim()}`] : []),
  ];

  return [
    '당신은 제약영업 팀장의 실행 판단을 돕는 리더십 코치입니다.',
    '이 실습은 정답을 찾는 것이 아니라, 팀장이 이번 2주 동안 무엇을 보고 어떻게 판단할지 연습하는 과정입니다.',
    '',
    '우리 팀 상황:',
    ...(situationLines.length > 0 ? situationLines : ['- 아직 선택하지 않았습니다.']),
    '',
    '아래 4가지만 현실적인 말로 짧게 정리해 주세요.',
    '',
    '## 1. 이번 2주에 꼭 볼 지표',
    '- 팀장이 가장 먼저 확인할 지표 1~2개',
    '- 왜 이 지표를 봐야 하는지 한 문장',
    '',
    '## 2. 함께 봐야 할 현장 신호',
    '- 숫자만으로는 놓칠 수 있는 팀원 또는 고객 반응의 신호 1~2개',
    '- 팀장이 무엇을 관찰해야 하는지 한 문장',
    '',
    '## 3. 조심해서 봐야 할 해석',
    '- 숫자나 반응을 잘못 해석할 수 있는 위험 1~2개',
    '- 성급하게 단정하지 않기 위해 볼 것 한 문장',
    '',
    '## 4. 팀장이 더 확인할 질문',
    '- 팀원이나 고객 반응을 보고 한 번 더 확인해야 할 질문 1~2개',
    '',
    '주의:',
    '- 정답처럼 말하지 마세요.',
    '- 평가나 점수처럼 보이게 쓰지 마세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 쓰지 마세요.',
    ...FORBIDDEN_ITEMS.map((item) => `- ${item}`),
    '- 팀장이 교육장에서 바로 이해할 수 있는 현실적인 문장으로 써 주세요.',
  ].join('\n');
}

export function V39DashboardAnalysisLab() {
  const [teamSituations, setTeamSituations] = useState<string[]>([]);
  const [customSituation, setCustomSituation] = useState('');
  const [aiMetricSuggestion, setAiMetricSuggestion] = useState('');
  const [parseNotice, setParseNotice] = useState('');
  const [aiRecommendedCoreMetrics, setAiRecommendedCoreMetrics] = useState('');
  const [aiRecommendedSupportMetrics, setAiRecommendedSupportMetrics] = useState('');
  const [aiRecommendedSafetyMetrics, setAiRecommendedSafetyMetrics] = useState('');
  const [aiRecommendedQuestions, setAiRecommendedQuestions] = useState('');
  const [selectedCoreMetrics, setSelectedCoreMetrics] = useState<string[]>([]);
  const [selectedSupportMetrics, setSelectedSupportMetrics] = useState<string[]>([]);
  const [selectedSafetyMetrics, setSelectedSafetyMetrics] = useState<string[]>([]);
  const [metricRationale, setMetricRationale] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const metricPrompt = useMemo(() => buildV39MetricPrompt(teamSituations, customSituation), [teamSituations, customSituation]);

  const selectedMetricSummary = useMemo(
    () => [
      `꼭 볼 지표: ${metricNames(selectedCoreMetrics).join(' / ') || '미선택'}`,
      `함께 볼 신호: ${metricNames(selectedSupportMetrics).join(' / ') || '미선택'}`,
      `조심해서 볼 지표: ${metricNames(selectedSafetyMetrics).join(' / ') || '미선택'}`,
    ],
    [selectedCoreMetrics, selectedSupportMetrics, selectedSafetyMetrics],
  );

  useEffect(() => {
    const nextResult = createEmptyV39DashboardResult();
    nextResult.teamSituations = [...teamSituations, ...(customSituation.trim() ? [`직접 작성: ${customSituation.trim()}`] : [])];
    nextResult.metricResult = {
      rawAiMetricSuggestion: aiMetricSuggestion,
      aiRecommendedCoreMetrics,
      aiRecommendedSupportMetrics,
      aiRecommendedSafetyMetrics,
      fitForOurTeam: [aiRecommendedCoreMetrics, aiRecommendedSupportMetrics].filter(Boolean).join('\n\n'),
      excludedMetrics: '',
      additionalMetricIdea: '',
      aiRecommendedQuestions,
      parseNotice,
    };
    nextResult.metricSelection = {
      selectedCoreMetricIds: selectedCoreMetrics,
      selectedSupportMetricIds: selectedSupportMetrics,
      selectedSafetyMetricIds: selectedSafetyMetrics,
      metricRationale,
    };
    saveV39DashboardResult(nextResult);
  }, [
    teamSituations,
    customSituation,
    aiMetricSuggestion,
    aiRecommendedCoreMetrics,
    aiRecommendedSupportMetrics,
    aiRecommendedSafetyMetrics,
    aiRecommendedQuestions,
    parseNotice,
    selectedCoreMetrics,
    selectedSupportMetrics,
    selectedSafetyMetrics,
    metricRationale,
  ]);

  const toggleTeamSituation = (value: string) =>
    setTeamSituations((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : current.length >= MAX_TEAM_SITUATIONS
          ? current
          : [...current, value],
    );

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(metricPrompt);
      setCopiedPrompt(true);
      window.setTimeout(() => setCopiedPrompt(false), 1600);
    } catch {
      setCopiedPrompt(false);
    }
  };

  const autoFillMetricSuggestion = () => {
    const parsed = parseAiMetricSuggestion(aiMetricSuggestion);
    setAiRecommendedCoreMetrics(parsed.core);
    setAiRecommendedSupportMetrics(parsed.support);
    setAiRecommendedSafetyMetrics(parsed.safety);
    setAiRecommendedQuestions(parsed.questions);
    setParseNotice(
      parsed.warnings.length > 0
        ? `AI 초안을 옮겼습니다. 다만 ${parsed.warnings.length}개 항목은 자동으로 찾지 못했습니다. 아래 칸에서 직접 확인해 주세요.`
        : 'AI 초안을 옮겼습니다. 우리 팀 상황에 맞게 짧게 고쳐 쓰면 됩니다.',
    );
  };

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_21rem] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
              <span className="text-base">↗</span>
              <span>5단계 팀 실행진단</span>
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">우리 팀 지표로 다음 행동 준비하기</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">
              정답을 찾는 화면이 아닙니다. 이번 2주 동안 팀장이 무엇을 보고, 무엇을 더 확인하고, 어떤 해석은 조심해야 할지 가볍게 정리합니다.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm font-black text-orange-950">상황 선택 {teamSituations.length} / 2</div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">지표 선택 {selectedCoreMetrics.length + selectedSupportMetrics.length + selectedSafetyMetrics.length} / 3</div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">입력 내용은 자동 저장됩니다</div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 0</p>
        <h3 className="text-lg font-black text-slate-950">우리 팀 지표 정하기</h3>
        <p className="mt-2 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          우리 팀과 가장 가까운 상황 2개를 고릅니다. 정답을 고르는 것이 아니라, 오늘 실습에서 먼저 다룰 장면을 정하는 단계입니다.
        </p>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-black text-slate-950">우리 팀 상황 선택</h4>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">상황 선택 {teamSituations.length} / 2</span>
            </div>
            <p className="mt-2 text-xs font-bold leading-5 text-slate-600">가장 가까운 상황 2개를 선택하세요. 2개를 선택한 뒤에는 기존 선택을 해제해야 다른 상황을 선택할 수 있습니다.</p>
            <div className="mt-3 grid gap-2">
              {TEAM_SITUATION_OPTIONS.map((option) => {
                const selected = teamSituations.includes(option);
                const disabled = !selected && teamSituations.length >= MAX_TEAM_SITUATIONS;
                return (
                  <label key={option} className={`flex gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${selected ? 'border-amber-700 bg-amber-50 text-amber-950' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}>
                    <input type="checkbox" disabled={disabled} checked={selected} onChange={() => toggleTeamSituation(option)} />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
            <label className="mt-4 block space-y-1">
              <span className="text-xs font-black text-slate-600">우리 팀만의 상황 한 문장</span>
              <textarea
                className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6"
                value={customSituation}
                onChange={(event) => setCustomSituation(event.target.value)}
                placeholder="예: 신규 담당자가 늘어 고객별 맥락을 빠르게 파악하기 어렵다."
              />
            </label>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h4 className="text-sm font-black text-slate-950">AI에 물어볼 질문</h4>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">AI가 답을 정하는 것이 아니라, 팀장이 볼 지표와 조심할 해석을 가볍게 정리하는 질문입니다.</p>
              </div>
              <button type="button" className="rounded-2xl bg-amber-700 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copiedPrompt ? '복사 완료' : 'AI에 물어볼 질문 복사'}</button>
            </div>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{metricPrompt}</pre>
          </div>
        </div>

        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-600">AI 초안 붙여넣기</span>
          <textarea className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={aiMetricSuggestion} onChange={(event) => setAiMetricSuggestion(event.target.value)} placeholder="외부 AI가 정리한 초안을 붙여넣으세요. 그대로 쓰지 말고 아래에서 우리 팀 말로 줄여 씁니다." />
        </label>
        <div className="mt-3">
          <button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={autoFillMetricSuggestion}>AI 초안에서 필요한 것만 옮기기</button>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">자동으로 옮겨진 내용도 우리 팀 상황에 맞게 짧게 고쳐 쓰면 됩니다.</p>
          {parseNotice && <div className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-amber-800">{parseNotice}</div>}
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">AI 초안에서 꼭 필요한 것만 남기기</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">많이 적는 것이 목적이 아닙니다. 이번 2주 동안 팀장이 실제로 볼 것만 남깁니다.</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <ReviewTextarea label="이번 2주에 꼭 볼 지표" value={aiRecommendedCoreMetrics} onChange={setAiRecommendedCoreMetrics} />
            <ReviewTextarea label="함께 봐야 할 현장 신호" value={aiRecommendedSupportMetrics} onChange={setAiRecommendedSupportMetrics} />
            <ReviewTextarea label="조심해서 봐야 할 해석" value={aiRecommendedSafetyMetrics} onChange={setAiRecommendedSafetyMetrics} />
            <ReviewTextarea label="팀장이 더 확인할 질문" value={aiRecommendedQuestions} onChange={setAiRecommendedQuestions} />
          </div>
        </div>

        <div className="mt-4 rounded-2xl border bg-white p-4">
          <h4 className="text-sm font-black text-slate-950">우리 팀이 이번 2주에 볼 것 최종 선택</h4>
          <p className="mt-1 text-xs font-bold leading-5 text-slate-600">정답을 고르는 것이 아닙니다. 이번 2주 동안 팀장이 놓치지 않고 볼 기준을 1개씩만 고릅니다.</p>
          <MetricPicker title="꼭 볼 지표 1개" selected={selectedCoreMetrics} setter={setSelectedCoreMetrics} max={1} safetyOnly={false} />
          <MetricPicker title="함께 볼 지표 1개" selected={selectedSupportMetrics} setter={setSelectedSupportMetrics} max={1} safetyOnly={false} />
          <MetricPicker title="조심해서 볼 지표 1개" selected={selectedSafetyMetrics} setter={setSelectedSafetyMetrics} max={1} safetyOnly={true} />
          <label className="mt-4 block space-y-1">
            <span className="text-xs font-black text-slate-600">왜 이 기준을 보려고 하나요?</span>
            <textarea className="min-h-20 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6" value={metricRationale} onChange={(event) => setMetricRationale(event.target.value)} placeholder="예: 방문 수보다 방문 이후 다음 행동이 남았는지를 먼저 보고 싶다." />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedMetricSummary.map((item) => <span key={item} className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-800">{item}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}
