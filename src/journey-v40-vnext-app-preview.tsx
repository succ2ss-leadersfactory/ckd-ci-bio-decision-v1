import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { AiSafetyLab } from './journey-v36-ai-safety-lab';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39AiCallPlanGuidedUxLab } from './journey-v39-ai-call-plan-guided-ux-lab';
import { V39ComplianceCleanupUxLab } from './journey-v39-compliance-cleanup-ux-lab';
import { V39CustomerJudgmentUxLab } from './journey-v39-customer-judgment-ux-lab';
import { V39CustomerPriorityUxLab } from './journey-v39-customer-priority-ux-lab';
import { V39DashboardAnalysisUxLab } from './journey-v39-dashboard-analysis-ux-lab';
import { V39FinalCallPlanTeamSevenUxCard } from './journey-v39-final-call-plan-team-seven-ux-card';
import { V39InstructorDiscussionUxLab } from './journey-v39-instructor-discussion-ux-lab';
import { V39NotebookLmGuidedResearchLab } from './journey-v39-notebooklm-guided-research-lab';
import { V39PeopleDialogueUxLab } from './journey-v39-people-dialogue-ux-lab';
import { V39PromptPracticeOptimizedLab } from './journey-v39-prompt-practice-optimized-lab';
import { V39TeamSevenCoachingUxWrapper } from './journey-v39-team-seven-coaching-ux-wrapper';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero, V39StepNavigationProvider } from './journey-v39-ux-components';
import { V40VNextTaskManagementLab } from './journey-v40-vnext-task-management-lab';
import { clampV40VNextStep, V40_VNEXT_VISIBLE_APP_STEPS } from './journey-v40-vnext-preview-config';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V40_VNEXT_STATIC_ROUTE_MARKERS = [
  'V40VNextPreviewApp',
  'journey-v40-vnext-preview.html',
  'v40-vNext 계승형 후속 버전',
  'v39 기준 원본 보호',
  '조별 실습형',
  '우리 조가 다룰 대표 상황',
  '우리 조가 선택한 기준',
  '우리 조가 준비한 첫 문장',
  '우리 조의 2주 실행 메모 초안',
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
  'V40VNextTaskManagementLab',
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

type V40VNextProgress = {
  step: number;
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

const DEFAULT_PROGRESS: V40VNextProgress = {
  step: 0,
};

const GROUP_OPTIONS = ['1조', '2조', '3조', '4조', '5조', '6조', '7조', '8조', '9조', '10조', '11조', '12조'];
const TABLE_OPTIONS = ['1팀 A조', '1팀 B조', '2팀 A조', '2팀 B조', '3팀 A조', '3팀 B조', '4팀 A조', '4팀 B조', '5팀 A조', '5팀 B조', '6팀 A조', '6팀 B조'];

function scrollV40VNextToTop() {
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
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
      <V39StepHero
        eyebrow="1단계 · 조별 역할 잡기"
        icon="🤝"
        title="오늘은 우리 조가 C1바이오 영업팀장입니다"
        tone="indigo"
        description="개인 답을 쓰는 시간이 아닙니다. 우리 조가 하나의 대표 상황을 정하고, 시장 변화와 고객 기록, 팀원 움직임을 놓고 다음 2주 실행 메모를 함께 만듭니다. 모든 문장은 조별 실습형으로 남깁니다."
        badges={[
          { label: '운영 방식', value: '조별 실습', tone: 'indigo', icon: '🤝' },
          { label: '조 구성', value: '2~3명', tone: 'emerald', icon: '👥' },
          { label: '핵심 산출물', value: '2주 실행 메모', tone: 'amber', icon: '📝' },
        ]}
      />
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '🤝', title: '우리 조 역할 잡기', body: 'C1바이오 영업팀장 관점에서 판단합니다.' },
            { icon: '🛡️', title: '말해도 되는 선 확인', body: '실제 민감정보는 모두 빼고 가상 상황으로 씁니다.' },
            { icon: '📝', title: '대표 상황 정하기', body: '우리 조가 다룰 대표 상황을 1개로 좁힙니다.' },
          ]}
        />
        <div className="mt-3">
          <V39MinimumChecklist tone="indigo" items={['조/팀 선택', '대표 상황 1개 작성', '조별 실습 역할 확인']} />
        </div>
      </section>
      <V40ComplianceNotice />
      <ShellCard title="우리 조가 다룰 대표 상황">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">조 이름</span>
            <select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(event) => setParticipant({ ...participant, groupName: event.target.value })}>
              <option value="">조를 선택하세요</option>
              {GROUP_OPTIONS.map((group) => <option key={group} value={group}>{group}</option>)}
            </select>
          </label>
          <label className="space-y-1">
            <span className="text-xs font-bold text-slate-500">운영 팀/테이블</span>
            <select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(event) => setParticipant({ ...participant, tableName: event.target.value })}>
              <option value="">테이블을 선택하세요</option>
              {TABLE_OPTIONS.map((team) => <option key={team} value={team}>{team}</option>)}
            </select>
          </label>
        </div>
        <label className="block space-y-1">
          <span className="text-xs font-bold text-slate-500">우리 조가 다룰 대표 상황</span>
          <textarea
            className="min-h-24 w-full rounded-xl border px-3 py-2"
            value={participant.representativeSituation}
            onChange={(event) => setParticipant({ ...participant, representativeSituation: event.target.value })}
            placeholder="예: 활동 기록은 늘었지만 고객 반응 이후 후속 실행이 약하고, 팀원별 기록 품질 차이가 커지고 있다."
          />
        </label>
        <label className="flex items-start gap-2 rounded-xl bg-slate-50 p-3">
          <input className="mt-1" type="checkbox" checked={participant.roleAccepted} onChange={(event) => setParticipant({ ...participant, roleAccepted: event.target.checked })} />
          <span>우리 조는 오늘 C1바이오 영업팀장 역할로 판단하고, AI 결과는 답이 아니라 초안으로 다루겠습니다.</span>
        </label>
      </ShellCard>
    </div>
  );
}

