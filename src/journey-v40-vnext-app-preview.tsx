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
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero, V39StepNavigationProvider } from './journey-v39-ux-components';
import { V40VNextFinalExecutionMemoLab } from './journey-v40-vnext-final-execution-memo-lab';
import { V40VNextOneOnOnePracticeLab } from './journey-v40-vnext-one-on-one-practice-lab';
import { V40VNextPeopleSelectionLab } from './journey-v40-vnext-people-selection-lab';
import { V40VNextPerformanceRecordEvidenceLab, V40VNextPerformanceStrategyCascadeLab, V40VNextPerformanceTwoWeekFlowLab } from './journey-v40-vnext-performance-strategy-cascade-lab';
import { V40VNextProgressCoachPanel } from './journey-v40-vnext-progress-coach-panel';
import { V40VNextTaskBoundaryCoordinationLab } from './journey-v40-vnext-task-boundary-coordination-lab';
import { V40VNextTaskExecutionDesignLab, V40VNextTaskPriorityFlowLab } from './journey-v40-vnext-task-management-lab';
import { clampV40VNextStep, V40_VNEXT_VISIBLE_APP_STEPS } from './journey-v40-vnext-preview-config';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V40_VNEXT_STATIC_ROUTE_MARKERS = [
  'V40VNextPreviewApp',
  'journey-v40-vnext-preview.html',
  'v40-vNext 계승형 후속 버전',
  'v39 기준 원본 보호',
  '성과관리 → 업무관리 → 사람관리',
  '조별 실습형',
  '우리 조가 다룰 대표 상황',
  '우리 조가 선택한 기준',
  '우리 조가 준비한 첫 문장',
  '우리 조의 2주 실행 메모 초안',
  '성과관리 1: 시장 변화에서 성과 질문 찾기',
  '성과관리 2: 전사전략과제를 팀 과제·CSF·KPI로 분해하기',
  '성과관리 3: CSF/KPI를 고객 활동 기록 확인 항목으로 바꾸기',
  '성과관리 4: 팀 과제·CSF·KPI별 2주 실행 흐름 정하기',
  '업무관리 1: 성과 기준을 실행 과제로 바꾸기',
  '업무관리 2: 우선순위와 업무 흐름 정리하기',
  '업무관리 3: 혼자 해결하면 안 되는 일 구분하기',
  '사람관리 1: 먼저 이야기할 팀원 고르기',
  '사람관리 2: 1on1 대화 설계와 실천하기',
  'V40VNextPerformanceStrategyCascadeLab',
  'V40VNextPerformanceRecordEvidenceLab',
  'V40VNextPerformanceTwoWeekFlowLab',
  'ckd.v40-vnext.performanceCascade.v1',
  '종근당 연계 전사전략과제',
  '전사전략과제 → 팀 과제 → CSF → KPI → 고객 활동 기록 → 2주 실행',
  'V40VNextTaskExecutionDesignLab',
  'V40VNextTaskPriorityFlowLab',
  'V40VNextTaskBoundaryCoordinationLab',
  'V40VNextPeopleSelectionLab',
  'V40VNextOneOnOnePracticeLab',
  'V40VNextFinalExecutionMemoLab',
  'V40VNextProgressCoachPanel',
  '지금 단계 코치',
  '이번 단계 행동',
  '완성 산출물',
  'ckd.v40-vnext.finalExecutionMemo.v1',
  'Perplexity 리서치 질문',
  'perplexityAnswer',
  'notebookSourceBundle',
  'notebookLmAnswer',
  'issueOne',
  'issueTwo',
  'issueThree',
  'teamImpact',
  'metricBridgeQuestions',
  'studioReportDraft',
  'studioSlideOutline',
  'studioInfographicDraft',
  'strategyMeetingMemo',
  'expectedQuestions',
  'complianceCaution',
  '신재영 대리',
  '이대은 대리',
  '박재욱 사원',
  '유희관 과장',
  '김문호 차장',
  '김재호 차장',
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
const GROUP_OPTIONS = ['1조', '2조', '3조', '4조', '5조', '6조', '7조', '8조', '9조', '10조', '11조', '12조'];
const TABLE_OPTIONS = ['1팀 A조', '1팀 B조', '2팀 A조', '2팀 B조', '3팀 A조', '3팀 B조', '4팀 A조', '4팀 B조', '5팀 A조', '5팀 B조', '6팀 A조', '6팀 B조'];

function scrollV40VNextToTop() {
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

function V40ComplianceNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
      <p className="font-black">AI에 그대로 넣으면 안 되는 말</p>
      <p className="mt-1">실제 고객명, 병원명, 의료진명, 제품명, 실제 매출자료, 처방 정보, 팀원 실명, 내부 전략, 개인정보, 개인 성과등급, 미승인 효능, 허가 외 사용 암시, 처방 유도 표현, 경쟁사 비방, 비교 우위 단정은 입력하지 않습니다.</p>
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
      <V39FlowStrip currentStep={1} />
      <V39StepHero eyebrow="1단계 · 조별 역할 잡기" icon="🤝" title="오늘은 우리 조가 C1바이오 영업팀장입니다" tone="indigo" description="개인 답을 쓰는 시간이 아닙니다. 우리 조가 하나의 대표 상황을 정하고, 시장 변화와 고객 기록, 팀원 움직임을 놓고 다음 2주 실행 메모를 함께 만듭니다. 모든 문장은 조별 실습형으로 남깁니다." badges={[{ label: '운영 방식', value: '조별 실습', tone: 'indigo', icon: '🤝' }, { label: '조 구성', value: '2~3명', tone: 'emerald', icon: '👥' }, { label: '핵심 산출물', value: '2주 실행 메모', tone: 'amber', icon: '📝' }]} />
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow items={[{ icon: '🤝', title: '우리 조 역할 잡기', body: 'C1바이오 영업팀장 관점에서 판단합니다.' }, { icon: '🛡️', title: '말해도 되는 선 확인', body: '실제 민감정보는 모두 빼고 가상 상황으로 씁니다.' }, { icon: '📝', title: '대표 상황 정하기', body: '우리 조가 다룰 대표 상황을 1개로 좁힙니다.' }]} />
        <div className="mt-3"><V39MinimumChecklist tone="indigo" items={['조/팀 선택', '대표 상황 1개 작성', '조별 실습 역할 확인']} /></div>
      </section>
      <V40ComplianceNotice />
      <ShellCard title="우리 조가 다룰 대표 상황">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1"><span className="text-xs font-bold text-slate-500">조 이름</span><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(event) => setParticipant({ ...participant, groupName: event.target.value })}><option value="">조를 선택하세요</option>{GROUP_OPTIONS.map((group) => <option key={group} value={group}>{group}</option>)}</select></label>
          <label className="space-y-1"><span className="text-xs font-bold text-slate-500">운영 팀/테이블</span><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(event) => setParticipant({ ...participant, tableName: event.target.value })}><option value="">테이블을 선택하세요</option>{TABLE_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}</select></label>
        </div>
        <label className="block space-y-1"><span className="text-xs font-bold text-slate-500">우리 조가 다룰 대표 상황</span><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={participant.representativeSituation} onChange={(event) => setParticipant({ ...participant, representativeSituation: event.target.value })} placeholder="예: 활동 기록은 늘었지만 고객 반응 이후 후속 실행이 약하고, 팀원별 기록 품질 차이가 커지고 있다." /></label>
        <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3"><input className="mt-1" type="checkbox" checked={participant.roleAccepted} onChange={(event) => setParticipant({ ...participant, roleAccepted: event.target.checked })} /><span>우리 조는 오늘 C1바이오 영업팀장 역할로 판단하고, AI 결과는 답이 아니라 초안으로 다루겠습니다.</span></label>
      </ShellCard>
    </div>
  );
}

