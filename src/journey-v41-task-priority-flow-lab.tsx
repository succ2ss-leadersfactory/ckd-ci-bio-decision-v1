import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_PRIORITY_FLOW_MARKERS = [
  'V41TaskPriorityFlowLab',
  '7단계: 업무 순서와 업무지시 만들기',
  '6단계 실행계획 확인',
  '6단계 요약 입력값',
  '긴 원문 표시 금지',
  '업무 순서 정하기',
  '역할과 책임 정하기',
  '일정과 체크포인트 정하기',
  '업무량 조정: 이번 주기에는 잠시 줄일 일',
  'AI로 업무지시 초안 만들기',
  '사람 검토 후 최종 업무지시 확정',
  '8단계 업무 경계·병목 대응으로 넘기기',
  '성과기준 재해석 금지',
  '사람관리 판단 금지',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_PRIORITY_FLOW_MARKERS;

type ExecutionCycle = '1주' | '2주' | '4주' | '월간' | '분기';

type TaskState = Record<string, any> & {
  executionCycle?: ExecutionCycle;
  managementTaskType?: string;
  managementTask?: string;
  selectedOutput?: string;
  outputLocation?: string;
  completionStandard?: string;
  evidenceToCheck?: string;
  selectedWorkItems?: string;
  workItemCompletionCriteria?: string;
  excludedWorkItems?: string;
  orderedWorkSteps?: string;
  roleResponsibilityMap?: string;
  scheduleCheckpoints?: string;
  selectedReduceTasks?: string[];
  workloadAdjustments?: string;
  step7AiPrompt?: string;
  step7AiResult?: string;
  step7HumanReview?: string;
  taskInstructionDraft?: string;
  finalTaskInstruction?: string;
  step7HandoffToStep8?: string;
};

const STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const DEFAULT_TASK_STATE: TaskState = {};

const REDUCE_TASKS = [
  '6단계 업무산출물과 연결되지 않는 추가 자료 만들기',
  '최종 선택 업무 단위 밖의 업무를 함께 진행하기',
  '역할·일정이 정해지기 전에 모든 업무를 동시에 시작하기',
  '고객 설득 논리나 제품 메시지 개발로 확장하기',
  '담당자별 성과목표 배분이나 KPI 변경 논의하기',
  '병목 원인 분석과 에스컬레이션 설계를 7단계에서 깊게 다루기',
];

function compact(value?: string) {
  return value?.trim() || '미작성';
}

function short(value?: string, max = 160) {
  const text = compact(value).replace(/\s+/g, ' ');
  if (text === '미작성') return text;
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function stripSentenceEnd(value: string) {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[.。]\s*$/g, '')
    .replace(/(을|를)\s*(작성|정리|확인|등록|표시|구분|보완)한다$/g, '')
    .replace(/(작성|정리|확인|등록|표시|구분|보완)한다$/g, '')
    .trim();
}

function displayOutputName(output?: string, managementTask?: string) {
  const raw = compact(output);
  const task = compact(managementTask);
  if (raw === '미작성') return '미작성';
  const suffix = '의 결과로 남길 업무산출물';
  if (raw.includes(suffix)) {
    const base = stripSentenceEnd(raw.replace(suffix, '').replace(task, task));
    if (base.includes('관리표')) return base.replace(/관리표.*$/g, '관리표');
    if (base.includes('현황')) return base.replace(/현황.*$/g, '현황표');
    if (base.includes('리스트')) return base.replace(/리스트.*$/g, '리스트');
    return `${base} 산출물`;
  }
  return short(raw, 120);
}

function displayCompletionStandard(completion?: string, managementTask?: string) {
  const raw = compact(completion);
  const task = compact(managementTask);
  if (raw === '미작성') return '미작성';
  if (task !== '미작성' && raw.includes(task)) {
    return '정해진 위치에 산출물이 남고, 누락 여부와 다음 행동 여부가 확인 가능해야 한다.';
  }
  return short(raw, 140);
}

function splitLines(value?: string, max = 6) {
  return compact(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•]\s*/, '').trim())
    .filter(Boolean)
    .slice(0, max);
}

function toggle(list: string[] = [], value: string, max = 3) {
  if (list.includes(value)) return list.filter((item) => item !== value);
  if (list.length >= max) return list;
  return [...list, value];
}

