import { useMemo, useState } from 'react';
import {
  type V39CustomerDecisionResult,
  type V39CustomerJudgmentResult,
  loadV39CustomerJudgmentResult,
  normalizeV39CustomerDecisionResult,
  normalizeV39CustomerJudgmentResult,
} from './journey-v39-customer-judgment-result-store';
import {
  type V39CustomerStrategyResultItem,
  loadV39CustomerStrategyResult,
  normalizeV39CustomerStrategyItem,
  saveV39CustomerStrategyResult,
} from './journey-v39-customer-strategy-result-store';

const V39_CUSTOMER_TWO_WEEK_DIRECTION_SMOKE_MARKERS = [
  'V39CustomerPriorityLab',
  'V39CustomerJudgmentBridgePanel',
  '고객군별 2주 대응 방향',
  '고객군 × 팀원 2주 실행 Map',
  '6단계 고객 Data 확인 List',
  '대응 강도',
  '2주 대응 방향',
  '팀원 연결 기준',
  '실제 연결 후보',
  '위험·보완 조건',
  '고객 Data 증거 카드',
  'AI로 2주 실행 Map 초안 만들기',
  'AI 2주 실행 Map 프롬프트 복사',
  'AI 결과 1차 분리 정리',
  '고객군/점검 조건별 분리',
  '고객군별 2주 실행 카드',
  '이번 2주 행동을 먼저 확인하세요',
  '이 행동을 2주 대응 방향에 반영하기',
  'AI 결과 연결됨',
  'AI 결과에서 가져오기',
  '정보 보완 고객군',
  '안전선 점검 조건',
  '표현·자료 안전선 점검',
  '항목 제목과 본문 문장을 구분해서 읽습니다',
  '본문 bullet을 새 카드 제목으로 오해하지 않습니다',
  '대응군 C · 신규·미접촉 고객군',
  '대응군 F · 표현·자료 안전선 고객군',
].join('|');
void V39_CUSTOMER_TWO_WEEK_DIRECTION_SMOKE_MARKERS;

type CustomerDirectionItem = {
  id: string;
  label: string;
  kind: 'customerGroup' | 'condition';
  defaultGuide: string;
  defaultPriority: string;
  defaultMemberRole: string;
};

type AiMapExtractionBucket = {
  title: string;
  description: string;
  aliases: string[];
};

type AiMapExtractedBucket = {
  title: string;
  description: string;
  items: string[];
};

type AiMapExtractedCard = {
  cardTitle: string;
  buckets: AiMapExtractedBucket[];
};

const CUSTOMER_DIRECTION_ITEMS: CustomerDirectionItem[] = [
  {
    id: 'A',
    label: '반응 확인 고객군',
    kind: 'customerGroup',
    defaultGuide: '고객 질문과 반응의 구체성을 확인한 뒤, 승인자료 범위 안에서 다음 대화 주제를 준비합니다.',
    defaultPriority: '조건부 실행',
    defaultMemberRole: '신재영 대리 · 후속 대화 연결',
  },
  {
    id: 'B',
    label: '다음 접점 고객군',
    kind: 'customerGroup',
    defaultGuide: '다음 접점의 목적과 준비 자료를 정리하고, 과도한 설득 없이 후속 일정을 확인합니다.',
    defaultPriority: '조건부 실행',
    defaultMemberRole: '김재호 차장 · 현장 대응 후 기록 정리',
  },
  {
    id: 'C',
    label: '정보 보완 고객군',
    kind: 'customerGroup',
    defaultGuide: '미접촉 이유, 신규 접점 가능성, 접근 경로를 확인하고 무리한 확대보다 정보 보완을 먼저 진행합니다.',
    defaultPriority: '정보 보완 후 실행',
    defaultMemberRole: '박재욱 사원 · 영업활동 기록·정보 보완',
  },
  {
    id: 'D',
    label: '대체 접점 고객군',
    kind: 'customerGroup',
    defaultGuide: '방문이 어려운 고객에게 자료 확인, 비대면 접점, 협업 요청 등 대체 접점이 실제로 작동하는지 확인합니다.',
    defaultPriority: '정보 보완 후 실행',
    defaultMemberRole: '유희관 과장 · 변화 신호 관찰',
  },
  {
    id: 'E',
    label: '제약 해소 고객군',
    kind: 'customerGroup',
    defaultGuide: '실행 부진을 환경 탓으로 단정하지 않고, 고객 제약과 팀 실행 제약을 분리해 보완 조건을 정합니다.',
    defaultPriority: '접근 강도 조절',
    defaultMemberRole: '김문호 차장 · 접근 강도 조절',
  },
  {
    id: 'F',
    label: '안전선 점검 조건',
    kind: 'condition',
    defaultGuide: '관심 신호가 있어도 승인자료 범위와 표현 안전선을 먼저 확인하고, 답변 가능 범위를 좁힙니다.',
    defaultPriority: '안전선 선확인',
    defaultMemberRole: '팀장 직접 점검 필요',
  },
];

