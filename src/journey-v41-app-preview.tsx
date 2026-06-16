import type { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { JourneyShell } from './journey-shell';
import { removeStoredPrefix, useStored } from './journey-storage';
import { V39StepHero, type V39InfoBadge } from './journey-v39-ux-components';
import { TEAM_MEMBER_PROFILES } from './journey-v39-team-seven-coaching-profiles';
import { V41FlowStrip, V41StepNavigationProvider } from './journey-v41-ux-components';
import { V41ProgressCoachPanel } from './journey-v41-progress-coach-panel';
import { clampV41Step, V41_VISIBLE_APP_STEPS } from './journey-v41-preview-config';
import { V41PromptPracticeReviewLab } from './journey-v41-prompt-practice-review-lab';
import { V41ResearchStrategyTrimmedLab } from './journey-v41-research-strategy-trimmed-lab';
import { V41PerformanceCompactCascadeLab } from './journey-v41-performance-compact-cascade-lab';
import { V41PerformanceAiExpansionLab } from './journey-v41-performance-ai-expansion-lab';
import { V41TaskExecutionBridgeLab } from './journey-v41-task-execution-bridge-lab';
import { V41TaskPriorityFlowLab } from './journey-v41-task-priority-flow-lab';
import { V41TaskBoundaryCoordinationLab } from './journey-v41-task-boundary-coordination-lab';
import { V41PeopleSelectionLab } from './journey-v41-people-selection-lab';
import { V41OneOnOnePracticeLab } from './journey-v41-one-on-one-practice-lab';

type V41Participant = { groupName: string; tableName: string; representativeSituation: string; roleAccepted: boolean };
type V41Progress = { step: number };
type Member = { id: string; name: string; title: string; career: string; role: string; workStyle: string; communicationStyle: string; strength: string; weakness: string; note: string };
type V41HeroTone = 'emerald' | 'sky' | 'cyan' | 'violet' | 'indigo' | 'amber' | 'rose' | 'slate';
type V41StageOverviewSpec = { eyebrow: string; icon: string; tone: V41HeroTone; title: string; description: ReactNode; badges: V39InfoBadge[] };

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V41_PREVIEW_APP_MARKERS = ['V41PreviewApp','journey-v41-preview.html','v41 stage overview hero after flow strip','전체 Journey만 단계라고 부른다','내부 진행 단위는 활동·결정·작업으로 표현한다','v41 step 2 basic leader profile','v41 step 2 basic member profiles','v41 step 2 profile source aligned with TEAM_MEMBER_PROFILES','v41 step 2 and step 9 member consistency','경력/연차','주요 역할','업무스타일','소통스타일','강점','아쉬운 점','비고','문교원','V41PerformanceAiExpansionLab','AI 실행계획 흐름 안정화'].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];
const MEMBER_CAREERS: Record<string, string> = {
  'kim-jaeho': '제약영업 13년차 · 대학병원과 종합병원 담당 경험이 많음',
  'kim-moonho': '제약영업 11년차 · 민감한 고객 상황과 내부 지원 경험이 많음',
  'yoo-heegwan': '경력 입사 · 제약영업 9년차 · 고객 변화 신호 관찰에 강점',
  'lee-daeun': '제약영업 6년차 · 기존 고객 관계 유지와 방문 리듬이 안정적인 편',
  'shin-jaeyoung': '제약영업 5년차 · 후속 연결과 현장 실행 속도가 빠른 편',
  'park-jaeuk': '제약영업 3년차 · 고객 질문 기록과 후속 행동 기준을 배우는 단계',
  'moon-gyowon': '신입사원 · 제약영업 기본기와 현장 기준을 배우는 단계',
};

