import { useMemo, useState } from 'react';
import { useStored } from './journey-storage';

const V40_RESEARCH_STORAGE_KEY = 'ckd.v40-vnext.pharmaStrategyResearch.v1';

const V40_VNEXT_RESEARCH_TRIMMED_MARKERS = [
  'V40VNextResearchStrategyTrimmedLab',
  '2026년 제약업계 전략 과제 선택',
  '영업팀 추진계획 수립 실습',
  'Perplexity 전략 과제 프롬프트',
  'NotebookLM 소스 묶음 복사',
  'NotebookLM 전략 과제 분석 프롬프트',
  'LM Studio 보고서 생성 요청',
  'LM Studio 슬라이드 생성 요청',
  'LM Studio 인포그래픽 생성 요청',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
].join('|');
void V40_VNEXT_RESEARCH_TRIMMED_MARKERS;

type StrategyTopic = {
  id: string;
  title: string;
  why: string;
  salesFocus: string;
  kpis: string[];
};

type ResearchState = {
  selectedTopicId: string;
  customTopic: string;
  teamSituation: string;
  leaderQuestion: string;
  perplexityAnswer: string;
  notebookLmAnswer: string;
  sourceMemo: string;
  issueOne: string;
  issueTwo: string;
  issueThree: string;
  teamImpact: string;
  metricBridgeQuestions: string;
  complianceCaution: string;
  studioReportDraft: string;
  studioSlideOutline: string;
  studioInfographicDraft: string;
  strategyMeetingMemo: string;
  expectedQuestions: string;
};

const STRATEGY_TOPICS: StrategyTopic[] = [
  {
    id: 'ai-commercial-execution',
    title: 'AI 기반 영업·마케팅 실행관리 고도화',
    why: 'AI가 R&D, 임상, 규제 문서, 상업 조직 생산성까지 확산되면서 영업팀도 실행관리 방식을 바꿔야 합니다.',
    salesFocus: 'AI 결과를 그대로 쓰지 않고 고객 접점 준비, 기록 품질, 후속 질문으로 바꾸는 기준을 세웁니다.',
    kpis: ['AI 활용 전 안전성 점검률', '고객 질문 기록률', '후속 실행안 작성률', '위험 표현 수정 건수'],
  },
  {
    id: 'market-access-pricing',
    title: '약가·급여·시장접근성 변화 대응',
    why: '가격, 급여, 가치 입증 요구가 커지면서 영업 현장도 제품 설명보다 고객 가치와 근거 기반 대화를 강화해야 합니다.',
    salesFocus: '고객이 궁금해하는 가치 근거, 자료 요청, 사용 맥락 질문을 안전하게 기록하고 후속 대응으로 연결합니다.',
    kpis: ['가치 근거 질문 기록률', '승인자료 기반 후속 대응률', '자료 요청 처리 리드타임', '고객 관심 주제 분류율'],
  },
  {
    id: 'patent-cliff-portfolio',
    title: '특허만료·제네릭/바이오시밀러 경쟁 대응',
    why: '특허 절벽과 포트폴리오 재편 압력이 커지면서 차별적 고객가치와 실행 우선순위가 더 중요해졌습니다.',
    salesFocus: '단순 점유율 방어가 아니라 고객 세그먼트별 질문, 대체 선택 기준, 안전한 후속 커뮤니케이션을 정리합니다.',
    kpis: ['핵심 고객군별 질문 기록률', '후속 접점 확보율', '경쟁 비교 위험표현 수정 건수', '세그먼트별 실행 완료율'],
  },
  {
    id: 'cdmo-cmo-supply',
    title: 'CDMO/CMO 전략 확대와 공급·품질 신뢰 강화',
    why: '생산 역량, 공급 안정성, 품질 신뢰가 제약사 경쟁력의 핵심 전략 과제로 부상하고 있습니다.',
    salesFocus: '영업팀은 공급·품질 관련 고객 우려를 정확히 듣고, 내부 확인이 필요한 이슈와 고객 설명 가능 범위를 구분합니다.',
    kpis: ['공급·품질 문의 기록률', '내부 확인 필요 이슈 공유건수', '고객 우려 후속 확인율', '안전 답변 가이드 활용률'],
  },
  {
    id: 'growth-therapy-area',
    title: '비만·대사질환·항암·면역 등 고성장 치료영역 대응',
    why: '고성장 치료영역의 경쟁이 심화되면서 고객의 정보 요구와 근거 확인 수준이 높아지고 있습니다.',
    salesFocus: '치료영역 관심 신호를 과장하지 않고, 고객 질문과 승인자료 기반 후속 대화를 안전하게 연결합니다.',
    kpis: ['치료영역 질문 기록률', '승인자료 기반 대화율', '후속 정보 제공 계획률', '고객 의도 단정 표현 수정건수'],
  },
  {
    id: 'digital-customer-journey',
    title: '디지털 채널·환자 여정 기반 고객 접점 혁신',
    why: '고객 정보 탐색 방식과 접점 채널이 다양해지면서 대면 방문만으로는 고객 경험을 관리하기 어렵습니다.',
    salesFocus: '방문, 비대면, 자료 제공, 후속 확인을 하나의 고객 접점 흐름으로 설계합니다.',
    kpis: ['대체 접점 실행률', '자료 제공 후 후속 확인율', '채널별 고객 반응 기록률', '2주 접점 흐름 완료율'],
  },
];

