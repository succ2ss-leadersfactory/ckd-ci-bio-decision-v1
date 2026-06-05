import { V39TeamSevenCoachingMap } from './journey-v39-team-seven-coaching-map';

const V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS = [
  'V39TeamSevenCoachingUxWrapper',
  '7명 전체는 가볍게, 우선 1on1 2명만 깊게',
  '전체 7명은 업무배분 판단만 남겨도 충분합니다',
].join('|');
void V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS;

export function V39TeamSevenCoachingUxWrapper() {
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-indigo-700">8단계 입력 가이드</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">7명 전체는 가볍게, 우선 1on1 2명만 깊게 봅니다</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
            <p className="font-black">7명 전체</p>
            <p className="mt-1">업무배분 판단만 남겨도 충분합니다. 모든 팀원을 깊게 작성하지 않아도 됩니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">우선 1on1 1~2명</p>
            <p className="mt-1">코칭 목적, 팀장 지원, 주의할 리스크를 구체화합니다.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">작성 기준</p>
            <p className="mt-1">완성도보다 판단의 균형이 중요합니다. 부담·기회·위험이 한 사람에게 몰리는지만 확인하세요.</p>
          </div>
        </div>
      </section>
      <V39TeamSevenCoachingMap />
    </section>
  );
}