function V40AiSafetyStep() { return <div className="space-y-4"><V39FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 말해도 되는 선 확인" icon="🛡️" title="조별 토의 내용도 AI에 넣기 전에는 한 번 지워야 합니다" tone="amber" description="우리 조가 이야기한 현장 사례를 그대로 넣지 않습니다. 실제 고객, 기관, 제품, 수치, 사람을 가릴수록 AI는 더 안전한 초안 도구가 됩니다." badges={[{ label: '먼저 할 일', value: '민감정보 제거', tone: 'amber', icon: '🛡️' }, { label: '방식', value: '가상·익명화', tone: 'slate', icon: '✂️' }, { label: '다음', value: '질문 다듬기', tone: 'violet', icon: '✍️' }]} /><V39SafetyStrip>고객을 평가하거나 등급화하지 않습니다. 기록에서 다음 행동의 단서를 찾고, AI 초안은 팀장 언어로 다시 고칩니다.</V39SafetyStrip><AiSafetyLab /></div>; }
function V40PromptPracticeStep() { return <div className="space-y-4"><V39FlowStrip currentStep={3} /><V39StepHero eyebrow="3단계 · AI 질문 다듬기" icon="✍️" title="우리 조의 고민을 AI가 일할 수 있는 질문으로 바꿉니다" tone="violet" description="그냥 ‘어떻게 할까요?’라고 묻지 않습니다. 우리 조가 다룰 대표 상황, 필요한 산출물, 말해도 되는 선을 함께 넣어야 현장에서 쓸 수 있는 초안이 나옵니다." badges={[{ label: '앞 단계', value: '안전선 확인', tone: 'amber', icon: '🛡️' }, { label: '지금', value: '질문 구조화', tone: 'violet', icon: '✍️' }, { label: '다음', value: '성과관리 Lab', tone: 'sky', icon: '🔭' }]} /><V39PromptPracticeOptimizedLab /></div>; }
function V40ResearchStrategyStep() { return <div className="space-y-4"><V39FlowStrip currentStep={4} /><V39StepHero eyebrow="성과관리 1 · 시장 변화에서 성과 질문 찾기" icon="🔭" title="자료를 모으는 게 아니라 성과관리 질문을 뽑습니다" tone="sky" description="Perplexity로 공개자료를 찾고, NotebookLM으로 소스 기반 종합을 만들고, Studio 산출물 초안까지 정리합니다. 핵심은 우리 조가 이번 2주 동안 무엇을 성과 기준으로 볼지 질문을 뽑는 것입니다." badges={[{ label: '성과관리', value: '시장 변화 → 성과 질문', tone: 'sky', icon: '📈' }, { label: 'NotebookLM', value: '소스 기반 종합', tone: 'emerald', icon: '📚' }, { label: 'Studio', value: '보고서·슬라이드 초안', tone: 'violet', icon: '🎞️' }]} /><V39NotebookLmGuidedResearchLab /></div>; }
function V40DashboardStep() { return <div className="space-y-4"><V39FlowStrip currentStep={5} /><V39StepHero eyebrow="성과관리 2 · 전사전략과제 분해" icon="🎯" title="종근당 연계 전사전략과제를 팀 과제·CSF·KPI로 바꿉니다" tone="emerald" description="공개 전략 키워드를 교육용 전사전략과제로 가공하고, 우리 팀 과제와 성공조건, 관리 지표로 번역합니다." badges={[{ label: '산출물', value: '팀 과제·CSF·KPI', tone: 'emerald', icon: '🎯' }, { label: 'AI 활용', value: '전략 번역', tone: 'sky', icon: '🤖' }, { label: '주의', value: '실제 제품·고객명 금지', tone: 'amber', icon: '🛡️' }]} /><V40VNextPerformanceStrategyCascadeLab /></div>; }
function V40CustomerJudgmentStep() { return <div className="space-y-4"><V39FlowStrip currentStep={6} /><V39StepHero eyebrow="성과관리 3 · 고객 활동 기록 증거" icon="🔎" title="CSF/KPI를 고객 활동 기록 확인 항목으로 바꿉니다" tone="sky" description="선택한 KPI가 고객 활동 기록에서 어떤 증거로 확인되는지 보고, 부족 정보와 과잉해석 위험, 팀원 확인 질문을 남깁니다." badges={[{ label: '관점', value: 'KPI → 기록 증거', tone: 'sky', icon: '🔎' }, { label: '금지', value: '고객 등급화 금지', tone: 'amber', icon: '🛡️' }, { label: '다음', value: '2주 실행 흐름', tone: 'violet', icon: '🧭' }]} /><V40VNextPerformanceRecordEvidenceLab /></div>; }
function V40CustomerPriorityStep() { return <div className="space-y-4"><V39FlowStrip currentStep={7} /><V39StepHero eyebrow="성과관리 4 · 2주 실행 흐름" icon="🧭" title="팀 과제·CSF·KPI별 2주 실행 흐름을 정합니다" tone="violet" description="전사전략과제에서 내려온 팀 과제를 이번 2주 동안 무엇을 확인하고, 무엇을 줄이고, 어떻게 설명할지로 바꿉니다." badges={[{ label: '핵심', value: '2주 실행 흐름', tone: 'violet', icon: '🧭' }, { label: '팀장 언어', value: '회의 3문장', tone: 'emerald', icon: '💬' }, { label: '다음', value: '업무관리 Lab', tone: 'cyan', icon: '🧩' }]} /><V40VNextPerformanceTwoWeekFlowLab /></div>; }
function V40TaskExecutionDesignStep() { return <div className="space-y-4"><V39FlowStrip currentStep={8} /><V39StepHero eyebrow="업무관리 1 · 성과 기준을 실행 과제로 바꾸기" icon="🧩" title="성과 기준을 팀원이 실제로 할 수 있는 일로 바꿉니다" tone="cyan" description="업무지시 명확화는 이 단계 안에 통합합니다. 성과관리 결과를 팀원이 무엇을, 어디까지, 언제까지 하면 되는지 알 수 있는 실행 과제로 바꿉니다." badges={[{ label: '앞에서 가져온 것', value: '팀 과제·CSF·KPI', tone: 'emerald', icon: '📈' }, { label: '지금 할 일', value: '실행 과제화', tone: 'cyan', icon: '🧩' }, { label: '다음', value: '업무 흐름 정리', tone: 'amber', icon: '🧭' }]} /><V40VNextTaskExecutionDesignLab /></div>; }
function V40TaskPriorityFlowStep() { return <div className="space-y-4"><V39FlowStrip currentStep={9} /><V39StepHero eyebrow="업무관리 2 · 우선순위와 업무 흐름 정리하기" icon="🧭" title="무엇을 먼저 하고 무엇을 잠시 줄일지 정합니다" tone="amber" description="업무관리는 일을 더 얹는 것이 아니라 실행 흐름을 다시 짜는 일입니다. 먼저 할 일, 잠시 줄일 일, 흐름 3단계, 막힘 신호, 중간 확인 질문을 정리합니다." badges={[{ label: '핵심', value: '우선순위·흐름', tone: 'amber', icon: '🧭' }, { label: '신호', value: '막힘 신호', tone: 'cyan', icon: '🔎' }, { label: '다음', value: '일의 경계 구분', tone: 'violet', icon: '🧱' }]} /><V40VNextTaskPriorityFlowLab /></div>; }
function V40TaskBoundaryCoordinationStep() { return <div className="space-y-4"><V39FlowStrip currentStep={10} /><V39StepHero eyebrow="업무관리 3 · 혼자 해결하면 안 되는 일 구분하기" icon="🧱" title="팀원이 혼자 처리할 일과 팀장이 연결해야 할 일을 나눕니다" tone="violet" description="업무관리의 마지막은 사람을 평가하는 것이 아니라 일의 경계를 정리하는 것입니다. 팀원 자율 처리, 팀장 확인, 부서 협조, 상위 공유, 주의 표현을 구분합니다." badges={[{ label: '경계', value: '혼자 처리 vs 확인 필요', tone: 'violet', icon: '🧱' }, { label: '협조', value: '부서 확인', tone: 'cyan', icon: '🔗' }, { label: '다음', value: '사람관리 Lab', tone: 'indigo', icon: '👥' }]} /><V40VNextTaskBoundaryCoordinationLab /></div>; }
function V40TeamMemberStep() { return <div className="space-y-4"><V39FlowStrip currentStep={11} /><V39StepHero eyebrow="사람관리 1 · 먼저 이야기할 팀원 고르기" icon="👥" title="신호를 보고, 해석을 늦추고, 먼저 대화할 팀원을 고릅니다" tone="indigo" description="9·10단계 실행 결과를 바탕으로 팀원별 실행 신호를 보고, 관찰한 행동과 위험한 해석을 분리한 뒤 1on1 대화 초점을 하나로 좁힙니다." badges={[{ label: '인물 계승', value: '기존 7명 유지', tone: 'indigo', icon: '👥' }, { label: '핵심', value: '관찰과 해석 분리', tone: 'amber', icon: '🔎' }, { label: '다음', value: '1on1 실천', tone: 'emerald', icon: '💬' }]} /><V40VNextPeopleSelectionLab /></div>; }
function V40PeopleDialogueStep() { return <div className="space-y-4"><V39FlowStrip currentStep={12} /><V39StepHero eyebrow="사람관리 2 · 1on1 대화 설계와 실천하기" icon="💬" title="첫 문장에서 행동 합의까지 1on1을 연습합니다" tone="emerald" description="첫 문장만 만드는 것이 아니라 확인 질문, 팀원 예상 반응, 리더 재질문, 2주 행동 합의, 리허설, 후속 확인 질문까지 실제 대화 흐름으로 만듭니다." badges={[{ label: '대화 방식', value: '확인으로 시작', tone: 'emerald', icon: '💬' }, { label: '실천', value: '3분 역할극', tone: 'sky', icon: '🎭' }, { label: '다음', value: '통합 실행 메모', tone: 'indigo', icon: '✅' }]} /><V40VNextOneOnOnePracticeLab /></div>; }
function V40FinalStep() { return <div className="space-y-4"><V39FlowStrip currentStep={13} /><V39StepHero eyebrow="13단계 · 2주 실행 메모와 복기 질문 완성하기" icon="✅" title="성과관리, 업무관리, 사람관리 결과를 하나의 2주 실행 메모로 묶습니다" tone="indigo" description="전략과제, 팀 과제, CSF/KPI, 실행 과제, 업무 흐름, 일의 경계, 1on1 첫 문장과 복기 질문을 하나의 메모로 정리합니다." badges={[{ label: '성과관리', value: '전략 → CSF/KPI', tone: 'emerald', icon: '📈' }, { label: '업무관리', value: '일의 구조를 어떻게 짤 것인가', tone: 'cyan', icon: '🧩' }, { label: '사람관리', value: '누구와 어떻게 맞출 것인가', tone: 'indigo', icon: '👥' }]} /><V40VNextFinalExecutionMemoLab /><V39FinalCallPlanTeamSevenUxCard /><V39InstructorDiscussionUxLab /></div>; }

function renderStep(step: number, participant: V40VNextParticipant, setParticipant: (next: V40VNextParticipant) => void) {
  switch (V40_VNEXT_VISIBLE_APP_STEPS[step]?.id) {
    case 'entry': return <EntryStep participant={participant} setParticipant={setParticipant} />;
    case 'ai-safety': return <V40AiSafetyStep />;
    case 'prompt-practice': return <V40PromptPracticeStep />;
    case 'research-strategy': return <V40ResearchStrategyStep />;
    case 'dashboard-analysis': return <V40DashboardStep />;
    case 'customer-judgment': return <V40CustomerJudgmentStep />;
    case 'customer-priority': return <V40CustomerPriorityStep />;
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
    <V39StepNavigationProvider onStepSelect={(stepNumber) => goToStep(stepNumber - 1)}>
      <JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab Journey v40-vNext" subtitle="v39의 산출물, UI/UX, 현장언어, 등장인물을 계승하고 성과관리 → 업무관리 → 사람관리 순서로 재구성한 조별 실습형 후속 버전입니다." steps={V40_VNEXT_VISIBLE_APP_STEPS} currentStep={safeStep} onPrev={() => goToStep(safeStep - 1)} onNext={() => goToStep(safeStep + 1)} onStepSelect={goToStep} hideStepOverview={false}>
        <div className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-cyan-700">v40-vNext 보호 기준</p><p className="mt-1 text-sm font-bold leading-6 text-slate-600">기존 v39는 기준 원본으로 보호합니다. 이 화면은 별도 route에서만 작동하며, 성과관리 → 업무관리 → 사람관리 순서로 조별 실습을 진행합니다.</p></div><button type="button" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-700" onClick={handleReset}>v40-vNext 입력 초기화</button></div></div>
        <V40VNextProgressCoachPanel currentStep={safeStep} participant={participant} onStepSelect={goToStep} />
        {renderStep(safeStep, participant, setParticipant)}
      </JourneyShell>
    </V39StepNavigationProvider>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V40VNextPreviewApp />);
}
