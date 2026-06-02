import { useMemo, useState } from 'react';

const ROLE_GUIDES = [
  {
    title: '집중 고객군 배정 기준',
    guide: '후속 행동이 빠르게 필요한 고객군은 실행 속도와 대화 품질을 함께 관리할 수 있는 팀원에게 맡깁니다.',
    caution: '성과 욕구가 높은 팀원에게 맡길 때는 표현 강도와 컴플라이언스 안전선을 함께 코칭합니다.',
  },
  {
    title: '후순위 고객군 배정 기준',
    guide: '접촉 피로, 무반응, 정보 부족이 큰 고객군은 무리한 콜 확대보다 접근 강도 조절과 정보 보완 역할을 줍니다.',
    caution: '후순위는 방치가 아니라 접촉 방식과 타이밍을 재설계하는 판단입니다.',
  },
  {
    title: '관찰/유지 고객군 배정 기준',
    guide: '관계는 안정적이지만 변화 신호가 낮은 고객군은 관계 품질을 유지하고 반응 변화를 기록할 수 있는 팀원에게 맡깁니다.',
    caution: '관계가 좋다는 이유로 관성적으로 방문하지 않도록 다음 확인 기준을 정합니다.',
  },
];

const MEMBERS = [
  {
    id: 'M1',
    name: '김민재 프로',
    profile: '실행 속도는 빠르지만 고객 반응을 깊게 읽기보다 콜 횟수 중심으로 접근하는 경향이 있습니다.',
    strength: '빠른 실행과 후속 접촉 추진력',
    risk: '콜 횟수 중심으로 흐르면 고객 피로를 놓칠 수 있음',
    suggestedRole: '반응 상승 고객군의 후속 대화 품질을 높이는 역할',
    coachingFocus: '콜 횟수보다 반응 신호와 후속 행동 품질을 먼저 보게 한다.',
  },
  {
    id: 'M2',
    name: '이서연 프로',
    profile: '고객 관계는 안정적이지만 보류 사유를 파고드는 질문이 약해 니즈 재확인이 필요합니다.',
    strength: '관계 유지와 안정적 커뮤니케이션',
    risk: '보류 사유를 깊게 묻지 않으면 관심 신호가 유지 관리로만 끝날 수 있음',
    suggestedRole: '관심 보류 고객군의 니즈 재확인과 질문 설계 역할',
    coachingFocus: '보류 이유를 압박 없이 확인하는 질문 문장을 준비하게 한다.',
  },
  {
    id: 'M3',
    name: '정하늘 프로',
    profile: '기록은 꼼꼼하지만 실행 자신감이 낮아 데이터 보완과 CRM 정리에 강점을 발휘할 수 있습니다.',
    strength: 'CRM 기록 정리와 근거 기반 판단',
    risk: '실행 전 정리에 오래 머물면 후속 행동 타이밍을 놓칠 수 있음',
    suggestedRole: '데이터 보완 고객군의 정보 정리와 후속조치 기준화 역할',
    coachingFocus: '정보 보완 후 언제 다음 행동으로 전환할지 기준을 정하게 한다.',
  },
  {
    id: 'M4',
    name: '최도윤 프로',
    profile: '성과 욕구가 높아 집중 고객군을 맡길 수 있지만 표현 강도와 컴플라이언스 안전선 점검이 필요합니다.',
    strength: '기회 신호가 큰 고객군을 밀도 있게 추진하는 힘',
    risk: '강한 메시지가 비교 우위 단정이나 처방 유도처럼 들릴 수 있음',
    suggestedRole: '기회 신호가 큰 고객군의 실행 리드와 안전 표현 점검 역할',
    coachingFocus: '성과 메시지를 질문 중심·근거 중심 표현으로 바꾸게 한다.',
  },
];

