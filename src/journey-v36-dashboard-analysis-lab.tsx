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

type MetricMeta = {
  group: '선행변수' | '과정변수' | '결과변수' | '확산변수';
  description: string;
};

type DashboardResponse = {
  selectedMemberId: string;
  intuitionJudgment: string;
  selectedLeadVariables: string[];
  selectedProcessVariables: string[];
  selectedResultVariables: string[];
  selectedDiffusionVariables: string[];
  diagnosisType: string;
  reasonOneLine: string;
  diagnosisStatement: string;
  selectedExperiments: string[];
  selectedCheckMetrics: string[];
  aiAnswerRaw: string;
  aiRationale: string;
  aiCounter: string;
  aiQuestions: string;
  aiExperiment: string;
  aiCaution: string;
  confirmQuestion: string;
  finalActionSentence: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const METRIC_ORDER = ['콜실행률', '담당처커버리지', 'CRM기록충실도', '후속조치율', '고객반응지수', '성과전환지수', '팀기여지수', '실행지연'];
const INTUITION_OPTIONS = ['활동량 부족', '접점 품질 문제', '후속조치 문제', '자신감 부족', '개인플레이 문제', '변화 저항', '실행관리 문제', '판단 유보'];

const METRIC_META: Record<string, MetricMeta> = {
  콜실행률: { group: '선행변수', description: '계획한 고객 접점을 실제로 수행한 정도' },
  담당처커버리지: { group: '선행변수', description: '담당 고객군을 얼마나 고르게 접촉했는지' },
  CRM기록충실도: { group: '과정변수', description: '고객 접점 후 실행 정보가 얼마나 구조적으로 남았는지' },
  후속조치율: { group: '과정변수', description: '고객 접점 이후 약속한 다음 행동이 실행되었는지' },
  실행지연: { group: '과정변수', description: '계획된 실행이 지연되거나 누락된 정도' },
  고객반응지수: { group: '결과변수', description: '고객이 정보 제공과 접점에 긍정적으로 반응한 정도' },
  성과전환지수: { group: '결과변수', description: '고객 반응이 실제 성과 신호로 이어진 정도' },
  팀기여지수: { group: '확산변수', description: '개인의 실행 경험이 팀 학습과 협업으로 확산된 정도' },
};

const MEMBERS: Member[] = [
  { id: 'M01', name: '신재영 대리', type: '활동량 과다·성과전환 저조형', signal: '콜 실행률은 높지만 후속조치율과 성과전환지수가 낮다. 활동량보다 접점 목적과 후속 실행 품질 점검이 필요하다.', comment: '저는 누구보다 많이 움직이고 있습니다.', metrics: { 콜실행률: 112, 담당처커버리지: 96, CRM기록충실도: 64, 후속조치율: 58, 고객반응지수: 62, 성과전환지수: 54, 팀기여지수: 61, 실행지연: 2 } },
  { id: 'M02', name: '이대은 대리', type: '고성과 개인플레이형', signal: '성과전환지수와 고객반응지수는 높지만 팀기여지수가 낮다. 개인성과 인정과 팀 기여 요청의 균형이 필요하다.', comment: '각자 자기 담당처는 본인이 책임지는 게 맞지 않나요?', metrics: { 콜실행률: 91, 담당처커버리지: 88, CRM기록충실도: 72, 후속조치율: 74, 고객반응지수: 84, 성과전환지수: 128, 팀기여지수: 42, 실행지연: 1 } },
  { id: 'M03', name: '박재욱 사원', type: '신입 위축형', signal: 'CRM 기록은 성실하지만 콜 실행률과 고객반응지수가 낮다. 신입 위축과 접점 전 준비 부족 가능성을 확인해야 한다.', comment: '제가 가면 오히려 불편해하시는 것 같습니다.', metrics: { 콜실행률: 72, 담당처커버리지: 69, CRM기록충실도: 90, 후속조치율: 67, 고객반응지수: 51, 성과전환지수: 48, 팀기여지수: 70, 실행지연: 1 } },
  { id: 'M04', name: '유희관 과장', type: '경력 안정형', signal: '담당처 관계와 고객반응은 안정적이나 CRM 기록과 캠페인 실행이 낮다. 변화 요구를 현장 언어로 연결해야 한다.', comment: '현장에서는 그런 방식이 잘 안 맞습니다.', metrics: { 콜실행률: 86, 담당처커버리지: 92, CRM기록충실도: 55, 후속조치율: 63, 고객반응지수: 76, 성과전환지수: 82, 팀기여지수: 58, 실행지연: 3 } },
  { id: 'M05', name: '김문호 차장', type: '방어적 목표미달형', signal: '목표진척과 실행 속도가 모두 낮다. 외부 요인 탓으로 단정하거나 반박하기보다 데이터 기반 공동 진단이 필요하다.', comment: '이번 지역 상황은 제가 어떻게 할 수 있는 게 아닙니다.', metrics: { 콜실행률: 79, 담당처커버리지: 75, CRM기록충실도: 68, 후속조치율: 61, 고객반응지수: 60, 성과전환지수: 68, 팀기여지수: 55, 실행지연: 5 } },
  { id: 'M06', name: '김재호 차장', type: '실행지연·CRM 부실형', signal: '콜 실행은 유지되지만 CRM 기록과 후속조치율이 낮다. 완료 기준과 사후보고 기준 명확화가 필요하다.', comment: '현장 대응하느라 입력은 나중에 하게 됩니다.', metrics: { 콜실행률: 93, 담당처커버리지: 81, CRM기록충실도: 41, 후속조치율: 45, 고객반응지수: 69, 성과전환지수: 73, 팀기여지수: 62, 실행지연: 4 } },
];

const DIAGNOSIS_TYPES = [
  '접점 부족형: 고객 접점 기회가 충분하지 않다',
  '접점 품질 저하형: 만나고는 있지만 대화 목적과 메시지가 약하다',
  '후속조치 약화형: 방문 이후 다음 행동이 이어지지 않는다',
  '기록·관리 부실형: CRM 기록과 실행 관리가 약하다',
  '전환 병목형: 고객 반응은 있으나 성과 신호로 연결하는 실행이 약하다',
  '확산 부족형: 개인 실행 경험이 팀 학습과 협업으로 확산되지 않는다',
  '판단 유보형: 현재 데이터만으로는 단정하기 어렵고 추가 확인이 필요하다',
];

const EXPERIMENT_OPTIONS = [
  '콜 전 고객별 질문 2개 준비',
  '고객군별 방문 목적 사전 정리',
  '콜 이후 24시간 내 CRM 기록 완료',
  '고객 반응별 후속조치 1개 지정',
  '선배/동료와 콜 리뷰 1회 진행',
  '성공 사례 또는 고객 반응 사례 팀 공유',
  '팀장이 1on1에서 장애 요인 확인',
  '2주 동안 실행지연 항목 일일 점검',
];

const REVIEW_ITEMS = [
  '문제가 되는 선행변수를 선택했는가?',
  '문제가 되는 과정변수를 선택했는가?',
  '문제가 나타난 결과변수를 선택했는가?',
  '인과 진단문을 생성하고 수정했는가?',
  '2주 동안 바꿀 선행/과정 행동을 선택했는가?',
  '2주 후 확인할 결과/반응 지표를 선택했는가?',
  'AI로 반대 가능성과 확인 질문을 점검했는가?',
];

const DEFAULT_RESPONSE: DashboardResponse = {
  selectedMemberId: 'M01',
  intuitionJudgment: '',
  selectedLeadVariables: [],
  selectedProcessVariables: [],
  selectedResultVariables: [],
  selectedDiffusionVariables: [],
  diagnosisType: '',
  reasonOneLine: '',
  diagnosisStatement: '',
  selectedExperiments: [],
  selectedCheckMetrics: [],
  aiAnswerRaw: '',
  aiRationale: '',
  aiCounter: '',
  aiQuestions: '',
  aiExperiment: '',
  aiCaution: '',
  confirmQuestion: '',
  finalActionSentence: '',
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

function groupTone(group: MetricMeta['group']) {
  if (group === '선행변수') return 'bg-blue-50 text-blue-700 border-blue-100';
  if (group === '과정변수') return 'bg-amber-50 text-amber-700 border-amber-100';
  if (group === '결과변수') return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  return 'bg-purple-50 text-purple-700 border-purple-100';
}

function metricOptions(group: MetricMeta['group']) {
  return METRIC_ORDER.filter((key) => METRIC_META[key].group === group);
}

function listOrNone(items: string[], noneText = '큰 문제 없음') {
  return items.length ? items.map(metricLabel).join(', ') : noneText;
}

function makeDiagnosisStatement(member: Member, response: DashboardResponse) {
  const lead = listOrNone(response.selectedLeadVariables, '선행변수는 큰 문제 없어 보이지만');
  const process = listOrNone(response.selectedProcessVariables, '과정변수는 추가 확인이 필요하고');
  const result = listOrNone(response.selectedResultVariables, '결과변수에 약한 신호가 나타나고 있다');
  const diffusion = response.selectedDiffusionVariables.length ? ` 또한 ${listOrNone(response.selectedDiffusionVariables)}도 함께 점검해야 한다.` : '';
  const experiment = response.selectedExperiments.length ? response.selectedExperiments.join(', ') : '선행/과정 행동 1개를 정해 실험한다';
  const check = response.selectedCheckMetrics.length ? response.selectedCheckMetrics.map(metricLabel).join(', ') : '고객반응지수와 성과 신호 전환지수';
  const reason = response.reasonOneLine ? ` 판단 근거는 ${response.reasonOneLine}` : '';
  return `현재 ${member.name}은 ${lead} 신호가 있고, ${process} 문제가 나타나 ${result}가 약하게 나타나고 있다.${diffusion}${reason} 따라서 2주 동안 ${experiment}을/를 실험하고, ${check}의 변화를 확인한다.`;
}

function parseAi(raw: string) {
  const text = (raw || '').trim();
  const pick = (n: number) => text.match(new RegExp('##\\s*' + n + '[\\s\\S]*?(?=##\\s*' + (n + 1) + '|$)'))?.[0] || '';
  return {
    aiRationale: pick(1),
    aiCounter: pick(2),
    aiQuestions: pick(3),
    aiExperiment: pick(4),
    aiCaution: pick(5),
  };
}

function buildPrompt(member: Member, response: DashboardResponse) {
  return `당신은 영업팀장의 데이터 기반 성과진단을 돕는 리더십 코치입니다.\n\n핵심 전제:\n성과가 낮다는 결과만 보지 말고, 어떤 선행변수와 과정변수가 결과변수에 영향을 주었는지 점검하세요.\n\n[팀원]\n${member.name} / ${member.type}\n\n[팀원 발언]\n${member.comment}\n\n[지표]\n${METRIC_ORDER.map((key) => `${metricLabel(key)}(${METRIC_META[key].group}): ${member.metrics[key]} - ${METRIC_META[key].description}`).join('\n')}\n\n[팀장 첫 판단]\n${response.intuitionJudgment || '-'}\n\n[선택한 선행변수]\n${listOrNone(response.selectedLeadVariables, '-')}\n\n[선택한 과정변수]\n${listOrNone(response.selectedProcessVariables, '-')}\n\n[선택한 결과변수]\n${listOrNone(response.selectedResultVariables, '-')}\n\n[선택한 확산변수]\n${listOrNone(response.selectedDiffusionVariables, '-')}\n\n[진단 유형]\n${response.diagnosisType || '-'}\n\n[인과 진단문]\n${response.diagnosisStatement || makeDiagnosisStatement(member, response)}\n\n[2주 실행 실험]\n${response.selectedExperiments.join(', ') || '-'}\n\n[2주 후 확인 지표]\n${response.selectedCheckMetrics.map(metricLabel).join(', ') || '-'}\n\n아래 제목을 그대로 사용해 답하세요.\n## 1. 이 진단이 타당한 이유\n## 2. 이 진단이 틀렸을 가능성\n## 3. 팀장이 확인해야 할 질문\n## 4. 2주 실행 실험 보완 제안\n## 5. 성급한 판단을 피하기 위한 주의점`;
}

export function DashboardAnalysisLab() {
  const [storedResponse, setResponse] = useStored<DashboardResponse>(V36_STORAGE_KEYS.dashboardAnalysis, DEFAULT_RESPONSE);
  const response = {
    ...DEFAULT_RESPONSE,
    ...storedResponse,
    selectedLeadVariables: storedResponse.selectedLeadVariables ?? [],
    selectedProcessVariables: storedResponse.selectedProcessVariables ?? [],
    selectedResultVariables: storedResponse.selectedResultVariables ?? [],
    selectedDiffusionVariables: storedResponse.selectedDiffusionVariables ?? [],
    selectedExperiments: storedResponse.selectedExperiments ?? [],
    selectedCheckMetrics: storedResponse.selectedCheckMetrics ?? [],
    reviewChecks: storedResponse.reviewChecks ?? {},
  };
  const [copyMessage, setCopyMessage] = useState('');
  const currentMember = getMember(response.selectedMemberId);
  const prompt = useMemo(() => buildPrompt(currentMember, response), [currentMember, response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<DashboardResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const generateDiagnosis = () => {
    update({ diagnosisStatement: makeDiagnosisStatement(currentMember, response) });
    setCopyMessage('인과 진단문 초안을 생성했습니다. 필요하면 문장을 수정하세요.');
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('Dashboard 인과 진단 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const applyAiAnswer = () => {
    const parsed = parseAi(response.aiAnswerRaw);
    update(parsed);
    setCopyMessage('AI 답변을 5개 검토 영역으로 분리했습니다.');
  };

  const outputText = `[현재 상황 점검]\n\n[선택 팀원]\n${currentMember.name} / ${currentMember.type}\n\n[진단 유형]\n${response.diagnosisType}\n\n[인과 진단문]\n${response.diagnosisStatement || makeDiagnosisStatement(currentMember, response)}\n\n[선택한 선행변수]\n${listOrNone(response.selectedLeadVariables, '-')}\n\n[선택한 과정변수]\n${listOrNone(response.selectedProcessVariables, '-')}\n\n[선택한 결과변수]\n${listOrNone(response.selectedResultVariables, '-')}\n\n[2주 실행 실험]\n${response.selectedExperiments.join(', ') || '-'}\n\n[2주 후 확인 지표]\n${response.selectedCheckMetrics.map(metricLabel).join(', ') || '-'}\n\n[팀원에게 던질 질문]\n${response.confirmQuestion}\n\n[최종 실행 문장]\n${response.finalActionSentence}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">팀원 Dashboard 분석 Lab</p>
        <p className="mt-1">현재 상황을 “이런 선행변수와 이런 과정변수 때문에 이런 결과변수에 문제가 있다”는 인과 진단문으로 정리합니다.</p>
      </div>

      <SectionCard title="지표 읽는 법: 원인보다 경로를 본다">
        <div className="grid gap-3 md:grid-cols-4">
          {(['선행변수', '과정변수', '결과변수', '확산변수'] as MetricMeta['group'][]).map((group) => (
            <div key={group} className={`rounded-2xl border p-4 ${groupTone(group)}`}>
              <h4 className="font-black">{group}</h4>
              <p className="mt-2 text-sm">{group === '선행변수' ? '고객 접점 기회를 만든다.' : group === '과정변수' ? '접점 이후 실행 품질을 만든다.' : group === '결과변수' ? '고객 반응과 성과 신호를 보여준다.' : '개인 실행이 팀 학습으로 확산되는지 보여준다.'}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="1단계: 팀원 Dashboard 확인">
        <label className="block space-y-1"><FieldLabel>분석할 팀원 선택</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.selectedMemberId} onChange={(event) => update({ selectedMemberId: event.target.value })}>{MEMBERS.map((member) => <option key={member.id} value={member.id}>{member.name} · {member.type}</option>)}</select></label>
        <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700"><h4 className="font-bold text-slate-900">{currentMember.name} · {currentMember.type}</h4><p className="mt-2">{currentMember.signal}</p><p className="mt-2 rounded-xl bg-white p-3 font-semibold text-slate-800">“{currentMember.comment}”</p></article>
        <div className="grid gap-3 md:grid-cols-4">
          {METRIC_ORDER.map((key) => {
            const meta = METRIC_META[key];
            return <div key={key} className={`rounded-2xl border p-3 ${metricTone(currentMember.metrics[key], key)}`}><div className="flex items-center justify-between gap-2"><p className="text-xs font-bold text-slate-500">{metricLabel(key)}</p><span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${groupTone(meta.group)}`}>{meta.group}</span></div><p className="mt-1 text-2xl font-black text-slate-900">{currentMember.metrics[key]}</p><p className="mt-2 text-xs leading-5 text-slate-600">{meta.description}</p></div>;
          })}
        </div>
      </SectionCard>

      <SectionCard title="2단계: 첫인상 판단 선택">
        <label className="block space-y-1"><FieldLabel>처음 든 판단</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.intuitionJudgment} onChange={(event) => update({ intuitionJudgment: event.target.value })}><option value="">선택하세요</option>{INTUITION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
      </SectionCard>

      <SectionCard title="3단계: 현재 상황 점검">
        <label className="block space-y-1"><FieldLabel>진단 유형</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={response.diagnosisType} onChange={(event) => update({ diagnosisType: event.target.value })}><option value="">선택하세요</option>{DIAGNOSIS_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
        <div className="grid gap-4 md:grid-cols-3">
          <div><FieldLabel>문제가 되는 선행변수</FieldLabel><div className="mt-2 space-y-2">{metricOptions('선행변수').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedLeadVariables.includes(metric)} onChange={() => update({ selectedLeadVariables: toggle(response.selectedLeadVariables, metric) })} />{metricLabel(metric)}</label>)}</div></div>
          <div><FieldLabel>문제가 되는 과정변수</FieldLabel><div className="mt-2 space-y-2">{metricOptions('과정변수').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedProcessVariables.includes(metric)} onChange={() => update({ selectedProcessVariables: toggle(response.selectedProcessVariables, metric) })} />{metricLabel(metric)}</label>)}</div></div>
          <div><FieldLabel>문제가 나타난 결과변수</FieldLabel><div className="mt-2 space-y-2">{metricOptions('결과변수').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedResultVariables.includes(metric)} onChange={() => update({ selectedResultVariables: toggle(response.selectedResultVariables, metric) })} />{metricLabel(metric)}</label>)}{metricOptions('확산변수').map((metric) => <label key={metric} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedDiffusionVariables.includes(metric)} onChange={() => update({ selectedDiffusionVariables: toggle(response.selectedDiffusionVariables, metric) })} />{metricLabel(metric)}</label>)}</div></div>
        </div>
        <label className="block space-y-1"><FieldLabel>선택 이유 한 줄</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={response.reasonOneLine} onChange={(event) => update({ reasonOneLine: event.target.value })} placeholder="예: 활동량은 높지만 후속조치율과 성과 신호 전환지수가 낮다." /></label>
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={generateDiagnosis}>인과 진단문 생성</button>
        <label className="block space-y-1"><FieldLabel>인과 진단문</FieldLabel><textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.diagnosisStatement} onChange={(event) => update({ diagnosisStatement: event.target.value })} placeholder="선택 후 인과 진단문을 생성하고 필요한 부분만 수정하세요." /></label>
      </SectionCard>

      <SectionCard title="4단계: 2주 실행 실험과 확인 지표 선택">
        <div className="grid gap-2 md:grid-cols-2">{EXPERIMENT_OPTIONS.map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedExperiments.includes(item)} onChange={() => update({ selectedExperiments: toggle(response.selectedExperiments, item) })} />{item}</label>)}</div>
        <div className="grid gap-2 md:grid-cols-4">{['CRM기록충실도', '후속조치율', '고객반응지수', '성과전환지수', '실행지연', '팀기여지수', '실제 고객 반응 메모', '팀원 1on1 대화 내용'].map((item) => <label key={item} className="flex items-center gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" checked={response.selectedCheckMetrics.includes(item)} onChange={() => update({ selectedCheckMetrics: toggle(response.selectedCheckMetrics, item) })} />{metricLabel(item)}</label>)}</div>
      </SectionCard>

      <SectionCard title="5단계: AI로 반대 가능성 점검">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">생성한 인과 진단문이 너무 성급하지 않은지 AI로 점검합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{prompt}</pre>
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.aiAnswerRaw} onChange={(event) => update({ aiAnswerRaw: event.target.value })} placeholder="AI 답변을 붙여넣으세요. ## 1~5 제목을 기준으로 자동 분리할 수 있습니다." />
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={applyAiAnswer}>AI 답변 5개 영역으로 분리</button>
        <label className="block space-y-1"><FieldLabel>이 진단이 타당한 이유</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiRationale} onChange={(event) => update({ aiRationale: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>이 진단이 틀렸을 가능성</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiCounter} onChange={(event) => update({ aiCounter: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>팀장이 확인해야 할 질문</FieldLabel><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={response.aiQuestions} onChange={(event) => update({ aiQuestions: event.target.value })} /></label>
      </SectionCard>

      <SectionCard title="6단계: 최종 실행 문장">
        <label className="block space-y-1"><FieldLabel>팀원에게 던질 확인 질문</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.confirmQuestion} onChange={(event) => update({ confirmQuestion: event.target.value })} placeholder="예: 이번 2주 동안 고객 접점 후 어떤 후속조치가 가장 막혔나요?" /></label>
        <label className="block space-y-1"><FieldLabel>최종 실행 문장</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.finalActionSentence} onChange={(event) => update({ finalActionSentence: event.target.value })} placeholder="예: 2주 동안 콜 이후 24시간 내 CRM 기록과 후속조치 1개를 실험하고, 후속조치율과 고객반응지수 변화를 확인한다." /></label>
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
