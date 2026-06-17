import { getJson, removeStoredPrefix, setJson } from './journey-storage';
import type { V38PrepState } from './journey-v38-dashboard-analysis-parsers';

export const V39_DASHBOARD_RESULT_SCHEMA_VERSION = 'v39-dashboard-result-v1';
export const V39_DASHBOARD_RESULT_STORAGE_KEY = 'ckd.v39.dashboardAnalysis.result.v1';

export type V39DashboardMetricResult = {
  rawAiMetricSuggestion: string;
  aiRecommendedCoreMetrics: string;
  aiRecommendedSupportMetrics: string;
  aiRecommendedSafetyMetrics: string;
  fitForOurTeam: string;
  excludedMetrics: string;
  additionalMetricIdea: string;
  aiRecommendedQuestions: string;
  parseNotice: string;
};

export type V39DashboardMetricSelection = {
  selectedCoreMetricIds: string[];
  selectedSupportMetricIds: string[];
  selectedSafetyMetricIds: string[];
  metricRationale: string;
};

export type V39DashboardMemberResult = {
  selectedMemberTypeIds: string[];
  rawAiSignalResult: string;
  memberSplitNotice: string;
  memberPreps: V38PrepState;
  selectedDeliverables: Record<string, string[]>;
  rawAiPrepResult: string;
  prepSplitNotice: string;
};

export type V39DashboardResult = {
  schemaVersion: typeof V39_DASHBOARD_RESULT_SCHEMA_VERSION;
  updatedAt: string;
  teamSituations: string[];
  metricResult: V39DashboardMetricResult;
  metricSelection: V39DashboardMetricSelection;
  memberResult: V39DashboardMemberResult;
};

function emptyMetricResult(): V39DashboardMetricResult {
  return {
    rawAiMetricSuggestion: '',
    aiRecommendedCoreMetrics: '',
    aiRecommendedSupportMetrics: '',
    aiRecommendedSafetyMetrics: '',
    fitForOurTeam: '',
    excludedMetrics: '',
    additionalMetricIdea: '',
    aiRecommendedQuestions: '',
    parseNotice: '',
  };
}

function emptyMetricSelection(): V39DashboardMetricSelection {
  return {
    selectedCoreMetricIds: [],
    selectedSupportMetricIds: [],
    selectedSafetyMetricIds: [],
    metricRationale: '',
  };
}

function emptyMemberResult(): V39DashboardMemberResult {
  return {
    selectedMemberTypeIds: [],
    rawAiSignalResult: '',
    memberSplitNotice: '',
    memberPreps: {},
    selectedDeliverables: {},
    rawAiPrepResult: '',
    prepSplitNotice: '',
  };
}

export function createEmptyV39DashboardResult(): V39DashboardResult {
  return {
    schemaVersion: V39_DASHBOARD_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    teamSituations: [],
    metricResult: emptyMetricResult(),
    metricSelection: emptyMetricSelection(),
    memberResult: emptyMemberResult(),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function readStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function readStringArrayRecord(value: unknown): Record<string, string[]> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, readStringArray(item)]));
}

function readPrepState(value: unknown): V38PrepState {
  if (!isRecord(value)) return {};

  return Object.fromEntries(
    Object.entries(value).map(([memberId, prep]) => {
      const record = isRecord(prep) ? prep : {};
      return [
        memberId,
        {
          observedSignal: readString(record.observedSignal),
          strengthSignal: readString(record.strengthSignal),
          concernSignal: readString(record.concernSignal),
          checkQuestion: readString(record.checkQuestion),
          doNotAssume: readString(record.doNotAssume),
          aiDraft: readString(record.aiDraft),
          finalPrep: readString(record.finalPrep),
        },
      ];
    }),
  );
}

export function normalizeV39DashboardResult(value: unknown): V39DashboardResult {
  const source = isRecord(value) ? value : {};
  const metricResult = isRecord(source.metricResult) ? source.metricResult : {};
  const metricSelection = isRecord(source.metricSelection) ? source.metricSelection : {};
  const memberResult = isRecord(source.memberResult) ? source.memberResult : {};

  return {
    schemaVersion: V39_DASHBOARD_RESULT_SCHEMA_VERSION,
    updatedAt: readString(source.updatedAt),
    teamSituations: readStringArray(source.teamSituations),
    metricResult: {
      rawAiMetricSuggestion: readString(metricResult.rawAiMetricSuggestion),
      aiRecommendedCoreMetrics: readString(metricResult.aiRecommendedCoreMetrics),
      aiRecommendedSupportMetrics: readString(metricResult.aiRecommendedSupportMetrics),
      aiRecommendedSafetyMetrics: readString(metricResult.aiRecommendedSafetyMetrics),
      fitForOurTeam: readString(metricResult.fitForOurTeam),
      excludedMetrics: readString(metricResult.excludedMetrics),
      additionalMetricIdea: readString(metricResult.additionalMetricIdea),
      aiRecommendedQuestions: readString(metricResult.aiRecommendedQuestions),
      parseNotice: readString(metricResult.parseNotice),
    },
    metricSelection: {
      selectedCoreMetricIds: readStringArray(metricSelection.selectedCoreMetricIds),
      selectedSupportMetricIds: readStringArray(metricSelection.selectedSupportMetricIds),
      selectedSafetyMetricIds: readStringArray(metricSelection.selectedSafetyMetricIds),
      metricRationale: readString(metricSelection.metricRationale),
    },
    memberResult: {
      selectedMemberTypeIds: readStringArray(memberResult.selectedMemberTypeIds),
      rawAiSignalResult: readString(memberResult.rawAiSignalResult),
      memberSplitNotice: readString(memberResult.memberSplitNotice),
      memberPreps: readPrepState(memberResult.memberPreps),
      selectedDeliverables: readStringArrayRecord(memberResult.selectedDeliverables),
      rawAiPrepResult: readString(memberResult.rawAiPrepResult),
      prepSplitNotice: readString(memberResult.prepSplitNotice),
    },
  };
}

export function saveV39DashboardResult(result: V39DashboardResult) {
  const nextResult: V39DashboardResult = {
    ...normalizeV39DashboardResult(result),
    schemaVersion: V39_DASHBOARD_RESULT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };
  setJson(V39_DASHBOARD_RESULT_STORAGE_KEY, nextResult);
}

export function loadV39DashboardResult(): V39DashboardResult {
  return normalizeV39DashboardResult(getJson<unknown>(V39_DASHBOARD_RESULT_STORAGE_KEY, null));
}

export function clearV39DashboardResult() {
  removeStoredPrefix(V39_DASHBOARD_RESULT_STORAGE_KEY);
}
