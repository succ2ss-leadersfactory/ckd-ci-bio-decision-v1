import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const STORAGE_KEY = 'ckd.v40-vnext.pharmaStrategyResearch.v1';

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
  'NotebookLM 소스 등록하기',
  'NotebookLM 소스 제목 복사',
  'NotebookLM 소스 본문 복사',
  'NotebookLM 소스 TXT 다운로드',
  'NotebookLM 소스 기반 전략 과제 압축',
  'NotebookLM 프롬프트 복사',
  'NotebookLM 분석 질문 복사',
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

function topicOf(state: State) {
  return TOPICS.find((item) => item.id === state.selectedTopicId) ?? TOPICS[0];
}

function titleOf(state: State) {
  return state.customTopic.trim() || topicOf(state).title;
}

function safeRule() {
  return '실제 고객명·기관명·의료진명·제품명·내부 수치·개인정보는 제외하고, 단정적 비교·비방·허가 범위 밖 암시 표현은 피합니다.';
}

function buildPerplexityPrompt(state: State) {
  return `2026년 현재 제약·바이오 산업에서 중요한 전략 과제인 "${titleOf(state)}"에 대해 최신 공개자료를 찾아주세요.

목적:
C1바이오 영업팀장 교육 실습에서 NotebookLM에 넣을 신뢰 가능한 소스 자료를 수집하려고 합니다.

중요:
전략 제안이나 실행계획을 만들지 말고, 최신 자료와 출처 URL을 찾는 데 집중해 주세요. 영업팀 추진 과제, KPI, 2주 실행계획, 주의 표현은 나중에 NotebookLM에서 소스 기반으로 분석할 예정입니다.

우리 팀 상황 참고:
${state.teamSituation}

영업팀 관점 참고 질문:
${state.leaderQuestion || topicOf(state).focus}

찾아야 할 자료:
1. 2025~2026년 제약·바이오 산업 전망 자료
2. 선택한 전략 과제와 관련된 산업 리포트, 정책·규제 자료, 협회 자료, 신뢰 가능한 기사
3. FDA, EMA, MFDS, KHIDI, 보건산업 관련 기관, 제약·바이오 협회, 컨설팅사 자료
4. 영업팀이 고객 질문과 실행관리 기준을 만들 때 참고할 수 있는 자료

출력 형식:
아래 형식으로만 정리해 주세요. 전략 요약, 추진 과제, 실행 리스크, KPI는 작성하지 마세요.

[자료 1]
- 제목:
- 발행기관/매체:
- 발행일 또는 최근성:
- 핵심 내용 2줄:
- URL:

[자료 2]
- 제목:
- 발행기관/매체:
- 발행일 또는 최근성:
- 핵심 내용 2줄:
- URL:

[자료 3]
...

주의:
- URL이 없는 자료는 제외하세요.
- 가능하면 8~12개 자료를 제시해 주세요.
- 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 정보는 포함하지 마세요.
- 처방 유도, 경쟁사 비방, 비교 우위 단정, 허가 외 사용 암시 표현은 쓰지 마세요.
- ${safeRule()}`;
}

function extractUrls(text: string) {
  const matches = text.match(/https?:\/\/[^\s)\]]+/g) ?? [];
  return Array.from(new Set(matches.map((url) => url.replace(/[.,;:]+$/g, '').trim()).filter(Boolean)));
}

function buildWebSourceUrlText(state: State) {
  const urls = extractUrls(state.perplexityAnswer);
  if (urls.length === 0) return 'Perplexity 답변에서 URL을 찾지 못했습니다. Perplexity 답변에 출처 링크가 포함되어 있는지 확인하세요.';
  return urls.join('\n');
}

function buildNotebookSourceTitle(state: State) {
  return `2026년 제약업계 전략 과제 리서치 - ${titleOf(state)}`;
}

function buildNotebookSourceBody(state: State) {
  return `이 자료는 2026년 제약·바이오 산업 전략 과제 "${titleOf(state)}"가 C1바이오 영업팀의 실행관리와 고객 접점 운영에 주는 영향을 정리하기 위한 공개자료 기반 리서치 메모이다.

1. 전략 과제
${titleOf(state)}

2. 우리 팀 상황
${state.teamSituation}

3. 영업팀 관점의 리서치 질문
${state.leaderQuestion || topicOf(state).focus}

4. Perplexity에서 찾은 공개자료 목록
${state.perplexityAnswer || '아직 Perplexity 답변이 붙여넣어지지 않았습니다. Perplexity 답변을 먼저 붙여넣은 뒤 이 본문을 다시 복사하세요.'}

5. NotebookLM에서 분석할 관점
- 소스들이 공통적으로 말하는 2026년 변화 신호
- 고객 질문과 영업활동 기록에 영향을 주는 쟁점
- 팀원이 2주 안에 확인할 수 있는 실행 신호
- 팀장이 중간 점검에서 물어볼 질문
- 표현 안전성, 사실 확인 가능성, 내부 확인 필요 여부

6. 주의해야 할 표현
${safeRule()}`;
}

