import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { DEFAULT_PHARMA_RESEARCH_STATE, PHARMA_RESEARCH_TOPICS, PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, pharmaTopicOf, type PharmaStrategyResearchState } from './journey-v41-pharma-research-data';
import { buildNotebookAnalysisPrompt, buildPerplexityPrompt, buildStudioPrompt } from './journey-v41-pharma-research-prompts';
import { buildWebSourceUrlText, extractUrls, NOTEBOOK_SECTION_ALIASES, parseNotebookAnswer } from './journey-v41-pharma-research-parser';

const V41_PHARMA_STRATEGY_RESEARCH_MARKERS = [
  'V41PharmaStrategyResearchLab',
  'v41 research strategy lab cloned',
  'v41 research strategy copy refined',
  'v41 market stage business-first UX',
  'v41 inner flow uses activities not steps',
  'v41 infographic flow cards',
  '시장 변화 읽기',
  '이번 단계에서는 전사 전략과제를 하나 선택하고',
  '활동 ① 전사 전략과제 선정',
  '활동 ② 전략과제 관련 정보 수집',
  '활동 ③ 추진과제·CSF·KPI 정리',
  '활동 ④ 전사 전략과제 추진계획 수립',
  '자료 찾기',
  'URL만 분리하기',
  'Perplexity 활용',
  'NotebookLM 활용',
  '보고서·슬라이드·인포그래픽',
  '전사 추진 초점',
  '전사 추진과제 후보',
  '추진과제별 CSF 후보',
  '추진과제별 KPI 후보',
  '전사전략과제 추진계획',
  '우리 팀 상황 제거',
  '팀장 관점 질문 제거',
  'ckd.v41.pharmaStrategyResearch.v1',
].join('|');
void V41_PHARMA_STRATEGY_RESEARCH_MARKERS;
void NOTEBOOK_SECTION_ALIASES;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1"><span className="text-xs font-black text-slate-500">{label}</span>{children}</label>;
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-950">{title}</h3>{description ? <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{description}</p> : null}<div className="mt-4 space-y-4">{children}</div></section>;
}

function TextArea({ value, onChange, placeholder, readOnly = false }: { value: string; onChange?: (value: string) => void; placeholder?: string; readOnly?: boolean }) {
  return <textarea className="min-h-36 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} />;
}

function ProcessOverview() {
  const items = [
    { icon: '🎯', title: '전사 전략과제 선정', text: '이번 실습에서 분석할 전사 전략과제를 선택합니다.' },
    { icon: '🔎', title: '전략과제 관련 정보 수집', text: 'Perplexity로 공개자료를 찾고, 이후 분석에 쓸 출처 URL을 정리합니다.' },
    { icon: '📊', title: '추진과제·CSF·KPI 정리', text: 'NotebookLM으로 수집 자료를 근거 기반 추진과제, CSF, KPI 후보로 정리합니다.' },
    { icon: '📝', title: '전사 전략과제 추진계획 수립', text: '보고서·슬라이드·인포그래픽 초안으로 정리해 다음 단계에서 활용합니다.' },
  ];
  return <section className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm md:p-6">
    <p className="text-xs font-black uppercase tracking-wide text-cyan-700">진행 흐름</p>
    <h2 className="mt-2 text-xl font-black text-slate-950">전사 전략과제 선정부터 추진계획 수립까지 진행합니다</h2>
    <div className="v41-infographic-flow mt-4">
      {items.map((item, index) => <div key={item.title} className="v41-flow-node"><span className="v41-flow-index">{index + 1}</span><p className="v41-flow-node-title"><span aria-hidden="true">{item.icon}</span> {item.title}</p><p className="v41-flow-node-text">{item.text}</p></div>)}
    </div>
    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-900">도구 이름은 하위 기능으로만 사용합니다. 이 단계의 목적은 Perplexity 사용법이 아니라, 전사 전략과제를 근거 기반으로 해석하고 추진계획으로 정리하는 것입니다.</div>
  </section>;
}

