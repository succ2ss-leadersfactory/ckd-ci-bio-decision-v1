import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39FinalCallPlanTeamSevenUxCard } from './journey-v39-final-call-plan-team-seven-ux-card';
import { V39InstructorDiscussionUxLab } from './journey-v39-instructor-discussion-ux-lab';
import { V39NotebookLmGuidedResearchLab } from './journey-v39-notebooklm-guided-research-lab';
import { V39PromptPracticeOptimizedLab } from './journey-v39-prompt-practice-optimized-lab';
import { V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';
import { V40VNextFlowStrip, V40VNextStepNavigationProvider } from './journey-v40-vnext-ux-components';
import { V40VNextFinalExecutionMemoLab } from './journey-v40-vnext-final-execution-memo-lab';
import { V40VNextOneOnOnePracticeLab } from './journey-v40-vnext-one-on-one-practice-lab';
import { V40VNextPeopleSelectionLab } from './journey-v40-vnext-people-selection-lab';
import { V40VNextPerformanceCompactCascadeLab } from './journey-v40-vnext-performance-compact-cascade-lab';
import { V40VNextProgressCoachPanel } from './journey-v40-vnext-progress-coach-panel';
import { V40VNextTaskBoundaryCoordinationLab } from './journey-v40-vnext-task-boundary-coordination-lab';
import { V40VNextTaskExecutionBridgeLab } from './journey-v40-vnext-task-execution-bridge-lab';
import { V40VNextTaskPriorityFlowLab } from './journey-v40-vnext-task-management-lab';
import { clampV40VNextStep, V40_VNEXT_VISIBLE_APP_STEPS } from './journey-v40-vnext-preview-config';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

const V40_VNEXT_STATIC_ROUTE_MARKERS = [
  'V40VNextPreviewApp',
  'journey-v40-vnext-preview.html',
  'v40-vNext 12단계 전용 흐름',
  '팀장 역할 시작하기',
  '역할과 팀원 구성 이해하기',
  '여러분은 오늘 C1바이오 영업팀장입니다',
  '팀 선택 1팀~8팀',
  '이름/닉네임 입력',
  '성과관리 → 업무관리 → 사람관리',
  'V40VNextPerformanceCompactCascadeLab',
  'V40VNextTaskExecutionBridgeLab',
  'V40VNextFlowStrip',
  'V40VNextProgressCoachPanel',
  'ckd.v40-vnext.performanceCascade.v1',
  'ckd.v40-vnext.finalExecutionMemo.v1',
  '김재호 차장',
  '김문호 차장',
  '유희관 과장',
  '이대은 대리',
  '신재영 대리',
  '박재욱 사원',
  '문교원 사원',
].join('|');
void V40_VNEXT_STATIC_ROUTE_MARKERS;

type V40VNextParticipant = {
  groupName: string;
  tableName: string;
  representativeSituation: string;
  roleAccepted: boolean;
};

type V40VNextProgress = { step: number };

type TeamMember = {
  name: string;
  role: string;
  signal: string;
};

const V40_VNEXT_STORAGE_KEYS = {
  participant: 'ckd.v40-vnext.participant.v1',
  progress: 'ckd.v40-vnext.progress.v1',
};

const DEFAULT_PARTICIPANT: V40VNextParticipant = {
  groupName: '',
  tableName: '',
  representativeSituation: '',
  roleAccepted: false,
};

const DEFAULT_PROGRESS: V40VNextProgress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];

const TEAM_MEMBERS: TeamMember[] = [
  { name: '김재호 차장', role: '경험 많은 선임 영업 담당', signal: '성과 경험은 많지만 기록 방식이 개인화되어 있습니다.' },
  { name: '김문호 차장', role: '안정적 실행형 담당', signal: '기본 활동은 꾸준하지만 새로운 실행 기준 전환은 느릴 수 있습니다.' },
  { name: '유희관 과장', role: '관계 기반 영업 담당', signal: '고객 관계는 좋지만 후속 실행 증거가 약해질 수 있습니다.' },
  { name: '이대은 대리', role: '활동량 높은 실행형 담당', signal: '움직임은 빠르지만 우선순위와 기록 품질 점검이 필요합니다.' },
  { name: '신재영 대리', role: '분석적이고 신중한 담당', signal: '판단은 세밀하지만 실행 속도와 대화 타이밍을 살펴야 합니다.' },
  { name: '박재욱 사원', role: '신입에 가까운 성장형 담당', signal: '업무 기준과 고객 대화의 안전선을 구체적으로 알려줘야 합니다.' },
  { name: '문교원 사원', role: '새로운 방식에 빠르게 적응하는 담당', signal: '도구 활용은 빠르지만 현장 언어로 바꾸는 코칭이 필요합니다.' },
];

