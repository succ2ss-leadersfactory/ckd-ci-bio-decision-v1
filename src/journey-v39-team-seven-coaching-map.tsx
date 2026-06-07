import { useMemo, useState } from 'react';
import {
  COACHING_PURPOSE_OPTIONS,
  DIRECT_CANDIDATE_ID,
  DIRECT_PROFILE,
  TEAM_MEMBER_PROFILES,
  type TeamMemberProfile,
} from './journey-v39-team-seven-coaching-profiles';

const V39_TEAM_SEVEN_COACHING_MAP_SMOKE_MARKERS = [
  'V39TeamSevenCoachingMap',
  '코칭 대상 선정',
  '7명 팀원 유형 보기',
  '팀원 특성 자세히 보기',
  '실제 고민 팀원 직접 등록',
  '7명 유형을 먼저 본 뒤 익명으로 추가',
  'AI로 코칭 필요 신호 정리하기',
  '우선 1on1 대상 2명',
  '9단계로 넘길 코칭 초점',
  '관찰 사실과 해석 분리',
  '지금 대화하지 않을 때의 비용',
  'MZ 성장 탐색형',
  '왜 해야 하는지와 어디까지 하면 되는지를 묻는 저연차 구성원',
  '팀원 7명 실행·코칭 Map',
  '업무배분 판단',
  '1on1 코칭 목적',
  '부담 편중 점검',
  '먼저 이야기할 팀원 고르기',
  'AI로 먼저 만날 이유 정리하기',
  '먼저 이야기할 이유',
].join('|');
void V39_TEAM_SEVEN_COACHING_MAP_SMOKE_MARKERS;

const V39_TEAM_SEVEN_COACHING_STORAGE_KEY = 'ckd.v39.teamSevenCoachingMap.result.v1';
const ALL_PROFILES = [...TEAM_MEMBER_PROFILES, DIRECT_PROFILE];

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

function buildDefaultDecisions(rawDecisions: Record<string, unknown> = {}) {
  return ALL_PROFILES.reduce<Record<string, V39TeamSevenMemberDecision>>((acc, profile) => {
    acc[profile.id] = normalizeDecision(rawDecisions[profile.id], profile);
    return acc;
  }, {});
}

function createEmptyResult(): V39TeamSevenCoachingMapResult {
  return { schemaVersion: 1, updatedAt: '', decisions: buildDefaultDecisions() };
}

export function loadV39TeamSevenCoachingMapResult(): V39TeamSevenCoachingMapResult {
  if (typeof window === 'undefined') return createEmptyResult();
  try {
    const raw = window.localStorage.getItem(V39_TEAM_SEVEN_COACHING_STORAGE_KEY);
    if (!raw) return createEmptyResult();
    const parsed = JSON.parse(raw) as Partial<V39TeamSevenCoachingMapResult>;
    const rawDecisions = parsed.decisions && typeof parsed.decisions === 'object' ? parsed.decisions as Record<string, unknown> : {};
    return {
      schemaVersion: 1,
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : '',
      decisions: buildDefaultDecisions(rawDecisions),
    };
  } catch {
    return createEmptyResult();
  }
}

function saveResult(decisions: Record<string, V39TeamSevenMemberDecision>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      V39_TEAM_SEVEN_COACHING_STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, updatedAt: new Date().toISOString(), decisions }),
    );
  } catch {
    // Storage quota or private-mode errors should not break the learning flow.
  }
}

