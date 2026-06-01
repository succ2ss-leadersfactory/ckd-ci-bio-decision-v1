import { useMemo, useState } from 'react';

const MEMBERS = [
  {
    id: 'M1',
    name: '김민재 프로',
    profile: '실행 속도는 빠르지만 고객 반응을 깊게 읽기보다 콜 횟수 중심으로 접근하는 경향이 있습니다.',
    suggestedRole: '반응 상승 고객군의 후속 대화 품질을 높이는 역할',
  },
  {
    id: 'M2',
    name: '이서연 프로',
    profile: '고객 관계는 안정적이지만 보류 사유를 파고드는 질문이 약해 니즈 재확인이 필요합니다.',
    suggestedRole: '관심 보류 고객군의 니즈 재확인과 질문 설계 역할',
  },
  {
    id: 'M3',
    name: '정하늘 프로',
    profile: '기록은 꼼꼼하지만 실행 자신감이 낮아 데이터 보완과 CRM 정리에 강점을 발휘할 수 있습니다.',
    suggestedRole: '데이터 보완 고객군의 정보 정리와 후속조치 기준화 역할',
  },
  {
    id: 'M4',
    name: '최도윤 프로',
    profile: '성과 욕구가 높아 집중 고객군을 맡길 수 있지만 표현 강도와 컴플라이언스 안전선 점검이 필요합니다.',
    suggestedRole: '기회 신호가 큰 고객군의 실행 리드와 안전 표현 점검 역할',
  },
];

const CUSTOMER_OPTIONS = [
  '고객군 후보 1 · 반응 상승/후속 가능',
  '고객군 후보 2 · 관심 보류/니즈 재확인',
  '고객군 후보 3 · 관계 안정/유지 품질',
  '고객군 후보 4 · 접촉 피로/리스크 관리',
  '고객군 후보 5 · 기회 신호 큼/표현 안전선',
  '고객군 후보 6 · 데이터 부족/정보 보완',
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
              고객군 판단을 실행으로 옮기려면 고객군을 누구에게 맡길지, 어떤 역할을 줄지, 팀장이 무엇을 코칭할지 정해야 합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-800">
            역할 지정 {completedCount} / {MEMBERS.length}
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {MEMBERS.map((member) => {
          const current = roles[member.id] ?? { customerGroup: '', role: '', coaching: '', compliance: '' };
          return (
            <article key={member.id} className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-lg font-black text-slate-950">{member.name}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{member.profile}</p>
                <p className="mt-2 rounded-xl bg-white px-3 py-2 text-xs font-bold leading-5 text-cyan-800">추천 역할: {member.suggestedRole}</p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">담당 고객군</span>
                  <select className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold" value={current.customerGroup} onChange={(event) => updateRole(member.id, 'customerGroup', event.target.value)}>
                    <option value="">선택하세요</option>
                    {CUSTOMER_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
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
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {MEMBERS.map((member) => {
            const current = roles[member.id] ?? { customerGroup: '', role: '', coaching: '', compliance: '' };
            return (
              <article key={member.id} className="rounded-2xl border bg-slate-50 p-4">
                <p className="font-black text-slate-950">{member.name}</p>
                <p className="mt-2 text-xs font-bold leading-5 text-slate-600">담당 고객군: {current.customerGroup || '아직 선택되지 않았습니다'}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">역할: {current.role || '아직 선택되지 않았습니다'}</p>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">코칭: {current.coaching || '아직 선택되지 않았습니다'}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
