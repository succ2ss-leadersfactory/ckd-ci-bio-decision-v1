import { loadV39TeamSevenCoachingMapResult } from './journey-v39-team-seven-coaching-map';

const V39_TEAM_SEVEN_FINAL_SUMMARY_SMOKE_MARKERS = [
  'V39TeamSevenFinalSummary',
  '8단계 코칭 대상 선정 요약',
  '우선 1on1 코칭 대상',
  '9단계로 넘길 코칭 초점',
  '단정하면 안 되는 해석',
  '8단계 팀원 7명 업무배분·1on1 요약',
  '전체 업무배분 균형',
  '업무배분 리스크',
].join('|');
void V39_TEAM_SEVEN_FINAL_SUMMARY_SMOKE_MARKERS;

function hasDecisionContent(item: ReturnType<typeof loadV39TeamSevenCoachingMapResult>['decisions'][string]) {
  return Boolean(
    item.priorityOneOnOne ||
      item.coachingPurpose ||
      item.selectionReason?.trim() ||
      item.coachingFocus?.trim() ||
      item.leaderSupport.trim() ||
      item.riskMemo.trim() ||
      item.aiJudgmentDraft?.trim(),
  );
}

export function buildV39TeamSevenFinalSummaryText() {
  const result = loadV39TeamSevenCoachingMapResult();
  const decisions = Object.values(result.decisions);
  const filled = decisions.filter(hasDecisionContent);
  const priority = decisions.filter((item) => item.priorityOneOnOne);

  if (filled.length === 0) {
    return '[8단계 코칭 대상 선정 요약]\n- 아직 8단계 코칭 대상 선정 결과가 저장되지 않았습니다.';
  }

  return [
    '[8단계 코칭 대상 선정 요약]',
    `- 판단 메모: ${filled.length}건`,
    `- 우선 1on1 대상: ${priority.length > 0 ? priority.map((item) => item.memberLabel).join(' · ') : '아직 선택되지 않았습니다.'}`,
    '',
    '[우선 1on1 코칭 대상]',
    ...filled.map((item, index) => [
      `${index + 1}. ${item.memberLabel}`,
      `- 1on1 코칭 목적: ${item.coachingPurpose || '미정'}`,
      `- 선택 이유: ${item.selectionReason || item.leaderSupport || '아직 작성되지 않았습니다.'}`,
      `- 9단계로 넘길 코칭 초점: ${item.coachingFocus || '아직 작성되지 않았습니다.'}`,
      `- 단정하면 안 되는 해석/주의할 지점: ${item.riskMemo || '아직 작성되지 않았습니다.'}`,
    ].join('\n')),
  ].join('\n');
}

export function V39TeamSevenFinalSummary() {
  const result = loadV39TeamSevenCoachingMapResult();
  const decisions = Object.values(result.decisions);
  const filled = decisions.filter(hasDecisionContent);
  const priority = decisions.filter((item) => item.priorityOneOnOne);

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm xl:col-span-3">
      <p className="text-xs font-black text-indigo-700">8단계 코칭 대상 선정 요약</p>
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <div className="rounded-2xl bg-indigo-50 px-3 py-2 text-xs font-bold leading-5 text-indigo-950">
          <p className="font-black">판단 메모</p>
          <p className="mt-1">{filled.length}건</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">우선 1on1 코칭 대상</p>
          <p className="mt-1">{priority.length > 0 ? priority.map((item) => item.memberLabel).join(' · ') : '아직 선택되지 않았습니다.'}</p>
        </div>
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-bold leading-5 text-amber-950">
          <p className="font-black">9단계로 넘길 것</p>
          <p className="mt-1">선택 이유, 코칭 목적, 코칭 초점, 단정하면 안 되는 해석을 대화 준비로 넘깁니다.</p>
        </div>
      </div>
      {filled.length > 0 ? (
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {filled.map((item) => (
            <div key={item.memberId} className="rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs font-bold leading-5 text-slate-800">
              <p className="font-black text-slate-950">{item.memberLabel}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">코칭 목적: </span>{item.coachingPurpose || '미정'}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">선택 이유: </span>{item.selectionReason || item.leaderSupport || '아직 작성되지 않았습니다.'}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">코칭 초점: </span>{item.coachingFocus || '아직 작성되지 않았습니다.'}</p>
              <p className="mt-1"><span className="font-black text-indigo-800">주의할 지점: </span>{item.riskMemo || '아직 작성되지 않았습니다.'}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-600">8단계에서 코칭 대상 선정 결과를 작성하면, 이곳에 우선 1on1 대상과 9단계로 넘길 코칭 초점이 표시됩니다.</p>
      )}
    </article>
  );
}
