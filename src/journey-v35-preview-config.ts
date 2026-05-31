import type { JourneyStep } from './journey-shell';
import type { IssueNote } from './journey-components';

export const V35_STORAGE_KEYS = {
  step: 'c1bio_v35_preview_step',
  participant: 'c1bio_v35_preview_participant',
  state: 'c1bio_v35_preview_state',
  notes: 'c1bio_v35_preview_strategy_notes',
  sourceChecks: 'c1bio_v35_preview_source_checks',
  sourceRisk: 'c1bio_v35_preview_source_risk',
  readinessResult: 'c1bio_v35_preview_readiness_result',
  reportSummary: 'c1bio_v35_preview_report_summary',
  reportLinkOrFileName: 'c1bio_v35_preview_report_link_or_file_name',
  slidesSummary: 'c1bio_v35_preview_slides_summary',
  slidesLinkOrFileName: 'c1bio_v35_preview_slides_link_or_file_name',
  presentationChecks: 'c1bio_v35_preview_presentation_checks',
  presentationOneLiner: 'c1bio_v35_preview_presentation_one_liner',
  presentationManagerRequest: 'c1bio_v35_preview_presentation_manager_request',
} as const;

export const V35_STRATEGY_SCENARIO_TITLE = 'v35 preview 전략 이슈 검토';

export const V35_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '입장',
    description: '참여자 정보와 세션 정보를 localStorage에 저장하는 v35 독립 실행 준비 단계입니다.',
  },
  {
    id: 'prompt-practice',
    title: '좋은 질문 만들기',
    description: '안전한 프롬프트를 복사하고 v35 preview localStorage에 저장하는 최소 실습 단계입니다.',
  },
  {
    id: 'strategy-issue-review',
    title: '전략 이슈 검토',
    description: '전략 이슈 메모를 v35 preview localStorage에 저장하며 화면 전환 안정성을 확인합니다.',
  },
  {
    id: 'source-check',
    title: 'Source Check',
    description: '출처 확인 체크와 위험 메모를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'notebook-source-prep',
    title: 'NotebookLM Source Prep',
    description: '전략 이슈와 Source Check 결과를 바탕으로 NotebookLM 소스 준비 텍스트를 생성합니다.',
  },
  {
    id: 'notebook-readiness-check',
    title: 'NotebookLM Readiness Check',
    description: 'NotebookLM 소스 준비 상태 점검 결과를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'studio-report',
    title: 'Studio Report Output',
    description: 'NotebookLM Studio 전략 보고서 산출 결과를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'studio-slides',
    title: 'Studio Slide Deck Output',
    description: 'NotebookLM Studio 전략회의 슬라이드 산출 결과를 v35 preview localStorage에 저장합니다.',
  },
  {
    id: 'presentation-checklist',
    title: 'Presentation Checklist',
    description: '전략회의 발표 전 핵심 메시지와 요청사항을 v35 preview localStorage에 저장합니다.',
  },
];

export function createEmptyIssueNotes(): IssueNote[] {
  return Array.from({ length: 3 }, () => ({
    issue: '',
    change: '',
    source: '',
    date: '',
    reliability: '',
    why: '',
    check: '',
    question: '',
    compliance: '',
  }));
}

export function clampStep(step: number) {
  return Math.min(Math.max(step, 0), Math.max(V35_APP_STEPS.length - 1, 0));
}
