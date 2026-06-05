import { useMemo, useState } from 'react';

const V39_TEAM_SEVEN_COACHING_MAP_SMOKE_MARKERS = [
  'V39TeamSevenCoachingMap',
  '팀원 7명 실행·코칭 Map',
  '업무배분 판단',
  '1on1 코칭 목적',
  '우선 1on1 대상 2명',
  '부담 편중 점검',
].join('|');
void V39_TEAM_SEVEN_COACHING_MAP_SMOKE_MARKERS;

const V39_TEAM_SEVEN_COACHING_STORAGE_KEY = 'ckd.v39.teamSevenCoachingMap.result.v1';

export type V39TeamSevenMemberDecision = {
  memberId: string;
  memberLabel: string;
  allocationDecision: string;
  coachingPurpose: string;
  priorityOneOnOne: boolean;
  leaderSupport: string;
  riskMemo: string;
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
  defaultDecision: string;
  defaultCoachingPurpose: string;
  defaultSupport: string;
  defaultRiskMemo: string;
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
    defaultDecision: '함께 맡긴다',
    defaultCoachingPurpose: '부담 확인',
    defaultSupport: '기존 경험을 살리되, 후속조치 기록 기준과 고객 질문 정리 방식을 함께 맞춥니다.',
    defaultRiskMemo: '“경험 있으니 알아서 해주세요”로 들리지 않게 지원과 인정 기준을 같이 제시합니다.',
  },
  {
    id: 'kim-moonho',
    label: '김문호 차장',
    role: '책임감 강한 실무형',
    currentSignal: '어려운 고객 대응을 자주 맡지만 부담이 쌓이고 있을 가능성이 있습니다.',
    strength: '문제 상황 수습, 책임감, 고객 대응 신뢰도',
    risk: '반복 배정에 따른 번아웃, 인정 없이 어려운 일만 몰리는 느낌',
    leaderQuestion: '이번에도 맡겨야 하는가, 아니면 부담을 덜어주어야 하는가?',
    defaultDecision: '기존 업무를 덜어준다',
    defaultCoachingPurpose: '부담 확인',
    defaultSupport: '맡기는 이유보다 먼저 최근 부담과 조정 필요성을 확인합니다.',
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
    defaultDecision: '맡긴다',
    defaultCoachingPurpose: '실행 기준 합의',
    defaultSupport: '관찰한 신호를 다음 행동으로 바꾸는 최소 실행 기준을 함께 정합니다.',
    defaultRiskMemo: '분석을 더 요구하기보다 언제까지 무엇을 확인할지 좁혀야 합니다.',
  },
  {
    id: 'lee-daeun',
    label: '이대은 대리',
    role: '관계 유지형',
    currentSignal: '기존 고객 관리는 안정적이지만 신규 확장 과제에서는 주저할 수 있습니다.',
    strength: '관계 유지, 신뢰 기반 대화, 꾸준한 방문 리듬',
    risk: '늘 하던 고객군에 머물며 성장 기회가 제한될 수 있음',
    leaderQuestion: '안정 업무만 맡기고 있는 것은 아닌가?',
    defaultDecision: '함께 맡긴다',
    defaultCoachingPurpose: '성장 의미 부여',
    defaultSupport: '기존 관계 강점을 활용하되 신규 접점은 작은 범위로 함께 설계합니다.',
    defaultRiskMemo: '갑자기 큰 신규 과제를 맡기면 회피가 커질 수 있으므로 범위를 작게 시작합니다.',
  },
  {
    id: 'shin-jaeyoung',
    label: '신재영 대리',
    role: '실행 빠른 추진형',
    currentSignal: '후속 연결은 빠르지만 표현 안전선과 고객 부담 신호를 놓칠 수 있습니다.',
    strength: '속도, 실행력, 다음 접점 확보',
    risk: '과도한 설득, 표현 리스크, 고객 피로감',
    leaderQuestion: '속도를 살리면서 안전선을 어떻게 맞출 것인가?',
    defaultDecision: '맡긴다',
    defaultCoachingPurpose: '안전선 확인',
    defaultSupport: '방문 전 사용할 수 있는 표현과 피해야 할 표현을 짧게 점검합니다.',
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
    defaultDecision: '관찰하게 한다',
    defaultCoachingPurpose: '역할 설명',
    defaultSupport: '고객 질문 1개, 다음 확인 질문 1개, 후속조치 1개를 남기는 작은 과제로 시작합니다.',
    defaultRiskMemo: '성과를 빨리 요구하기보다 기록 품질과 질문 습관을 먼저 봅니다.',
  },
  {
    id: 'moon-gyowon',
    label: '문교원 사원',
    role: '저연차 탐색형',
    currentSignal: '디지털 활용은 빠르지만 고객 대화 경험이 부족해 동행·관찰 과제가 필요합니다.',
    strength: '자료 정리, 디지털 도구 활용, 빠른 학습',
    risk: '고객 앞에서 표현 안전선과 질문 순서를 놓칠 수 있음',
    leaderQuestion: '직접 맡길 것인가, 동행 관찰부터 시작할 것인가?',
    defaultDecision: '관찰하게 한다',
    defaultCoachingPurpose: '성장 의미 부여',
    defaultSupport: '선배 동행 후 고객 반응과 질문 흐름을 정리하게 하고, 다음 소규모 과제를 합의합니다.',
    defaultRiskMemo: '혼자 고객 대응을 맡기기보다 동행·관찰·소규모 실행으로 단계화합니다.',
  },
];

