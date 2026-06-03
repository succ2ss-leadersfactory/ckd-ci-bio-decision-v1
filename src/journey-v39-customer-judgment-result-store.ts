export const V39_CUSTOMER_JUDGMENT_RESULT_SCHEMA_VERSION = 1;

export const V39_CUSTOMER_JUDGMENT_RESULT_STORAGE_KEY = 'ckd.v39.customerJudgment.result.v1';

export type V39CustomerPriorityDecision = 'focus' | 'maintain' | 'defer' | 'supplement';

export type V39CustomerDecisionResult = {
  customerTypeId: string;
  customerLabel: string;
  priorityDecision: V39CustomerPriorityDecision | '';
  reason: string;
  nextCheck: string;
  complianceNote: string;
};

export type V39CustomerJudgmentResult = {
  schemaVersion: number;
  updatedAt: string;
  decisions: Record<string, V39CustomerDecisionResult>;
};

export function createEmptyV39CustomerDecisionResult(
  customerTypeId: string,
  customerLabel: string,
): V39CustomerDecisionResult {
  return {
    customerTypeId,
    customerLabel,
    priorityDecision: '',
    reason: '',
    nextCheck: '',
    complianceNote: '',
  };
}

export function createEmptyV39CustomerJudgmentResult(): V39CustomerJudgmentResult {
  return {
    schemaVersion: V39_CUSTOMER_JUDGMENT_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    decisions: {},
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function normalizePriorityDecision(value: unknown): V39CustomerPriorityDecision | '' {
  if (value === 'focus' || value === 'maintain' || value === 'defer' || value === 'supplement') return value;
  return '';
}

export function normalizeV39CustomerDecisionResult(
  value: unknown,
  fallbackCustomerTypeId: string,
  fallbackCustomerLabel: string,
): V39CustomerDecisionResult {
  if (!value || typeof value !== 'object') {
    return createEmptyV39CustomerDecisionResult(fallbackCustomerTypeId, fallbackCustomerLabel);
  }

  const source = value as Partial<V39CustomerDecisionResult>;

  return {
    customerTypeId: normalizeText(source.customerTypeId) || fallbackCustomerTypeId,
    customerLabel: normalizeText(source.customerLabel) || fallbackCustomerLabel,
    priorityDecision: normalizePriorityDecision(source.priorityDecision),
    reason: normalizeText(source.reason),
    nextCheck: normalizeText(source.nextCheck),
    complianceNote: normalizeText(source.complianceNote),
  };
}

export function normalizeV39CustomerJudgmentResult(
  value: unknown,
): V39CustomerJudgmentResult {
  if (!value || typeof value !== 'object') return createEmptyV39CustomerJudgmentResult();

  const source = value as Partial<V39CustomerJudgmentResult>;
  const rawDecisions = source.decisions && typeof source.decisions === 'object' ? source.decisions : {};
  const decisions: Record<string, V39CustomerDecisionResult> = {};

  for (const [customerTypeId, decision] of Object.entries(rawDecisions)) {
    decisions[customerTypeId] = normalizeV39CustomerDecisionResult(decision, customerTypeId, `고객 유형 ${customerTypeId}`);
  }

  return {
    schemaVersion: V39_CUSTOMER_JUDGMENT_RESULT_SCHEMA_VERSION,
    updatedAt: normalizeText(source.updatedAt),
    decisions,
  };
}

export function saveV39CustomerJudgmentResult(result: V39CustomerJudgmentResult) {
  window.localStorage.setItem(
    V39_CUSTOMER_JUDGMENT_RESULT_STORAGE_KEY,
    JSON.stringify({
      ...normalizeV39CustomerJudgmentResult(result),
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function loadV39CustomerJudgmentResult(): V39CustomerJudgmentResult {
  const raw = window.localStorage.getItem(V39_CUSTOMER_JUDGMENT_RESULT_STORAGE_KEY);
  if (!raw) return createEmptyV39CustomerJudgmentResult();

  try {
    return normalizeV39CustomerJudgmentResult(JSON.parse(raw));
  } catch {
    return createEmptyV39CustomerJudgmentResult();
  }
}

export function clearV39CustomerJudgmentResult() {
  window.localStorage.removeItem(V39_CUSTOMER_JUDGMENT_RESULT_STORAGE_KEY);
}