function scrollV40VNextToTop() {
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function V40ComplianceNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      <p className="font-black">AI에 넣기 전 확인할 것</p>
      <p className="mt-1">실제 고객, 기관, 사람, 수치, 내부 전략처럼 식별되거나 민감한 정보는 가상·익명 표현으로 바꿉니다.</p>
    </div>
  );
}

function ShellCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function EntryStep({ participant, setParticipant }: { participant: V40VNextParticipant; setParticipant: (next: V40VNextParticipant) => void }) {
  return (
    <div className="space-y-4">
      <V40VNextFlowStrip currentStep={1} />
      <V39StepHero
        eyebrow="1단계 · 팀장 역할 시작하기"
        icon="🤝"
        title="여러분은 C1바이오 영업팀장 역할로 시작합니다"
        tone="indigo"
        description="실제 활동은 팀 단위로 진행하지만, 화면에서의 역할은 한 명의 영업팀장입니다. 여러분은 대표 상황을 정하고, 시장 변화와 팀원 실행 신호를 바탕으로 2주 실행 메모를 완성합니다."
        badges={[
          { label: '운영 방식', value: '팀장 역할 실습', tone: 'indigo', icon: '🤝' },
          { label: '참여 단위', value: '팀 활동', tone: 'emerald', icon: '👥' },
          { label: '핵심 산출물', value: '2주 실행 메모', tone: 'amber', icon: '📝' },
        ]}
      />
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🤝', title: '팀장 역할 잡기', body: 'C1바이오 영업팀장 관점에서 판단합니다.' },
            { icon: '👥', title: '팀원 구성 이해', body: '다음 단계에서 7명의 가상 팀원을 확인합니다.' },
            { icon: '📝', title: '대표 상황 정하기', body: '여러분이 다룰 대표 상황을 1개로 좁힙니다.' },
          ]}
        />
        <div className="mt-3">
          <V39MinimumChecklist tone="indigo" items={['팀 선택', '이름/닉네임 입력', '대표 상황 1개 작성', '팀장 역할 확인']} />
        </div>
      </section>
      <V40ComplianceNotice />
      <ShellCard title="여러분이 다룰 대표 상황">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">팀</span>
            <select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(event) => setParticipant({ ...participant, groupName: event.target.value })}>
              <option value="">팀을 선택하세요</option>
              {TEAM_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">이름/닉네임</span>
            <input
              className="w-full rounded-xl border bg-white px-3 py-2"
              value={participant.tableName}
              onChange={(event) => setParticipant({ ...participant, tableName: event.target.value })}
              placeholder="예: 김팀장, A테이블, 리더1"
            />
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-slate-500">여러분이 다룰 대표 상황</span>
          <textarea
            className="min-h-24 w-full rounded-xl border px-3 py-2"
            value={participant.representativeSituation}
            onChange={(event) => setParticipant({ ...participant, representativeSituation: event.target.value })}
            placeholder="예: 활동 기록은 늘었지만 고객 반응 이후 후속 실행이 약하고, 팀원별 기록 품질 차이가 커지고 있다."
          />
        </label>
        <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
          <input className="mt-1" type="checkbox" checked={participant.roleAccepted} onChange={(event) => setParticipant({ ...participant, roleAccepted: event.target.checked })} />
          <span>여러분은 오늘 C1바이오 영업팀장 역할로 판단하고, AI 결과는 답이 아니라 초안으로 다루겠습니다.</span>
        </label>
      </ShellCard>
    </div>
  );
}

