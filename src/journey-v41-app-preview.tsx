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
type Member = { name: string; title: string; career: string; role: string; workStyle: string; communicationStyle: string; strength: string; weakness: string; note: string };

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');
const V41_PREVIEW_APP_MARKERS = ['V41PreviewApp','journey-v41-preview.html','v41 isolated app shell','v41 step 2 basic leader profile','v41 step 2 basic member profiles','v41 step 2 pharma sales member profiles','경력/연차','업무 방식','소통 방식','업무스타일','소통스타일','성장 포인트','부족한 점','비고','V41PromptPracticeReviewLab','V41ResearchStrategyTrimmedLab','V41PerformanceCompactCascadeLab','V41TaskExecutionBridgeLab','V41TaskPriorityFlowLab','V41TaskBoundaryCoordinationLab','V41PeopleSelectionLab','V41OneOnOnePracticeLab','V41_VISIBLE_APP_STEPS','V41FlowStrip','V41ProgressCoachPanel','ckd.v41.participant.v1','ckd.v41.progress.v1','ckd.v41.promptPracticeReview.v2','ckd.v41.pharmaStrategyResearch.v1','ckd.v41.performanceCascade.v1','ckd.v41.taskManagement.v10','ckd.v41.peopleManagement.v2','existing pilot URLs preserved','ckd-ai-lab.html 보호','journey-v40-vnext-preview.html 보호'].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];
const MEMBERS: Member[] = [
  { name: '김재호', title: '차장', career: '제약영업 13년차 · 대학병원/종합병원 담당 경험 다수', role: '상급종합병원과 주요 처방 고객을 안정적으로 관리하는 선임 구성원', workStyle: '방문 전 고객 상황을 미리 정리하고, 교수·전문의별 관심사를 기억해 관계를 이어가는 편입니다.', communicationStyle: '말수는 적지만 회의에서 필요한 의견은 분명히 말합니다. 세세한 지시보다 큰 방향과 권한을 선호합니다.', strength: '고객 신뢰가 높고, 복잡한 병원 의사결정 구조 안에서도 침착하게 대응합니다.', weakness: '본인의 노하우를 문서나 팀 공유 자료로 남기는 빈도는 낮습니다.', note: '팀장 입장에서는 자율성을 존중하되, 좋은 판단 사례를 팀 학습 자산으로 남기게 유도할 필요가 있습니다.' },
  { name: '김문호', title: '차장', career: '제약영업 11년차 · 종합병원 및 로컬 핵심처 관리 경험', role: '기존 거래처를 안정적으로 관리하고 팀 분위기를 완충하는 구성원', workStyle: '방문 루틴이 일정하고 고객 응대가 부드럽습니다. 급격한 변화보다 검증된 방식을 선호합니다.', communicationStyle: '상대 이야기를 잘 듣고 조율합니다. 다만 불편한 이슈나 개인적 어려움은 먼저 크게 드러내지 않습니다.', strength: '고객과의 신뢰 유지, 내부 협업, 차분한 일정 관리에 강점이 있습니다.', weakness: '새로운 메시지나 방식이 필요할 때 전환 속도가 다소 느릴 수 있습니다.', note: '변화를 요구할 때는 기존 강점을 인정한 뒤 작은 시도부터 제안하는 방식이 적합합니다.' },
  { name: '유희관', title: '과장', career: '경력 입사 · 제약영업 9년차', role: '실적 기여도가 높은 경력직 구성원', workStyle: '목표 달성 감각이 좋고 고객 앞에서 메시지를 밀도 있게 전달합니다. 개인 실행력과 영업 감각은 뛰어난 편입니다.', communicationStyle: '자기 방식에 대한 확신이 강하고 회의에서 직설적으로 말합니다. 다른 직원들과 자연스럽게 섞이는 데는 시간이 걸립니다.', strength: '실력과 실적이 모두 좋고, 신규 고객을 빠르게 파악하는 힘이 있습니다.', weakness: '팀의 기존 방식이나 후배들의 속도에 답답함을 느끼며, 협업보다 개인 성과 중심으로 보일 때가 있습니다.', note: '성과를 인정하되 팀 안에서 지식을 나누고 함께 일하는 방식에 적응하도록 별도 대화가 필요합니다.' },
  { name: '이대은', title: '대리', career: '제약영업 6년차 · CRM 기록과 후속 확인이 안정적인 편', role: '방문 기록과 Follow-up 일정을 꼼꼼하게 챙기는 구성원', workStyle: '고객 반응과 요청사항을 세밀하게 기록합니다. 업무 누락을 싫어하고 확인 절차를 중시합니다.', communicationStyle: '질문이 구체적이고 확인을 자주 합니다. 애매한 지시보다 기준이 분명한 요청을 선호합니다.', strength: '기록 품질, 일정 관리, 약속 이행의 안정성이 높습니다.', weakness: '모든 내용을 자세히 남기려다 핵심 판단 포인트가 묻힐 수 있습니다.', note: '좋은 기록 습관을 유지하되, 팀장 보고용으로 핵심 신호만 압축하는 연습이 필요합니다.' },
  { name: '신재영', title: '대리', career: '제약영업 5년차 · 신규 메시지 적용과 빠른 실행에 강점', role: '새로운 자료와 메시지를 빠르게 현장에 적용하는 구성원', workStyle: '일단 실행해 보고 반응을 보며 수정하는 편입니다. 속도는 빠르지만 회고가 짧을 수 있습니다.', communicationStyle: '간결하고 결론 중심으로 말합니다. 긴 설명보다 바로 실행 가능한 지시를 선호합니다.', strength: '현장 적용력, 속도감, 목표 달성을 위한 움직임이 좋습니다.', weakness: '고객이 보인 미묘한 반응이나 실패 원인을 충분히 정리하지 않고 넘어갈 수 있습니다.', note: '실행력을 막기보다 방문 후 짧은 회고 질문을 붙이면 성장 속도가 빨라질 수 있습니다.' },
  { name: '박재욱', title: '사원', career: '제약영업 3년차 · 기본 방문 루틴은 갖춘 구성원', role: '기본 활동량과 고객 응대 방식을 익히고 자기만의 고객관리 방식을 만들어 가는 구성원', workStyle: '정해진 목표와 기준이 있으면 빠르게 움직입니다. 모바일 기록, 짧은 메모, 체크리스트 방식에는 익숙하지만 애매한 지시는 부담스러워합니다.', communicationStyle: '불필요한 회의나 장황한 지시는 선호하지 않습니다. 피드백은 즉시성 있고 구체적일 때 잘 받아들입니다.', strength: '디지털 도구 활용, 빠른 실행, 새로운 방식에 대한 적응력이 좋습니다.', weakness: '업무의 배경이나 의사결정 맥락이 충분히 설명되지 않으면 지시를 단순 업무로 받아들일 수 있습니다.', note: '왜 해야 하는지와 기대 결과를 짧고 분명하게 설명하면 몰입도가 올라갑니다.' },
  { name: '문교원', title: '사원', career: '신입사원 · 제약영업 기본기를 배우는 단계', role: '제약영업의 기본 업무와 고객 응대 방식을 배우는 초기 구성원', workStyle: '배우려는 태도는 좋지만 처음 해보는 업무에는 정답을 확인하고 싶어 합니다. 업무 의미가 납득되면 빠르게 따라옵니다.', communicationStyle: '수평적이고 편안한 질문 분위기에서 더 잘 말합니다. 공개적으로 지적받기보다 짧은 1on1 피드백을 선호합니다.', strength: '친화력, 학습 속도, 디지털 환경 적응력이 좋습니다.', weakness: '고객 앞에서 어려운 질문을 끝까지 이어가거나, 거절 반응을 다루는 경험은 아직 부족합니다.', note: '세세한 통제보다 작은 성공 경험을 쌓게 하고, 질문해도 괜찮은 분위기를 만들어 주는 것이 중요합니다.' }
];