function V40AiSafetyStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={2} />
      <V39StepHero
        eyebrow="2단계 · 말해도 되는 선 확인"
        icon="🛡️"
        title="조별 토의 내용도 AI에 넣기 전에는 한 번 지워야 합니다"
        tone="amber"
        description="우리 조가 이야기한 현장 사례를 그대로 넣지 않습니다. 실제 고객, 기관, 제품, 수치, 사람을 가릴수록 AI는 더 안전한 초안 도구가 됩니다."
        badges={[
          { label: '먼저 할 일', value: '민감정보 제거', tone: 'amber', icon: '🛡️' },
          { label: '방식', value: '가상·익명화', tone: 'slate', icon: '✂️' },
          { label: '다음', value: '질문 다듬기', tone: 'violet', icon: '✍️' },
        ]}
      />
      <V39SafetyStrip>
        고객을 평가하거나 등급화하지 않습니다. 기록에서 다음 행동의 단서를 찾고, AI 초안은 팀장 언어로 다시 고칩니다.
      </V39SafetyStrip>
      <AiSafetyLab />
    </div>
  );
}

function V40PromptPracticeStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={3} />
      <V39StepHero
        eyebrow="3단계 · AI 질문 다듬기"
        icon="✍️"
        title="우리 조의 고민을 AI가 일할 수 있는 질문으로 바꿉니다"
        tone="violet"
        description="그냥 ‘어떻게 할까요?’라고 묻지 않습니다. 우리 조가 다룰 대표 상황, 필요한 산출물, 말해도 되는 선을 함께 넣어야 현장에서 쓸 수 있는 초안이 나옵니다."
        badges={[
          { label: '앞 단계', value: '안전선 확인', tone: 'amber', icon: '🛡️' },
          { label: '지금', value: '질문 구조화', tone: 'violet', icon: '✍️' },
          { label: '다음', value: '전략 리서치', tone: 'sky', icon: '🔭' },
        ]}
      />
      <V39PromptPracticeOptimizedLab />
    </div>
  );
}

