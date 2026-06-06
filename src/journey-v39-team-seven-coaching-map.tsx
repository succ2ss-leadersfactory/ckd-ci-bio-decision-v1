import { useMemo, useState } from 'react';

const V39_TEAM_SEVEN_COACHING_MAP_SMOKE_MARKERS = [
  'V39TeamSevenCoachingMap',
  '코칭 대상 선정',
  '7명 팀원 유형 보기',
  '실제 고민 팀원 직접 등록',
  'AI로 1on1 대상 판단 정리하기',
  '우선 1on1 대상 2명',
  '9단계로 넘길 코칭 초점',
  '팀원 7명 실행·코칭 Map',
  '업무배분 판단',
  '1on1 코칭 목적',
  '부담 편중 점검',
].join('|');
void V39_TEAM_SEVEN_COACHING_MAP_SMOKE_MARKERS;

const V39_TEAM_SEVEN_COACHING_STORAGE_KEY = 'ckd.v39.teamSevenCoachingMap.result.v1';
const DIRECT_CANDIDATE_ID = 'direct-concern-candidate';

export type V39TeamSevenMemberDecision = {
  memberId: string;
  memberLabel: string;
  allocationDecision: string;
  coachingPurpose: string;
  priorityOneOnOne: boolean;
  leaderSupport: string;
  riskMemo: string;
  selectionReason?: string;
  coachingFocus?: string;
  aiJudgmentDraft?: string;
  directAlias?: string;
  directRoleSituation?: string;
  directSignal?: string;
  directStrength?: string;
  directRisk?: string;
  directLeaderQuestion?: string;
};

export type V39TeamSevenCoachingMapResult = {
  schemaVersion: number;
  updatedAt: string;
  decisions: Record<string, V39TeamSevenMemberDecision>;
};

type TeamMemberProfile = {
  id: string;
  label: string;
  role: string;
  currentSignal: string;
  strength: string;
  risk: string;
  leaderQuestion: string;
  defaultCoachingPurpose: string;
  defaultSelectionReason: string;
  defaultCoachingFocus: string;
  defaultRiskMemo: string;
  isDirect?: boolean;
};

