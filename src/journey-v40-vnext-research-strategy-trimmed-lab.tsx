import { useEffect, useRef } from 'react';
import { V39ResearchStrategyLab } from './journey-v39-research-strategy-lab';

const V40_VNEXT_RESEARCH_TRIMMED_MARKERS = [
  'V40VNextResearchStrategyTrimmedLab',
  'v40에서 v39 리서치 안내 3개 블록 숨김',
  '4단계 AI 전략 리서치 숨김',
  'AI 없이도 할 수 있습니다 숨김',
  '3단계 구조화 프롬프트 연결 숨김',
  'NotebookLM 소스 묶음 검토·수정 숨김',
  '소스 묶음 복사 버튼 숨김',
  'NotebookLM 소스 묶음 복사로 버튼명 변경',
].join('|');
void V40_VNEXT_RESEARCH_TRIMMED_MARKERS;

export function V40VNextResearchStrategyTrimmedLab() {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renameButton = () => {
      const buttons = Array.from(container.querySelectorAll('button'));
      for (const button of buttons) {
        if (button.textContent?.trim() === 'NotebookLM 소스 묶음 생성') {
          button.textContent = 'NotebookLM 소스 묶음 복사';
          button.setAttribute('title', 'Perplexity 답변을 바탕으로 NotebookLM 소스 묶음을 만들고 복사합니다.');
        }
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest('button');
      if (!button || !container.contains(button)) return;
      if (button.textContent?.trim() !== 'NotebookLM 소스 묶음 복사') return;
      window.setTimeout(() => {
        const textarea = Array.from(container.querySelectorAll('textarea')).find((item) => item.value.includes('NotebookLM 소스 묶음 초안'));
        if (textarea?.value) void navigator.clipboard?.writeText(textarea.value);
        renameButton();
      }, 80);
    };

    renameButton();
    const observer = new MutationObserver(renameButton);
    observer.observe(container, { childList: true, subtree: true, characterData: true });
    container.addEventListener('click', handleClick, true);

    return () => {
      observer.disconnect();
      container.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <section ref={containerRef} className="v40-vnext-research-trimmed-lab">
      <style>{`
        .v40-vnext-research-trimmed-lab > div > :nth-child(-n + 3),
        .v40-vnext-research-trimmed-lab > div > :nth-child(5) > div > label:nth-of-type(2),
        .v40-vnext-research-trimmed-lab > div > :nth-child(5) > div > button:nth-of-type(2) {
          display: none !important;
        }
      `}</style>
      <V39ResearchStrategyLab />
    </section>
  );
}
