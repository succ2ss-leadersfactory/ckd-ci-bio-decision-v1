import React from 'react';

export type IssueNote = {
  issue: string;
  change: string;
  source: string;
  date: string;
  reliability: string;
  why: string;
  check: string;
  question: string;
  compliance: string;
};

export type ContextRow = {
  label: string;
  value: string;
};

export const ISSUE_FIELDS: Array<[keyof IssueNote, string]> = [
  ['issue', '핵심 이슈'],
  ['change', '핵심 변화'],
  ['source', '근거 출처'],
  ['date', '발행 시점'],
  ['reliability', '신뢰도 판단'],
  ['why', '우리 팀에 중요한 이유'],
  ['check', '추가 확인 필요'],
  ['question', '전략 질문'],
  ['compliance', '컴플라이언스 주의 표현'],
];

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

export function IssueEditor({
  notes,
  setNotes,
}: {
  notes: IssueNote[];
  setNotes: (notes: IssueNote[]) => void;
}) {
  const setNote = (index: number, key: keyof IssueNote, value: string) => {
    const next = [...notes];
    next[index] = { ...next[index], [key]: value };
    setNotes(next);
  };

  return (
    <div className="grid gap-4">
      {notes.map((note, index) => (
        <div key={index} className="rounded-xl border p-3">
          <b>전략 이슈 메모 {index + 1}</b>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {ISSUE_FIELDS.map(([key, label]) => (
              <TextBox
                key={key}
                label={label}
                value={note[key]}
                setValue={(value: string) => setNote(index, key, value)}
                rows={2}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContextCard({ title = '선택 팀원 컨텍스트', rows }: { title?: string; rows: ContextRow[] }) {
  return (
    <CardShell className="border-cyan-200 bg-cyan-50">
      <h3 className="font-bold">{title}</h3>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {rows.map(row => (
          <div key={row.label} className="rounded-xl bg-white p-3 text-sm">
            <b>{row.label}</b>
            <p className="mt-1 text-slate-700">{row.value || '-'}</p>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