const ALLOCATION_OPTIONS = ['맡긴다', '함께 맡긴다', '관찰하게 한다', '기존 업무를 덜어준다', '1on1 후 결정한다', '팀장이 직접 확인한다'];
const COACHING_PURPOSE_OPTIONS = ['역할 설명', '부담 확인', '성장 의미 부여', '실행 기준 합의', '안전선 확인', '피드백', '동기 회복', '업무 조정'];

function createEmptyDecision(profile: TeamMemberProfile): V39TeamSevenMemberDecision {
  return {
    memberId: profile.id,
    memberLabel: profile.label,
    allocationDecision: '',
    coachingPurpose: '',
    priorityOneOnOne: false,
    leaderSupport: '',
    riskMemo: '',
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
    for (const profile of TEAM_MEMBER_PROFILES) decisions[profile.id] = normalizeDecision(rawDecisions[profile.id], profile);
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

export function V39TeamSevenCoachingMap() {
  const [decisions, setDecisions] = useState<Record<string, V39TeamSevenMemberDecision>>(() => {
    const loaded = loadV39TeamSevenCoachingMapResult();
    const next: Record<string, V39TeamSevenMemberDecision> = {};
    for (const profile of TEAM_MEMBER_PROFILES) next[profile.id] = loaded.decisions[profile.id] ?? createEmptyDecision(profile);
    return next;
  });

  const priorityCount = useMemo(() => Object.values(decisions).filter((item) => item.priorityOneOnOne).length, [decisions]);
  const completedCount = useMemo(() => Object.values(decisions).filter((item) => item.allocationDecision || item.coachingPurpose || item.leaderSupport || item.riskMemo).length, [decisions]);

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
          memberLabel: profile.label,
          ...patch,
        },
      };
      saveResult(next);
      return next;
    });
  };

  const applyDraft = (profile: TeamMemberProfile) => {
    updateDecision(profile, {
      allocationDecision: decisions[profile.id]?.allocationDecision || profile.defaultDecision,
      coachingPurpose: decisions[profile.id]?.coachingPurpose || profile.defaultCoachingPurpose,
      leaderSupport: decisions[profile.id]?.leaderSupport || profile.defaultSupport,
      riskMemo: decisions[profile.id]?.riskMemo || profile.defaultRiskMemo,
    });
  };

  const priorityMembers = TEAM_MEMBER_PROFILES.filter((profile) => decisions[profile.id]?.priorityOneOnOne).map((profile) => profile.label);

  return (
    <section className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Team Seven Execution & Coaching Map</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">팀원 7명 실행·코칭 Map</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-700">
            7단계의 고객군별 대응 방향을 바로 배정표로 확정하지 않고, 팀원 7명의 강점·부담·성장 과제·안전선을 함께 보며 업무배분과 1on1 코칭 우선순위를 정리합니다.
            전체 7명은 모두 훑고, 우선 1on1 대상은 최대 2명만 선택합니다.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:w-72">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-black text-slate-500">판단 메모</p>
            <p className="mt-1 text-sm font-black text-indigo-950">{completedCount} / 7명</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
            <p className="text-xs font-black text-slate-500">우선 1on1</p>
            <p className="mt-1 text-sm font-black text-indigo-950">{priorityCount} / 2명</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-indigo-200 bg-white p-4 text-xs font-bold leading-5 text-indigo-950">
        <p className="font-black">부담 편중 점검</p>
        <p className="mt-1">잘하는 사람에게 계속 맡기고 있지는 않은지, 저연차에게 너무 큰 일을 맡기고 있지는 않은지, 빠른 실행형 팀원에게 표현 리스크가 높은 일을 맡기고 있지는 않은지 확인합니다.</p>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        {TEAM_MEMBER_PROFILES.map((profile) => {
          const current = decisions[profile.id] ?? createEmptyDecision(profile);
          const oneOnOneDisabled = !current.priorityOneOnOne && priorityCount >= 2;
          return (
            <article key={profile.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-base font-black text-slate-950">{profile.label}</p>
                  <p className="mt-1 text-xs font-black text-indigo-700">{profile.role}</p>
                </div>
                <button type="button" className="rounded-2xl border bg-indigo-50 px-3 py-2 text-xs font-black text-indigo-800" onClick={() => applyDraft(profile)}>
                  판단 초안 가져오기
                </button>
              </div>

              <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-slate-700 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3"><span className="font-black text-slate-950">현재 신호</span><br />{profile.currentSignal}</div>
                <div className="rounded-2xl bg-emerald-50 p-3"><span className="font-black text-emerald-900">강점</span><br />{profile.strength}</div>
                <div className="rounded-2xl bg-amber-50 p-3"><span className="font-black text-amber-900">리스크</span><br />{profile.risk}</div>
                <div className="rounded-2xl bg-sky-50 p-3"><span className="font-black text-sky-900">팀장 질문</span><br />{profile.leaderQuestion}</div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">업무배분 판단</span>
                  <select className="min-h-11 w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={current.allocationDecision} onChange={(event) => updateDecision(profile, { allocationDecision: event.target.value })}>
                    <option value="">선택하세요</option>
                    {ALLOCATION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">1on1 코칭 목적</span>
                  <select className="min-h-11 w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={current.coachingPurpose} onChange={(event) => updateDecision(profile, { coachingPurpose: event.target.value })}>
                    <option value="">선택하세요</option>
                    {COACHING_PURPOSE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label className="flex items-center gap-2 rounded-2xl border bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 md:col-span-2">
                  <input type="checkbox" checked={current.priorityOneOnOne} disabled={oneOnOneDisabled} onChange={(event) => updateDecision(profile, { priorityOneOnOne: event.target.checked })} />
                  우선 1on1 대상 2명 안에 포함
                  {oneOnOneDisabled ? <span className="font-bold text-amber-700">이미 2명을 선택했습니다</span> : null}
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">팀장이 지원할 것</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.leaderSupport} onChange={(event) => updateDecision(profile, { leaderSupport: event.target.value })} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">주의할 업무배분 리스크</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={current.riskMemo} onChange={(event) => updateDecision(profile, { riskMemo: event.target.value })} />
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