function RoleTeamIntroStep() {
  return (
    <div className="space-y-4">
      <V40VNextFlowStrip currentStep={2} />
      <V39StepHero
        eyebrow="2단계 · 역할과 팀원 구성 이해하기"
        icon="👥"
        title="여러분은 오늘 C1바이오 영업팀장입니다"
        tone="indigo"
        description="실제 활동은 팀 단위로 진행하지만, 판단의 기준은 모두 팀장 역할입니다. 여러분은 7명의 팀원을 이끄는 영업팀장으로서 성과관리, 업무관리, 사람관리를 차례로 판단합니다."
        badges={[
          { label: '역할', value: '영업팀장', tone: 'indigo', icon: '👤' },
          { label: '팀원', value: '가상 7명', tone: 'emerald', icon: '👥' },
          { label: '판단 흐름', value: '성과·업무·사람관리', tone: 'amber', icon: '🧭' },
        ]}
      />
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-sm font-black text-cyan-950">여러분의 역할</p>
          <p className="mt-2 text-sm leading-6 text-cyan-900">시장 변화와 전사전략을 팀 실행 기준으로 바꾸고, 팀원별 실행 신호를 읽어 2주 실행 메모를 완성하는 영업팀장입니다.</p>
        </div>
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-black text-emerald-950">오늘의 관리 흐름</p>
          <p className="mt-2 text-sm leading-6 text-emerald-900">성과관리에서 기준을 세우고, 업무관리에서 실행 과제로 바꾸며, 사람관리에서 1on1 대화와 행동 합의를 준비합니다.</p>
        </div>
        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-black text-amber-950">판단 원칙</p>
          <p className="mt-2 text-sm leading-6 text-amber-900">AI는 답을 대신 정하지 않습니다. 여러분이 먼저 판단하고, AI 초안은 비교·수정·보완하는 재료로만 사용합니다.</p>
        </div>
      </section>
      <ShellCard title="가상 팀원 7명">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <div key={member.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-black text-slate-950">{member.name}</p>
              <p className="mt-1 text-xs font-bold text-slate-500">{member.role}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{member.signal}</p>
            </div>
          ))}
        </div>
        <p className="text-xs font-bold leading-5 text-slate-500">이 인물들은 교육용 가상 팀원입니다. 이후 단계에서 여러분은 이 팀원들의 실행 신호, 업무 흐름, 1on1 대화 초점을 판단합니다.</p>
      </ShellCard>
    </div>
  );
}

function V40AiSafetyStep() {
  return <div className="space-y-4"><V40VNextFlowStrip currentStep={3} /><V39StepHero eyebrow="3단계 · 말해도 되는 선 확인" icon="🛡️" title="현장 사례는 AI에 넣기 전에 한 번 가립니다" tone="amber" description="실제 현장 사례를 그대로 넣지 않습니다. 민감한 내용을 가상·익명 표현으로 바꿀수록 AI는 더 안전한 초안 도구가 됩니다." badges={[{ label: '먼저 할 일', value: '민감정보 제거', tone: 'amber', icon: '🛡️' }, { label: '방식', value: '가상·익명화', tone: 'slate', icon: '✂️' }, { label: '다음', value: '질문 다듬기', tone: 'violet', icon: '✍️' }]} /><V39SafetyStrip>기록에서 다음 행동의 단서를 찾고, AI 초안은 팀장 언어로 다시 고칩니다.</V39SafetyStrip><AiSafetyLab /></div>;
}

