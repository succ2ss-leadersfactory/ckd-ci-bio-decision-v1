import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V39_PROMPT_PRACTICE_STORAGE_KEY = 'ckd.v39.promptPractice.v1';
const V39_PROMPT_PRACTICE_SMOKE_MARKERS = [
  'V39PromptPracticeLab',
  '일반 질문과 구조화 질문의 차이',
  '역할·맥락·지시/과제·형식',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '제약영업 현장을 오래 해본 선배 팀장',
  '4단계 AI 전략 리서치로 넘길 질문',
].join('|');
void V39_PROMPT_PRACTICE_SMOKE_MARKERS;

type RoleOption = {
  id: string;
  label: string;
  promptText: string;
  useWhen: string;
};

type ConcernOption = {
  id: string;
  label: string;
  plainQuestion: string;
  context: string;
  task: string;
};

type PromptPracticeResponse = {
  concernId: string;
  customConcern: string;
  plainQuestion: string;
  roleId: string;
  customRole: string;
  context: string;
  task: string;
  format: string;
  aiPlainAnswer: string;
  aiStructuredAnswer: string;
  differenceMemo: string;
  finalPrompt: string;
  copiedPrompt: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: 'senior-manager',
    label: '선배 영업팀장',
    promptText: '제약영업 현장을 오래 해본 선배 팀장 입장에서 봐주세요.',
    useWhen: '현장감 있는 판단과 팀장 관점의 조언이 필요할 때',
  },
  {
    id: 'head-office',
    label: '영업본부장',
    promptText: '본부장에게 보고받는 사람 입장에서, 숫자와 현장 설명이 납득되는지 봐주세요.',
    useWhen: '상위 보고 메시지와 근거가 설득력 있는지 점검할 때',
  },
  {
    id: 'sales-planning',
    label: '영업기획 담당자',
    promptText: '영업기획 담당자 입장에서, 이번 2주 동안 확인할 관리 기준을 정리해 주세요.',
    useWhen: '관리 지표와 실행 기준을 정리할 때',
  },
  {
    id: 'crm-support',
    label: 'CRM/영업지원 담당자',
    promptText: 'CRM과 활동 기록을 보는 담당자 입장에서, 어떤 기록을 더 확인해야 할지 봐주세요.',
    useWhen: '고객 활동 Data와 기록 품질을 볼 때',
  },
  {
    id: 'compliance',
    label: '컴플라이언스 담당자',
    promptText: '제약영업 컴플라이언스 담당자 입장에서, 조심해야 할 표현과 자료 사용 기준을 봐주세요.',
    useWhen: '표현·자료·고객 대화 안전선을 점검할 때',
  },
  {
    id: 'peer-manager',
    label: '동료 팀장',
    promptText: '비슷한 팀을 맡고 있는 동료 팀장 입장에서, 제가 놓치고 있는 부분을 짚어주세요.',
    useWhen: '팀원에게 어떻게 설명할지 현실적인 피드백이 필요할 때',
  },
];

