export type V39ParsedAction = {
  title: string;
  records: string[];
  questions: string[];
  outputs: string[];
  timing: string;
};

export type V39ParsedTwoWeekMapCard = {
  title: string;
  type: 'customerGroup' | 'condition';
  confirmedClues: string[];
  missingInfo: string[];
  actions: V39ParsedAction[];
  teamQuestions: string[];
  safety: string[];
  nextMeeting: string[];
};

export type V39ParsedTwoWeekMapResult = {
  source: 'json' | 'markdown';
  cards: V39ParsedTwoWeekMapCard[];
};

const V39_JSON_FIRST_PARSER_SMOKE_MARKERS = [
  'parseV39TwoWeekMapResult',
  'JSON 우선 파서',
  'Markdown fallback',
  'cards',
  'confirmedClues',
  'missingInfo',
  'actions',
  'records',
  'questions',
  'outputs',
  'timing',
  'safety',
  'nextMeeting',
  'GPT Claude Gemini 공통 구조',
].join('|');
void V39_JSON_FIRST_PARSER_SMOKE_MARKERS;

function toStringList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => toStringList(item))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/\r?\n/)
      .map((item) => item.replace(/^[-*•]\s*/, '').trim())
      .filter(Boolean);
  }
  if (typeof value === 'number' || typeof value === 'boolean') return [String(value)];
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap((item) => toStringList(item));
  }
  return [];
}

function pickValue(source: Record<string, unknown>, keys: string[]): unknown {
  for (const key of keys) {
    if (source[key] !== undefined) return source[key];
  }
  return undefined;
}

function extractJsonCandidate(raw: string): string | null {
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const source = fenced?.[1] ?? raw;
  const start = source.indexOf('{');
  const end = source.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  return source.slice(start, end + 1);
}

function normalizeAction(raw: unknown): V39ParsedAction | null {
  if (!raw || typeof raw !== 'object') {
    const title = toStringList(raw)[0];
    return title ? { title, records: [], questions: [], outputs: [], timing: '' } : null;
  }

  const item = raw as Record<string, unknown>;
  const title = toStringList(pickValue(item, ['title', 'action', 'name', 'label', 'task', '행동', '실행']))[0] ?? '';
  if (!title) return null;

  return {
    title,
    records: toStringList(pickValue(item, ['records', 'record', 'checkRecords', 'evidence', 'data', '확인할 기록', '확인 기록', '확인자료', '근거자료'])),
    questions: toStringList(pickValue(item, ['questions', 'teamQuestions', 'question', '팀원 질문', '확인 질문', 'teamQuestion'])),
    outputs: toStringList(pickValue(item, ['outputs', 'deliverables', 'artifacts', 'result', '남길 산출물', '산출물', '결과물'])),
    timing: toStringList(pickValue(item, ['timing', 'when', 'deadline', '실행 시점', '시점']))[0] ?? '',
  };
}

function normalizeCard(raw: unknown): V39ParsedTwoWeekMapCard | null {
  if (!raw || typeof raw !== 'object') return null;
  const item = raw as Record<string, unknown>;
  const title = toStringList(pickValue(item, ['title', 'cardTitle', 'name', 'customerGroup', 'group', 'label', '고객군']))[0] ?? '';
  if (!title) return null;
  const rawType = String(pickValue(item, ['type', 'kind', '구분']) ?? '').toLowerCase();
  const type: 'customerGroup' | 'condition' = rawType.includes('condition') || title.includes('점검') || title.includes('안전선') ? 'condition' : 'customerGroup';
  const rawActions = pickValue(item, ['actions', 'twoWeekActions', 'actionItems', '이번 2주 행동', '2주 행동']);
  const actions = Array.isArray(rawActions)
    ? rawActions.map(normalizeAction).filter((action): action is V39ParsedAction => Boolean(action))
    : toStringList(rawActions).map((action) => ({ title: action, records: [], questions: [], outputs: [], timing: '' }));

  return {
    title,
    type,
    confirmedClues: toStringList(pickValue(item, ['confirmedClues', 'clues', 'confirmedSignals', '확인된 단서', '단서'])),
    missingInfo: toStringList(pickValue(item, ['missingInfo', 'missing', 'unknowns', '아직 부족한 정보', '부족 정보'])),
    actions,
    teamQuestions: toStringList(pickValue(item, ['teamQuestions', 'questions', '팀원에게 확인할 질문', '팀원 질문'])),
    safety: toStringList(pickValue(item, ['safety', 'compliance', 'guardrails', '표현·자료 안전선', '안전선'])),
    nextMeeting: toStringList(pickValue(item, ['nextMeeting', 'nextMeetingChecks', 'nextCheck', '다음 회의에서 확인할 것', '다음 회의 확인'])),
  };
}

