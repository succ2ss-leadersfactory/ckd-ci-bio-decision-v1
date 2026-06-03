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

type DialoguePurpose = OptionItem & {
  mustInclude: string[];
  familiarOpening: string;
  purposeFitOpening: string;
};

type ConversationSituation = OptionItem & {
  quote: string;
  likelyNewGenPerception: string;
  likelyExistingPerception: string;
  missingInformation: string;
  recommendedPurposeId: string;
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

const CURRENT_WORK_OPTIONS: OptionItem[] = [
  { id: 'questions-visible', label: '예전에는 속으로 생각하던 질문이 지금은 겉으로 표현된다.', description: '질문이 새로 생긴 것이 아니라 표현 방식이 달라진 것입니다.' },
  { id: 'purpose-before-effort', label: '무조건 열심히보다 왜 하는지와 어디까지 할지가 중요해졌다.', description: '노력 요구만으로는 실행 품질을 안정적으로 만들기 어렵습니다.' },
  { id: 'boundary-visible', label: '업무와 개인 영역의 경계가 더 분명하게 드러난다.', description: '경계 표현은 관계 거절이 아니라 지속 가능한 실행 조건 확인일 수 있습니다.' },
  { id: 'fairness-visible', label: '공정성, 부담, 성장 기회에 대한 민감도가 높아졌다.', description: '역할 배정의 이유와 지원 기준을 설명해야 하는 장면이 늘었습니다.' },
  { id: 'senior-silence', label: '기존 팀원은 말없이 버티지만 속으로는 부담을 쌓을 수 있다.', description: '침묵을 동의로 해석하면 반복 부담과 냉소가 커질 수 있습니다.' },
  { id: 'leader-middle', label: '팀장은 위의 기대와 아래의 질문 사이에서 메시지를 조율해야 한다.', description: '팀장은 단순 전달자가 아니라 실행 가능 언어로 바꾸는 사람입니다.' },
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

const DIALOGUE_PURPOSES: DialoguePurpose[] = [
  {
    id: 'assign-work',
    label: '일을 맡기는 대화',
    description: '역할 배정 이유와 실행 기준을 분명히 합니다.',
    mustInclude: ['왜 이 일인가', '왜 이 팀원인가', '어디까지 하면 되는가', '무엇을 지원할 것인가', '리스크는 언제 공유할 것인가'],
    familiarOpening: '이번 건은 맡아주세요. 일단 해보면 감이 올 겁니다.',
    purposeFitOpening: '이번 역할을 맡기는 이유와 실행 기준을 먼저 설명드리겠습니다. 혼자 감당하라는 뜻은 아니고, 제가 지원할 부분도 함께 정하겠습니다.',
  },
  {
    id: 'explain-direction',
    label: '이유와 방향을 설명하는 대화',
    description: '왜 지금 해야 하는지와 무엇이 중요한지 납득시킵니다.',
    mustInclude: ['왜 지금인가', '무엇이 중요한가', '우선순위는 무엇인가', '이번 실행의 성공 기준은 무엇인가'],
    familiarOpening: '급하니까 이번 주 안에 정리해 주세요.',
    purposeFitOpening: '이번 일을 지금 해야 하는 이유부터 말씀드리겠습니다. 이번 주 목표는 많이 하는 것이 아니라 확인해야 할 신호를 정확히 남기는 것입니다.',
  },
  {
    id: 'listen-first',
    label: '먼저 들어보는 대화',
    description: '팀원의 진짜 우려와 요구를 확인합니다.',
    mustInclude: ['먼저 듣기', '불만을 구체화하기', '감정과 사실 구분하기', '듣는 것과 모두 수용하는 것 구분하기'],
    familiarOpening: '그렇게 생각하지 마세요. 다들 힘든 건 마찬가지입니다.',
    purposeFitOpening: '그렇게 느낀 이유를 먼저 들어보겠습니다. 다 들어준다는 뜻은 아니지만, 정확히 알아야 조정할 수 있습니다.',
  },
  {
    id: 'set-boundary',
    label: '기준과 경계를 정하는 대화',
    description: '자율, 책임, 업무 범위, 보고 기준을 정합니다.',
    mustInclude: ['자율 영역', '반드시 지켜야 할 기준', '보고 시점', '리스크 발생 시 행동'],
    familiarOpening: '알아서 해주세요. 문제 있으면 그때 말하고요.',
    purposeFitOpening: '방법은 제안해도 좋습니다. 다만 반드시 지켜야 할 기준은 먼저 맞추겠습니다. 이 기준 안에서 실행 방법을 정해 주세요.',
  },
  {
    id: 'correct-action',
    label: '바로잡는 대화',
    description: '행동의 영향과 다음 행동 기준을 합의합니다.',
    mustInclude: ['관찰 가능한 행동', '그 행동의 영향', '다음 행동 기준', '지원 방식'],
    familiarOpening: '왜 이렇게 했습니까? 이건 기본 아닌가요?',
    purposeFitOpening: '이번 기록에서 빠진 부분을 같이 보겠습니다. 문제는 양이 아니라 다음 방문 준비에 필요한 신호가 남지 않았다는 점입니다.',
  },
  {
    id: 'align-tension',
    label: '불만과 온도차를 조율하는 대화',
    description: '세대·연차·부담의 차이를 팀 기준으로 전환합니다.',
    mustInclude: ['개인 비난 금지', '양쪽의 부담 인정', '역할 기준 공개', '지원과 책임 동시 설정', '팀 규범으로 전환'],
    familiarOpening: '서로 이해하고 이번만 좋게 넘어갑시다.',
    purposeFitOpening: '이 문제를 개인 성향 문제로 보지는 않겠습니다. 역할 기준과 부담 배분을 다시 확인하고, 우리 팀 기준으로 정리하겠습니다.',
  },
  {
    id: 'recognize-motivate',
    label: '기여를 인정하고 힘을 주는 대화',
    description: '기여를 구체적으로 인정하고 다음 역할에 대한 에너지를 만듭니다.',
    mustInclude: ['구체적 기여', '팀에 준 영향', '반복 부담 인정', '다음 지원 기준'],
    familiarOpening: '잘하고 있으니까 이번에도 부탁드립니다.',
    purposeFitOpening: '지금까지 안정적으로 대응해 주신 덕분에 팀 리스크가 줄었습니다. 다만 계속 같은 부담이 반복되지 않도록 이번에는 지원과 분담 기준을 함께 정하겠습니다.',
  },
  {
    id: 'delegate-growth',
    label: '성장 과제로 연결하는 대화',
    description: '일을 성장 경험과 자율 책임으로 전환합니다.',
    mustInclude: ['성장 포인트', '자율 영역', '중간 점검 방식', '팀장이 도울 부분'],
    familiarOpening: '이것도 해봐야 배웁니다. 한번 맡아보세요.',
    purposeFitOpening: '이번 일은 단순한 자료 정리가 아니라 고객 반응을 읽는 훈련이 될 수 있습니다. 먼저 초안을 만들고, 제가 질문 구조를 함께 보겠습니다.',
  },
];

const CONVERSATION_SITUATIONS: ConversationSituation[] = [
  {
    id: 'why-me',
    label: '“왜 제가 해야 하나요?”',
    description: '신세대 팀원이 역할 배정 이유를 묻는 상황입니다.',
    quote: '박재욱 사원에게 신규 고객군 반응 정리를 맡기자 “제가 이 고객군을 맡아야 하는 이유가 있나요?”라고 묻습니다. 회의실 분위기가 잠시 멈춥니다.',
    likelyNewGenPerception: '역할 기준, 성장 의미, 지원 범위를 확인하고 싶을 수 있습니다.',
    likelyExistingPerception: '기존 팀원은 “예전에는 그냥 했는데 너무 설명이 많아졌다”고 느낄 수 있습니다.',
    missingInformation: '왜 이 사람인지, 어디까지 하면 되는지, 팀장이 무엇을 지원할지 설명이 필요합니다.',
    recommendedPurposeId: 'assign-work',
  },
  {
    id: 'again-senior',
    label: '“이번에도 제가 맡습니까?”',
    description: '기존 팀원이 어려운 고객 반복 배정에 부담을 느끼는 상황입니다.',
    quote: '김문호 차장은 최근 민감한 고객 대응을 반복해서 맡고 있습니다. “팀장님, 이번에도 제가 맡는 겁니까? 어려운 고객은 늘 저한테 오는 것 같습니다.”라고 말합니다.',
    likelyNewGenPerception: '어려운 일은 선배에게만 가고 자신은 성장 기회를 덜 받는다고 느낄 수 있습니다.',
    likelyExistingPerception: '믿는다는 말로 어려운 일을 반복해서 맡긴다고 느낄 수 있습니다.',
    missingInformation: '반복 부담 인정, 역할 분담 방식, 팀장의 지원 기준, 후속 기록 분담 기준이 필요합니다.',
    recommendedPurposeId: 'recognize-motivate',
  },
  {
    id: 'after-hours',
    label: '“퇴근 후 연락은 부담스럽습니다.”',
    description: '업무 긴급성과 개인 경계가 충돌하는 상황입니다.',
    quote: '팀장이 저녁에 단톡방에 내일 오전까지 확인할 자료를 올렸고, 다음 날 팀원이 “퇴근 후 업무 연락은 조금 부담스럽습니다.”라고 말합니다.',
    likelyNewGenPerception: '업무와 개인 시간의 경계, 긴급 기준, 사전 예고를 확인하고 싶을 수 있습니다.',
    likelyExistingPerception: '기존 팀원은 “우리는 그런 말도 못 했는데”라는 상대적 감정을 가질 수 있습니다.',
    missingInformation: '긴급 연락 기준, 다음 날 처리 가능 여부, 예외 상황, 팀 공통 규범이 필요합니다.',
    recommendedPurposeId: 'set-boundary',
  },
  {
    id: 'too-much-care',
    label: '“요즘 직원들에게 너무 맞춰주는 것 아닙니까?”',
    description: '기존 팀원이 기준 약화와 역차별을 느끼는 상황입니다.',
    quote: '회의 후 기존 팀원이 따로 와서 “팀장님, 요즘 젊은 직원들에게 너무 맞춰주는 것 아닙니까? 저희 때는 그냥 했습니다.”라고 말합니다.',
    likelyNewGenPerception: '자신들의 질문이 팀 내에서 불편하게 받아들여진다고 느낄 수 있습니다.',
    likelyExistingPerception: '기준이 약해지고 부담이 기존 팀원에게 남는다고 느낄 수 있습니다.',
    missingInformation: '질문 허용 기준, 역할 기준, 부담 배분 기준, 팀 공통 실행 규범이 필요합니다.',
    recommendedPurposeId: 'align-tension',
  },
  {
    id: 'inefficient',
    label: '“이 방식은 비효율적인 것 같습니다.”',
    description: '팀원이 기존 방식의 비효율을 지적하는 상황입니다.',
    quote: '고객 방문 보고 양식을 기존 방식대로 작성하라고 하자 팀원이 “이 양식은 중복 입력이 많아서 비효율적인 것 같습니다.”라고 말합니다.',
    likelyNewGenPerception: '방식 개선 제안과 자율성을 표현한 것일 수 있습니다.',
    likelyExistingPerception: '기존 팀원은 기본도 하기 전에 방식부터 문제 삼는다고 느낄 수 있습니다.',
    missingInformation: '바꿀 수 있는 영역, 반드시 지켜야 할 기준, 개선 제안 검토 방식이 필요합니다.',
    recommendedPurposeId: 'set-boundary',
  },
  {
    id: 'coaching-burden',
    label: '“후배 코칭까지 제 일인가요?”',
    description: '기존 팀원이 후배 지원 부담을 느끼는 상황입니다.',
    quote: '팀장이 기존 팀원에게 후배 동행과 코칭을 부탁하자 “후배를 도와주는 건 좋은데, 제 고객 관리도 빠듯합니다.”라고 말합니다.',
    likelyNewGenPerception: '후배는 선배에게 묻는 것이 부담스러워질 수 있습니다.',
    likelyExistingPerception: '공식 역할, 시간, 인정 없이 추가 부담이 생겼다고 느낄 수 있습니다.',
    missingInformation: '코칭 범위, 시간 배분, 인정 방식, 팀장의 지원 기준이 필요합니다.',
    recommendedPurposeId: 'recognize-motivate',
  },
  {
    id: 'record-missing',
    label: '고객 질문이 CRM 기록에서 빠졌습니다.',
    description: '팀원의 실행 결과를 바로잡아야 하는 상황입니다.',
    quote: '고객 방문 후 CRM 기록에 방문 사실은 남았지만 고객이 실제로 한 질문과 다음 확인 내용이 빠져 있습니다. 다음 방문 준비가 어려워졌습니다.',
    likelyNewGenPerception: '무엇이 문제인지보다 비난받는 느낌을 먼저 받을 수 있습니다.',
    likelyExistingPerception: '기록 기준이 계속 바뀐다고 느낄 수 있습니다.',
    missingInformation: '무엇이 빠졌는지, 왜 중요한지, 다음부터 무엇을 남겨야 하는지 기준이 필요합니다.',
    recommendedPurposeId: 'correct-action',
  },
  {
    id: 'growth-meaning',
    label: '“이 일이 제 성장에 도움이 되나요?”',
    description: '팀원이 업무의 성장 의미를 확인하는 상황입니다.',
    quote: '신입 팀원에게 고객 반응 정리 업무를 맡기자 “이 일이 제 성장에 어떤 도움이 되나요?”라고 묻습니다.',
    likelyNewGenPerception: '반복 업무라도 학습 포인트와 성장 의미를 알고 싶을 수 있습니다.',
    likelyExistingPerception: '기존 팀원은 기본 업무에도 의미를 붙여야 하느냐고 느낄 수 있습니다.',
    missingInformation: '이 업무가 키우는 역량, 자율 영역, 중간 점검 방식이 필요합니다.',
    recommendedPurposeId: 'delegate-growth',
  },
];

const FAMILIAR_OPENINGS: OptionItem[] = [
  { id: 'just-do', label: '“일단 해보세요. 해보면 압니다.”', description: '빠른 실행을 만들 수 있지만 이유와 기준이 빠질 수 있습니다.' },
  { id: 'team-decided', label: '“팀에서 정한 역할이니 이번에는 맡아주세요.”', description: '역할 기준을 설명하지 않으면 순응만 요구하는 말로 들릴 수 있습니다.' },
  { id: 'best-person', label: '“당신이 제일 안정적이라 이번에도 부탁합니다.”', description: '신뢰의 표현이 반복 부담으로 들릴 수 있습니다.' },
  { id: 'basic', label: '“이 정도는 알아서 해야죠.”', description: '자율이 아니라 방치나 질책으로 들릴 수 있습니다.' },
  { id: 'old-days', label: '“우리 때는 이런 것도 다 하면서 배웠습니다.”', description: '과거 방식으로 현재 팀원을 평가하는 말로 들릴 수 있습니다.' },
  { id: 'custom', label: '직접 입력하겠습니다.', description: '내가 평소 실제로 할 법한 첫마디를 적습니다.' },
];

function getLabels(options: OptionItem[], ids: string[]) {
  return ids.map((id) => options.find((item) => item.id === id)?.label ?? id);
}

function findPurpose(id: string) {
  return DIALOGUE_PURPOSES.find((item) => item.id === id);
}

function findSituation(id: string) {
  return CONVERSATION_SITUATIONS.find((item) => item.id === id);
}

function findFamiliarOpening(id: string) {
  return FAMILIAR_OPENINGS.find((item) => item.id === id);
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

function SingleSelectCard({ item, selected, onSelect }: { item: OptionItem; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className={`rounded-2xl border p-4 text-left shadow-sm ${selected ? 'border-slate-900 bg-slate-900 text-white' : 'bg-white text-slate-700'}`}
      onClick={onSelect}
    >
      <p className="text-sm font-black">{item.label}</p>
      <p className={`mt-2 text-xs font-bold leading-5 ${selected ? 'text-slate-100' : 'text-slate-500'}`}>{item.description}</p>
    </button>
  );
}

function getSelectedFamiliarOpening(result: V39PeopleDialogueResult) {
  if (result.familiarOpeningId === 'custom') return result.familiarOpeningCustom || '직접 입력한 첫마디가 아직 없습니다.';
  return findFamiliarOpening(result.familiarOpeningId)?.label || '아직 선택하지 않았습니다.';
}

function buildPeopleDialoguePrompt(result: V39PeopleDialogueResult) {
  const situation = findSituation(result.conversationSituationId);
  const purpose = findPurpose(result.dialoguePurposeId);

  return [
    '당신은 서로 다른 일하는 방식과 기대를 가진 팀장과 팀원 사이의 실행 대화를 돕는 리더십 코치입니다.',
    '',
    '[안전선]',
    '- 특정 세대를 이기적이거나 예민하다고 단정하지 마세요.',
    '- 기존 팀원을 변화 저항자로 단정하지 마세요.',
    '- 팀장의 당혹감과 실행 압박도 함께 인정해 주세요.',
    '- 너무 상담사 같거나 과도하게 감성적인 표현은 피하고, 현업 팀장이 실제로 말할 수 있는 한국어로 작성해 주세요.',
    '- 공감만 하지 말고 역할 기준, 책임 범위, 지원 방식, 리스크 안전선을 함께 담아 주세요.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 사용하지 마세요.',
    '',
    '[팀장이 체감한 과거와 현재의 차이]',
    getLabels(CULTURE_SHIFT_OPTIONS, result.cultureShiftSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[현재 드러나는 변화 신호]',
    getLabels(CURRENT_WORK_OPTIONS, result.newGenSignalSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[팀장의 당혹감]',
    getLabels(LEADER_FEELING_OPTIONS, result.leaderFeelingSelections).map((item) => `- ${item}`).join('\n') || '- 아직 선택하지 않았습니다.',
    '',
    '[대화 상황]',
    situation ? `${situation.label}\n${situation.quote}` : '아직 선택하지 않았습니다.',
    '',
    '[선택한 대화 목적]',
    purpose ? `${purpose.label}: ${purpose.description}` : '아직 선택하지 않았습니다.',
    '',
    '[평소 첫마디]',
    getSelectedFamiliarOpening(result),
    '',
    '[팀원에게 들릴 수 있는 의미]',
    `- 신세대 팀원: ${result.perceivedByNewGen || situation?.likelyNewGenPerception || '아직 정리되지 않았습니다.'}`,
    `- 기존 팀원: ${result.perceivedByExistingMember || situation?.likelyExistingPerception || '아직 정리되지 않았습니다.'}`,
    `- 빠진 정보: ${result.missingInformation || situation?.missingInformation || '아직 정리되지 않았습니다.'}`,
    '',
    '[요청]',
    '1. 팀장의 원래 의도를 먼저 인정해 주세요.',
    '2. 이 첫마디가 팀원에게 어떻게 다르게 들릴 수 있는지 분석해 주세요.',
    '3. 선택한 대화 목적에 맞게 첫 문장을 개선해 주세요.',
    '4. 짧은 버전, 1on1 대화 버전, 팀 회의 버전으로 나누어 제시해 주세요.',
    '5. 피해야 할 표현과 팀장이 마지막에 확인할 질문을 제시해 주세요.',
  ].join('\n');
}

function buildDefaultDialogueCard(result: V39PeopleDialogueResult): V39PeopleDialogueResult['dialogueCard'] {
  const situation = findSituation(result.conversationSituationId);
  const purpose = findPurpose(result.dialoguePurposeId);
  return {
    targetMember: situation?.label || '대화가 필요한 팀원',
    expectedReaction: situation?.description || '역할 배정 이유, 공정성, 부담, 책임 범위를 확인할 가능성이 있습니다.',
    leaderMisreadRisk: '질문이나 불만을 말대꾸, 변화 저항, 책임 회피로 해석할 수 있습니다.',
    realNeed: result.missingInformation || situation?.missingInformation || '역할 기준, 성장 의미, 부담 조정, 리스크 안전선에 대한 확인이 필요합니다.',
    openingLine: result.purposeFitOpening || purpose?.purposeFitOpening || '이번 역할을 맡기는 이유와 지원 기준을 먼저 설명드리겠습니다.',
    likelyQuestions: '왜 제가 맡아야 하나요? / 기존 업무와 어떻게 조정하나요? / 문제가 생기면 어떤 지원을 받을 수 있나요?',
    leaderResponse: '맡기는 이유와 기준은 분명히 설명하겠습니다. 동시에 실행 방법은 함께 조정하고, 리스크가 있는 부분은 제가 사전에 확인하겠습니다.',
    agreementCriteria: purpose?.mustInclude.join(' / ') || '역할 범위, 2주 실행 기준, 보고 시점, 리스크 공유 기준을 합의합니다.',
    leaderSupport: '방문 전 질문, 자료 사용 범위, 고객 부담 신호, CRM 기록 기준을 함께 점검합니다.',
    avoidPhrase: getSelectedFamiliarOpening(result),
    alternativePhrase: result.purposeFitOpening || purpose?.purposeFitOpening || '이 역할을 맡기는 이유와 지원 기준을 먼저 설명드리겠습니다.',
  };
}

export function V39PeopleDialogueLab() {
  const [result, setResult] = useState(() => loadV39PeopleDialogueResult());
  const [copied, setCopied] = useState(false);
  const roleResult = useMemo(() => loadV39MemberRoleResult(), []);
  const savedRoleCount = Object.values(roleResult.roles).filter((role) => role.roleMission.trim()).length;
  const prompt = useMemo(() => buildPeopleDialoguePrompt(result), [result]);
  const selectedSituation = findSituation(result.conversationSituationId);
  const selectedPurpose = findPurpose(result.dialoguePurposeId || selectedSituation?.recommendedPurposeId || '');
  const selectedFamiliarOpening = findFamiliarOpening(result.familiarOpeningId);

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

  const selectSituation = (id: string) => {
    const situation = findSituation(id);
    persist({
      conversationSituationId: id,
      dialoguePurposeId: situation?.recommendedPurposeId || result.dialoguePurposeId,
      perceivedByNewGen: situation?.likelyNewGenPerception || '',
      perceivedByExistingMember: situation?.likelyExistingPerception || '',
      missingInformation: situation?.missingInformation || '',
      purposeFitOpening: findPurpose(situation?.recommendedPurposeId || '')?.purposeFitOpening || result.purposeFitOpening,
    });
  };

  const selectPurpose = (id: string) => {
    const purpose = findPurpose(id);
    persist({ dialoguePurposeId: id, purposeFitOpening: purpose?.purposeFitOpening || result.purposeFitOpening });
  };

  const selectFamiliarOpening = (id: string) => {
    persist({ familiarOpeningId: id, familiarOpeningCustom: id === 'custom' ? result.familiarOpeningCustom : '' });
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

  const applyPerceptionDraft = () => {
    persist({
      perceivedByNewGen: result.perceivedByNewGen || selectedSituation?.likelyNewGenPerception || '',
      perceivedByExistingMember: result.perceivedByExistingMember || selectedSituation?.likelyExistingPerception || '',
      missingInformation: result.missingInformation || selectedSituation?.missingInformation || '',
      purposeFitOpening: result.purposeFitOpening || selectedPurpose?.purposeFitOpening || '',
    });
  };

  const applyDialogueDraft = () => {
    persist({ dialogueCard: { ...result.dialogueCard, ...buildDefaultDialogueCard(result) } });
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
            <h2 className="mt-8 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">팀장의 첫마디를 목적에 맞게 바꾸기</h2>
            <p className="mt-6 max-w-4xl text-base font-bold leading-8 text-slate-600">
              좋은 대화는 단순히 부드러운 대화가 아닙니다. 팀원 온도차를 세대 탓으로 돌리지 않고, 지금 필요한 대화의 목적을 알고, 역할 기준·지원 방식·책임 범위를 분명히 하며, 팀원이 실행으로 움직일 수 있게 만드는 대화입니다.
            </p>
            <div className="mt-8 rounded-3xl border border-violet-100 bg-violet-50 p-5 text-sm font-bold leading-6 text-violet-950">
              대화법을 바꾸는 이유는 팀원을 조심스럽게 대하라는 뜻이 아닙니다. 일이 실행되는 조건이 달라졌기 때문입니다. 예전에는 속으로 생각하던 질문들이 이제는 역할, 공정성, 성장, 자율성, 책임 범위에 대한 확인으로 드러납니다.
            </div>
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-black text-violet-950">일하는 방식 변화 {result.cultureShiftSelections.length} / 3</div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm font-black text-amber-950">대화 상황 {result.conversationSituationId ? '선택됨' : '미선택'}</div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-black text-sky-950">대화 목적 {selectedPurpose?.label || '미선택'}</div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-950">역할 정리 결과 {savedRoleCount}개</div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-violet-100 bg-violet-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700">Block 0</p>
        <h3 className="text-xl font-black text-slate-950">나 때는 말이야</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">팀장님이 최근 가장 크게 체감하는 과거와 현재의 차이를 최대 3개까지 선택하세요.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {CULTURE_SHIFT_OPTIONS.map((item) => {
            const selected = result.cultureShiftSelections.includes(item.id);
            return <ToggleCard key={item.id} item={item} selected={selected} disabled={!selected && result.cultureShiftSelections.length >= 3} onToggle={() => toggleSelection('cultureShiftSelections', item.id, 3)} />;
          })}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-sky-700">Block 1</p>
        <h3 className="text-xl font-black text-slate-950">지금은 말이야</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">지금 팀에서 더 자주 드러나는 변화 신호를 선택하세요. 질문이 많아진 것이 아니라, 질문이 밖으로 드러나는 방식이 달라졌을 수 있습니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CURRENT_WORK_OPTIONS.map((item) => <ToggleCard key={item.id} item={item} selected={result.newGenSignalSelections.includes(item.id)} onToggle={() => toggleSelection('newGenSignalSelections', item.id)} />)}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">Block 2</p>
        <h3 className="text-xl font-black text-slate-950">끼인 팀장의 현실도 함께 봅니다</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">팀장의 감정도 중요한 Data입니다. 위의 기대와 아래의 질문 사이에서 느끼는 당혹감을 최대 3개 선택하세요.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {LEADER_FEELING_OPTIONS.map((item) => {
            const selected = result.leaderFeelingSelections.includes(item.id);
            return <ToggleCard key={item.id} item={item} selected={selected} disabled={!selected && result.leaderFeelingSelections.length >= 3} onToggle={() => toggleSelection('leaderFeelingSelections', item.id, 3)} />;
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-600">Block 3</p>
        <h3 className="text-xl font-black text-slate-950">왜 대화의 시작을 바꿔야 할까</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ['질문이 밖으로 드러납니다', '예전에도 팀원들은 속으로 질문했습니다. 지금은 그 질문이 역할·공정성·책임 확인으로 더 빨리 드러납니다.'],
            ['설명은 권위 약화가 아닙니다', '설명은 팀원의 기분을 맞추는 일이 아니라 실행 기준을 분명히 하는 리더십 행동입니다.'],
            ['첫마디가 방어 수준을 정합니다', '첫 문장이 지시와 압박으로 들리면 이후 설명도 방어적으로 받아들여질 수 있습니다.'],
            ['목적에 맞는 대화가 필요합니다', '맡기는 대화, 듣는 대화, 바로잡는 대화, 조율하는 대화는 목적과 첫마디가 달라야 합니다.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-sm font-black text-slate-950">{title}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Block 4</p>
        <h3 className="text-xl font-black text-slate-950">이런 상황, 겪어보셨습니까?</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">대화 상황을 하나 선택하세요. 선택한 상황에 따라 권장 대화 목적과 팀원 인식 가능성이 자동으로 채워집니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {CONVERSATION_SITUATIONS.map((item) => <SingleSelectCard key={item.id} item={item} selected={result.conversationSituationId === item.id} onSelect={() => selectSituation(item.id)} />)}
        </div>
        {selectedSituation ? (
          <div className="mt-4 rounded-2xl bg-indigo-50 p-4 text-sm font-bold leading-6 text-indigo-950">
            {selectedSituation.quote}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Block 5</p>
        <h3 className="text-xl font-black text-slate-950">지금 필요한 대화는 무엇인가</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">팀장의 대화는 말투의 문제가 아니라 목적의 문제입니다. 이 상황에서 가장 필요한 대화 목적을 선택하세요.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {DIALOGUE_PURPOSES.map((item) => <SingleSelectCard key={item.id} item={item} selected={result.dialoguePurposeId === item.id} onSelect={() => selectPurpose(item.id)} />)}
        </div>
        {selectedPurpose ? (
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-black text-emerald-950">{selectedPurpose.label}의 목적</p>
            <p className="mt-2 text-sm font-bold leading-6 text-emerald-900">{selectedPurpose.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedPurpose.mustInclude.map((item) => <span key={item} className="rounded-full bg-white px-3 py-2 text-xs font-black text-emerald-900">{item}</span>)}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-rose-700">Block 6</p>
        <h3 className="text-xl font-black text-slate-950">평소라면 어떻게 시작하시겠습니까?</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">평소 나오는 첫마디를 선택하거나 직접 입력하세요. 이 문장을 비난하기 위한 것이 아니라, 오해 가능성을 확인하기 위한 출발점입니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {FAMILIAR_OPENINGS.map((item) => <SingleSelectCard key={item.id} item={item} selected={result.familiarOpeningId === item.id} onSelect={() => selectFamiliarOpening(item.id)} />)}
        </div>
        {result.familiarOpeningId === 'custom' ? (
          <label className="mt-4 block space-y-1">
            <span className="text-xs font-black text-slate-500">내가 평소 실제로 할 법한 첫마디</span>
            <textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.familiarOpeningCustom} onChange={(event) => persist({ familiarOpeningCustom: event.target.value })} />
          </label>
        ) : null}
      </section>

      <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-orange-700">Block 7</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">팀원은 이렇게 들을 수 있습니다</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">팀장의 의도와 팀원의 인식은 다를 수 있습니다. 선택한 상황을 기준으로 오해 가능성과 빠진 정보를 확인합니다.</p>
          </div>
          <button type="button" className="rounded-2xl border bg-orange-50 px-4 py-2 text-xs font-black text-orange-800" onClick={applyPerceptionDraft}>인식 초안 가져오기</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">신세대 팀원에게 들릴 수 있는 의미</span>
            <textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.perceivedByNewGen} onChange={(event) => persist({ perceivedByNewGen: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">기존 팀원에게 들릴 수 있는 의미</span>
            <textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.perceivedByExistingMember} onChange={(event) => persist({ perceivedByExistingMember: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">빠진 정보</span>
            <textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={result.missingInformation} onChange={(event) => persist({ missingInformation: event.target.value })} />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-slate-600">Block 8</p>
        <h3 className="text-xl font-black text-slate-950">AI로 내 첫마디를 개선하기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI에게 좋은 말투가 아니라 목적에 맞는 첫마디를 요청합니다. AI 초안은 그대로 쓰지 않고 팀장이 다시 고칩니다.</p>
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
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">Block 9</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-950">내가 실제로 사용할 실행 대화 저장</h3>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-700">AI 초안은 그대로 쓰지 않고, 내가 실제 팀원에게 말할 수 있는 첫마디와 합의 기준으로 수정합니다.</p>
          </div>
          <button type="button" className="rounded-2xl border bg-indigo-50 px-4 py-2 text-xs font-black text-indigo-800" onClick={applyDialogueDraft}>대화 카드 초안 가져오기</button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {Object.entries(result.dialogueCard).map(([key, value]) => {
            const labels: Record<string, string> = {
              targetMember: '대상 팀원', expectedReaction: '예상 반응', leaderMisreadRisk: '팀장이 오해하기 쉬운 지점', realNeed: '팀원이 실제로 확인하고 싶은 것', openingLine: '내가 실제로 사용할 첫마디', likelyQuestions: '팀원이 물을 수 있는 질문', leaderResponse: '팀장의 답변 문장', agreementCriteria: '합의할 실행 기준', leaderSupport: '팀장이 지원할 것', avoidPhrase: '피해야 할 말', alternativePhrase: '대체 문장',
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
