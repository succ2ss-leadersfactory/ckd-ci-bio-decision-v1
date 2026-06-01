const ORIGINAL_DATA_STEP = '1단계: 고객군 후보별 현업형 Data 읽기';
const ORIGINAL_CLASSIFICATION_STEP = '2단계: 고객군 직접 분류하기';

const STEP_TITLE_REPLACEMENTS = new Map<string, string>([
  [ORIGINAL_CLASSIFICATION_STEP, '1단계: 고객군 후보별 Data 읽기와 분류하기'],
  ['3단계: 집중/후순위 고객군 판단하기', '2단계: 집중/후순위 고객군 판단하기'],
  ['4단계: 팀원별 역할 방향 정하기', '3단계: 팀원별 역할 방향 정하기'],
  ['5단계: AI 콜플랜 결과물 요청하기', '4단계: AI 콜플랜 결과물 요청하기'],
]);

const OVERVIEW_ITEMS = [
  ['고객군 후보 1', '반응 상승 · 자료 요청 · 후속 가능 · 표현 주의'],
  ['고객군 후보 2', '관심 보류 · 니즈 재확인 · 속도 조절'],
  ['고객군 후보 3', '관계 안정 · 변화 신호 낮음 · 유지 품질'],
  ['고객군 후보 4', '접촉 피로 · 무반응 증가 · 리스크 관리'],
  ['고객군 후보 5', '기회 신호 큼 · 후속 가능 · 표현 안전선 중요'],
  ['고객군 후보 6', '데이터 부족 · 정보 보완 · 판단 유보'],
];

function findSectionByTitle(title: string) {
  return Array.from(document.querySelectorAll('section')).find((section) => section.querySelector('h3')?.textContent?.trim() === title);
}

function hideOriginalDataStep() {
  const section = findSectionByTitle(ORIGINAL_DATA_STEP);
  if (!section) return;
  section.setAttribute('data-v37-merged-original-data-step', 'true');
  section.setAttribute('hidden', 'true');
}

function replaceStepTitles() {
  document.querySelectorAll('section h3').forEach((heading) => {
    const current = heading.textContent?.trim() ?? '';
    const replacement = STEP_TITLE_REPLACEMENTS.get(current);
    if (replacement) heading.textContent = replacement;
  });
}

function insertMergedOverview() {
  const section = findSectionByTitle('1단계: 고객군 후보별 Data 읽기와 분류하기');
  if (!section || section.querySelector('[data-v37-merged-overview="true"]')) return;

  const overview = document.createElement('div');
  overview.setAttribute('data-v37-merged-overview', 'true');
  overview.innerHTML = `
    <div class="v37-merged-overview">
      <div class="v37-merged-overview-head">
        <span>통합 진행 방식</span>
        <b>고객군 후보 하나를 보고, 같은 카드 안에서 Data 확인과 분류를 끝냅니다.</b>
      </div>
      <p>기존의 “Data 읽기”와 “직접 분류하기”를 분리하지 않고, 고객군 후보별 통합 판단 카드로 진행합니다. 전체 비교가 필요하면 아래 요약을 먼저 훑고, 각 카드에서 최종 분류를 선택하세요.</p>
      <div class="v37-merged-overview-grid">
        ${OVERVIEW_ITEMS.map(([label, signal]) => `
          <article>
            <strong>${label}</strong>
            <span>${signal}</span>
          </article>
        `).join('')}
      </div>
    </div>
  `;

  const firstBody = section.querySelector('.mt-4.space-y-4') ?? section;
  firstBody.insertBefore(overview.firstElementChild as Element, firstBody.firstChild);
}

function polishMergedCustomerSteps() {
  hideOriginalDataStep();
  replaceStepTitles();
  insertMergedOverview();
}

polishMergedCustomerSteps();

const observer = new MutationObserver(() => polishMergedCustomerSteps());
observer.observe(document.body, { childList: true, subtree: true, characterData: true });
