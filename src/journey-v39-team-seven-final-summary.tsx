import { loadV39TeamSevenCoachingMapResult } from './journey-v39-team-seven-coaching-map';

const V39_TEAM_SEVEN_FINAL_SUMMARY_SMOKE_MARKERS = [
  'V39TeamSevenFinalSummary',
  '8단계 팀원 7명 업무배분·1on1 요약',
  '전체 업무배분 균형',
  '우선 1on1 코칭 계획',
  '업무배분 리스크',
].join('|');
void V39_TEAM_SEVEN_FINAL_SUMMARY_SMOKE_MARKERS;

export function buildV39TeamSevenFinalSummaryText() {
  const result = loadV39TeamSevenCoachingMapResult();
  const decisions = Object.values(result.decisions);
  const filled = decisions.filter((item) => item.allocationDecision || item.coachingPurpose || item.leaderSupport || item.riskMemo);
  const priority = decisions.filter((item) => item.priorityOneOnOne);

  if (filled.length === 0) {
    return '[8단계 팀원 7명 업무배분·1on1 요약]\n- 아직 8단계 팀원 7명 실행·코칭 Map 결과가 저장되지 않았습니다.';
  }

  return [
    '[8단계 팀원 7명 업무배분·1on1 요약]',
    `- 전체 판단 메모: ${filled.length} / 7명`,
    `- 우선 1on1 대상: ${priority.length > 0 ? priority.map((item) => item.memberLabel).join(' · ') : '아직 선택되지 않았습니다.'}`,
    '',
    '[전체 업무배분 균형]',
    ...filled.map((item, index) => [
      `${index + 1}. ${item.memberLabel}`,
      `- 업무배분 판단: ${item.allocationDecision || '미정'}`,
      `- 1on1 코칭 목적: ${item.coachingPurpose || '미정'}`,
      `- 팀장 지원: ${item.leaderSupport || '아직 작성되지 않았습니다.'}`,
      `- 업무배분 리스크: ${item.riskMemo || '아직 작성되지 않았습니다.'}`,
    ].join('\n')),
  ].join('\n');
}

export function V39TeamSevenFinalSummary() {
  const result = loadV39TeamSevenCoachingMapResult();
  const decisions = Object.values(result.decisions);
  const filled = decisions.filter((item) => item.allocationDecision || item.coachingPurpose || item.leaderSupport || item.riskMemo);
  const priority = decisions.filter((item) => item.priorityOneOnOne);

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-3">
      <p className="text-xs font-black text-indigo-700">8단계 팀원 7명 업무배분·1on1 요약</p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-xs font-bold leading-5 text-indigo-950">
          <p className="font-black">전체 업무배분 균형</p>
          <p className="mt-1">판단 메모 {filled.length} / 7명</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">우선 1on1 코칭 계획</p>
          <p className="mt-1">{priority.length > 0 ? priority.map((item) => item.memberLabel).join(' · ') : '아직 선택되지 않았습니다.'}</p>
        </div>
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-950">
          <p className="font-black">업무배분 리스크</p>
          <p className="mt-1">특정 팀원에게 부담·기회·위험 고객 대화가 몰리는지 최종 점검합니다.</p>
        </div>
      </div>
      {filled.length > 0 ? (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {filled.map((item) => (
            <div key={item.memberId} className="rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold leading-5 text-slate-800">
              <p className="font-black text-slate-950">{item.memberLabel}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">업무배분 판단: </span>{item.allocationDecision || '미정'}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">코칭 목적: </span>{item.coachingPurpose || '미정'}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">팀장 지원: </span>{item.leaderSupport || '아직 작성되지 않았습니다.'}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">주의할 리스크: </span>{item.riskMemo || '아직 작성되지 않았습니다.'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600">8단계에서 팀원 7명 실행·코칭 Map을 작성하면, 이곳에 전체 업무배분 균형과 우선 1on1 코칭 계획이 표시됩니다.</p>
      )}
    </article>
  );
}
