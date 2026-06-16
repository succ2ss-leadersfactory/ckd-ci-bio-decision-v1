import { type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_BOUNDARY_MARKERS = [
  'V41TaskBoundaryCoordinationLab',
  '업무 경계 나누기',
  '업무 경계·병목 대응',
  '7단계 실행 흐름 확인',
  '7단계 전달 메모 확인',
  '7단계 전달 메모 정제',
  '업무 경계 정하기',
  '병목 신호 확인',
  '에스컬레이션 기준 정하기',
  '팀장 개입 기준 정하기',
  '사람관리로 넘기지 말아야 할 업무관리 이슈',
  '9단계로 넘길 관찰 사실 후보',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_BOUNDARY_MARKERS;

type BoundaryState = Record<string, any> & {
  executionCycle?: string;
  managementTask?: string;
  selectedWorkItems?: string;
  orderedWorkSteps?: string;
  roleResponsibilityMap?: string;
  scheduleCheckpoints?: string;
  selectedReduceTasks?: string[];
  workloadAdjustments?: string;
  finalTaskInstruction?: string;
  step7HandoffToStep8?: string;
  memberTasks?: string;
  leaderCheckTasks?: string;
  coordinationTasks?: string;
  riskBoundary?: string;
  bottleneckSignal?: string;
  bottleneckResponsePlan?: string;
  escalationCriteria?: string;
  leaderInterventionCriteria?: string;
  midCheckQuestion?: string;
  taskIssueSeparation?: string;
  boundaryDeclaration?: string;
  peopleSignal?: string;
  step8TaskBoundaryMemo?: string;
};

const STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const DEFAULT_STATE: BoundaryState = {};

const MEMBER_TASK_OPTIONS = [
  '정해진 업무 순서대로 실행하고 산출물을 남기기',
  '완료 기준에 맞는 기록 위치와 증거를 남기기',
  '누락·지연·권한 밖 이슈를 중간 확인 전에 표시하기',
  '최종 업무지시에 포함되지 않은 일은 임의로 확장하지 않기',
];

const LEADER_CHECK_OPTIONS = [
  '중간 확인일에 산출물 위치와 완료 기준 충족 여부 확인하기',
  '역할 충돌, 일정 지연, 업무량 과부하 신호 확인하기',
  '승인자료 범위 밖 표현이나 민감정보 입력 가능성 확인하기',
  '팀원이 해결할 일과 팀장이 연결할 일을 구분해 주기',
];

const COORDINATION_OPTIONS = [
  '시스템 권한이나 데이터 접근이 필요한 일은 내부 담당자와 연결하기',
  '승인자료 범위 확인이 필요한 표현은 담당 부서에 확인하기',
  '반복되는 병목은 팀 회의 안건 또는 부서 협조 요청으로 올리기',
  '고객 문의 중 팀원 권한 밖 이슈는 팀장이 확인 경로를 열어 주기',
];

function compact(value?: string | string[]) {
  if (Array.isArray(value)) return value.length ? value.map((item) => `- ${item}`).join('\n') : '미작성';
  return value?.trim() || '미작성';
}

function short(value?: string | string[], max = 180) {
  const text = compact(value).replace(/\s+/g, ' ');
  if (text === '미작성') return text;
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function lines(value?: string | string[]) {
  return compact(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean)
    .filter((line) => line !== '[8단계 전달 메모]')
    .filter((line) => line !== '[8단계 확정 메모]');
}

function firstLine(value?: string | string[], fallback = '미작성') {
  return lines(value)[0] || fallback;
}

function extractAfterColon(source: string, labels: string[]) {
  const candidates = lines(source);
  const found = candidates.find((line) => labels.some((label) => line.startsWith(label)));
  if (!found) return '';
  const index = found.indexOf(':');
  return index >= 0 ? found.slice(index + 1).trim() : found.trim();
}

function cleanListText(value: string, fallback: string) {
  const text = value
    .replace(/\s+/g, ' ')
    .replace(/원문 후보:.*$/g, '')
    .replace(/주의:.*$/g, '')
    .trim();
  if (!text) return fallback;
  return text.length > 150 ? `${text.slice(0, 150)}…` : text;
}

function buildCleanHandoff(state: BoundaryState) {
  const raw = compact(state.step7HandoffToStep8);
  const boundary = cleanListText(
    extractAfterColon(raw, ['업무 경계가 필요한 부분', '업무 경계', '선택한 경계·병목 후보']) || firstLine(state.selectedWorkItems, '업무 범위와 제외 업무의 경계'),
    '업무 범위와 제외 업무의 경계',
  );
  const bottleneck = cleanListText(
    extractAfterColon(raw, ['병목이 예상되는 부분', '병목 후보', '병목']) || '중간 확인 시점까지 산출물 등록, 누락 표시, 다음 행동 입력이 확인되지 않는 경우',
    '산출물 등록·누락 표시·다음 행동 입력 지연',
  );
  const authority = cleanListText(
    extractAfterColon(raw, ['담당자 권한 밖 이슈', '권한 밖·협조 이슈', '권한 밖 이슈']) || '시스템 권한, 데이터 접근, 부서 협조, 기록 위치 변경',
    '시스템 권한, 데이터 접근, 부서 협조, 기록 위치 변경',
  );
  const escalation = cleanListText(
    extractAfterColon(raw, ['에스컬레이션 후보', '에스컬레이션 기준']) || '반복 지연, 산출물 미등록, 필수 기록 누락, 역할 충돌',
    '반복 지연, 산출물 미등록, 필수 기록 누락, 역할 충돌',
  );
  const observation = cleanListText(
    extractAfterColon(raw, ['9단계로 넘길 관찰 사실 후보', '관찰 사실 후보']) || '반복 지연, 산출물 미등록, 필수 기록 누락, 지원 요청 미표시',
    '반복 지연, 산출물 미등록, 필수 기록 누락, 지원 요청 미표시',
  );

  return {
    boundary,
    bottleneck,
    authority,
    escalation,
    observation,
    memo: [
      '[8단계 전달 메모]',
      `업무 경계 후보: ${boundary}`,
      `병목 후보: ${bottleneck}`,
      `권한 밖·협조 이슈: ${authority}`,
      `에스컬레이션 후보: ${escalation}`,
      `9단계 관찰 사실 후보: ${observation}`,
      '주의: 이 메모는 사람 평가가 아니라 업무 경계와 프로세스 병목 후보입니다.',
    ].join('\n'),
  };
}

function Card({ title, children, tone = 'slate' }: { title: string; children: ReactNode; tone?: 'slate' | 'cyan' | 'amber' | 'rose' | 'emerald' }) {
  const border = tone === 'cyan' ? 'border-cyan-100' : tone === 'amber' ? 'border-amber-100' : tone === 'rose' ? 'border-rose-100' : tone === 'emerald' ? 'border-emerald-100' : 'border-slate-200';
  return <section className={`rounded-3xl border ${border} bg-white p-4 shadow-sm md:p-5`}><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, help, value, onChange, placeholder, minHeight = 'min-h-24' }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder: string; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<textarea className={`${minHeight} mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function OptionGroup({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (value: string) => void }) {
  const selected = value.split('\n').map((item) => item.replace(/^[-•]\s*/, '').trim()).filter(Boolean);
  const toggle = (option: string) => {
    const next = selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option];
    onChange(next.map((item) => `- ${item}`).join('\n'));
  };
  return <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-black text-slate-950">{title}</p><div className="mt-3 space-y-2">{options.map((option) => <label key={option} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} />{option}</label>)}</div></div>;
}

function SummaryLine({ label, value }: { label: string; value?: string | string[] }) {
  return <p><span className="font-black text-slate-700">{label}: </span>{short(value)}</p>;
}

export function V41TaskBoundaryCoordinationLab() {
  const [state, setState] = useStored<BoundaryState>(STORAGE_KEY, DEFAULT_STATE);
  const update = (patch: Partial<BoundaryState>) => setState({ ...state, ...patch });
  const executionCycle = state.executionCycle || '선택한 실행관리 주기';
  const cleanedHandoff = buildCleanHandoff(state);

  const makeBoundary = () => {
    const memberTasks = state.memberTasks || MEMBER_TASK_OPTIONS.slice(0, 3).map((item) => `- ${item}`).join('\n');
    const leaderCheckTasks = state.leaderCheckTasks || LEADER_CHECK_OPTIONS.slice(0, 3).map((item) => `- ${item}`).join('\n');
    const coordinationTasks = state.coordinationTasks || COORDINATION_OPTIONS.slice(0, 2).map((item) => `- ${item}`).join('\n');
    const riskBoundary = state.riskBoundary || `팀원 단독으로 처리하지 않을 경계: ${cleanedHandoff.boundary}. 승인자료 범위 밖 표현, 내부 수치 공유, 권한 없는 데이터 접근은 팀장이 확인합니다.`;
    const bottleneckSignal = state.bottleneckSignal || `병목 신호: ${cleanedHandoff.bottleneck}. 같은 신호가 반복되면 업무 흐름 문제로 확인합니다.`;
    const bottleneckResponsePlan = state.bottleneckResponsePlan || '중간 확인일에 병목 신호를 확인하고, 팀원이 해결할 수 있는 일은 즉시 조정하며 권한·자료·부서 협조 이슈는 팀장이 연결합니다.';
    const escalationCriteria = state.escalationCriteria || `에스컬레이션 후보: ${cleanedHandoff.escalation}. 동일 병목이 반복되거나 마감 전까지 산출물 위치·완료 기준·담당이 확정되지 않으면 팀장에게 올립니다.`;
    const leaderInterventionCriteria = state.leaderInterventionCriteria || `팀장은 ${cleanedHandoff.authority}처럼 담당자 권한 밖 이슈가 생길 때 개입합니다. 개인 태도 판단은 하지 않습니다.`;
    const taskIssueSeparation = state.taskIssueSeparation || '역할 불명확, 권한 부족, 시스템 접근, 산출물 위치 미정, 일정 충돌은 사람 문제가 아니라 업무관리 이슈로 남깁니다.';
    const midCheckQuestion = state.midCheckQuestion || '중간 확인일에 산출물 위치, 누락 여부, 다음 행동 여부, 권한 밖 이슈를 확인합니다.';
    const peopleSignal = state.peopleSignal || `9단계에는 평가가 아니라 관찰 사실만 넘깁니다. 후보: ${cleanedHandoff.observation}.`;
    const boundaryDeclaration = state.boundaryDeclaration || `${executionCycle} 동안 팀원은 정해진 순서대로 실행과 기록을 남기고, 팀장은 중간 확인에서 병목과 권한 밖 이슈를 연결합니다. 사람 판단은 9단계에서 관찰 사실과 해석을 분리해 다룹니다.`;

    update({
      step7HandoffToStep8: cleanedHandoff.memo,
      memberTasks,
      leaderCheckTasks,
      coordinationTasks,
      riskBoundary,
      bottleneckSignal,
      bottleneckResponsePlan,
      escalationCriteria,
      leaderInterventionCriteria,
      taskIssueSeparation,
      midCheckQuestion,
      peopleSignal,
      boundaryDeclaration,
      step8TaskBoundaryMemo: [
        '[8단계 확정 메모]',
        `업무 경계: ${boundaryDeclaration}`,
        `팀원이 할 일:\n${memberTasks}`,
        `팀장이 확인할 일:\n${leaderCheckTasks}`,
        `협조 요청할 일:\n${coordinationTasks}`,
        `단독 처리 금지 경계: ${riskBoundary}`,
        `병목 신호: ${bottleneckSignal}`,
        `병목 대응: ${bottleneckResponsePlan}`,
        `에스컬레이션 기준: ${escalationCriteria}`,
        `팀장 개입 기준: ${leaderInterventionCriteria}`,
        `사람관리로 넘기지 말아야 할 업무관리 이슈: ${taskIssueSeparation}`,
        `9단계로 넘길 관찰 사실 후보: ${peopleSignal}`,
      ].join('\n'),
    });
  };

  return <section className="space-y-4">
    <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">업무 경계·병목 대응</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">8단계: 업무 경계와 병목 대응 기준 만들기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">7단계 업무지시를 기준으로 팀원이 직접 처리할 일, 팀장이 확인할 일, 협조 요청할 일, 병목 신호와 에스컬레이션 기준을 나눕니다.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-cyan-800"><span className="rounded-full bg-cyan-50 px-3 py-1">업무관리 마지막 단계</span><span className="rounded-full bg-cyan-50 px-3 py-1">사람판단 금지</span><span className="rounded-full bg-cyan-50 px-3 py-1">병목·권한 밖 이슈</span><span className="rounded-full bg-cyan-50 px-3 py-1">9단계에는 관찰 사실만</span></div>
    </section>

    <Card title="1. 7단계 전달 메모 확인" tone="cyan">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p className="mb-2 text-xs font-black text-cyan-700">8단계 의사결정용 정제 요약 · 7단계 원문 숨김</p>
        <SummaryLine label="실행관리 주기" value={executionCycle} />
        <SummaryLine label="8단계로 넘길 업무" value={state.managementTask} />
        <SummaryLine label="업무 경계 후보" value={cleanedHandoff.boundary} />
        <SummaryLine label="병목 후보" value={cleanedHandoff.bottleneck} />
        <SummaryLine label="권한 밖·협조 이슈" value={cleanedHandoff.authority} />
        <SummaryLine label="에스컬레이션 후보" value={cleanedHandoff.escalation} />
        <SummaryLine label="9단계 관찰 사실 후보" value={cleanedHandoff.observation} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={() => update({ step7HandoffToStep8: cleanedHandoff.memo })}>7단계 전달 메모 정제하기</button>
      </div>
      <Field label="정제된 8단계 전달 메모" help="업무 경계, 병목 후보, 권한 밖 이슈, 에스컬레이션 후보, 9단계 관찰 사실만 남깁니다. 7단계 업무지시 원문은 다시 보여주지 않습니다." value={cleanedHandoff.memo} onChange={(value) => update({ step7HandoffToStep8: value })} placeholder="7단계에서 만든 전달 메모가 정제되어 여기에 남습니다." minHeight="min-h-32" />
    </Card>

    <Card title="2. 업무 경계 정하기" tone="cyan">
      <div className="grid gap-3 md:grid-cols-3">
        <OptionGroup title="팀원이 직접 할 일" options={MEMBER_TASK_OPTIONS} value={state.memberTasks ?? ''} onChange={(value) => update({ memberTasks: value })} />
        <OptionGroup title="팀장이 확인할 일" options={LEADER_CHECK_OPTIONS} value={state.leaderCheckTasks ?? ''} onChange={(value) => update({ leaderCheckTasks: value })} />
        <OptionGroup title="협조 요청할 일" options={COORDINATION_OPTIONS} value={state.coordinationTasks ?? ''} onChange={(value) => update({ coordinationTasks: value })} />
      </div>
      <Field label="단독 처리하면 안 되는 경계" help="승인자료, 내부 수치, 고객정보, 시스템 권한처럼 팀원 단독 처리 금지 범위를 씁니다." value={state.riskBoundary ?? ''} onChange={(value) => update({ riskBoundary: value })} placeholder="고객 의도 단정, 승인자료 범위 밖 표현, 내부 수치 공유 등" />
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={makeBoundary}>업무 경계·병목 기준 초안 채우기</button>
    </Card>

    <Card title="3. 병목 신호 확인" tone="amber">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="병목 신호" help="사람의 태도 문제가 아니라 일의 흐름에서 보이는 지연·누락·권한 부족 신호를 씁니다." value={state.bottleneckSignal ?? ''} onChange={(value) => update({ bottleneckSignal: value })} placeholder="산출물 미등록, 완료 기준 불명확, 역할 충돌, 일정 지연 등" minHeight="min-h-32" />
        <Field label="병목 대응 방법" help="팀원이 할 조정, 팀장이 연결할 조정, 회의 안건으로 올릴 조정을 구분합니다." value={state.bottleneckResponsePlan ?? ''} onChange={(value) => update({ bottleneckResponsePlan: value })} placeholder="중간 확인일에 병목 신호를 확인하고 권한·자료·부서 협조 이슈는 팀장이 연결합니다." minHeight="min-h-32" />
      </div>
    </Card>

    <Card title="4. 에스컬레이션 기준 정하기" tone="rose">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="에스컬레이션 기준" help="언제 팀장에게 올릴지, 언제 부서 협조나 상위 확인으로 넘길지 기준을 씁니다." value={state.escalationCriteria ?? ''} onChange={(value) => update({ escalationCriteria: value })} placeholder="동일 병목 2회 반복, 마감 전 산출물 위치 미확정, 권한 밖 이슈 발생 등" minHeight="min-h-32" />
        <Field label="팀장 개입 기준" help="팀장이 직접 개입해야 하는 업무 기준 흔들림, 권한 밖 이슈, 일정 충돌 기준을 씁니다." value={state.leaderInterventionCriteria ?? ''} onChange={(value) => update({ leaderInterventionCriteria: value })} placeholder="업무 기준이 흔들리거나 승인자료·권한·일정 충돌이 생길 때 개입합니다." minHeight="min-h-32" />
      </div>
    </Card>

    <Card title="5. 사람관리로 넘기지 말아야 할 업무관리 이슈 분리" tone="amber">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="업무관리 이슈로 남길 것" help="역할, 권한, 시스템, 산출물 위치, 일정 충돌은 사람 문제가 아니라 업무관리 이슈로 남깁니다." value={state.taskIssueSeparation ?? ''} onChange={(value) => update({ taskIssueSeparation: value })} placeholder="역할 불명확, 권한 부족, 시스템 접근, 산출물 위치 미정, 일정 충돌 등" minHeight="min-h-32" />
        <Field label="9단계로 넘길 관찰 사실 후보" help="사람 판단이 아니라 1on1에서 확인할 관찰 사실 후보만 씁니다." value={state.peopleSignal ?? ''} onChange={(value) => update({ peopleSignal: value })} placeholder="반복 지연, 산출물 미등록, 필수 기록 누락, 지원 요청 미표시 등" minHeight="min-h-32" />
      </div>
    </Card>

    <Card title="6. 업무 경계·병목 대응 확정" tone="emerald">
      <Field label="경계 선언문" value={state.boundaryDeclaration ?? ''} onChange={(value) => update({ boundaryDeclaration: value })} placeholder="팀원에게 공유할 업무 경계 문장을 씁니다." minHeight="min-h-32" />
      <Field label="최종 업무 경계·병목 대응 메모" value={state.step8TaskBoundaryMemo ?? ''} onChange={(value) => update({ step8TaskBoundaryMemo: value })} placeholder="초안 채우기 버튼을 누르면 8단계 확정 메모가 생성됩니다." minHeight="min-h-64" />
    </Card>
  </section>;
}
