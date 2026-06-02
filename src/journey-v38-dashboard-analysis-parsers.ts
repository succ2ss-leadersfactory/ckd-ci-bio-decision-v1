export type V38MemberPrep = {
  observedSignal: string;
  strengthSignal: string;
  concernSignal: string;
  checkQuestion: string;
  doNotAssume: string;
  aiDraft: string;
  finalPrep: string;
};

export type V38PrepState = Record<string, V38MemberPrep>;
export type V38MetricSectionKey = 'core' | 'support' | 'safety' | 'excluded' | 'additional' | 'questions';
export type V38MetricParseResult = Record<V38MetricSectionKey, string> & { warnings: string[] };
export type V38SignalParseResult = { preps: V38PrepState; warnings: string[] };
export type V38PrepDraftParseResult = { drafts: Record<string, string>; warnings: string[] };

export type V38ParserMember = {
  id: string;
  name: string;
};

export function createEmptyV38MemberPrep(): V38MemberPrep {
  return {
    observedSignal: '',
    strengthSignal: '',
    concernSignal: '',
    checkQuestion: '',
    doNotAssume: '',
    aiDraft: '',
    finalPrep: '',
  };
}

export function cleanV38Markdown(text: string) {
  return text.replace(/<[^>]+>/g, '').replace(/[*`>#]/g, '').replace(/&nbsp;/g, ' ').trim();
}

function isTableSeparator(line: string) {
  return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim());
}

function parseTableCells(line: string) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cleanV38Markdown(cell));
}

function classifyMetricHeading(line: string): V38MetricSectionKey | null {
  const title = cleanV38Markdown(line).replace(/^\d+\.?\s*/, '');
  if (!title) return null;
  if (/질문|면담/.test(title)) return 'questions';
  if (/맞지|제외|채택|역효과/.test(title)) return 'excluded';
  if (/추가|중장기|생각해볼/.test(title)) return 'additional';
  if (/안전선|컴플라이언스|리스크/.test(title)) return 'safety';
  if (/보완|보조|함께/.test(title)) return 'support';
  if (/핵심|직접 연결|우선/.test(title)) return 'core';
  return null;
}

function formatMetricSection(lines: string[], key: V38MetricSectionKey) {
  const output: string[] = [];
  let previousWasQuestionGroup = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === '---' || line.startsWith('>') || isTableSeparator(line)) continue;

    if (line.startsWith('|')) {
      const cells = parseTableCells(line).filter(Boolean);
      if (cells.length === 0 || /지표|관찰|확인|후보|이유|포인트|방법/.test(cells[0])) continue;
      const [name, ...details] = cells;
      const detailText = details.filter(Boolean).map((detail) => `  - ${detail}`).join('\n');
      output.push(`- ${name}${detailText ? `\n${detailText}` : ''}`);
      previousWasQuestionGroup = false;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      output.push(`- ${cleanV38Markdown(line.replace(/^[-*]\s+/, ''))}`);
      previousWasQuestionGroup = false;
      continue;
    }

    if (/^\*\*.+\*\*$/.test(line) || (key === 'questions' && !line.includes('|') && !line.startsWith('#'))) {
      const clean = cleanV38Markdown(line);
      if (clean && !previousWasQuestionGroup) {
        output.push(`${output.length > 0 ? '\n' : ''}${clean}`);
        previousWasQuestionGroup = true;
      }
      continue;
    }

    const clean = cleanV38Markdown(line);
    if (clean && !/^\d+\./.test(clean)) output.push(clean);
    previousWasQuestionGroup = false;
  }

  return output.join('\n').trim();
}

export function parseV38AiMetricSuggestion(rawText: string): V38MetricParseResult {
  const buckets: Record<V38MetricSectionKey, string[]> = {
    core: [],
    support: [],
    safety: [],
    excluded: [],
    additional: [],
    questions: [],
  };
  const warnings: string[] = [];
  let current: V38MetricSectionKey | null = null;

  for (const line of rawText.split(/\r?\n/)) {
    const headingCandidate = /^#{1,6}\s+/.test(line.trim()) || /^\d+\.\s+/.test(line.trim()) || /^##\s*\d+\./.test(line.trim());
    const classified = headingCandidate ? classifyMetricHeading(line) : null;
    if (classified) {
      current = classified;
      continue;
    }
    if (current) buckets[current].push(line);
  }

  const result: V38MetricParseResult = {
    core: formatMetricSection(buckets.core, 'core'),
    support: formatMetricSection(buckets.support, 'support'),
    safety: formatMetricSection(buckets.safety, 'safety'),
    excluded: formatMetricSection(buckets.excluded, 'excluded'),
    additional: formatMetricSection(buckets.additional, 'additional'),
    questions: formatMetricSection(buckets.questions, 'questions'),
    warnings,
  };

  for (const [key, label] of [
    ['core', '핵심 지표'],
    ['support', '보완 지표'],
    ['safety', '안전선 지표'],
    ['excluded', '제외 지표'],
    ['additional', '추가 지표'],
    ['questions', '확인 질문'],
  ] as const) {
    if (!result[key]) warnings.push(`${label} 섹션을 자동으로 찾지 못했습니다.`);
  }

  return result;
}

const MEMBER_FIELD_GROUPS: { field: keyof V38MemberPrep; labels: string[] }[] = [
  { field: 'observedSignal', labels: ['팀원별 관찰 신호', '관찰 신호', '관찰 가능한 신호'] },
  { field: 'strengthSignal', labels: ['강점으로 볼 수 있는 신호', '강점 신호', '강점'] },
  { field: 'concernSignal', labels: ['우려 또는 확인이 필요한 신호', '우려 신호', '확인이 필요한 신호', '우려'] },
  { field: 'checkQuestion', labels: ['추가로 확인해야 할 질문', '추가 확인 질문', '확인 질문'] },
  { field: 'doNotAssume', labels: ['성급하게 단정하면 안 되는 점', '단정하면 안 되는 점', '단정 금지', '성급하게 단정'] },
];

function findMemberField(line: string) {
  const clean = cleanV38Markdown(line).replace(/^[-*]\s*/, '').trim();
  return MEMBER_FIELD_GROUPS.find((group) => group.labels.some((label) => clean.includes(label))) ?? null;
}

function stripMemberFieldLabel(line: string, labels: string[]) {
  let clean = cleanV38Markdown(line).replace(/^[-*]\s*/, '').trim();
  for (const label of labels) clean = clean.replace(label, '');
  return clean.replace(/^\s*[:：\-–—]\s*/, '').trim();
}

function appendPrepField(target: Partial<V38MemberPrep>, field: keyof V38MemberPrep, value: string) {
  if (!value) return;
  target[field] = [target[field], value].filter(Boolean).join('\n');
}

function parseMemberSection(section: string, memberName: string): Partial<V38MemberPrep> {
  const result: Partial<V38MemberPrep> = {};
  let currentField: keyof V38MemberPrep | null = null;

  for (const rawLine of section.split(/\r?\n/)) {
    const clean = cleanV38Markdown(rawLine).replace(/^[-*]\s*/, '').trim();
    if (!clean || clean === memberName || /^\d+\.?\s*$/.test(clean)) continue;
    const fieldGroup = findMemberField(rawLine);
    if (fieldGroup) {
      currentField = fieldGroup.field;
      appendPrepField(result, currentField, stripMemberFieldLabel(rawLine, fieldGroup.labels));
      continue;
    }
    if (currentField) appendPrepField(result, currentField, clean);
    else appendPrepField(result, 'observedSignal', clean);
  }

  return result;
}

export function parseV38AiSignalResultByMember(rawText: string, members: V38ParserMember[]): V38SignalParseResult {
  const preps: V38PrepState = {};
  const warnings: string[] = [];
  const starts = members
    .map((member) => ({ member, index: rawText.indexOf(member.name) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (starts.length === 0) {
    warnings.push('팀원 이름을 자동으로 찾지 못했습니다. AI 결과에 신재영 대리, 문교원 사원 등 팀원 이름이 포함되어 있는지 확인해 주세요.');
    return { preps, warnings };
  }

  starts.forEach((item, order) => {
    const end = starts[order + 1]?.index ?? rawText.length;
    const section = rawText.slice(item.index, end);
    const parsed = parseMemberSection(section, item.member.name);
    preps[item.member.id] = { ...createEmptyV38MemberPrep(), ...parsed };
  });

  for (const member of members) {
    if (!preps[member.id]) warnings.push(`${member.name} 섹션을 자동으로 찾지 못했습니다.`);
  }

  return { preps, warnings };
}

function cleanMemberDraftSection(section: string, memberName: string) {
  return section
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => {
      const clean = cleanV38Markdown(line).replace(/^[-*]\s*/, '').trim();
      return clean && clean !== memberName && !new RegExp(`^\\d+\\.?\\s*${memberName}`).test(clean);
    })
    .join('\n')
    .trim();
}

export function parseV38AiPrepDraftByMember(rawText: string, members: V38ParserMember[]): V38PrepDraftParseResult {
  const drafts: Record<string, string> = {};
  const warnings: string[] = [];
  const starts = members
    .map((member) => ({ member, index: rawText.indexOf(member.name) }))
    .filter((item) => item.index >= 0)
    .sort((a, b) => a.index - b.index);

  if (starts.length === 0) {
    warnings.push('선택한 유형 이름을 자동으로 찾지 못했습니다. AI 2차 결과에 선택한 유형 이름이 포함되어 있는지 확인해 주세요.');
    return { drafts, warnings };
  }

  starts.forEach((item, order) => {
    const end = starts[order + 1]?.index ?? rawText.length;
    const section = rawText.slice(item.index, end);
    drafts[item.member.id] = cleanMemberDraftSection(section, item.member.name);
  });

  for (const member of members) {
    if (!drafts[member.id]) warnings.push(`${member.name} 준비물 초안을 자동으로 찾지 못했습니다.`);
  }

  return { drafts, warnings };
}