const TEAM_MEMBER_PROFILES: TeamMemberProfile[] = [
  {
    id: 'kim-jaeho',
    label: '김재호 차장',
    role: '경험 많은 안정형',
    currentSignal: '기존 고객 관계는 안정적이지만 새로운 실행 방식에는 속도가 느릴 수 있습니다.',
    strength: '관계 안정성, 현장 대응 경험, 후배에게 줄 수 있는 현실 조언',
    risk: '기존 방식 고착, 디지털 기록·후속조치 기준 변화에 대한 거리감',
    leaderQuestion: '어려운 고객을 계속 맡기는 것이 신뢰인가, 반복 부담인가?',
    defaultCoachingPurpose: '부담 확인',
    defaultSelectionReason: '경험을 믿고 계속 맡기는 장면이 반복 부담으로 받아들여지고 있는지 확인할 필요가 있습니다.',
    defaultCoachingFocus: '최근 부담, 기존 방식과 새 기준의 차이, 후속조치 기록 기준을 함께 맞춥니다.',
    defaultRiskMemo: '“경험 있으니 알아서 해주세요”로 들리지 않게 인정과 지원 기준을 같이 제시합니다.',
  },
  {
    id: 'kim-moonho',
    label: '김문호 차장',
    role: '책임감 강한 실무형',
    currentSignal: '어려운 고객 대응을 자주 맡지만 부담이 쌓이고 있을 가능성이 있습니다.',
    strength: '문제 상황 수습, 책임감, 고객 대응 신뢰도',
    risk: '반복 배정에 따른 번아웃, 인정 없이 어려운 일만 몰리는 느낌',
    leaderQuestion: '이번에도 맡겨야 하는가, 아니면 부담을 덜어주어야 하는가?',
    defaultCoachingPurpose: '부담 확인',
    defaultSelectionReason: '일을 잘한다는 이유로 어려운 상황이 계속 몰리고 있는지 먼저 확인할 필요가 있습니다.',
    defaultCoachingFocus: '최근 부담 수준, 조정이 필요한 일, 팀장이 덜어줄 수 있는 조건을 확인합니다.',
    defaultRiskMemo: '“믿어서 맡긴다”는 말이 반복 부담의 합리화로 들릴 수 있습니다.',
  },
  {
    id: 'yoo-heegwan',
    label: '유희관 과장',
    role: '관찰력 있는 신중형',
    currentSignal: '고객 변화 신호는 잘 포착하지만 실행 전환은 늦어질 수 있습니다.',
    strength: '변화 감지, 세밀한 관찰, 고객 반응의 맥락 이해',
    risk: '신중함이 실행 지연으로 이어질 수 있음',
    leaderQuestion: '더 많은 지시가 필요한가, 더 명확한 실행 기준이 필요한가?',
    defaultCoachingPurpose: '실행 기준 합의',
    defaultSelectionReason: '관찰한 신호가 다음 행동으로 이어지지 않는 이유를 단정하지 않고 확인할 필요가 있습니다.',
    defaultCoachingFocus: '어떤 신호를 언제까지 확인하고, 그다음 어떤 행동으로 옮길지 작은 기준을 정합니다.',
    defaultRiskMemo: '분석을 더 요구하기보다 실행 기준과 시점을 좁히는 대화가 필요합니다.',
  },
  {
    id: 'lee-daeun',
    label: '이대은 대리',
    role: '관계 유지형',
    currentSignal: '기존 고객 관리는 안정적이지만 신규 확장 과제에서는 주저할 수 있습니다.',
    strength: '관계 유지, 신뢰 기반 대화, 꾸준한 방문 리듬',
    risk: '늘 하던 고객군에 머물며 성장 기회가 제한될 수 있음',
    leaderQuestion: '안정 업무만 맡기고 있는 것은 아닌가?',
    defaultCoachingPurpose: '성장 의미 부여',
    defaultSelectionReason: '안정적인 관계 관리가 강점이지만, 성장 기회가 좁아지고 있는지 확인할 필요가 있습니다.',
    defaultCoachingFocus: '기존 관계 강점을 살리면서 새 접점을 작게 시도할 수 있는 범위와 지원을 정합니다.',
    defaultRiskMemo: '갑자기 큰 신규 과제를 맡기면 회피가 커질 수 있으므로 작은 시도부터 합의합니다.',
  },
  {
    id: 'shin-jaeyoung',
    label: '신재영 대리',
    role: '실행 빠른 추진형',
    currentSignal: '후속 연결은 빠르지만 표현 안전선과 고객 부담 신호를 놓칠 수 있습니다.',
    strength: '속도, 실행력, 다음 접점 확보',
    risk: '과도한 설득, 표현 리스크, 고객 피로감',
    leaderQuestion: '속도를 살리면서 안전선을 어떻게 맞출 것인가?',
    defaultCoachingPurpose: '안전선 확인',
    defaultSelectionReason: '실행 속도는 강점이지만, 표현 안전선과 고객 부담 신호를 함께 맞출 필요가 있습니다.',
    defaultCoachingFocus: '방문 전 사용할 수 있는 표현, 피해야 할 표현, 고객 부담 신호를 짧게 점검합니다.',
    defaultRiskMemo: '속도 자체를 꺾기보다 승인자료 범위와 고객 부담 신호 기준을 먼저 맞춥니다.',
  },
  {
    id: 'park-jaeuk',
    label: '박재욱 사원',
    role: '성장 초기형',
    currentSignal: '학습 의지는 있으나 고객 질문 기록과 다음 행동 연결이 아직 약할 수 있습니다.',
    strength: '학습 의지, 새로운 방식 수용, 기록 습관 형성 가능성',
    risk: '업무 크기가 커지면 무엇을 남겨야 하는지 놓칠 수 있음',
    leaderQuestion: '무엇부터 맡기면 성장 과제가 될 수 있는가?',
    defaultCoachingPurpose: '역할 설명',
    defaultSelectionReason: '성과를 빨리 요구하기보다 고객 활동 기록과 다음 질문을 남기는 습관을 먼저 맞출 필요가 있습니다.',
    defaultCoachingFocus: '고객 질문 1개, 다음 확인 질문 1개, 후속조치 1개를 남기는 작은 기준부터 합의합니다.',
    defaultRiskMemo: '성과 압박보다 기록 품질과 질문 습관을 먼저 보는 대화가 필요합니다.',
  },
  {
    id: 'moon-gyowon',
    label: '문교원 사원',
    role: '저연차 탐색형',
    currentSignal: '디지털 활용은 빠르지만 고객 대화 경험이 부족해 동행·관찰 과제가 필요합니다.',
    strength: '자료 정리, 디지털 도구 활용, 빠른 학습',
    risk: '고객 앞에서 표현 안전선과 질문 순서를 놓칠 수 있음',
    leaderQuestion: '직접 맡길 것인가, 동행 관찰부터 시작할 것인가?',
    defaultCoachingPurpose: '성장 의미 부여',
    defaultSelectionReason: '혼자 맡길지보다 먼저, 관찰과 작은 실행을 통해 배울 조건이 필요한지 확인합니다.',
    defaultCoachingFocus: '동행 후 고객 반응과 질문 흐름을 정리하고 다음 소규모 실행 과제를 합의합니다.',
    defaultRiskMemo: '혼자 고객 대응을 맡기기보다 동행·관찰·소규모 실행으로 단계화합니다.',
  },
];

