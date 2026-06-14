import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_TASK_EXECUTION_BRIDGE_MARKERS = [
  'V41TaskExecutionBridgeLab',
  '업무관리 실행계획 만들기',
  '5단계에서 선택한 팀 기준 재료',
  '6단계에서 팀 성과기준 확정',
  '실행관리 주기 선택',
  'AI로 실행계획 초안 만들기',
  'AI 결과 검토 후 최종 실행계획 확정',
  '7단계 업무지시로 넘기기',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.taskManagement.v10',
].join('|');
void V41_TASK_EXECUTION_BRIDGE_MARKERS;

type PerformanceState = Record<string, any> & {
  selectedTeamTask?: string;
  customTeamTask?: string;
  selectedCsf?: string;
  selectedKpi?: string;
  selectedInitiative?: string;
  teamStandard?: string;
  finalExecutionStandard?: string;
};

type ExecutionCycle = '1주' | '2주' | '4주' | '월간' | '분기';

type TaskExecutionState = {
  confirmedTeamStandard: string;
  executionCycle: ExecutionCycle;
  executionTaskOne: string;
  executionTaskTwo: string;
  executionTaskThree: string;
  memberTasks: string;
  leaderCheckTasks: string;
  leaderSupportTasks: string;
  evidenceToCheck: string;
  midCheckQuestions: string;
  pauseActivities: string;
  expectedRisks: string;
  aiPrompt: string;
  aiResult: string;
  humanReview: string;
  finalExecutionPlan: string;
  taskInstructionDraft: string;
  peopleSignal: string;
  boundaryDeclaration: string;
};

const PERFORMANCE_STORAGE_KEY = 'ckd.v41.performanceCascade.v1';
const TASK_STORAGE_KEY = 'ckd.v41.taskManagement.v10';
const DEFAULT_PERFORMANCE_STATE: PerformanceState = {};
const EXECUTION_CYCLES: ExecutionCycle[] = ['1주', '2주', '4주', '월간', '분기'];
const DEFAULT_TASK_STATE: TaskExecutionState = {
  confirmedTeamStandard: '',
  executionCycle: '2주',
  executionTaskOne: '',
  executionTaskTwo: '',
  executionTaskThree: '',
  memberTasks: '',
  leaderCheckTasks: '',
  leaderSupportTasks: '',
  evidenceToCheck: '',
  midCheckQuestions: '',
  pauseActivities: '',
  expectedRisks: '',
  aiPrompt: '',
  aiResult: '',
  humanReview: '',
  finalExecutionPlan: '',
  taskInstructionDraft: '',
  peopleSignal: '',
  boundaryDeclaration: '',
};

function textOrEmpty(value?: string) {
  return value?.trim() || '';
}

function line(label: string, value?: string) {
  return <p><span className="font-black text-slate-700">{label}: </span><span>{textOrEmpty(value) || '미작성'}</span></p>;
}