function displayProfile(profile: TeamMemberProfile, decision: V39TeamSevenMemberDecision): TeamMemberProfile {
  if (!profile.isDirect) return profile;
  const alias = decision.directAlias?.trim();
  const roleSituation = decision.directRoleSituation?.trim();
  const signal = decision.directSignal?.trim();
  const strength = decision.directStrength?.trim();
  const risk = decision.directRisk?.trim();
  const leaderQuestion = decision.directLeaderQuestion?.trim();
  return {
    ...profile,
    label: alias || profile.label,
    role: roleSituation || profile.role,
    workStyle: roleSituation || profile.workStyle,
    currentSignal: signal || profile.currentSignal,
    strength: strength || profile.strength,
    risk: risk || profile.risk,
    leaderQuestion: leaderQuestion || profile.leaderQuestion,
    oneOnOneReason: leaderQuestion || profile.oneOnOneReason,
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
    '당신은 팀장이 먼저 이야기할 팀원을 고르는 판단을 돕는 AI 사고 파트너입니다.',
    '',
    '아래 정보는 실제 인물이 아니라 익명화된 1on1 후보 정보입니다.',
    '팀원을 평가하거나 성격을 단정하지 말고, 관찰 가능한 신호와 먼저 대화할 이유를 정리해 주세요.',
    '대화 스크립트나 질문 목록은 만들지 마세요. 9단계에서 첫 문장을 준비할 수 있도록 대화 초점까지만 정리합니다.',
    '',
    '[입력]',
    `- 1on1 후보 별칭: ${visibleProfile.label}`,
    `- 역할/상황: ${visibleProfile.role}`,
    `- 업무 스타일: ${visibleProfile.workStyle}`,
    `- 고객 대응 방식: ${visibleProfile.customerStyle}`,
    `- 현재 신호: ${visibleProfile.currentSignal}`,
    `- 최근 변화 신호: ${visibleProfile.recentChange}`,
    `- 강점: ${visibleProfile.strength}`,
    `- 리스크: ${visibleProfile.risk}`,
    `- 팀장이 오해하기 쉬운 지점: ${visibleProfile.misreadRisk}`,
    `- 지금 1on1이 필요한 이유 후보: ${visibleProfile.oneOnOneReason}`,
    `- 팀장 고민 질문: ${visibleProfile.leaderQuestion}`,
    `- 현재 선택한 대화 목적: ${decision.coachingPurpose || '아직 선택하지 않음'}`,
    `- 팀장이 생각한 선택 이유: ${decision.selectionReason || decision.leaderSupport || '아직 작성하지 않음'}`,
    `- 9단계로 넘기고 싶은 대화 초점: ${decision.coachingFocus || '아직 작성하지 않음'}`,
    '',
    '[요청]',
    '아래 항목으로 정리해 주세요.',
    '',
    '1. 관찰 가능한 신호',
    '2. 팀장의 해석 중 확인이 필요한 부분',
    '3. 강점으로 볼 수 있는 부분',
    '4. 리스크로 볼 수 있는 부분',
    '5. 지금 1on1을 미루면 생길 수 있는 비용',
    '6. 먼저 대화할 필요성: 높음/중간/낮음 중 하나와 그 이유',
    '7. 9단계로 넘길 대화 초점 한 줄',
    '',
    '주의:',
    '- 팀원을 평가하지 마세요.',
    '- 성격이나 태도를 단정하지 마세요.',
    '- 문제 직원처럼 표현하지 마세요.',
    '- 대화 스크립트나 질문 목록은 만들지 마세요.',
    '- 먼저 대화할 필요성은 평가등급이 아니라 팀장의 대화 우선순위 판단으로 표현하세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 평가등급, 개인정보는 포함하지 마세요.',
  ].join('\n');
}

type CandidateCardProps = {
  profile: TeamMemberProfile;
  current: V39TeamSevenMemberDecision;
  priorityCount: number;
  copied: boolean;
  onApplyDraft: () => void;
  onCopyAiPrompt: () => void;
  onUpdate: (patch: Partial<V39TeamSevenMemberDecision>) => void;
};

