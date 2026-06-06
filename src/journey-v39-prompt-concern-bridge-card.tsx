import { getJson } from './journey-storage';

const V39_PROMPT_PRACTICE_STORAGE_KEY = 'ckd.v39.promptPractice.v1';

const V39_PROMPT_CONCERN_BRIDGE_SMOKE_MARKERS = [
  'V39PromptConcernBridgeCard',
  '3단계에서 선택한 우리 팀 고민',
  '이 고민은 이후 단계에서 이렇게 이어집니다',
  '4단계 AI 전략 리서치 연결',
  '5단계 관리 지표 선정 연결',
  '6단계 고객 Data 확인 List 연결',
  '7단계 고객군별 2주 대응 방향',
  '8단계 코칭 대상 선정',
].join('|');
void V39_PROMPT_CONCERN_BRIDGE_SMOKE_MARKERS;

type PromptConcernBridgeMode = 'research' | 'metric' | 'customerData';

type StoredPromptPractice = {
  concernId?: string;
  customConcern?: string;
  plainQuestion?: string;
  task?: string;
  finalPrompt?: string;
};

type ConcernMeta = {
  group: string;
  label: string;
  situationSummary: string;
  downstreamHint: string;
  nextAction: string;
  customerDataAction: string;
};

const CONCERN_META: Record<string, ConcernMeta> = {
  'follow-up-gap': {
    group: '고객 Data와 실행 신호 고민',
    label: '방문은 하는데 다음 대화나 후속조치로 잘 이어지지 않는다',
    situationSummary: '방문 횟수는 유지되고 있지만 고객 질문, 자료 요청, 다음 약속, 후속 확인으로 이어지는 경우가 적습니다. 팀원들도 방문 이후 무엇을 남겨야 하는지 기준이 다릅니다.',
    downstreamHint: '관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정',
    nextAction: '후속조치 완료율, 다음 접점 확보, 고객 질문·자료 요청 신호를 중심으로 리서치 질문과 관리 지표를 좁힙니다.',
    customerDataAction: '방문 이후 고객 질문, 자료 요청, 다음 약속, 후속 확인 여부를 고객 Data 확인 List로 나눕니다.',
  },
  'activity-record-blindspot': {
    group: '고객 Data와 실행 신호 고민',
    label: '영업활동 기록은 남기지만 고객 반응과 다음 행동이 잘 보이지 않는다',
    situationSummary: '방문·면담 기록은 남아 있지만 고객이 무엇에 반응했는지, 다음에 무엇을 확인해야 하는지가 흐릿합니다. 기록은 있는데 실행 기준으로 쓰기 어렵습니다.',
    downstreamHint: '관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정',
    nextAction: '영업활동 기록의 품질, 고객 반응, 다음 행동, 부족 정보를 구분해 관리 지표 후보로 바꿉니다.',
    customerDataAction: '방문·면담 기록에서 고객 반응, 다음 행동, 부족 정보, 조심할 해석을 분리해 확인합니다.',
  },
  'existing-customer-bias': {
    group: '고객 Data와 실행 신호 고민',
    label: '기존 거래처 중심으로 활동이 몰리고 신규 접점은 계속 뒤로 밀린다',
    situationSummary: '익숙한 고객군 방문은 계속되지만 새롭게 봐야 할 고객군은 정보 부족과 접근 부담 때문에 뒤로 밀립니다. 상부는 신규 접점을 요구하지만 현장 부담은 큽니다.',
    downstreamHint: '관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정',
    nextAction: '기존 고객 편중, 신규·미접촉 고객군, 접근 경로, 후속 가능성을 확인할 질문으로 전환합니다.',
    customerDataAction: '기존 고객 편중, 미접촉 고객군, 접근 경로, 신규 접점 반응을 고객 Data에서 확인합니다.',
  },
  'customer-signal-ambiguity': {
    group: '고객 Data와 실행 신호 고민',
    label: '고객이 관심을 보인 것 같은데 어떤 신호를 기회로 봐야 할지 애매하다',
    situationSummary: '고객 질문이나 자료 요청이 있었지만 이것을 실제 기회 신호로 봐도 되는지 판단이 어렵습니다. 팀원마다 같은 반응을 다르게 해석합니다.',
    downstreamHint: '고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정',
    nextAction: '기회 신호, 주의 신호, 부족 정보, 다음 확인 질문을 분리하는 리서치 질문과 지표 후보로 좁힙니다.',
    customerDataAction: '고객 질문과 자료 요청을 바로 기회로 단정하지 않고, 기회 신호·주의 신호·부족 정보로 나눕니다.',
  },
  'data-interpretation-gap': {
    group: '고객 Data와 실행 신호 고민',
    label: '팀원마다 같은 고객 Data를 다르게 해석해 실행 방향이 엇갈린다',
    situationSummary: '같은 고객 활동 Data를 보고도 어떤 팀원은 움직일 때라고 보고, 다른 팀원은 아직 이르다고 판단합니다. 팀 회의에서 기준이 맞지 않아 실행 방향이 흐려집니다.',
    downstreamHint: '고객 Data 해석 기준 → 고객군별 2주 대응 방향 → 실행 대화',
    nextAction: '팀 회의에서 공통으로 쓸 고객 Data 해석 기준과 2주 대응 방향 기준을 정리합니다.',
    customerDataAction: '같은 고객 Data를 보더라도 기회 신호, 주의 신호, 부족 정보, 추가 확인 질문으로 해석 기준을 맞춥니다.',
  },
  'junior-senior-temperature-gap': {
    group: '팀원 실행과 대화 고민',
    label: '저연차 팀원은 우선순위를 어려워하고 기존 팀원은 예전 방식이 낫다고 느낀다',
    situationSummary: '저연차 팀원은 무엇부터 해야 할지 몰라 움직임이 느리고, 기존 팀원은 새로운 기준이 번거롭다고 느낍니다. 같은 실행계획도 팀원마다 받아들이는 온도가 다릅니다.',
    downstreamHint: '코칭 대상 선정 → 실행 대화 → 첫마디 전환',
    nextAction: '팀원별 실행 온도차를 고려해 먼저 1on1로 맞춰볼 대상, 코칭 초점, 첫마디를 정리할 질문으로 연결합니다.',
    customerDataAction: '고객 Data 자체보다 팀원별로 어떤 정보가 부족해 우선순위 판단이 어려운지 확인합니다.',
  },
  'pressure-vs-field-constraint': {
    group: '팀원 실행과 대화 고민',
    label: '상부는 활동량과 속도를 요구하지만 현장에서는 고객 반응과 방문 제약이 커지고 있다',
    situationSummary: '상부는 활동량과 속도를 요구하지만 현장에서는 일정 변경, 방문 제한, 자료 확인 지연이 늘고 있습니다. 숫자와 현장 설명을 함께 정리해야 합니다.',
    downstreamHint: '관리 지표 → 제약요인 확인 → 보고/회의 설명 문장',
    nextAction: '활동량, 전환 신호, 고객 반응, 방문 제약을 함께 설명할 관리 기준으로 바꿉니다.',
    customerDataAction: '방문 제한, 일정 변경, 자료 확인 지연, 고객 반응 약화 같은 제약요인을 고객 Data에서 분리해 봅니다.',
  },
  'role-assignment-first-message': {
    group: '팀원 실행과 대화 고민',
    label: '팀원에게 실행 방향을 설명하려 해도 지시처럼 들릴까 봐 첫마디가 어렵다',
    situationSummary: '고객군별 2주 대응 방향을 설명해야 하지만 특정 팀원에게 말하면 부담이나 지시로 들릴 수 있습니다. 왜 이 대화가 필요한지 어떻게 말해야 할지 고민됩니다.',
    downstreamHint: '코칭 대상 선정 → 실행 대화 첫마디 → 2주 실행계획',
    nextAction: '먼저 1on1이 필요한 이유, 팀장 지원 포인트, 피해야 할 표현을 실행 대화 질문으로 바꿉니다.',
    customerDataAction: '대화가 필요한 근거가 되는 고객군 반응, 부족 정보, 다음 확인 질문을 먼저 정리합니다.',
  },
  'ai-boundary-anxiety': {
    group: 'AI 활용과 실행계획 고민',
    label: 'AI로 실행계획을 만들 수는 있을 것 같은데 어디까지 물어봐도 되는지 불안하다',
    situationSummary: 'AI를 쓰면 회의 문장이나 실행계획 초안을 빨리 만들 수 있을 것 같지만 고객명, 제품명, 내부 수치, 미승인 표현이 들어갈까 봐 조심스럽습니다.',
    downstreamHint: 'AI 실행계획 Prompt → 컴플라이언스 점검 → 안전 문장',
    nextAction: 'AI에게 물어볼 수 있는 것과 피해야 할 것을 구분하고, 안전한 실행계획 초안 기준으로 연결합니다.',
    customerDataAction: '고객 Data를 다룰 때 실제 고객명·병원명·의료진명·제품명·내부 수치를 제거하고 가상 고객군 기준으로 확인합니다.',
  },
  'meeting-message-unclear': {
    group: 'AI 활용과 실행계획 고민',
    label: '팀 회의에서 실행 기준을 설명해야 하는데 지표·고객 Data·실행 대화가 하나로 정리되지 않는다',
    situationSummary: '이번 2주 동안 무엇을 볼지, 고객 활동 Data에서 무엇을 확인할지, 팀원과 어떤 대화를 먼저 해야 할지 정리해야 합니다. 하지만 회의에서 설명할 한 흐름으로 아직 묶이지 않습니다.',
    downstreamHint: '통합 실행계획 → 최종 2주 실행 카드 → 강사용 토의 질문',
    nextAction: '관리 지표, 고객 Data 확인 List, 코칭 대상, 실행 대화, 안전한 표현 기준을 하나의 회의 설명 구조로 묶습니다.',
    customerDataAction: '회의에서 설명할 수 있도록 고객 Data 확인 항목, 부족 정보, 팀원에게 물어볼 질문을 함께 정리합니다.',
  },
};

