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
    id: 'M01',
    name: '신재영 대리',
    profile: '접점 활동은 적극적이지만 방문 이후 고객 반응과 후속 대화 연결을 깊게 읽는 데 보완이 필요합니다.',
    strength: '넓은 활동량과 빠른 접점 실행력',
    risk: '콜 횟수 중심으로 흐르면 고객 반응과 후속 행동 품질을 놓칠 수 있음',
    suggestedRole: '반응 상승 고객군의 후속 대화 품질을 높이는 역할',
    coachingFocus: '콜 횟수보다 반응 신호와 후속 행동 품질을 먼저 보게 한다.',
  },
  {
    id: 'M02',
    name: '이대은 대리',
    profile: '담당처 관계와 후속 대화는 안정적이지만, 자신의 방식 공유와 팀 학습 확산에는 소극적인 편입니다.',
    strength: '안정적인 고객 관계와 후속 대화 연결력',
    risk: '개인 담당처 중심으로 머물면 팀 전체 실행 인사이트 확산이 약해질 수 있음',
    suggestedRole: '관계 유지 고객군의 대화 품질을 팀 실행 기준으로 전환하는 역할',
    coachingFocus: '개인 성공 방식을 팀이 재사용할 수 있는 언어와 기록으로 나누게 한다.',
  },
  {
    id: 'M03',
    name: '박재욱 사원',
    profile: 'CRM 기록은 꼼꼼하지만 고객 앞에서 질문이 짧아지고 대화 참여를 끌어내는 데 어려움을 느낍니다.',
    strength: 'CRM 기록 정리와 근거 기반 판단',
    risk: '준비와 기록에 머물면 실제 고객 참여와 후속 대화 연결이 약해질 수 있음',
    suggestedRole: '데이터 보완 고객군의 정보 정리와 질문 설계 역할',
    coachingFocus: '기록을 고객 질문 2~3개와 다음 행동 기준으로 전환하게 한다.',
  },
  {
    id: 'M04',
    name: '유희관 과장',
    profile: '장기 담당처 관계는 안정적이지만 새로운 기록 기준이나 실행 방식에는 신중하고 보수적인 반응을 보입니다.',
    strength: '장기 고객 관계와 현장 맥락 이해',
    risk: '기존 방식에 익숙해 변화 신호나 새로운 실행 기준을 늦게 받아들일 수 있음',
    suggestedRole: '관계 안정 고객군의 유지 품질과 변화 신호 관찰 역할',
    coachingFocus: '기존 관계를 유지하되 새 기준으로 무엇을 기록하고 관찰할지 합의한다.',
  },
  {
    id: 'M05',
    name: '김문호 차장',
    profile: '최근 목표 압박을 크게 느끼며 지역 상황과 외부 요인을 자주 언급하고, 자신이 바꿀 수 있는 실행 변수에는 말을 아낍니다.',
    strength: '지역 상황 이해와 현실적 제약 파악',
    risk: '외부 요인 설명에 머물면 실행 적시성과 후속조치가 약해질 수 있음',
    suggestedRole: '후순위·리스크 고객군의 접근 강도 조절과 실행 변수 재정리 역할',
    coachingFocus: '통제 가능한 2주 행동과 점검 지표를 작게 정하게 한다.',
  },
  {
    id: 'M06',
    name: '김재호 차장',
    profile: '현장 요청에는 빠르게 대응하지만 사후 기록과 후속 실행 정리가 뒤로 밀리는 경향이 있습니다.',
    strength: '현장 요청 대응 속도와 고객 반응 민감도',
    risk: '기록과 후속조치가 늦어지면 팀장 판단과 다음 실행 연결이 약해질 수 있음',
    suggestedRole: '기회 신호 고객군의 현장 대응 후 CRM·후속조치 정리 역할',
    coachingFocus: '현장 대응 직후 10분 안에 남길 기록과 다음 행동을 정하게 한다.',
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
