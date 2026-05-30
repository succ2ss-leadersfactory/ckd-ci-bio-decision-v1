import React from 'react';

export function CardShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={'rounded-2xl border bg-white p-5 shadow-sm ' + className}>{children}</div>;
}

export function Help({ title, children, tone = 'cyan' }: { title: string; children: React.ReactNode; tone?: 'cyan' | 'orange' }) {
  return (
    <div className={(tone === 'orange' ? 'bg-orange-50' : 'bg-cyan-50') + ' rounded-xl p-3 text-sm'}>
      <b>{title}</b>
      <div className="mt-1 text-slate-700">{children}</div>
    </div>
  );
}

export function TextBox({
  label,
  value,
  setValue,
  rows = 3,
  placeholder = '',
  readOnly = false,
}: {
  label: string;
  value: string;
  setValue?: (value: string) => void;
  rows?: number;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <b className="text-sm">{label}</b>
      <textarea
        className="mt-1 w-full rounded-xl border p-3"
        rows={rows}
        placeholder={placeholder}
        value={value || ''}
        readOnly={readOnly}
        onChange={e => setValue?.(e.target.value)}
      />
    </label>
  );
}

export function Chips({
  values,
  selected,
  setSelected,
}: {
  values: string[];
  selected: string[];
  setSelected: (value: string[]) => void;
}) {
  const toggle = (item: string) => selected.includes(item) ? selected.filter(x => x !== item) : [...selected, item];

  return (
    <div className="flex flex-wrap gap-2">
      {values.map(value => (
        <button
          key={value}
          className={'rounded-xl border px-3 py-2 text-sm ' + (selected.includes(value) ? 'bg-cyan-700 text-white' : '')}
          onClick={() => setSelected(toggle(value))}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

export function CopyBlock({ label, text, rows = 6 }: { label: string; text: string; rows?: number }) {
  return (
    <div>
      <TextBox label={label} value={text} rows={rows} readOnly />
      <button className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={() => navigator.clipboard?.writeText(text || '')}>
        {label} 복사
      </button>
    </div>
  );
}
