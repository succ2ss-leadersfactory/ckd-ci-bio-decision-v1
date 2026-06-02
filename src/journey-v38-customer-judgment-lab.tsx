import { useMemo, useState } from 'react';

const SEGMENT_TYPES = [
  '반응 상승 집중군',
  '관심 보류 관리군',
  '관계 유지군',
  '리스크 관리군',
  '데이터 보완군',
];

const CUSTOMER_GROUPS = [
  {
    id: 'G1',
    label: '고객군 후보 1',
    signals: ['반응 상승', '자료 요청', '후속 가능', '표현 주의'],
    summary: {
      opportunity: '고객 등급 A · 잠재력 높음 · 근거자료 요청 있음',
      response: '최근 콜 반응 긍정 상승 · 후속 미팅 동의',
      feasibility: '후속조치 완료율 90% · CRM 기록 충실',
      risk: '컴플라이언스 중간 · 표현 안전선 확인 필요',
    },
    fullData: [
      '고객 등급 A', '잠재력 높음', '관계 수준 중간', '최근 방문일 7일 전', '4주 콜 횟수 2회', '접촉 성공률 80%',
      '최근 콜 반응 긍정 상승', '자료 요청 있음', '후속 미팅 동의', '거절/보류 사유 없음', '후속조치 완료율 90%', 'CRM 기록 충실', '컴플라이언스 중간',
    ],
    helper: {
      q1: '반응 상승과 후속 미팅 동의',
      q2: '허용된 정보 범위 안에서 후속 대화로 연결한다',
      q3: '컴플라이언스 표현 안전선을 확인한다',
      primary: '반응 상승 집중군',
      secondary: '관심 보류 관리군',
      reason: '자료 요청과 후속 미팅 동의가 있어 2주 안에 다음 대화로 이어질 가능성이 높다. 다만 표현 안전선은 실행 전 확인해야 한다.',
    },
  },
  {
    id: 'G2',
    label: '고객군 후보 2',
    signals: ['관심 보류', '니즈 재확인', '자료 활용', '속도 조절'],
    summary: {
      opportunity: '고객 등급 A · 잠재력 높음 · 자료 요청 있음',
      response: '관심 있으나 보류 · 후속 미팅 보류',
      feasibility: '접촉 성공률 60% · 후속조치 완료율 60%',
      risk: '컴플라이언스 낮음 · 기존 치료 유지 선호',
    },
    fullData: [
      '고객 등급 A', '잠재력 높음', '관계 수준 높음', '최근 방문일 20일 전', '4주 콜 횟수 1회', '접촉 성공률 60%',
      '최근 콜 반응 관심 있으나 보류', '자료 요청 있음', '후속 미팅 보류', '거절/보류 사유 기존 치료 유지 선호', '후속조치 완료율 60%', 'CRM 기록 보통', '컴플라이언스 낮음',
    ],
    helper: {
      q1: '관심은 있으나 후속 미팅이 보류됨',
      q2: '압박보다 니즈를 다시 확인한다',
      q3: '기존 치료 유지 선호를 가볍게 보지 않는다',
      primary: '관심 보류 관리군',
      secondary: '반응 상승 집중군',
      reason: '기회성은 높지만 후속 미팅이 보류되어 있어, 바로 집중하기보다 니즈 재확인이 먼저 필요하다.',
    },
  },
  {
    id: 'G3',
    label: '고객군 후보 3',
    signals: ['관계 안정', '변화 신호 낮음', '유지 품질', '과잉 접촉 주의'],
    summary: {
      opportunity: '고객 등급 B · 잠재력 중간 · 자료 요청 없음',
      response: '관계 수준 높음 · 안정적 유지',
      feasibility: '접촉 성공률 90% · CRM 기록 충실',
      risk: '컴플라이언스 낮음 · 추가 필요성 낮음',
    },
    fullData: [
      '고객 등급 B', '잠재력 중간', '관계 수준 높음', '최근 방문일 10일 전', '4주 콜 횟수 2회', '접촉 성공률 90%',
      '최근 콜 반응 안정적 유지', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 추가 필요성 낮음', '후속조치 완료율 80%', 'CRM 기록 충실', '컴플라이언스 낮음',
    ],
    helper: {
      q1: '관계는 안정적이나 변화 신호가 낮음',
      q2: '관계 품질을 유지하고 과잉 접촉을 피한다',
      q3: '변화 신호가 낮은 고객군을 무리하게 끌어올리려 하지 않는다',
      primary: '관계 유지군',
      secondary: '데이터 보완군',
      reason: '관계와 접촉 성공률은 안정적이지만 자료 요청이나 후속 미팅 같은 변화 신호가 낮아 유지 품질 관리가 적합하다.',
    },
  },
  {
    id: 'G4',
    label: '고객군 후보 4',
    signals: ['접촉 피로', '무반응 증가', '실행 품질 저하', '리스크 관리'],
    summary: {
      opportunity: '고객 등급 B · 잠재력 중간 · 자료 요청 없음',
      response: '무반응 증가 · 접촉 성공률 40%',
      feasibility: '4주 콜 4회이나 후속조치 완료율 30%',
      risk: '컴플라이언스 높음 · 시간 부족/피로감 표현',
    },
    fullData: [
      '고객 등급 B', '잠재력 중간', '관계 수준 낮음', '최근 방문일 5일 전', '4주 콜 횟수 4회', '접촉 성공률 40%',
      '최근 콜 반응 무반응 증가', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 시간 부족·피로감 표현', '후속조치 완료율 30%', 'CRM 기록 부족', '컴플라이언스 높음',
    ],
    helper: {
      q1: '접촉 피로와 무반응 증가',
      q2: '접근 강도와 표현을 줄인다',
      q3: '컴플라이언스 민감도와 고객 부담을 먼저 관리한다',
      primary: '리스크 관리군',
      secondary: '데이터 보완군',
      reason: '접촉은 많지만 반응이 낮고 컴플라이언스 민감도가 높아, 더 밀기보다 접근 강도와 표현을 조절해야 한다.',
    },
  },
  {
    id: 'G5',
    label: '고객군 후보 5',
    signals: ['기회 신호 큼', '질문 증가', '후속 가능', '표현 안전선 중요'],
    summary: {
      opportunity: '고객 등급 A · 잠재력 높음 · 자료 요청 있음',
      response: '질문 증가 · 후속 미팅 동의',
      feasibility: '후속조치 완료율 70% · CRM 기록 보통',
      risk: '컴플라이언스 높음 · 근거자료 확인 필요',
    },
    fullData: [
      '고객 등급 A', '잠재력 높음', '관계 수준 낮음', '최근 방문일 14일 전', '4주 콜 횟수 1회', '접촉 성공률 70%',
      '최근 콜 반응 질문 증가', '자료 요청 있음', '후속 미팅 동의', '거절/보류 사유 근거자료 확인 필요', '후속조치 완료율 70%', 'CRM 기록 보통', '컴플라이언스 높음',
    ],
    helper: {
      q1: '질문 증가와 후속 미팅 동의',
      q2: '근거자료를 안전하게 준비해 후속 대화로 연결한다',
      q3: '컴플라이언스 높은 고객군이므로 표현과 자료 활용을 먼저 점검한다',
      primary: '반응 상승 집중군',
      secondary: '리스크 관리군',
      reason: '기회 신호와 후속 가능성은 높지만 컴플라이언스 민감도가 높아, 집중하되 표현 안전선을 강하게 관리해야 한다.',
    },
  },
  {
    id: 'G6',
    label: '고객군 후보 6',
    signals: ['데이터 부족', '정보 보완', '판단 유보', '기록 정리'],
    summary: {
      opportunity: '고객 등급 C · 잠재력 낮음 · 자료 요청 없음',
      response: '최근 콜 반응 데이터 부족 · 4주 콜 0회',
      feasibility: '후속조치 완료율 20% · CRM 기록 부족',
      risk: '컴플라이언스 중간 · 정보 없음',
    },
    fullData: [
      '고객 등급 C', '잠재력 낮음', '관계 수준 높음', '최근 방문일 35일 전', '4주 콜 횟수 0회', '접촉 성공률 50%',
      '최근 콜 반응 데이터 부족', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 정보 없음', '후속조치 완료율 20%', 'CRM 기록 부족', '컴플라이언스 중간',
    ],
    helper: {
      q1: '반응 데이터와 CRM 기록 부족',
      q2: '판단보다 정보 보완과 기록 정리를 먼저 한다',
      q3: '부족한 데이터로 고객군을 과도하게 단정하지 않는다',
      primary: '데이터 보완군',
      secondary: '관계 유지군',
      reason: '관계 수준은 높지만 최근 반응과 CRM 기록이 부족해, 당장 집중보다 정보 보완이 먼저 필요하다.',
    },
  },
];