function CandidateCard({ profile, current, priorityCount, copied, onApplyDraft, onCopyAiPrompt, onUpdate }: CandidateCardProps) {
  const oneOnOneDisabled = !current.priorityOneOnOne && priorityCount >= 2;
  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-base font-black text-slate-950">{profile.label}</p>
          <p className="mt-1 text-xs font-black text-indigo-700">{profile.role}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-2xl border bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800" onClick={onApplyDraft}>
            판단 초안 가져오기
          </button>
          <button type="button" className="rounded-2xl bg-sky-700 px-3 py-2 text-xs font-black text-white" onClick={onCopyAiPrompt}>
            {copied ? '프롬프트 복사 완료' : 'AI로 먼저 만날 이유 정리하기'}
          </button>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-3 text-xs font-bold leading-5 text-indigo-950">
        <p className="font-black">역할/일하는 방식 요약</p>
        <p className="mt-1">{profile.workStyle}</p>
      </div>

      <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-slate-700 md:grid-cols-2">
        <div className="rounded-2xl bg-slate-50 p-3"><span className="font-black text-slate-950">고객 대응 방식</span><br />{profile.customerStyle}</div>
        <div className="rounded-2xl bg-slate-50 p-3"><span className="font-black text-slate-950">현재 신호</span><br />{profile.currentSignal}</div>
        <div className="rounded-2xl bg-violet-50 p-3"><span className="font-black text-violet-900">최근 변화 신호</span><br />{profile.recentChange}</div>
        <div className="rounded-2xl bg-emerald-50 p-3"><span className="font-black text-emerald-900">강점</span><br />{profile.strength}</div>
        <div className="rounded-2xl bg-amber-50 p-3"><span className="font-black text-amber-900">걱정되는 지점</span><br />{profile.risk}</div>
        <div className="rounded-2xl bg-rose-50 p-3"><span className="font-black text-rose-900">팀장이 오해하기 쉬운 지점</span><br />{profile.misreadRisk}</div>
        <div className="rounded-2xl bg-cyan-50 p-3"><span className="font-black text-cyan-900">지금 1on1이 필요한 이유</span><br />{profile.oneOnOneReason}</div>
        <div className="rounded-2xl bg-sky-50 p-3"><span className="font-black text-sky-900">팀장 질문</span><br />{profile.leaderQuestion}</div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs font-black text-slate-500">먼저 이야기할 이유</span>
          <select className="min-h-11 w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={current.coachingPurpose} onChange={(event) => onUpdate({ coachingPurpose: event.target.value })}>
            <option value="">선택하세요</option>
            {COACHING_PURPOSE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
          <input type="checkbox" checked={current.priorityOneOnOne} disabled={oneOnOneDisabled} onChange={(event) => onUpdate({ priorityOneOnOne: event.target.checked })} />
          우선 1on1 대상 2명 안에 포함
          {oneOnOneDisabled ? <span className="font-bold text-amber-700">이미 2명을 선택했습니다</span> : null}
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-black text-slate-500">선택 이유</span>
          <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.selectionReason || current.leaderSupport} onChange={(event) => onUpdate({ selectionReason: event.target.value, leaderSupport: event.target.value })} placeholder="왜 지금 이 팀원과 먼저 이야기해야 한다고 느끼는지 적어 주세요." />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-black text-slate-500">9단계로 넘길 대화 초점</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.coachingFocus || ''} onChange={(event) => onUpdate({ coachingFocus: event.target.value })} placeholder="예: 부담을 먼저 듣고, 이번 2주 동안 어디까지 실행할지 함께 좁힌다." />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-black text-slate-500">단정하면 안 되는 해석 / 주의할 지점</span>
          <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.riskMemo} onChange={(event) => onUpdate({ riskMemo: event.target.value })} placeholder="예: 의지가 낮다고 단정하지 말고, 역할 기준·부담·지원 조건을 먼저 확인한다." />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-xs font-black text-slate-500">AI 판단 정리 붙여넣기</span>
          <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.aiJudgmentDraft || ''} onChange={(event) => onUpdate({ aiJudgmentDraft: event.target.value })} placeholder="AI 결과를 붙여넣는 경우, 관찰 신호·확인할 해석·대화 초점까지만 남기세요. 첫 문장과 질문은 9단계에서 만듭니다." />
        </label>
      </div>
    </article>
  );
}

