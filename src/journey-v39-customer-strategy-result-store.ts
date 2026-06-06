import { getJson, removeStoredPrefix, setJson } from './journey-storage';

export const V39_CUSTOMER_STRATEGY_RESULT_SCHEMA_VERSION = 1;

export const V39_CUSTOMER_STRATEGY_RESULT_STORAGE_KEY = 'ckd.v39.customerStrategy.result.v1';

export type V39CustomerStrategyResultItem = {
  customerTypeId: string;
  customerLabel: string;
  priority: string;
  strategy: string;
  memberRole: string;
  risk: string;
};

export type V39CustomerStrategyResult = {
  schemaVersion: number;
  updatedAt: string;
  strategies: Record<string, V39CustomerStrategyResultItem>;
};

export function createEmptyV39CustomerStrategyItem(
  customerTypeId: string,
  customerLabel: string,
): V39CustomerStrategyResultItem {
  return {
    customerTypeId,
    customerLabel,
    priority: '',
    strategy: '',
    memberRole: '',
    risk: '',
  };
}

export function createEmptyV39CustomerStrategyResult(): V39CustomerStrategyResult {
  return {
    schemaVersion: V39_CUSTOMER_STRATEGY_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    strategies: {},
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeV39CustomerStrategyItem(
  value: unknown,
  fallbackCustomerTypeId: string,
  fallbackCustomerLabel: string,
): V39CustomerStrategyResultItem {
  if (!value || typeof value !== 'object') {
    return createEmptyV39CustomerStrategyItem(fallbackCustomerTypeId, fallbackCustomerLabel);
  }

  const source = value as Partial<V39CustomerStrategyResultItem>;

  return {
    customerTypeId: normalizeText(source.customerTypeId) || fallbackCustomerTypeId,
    customerLabel: normalizeText(source.customerLabel) || fallbackCustomerLabel,
    priority: normalizeText(source.priority),
    strategy: normalizeText(source.strategy),
    memberRole: normalizeText(source.memberRole),
    risk: normalizeText(source.risk),
  };
}

export function normalizeV39CustomerStrategyResult(value: unknown): V39CustomerStrategyResult {
  if (!value || typeof value !== 'object') return createEmptyV39CustomerStrategyResult();

  const source = value as Partial<V39CustomerStrategyResult>;
  const rawStrategies = source.strategies && typeof source.strategies === 'object' ? source.strategies : {};
  const strategies: Record<string, V39CustomerStrategyResultItem> = {};

  for (const [customerTypeId, strategy] of Object.entries(rawStrategies)) {
    strategies[customerTypeId] = normalizeV39CustomerStrategyItem(strategy, customerTypeId, `고객 유형 ${customerTypeId}`);
  }

  return {
    schemaVersion: V39_CUSTOMER_STRATEGY_RESULT_SCHEMA_VERSION,
    updatedAt: normalizeText(source.updatedAt),
    strategies,
  };
}

export function saveV39CustomerStrategyResult(result: V39CustomerStrategyResult) {
  setJson(V39_CUSTOMER_STRATEGY_RESULT_STORAGE_KEY, {
    ...normalizeV39CustomerStrategyResult(result),
    updatedAt: new Date().toISOString(),
  });
}

export function loadV39CustomerStrategyResult(): V39CustomerStrategyResult {
  return normalizeV39CustomerStrategyResult(getJson<unknown>(V39_CUSTOMER_STRATEGY_RESULT_STORAGE_KEY, null));
}

export function clearV39CustomerStrategyResult() {
  removeStoredPrefix(V39_CUSTOMER_STRATEGY_RESULT_STORAGE_KEY);
}
