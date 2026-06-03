import { useMemo, useState } from 'react';
import { loadV39MemberRoleResult } from './journey-v39-member-role-result-store';
import {
  type V39PeopleDialogueResult,
  createEmptyV39PeopleDialogueResult,
  loadV39PeopleDialogueResult,
  normalizeV39PeopleDialogueResult,
  saveV39PeopleDialogueResult,
} from './journey-v39-people-dialogue-result-store';

type OptionItem = {
  id: string;
  label: string;
  description: string;
};

const CULTURE_SHIFT_OPTIONS: OptionItem[] = [
  { id: 'why-before-do', label: '예전에는 시키면 했는데, 지금은 왜 해야 하는지 묻는다.', description: '지시 수용 방식이 실행 전 맥락 확인으로 바뀐 장면입니다.' },
  { id: 'boundary', label: '예전에는 팀이 가족 같았는데, 지금은 개인의 경계를 더 중시한다.', description: '친밀함과 개인 영역의 기준이 달라진 장면입니다.' },
  { id: 'role-scope', label: '예전에는 힘든 일도 참고 했는데, 지금은 역할과 책임 범위를 묻는다.', description: '참고 버티기보다 책임 범위와 지원 기준을 확인하는 장면입니다.' },
  { id: 'informal', label: '예전에는 회식과 비공식 대화로 풀었는데, 지금은 그런 방식이 부담이 된다.', description: '관계 형성 방식이 공식적이고 선택적인 방식으로 바뀐 장면입니다.' },
  { id: 'evidence', label: '예전에는 상사의 경험을 믿고 따랐는데, 지금은 근거와 기준을 요구한다.', description: '경험 중심 소통에서 기준과 설명 중심 소통으로 바뀐 장면입니다.' },
  { id: 'senior-burden', label: '예전에는 경력자가 어려운 일을 맡는 것이 자연스러웠는데, 지금은 부담 편중으로 받아들인다.', description: '신뢰와 반복 부담을 구분해야 하는 장면입니다.' },
  { id: 'growth-life', label: '예전에는 조직을 위해 개인이 맞췄는데, 지금은 개인의 성장과 삶도 중요하게 본다.', description: '조직 기여와 개인 성장의 연결이 필요한 장면입니다.' },
  { id: 'senior-coaching', label: '예전에는 선배가 후배를 챙기는 것이 당연했는데, 지금은 그 역할도 부담으로 느낀다.', description: '후배 지원 역할에도 시간, 기준, 인정이 필요한 장면입니다.' },
];

const LEADER_FEELING_OPTIONS: OptionItem[] = [
  { id: 'authority', label: '내 권위가 약해지는 것 같다.', description: '설명을 요구받을 때 지시권이 흔들리는 느낌입니다.' },
  { id: 'talkback', label: '말대꾸처럼 느껴져 기분이 상한다.', description: '질문을 실행 품질 신호가 아니라 태도 문제로 볼 위험이 있습니다.' },
  { id: 'speed', label: '일일이 설명하다 보면 실행 속도가 늦어질 것 같다.', description: '납득과 속도 사이의 긴장입니다.' },
  { id: 'reverse-fairness', label: '기존 팀원들이 역차별을 느낄까 걱정된다.', description: '신세대 배려가 기존 팀원에게 기준 약화로 보일 수 있습니다.' },
  { id: 'retention', label: '젊은 팀원이 퇴사할까 봐 조심스럽다.', description: '필요한 피드백과 관계 유지 사이의 긴장입니다.' },
  { id: 'boundary', label: '어디까지 들어주고 어디부터 요구해야 할지 모르겠다.', description: '공감과 기준을 동시에 세워야 하는 상황입니다.' },
  { id: 'old-style', label: '내가 꼰대처럼 보일까 봐 피드백이 어렵다.', description: '불편한 피드백을 피하다가 기준이 흐려질 수 있습니다.' },
  { id: 'pressure', label: '상부는 빠른 실행을 요구하는데 팀원은 납득을 요구해 난처하다.', description: '위에서 내려오는 속도와 아래에서 올라오는 질문 사이의 압박입니다.' },
];