function buildNotebookSourceFileText(state: State) {
  return `${buildNotebookSourceTitle(state)}

${buildNotebookSourceBody(state)}`;
}

function buildNotebookAnalysisPrompt(state: State) {
  return `업로드한 소스만 근거로 분석해 주세요.

나는 C1바이오 영업팀장 이대호 팀장입니다. 2026년 제약업계 전략 과제 "${titleOf(state)}"를 영업팀 추진계획으로 바꾸려고 합니다.

요청:
1. 소스에 근거한 핵심 변화 신호를 3개로 정리해 주세요.
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

function buildStudioPrompt(kind: '보고서' | '슬라이드' | '인포그래픽', state: State) {
  const base = `LM Studio ${kind} 생성 요청

목적:
2026년 제약업계 전략 과제 "${titleOf(state)}"를 C1바이오 영업팀 추진계획으로 설명하는 교육용 전략회의 자료를 만든다.

핵심 내용:
- 추진 과제 1: ${state.issueOne || '영업팀 추진 과제 1'}
- 추진 과제 2: ${state.issueTwo || '영업팀 추진 과제 2'}
- 추진 과제 3: ${state.issueThree || '영업팀 추진 과제 3'}
- 우리 팀 실행 영향: ${state.teamImpact || '우리 팀 실행 영향'}
- 2주 실행관리 질문: ${state.metricQuestions || '2주 실행관리 질문'}
- 주의 표현: ${state.caution || '주의해야 할 표현'}

주의:
${safeRule()}`;
  if (kind === '보고서') return `${base}

요청 형식:
1~2페이지 보고서 초안. 배경, 변화 신호, 추진 과제 3개, 2주 실행관리 질문, KPI 후보, 리스크 표현 점검 순서.`;
  if (kind === '슬라이드') return `${base}

요청 형식:
발표용 8장 슬라이드 구성안. 각 장은 제목, 핵심 메시지, 시각화 아이디어, 발표자 메모 포함.`;
  return `${base}

요청 형식:
1페이지 인포그래픽 구조. 상단 핵심 메시지, 중단 추진 과제 3개, 하단 2주 실행관리 질문과 KPI 후보.`;
}

function sanitizeFileName(text: string) {
  return text.replace(/[\\/:*?"<>|]/g, ' ').replace(/\s+/g, '_').slice(0, 60);
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
  const pPrompt = useMemo(() => buildPerplexityPrompt(state), [state]);
  const webSourceUrls = useMemo(() => buildWebSourceUrlText(state), [state]);
  const webSourceUrlCount = useMemo(() => extractUrls(state.perplexityAnswer).length, [state.perplexityAnswer]);
  const sourceTitle = useMemo(() => buildNotebookSourceTitle(state), [state]);
  const sourceBody = useMemo(() => buildNotebookSourceBody(state), [state]);
  const sourceFileText = useMemo(() => buildNotebookSourceFileText(state), [state]);
  const analysisPrompt = useMemo(() => buildNotebookAnalysisPrompt(state), [state]);
  const report = useMemo(() => buildStudioPrompt('보고서', state), [state]);
  const slides = useMemo(() => buildStudioPrompt('슬라이드', state), [state]);
  const infographic = useMemo(() => buildStudioPrompt('인포그래픽', state), [state]);
  const update = (patch: Partial<State>) => setState({ ...state, ...patch });
  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${label} 내용을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  };
  const downloadSourceFile = () => {
    const blob = new Blob([sourceFileText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${sanitizeFileName(sourceTitle)}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setCopyMessage('NotebookLM 업로드용 TXT 파일을 다운로드했습니다. NotebookLM에서 소스 추가 → 파일 업로드로 넣어 주세요.');
  };

  return <section className="space-y-4">
    <Section title="1단계: Perplexity로 최신 공개자료와 URL 찾기">
      <Field label="2026년 전략 과제 선택"><select className="w-full rounded-xl border px-3 py-2" value={state.selectedTopicId} onChange={(event) => update({ selectedTopicId: event.target.value })}>{TOPICS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></Field>
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950"><p className="font-black">이 과제의 영업팀 추진 초점</p><p className="mt-1">{topic.focus}</p><p className="mt-1">KPI 후보: {topic.kpis.join(' · ')}</p></div>
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

    <Section title="3단계: NotebookLM 소스 등록하기">
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">
        먼저 2단계에서 분리한 URL을 NotebookLM의 웹 소스로 등록합니다. 웹 URL이 등록되지 않거나 자료 전체를 보조 소스로 넣고 싶다면 TXT 파일 다운로드를 사용하세요.
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(sourceTitle, 'NotebookLM 소스 제목')}>NotebookLM 소스 제목 복사</button>
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(sourceBody, 'NotebookLM 소스 본문')}>NotebookLM 소스 본문 복사</button>
        <button type="button" className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-black text-white" onClick={downloadSourceFile}>NotebookLM 소스 TXT 다운로드</button>
      </div>
      <Field label="NotebookLM 소스 제목"><input className="w-full rounded-xl border px-3 py-2" value={sourceTitle} readOnly /></Field>
      <Field label="NotebookLM 소스 본문"><TextArea value={sourceBody} readOnly /></Field>
    </Section>

    <Section title="4단계: NotebookLM 소스 기반 전략 과제 압축">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-950">
        NotebookLM에 웹 소스 또는 TXT 보조 소스를 등록한 뒤, 아래 프롬프트를 채팅창에 붙여넣어 소스 기반으로 전략 과제와 2주 실행관리 질문을 압축합니다.
      </div>
      <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(analysisPrompt, 'NotebookLM 분석 질문')}>NotebookLM 프롬프트 복사</button>
      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{analysisPrompt}</pre>
      <Field label="NotebookLM 결과 붙여넣기"><TextArea value={state.notebookAnswer} onChange={(value) => update({ notebookAnswer: value })} /></Field>
      <div className="grid gap-3 md:grid-cols-2"><Field label="추진 과제 1"><TextArea value={state.issueOne} onChange={(value) => update({ issueOne: value })} /></Field><Field label="추진 과제 2"><TextArea value={state.issueTwo} onChange={(value) => update({ issueTwo: value })} /></Field><Field label="추진 과제 3"><TextArea value={state.issueThree} onChange={(value) => update({ issueThree: value })} /></Field><Field label="우리 팀 실행 영향"><TextArea value={state.teamImpact} onChange={(value) => update({ teamImpact: value })} /></Field></div>
      <Field label="2주 실행관리 질문과 KPI 후보"><TextArea value={state.metricQuestions} onChange={(value) => update({ metricQuestions: value })} /></Field>
      <Field label="주의해야 할 표현"><TextArea value={state.caution} onChange={(value) => update({ caution: value })} /></Field>
    </Section>

    <Section title="5단계: LM Studio 보고서·슬라이드·인포그래픽 생성 요청">
      <Field label="LM Studio 보고서 생성 요청"><TextArea value={report} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(report, 'LM Studio 보고서 생성 요청')}>보고서 요청문 복사</button><TextArea value={state.reportDraft} onChange={(value) => update({ reportDraft: value })} placeholder="LM Studio에서 생성한 보고서 초안을 붙여넣으세요." />
      <Field label="LM Studio 슬라이드 생성 요청"><TextArea value={slides} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(slides, 'LM Studio 슬라이드 생성 요청')}>슬라이드 요청문 복사</button><TextArea value={state.slideDraft} onChange={(value) => update({ slideDraft: value })} placeholder="LM Studio에서 생성한 슬라이드 구성안을 붙여넣으세요." />
      <Field label="LM Studio 인포그래픽 생성 요청"><TextArea value={infographic} readOnly /></Field><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(infographic, 'LM Studio 인포그래픽 생성 요청')}>인포그래픽 요청문 복사</button><TextArea value={state.infographicDraft} onChange={(value) => update({ infographicDraft: value })} placeholder="LM Studio에서 생성한 인포그래픽 초안을 붙여넣으세요." />
      <Field label="전략회의 메모"><TextArea value={state.meetingMemo} onChange={(value) => update({ meetingMemo: value })} /></Field>
      <Field label="예상 질문"><TextArea value={state.expectedQuestions} onChange={(value) => update({ expectedQuestions: value })} /></Field>
    </Section>
  </section>;
}
