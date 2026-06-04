import { V40_LITE_EMPTY_AI_DRAFT, type V40LiteAiDraft } from './journey-v40-lite-ai-workflow';

export type V40LiteParticipant = {
  name: string;
  teamName: string;
  roleAccepted: boolean;
};

export type V40LiteProgress = {
  step: number;
};

export type V40LiteStep5Metrics = {
  decisionQuestion: string;
  teamSituations: string[];
  coreMetric: string;
  supportSignal: string;
  safetyLine: string;
  metricAiDraft: V40LiteAiDraft;
  selectedBehaviorSignals: string[];
  behaviorCheckQuestion: string;
  leaderAction: string;
  actionAiDraft: V40LiteAiDraft;
  finalPrep: string;
  step6Handoff: string;

  // Legacy-compatible fields from the first v40-lite draft. Kept so existing localStorage and old component code do not break while v40 is being realigned.
  selectedFocus: string;
  primaryMetric: string;
  fieldSignal: string;
  carefulInterpretation: string;
  followUpQuestion: string;
  aiDraft: V40LiteAiDraft;
};

export type V40LiteStep6CustomerReaction = {
  meaningfulReaction: string;
  missingInformation: string;
  carefulReading: string;
  nextQuestion: string;
  aiDraft: V40LiteAiDraft;
};

export const V40_LITE_STORAGE_KEYS = {
  participant: 'ckd.v40-lite.participant.v1',
  progress: 'ckd.v40-lite.progress.v1',
  step5Metrics: 'ckd.v40-lite.step5.metrics.v1',
  step6CustomerReaction: 'ckd.v40-lite.step6.customerReaction.v1',
};

export const V40_LITE_DEFAULT_PARTICIPANT: V40LiteParticipant = {
  name: '',
  teamName: '',
  roleAccepted: false,
};

export const V40_LITE_DEFAULT_PROGRESS: V40LiteProgress = {
  step: 0,
};

export const V40_LITE_DEFAULT_STEP5_METRICS: V40LiteStep5Metrics = {
  decisionQuestion: '방문 이후 후속 행동이 실제로 이어지고 있는가?',
  teamSituations: [],
  coreMetric: '',
  supportSignal: '',
  safetyLine: '',
  metricAiDraft: V40_LITE_EMPTY_AI_DRAFT,
  selectedBehaviorSignals: [],
  behaviorCheckQuestion: '',
  leaderAction: '',
  actionAiDraft: V40_LITE_EMPTY_AI_DRAFT,
  finalPrep: '',
  step6Handoff: '',

  selectedFocus: '후속 실행으로 이어지는지 보기',
  primaryMetric: '',
  fieldSignal: '',
  carefulInterpretation: '',
  followUpQuestion: '',
  aiDraft: V40_LITE_EMPTY_AI_DRAFT,
};

export const V40_LITE_DEFAULT_STEP6_CUSTOMER_REACTION: V40LiteStep6CustomerReaction = {
  meaningfulReaction: '',
  missingInformation: '',
  carefulReading: '',
  nextQuestion: '',
  aiDraft: V40_LITE_EMPTY_AI_DRAFT,
};
