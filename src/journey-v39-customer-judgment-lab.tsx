import { useMemo, useState } from 'react';
import { V38CustomerJudgmentLab } from './journey-v38-customer-judgment-lab';
import {
  type V39CustomerDecisionResult,
  type V39CustomerPriorityDecision,
  createEmptyV39CustomerJudgmentResult,
  loadV39CustomerJudgmentResult,
  normalizeV39CustomerDecisionResult,
  saveV39CustomerJudgmentResult,
} from './journey-v39-customer-judgment-result-store';

type JudgmentFrameItem = {
  title: string;
  signal: string;
  teamLeaderQuestion: string;
  nextMove: string;
  className: string;
};

type LabBlockItem = {
  title: string;
  description: string;
};

type CustomerPriorityCandidate = {
  id: string;
  label: string;
  dataRead: string;
  suggestedDecision: V39CustomerPriorityDecision;
  decisionReason: string;
  nextCheck: string;
  complianceNote: string;
};

type PriorityOption = {
  id: V39CustomerPriorityDecision;
  label: string;
  description: string;
};

const CUSTOMER_DATA_JUDGMENT_FRAME: JudgmentFrameItem[] = [
  {
    title: '기회성 Data',
    signal: '고객군의 잠재력, 자료 요청, 관심 표현처럼 기회로 읽힐 수 있는 신호입니다.',
    teamLeaderQuestion: '이 신호가 실제 행동 의지로 이어지고 있는가, 아니면 잠재력만 큰 상태인가?',
    nextMove: '반응성·실행 가능성 Data와 함께 보고 집중 후보인지 확인합니다.',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
  {
    title: '반응성 Data',
    signal: '최근 콜 반응, 질문 증가, 후속 미팅 동의·보류처럼 고객의 현재 반응을 보여주는 신호입니다.',
    teamLeaderQuestion: '고객은 지금 설득을 기다리는가, 확인 질문을 원하는가, 아니면 속도 조절이 필요한가?',
    nextMove: '좋은 반응과 주의 신호를 분리하고 고객의 다음 질문을 예상합니다.',
    className: 'border-cyan-200 bg-cyan-50 text-cyan-950',
  },
  {
    title: '실행 가능성 Data',
    signal: '최근 방문, 접촉 성공률, 후속조치 완료율, CRM 기록처럼 2주 안에 움직일 수 있는지를 보여주는 신호입니다.',
    teamLeaderQuestion: '이 고객은 지금 팀원이 실제로 준비하고 실행할 수 있는 고객인가?',
    nextMove: '실행 가능 고객과 준비가 더 필요한 고객을 분리합니다.',
    className: 'border-indigo-200 bg-indigo-50 text-indigo-950',
  },
  {
    title: '리스크 Data',
    signal: '관계 수준, 컴플라이언스 민감도, 고객 부담·피로감처럼 접근 방식의 안전선을 정하는 신호입니다.',
    teamLeaderQuestion: '기회가 커 보여도 표현·자료·접촉 강도에서 넘지 말아야 할 선은 무엇인가?',
    nextMove: '승인된 자료 범위, 표현 안전선, 접촉 강도를 먼저 점검합니다.',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  {
    title: '판단 유보 Data',
    signal: '정보 부족, CRM 기록 부족, 보류 이유 불명확처럼 결론보다 확인이 먼저 필요한 신호입니다.',
    teamLeaderQuestion: '지금 결론을 내리면 과잉해석이 되는 Data는 무엇인가?',
    nextMove: '우선순위 결정보다 부족한 정보와 확인 질문을 먼저 정리합니다.',
    className: 'border-slate-200 bg-slate-50 text-slate-800',
  },
];

const CUSTOMER_DATA_LAB_BLOCKS: LabBlockItem[] = [
  {
    title: 'Block 0. 고객 Data 판단 프레임',
    description: '기회성·반응성·실행 가능성·리스크·판단 유보 Data를 나누어 고객 신호를 읽습니다.',
  },
  {
    title: 'Block 1. 좋은 신호와 주의 신호 구분',
    description: '좋아 보이는 Data와 실제 실행을 막는 신호를 분리합니다.',
  },
  {
    title: 'Block 2. 판단 유보 Data 확인',
    description: '단정하기 어려운 정보, 빠진 정보, 추가 확인 질문을 정리합니다.',
  },
  {
    title: 'Block 3. 우선순위 판단 기준',
    description: '집중·유지·보류·정보 보완 중 어디에 가까운지 판단할 준비를 합니다.',
  },
  {
    title: 'Block 4. AI 분석 프롬프트 준비',
    description: 'AI에게 넘길 수 있는 안전한 입력 범위와 기대 출력 구조를 준비합니다.',
  },
];

const CUSTOMER_PRIORITY_OPTIONS: PriorityOption[] = [
  {
    id: 'focus',
    label: '집중',
    description: '기회 신호와 실행 가능성이 함께 있어 2주 안에 우선 대응할 후보입니다.',
  },
  {
    id: 'maintain',
    label: '유지',
    description: '관계와 기본 접점은 유지하되 과도한 설득보다 관찰과 품질 관리가 적합합니다.',
  },
  {
    id: 'defer',
    label: '보류',
    description: '현재 접근 강도나 타이밍을 낮추고 고객 부담·리스크를 먼저 관리합니다.',
  },
  {
    id: 'supplement',
    label: '정보 보완',
    description: '판단 근거가 부족해 우선순위 결정보다 추가 확인과 기록 정리가 먼저입니다.',
  },
];

const CUSTOMER_PRIORITY_CANDIDATES: CustomerPriorityCandidate[] = [
  {
    id: 'A',
    label: '고객 유형 A',
    dataRead: '반응 상승, 자료 요청, 후속 미팅 동의가 함께 나타나지만 표현 안전선 확인이 필요합니다.',
    suggestedDecision: 'focus',
    decisionReason: '기회성과 실행 가능성이 모두 보이므로 집중 후보입니다. 단, 승인 자료 범위와 표현을 먼저 확인해야 합니다.',
    nextCheck: '고객 질문의 구체 내용과 사용할 수 있는 근거자료 범위',
    complianceNote: '자료 제공 전 승인된 자료인지 확인하고 제품명·효능 표현을 임의로 확장하지 않습니다.',
  },
  {
    id: 'B',
    label: '고객 유형 B',
    dataRead: '잠재력과 관계 수준은 높지만 후속 미팅 보류와 기존 치료 유지 선호가 있습니다.',
    suggestedDecision: 'supplement',
    decisionReason: '관심은 있으나 아직 판단 기준이 불명확하므로 보류 이유와 니즈를 먼저 확인해야 합니다.',
    nextCheck: '보류 이유의 실제 의미, 고객이 비교하거나 확인하려는 기준',
    complianceNote: '고객의 기존 선택을 부정하거나 전환을 압박하는 표현을 피합니다.',
  },
  {
    id: 'C',
    label: '고객 유형 C',
    dataRead: '관계는 안정적이지만 자료 요청과 후속 미팅이 없어 변화 신호는 약합니다.',
    suggestedDecision: 'maintain',
    decisionReason: '집중보다 관계 유지 품질과 반응 변화 관찰이 적합합니다.',
    nextCheck: '관계 유지 외에 새롭게 확인할 니즈나 변화 신호',
    complianceNote: '필요성이 낮은 상황에서 과도한 자료 제공이나 반복 접촉을 하지 않습니다.',
  },
  {
    id: 'D',
    label: '고객 유형 D',
    dataRead: '접촉은 많지만 무반응과 피로감이 커지고 실행 품질도 낮습니다.',
    suggestedDecision: 'defer',
    decisionReason: '더 밀어붙이기보다 접촉 강도와 메시지를 낮추고 리스크를 먼저 관리해야 합니다.',
    nextCheck: '무반응 원인, 고객 부담 수준, 최근 메시지의 적절성',
    complianceNote: '반복 접촉으로 부담을 키우지 않고 고객이 요청하지 않은 정보 제공을 자제합니다.',
  },
  {
    id: 'E',
    label: '고객 유형 E',
    dataRead: '질문 증가와 후속 미팅 동의가 있지만 컴플라이언스 민감도가 높습니다.',
    suggestedDecision: 'focus',
    decisionReason: '기회 신호가 강하므로 집중 후보입니다. 다만 안전선 점검 없는 실행은 위험합니다.',
    nextCheck: '질문의 범위, 승인 근거자료, 답변 가능한 표현 수준',
    complianceNote: '미승인 표현, 비교 우위 단정, 내부 수치 언급을 피하고 승인 자료 안에서 답변합니다.',
  },
  {
    id: 'F',
    label: '고객 유형 F',
    dataRead: '관계 수준은 있으나 최근 콜과 CRM 기록이 부족해 판단 Data가 약합니다.',
    suggestedDecision: 'supplement',
    decisionReason: '현재 Data만으로 대응 전략을 정하기보다 정보 보완과 기록 정리가 먼저입니다.',
    nextCheck: '최근 반응, 접촉 공백 이유, 실제 니즈, CRM 기록 보완 항목',
    complianceNote: '부족한 정보를 추측으로 채우지 않고 확인 가능한 사실만 기록합니다.',
  },
];

const PRIORITY_BADGE_CLASS: Record<V39CustomerPriorityDecision, string> = {
  focus: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  maintain: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  defer: 'border-amber-200 bg-amber-50 text-amber-900',
  supplement: 'border-slate-200 bg-slate-50 text-slate-800',
};

function getPriorityLabel(priorityDecision: V39CustomerPriorityDecision | '') {
  return CUSTOMER_PRIORITY_OPTIONS.find((option) => option.id === priorityDecision)?.label ?? '미선택';
}

function buildInitialCustomerJudgmentState(): Record<string, V39CustomerDecisionResult> {
  if (typeof window === 'undefined') return createEmptyV39CustomerJudgmentResult().decisions;

  const saved = loadV39CustomerJudgmentResult();
  const decisions: Record<string, V39CustomerDecisionResult> = {};

  for (const candidate of CUSTOMER_PRIORITY_CANDIDATES) {
    decisions[candidate.id] = normalizeV39CustomerDecisionResult(saved.decisions[candidate.id], candidate.id, candidate.label);
  }

  return decisions;
}

function buildCustomerAiAnalysisPrompt(
  candidate: CustomerPriorityCandidate,
  decision: V39CustomerDecisionResult,
) {
  return [
    '당신은 제약영업 팀장의 고객 Data 판단을 돕는 AI 사고 파트너입니다.',
    '',
    '[안전선]',
    '- 아래 내용은 교육용 가상 고객 유형 Data입니다.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보를 추정하거나 요구하지 마세요.',
    '- 미승인 효능 표현, 비교 우위 단정, 처방 유도 문장, 과도한 설득 문장을 만들지 마세요.',
    '- 답변은 고객 평가나 등급화가 아니라, 팀장의 판단 보조 관점으로 작성하세요.',
    '',
    '[입력 Data]',
    `- 고객 유형: ${candidate.label}`,
    `- Data 1차 해석: ${candidate.dataRead}`,
    `- 팀장 우선순위 판단: ${getPriorityLabel(decision.priorityDecision)}`,
    `- 판단 이유: ${decision.reason || '아직 작성 전'}`,
    `- 다음 확인 질문: ${decision.nextCheck || '아직 작성 전'}`,
    `- 컴플라이언스 메모: ${decision.complianceNote || '아직 작성 전'}`,
    '',
    '[요청]',
    '위 Data를 바탕으로 이 고객 유형을 2주 안에 어떻게 다룰지 분석해 주세요.',
    '단, 확정 결론처럼 말하지 말고 팀장이 다시 판단할 수 있는 초안으로 작성해 주세요.',
    '',
    '[출력 형식]',
    '1. 기회 신호: 믿을 수 있는 긍정 신호와 그 근거',
    '2. 리스크 신호: 주의해야 할 신호와 과잉해석 가능성',
    '3. 부족한 정보: 추가로 확인해야 할 정보',
    '4. 다음 확인 질문: 고객에게 직접 확인하기보다 팀원이 준비해야 할 질문 중심',
    '5. 2주 실행 방향: 집중/유지/보류/정보 보완 중 현재 판단에 맞춘 안전한 실행 방향',
    '6. 컴플라이언스 주의점: 표현, 자료 활용, 접촉 강도에서 지켜야 할 안전선',
  ].join('\n');
}

function V39CustomerPrioritySelectionPanel() {
  const [decisions, setDecisions] = useState<Record<string, V39CustomerDecisionResult>>(buildInitialCustomerJudgmentState);
  const [promptCustomerId, setPromptCustomerId] = useState(CUSTOMER_PRIORITY_CANDIDATES[0]?.id ?? 'A');
  const [copiedPromptCustomerId, setCopiedPromptCustomerId] = useState('');
  const selectedCount = useMemo(
    () => CUSTOMER_PRIORITY_CANDIDATES.filter((candidate) => decisions[candidate.id]?.priorityDecision).length,
    [decisions],
  );

  const selectedPromptCandidate = CUSTOMER_PRIORITY_CANDIDATES.find((candidate) => candidate.id === promptCustomerId) ?? CUSTOMER_PRIORITY_CANDIDATES[0];
  const selectedPromptDecision = decisions[selectedPromptCandidate.id] ?? normalizeV39CustomerDecisionResult(undefined, selectedPromptCandidate.id, selectedPromptCandidate.label);
  const generatedPrompt = buildCustomerAiAnalysisPrompt(selectedPromptCandidate, selectedPromptDecision);

  const updateDecision = (customerTypeId: string, patch: Partial<V39CustomerDecisionResult>) => {
    setDecisions((current) => {
      const candidate = CUSTOMER_PRIORITY_CANDIDATES.find((item) => item.id === customerTypeId);
      if (!candidate) return current;
      const next = {
        ...current,
        [customerTypeId]: {
          ...normalizeV39CustomerDecisionResult(current[customerTypeId], candidate.id, candidate.label),
          ...patch,
        },
      };
      saveV39CustomerJudgmentResult({
        schemaVersion: 1,
        updatedAt: '',
        decisions: next,
      });
      return next;
    });
  };

  const applySuggestedDecision = (candidate: CustomerPriorityCandidate) => {
    updateDecision(candidate.id, {
      priorityDecision: candidate.suggestedDecision,
      reason: decisions[candidate.id]?.reason || candidate.decisionReason,
      nextCheck: decisions[candidate.id]?.nextCheck || candidate.nextCheck,
      complianceNote: decisions[candidate.id]?.complianceNote || candidate.complianceNote,
    });
  };

  const copyGeneratedPrompt = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopiedPromptCustomerId(selectedPromptCandidate.id);
    });
  };

  const resetCustomerJudgmentSelections = () => {
    const empty = buildInitialCustomerJudgmentState();
    for (const candidate of CUSTOMER_PRIORITY_CANDIDATES) {
      empty[candidate.id] = normalizeV39CustomerDecisionResult(undefined, candidate.id, candidate.label);
    }
    setDecisions(empty);
    setCopiedPromptCustomerId('');
    saveV39CustomerJudgmentResult({ schemaVersion: 1, updatedAt: '', decisions: empty });
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-violet-700">Customer Priority Selection</p>
            <h3 className="mt-2 text-xl font-black text-slate-950">고객별 우선순위 선택</h3>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-700">
              아래 선택은 고객을 평가하거나 등급화하는 기능이 아닙니다. 고객 Data를 읽은 뒤, 2주 안에 어떤 대응 방향이 적합한지
              팀장 관점에서 임시 판단을 남기는 기록입니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-violet-800 shadow-sm">
              선택 완료 {selectedCount} / {CUSTOMER_PRIORITY_CANDIDATES.length}
            </div>
            <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-xs font-black text-slate-600 shadow-sm" onClick={resetCustomerJudgmentSelections}>
              고객 판단 선택 초기화
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {CUSTOMER_PRIORITY_OPTIONS.map((option) => (
            <article key={option.id} className="rounded-2xl border bg-white p-4">
              <p className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${PRIORITY_BADGE_CLASS[option.id]}`}>{option.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{option.description}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          {CUSTOMER_PRIORITY_CANDIDATES.map((candidate) => {
            const current = decisions[candidate.id] ?? normalizeV39CustomerDecisionResult(undefined, candidate.id, candidate.label);
            return (
              <article key={candidate.id} className="rounded-3xl border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-950">{candidate.label}</p>
                    <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{candidate.dataRead}</p>
                  </div>
                  <span className={`w-fit rounded-full border px-3 py-1 text-xs font-black ${current.priorityDecision ? PRIORITY_BADGE_CLASS[current.priorityDecision] : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                    현재 판단: {getPriorityLabel(current.priorityDecision)}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 md:grid-cols-4">
                  {CUSTOMER_PRIORITY_OPTIONS.map((option) => (
                    <label key={option.id} className={`cursor-pointer rounded-2xl border p-3 text-center text-xs font-black ${current.priorityDecision === option.id ? PRIORITY_BADGE_CLASS[option.id] : 'bg-white text-slate-600'}`}>
                      <input
                        type="radio"
                        className="sr-only"
                        name={`customer-priority-${candidate.id}`}
                        checked={current.priorityDecision === option.id}
                        onChange={() => updateDecision(candidate.id, { priorityDecision: option.id })}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>

                <button type="button" className="mt-3 rounded-2xl border bg-slate-50 px-4 py-2 text-xs font-black text-slate-700" onClick={() => applySuggestedDecision(candidate)}>
                  판단 초안 가져오기
                </button>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <label className="space-y-1">
                    <span className="text-xs font-black text-slate-500">판단 이유</span>
                    <textarea
                      className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900"
                      value={current.reason}
                      onChange={(event) => updateDecision(candidate.id, { reason: event.target.value })}
                      placeholder="예: 기회 신호는 있으나 고객 반응과 안전선을 함께 봐야 한다."
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-black text-slate-500">다음 확인 질문</span>
                    <textarea
                      className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900"
                      value={current.nextCheck}
                      onChange={(event) => updateDecision(candidate.id, { nextCheck: event.target.value })}
                      placeholder="예: 고객이 확인하려는 기준은 무엇인가?"
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-xs font-black text-slate-500">컴플라이언스 메모</span>
                    <textarea
                      className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900"
                      value={current.complianceNote}
                      onChange={(event) => updateDecision(candidate.id, { complianceNote: event.target.value })}
                      placeholder="예: 승인 자료 범위 안에서만 설명한다."
                    />
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">AI Analysis Prompt</p>
            <h3 className="mt-2 text-xl font-black text-slate-950">AI 분석 프롬프트 생성</h3>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-700">
              고객별 우선순위 판단을 바탕으로 AI에 복사할 수 있는 분석 프롬프트를 만듭니다. 프롬프트에는 실제 고객명, 병원명,
              의료진명, 제품명, 내부 수치가 들어가지 않도록 안전선 문구를 포함했습니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-xs font-black text-emerald-800 shadow-sm" onClick={copyGeneratedPrompt}>
            {copiedPromptCustomerId === selectedPromptCandidate.id ? '프롬프트 복사 완료' : '프롬프트 복사'}
          </button>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="rounded-2xl border bg-white p-4">
            <p className="text-xs font-black text-slate-500">프롬프트 대상 고객 유형</p>
            <div className="mt-3 grid gap-2">
              {CUSTOMER_PRIORITY_CANDIDATES.map((candidate) => {
                const current = decisions[candidate.id] ?? normalizeV39CustomerDecisionResult(undefined, candidate.id, candidate.label);
                return (
                  <button
                    key={candidate.id}
                    type="button"
                    className={`rounded-2xl border px-3 py-2 text-left text-xs font-black ${promptCustomerId === candidate.id ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'bg-white text-slate-600'}`}
                    onClick={() => {
                      setPromptCustomerId(candidate.id);
                      setCopiedPromptCustomerId('');
                    }}
                  >
                    {candidate.label}
                    <span className="mt-1 block text-[11px] font-bold opacity-80">{getPriorityLabel(current.priorityDecision)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-xs font-black text-slate-500">복사해서 사용할 AI 분석 프롬프트</span>
            <textarea
              className="min-h-[28rem] w-full rounded-2xl border bg-white px-4 py-3 font-mono text-xs leading-6 text-slate-900 shadow-sm"
              value={generatedPrompt}
              readOnly
            />
          </label>
        </div>
      </section>
    </section>
  );
}

export function V39CustomerJudgmentLab() {
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-cyan-100 bg-gradient-to-br from-white via-cyan-50 to-slate-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Customer Data Judgment Frame</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">고객 Data 판단 프레임</h2>
            <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-slate-700">
              6단계는 고객을 점수화하거나 등급화하는 단계가 아닙니다. 고객 Data에서 믿을 수 있는 신호와 아직 부족한 정보를 구분하고,
              2주 안에 실행 가능한 다음 행동을 판단하는 단계입니다.
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-xs font-black leading-5 text-cyan-800 shadow-sm">
            판단 기준: 설득 · 확인 · 보류 · 정보 보완
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {CUSTOMER_DATA_JUDGMENT_FRAME.map((item) => (
            <article key={item.title} className={`rounded-2xl border p-4 ${item.className}`}>
              <p className="text-sm font-black">{item.title}</p>
              <p className="mt-2 text-xs font-bold leading-5 opacity-90">{item.signal}</p>
              <div className="mt-3 rounded-xl bg-white/75 p-3 text-xs font-bold leading-5 text-slate-800">
                <p className="font-black text-slate-950">팀장 판단 질문</p>
                <p className="mt-1">{item.teamLeaderQuestion}</p>
              </div>
              <p className="mt-3 text-xs font-black leading-5">다음 행동: {item.nextMove}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">6단계 진행 구조</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
              이번 단계에서는 먼저 Data를 안전하게 읽는 관점을 세우고, 아래 고객 유형 A~F 분석에서 실제 신호를 분류합니다.
              고객별 우선순위 선택과 AI 분석 프롬프트 생성은 이후 단계에서 확장합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs font-black leading-5 text-slate-700">
            실제 고객명·병원명·의료진명·제품명·내부 수치는 입력하지 않습니다.
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {CUSTOMER_DATA_LAB_BLOCKS.map((block) => (
            <article key={block.title} className="rounded-2xl border bg-slate-50 p-4">
              <p className="text-xs font-black text-cyan-700">{block.title}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-700">{block.description}</p>
            </article>
          ))}
        </div>
      </section>

      <V39CustomerPrioritySelectionPanel />
      <V38CustomerJudgmentLab />
    </section>
  );
}