const CONCERN_OPTIONS: ConcernOption[] = [
  {
    id: 'crm-follow-up',
    label: 'CRM 기록은 늘었지만 후속조치가 약하다',
    plainQuestion: 'CRM 기록은 늘었는데 후속조치가 약합니다. 어떻게 해야 하나요?',
    context: '우리 팀은 최근 CRM 입력 건수는 늘었지만, 방문 이후 후속 미팅이나 고객 질문 기록으로 이어지는 비율은 낮습니다. 고연차 팀원은 “현장은 숫자로만 보면 안 됩니다”라고 말하고, 저연차 팀원은 “무엇을 후속조치로 봐야 할지 기준이 필요합니다”라고 말합니다.',
    task: '이 상황에서 팀장이 확인해야 할 원인 가설과, 이번 2주 동안 볼 수 있는 관리 지표 후보를 정리해 주세요. 단순 활동량보다 후속 행동과 고객 대화 품질을 볼 수 있는 기준을 포함해 주세요.',
  },
  {
    id: 'visit-constraint',
    label: '대면 방문이 어려워졌는데 대체 접점 기준이 없다',
    plainQuestion: '방문이 어려운 고객에게 어떻게 대응하면 좋을까요?',
    context: '일부 고객군은 대면 방문 일정이 줄고 있고, 팀원들은 자료 전달·전화·온라인 접점 등 대체 활동을 하고 있습니다. 하지만 어떤 활동을 의미 있는 후속 접점으로 볼지 기준이 부족합니다.',
    task: '방문 외 대체 접점을 실행관리 관점에서 볼 수 있는 기준과, 이번 2주 동안 확인할 고객 Data 항목을 제안해 주세요.',
  },
  {
    id: 'record-quality',
    label: '팀원마다 CRM 기록 품질 차이가 크다',
    plainQuestion: '팀원마다 CRM 기록 방식이 다른데 어떻게 정리하면 좋을까요?',
    context: '방문 기록은 있지만 고객 질문, 자료 요청, 다음 접점, 후속조치가 멈춘 이유가 팀원별로 다르게 기록되어 있습니다. 숫자는 보이지만 고객 반응의 질을 비교하기 어렵습니다.',
    task: 'CRM 기록 품질을 높이기 위해 팀장이 확인할 기준과 팀원에게 설명할 문장을 정리해 주세요.',
  },
  {
    id: 'safe-conversation',
    label: '컴플라이언스 때문에 고객 대화가 조심스럽다',
    plainQuestion: '고객 대화에서 조심해야 할 표현을 정리해 주세요.',
    context: '고객 질문이 구체적일수록 팀원들이 답변 범위를 넓게 잡을 위험이 있습니다. 승인자료 범위, 표현 안전선, 미승인 표현 가능성을 미리 점검해야 합니다.',
    task: '제약영업 고객 대화에서 조심해야 할 표현과, 안전하게 후속 질문으로 전환하는 방법을 정리해 주세요.',
  },
];

const DEFAULT_FORMAT = [
  '1. 원인 가설 3개',
  '2. 팀장이 확인할 질문 5개',
  '3. 2주 관리 지표 후보 5개',
  '4. 조심할 해석 3개',
  '5. 팀 회의에서 사용할 첫 설명 문장 1개',
].join('\n');

const REVIEW_ITEMS = [
  '일반 질문과 구조화 질문의 차이를 비교했는가?',
  '역할을 “누구의 도움을 받을 것인가”로 정했는가?',
  '우리 팀 상황이 실제 장면처럼 들어갔는가?',
  '지시/과제가 분석·정리·실행 기준 중 무엇인지 분명한가?',
  '출력 형식이 후속 단계에서 바로 쓸 수 있게 정리되었는가?',
  '실제 고객명·병원명·의료진명·제품명·내부 수치·개인정보를 넣지 않았는가?',
];