function Card({ title, children, tone = 'slate' }: { title: string; children: ReactNode; tone?: 'slate' | 'cyan' | 'emerald' | 'violet' }) {
  const toneClass = tone === 'cyan' ? 'border-cyan-100' : tone === 'emerald' ? 'border-emerald-100' : tone === 'violet' ? 'border-violet-100' : 'border-slate-200';
  return <section className={`rounded-3xl border ${toneClass} bg-white p-4 shadow-sm md:p-5`}><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, help, value, onChange, placeholder, minHeight = 'min-h-24' }: { label: string; help?: string; value: string; onChange: (value: string) => void; placeholder: string; minHeight?: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span>{help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}<textarea className={`${minHeight} mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function cycleHelp(cycle: ExecutionCycle) {
  const map: Record<ExecutionCycle, string> = {
    '1주': '바로 확인할 기록, Follow-up 지연, 이번 주 행동 기준에 적합합니다.',
    '2주': '첫 실행 신호와 보완 지점을 확인하는 기본 실습 주기입니다.',
    '4주': '반복 실행 패턴과 팀원별 편차를 확인하기 좋습니다.',
    '월간': '고객 반응 변화, 메시지 개선, 인사이트 축적을 보기 좋습니다.',
    '분기': '전략과제 기여도와 방향 수정 여부를 판단할 때 적합합니다.',
  };
  return map[cycle];
}

function splitPlanLines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export function V41TaskExecutionBridgeLab() {
  const [performanceState] = useStored<PerformanceState>(PERFORMANCE_STORAGE_KEY, DEFAULT_PERFORMANCE_STATE);
  const [state, setState] = useStored<TaskExecutionState>(TASK_STORAGE_KEY, DEFAULT_TASK_STATE);
  const update = (patch: Partial<TaskExecutionState>) => setState({ ...state, ...patch });

  const teamTask = textOrEmpty(performanceState.customTeamTask) || textOrEmpty(performanceState.selectedTeamTask) || '5단계에서 선택한 팀 전략과제';
  const selectedCsf = textOrEmpty(performanceState.selectedCsf) || '5단계에서 선택한 팀 CSF';
  const selectedKpi = textOrEmpty(performanceState.selectedKpi) || '5단계에서 선택한 팀 KPI';
  const selectedInitiative = textOrEmpty(performanceState.selectedInitiative) || '5단계에서 선택한 세부 추진과제 후보';
  const aiReviewMaterial = textOrEmpty(performanceState.teamStandard);
  const transferStandard = textOrEmpty(performanceState.finalExecutionStandard);

  const criteriaMaterial = useMemo(() => {
    return [
      `팀 전략과제: ${teamTask}`,
      `팀 CSF: ${selectedCsf}`,
      `팀 KPI: ${selectedKpi}`,
      `세부 추진과제 후보: ${selectedInitiative}`,
      aiReviewMaterial ? `[AI 확장/사람 검토 재료]\n${aiReviewMaterial}` : '',
      transferStandard ? `[6단계 전환 기준]\n${transferStandard}` : '',
    ].filter(Boolean).join('\n');
  }, [teamTask, selectedCsf, selectedKpi, selectedInitiative, aiReviewMaterial, transferStandard]);

  const suggestedTeamStandard = useMemo(() => {
    return [
      '[6단계 확정 팀 성과기준]',
      `팀 전략과제: ${teamTask}`,
      `팀 CSF: ${selectedCsf}`,
      `팀 KPI: ${selectedKpi}`,
      `세부 추진과제 후보: ${selectedInitiative}`,
      aiReviewMaterial ? '[AI 확장/사람 검토 반영]\n5단계 AI 확장 결과 중 우리 팀에 맞는 항목만 반영한다.' : '',
      '확정 기준: CSF와 KPI의 연결이 끊기지 않고, 6단계에서 실행관리 주기·담당·증거·점검 질문으로 전환할 수 있어야 한다.',
    ].filter(Boolean).join('\n');
  }, [teamTask, selectedCsf, selectedKpi, selectedInitiative, aiReviewMaterial]);

  const confirmedTeamStandard = textOrEmpty(state.confirmedTeamStandard) || suggestedTeamStandard;
  const sourceEvidence = textOrEmpty(state.evidenceToCheck) || selectedKpi || '선택한 KPI를 확인할 증거를 6단계에서 정합니다.';

  const buildTeamStandard = () => update({ confirmedTeamStandard: suggestedTeamStandard });

  const buildAiPrompt = () => {
    update({
      aiPrompt: [
        '역할: 당신은 제약영업팀장의 업무관리 실행계획 수립을 돕는 성과관리 전문가이자 업무관리 코치입니다.',
        '',
        '[상황/맥락]',
        '아래는 5단계에서 선택·검토한 팀 기준 재료입니다. 아직 최종 실행계획은 아닙니다.',
        criteriaMaterial,
        '',
        '[6단계에서 확정한 팀 성과기준]',
        confirmedTeamStandard,
        '',
        `[선택한 실행관리 주기]\n${state.executionCycle} - ${cycleHelp(state.executionCycle)}`,
        '',
        '[과제/요청]',
        '위 팀 성과기준을 바탕으로 업무관리 실행계획을 만들어 주세요. 단순 할 일 목록이 아니라 실행과제, 담당자 역할, 팀장 확인 방식, 확인 증거, 중간 점검 질문, 잠시 줄일 일, 리스크 대응까지 포함해 주세요.',
        '',
        '[출력형식]',
        '1. 실행관리 주기',
        '2. 핵심 실행과제 3개',
        '3. 팀원이 할 일',
        '4. 팀장이 확인할 일',
        '5. 팀장이 지원할 일',
        '6. 확인 증거',
        '7. 중간 점검 질문',
        '8. 잠시 줄일 일',
        '9. 예상 리스크',
        '10. 다음 단계 업무지시 초안',
        '',
        '[제약/조건]',
        'CSF와 KPI의 연결이 끊기지 않게 작성해 주세요.',
        '실행계획은 팀원이 바로 이해할 수 있는 말로 작성해 주세요.',
        '확인 가능한 증거가 없는 계획은 제외해 주세요.',
        '실제 병원명, 의료진명, 고객명은 쓰지 마세요.',
        '검토되지 않은 표현이나 컴플라이언스 위험이 있는 문장은 피하세요.',
        '',
        '[검토 기준]',
        '구체성, 맥락, 실행 가능성, 팀장 언어, 확인 가능성을 기준으로 스스로 점검해 주세요.',
      ].join('\n'),
    });
  };

  const makeExecutionPlan = () => {
    const taskOne = textOrEmpty(state.executionTaskOne) || `${selectedKpi}를 확인할 수 있도록 관련 고객 반응과 다음 행동을 정해진 기준으로 기록한다.`;
    const taskTwo = textOrEmpty(state.executionTaskTwo) || `${selectedInitiative} 실행 과정에서 담당자별 진행상태와 Follow-up 지연 여부를 확인한다.`;
    const taskThree = textOrEmpty(state.executionTaskThree) || '팀장이 중간 점검에서 지연·지원 필요 항목을 확인하고 우선순위를 조정한다.';
    const memberTasks = textOrEmpty(state.memberTasks) || '팀원은 고객 반응, 다음 행동, Follow-up 상태를 정해진 기준으로 기록한다.';
    const leaderCheckTasks = textOrEmpty(state.leaderCheckTasks) || '팀장은 기록 샘플, 지연 항목, 지원 필요 고객군을 확인한다.';
    const leaderSupportTasks = textOrEmpty(state.leaderSupportTasks) || '팀장은 좋은 기록 예시와 우선순위 조정 기준을 제공한다.';
    const evidence = textOrEmpty(state.evidenceToCheck) || `${selectedKpi}와 연결된 CRM 기록, 고객 반응 기록, Follow-up 완료 여부`;
    const questions = textOrEmpty(state.midCheckQuestions) || `이번 실행에서 ${selectedKpi}가 보이는 증거는 무엇인가요? 막힌 고객군이나 지원이 필요한 담당자는 누구인가요?`;
    const pause = textOrEmpty(state.pauseActivities) || '팀 성과기준, CSF, KPI와 연결되지 않는 단순 활동량 늘리기와 장문 보고는 줄인다.';
    const risks = textOrEmpty(state.expectedRisks) || 'KPI가 활동량 지표로만 해석되거나, 확인 증거 없이 완료로 판단될 수 있다.';
    const aiReview = [textOrEmpty(state.aiResult), textOrEmpty(state.humanReview)].filter(Boolean).join('\n\n[사람 검토 보완]\n');
    const finalPlan = [
      `[확정한 팀 성과기준]\n${confirmedTeamStandard}`,
      `[실행관리 주기]\n${state.executionCycle} - ${cycleHelp(state.executionCycle)}`,
      `[핵심 실행과제]\n1. ${taskOne}\n2. ${taskTwo}\n3. ${taskThree}`,
      `[역할 배분]\n팀원이 할 일: ${memberTasks}\n팀장이 확인할 일: ${leaderCheckTasks}\n팀장이 지원할 일: ${leaderSupportTasks}`,
      `[확인 증거]\n${evidence}`,
      `[중간 점검 질문]\n${questions}`,
      `[잠시 줄일 일]\n${pause}`,
      `[예상 리스크]\n${risks}`,
      aiReview ? `[AI 결과 및 사람 검토 반영]\n${aiReview}` : '',
    ].filter(Boolean).join('\n\n');
    update({
      confirmedTeamStandard,
      executionTaskOne: taskOne,
      executionTaskTwo: taskTwo,
      executionTaskThree: taskThree,
      memberTasks,
      leaderCheckTasks,
      leaderSupportTasks,
      evidenceToCheck: evidence,
      midCheckQuestions: questions,
      pauseActivities: pause,
      expectedRisks: risks,
      finalExecutionPlan: finalPlan,
      taskInstructionDraft: `${memberTasks}\n\n완료 기준: ${evidence}\n중간 확인: ${questions}`,
      peopleSignal: '실행 지연, 기록 품질 편차, Follow-up 누락, 지원 필요 고객군을 사람관리 신호로 본다.',
      boundaryDeclaration: `이번 업무는 ${state.executionCycle} 실행관리 주기 안에서 KPI 확인 증거가 남는 범위까지 관리한다.`,
    });
  };

  const planLineCount = splitPlanLines(state.finalExecutionPlan).length;

  return <section className="space-y-4">
    <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">업무관리 실행계획 만들기</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">팀 기준 재료를 성과기준과 실행계획으로 확정하기</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">5단계에서 고른 전략과제·CSF·KPI는 아직 완성된 실행계획이 아닙니다. 이 단계에서 팀 성과기준을 확정하고 실행관리 주기, 실행과제, 담당, 증거, 점검 질문으로 전환합니다.</p>
    </section>

    <Card title="5단계에서 선택한 팀 기준 재료" tone="cyan">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        {line('팀 전략과제 후보', teamTask)}
        {line('팀 CSF 후보', selectedCsf)}
        {line('팀 KPI 후보', selectedKpi)}
        {line('세부 추진과제 후보', selectedInitiative)}
        {line('AI 확장/사람 검토 재료', aiReviewMaterial)}
        {line('6단계 전환 기준', transferStandard)}
      </div>
    </Card>

    <Card title="팀 성과기준 확정" tone="emerald">
      <p className="text-sm font-bold leading-6 text-slate-600">5단계 재료를 그대로 복사하지 말고, 팀장이 실제로 관리할 수 있는 성과기준 문장으로 확정합니다.</p>
      <button type="button" className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={buildTeamStandard}>5단계 재료로 팀 성과기준 초안 만들기</button>
      <Field label="확정할 팀 성과기준" help="6단계 실행계획의 기준이 되는 문장입니다. 전략과제, CSF, KPI, 확인 증거가 보이게 정리합니다." value={state.confirmedTeamStandard || suggestedTeamStandard} onChange={(value) => update({ confirmedTeamStandard: value })} placeholder="팀 성과기준을 확정하세요." minHeight="min-h-48" />
    </Card>

    <Card title="실행관리 주기 선택" tone="emerald">
      <div className="grid gap-2 md:grid-cols-5">
        {EXECUTION_CYCLES.map((cycle) => <label key={cycle} className={`rounded-2xl border p-3 text-sm font-black ${state.executionCycle === cycle ? 'border-emerald-300 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-100' : 'border-slate-200 bg-slate-50 text-slate-700'}`}><input className="mr-2" type="radio" checked={state.executionCycle === cycle} onChange={() => update({ executionCycle: cycle })} />{cycle}<span className="mt-2 block text-xs font-bold leading-5 text-slate-500">{cycleHelp(cycle)}</span></label>)}
      </div>
    </Card>

    <Card title="핵심 실행과제와 역할 설정" tone="slate">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="핵심 실행과제 1" value={state.executionTaskOne} onChange={(value) => update({ executionTaskOne: value })} placeholder="예: 핵심 고객 반응 기록 기준을 맞춘다." />
        <Field label="핵심 실행과제 2" value={state.executionTaskTwo} onChange={(value) => update({ executionTaskTwo: value })} placeholder="예: Follow-up 예정일과 완료 상태를 입력한다." />
        <Field label="핵심 실행과제 3" value={state.executionTaskThree} onChange={(value) => update({ executionTaskThree: value })} placeholder="예: 팀장이 지연·지원 필요 항목을 확인한다." />
        <Field label="팀원이 할 일" value={state.memberTasks} onChange={(value) => update({ memberTasks: value })} placeholder="팀원이 실제로 해야 할 행동을 씁니다." />
        <Field label="팀장이 확인할 일" value={state.leaderCheckTasks} onChange={(value) => update({ leaderCheckTasks: value })} placeholder="팀장이 확인할 기록, 지연, 지원 필요를 씁니다." />
        <Field label="팀장이 지원할 일" value={state.leaderSupportTasks} onChange={(value) => update({ leaderSupportTasks: value })} placeholder="좋은 예시, 우선순위 조정, 자료 확인 등 지원 기준을 씁니다." />
      </div>
    </Card>

    <Card title="확인 증거와 점검 방식" tone="slate">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="확인 증거" value={state.evidenceToCheck} onChange={(value) => update({ evidenceToCheck: value })} placeholder="CRM 기록, 고객 반응 기록, Follow-up 완료 여부 등" />
        <Field label="중간 점검 질문" value={state.midCheckQuestions} onChange={(value) => update({ midCheckQuestions: value })} placeholder="팀장이 중간에 물어볼 질문을 씁니다." />
        <Field label="잠시 줄일 일" value={state.pauseActivities} onChange={(value) => update({ pauseActivities: value })} placeholder="전략과 연결되지 않는 활동을 줄입니다." />
        <Field label="예상 리스크" value={state.expectedRisks} onChange={(value) => update({ expectedRisks: value })} placeholder="측정 불가, 업무 과부하, 기록 품질 편차 등" />
      </div>
    </Card>

    <Card title="AI로 업무관리 실행계획 초안 만들기" tone="violet">
      <button type="button" className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-black text-white" onClick={buildAiPrompt}>AI 실행계획 프롬프트 만들기</button>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="AI에게 입력할 프롬프트" value={state.aiPrompt} onChange={(value) => update({ aiPrompt: value })} placeholder="버튼을 누르면 김박사 추천 기준이 반영된 프롬프트가 생성됩니다." minHeight="min-h-56" />
        <Field label="AI 결과 붙여넣기" value={state.aiResult} onChange={(value) => update({ aiResult: value })} placeholder="AI가 만든 실행관리 계획 초안을 붙여넣습니다." minHeight="min-h-56" />
        <Field label="사람 검토 보완" value={state.humanReview} onChange={(value) => update({ humanReview: value })} placeholder="AI 결과 중 유지할 것, 수정할 것, 제외할 것을 씁니다." />
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4 text-xs font-bold leading-5 text-violet-950"><p className="font-black">검토 기준</p><p className="mt-2">CSF와 KPI 연결이 유지되는가?</p><p>팀원이 바로 실행할 수 있는가?</p><p>확인 가능한 증거가 있는가?</p><p>업무량이 과도하지 않은가?</p><p>컴플라이언스 위험 표현이 없는가?</p></div>
      </div>
      <button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={makeExecutionPlan}>AI 결과 반영해 실행계획 만들기</button>
    </Card>

    <Card title="최종 실행계획과 7단계 업무지시 초안" tone="emerald">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs font-black text-emerald-900">최종 실행계획 줄 수: {planLineCount}</div>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="최종 실행계획" value={state.finalExecutionPlan} onChange={(value) => update({ finalExecutionPlan: value })} placeholder="AI 결과 반영 버튼을 누르면 실행계획이 생성됩니다." minHeight="min-h-64" />
        <Field label="7단계 업무지시 초안" value={state.taskInstructionDraft} onChange={(value) => update({ taskInstructionDraft: value })} placeholder="7단계에서 업무지시 문장으로 다듬을 초안입니다." minHeight="min-h-64" />
        <Field label="사람관리 신호" value={state.peopleSignal} onChange={(value) => update({ peopleSignal: value })} placeholder="이 실행계획에서 사람관리로 이어질 신호를 적습니다." />
        <Field label="업무 경계 선언문" value={state.boundaryDeclaration} onChange={(value) => update({ boundaryDeclaration: value })} placeholder="이 업무의 범위와 확인 기준을 선언합니다." />
      </div>
    </Card>
  </section>;
}