const AI_MAP_EXTRACTION_BUCKETS: AiMapExtractionBucket[] = [
  {
    title: '고객군 후보 또는 점검 조건',
    description: '이번 2주 동안 묶어 볼 고객군 후보나 안전선 점검 조건',
    aliases: ['고객군 후보 또는 점검 조건', '고객군 후보', '점검 조건', '고객군/점검 조건', '고객군 또는 점검 조건', '구분', '대응군', '조건'],
  },
  {
    title: '확인된 단서',
    description: '6단계 고객 Data 증거 카드에서 가져온 확인 단서',
    aliases: ['확인된 단서', '확인된 Data 단서', '확인된 데이터 단서', 'Data 단서', '데이터 단서', '단서'],
  },
  {
    title: '아직 부족한 정보',
    description: '이번 2주 행동 전에 더 확인해야 할 정보',
    aliases: ['아직 부족한 정보', '부족한 정보', '추가 확인 정보', '더 확인해야 할 정보', '미확인 정보'],
  },
  {
    title: '이번 2주 행동',
    description: '확정 명령이 아니라 팀장이 수정할 실행 가설',
    aliases: ['이번 2주 행동', '2주 행동', '2주 실행', '이번 2주 실행', '실행 행동', '이번 행동', '2주 대응 방향'],
  },
  {
    title: '팀원에게 확인할 질문',
    description: '방문·면담 전 팀원이 확인할 질문',
    aliases: ['팀원에게 확인할 질문', '팀원 질문', '확인할 질문', '팀원에게 더 확인할 질문', '추가 확인 질문'],
  },
  {
    title: '표현·자료 안전선',
    description: '승인자료 범위와 위험 표현 점검',
    aliases: ['표현·자료 안전선', '표현 자료 안전선', '안전선', '컴플라이언스', '승인자료', '위험 표현', '표현 기준', '자료 기준'],
  },
  {
    title: '다음 회의에서 확인할 것',
    description: '다음 팀 회의나 1on1에서 확인할 후속 포인트',
    aliases: ['다음 회의에서 확인할 것', '다음 회의 확인', '다음 회의에서 확인', '후속 확인', '회의 확인 포인트'],
  },
];

const RESPONSE_DIRECTION_OPTIONS = ['조건부 실행', '정보 보완 후 실행', '관찰/유지', '접근 강도 조절', '안전선 선확인', '팀장 직접 확인'];

const MEMBER_ROLE_OPTIONS = [
  '신재영 대리 · 후속 대화 연결',
  '김재호 차장 · 현장 대응 후 기록 정리',
  '박재욱 사원 · 영업활동 기록·정보 보완',
  '유희관 과장 · 변화 신호 관찰',
  '김문호 차장 · 접근 강도 조절',
  '이대은 대리 · 관계 유지 품질 관리',
  '팀장 직접 점검 필요',
];

function compactList(items: string[], limit = 6) {
  return items.map((item) => item.trim()).filter(Boolean).slice(0, limit);
}

function cleanAiMapResultLine(value: string) {
  return value
    .replace(/^#{1,6}\s*/, '')
    .replace(/^[-*•]\s*/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^\|?\s*/, '')
    .replace(/\*\*/g, '')
    .trim();
}

function lineMatchesMapBucketTitle(line: string, bucket: AiMapExtractionBucket) {
  const clean = cleanAiMapResultLine(line);
  return bucket.aliases.some((alias) => clean === alias || clean.startsWith(`${alias}:`) || clean.startsWith(`${alias}：`));
}

function lineMatchesAnotherMapBucketTitle(line: string, currentBucket: AiMapExtractionBucket) {
  return AI_MAP_EXTRACTION_BUCKETS.some((bucket) => bucket.title !== currentBucket.title && lineMatchesMapBucketTitle(line, bucket));
}

function normalizeAiMapCardTitle(line: string) {
  const clean = line.replace(/^#{1,6}\s*/, '').replace(/\*\*/g, '').trim();
  const looksLikeCardHeading =
    /^고객군\/점검\s*조건\s*(?:[①-⑳]|\d+|[A-F])?/i.test(clean) ||
    /^고객군별\s*2주\s*실행\s*Map\s*(?:[①-⑳]|\d+|[A-F])?/i.test(clean) ||
    /^대응군\s*(?:[①-⑳]|\d+|[A-F])?/i.test(clean);

  if (!looksLikeCardHeading) return null;
  const matchedItem = CUSTOMER_DIRECTION_ITEMS.find((item) => clean.includes(item.label));
  if (matchedItem) return matchedItem.label;

  const title = clean
    .replace(/^고객군\/점검\s*조건\s*(?:[①-⑳]|\d+|[A-F])?\s*[.)·:-]?\s*/i, '')
    .replace(/^고객군별\s*2주\s*실행\s*Map\s*(?:[①-⑳]|\d+|[A-F])?\s*[.)·:-]?\s*/i, '')
    .replace(/^대응군\s*(?:[①-⑳]|\d+|[A-F])?\s*[.)·:-]?\s*/i, '')
    .trim();
  return title || null;
}

