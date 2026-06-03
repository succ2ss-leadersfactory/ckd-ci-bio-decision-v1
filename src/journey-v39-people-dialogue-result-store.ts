export const V39_PEOPLE_DIALOGUE_RESULT_SCHEMA_VERSION = 1;

export const V39_PEOPLE_DIALOGUE_RESULT_STORAGE_KEY = 'ckd.v39.peopleDialogue.result.v1';

export type V39PeopleDialogueResult = {
  schemaVersion: number;
  updatedAt: string;
  cultureShiftSelections: string[];
  leaderFeelingSelections: string[];
  newGenSignalSelections: string[];
  existingMemberSignalSelections: string[];
  conflictTypeSelections: string[];
  dialogueStrategySelections: string[];
  rawAiDialogueResult: string;
  dialogueCard: {
    targetMember: string;
    expectedReaction: string;
    leaderMisreadRisk: string;
    realNeed: string;
    openingLine: string;
    likelyQuestions: string;
    leaderResponse: string;
    agreementCriteria: string;
    leaderSupport: string;
    avoidPhrase: string;
    alternativePhrase: string;
  };
  teamNorms: string;
};

const EMPTY_DIALOGUE_CARD: V39PeopleDialogueResult['dialogueCard'] = {
  targetMember: '',
  expectedReaction: '',
  leaderMisreadRisk: '',
  realNeed: '',
  openingLine: '',
  likelyQuestions: '',
  leaderResponse: '',
  agreementCriteria: '',
  leaderSupport: '',
  avoidPhrase: '',
  alternativePhrase: '',
};

export function createEmptyV39PeopleDialogueResult(): V39PeopleDialogueResult {
  return {
    schemaVersion: V39_PEOPLE_DIALOGUE_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    cultureShiftSelections: [],
    leaderFeelingSelections: [],
    newGenSignalSelections: [],
    existingMemberSignalSelections: [],
    conflictTypeSelections: [],
    dialogueStrategySelections: [],
    rawAiDialogueResult: '',
    dialogueCard: { ...EMPTY_DIALOGUE_CARD },
    teamNorms: '',
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

function normalizeDialogueCard(value: unknown): V39PeopleDialogueResult['dialogueCard'] {
  if (!value || typeof value !== 'object') return { ...EMPTY_DIALOGUE_CARD };
  const source = value as Partial<V39PeopleDialogueResult['dialogueCard']>;
  return {
    targetMember: normalizeText(source.targetMember),
    expectedReaction: normalizeText(source.expectedReaction),
    leaderMisreadRisk: normalizeText(source.leaderMisreadRisk),
    realNeed: normalizeText(source.realNeed),
    openingLine: normalizeText(source.openingLine),
    likelyQuestions: normalizeText(source.likelyQuestions),
    leaderResponse: normalizeText(source.leaderResponse),
    agreementCriteria: normalizeText(source.agreementCriteria),
    leaderSupport: normalizeText(source.leaderSupport),
    avoidPhrase: normalizeText(source.avoidPhrase),
    alternativePhrase: normalizeText(source.alternativePhrase),
  };
}

export function normalizeV39PeopleDialogueResult(value: unknown): V39PeopleDialogueResult {
  if (!value || typeof value !== 'object') return createEmptyV39PeopleDialogueResult();
  const source = value as Partial<V39PeopleDialogueResult>;
  return {
    schemaVersion: V39_PEOPLE_DIALOGUE_RESULT_SCHEMA_VERSION,
    updatedAt: normalizeText(source.updatedAt),
    cultureShiftSelections: normalizeStringArray(source.cultureShiftSelections),
    leaderFeelingSelections: normalizeStringArray(source.leaderFeelingSelections),
    newGenSignalSelections: normalizeStringArray(source.newGenSignalSelections),
    existingMemberSignalSelections: normalizeStringArray(source.existingMemberSignalSelections),
    conflictTypeSelections: normalizeStringArray(source.conflictTypeSelections),
    dialogueStrategySelections: normalizeStringArray(source.dialogueStrategySelections),
    rawAiDialogueResult: normalizeText(source.rawAiDialogueResult),
    dialogueCard: normalizeDialogueCard(source.dialogueCard),
    teamNorms: normalizeText(source.teamNorms),
  };
}

export function saveV39PeopleDialogueResult(result: V39PeopleDialogueResult) {
  window.localStorage.setItem(
    V39_PEOPLE_DIALOGUE_RESULT_STORAGE_KEY,
    JSON.stringify({
      ...normalizeV39PeopleDialogueResult(result),
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function loadV39PeopleDialogueResult(): V39PeopleDialogueResult {
  const raw = window.localStorage.getItem(V39_PEOPLE_DIALOGUE_RESULT_STORAGE_KEY);
  if (!raw) return createEmptyV39PeopleDialogueResult();

  try {
    return normalizeV39PeopleDialogueResult(JSON.parse(raw));
  } catch {
    return createEmptyV39PeopleDialogueResult();
  }
}

export function clearV39PeopleDialogueResult() {
  window.localStorage.removeItem(V39_PEOPLE_DIALOGUE_RESULT_STORAGE_KEY);
}