const NEW_GEN_SIGNAL_OPTIONS: OptionItem[] = [
  { id: 'why-me', label: '“왜 제가 해야 하나요?”', description: '역할 배정의 공정성과 이유를 확인하는 신호일 수 있습니다.' },
  { id: 'why-now', label: '“왜 지금 해야 하죠?”', description: '우선순위와 맥락을 확인하는 신호일 수 있습니다.' },
  { id: 'meaning', label: '“이게 무슨 의미가 있나요?”', description: '목적과 성장 연결을 요구하는 신호일 수 있습니다.' },
  { id: 'method', label: '“꼭 이 방식으로 해야 하나요?”', description: '방법의 자율성과 효율성을 확인하는 신호일 수 있습니다.' },
  { id: 'risk', label: '“문제 생기면 책임은 누가 지나요?”', description: '리스크 안전선과 지원 범위를 확인하는 신호일 수 있습니다.' },
  { id: 'after-hours', label: '“퇴근 후 연락은 부담스럽습니다.”', description: '개인 경계와 업무 기준을 확인하는 신호일 수 있습니다.' },
  { id: 'scope', label: '“그건 제 업무 범위가 아닌 것 같습니다.”', description: '역할 경계와 기대 수준을 다시 합의해야 하는 신호일 수 있습니다.' },
];

const EXISTING_MEMBER_SIGNAL_OPTIONS: OptionItem[] = [
  { id: 'hard-customer-again', label: '어려운 고객이 반복해서 배정된다.', description: '신뢰가 반복 부담으로 받아들여질 수 있습니다.' },
  { id: 'new-gen-care', label: '신세대 사원만 세심하게 배려받는다고 느낀다.', description: '설명과 지원의 균형이 기존 팀원에게도 필요합니다.' },
  { id: 'taken-for-granted', label: '내 경험과 기여가 당연하게 취급된다고 느낀다.', description: '조용한 기여도 구체적으로 인정해야 합니다.' },
  { id: 'coaching-burden', label: '후배 코칭 부담이 공식 역할 없이 추가된다고 느낀다.', description: '후배 지원에는 시간, 기준, 인정이 함께 필요합니다.' },
  { id: 'old-success-denied', label: '새로운 방식이 내 기존 성공 경험을 부정한다고 느낀다.', description: '경험을 변화의 장애물이 아니라 검증 자산으로 전환해야 합니다.' },
  { id: 'leader-watches-young', label: '팀장이 젊은 직원 눈치를 본다고 느낀다.', description: '배려가 기준 약화로 보이지 않게 역할 기준을 공개해야 합니다.' },
  { id: 'standards-weakened', label: '자율이라는 이름으로 팀 기준이 약해진다고 느낀다.', description: '자율과 책임의 경계를 분명히 해야 합니다.' },
  { id: 'ai-discounts-field', label: 'AI 활용이 현장 경험을 가볍게 보는 것처럼 느껴진다.', description: 'AI 결과를 기존 팀원의 현장 경험으로 검증하게 해야 합니다.' },
];

