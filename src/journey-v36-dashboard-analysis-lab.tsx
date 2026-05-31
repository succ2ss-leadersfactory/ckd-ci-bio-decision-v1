import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type Member = {
  id: string;
  name: string;
  type: string;
  signal: string;
  comment: string;
  metrics: Record<string, number>;
};

type DashboardResponse = {
  selectedMemberId: string;
  intuitionJudgment: string;
  evidenceMetrics: string[];
  priorityInterpretation: string;
  causalHypothesis: string;
  aiAnswerRaw: string;
  hypotheses: string;
  counter: string;
  questions: string;
  experiments: string;
  cautions: string;
  confirmQuestion: string;
  twoWeekCommitment: string;
  recheckEvidence: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const METRIC_ORDER = ['콜실행률', '담당처커버리지', 'CRM기록충실도', '후속조치율', '고객반응지수', '성과전환지수', '팀기여지수', '실행지연'];
const INTUITION_OPTIONS = ['활동량 부족', '접점 품질 문제', '후속조치 문제', '자신감 부족', '개인플레이 문제', '변화 저항', '실행관리 문제', '판단 유보'];

const MEMBERS: Member[] = [
  { id: 'M01', name: '신재영 대리', type: '활동량 과다·성과전환 저조형', signal: '콜 실행률은 높지만 후속조치율과 성과전환지수가 낮다. 활동량보다 접점 목적과 후속 실행 품질 점검이 필요하다.', comment: '저는 누구보다 많이 움직이고 있습니다.', metrics: { 콜실행률: 112, 담당처커버리지: 96, CRM기록충실도: 64, 후속조치율: 58, 고객반응지수: 62, 성과전환지수: 54, 팀기여지수: 61, 실행지연: 2 } },
  { id: 'M02', name: '이대은 대리', type: '고성과 개인플레이형', signal: '성과전환지수와 고객반응지수는 높지만 팀기여지수가 낮다. 개인성과 인정과 팀 기여 요청의 균형이 필요하다.', comment: '각자 자기 담당처는 본인이 책임지는 게 맞지 않나요?', metrics: { 콜실행률: 91, 담당처커버리지: 88, CRM기록충실도: 72, 후속조치율: 74, 고객반응지수: 84, 성과전환지수: 128, 팀기여지수: 42, 실행지연: 1 } },
  { id: 'M03', name: '박재욱 사원', type: '신입 위축형', signal: 'CRM 기록은 성실하지만 콜 실행률과 고객반응지수가 낮다. 신입 위축과 접점 전 준비 부족 가능성을 확인해야 한다.', comment: '제가 가면 오히려 불편해하시는 것 같습니다.', metrics: { 콜실행률: 72, 담당처커버리지: 69, CRM기록충실도: 90, 후속조치율: 67, 고객반응지수: 51, 성과전환지수: 48, 팀기여지수: 70, 실행지연: 1 } },
  { id: 'M04', name: '유희관 과장', type: '경력 안정형', signal: '담당처 관계와 고객반응은 안정적이나 CRM 기록과 캠페인 실행이 낮다. 변화 요구를 현장 언어로 연결해야 한다.', comment: '현장에서는 그런 방식이 잘 안 맞습니다.', metrics: { 콜실행률: 86, 담당처커버리지: 92, CRM기록충실도: 55, 후속조치율: 63, 고객반응지수: 76, 성과전환지수: 82, 팀기여지수: 58, 실행지연: 3 } },
  { id: 'M05', name: '김문호 차장', type: '방어적 목표미달형', signal: '목표진척과 실행 속도가 모두 낮다. 외부 요인 탓으로 단정하거나 반박하기보다 데이터 기반 공동 진단이 필요하다.', comment: '이번 지역 상황은 제가 어떻게 할 수 있는 게 아닙니다.', metrics: { 콜실행률: 79, 담당처커버리지: 75, CRM기록충실도: 68, 후속조치율: 61, 고객반응지수: 60, 성과전환지수: 68, 팀기여지수: 55, 실행지연: 5 } },
  { id: 'M06', name: '김재호 차장', type: '실행지연·CRM 부실형', signal: '콜 실행은 유지되지만 CRM 기록과 후속조치율이 낮다. 완료 기준과 사후보고 기준 명확화가 필요하다.', comment: '현장 대응하느라 입력은 나중에 하게 됩니다.', metrics: { 콜실행률: 93, 담당처커버리지: 81, CRM기록충실도: 41, 후속조치율: 45, 고객반응지수: 69, 성과전환지수: 73, 팀기여지수: 62, 실행지연: 4 } },
];

const REVIEW_ITEMS = [
  '첫인상 판단을 먼저 기록했는가?',
  '판단 근거 지표를 2개 이상 선택했는가?',
  '데이터 해석과 인과 가설을 구분했는가?',
  'AI 답변을 그대로 믿지 않고 반대 가능성을 확인했는가?',
  '팀원에게 확인할 질문이 작성되어 있는가?',
  '2주 실행 약속이 행동 언어로 작성되어 있는가?',
  '2주 후 재점검할 지표와 증거가 작성되어 있는가?',
];

const DEFAULT_RESPONSE: DashboardResponse = {
  selectedMemberId: 'M01',
  intuitionJudgment: '',
  evidenceMetrics: [],
  priorityInterpretation: '',
  causalHypothesis: '',
  aiAnswerRaw: '',
  hypotheses: '',
  counter: '',
  questions: '',
  experiments: '',
  cautions: '',
  confirmQuestion: '',
  twoWeekCommitment: '',
  recheckEvidence: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-bold text-slate-900">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

function metricLabel(key: string) {
  return key === '성과전환지수' ? '성과 신호 전환지수' : key;
}

function getMember(id: string) {
  return MEMBERS.find((member) => member.id === id) ?? MEMBERS[0];
}

function toggle(items: string[], item: string) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function metricTone(value: number, key: string) {
  if (key === '실행지연') return value >= 4 ? 'border-red-200 bg-red-50' : value >= 2 ? 'border-amber-200 bg-amber-50' : 'border-cyan-200 bg-cyan-50';
  if (value >= 100) return 'border-cyan-200 bg-cyan-50';
  if (value >= 75) return 'border-amber-200 bg-amber-50';
  return 'border-red-200 bg-red-50';
}

function parseAi(raw: string) {
  const text = (raw || '').trim();
  const pick = (n: number) => text.match(new RegExp('##\\s*' + n + '[\\s\\S]*?(?=##\\s*' + (n + 1) + '|$)'))?.[0] || '';
  return { hypotheses: pick(1), counter: pick(2), questions: pick(3), experiments: pick(4), cautions: pick(5) };
}

function buildMemberPrompt(member: Member, response: DashboardResponse) {
  return `당신은 영업팀장의 데이터 기반 성과진단을 돕는 리더십 코치입니다.\n\n[팀원]\n${member.name} / ${member.type}\n\n[지표]\n${METRIC_ORDER.map((key) => `${metricLabel(key)}: ${member.metrics[key]}`).join('\n')}\n\n[팀원 발언]\n${member.comment}\n\n[팀장 첫 판단]\n${response.intuitionJudgment || '-'}\n\n[판단 근거 지표]\n${response.evidenceMetrics.map(metricLabel).join(', ') || '-'}\n\n[나의 우선 해석]\n${response.priorityInterpretation || '-'}\n\n[나의 인과 가설]\n${response.causalHypothesis || '-'}\n\n아래 제목을 그대로 사용해 답하세요.\n## 1. 가능한 인과 가설 3개\n## 2. 이 해석이 틀렸을 가능성 3개\n## 3. 팀장이 확인해야 할 질문 5개\n## 4. 2주 동안 검증할 작은 실행 실험 2개\n## 5. 성급한 판단을 피하기 위한 주의점`;
}

export function DashboardAnalysisLab() {
  const [storedResponse, setResponse] = useStored<DashboardResponse>(V36_STORAGE_KEYS.dashboardAnalysis, DEFAULT_RESPONSE);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse, evidenceMetrics: storedResponse.evidenceMetrics ?? [], reviewChecks: storedResponse.reviewChecks ?? {} };
  const [copyMessage, setCopyMessage] = useState('');
  const currentMember = getMember(response.selectedMemberId);
  const prompt = useMemo(() => buildMemberPrompt(currentMember, response), [currentMember, response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<DashboardResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('Dashboard 분석 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const applyAiAnswer = () => {
    const parsed = parseAi(response.aiAnswerRaw);
    update(parsed);
    setCopyMessage('AI 답변을 5개 검토 영역으로 분리했습니다.');
  };

  const outputText = `[팀원 Dashboard 분석]\n\n[선택 팀원]\n${currentMember.name} / ${currentMember.type}\n\n[처음 든 판단]\n${response.intuitionJudgment}\n\n[판단 근거 지표]\n${response.evidenceMetrics.map(metricLabel).join(', ')}\n\n[우선 해석]\n${response.priorityInterpretation}\n\n[인과 가설]\n${response.causalHypothesis}\n\n[확인 질문]\n${response.confirmQuestion}\n\n[2주 실행 약속]\n${response.twoWeekCommitment}\n\n[2주 후 점검할 지표/증거]\n${response.recheckEvidence}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">팀원 Dashboard 분석 Lab</p>
        <p className="mt-1">v34 Dashboard의 6명 MR 페르소나와 8개 지표를 그대로 사용합니다. 먼저 직관 판단을 기록하고, 지표 근거와 인과 가설을 분리한 뒤 AI로 반대 가능성을 점검합니다.</p>
      </div>

      <SectionCard title="1단계: 팀원 Dashboard 확인">
        <label className="block space-y-1"><FieldLabel>분석할 팀원 선택</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedMemberId} onChange={(event) => update({ selectedMemberId: event.target.value })}>{MEMBERS.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.type}</option>)}</select></label>
        <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700"><h4 className="font-bold text-slate-900">{currentMember.name} · {currentMember.type}</h4><p className="mt-2">{currentMember.signal}</p><p className="mt-2 rounded-xl bg-white p-3 font-semibold text-slate-800">“{currentMember.comment}”</p></article>
        <div className="grid gap-3 md:grid-cols-4">
          {METRIC_ORDER.map((key) => <div key={key} className={`rounded-2xl border p-3 ${metricTone(currentMember.metrics[key], key)}`}><p className="text-xs font-bold text-slate-500">{metricLabel(key)}</p><p className="mt-1 text-2xl font-black text-slate-900">{currentMember.metrics[key]}</p></div>)}
        </div>
      </SectionCard>

      <SectionCard title="2단계: 첫인상 판단과 근거 지표 선택">
        <label className="block space-y-1"><FieldLabel>처음 든 판단</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.intuitionJudgment} onChange={(event) => update({ intuitionJudgment: event.target.value })}><option value="">선택하세요</option>{INTUITION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <div className="grid gap-2 md:grid-cols-4">{METRIC_ORDER.map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.evidenceMetrics.includes(metric)} onChange={() => update({ evidenceMetrics: toggle(response.evidenceMetrics, metric) })} /><span>{metricLabel(metric)}</span></label>)}</div>
        <label className="block space-y-1"><FieldLabel>우선 해석</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.priorityInterpretation} onChange={(event) => update({ priorityInterpretation: event.target.value })} placeholder="지표를 보고 가장 먼저 떠오른 해석을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>나의 인과 가설</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.causalHypothesis} onChange={(event) => update({ causalHypothesis: event.target.value })} placeholder="왜 이런 지표가 나왔다고 생각하는지 가설로 작성하세요. 단정하지 않습니다." /></label>
      </SectionCard>

      <SectionCard title="3단계: AI로 해석 점검">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">아래 프롬프트를 외부 AI에 복사해, 내 해석이 틀렸을 가능성과 확인 질문을 점검합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.aiAnswerRaw} onChange={(event) => update({ aiAnswerRaw: event.target.value })} placeholder="AI 답변을 붙여넣으세요. ## 1~5 제목을 기준으로 자동 분리할 수 있습니다." />
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={applyAiAnswer}>AI 답변 5개 영역으로 분리</button>
      </SectionCard>

      <SectionCard title="4단계: AI 답변 감별과 최종 판단">
        <label className="block space-y-1"><FieldLabel>가능한 인과 가설 3개</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.hypotheses} onChange={(event) => update({ hypotheses: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>이 해석이 틀렸을 가능성</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.counter} onChange={(event) => update({ counter: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>팀장이 확인해야 할 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.questions} onChange={(event) => update({ questions: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>2주 검증 실험</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.experiments} onChange={(event) => update({ experiments: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>성급한 판단 주의점</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.cautions} onChange={(event) => update({ cautions: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="5단계: 팀원에게 확인할 실행 문장">
        <label className="block space-y-1"><FieldLabel>팀원에게 던질 확인 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.confirmQuestion} onChange={(event) => update({ confirmQuestion: event.target.value })} placeholder="예: 이번 2주 동안 고객 접점 후 어떤 후속조치가 가장 막혔나요?" /></label>
        <label className="block space-y-1"><FieldLabel>2주 실행 약속</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.twoWeekCommitment} onChange={(event) => update({ twoWeekCommitment: event.target.value })} placeholder="예: 콜 이후 24시간 내 CRM 기록과 후속조치 1개를 남긴다." /></label>
        <label className="block space-y-1"><FieldLabel>2주 후 점검할 지표/증거</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.recheckEvidence} onChange={(event) => update({ recheckEvidence: event.target.value })} placeholder="예: CRM기록충실도, 후속조치율, 고객반응지수 변화와 실제 대화 기록" /></label>
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.dashboardAnalysis} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default DashboardAnalysisLab;