const DEFAULT_STATE: ResearchState = {
  selectedTopicId: 'ai-commercial-execution',
  customTopic: '',
  teamSituation: 'C1바이오 영업팀이 2026년 제약업계 전략 과제를 바탕으로 2주 실행관리 계획을 세워야 한다.',
  leaderQuestion: '',
  perplexityAnswer: '',
  notebookLmAnswer: '',
  sourceMemo: '',
  issueOne: '',
  issueTwo: '',
  issueThree: '',
  teamImpact: '',
  metricBridgeQuestions: '',
  complianceCaution: '',
  studioReportDraft: '',
  studioSlideOutline: '',
  studioInfographicDraft: '',
  strategyMeetingMemo: '',
  expectedQuestions: '',
};

function activeTopic(state: ResearchState) {
  return STRATEGY_TOPICS.find((topic) => topic.id === state.selectedTopicId) ?? STRATEGY_TOPICS[0];
}

function activeTitle(state: ResearchState) {
  return state.customTopic.trim() || activeTopic(state).title;
}

function buildPerplexityPrompt(state: ResearchState) {
  const topic = activeTopic(state);
  return `2026년 현재 제약·바이오 산업에서 중요한 전략 과제인 "${activeTitle(state)}"를 공개자료 기반으로 조사해 주세요.

목적:
C1바이오 영업팀장 이대호 팀장이 이 전략 과제를 영업팀 추진계획으로 바꾸기 위한 실습 자료를 만들려고 합니다.

우리 팀 상황:
${state.teamSituation}

영업팀 관점의 질문:
${state.leaderQuestion || topic.salesFocus}

조사 기준:
1. 2025~2026년 공개자료, 규제·정책 자료, 산업 리포트, 보도자료, 신뢰 가능한 언론 기사 중심으로 정리해 주세요.
2. 글로벌 동향과 한국 제약영업 현장에 주는 의미를 구분해 주세요.
3. 출처명, 발행기관, 날짜 또는 최근성 단서를 함께 제시해 주세요.
4. 영업팀이 2주 안에 실행관리로 바꿀 수 있는 추진 과제 후보를 제안해 주세요.
5. 실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보, 내부 전략은 쓰지 마세요.
6. 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 피하세요.

출력 형식:
[2026 전략 과제 요약]
[핵심 변화 신호]
[근거/출처]
[영업팀 추진 기회]
[영업팀 실행 리스크]
[2주 실행관리 질문]
[주의해야 할 표현]`;
}

function buildSourceBundle(state: ResearchState) {
  return `NotebookLM 소스 묶음

[전략 과제]
${activeTitle(state)}

[우리 팀 상황]
${state.teamSituation}

[영업팀 관점 질문]
${state.leaderQuestion || activeTopic(state).salesFocus}

[Perplexity 공개자료 리서치 결과]
${state.perplexityAnswer || 'Perplexity 답변을 먼저 붙여넣은 뒤 다시 복사하세요.'}

[NotebookLM에 넣을 때 확인할 기준]
- 실제로 열리는 공개자료 링크와 자료명을 우선 사용합니다.
- 2025~2026년 자료, 공식기관, 협회, 기업 발표, 신뢰 가능한 언론을 우선합니다.
- 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 제외합니다.
- 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 제외합니다.`;
}