const STAGE_OVERVIEWS: Record<number, V41StageOverviewSpec> = {
  3: { eyebrow: '3단계 · 질문 다듬기', icon: '✍️', tone: 'violet', title: 'AI에게 던질 질문을 현업 상황에 맞게 다듬습니다', description: '짧은 질문을 바로 쓰지 않고, 역할·맥락·요청·출력 형식을 정리해 실제 업무에 쓸 수 있는 프롬프트로 바꿉니다.', badges: [{ label: '입력', value: '현업 질문', tone: 'violet', icon: '❓' }, { label: '결정', value: '질문 구조', tone: 'amber', icon: '🧭' }, { label: '산출물', value: '정리된 프롬프트', tone: 'emerald', icon: '📝' }] },
  4: { eyebrow: '4단계 · 시장 변화 읽기', icon: '🔭', tone: 'cyan', title: '전사 전략과제를 근거 기반 추진계획으로 바꿉니다', description: '전사 전략과제를 하나 선택하고, 공개자료를 찾아 추진과제·CSF·KPI 후보를 정리한 뒤 보고서·슬라이드·인포그래픽 초안으로 연결합니다.', badges: [{ label: '입력', value: '전사 전략과제', tone: 'cyan', icon: '🎯' }, { label: '도구', value: '자료 수집·정리', tone: 'indigo', icon: '🧰' }, { label: '산출물', value: '추진계획 초안', tone: 'emerald', icon: '📄' }] },
  5: { eyebrow: '5단계 · 팀 기준 만들기', icon: '🎯', tone: 'emerald', title: '전사 전략을 우리 팀의 성과관리 기준으로 바꿉니다', description: '전사 전략과제, CSF, KPI를 그대로 두지 않고 우리 팀 전략과제·팀 CSF·팀 KPI로 전환합니다.', badges: [{ label: '입력', value: '전사 전략', tone: 'emerald', icon: '📌' }, { label: '결정', value: '팀 CSF·KPI', tone: 'amber', icon: '✅' }, { label: '산출물', value: '팀 기준', tone: 'cyan', icon: '📊' }] },
  6: { eyebrow: '6단계 · 업무관리 실행계획', icon: '🧩', tone: 'emerald', title: '팀 기준을 실제 관리할 업무과제로 바꿉니다', description: '성과기준을 실행관리 주기, 관리할 업무과제, 업무산출물, 완료 기준, 업무 단위로 나눕니다.', badges: [{ label: '입력', value: '팀 기준', tone: 'emerald', icon: '🎯' }, { label: '결정', value: '업무과제', tone: 'amber', icon: '🧩' }, { label: '산출물', value: '실행계획', tone: 'cyan', icon: '🗂️' }] },
  7: { eyebrow: '7단계 · 업무 순서·업무지시', icon: '🧭', tone: 'violet', title: '실행계획을 팀원이 바로 움직일 업무지시로 바꿉니다', description: '업무 순서, 역할과 책임, 일정과 체크포인트, 잠시 줄일 일을 선택하고 AI로 업무지시 초안을 만듭니다.', badges: [{ label: '입력', value: '6단계 실행계획', tone: 'violet', icon: '📥' }, { label: '결정', value: '순서·역할·일정', tone: 'amber', icon: '✅' }, { label: '산출물', value: '업무지시 초안', tone: 'emerald', icon: '📝' }] },
  8: { eyebrow: '8단계 · 업무 경계·병목 대응', icon: '🧱', tone: 'cyan', title: '업무 경계와 병목 대응 기준을 분리합니다', description: '팀원이 할 일, 팀장이 확인할 일, 협조 요청할 일, 병목 신호, 에스컬레이션 기준을 업무관리 관점에서 정리합니다.', badges: [{ label: '입력', value: '7단계 전달 메모', tone: 'cyan', icon: '📥' }, { label: '결정', value: '경계·병목', tone: 'amber', icon: '🚦' }, { label: '산출물', value: '8단계 메모', tone: 'emerald', icon: '🧾' }] },
  9: { eyebrow: '9단계 · 사람관리 1', icon: '👤', tone: 'indigo', title: '업무 흐름에서 보이는 실행 신호를 사람관리 대화로 연결합니다', description: '팀원별 실행 신호를 보고 먼저 이야기할 팀원을 선택한 뒤, 관찰 행동과 위험한 해석을 구분하고 1on1 초점을 정합니다.', badges: [{ label: '입력', value: '8단계 관찰 후보', tone: 'indigo', icon: '🔎' }, { label: '결정', value: '대화 대상', tone: 'amber', icon: '👤' }, { label: '산출물', value: '1on1 초점', tone: 'emerald', icon: '💬' }] },
  10: { eyebrow: '10단계 · 사람관리 2', icon: '💬', tone: 'emerald', title: '첫 문장에서 행동 합의까지 1on1을 연습합니다', description: '첫 문장, 확인 질문, 재질문, 2주 행동 합의를 만들고 AI 역할극으로 팀장 대화 방식을 리허설합니다.', badges: [{ label: '입력', value: '9단계 선택 결과', tone: 'emerald', icon: '📥' }, { label: '실습', value: 'AI 역할극', tone: 'violet', icon: '🤖' }, { label: '산출물', value: '사람관리 메모', tone: 'amber', icon: '🧾' }] },
};

