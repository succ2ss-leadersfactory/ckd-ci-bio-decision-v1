import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39StepHero } from './journey-v39-ux-components';
import { V41FlowStrip, V41StepNavigationProvider } from './journey-v41-ux-components';
import { V41ProgressCoachPanel } from './journey-v41-progress-coach-panel';
import { clampV41Step, V41_VISIBLE_APP_STEPS } from './journey-v41-preview-config';
import { V41PromptPracticeReviewLab } from './journey-v41-prompt-practice-review-lab';
import { V41ResearchStrategyTrimmedLab } from './journey-v41-research-strategy-trimmed-lab';
import { V41PerformanceCompactCascadeLab } from './journey-v41-performance-compact-cascade-lab';
import { V41TaskExecutionBridgeLab } from './journey-v41-task-execution-bridge-lab';
import { V41TaskPriorityFlowLab } from './journey-v41-task-priority-flow-lab';
import { V41TaskBoundaryCoordinationLab } from './journey-v41-task-boundary-coordination-lab';
import { V41PeopleSelectionLab } from './journey-v41-people-selection-lab';
import { V41OneOnOnePracticeLab } from './journey-v41-one-on-one-practice-lab';

type V41Participant = { groupName: string; tableName: string; representativeSituation: string; roleAccepted: boolean };
type V41Progress = { step: number };
type V41TeamMemberSignal = {
  name: string;
  role: string;
  territory: string;
  visitSignal: string;
  customerSignal: string;
  followUpSignal: string;
  coachingNeed: string;
  riskLevel: '높음' | '중간' | '낮음';
  firstQuestion: string;
};

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V41_PREVIEW_APP_MARKERS = ['V41PreviewApp','journey-v41-preview.html','v41 isolated app shell','v41 entry step simplified','v41 entry and team intro copy refined','v41 learner-facing title refined','v41 step 2 enriched team member signals','v41 team signal density restored','v41 prompt practice lab cloned','v41 research strategy lab cloned','v41 performance cascade lab cloned','v41 task execution bridge lab cloned','v41 task priority flow lab cloned','v41 task boundary coordination lab cloned','v41 people selection lab cloned','v41 one-on-one practice lab cloned','V41PromptPracticeReviewLab','V41ResearchStrategyTrimmedLab','V41PerformanceCompactCascadeLab','V41TaskExecutionBridgeLab','V41TaskPriorityFlowLab','V41TaskBoundaryCoordinationLab','V41PeopleSelectionLab','V41OneOnOnePracticeLab','v41 team name gate','v40-vNext parity scaffold with v41 core','V41_VISIBLE_APP_STEPS','V41FlowStrip','V41ProgressCoachPanel','ckd.v41.participant.v1','ckd.v41.progress.v1','ckd.v41.promptPracticeReview.v2','ckd.v41.pharmaStrategyResearch.v1','ckd.v41.performanceCascade.v1','ckd.v41.taskManagement.v10','ckd.v41.peopleManagement.v2','existing pilot URLs preserved','ckd-ai-lab.html 보호','journey-v40-vnext-preview.html 보호','src/journey-v40-vnext-*.tsx 직접 수정 금지'].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];
const TEAM_MEMBER_SIGNALS: V41TeamMemberSignal[] = [
  {
    name: '김재호 차장',
    role: '상급종합병원 핵심 KOL 담당',
    territory: '대학병원 · 내분비내과 중심',
    visitSignal: '방문 빈도와 관계 깊이는 높지만, 최근 GLP-1 비만 포트폴리오 메시지가 기존 당뇨 제품 설명 안에 묻히는 경향이 있습니다.',
    customerSignal: '고객은 “비만 환자군을 어떻게 선별할지”를 묻지만, 기록에는 질문 배경보다 면담 사실 위주로 남습니다.',
    followUpSignal: '다음 행동이 “자료 전달”로 반복되어, 처방 전환을 위한 환자 프로파일링 논의까지 이어지지 않습니다.',
    coachingNeed: 'KOL과의 대화를 시장 변화·환자군·처방 장벽 관점으로 재구성하도록 코칭이 필요합니다.',
    riskLevel: '중간',
    firstQuestion: '차장님, 최근 교수님 질문 중 단순 자료 요청이 아니라 처방 판단의 장벽을 보여준 질문은 무엇이었나요?',
  },
  {
    name: '김문호 차장',
    role: '종합병원 성장 거래처 담당',
    territory: '종합병원 · 비만 클리닉 확장 지역',
    visitSignal: '활동량은 안정적이지만 신규 비만 진료 흐름을 파악하는 방문 목적이 아직 선명하지 않습니다.',
    customerSignal: '고객 반응은 “관심 있음”으로 기록되지만, 실제 관심이 제품·환자·수가·부작용 중 어디에 있는지 구분이 약합니다.',
    followUpSignal: 'Follow-up 예정일은 잡지만, 다음 방문에서 확인할 질문이 구체화되지 않는 경우가 있습니다.',
    coachingNeed: '고객 반응을 한 문장으로 끝내지 않고 “관심의 이유와 다음 확인 질문”까지 남기게 해야 합니다.',
    riskLevel: '중간',
    firstQuestion: '차장님, “관심 있음”이라고 적은 고객은 정확히 무엇에 관심을 보였나요?',
  },
  {
    name: '유희관 과장',
    role: '의원급 신규 개척 담당',
    territory: '로컬 내과 · 가정의학과',
    visitSignal: '신규 방문은 많지만 고객별 우선순위가 넓게 퍼져 있어 핵심 타깃 집중도가 낮아질 수 있습니다.',
    customerSignal: '고객은 비만 환자 상담 시간과 순응도 이슈를 자주 언급하지만, 기록에는 제품 니즈만 강조됩니다.',
    followUpSignal: '다음 행동이 많아 보이나 실제로는 “재방문” 중심이라 실행 완료 여부 확인이 어렵습니다.',
    coachingNeed: '신규 개척 활동을 양보다 전환 가능성 기준으로 좁히고, A/B/C 타깃 구분이 필요합니다.',
    riskLevel: '높음',
    firstQuestion: '과장님, 이번 주 신규 방문 중 다음 2주 안에 실제 상담 변화가 가능한 곳은 어디인가요?',
  },
  {
    name: '이대은 대리',
    role: 'CRM 기록 우수자 · 실행 팔로업 담당',
    territory: '병원·의원 혼합 지역',
    visitSignal: '기록은 꼼꼼하지만 고객 반응과 다음 행동이 너무 세분화되어 팀장이 한눈에 판단하기 어렵습니다.',
    customerSignal: '고객의 말은 잘 남기지만, 그 말이 긍정 신호인지 보류 신호인지 해석이 부족합니다.',
    followUpSignal: 'Follow-up 체크는 성실하나 우선순위가 낮은 후속조치까지 모두 같은 무게로 관리합니다.',
    coachingNeed: '기록 품질을 유지하되, 팀장 보고용으로 “핵심 신호 1개 + 다음 행동 1개”로 압축하는 연습이 필요합니다.',
    riskLevel: '낮음',
    firstQuestion: '대리님, 기록 중 팀장이 오늘 바로 봐야 할 고객 신호 하나만 고르면 무엇인가요?',
  },
  {
    name: '신재영 대리',
    role: '실행 속도 우수자 · 메시지 적용 담당',
    territory: '성장 가능 의원군',
    visitSignal: '새 메시지를 빠르게 적용하지만, 고객 반응이 예상과 다를 때 메시지를 조정하는 근거가 약합니다.',
    customerSignal: '고객이 부작용·비용·대상 환자 질문을 던질 때, 질문을 학습 자료로 축적하기보다 현장에서 바로 넘기는 경향이 있습니다.',
    followUpSignal: '다음 행동은 빠르지만, 반복 방문에서 같은 질문이 재발하는지 추적이 부족합니다.',
    coachingNeed: '빠른 실행을 유지하면서 실패 신호를 학습 데이터로 바꾸는 회고 루틴이 필요합니다.',
    riskLevel: '중간',
    firstQuestion: '대리님, 최근 메시지가 먹히지 않았던 고객 질문 하나를 팀 학습 자료로 바꾼다면 무엇인가요?',
  },
  {
    name: '박재욱 사원',
    role: '신입 · 기본 방문 루틴 형성 단계',
    territory: '의원 신규/저활동 거래처',
    visitSignal: '방문 자체는 늘고 있지만 방문 목적, 고객 질문, 다음 행동을 분리해서 보는 힘이 아직 약합니다.',
    customerSignal: '고객 반응을 긍정/부정으로 단순 분류해, 실제 처방 장벽을 놓칠 가능성이 있습니다.',
    followUpSignal: 'Follow-up 일정을 잡아도 어떤 자료를 왜 다시 가져가야 하는지 연결이 약합니다.',
    coachingNeed: '방문 전 질문 1개, 방문 후 다음 행동 1개를 고정 루틴으로 잡아주는 밀착 코칭이 필요합니다.',
    riskLevel: '높음',
    firstQuestion: '사원님, 다음 방문 전에 꼭 확인해야 할 고객 질문 하나를 먼저 정해볼까요?',
  },
  {
    name: '문교원 사원',
    role: '신입 · 관계 형성 강점 보유',
    territory: '로컬 의원 · 관계 기반 거래처',
    visitSignal: '관계 형성은 빠르지만 제품 메시지와 고객 니즈를 연결하는 대화 전환이 아직 약합니다.',
    customerSignal: '고객과의 분위기는 좋으나, 기록에는 “분위기 좋음” 외에 처방 변화 가능성을 보여주는 근거가 부족합니다.',
    followUpSignal: '다음 행동이 고객 친밀도 유지에 머무를 수 있어, 구체적 처방 장벽 확인으로 연결해야 합니다.',
    coachingNeed: '관계 강점을 유지하면서 고객 니즈·환자군·처방 장벽 질문으로 전환하는 문장 연습이 필요합니다.',
    riskLevel: '중간',
    firstQuestion: '사원님, 분위기가 좋았던 고객에게 다음번에는 어떤 처방 장벽 질문을 해볼 수 있을까요?',
  },
];

