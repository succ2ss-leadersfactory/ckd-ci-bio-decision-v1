import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';
import { DEFAULT_PHARMA_RESEARCH_STATE, PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, pharmaTitleOf, type PharmaStrategyResearchState } from './journey-v41-pharma-research-data';

type PerformanceCascadeState = {
  selectedTeamTask?: string;
  customTeamTask?: string;
  selectedCsf?: string;
  selectedKpi?: string;
  selectedInitiative?: string;
};

type AiExpansionState = {
  prompt: string;
  result: string;
  review: string;
  teamTaskPrompt: string;
  teamTaskResult: string;
  selectedAiTeamTask: string;
  teamTaskReview: string;
  csfPrompt: string;
  csfResult: string;
  selectedAiCsf: string;
  csfReview: string;
  kpiPrompt: string;
  kpiResult: string;
  selectedAiKpi: string;
  selectedAiEvidence: string;
  selectedAiCycle: string;
  kpiReview: string;
  finalAiExpansionReview: string;
};

const AI_KEY = 'ckd.v41.performanceCascade.aiExpansion.v1';
const PERFORMANCE_KEY = 'ckd.v41.performanceCascade.v1';
const DEFAULT_PERFORMANCE: PerformanceCascadeState = {};
const DEFAULT_AI: AiExpansionState = {
  prompt: '',
  result: '',
  review: '',
  teamTaskPrompt: '',
  teamTaskResult: '',
  selectedAiTeamTask: '',
  teamTaskReview: '',
  csfPrompt: '',
  csfResult: '',
  selectedAiCsf: '',
  csfReview: '',
  kpiPrompt: '',
  kpiResult: '',
  selectedAiKpi: '',
  selectedAiEvidence: '',
  selectedAiCycle: '',
  kpiReview: '',
  finalAiExpansionReview: '',
};

function text(value?: string) {
  return value?.trim() || '';
}

