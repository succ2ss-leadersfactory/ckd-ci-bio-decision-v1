import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './journey-v37-polish.css';
import './journey-v37-label-polish';
import './journey-v37-step-merge-polish';
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

const customerCardSummaries = [
  {
    summary: [
      ['기회성', '고객 등급 A · 잠재력 높음 · 근거자료 요청 있음'],
      ['반응성', '최근 콜 반응 긍정 상승 · 후속 미팅 동의'],
      ['실행 가능성', '후속조치 완료율 90% · CRM 기록 충실'],
      ['리스크', '컴플라이언스 중간 · 표현 안전선 확인 필요'],
    ],
    signals: ['반응 상승', '자료 요청', '후속 가능', '표현 주의'],
    full: ['고객 등급 A', '잠재력 높음', '관계 수준 중간', '최근 방문일 7일 전', '4주 콜 횟수 2회', '접촉 성공률 80%', '최근 콜 반응 긍정 상승', '자료 요청 있음', '후속 미팅 동의', '거절/보류 사유 없음', '후속조치 완료율 90%', 'CRM 기록 충실', '컴플라이언스 중간'],
    helper: {
      strongestSignal: '반응 상승과 후속 미팅 동의',
      twoWeekAction: '허용된 정보 범위 안에서 후속 대화로 연결한다',
      caution: '컴플라이언스 표현 안전선을 확인한다',
      primary: '반응 상승 집중군',
      secondary: '관심 보류 관리군',
      reason: '자료 요청과 후속 미팅 동의가 있어 2주 안에 다음 대화로 이어질 가능성이 높다. 다만 표현 안전선은 실행 전 확인해야 한다.',
    },
  },
  {
    summary: [
      ['기회성', '고객 등급 A · 잠재력 높음 · 자료 요청 있음'],
      ['반응성', '관심 있으나 보류 · 후속 미팅 보류'],
      ['실행 가능성', '접촉 성공률 60% · 후속조치 완료율 60%'],
      ['리스크', '컴플라이언스 낮음 · 기존 치료 유지 선호'],
    ],
    signals: ['관심 보류', '니즈 재확인', '자료 활용', '속도 조절'],
    full: ['고객 등급 A', '잠재력 높음', '관계 수준 높음', '최근 방문일 20일 전', '4주 콜 횟수 1회', '접촉 성공률 60%', '최근 콜 반응 관심 있으나 보류', '자료 요청 있음', '후속 미팅 보류', '거절/보류 사유 기존 치료 유지 선호', '후속조치 완료율 60%', 'CRM 기록 보통', '컴플라이언스 낮음'],
    helper: {
      strongestSignal: '관심은 있으나 후속 미팅이 보류됨',
      twoWeekAction: '압박보다 니즈를 다시 확인한다',
      caution: '기존 치료 유지 선호를 가볍게 보지 않는다',
      primary: '관심 보류 관리군',
      secondary: '반응 상승 집중군',
      reason: '기회성은 높지만 후속 미팅이 보류되어 있어, 바로 집중하기보다 니즈 재확인이 먼저 필요하다.',
    },
  },
  {
    summary: [
      ['기회성', '고객 등급 B · 잠재력 중간 · 자료 요청 없음'],
      ['반응성', '관계 수준 높음 · 안정적 유지'],
      ['실행 가능성', '접촉 성공률 90% · CRM 기록 충실'],
      ['리스크', '컴플라이언스 낮음 · 추가 필요성 낮음'],
    ],
    signals: ['관계 안정', '변화 신호 낮음', '유지 품질', '과잉 접촉 주의'],
    full: ['고객 등급 B', '잠재력 중간', '관계 수준 높음', '최근 방문일 10일 전', '4주 콜 횟수 2회', '접촉 성공률 90%', '최근 콜 반응 안정적 유지', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 추가 필요성 낮음', '후속조치 완료율 80%', 'CRM 기록 충실', '컴플라이언스 낮음'],
    helper: {
      strongestSignal: '관계는 안정적이나 변화 신호가 낮음',
      twoWeekAction: '관계 품질을 유지하고 과잉 접촉을 피한다',
      caution: '변화 신호가 낮은 고객군을 무리하게 끌어올리려 하지 않는다',
      primary: '관계 유지군',
      secondary: '데이터 보완군',
      reason: '관계와 접촉 성공률은 안정적이지만 자료 요청이나 후속 미팅 같은 변화 신호가 낮아 유지 품질 관리가 적합하다.',
    },
  },
  {
    summary: [
      ['기회성', '고객 등급 B · 잠재력 중간 · 자료 요청 없음'],
      ['반응성', '무반응 증가 · 접촉 성공률 40%'],
      ['실행 가능성', '4주 콜 4회이나 후속조치 완료율 30%'],
      ['리스크', '컴플라이언스 높음 · 시간 부족/피로감 표현'],
    ],
    signals: ['접촉 피로', '무반응 증가', '실행 품질 저하', '리스크 관리'],
    full: ['고객 등급 B', '잠재력 중간', '관계 수준 낮음', '최근 방문일 5일 전', '4주 콜 횟수 4회', '접촉 성공률 40%', '최근 콜 반응 무반응 증가', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 시간 부족·피로감 표현', '후속조치 완료율 30%', 'CRM 기록 부족', '컴플라이언스 높음'],
    helper: {
      strongestSignal: '접촉 피로와 무반응 증가',
      twoWeekAction: '접근 강도와 표현을 줄인다',
      caution: '컴플라이언스 민감도와 고객 부담을 먼저 관리한다',
      primary: '리스크 관리군',
      secondary: '데이터 보완군',
      reason: '접촉은 많지만 반응이 낮고 컴플라이언스 민감도가 높아, 더 밀기보다 접근 강도와 표현을 조절해야 한다.',
    },
  },
  {
    summary: [
      ['기회성', '고객 등급 A · 잠재력 높음 · 자료 요청 있음'],
      ['반응성', '질문 증가 · 후속 미팅 동의'],
      ['실행 가능성', '후속조치 완료율 70% · CRM 기록 보통'],
      ['리스크', '컴플라이언스 높음 · 근거자료 확인 필요'],
    ],
    signals: ['기회 신호 큼', '질문 증가', '후속 가능', '표현 안전선 중요'],
    full: ['고객 등급 A', '잠재력 높음', '관계 수준 낮음', '최근 방문일 14일 전', '4주 콜 횟수 1회', '접촉 성공률 70%', '최근 콜 반응 질문 증가', '자료 요청 있음', '후속 미팅 동의', '거절/보류 사유 근거자료 확인 필요', '후속조치 완료율 70%', 'CRM 기록 보통', '컴플라이언스 높음'],
    helper: {
      strongestSignal: '질문 증가와 후속 미팅 동의',
      twoWeekAction: '근거자료를 안전하게 준비해 후속 대화로 연결한다',
      caution: '컴플라이언스 높은 고객군이므로 표현과 자료 활용을 먼저 점검한다',
      primary: '반응 상승 집중군',
      secondary: '리스크 관리군',
      reason: '기회 신호와 후속 가능성은 높지만 컴플라이언스 민감도가 높아, 집중하되 표현 안전선을 강하게 관리해야 한다.',
    },
  },
  {
    summary: [
      ['기회성', '고객 등급 C · 잠재력 낮음 · 자료 요청 없음'],
      ['반응성', '최근 콜 반응 데이터 부족 · 4주 콜 0회'],
      ['실행 가능성', '후속조치 완료율 20% · CRM 기록 부족'],
      ['리스크', '컴플라이언스 중간 · 정보 없음'],
    ],
    signals: ['데이터 부족', '정보 보완', '판단 유보', '기록 정리'],
    full: ['고객 등급 C', '잠재력 낮음', '관계 수준 높음', '최근 방문일 35일 전', '4주 콜 횟수 0회', '접촉 성공률 50%', '최근 콜 반응 데이터 부족', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 정보 없음', '후속조치 완료율 20%', 'CRM 기록 부족', '컴플라이언스 중간'],
    helper: {
      strongestSignal: '반응 데이터와 CRM 기록 부족',
      twoWeekAction: '판단보다 정보 보완과 기록 정리를 먼저 한다',
      caution: '부족한 데이터로 고객군을 과도하게 단정하지 않는다',
      primary: '데이터 보완군',
      secondary: '관계 유지군',
      reason: '관계 수준은 높지만 최근 반응과 CRM 기록이 부족해, 당장 집중보다 정보 보완이 먼저 필요하다.',
    },
  },
];

const signalTags = ['기회가 크다', '반응이 살아 있다', '후속 가능성이 있다', '관계는 안정적이다', '접촉 피로가 보인다', '데이터가 부족하다', '표현 안전선이 필요하다'];
const judgmentAxes = [
  ['기회성', ['높음', '보통', '낮음']],
  ['반응성', ['상승', '보류', '낮음', '불확실']],
  ['실행 가능성', ['높음', '보통', '낮음']],
  ['리스크', ['낮음', '중간', '높음']],
] as const;

function buildCustomerDataPanel(index: number) {
  const data = customerCardSummaries[index];
  if (!data) return '';
  return `
    <div class="v37-customer-data-panel" data-v37-customer-data-panel="true">
      <div class="v37-data-panel-head">
        <span>판단용 Data 요약</span>
        <b>이 카드 안에서 데이터 확인과 분류를 함께 하세요</b>
      </div>
      <div class="v37-data-summary-grid">
        ${data.summary.map(([axis, text]) => `
          <article>
            <p>${escapeHtml(axis)}</p>
            <div>${escapeHtml(text)}</div>
          </article>
        `).join('')}
      </div>
      <div class="v37-card-signal-row">
        ${data.signals.map((signal) => `<span>#${escapeHtml(signal)}</span>`).join('')}
      </div>
      <details class="v37-full-data-details">
        <summary>전체 13개 Data 다시 보기</summary>
        <div>${data.full.map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
      </details>
    </div>
  `;
}

function buildClassificationHelper(index: number) {
  const data = customerCardSummaries[index];
  if (!data) return '';
  const helper = data.helper;
  return `
    <div class="v37-classification-helper" data-v37-classification-helper="true">
      <div class="v37-helper-head">
        <span>분류 도우미</span>
        <b>세 질문으로 가까운 후보를 먼저 좁혀보세요</b>
      </div>
      <div class="v37-helper-question-grid">
        <article>
          <p>Q1. 가장 강한 신호는?</p>
          <button type="button">${escapeHtml(helper.strongestSignal)}</button>
        </article>
        <article>
          <p>Q2. 2주 행동 방향은?</p>
          <button type="button">${escapeHtml(helper.twoWeekAction)}</button>
        </article>
        <article>
          <p>Q3. 가장 큰 주의점은?</p>
          <button type="button">${escapeHtml(helper.caution)}</button>
        </article>
      </div>
      <div class="v37-helper-result">
        <div>
          <span>가까운 후보</span>
          <b>${escapeHtml(helper.primary)}</b>
        </div>
        <div>
          <span>함께 검토할 후보</span>
          <b>${escapeHtml(helper.secondary)}</b>
        </div>
      </div>
      <p class="v37-helper-reason"><b>분류 이유 초안:</b> ${escapeHtml(helper.reason)}</p>
      <p class="v37-helper-note">이 후보는 정답이 아니라 선택 부담을 줄이기 위한 판단 보조입니다. 최종 분류는 아래 선택란에서 직접 결정하세요.</p>
    </div>
  `;
}

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
    if (!card.querySelector('[data-v37-customer-data-panel="true"]')) {
      const panel = document.createElement('div');
      panel.innerHTML = buildCustomerDataPanel(index);
      const cardHead = card.querySelector('div.flex.flex-wrap');
      cardHead?.insertAdjacentElement('afterend', panel.firstElementChild as Element);
    }

    if (!card.querySelector('[data-v37-classification-helper="true"]')) {
      const helper = document.createElement('div');
      helper.innerHTML = buildClassificationHelper(index);
      const dataPanel = card.querySelector('[data-v37-customer-data-panel="true"]');
      dataPanel?.insertAdjacentElement('afterend', helper.firstElementChild as Element);
    }

    if (card.querySelector('[data-v37-judgment-ladder="true"]')) return;
    const ladder = document.createElement('div');
    ladder.setAttribute('data-v37-judgment-ladder', 'true');
    ladder.innerHTML = `
      <div class="v37-judgment-ladder">
        <div class="v37-ladder-title">
          <span>판단 계단 ${index + 1}</span>
          <b>필요하면 아래 4축 판단으로 내 선택을 다시 점검하세요</b>
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
