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
const V41_PREVIEW_APP_MARKERS = ['V41PreviewApp','journey-v41-preview.html','v41 isolated app shell','v41 step 2 basic leader profile','v41 step 2 basic member profiles','v41 step 2 pharma sales member profiles','경력/연차','업무 방식','소통 방식','업무스타일','소통스타일','성장 포인트','부족한 점','비고','MZ세대','3년차','신입사원','V41PromptPracticeReviewLab','V41ResearchStrategyTrimmedLab','V41PerformanceCompactCascadeLab','V41TaskExecutionBridgeLab','V41TaskPriorityFlowLab','V41TaskBoundaryCoordinationLab','V41PeopleSelectionLab','V41OneOnOnePracticeLab','V41_VISIBLE_APP_STEPS','V41FlowStrip','V41ProgressCoachPanel','ckd.v41.participant.v1','ckd.v41.progress.v1','ckd.v41.promptPracticeReview.v2','ckd.v41.pharmaStrategyResearch.v1','ckd.v41.performanceCascade.v1','ckd.v41.taskManagement.v10','ckd.v41.peopleManagement.v2','existing pilot URLs preserved','ckd-ai-lab.html 보호','journey-v40-vnext-preview.html 보호'].join('|');
void V41_PREVIEW_APP_MARKERS;