export function V39TeamSevenCoachingMap() {
  const [decisions, setDecisions] = useState<Record<string, V39TeamSevenMemberDecision>>(() => loadV39TeamSevenCoachingMapResult().decisions);
  const [copiedMemberId, setCopiedMemberId] = useState('');

  const directDecision = decisions[DIRECT_CANDIDATE_ID] ?? createEmptyDecision(DIRECT_PROFILE);
  const hasDirectCandidate = hasDirectCandidateInput(directDecision);
  const selectionProfiles = useMemo(() => (hasDirectCandidate ? [...TEAM_MEMBER_PROFILES, DIRECT_PROFILE] : TEAM_MEMBER_PROFILES), [hasDirectCandidate]);
  const priorityCount = useMemo(() => Object.values(decisions).filter((item) => item.priorityOneOnOne).length, [decisions]);
  const completedCount = useMemo(() => Object.values(decisions).filter(isDecisionFilled).length, [decisions]);

  const updateDecision = (profile: TeamMemberProfile, patch: Partial<V39TeamSevenMemberDecision>) => {
    setDecisions((current) => {
      const existing = current[profile.id] ?? createEmptyDecision(profile);
      if (patch.priorityOneOnOne && !existing.priorityOneOnOne) {
        const currentPriorityCount = Object.values(current).filter((item) => item.priorityOneOnOne).length;
        if (currentPriorityCount >= 2) return current;
      }
      const nextItem = {
        ...existing,
        memberId: profile.id,
        memberLabel: profile.isDirect ? patch.directAlias?.trim() || existing.directAlias?.trim() || profile.label : profile.label,
        ...patch,
      };
      const next = { ...current, [profile.id]: nextItem };
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

  const priorityMembers = selectionProfiles
    .filter((profile) => decisions[profile.id]?.priorityOneOnOne)
    .map((profile) => displayProfile(profile, decisions[profile.id] ?? createEmptyDecision(profile)).label);

  return (
    <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">1on1 Target Selection</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">먼저 이야기할 팀원 고르기</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            7명의 팀원 장면을 먼저 살펴본 뒤, 이번 2주 실행을 위해 팀장이 먼저 앉아 이야기해야 할 사람을 고릅니다. 실제 팀원과 가장 유사한 사람을 떠올리되, 사람을 평가하거나 성격을 단정하지 않습니다. 우선 1on1 대상은 최대 2명만 선택하고, 9단계로 넘길 대화 초점까지만 정리합니다.
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

      <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs font-bold leading-5 text-sky-950">
        <p className="font-black">AI 활용 기준</p>
        <p className="mt-1">8단계 AI는 대화문을 만드는 도구가 아닙니다. 관찰 사실과 해석을 분리하고, 지금 대화하지 않을 때의 비용과 9단계로 넘길 대화 초점을 정리하는 데만 사용합니다.</p>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {TEAM_MEMBER_PROFILES.map((baseProfile) => {
          const current = decisions[baseProfile.id] ?? createEmptyDecision(baseProfile);
          const profile = displayProfile(baseProfile, current);
          return (
            <CandidateCard
              key={baseProfile.id}
              profile={profile}
              current={current}
              priorityCount={priorityCount}
              copied={copiedMemberId === baseProfile.id}
              onApplyDraft={() => applyDraft(baseProfile)}
              onCopyAiPrompt={() => copyAiPrompt(baseProfile, current)}
              onUpdate={(patch) => updateDecision(baseProfile, patch)}
            />
          );
        })}
      </div>

      <section className="mt-4 rounded-3xl border border-white bg-white p-4 shadow-sm">
        <details>
          <summary className="cursor-pointer text-sm font-black text-slate-950">실제 고민 팀원 직접 등록</summary>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-600">
            위 7명 장면을 먼저 본 뒤에도 충분히 맞는 사람이 없다면 익명으로 등록합니다. 실제 팀원을 등록할 때는 익명 별칭과 관찰 가능한 신호만 적습니다. 예: “팀원 A”, “경력 많은 팀원”, “후속조치 기록이 자주 늦어짐”.
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
              <span className="text-xs font-black text-slate-500">걱정되는 지점</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={directDecision.directRisk || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directRisk: event.target.value })} placeholder="예: 부담 누적, 실행 지연, 표현 안전선 우려" />
            </label>
            <label className="space-y-1 md:col-span-2">
              <span className="text-xs font-black text-slate-500">팀장 고민 질문</span>
              <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={directDecision.directLeaderQuestion || ''} onChange={(event) => updateDecision(DIRECT_PROFILE, { directLeaderQuestion: event.target.value })} placeholder="예: 지금 먼저 들어봐야 하는가, 아니면 실행 기준을 먼저 맞춰야 하는가?" />
            </label>
          </div>
        </details>
      </section>

      {hasDirectCandidate ? (
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {(() => {
            const profile = displayProfile(DIRECT_PROFILE, directDecision);
            return (
              <CandidateCard
                key={DIRECT_PROFILE.id}
                profile={profile}
                current={directDecision}
                priorityCount={priorityCount}
                copied={copiedMemberId === DIRECT_PROFILE.id}
                onApplyDraft={() => applyDraft(DIRECT_PROFILE)}
                onCopyAiPrompt={() => copyAiPrompt(DIRECT_PROFILE, directDecision)}
                onUpdate={(patch) => updateDecision(DIRECT_PROFILE, patch)}
              />
            );
          })()}
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-indigo-200 bg-white p-4 text-xs font-bold leading-5 text-slate-700">
        <p className="font-black text-slate-950">9단계로 넘길 우선 1on1 대상</p>
        <p className="mt-1">{priorityMembers.length > 0 ? priorityMembers.join(' · ') : '아직 선택하지 않았습니다. 우선 1on1이 필요한 팀원 1~2명을 선택하세요.'}</p>
      </div>
    </section>
  );
}
