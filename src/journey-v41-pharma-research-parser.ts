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
  '전사 CSF 후보',
  '전사 KPI 후보',
  '팀 방향 전환 질문',
].join('|');
void V41_PHARMA_RESEARCH_PARSER_MARKERS;

export const NOTEBOOK_SECTION_ALIASES: Array<{ key: string; labels: string[] }> = [
  { key: 'issueOne', labels: ['핵심 변화 신호', '변화 신호', '시장 변화 신호'] },
  { key: 'teamImpact', labels: ['출처/근거 요약', '근거 요약', '소스 근거 요약'] },
  { key: 'issueTwo', labels: ['전사 CSF 후보', '전사CSF 후보', '전사 관점 CSF', 'CSF 후보', '핵심 성공 요인'] },
  { key: 'issueThree', labels: ['전사 KPI 후보', '전사KPI 후보', '전사 관점 KPI', 'KPI 후보', '측정 가능한 지표'] },
  { key: 'questions', labels: ['팀 방향 전환 질문', '팀 방향으로 내릴 때 확인할 질문', '케스케이딩 질문', '팀 전환 질문'] },
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
  return line.replace(/^\s{0,3}#{1,6}\s*/, '').replace(/^\s*[-*+>]\s*/, '').replace(/\*\*/g, '').replace(/__+/g, '').trim();
}

export function detectNotebookSection(line: string) {
  const normalized = normalizeHeading(line);
  const withoutBrackets = normalized.replace(/^\[/, '').replace(/\]$/, '').trim();
  for (const item of NOTEBOOK_SECTION_ALIASES) {
    if (item.labels.some((label) => normalized === `[${label}]` || withoutBrackets === label || normalized.startsWith(`[${label}]`) || normalized.startsWith(`${label}:`) || normalized.startsWith(`${label}`))) return item.key;
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

  const questions = cleanParsedText(buckets.questions?.join('\n'));

  return {
    issueOne: cleanParsedText(buckets.issueOne?.join('\n')),
    issueTwo: cleanParsedText(buckets.issueTwo?.join('\n')),
    issueThree: cleanParsedText(buckets.issueThree?.join('\n')),
    teamImpact: cleanParsedText(buckets.teamImpact?.join('\n')),
    metricQuestions: questions ? `[팀 방향 전환 질문]\n${questions}` : '',
    caution: cleanParsedText(buckets.caution?.join('\n')),
  };
}