function splitMemberLabel(label: string) { const [name, ...titleParts] = label.split(' '); return { name: name || label, title: titleParts.join(' ') }; }
const MEMBERS: Member[] = TEAM_MEMBER_PROFILES.map((profile) => { const { name, title } = splitMemberLabel(profile.label); return { id: profile.id, name, title, career: MEMBER_CAREERS[profile.id] ?? '제약영업 구성원', role: profile.role, workStyle: profile.workStyle, communicationStyle: profile.customerStyle, strength: profile.strength, weakness: profile.risk, note: `${profile.misreadRisk} ${profile.oneOnOneReason}` }; });

function scrollV41ToTop() { window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
function isParticipantReady(p: V41Participant) { return Boolean(p.groupName.trim() && p.tableName.trim()); }
function showV41EntryGateMessage() { window.alert('먼저 팀과 이름/닉네임을 입력해 주세요.'); }
function Box({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>; }
function StageOverview({ currentStep }: { currentStep: number }) { const overview = STAGE_OVERVIEWS[currentStep]; return overview ? <V39StepHero {...overview} /> : null; }

function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  const ready = isParticipantReady(participant);
  return <div className="space-y-4"><V41FlowStrip currentStep={1} /><V39StepHero eyebrow="1단계 · 시작하기" icon="🚪" title="팀과 이름을 입력하고 바로 시작하세요" tone="indigo" description="먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 이동할 수 있습니다." badges={[{ label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' }, { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' }, { label: '방식', value: '필요 단계 이동', tone: 'amber', icon: '🧭' }]} /><Box title="시작 정보 입력"><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(e) => setParticipant({ ...participant, groupName: e.target.value })}><option value="">팀을 선택하세요</option>{TEAM_OPTIONS.map((team) => <option key={team}>{team}</option>)}</select><input className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(e) => setParticipant({ ...participant, tableName: e.target.value })} placeholder="이름/닉네임" /><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={participant.representativeSituation} onChange={(e) => setParticipant({ ...participant, representativeSituation: e.target.value })} placeholder="오늘 다뤄보고 싶은 상황" /><label className="flex gap-2 rounded-xl bg-slate-50 p-3"><input type="checkbox" checked={participant.roleAccepted} onChange={(e) => setParticipant({ ...participant, roleAccepted: e.target.checked })} />AI 결과는 비교하고 고쳐 쓸 초안으로 다룹니다.</label>{!ready ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">팀과 이름/닉네임을 입력하면 다음 단계로 이동할 수 있습니다.</p> : null}</Box></div>;
}

