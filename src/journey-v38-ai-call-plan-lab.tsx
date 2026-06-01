import { useMemo, useState } from 'react';

const OUTPUT_OPTIONS = [
  {
    id: 'priority',
    label: '고객군별 2주 콜 우선순위',
    detail: '집중/후순위/관찰 고객군별로 2주 안에 어떤 순서로 접근할지 정리합니다.',
  },
  {
    id: 'memberRoles',
    label: '팀원별 실행 역할',
    detail: '팀원별 담당 고객군, 실행 역할, 코칭 포인트를 정리합니다.',
  },
  {
    id: 'questions',
    label: '방문 전 질문 리스트',
    detail: '고객 반응을 확인하기 위한 질문 문장을 고객군별로 제안합니다.',
  },
  {
    id: 'compliance',
    label: '컴플라이언스 안전 표현',
    detail: '제약영업에서 피해야 할 표현과 안전한 대체 표현을 정리합니다.',
  },
  {
    id: 'riskChecklist',
    label: '리스크 점검표',
    detail: '과잉 접촉, 표현 리스크, 정보 부족, CRM 기록 누락을 점검합니다.',
  },
  {
    id: 'meetingScript',
    label: '팀 회의 공유 스크립트',
    detail: '팀원들에게 2주 실행 방향을 설명할 회의 멘트를 만듭니다.',
  },
];

const CONTEXT_OPTIONS = [
  '고객군 후보 1은 반응 상승과 후속 가능성이 있다.',
  '고객군 후보 2는 관심은 있으나 후속 미팅이 보류되어 니즈 재확인이 필요하다.',
  '고객군 후보 4는 접촉 피로와 컴플라이언스 리스크가 높다.',
  '고객군 후보 5는 기회 신호가 크지만 표현 안전선 확인이 중요하다.',
  '팀원별 역할은 실행 강점과 코칭 필요점을 함께 고려해야 한다.',
];

const FORBIDDEN_ITEMS = [
  '실제 고객명·병원명·의료진명',
  '제품명 또는 미승인 제품 표현',
  '실제 매출·처방 수치·내부 전략 수치',
  '개인정보·민감정보',
  '처방 유도·비교 우위 단정 표현',
];

export function V38AiCallPlanLab() {
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>(['priority', 'memberRoles', 'compliance']);
  const [selectedContext, setSelectedContext] = useState<string[]>([CONTEXT_OPTIONS[0], CONTEXT_OPTIONS[2], CONTEXT_OPTIONS[4]]);
  const [extraInstruction, setExtraInstruction] = useState('현장 영업팀장이 팀원들과 바로 공유할 수 있도록 짧고 실행 중심으로 정리해 주세요.');
  const [copied, setCopied] = useState(false);

  const selectedOutputLabels = useMemo(
    () => OUTPUT_OPTIONS.filter((option) => selectedOutputs.includes(option.id)).map((option) => option.label),
    [selectedOutputs],
  );

  const promptText = useMemo(() => {
    return [
      '역할: 당신은 제약영업 팀장의 2주 콜플랜을 돕는 리더십 실행 코치입니다.',
      '',
      '상황: 저는 C1바이오 영업팀장입니다. 고객군 후보별 데이터를 보고 직접 분류했고, 2주 실행 우선순위와 팀원별 역할 방향을 정리하려고 합니다.',
      '',
      '반드시 지킬 안전선:',
      ...FORBIDDEN_ITEMS.map((item) => `- ${item}은 입력하거나 생성하지 마세요.`),
      '- 허가 범위를 벗어난 효능·비교·처방 유도 표현은 사용하지 마세요.',
      '- 모든 표현은 교육용 가상 상황 기준으로 작성하세요.',
      '',
      '입력 맥락:',
      ...selectedContext.map((item) => `- ${item}`),
      '',
      '요청 결과물:',
      ...selectedOutputLabels.map((item, index) => `${index + 1}. ${item}`),
      '',
      '출력 형식:',
      '- 표만 길게 만들지 말고, 팀장이 읽고 바로 실행할 수 있는 짧은 문장과 체크리스트를 함께 사용하세요.',
      '- 각 결과물마다 컴플라이언스 주의점을 반드시 포함하세요.',
      '- 마지막에는 팀장이 팀원에게 말할 수 있는 3문장 실행 메시지를 작성하세요.',
      '',
      `추가 요청: ${extraInstruction || '없음'}`,
    ].join('\n');
  }, [extraInstruction, selectedContext, selectedOutputLabels]);

  const toggleOutput = (id: string) => {
    setSelectedOutputs((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const toggleContext = (value: string) => {
    setSelectedContext((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 AI Call Plan Lab</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">AI 콜플랜 결과물 요청하기</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          AI에게 답을 맡기는 단계가 아니라, 앞 단계에서 만든 판단을 바탕으로 필요한 결과물만 선별해 요청하는 단계입니다.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm md:p-6">
        <h3 className="text-lg font-black">입력 금지 기준</h3>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {FORBIDDEN_ITEMS.map((item) => (
            <div key={item} className="rounded-2xl bg-white px-4 py-3 text-sm font-bold">{item}</div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">AI에 요청할 결과물 선택</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">최소 3개 이상 선택하는 것을 권장합니다. 선택한 결과물만 프롬프트에 반영됩니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {OUTPUT_OPTIONS.map((option) => {
            const checked = selectedOutputs.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                className={`rounded-2xl border p-4 text-left transition ${checked ? 'border-cyan-700 bg-cyan-50' : 'bg-white hover:bg-slate-50'}`}
                onClick={() => toggleOutput(option.id)}
              >
                <span className="block text-sm font-black text-slate-950">{checked ? '✓ ' : ''}{option.label}</span>
                <span className="mt-2 block text-xs font-bold leading-5 text-slate-600">{option.detail}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">프롬프트에 넣을 판단 맥락 선택</h3>
        <div className="mt-4 grid gap-2">
          {CONTEXT_OPTIONS.map((option) => {
            const checked = selectedContext.includes(option);
            return (
              <label key={option} className={`flex items-start gap-3 rounded-2xl border p-3 text-sm font-bold ${checked ? 'border-cyan-700 bg-cyan-50' : 'bg-white'}`}>
                <input type="checkbox" className="mt-1" checked={checked} onChange={() => toggleContext(option)} />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </div>

      <label className="block rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <span className="text-lg font-black text-slate-950">추가 요청</span>
        <textarea
          className="mt-3 min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6"
          value={extraInstruction}
          onChange={(event) => setExtraInstruction(event.target.value)}
        />
      </label>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">복사용 AI 프롬프트</h3>
            <p className="mt-1 text-sm text-slate-600">외부 AI에 붙여넣기 전, 민감정보가 없는지 한 번 더 확인하세요.</p>
          </div>
          <button type="button" className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>
            {copied ? '복사 완료' : '프롬프트 복사'}
          </button>
        </div>
        <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{promptText}</pre>
      </div>
    </section>
  );
}
