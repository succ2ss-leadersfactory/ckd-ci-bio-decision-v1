export const V41_PREVIEW_ROUTE = '/journey-v41-preview.html';

export const V41_VISIBLE_APP_STEPS = 10;

export const V41_PARTICIPANT_STORAGE_KEY = 'ckd.v41.participant.v1';
export const V41_PROGRESS_STORAGE_KEY = 'ckd.v41.progress.v1';
export const V41_TASK_EXECUTION_STORAGE_KEY = 'ckd.v41.taskExecutionBridge.v1';
export const V41_PEOPLE_SELECTION_STORAGE_KEY = 'ckd.v41.peopleSelection.v1';
export const V41_ONE_ON_ONE_STORAGE_KEY = 'ckd.v41.oneOnOnePractice.v1';

export const V41_LAB_STORAGE_KEYS = [
  V41_TASK_EXECUTION_STORAGE_KEY,
  V41_PEOPLE_SELECTION_STORAGE_KEY,
  V41_ONE_ON_ONE_STORAGE_KEY,
] as const;

export const V41_VISIBLE_STEP_LABELS = [
  '시작하기',
  '팀원 보기',
  '질문 다듬기',
  '시장 변화 읽기',
  '팀 기준 만들기',
  '업무관리 실행계획 만들기',
  '할 일·줄일 일',
  '업무 경계 나누기',
  '1on1 대상 고르기',
  '1on1 첫 문장',
] as const;

export const V41_PREVIEW_CONFIG_MARKERS = [
  'V41_PREVIEW_ROUTE',
  'V41_VISIBLE_APP_STEPS',
  'journey-v41-preview.html',
  'v41 preview config',
  'ckd.v41.participant.v1',
  'ckd.v41.progress.v1',
  'ckd.v41.taskExecutionBridge.v1',
  'ckd.v41.peopleSelection.v1',
  'ckd.v41.oneOnOnePractice.v1',
].join('|');
void V41_PREVIEW_CONFIG_MARKERS;
