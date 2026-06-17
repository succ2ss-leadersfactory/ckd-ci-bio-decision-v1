import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import {
  DEFAULT_PHARMA_RESEARCH_STATE,
  PHARMA_RESEARCH_TOPICS,
  PHARMA_STRATEGY_RESEARCH_STORAGE_KEY,
  pharmaTopicOf,
  type PharmaStrategyResearchState,
} from './journey-v40-vnext-pharma-research-data';
import {
  buildNotebookAnalysisPrompt,
  buildPerplexityPrompt,
  buildStudioPrompt,
} from './journey-v40-vnext-pharma-research-prompts';
import {
  buildWebSourceUrlText,
  extractUrls,
  NOTEBOOK_SECTION_ALIASES,
  parseNotebookAnswer,
} from './journey-v40-vnext-pharma-research-parser';

const V40_VNEXT_PHARMA_STRATEGY_RESEARCH_MARKERS = [
  'V40VNextPharmaStrategyResearchLab',
  '2026년 제약업계 전략 과제 선택',
  '영업팀 추진계획 수립 실습',
  'Perplexity 최신자료 검색 전용 프롬프트',
  'Perplexity 전략 과제 프롬프트',
  '전략 제안이나 실행계획을 만들지 말고',
  'URL이 없는 자료는 제외',
  'Perplexity 출처 URL만 분리',
  'NotebookLM 웹 소스 URL 복사',
  '분리된 웹 소스 URL',
  'NotebookLM 소스 기반 전략 과제 압축',
  'NotebookLM 프롬프트 복사',
  'NotebookLM 분석 질문 복사',
  'NotebookLM 결과 항목별로 정리하기',
  'LM Studio 보고서 생성 요청',
  'LM Studio 슬라이드 생성 요청',
  'LM Studio 인포그래픽 생성 요청',
  '업로드한 소스와 3단계 정리 결과를 근거로',
  '산출물 형식만 지시',
  'URL 추출 1회 계산',
  '핸들러 useCallback 안정화',
  '토픽 데이터 분리',
  '프롬프트 생성 분리',
  'NotebookLM 파서 분리',
  'ckd.v40-vnext.pharmaStrategyResearch.v1',
].join('|');
void V40_VNEXT_PHARMA_STRATEGY_RESEARCH_MARKERS;
void NOTEBOOK_SECTION_ALIASES;

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block space-y-1"><span className="text-xs font-black text-slate-500">{label}</span>{children}</label>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function TextArea({ value, onChange, placeholder, readOnly = false }: { value: string; onChange?: (value: string) => void; placeholder?: string; readOnly?: boolean }) {
  return <textarea className="min-h-36 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={value} readOnly={readOnly} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} />;
}

