import { useMemo, useState } from 'react';

const DEFAULT_CARD_ITEMS = [
  {
    id: 'focus',
    label: '집중 고객군',
    placeholder: '예: 고객군 후보 5 · 기회 신호는 크지만 컴플라이언스 안전선 확인 필요',
  },
  {
    id: 'deprioritized',
    label: '후순위 고객군',
    placeholder: '예: 고객군 후보 4 · 접촉 피로와 무반응 증가로 접근 강도 조절 필요',
  },
  {
    id: 'watch',
    label: '관찰/유지 고객군',
    placeholder: '예: 고객군 후보 3 · 관계 안정, 변화 신호 낮음, 유지 품질 관리',
  },
  {
    id: 'memberRoles',
    label: '팀원별 역할',
    placeholder: '예: 김민재 프로는 후속 대화 연결, 이서연 프로는 니즈 재확인 질문 설계',
  },
  {
    id: 'twoWeekAction',
    label: '2주 실행 우선순위',
    placeholder: '예: 1주차는 정보 보완과 질문 준비, 2주차는 후속 미팅과 반응 기록 점검',
  },
  {
    id: 'compliance',
    label: '컴플라이언스 주의점',
    placeholder: '예: 처방 유도, 비교 우위 단정, 허가 외 표현, 실제 고객명·병원명 입력 금지',
  },
  {
    id: 'firstMessage',
    label: '팀원에게 말할 첫 실행 문장',
    placeholder: '예: 이번 2주는 많이 방문하는 것보다 고객군별 반응 신호를 읽고 다음 행동을 정확히 정하는 데 집중합시다.',
  },
];

type CardState = Record<string, string>;

export function V38FinalCallPlanCard() {
  const [card, setCard] = useState<CardState>(() => Object.fromEntries(DEFAULT_CARD_ITEMS.map((item) => [item.id, ''])));
  const [copied, setCopied] = useState(false);

  const completedCount = useMemo(
    () => DEFAULT_CARD_ITEMS.filter((item) => card[item.id]?.trim()).length,
    [card],
  );

  const cardText = useMemo(() => {
    return [
      '[C1바이오 영업팀장 2주 콜플랜 카드]',
      '',
      ...DEFAULT_CARD_ITEMS.flatMap((item) => [`[${item.label}]`, card[item.id]?.trim() || '아직 작성되지 않았습니다.', '']),
    ].join('\n');
  }, [card]);

  const update = (id: string, value: string) => {
    setCard((current) => ({ ...current, [id]: value }));
  };

  const applyTemplate = () => {
    setCard({
      focus: '고객군 후보 5 · 기회 신호는 크지만 컴플라이언스 안전선 확인이 먼저 필요한 고객군',
      deprioritized: '고객군 후보 4 · 접촉 피로와 무반응 증가가 있어 접근 강도를 낮추고 고객 부담을 줄일 고객군',
      watch: '고객군 후보 3 · 관계는 안정적이나 변화 신호가 낮아 유지 품질을 관리할 고객군',
      memberRoles: '김민재 프로는 후속 대화 연결, 이서연 프로는 니즈 재확인 질문 설계, 정하늘 프로는 CRM·정보 보완, 최도윤 프로는 표현 안전선 점검 역할을 맡는다.',
      twoWeekAction: '1주차에는 고객군별 질문과 자료 범위를 정리하고, 2주차에는 후속 미팅 가능성과 고객 반응을 기록한다.',
      compliance: '실제 고객명·병원명·의료진명·처방 정보는 사용하지 않는다. 처방 유도, 비교 우위 단정, 허가 외 표현은 제거한다.',
      firstMessage: '이번 2주는 많이 방문하는 것보다 고객군별 반응 신호를 읽고 다음 행동을 정확히 정하는 데 집중합시다.',
    });
  };

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(cardText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Final Output</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">최종 산출물: 2주 콜플랜 카드</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              앞 단계의 판단을 한 장의 실행 카드로 정리합니다. 이 카드는 교육 후 팀원 미팅, 1on1, 실행 점검 대화에 바로 활용할 수 있습니다.
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-800">
            작성 완료 {completedCount} / {DEFAULT_CARD_ITEMS.length}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">콜플랜 카드 작성</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">빈 항목은 최종 카드에서 “아직 작성되지 않았습니다”로 표시됩니다.</p>
          </div>
          <button type="button" className="rounded-2xl border px-4 py-3 text-sm font-black text-slate-700" onClick={applyTemplate}>
            예시 템플릿 채우기
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {DEFAULT_CARD_ITEMS.map((item) => (
            <label key={item.id} className="space-y-1">
              <span className="text-xs font-black text-slate-500">{item.label}</span>
              <textarea
                className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6"
                value={card[item.id] ?? ''}
                onChange={(event) => update(item.id, event.target.value)}
                placeholder={item.placeholder}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">내가 가져갈 2주 콜플랜 카드</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">프롬프트가 아니라 현업 실행 카드 형태로 정리됩니다.</p>
          </div>
          <button type="button" className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white" onClick={copyCard}>
            {copied ? '복사 완료' : '카드 내용 복사'}
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {DEFAULT_CARD_ITEMS.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black text-cyan-700">{item.label}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">
                {card[item.id]?.trim() || '아직 작성되지 않았습니다.'}
              </p>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-sm md:p-6">
        <h3 className="text-lg font-black">마무리 점검 질문</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-bold leading-6">
          <li>집중 고객군을 고른 이유가 데이터 신호로 설명되는가?</li>
          <li>팀원별 역할이 개인의 실행 강점과 코칭 필요점에 맞는가?</li>
          <li>처방 유도, 비교 우위 단정, 허가 외 표현이 제거되었는가?</li>
          <li>2주 후 무엇을 보고 실행 성과를 점검할지 정해졌는가?</li>
        </ul>
      </div>
    </section>
  );
}