function V40ResearchStrategyStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={4} />
      <V39StepHero
        eyebrow="4단계 · 영업전략 리서치 산출물 만들기"
        icon="🔭"
        title="자료를 모으는 게 아니라 우리 팀 질문을 뽑습니다"
        tone="sky"
        description="Perplexity로 공개자료를 찾고, NotebookLM으로 소스 기반 종합을 만들고, Studio 산출물 초안까지 정리합니다. 핵심은 5단계로 넘길 관리 지표형 실행 질문입니다."
        badges={[
          { label: 'Perplexity', value: '리서치 질문·답변', tone: 'sky', icon: '🔎' },
          { label: 'NotebookLM', value: '소스 기반 종합', tone: 'emerald', icon: '📚' },
          { label: 'Studio', value: '보고서·슬라이드 초안', tone: 'violet', icon: '🎞️' },
        ]}
      />
      <V39NotebookLmGuidedResearchLab />
    </div>
  );
}

function V40DashboardStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={5} />
      <V39StepHero
        eyebrow="5단계 · 이번 2주에 볼 기준 정하기"
        icon="🎯"
        title="우리 조가 선택한 기준을 2주 실행의 기준으로 좁힙니다"
        tone="emerald"
        description="활동량만 보지 않고 후속조치, 고객 반응, 기록의 질, 실행 제약을 함께 봅니다. 다음 단계에서는 이 기준을 팀원에게 전달할 업무 기준 문장으로 바꿉니다."
        badges={[
          { label: '산출물', value: '우리 조가 선택한 기준', tone: 'emerald', icon: '🎯' },
          { label: '다음 연결', value: '업무관리 Lab', tone: 'cyan', icon: '🧩' },
          { label: '주의', value: '고객을 등급화하지 않음', tone: 'amber', icon: '🛡️' },
        ]}
      />
      <V39DashboardAnalysisUxLab />
    </div>
  );
}

function V40TaskManagementStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={6} />
      <V39StepHero
        eyebrow="6단계 · 업무관리 Lab"
        icon="🧩"
        title="이번 2주 기준을 팀원이 움직일 수 있는 말로 바꿉니다"
        tone="cyan"
        description="전략과 지표가 좋아도 팀원에게 모호하게 전달되면 실행은 흐려집니다. 우리 조가 선택한 기준을 업무지시문, 완료 기준, 중간 확인 질문, 지원 조건으로 바꿉니다."
        badges={[
          { label: '앞에서 가져온 것', value: '2주 기준', tone: 'emerald', icon: '🎯' },
          { label: '지금 만들 것', value: '업무 기준 문장', tone: 'cyan', icon: '🧩' },
          { label: '다음', value: '고객 기록 단서', tone: 'sky', icon: '🔎' },
        ]}
      />
      <V40VNextTaskManagementLab />
    </div>
  );
}

function V40CustomerJudgmentStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={7} />
      <V39StepHero
        eyebrow="7단계 · 고객 기록에서 단서 찾기"
        icon="🔎"
        title="기록에서 다음 행동의 단서를 찾습니다"
        tone="sky"
        description="고객을 평가하거나 등급화하지 않습니다. 우리 조가 볼 것은 고객에 대한 판단이 아니라 다음 행동을 준비하기 위해 더 확인해야 할 단서입니다."
        badges={[
          { label: '관점', value: '단서 찾기', tone: 'sky', icon: '🔎' },
          { label: '금지', value: '고객 등급화 금지', tone: 'amber', icon: '🛡️' },
          { label: '다음', value: '2주 흐름', tone: 'violet', icon: '🧭' },
        ]}
      />
      <V39CustomerJudgmentUxLab />
    </div>
  );
}

function V40CustomerPriorityStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={8} />
      <V39StepHero
        eyebrow="8단계 · 고객군별 2주 흐름 정하기"
        icon="🧭"
        title="고객군별로 다시 볼 흐름과 보완 조건을 정합니다"
        tone="violet"
        description="AI 초안은 그대로 확정하지 않습니다. 우리 조가 고객 반응, 실행 가능성, 주의 표현을 함께 보며 2주 흐름을 줄이고 고쳐 씁니다."
        badges={[
          { label: '핵심', value: '2주 흐름', tone: 'violet', icon: '🧭' },
          { label: '주의', value: '처방 유도 표현 금지', tone: 'amber', icon: '🛡️' },
          { label: '다음', value: '1on1 대상', tone: 'indigo', icon: '👥' },
        ]}
      />
      <V39CustomerPriorityUxLab />
    </div>
  );
}