export function parseV39TwoWeekMapJson(raw: string): V39ParsedTwoWeekMapResult | null {
  const candidate = extractJsonCandidate(raw);
  if (!candidate) return null;

  try {
    const parsed = JSON.parse(candidate) as Record<string, unknown>;
    const rawCards = pickValue(parsed, ['cards', 'customerGroups', 'groups', 'items', 'maps', 'results']);
    const cards = (Array.isArray(rawCards) ? rawCards : [])
      .map(normalizeCard)
      .filter((card): card is V39ParsedTwoWeekMapCard => Boolean(card));
    if (cards.length === 0) return null;
    return { source: 'json', cards };
  } catch {
    return null;
  }
}

export function parsedV39TwoWeekMapToMarkdown(result: V39ParsedTwoWeekMapResult): string {
  return result.cards.map((card, cardIndex) => {
    const marker = cardIndex + 1;
    const lines = [
      `## 고객군/점검 조건 ${marker} ${card.title}`,
      '',
      '### 1. 고객군 후보 또는 점검 조건',
      `* ${card.title}`,
      '',
      '### 2. 확인된 단서',
      ...(card.confirmedClues.length > 0 ? card.confirmedClues.map((item) => `* ${item}`) : ['* AI 초안에서 아직 찾지 못했습니다.']),
      '',
      '### 3. 아직 부족한 정보',
      ...(card.missingInfo.length > 0 ? card.missingInfo.map((item) => `* ${item}`) : ['* AI 초안에서 아직 찾지 못했습니다.']),
      '',
      '### 4. 이번 2주 행동',
      '',
      ...card.actions.flatMap((action, actionIndex) => [
        `#### 행동 ${actionIndex + 1}. ${action.title}`,
        ...(action.records.length > 0 ? [`* 확인할 기록: ${action.records.join(', ')}`] : []),
        ...(action.questions.length > 0 ? [`* 보완 사항: 팀원 질문 - ${action.questions.join(', ')}`] : []),
        ...(action.outputs.length > 0 ? [`* 남길 산출물: ${action.outputs.join(', ')}`] : []),
        ...(action.timing ? [`* 실행 시점: ${action.timing}`] : []),
        '',
      ]),
      '### 5. 팀원에게 확인할 질문',
      ...(card.teamQuestions.length > 0 ? card.teamQuestions.map((item) => `* ${item}`) : ['* AI 초안에서 아직 찾지 못했습니다.']),
      '',
      '### 6. 표현·자료 안전선',
      ...(card.safety.length > 0 ? card.safety.map((item) => `* ${item}`) : ['* AI 초안에서 아직 찾지 못했습니다.']),
      '',
      '### 7. 다음 회의에서 확인할 것',
      ...(card.nextMeeting.length > 0 ? card.nextMeeting.map((item) => `* ${item}`) : ['* AI 초안에서 아직 찾지 못했습니다.']),
    ];
    return lines.join('\n');
  }).join('\n\n---\n\n');
}

export function parseV39TwoWeekMapResult(raw: string): V39ParsedTwoWeekMapResult {
  return parseV39TwoWeekMapJson(raw) ?? { source: 'markdown', cards: [] };
}
