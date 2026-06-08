import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const STORAGE_KEY = 'ckd.v40-vnext.pharmaStrategyResearch.v1';

const V40_VNEXT_PHARMA_STRATEGY_RESEARCH_MARKERS = [
  'V40VNextPharmaStrategyResearchLab',
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
void V40_VNEXT_PHARMA_STRATEGY_RESEARCH_MARKERS;

type Topic = { id: string; title: string; focus: string; kpis: string[] };
type State = {
  selectedTopicId: string;
  customTopic: string;
  teamSituation: string;
  leaderQuestion: string;
  perplexityAnswer: string;
  notebookAnswer: string;
  issueOne: string;
  issueTwo: string;
  issueThree: string;
  teamImpact: string;
  metricQuestions: string;
  caution: string;
  reportDraft: string;
  slideDraft: string;
  infographicDraft: string;
  meetingMemo: string;
  expectedQuestions: string;
};

const TOPICS: Topic[] = [
  { id: 'ai-commercial', title: 'AI 기반 영업·마케팅 실행관리 고도화', focus: 'AI 결과를 고객 접점 준비, 기록 품질, 후속 질문으로 바꾸는 기준을 세웁니다.', kpis: ['AI 활용 전 안전성 점검률', '고객 질문 기록률', '후속 실행안 작성률', '위험 표현 수정 건수'] },
  { id: 'market-access', title: '약가·급여·시장접근성 변화 대응', focus: '가치 근거, 자료 요청, 사용 맥락 질문을 안전하게 기록하고 후속 대응으로 연결합니다.', kpis: ['가치 근거 질문 기록률', '승인자료 기반 후속 대응률', '자료 요청 처리 리드타임', '고객 관심 주제 분류율'] },
  { id: 'patent-portfolio', title: '특허만료·제네릭/바이오시밀러 경쟁 대응', focus: '고객 세그먼트별 질문, 대체 선택 기준, 안전한 후속 커뮤니케이션을 정리합니다.', kpis: ['핵심 고객군별 질문 기록률', '후속 접점 확보율', '경쟁 비교 위험표현 수정 건수', '세그먼트별 실행 완료율'] },
  { id: 'cdmo-cmo', title: 'CDMO/CMO 전략 확대와 공급·품질 신뢰 강화', focus: '공급·품질 관련 고객 우려를 듣고 내부 확인 필요 이슈와 설명 가능 범위를 구분합니다.', kpis: ['공급·품질 문의 기록률', '내부 확인 필요 이슈 공유건수', '고객 우려 후속 확인율', '안전 답변 가이드 활용률'] },
  { id: 'therapy-growth', title: '비만·대사질환·항암·면역 등 고성장 치료영역 대응', focus: '고객 질문과 승인자료 기반 후속 대화를 안전하게 연결합니다.', kpis: ['치료영역 질문 기록률', '승인자료 기반 대화율', '후속 정보 제공 계획률', '고객 의도 단정 표현 수정건수'] },
  { id: 'digital-journey', title: '디지털 채널·환자 여정 기반 고객 접점 혁신', focus: '방문, 비대면, 자료 제공, 후속 확인을 하나의 고객 접점 흐름으로 설계합니다.', kpis: ['대체 접점 실행률', '자료 제공 후 후속 확인율', '채널별 고객 반응 기록률', '2주 접점 흐름 완료율'] },
];

const DEFAULT_STATE: State = {
  selectedTopicId: TOPICS[0].id,
  customTopic: '',
  teamSituation: 'C1바이오 영업팀이 2026년 제약업계 전략 과제를 바탕으로 2주 실행관리 계획을 세워야 한다.',
  leaderQuestion: '',
  perplexityAnswer: '',
  notebookAnswer: '',
  issueOne: '',
  issueTwo: '',
  issueThree: '',
  teamImpact: '',
  metricQuestions: '',
  caution: '',
  reportDraft: '',
  slideDraft: '',
  infographicDraft: '',
  meetingMemo: '',
  expectedQuestions: '',
};

function topicOf(state: State) { return TOPICS.find((item) => item.id === state.selectedTopicId) ?? TOPICS[0]; }
function titleOf(state: State) { return state.customTopic.trim() || topicOf(state).title; }
function safeRule() { return '실제 고객명·기관명·의료진명·제품명·내부 수치·개인정보는 제외하고, 단정적 비교·비방·허가 범위 밖 암시 표현은 피합니다.'; }

function perplexityPrompt(state: State) {
  return `2026년 현재 제약·바이오 산업의 전략 과제 "${titleOf(state)}"를 공개자료 기반으로 조사해 주세요.\n\n목적: C1바이오 영업팀장 이대호 팀장이 이 과제를 영업팀 추진계획으로 바꾸기 위한 실습 자료를 만들려고 합니다.\n\n우리 팀 상황:\n${state.teamSituation}\n\n영업팀 관점의 질문:\n${state.leaderQuestion || topicOf(state).focus}\n\n조사 기준:\n1. 2025~2026년 공개자료, 정책·규제 자료, 산업 리포트, 보도자료, 신뢰 가능한 기사 중심으로 정리\n2. 글로벌 동향과 한국 제약영업 현장에 주는 의미 구분\n3. 출처명, 발행기관, 날짜 또는 최근성 단서 제시\n4. 영업팀이 2주 안에 실행관리로 바꿀 수 있는 추진 과제 후보 제안\n5. ${safeRule()}\n\n출력 형식:\n[2026 전략 과제 요약]\n[핵심 변화 신호]\n[근거/출처]\n[영업팀 추진 기회]\n[영업팀 실행 리스크]\n[2주 실행관리 질문]\n[주의해야 할 표현]`;
}

function sourceBundle(state: State) {
  return `NotebookLM 소스 묶음\n\n[전략 과제]\n${titleOf(state)}\n\n[우리 팀 상황]\n${state.teamSituation}\n\n[영업팀 관점 질문]\n${state.leaderQuestion || topicOf(state).focus}\n\n[Perplexity 공개자료 리서치 결과]\n${state.perplexityAnswer || 'Perplexity 답변을 먼저 붙여넣은 뒤 다시 복사하세요.'}\n\n[소스 확인 기준]\n- 실제로 열리는 공개자료 링크와 자료명을 우선 사용합니다.\n- 2025~2026년 자료, 공식기관, 협회, 기업 발표, 신뢰 가능한 언론을 우선합니다.\n- ${safeRule()}`;
}

function notebookPrompt(state: State) {
  return `NotebookLM 전략 과제 분석 프롬프트\n\n역할: 제약산업 전략과 제약영업 실행관리를 모두 이해하는 분석가 관점에서 봐주세요.\n\n맥락: 나는 C1바이오 영업팀장 이대호 팀장입니다. 업로드한 공개자료 소스만 근거로 2026년 제약업계 전략 과제를 우리 영업팀 추진계획으로 바꾸려고 합니다.\n\n전략 과제: ${titleOf(state)}\n우리 팀 상황: ${state.teamSituation}\n\n요청:\n1. 업로드된 소스에 근거한 핵심 변화 신호 정리\n2. 고객 대화, 실행관리, 팀원 코칭에 주는 영향 설명\n3. 영업팀 추진 과제 3개로 압축\n4. 각 추진 과제를 2주 실행관리 질문과 KPI 후보로 전환\n5. ${safeRule()}\n\n출력 형식:\n[핵심 변화 신호]\n[출처/근거 요약]\n[영업팀 추진 과제 1]\n[영업팀 추진 과제 2]\n[영업팀 추진 과제 3]\n[우리 팀 실행 영향]\n[2주 실행관리 질문]\n[KPI 후보]\n[주의해야 할 표현]`;
}

function studioPrompt(kind: '보고서' | '슬라이드' | '인포그래픽', state: State) {
  const base = `LM Studio ${kind} 생성 요청\n\n목적: 2026년 제약업계 전략 과제 "${titleOf(state)}"를 C1바이오 영업팀 추진계획으로 설명하는 교육용 전략회의 자료를 만든다.\n\n핵심 내용:\n- 추진 과제 1: ${state.issueOne || '영업팀 추진 과제 1'}\n- 추진 과제 2: ${state.issueTwo || '영업팀 추진 과제 2'}\n- 추진 과제 3: ${state.issueThree || '영업팀 추진 과제 3'}\n- 우리 팀 실행 영향: ${state.teamImpact || '우리 팀 실행 영향'}\n- 2주 실행관리 질문: ${state.metricQuestions || '2주 실행관리 질문'}\n- 주의 표현: ${state.caution || '주의해야 할 표현'}\n\n주의: ${safeRule()}`;
  if (kind === '보고서') return `${base}\n\n요청 형식: 1~2페이지 보고서 초안. 배경, 변화 신호, 추진 과제 3개, 2주 실행관리 질문, KPI 후보, 리스크 표현 점검 순서.`;
  if (kind === '슬라이드') return `${base}\n\n요청 형식: 발표용 8장 슬라이드 구성안. 각 장은 제목, 핵심 메시지, 시각화 아이디어, 발표자 메모 포함.`;
  return `${base}\n\n요청 형식: 1페이지 인포그래픽 구조. 상단 핵심 메시지, 중단 추진 과제 3개, 하단 2주 실행관리 질문과 KPI 후보.`;
}

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
  const [state, setState] = useStored<State>(STORAGE_KEY, DEFAULT_STATE);
  const [copyMessage, setCopyMessage] = useState('');
  const topic = topicOf(state);
  const pPrompt = useMemo(() => perplexityPrompt(state), [state]);
  const nSource = useMemo(() => sourceBundle(state), [state]);
  const nPrompt = useMemo(() => notebookPrompt(state), [state]);
  const report = useMemo(() => studioPrompt('보고서', state), [state]);
  const slides = useMemo(() => studioPrompt('슬라이드', state), [state]);
  const infographic = useMemo(() => studioPrompt('인포그래픽', state), [state]);
  const update = (patch: Partial<State>) => setState({ ...state, ...patch });
  const copyText = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); setCopyMessage(`${label} 내용을 복사했습니다.`); } catch { setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.'); }
  };
  return <section className="space-y-4">
    <Section title="1단계: 2026년 제약업계 전략 과제 선택과 Perplexity 탐색">
      <Field label="2026년 전략 과제 선택"><select className="w-full rounded-xl border px-3 py-2" value={state.selectedTopicId} onChange={(event) => update({ selectedTopicId: event.target.value })}>{TOPICS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950"><p className="font-black">이 과제의 영업팀 추진 초점</p><p className="mt-1">{topic.focus}</p><p className="mt-1">KPI 후보: {topic.kpis.join(' · ')}</p></div>
      <Field label="전략 과제 직접 입력"><input className="w-full rounded-xl border px-3 py-2" value={state.customTopic} onChange={(event) => update({ customTopic: event.target.value })} placeholder="예: CDMO/CMO 전략 확대와 영업팀 고객가치 제안" /></Field>
      <Field label="우리 팀 상황"><TextArea value={state.teamSituation} onChange={(value) => update({ teamSituation: value })} /></Field>
      <Field label="영업팀 관점의 리서치 질문"><TextArea value={state.leaderQuestion} onChange={(value) => update({ leaderQuestion: value })} placeholder="예: 이 전략 과제를 영업팀의 고객 대화, 2주 실행관리, 팀원 코칭으로 어떻게 바꿀 수 있을까?" /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(pPrompt, 'Perplexity 전략 과제 프롬프트')}>Perplexity 프롬프트 복사</button>
      {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{pPrompt}</pre>
      <Field label="Perplexity 답변 붙여넣기"><TextArea value={state.perplexityAnswer} onChange={(value) => update({ perplexityAnswer: value })} placeholder="Perplexity 답변을 붙여넣으세요. 출처, 발행기관, 날짜가 포함되어 있으면 좋습니다." /></Field>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(nSource, 'NotebookLM 소스 묶음')}>NotebookLM 소스 묶음 복사</button>
    </Section>
    <Section title="2단계: NotebookLM 소스 기반 전략 과제 압축">
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(nPrompt, 'NotebookLM 전략 과제 분석 프롬프트')}>NotebookLM 프롬프트 복사</button>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{nPrompt}</pre>
      <Field label="NotebookLM 결과 붙여넣기"><TextArea value={state.notebookAnswer} onChange={(value) => update({ notebookAnswer: value })} /></Field>
      <div className="grid gap-3 md:grid-cols-2"><Field label="추진 과제 1"><TextArea value={state.issueOne} onChange={(value) => update({ issueOne: value })} /></Field><Field label="추진 과제 2"><TextArea value={state.issueTwo} onChange={(value) => update({ issueTwo: value })} /></Field><Field label="추진 과제 3"><TextArea value={state.issueThree} onChange={(value) => update({ issueThree: value })} /></Field><Field label="우리 팀 실행 영향"><TextArea value={state.teamImpact} onChange={(value) => update({ teamImpact: value })} /></Field></div>
      <Field label="2주 실행관리 질문과 KPI 후보"><TextArea value={state.metricQuestions} onChange={(value) => update({ metricQuestions: value })} /></Field>
      <Field label="주의해야 할 표현"><TextArea value={state.caution} onChange={(value) => update({ caution: value })} /></Field>
    </Section>
    <Section title="3단계: LM Studio 보고서·슬라이드·인포그래픽 생성 요청">
      <Field label="LM Studio 보고서 생성 요청"><TextArea value={report} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(report, 'LM Studio 보고서 생성 요청')}>보고서 요청문 복사</button><TextArea value={state.reportDraft} onChange={(value) => update({ reportDraft: value })} placeholder="LM Studio에서 생성한 보고서 초안을 붙여넣으세요." />
      <Field label="LM Studio 슬라이드 생성 요청"><TextArea value={slides} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slides, 'LM Studio 슬라이드 생성 요청')}>슬라이드 요청문 복사</button><TextArea value={state.slideDraft} onChange={(value) => update({ slideDraft: value })} placeholder="LM Studio에서 생성한 슬라이드 구성안을 붙여넣으세요." />
      <Field label="LM Studio 인포그래픽 생성 요청"><TextArea value={infographic} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographic, 'LM Studio 인포그래픽 생성 요청')}>인포그래픽 요청문 복사</button><TextArea value={state.infographicDraft} onChange={(value) => update({ infographicDraft: value })} placeholder="LM Studio에서 생성한 인포그래픽 초안을 붙여넣으세요." />
      <Field label="전략회의 메모"><TextArea value={state.meetingMemo} onChange={(value) => update({ meetingMemo: value })} /></Field>
      <Field label="예상 질문"><TextArea value={state.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} /></Field>
    </Section>
  </section>;
}
