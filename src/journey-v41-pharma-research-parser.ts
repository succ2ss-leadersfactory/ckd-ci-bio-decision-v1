export type ParsedNotebookSections = {
  issueOne?: string;
  issueTwo?: string;
  issueThree?: string;
  teamImpact?: string;
  metricQuestions?: string;
  caution?: string;
};

const V41_PHARMA_RESEARCH_PARSER_MARKERS = [
  'v41 pharma research parser cloned',
  'NOTEBOOK_SECTION_ALIASES',
  'parseNotebookAnswer',
  '시장 변화 읽기 parser',
  '전사 추진과제 후보',
  '추진과제별 CSF 후보',
  '추진과제별 KPI 후보',
  '추진계획 수립 쟁점',
  'bold bracket heading parser hardened',
  'sample LM result parser hardened',
].join('|');
void V41_PHARMA_RESEARCH_PARSER_MARKERS;

export const NOTEBOOK_SECTION_ALIASES: Array<{ key: string; labels: string[] }> = [
  { key: 'issueOne', labels: ['핵심 변화 신호', '핵심변화신호', '변화 신호', '시장 변화 신호'] },
  { key: 'teamImpact', labels: ['출처/근거 요약', '출처 근거 요약', '출처·근거 요약', '근거 요약', '소스 근거 요약'] },
  { key: 'issueTwo', labels: ['전사 추진과제 후보', '전사 추진 과제 후보', '전사 추진과제', '전사 추진 과제', '추진과제 후보', '추진 과제 후보', '전사 추진과제 발굴'] },
  { key: 'issueThree', labels: ['추진과제별 CSF 후보', '추진 과제별 CSF 후보', '전사 CSF 후보', '전사 관점 CSF', 'CSF 후보', '핵심 성공 요인'] },
  { key: 'questions', labels: ['추진과제별 KPI 후보', '추진 과제별 KPI 후보', '전사 KPI 후보', '전사 관점 KPI', 'KPI 후보', '측정 가능한 지표'] },
  { key: 'planning', labels: ['추진계획 수립 쟁점', '추진 계획 수립 쟁점', '계획수립 쟁점', '계획 수립 쟁점', '추진계획 쟁점', '추진 계획 쟁점'] },
  { key: 'caution', labels: ['주의해야 할 표현', '주의 표현', '위험 표현', '컴플라이언스 주의 표현'] },
];

export function extractUrls(text: string) {
  const matches = text.match(/https?:\/\/[^\s)\]]+/g) ?? [];
  return Array.from(new Set(matches.map((url) => url.replace(/[.,;:]+$/g, '').trim()).filter(Boolean)));
}

export function buildWebSourceUrlText(urls: string[]) {
  if (urls.length === 0) return 'Perplexity 답변에서 URL을 찾지 못했습니다. Perplexity 답변에 출처 링크가 포함되어 있는지 확인하세요.';
  return urls.join('\n');
}

export function normalizeHeading(line: string) {
  return line
    .replace(/^\s{0,3}#{1,6}\s*/, '')
    .replace(/^\s*[-*+>]\s*/, '')
    .replace(/^\s*\d+[.)]\s*/, '')
    .replace(/\*\*/g, '')
    .replace(/__+/g, '')
    .replace(/：/g, ':')
    .trim();
}

function simplifyHeading(value: string) {
  return value
    .replace(/[\[\]【】()（）:：*#]/g, ' ')
    .replace(/\s+/g, '')
    .trim();
}

function extractBracketHeading(value: string) {
  const bracketMatch = value.match(/[\[【]\s*([^\]】]+?)\s*[\]】]/);
  return bracketMatch?.[1]?.trim() ?? '';
}

export function detectNotebookSection(line: string) {
  const normalized = normalizeHeading(line);
  const bracketHeading = extractBracketHeading(normalized);
  const candidates = [normalized, bracketHeading, normalized.split(':')[0] ?? '', normalized.split('(')[0] ?? '', normalized.split('（')[0] ?? ''].filter(Boolean);

  for (const item of NOTEBOOK_SECTION_ALIASES) {
    for (const label of item.labels) {
      const simpleLabel = simplifyHeading(label);
      if (candidates.some((candidate) => {
        const simpleCandidate = simplifyHeading(candidate);
        return simpleCandidate === simpleLabel || simpleCandidate.startsWith(simpleLabel) || simpleCandidate.includes(simpleLabel);
      })) return item.key;
    }
  }
  return null;
}

function cleanParsedText(value?: string) {
  return (value ?? '').replace(/^\n+|\n+$/g, '').trim();
}

export function parseNotebookAnswer(answer: string): ParsedNotebookSections {
  const buckets: Record<string, string[]> = {};
  let currentKey: string | null = null;
  for (const line of answer.split(/\r?\n/)) {
    const detectedKey = detectNotebookSection(line);
    if (detectedKey) {
      currentKey = detectedKey;
      if (!buckets[currentKey]) buckets[currentKey] = [];
      continue;
    }
    if (currentKey) buckets[currentKey].push(line);
  }

  const kpis = cleanParsedText(buckets.questions?.join('\n'));
  const planning = cleanParsedText(buckets.planning?.join('\n'));
  const metricQuestions = [kpis ? `[추진과제별 KPI 후보]\n${kpis}` : '', planning ? `[추진계획 수립 쟁점]\n${planning}` : ''].filter(Boolean).join('\n\n');

  return {
    issueOne: cleanParsedText(buckets.issueOne?.join('\n')),
    issueTwo: cleanParsedText(buckets.issueTwo?.join('\n')),
    issueThree: cleanParsedText(buckets.issueThree?.join('\n')),
    teamImpact: cleanParsedText(buckets.teamImpact?.join('\n')),
    metricQuestions,
    caution: cleanParsedText(buckets.caution?.join('\n')),
  };
}
