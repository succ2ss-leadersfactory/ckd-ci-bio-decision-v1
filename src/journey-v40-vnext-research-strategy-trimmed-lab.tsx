import { V39ResearchStrategyLab } from './journey-v39-research-strategy-lab';

const V40_VNEXT_RESEARCH_TRIMMED_MARKERS = [
  'V40VNextResearchStrategyTrimmedLab',
  'v40에서 v39 리서치 안내 3개 블록 숨김',
  '4단계 AI 전략 리서치 숨김',
  'AI 없이도 할 수 있습니다 숨김',
  '3단계 구조화 프롬프트 연결 숨김',
].join('|');
void V40_VNEXT_RESEARCH_TRIMMED_MARKERS;

export function V40VNextResearchStrategyTrimmedLab() {
  return (
    <section className="v40-vnext-research-trimmed-lab">
      <style>{`
        .v40-vnext-research-trimmed-lab > div > :nth-child(-n + 3) {
          display: none !important;
        }
      `}</style>
      <V39ResearchStrategyLab />
    </section>
  );
}