export function V40VNextPharmaStrategyResearchLab() {
  const [state, setState] = useStored<PharmaStrategyResearchState>(PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, DEFAULT_PHARMA_RESEARCH_STATE);
  const [copyMessage, setCopyMessage] = useState('');
  const topic = useMemo(() => pharmaTopicOf(state.selectedTopicId), [state.selectedTopicId]);
  const pPrompt = useMemo(() => buildPerplexityPrompt(state), [state.selectedTopicId, state.customTopic, state.teamSituation, state.leaderQuestion]);
  const extractedUrls = useMemo(() => extractUrls(state.perplexityAnswer), [state.perplexityAnswer]);
  const webSourceUrls = useMemo(() => buildWebSourceUrlText(extractedUrls), [extractedUrls]);
  const webSourceUrlCount = extractedUrls.length;
  const analysisPrompt = useMemo(() => buildNotebookAnalysisPrompt(state), [state.selectedTopicId, state.customTopic]);
  const report = useMemo(() => buildStudioPrompt('보고서', state), [state.selectedTopicId, state.customTopic, state.teamSituation]);
  const slides = useMemo(() => buildStudioPrompt('슬라이드', state), [state.selectedTopicId, state.customTopic, state.teamSituation]);
  const infographic = useMemo(() => buildStudioPrompt('인포그래픽', state), [state.selectedTopicId, state.customTopic, state.teamSituation]);

  const update = useCallback((patch: Partial<PharmaStrategyResearchState>) => {
    setState((current) => ({ ...current, ...patch }));
  }, [setState]);

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
      setCopyMessage('NotebookLM 결과에서 인식 가능한 항목 제목을 찾지 못했습니다. [영업팀 추진 과제 1], [우리 팀 실행 영향], [2주 실행관리 질문], [KPI 후보], [주의해야 할 표현] 형태가 있는지 확인해 주세요.');
      return;
    }
    setState((current) => ({
      ...current,
      issueOne: parsed.issueOne || current.issueOne,
      issueTwo: parsed.issueTwo || current.issueTwo,
      issueThree: parsed.issueThree || current.issueThree,
      teamImpact: parsed.teamImpact || current.teamImpact,
      metricQuestions: parsed.metricQuestions || current.metricQuestions,
      caution: parsed.caution || current.caution,
    }));
    setCopyMessage('NotebookLM 결과를 항목별 칸에 정리했습니다. 비어 있는 항목은 기존 입력값을 유지했습니다.');
  }, [setState, state.notebookAnswer]);

  return <section className="space-y-4">
    <Section title="1단계: Perplexity로 최신 공개자료와 URL 찾기">
      <Field label="2026년 전략 과제 선택">
        <select className="w-full rounded-xl border px-3 py-2" value={state.selectedTopicId} onChange={(event) => update({ selectedTopicId: event.target.value })}>
          {PHARMA_RESEARCH_TOPICS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
      </Field>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950">
        <p className="font-black">이 과제의 영업팀 추진 초점</p>
        <p className="mt-1">{topic.focus}</p>
        <p className="mt-1">KPI 후보: {topic.kpis.join(' · ')}</p>
      </div>
      <Field label="전략 과제 직접 입력"><input className="w-full rounded-xl border px-3 py-2" value={state.customTopic} onChange={(event) => update({ customTopic: event.target.value })} placeholder="예: CDMO/CMO 전략 확대와 영업팀 고객가치 제안" /></Field>
      <Field label="우리 팀 상황"><TextArea value={state.teamSituation} onChange={(value) => update({ teamSituation: value })} /></Field>
      <Field label="영업팀 관점 참고 질문"><TextArea value={state.leaderQuestion} onChange={(value) => update({ leaderQuestion: value })} placeholder="예: 이 전략 과제를 영업팀의 고객 대화, 2주 실행관리, 팀원 코칭으로 어떻게 바꿀 수 있을까?" /></Field>
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950">Perplexity에는 답을 완성하라고 요청하지 않습니다. 최신 공개자료, 발행기관, 최근성, URL만 찾게 한 뒤 NotebookLM에서 소스 기반 분석을 진행합니다.</div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(pPrompt, 'Perplexity 최신자료 검색 전용 프롬프트')}>Perplexity 최신자료 검색 프롬프트 복사</button>
      {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{pPrompt}</pre>
      <Field label="Perplexity 자료 목록 결과 붙여넣기"><TextArea value={state.perplexityAnswer} onChange={(value) => update({ perplexityAnswer: value })} placeholder="Perplexity가 제시한 자료 목록과 URL을 그대로 붙여넣으세요. 전략 요약이나 실행계획이 아니라 자료 목록 중심이면 가장 좋습니다." /></Field>
    </Section>

    <Section title="2단계: Perplexity 결과에서 NotebookLM 웹 소스만 분리">
      <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-3 text-xs font-bold leading-5 text-cyan-950">
        NotebookLM에서 ‘웹’ 소스로 등록할 때는 분석 내용이 아니라 URL만 넣어야 합니다. 아래 URL 목록을 복사해 하나씩 웹 소스로 등록하세요. 긴 분석문은 웹 소스 입력칸에 넣지 않습니다.
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-black text-slate-700">분리된 웹 소스 URL: {webSourceUrlCount}개</div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(webSourceUrls, 'NotebookLM 웹 소스 URL')}>NotebookLM 웹 소스 URL 복사</button>
      <Field label="분리된 웹 소스 URL"><TextArea value={webSourceUrls} readOnly /></Field>
    </Section>

    <Section title="3단계: NotebookLM 소스 기반 전략 과제 압축">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950">
        2단계에서 분리한 URL을 NotebookLM 웹 소스로 등록한 뒤, 아래 프롬프트를 채팅창에 붙여넣어 소스 기반으로 전략 과제와 2주 실행관리 질문을 압축합니다.
      </div>
      <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(analysisPrompt, 'NotebookLM 분석 질문')}>NotebookLM 프롬프트 복사</button>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{analysisPrompt}</pre>
      <Field label="NotebookLM 결과 붙여넣기"><TextArea value={state.notebookAnswer} onChange={(value) => update({ notebookAnswer: value })} /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={structureNotebookAnswer}>NotebookLM 결과 항목별로 정리하기</button>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="추진 과제 1"><TextArea value={state.issueOne} onChange={(value) => update({ issueOne: value })} /></Field>
        <Field label="추진 과제 2"><TextArea value={state.issueTwo} onChange={(value) => update({ issueTwo: value })} /></Field>
        <Field label="추진 과제 3"><TextArea value={state.issueThree} onChange={(value) => update({ issueThree: value })} /></Field>
        <Field label="우리 팀 실행 영향"><TextArea value={state.teamImpact} onChange={(value) => update({ teamImpact: value })} /></Field>
      </div>
      <Field label="2주 실행관리 질문과 KPI 후보"><TextArea value={state.metricQuestions} onChange={(value) => update({ metricQuestions: value })} /></Field>
      <Field label="주의해야 할 표현"><TextArea value={state.caution} onChange={(value) => update({ caution: value })} /></Field>
    </Section>

    <Section title="4단계: LM Studio 보고서·슬라이드·인포그래픽 생성 요청">
      <Field label="LM Studio 보고서 생성 요청"><TextArea value={report} readOnly /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(report, 'LM Studio 보고서 생성 요청')}>보고서 요청문 복사</button>
      <TextArea value={state.reportDraft} onChange={(value) => update({ reportDraft: value })} placeholder="LM Studio에서 생성한 보고서 초안을 붙여넣으세요." />
      <Field label="LM Studio 슬라이드 생성 요청"><TextArea value={slides} readOnly /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slides, 'LM Studio 슬라이드 생성 요청')}>슬라이드 요청문 복사</button>
      <TextArea value={state.slideDraft} onChange={(value) => update({ slideDraft: value })} placeholder="LM Studio에서 생성한 슬라이드 구성안을 붙여넣으세요." />
      <Field label="LM Studio 인포그래픽 생성 요청"><TextArea value={infographic} readOnly /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographic, 'LM Studio 인포그래픽 생성 요청')}>인포그래픽 요청문 복사</button>
      <TextArea value={state.infographicDraft} onChange={(value) => update({ infographicDraft: value })} placeholder="LM Studio에서 생성한 인포그래픽 초안을 붙여넣으세요." />
      <Field label="전략회의 메모"><TextArea value={state.meetingMemo} onChange={(value) => update({ meetingMemo: value })} /></Field>
      <Field label="예상 질문"><TextArea value={state.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} /></Field>
    </Section>
  </section>;
}