function TextArea({ value, onChange, placeholder, minHeight = 'min-h-36' }: { value: string; onChange: (value: string) => void; placeholder: string; minHeight?: string }) {
  return <textarea className={`${minHeight} w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-violet-700 focus:ring-2 focus:ring-violet-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function Box({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return <label className="block rounded-2xl border border-violet-100 bg-white p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<div className="mt-3">{children}</div></label>;
}

function StageCard({ step, title, help, children }: { step: string; title: string; help: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm"><p className="text-xs font-black text-violet-700">{step}</p><h4 className="mt-1 text-base font-black text-slate-950">{title}</h4><p className="mt-2 text-sm font-bold leading-6 text-slate-600">{help}</p><div className="mt-4 space-y-3">{children}</div></section>;
}

async function copyTextToClipboard(textToCopy: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(textToCopy);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = textToCopy;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export function V41PerformanceAiExpansionLab() {
  const [aiRaw, setAi] = useStored<AiExpansionState>(AI_KEY, DEFAULT_AI);
  const ai = { ...DEFAULT_AI, ...aiRaw };
  const [copiedStage, setCopiedStage] = useState<string | null>(null);
  const [research] = useStored<PharmaStrategyResearchState>(PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, DEFAULT_PHARMA_RESEARCH_STATE);
  const [performance] = useStored<PerformanceCascadeState>(PERFORMANCE_KEY, DEFAULT_PERFORMANCE);
  const enterpriseTitle = useMemo(() => pharmaTitleOf(research), [research.selectedTopicId, research.customTopic]);

  const baseTeamTask = text(performance.customTeamTask) || text(performance.selectedTeamTask) || '5단계에서 선택한 기존 팀 전략과제';
  const baseCsf = text(performance.selectedCsf) || '5단계에서 선택한 기존 CSF';
  const baseKpi = text(performance.selectedKpi) || '5단계에서 선택한 기존 KPI';
  const baseInitiative = text(performance.selectedInitiative) || '5단계에서 선택한 기존 세부 추진과제';

  const updateAi = (patch: Partial<AiExpansionState>) => {
    setCopiedStage(null);
    setAi({ ...DEFAULT_AI, ...ai, ...patch });
  };

  const buildTeamTaskPrompt = () => {
    const prompt = [
      '역할: 당신은 제약영업팀장의 전략 실행을 돕는 전략컨설턴트이자 성과관리 전문가입니다.',
      '',
      `[상황/맥락]\n4단계 시장/전사 참고 맥락: ${enterpriseTitle}\n현재 팀 기준: ${baseTeamTask}\n현재 선택된 CSF: ${baseCsf}\n현재 선택된 KPI: ${baseKpi}\n현재 세부 추진과제 후보: ${baseInitiative}`,
      '',
      '[과제/요청]',
      '위 맥락은 참고용입니다. 상위 문구를 반복하기보다 우리 팀이 실제로 실행하고 확인할 수 있는 추가 팀 전략과제 후보 5개를 제안해 주세요.',
      '',
      '[출력형식]',
      '1. 추가 팀 전략과제 후보 5개',
      '2. 4단계 참고 맥락과의 연결성 한 줄',
      '3. 현장 실행 난이도',
      '4. 팀장이 확인할 수 있는 실행 신호',
      '5. 컴플라이언스 주의점',
      '6. 추천 우선순위와 제외해도 되는 후보',
      '',
      '[제약/조건]',
      '전사 문구를 그대로 반복하지 마세요. 실제 병원명, 의료진명, 고객명은 쓰지 마세요. 처방 확대, 의사 설득, 경쟁 제품 차단처럼 위험하게 해석될 수 있는 표현은 피하세요. 팀장이 현장에서 쓸 수 있는 말로 작성해 주세요.',
    ].join('\n');
    updateAi({ prompt, teamTaskPrompt: prompt });
  };

  const buildCsfPrompt = () => {
    const selectedTask = text(ai.selectedAiTeamTask);
    if (!selectedTask) {
      window.alert('먼저 1단계에서 추가 팀 전략과제를 선정해 주세요.');
      return;
    }
    const prompt = [
      '역할: 당신은 제약영업팀장의 전략 실행을 돕는 성과관리 전문가입니다.',
      '',
      `[상황/맥락]\n참고 맥락: ${enterpriseTitle}\n선정된 추가 팀 전략과제: ${selectedTask}`,
      '',
      '[과제/요청]',
      '위 맥락은 참고용입니다. 전사 문구를 반복하지 말고, 선정된 추가 팀 전략과제가 성공하려면 현장에서 반드시 충족되어야 할 CSF 후보 5개를 제안해 주세요. CSF는 단순 활동이 아니라 성공조건이어야 합니다.',
      '',
      '[출력형식]',
      '1. CSF 후보 5개',
      '2. 각 CSF가 성공조건인 이유',
      '3. 단순 활동으로 오해될 수 있는 표현과 수정안',
      '4. 현장에서 확인 가능한 증거',
      '5. 팀장이 점검할 수 있는 질문',
      '6. 최종 선택 추천 1~2개와 제외 후보',
      '',
      '[제약/조건]',
      'CSF는 방문 수, 자료 전달 수 같은 단순 활동으로 쓰지 마세요. 상위 전략 문구의 반복 표현으로 쓰지 마세요. 실제 병원명, 의료진명, 고객명은 쓰지 마세요. 컴플라이언스 위험 표현은 피하세요.',
    ].join('\n');
    updateAi({ prompt, csfPrompt: prompt });
  };

  const buildKpiPrompt = () => {
    const selectedTask = text(ai.selectedAiTeamTask);
    const selectedCsf = text(ai.selectedAiCsf);
    if (!selectedTask || !selectedCsf) {
      window.alert('먼저 1단계 전략과제와 2단계 CSF를 선정해 주세요.');
      return;
    }
    const prompt = [
      '역할: 당신은 제약영업팀장의 실행관리 KPI 설계를 돕는 성과관리 전문가입니다.',
      '',
      `[상황/맥락]\n참고 맥락: ${enterpriseTitle}\n선정된 추가 팀 전략과제: ${selectedTask}\n선정된 CSF: ${selectedCsf}`,
      '',
      '[과제/요청]',
      '위 맥락은 참고용입니다. 선정된 CSF를 팀장이 2주~4주 단위로 확인할 수 있는 KPI 후보 5개로 제안해 주세요. 전사 성과지표가 아니라 현장 실행 증거로 확인 가능한 KPI여야 합니다.',
      '',
      '[출력형식]',
      '1. KPI 후보 5개',
      '2. 각 KPI가 CSF를 직접 측정하는 이유',
      '3. 확인 증거',
      '4. 관리 주기',
      '5. 팀원 입력 가능성',
      '6. 팀장 점검 가능성',
      '7. 컴플라이언스 위험 여부',
      '8. 최종 선택 추천 1~2개와 제외 후보',
      '',
      '[제약/조건]',
      '확인 가능한 증거가 없는 KPI는 제외해 주세요. 전사 단위 성과지표나 단순 활동량 지표만 제안하지 마세요. 실제 병원명, 의료진명, 고객명은 쓰지 마세요. 위험 표현은 피하세요.',
    ].join('\n');
    updateAi({ prompt, kpiPrompt: prompt });
  };

  const buildFinalReview = () => {
    const finalReview = [
      '[반영할 AI 후보]',
      `추가 팀 전략과제: ${text(ai.selectedAiTeamTask) || '미선정'}`,
      `CSF: ${text(ai.selectedAiCsf) || '미선정'}`,
      `KPI: ${text(ai.selectedAiKpi) || '미선정'}`,
      `확인 증거: ${text(ai.selectedAiEvidence) || '미작성'}`,
      `관리 주기: ${text(ai.selectedAiCycle) || '미작성'}`,
      '',
      '[수정할 표현]',
      [text(ai.teamTaskReview), text(ai.csfReview), text(ai.kpiReview)].filter(Boolean).join('\n') || '- AI 후보 중 현장 언어로 다듬을 표현을 작성합니다.',
      '',
      '[제외할 후보]',
      '- 이번 실행관리 주기에서 확인 증거가 없거나 팀원이 바로 실행하기 어려운 후보는 제외합니다.',
      '',
      '[반영 이유]',
      '- 선택한 전략과제·CSF·KPI가 6단계 실행관리 계획에서 확인 증거와 중간 점검 질문으로 전환 가능하기 때문입니다.',
      '',
      '[컴플라이언스 확인]',
      '- 실제 병원명/의료진명/고객명 없음',
      '- 확인 불가능한 KPI 없음',
      '- 표현상 위험 문구 없음',
    ].join('\n');
    updateAi({ review: finalReview, finalAiExpansionReview: finalReview });
  };

  const copyPrompt = async (stage: string, prompt: string) => {
    const promptToCopy = text(prompt);
    if (!promptToCopy) {
      window.alert('먼저 AI 실습 프롬프트를 만들어 주세요.');
      return;
    }
    try {
      await copyTextToClipboard(promptToCopy);
      setCopiedStage(stage);
      window.setTimeout(() => setCopiedStage(null), 1600);
    } catch {
      window.alert('자동 복사가 되지 않았습니다. 프롬프트 영역의 내용을 직접 선택해 복사해 주세요.');
    }
  };

  const hasFinalReview = Boolean(text(ai.review));

  return <section className="rounded-3xl border border-violet-100 bg-violet-50 p-4 shadow-sm md:p-5" data-v41-ai-expansion-position="before-team-standard-confirmation">
    <p className="text-xs font-black uppercase tracking-wide text-violet-700">AI 확장 실습 · 3단계 판단 퍼널</p>
    <h3 className="mt-1 text-lg font-black text-slate-950">AI로 추가 팀 전략과제·CSF·KPI 만들기</h3>
    <p className="mt-2 text-sm font-bold leading-6 text-slate-600">4단계 시장/전사 맥락은 방향을 잡는 참고자료로만 사용합니다. AI가 한 번에 답을 정하게 하지 않고, 추가 팀 전략과제 → CSF → KPI 순서로 후보를 만들고 팀장이 단계별로 선택합니다. 최종 검토 요약만 6단계 실행계획 후보로 연결됩니다.</p>
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-violet-800"><span className="rounded-full bg-white px-3 py-1">4단계 맥락 참고</span><span className="rounded-full bg-white px-3 py-1">전략과제</span><span className="rounded-full bg-white px-3 py-1">CSF</span><span className="rounded-full bg-white px-3 py-1">KPI</span><span className="rounded-full bg-white px-3 py-1">사람 선택</span><span className="rounded-full bg-white px-3 py-1">6단계 연결</span></div>

    <div className="mt-4 grid gap-4">
      <StageCard step="1단계" title="추가 팀 전략과제 도출 및 선정" help="4단계 시장/전사 맥락은 참고만 하고, 현재 팀 기준을 바탕으로 실제 실행·확인 가능한 추가 팀 전략과제 후보를 만듭니다.">
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildTeamTaskPrompt}>AI 실습 프롬프트 만들기</button>
          <button type="button" className="rounded-xl bg-white px-4 py-2 text-sm font-black text-violet-800 ring-1 ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => copyPrompt('teamTask', ai.teamTaskPrompt)} disabled={!text(ai.teamTaskPrompt)}>{copiedStage === 'teamTask' ? '복사 완료' : '프롬프트 복사'}</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Box label="AI에게 입력할 프롬프트"><TextArea value={ai.teamTaskPrompt} onChange={(teamTaskPrompt) => updateAi({ prompt: teamTaskPrompt, teamTaskPrompt })} placeholder="버튼을 누르면 추가 팀 전략과제 도출 프롬프트가 생성됩니다." minHeight="min-h-48" /></Box>
          <Box label="AI 결과 붙여넣기"><TextArea value={ai.teamTaskResult} onChange={(teamTaskResult) => updateAi({ result: teamTaskResult, teamTaskResult })} placeholder="AI가 제안한 추가 팀 전략과제 후보를 붙여넣습니다." minHeight="min-h-48" /></Box>
          <Box label="선정한 추가 팀 전략과제"><TextArea value={ai.selectedAiTeamTask} onChange={(selectedAiTeamTask) => updateAi({ selectedAiTeamTask })} placeholder="최종 선정할 추가 팀 전략과제 1개를 적습니다." /></Box>
          <Box label="선정/제외 판단"><TextArea value={ai.teamTaskReview} onChange={(teamTaskReview) => updateAi({ teamTaskReview })} placeholder="선정 이유, 보류할 후보, 제외할 후보를 적습니다." /></Box>
        </div>
      </StageCard>

      <StageCard step="2단계" title="선정된 전략과제별 CSF 도출 및 선정" help="상위 문구를 반복하지 않고, 1단계에서 선정한 전략과제가 성공하려면 현장에서 반드시 충족되어야 할 조건을 찾습니다.">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-600">선정된 추가 팀 전략과제: {text(ai.selectedAiTeamTask) || '아직 선정되지 않았습니다.'}</div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildCsfPrompt}>AI 실습 프롬프트 만들기</button>
          <button type="button" className="rounded-xl bg-white px-4 py-2 text-sm font-black text-violet-800 ring-1 ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => copyPrompt('csf', ai.csfPrompt)} disabled={!text(ai.csfPrompt)}>{copiedStage === 'csf' ? '복사 완료' : '프롬프트 복사'}</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Box label="AI에게 입력할 프롬프트"><TextArea value={ai.csfPrompt} onChange={(csfPrompt) => updateAi({ prompt: csfPrompt, csfPrompt })} placeholder="버튼을 누르면 CSF 도출 프롬프트가 생성됩니다." minHeight="min-h-48" /></Box>
          <Box label="AI 결과 붙여넣기"><TextArea value={ai.csfResult} onChange={(csfResult) => updateAi({ result: csfResult, csfResult })} placeholder="AI가 제안한 CSF 후보를 붙여넣습니다." minHeight="min-h-48" /></Box>
          <Box label="선정한 CSF"><TextArea value={ai.selectedAiCsf} onChange={(selectedAiCsf) => updateAi({ selectedAiCsf })} placeholder="최종 선정할 CSF 1~2개를 적습니다." /></Box>
          <Box label="CSF 선정/수정 판단"><TextArea value={ai.csfReview} onChange={(csfReview) => updateAi({ csfReview })} placeholder="성공조건으로 적합한 이유, 수정할 표현, 제외할 후보를 적습니다." /></Box>
        </div>
      </StageCard>

      <StageCard step="3단계" title="선정된 CSF별 KPI 도출 및 선정" help="선정한 CSF를 팀장이 2주~4주 단위로 확인할 수 있는 현장 실행 증거 중심 KPI로 바꿉니다.">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-600">선정된 CSF: {text(ai.selectedAiCsf) || '아직 선정되지 않았습니다.'}</div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildKpiPrompt}>AI 실습 프롬프트 만들기</button>
          <button type="button" className="rounded-xl bg-white px-4 py-2 text-sm font-black text-violet-800 ring-1 ring-violet-200 disabled:cursor-not-allowed disabled:opacity-50" onClick={() => copyPrompt('kpi', ai.kpiPrompt)} disabled={!text(ai.kpiPrompt)}>{copiedStage === 'kpi' ? '복사 완료' : '프롬프트 복사'}</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Box label="AI에게 입력할 프롬프트"><TextArea value={ai.kpiPrompt} onChange={(kpiPrompt) => updateAi({ prompt: kpiPrompt, kpiPrompt })} placeholder="버튼을 누르면 KPI 도출 프롬프트가 생성됩니다." minHeight="min-h-48" /></Box>
          <Box label="AI 결과 붙여넣기"><TextArea value={ai.kpiResult} onChange={(kpiResult) => updateAi({ result: kpiResult, kpiResult })} placeholder="AI가 제안한 KPI 후보를 붙여넣습니다." minHeight="min-h-48" /></Box>
          <Box label="선정한 KPI"><TextArea value={ai.selectedAiKpi} onChange={(selectedAiKpi) => updateAi({ selectedAiKpi })} placeholder="최종 선정할 KPI 1~2개를 적습니다." /></Box>
          <Box label="확인 증거와 관리 주기"><TextArea value={[text(ai.selectedAiEvidence) ? `확인 증거: ${ai.selectedAiEvidence}` : '', text(ai.selectedAiCycle) ? `관리 주기: ${ai.selectedAiCycle}` : ''].filter(Boolean).join('\n')} onChange={(value) => {
            const evidence = value.match(/확인 증거:\s*(.*)/)?.[1]?.trim() || value.split(/\r?\n/)[0]?.replace(/^확인 증거:\s*/, '').trim() || '';
            const cycle = value.match(/관리 주기:\s*(.*)/)?.[1]?.trim() || value.split(/\r?\n/)[1]?.replace(/^관리 주기:\s*/, '').trim() || '';
            updateAi({ selectedAiEvidence: evidence, selectedAiCycle: cycle });
          }} placeholder={'확인 증거: CRM 기록, 고객 반응 기록 등\n관리 주기: 2주'} /></Box>
          <Box label="KPI 선정/수정 판단"><TextArea value={ai.kpiReview} onChange={(kpiReview) => updateAi({ kpiReview })} placeholder="KPI가 CSF를 직접 측정하는지, 제외할 지표, 컴플라이언스 주의점을 적습니다." /></Box>
        </div>
      </StageCard>

      <section className="rounded-3xl border border-violet-100 bg-white p-4 shadow-sm">
        <h4 className="text-base font-black text-slate-950">최종 6단계 전달 요약</h4>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">선택된 AI 추가 전략과제·CSF·KPI만 6단계로 넘깁니다. AI 원문 전체는 참고자료이고, 이 최종 요약만 실행계획 후보가 됩니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildFinalReview}>최종 검토 요약 만들기</button>
          <span className="rounded-xl bg-violet-50 px-4 py-2 text-xs font-black text-violet-900">{hasFinalReview ? '6단계 연결 준비 완료' : '최종 요약 작성 필요'}</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Box label="6단계로 가져갈 AI 후보 검토 요약" help="이 내용만 6단계에서 실행계획 후보로 검토됩니다."><TextArea value={ai.finalAiExpansionReview || ai.review} onChange={(value) => updateAi({ review: value, finalAiExpansionReview: value })} placeholder={'[반영할 AI 후보]\n추가 팀 전략과제:\nCSF:\nKPI:\n확인 증거:\n관리 주기:\n\n[수정할 표현]\n- \n\n[제외할 후보]\n- \n\n[반영 이유]\n- \n\n[컴플라이언스 확인]\n- 실제 병원명/의료진명/고객명 없음\n- 확인 불가능한 KPI 없음\n- 표현상 위험 문구 없음'} minHeight="min-h-56" /></Box>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-xs font-bold leading-5 text-violet-950"><p className="font-black">6단계 연결 원칙</p><p className="mt-2">1. 4단계 맥락과 AI 원문은 참고자료입니다.</p><p>2. 단계별로 사람이 선택한 전략과제·CSF·KPI만 전달합니다.</p><p>3. 확인 증거와 관리 주기가 없는 KPI는 6단계 실행계획에 넣지 않습니다.</p><p>4. 컴플라이언스 위험 표현은 제거하거나 수정합니다.</p><p>5. 최종 요약이 있어야 6단계 반영 메모를 만들 수 있습니다.</p></div>
        </div>
      </section>
    </div>
  </section>;
}