const CUSTOMER_OPTIONS = [
  {
    value: '고객군 후보 1 · 반응 상승/후속 가능',
    signal: '긍정 신호 다수 + 표현 주의',
    priorityFit: '집중 고객군 후보',
    assignmentHint: '후속 대화 품질을 높일 수 있는 팀원에게 배정합니다.',
  },
  {
    value: '고객군 후보 2 · 관심 보류/니즈 재확인',
    signal: '긍정 신호 + 판단 유보/주의 신호',
    priorityFit: '관심 보류 관리 후보',
    assignmentHint: '압박보다 니즈와 보류 이유를 질문으로 풀 수 있는 팀원에게 배정합니다.',
  },
  {
    value: '고객군 후보 3 · 관계 안정/유지 품질',
    signal: '관계 긍정 신호 + 변화 신호 낮음',
    priorityFit: '관찰/유지 고객군 후보',
    assignmentHint: '관계 품질을 유지하고 반응 변화를 기록할 팀원에게 배정합니다.',
  },
  {
    value: '고객군 후보 4 · 접촉 피로/리스크 관리',
    signal: '주의 신호 다수 + 보완 필요',
    priorityFit: '후순위/리스크 관리 후보',
    assignmentHint: '접근 강도를 낮추고 메시지와 기록을 정비할 팀원에게 배정합니다.',
  },
  {
    value: '고객군 후보 5 · 기회 신호 큼/표현 안전선',
    signal: '강한 긍정 신호 + 높은 컴플라이언스 주의',
    priorityFit: '집중 가능하나 안전선 관리 필요',
    assignmentHint: '실행 추진력과 컴플라이언스 표현 점검을 동시에 관리할 팀원에게 배정합니다.',
  },
  {
    value: '고객군 후보 6 · 데이터 부족/정보 보완',
    signal: '보완 필요 + 판단 유보',
    priorityFit: '데이터 보완 후보',
    assignmentHint: 'CRM 기록과 최신 반응 정보를 정리할 팀원에게 배정합니다.',
  },
];

const ROLE_OPTIONS = [
  '후속 대화 연결',
  '니즈 재확인 질문 설계',
  '관계 유지 품질 관리',
  '접근 강도 조절',
  'CRM·정보 보완',
  '컴플라이언스 표현 점검',
];

const COACHING_OPTIONS = [
  '콜 횟수보다 반응 신호를 먼저 읽게 한다',
  '고객 부담을 낮추는 질문 문장을 준비하게 한다',
  '자료 전달 후 다음 행동 기준을 명확히 하게 한다',
  'CRM 기록과 실제 고객 반응의 차이를 점검하게 한다',
  '허용된 표현과 위험 표현을 구분하게 한다',
];

type RoleState = Record<string, {
  customerGroup: string;
  role: string;
  coaching: string;
  compliance: string;
}>;

type CustomerOption = typeof CUSTOMER_OPTIONS[number];

function findCustomerOption(value: string): CustomerOption | undefined {
  return CUSTOMER_OPTIONS.find((option) => option.value === value);
}

