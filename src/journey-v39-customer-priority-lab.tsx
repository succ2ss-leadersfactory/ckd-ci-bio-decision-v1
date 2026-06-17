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

type CustomerDirectionItem = {
  id: string;
  label: string;
  kind: 'customerGroup' | 'condition';
  defaultGuide: string;
  defaultPriority: string;
  defaultMemberRole: string;
};

type ReadableAiCard = {
  cardTitle: string;
  rawBody: string;
  summaryLines: string[];
  actionLines: string[];
  safetyLines: string[];
  source: 'json' | 'markdown';
};

type JsonAction = {
  title: string;
  records: string[];
  questions: string[];
  outputs: string[];
  timing: string;
};

type JsonCard = {
  title: string;
  type: 'customerGroup' | 'condition';
  confirmedClues: string[];
  missingInfo: string[];
  actions: JsonAction[];
  teamQuestions: string[];
  safety: string[];
  nextMeeting: string[];
};

const V39_CUSTOMER_TWO_WEEK_DIRECTION_SMOKE_MARKERS = [
  'V39CustomerPriorityLab',
  'V39CustomerJudgmentBridgePanel',
  '고객군별 2주 대응 방향',
  '고객군 × 팀원 2주 실행 Map',
  '6단계 고객 Data 확인 List',
  '대응 강도',
  '2주 대응 방향',
  '이번 2주 실행 행동',
  'AI 결과 전체를 고객군별로 정리합니다',
  '고객군별로만 분리합니다',
  '세부 필드 강제 분리 중단',
  'AI 결과 전체 붙여넣기',
  '팀장 검토용 요약',
  '앱 붙여넣기용 JSON',
  '고객군별 AI 결과 전체 보기',
  '이 내용을 2주 대응 방향에 반영하기',
  'AI 결과 연결됨',
  '정보 보완 고객군',
  '안전선 점검 조건',
  '표현·자료 안전선 점검',
  '고객군/점검 조건별 분리',
  '고객군별 2주 실행 카드',
  '대응군 C · 신규·미접촉 고객군',
  '대응군 F · 표현·자료 안전선 고객군',
].join('|');
void V39_CUSTOMER_TWO_WEEK_DIRECTION_SMOKE_MARKERS;

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

function uniqueList(items: string[], limit = 20) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of items) {
    const clean = item.trim();
    if (!clean || seen.has(clean)) continue;
    seen.add(clean);
    result.push(clean);
    if (result.length >= limit) break;
  }
  return result;
}

function stripMarkdown(value: string) {
  return value
    .replace(/^\s*#{1,6}\s*/, '')
    .replace(/^\s*[-*•]\s*/, '')
    .replace(/^\s*\d+[.)]\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .trim();
}

function toStringList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.flatMap(toStringList).map(stripMarkdown).filter(Boolean);
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>).flatMap(toStringList).map(stripMarkdown).filter(Boolean);
  return String(value).split(/\r?\n/).map(stripMarkdown).filter(Boolean);
}

function pickValue(source: unknown, keys: string[]) {
  if (!source || typeof source !== 'object') return undefined;
  const data = source as Record<string, unknown>;
  for (const key of keys) {
    if (data[key] !== undefined) return data[key];
  }
  return undefined;
}

function extractJsonCandidate(raw: string) {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1] ?? raw;
  const start = source.indexOf('{');
  const end = source.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  return source.slice(start, end + 1);
}

function parseJsonAction(raw: unknown): JsonAction | null {
  if (!raw || typeof raw !== 'object') {
    const title = toStringList(raw)[0] ?? '';
    return title ? { title, records: [], questions: [], outputs: [], timing: '' } : null;
  }

  const title = toStringList(pickValue(raw, ['title', 'action', 'name', 'label', 'task', '행동', '실행']))[0] ?? '';
  if (!title) return null;
  return {
    title,
    records: toStringList(pickValue(raw, ['records', 'record', 'checkRecords', 'evidence', 'data', '확인할 기록', '확인 기록', '확인자료', '근거자료'])),
    questions: toStringList(pickValue(raw, ['questions', 'teamQuestions', 'question', '팀원 질문', '확인 질문', 'teamQuestion'])),
    outputs: toStringList(pickValue(raw, ['outputs', 'deliverables', 'artifacts', 'result', '남길 산출물', '산출물', '결과물'])),
    timing: toStringList(pickValue(raw, ['timing', 'when', 'deadline', '실행 시점', '시점']))[0] ?? '',
  };
}

