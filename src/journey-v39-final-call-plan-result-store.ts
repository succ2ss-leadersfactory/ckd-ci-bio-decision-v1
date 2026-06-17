export const V39_FINAL_CALL_PLAN_RESULT_SCHEMA_VERSION = 1;

export const V39_FINAL_CALL_PLAN_RESULT_STORAGE_KEY = 'ckd.v39.finalCallPlan.result.v1';

export type V39FinalCallPlanResult = {
  schemaVersion: number;
  updatedAt: string;
  focusCustomers: string;
  memberRoles: string;
  twoWeekAction: string;
  compliancePoint: string;
  firstMessage: string;
  discussionMemo: string;
};

export function createEmptyV39FinalCallPlanResult(): V39FinalCallPlanResult {
  return {
    schemaVersion: V39_FINAL_CALL_PLAN_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    focusCustomers: '',
    memberRoles: '',
    twoWeekAction: '',
    compliancePoint: '',
    firstMessage: '',
    discussionMemo: '',
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeV39FinalCallPlanResult(value: unknown): V39FinalCallPlanResult {
  if (!value || typeof value !== 'object') return createEmptyV39FinalCallPlanResult();

  const source = value as Partial<V39FinalCallPlanResult>;

  return {
    schemaVersion: V39_FINAL_CALL_PLAN_RESULT_SCHEMA_VERSION,
    updatedAt: normalizeText(source.updatedAt),
    focusCustomers: normalizeText(source.focusCustomers),
    memberRoles: normalizeText(source.memberRoles),
    twoWeekAction: normalizeText(source.twoWeekAction),
    compliancePoint: normalizeText(source.compliancePoint),
    firstMessage: normalizeText(source.firstMessage),
    discussionMemo: normalizeText(source.discussionMemo),
  };
}

export function saveV39FinalCallPlanResult(result: V39FinalCallPlanResult) {
  window.localStorage.setItem(
    V39_FINAL_CALL_PLAN_RESULT_STORAGE_KEY,
    JSON.stringify({
      ...normalizeV39FinalCallPlanResult(result),
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function loadV39FinalCallPlanResult(): V39FinalCallPlanResult {
  const raw = window.localStorage.getItem(V39_FINAL_CALL_PLAN_RESULT_STORAGE_KEY);
  if (!raw) return createEmptyV39FinalCallPlanResult();

  try {
    return normalizeV39FinalCallPlanResult(JSON.parse(raw));
  } catch {
    return createEmptyV39FinalCallPlanResult();
  }
}

export function clearV39FinalCallPlanResult() {
  window.localStorage.removeItem(V39_FINAL_CALL_PLAN_RESULT_STORAGE_KEY);
}