function buildNotebookPrompt(state: ResearchState) {
  return `NotebookLM 전략 과제 분석 프롬프트

역할:
제약산업 전략과 제약영업 실행관리를 모두 이해하는 분석가 관점에서 봐주세요.

맥락:
나는 C1바이오 영업팀장 이대호 팀장입니다. 업로드한 공개자료 소스만 근거로 2026년 제약업계 전략 과제를 우리 영업팀 추진계획으로 바꾸려고 합니다.

전략 과제:
${activeTitle(state)}

우리 팀 상황:
${state.teamSituation}

요청:
1. 업로드된 소스에 근거한 2026년 전략 과제의 핵심 변화 신호를 정리해 주세요.
2. 이 전략 과제가 영업팀의 고객 대화, 실행관리, 팀원 코칭에 주는 영향을 설명해 주세요.
3. 영업팀 추진 과제 3개로 압축해 주세요.
4. 각 추진 과제를 2주 실행관리 질문과 KPI 후보로 바꿔 주세요.
5. 고객 의도 단정, 처방 유도, 경쟁사 비방, 허가 외 사용 암시처럼 조심할 표현을 따로 표시해 주세요.

출력 형식:
[핵심 변화 신호]
[출처/근거 요약]
[영업팀 추진 과제 1]
[영업팀 추진 과제 2]
[영업팀 추진 과제 3]
[우리 팀 실행 영향]
[2주 실행관리 질문]
[KPI 후보]
[주의해야 할 표현]`;
}

function buildStudioPrompt(type: '보고서' | '슬라이드' | '인포그래픽', state: ResearchState) {
  const base = `LM Studio ${type} 생성 요청

목적:
2026년 제약업계 전략 과제 "${activeTitle(state)}"를 C1바이오 영업팀 추진계획으로 설명하는 교육용 전략회의 자료를 만든다.

핵심 내용:
- 전략 과제 1: ${state.issueOne || '영업팀 추진 과제 1'}
- 전략 과제 2: ${state.issueTwo || '영업팀 추진 과제 2'}
- 전략 과제 3: ${state.issueThree || '영업팀 추진 과제 3'}
- 우리 팀 실행 영향: ${state.teamImpact || '우리 팀 실행 영향'}
- 2주 실행관리 질문: ${state.metricBridgeQuestions || '2주 실행관리 질문'}
- 주의 표현: ${state.complianceCaution || '주의해야 할 표현'}

주의:
실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보, 내부 전략, 개인정보는 제외한다. 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 표현은 사용하지 않는다.`;
  if (type === '보고서') return `${base}

요청 형식:
1~2페이지 전략회의 보고서 초안으로 작성한다. 배경, 변화 신호, 영업팀 추진 과제 3개, 2주 실행관리 질문, KPI 후보, 리스크 표현 점검 순서로 구성한다.`;
  if (type === '슬라이드') return `${base}

요청 형식:
발표용 8장 슬라이드 구성안을 만든다. 각 장은 제목, 핵심 메시지, 시각화 아이디어, 발표자 메모를 포함한다.`;
  return `${base}

요청 형식:
1페이지 인포그래픽 구조로 만든다. 상단 핵심 메시지, 중단 전략 과제 3개, 하단 2주 실행관리 질문과 KPI 후보를 시각 중심으로 정리한다.`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1"><span className="text-xs font-black text-slate-500">{label}</span>{children}</label>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function TextArea({ value, onChange, placeholder, readOnly = false }: { value: string; onChange?: (value: string) => void; placeholder?: string; readOnly?: boolean }) {
  return <textarea className="min-h-36 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} />;
}