function RoleTeamIntroStep() {
  return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 기본 정보 보기" icon="👥" title="이대호 팀장과 팀원 7명의 기본 성향을 봅니다" tone="indigo" description="아직 과제를 정하는 단계가 아닙니다. 먼저 팀장과 팀원의 경력, 업무스타일, 소통스타일, 강점과 아쉬운 점을 파악합니다. 팀원 정보는 9단계 실행 신호 카드와 같은 프로필 원천을 사용합니다." badges={[{ label: '팀장', value: '이대호', tone: 'indigo', icon: '👤' }, { label: '팀원', value: '7명', tone: 'emerald', icon: '👥' }, { label: '초점', value: '성향 파악', tone: 'amber', icon: '🧭' }]} />
    <Box title="이대호 팀장 기본 정보"><div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xl font-black text-slate-950">이대호 팀장</p><p className="mt-1 text-sm font-bold text-indigo-700">C1바이오 영업팀장</p><p className="mt-3 leading-7 text-slate-800">현장 경험이 풍부하고 팀원에게 먼저 맡겨 본 뒤 필요한 순간에 방향을 잡아주는 실무형 팀장입니다.</p></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">리더십 스타일</p><p className="mt-1 font-bold text-slate-800">자율을 존중하되 흐름이 흔들릴 때 기준을 잡아주는 편입니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">강점</p><p className="mt-1 font-bold text-slate-800">현장 상황을 잘 알고 팀원의 어려움을 현실적으로 이해합니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">주의해서 볼 점</p><p className="mt-1 font-bold text-slate-800">성실해 보이는 팀원은 괜찮다고 판단하고 조용한 팀원의 어려움은 늦게 알아차릴 수 있습니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">이 단계의 초점</p><p className="mt-1 font-bold text-slate-800">과제를 정하기 전에 팀원 성향을 먼저 이해합니다.</p></div></div></Box>
    <Box title="팀원별 기본 정보와 성향"><div className="mb-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-bold leading-6 text-emerald-900">이 정보는 9단계 팀원별 실행 신호 카드와 같은 팀원 프로필을 기준으로 보여줍니다.</div><div className="grid gap-4 lg:grid-cols-2">{MEMBERS.map((m) => <article key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-lg font-black text-slate-950">{m.name} {m.title}</p><div className="mt-4 space-y-3 text-sm leading-6 text-slate-700"><p><b className="text-slate-950">경력/연차</b> — {m.career}</p><p><b className="text-slate-950">주요 역할</b> — {m.role}</p><p><b className="text-slate-950">업무스타일</b> — {m.workStyle}</p><p><b className="text-slate-950">소통스타일</b> — {m.communicationStyle}</p><p><b className="text-slate-950">강점</b> — {m.strength}</p><p><b className="text-slate-950">아쉬운 점</b> — {m.weakness}</p><p><b className="text-slate-950">비고</b> — {m.note}</p></div></article>)}</div></Box>
  </div>;
}

function LabStep({ currentStep, children }: { currentStep: number; children: ReactNode }) { return <div className="space-y-4"><V41FlowStrip currentStep={currentStep} /><StageOverview currentStep={currentStep} />{children}</div>; }
function PerformanceStep() { return <LabStep currentStep={5}><V41PerformanceCompactCascadeLab /><V41PerformanceAiExpansionLab /></LabStep>; }

function V41PreviewApp() {
  const [participant, setParticipant] = useStored<V41Participant>(V41_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [progress, setProgress] = useStored<V41Progress>(V41_STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  const currentStep = clampV41Step(progress.step);
  const selectStep = (stepIndex: number) => { setProgress({ step: clampV41Step(stepIndex) }); scrollV41ToTop(); };
  const goPrev = () => selectStep(currentStep - 1);
  const goNext = () => { if (currentStep === 0 && !isParticipantReady(participant)) { showV41EntryGateMessage(); return; } selectStep(currentStep + 1); };
  const resetV41 = () => { removeStoredPrefix('ckd.v41.'); setParticipant(DEFAULT_PARTICIPANT); setProgress(DEFAULT_PROGRESS); scrollV41ToTop(); };
  const screens = [<EntryStep key="entry" participant={participant} setParticipant={setParticipant} />, <RoleTeamIntroStep key="role-team-intro" />, <LabStep key="prompt-practice" currentStep={3}><V41PromptPracticeReviewLab /></LabStep>, <LabStep key="research-strategy" currentStep={4}><V41ResearchStrategyTrimmedLab /></LabStep>, <PerformanceStep key="dashboard-analysis" />, <LabStep key="task-execution-design" currentStep={6}><V41TaskExecutionBridgeLab /></LabStep>, <LabStep key="task-priority-flow" currentStep={7}><V41TaskPriorityFlowLab /></LabStep>, <LabStep key="task-boundary-coordination" currentStep={8}><V41TaskBoundaryCoordinationLab /></LabStep>, <LabStep key="member-role" currentStep={9}><V41PeopleSelectionLab /></LabStep>, <LabStep key="people-dialogue" currentStep={10}><V41OneOnOnePracticeLab /></LabStep>];
  return <V41StepNavigationProvider onStepSelect={(n) => selectStep(n - 1)}><JourneyShell title="C1바이오 영업팀장 AI 리더십 Lab" subtitle="성과관리, 업무관리, 사람관리 흐름을 팀장 관점으로 연습합니다. v41 Preview는 기존 파일럿과 분리된 검증용 화면입니다." steps={V41_VISIBLE_APP_STEPS} currentStep={currentStep} onPrev={goPrev} onNext={goNext} onStepSelect={selectStep} hideStepOverview><V41ProgressCoachPanel currentStep={currentStep} participant={participant} onStepSelect={selectStep} /><div className="mb-4 flex justify-end"><button type="button" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-500 shadow-sm hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700" onClick={resetV41}>v41 입력 초기화</button></div>{screens[currentStep] ?? screens[0]}</JourneyShell></V41StepNavigationProvider>;
}

if (!rootElement) throw new Error('journey-root element is required for v41 preview app.');
createRoot(rootElement).render(<V41PreviewApp />);