function loadPromptPractice(): StoredPromptPractice | null {
  const parsed = getJson<StoredPromptPractice | null>(V39_PROMPT_PRACTICE_STORAGE_KEY, null);
  return parsed && typeof parsed === 'object' ? parsed : null;
}

function getConcernMeta(result: StoredPromptPractice | null): ConcernMeta | null {
  if (!result?.concernId) return null;
  return CONCERN_META[result.concernId] ?? null;
}

function getBridgeTitle(mode: PromptConcernBridgeMode) {
  if (mode === 'research') return '4단계 AI 전략 리서치 연결';
  if (mode === 'metric') return '5단계 관리 지표 선정 연결';
  return '6단계 고객 Data 확인 List 연결';
}

function getActionLabel(mode: PromptConcernBridgeMode) {
  if (mode === 'research') return '이번 단계에서는 이렇게 좁힙니다';
  if (mode === 'metric') return '관리 지표로 바꿀 때의 초점';
  return '고객 Data로 확인할 때의 초점';
}

function getNextAction(mode: PromptConcernBridgeMode, meta: ConcernMeta | null, result: StoredPromptPractice | null) {
  if (mode === 'customerData') return meta?.customerDataAction || result?.task || '이 고민을 고객 Data의 기회 신호, 주의 신호, 부족 정보, 추가 확인 질문으로 나눕니다.';
  return meta?.nextAction || result?.task || '이 고민을 공개자료 리서치 질문과 2주 관리 지표 후보로 바꿉니다.';
}