function extractAiMapResultBucketsFromLines(lines: string[], limit = 20): AiMapExtractedBucket[] {
  return AI_MAP_EXTRACTION_BUCKETS.map((bucket) => {
    const startIndex = lines.findIndex((line) => lineMatchesMapBucketTitle(line, bucket));
    const items: string[] = [];

    if (startIndex >= 0) {
      const firstLine = lines[startIndex];
      const afterColon = firstLine.split(/[:：]/).slice(1).join(':').trim();
      if (afterColon && !lineMatchesMapBucketTitle(afterColon, bucket)) items.push(afterColon);

      for (let index = startIndex + 1; index < lines.length; index += 1) {
        const line = lines[index];
        if (lineMatchesAnotherMapBucketTitle(line, bucket)) break;
        if (normalizeAiMapCardTitle(line)) break;
        if (lineMatchesMapBucketTitle(line, bucket)) {
          const inlineValue = line.split(/[:：]/).slice(1).join(':').trim();
          if (inlineValue) items.push(inlineValue);
          continue;
        }
        if (/^(요청|주의:|결론|종합|예시|표\s*)/i.test(line)) break;
        items.push(line);
      }
    }

    return {
      title: bucket.title,
      description: bucket.description,
      items: compactList(items, limit),
    };
  });
}

function splitAiMapResultCards(raw: string) {
  const lines = raw
    .split(/\r?\n/)
    .map(cleanAiMapResultLine)
    .filter((line) => line && !/^---+$/.test(line));

  const cards: { cardTitle: string; lines: string[] }[] = [];
  let currentCard: { cardTitle: string; lines: string[] } | null = null;
  const prefaceLines: string[] = [];

  for (const line of lines) {
    const cardTitle = normalizeAiMapCardTitle(line);
    if (cardTitle) {
      if (currentCard) cards.push(currentCard);
      currentCard = { cardTitle, lines: [] };
      continue;
    }

    if (currentCard) currentCard.lines.push(line);
    else prefaceLines.push(line);
  }

  if (currentCard) cards.push(currentCard);
  if (cards.length > 0) return cards;
  return [{ cardTitle: 'AI 결과 전체', lines: prefaceLines }];
}

function extractAiMapResultCards(raw: string): AiMapExtractedCard[] {
  return splitAiMapResultCards(raw).map((card) => ({
    cardTitle: card.cardTitle,
    buckets: extractAiMapResultBucketsFromLines(card.lines, 20),
  }));
}

function normalizeMatchText(value: string) {
  return value
    .toLowerCase()
    .replace(/고객군\/점검\s*조건/gi, '')
    .replace(/고객군별\s*2주\s*실행\s*map/gi, '')
    .replace(/대응군/gi, '')
    .replace(/고객군/gi, '')
    .replace(/점검\s*조건/gi, '점검')
    .replace(/[①-⑳\d\s\[\]().,·:：?？!！\/-]/g, '')
    .trim();
}

function getAiMapBucketItems(card: AiMapExtractedCard | undefined, title: string) {
  if (!card) return [];
  return card.buckets.find((item) => item.title === title)?.items ?? [];
}

function getAiMapBucketText(card: AiMapExtractedCard | undefined, title: string) {
  return getAiMapBucketItems(card, title).join('\n');
}

function aiMapCardHasContent(card: AiMapExtractedCard | undefined) {
  return Boolean(card?.buckets.some((bucket) => bucket.items.length > 0));
}

function getDirectionMatchAliases(item: CustomerDirectionItem) {
  switch (item.id) {
    case 'A':
      return [item.label, '반응 확인', '고객 반응', '반응을 다시 확인'];
    case 'B':
      return [item.label, '다음 접점', '후속 접점', '후속 논의', '다음 만남'];
    case 'C':
      return [item.label, '정보 보완', '미접촉', '접점 공백', '신규 접점'];
    case 'D':
      return [item.label, '대체 접점', '방문 외 접점', '비대면 접점', '자료 전달'];
    case 'E':
      return [item.label, '제약 해소', '실행 제약', '방문 제한', '막힌 조건'];
    case 'F':
      return [item.label, '안전선', '안전선 점검', '표현 자료 안전선', '표현·자료 안전선', '표현·자료 안전선 점검', '기록 표현 점검', '자료 기준', '표현 기준'];
    default:
      return [item.label];
  }
}