const DIRECT_PROFILE: TeamMemberProfile = {
  id: DIRECT_CANDIDATE_ID,
  label: '직접 등록한 팀원',
  role: '익명 등록 후보',
  currentSignal: '실제 고민 중인 팀원을 익명으로 등록하면 이곳에 현재 신호가 표시됩니다.',
  strength: '관찰 가능한 강점이나 활용 가능한 자원을 적어 주세요.',
  risk: '단정이 아니라 관찰 가능한 리스크 신호를 적어 주세요.',
  leaderQuestion: '지금 이 팀원과 먼저 1on1을 해야 하는 이유는 무엇입니까?',
  defaultCoachingPurpose: '먼저 들어보기',
  defaultSelectionReason: '실제 팀에서 지금 가장 먼저 확인해야 할 신호가 있어 1on1 후보로 검토합니다.',
  defaultCoachingFocus: '관찰된 신호, 강점, 리스크를 사실 중심으로 확인하고 9단계에서 대화 흐름으로 바꿉니다.',
  defaultRiskMemo: '실명, 고객명, 병원명, 의료진명, 제품명, 내부 수치, 평가등급, 개인정보는 입력하지 않습니다.',
  isDirect: true,
};

const COACHING_PURPOSE_OPTIONS = ['먼저 들어보기', '부담 확인', '성장 의미 부여', '실행 기준 합의', '안전선 확인', '역할 설명', '동기 회복', '업무 조정'];

function createEmptyDecision(profile: TeamMemberProfile): V39TeamSevenMemberDecision {
  return {
    memberId: profile.id,
    memberLabel: profile.label,
    allocationDecision: '',
    coachingPurpose: '',
    priorityOneOnOne: false,
    leaderSupport: '',
    riskMemo: '',
    selectionReason: '',
    coachingFocus: '',
    aiJudgmentDraft: '',
    directAlias: '',
    directRoleSituation: '',
    directSignal: '',
    directStrength: '',
    directRisk: '',
    directLeaderQuestion: '',
  };
}

