import { MEMBERS, type Member } from './journey-data';

export type JourneyStateLike = Record<string, any>;

export function getMember(memberId: string): Member {
  return MEMBERS.find(member => member.id === memberId) || MEMBERS[0];
}

export function buildPayloadBase(state: JourneyStateLike, currentMember?: Member) {
  const member = currentMember || getMember(state.selectedMemberId);

  return {
    strategyScenarioTitle: state.strategyScenarioTitle,
    teamStrategyStatement: state.teamStrategyStatement,
    studioReportSummary: state.studioReportSummary,
    studioSlideSummary: state.studioSlideSummary,
    reportLinkOrFileName: state.reportLinkOrFileName,
    slideLinkOrFileName: state.slideLinkOrFileName,
    selectedMemberId: member.id,
    selectedMemberName: member.name,
    selectedMemberType: member.type,
    selectedMemberSignal: member.signal,
    priorityInterpretation: state.priorityInterpretation || state.causalHypothesis || '',
    confirmQuestion: state.confirmQuestion || '',
    twoWeekCommitment: state.twoWeekCommitment || '',
    recheckEvidence: state.recheckEvidence || '',
  };
}

export function buildContextRows(state: JourneyStateLike, currentMember?: Member) {
  const member = currentMember || getMember(state.selectedMemberId);

  return [
    { label: '우리 팀 실행전략', value: state.teamStrategyStatement || '-' },
    { label: '현재 선택 팀원', value: member.name },
    { label: '유형', value: member.type },
    { label: '핵심 지표 신호', value: member.signal },
    { label: '우선 확인할 해석', value: state.priorityInterpretation || state.causalHypothesis || '-' },
    { label: '팀원에게 던질 질문', value: state.confirmQuestion || '-' },
    { label: '2주 실행 약속', value: state.twoWeekCommitment || '-' },
    { label: '2주 후 점검 지표/증거', value: state.recheckEvidence || '-' },
  ];
}