export function V38MemberRoleLab() {
  const [roles, setRoles] = useState<RoleState>({});

  const completedCount = useMemo(
    () => MEMBERS.filter((member) => roles[member.id]?.customerGroup && roles[member.id]?.role).length,
    [roles],
  );

  const updateRole = (memberId: string, field: keyof RoleState[string], value: string) => {
    setRoles((current) => ({
      ...current,
      [memberId]: {
        customerGroup: current[memberId]?.customerGroup ?? '',
        role: current[memberId]?.role ?? '',
        coaching: current[memberId]?.coaching ?? '',
        compliance: current[memberId]?.compliance ?? '',
        [field]: value,
      },
    }));
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Member Role Lab</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">팀원별 역할 방향 정하기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              7단계에서 정한 집중/후순위/관찰 판단을 팀원별 실행 역할로 전환합니다. 고객군을 누구에게 맡길지, 어떤 역할을 줄지, 팀장이 무엇을 코칭할지 정합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-800">
            역할 지정 {completedCount} / {MEMBERS.length}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">7단계 판단을 팀원 역할로 바꾸는 기준</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          고객군 우선순위는 팀원 배정으로 이어질 때 실행력이 생깁니다. 아래 기준을 보고 고객군 특성과 팀원 강점을 맞춰 배정합니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {ROLE_GUIDES.map((guide) => (
            <article key={guide.title} className="rounded-2xl border bg-white p-4">
              <p className="font-black text-slate-950">{guide.title}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-700">{guide.guide}</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600">주의: {guide.caution}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MEMBERS.map((member) => {
          const current = roles[member.id] ?? { customerGroup: '', role: '', coaching: '', compliance: '' };
          const selectedCustomer = findCustomerOption(current.customerGroup);
          return (
            <article key={member.id} className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-lg font-black text-slate-950">{member.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{member.profile}</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  <p className="rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-emerald-800">강점: {member.strength}</p>
                  <p className="rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-amber-800">주의: {member.risk}</p>
                </div>
                <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-800">추천 역할: {member.suggestedRole}</p>
                <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700">코칭 초점: {member.coachingFocus}</p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">담당 고객군</span>
                  <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={current.customerGroup} onChange={(event) => updateRole(member.id, 'customerGroup', event.target.value)}>
                    <option value="">선택하세요</option>
                    {CUSTOMER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.value}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">실행 역할</span>
                  <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={current.role} onChange={(event) => updateRole(member.id, 'role', event.target.value)}>
                    <option value="">선택하세요</option>
                    {ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              </div>

              {selectedCustomer ? (
                <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                  <p className="text-xs font-black text-cyan-800">선택한 고객군 배정 힌트</p>
                  <p className="mt-2 text-sm font-black text-slate-950">{selectedCustomer.value}</p>
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-black leading-5 text-slate-700">평가 라벨 조합: {selectedCustomer.signal}</p>
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-800">우선순위 성격: {selectedCustomer.priorityFit}</p>
                  <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700">배정 방향: {selectedCustomer.assignmentHint}</p>
                </div>
              ) : (
                <div className="mt-3 rounded-2xl border bg-slate-50 p-4 text-xs font-bold leading-5 text-slate-500">
                  담당 고객군을 선택하면 7단계 우선순위 판단과 연결된 배정 힌트가 표시됩니다.
                </div>
              )}

              <label className="mt-3 block space-y-1">
                <span className="text-xs font-black text-slate-500">팀장 코칭 포인트</span>
                <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={current.coaching} onChange={(event) => updateRole(member.id, 'coaching', event.target.value)}>
                  <option value="">선택하세요</option>
                  {COACHING_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>

              <label className="mt-3 block space-y-1">
                <span className="text-xs font-black text-slate-500">컴플라이언스 주의 안내</span>
                <textarea
                  className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6"
                  value={current.compliance}
                  onChange={(event) => updateRole(member.id, 'compliance', event.target.value)}
                  placeholder="예: 비교 우위 단정 표현은 피하고, 허용된 근거자료 범위 안에서 질문 중심으로 대화한다."
                />
              </label>
            </article>
          );
        })}
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">팀원별 역할 배분 요약</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
          이 요약은 9단계 AI 콜플랜 결과물 요청에서 팀원별 실행 역할을 설명하는 기준으로 활용합니다.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {MEMBERS.map((member) => {
            const current = roles[member.id] ?? { customerGroup: '', role: '', coaching: '', compliance: '' };
            return (
              <article key={member.id} className="rounded-2xl border bg-slate-50 p-4">
                <p className="font-black text-slate-950">{member.name}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-600">담당 고객군: {current.customerGroup || '아직 선택되지 않았습니다'}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">역할: {current.role || '아직 선택되지 않았습니다'}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">코칭: {current.coaching || '아직 선택되지 않았습니다'}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">컴플라이언스: {current.compliance || '아직 작성되지 않았습니다'}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