function normalizeDecision(value: unknown, profile: TeamMemberProfile): V39TeamSevenMemberDecision {
  if (!value || typeof value !== 'object') return createEmptyDecision(profile);
  const source = value as Partial<V39TeamSevenMemberDecision>;
  return {
    memberId: typeof source.memberId === 'string' ? source.memberId : profile.id,
    memberLabel: typeof source.memberLabel === 'string' ? source.memberLabel : profile.label,
    allocationDecision: typeof source.allocationDecision === 'string' ? source.allocationDecision : '',
    coachingPurpose: typeof source.coachingPurpose === 'string' ? source.coachingPurpose : '',
    priorityOneOnOne: Boolean(source.priorityOneOnOne),
    leaderSupport: typeof source.leaderSupport === 'string' ? source.leaderSupport : '',
    riskMemo: typeof source.riskMemo === 'string' ? source.riskMemo : '',
    selectionReason: typeof source.selectionReason === 'string' ? source.selectionReason : '',
    coachingFocus: typeof source.coachingFocus === 'string' ? source.coachingFocus : '',
    aiJudgmentDraft: typeof source.aiJudgmentDraft === 'string' ? source.aiJudgmentDraft : '',
    directAlias: typeof source.directAlias === 'string' ? source.directAlias : '',
    directRoleSituation: typeof source.directRoleSituation === 'string' ? source.directRoleSituation : '',
    directSignal: typeof source.directSignal === 'string' ? source.directSignal : '',
    directStrength: typeof source.directStrength === 'string' ? source.directStrength : '',
    directRisk: typeof source.directRisk === 'string' ? source.directRisk : '',
    directLeaderQuestion: typeof source.directLeaderQuestion === 'string' ? source.directLeaderQuestion : '',
  };
}

function createEmptyResult(): V39TeamSevenCoachingMapResult {
  return { schemaVersion: 1, updatedAt: '', decisions: {} };
}

export function loadV39TeamSevenCoachingMapResult(): V39TeamSevenCoachingMapResult {
  if (typeof window === 'undefined') return createEmptyResult();
  const raw = window.localStorage.getItem(V39_TEAM_SEVEN_COACHING_STORAGE_KEY);
  if (!raw) return createEmptyResult();
  try {
    const parsed = JSON.parse(raw) as Partial<V39TeamSevenCoachingMapResult>;
    const decisions: Record<string, V39TeamSevenMemberDecision> = {};
    const rawDecisions = parsed.decisions && typeof parsed.decisions === 'object' ? parsed.decisions : {};
    for (const profile of [...TEAM_MEMBER_PROFILES, DIRECT_PROFILE]) decisions[profile.id] = normalizeDecision(rawDecisions[profile.id], profile);
    return { schemaVersion: 1, updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '', decisions };
  } catch {
    return createEmptyResult();
  }
}

function saveResult(decisions: Record<string, V39TeamSevenMemberDecision>) {
  window.localStorage.setItem(
    V39_TEAM_SEVEN_COACHING_STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, updatedAt: new Date().toISOString(), decisions }),
  );
}

function displayProfile(profile: TeamMemberProfile, decision: V39TeamSevenMemberDecision): TeamMemberProfile {
  if (!profile.isDirect) return profile;
  return {
    ...profile,
    label: decision.directAlias?.trim() || profile.label,
    role: decision.directRoleSituation?.trim() || profile.role,
    currentSignal: decision.directSignal?.trim() || profile.currentSignal,
    strength: decision.directStrength?.trim() || profile.strength,
    risk: decision.directRisk?.trim() || profile.risk,
    leaderQuestion: decision.directLeaderQuestion?.trim() || profile.leaderQuestion,
  };
}

function hasDirectCandidateInput(decision: V39TeamSevenMemberDecision) {
  return Boolean(
    decision.directAlias?.trim() ||
      decision.directRoleSituation?.trim() ||
      decision.directSignal?.trim() ||
      decision.directStrength?.trim() ||
      decision.directRisk?.trim() ||
      decision.directLeaderQuestion?.trim(),
  );
}

function isDecisionFilled(item: V39TeamSevenMemberDecision) {
  return Boolean(
    item.coachingPurpose ||
      item.priorityOneOnOne ||
      item.selectionReason?.trim() ||
      item.coachingFocus?.trim() ||
      item.leaderSupport?.trim() ||
      item.riskMemo.trim() ||
      item.aiJudgmentDraft?.trim(),
  );
}

