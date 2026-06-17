import { useEffect } from 'react';

const LABEL_REPLACEMENTS: Record<string, string> = {
  'Coaching Target Selection': 'Team 1on1 Pick',
  '코칭 대상 선정': '먼저 이야기할 팀원 고르기',
  '판단 메모': '팀장 메모',
  '역할/성향 요약': '이 사람은 이렇게 일합니다',
  '고객 대응 방식': '고객 앞에서는 이런 모습입니다',
  '현재 신호': '요즘 보이는 모습',
  '최근 변화 신호': '최근 달라진 점',
  '강점': '믿고 맡길 수 있는 점',
  '리스크': '그냥 넘기면 생길 수 있는 일',
  '팀장이 오해하기 쉬운 지점': '팀장이 섣불리 보면 놓치는 점',
  '팀장 질문': '팀장이 붙잡아야 할 질문',
  'AI 활용 기준': 'AI로 정리할 때 조심할 점',
  'AI 판단 정리 붙여넣기': 'AI가 정리한 메모 붙여넣기',
  '단정하면 안 되는 해석 / 주의할 지점': '섣불리 단정하면 안 되는 부분',
  '선택 이유': '이 사람을 먼저 만나야 한다고 느낀 이유',
  '9단계로 넘길 코칭 초점': '다음 화면에서 준비할 대화 초점',
  '이 화면에서 하지 않는 것': '여기서 정하지 않을 것',
  '입력 금지': '적지 말아야 할 것',
  '실제 고민 팀원 직접 등록': '우리 팀에 떠오르는 사람을 익명으로 추가하기',
  '역할/상황': '맡고 있는 일이나 상황',
  '9단계로 넘길 우선 1on1 대상': '다음 화면에서 대화를 준비할 팀원',
};

const TEXT_REPLACEMENTS: Record<string, string> = {
  '판단 초안 가져오기': '기본 메모 채우기',
  'AI로 코칭 필요 신호 정리하기': 'AI로 생각 정리하기',
  '프롬프트 복사 완료': '질문 복사 완료',
  '우선 1on1 대상 2명 안에 포함': '먼저 1on1할 사람으로 선택',
  '이미 2명을 선택했습니다': '이미 2명을 골랐습니다',
  '7명의 팀원 유형을 먼저 자세히 살펴본 뒤, 지금 1on1 코칭이 필요하다고 느껴지는 팀원을 선택합니다. 실제 팀원과 가장 유사한 사람을 떠올리되, 사람을 평가하거나 성격을 단정하지 않습니다. 우선 1on1 대상은 최대 2명만 선택하고, 9단계로 넘길 코칭 초점까지만 정리합니다.': '7명의 장면을 읽으며 우리 팀에서 떠오르는 사람을 생각해 봅니다. 사람을 평가하는 시간이 아니라, 이번 주 팀장이 먼저 앉아 이야기해야 할 사람과 그 이유를 고르는 시간입니다. 오늘은 최대 2명만 고르고, 다음 화면에서 준비할 대화 초점까지만 남깁니다.',
  '고객군별 담당자를 배치하거나 업무를 나누지 않습니다. 팀원이 맡을 일을 확정하는 화면이 아니라, 먼저 대화가 필요한 사람과 그 이유를 좁히는 화면입니다.': '누가 어떤 일을 맡을지 확정하지 않습니다. 지금은 먼저 만나서 확인해야 할 사람과 그 이유를 좁히는 화면입니다.',
  '8단계 AI는 대화문을 만드는 도구가 아닙니다. 관찰 사실과 해석을 분리하고, 지금 대화하지 않을 때의 비용과 9단계로 넘길 코칭 초점을 정리하는 데만 사용합니다.': 'AI는 대화문을 대신 써주는 도구가 아닙니다. 내가 본 사실과 내 해석을 나누고, 지금 대화를 미루면 생길 일을 정리하는 데만 사용합니다.',
};

function replaceExactText(root: HTMLElement, map: Record<string, string>) {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('*'));
  for (const element of elements) {
    const text = element.textContent?.trim();
    if (!text) continue;
    const next = map[text];
    if (next && element.childNodes.length === 1 && element.childNodes[0]?.nodeType === Node.TEXT_NODE) {
      element.textContent = next;
    }
  }
}

export function V39TeamSevenTextPolish() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-v39-team-seven-polish="true"]');
    if (!root) return;
    replaceExactText(root, LABEL_REPLACEMENTS);
    replaceExactText(root, TEXT_REPLACEMENTS);
  }, []);

  return null;
}