function V40TeamMemberStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={9} />
      <V39StepHero
        eyebrow="9단계 · 먼저 이야기할 팀원 고르기"
        icon="👥"
        title="기존 7명 인물 장면을 유지해 먼저 만날 사람을 고릅니다"
        tone="indigo"
        description="신재영 대리, 이대은 대리, 박재욱 사원, 유희관 과장, 김문호 차장, 김재호 차장, 문교원 사원의 장면을 바탕으로 우리 조가 먼저 확인할 1on1 대상을 고릅니다."
        badges={[
          { label: '인물 계승', value: '기존 7명 유지', tone: 'indigo', icon: '👥' },
          { label: '목표', value: '먼저 이야기할 이유', tone: 'emerald', icon: '💬' },
          { label: '주의', value: '업무배정 화면 아님', tone: 'amber', icon: '🛡️' },
        ]}
      />
      <V39TeamSevenCoachingUxWrapper />
    </div>
  );
}

function V40PeopleDialogueStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={10} />
      <V39StepHero
        eyebrow="10단계 · 1on1 코칭 첫 문장 준비"
        icon="💬"
        title="지적이 아니라 확인으로 시작하는 첫 문장을 준비합니다"
        tone="emerald"
        description="팀원 신호, 관찰한 행동, 위험한 해석, 1on1 초점, 확인 질문, 2주 행동 합의 문장, 피해야 할 표현을 함께 정리합니다."
        badges={[
          { label: '산출물', value: '우리 조가 준비한 첫 문장', tone: 'emerald', icon: '💬' },
          { label: '대화 방식', value: '확인으로 시작', tone: 'sky', icon: '🔎' },
          { label: '다음', value: 'AI 실행 초안', tone: 'violet', icon: '✨' },
        ]}
      />
      <V39PeopleDialogueUxLab />
    </div>
  );
}

function V40AiCallPlanStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={11} />
      <V39StepHero
        eyebrow="11단계 · AI에게 2주 실행 초안 부탁하기"
        icon="✨"
        title="AI 결과는 답이 아니라 우리 조의 초안입니다"
        tone="violet"
        description="지금까지 만든 전략 리서치, 업무 기준, 고객 단서, 1on1 첫 문장을 AI에게 정리시킵니다. 하지만 최종 문장은 우리 조가 현장 언어로 다시 고칩니다."
        badges={[
          { label: '입력 재료', value: '1~10단계 메모', tone: 'violet', icon: '🧾' },
          { label: 'AI 역할', value: '초안 정리', tone: 'sky', icon: '✨' },
          { label: '팀장 역할', value: '최종 수정', tone: 'emerald', icon: '✍️' },
        ]}
      />
      <V39AiCallPlanGuidedUxLab />
    </div>
  );
}

function V40ComplianceCleanupStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={12} />
      <V39StepHero
        eyebrow="12단계 · 말해도 되는 선 다시 보기"
        icon="🛡️"
        title="AI가 만든 표현을 회사 기준과 현장 언어로 다시 봅니다"
        tone="amber"
        description="미승인 효능, 허가 외 사용 암시, 처방 유도, 비교 우위 단정, 경쟁사 비방처럼 위험한 표현을 걷어내고 우리 조가 책임질 수 있는 문장으로 고칩니다."
        badges={[
          { label: '점검', value: '위험 표현 제거', tone: 'amber', icon: '🛡️' },
          { label: '원칙', value: '팀장 언어로 수정', tone: 'emerald', icon: '✍️' },
          { label: '다음', value: '최종 메모', tone: 'indigo', icon: '✅' },
        ]}
      />
      <V39ComplianceCleanupUxLab />
    </div>
  );
}

