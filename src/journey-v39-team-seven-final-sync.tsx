import { useEffect, useState } from 'react';
import {
  loadV39FinalCallPlanResult,
  saveV39FinalCallPlanResult,
} from './journey-v39-final-call-plan-result-store';
import { buildV39TeamSevenFinalSummaryText } from './journey-v39-team-seven-final-summary';

const V39_TEAM_SEVEN_FINAL_SYNC_SMOKE_MARKERS = [
  'V39TeamSevenFinalSync',
  '코칭 대상 요약 저장 반영',
  '최종 카드 memberRoles 반영',
  '팀원 7명 요약 저장 반영',
].join('|');
void V39_TEAM_SEVEN_FINAL_SYNC_SMOKE_MARKERS;

const TEAM_SEVEN_SUMMARY_HEADER = '[8단계 코칭 대상 선정 요약]';

export function V39TeamSevenFinalSync() {
  const [syncState, setSyncState] = useState('확인 중');

  useEffect(() => {
    const summary = buildV39TeamSevenFinalSummaryText();
    if (!summary.includes(TEAM_SEVEN_SUMMARY_HEADER) || summary.includes('아직 8단계')) {
      setSyncState('8단계 요약 없음');
      return;
    }

    const current = loadV39FinalCallPlanResult();
    const alreadyMerged = current.memberRoles.includes(TEAM_SEVEN_SUMMARY_HEADER);
    if (alreadyMerged) {
      setSyncState('이미 반영됨');
      return;
    }

    const nextMemberRoles = [current.memberRoles.trim(), summary].filter(Boolean).join('\n\n');
    const nextDiscussionMemo = current.discussionMemo.trim()
      ? current.discussionMemo
      : '강사용 토의에서는 우선 1on1 대상, 선택 이유, 코칭 초점, 단정하면 안 되는 해석을 함께 확인합니다.';

    saveV39FinalCallPlanResult({
      ...current,
      memberRoles: nextMemberRoles,
      discussionMemo: nextDiscussionMemo,
    });
    setSyncState('반영 완료');
  }, []);

  return (
    <section className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
      <p className="font-black">코칭 대상 요약 저장 반영</p>
      <p className="mt-1">상태: {syncState}</p>
      <p className="mt-1">8단계에서 작성한 코칭 대상 선정 요약은 최종 카드의 팀원·코칭 요약에 중복 없이 반영됩니다.</p>
    </section>
  );
}
