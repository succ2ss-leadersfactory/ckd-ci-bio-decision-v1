export const V39_AI_CALL_PLAN_RESULT_SCHEMA_VERSION = 1;

export const V39_AI_CALL_PLAN_RESULT_STORAGE_KEY = 'ckd.v39.aiCallPlan.result.v1';

export type V39AiCallPlanResultItem = {
  id: string;
  title: string;
  callPlanDraft: string;
  riskMemo: string;
  cleanupFocus: string;
};

export type V39AiCallPlanResult = {
  schemaVersion: number;
  updatedAt: string;
  items: Record<string, V39AiCallPlanResultItem>;
};

export function createEmptyV39AiCallPlanResultItem(id: string, title: string): V39AiCallPlanResultItem {
  return {
    id,
    title,
    callPlanDraft: '',
    riskMemo: '',
    cleanupFocus: '',
  };
}

export function createEmptyV39AiCallPlanResult(): V39AiCallPlanResult {
  return {
    schemaVersion: V39_AI_CALL_PLAN_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    items: {},
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeV39AiCallPlanResultItem(
  value: unknown,
  fallbackId: string,
  fallbackTitle: string,
): V39AiCallPlanResultItem {
  if (!value || typeof value !== 'object') return createEmptyV39AiCallPlanResultItem(fallbackId, fallbackTitle);

  const source = value as Partial<V39AiCallPlanResultItem>;

  return {
    id: normalizeText(source.id) || fallbackId,
    title: normalizeText(source.title) || fallbackTitle,
    callPlanDraft: normalizeText(source.callPlanDraft),
    riskMemo: normalizeText(source.riskMemo),
    cleanupFocus: normalizeText(source.cleanupFocus),
  };
}

export function normalizeV39AiCallPlanResult(value: unknown): V39AiCallPlanResult {
  if (!value || typeof value !== 'object') return createEmptyV39AiCallPlanResult();

  const source = value as Partial<V39AiCallPlanResult>;
  const rawItems = source.items && typeof source.items === 'object' ? source.items : {};
  const items: Record<string, V39AiCallPlanResultItem> = {};

  for (const [id, item] of Object.entries(rawItems)) {
    items[id] = normalizeV39AiCallPlanResultItem(item, id, id);
  }

  return {
    schemaVersion: V39_AI_CALL_PLAN_RESULT_SCHEMA_VERSION,
    updatedAt: normalizeText(source.updatedAt),
    items,
  };
}

export function saveV39AiCallPlanResult(result: V39AiCallPlanResult) {
  window.localStorage.setItem(
    V39_AI_CALL_PLAN_RESULT_STORAGE_KEY,
    JSON.stringify({
      ...normalizeV39AiCallPlanResult(result),
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function loadV39AiCallPlanResult(): V39AiCallPlanResult {
  const raw = window.localStorage.getItem(V39_AI_CALL_PLAN_RESULT_STORAGE_KEY);
  if (!raw) return createEmptyV39AiCallPlanResult();

  try {
    return normalizeV39AiCallPlanResult(JSON.parse(raw));
  } catch {
    return createEmptyV39AiCallPlanResult();
  }
}

export function clearV39AiCallPlanResult() {
  window.localStorage.removeItem(V39_AI_CALL_PLAN_RESULT_STORAGE_KEY);
}
