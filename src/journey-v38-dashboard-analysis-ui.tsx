import type { Dispatch, SetStateAction } from 'react';
import { V38_METRIC_OPTIONS as METRIC_OPTIONS, type V38TeamMember } from './journey-v38-dashboard-analysis-data';

export function V38MetricPicker({
  title,
  selected,
  setter,
  max,
  safetyOnly,
}: {
  title: string;
  selected: string[];
  setter: Dispatch<SetStateAction<string[]>>;
  max: number;
  safetyOnly: boolean;
}) {
  const options = METRIC_OPTIONS.filter((item) => (safetyOnly ? item.safety : !item.safety));
  return (
    <div className="mt-4">
      <p className="text-xs font-black text-slate-700">{title}</p>
      <div className="mt-2 grid gap-2 md:grid-cols-2">
        {options.map((metric) => {
          const checked = selected.includes(metric.id);
          return (
            <label
              key={metric.id}
              className={`rounded-2xl border p-3 text-xs font-bold leading-5 ${
                checked ? 'border-cyan-700 bg-cyan-50 text-cyan-950' : 'bg-white text-slate-700'
              }`}
            >
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    setter((current) =>
                      current.includes(metric.id)
                        ? current.filter((item) => item !== metric.id)
                        : current.length >= max
                          ? current
                          : [...current, metric.id],
                    )
                  }
                />
                <span className="font-black">{metric.name}</span>
              </div>
              <p className="mt-1 text-slate-600">{metric.group} · {metric.meaning}</p>
              <p className="mt-1 text-slate-500">단정 금지: {metric.caution}</p>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function V38ReviewTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-2xl border bg-slate-50 px-3 py-2 text-sm leading-6"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function V38PrepTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black text-slate-500">{label}</span>
      <textarea
        className="min-h-24 w-full rounded-2xl border bg-white px-3 py-2 text-sm leading-6"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function V38TeamMemberCard({
  member,
  selected,
  disabled,
  onToggle,
}: {
  member: V38TeamMember;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`rounded-3xl border p-4 ${selected ? 'border-cyan-700 bg-cyan-50' : 'bg-slate-50'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-slate-950">{member.name}</p>
          <p className="mt-1 text-xs font-bold text-slate-600">{member.profile}</p>
        </div>
        <button
          type="button"
          disabled={disabled}
          className={`rounded-2xl px-3 py-2 text-xs font-black ${
            selected ? 'bg-cyan-700 text-white' : disabled ? 'bg-slate-200 text-slate-400' : 'border bg-white text-slate-700'
          }`}
          onClick={onToggle}
        >
          {selected ? '선택됨' : '이 유형 선택'}
        </button>
      </div>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-700">{member.observation}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {member.signals.map((signal) => (
          <span key={signal} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">
            {signal}
          </span>
        ))}
      </div>
    </article>
  );
}