const CONFLICT_TYPE_OPTIONS: OptionItem[] = [
  { id: 'meaning', label: '의미 갈등', description: '이 일을 왜 해야 하는지 설명했는지 점검합니다.' },
  { id: 'fairness', label: '공정성 갈등', description: '역할 배정 기준을 말할 수 있는지 점검합니다.' },
  { id: 'autonomy', label: '자율성 갈등', description: '결과 기준과 방법 자율성을 구분했는지 점검합니다.' },
  { id: 'scope', label: '업무 범위 갈등', description: '역할 기대와 예외 상황을 합의했는지 점검합니다.' },
  { id: 'growth', label: '성장 기대 갈등', description: '이 일이 팀원의 성장과 어떻게 연결되는지 점검합니다.' },
  { id: 'boundary', label: '관계 경계 갈등', description: '친밀함을 소속감으로 착각하고 있지는 않은지 점검합니다.' },
  { id: 'risk', label: '리스크 책임 갈등', description: '문제 발생 시 지원과 보고 기준을 분명히 했는지 점검합니다.' },
  { id: 'senior-burden', label: '기존 팀원 부담 갈등', description: '믿는 사람에게 어려운 일을 반복 배정하고 있지는 않은지 점검합니다.' },
  { id: 'stereotype', label: '세대 고정관념 갈등', description: '팀원을 세대별 특성으로 단정하고 있지 않은지 점검합니다.' },
];

const DIALOGUE_STRATEGY_OPTIONS: OptionItem[] = [
  { id: 'context', label: '맥락 설명하기', description: '왜 이 일이 필요한지 고객·팀 목표와 연결합니다.' },
  { id: 'criteria', label: '역할 기준 공개하기', description: '누가 왜 맡는지 기준을 설명합니다.' },
  { id: 'growth', label: '성장 의미 연결하기', description: '역할을 팀원의 성장 과제와 연결합니다.' },
  { id: 'choice', label: '선택권 부여하기', description: '결과 기준은 명확히 하되 방법의 자율성을 줍니다.' },
  { id: 'expectation', label: '기대 수준 재합의하기', description: '역할 범위, 보고 기준, 예외 상황을 다시 합의합니다.' },
  { id: 'burden', label: '부담 인정하기', description: '반복 부담과 기존 기여를 구체적으로 인정합니다.' },
  { id: 'risk', label: '리스크 안전선 확인하기', description: '문제 발생 시 지원과 보고 기준을 명확히 합니다.' },
  { id: 'norm', label: '팀 규범으로 전환하기', description: '개인 갈등을 팀의 질문·보고·역할 규범으로 바꿉니다.' },
];

function getLabels(options: OptionItem[], ids: string[]) {
  return ids.map((id) => options.find((item) => item.id === id)?.label ?? id);
}

function ToggleCard({ item, selected, disabled, onToggle }: { item: OptionItem; selected: boolean; disabled?: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`rounded-2xl border p-4 text-left shadow-sm ${selected ? 'border-violet-300 bg-white text-violet-950' : disabled ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-700'}`}
      onClick={onToggle}
    >
      <p className="text-sm font-black">{item.label}</p>
      <p className="mt-2 text-xs font-bold leading-5">{item.description}</p>
    </button>
  );
}

