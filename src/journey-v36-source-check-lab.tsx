import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type ResearchSnapshot = {
  selectedTheme?: string;
  notebookSourcePack?: string;
  sourcePackMemo?: string;
  notebookLmAnswer?: string;
  studioReportDraft?: string;
  studioSlideOutline?: string;
  complianceCaution?: string;
};

type SourceCheckResponse = {
  sourceReliability: string[];
  recencyChecks: string[];
  riskyExpressions: string[];
  usableEvidence: string;
  needsVerification: string;
  excludeFromDeck: string;
  softenedExpressions: string;
  finalReflection: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const RELIABILITY_ITEMS = [
  '출처 링크 또는 원문 확인 경로가 있다',
  '공개 자료·기관 자료·보고서 등 확인 가능한 자료다',
  'Perplexity 요약이 아니라 원문 기준으로 확인했다',
  'NotebookLM 답변이 소스 기반으로 작성되었다',
  '자료 간 충돌되는 주장을 표시했다',
];

const RECENCY_ITEMS = [
  '자료 날짜가 확인된다',
  '최근 1년 내 자료인지 확인했다',
  '규정·가이드라인성 자료는 최신 개정 여부를 확인했다',
  '오래된 자료는 회의자료의 핵심 근거로 쓰지 않는다',
];

const RISK_ITEMS = [
  '효과를 단정하는 표현',
  '경쟁사·경쟁제품 비교를 단정하는 표현',
  '고객·기관·제품·내부 수치가 드러나는 표현',
  '승인되지 않은 활용·효능을 암시하는 표현',
  '출처가 약한 시장 전망을 확정적으로 말하는 표현',
  '팀원 개인 평가로 오해될 수 있는 표현',
];

const REVIEW_ITEMS = [
  '사용 가능한 근거와 추가 확인 필요한 근거를 구분했는가?',
  '최근성 확인이 필요한 자료를 표시했는가?',
  '회의자료에서 제외할 표현을 정리했는가?',
  '단정 표현을 완화 표현으로 바꾸었는가?',
  '최종 발표자료 반영 기준을 작성했는가?',
];

const DEFAULT_RESPONSE: SourceCheckResponse = {
  sourceReliability: [],
  recencyChecks: [],
  riskyExpressions: [],
  usableEvidence: '',
  needsVerification: '',
  excludeFromDeck: '',
  softenedExpressions: '',
  finalReflection: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-bold text-slate-900">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

function toggle(items: string[], item: string) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function compact(value?: string) {
  const text = (value || '').trim();
  if (!text) return '아직 Step 4 산출물이 없습니다.';
  return text.length > 1200 ? `${text.slice(0, 1200)}...` : text;
}

function buildSourceCheckPrompt(research: ResearchSnapshot, response: SourceCheckResponse) {
  return `당신은 제약영업 교육용 전략회의 자료를 검토하는 Source Check 파트너입니다.\n\n목표:\n아래 전략회의 보고서·슬라이드 초안을 그대로 믿지 말고, 출처 신뢰도, 최근성, 단정 표현, 컴플라이언스 위험 표현을 점검하세요.\n\n[리서치 주제]\n${research.selectedTheme || '-'}\n\n[NotebookLM 소스 패키지]\n${research.notebookSourcePack || research.sourcePackMemo || '-'}\n\n[NotebookLM 종합 결과]\n${research.notebookLmAnswer || '-'}\n\n[전략회의 보고서 초안]\n${research.studioReportDraft || '-'}\n\n[발표 슬라이드 구성안]\n${research.studioSlideOutline || '-'}\n\n[사용자가 체크한 출처 신뢰도]\n${response.sourceReliability.join(', ') || '-'}\n\n[사용자가 체크한 최근성]\n${response.recencyChecks.join(', ') || '-'}\n\n[사용자가 체크한 위험 표현]\n${response.riskyExpressions.join(', ') || '-'}\n\n검토 요청:\n1. 전략회의 자료에 사용 가능한 근거를 구분하세요.\n2. 추가 확인이 필요한 근거를 구분하세요.\n3. 회의자료에서 제외해야 할 표현을 지적하세요.\n4. 단정적이거나 위험한 표현을 안전한 표현으로 완화하세요.\n5. 최종 발표자료 반영 기준을 제안하세요.\n\n출력 형식:\n## 1. 사용 가능한 근거\n## 2. 추가 확인 필요한 근거\n## 3. 제외해야 할 표현\n## 4. 완화 표현 제안\n## 5. 최종 반영 기준`;
}

export function SourceCheckLab() {
  const [research] = useStored<ResearchSnapshot>(V36_STORAGE_KEYS.researchStrategy, {});
  const [storedResponse, setResponse] = useStored<SourceCheckResponse>(V36_STORAGE_KEYS.sourceCheck, DEFAULT_RESPONSE);
  const response = {
    ...DEFAULT_RESPONSE,
    ...storedResponse,
    sourceReliability: storedResponse.sourceReliability ?? [],
    recencyChecks: storedResponse.recencyChecks ?? [],
    riskyExpressions: storedResponse.riskyExpressions ?? [],
    reviewChecks: storedResponse.reviewChecks ?? {},
  };
  const [copyMessage, setCopyMessage] = useState('');
  const prompt = useMemo(() => buildSourceCheckPrompt(research, response), [research, response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<SourceCheckResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('Source Check 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `[Source Check 결과]\n\n[사용 가능한 근거]\n${response.usableEvidence}\n\n[추가 확인 필요한 근거]\n${response.needsVerification}\n\n[회의자료에서 제외할 표현]\n${response.excludeFromDeck}\n\n[완화 표현]\n${response.softenedExpressions}\n\n[최종 발표자료 반영 기준]\n${response.finalReflection}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-bold">Source Check Lab</p>
        <p className="mt-1">Step 4에서 만든 전략회의 보고서와 슬라이드를 그대로 쓰지 않고, 출처·최근성·위험 표현을 점검한 뒤 발표자료 반영 기준을 정합니다.</p>
      </div>

      <SectionCard title="1단계: Step 4 산출물 확인">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-900">NotebookLM 소스 패키지</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-700">{compact(research.notebookSourcePack || research.sourcePackMemo)}</pre></div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-900">전략회의 보고서 초안</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-700">{compact(research.studioReportDraft)}</pre></div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm md:col-span-2"><p className="font-bold text-slate-900">발표 슬라이드 구성안</p><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-700">{compact(research.studioSlideOutline)}</pre></div>
        </div>
      </SectionCard>

      <SectionCard title="2단계: 출처 신뢰도와 최근성 점검">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <FieldLabel>출처 신뢰도 체크</FieldLabel>
            <div className="mt-2 space-y-2">{RELIABILITY_ITEMS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.sourceReliability.includes(item)} onChange={() => update({ sourceReliability: toggle(response.sourceReliability, item) })} />{item}</label>)}</div>
          </div>
          <div>
            <FieldLabel>최근성 체크</FieldLabel>
            <div className="mt-2 space-y-2">{RECENCY_ITEMS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.recencyChecks.includes(item)} onChange={() => update({ recencyChecks: toggle(response.recencyChecks, item) })} />{item}</label>)}</div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="3단계: 위험 표현 점검">
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">복수 선택 가능 · 제약영업 자료에서 단정·비교·민감정보·미승인 표현은 반드시 완화하거나 제외합니다.</div>
        <div className="grid gap-2 md:grid-cols-2">{RISK_ITEMS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.riskyExpressions.includes(item)} onChange={() => update({ riskyExpressions: toggle(response.riskyExpressions, item) })} />{item}</label>)}</div>
      </SectionCard>

      <SectionCard title="4단계: AI로 Source Check 검증">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">위 체크 결과와 Step 4 산출물이 프롬프트에 반영됩니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>Source Check 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
      </SectionCard>

      <SectionCard title="5단계: 최종 반영 기준 작성">
        <label className="block space-y-1"><FieldLabel>사용 가능한 근거</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.usableEvidence} onChange={(event) => update({ usableEvidence: event.target.value })} placeholder="회의자료에 사용할 수 있는 근거를 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>추가 확인 필요한 근거</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.needsVerification} onChange={(event) => update({ needsVerification: event.target.value })} placeholder="날짜, 출처, 원문 확인이 필요한 내용을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>회의자료에서 제외할 표현</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.excludeFromDeck} onChange={(event) => update({ excludeFromDeck: event.target.value })} placeholder="제외할 문장 또는 표현을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>완화 표현</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.softenedExpressions} onChange={(event) => update({ softenedExpressions: event.target.value })} placeholder="예: 반드시 증가한다 → 증가 가능성을 점검한다" /></label>
        <label className="block space-y-1"><FieldLabel>최종 발표자료 반영 기준</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalReflection} onChange={(event) => update({ finalReflection: event.target.value })} placeholder="전략회의 자료에 반영할 기준을 작성하세요." /></label>
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.sourceCheck} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default SourceCheckLab;
