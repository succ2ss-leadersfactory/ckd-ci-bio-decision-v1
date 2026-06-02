import {
  V38_ACTION_OUTPUT_OPTIONS as ACTION_OUTPUT_OPTIONS,
  V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID,
  type V38TeamMember,
} from './journey-v38-dashboard-analysis-data';

export function V38ActionDeliverablePicker({
  member,
  checkedItems,
  onApplySuggested,
  onToggleDeliverable,
}: {
  member: V38TeamMember;
  checkedItems: string[];
  onApplySuggested: () => void;
  onToggleDeliverable: (label: string) => void;
}) {
  const suggested = V38_SUGGESTED_DELIVERABLES_BY_MEMBER_ID[member.id] ?? [];
  return (
    <article className="rounded-3xl border bg-slate-50 p-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-black text-slate-950">{member.name}</p>
          <p className="mt-1 text-xs font-bold text-slate-600">추천: {suggested.join(' / ')}</p>
        </div>
        <button
          type="button"
          className="rounded-2xl border bg-white px-4 py-2 text-xs font-black text-slate-700"
          onClick={onApplySuggested}
        >
          추천 준비물 선택
        </button>
      </div>
      <div className="mt-3 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
        {ACTION_OUTPUT_OPTIONS.map((option) => (
          <label
            key={option}
            className={`flex items-start gap-3 rounded-2xl border p-3 text-xs font-bold leading-5 ${
              checkedItems.includes(option) ? 'border-cyan-700 bg-white text-cyan-950' : 'bg-white/70 text-slate-700'
            }`}
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={checkedItems.includes(option)}
              onChange={() => onToggleDeliverable(option)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </article>
  );
}