function Card({ title, children, tone = 'slate' }: { title: string; children: ReactNode; tone?: 'slate' | 'amber' | 'cyan' | 'emerald' | 'violet' }) {
  const border = tone === 'amber' ? 'border-amber-100' : tone === 'cyan' ? 'border-cyan-100' : tone === 'emerald' ? 'border-emerald-100' : tone === 'violet' ? 'border-violet-100' : 'border-slate-200';
  return <section className={`rounded-3xl border ${border} bg-white p-4 shadow-sm md:p-5`}><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, help, value, onChange, placeholder, minHeight = 'min-h-28' }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder: string; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<textarea className={`${minHeight} mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function SummaryLine({ label, value }: { label: string; value?: string }) {
  return <p><span className="font-black text-slate-700">{label}: </span><span>{short(value)}</span></p>;
}

function buildSequenceDraft(items: string[], criteria: string[]) {
  const source = items.length ? items : ['최종 선택 업무 단위를 먼저 확인한다.'];
  return source.map((item, index) => {
    const criterion = criteria[index] || '완료 기준까지 확인한다.';
    return `${index + 1}. ${item}\n- 시작 조건: 이전 단계 입력값과 기존 기록을 확인할 수 있음\n- 완료 기준: ${criterion}`;
  }).join('\n\n');
}

function buildRoleDraft(items: string[]) {
  const source = items.length ? items : ['최종 선택 업무 단위'];
  return source.map((item) => `${item}\n- 담당: 담당자 지정\n- 팀장 확인: 산출물 위치와 완료 기준 확인\n- 협업 필요: 필요 시 관련 부서 또는 동료 확인`).join('\n\n');
}

function buildCheckpointDraft(cycle: string, output: string, location: string, completion: string) {
  return [
    `실행관리 주기: ${cycle}`,
    '시작일: 교육생이 실제 일정에 맞게 입력',
    '중간 확인일: 시작 후 중간 시점으로 입력',
    '마감일: 실행관리 주기 종료일로 입력',
    `확인할 산출물: ${output}`,
    `기록 위치: ${location}`,
    `중간 확인 질문: ${completion}`,
  ].join('\n');
}

function buildInstructionFromFields(state: TaskState, output: string, completion: string) {
  const workItems = splitLines(state.selectedWorkItems, 5);
  const reduce = splitLines(state.workloadAdjustments || (state.selectedReduceTasks ?? []).join('\n'), 4);
  return [
    `이번 주기에는 ${compact(state.managementTask)} 업무를 진행합니다.`,
    '',
    `최종 산출물은 ${output}입니다. 기록 위치는 ${compact(state.outputLocation)}로 맞춥니다.`,
    `완료 기준은 ${completion}`,
    '',
    '진행 순서는 다음과 같습니다.',
    ...(workItems.length ? workItems.map((item, index) => `${index + 1}. ${item}`) : ['1. 최종 선택 업무 단위를 먼저 확정합니다.']),
    '',
    '역할과 책임은 아래 기준으로 정합니다.',
    compact(state.roleResponsibilityMap),
    '',
    '일정과 체크포인트는 아래 기준으로 관리합니다.',
    compact(state.scheduleCheckpoints),
    '',
    '이번 주기에는 아래 활동을 잠시 줄입니다.',
    ...(reduce.length ? reduce.map((item) => `- ${item}`) : ['- 업무산출물과 직접 연결되지 않는 활동은 줄입니다.']),
  ].join('\n');
}

export function V41TaskPriorityFlowLab() {
  const [state, setState] = useStored<TaskState>(STORAGE_KEY, DEFAULT_TASK_STATE);
  const update = (patch: Partial<TaskState>) => setState({ ...state, ...patch });

  const executionCycle = state.executionCycle ?? '2주';
  const workItems = splitLines(state.selectedWorkItems, 5);
  const criteria = splitLines(state.workItemCompletionCriteria, 5);
  const excluded = splitLines(state.excludedWorkItems, 4);
  const reduceTasks = state.selectedReduceTasks ?? [];
  const displayOutput = displayOutputName(state.selectedOutput, state.managementTask);
  const displayCompletion = displayCompletionStandard(state.completionStandard, state.managementTask);
  const evidence = `${displayOutput} / ${compact(state.outputLocation)} / 누락·다음 행동 확인 흔적`;

  const sequencePlaceholder = buildSequenceDraft(workItems, criteria);
  const rolePlaceholder = buildRoleDraft(workItems);
  const checkpointPlaceholder = buildCheckpointDraft(executionCycle, displayOutput, compact(state.outputLocation), displayCompletion);

  const buildAllDrafts = () => update({
    orderedWorkSteps: state.orderedWorkSteps || sequencePlaceholder,
    roleResponsibilityMap: state.roleResponsibilityMap || rolePlaceholder,
    scheduleCheckpoints: state.scheduleCheckpoints || checkpointPlaceholder,
    workloadAdjustments: state.workloadAdjustments || reduceTasks.join('\n'),
  });

  const buildAiPrompt = () => update({
    step7AiPrompt: [
      '역할: 당신은 제약영업팀장의 업무관리 실행지시 초안을 돕는 전문가입니다.',
      '',
      '[6단계 요약 입력값]',
      `관리할 업무과제: ${compact(state.managementTask)}`,
      `업무산출물: ${displayOutput}`,
      `기록 위치: ${compact(state.outputLocation)}`,
      `완료 기준: ${displayCompletion}`,
      `최종 선택 업무 단위:\n${compact(state.selectedWorkItems)}`,
      `업무별 완료 기준:\n${compact(state.workItemCompletionCriteria)}`,
      `6단계에서 제외한 업무:\n${compact(state.excludedWorkItems)}`,
      '',
      '[7단계 실행 설계]',
      `업무 순서:\n${compact(state.orderedWorkSteps || sequencePlaceholder)}`,
      `역할과 책임:\n${compact(state.roleResponsibilityMap || rolePlaceholder)}`,
      `일정과 체크포인트:\n${compact(state.scheduleCheckpoints || checkpointPlaceholder)}`,
      `잠시 줄일 일:\n${compact(state.workloadAdjustments || reduceTasks.join('\n'))}`,
      '',
      '[요청]',
      '팀원에게 전달할 업무지시 초안을 작성해 주세요.',
      '',
      '[반드시 지킬 원칙]',
      '1. KPI, CSF, 전략과제를 다시 만들거나 재해석하지 마세요.',
      '2. 팀원의 역량, 태도, 동기, 코칭 필요 여부를 판단하지 마세요.',
      '3. 병목 원인 분석이나 에스컬레이션 기준은 만들지 마세요. 이것은 8단계에서 다룹니다.',
      '4. 업무 배경, 해야 할 일, 산출물, 완료 기준, 역할, 일정, 중간 확인, 줄일 일만 포함하세요.',
    ].join('\n'),
  });

  const copyAiPrompt = async () => {
    const prompt = compact(state.step7AiPrompt);
    if (prompt === '미작성') { window.alert('먼저 AI 업무지시 프롬프트 만들기를 눌러 주세요.'); return; }
    try { await navigator.clipboard.writeText(prompt); window.alert('7단계 AI 프롬프트를 복사했습니다.'); } catch { window.prompt('아래 프롬프트를 직접 복사해 주세요.', prompt); }
  };

  const makeInstructionDraft = () => {
    const draft = compact(state.step7AiResult) !== '미작성'
      ? [state.step7AiResult, state.step7HumanReview ? `\n[사람 검토 보완]\n${state.step7HumanReview}` : ''].filter(Boolean).join('\n')
      : buildInstructionFromFields(state, displayOutput, displayCompletion);
    update({ taskInstructionDraft: draft, finalTaskInstruction: draft });
  };

  const makeStep8Handoff = () => update({
    step7HandoffToStep8: [
      '[8단계 전달 메모]',
      `업무 경계가 필요한 부분: ${compact(state.excludedWorkItems)}`,
      '병목이 예상되는 부분: 최종 선택 업무 단위가 일정 내 완료되지 않거나 기록 위치·완료 기준이 불명확한 경우',
      '담당자 권한 밖 이슈: 고객 데이터 접근, 부서 협조, 시스템 입력 권한 등',
      '에스컬레이션 후보: 반복 지연, 산출물 미등록, 필수 기록 누락, 역할 충돌',
    ].join('\n'),
  });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-amber-700">업무 순서와 업무지시</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">7단계: 업무 순서와 업무지시 만들기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">6단계 실행계획을 확인한 뒤 업무 순서, 역할과 책임, 일정과 체크포인트, 잠시 줄일 일을 정하고 AI로 업무지시 초안을 만듭니다.</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-black text-amber-800"><span className="rounded-full bg-amber-50 px-3 py-1">성과기준 재해석 금지</span><span className="rounded-full bg-amber-50 px-3 py-1">사람관리 판단 금지</span><span className="rounded-full bg-amber-50 px-3 py-1">업무지시 초안</span><span className="rounded-full bg-amber-50 px-3 py-1">8단계 전달</span></div>
    </section>

    <Card title="1. 6단계 실행계획 확인" tone="amber">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p className="mb-2 text-xs font-black text-amber-700">6단계 요약 입력값 · 긴 원문 표시 금지</p>
        <SummaryLine label="실행관리 주기" value={executionCycle} />
        <SummaryLine label="업무과제 유형" value={state.managementTaskType} />
        <SummaryLine label="관리할 업무과제" value={state.managementTask} />
        <SummaryLine label="업무산출물" value={displayOutput} />
        <SummaryLine label="기록 위치" value={state.outputLocation} />
        <SummaryLine label="완료 기준" value={displayCompletion} />
        <SummaryLine label="확인 증거" value={evidence} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950"><p className="font-black">최종 선택 업무 단위</p><ul className="mt-2 list-disc space-y-1 pl-4">{workItems.length ? workItems.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700"><p className="font-black text-slate-900">업무별 완료 기준</p><ul className="mt-2 list-disc space-y-1 pl-4">{criteria.length ? criteria.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul></div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold leading-5 text-slate-700"><p className="font-black text-slate-900">6단계에서 제외한 업무</p><ul className="mt-2 list-disc space-y-1 pl-4">{excluded.length ? excluded.map((item) => <li key={item}>{item}</li>) : <li>미작성</li>}</ul></div>
      </div>
    </Card>

    <Card title="2. 업무 순서 정하기" tone="cyan">
      <Field label="업무 순서표" help="6단계 최종 업무 단위 3~5개를 실행 순서로 배열합니다." value={state.orderedWorkSteps ?? ''} onChange={(value) => update({ orderedWorkSteps: value })} placeholder={sequencePlaceholder} minHeight="min-h-48" />
    </Card>

    <Card title="3. 역할과 책임 정하기" tone="cyan">
      <Field label="역할과 책임표" help="업무 단위별 담당, 팀장 확인 항목, 협업 필요 여부를 정합니다. 사람 평가가 아니라 업무 책임 명확화입니다." value={state.roleResponsibilityMap ?? ''} onChange={(value) => update({ roleResponsibilityMap: value })} placeholder={rolePlaceholder} minHeight="min-h-48" />
    </Card>

    <Card title="4. 일정과 체크포인트 정하기" tone="cyan">
      <Field label="일정과 체크포인트" help="시작일, 중간 확인일, 마감일, 확인할 산출물, 중간 확인 질문을 정합니다." value={state.scheduleCheckpoints ?? ''} onChange={(value) => update({ scheduleCheckpoints: value })} placeholder={checkpointPlaceholder} minHeight="min-h-48" />
    </Card>

    <Card title="5. 업무량 조정: 이번 주기에는 잠시 줄일 일" tone="amber">
      <div className="grid gap-2 md:grid-cols-2">
        {REDUCE_TASKS.map((task) => <label key={task} className="flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"><input type="checkbox" checked={reduceTasks.includes(task)} onChange={() => update({ selectedReduceTasks: toggle(reduceTasks, task) })} />{task}</label>)}
      </div>
      <Field label="실제로 줄일 일" value={state.workloadAdjustments ?? reduceTasks.join('\n')} onChange={(value) => update({ workloadAdjustments: value })} placeholder="이번 업무를 위해 잠시 줄일 일을 씁니다." />
      <button type="button" className="rounded-xl bg-amber-700 px-4 py-2 text-sm font-black text-white" onClick={buildAllDrafts}>업무 순서·역할·일정 초안 채우기</button>
    </Card>

    <Card title="6. AI로 업무지시 초안 만들기" tone="violet">
      <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildAiPrompt}>AI 업무지시 프롬프트 만들기</button><button type="button" className="rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-black text-violet-800" onClick={copyAiPrompt}>프롬프트 복사하기</button></div>
      <div className="grid gap-3 md:grid-cols-2"><Field label="AI에게 입력할 프롬프트" value={state.step7AiPrompt ?? ''} onChange={(value) => update({ step7AiPrompt: value })} placeholder="프롬프트 만들기 버튼을 누르면 생성됩니다." minHeight="min-h-64" /><Field label="AI 업무지시 초안 붙여넣기" value={state.step7AiResult ?? ''} onChange={(value) => update({ step7AiResult: value })} placeholder="AI가 작성한 업무지시 초안을 붙여넣습니다." minHeight="min-h-64" /></div>
      <Field label="사람 검토 보완" help="현장 언어로 수정할 내용, 제외할 내용, 팀장 확인 문장을 보완합니다." value={state.step7HumanReview ?? ''} onChange={(value) => update({ step7HumanReview: value })} placeholder="AI 초안을 그대로 쓰지 않고 사람이 보완할 내용을 씁니다." />
    </Card>

    <Card title="7. 사람 검토 후 최종 업무지시 확정" tone="emerald">
      <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={makeInstructionDraft}>최종 업무지시 확정하기</button>
      <Field label="최종 업무지시" value={state.finalTaskInstruction ?? state.taskInstructionDraft ?? ''} onChange={(value) => update({ finalTaskInstruction: value, taskInstructionDraft: value })} placeholder="확정 버튼을 누르면 업무지시 초안이 생성됩니다." minHeight="min-h-64" />
    </Card>

    <Card title="8. 8단계 업무 경계·병목 대응으로 넘기기" tone="slate">
      <button type="button" className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-black text-white" onClick={makeStep8Handoff}>8단계 전달 메모 만들기</button>
      <Field label="8단계 전달 메모" value={state.step7HandoffToStep8 ?? ''} onChange={(value) => update({ step7HandoffToStep8: value })} placeholder="업무 경계, 병목 예상, 권한 밖 이슈, 에스컬레이션 후보를 정리합니다." minHeight="min-h-40" />
    </Card>
  </section>;
}