const DEFAULT_RESPONSE: PromptPracticeResponse = {
  concernId: CONCERN_OPTIONS[0].id,
  customConcern: '',
  plainQuestion: CONCERN_OPTIONS[0].plainQuestion,
  roleId: ROLE_OPTIONS[0].id,
  customRole: '',
  context: CONCERN_OPTIONS[0].context,
  task: CONCERN_OPTIONS[0].task,
  format: DEFAULT_FORMAT,
  aiPlainAnswer: '',
  aiStructuredAnswer: '',
  differenceMemo: '',
  finalPrompt: '',
  copiedPrompt: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-black text-slate-500">{children}</span>;
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <textarea className="min-h-24 w-full rounded-xl border px-3 py-2 text-sm leading-6" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

function getConcern(id: string) {
  return CONCERN_OPTIONS.find((item) => item.id === id) ?? CONCERN_OPTIONS[0];
}

function getRole(response: PromptPracticeResponse) {
  if (response.customRole.trim()) return response.customRole.trim();
  return ROLE_OPTIONS.find((item) => item.id === response.roleId)?.promptText ?? ROLE_OPTIONS[0].promptText;
}

function buildStructuredPrompt(response: PromptPracticeResponse) {
  return `역할:\n${getRole(response)}\n\n맥락:\n${response.context.trim() || getConcern(response.concernId).context}\n\n지시/과제:\n${response.task.trim() || getConcern(response.concernId).task}\n\n형식:\n${response.format.trim() || DEFAULT_FORMAT}\n\n주의사항:\n- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 사용하지 마세요.\n- 고객을 점수화하거나 등급화하지 마세요.\n- 처방 가능성, 전환 가능성, 공략, 비교 우위 단정 표현은 피하세요.\n- AI 답변은 초안이며, 최종 판단과 수정은 팀장이 합니다.`;
}

function buildOutput(response: PromptPracticeResponse, prompt: string) {
  return `[3단계 결과: 일반 질문을 구조화 프롬프트로 바꾸기]\n\n[우리 팀 고민]\n${response.customConcern || getConcern(response.concernId).label}\n\n[일반 질문]\n${response.plainQuestion}\n\n[구조화 프롬프트]\n${prompt}\n\n[일반 질문과 구조화 질문의 차이 메모]\n${response.differenceMemo || '-'}\n\n[4단계 AI 전략 리서치로 넘길 질문]\n${response.task || '-'}`;
}

export function V39PromptPracticeLab() {
  const [storedResponse, setResponse] = useStored<PromptPracticeResponse>(V39_PROMPT_PRACTICE_STORAGE_KEY, DEFAULT_RESPONSE);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse, reviewChecks: storedResponse.reviewChecks ?? {} };
  const [copyMessage, setCopyMessage] = useState('');
  const currentConcern = getConcern(response.concernId);
  const structuredPrompt = useMemo(() => response.finalPrompt || buildStructuredPrompt(response), [response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<PromptPracticeResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const selectConcern = (concernId: string) => {
    const concern = getConcern(concernId);
    update({
      concernId,
      customConcern: '',
      plainQuestion: concern.plainQuestion,
      context: concern.context,
      task: concern.task,
      finalPrompt: '',
      aiPlainAnswer: '',
      aiStructuredAnswer: '',
      differenceMemo: '',
    });
  };

  const generatePrompt = () => {
    update({ finalPrompt: buildStructuredPrompt(response) });
    setCopyMessage('역할·맥락·지시/과제·형식 구조로 프롬프트를 만들었습니다. 실제 말투에 맞게 한 번 더 다듬어보세요.');
  };

  const copyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      update({ copiedPrompt: text });
      setCopyMessage(`${label}을 복사했습니다.`);
    } catch {
      setCopyMessage('복사가 차단되었습니다. 내용을 직접 선택해 복사하세요.');
    }
  };

  const outputText = buildOutput(response, structuredPrompt);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm leading-6 text-cyan-950">
        <p className="font-black">3단계. 일반 질문과 구조화 질문의 차이 체감하기</p>
        <p className="mt-1">AI가 없어도 팀장님들은 이미 고민을 정리하고 질문할 수 있습니다. 다만 AI를 쓰면 역할·맥락·지시/과제·형식으로 질문을 구조화해 답변의 깊이와 활용 가능성을 높일 수 있습니다.</p>
      </div>

      <section className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
          <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
          <p className="mt-1">팀장은 경험과 현장 감각으로 문제를 말하고, 선배·동료에게 조언을 구하고, 회의에서 방향을 잡을 수 있습니다.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">
          <p className="font-black">AI를 쓰면 좋아지는 점</p>
          <p className="mt-1">머릿속 고민을 더 빨리 꺼내고, 누구의 관점으로 볼지 정하고, 답변을 관리 지표·확인 질문·회의 문장 형태로 받을 수 있습니다.</p>
        </div>
      </section>

      <SectionCard title="Block 0. 우리 팀에 가까운 고민 선택">
        <div className="grid gap-3 md:grid-cols-2">
          {CONCERN_OPTIONS.map((item) => {
            const selected = response.concernId === item.id;
            return (
              <button key={item.id} type="button" className={`rounded-2xl border p-4 text-left text-sm font-bold leading-6 ${selected ? 'border-cyan-300 bg-cyan-50 text-cyan-950' : 'bg-white text-slate-700'}`} onClick={() => selectConcern(item.id)}>
                {item.label}
              </button>
            );
          })}
        </div>
        <label className="block space-y-1"><FieldLabel>우리 팀 고민 직접 입력</FieldLabel><input className="w-full rounded-xl border px-3 py-2 text-sm" value={response.customConcern} onChange={(event) => update({ customConcern: event.target.value })} placeholder="예: 대체 접점은 늘었지만 고객 반응을 어떻게 봐야 할지 애매하다" /></label>
      </SectionCard>

      <SectionCard title="Block 1. 일반 질문으로 먼저 물어보기">
        <p className="text-sm font-bold leading-6 text-slate-600">먼저 평소처럼 짧게 물어봅니다. 이 답변은 대체로 맞는 말이지만, 우리 팀 상황에 바로 쓰기에는 밋밋할 수 있습니다.</p>
        <label className="block space-y-1"><FieldLabel>일반 질문</FieldLabel><TextArea value={response.plainQuestion} onChange={(value) => update({ plainQuestion: value })} /></label>
        <button type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(response.plainQuestion, '일반 질문')}>일반 질문 복사</button>
        <label className="block space-y-1"><FieldLabel>일반 질문에 대한 AI 답변 붙여넣기</FieldLabel><TextArea value={response.aiPlainAnswer} onChange={(value) => update({ aiPlainAnswer: value })} placeholder="AI 답변을 붙여넣고, 답변이 왜 일반론처럼 느껴지는지 확인합니다." /></label>
      </SectionCard>

      <SectionCard title="Block 2. 역할·맥락·지시/과제·형식으로 재작성">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">
          <p className="font-black text-slate-950">역할은 “누구의 도움을 받을 것인가”입니다.</p>
          <p className="mt-1">추상적인 코치·전문가보다, 선배 팀장·본부장·영업기획 담당자·CRM/영업지원 담당자·컴플라이언스 담당자처럼 실제 현업에서 떠올릴 수 있는 사람의 관점을 선택합니다.</p>
        </div>
        <label className="block space-y-1"><FieldLabel>역할 선택</FieldLabel><select className="w-full rounded-xl border bg-white px-3 py-2 text-sm" value={response.roleId} onChange={(event) => update({ roleId: event.target.value, finalPrompt: '' })}>{ROLE_OPTIONS.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.useWhen}</option>)}</select></label>
        <label className="block space-y-1"><FieldLabel>역할 직접 수정</FieldLabel><input className="w-full rounded-xl border px-3 py-2 text-sm" value={response.customRole} onChange={(event) => update({ customRole: event.target.value, finalPrompt: '' })} placeholder={ROLE_OPTIONS[0].promptText} /></label>
        <label className="block space-y-1"><FieldLabel>맥락: 지금 우리 팀에 무슨 일이 벌어졌는가</FieldLabel><TextArea value={response.context} onChange={(value) => update({ context: value, finalPrompt: '' })} /></label>
        <label className="block space-y-1"><FieldLabel>지시/과제: AI에게 무엇을 해달라고 할 것인가</FieldLabel><TextArea value={response.task} onChange={(value) => update({ task: value, finalPrompt: '' })} /></label>
        <label className="block space-y-1"><FieldLabel>형식: 어떤 모양으로 받을 것인가</FieldLabel><TextArea value={response.format} onChange={(value) => update({ format: value, finalPrompt: '' })} /></label>
      </SectionCard>

      <SectionCard title="Block 3. 구조화 질문 생성과 답변 차이 비교">
        <div className="flex flex-wrap gap-2"><button type="button" className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-black text-white" onClick={generatePrompt}>구조화 프롬프트 생성</button><button type="button" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white" onClick={() => copyText(structuredPrompt, '구조화 프롬프트')}>구조화 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-black text-cyan-700">{copyMessage}</p> : null}
        <textarea className="min-h-72 w-full rounded-xl border px-3 py-2 font-mono text-xs leading-5" value={structuredPrompt} onChange={(event) => update({ finalPrompt: event.target.value })} />
        <label className="block space-y-1"><FieldLabel>구조화 질문에 대한 AI 답변 붙여넣기</FieldLabel><TextArea value={response.aiStructuredAnswer} onChange={(value) => update({ aiStructuredAnswer: value })} placeholder="구조화 질문으로 받은 답변을 붙여넣고, 일반 질문 답변과 차이를 비교합니다." /></label>
        <label className="block space-y-1"><FieldLabel>일반 질문과 구조화 질문의 차이 메모</FieldLabel><TextArea value={response.differenceMemo} onChange={(value) => update({ differenceMemo: value })} placeholder="예: 일반 질문은 원칙 중심이었지만, 구조화 질문은 우리 팀 상황·관리 지표·회의 문장까지 나왔다." /></label>
      </SectionCard>

      <SectionCard title="Block 4. 4단계 AI 전략 리서치로 넘길 질문 저장">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-950">
          <p className="font-black">이 결과가 4단계 입력값입니다.</p>
          <p className="mt-1">구조화 프롬프트를 바탕으로 다음 단계에서 AI 전략 리서치를 진행합니다. AI는 답을 대신 정하는 것이 아니라, 팀장의 고민을 더 빠르고 넓게 정리하게 돕습니다.</p>
        </div>
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm font-bold leading-5"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm font-bold text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs font-bold text-slate-500">자동 저장 키: {V39_PROMPT_PRACTICE_STORAGE_KEY} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default V39PromptPracticeLab;