function V40FinalStep() {
  return (
    <div className="space-y-4">
      <V39FlowStrip currentStep={13} />
      <V39StepHero
        eyebrow="13단계 · 2주 실행 메모와 복기 질문 완성"
        icon="✅"
        title="우리 조의 2주 실행 메모 초안을 완성합니다"
        tone="indigo"
        description="AI 전략 리서치, 이번 2주 기준, 업무지시문, 고객군 흐름, 1on1 첫 문장, 확인 질문, 말해도 되는 선, 복기 질문을 하나의 메모로 묶습니다."
        badges={[
          { label: '최종 산출물', value: '우리 조의 2주 실행 메모 초안', tone: 'indigo', icon: '✅' },
          { label: '토의 연결', value: '복기 질문', tone: 'emerald', icon: '🗣️' },
          { label: '주의', value: '완벽보다 실행', tone: 'amber', icon: '🛡️' },
        ]}
      />
      <V39FinalCallPlanTeamSevenUxCard />
      <V39InstructorDiscussionUxLab />
    </div>
  );
}

function renderStep(step: number, participant: V40VNextParticipant, setParticipant: (next: V40VNextParticipant) => void) {
  switch (V40_VNEXT_VISIBLE_APP_STEPS[step]?.id) {
    case 'entry':
      return <EntryStep participant={participant} setParticipant={setParticipant} />;
    case 'ai-safety':
      return <V40AiSafetyStep />;
    case 'prompt-practice':
      return <V40PromptPracticeStep />;
    case 'research-strategy':
      return <V40ResearchStrategyStep />;
    case 'dashboard-analysis':
      return <V40DashboardStep />;
    case 'task-management':
      return <V40TaskManagementStep />;
    case 'customer-judgment':
      return <V40CustomerJudgmentStep />;
    case 'customer-priority':
      return <V40CustomerPriorityStep />;
    case 'member-role':
      return <V40TeamMemberStep />;
    case 'people-dialogue':
      return <V40PeopleDialogueStep />;
    case 'ai-call-plan':
      return <V40AiCallPlanStep />;
    case 'compliance-cleanup':
      return <V40ComplianceCleanupStep />;
    case 'final-call-plan-card':
      return <V40FinalStep />;
    default:
      return <EntryStep participant={participant} setParticipant={setParticipant} />;
  }
}

function V40VNextPreviewApp() {
  const [participant, setParticipant] = useStored<V40VNextParticipant>(V40_VNEXT_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V40VNextProgress>(V40_VNEXT_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const safeStep = clampV40VNextStep(progress.step);

  const goToStep = (nextStep: number) => {
    setProgress({ step: clampV40VNextStep(nextStep) });
    scrollV40VNextToTop();
  };

  const handleReset = () => {
    removeStoredPrefix('ckd.v40-vnext.');
    setParticipant(DEFAULT_PARTICIPANT);
    setProgress(DEFAULT_PROGRESS);
    scrollV40VNextToTop();
  };

  return (
    <V39StepNavigationProvider onStepSelect={(stepNumber) => goToStep(stepNumber - 1)}>
      <JourneyShell
        title="C1바이오 영업팀장 AI 리더십 Lab Journey v40-vNext"
        subtitle="v39의 산출물, UI/UX, 현장언어, 등장인물을 계승하고 업무관리 Lab을 보강한 조별 실습형 후속 버전입니다."
        steps={V40_VNEXT_VISIBLE_APP_STEPS}
        currentStep={safeStep}
        onPrev={() => goToStep(safeStep - 1)}
        onNext={() => goToStep(safeStep + 1)}
        onStepSelect={goToStep}
        hideStepOverview={false}
      >
        <div className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v40-vNext 보호 기준</p>
              <p className="mt-1 text-sm font-bold leading-6 text-slate-600">기존 v39는 기준 원본으로 보호합니다. 이 화면은 별도 route에서만 작동하며, 개인형 문장을 조별 실습형으로 바꿉니다.</p>
            </div>
            <button type="button" className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-black text-slate-700" onClick={handleReset}>
              v40-vNext 입력 초기화
            </button>
          </div>
        </div>
        {renderStep(safeStep, participant, setParticipant)}
      </JourneyShell>
    </V39StepNavigationProvider>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V40VNextPreviewApp />);
}