export function V39PromptConcernBridgeCard({ mode }: { mode: PromptConcernBridgeMode }) {
  const result = loadPromptPractice();
  const meta = getConcernMeta(result);
  const title = getBridgeTitle(mode);
  const actionLabel = getActionLabel(mode);

  if (!meta && !result?.customConcern?.trim()) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">{title}</p>
        <h2 className="mt-1 text-lg font-black text-slate-950">3단계에서 선택한 우리 팀 고민이 아직 없습니다</h2>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">3단계에서 우리 팀에 가까운 고민을 고르면, 이곳에 선택한 고민과 이후 단계 연결 방향이 표시됩니다. 지금도 아래 단계에서 직접 질문과 지표를 입력할 수 있습니다.</p>
      </section>
    );
  }

  const selectedConcern = result?.customConcern?.trim() || meta?.label || '3단계에서 입력한 우리 팀 고민';
  const situation = meta?.situationSummary || result?.plainQuestion || '3단계에서 직접 입력한 고민을 바탕으로 다음 단계에서 질문과 지표를 좁힙니다.';
  const downstream = meta?.downstreamHint || '리서치 질문 → 관리 지표 → 고객 Data 확인 List → 고객군별 2주 대응 방향 → 코칭 대상 선정';
  const nextAction = getNextAction(mode, meta, result);

  return (
    <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700">{title}</p>
      <h2 className="mt-1 text-lg font-black text-slate-950">3단계에서 선택한 우리 팀 고민</h2>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950 lg:col-span-1">
          <p className="font-black">선택한 고민</p>
          <p className="mt-1">{selectedConcern}</p>
          {meta?.group ? <p className="mt-2 text-cyan-800">{meta.group}</p> : null}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700 lg:col-span-1">
          <p className="font-black text-slate-950">상황 설명</p>
          <p className="mt-1">{situation}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950 lg:col-span-1">
          <p className="font-black">이 고민은 이후 단계에서 이렇게 이어집니다</p>
          <p className="mt-1">{downstream}</p>
          <p className="mt-2 font-black">{actionLabel}</p>
          <p className="mt-1">{nextAction}</p>
        </div>
      </div>
    </section>
  );
}
