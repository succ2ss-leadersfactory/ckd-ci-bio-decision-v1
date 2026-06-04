export type V40LiteParticipant = {
  name: string;
  teamName: string;
  roleAccepted: boolean;
};

export type V40LiteProgress = {
  step: number;
};

export type V40LiteStep5Metrics = {
  primaryMetric: string;
  fieldSignal: string;
  carefulInterpretation: string;
  followUpQuestion: string;
};

export const V40_LITE_STORAGE_KEYS = {
  participant: 'ckd.v40-lite.participant.v1',
  progress: 'ckd.v40-lite.progress.v1',
  step5Metrics: 'ckd.v40-lite.step5.metrics.v1',
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
  primaryMetric: '',
  fieldSignal: '',
  carefulInterpretation: '',
  followUpQuestion: '',
};