function textMatchesDirectionItem(text: string, item: CustomerDirectionItem) {
  const normalized = normalizeMatchText(text);
  const aliases = getDirectionMatchAliases(item).map(normalizeMatchText).filter(Boolean);
  if (!normalized) return false;
  return aliases.some((alias) => normalized.includes(alias) || alias.includes(normalized));
}

function findAiMapCardForItem(item: CustomerDirectionItem, cards: AiMapExtractedCard[], displayItems: CustomerDirectionItem[]) {
  const titleMatch = cards.find((card) => textMatchesDirectionItem(card.cardTitle, item));
  if (titleMatch) return titleMatch;

  const bucketMatch = cards.find((card) => {
    const targetText = [
      card.cardTitle,
      getAiMapBucketText(card, '고객군 후보 또는 점검 조건'),
      ...card.buckets.flatMap((bucket) => bucket.items),
    ].join('\n');
    return textMatchesDirectionItem(targetText, item);
  });
  if (bucketMatch) return bucketMatch;

  if (displayItems.length === 1 && cards.length === 1 && aiMapCardHasContent(cards[0])) return cards[0];
  return undefined;
}

function loadSourceJudgmentResult(): V39CustomerJudgmentResult {
  if (typeof window === 'undefined') return normalizeV39CustomerJudgmentResult(undefined);
  return normalizeV39CustomerJudgmentResult(loadV39CustomerJudgmentResult());
}

function loadBridgeDecisions(sourceResult: V39CustomerJudgmentResult): Record<string, V39CustomerDecisionResult> {
  const decisions: Record<string, V39CustomerDecisionResult> = {};
  for (const item of CUSTOMER_DIRECTION_ITEMS) {
    decisions[item.id] = normalizeV39CustomerDecisionResult(sourceResult.decisions[item.id], item.id, item.label);
  }
  return decisions;
}

function loadStrategyState(): Record<string, V39CustomerStrategyResultItem> {
  if (typeof window === 'undefined') return {};
  const saved = loadV39CustomerStrategyResult();
  const strategies: Record<string, V39CustomerStrategyResultItem> = {};
  for (const item of CUSTOMER_DIRECTION_ITEMS) {
    strategies[item.id] = normalizeV39CustomerStrategyItem(saved.strategies[item.id], item.id, item.label);
  }
  return strategies;
}

function getDisplayItems(sourceResult: V39CustomerJudgmentResult) {
  return sourceResult.selectedCustomerTypeIds.length > 0
    ? CUSTOMER_DIRECTION_ITEMS.filter((item) => sourceResult.selectedCustomerTypeIds.includes(item.id))
    : CUSTOMER_DIRECTION_ITEMS;
}

function buildRiskGuide(decision: V39CustomerDecisionResult) {
  return [decision.riskSignal, decision.missingInfo, decision.complianceNote].map((item) => item.trim()).filter(Boolean).join('\n');
}

function buildDirectionGuide(item: CustomerDirectionItem, decision: V39CustomerDecisionResult) {
  const checkData = decision.reason.trim();
  const opportunity = decision.opportunitySignal.trim();
  const risk = decision.riskSignal.trim();
  const question = decision.nextCheck.trim();

  return [
    checkData ? `확인할 Data 단서: ${checkData}` : '',
    opportunity ? `기회 단서: ${opportunity}` : '',
    risk ? `주의 단서: ${risk}` : '',
    question ? `팀원 확인 질문: ${question}` : '',
  ].filter(Boolean).join('\n') || item.defaultGuide;
}

function defaultDirection(item: CustomerDirectionItem, decision: V39CustomerDecisionResult) {
  if (decision.twoWeekDirection.trim() && !decision.twoWeekDirection.includes('7단계에서')) return decision.twoWeekDirection;
  return buildDirectionGuide(item, decision);
}

function inferPriorityFromAiCard(item: CustomerDirectionItem, card: AiMapExtractedCard | undefined) {
  const text = card ? card.buckets.flatMap((bucket) => bucket.items).join('\n') : '';
  return RESPONSE_DIRECTION_OPTIONS.find((option) => text.includes(option)) || item.defaultPriority;
}

function buildStrategyFromAiCard(item: CustomerDirectionItem, decision: V39CustomerDecisionResult, card: AiMapExtractedCard | undefined) {
  const missingInfo = getAiMapBucketText(card, '아직 부족한 정보');
  const action = getAiMapBucketText(card, '이번 2주 행동');
  const safety = getAiMapBucketText(card, '표현·자료 안전선');
  const nextMeeting = getAiMapBucketText(card, '다음 회의에서 확인할 것');
  const confirmedClue = getAiMapBucketText(card, '확인된 단서');
  const risk = [missingInfo, safety, nextMeeting].map((value) => value.trim()).filter(Boolean).join('\n');

  return {
    priority: inferPriorityFromAiCard(item, card),
    memberRole: item.defaultMemberRole,
    strategy: action || confirmedClue || defaultDirection(item, decision),
    risk: risk || buildRiskGuide(decision) || '표현·자료·접촉 강도 안전선을 다시 확인합니다.',
  };
}