export function V40VNextResearchStrategyTrimmedLab() {
  const [state, setState] = useStored<ResearchState>(V40_RESEARCH_STORAGE_KEY, DEFAULT_STATE);
  const [copyMessage, setCopyMessage] = useState('');
  const topic = activeTopic(state);
  const perplexityPrompt = useMemo(() => buildPerplexityPrompt(state), [state]);
  const sourceBundle = useMemo(() => buildSourceBundle(state), [state]);
  const notebookPrompt = useMemo(() => buildNotebookPrompt(state), [state]);
  const reportPrompt = useMemo(() => buildStudioPrompt('보고서', state), [state]);
  const slidePrompt = useMemo(() => buildStudioPrompt('슬라이드', state), [state]);
  const infographicPrompt = useMemo(() => buildStudioPrompt('인포그래픽', state), [state]);
  const update = (patch: Partial<ResearchState>) => setState({ ...state, ...patch });
  const copyText = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); setCopyMessage(`${label} 내용을 복사했습니다.`); }
    catch { setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.'); }
  };
  return <section className="space-y-4">
    <Section title="1단계: 2026년 제약업계 전략 과제 선택과 Perplexity 탐색">
      <Field label="2026년 전략 과제 선택"><select className="w-full rounded-xl border px-3 py-2" value={state.selectedTopicId} onChange={(e) => update({ selectedTopicId: e.target.value })}>{STRATEGY_TOPICS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950"><p className="font-black">이 과제의 영업팀 추진 초점</p><p className="mt-1">{topic.salesFocus}</p><p className="mt-1">KPI 후보: {topic.kpis.join(' · ')}</p></div>
      <Field label="전략 과제 직접 입력"><input className="w-full rounded-xl border px-3 py-2" value={state.customTopic} onChange={(e) => update({ customTopic: e.target.value })} placeholder="예: CDMO/CMO 전략 확대와 영업팀 고객가치 제안" /></Field>
      <Field label="우리 팀 상황"><TextArea value={state.teamSituation} onChange={(value) => update({ teamSituation: value })} /></Field>
      <Field label="영업팀 관점의 리서치 질문"><TextArea value={state.leaderQuestion} onChange={(value) => update({ leaderQuestion: value })} placeholder="예: 이 전략 과제를 영업팀의 고객 대화, 2주 실행관리, 팀원 코칭으로 어떻게 바꿀 수 있을까?" /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(perplexityPrompt, 'Perplexity 전략 과제 프롬프트')}>Perplexity 프롬프트 복사</button>
      {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{perplexityPrompt}</pre>
      <Field label="Perplexity 답변 붙여넣기"><TextArea value={state.perplexityAnswer} onChange={(value) => update({ perplexityAnswer: value })} placeholder="Perplexity 답변을 붙여넣으세요. 출처, 발행기관, 날짜가 포함되어 있으면 좋습니다." /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(sourceBundle, 'NotebookLM 소스 묶음')}>NotebookLM 소스 묶음 복사</button>
    </Section>
    <Section title="2단계: NotebookLM 소스 기반 전략 과제 압축">
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(notebookPrompt, 'NotebookLM 전략 과제 분석 프롬프트')}>NotebookLM 프롬프트 복사</button>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{notebookPrompt}</pre>
      <Field label="NotebookLM 결과 붙여넣기"><TextArea value={state.notebookLmAnswer} onChange={(value) => update({ notebookLmAnswer: value })} /></Field>
      <div className="grid gap-3 md:grid-cols-2"><Field label="추진 과제 1"><TextArea value={state.issueOne} onChange={(value) => update({ issueOne: value })} /></Field><Field label="추진 과제 2"><TextArea value={state.issueTwo} onChange={(value) => update({ issueTwo: value })} /></Field><Field label="추진 과제 3"><TextArea value={state.issueThree} onChange={(value) => update({ issueThree: value })} /></Field><Field label="우리 팀 실행 영향"><TextArea value={state.teamImpact} onChange={(value) => update({ teamImpact: value })} /></Field></div>
      <Field label="2주 실행관리 질문과 KPI 후보"><TextArea value={state.metricBridgeQuestions} onChange={(value) => update({ metricBridgeQuestions: value })} /></Field>
      <Field label="주의해야 할 표현"><TextArea value={state.complianceCaution} onChange={(value) => update({ complianceCaution: value })} placeholder="예: 처방 유도, 허가 외 사용 암시, 경쟁사 비방, 비교 우위 단정 등" /></Field>
    </Section>
    <Section title="3단계: LM Studio 보고서·슬라이드·인포그래픽 생성 요청">
      <Field label="LM Studio 보고서 생성 요청"><TextArea value={reportPrompt} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(reportPrompt, 'LM Studio 보고서 생성 요청')}>보고서 요청문 복사</button><TextArea value={state.studioReportDraft} onChange={(value) => update({ studioReportDraft: value })} placeholder="LM Studio에서 생성한 보고서 초안을 붙여넣으세요." />
      <Field label="LM Studio 슬라이드 생성 요청"><TextArea value={slidePrompt} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slidePrompt, 'LM Studio 슬라이드 생성 요청')}>슬라이드 요청문 복사</button><TextArea value={state.studioSlideOutline} onChange={(value) => update({ studioSlideOutline: value })} placeholder="LM Studio에서 생성한 슬라이드 구성안을 붙여넣으세요." />
      <Field label="LM Studio 인포그래픽 생성 요청"><TextArea value={infographicPrompt} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographicPrompt, 'LM Studio 인포그래픽 생성 요청')}>인포그래픽 요청문 복사</button><TextArea value={state.studioInfographicDraft} onChange={(value) => update({ studioInfographicDraft: value })} placeholder="LM Studio에서 생성한 인포그래픽 초안을 붙여넣으세요." />
      <Field label="전략회의 메모"><TextArea value={state.strategyMeetingMemo} onChange={(value) => update({ strategyMeetingMemo: value })} /></Field>
      <Field label="예상 질문"><TextArea value={state.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} /></Field>
    </Section>
  </section>;
}