function buildPeopleDialoguePrompt(result: V39PeopleDialogueResult) {
  return [
    '당신은 서로 다른 일하는 방식과 기대를 가진 팀장과 팀원 사이의 실행 대화를 돕는 리더십 코치입니다.',
    '',
    '[안전선]',
    '- 특정 세대를 이기적이거나 예민하다고 단정하지 마세요.',
    '- 기존 팀원을 변화 저항자로 단정하지 마세요.',
    '- 팀장의 당혹감과 실행 압박도 함께 인정해 주세요.',
    '- 공감만 하지 말고 역할 기준, 책임 범위, 지원 방식, 리스크 안전선을 함께 담아 주세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 사용하지 마세요.',
    '',
    '[팀장이 체감한 일하는 방식 변화]',
    getLabels(CULTURE_SHIFT_OPTIONS, result.cultureShiftSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[팀장의 당혹감]',
    getLabels(LEADER_FEELING_OPTIONS, result.leaderFeelingSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[신세대 팀원 반응 신호]',
    getLabels(NEW_GEN_SIGNAL_OPTIONS, result.newGenSignalSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[기존 팀원 부담 신호]',
    getLabels(EXISTING_MEMBER_SIGNAL_OPTIONS, result.existingMemberSignalSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[갈등 유형]',
    getLabels(CONFLICT_TYPE_OPTIONS, result.conflictTypeSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[팀장 대화 전략]',
    getLabels(DIALOGUE_STRATEGY_OPTIONS, result.dialogueStrategySelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[요청]',
    '역할 배정 이후 팀장이 팀원과 나눌 실행 대화 스크립트를 작성해 주세요.',
    '출력 형식은 다음과 같습니다.',
    '1. 상황 요약',
    '2. 팀장이 오해하기 쉬운 지점',
    '3. 신세대 팀원이 확인하고 싶은 것',
    '4. 기존 팀원이 불편해할 수 있는 것',
    '5. 팀장이 먼저 꺼낼 말',
    '6. 팀원이 물을 수 있는 질문 3개',
    '7. 팀장의 답변 예시',
    '8. 합의할 실행 기준',
    '9. 피해야 할 말',
    '10. 대체 문장',
  ].join('\n');
}

function defaultDialogueCard(): V39PeopleDialogueResult['dialogueCard'] {
  return {
    targetMember: '신세대 팀원 또는 기존 팀원 중 대화가 필요한 대상',
    expectedReaction: '역할 배정 이유, 공정성, 부담, 책임 범위를 확인할 가능성이 있습니다.',
    leaderMisreadRisk: '질문을 말대꾸나 변화 저항으로 해석할 수 있습니다.',
    realNeed: '역할 기준, 성장 의미, 부담 조정, 리스크 안전선에 대한 확인이 필요합니다.',
    openingLine: '이번 역할을 그냥 배정하려는 것이 아니라, 고객 상황과 팀의 실행 기준을 함께 맞추기 위해 먼저 설명드리겠습니다.',
    likelyQuestions: '왜 제가 맡아야 하나요? / 기존 업무와 어떻게 조정하나요? / 문제가 생기면 어떤 지원을 받을 수 있나요?',
    leaderResponse: '맡기는 이유와 기준은 분명히 설명하겠습니다. 동시에 실행 방법은 함께 조정하고, 리스크가 있는 부분은 제가 사전에 확인하겠습니다.',
    agreementCriteria: '역할 범위, 2주 실행 기준, 보고 시점, 리스크 공유 기준을 합의합니다.',
    leaderSupport: '방문 전 질문, 자료 사용 범위, 고객 부담 신호, CRM 기록 기준을 함께 점검합니다.',
    avoidPhrase: '그냥 해보세요. / 우리 때는 다 했습니다. / 예민하게 생각하지 마세요.',
    alternativePhrase: '이 역할을 맡기는 이유와 지원 기준을 먼저 설명드리겠습니다. 부담이 되는 지점도 함께 조정하겠습니다.',
  };
}

export function V39PeopleDialogueLab() {
  const [result, setResult] = useState(() => loadV39PeopleDialogueResult());
  const [copied, setCopied] = useState(false);
  const roleResult = useMemo(() => loadV39MemberRoleResult(), []);
  const savedRoleCount = Object.values(roleResult.roles).filter((role) => role.roleMission.trim()).length;
  const prompt = useMemo(() => buildPeopleDialoguePrompt(result), [result]);

  const persist = (patch: Partial<V39PeopleDialogueResult>) => {
    setResult((current) => {
      const next = normalizeV39PeopleDialogueResult({ ...current, ...patch });
      saveV39PeopleDialogueResult(next);
      return next;
    });
  };

  const toggleSelection = (field: keyof Pick<V39PeopleDialogueResult, 'cultureShiftSelections' | 'leaderFeelingSelections' | 'newGenSignalSelections' | 'existingMemberSignalSelections' | 'conflictTypeSelections' | 'dialogueStrategySelections'>, id: string, limit?: number) => {
    const current = result[field];
    const exists = current.includes(id);
    const next = exists ? current.filter((item) => item !== id) : limit && current.length >= limit ? current : [...current, id];
    persist({ [field]: next } as Partial<V39PeopleDialogueResult>);
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const applyDialogueDraft = () => {
    persist({ dialogueCard: { ...result.dialogueCard, ...defaultDialogueCard() } });
  };

  const resetDialogue = () => {
    const empty = createEmptyV39PeopleDialogueResult();
    saveV39PeopleDialogueResult(empty);
    setResult(empty);
  };

  return (
    <section className="space-y-4">
      <section className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-violet-50 px-4 py-2 text-sm font-black text-violet-700">
              <span>↔</span>
              <span>9단계 사람관리 실행 대화</span>
            </div>
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">팀원 온도차를 실행 대화로 전환하기</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">
              이 단계는 팀원을 세대별로 평가하거나 분류하는 단계가 아닙니다. 역할 배정 이후 팀원이 느낄 수 있는 의미, 공정성, 부담, 성장 기대, 자율성, 리스크 우려를 읽고 팀장이 실행을 이끌기 위한 대화 전략을 설계합니다.
            </p>
            <div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50 p-5 text-sm font-bold leading-6 text-violet-950">
              신세대 팀원을 단정하지 않고, 기존 팀원의 누적 부담도 함께 봅니다. 질문은 반대가 아니라 실행 품질을 높이기 위한 확인일 수 있습니다.
            </div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-black text-violet-950">일하는 방식 변화 {result.cultureShiftSelections.length} / 3</div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">팀장 당혹감 {result.leaderFeelingSelections.length} / 3</div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-black text-sky-950">역할 정리 결과 {savedRoleCount}개</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Block 0</p>
        <h3 className="text-xl font-black text-slate-950">과거와 현재의 일하는 방식 차이 보기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">팀장님이 최근 가장 크게 체감하는 일하는 방식의 변화를 최대 3개까지 선택하세요.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {CULTURE_SHIFT_OPTIONS.map((item) => {
            const selected = result.cultureShiftSelections.includes(item.id);
            return <ToggleCard key={item.id} item={item} selected={selected} disabled={!selected && result.cultureShiftSelections.length >= 3} onToggle={() => toggleSelection('cultureShiftSelections', item.id, 3)} />;
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 1</p>
        <h3 className="text-xl font-black text-slate-950">팀장이 느끼는 당혹감 선택</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">팀장의 감정도 중요한 Data입니다. 지금 가장 먼저 드는 생각을 최대 3개 선택하세요.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {LEADER_FEELING_OPTIONS.map((item) => {
            const selected = result.leaderFeelingSelections.includes(item.id);
            return <ToggleCard key={item.id} item={item} selected={selected} disabled={!selected && result.leaderFeelingSelections.length >= 3} onToggle={() => toggleSelection('leaderFeelingSelections', item.id, 3)} />;
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-sky-700">Block 2-3</p>
        <h3 className="text-xl font-black text-slate-950">신세대 팀원과 기존 팀원의 반응 함께 읽기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">신세대 팀원의 질문과 기존 팀원의 부담 신호를 함께 봐야 역할 배정 이후의 실행 대화가 흔들리지 않습니다.</p>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
            <h4 className="font-black text-slate-950">신세대 팀원 반응 신호</h4>
            <div className="mt-3 grid gap-3">
              {NEW_GEN_SIGNAL_OPTIONS.map((item) => <ToggleCard key={item.id} item={item} selected={result.newGenSignalSelections.includes(item.id)} onToggle={() => toggleSelection('newGenSignalSelections', item.id)} />)}
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <h4 className="font-black text-slate-950">기존 팀원 부담 신호</h4>
            <div className="mt-3 grid gap-3">
              {EXISTING_MEMBER_SIGNAL_OPTIONS.map((item) => <ToggleCard key={item.id} item={item} selected={result.existingMemberSignalSelections.includes(item.id)} onToggle={() => toggleSelection('existingMemberSignalSelections', item.id)} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-rose-700">Block 4-6</p>
        <h3 className="text-xl font-black text-slate-950">갈등 유형과 팀장 대화 전략 선택</h3>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          <div>
            <h4 className="font-black text-slate-950">갈등 유형</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {CONFLICT_TYPE_OPTIONS.map((item) => <ToggleCard key={item.id} item={item} selected={result.conflictTypeSelections.includes(item.id)} onToggle={() => toggleSelection('conflictTypeSelections', item.id)} />)}
            </div>
          </div>
          <div>
            <h4 className="font-black text-slate-950">팀장 대화 전략</h4>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {DIALOGUE_STRATEGY_OPTIONS.map((item) => <ToggleCard key={item.id} item={item} selected={result.dialogueStrategySelections.includes(item.id)} onToggle={() => toggleSelection('dialogueStrategySelections', item.id)} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Block 7</p>
        <h3 className="text-xl font-black text-slate-950">AI 실행 대화 스크립트 프롬프트 준비</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI에게 팀원 세대를 단정하게 하지 말고, 역할 기준·책임 범위·지원 방식·리스크 안전선을 포함한 실행 대화 스크립트를 요청합니다.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white" onClick={copyPrompt}>{copied ? '프롬프트 복사 완료' : '실행 대화 프롬프트 복사'}</button>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-sm font-black text-slate-700" onClick={resetDialogue}>입력 초기화</button>
        </div>
        <textarea className="mt-4 min-h-80 w-full rounded-2xl border bg-white px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={prompt} readOnly />
        <label className="mt-4 block space-y-1">
          <span className="text-xs font-black text-slate-600">AI 결과 붙여넣기</span>
          <textarea className="min-h-32 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6" value={result.rawAiDialogueResult} onChange={(event) => persist({ rawAiDialogueResult: event.target.value })} placeholder="AI가 만든 실행 대화 스크립트 초안을 붙여넣고, 아래 카드에서 팀장 언어로 수정하세요." />
        </label>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Block 8-9</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">팀원 실행 대화 카드와 우리 팀 규범 정리</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI 초안은 그대로 쓰지 않고, 우리 팀 맥락에 맞게 팀장이 수정합니다.</p>
          </div>
          <button type="button" className="rounded-2xl border bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-800" onClick={applyDialogueDraft}>대화 카드 초안 가져오기</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Object.entries(result.dialogueCard).map(([key, value]) => {
            const labels: Record<string, string> = {
              targetMember: '대상 팀원', expectedReaction: '예상 반응', leaderMisreadRisk: '팀장이 오해하기 쉬운 지점', realNeed: '팀원이 실제로 확인하고 싶은 것', openingLine: '팀장이 먼저 꺼낼 말', likelyQuestions: '팀원이 물을 수 있는 질문', leaderResponse: '팀장의 답변 문장', agreementCriteria: '합의할 실행 기준', leaderSupport: '팀장이 지원할 것', avoidPhrase: '피해야 할 말', alternativePhrase: '대체 문장',
            };
            return (
              <label key={key} className={key === 'openingLine' || key === 'leaderResponse' || key === 'agreementCriteria' ? 'space-y-1 md:col-span-2' : 'space-y-1'}>
                <span className="text-xs font-black text-slate-500">{labels[key]}</span>
                <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={value} onChange={(event) => persist({ dialogueCard: { ...result.dialogueCard, [key]: event.target.value } })} />
              </label>
            );
          })}
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">우리 팀 실행 대화 규범 5가지</span>
            <textarea className="min-h-32 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.teamNorms} onChange={(event) => persist({ teamNorms: event.target.value })} placeholder="예: 질문은 반대가 아니라 실행 품질을 높이기 위한 확인으로 다룬다. 역할 배정에는 기준과 지원을 함께 설명한다." />
          </label>
        </div>
      </section>
    </section>
  );
}
