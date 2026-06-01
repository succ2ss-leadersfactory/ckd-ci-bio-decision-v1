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

function V37PreviewApp() {
  useEffect(() => {
    enhanceCallPlanSection();
    const observer = new MutationObserver(() => enhanceCallPlanSection());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return <FullFlowJourneyV36PreviewApp />;
}

if (!rootElement) {
  throw new Error('v37 preview root element was not found. Add #journey-root or #root to the preview HTML.');
}

createRoot(rootElement).render(<V37PreviewApp />);