type ClassificationState = Record<string, { segment: string; reason: string }>;
type SignalLabel = '긍정 신호' | '판단 유보' | '주의 신호' | '보완 필요';

function getDataSignal(item: string): { label: SignalLabel; note: string; className: string } {
  if (/A|잠재력 높음|긍정 상승|질문 증가|자료 요청 있음|후속 미팅 동의|접촉 성공률 80%|접촉 성공률 90%|후속조치 완료율 90%|CRM 기록 충실|관계 수준 높음/.test(item)) {
    return {
      label: '긍정 신호',
      note: '집중 또는 후속 행동을 검토할 근거입니다.',
      className: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    };
  }

  if (/컴플라이언스 높음|무반응 증가|시간 부족|피로감|후속 미팅 보류|기존 치료 유지|접촉 성공률 40%|4주 콜 횟수 4회|관계 수준 낮음|근거자료 확인 필요/.test(item)) {
    return {
      label: '주의 신호',
      note: '접근 강도, 표현, 고객 부담을 조절해야 합니다.',
      className: 'border-amber-200 bg-amber-50 text-amber-900',
    };
  }

  if (/데이터 부족|정보 없음|CRM 기록 부족|후속조치 완료율 20%|후속조치 완료율 30%|4주 콜 횟수 0회/.test(item)) {
    return {
      label: '보완 필요',
      note: '분류 전에 정보 보완이나 기록 정리가 필요합니다.',
      className: 'border-rose-200 bg-rose-50 text-rose-900',
    };
  }

  return {
    label: '판단 유보',
    note: '단독 판단보다 다른 신호와 함께 봐야 합니다.',
    className: 'border-slate-200 bg-slate-50 text-slate-700',
  };
}