function V40PromptPracticeStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={4} /><V39StepHero eyebrow="4단계 · AI 질문 다듬기" icon="✍️" title="여러분의 고민을 AI가 일할 수 있는 질문으로 바꿉니다" tone="violet" description="대표 상황, 필요한 산출물, 말해도 되는 선을 함께 넣어 현장에서 쓸 수 있는 초안을 만듭니다." badges={[{ label: '앞 단계', value: '안전선 확인', tone: 'amber', icon: '🛡️' }, { label: '지금', value: '질문 구조화', tone: 'violet', icon: '✍️' }, { label: '다음', value: '성과관리 Lab', tone: 'sky', icon: '🔭' }]} /><V39PromptPracticeOptimizedLab /></div>; }
function V40ResearchStrategyStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={5} /><V39StepHero eyebrow="성과관리 1 · 시장 변화에서 성과 질문 찾기" icon="🔭" title="자료를 모으는 게 아니라 성과관리 질문을 뽑습니다" tone="sky" description="Perplexity로 공개자료를 찾고, NotebookLM으로 소스 기반 종합을 만들고, Studio 산출물 초안까지 정리합니다." badges={[{ label: '성과관리', value: '시장 변화 → 성과 질문', tone: 'sky', icon: '📈' }, { label: 'NotebookLM', value: '소스 기반 종합', tone: 'emerald', icon: '📚' }, { label: 'Studio', value: '보고서·슬라이드 초안', tone: 'violet', icon: '🎞️' }]} /><V39NotebookLmGuidedResearchLab /></div>; }
function V40DashboardStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={6} /><V39StepHero eyebrow="성과관리 2 · 전사전략과제 분해" icon="🎯" title="전사전략과제를 팀 전략과제·CSF·KPI와 2주 기준으로 바꿉니다" tone="emerald" description="전사전략과제를 선택하고, 여러분이 실행할 팀 전략과제·CSF·KPI를 정한 뒤 2주 성과관리 기준 4줄을 남깁니다." badges={[{ label: '산출물', value: '팀 전략과제·CSF·KPI', tone: 'emerald', icon: '🎯' }, { label: '압축 산출물', value: '2주 성과관리 기준', tone: 'sky', icon: '📝' }, { label: '주의', value: '민감정보 입력 금지', tone: 'amber', icon: '🛡️' }]} /><V40VNextPerformanceCompactCascadeLab /></div>; }
function V40TaskExecutionDesignStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={7} /><V39StepHero eyebrow="업무관리 1 · 성과 기준을 실행 과제로 바꾸기" icon="🧩" title="성과 기준을 팀원이 실제로 할 수 있는 일로 바꿉니다" tone="cyan" description="성과관리에서 남긴 2주 기준을 업무지시, 완료 기준, 지원 조건으로 바꿉니다." badges={[{ label: '앞에서 가져온 것', value: '2주 성과관리 기준', tone: 'emerald', icon: '📈' }, { label: '지금 할 일', value: '실행 과제화', tone: 'cyan', icon: '🧩' }, { label: '다음', value: '업무 흐름 정리', tone: 'amber', icon: '🧭' }]} /><V40VNextTaskExecutionBridgeLab /></div>; }
function V40TaskPriorityFlowStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={8} /><V39StepHero eyebrow="업무관리 2 · 우선순위와 업무 흐름 정리하기" icon="🧭" title="무엇을 먼저 하고 무엇을 잠시 줄일지 정합니다" tone="amber" description="업무관리는 일을 더 얹는 것이 아니라 실행 흐름을 다시 짜는 일입니다." badges={[{ label: '핵심', value: '우선순위·흐름', tone: 'amber', icon: '🧭' }, { label: '신호', value: '막힘 신호', tone: 'cyan', icon: '🔎' }, { label: '다음', value: '일의 경계 구분', tone: 'violet', icon: '🧱' }]} /><V40VNextTaskPriorityFlowLab /></div>; }
function V40TaskBoundaryCoordinationStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={9} /><V39StepHero eyebrow="업무관리 3 · 혼자 해결하면 안 되는 일 구분하기" icon="🧱" title="팀원이 혼자 처리할 일과 팀장이 연결해야 할 일을 나눕니다" tone="violet" description="팀원 자율 처리, 팀장 확인, 부서 협조, 상위 공유를 구분합니다." badges={[{ label: '경계', value: '혼자 처리 vs 확인 필요', tone: 'violet', icon: '🧱' }, { label: '협조', value: '부서 확인', tone: 'cyan', icon: '🔗' }, { label: '다음', value: '사람관리 Lab', tone: 'indigo', icon: '👥' }]} /><V40VNextTaskBoundaryCoordinationLab /></div>; }
function V40TeamMemberStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={10} /><V39StepHero eyebrow="사람관리 1 · 먼저 이야기할 팀원 고르기" icon="👤" title="신호를 보고, 해석을 늦추고, 먼저 대화할 팀원을 고릅니다" tone="indigo" description="업무관리 실행 결과를 바탕으로 1on1 대화 초점을 하나로 좁힙니다." badges={[{ label: '인물', value: '가상 팀원 7명', tone: 'indigo', icon: '👥' }, { label: '핵심', value: '관찰과 해석 분리', tone: 'amber', icon: '🔎' }, { label: '다음', value: '1on1 실천', tone: 'emerald', icon: '💬' }]} /><V40VNextPeopleSelectionLab /></div>; }
function V40PeopleDialogueStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={11} /><V39StepHero eyebrow="사람관리 2 · 1on1 대화 설계와 실천하기" icon="💬" title="첫 문장에서 행동 합의까지 1on1을 연습합니다" tone="emerald" description="확인 질문, 팀원 예상 반응, 리더 재질문, 2주 행동 합의까지 실제 대화 흐름으로 만듭니다." badges={[{ label: '대화 방식', value: '확인으로 시작', tone: 'emerald', icon: '💬' }, { label: '실천', value: '3분 역할극', tone: 'sky', icon: '🎭' }, { label: '다음', value: '통합 실행 메모', tone: 'indigo', icon: '✅' }]} /><V40VNextOneOnOnePracticeLab /></div>; }
function V40FinalStep() { return <div className="space-y-4"><V40VNextFlowStrip currentStep={12} /><V39StepHero eyebrow="12단계 · 2주 실행 메모와 복기 질문 완성하기" icon="✅" title="성과관리, 업무관리, 사람관리 결과를 하나의 2주 실행 메모로 묶습니다" tone="indigo" description="전사전략과제, 팀 전략과제, CSF/KPI, 실행 과제, 업무 흐름, 일의 경계, 1on1 문장과 복기 질문을 정리합니다." badges={[{ label: '성과관리', value: '전략 → CSF/KPI', tone: 'emerald', icon: '📈' }, { label: '업무관리', value: '일의 구조를 어떻게 짤 것인가', tone: 'cyan', icon: '🧩' }, { label: '사람관리', value: '누구와 어떻게 맞출 것인가', tone: 'indigo', icon: '👥' }]} /><V40VNextFinalExecutionMemoLab /><V39FinalCallPlanTeamSevenUxCard /><V39InstructorDiscussionUxLab /></div>; }