function buildTwoWeekMapPrompt(displayItems: CustomerDirectionItem[], decisions: Record<string, V39CustomerDecisionResult>) {
  return [
    '당신은 제약영업 팀장의 2주 실행 Map 초안 작성을 돕는 AI 사고 파트너입니다.',
    '',
    '[안전선]',
    '- 아래 내용은 교육용 가상 실습입니다.',
    '- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보를 요구하거나 추정하지 마세요.',
    '- 고객을 점수화하거나 순위표로 세우지 마세요.',
    '- 처방 가능성, 매출 가능성, 고객 등급을 단정하지 마세요.',
    '- 미승인 효능 표현, 비교 우위 단정, 처방 유도 문장, 과도한 설득 문장을 만들지 마세요.',
    '- AI는 정답을 만드는 것이 아니라, 팀장이 수정할 2주 실행 Map 초안을 정리합니다.',
    '',
    '[6단계 고객 Data 증거 카드에서 가져온 단서]',
    ...displayItems.flatMap((item) => {
      const decision = normalizeV39CustomerDecisionResult(decisions[item.id], item.id, item.label);
      return [
        `- 구분: ${item.label}`,
        `  · 유형: ${item.kind === 'condition' ? '고객군이 아니라 점검 조건' : '고객군 후보'}`,
        `  · 확인된 Data 단서: ${decision.reason || item.defaultGuide}`,
        `  · 기회 단서: ${decision.opportunitySignal || '아직 없음'}`,
        `  · 주의 단서·부족 정보·안전선: ${buildRiskGuide(decision) || '아직 없음'}`,
        `  · 팀원에게 더 확인할 질문: ${decision.nextCheck || '아직 없음'}`,
        `  · 7단계로 넘긴 메모: ${decision.twoWeekDirection || '아직 없음'}`,
      ];
    }),
    '',
    '[요청]',
    '위 단서를 바탕으로 고객군별 2주 실행 Map 초안을 작성해 주세요.',
    '선택한 고객군 후보 또는 점검 조건별로 반드시 아래 제목과 항목을 그대로 사용해 주세요. 제목 이름을 바꾸지 마세요.',
    '특히 ### 4. 이번 2주 행동은 4~6개로 구체화해 주세요.',
    '- 각 행동은 “확인한다, 구분한다, 정리한다, 질문한다, 점검한다, 기록한다” 중심으로 작성합니다.',
    '- 고객을 공략하거나 우선순위를 정하는 표현은 사용하지 않습니다.',
    '- 각 행동에는 확인할 기록, 팀원 질문, 남길 산출물 중 하나 이상을 포함합니다.',
    '- 가능한 경우 “다음 회의 전”, “1on1 전”, “2주 안에” 같은 실행 시점을 포함합니다.',
    '',
    '## 고객군/점검 조건 ① 카드명',
    '### 1. 고객군 후보 또는 점검 조건',
    '### 2. 확인된 단서',
    '### 3. 아직 부족한 정보',
    '### 4. 이번 2주 행동',
    '### 5. 팀원에게 확인할 질문',
    '### 6. 표현·자료 안전선',
    '### 7. 다음 회의에서 확인할 것',
    '',
    '주의: F처럼 표현·자료 안전선은 고객군이 아니라 점검 조건으로 다뤄 주세요. 대응 방향은 확정 명령이 아니라 팀장이 수정할 실행 가설로 써 주세요.',
  ].join('\n');
}