function scrollV41ToTop() { window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
function isParticipantReady(p: V41Participant) { return Boolean(p.groupName.trim() && p.tableName.trim()); }
function showV41EntryGateMessage() { window.alert('먼저 팀과 이름/닉네임을 입력해 주세요. 그다음부터는 필요한 단계로 바로 이동할 수 있습니다.'); }
function Box({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>; }

function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  const ready = isParticipantReady(participant);
  return <div className="space-y-4"><V41FlowStrip currentStep={1} /><V39StepHero eyebrow="1단계 · 시작하기" icon="🚪" title="팀과 이름을 입력하고 바로 시작하세요" tone="indigo" description="오늘 실습은 C1바이오 영업팀장 관점으로 진행됩니다. 먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 바로 이동할 수 있습니다." badges={[{ label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' }, { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' }, { label: '방식', value: '필요 단계 이동', tone: 'amber', icon: '🧭' }]} /><Box title="시작 정보 입력"><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(e) => setParticipant({ ...participant, groupName: e.target.value })}><option value="">팀을 선택하세요</option>{TEAM_OPTIONS.map((team) => <option key={team}>{team}</option>)}</select><input className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(e) => setParticipant({ ...participant, tableName: e.target.value })} placeholder="이름/닉네임" /><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={participant.representativeSituation} onChange={(e) => setParticipant({ ...participant, representativeSituation: e.target.value })} placeholder="오늘 다뤄보고 싶은 상황" /><label className="flex gap-2 rounded-xl bg-slate-50 p-3"><input type="checkbox" checked={participant.roleAccepted} onChange={(e) => setParticipant({ ...participant, roleAccepted: e.target.checked })} />AI 결과는 답이 아니라 비교하고 고쳐 쓸 초안으로 다룹니다.</label>{!ready ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">팀과 이름/닉네임을 입력하면 다음 단계로 이동할 수 있습니다.</p> : null}</Box></div>;
}