export function V41PharmaStrategyResearchLab() {
  const [state, setState] = useStored<PharmaStrategyResearchState>(PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, DEFAULT_PHARMA_RESEARCH_STATE);
  const [copyMessage, setCopyMessage] = useState('');
  const topic = useMemo(() => pharmaTopicOf(state.selectedTopicId), [state.selectedTopicId]);
  const pPrompt = useMemo(() => buildPerplexityPrompt(state), [state.selectedTopicId, state.customTopic]);
  const extractedUrls = useMemo(() => extractUrls(state.perplexityAnswer), [state.perplexityAnswer]);
  const webSourceUrls = useMemo(() => buildWebSourceUrlText(extractedUrls), [extractedUrls]);
  const webSourceUrlCount = extractedUrls.length;
  const analysisPrompt = useMemo(() => buildNotebookAnalysisPrompt(state), [state.selectedTopicId, state.customTopic]);
  const report = useMemo(() => buildStudioPrompt('보고서', state), [state.selectedTopicId, state.customTopic]);
  const slides = useMemo(() => buildStudioPrompt('슬라이드', state), [state.selectedTopicId, state.customTopic]);
  const infographic = useMemo(() => buildStudioPrompt('인포그래픽', state), [state.selectedTopicId, state.customTopic]);

  const update = useCallback((patch: Partial<PharmaStrategyResearchState>) => setState((current) => ({ ...current, ...patch })), [setState]);
  const copyText = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} 내용을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  }, []);

  const structureNotebookAnswer = useCallback(() => {
    const parsed = parseNotebookAnswer(state.notebookAnswer);
    const hasParsedValue = Object.values(parsed).some((value) => Boolean(value?.trim()));
    if (!hasParsedValue) {
      setCopyMessage('NotebookLM 결과에서 인식 가능한 항목 제목을 찾지 못했습니다. [전사 추진과제 후보], [추진과제별 CSF 후보], [추진과제별 KPI 후보], [추진계획 수립 쟁점], [주의해야 할 표현] 형태가 있는지 확인해 주세요.');
      return;
    }
    setState((current) => ({ ...current, issueOne: parsed.issueOne || current.issueOne, issueTwo: parsed.issueTwo || current.issueTwo, issueThree: parsed.issueThree || current.issueThree, teamImpact: parsed.teamImpact || current.teamImpact, metricQuestions: parsed.metricQuestions || current.metricQuestions, caution: parsed.caution || current.caution }));
    setCopyMessage('NotebookLM 결과를 항목별 칸에 정리했습니다. 비어 있는 항목은 기존 입력값을 유지했습니다.');
  }, [setState, state.notebookAnswer]);

  return <section className="space-y-4">
    <ProcessOverview />

    <Section title="활동 ① 전사 전략과제 선정" description="이번 실습에서 분석할 전사 전략과제를 선택합니다. 선택한 전략과제는 이후 자료 수집, CSF·KPI 정리, 추진계획 수립의 기준이 됩니다.">
      <Field label="전략 과제 선택"><select className="w-full rounded-xl border px-3 py-2" value={state.selectedTopicId} onChange={(event) => update({ selectedTopicId: event.target.value })}>{PHARMA_RESEARCH_TOPICS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950">
        <p className="font-black">전사 추진 초점</p>
        <p className="mt-1 text-emerald-800">아래 CSF와 KPI는 선택한 전사 전략과제를 이해하기 위한 전사 관점 기준입니다. 다음 활동에서 공개자료를 찾아 근거를 보강합니다.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-3"><p className="font-black text-emerald-900">전사 관점 CSF</p><p className="mt-1 text-emerald-800">핵심 성공 요인</p><ul className="mt-2 space-y-1">{topic.csfs.map((item) => <li key={item}>- {item}</li>)}</ul></div>
          <div className="rounded-2xl bg-white p-3"><p className="font-black text-emerald-900">전사 관점 KPI</p><p className="mt-1 text-emerald-800">측정 가능한 지표</p><ul className="mt-2 space-y-1">{topic.kpis.map((item) => <li key={item}>- {item}</li>)}</ul></div>
        </div>
      </div>
      <Field label="전략 과제 직접 입력"><input className="w-full rounded-xl border px-3 py-2" value={state.customTopic} onChange={(event) => update({ customTopic: event.target.value })} placeholder="예: GLP-1 비만·대사질환 포트폴리오 실행 기반 구축" /></Field>
    </Section>

    <Section title="활동 ② 전략과제 관련 정보 수집" description="선택한 전략과제와 관련된 최신 공개자료를 찾고, 이후 NotebookLM 분석에 사용할 출처 URL과 핵심 내용을 정리합니다. Perplexity와 URL 분리는 이 활동의 하위 기능입니다.">
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950">Perplexity에는 선택한 전사 전략과제와 관련된 최신 공개자료만 찾게 합니다. 추진과제, CSF, KPI, 추진계획은 다음 활동에서 소스 기반으로 정리합니다.</div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(pPrompt, 'Perplexity 자료 찾기 프롬프트')}>Perplexity 프롬프트 복사</button>
      {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{pPrompt}</pre>
      <Field label="Perplexity 검색 결과 붙여넣기"><TextArea value={state.perplexityAnswer} onChange={(value) => update({ perplexityAnswer: value })} placeholder="자료 목록, 요약, URL을 그대로 붙여넣으세요." /></Field>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-black text-slate-700">분리된 URL: {webSourceUrlCount}개</div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(webSourceUrls, 'NotebookLM 웹 소스 URL')}>URL 목록 복사</button>
      <Field label="NotebookLM에 등록할 출처 URL"><TextArea value={webSourceUrls} readOnly /></Field>
    </Section>

    <Section title="활동 ③ 추진과제·CSF·KPI 정리" description="수집한 공개자료를 바탕으로 전사 전략과제를 실행하기 위한 추진과제, 핵심성공요인(CSF), 측정 가능한 KPI 후보를 정리합니다. AI 결과를 그대로 확정하지 말고, 근거가 있는 항목과 추정이 섞인 항목을 구분하세요.">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950">앞 활동에서 분리한 URL을 NotebookLM 웹 소스로 등록한 뒤, 아래 프롬프트로 전사 추진과제 후보, 추진과제별 CSF, 추진과제별 KPI를 정리합니다.</div>
      <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(analysisPrompt, 'NotebookLM 분석 질문')}>NotebookLM 프롬프트 복사</button>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{analysisPrompt}</pre>
      <Field label="NotebookLM 결과 붙여넣기"><TextArea value={state.notebookAnswer} onChange={(value) => update({ notebookAnswer: value })} /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={structureNotebookAnswer}>결과 항목별 정리</button>
      <div className="grid gap-3 md:grid-cols-2"><Field label="핵심 변화 신호"><TextArea value={state.issueOne} onChange={(value) => update({ issueOne: value })} /></Field><Field label="전사 추진과제 후보"><TextArea value={state.issueTwo} onChange={(value) => update({ issueTwo: value })} /></Field><Field label="추진과제별 CSF 후보"><TextArea value={state.issueThree} onChange={(value) => update({ issueThree: value })} /></Field><Field label="근거 요약"><TextArea value={state.teamImpact} onChange={(value) => update({ teamImpact: value })} /></Field></div>
      <Field label="추진과제별 KPI 후보와 추진계획 수립 쟁점"><TextArea value={state.metricQuestions} onChange={(value) => update({ metricQuestions: value })} /></Field>
      <Field label="주의해야 할 표현"><TextArea value={state.caution} onChange={(value) => update({ caution: value })} /></Field>
    </Section>

    <Section title="활동 ④ 전사 전략과제 추진계획 수립" description="정리한 추진과제, CSF, KPI를 바탕으로 전사 전략과제 추진계획 초안을 만듭니다. 결과물은 보고서·슬라이드·인포그래픽 형태로 정리할 수 있습니다.">
      <Field label="보고서형 추진계획 프롬프트"><TextArea value={report} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(report, '보고서형 추진계획 프롬프트')}>보고서형 프롬프트 복사</button><TextArea value={state.reportDraft} onChange={(value) => update({ reportDraft: value })} placeholder="LM Studio에서 생성한 보고서 초안을 붙여넣으세요." />
      <Field label="슬라이드형 추진계획 프롬프트"><TextArea value={slides} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slides, '슬라이드형 추진계획 프롬프트')}>슬라이드형 프롬프트 복사</button><TextArea value={state.slideDraft} onChange={(value) => update({ slideDraft: value })} placeholder="LM Studio에서 생성한 슬라이드 구성안을 붙여넣으세요." />
      <Field label="인포그래픽형 추진계획 프롬프트"><TextArea value={infographic} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographic, '인포그래픽형 추진계획 프롬프트')}>인포그래픽형 프롬프트 복사</button><TextArea value={state.infographicDraft} onChange={(value) => update({ infographicDraft: value })} placeholder="LM Studio에서 생성한 인포그래픽 초안을 붙여넣으세요." />
      <Field label="전략회의 메모"><TextArea value={state.meetingMemo} onChange={(value) => update({ meetingMemo: value })} /></Field>
      <Field label="예상 질문"><TextArea value={state.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} /></Field>
    </Section>
  </section>;
}
