import type { V38TeamMember } from './journey-v38-dashboard-analysis-data';
import type { V38MemberPrep } from './journey-v38-dashboard-analysis-parsers';

type V38FinalPrepField = 'aiDraft' | 'finalPrep';

export function V38FinalMemberPrepCard({
  member,
  current,
  onUpdate,
}: {
  member: V38TeamMember;
  current: V38MemberPrep;
  onUpdate: (field: V38FinalPrepField, value: string) => void;
}) {
  return (
    <article className="rounded-3xl border bg-slate-50 p-4">
      <p className="font-black text-slate-950">{member.name}</p>
      <label className="mt-3 block space-y-1">
        <span className="text-xs font-black text-slate-500">AI가 제안한 준비물 초안</span>
        <textarea
          className="min-h-28 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6"
          value={current.aiDraft}
          onChange={(event) => onUpdate('aiDraft', event.target.value)}
        />
      </label>
      <label className="mt-3 block space-y-1">
        <span className="text-xs font-black text-slate-500">최종 유형별 다음 행동 준비물</span>
        <textarea
          className="min-h-36 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6"
          value={current.finalPrep}
          onChange={(event) => onUpdate('finalPrep', event.target.value)}
        />
      </label>
    </article>
  );
}