function buildCoachingJudgmentPrompt(profile: TeamMemberProfile, decision: V39TeamSevenMemberDecision) {
  const visibleProfile = displayProfile(profile, decision);
  return [
    '당신은 팀장의 코칭 대상 선정 판단을 돕는 AI 사고 파트너입니다.',
    '',
    '아래 정보는 실제 인물이 아니라 익명화된 코칭 후보 정보입니다.',
    '팀원을 평가하거나 성격을 단정하지 말고, 관찰 가능한 신호와 코칭 필요성을 정리해 주세요.',
    '',
    '[입력]',
    `- 코칭 후보 별칭: ${visibleProfile.label}`,
    `- 역할/상황: ${visibleProfile.role}`,
    `- 현재 신호: ${visibleProfile.currentSignal}`,
    `- 강점: ${visibleProfile.strength}`,
    `- 리스크: ${visibleProfile.risk}`,
    `- 팀장 고민 질문: ${visibleProfile.leaderQuestion}`,
    `- 현재 선택한 1on1 목적: ${decision.coachingPurpose || '아직 선택하지 않음'}`,
    `- 팀장이 생각한 선택 이유: ${decision.selectionReason || decision.leaderSupport || '아직 작성하지 않음'}`,
    `- 9단계로 넘기고 싶은 코칭 초점: ${decision.coachingFocus || '아직 작성하지 않음'}`,
    '',
    '[요청]',
    '아래 항목으로 정리해 주세요.',
    '',
    '1. 관찰된 신호 요약',
    '2. 강점으로 볼 수 있는 부분',
    '3. 리스크로 볼 수 있는 부분',
    '4. 섣불리 단정하면 안 되는 해석',
    '5. 지금 1on1이 필요한 이유',
    '6. 코칭 우선순위 판단 기준',
    '7. 9단계로 넘길 코칭 초점',
    '',
    '주의:',
    '- 팀원을 평가하지 마세요.',
    '- 성격이나 태도를 단정하지 마세요.',
    '- 대화 스크립트나 질문 목록은 만들지 마세요.',
    '- 9단계에서 대화 준비를 할 수 있도록 코칭 초점만 정리하세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 평가등급, 개인정보는 포함하지 마세요.',
  ].join('\n');
}