const V41_STORAGE_KEYS = { participant: 'ckd.v41.participant.v1', progress: 'ckd.v41.progress.v1' };
const DEFAULT_PARTICIPANT: V41Participant = { groupName: '', tableName: '', representativeSituation: '', roleAccepted: false };
const DEFAULT_PROGRESS: V41Progress = { step: 0 };
const TEAM_OPTIONS = ['1팀', '2팀', '3팀', '4팀', '5팀', '6팀', '7팀', '8팀'];
const MEMBERS: Member[] = [
  { name: '김재호', title: '차장', career: '제약영업 13년차 · 대학병원과 종합병원 담당 경험이 많음', role: '상급종합병원과 주요 처방 고객을 안정적으로 관리하는 선임 구성원', workStyle: '방문 전에 고객 상황을 미리 챙기고, 교수와 전문의가 어떤 이야기에 관심을 보였는지 잘 기억해 둡니다.', communicationStyle: '말이 많은 편은 아니지만 회의에서 필요한 말은 분명히 합니다. 세세한 지시보다는 큰 방향과 권한을 주는 방식을 좋아합니다.', strength: '고객 신뢰가 높고, 복잡한 병원 안에서도 차분하게 움직입니다.', weakness: '본인이 잘하는 방식을 팀원들에게 말로 풀어 설명하거나 자료로 남기는 일은 많지 않습니다.', note: '자율성은 존중하되, 좋은 사례를 팀원들이 배울 수 있게 짧게 공유하도록 요청하면 좋습니다.' },
  { name: '김문호', title: '차장', career: '제약영업 11년차 · 종합병원과 의원급 중요 거래처 관리 경험', role: '기존 거래처를 안정적으로 관리하고 팀 분위기를 부드럽게 잡아주는 구성원', workStyle: '방문 일정과 고객 응대가 안정적입니다. 갑자기 방식을 바꾸기보다는 해오던 방식 안에서 차근차근 움직입니다.', communicationStyle: '상대 이야기를 잘 듣고 부드럽게 조율합니다. 다만 불편한 일이나 개인적으로 힘든 부분을 먼저 크게 말하지는 않습니다.', strength: '고객과의 관계를 오래 유지하고, 내부 협업도 무리 없이 이어가는 편입니다.', weakness: '새로운 방식이 필요할 때 첫 반응이 조금 늦을 수 있습니다.', note: '무조건 바꾸자고 하기보다, 지금 잘하고 있는 점을 인정한 뒤 작은 변화부터 제안하는 편이 좋습니다.' },
  { name: '유희관', title: '과장', career: '경력 입사 · 제약영업 9년차', role: '실적 기여도가 높은 경력직 구성원', workStyle: '목표를 잡으면 빠르게 움직이고, 고객 앞에서 설명도 자신 있게 합니다. 혼자서 성과를 만들어 내는 힘이 있습니다.', communicationStyle: '자기 방식에 대한 확신이 강하고 회의에서도 직설적으로 말합니다. 다른 직원들과 자연스럽게 어울리는 데는 시간이 걸립니다.', strength: '실력과 실적이 모두 좋고, 새 고객도 빠르게 파악합니다.', weakness: '팀의 기존 방식이나 후배들의 속도에 답답함을 느낄 때가 있습니다. 함께 맞춰 가기보다 혼자 처리하려는 모습으로 보일 수 있습니다.', note: '성과는 인정하되, 팀 안에서 자기 방식만 고집하지 않고 함께 일하는 쪽으로 대화를 열어야 합니다.' },
  { name: '이대은', title: '대리', career: '제약영업 6년차 · 방문 기록과 후속 확인이 안정적인 편', role: '방문 기록과 다음 확인 일정을 꼼꼼하게 챙기는 구성원', workStyle: '고객 반응과 요청사항을 자세히 적어 둡니다. 빠뜨리는 것을 싫어하고, 확인할 것은 끝까지 확인하는 편입니다.', communicationStyle: '질문이 구체적이고 확인을 자주 합니다. 애매한 말보다 기준이 분명한 요청을 편하게 받아들입니다.', strength: '기록이 꼼꼼하고, 일정과 약속을 잘 지킵니다.', weakness: '모든 내용을 자세히 적다 보니 정작 중요한 내용이 잘 안 보일 때가 있습니다.', note: '좋은 기록 습관은 살리되, 팀장에게 보여줄 때는 중요한 내용만 짧게 추려내는 연습이 필요합니다.' },
  { name: '신재영', title: '대리', career: '제약영업 5년차 · 새 자료를 고객 앞에서 써보는 속도가 빠름', role: '새로운 자료와 설명 방식을 빠르게 고객에게 써보는 구성원', workStyle: '일단 고객에게 써보고 반응을 보며 고치는 편입니다. 속도는 빠르지만, 방문이 끝난 뒤 무엇이 잘됐고 무엇이 아쉬웠는지 짚어보는 시간은 짧을 수 있습니다.', communicationStyle: '짧고 결론 중심으로 말합니다. 긴 설명보다 바로 해볼 수 있는 요청을 선호합니다.', strength: '고객 앞에서 바로 써보는 힘과 움직임의 속도가 좋습니다.', weakness: '고객이 살짝 보인 반응이나 잘 안 된 이유를 충분히 정리하지 않고 다음 방문으로 넘어갈 수 있습니다.', note: '실행을 막기보다 방문이 끝난 뒤 “이번에 뭐가 먹혔고 뭐가 안 먹혔나?” 정도를 짧게 묻는 방식이 좋습니다.' },
  { name: '박재욱', title: '사원', career: '제약영업 3년차 · 기본적인 방문 방식은 어느 정도 익힌 구성원', role: '기본 활동량과 고객 응대 방식을 갖추고, 자기만의 고객관리 방식을 만들어 가는 구성원', workStyle: '목표와 기준이 분명하면 빠르게 움직입니다. 모바일 기록, 짧은 메모, 체크리스트에는 익숙하지만 애매하게 던지는 지시는 부담스러워합니다.', communicationStyle: '불필요하게 긴 회의나 장황한 설명은 선호하지 않습니다. 바로 받을 수 있고 구체적인 피드백을 더 잘 받아들입니다.', strength: '디지털 도구를 잘 쓰고, 새로운 방식도 빨리 익힙니다.', weakness: '왜 해야 하는지 충분히 설명되지 않으면 그냥 시킨 일로만 받아들일 수 있습니다.', note: '일의 이유와 기대하는 결과를 짧고 분명하게 말해주면 훨씬 잘 따라옵니다.' },
  { name: '문교원', title: '사원', career: '신입사원 · 제약영업 기본기를 배우는 단계', role: '제약영업의 기본 업무와 고객 응대 방식을 배우는 초기 구성원', workStyle: '배우려는 태도는 좋지만 처음 해보는 일은 정답을 확인하고 싶어 합니다. 일의 의미가 납득되면 빠르게 따라옵니다.', communicationStyle: '편하게 물어볼 수 있는 분위기에서 더 잘 말합니다. 여러 사람 앞에서 지적받기보다 따로 짧게 이야기해 주는 방식을 선호합니다.', strength: '친화력이 있고 배우는 속도가 빠릅니다. 디지털 환경에도 익숙합니다.', weakness: '고객 앞에서 어려운 질문을 끝까지 이어가거나, 거절 반응을 받아내는 경험은 아직 부족합니다.', note: '하나하나 지시하기보다 작은 성공 경험을 쌓게 하고, 질문해도 괜찮은 분위기를 만들어 주는 것이 중요합니다.' }
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
  return <div className="space-y-4"><V41FlowStrip currentStep={2} /><V39StepHero eyebrow="2단계 · 기본 정보 보기" icon="👥" title="이대호 팀장과 팀원 7명의 기본 성향을 봅니다" tone="indigo" description="아직 과제를 정하는 단계가 아닙니다. 먼저 팀장과 팀원의 경력, 업무스타일, 소통스타일, 강점과 아쉬운 점을 파악합니다." badges={[{ label: '팀장', value: '이대호', tone: 'indigo', icon: '👤' }, { label: '팀원', value: '7명', tone: 'emerald', icon: '👥' }, { label: '초점', value: '성향 파악', tone: 'amber', icon: '🧭' }]} />
    <Box title="이대호 팀장 기본 정보"><div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xl font-black text-slate-950">이대호 팀장</p><p className="mt-1 text-sm font-bold text-indigo-700">C1바이오 영업팀장</p><p className="mt-3 leading-7 text-slate-800">현장 경험이 풍부하고 팀원에게 먼저 맡겨 본 뒤 필요한 순간에 방향을 잡아주는 실무형 팀장입니다.</p></div><div className="grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">리더십 스타일</p><p className="mt-1 font-bold text-slate-800">자율을 존중하되 흐름이 흔들릴 때 기준을 잡아주는 편입니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">강점</p><p className="mt-1 font-bold text-slate-800">현장 상황을 잘 알고 팀원의 어려움을 현실적으로 이해합니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">주의해서 볼 점</p><p className="mt-1 font-bold text-slate-800">성실해 보이는 팀원은 괜찮다고 판단하고 조용한 팀원의 어려움은 늦게 알아차릴 수 있습니다.</p></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black text-slate-500">이 단계의 초점</p><p className="mt-1 font-bold text-slate-800">과제를 정하기 전에 팀원 성향을 먼저 이해합니다.</p></div></div></Box>
    <Box title="팀원별 기본 정보와 성향"><div className="grid gap-4 lg:grid-cols-2">{MEMBERS.map((m) => <article key={m.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-lg font-black text-slate-950">{m.name} {m.title}</p><div className="mt-4 space-y-3 text-sm leading-6 text-slate-700"><p><b className="text-slate-950">경력/연차</b> — {m.career}</p><p><b className="text-slate-950">주요 역할</b> — {m.role}</p><p><b className="text-slate-950">업무스타일</b> — {m.workStyle}</p><p><b className="text-slate-950">소통스타일</b> — {m.communicationStyle}</p><p><b className="text-slate-950">강점</b> — {m.strength}</p><p><b className="text-slate-950">아쉬운 점</b> — {m.weakness}</p><p><b className="text-slate-950">비고</b> — {m.note}</p></div></article>)}</div></Box>
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