export function V38CustomerJudgmentLab() {
  const [classifications, setClassifications] = useState<ClassificationState>({});
  const completedCount = useMemo(
    () => CUSTOMER_GROUPS.filter((group) => classifications[group.id]?.segment).length,
    [classifications],
  );

  const updateClassification = (groupId: string, field: 'segment' | 'reason', value: string) => {
    setClassifications((current) => ({
      ...current,
      [groupId]: {
        segment: current[groupId]?.segment ?? '',
        reason: current[groupId]?.reason ?? '',
        [field]: value,
      },
    }));
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Customer Judgment Lab</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">고객군 후보별 Data 읽기와 분류하기</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              고객군 후보 하나를 펼쳐서 Data 확인·분류 도우미·최종 분류·분류 이유 작성을 완료합니다. 모바일에서는 필요한 고객군만 열어 판단할 수 있습니다.
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-800">
            분류 완료 {completedCount} / {CUSTOMER_GROUPS.length}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">전체 고객군 한눈에 보기</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {CUSTOMER_GROUPS.map((group) => (
            <article key={group.id} className="rounded-2xl border bg-slate-50 p-4">
              <p className="font-black text-slate-900">{group.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{group.signals.join(' · ')}</p>
            </article>
          ))}
        </div>
      </div>

      {CUSTOMER_GROUPS.map((group, index) => {
        const selectedSegment = classifications[group.id]?.segment ?? '';
        const reason = classifications[group.id]?.reason ?? '';
        return (
          <details key={group.id} className="rounded-3xl border bg-white shadow-sm" open={index === 0}>
            <summary className="cursor-pointer list-none p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black text-cyan-700">Data 기반 분류</p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">{group.label}</h3>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{group.signals.join(' · ')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    {selectedSegment || '미분류'}
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">
                    펼쳐서 판단하기
                  </span>
                </div>
              </div>
            </summary>

            <div className="border-t px-5 pb-5 md:px-6 md:pb-6">
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <DataBox title="기회성" text={group.summary.opportunity} />
                <DataBox title="반응성" text={group.summary.response} />
                <DataBox title="실행 가능성" text={group.summary.feasibility} />
                <DataBox title="리스크" text={group.summary.risk} />
              </div>

              <details className="mt-4 rounded-2xl border bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-black text-slate-800">전체 13개 Data 다시 보기</summary>
                <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
                  아래 평가는 정답이 아니라 판단을 돕기 위한 해석 힌트입니다. 최종 분류는 고객군 전체 신호를 함께 보고 결정하세요.
                </p>
                <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                  {group.fullData.map((item) => (
                    <DataSignalCard key={item} item={item} />
                  ))}
                </div>
              </details>

              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-black text-emerald-900">분류 도우미</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <HelperBox title="Q1. 가장 강한 신호는?" text={group.helper.q1} />
                  <HelperBox title="Q2. 2주 행동 방향은?" text={group.helper.q2} />
                  <HelperBox title="Q3. 가장 큰 주의점은?" text={group.helper.q3} />
                </div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-black text-slate-500">가까운 후보</p>
                    <p className="mt-1 font-black text-emerald-800">{group.helper.primary}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-black text-slate-500">함께 검토할 후보</p>
                    <p className="mt-1 font-black text-emerald-800">{group.helper.secondary}</p>
                  </div>
                </div>
                <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-slate-700">
                  <span className="font-black text-slate-950">분류 이유 초안: </span>{group.helper.reason}
                </p>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">최종 고객군 분류</span>
                  <select
                    className="min-h-12 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-bold text-slate-900"
                    value={selectedSegment}
                    onChange={(event) => updateClassification(group.id, 'segment', event.target.value)}
                  >
                    <option value="">선택하세요</option>
                    {SEGMENT_TYPES.map((segment) => <option key={segment} value={segment}>{segment}</option>)}
                  </select>
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">내 분류 이유</span>
                  <textarea
                    className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900"
                    value={reason}
                    onChange={(event) => updateClassification(group.id, 'reason', event.target.value)}
                    placeholder="예: 후속 미팅 가능성은 높지만 표현 리스크가 있어 안전선 확인 후 집중해야 한다."
                  />
                </label>
              </div>
            </div>
          </details>
        );
      })}
    </section>
  );
}

function DataBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="text-xs font-black text-cyan-700">{title}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-800">{text}</p>
    </div>
  );
}

function DataSignalCard({ item }: { item: string }) {
  const signal = getDataSignal(item);
  return (
    <article className="rounded-2xl border bg-white p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-xs font-black text-slate-900">{item}</p>
        <span className={`rounded-full border px-2 py-1 text-[11px] font-black ${signal.className}`}>{signal.label}</span>
      </div>
      <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{signal.note}</p>
    </article>
  );
}

function HelperBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-black text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-bold leading-6 text-emerald-900">{text}</p>
    </div>
  );
}