function parseJsonCards(raw: string): ReadableAiCard[] | null {
  const candidate = extractJsonCandidate(raw);
  if (!candidate) return null;

  try {
    const parsed = JSON.parse(candidate) as Record<string, unknown>;
    const rawCards = pickValue(parsed, ['cards', 'customerGroups', 'groups', 'items', 'maps', 'results']);
    if (!Array.isArray(rawCards) || rawCards.length === 0) return null;

    return rawCards.map((card, index) => {
      const title = toStringList(pickValue(card, ['title', 'cardTitle', 'name', 'customerGroup', 'group', 'label', '고객군']))[0] || `고객군/점검 조건 ${index + 1}`;
      const confirmedClues = toStringList(pickValue(card, ['confirmedClues', 'clues', 'confirmedSignals', '확인된 단서', '단서']));
      const missingInfo = toStringList(pickValue(card, ['missingInfo', 'missing', 'unknowns', '아직 부족한 정보', '부족 정보']));
      const actions = (Array.isArray(pickValue(card, ['actions', 'twoWeekActions', 'actionItems', '이번 2주 행동', '2주 행동']))
        ? (pickValue(card, ['actions', 'twoWeekActions', 'actionItems', '이번 2주 행동', '2주 행동']) as unknown[])
        : toStringList(pickValue(card, ['actions', 'twoWeekActions', 'actionItems', '이번 2주 행동', '2주 행동'])))
        .map(parseJsonAction)
        .filter((item): item is JsonAction => Boolean(item));
      const teamQuestions = toStringList(pickValue(card, ['teamQuestions', 'questions', '팀원에게 확인할 질문', '팀원 질문']));
      const safety = toStringList(pickValue(card, ['safety', 'compliance', 'guardrails', '표현·자료 안전선', '안전선']));
      const nextMeeting = toStringList(pickValue(card, ['nextMeeting', 'nextMeetingChecks', 'nextCheck', '다음 회의에서 확인할 것', '다음 회의 확인']));

      const bodyLines = [
        '확인된 단서',
        ...(confirmedClues.length ? confirmedClues.map((item) => `- ${item}`) : ['- AI 결과에서 확인된 단서를 찾지 못했습니다.']),
        '',
        '아직 부족한 정보',
        ...(missingInfo.length ? missingInfo.map((item) => `- ${item}`) : ['- AI 결과에서 부족 정보를 찾지 못했습니다.']),
        '',
        '이번 2주 행동',
        ...(actions.length
          ? actions.flatMap((action, actionIndex) => [
              `${actionIndex + 1}. ${action.title}`,
              ...(action.records.length ? [`   - 확인할 기록: ${action.records.join(', ')}`] : []),
              ...(action.questions.length ? [`   - 팀원 질문: ${action.questions.join(', ')}`] : []),
              ...(action.outputs.length ? [`   - 남길 산출물: ${action.outputs.join(', ')}`] : []),
              ...(action.timing ? [`   - 실행 시점: ${action.timing}`] : []),
            ])
          : ['- AI 결과에서 2주 행동을 찾지 못했습니다.']),
        '',
        '팀원에게 확인할 질문',
        ...(teamQuestions.length ? teamQuestions.map((item) => `- ${item}`) : ['- AI 결과에서 팀원 확인 질문을 찾지 못했습니다.']),
        '',
        '표현·자료 안전선',
        ...(safety.length ? safety.map((item) => `- ${item}`) : ['- AI 결과에서 표현·자료 안전선을 찾지 못했습니다.']),
        '',
        '다음 회의에서 확인할 것',
        ...(nextMeeting.length ? nextMeeting.map((item) => `- ${item}`) : ['- AI 결과에서 다음 회의 확인 항목을 찾지 못했습니다.']),
      ];

      return {
        cardTitle: title,
        rawBody: bodyLines.join('\n'),
        summaryLines: uniqueList([...confirmedClues, ...missingInfo], 6),
        actionLines: uniqueList(actions.map((action) => action.title), 6),
        safetyLines: uniqueList(safety, 6),
        source: 'json',
      };
    });
  } catch {
    return null;
  }
}

