import type { ReactNode } from 'react';

const V41_SHARED_UI_MARKERS = [
  'v41 shared ui helpers',
  'V41Card',
  'V41TextAreaField',
  'compactV41Text',
].join('|');
void V41_SHARED_UI_MARKERS;

export function compactV41Text(value?: string) {
  return value?.trim() || '미작성';
}

export function V41Card({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5"><h3 className="text-lg font-black text-slate-950">{title}</h3><div className="mt-4 space-y-3">{children}</div></section>;
}

export function V41TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  focusTone = 'fuchsia',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  focusTone?: 'fuchsia' | 'violet' | 'indigo' | 'amber' | 'cyan' | 'emerald';
}) {
  const focusClass = {
    fuchsia: 'focus:border-fuchsia-700 focus:ring-fuchsia-100',
    violet: 'focus:border-violet-700 focus:ring-violet-100',
    indigo: 'focus:border-indigo-700 focus:ring-indigo-100',
    amber: 'focus:border-amber-700 focus:ring-amber-100',
    cyan: 'focus:border-cyan-700 focus:ring-cyan-100',
    emerald: 'focus:border-emerald-700 focus:ring-emerald-100',
  }[focusTone];

  return <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4"><span className="text-sm font-black text-slate-950">{label}</span><textarea className={`mt-3 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:ring-2 ${focusClass}`} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}