export function V39TeamSevenCoachingMap() {
  const [decisions, setDecisions] = useState<Record<string, V39TeamSevenMemberDecision>>(() => {
    const loaded = loadV39TeamSevenCoachingMapResult();
    const next: Record<string, V39TeamSevenMemberDecision> = {};
    for (const profile of [...TEAM_MEMBER_PROFILES, DIRECT_PROFILE]) next[profile.id] = loaded.decisions[profile.id] ?? createEmptyDecision(profile);
    return next;
  });
  const [copiedMemberId, setCopiedMemberId] = useState('');

  const visibleProfiles = useMemo(() => {
    const directDecision = decisions[DIRECT_CANDIDATE_ID] ?? createEmptyDecision(DIRECT_PROFILE);
    return hasDirectCandidateInput(directDecision) ? [...TEAM_MEMBER_PROFILES, DIRECT_PROFILE] : TEAM_MEMBER_PROFILES;
  }, [decisions]);

  const priorityCount = useMemo(() => Object.values(decisions).filter((item) => item.priorityOneOnOne).length, [decisions]);
  const completedCount = useMemo(() => Object.values(decisions).filter(isDecisionFilled).length, [decisions]);

  const updateDecision = (profile: TeamMemberProfile, patch: Partial<V39TeamSevenMemberDecision>) => {
    setDecisions((current) => {
      const existing = current[profile.id] ?? createEmptyDecision(profile);
      if (patch.priorityOneOnOne && !existing.priorityOneOnOne) {
        const currentPriorityCount = Object.values(current).filter((item) => item.priorityOneOnOne).length;
        if (currentPriorityCount >= 2) return current;
      }
      const next = {
        ...current,
        [profile.id]: {
          ...existing,
          memberId: profile.id,
          memberLabel: profile.isDirect ? existing.directAlias?.trim() || profile.label : profile.label,
          ...patch,
        },
      };
      saveResult(next);
      return next;
    });
  };

  const applyDraft = (profile: TeamMemberProfile) => {
    const current = decisions[profile.id] ?? createEmptyDecision(profile);
    updateDecision(profile, {
      coachingPurpose: current.coachingPurpose || profile.defaultCoachingPurpose,
      selectionReason: current.selectionReason || current.leaderSupport || profile.defaultSelectionReason,
      leaderSupport: current.leaderSupport || current.selectionReason || profile.defaultSelectionReason,
      coachingFocus: current.coachingFocus || profile.defaultCoachingFocus,
      riskMemo: current.riskMemo || profile.defaultRiskMemo,
    });
  };

  const copyAiPrompt = async (profile: TeamMemberProfile, current: V39TeamSevenMemberDecision) => {
    try {
      await navigator.clipboard.writeText(buildCoachingJudgmentPrompt(profile, current));
      setCopiedMemberId(profile.id);
      window.setTimeout(() => setCopiedMemberId(''), 1600);
    } catch {
      setCopiedMemberId('');
    }
  };

  const priorityMembers = visibleProfiles
    .filter((profile) => decisions[profile.id]?.priorityOneOnOne)
    .map((profile) => displayProfile(profile, decisions[profile.id] ?? createEmptyDecision(profile)).label);

  const directDecision = decisions[DIRECT_CANDIDATE_ID] ?? createEmptyDecision(DIRECT_PROFILE);

  return (
    <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Coaching Target Selection</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">코칭 대상 선정</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            7명의 팀원 유형을 참고해 지금 1on1 코칭이 필요하다고 느껴지는 팀원을 선택합니다. 실제 팀원과 가장 유사한 사람을 떠올리되, 사람을 평가하거나 성격을 단정하지 않습니다. 우선 1on1 대상은 최대 2명만 선택하고, 9단계로 넘길 코칭 초점까지만 정리합니다.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:w-72">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-black text-slate-500">판단 메모</p>
            <p className="mt-1 text-sm font-black text-indigo-950">{completedCount}건</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-black text-slate-500">우선 1on1</p>
            <p className="mt-1 text-sm font-black text-indigo-950">{priorityCount} / 2명</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-indigo-200 bg-white p-4 text-xs font-bold leading-5 text-indigo-950">
          <p className="font-black">이 화면에서 하지 않는 것</p>
          <p className="mt-1">고객군별 담당자를 배치하거나 업무를 나누지 않습니다. 팀원이 맡을 일을 확정하는 화면이 아니라, 먼저 대화가 필요한 사람과 그 이유를 좁히는 화면입니다.</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
          <p className="font-black">입력 금지</p>
          <p className="mt-1">실명, 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 평가등급, 개인정보, 민감한 개인 사정은 입력하지 않습니다.</p>
        </div>
      </div>

      <section className="mt-4 rounded-3xl border border-white bg-white p-4 shadow-sm">
        <details>
          <summary className="cursor-pointer text-sm font-black text-slate-950">실제 고민 팀원 직접 등록</summary>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
            실제 팀원을 등록할 때는 익명 별칭과 관찰 가능한 신호만 적습니다. 예: “팀원 A”, “경력 많은 팀원”, “후속조치 기록이 자주 늦어짐”.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-black text-slate-500">익명 별칭</span>
              <input className="w-full rounded-2xl border px-3 py-2 text-sm" value={directDecision.directAlias || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directAlias: event.target.value, memberLabel: event.target.value || DIRECT_PROFILE.label })} placeholder="예: 팀원 A" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-black text-slate-500">역할/상황</span>
              <input className="w-full rounded-2xl border px-3 py-2 text-sm" value={directDecision.directRoleSituation || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directRoleSituation: event.target.value })} placeholder="예: 경력 많은 팀원, 핵심 고객 담당자" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-black text-slate-500">현재 신호</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={directDecision.directSignal || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directSignal: event.target.value })} placeholder="관찰 가능한 행동이나 상황만 적습니다. 성격 단정은 피합니다." />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-black text-slate-500">강점</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={directDecision.directStrength || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directStrength: event.target.value })} placeholder="예: 고객 관계 안정성, 자료 정리, 빠른 실행" />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-black text-slate-500">리스크</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={directDecision.directRisk || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directRisk: event.target.value })} placeholder="예: 부담 누적, 실행 지연, 표현 안전선 우려" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-black text-slate-500">팀장 고민 질문</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={directDecision.directLeaderQuestion || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directLeaderQuestion: event.target.value })} placeholder="예: 지금 먼저 들어봐야 하는가, 아니면 실행 기준을 먼저 맞춰야 하는가?" />
            </label>
          </div>
        </details>
      </section>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {visibleProfiles.map((baseProfile) => {
          const current = decisions[baseProfile.id] ?? createEmptyDecision(baseProfile);
          const profile = displayProfile(baseProfile, current);
          const oneOnOneDisabled = !current.priorityOneOnOne && priorityCount >= 2;
          return (
            <article key={baseProfile.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-base font-black text-slate-950">{profile.label}</p>
                  <p className="mt-1 text-xs font-black text-indigo-700">{profile.role}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="rounded-2xl border bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800" onClick={() => applyDraft(baseProfile)}>
                    판단 초안 가져오기
                  </button>
                  <button type="button" className="rounded-2xl bg-sky-700 px-3 py-2 text-xs font-black text-white" onClick={() => copyAiPrompt(baseProfile, current)}>
                    {copiedMemberId === baseProfile.id ? '프롬프트 복사 완료' : 'AI로 1on1 대상 판단 정리하기'}
                  </button>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-slate-700 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3"><span className="font-black text-slate-950">현재 신호</span><br />{profile.currentSignal}</div>
                <div className="rounded-2xl bg-emerald-50 p-3"><span className="font-black text-emerald-900">강점</span><br />{profile.strength}</div>
                <div className="rounded-2xl bg-amber-50 p-3"><span className="font-black text-amber-900">리스크</span><br />{profile.risk}</div>
                <div className="rounded-2xl bg-sky-50 p-3"><span className="font-black text-sky-900">팀장 질문</span><br />{profile.leaderQuestion}</div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">1on1 코칭 목적</span>
                  <select className="min-h-11 w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={current.coachingPurpose} onChange={(event) => updateDecision(baseProfile, { coachingPurpose: event.target.value })}>
                    <option value="">선택하세요</option>
                    {COACHING_PURPOSE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
                  <input type="checkbox" checked={current.priorityOneOnOne} disabled={oneOnOneDisabled} onChange={(event) => updateDecision(baseProfile, { priorityOneOnOne: event.target.checked })} />
                  우선 1on1 대상 2명 안에 포함
                  {oneOnOneDisabled ? <span className="font-bold text-amber-700">이미 2명을 선택했습니다</span> : null}
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-black text-slate-500">선택 이유</span>
                  <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.selectionReason || current.leaderSupport} onChange={(event) => updateDecision(baseProfile, { selectionReason: event.target.value, leaderSupport: event.target.value })} placeholder="왜 지금 이 팀원과 먼저 1on1이 필요하다고 느끼는지 적어 주세요." />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-black text-slate-500">9단계로 넘길 코칭 초점</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.coachingFocus || ''} onChange={(event) => updateDecision(baseProfile, { coachingFocus: event.target.value })} placeholder="예: 부담을 먼저 듣고, 이번 2주 동안 어디까지 실행할지 함께 좁힌다." />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-black text-slate-500">단정하면 안 되는 해석 / 주의할 지점</span>
                  <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.riskMemo} onChange={(event) => updateDecision(baseProfile, { riskMemo: event.target.value })} placeholder="예: 의지가 낮다고 단정하지 말고, 역할 기준·부담·지원 조건을 먼저 확인한다." />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-black text-slate-500">AI 판단 정리 붙여넣기</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.aiJudgmentDraft || ''} onChange={(event) => updateDecision(baseProfile, { aiJudgmentDraft: event.target.value })} placeholder="AI 결과를 붙여넣는 경우, 9단계로 넘길 코칭 초점까지만 남기세요. 대화 스크립트와 질문 목록은 9단계에서 만듭니다." />
                </label>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-indigo-200 bg-white p-4 text-xs font-bold leading-5 text-slate-700">
        <p className="font-black text-slate-950">9단계로 넘길 우선 1on1 대상</p>
        <p className="mt-1">{priorityMembers.length > 0 ? priorityMembers.join(' · ') : '아직 선택하지 않았습니다. 우선 1on1이 필요한 팀원 1~2명을 선택하세요.'}</p>
      </div>
    </section>
  );
}
