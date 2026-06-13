import { type ReactNode } from 'react';
import { useStored } from './journey-storage';

const V41_ONE_ON_ONE_MARKERS = [
  'V41OneOnOnePracticeLab',
  'v41 one-on-one practice lab cloned',
  'v41 one-on-one copy refined',
  '1on1 첫 문장',
  '첫 문장 만들기',
  '확인 질문 만들기',
  '작은 행동 합의하기',
  '대화 후 메모 남기기',
  'ckd.v41.peopleManagement.v2',
].join('|');
void V41_ONE_ON_ONE_MARKERS;

type PeopleState = Record<string, any> & {
  selectedMemberId?: string;
  observedFact?: string;
  interpretation?: string;
  conversationPurpose?: string;
  riskToAvoid?: string;
  firstQuestionFocus?: string;
  nextDialogueMemo?: string;
  openingLine?: string;
  checkQuestionOne?: string;
  checkQuestionTwo?: string;
  actionAgreement?: string;
  followUpMemo?: string;
};

const STORAGE_KEY = 'ckd.v41.peopleManagement.v2';
const DEFAULT_STATE: PeopleState = {};

function compact(value?: string) {
  return value?.trim() || '미작성';
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><textarea className="mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-fuchsia-700 focus:ring-2 focus:ring-fuchsia-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

export function V41OneOnOnePracticeLab() {
  const [state, setState] = useStored<PeopleState>(STORAGE_KEY, DEFAULT_STATE);
  const update = (patch: Partial<PeopleState>) => setState({ ...state, ...patch });

  const makeDialogue = () => update({
    openingLine: state.openingLine || `최근 실행 흐름을 보면서 함께 확인하고 싶은 부분이 있어요. 먼저 제가 본 사실부터 말씀드리고, 실제로는 어땠는지 같이 맞춰보고 싶습니다.`,
    checkQuestionOne: state.checkQuestionOne || `제가 본 것은 ${compact(state.observedFact)}입니다. 이 상황을 본인은 어떻게 보고 있나요?`,
    checkQuestionTwo: state.checkQuestionTwo || `다음 2주 동안 실행을 더 쉽게 하려면 어떤 지원이나 기준이 필요할까요?`,
    actionAgreement: state.actionAgreement || '다음 2주 동안 바로 시도할 작은 행동 1개와 금요일 점검에서 볼 증거 1개를 합의한다.',
    followUpMemo: state.followUpMemo || '성격이나 태도 평가가 아니라 관찰 사실, 실행 기준, 필요한 지원을 중심으로 대화를 마무리한다.',
  });

  return <section className="space-y-4">
    <section className="rounded-3xl border border-fuchsia-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-fuchsia-700">1on1 첫 문장</p>
      <h3 className="mt-1 text-xl font-black text-slate-950">첫 문장과 확인 질문을 준비합니다</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">Step 10에서 정리한 관찰 사실과 대화 목적을 바탕으로, 팀원이 방어하지 않고 말문을 열 수 있는 첫 문장을 만듭니다.</p>
    </section>

    <Card title="이전 단계에서 넘어온 1on1 메모">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
        <p><span className="font-black text-slate-700">관찰 사실: </span>{compact(state.observedFact)}</p>
        <p><span className="font-black text-slate-700">해석 또는 추정: </span>{compact(state.interpretation)}</p>
        <p><span className="font-black text-slate-700">대화 목적: </span>{compact(state.conversationPurpose)}</p>
        <p><span className="font-black text-slate-700">피해야 할 말: </span>{compact(state.riskToAvoid)}</p>
        <p><span className="font-black text-slate-700">첫 질문 초점: </span>{compact(state.firstQuestionFocus)}</p>
      </div>
    </Card>

    <Card title="첫 문장 만들기">
      <button type="button" className="rounded-xl bg-fuchsia-700 px-4 py-2 text-sm font-black text-white" onClick={makeDialogue}>첫 문장 초안 만들기</button>
      <Field label="첫 문장" value={state.openingLine ?? ''} onChange={(value) => update({ openingLine: value })} placeholder="비난이 아니라 관찰 사실을 함께 확인하는 문장으로 시작합니다." />
    </Card>

    <Card title="확인 질문 만들기">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="확인 질문 1" value={state.checkQuestionOne ?? ''} onChange={(value) => update({ checkQuestionOne: value })} placeholder="본인이 상황을 어떻게 보고 있는지 확인합니다." />
        <Field label="확인 질문 2" value={state.checkQuestionTwo ?? ''} onChange={(value) => update({ checkQuestionTwo: value })} placeholder="필요한 지원과 다음 행동을 확인합니다." />
      </div>
    </Card>

    <Card title="작은 행동 합의하기">
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="작은 행동 합의" value={state.actionAgreement ?? ''} onChange={(value) => update({ actionAgreement: value })} placeholder="다음 2주 동안 시도할 작은 행동 1개를 정합니다." />
        <Field label="대화 후 메모" value={state.followUpMemo ?? ''} onChange={(value) => update({ followUpMemo: value })} placeholder="대화 후 남길 메모와 후속 확인 기준을 씁니다." />
      </div>
    </Card>
  </section>;
}