function normalizeCardTitle(line: string) {
  const clean = line.replace(/^\s*#{1,6}\s*/, '').replace(/\*\*/g, '').trim();
  const patterns = [
    /^고객군\/점검\s*조건\s*(?:[①-⑳]|\d+|[A-F])?\s*[.)·:-]?\s*(.+)$/i,
    /^고객군\s*(?:[①-⑳]|\d+|[A-F])\s*[.)·:-]?\s*(.+)$/i,
    /^점검\s*조건\s*(?:[①-⑳]|\d+|[A-F])\s*[.)·:-]?\s*(.+)$/i,
    /^대응군\s*(?:[①-⑳]|\d+|[A-F])\s*[.)·:-]?\s*(.+)$/i,
    /^(?:Group|Segment|Customer Group|Case)\s*(?:[①-⑳]|\d+|[A-F])\s*[.)·:-]?\s*(.+)$/i,
  ];
  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function splitMarkdownCards(raw: string): ReadableAiCard[] {
  const lines = raw.split(/\r?\n/);
  const cards: { title: string; lines: string[] }[] = [];
  let current: { title: string; lines: string[] } | null = null;
  const preface: string[] = [];

  for (const line of lines) {
    const isTopHeading = /^\s*#{1,2}\s+/.test(line);
    const title = isTopHeading ? normalizeCardTitle(line) : null;
    if (title && !/고객군\s*후보\s*또는\s*점검\s*조건/.test(title)) {
      if (current) cards.push(current);
      current = { title, lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
    else preface.push(line);
  }

  if (current) cards.push(current);
  const normalizedCards = cards.length > 0 ? cards : [{ title: 'AI 결과 전체', lines: preface }];
  return normalizedCards.map((card) => {
    const cleanedLines = card.lines
      .filter((line) => !/^\s*---+\s*$/.test(line))
      .map((line) => line.trimEnd())
      .filter((line, index, source) => line || (source[index - 1] && source[index + 1]));
    return {
      cardTitle: card.title,
      rawBody: cleanedLines.join('\n').trim() || 'AI 결과에서 이 고객군의 세부 내용을 찾지 못했습니다.',
      summaryLines: extractLinesByKeywords(cleanedLines, ['확인된 단서', '부족', '후보', '조건'], 6),
      actionLines: extractLinesByKeywords(cleanedLines, ['행동', '실행', '확인한다', '정리한다', '구분한다', '점검한다', '기록한다'], 6),
      safetyLines: extractLinesByKeywords(cleanedLines, ['안전선', '승인', '미승인', '단정', '처방', '등급', '개인정보'], 6),
      source: 'markdown',
    };
  });
}

function extractLinesByKeywords(lines: string[], keywords: string[], limit: number) {
  return uniqueList(
    lines
      .map(stripMarkdown)
      .filter((line) => line.length > 0 && keywords.some((keyword) => line.includes(keyword))),
    limit,
  );
}

function extractReadableAiCards(raw: string): ReadableAiCard[] {
  return parseJsonCards(raw) ?? splitMarkdownCards(raw);
}

function normalizeMatchText(value: string) {
  return value
    .toLowerCase()
    .replace(/고객군\/점검\s*조건/gi, '')
    .replace(/대응군/gi, '')
    .replace(/고객군/gi, '')
    .replace(/점검\s*조건/gi, '점검')
    .replace(/[①-⑳\d\s\[\]().,·:：?？!！\/-]/g, '')
    .trim();
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

function findAiCardForItem(item: CustomerDirectionItem, cards: ReadableAiCard[], displayItems: CustomerDirectionItem[]) {
  const titleMatch = cards.find((card) => textMatchesDirectionItem(card.cardTitle, item));
  if (titleMatch) return titleMatch;
  const bodyMatch = cards.find((card) => textMatchesDirectionItem(`${card.cardTitle}\n${card.rawBody}`, item));
  if (bodyMatch) return bodyMatch;
  if (displayItems.length === 1 && cards.length === 1) return cards[0];
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

function inferPriorityFromAiText(item: CustomerDirectionItem, card: ReadableAiCard | undefined) {
  const text = card ? `${card.cardTitle}\n${card.rawBody}` : '';
  return RESPONSE_DIRECTION_OPTIONS.find((option) => text.includes(option)) || item.defaultPriority;
}

function buildStrategyFromAiCard(item: CustomerDirectionItem, decision: V39CustomerDecisionResult, card: ReadableAiCard | undefined) {
  const fallbackAction = defaultDirection(item, decision);
  const fallbackRisk = buildRiskGuide(decision) || '표현·자료·접촉 강도 안전선을 다시 확인합니다.';
  return {
    priority: inferPriorityFromAiText(item, card),
    memberRole: item.defaultMemberRole,
    strategy: card?.actionLines.length ? card.actionLines.slice(0, 4).join('\n') : fallbackAction,
    risk: card?.safetyLines.length ? card.safetyLines.slice(0, 4).join('\n') : fallbackRisk,
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
    '출력은 반드시 아래 두 영역으로만 구성하세요.',
    '',
    '## 1. 팀장 검토용 요약',
    '- 고객군별로 이번 2주 행동 3~4개를 번호 목록으로 정리하세요.',
    '- 각 고객군마다 주의할 표현·자료 안전선 2~3개를 함께 적으세요.',
    '- 표는 사용하지 말고, 짧은 문장으로 작성하세요.',
    '- 고객을 공략하거나 우선순위화하거나 등급화하는 표현은 사용하지 마세요.',
    '',
    '## 2. 앱 붙여넣기용 JSON',
    '- 아래 JSON 코드블록 하나를 반드시 포함하세요.',
    '- 앱은 이 JSON만 자동으로 읽어 고객군별 실행 Map으로 정리합니다.',
    '- JSON 스키마는 아래 예시를 그대로 따르세요.',
    '```json',
    '{',
    '  "cards": [',
    '    {',
    '      "title": "다음 접점 고객군",',
    '      "type": "customerGroup",',
    '      "confirmedClues": ["확인된 단서 1"],',
    '      "missingInfo": ["아직 부족한 정보 1"],',
    '      "actions": [',
    '        {',
    '          "title": "다음 회의 전, 확인할 행동을 쓴다",',
    '          "records": ["확인할 기록"],',
    '          "questions": ["팀원에게 확인할 질문"],',
    '          "outputs": ["남길 산출물"],',
    '          "timing": "다음 회의 전"',
    '        }',
    '      ],',
    '      "teamQuestions": ["팀원에게 확인할 질문"],',
    '      "safety": ["표현·자료 안전선"],',
    '      "nextMeeting": ["다음 회의에서 확인할 것"]',
    '    }',
    '  ]',
    '}',
    '```',
    '',
    '주의: 팀장 검토용 요약은 사람이 읽기 위한 영역이고, 앱 붙여넣기용 JSON은 앱이 읽기 위한 영역입니다. 교육생은 결과 전체를 앱에 붙여넣으면 됩니다.',
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

function ReadableMarkdownBlock({ body }: { body: string }) {
  const lines = body.split(/\r?\n/);
  return (
    <div className="space-y-2 text-sm font-bold leading-6 text-slate-700">
      {lines.map((line, index) => {
        const clean = line.trim();
        if (!clean) return <div key={`space-${index}`} className="h-1" />;
        if (/^(확인된 단서|아직 부족한 정보|이번 2주 행동|팀원에게 확인할 질문|표현·자료 안전선|다음 회의에서 확인할 것)$/i.test(clean)) {
          return <p key={index} className="mt-3 text-sm font-black text-emerald-900">{clean}</p>;
        }
        if (/^\d+[.)]\s*/.test(clean)) {
          return <p key={index} className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-900 shadow-sm">{clean}</p>;
        }
        if (/^[-*•]\s*/.test(clean)) {
          return <p key={index} className="pl-4 text-sm text-slate-700">• {stripMarkdown(clean)}</p>;
        }
        if (/^\s+-\s*/.test(line)) {
          return <p key={index} className="pl-7 text-xs text-slate-600">- {stripMarkdown(clean)}</p>;
        }
        return <p key={index}>{clean}</p>;
      })}
    </div>
  );
}

function ReadableAiResultCard({
  card,
  index,
  matchedItem,
  canApply,
  onApply,
}: {
  card: ReadableAiCard;
  index: number;
  matchedItem?: CustomerDirectionItem;
  canApply: boolean;
  onApply: () => void;
}) {
  return (
    <section className="rounded-3xl border border-white bg-white p-4 text-xs font-bold leading-5 text-slate-700 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-base font-black text-slate-950">{index + 1}. {card.cardTitle}</p>
          <p className={`mt-1 text-xs font-black ${matchedItem ? 'text-emerald-700' : 'text-amber-700'}`}>
            {matchedItem ? `AI 결과 연결됨: ${matchedItem.label}` : '연결된 앱 카드가 없어 검토용으로만 표시됩니다.'}
          </p>
          <p className="mt-1 text-[11px] font-black text-slate-400">{card.source === 'json' ? 'JSON 결과를 읽기 좋은 카드로 변환했습니다.' : 'AI 원문 흐름을 유지해 고객군별로 정리했습니다.'}</p>
        </div>
        <button
          type="button"
          disabled={!canApply}
          className={`rounded-2xl px-4 py-2 text-xs font-black shadow-sm ${canApply ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-400'}`}
          onClick={onApply}
        >
          이 내용을 2주 대응 방향에 반영하기
        </button>
      </div>
      <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-4">
        <ReadableMarkdownBlock body={card.rawBody} />
      </div>
    </section>
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
  const readableAiCards = useMemo(() => extractReadableAiCards(aiMapDraft), [aiMapDraft]);
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

  const applyDirectionDraft = (item: CustomerDirectionItem, decision: V39CustomerDecisionResult, aiCard?: ReadableAiCard) => {
    const riskGuide = buildRiskGuide(decision);
    const draft = aiCard ? buildStrategyFromAiCard(item, decision, aiCard) : {
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
            6단계 고객 Data 증거 카드를 바탕으로 고객군 후보와 점검 조건을 구분해 2주 실행 Map을 만듭니다. 이제 AI 결과를 세부 필드로 억지 분리하지 않고, 고객군별로만 나누어 전체 흐름을 읽기 좋게 보여줍니다.
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
            <h3 className="mt-1 text-lg font-black text-slate-950">AI 결과 전체를 고객군별로 정리합니다</h3>
            <p className="mt-2 max-w-3xl text-xs font-bold leading-5 text-slate-600">
              AI 도구에서는 팀장 검토용 요약을 먼저 읽고, 앱에는 결과 전체를 그대로 붙여넣으세요. 앱은 고객군/점검 조건 단위로만 나누고, 세부 항목은 원문 흐름을 살려 보여줍니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl bg-sky-700 px-4 py-3 text-xs font-black text-white shadow-sm" onClick={copyTwoWeekMapPrompt}>{aiMapPromptCopied ? '프롬프트 복사 완료' : 'AI 2주 실행 Map 프롬프트 복사'}</button>
        </div>
        <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs leading-5 text-slate-100">{twoWeekMapPrompt}</pre>
        <label className="mt-3 block space-y-1">
          <span className="text-xs font-black text-slate-500">AI 결과 전체 붙여넣기</span>
          <textarea
            className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6"
            value={aiMapDraft}
            onChange={(event) => setAiMapDraft(event.target.value)}
            placeholder="AI 도구에서 생성된 결과 전체를 그대로 붙여넣으세요. 앱은 고객군/점검 조건별로만 나누고, 각 카드 안에는 결과 전체를 읽기 좋게 정리합니다."
          />
        </label>
        {hasAiMapDraft ? (
          <section className="mt-3 space-y-3 rounded-3xl border border-sky-100 bg-sky-50 p-4">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-sky-700">AI 결과 1차 분리 정리</p>
              <h4 className="mt-1 text-base font-black text-slate-950">고객군/점검 조건별 결과 보기</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
                아래 카드는 AI 결과를 고객군/점검 조건별로만 나눈 것입니다. 확인할 기록·팀원 질문·산출물·실행 시점은 별도 필드로 강제 분리하지 않고, 각 카드 안에서 AI 결과 흐름 그대로 확인합니다.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {readableAiCards.map((card, cardIndex) => (
                  <span key={`${card.cardTitle}-${cardIndex}`} className="rounded-full bg-white px-3 py-2 text-xs font-black text-sky-800 shadow-sm">
                    {cardIndex + 1}. {card.cardTitle}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-violet-700">고객군별 AI 결과 전체 보기</p>
              <h4 className="mt-1 text-base font-black text-slate-950">고객군별로 AI 결과 흐름을 확인하세요</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
                이 영역은 AI 초안을 읽는 곳입니다. 최종 2주 대응 방향은 아래 입력칸에서 팀장 판단으로 다시 줄이고 고쳐 씁니다.
              </p>
              <div className="mt-3 grid gap-4 lg:grid-cols-2">
                {readableAiCards.map((card, cardIndex) => {
                  const matchedItem = displayItems.find((candidate) => textMatchesDirectionItem(card.cardTitle, candidate))
                    ?? displayItems.find((candidate) => textMatchesDirectionItem(card.rawBody, candidate));
                  const matchedDecision = matchedItem ? decisions[matchedItem.id] ?? normalizeV39CustomerDecisionResult(undefined, matchedItem.id, matchedItem.label) : undefined;

                  return (
                    <ReadableAiResultCard
                      key={`${card.cardTitle}-${cardIndex}`}
                      card={card}
                      index={cardIndex}
                      matchedItem={matchedItem}
                      canApply={Boolean(matchedItem && matchedDecision)}
                      onApply={() => matchedItem && matchedDecision ? applyDirectionDraft(matchedItem, matchedDecision, card) : undefined}
                    />
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
          const matchedAiCard = hasAiMapDraft ? findAiCardForItem(item, readableAiCards, displayItems) : undefined;
          const hasMatchedAiCard = Boolean(matchedAiCard);

          return (
            <article key={item.id} className="rounded-2xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-black text-slate-950">{item.label}</p>
                  <p className="mt-1 text-xs font-black text-slate-500">{kindLabel}</p>
                  {hasAiMapDraft ? <p className={`mt-2 text-xs font-black ${hasMatchedAiCard ? 'text-emerald-700' : 'text-amber-700'}`}>{hasMatchedAiCard ? `AI 결과 연결됨: ${matchedAiCard?.cardTitle}` : '이 카드와 일치하는 AI 결과를 찾지 못해 6단계 단서를 사용합니다.'}</p> : null}
                </div>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-900">{strategy.priority || item.defaultPriority}</span>
              </div>
              <p className="mt-3 text-xs font-black text-emerald-700">6단계 고객 Data 증거 요약</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{sourceSummary}</p>
              {hasMatchedAiCard ? (
                <div className="mt-3 rounded-2xl bg-violet-50 p-3 text-xs font-bold leading-5 text-violet-950">
                  <p className="font-black">AI 결과에서 가져온 핵심 행동</p>
                  <ul className="mt-1 space-y-1">
                    {(matchedAiCard?.actionLines.length ? matchedAiCard.actionLines.slice(0, 3) : ['AI 결과 전체를 읽고 필요한 행동을 직접 줄여 쓰세요.']).map((line) => <li key={line}>• {line}</li>)}
                  </ul>
                </div>
              ) : null}
              <button type="button" className="mt-3 w-full rounded-2xl bg-emerald-700 px-4 py-2 text-xs font-black text-white" onClick={() => applyDirectionDraft(item, current, matchedAiCard)}>{hasMatchedAiCard ? 'AI 결과 핵심 내용 가져오기' : '6단계 단서로 실행 Map 초안 가져오기'}</button>

              <div className="mt-3 space-y-3">
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">2주 대응 방식</span><select className="w-full rounded-2xl border px-3 py-2 text-sm font-bold" value={strategy.priority} onChange={(event) => updateStrategy(item.id, { priority: event.target.value })}><option value="">선택하세요</option>{RESPONSE_DIRECTION_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
                <label className="block space-y-1"><span className="text-xs font-black text-slate-500">이번 2주 실행 행동</span><textarea className="min-h-32 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={strategy.strategy} onChange={(event) => updateStrategy(item.id, { strategy: event.target.value })} placeholder="예: 다음 회의 전, 고객 질문의 구체성을 확인하고 승인자료 범위 안에서 다음 접점 주제를 정리한다." /></label>
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
