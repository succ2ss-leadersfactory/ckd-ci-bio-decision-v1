import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './journey-v37-polish.css';
import { FullFlowJourneyV36PreviewApp } from './full-flow-journey-v36-preview';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function parseCallPlanCard(raw: string) {
  const matches = Array.from(raw.matchAll(/\[(.*?)\]\n([\s\S]*?)(?=\n\n\[|$)/g));
  return matches
    .map((match) => ({ title: match[1]?.trim() ?? '', body: match[2]?.trim() ?? '' }))
    .filter((item) => item.title && item.title !== '2주 콜플랜 카드');
}

const classificationGuide = [
  ['반응 상승 집중군', '긍정 반응, 자료 요청, 후속 미팅', '2주 안에 다음 대화로 이어질 가능성이 높다'],
  ['관심 보류 관리군', '관심은 있으나 미팅 보류, 기존 선호', '압박보다 질문과 자료로 니즈를 재확인한다'],
  ['관계 유지군', '관계 안정, 변화 신호 낮음', '과잉 접촉보다 관계 품질과 주기 관리가 중요하다'],
  ['리스크 관리군', '무반응, 접촉 피로, 컴플라이언스 높음', '접근 강도와 표현을 줄이고 안전선을 먼저 본다'],
  ['데이터 보완군', 'CRM 부족, 최근 반응 불명확', '분류보다 정보 보완과 기록 정리가 먼저다'],
];

const signalTags = ['기회가 크다', '반응이 살아 있다', '후속 가능성이 있다', '관계는 안정적이다', '접촉 피로가 보인다', '데이터가 부족하다', '표현 안전선이 필요하다'];
const judgmentAxes = [
  ['기회성', ['높음', '보통', '낮음']],
  ['반응성', ['상승', '보류', '낮음', '불확실']],
  ['실행 가능성', ['높음', '보통', '낮음']],
  ['리스크', ['낮음', '중간', '높음']],
] as const;

function enhanceClassificationSection() {
  const sections = Array.from(document.querySelectorAll('section'));
  const section = sections.find((item) => item.querySelector('h3')?.textContent?.includes('2단계: 고객군 직접 분류하기'));
  if (!section) return;

  if (!section.querySelector('[data-v37-classification-guide="true"]')) {
    const guide = document.createElement('div');
    guide.setAttribute('data-v37-classification-guide', 'true');
    guide.innerHTML = `
      <div class="v37-classification-guide">
        <div class="v37-guide-head">
          <p class="v37-guide-eyebrow">분류 전 판단 기준</p>
          <h4>바로 분류하지 말고, 4가지 축으로 먼저 좁혀보세요</h4>
          <p>고객군 분류는 정답 맞히기가 아니라 데이터 신호를 조합해 실행 방향을 정하는 연습입니다. 집중은 압박이 아니라 후속 대화의 질을 높이는 것입니다.</p>
        </div>
        <div class="v37-guide-grid">
          ${classificationGuide.map(([type, signal, standard]) => `
            <article>
              <p>${type}</p>
              <span>주요 신호: ${signal}</span>
              <small>${standard}</small>
            </article>
          `).join('')}
        </div>
      </div>
    `;
    const firstInfoBox = section.querySelector('div.rounded-xl');
    firstInfoBox?.insertAdjacentElement('afterend', guide);
  }

  Array.from(section.querySelectorAll('div.rounded-2xl.border.p-4')).forEach((card, index) => {
    if (card.querySelector('[data-v37-judgment-ladder="true"]')) return;
    const ladder = document.createElement('div');
    ladder.setAttribute('data-v37-judgment-ladder', 'true');
    ladder.innerHTML = `
      <div class="v37-judgment-ladder">
        <div class="v37-ladder-title">
          <span>판단 계단 ${index + 1}</span>
          <b>신호를 먼저 고르고, 그 다음 분류하세요</b>
        </div>
        <div class="v37-signal-tags" aria-label="핵심 신호 선택 도움말">
          ${signalTags.map((tag) => `<button type="button">${tag}</button>`).join('')}
        </div>
        <div class="v37-axis-grid">
          ${judgmentAxes.map(([axis, options]) => `
            <div>
              <p>${axis}</p>
              <div>${options.map((option) => `<button type="button">${option}</button>`).join('')}</div>
            </div>
          `).join('')}
        </div>
        <p class="v37-reason-template">문장 힌트: 이 고객군은 <b>선택한 핵심 신호</b> 때문에 분류했고, 다만 <b>주의 신호</b>는 실행 전 관리해야 합니다.</p>
      </div>
    `;
    const formGrid = card.querySelector('div.mt-3.grid');
    formGrid?.insertAdjacentElement('beforebegin', ladder);
  });
}

function enhanceCallPlanSection() {
  const sections = Array.from(document.querySelectorAll('section'));
  const section = sections.find((item) => item.querySelector('h3')?.textContent?.includes('최종 산출물: 2주 콜플랜'));
  const pre = section?.querySelector('pre');
  if (!section || !pre) return;

  pre.setAttribute('data-v37-source-call-plan', 'true');
  pre.setAttribute('aria-hidden', 'true');

  let card = section.querySelector<HTMLElement>('[data-v37-call-plan-card="true"]');
  if (!card) {
    card = document.createElement('div');
    card.setAttribute('data-v37-call-plan-card', 'true');
    pre.insertAdjacentElement('afterend', card);
  }

  const items = parseCallPlanCard(pre.textContent ?? '');
  card.innerHTML = `
    <div class="v37-call-plan-card-shell">
      <div class="v37-call-plan-card-head">
        <p class="v37-call-plan-eyebrow">마무리 실행 요약</p>
        <h4>내가 가져갈 2주 콜플랜 카드</h4>
        <p>입력한 판단과 수정 내용을 교육생이 바로 읽고 공유할 수 있도록 카드형으로 정리했습니다.</p>
      </div>
      <div class="v37-call-plan-card-grid">
        ${items.map((item) => `
          <article class="v37-call-plan-card-item">
            <p>${escapeHtml(item.title)}</p>
            <div>${escapeHtml(item.body || '아직 선택되지 않았습니다').replace(/\n/g, '<br />')}</div>
          </article>
        `).join('')}
      </div>
    </div>
  `;
}

function enhanceV37Experience() {
  enhanceClassificationSection();
  enhanceCallPlanSection();
}

function V37PreviewApp() {
  useEffect(() => {
    enhanceV37Experience();
    const observer = new MutationObserver(() => enhanceV37Experience());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return <FullFlowJourneyV36PreviewApp />;
}

if (!rootElement) {
  throw new Error('v37 preview root element was not found. Add #journey-root or #root to the preview HTML.');
}

createRoot(rootElement).render(<V37PreviewApp />);