function SelectionChips({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
      <p className="font-black text-slate-950">{title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {items.length > 0 ? items.map((item) => (
          <span key={item} className="rounded-full bg-emerald-50 px-2.5 py-1 font-black text-emerald-800">{item}</span>
        )) : <span className="text-slate-500">{empty}</span>}
      </div>
    </div>
  );
}

function CompactBucket({ title, items, empty }: { title: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-2xl bg-white px-3 py-2 text-xs font-bold leading-5 text-slate-700 shadow-sm">
      <p className="font-black text-slate-950">{title}</p>
      <ul className="mt-1 space-y-1">
        {items.length > 0 ? items.slice(0, 3).map((item) => <li key={item}>• {item}</li>) : <li className="text-slate-400">{empty}</li>}
      </ul>
    </div>
  );
}

function V39CustomerJudgmentBridgePanel() {
  const [sourceResult, setSourceResult] = useState<V39CustomerJudgmentResult>(loadSourceJudgmentResult);
  const [decisions, setDecisions] = useState<Record<string, V39CustomerDecisionResult>>(() => loadBridgeDecisions(sourceResult));
  const [strategies, setStrategies] = useState<Record<string, V39CustomerStrategyResultItem>>(loadStrategyState);
  const [aiMapPromptCopied, setAiMapPromptCopied] = useState(false);
  const [aiMapDraft, setAiMapDraft] = useState('');
  const displayItems = getDisplayItems(sourceResult);
  const checklistCount = displayItems.filter((item) => decisions[item.id]?.reason || decisions[item.id]?.judgmentMemo).length;
  const savedStrategyCount = displayItems.filter((item) => strategies[item.id]?.strategy?.trim()).length;
  const savedMemberConnectionCount = displayItems.filter((item) => strategies[item.id]?.memberRole?.trim()).length;
  const twoWeekMapPrompt = buildTwoWeekMapPrompt(displayItems, decisions);
  const extractedAiMapCards = useMemo(() => extractAiMapResultCards(aiMapDraft), [aiMapDraft]);
  const hasAiMapDraft = aiMapDraft.trim().length > 0;

  const refreshCustomerJudgmentBridge = () => {
    const nextSource = loadSourceJudgmentResult();
    setSourceResult(nextSource);
    setDecisions(loadBridgeDecisions(nextSource));
  };

  const updateStrategy = (customerTypeId: string, patch: Partial<V39CustomerStrategyResultItem>) => {
    setStrategies((current) => {
      const item = CUSTOMER_DIRECTION_ITEMS.find((bridgeItem) => bridgeItem.id === customerTypeId);
      if (!item) return current;
      const next = {
        ...current,
        [customerTypeId]: {
          ...normalizeV39CustomerStrategyItem(current[customerTypeId], item.id, item.label),
          ...patch,
        },
      };
      saveV39CustomerStrategyResult({ schemaVersion: 1, updatedAt: '', strategies: next });
      return next;
    });
  };

  const applyDirectionDraft = (item: CustomerDirectionItem, decision: V39CustomerDecisionResult, aiCard?: AiMapExtractedCard) => {
    const hasAiCard = aiMapCardHasContent(aiCard);
    const riskGuide = buildRiskGuide(decision);
    const draft = hasAiCard ? buildStrategyFromAiCard(item, decision, aiCard) : {
      priority: strategies[item.id]?.priority || item.defaultPriority,
      memberRole: strategies[item.id]?.memberRole || item.defaultMemberRole,
      strategy: strategies[item.id]?.strategy || defaultDirection(item, decision),
      risk: strategies[item.id]?.risk || riskGuide || '표현·자료·접촉 강도 안전선을 다시 확인합니다.',
    };

    updateStrategy(item.id, draft);
  };

  const copyTwoWeekMapPrompt = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    void navigator.clipboard.writeText(twoWeekMapPrompt).then(() => {
      setAiMapPromptCopied(true);
      window.setTimeout(() => setAiMapPromptCopied(false), 1600);
    });
  };

  return (
    <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Customer × Member Two-Week Execution Map</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">고객군 × 팀원 2주 실행 Map 만들기</h2>
          <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-slate-700">
            6단계 고객 Data 증거 카드를 바탕으로 고객군 후보와 점검 조건을 구분해 2주 실행 Map을 만듭니다. F처럼 표현·자료 안전선은 고객군이 아니라 점검 조건으로 다루고, 팀원 연결은 8단계에서 보완할 1차 후보 수준으로만 남깁니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">확인 List {checklistCount} / {displayItems.length}</div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">대응 방향 {savedStrategyCount} / {displayItems.length}</div>
          <div className="rounded-2xl bg-white px-4 py-3 text-xs font-black leading-5 text-emerald-800 shadow-sm">팀원 연결 {savedMemberConnectionCount} / {displayItems.length}</div>
          <button type="button" className="rounded-2xl border bg-white px-4 py-3 text-xs font-black text-slate-600 shadow-sm" onClick={refreshCustomerJudgmentBridge}>6단계 확인 List 새로고침</button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <SelectionChips title="6단계 선택 증거 카드" items={displayItems.map((item) => item.label)} empty="전체 후보와 조건을 표시합니다." />
        <SelectionChips title="고객군 후보" items={displayItems.filter((item) => item.kind === 'customerGroup').map((item) => item.label)} empty="고객군 후보가 아직 없습니다." />
        <SelectionChips title="점검 조건" items={displayItems.filter((item) => item.kind === 'condition').map((item) => item.label)} empty="점검 조건이 아직 없습니다." />
      </div>

      <section className="mt-4 rounded-3xl border border-sky-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-sky-700">AI로 2주 실행 Map 초안 만들기</p>
            <h3 className="mt-1 text-lg font-black text-slate-950">고객군별 2주 실행 카드를 만듭니다</h3>
            <p className="mt-2 max-w-3xl text-xs font-bold leading-5 text-slate-600">
              6단계 단서를 고객군 후보, 점검 조건, 2주 행동, 팀원 확인 질문, 안전선, 다음 회의 확인 포인트로 정리합니다. 핵심은 “이번 2주 행동”이며, 고객 우선순위·등급·처방 가능성 판단은 사용하지 않습니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl bg-sky-700 px-4 py-3 text-xs font-black text-white shadow-sm" onClick={copyTwoWeekMapPrompt}>{aiMapPromptCopied ? '프롬프트 복사 완료' : 'AI 2주 실행 Map 프롬프트 복사'}</button>
        </div>
        <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{twoWeekMapPrompt}</pre>
        <label className="mt-3 block space-y-1">
          <span className="text-xs font-black text-slate-500">AI 2주 실행 Map 초안 붙여넣기</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6"
            value={aiMapDraft}
            onChange={(event) => setAiMapDraft(event.target.value)}
            placeholder="AI가 만든 2주 실행 Map 초안을 붙여넣으세요. 아래 고객군별 실행 카드에서 이번 2주 행동을 먼저 확인합니다."
          />
        </label>
        {hasAiMapDraft ? (
          <section className="mt-3 space-y-3 rounded-3xl border border-sky-100 bg-sky-50 p-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-sky-700">AI 결과 1차 분리 정리</p>
              <h4 className="mt-1 text-base font-black text-slate-950">AI가 찾은 고객군/점검 조건</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">항목별 긴 요약보다 고객군별 실행 카드로 봅니다. 본문 bullet을 새 카드 제목으로 오해하지 않고, 아래 카드에서 “이번 2주 행동”을 먼저 확인합니다.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {extractedAiMapCards.map((card, cardIndex) => {
                  const actionCount = getAiMapBucketItems(card, '이번 2주 행동').length;
                  return (
                    <span key={`${card.cardTitle}-${cardIndex}`} className="rounded-full bg-white px-3 py-2 text-xs font-black text-sky-800 shadow-sm">
                      {cardIndex + 1}. {card.cardTitle} · 행동 {actionCount}개
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-violet-700">고객군별 2주 실행 카드</p>
              <h4 className="mt-1 text-base font-black text-slate-950">고객군별로 “이번 2주 행동”을 먼저 확인하세요</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">아래 카드는 AI 초안을 고객군/점검 조건별로 나눈 것입니다. 실행 행동을 검토한 뒤, 연결된 카드만 “이 행동을 2주 대응 방향에 반영하기”로 옮길 수 있습니다.</p>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                {extractedAiMapCards.map((card, cardIndex) => {
                  const actionItems = getAiMapBucketItems(card, '이번 2주 행동');
                  const clueItems = getAiMapBucketItems(card, '확인된 단서');
                  const missingItems = getAiMapBucketItems(card, '아직 부족한 정보');
                  const questionItems = getAiMapBucketItems(card, '팀원에게 확인할 질문');
                  const safetyItems = getAiMapBucketItems(card, '표현·자료 안전선');
                  const meetingItems = getAiMapBucketItems(card, '다음 회의에서 확인할 것');
                  const matchedItem = displayItems.find((candidate) => textMatchesDirectionItem(card.cardTitle, candidate))
                    ?? displayItems.find((candidate) => textMatchesDirectionItem(getAiMapBucketText(card, '고객군 후보 또는 점검 조건'), candidate));
                  const matchedDecision = matchedItem ? decisions[matchedItem.id] ?? normalizeV39CustomerDecisionResult(undefined, matchedItem.id, matchedItem.label) : undefined;

                  return (
                    <section key={`${card.cardTitle}-${cardIndex}`} className="rounded-3xl border border-white bg-white p-4 text-xs font-bold leading-5 text-slate-700 shadow-sm">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-black text-slate-950">{cardIndex + 1}. {card.cardTitle}</p>
                          <p className={`mt-1 text-xs font-black ${matchedItem ? 'text-emerald-700' : 'text-amber-700'}`}>{matchedItem ? `AI 결과 연결됨: ${matchedItem.label}` : '연결된 앱 카드가 없어 검토용으로만 표시됩니다.'}</p>
                        </div>
                        <button
                          type="button"
                          disabled={!matchedItem || !matchedDecision}
                          className={`rounded-2xl px-4 py-2 text-xs font-black shadow-sm ${matchedItem ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400'}`}
                          onClick={() => matchedItem && matchedDecision ? applyDirectionDraft(matchedItem, matchedDecision, card) : undefined}
                        >
                          이 행동을 2주 대응 방향에 반영하기
                        </button>
                      </div>

                      <div className="mt-3 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
                        <p className="font-black text-emerald-950">이번 2주 행동</p>
                        <p className="mt-1 text-emerald-800">확정 지시가 아니라 팀장이 수정할 실행 가설입니다.</p>
                        <ol className="mt-3 space-y-2 pl-4 list-decimal">
                          {actionItems.length > 0 ? actionItems.map((item) => <li key={item}>{item}</li>) : <li className="text-emerald-500">AI 초안에서 아직 찾지 못했습니다.</li>}
                        </ol>
                      </div>

                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <CompactBucket title="확인된 단서" items={clueItems} empty="AI 초안에서 아직 찾지 못했습니다." />
                        <CompactBucket title="아직 부족한 정보" items={missingItems} empty="AI 초안에서 아직 찾지 못했습니다." />
                        <CompactBucket title="팀원에게 확인할 질문" items={questionItems} empty="AI 초안에서 아직 찾지 못했습니다." />
                        <CompactBucket title="표현·자료 안전선" items={safetyItems} empty="AI 초안에서 아직 찾지 못했습니다." />
                        <div className="md:col-span-2"><CompactBucket title="다음 회의에서 확인할 것" items={meetingItems} empty="AI 초안에서 아직 찾지 못했습니다." /></div>
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
        <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
          AI 초안은 그대로 확정하지 않습니다. “집중 공략”, “우선순위 상향”, “처방 가능성” 같은 표현은 삭제하거나 “추가 확인 후 7단계에서 판단”으로 바꿉니다.
        </div>
      </section>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {displayItems.map((item) => {
          const current = decisions[item.id] ?? normalizeV39CustomerDecisionResult(undefined, item.id, item.label);
          const strategy = strategies[item.id] ?? normalizeV39CustomerStrategyItem(undefined, item.id, item.label);
          const sourceSummary = current.judgmentMemo.trim() || current.reason.trim() || item.defaultGuide;
          const kindLabel = item.kind === 'condition' ? '점검 조건' : '고객군 후보';
          const matchedAiCard = hasAiMapDraft ? findAiMapCardForItem(item, extractedAiMapCards, displayItems) : undefined;
          const hasMatchedAiCard = aiMapCardHasContent(matchedAiCard);

          return (
            <article key={item.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-black text-slate-950">{item.label}</p>
                  <p className="mt-1 text-xs font-black text-slate-500">{kindLabel}</p>
                  {hasAiMapDraft ? <p className={`mt-2 text-xs font-black ${hasMatchedAiCard ? 'text-emerald-700' : 'text-amber-700'}`}>{hasMatchedAiCard ? `AI 결과 연결됨: ${matchedAiCard?.cardTitle}` : '이 카드와 일치하는 AI 결과를 찾지 못해 기본 초안을 사용합니다.'}</p> : null}
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-900">{strategy.priority || item.defaultPriority}</span>
              </div>
              <p className="mt-3 text-xs font-black text-emerald-700">6단계 고객 Data 증거 요약</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{sourceSummary}</p>
              <div className="mt-3 grid gap-2 text-xs font-bold leading-5 text-slate-700">
                <div className="rounded-2xl bg-emerald-50 p-3"><span className="font-black text-emerald-900">기회 단서</span><br />{current.opportunitySignal || '6단계에서 기회 단서를 정리하면 표시됩니다.'}</div>
                <div className="rounded-2xl bg-amber-50 p-3"><span className="font-black text-amber-900">주의·보완 조건</span><br />{buildRiskGuide(current) || '주의 단서, 부족 정보, 안전선을 확인합니다.'}</div>
                <div className="rounded-2xl bg-sky-50 p-3"><span className="font-black text-sky-900">팀원 확인 질문</span><br />{current.nextCheck || '다음 대화 전에 팀원이 확인할 질문을 정리합니다.'}</div>
              </div>
              <button type="button" className="mt-3 w-full rounded-2xl bg-emerald-700 px-4 py-2 text-xs font-black text-white" onClick={() => applyDirectionDraft(item, current, matchedAiCard)}>{hasMatchedAiCard ? 'AI 결과에서 가져오기' : '6단계 단서로 실행 Map 초안 가져오기'}</button>

              <div className="mt-3 space-y-3">
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">2주 대응 방식</span><select className="w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={strategy.priority} onChange={(event) => updateStrategy(item.id, { priority: event.target.value })}><option value="">선택하세요</option>{RESPONSE_DIRECTION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">2주 대응 방향</span><textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.strategy} onChange={(event) => updateStrategy(item.id, { strategy: event.target.value })} placeholder="예: 고객 질문의 구체성을 확인하고, 승인자료 범위 안에서 다음 접점 주제를 준비한다." /></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">팀원 연결 기준 / 실제 연결 후보</span><select className="w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={strategy.memberRole} onChange={(event) => updateStrategy(item.id, { memberRole: event.target.value })}><option value="">선택하세요</option>{MEMBER_ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">위험·보완 조건</span><textarea className="min-h-20 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.risk} onChange={(event) => updateStrategy(item.id, { risk: event.target.value })} placeholder="예: 표현 안전선, 부족 정보, 고객 부담 가능성을 먼저 확인한다." /></label>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function V39CustomerPriorityLab() {
  return <V39CustomerJudgmentBridgePanel />;
}
