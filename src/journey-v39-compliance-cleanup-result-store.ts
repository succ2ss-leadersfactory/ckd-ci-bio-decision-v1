export const V39_COMPLIANCE_CLEANUP_RESULT_SCHEMA_VERSION = 1;

export const V39_COMPLIANCE_CLEANUP_RESULT_STORAGE_KEY = 'ckd.v39.complianceCleanup.result.v1';

export type V39ComplianceCleanupResult = {
  schemaVersion: number;
  updatedAt: string;
  riskTypes: string;
  safeExpression: string;
  finalChecklist: string;
  finalCardMemo: string;
};

export function createEmptyV39ComplianceCleanupResult(): V39ComplianceCleanupResult {
  return {
    schemaVersion: V39_COMPLIANCE_CLEANUP_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    riskTypes: '',
    safeExpression: '',
    finalChecklist: '',
    finalCardMemo: '',
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeV39ComplianceCleanupResult(value: unknown): V39ComplianceCleanupResult {
  if (!value || typeof value !== 'object') return createEmptyV39ComplianceCleanupResult();

  const source = value as Partial<V39ComplianceCleanupResult>;

  return {
    schemaVersion: V39_COMPLIANCE_CLEANUP_RESULT_SCHEMA_VERSION,
    updatedAt: normalizeText(source.updatedAt),
    riskTypes: normalizeText(source.riskTypes),
    safeExpression: normalizeText(source.safeExpression),
    finalChecklist: normalizeText(source.finalChecklist),
    finalCardMemo: normalizeText(source.finalCardMemo),
  };
}

export function saveV39ComplianceCleanupResult(result: V39ComplianceCleanupResult) {
  window.localStorage.setItem(
    V39_COMPLIANCE_CLEANUP_RESULT_STORAGE_KEY,
    JSON.stringify({
      ...normalizeV39ComplianceCleanupResult(result),
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function loadV39ComplianceCleanupResult(): V39ComplianceCleanupResult {
  const raw = window.localStorage.getItem(V39_COMPLIANCE_CLEANUP_RESULT_STORAGE_KEY);
  if (!raw) return createEmptyV39ComplianceCleanupResult();

  try {
    return normalizeV39ComplianceCleanupResult(JSON.parse(raw));
  } catch {
    return createEmptyV39ComplianceCleanupResult();
  }
}

export function clearV39ComplianceCleanupResult() {
  window.localStorage.removeItem(V39_COMPLIANCE_CLEANUP_RESULT_STORAGE_KEY);
}
