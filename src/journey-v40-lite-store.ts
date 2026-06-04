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
  selectedFocus: string;
  primaryMetric: string;
  fieldSignal: string;
  carefulInterpretation: string;
  followUpQuestion: string;
  step6Handoff: string;
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
  selectedFocus: '후속 실행으로 이어지는지 보기',
  primaryMetric: '',
  fieldSignal: '',
  carefulInterpretation: '',
  followUpQuestion: '',
  step6Handoff: '',
  aiDraft: V40_LITE_EMPTY_AI_DRAFT,
};

export const V40_LITE_DEFAULT_STEP6_CUSTOMER_REACTION: V40LiteStep6CustomerReaction = {
  meaningfulReaction: '',
  missingInformation: '',
  carefulReading: '',
  nextQuestion: '',
  aiDraft: V40_LITE_EMPTY_AI_DRAFT,
};
