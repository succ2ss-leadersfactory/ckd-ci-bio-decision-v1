import { useMemo } from 'react';
import { useStored } from './journey-storage';
import { DEFAULT_PHARMA_RESEARCH_STATE, PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, pharmaTitleOf, type PharmaStrategyResearchState } from './journey-v41-pharma-research-data';

type CascadeState = {
  selectedTeamTaskId?: string;
  selectedCsfId?: string;
  selectedTeamTask?: string;
  customTeamTask?: string;
  selectedCsf?: string;
  selectedKpi?: string;
  selectedInitiative?: string;
  teamStandard?: string;
  twoWeekFirstAction?: string;
  pauseActivity?: string;
  midCheckQuestion?: string;
  finalExecutionStandard?: string;
};

type AiExpansionState = {
  prompt: string;
  result: string;
  review: string;
};

const AI_KEY = 'ckd.v41.performanceCascade.aiExpansion.v1';
const CASCADE_KEY = 'ckd.v41.performanceCascade.v1';
const DEFAULT_AI: AiExpansionState = { prompt: '', result: '', review: '' };
const DEFAULT_CASCADE: CascadeState = {};

function TextArea({ value, onChange, placeholder, minHeight = 'min-h-36' }: { value: string; onChange: (value: string) => void; placeholder: string; minHeight?: string }) {
  return <textarea className={`${minHeight} w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-violet-700 focus:ring-2 focus:ring-violet-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function Box({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return <label className="block rounded-2xl border border-violet-100 bg-white p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<div className="mt-3">{children}</div></label>;
}

export function V41PerformanceAiExpansionLab() {
  const [ai, setAi] = useStored<AiExpansionState>(AI_KEY, DEFAULT_AI);
  const [cascade, setCascade] = useStored<CascadeState>(CASCADE_KEY, DEFAULT_CASCADE);
  const [research] = useStored<PharmaStrategyResearchState>(PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, DEFAULT_PHARMA_RESEARCH_STATE);
  const enterpriseTitle = useMemo(() => pharmaTitleOf(research), [research.selectedTopicId, research.customTopic]);

  const buildPrompt = () => {
    const base = [
      '역할: 당신은 제약영업팀장의 전략 실행을 돕는 전략컨설턴트이자 성과관리 전문가입니다.',
      '',
      `상황/맥락: 전사 전략과제는 "${enterpriseTitle}"입니다. 현재 팀은 전사 전략을 팀 전략과제, 팀 CSF, 팀 KPI로 내려야 합니다. 실행계획 수립은 다음 단계인 업무관리 실행계획 만들기에서 진행합니다.`,
      '',
      '과제/요청: 현재 제공된 팀 전략과제-CSF-KPI 구조를 유지하되, 추가 팀 전략과제 후보 3개를 발굴해 주세요. 각 전략과제마다 CSF 3개를 만들고, 각 CSF마다 KPI 2개를 제안해 주세요.',
      '',
      '출력형식: 1) 추가 팀 전략과제 후보 3개 2) 각 전략과제별 CSF 3개 3) 각 CSF별 KPI 2개 4) KPI별 관리 주기, 확인 기준/증거, 담당/확인 5) 사람이 검토해야 할 질문 순서로 작성해 주세요.',
      '',
      '제약/조건: CSF는 단순 활동이 아니라 성공조건으로 작성해 주세요. KPI는 해당 CSF를 직접 측정해야 합니다. 실제 병원명, 의료진명, 고객명은 쓰지 마세요. 검토되지 않은 표현이나 컴플라이언스 위험이 있는 문장은 피하세요. 팀장이 현장에서 쓸 수 있는 말로 작성해 주세요.',
      '',
      '김박사 추천 검토 기준: 구체성, 맥락, 실행 가능성, 팀장 언어, 확인 가능성을 기준으로 스스로 점검한 뒤 답변해 주세요.',
    ].join('\n');
    setAi({ ...ai, prompt: base });
  };

  const applyToTeamStandard = () => {
    const teamTask = (cascade.customTeamTask || cascade.selectedTeamTask || '').trim();
    const selectedCsf = (cascade.selectedCsf || '').trim();
    const selectedKpi = (cascade.selectedKpi || '').trim();
    const selectedInitiative = (cascade.selectedInitiative || '').trim();
    if (!teamTask || !selectedCsf || !selectedKpi || !selectedInitiative) {
      window.alert('팀 전략과제 → CSF → KPI → 세부 추진과제 순서로 직접 선택해 주세요. 자동 선택값은 팀 기준으로 확정하지 않습니다.');
      return;
    }
    const source = [ai.result.trim(), ai.review.trim()].filter(Boolean).join('\n\n[사람 검토 보완]\n') || 'AI 확장 결과를 붙여넣고, 우리 팀에 맞는 전략과제·CSF·KPI를 선택해 보완합니다.';
    setCascade({
      ...cascade,
      teamStandard: `[5단계 최종 팀 성과기준]\n전사 전략과제: ${enterpriseTitle}\n팀 전략과제: ${teamTask}\n팀 CSF: ${selectedCsf}\n팀 KPI: ${selectedKpi}\n세부 추진과제 후보: ${selectedInitiative}\n\n[AI 확장 실습 및 사람 검토 반영]\n${source}`,
      twoWeekFirstAction: '',
      pauseActivity: '',
      midCheckQuestion: '',
      finalExecutionStandard: `6단계에서는 위 팀 성과기준을 실행관리 주기, 핵심 실행과제, 담당자 역할, 확인 증거, 점검 질문으로 전환한다. KPI는 ${selectedKpi}를 기준으로 확인한다.`,
    });
  };

  return <section className="rounded-3xl border border-violet-100 bg-violet-50 p-4 shadow-sm md:p-5" data-v41-ai-expansion-position="before-team-standard-confirmation">
    <p className="text-xs font-black uppercase tracking-wide text-violet-700">AI 확장 실습 · 김박사 추천 프롬프팅 기준</p>
    <h3 className="mt-1 text-lg font-black text-slate-950">AI로 추가 팀 전략과제·CSF·KPI 만들기</h3>
    <p className="mt-2 text-sm font-bold leading-6 text-slate-600">기본 선택형 구조를 유지한 뒤, AI에게 추가 전략과제와 CSF/KPI를 만들게 하고 사람이 검토해 최종 팀 성과기준을 확정합니다. 실행계획은 6단계에서 수립합니다.</p>
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-violet-800"><span className="rounded-full bg-white px-3 py-1">역할</span><span className="rounded-full bg-white px-3 py-1">상황/맥락</span><span className="rounded-full bg-white px-3 py-1">과제/요청</span><span className="rounded-full bg-white px-3 py-1">출력형식</span><span className="rounded-full bg-white px-3 py-1">제약/조건</span></div>
    <button type="button" className="mt-4 rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildPrompt}>AI 실습 프롬프트 만들기</button>
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      <Box label="AI에게 입력할 프롬프트" help="3단계 김박사 추천 기준을 반영해 자동 생성합니다."><TextArea value={ai.prompt} onChange={(prompt) => setAi({ ...ai, prompt })} placeholder="버튼을 누르면 프롬프트가 생성됩니다." minHeight="min-h-56" /></Box>
      <Box label="AI 결과 붙여넣기" help="AI가 만든 추가 팀 전략과제, CSF, KPI를 붙여넣습니다."><TextArea value={ai.result} onChange={(result) => setAi({ ...ai, result })} placeholder="AI 결과를 붙여넣으세요." minHeight="min-h-56" /></Box>
      <Box label="사람이 검토한 최종 보완" help="유지할 것, 수정할 것, 제외할 것을 정리합니다."><TextArea value={ai.review} onChange={(review) => setAi({ ...ai, review })} placeholder="사람의 판단으로 최종 보완 내용을 적습니다." /></Box>
      <div className="rounded-2xl border border-violet-100 bg-white p-4 text-xs font-bold leading-5 text-slate-600"><p className="font-black text-violet-800">검토 기준</p><p className="mt-2">1. 팀 전략과제가 전사 추진과제에 기여하는가?</p><p>2. CSF는 성공조건인가, 단순 활동인가?</p><p>3. KPI는 해당 CSF를 직접 측정하는가?</p><p>4. KPI에 관리 주기와 확인 증거가 있는가?</p><p>5. 6단계에서 실행관리 계획으로 전환할 수 있는가?</p><button type="button" className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white" onClick={applyToTeamStandard}>AI 결과 반영해 팀 기준 확정</button></div>
    </div>
  </section>;
}