function scrollV41ToTop() { window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' })); }
function isParticipantReady(p: V41Participant) { return Boolean(p.groupName.trim() && p.tableName.trim()); }
function showV41EntryGateMessage() { window.alert('먼저 팀과 이름/닉네임을 입력해 주세요.'); }
function Box({ title, children }: { title: string; children: ReactNode }) { return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-slate-900">{title}</h3><div className="mt-3 space-y-3 text-sm leading-6 text-slate-700">{children}</div></section>; }

function EntryStep({ participant, setParticipant }: { participant: V41Participant; setParticipant: (next: V41Participant) => void }) {
  const ready = isParticipantReady(participant);
  return <div className="space-y-4"><V41FlowStrip currentStep={1} /><V39StepHero eyebrow="1단계 · 시작하기" icon="🚪" title="팀과 이름을 입력하고 바로 시작하세요" tone="indigo" description="먼저 팀과 이름만 입력하면 다음 단계부터 필요한 화면으로 이동할 수 있습니다." badges={[{ label: '필수', value: '팀 / 이름', tone: 'indigo', icon: '✅' }, { label: '역할', value: '영업팀장 관점', tone: 'emerald', icon: '👤' }, { label: '방식', value: '필요 단계 이동', tone: 'amber', icon: '🧭' }]} /><Box title="시작 정보 입력"><select className="w-full rounded-xl border bg-white px-3 py-2" value={participant.groupName} onChange={(e) => setParticipant({ ...participant, groupName: e.target.value })}><option value="">팀을 선택하세요</option>{TEAM_OPTIONS.map((team) => <option key={team}>{team}</option>)}</select><input className="w-full rounded-xl border bg-white px-3 py-2" value={participant.tableName} onChange={(e) => setParticipant({ ...participant, tableName: e.target.value })} placeholder="이름/닉네임" /><textarea className="min-h-20 w-full rounded-xl border px-3 py-2" value={participant.representativeSituation} onChange={(e) => setParticipant({ ...participant, representativeSituation: e.target.value })} placeholder="오늘 다뤄보고 싶은 상황" /><label className="flex gap-2 rounded-xl bg-slate-50 p-3"><input type="checkbox" checked={participant.roleAccepted} onChange={(e) => setParticipant({ ...participant, roleAccepted: e.target.checked })} />AI 결과는 비교하고 고쳐 쓸 초안으로 다룹니다.</label>{!ready ? <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-black text-amber-800">팀과 이름/닉네임을 입력하면 다음 단계로 이동할 수 있습니다.</p> : null}</Box></div>;
}

function RoleTeamIntroStep() {
  return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 기본 정보 보기" icon="👥" title="이대호 팀장과 팀원 7명의 기본 성향을 봅니다" tone="indigo" description="아직 과제를 정하는 단계가 아닙니다. 먼저 팀장과 팀원의 경력, 업무스타일, 소통스타일, 강점과 부족한 점을 파악합니다." badges={[{ label: '팀장', value: '이대호', tone: 'indigo', icon: '👤' }, { label: '팀원', value: '7명', tone: 'emerald', icon: '👥' }, { label: '초점', value: '성향 파악', tone: 'amber', icon: '🧭' }]} />
    <Box title="이대호 팀장 기본 정보"><div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xl font-black text-slate-950">이대호 팀장</p><p className="mt-1 text-sm font-bold text-indigo-700">C1바이오 영업팀장</p><p className="mt-3 leading-7 text-slate-800">현장 경험이 풍부하고 팀원에게 먼저 맡겨 본 뒤 필요한 순간에 방향을 잡아주는 실무형 팀장입니다.</p></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">리더십 스타일</p><p className="mt-1 font-bold text-slate-800">자율을 존중하되 흐름이 흔들릴 때 기준을 잡아주는 편입니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">강점</p><p className="mt-1 font-bold text-slate-800">현장 상황을 잘 알고 팀원의 어려움을 현실적으로 이해합니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">주의해서 볼 점</p><p className="mt-1 font-bold text-slate-800">성실해 보이는 팀원은 괜찮다고 판단하고 조용한 팀원의 어려움은 늦게 알아차릴 수 있습니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">이 단계의 초점</p><p className="mt-1 font-bold text-slate-800">과제를 정하기 전에 팀원 성향을 먼저 이해합니다.</p></div></div></Box>
    <Box title="팀원별 기본 정보와 성향"><div className="grid gap-4 lg:grid-cols-2">{MEMBERS.map((m) => <article key={m.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-lg font-black text-slate-950">{m.name} {m.title}</p><div className="mt-4 space-y-3 text-sm leading-6 text-slate-700"><p><b className="text-slate-950">경력/연차</b> — {m.career}</p><p><b className="text-slate-950">주요 역할</b> — {m.role}</p><p><b className="text-slate-950">업무스타일</b> — {m.workStyle}</p><p><b className="text-slate-950">소통스타일</b> — {m.communicationStyle}</p><p><b className="text-slate-950">강점</b> — {m.strength}</p><p><b className="text-slate-950">부족한 점</b> — {m.weakness}</p><p><b className="text-slate-950">비고</b> — {m.note}</p></div></article>)}</div></Box>
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