function renderStep(step: number, participant: V40VNextParticipant, setParticipant: (next: V40VNextParticipant) => void) {
  switch (V40_VNEXT_VISIBLE_APP_STEPS[step]?.id) {
    case 'entry': return <EntryStep participant={participant} setParticipant={setParticipant} />;
    case 'role-team-intro': return <RoleTeamIntroStep />;
    case 'ai-safety': return <V40AiSafetyStep />;
    case 'prompt-practice': return <V40PromptPracticeStep />;
    case 'research-strategy': return <V40ResearchStrategyStep />;
    case 'dashboard-analysis': return <V40DashboardStep />;
    case 'task-execution-design': return <V40TaskExecutionDesignStep />;
    case 'task-priority-flow': return <V40TaskPriorityFlowStep />;
    case 'task-boundary-coordination': return <V40TaskBoundaryCoordinationStep />;
    case 'member-role': return <V40TeamMemberStep />;
    case 'people-dialogue': return <V40PeopleDialogueStep />;
    case 'final-call-plan-card': return <V40FinalStep />;
    default: return <EntryStep participant={participant} setParticipant={setParticipant} />;
  }
}

function V40VNextPreviewApp() {
  const [participant, setParticipant] = useStored<V40VNextParticipant>(V40_VNEXT_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V40VNextProgress>(V40_VNEXT_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const safeStep = clampV40VNextStep(progress.step);
  const goToStep = (nextStep: number) => { setProgress({ step: clampV40VNextStep(nextStep) }); scrollV40VNextToTop(); };
  const handleReset = () => { removeStoredPrefix('ckd.v40-vnext.'); setParticipant(DEFAULT_PARTICIPANT); setProgress(DEFAULT_PROGRESS); scrollV40VNextToTop(); };
  return (
    <V40VNextStepNavigationProvider onStepSelect={(stepNumber) => goToStep(stepNumber - 1)}>
      <JourneyShell
        title="C1바이오 영업팀장 AI 리더십 Lab Journey"
        steps={V40_VNEXT_VISIBLE_APP_STEPS}
        currentStep={safeStep}
        onPrev={() => goToStep(safeStep - 1)}
        onNext={() => goToStep(safeStep + 1)}
        onStepSelect={goToStep}
        hideStepOverview={true}
      >
        <V40VNextProgressCoachPanel currentStep={safeStep} participant={participant} onStepSelect={goToStep} />
        {renderStep(safeStep, participant, setParticipant)}
      </JourneyShell>
    </V40VNextStepNavigationProvider>
  );
}

if (rootElement) createRoot(rootElement).render(<V40VNextPreviewApp />);