function RiskBadge({ level }: { level: V41TeamMemberSignal['riskLevel'] }) {
  const className = level === '높음' ? 'bg-rose-50 text-rose-700 ring-rose-200' : level === '중간' ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  return <span className={`rounded-full px-2.5 py-1 text-xs font-black ring-1 ${className}`}>코칭 우선도 {level}</span>;
}

function RoleTeamIntroStep() {
  const highRiskCount = TEAM_MEMBER_SIGNALS.filter((member) => member.riskLevel === '높음').length;
  const midRiskCount = TEAM_MEMBER_SIGNALS.filter((member) => member.riskLevel === '중간').length;
  return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 팀원 실행 신호 보기" icon="👥" title="팀원 7명의 방문·기록·팔로업 신호를 먼저 읽습니다" tone="indigo" description="이 단계는 평가가 아니라 팀장이 어디를 먼저 봐야 하는지 판단하는 화면입니다. 활동량보다 고객 반응, 다음 행동, 코칭 필요 신호를 함께 봅니다." badges={[{ label: '역할', value: '이대호 팀장', tone: 'indigo', icon: '👤' }, { label: '팀원', value: '7명', tone: 'emerald', icon: '👥' }, { label: '우선 코칭', value: `${highRiskCount}명 높음 · ${midRiskCount}명 중간`, tone: 'amber', icon: '🔎' }]} />
    <Box title="팀장이 먼저 볼 핵심 신호">
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">방문 신호</p><p className="mt-1 font-black text-slate-900">활동량보다 방문 목적이 선명한가</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">고객 반응</p><p className="mt-1 font-black text-slate-900">관심·보류·장벽이 구분되어 있는가</p></div>
        <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">다음 행동</p><p className="mt-1 font-black text-slate-900">재방문이 아니라 확인 질문으로 이어지는가</p></div>
      </div>
    </Box>
    <Box title="팀원별 실행 신호와 첫 코칭 질문">
      <div className="grid gap-4 lg:grid-cols-2">
        {TEAM_MEMBER_SIGNALS.map((member) => <article key={member.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div><p className="text-lg font-black text-slate-950">{member.name}</p><p className="mt-1 text-xs font-bold text-slate-500">{member.role} · {member.territory}</p></div>
            <RiskBadge level={member.riskLevel} />
          </div>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            <p><b className="text-slate-950">방문 신호</b> — {member.visitSignal}</p>
            <p><b className="text-slate-950">고객 반응</b> — {member.customerSignal}</p>
            <p><b className="text-slate-950">Follow-up</b> — {member.followUpSignal}</p>
            <p><b className="text-slate-950">코칭 필요</b> — {member.coachingNeed}</p>
          </div>
          <div className="mt-4 rounded-2xl bg-indigo-50 p-3 text-sm font-bold leading-6 text-indigo-900"><span className="text-xs font-black text-indigo-500">첫 질문</span><br />{member.firstQuestion}</div>
        </article>)}
      </div>
    </Box>
  </div>;
}

function LabStep({ currentStep, children }: { currentStep: number; children: ReactNode }) { return <div className="space-y-4"><V41FlowStrip currentStep={currentStep} />{children}</div>; }

function V41PreviewApp() {
  const [participant, setParticipant] = useStored<V41Participant>(V41_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V41Progress>(V41_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const currentStep = clampV41Step(progress.step);
  const selectStep = (stepIndex: number) => { setProgress({ step: clampV41Step(stepIndex) }); scrollV41ToTop(); };
  const goPrev = () => selectStep(currentStep - 1);
  const goNext = () => { if (currentStep === 0 && !isParticipantReady(participant)) { showV41EntryGateMessage(); return; } selectStep(currentStep + 1); };
  const resetV41 = () => { removeStoredPrefix('ckd.v41.'); setParticipant(DEFAULT_PARTICIPANT); setProgress(DEFAULT_PROGRESS); scrollV41ToTop(); };
  const screens = [<EntryStep key="entry" participant={participant} setParticipant={setParticipant} />, <RoleTeamIntroStep key="role-team-intro" />, <LabStep key="ai-safety" currentStep={3}><AiSafetyLab /></LabStep>, <LabStep key="prompt-practice" currentStep={4}><V41PromptPracticeReviewLab /></LabStep>, <LabStep key="research-strategy" currentStep={5}><V41ResearchStrategyTrimmedLab /></LabStep>, <LabStep key="dashboard-analysis" currentStep={6}><V41PerformanceCompactCascadeLab /></LabStep>, <LabStep key="task-execution-design" currentStep={7}><V41TaskExecutionBridgeLab /></LabStep>, <LabStep key="task-priority-flow" currentStep={8}><V41TaskPriorityFlowLab /></LabStep>, <LabStep key="task-boundary-coordination" currentStep={9}><V41TaskBoundaryCoordinationLab /></LabStep>, <LabStep key="member-role" currentStep={10}><V41PeopleSelectionLab /></LabStep>, <LabStep key="people-dialogue" currentStep={11}><V41OneOnOnePracticeLab /></LabStep>];
  return <V41StepNavigationProvider onStepSelect={(n) => selectStep(n - 1)}><JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab" subtitle="성과관리, 업무관리, 사람관리 흐름을 팀장 관점으로 연습합니다. v41 Preview는 기존 파일럿과 분리된 검증용 화면입니다." steps={V41_VISIBLE_APP_STEPS} currentStep={currentStep} onPrev={goPrev} onNext={goNext} onStepSelect={selectStep} hideStepOverview><V41ProgressCoachPanel currentStep={currentStep} participant={participant} onStepSelect={selectStep} /><div className="mb-4 flex justify-end"><button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={resetV41}>v41 입력 초기화</button></div>{screens[currentStep] ?? screens[0]}</JourneyShell></V41StepNavigationProvider>;
}

if (!rootElement) throw new Error('journey-root element is required for v41 preview app.');
createRoot(rootElement).render(<V41PreviewApp />);
