import type { ReactNode } from 'react';

type V39Tone = 'emerald' | 'sky' | 'cyan' | 'violet' | 'indigo' | 'amber' | 'rose' | 'slate';

const toneClass = {
  emerald: {
    border: 'border-emerald-100',
    borderStrong: 'border-emerald-200',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    textStrong: 'text-emerald-950',
    ring: 'ring-emerald-100',
  },
  sky: {
    border: 'border-sky-100',
    borderStrong: 'border-sky-200',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    textStrong: 'text-sky-950',
    ring: 'ring-sky-100',
  },
  cyan: {
    border: 'border-cyan-100',
    borderStrong: 'border-cyan-200',
    bg: 'bg-cyan-50',
    text: 'text-cyan-700',
    textStrong: 'text-cyan-950',
    ring: 'ring-cyan-100',
  },
  violet: {
    border: 'border-violet-100',
    borderStrong: 'border-violet-200',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    textStrong: 'text-violet-950',
    ring: 'ring-violet-100',
  },
  indigo: {
    border: 'border-indigo-100',
    borderStrong: 'border-indigo-200',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    textStrong: 'text-indigo-950',
    ring: 'ring-indigo-100',
  },
  amber: {
    border: 'border-amber-100',
    borderStrong: 'border-amber-200',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    textStrong: 'text-amber-950',
    ring: 'ring-amber-100',
  },
  rose: {
    border: 'border-rose-100',
    borderStrong: 'border-rose-200',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    textStrong: 'text-rose-950',
    ring: 'ring-rose-100',
  },
  slate: {
    border: 'border-slate-200',
    borderStrong: 'border-slate-300',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    textStrong: 'text-slate-950',
    ring: 'ring-slate-100',
  },
};

export type V39InfoBadge = {
  label: string;
  value: ReactNode;
  tone?: V39Tone;
  icon?: string;
};

export function V39StatusBadge({ label, value, tone = 'slate', icon }: V39InfoBadge) {
  const toneStyles = toneClass[tone];

  return (
    <div className={`rounded-2xl border ${toneStyles.border} ${toneStyles.bg} px-4 py-3 shadow-sm`}>
      <p className={`flex items-center gap-1.5 text-xs font-black ${toneStyles.text}`}>
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {label}
      </p>
      <div className={`mt-1 text-sm font-black ${toneStyles.textStrong}`}>{value}</div>
    </div>
  );
}

export function V39StepHero({
  eyebrow,
  title,
  description,
  icon,
  tone = 'emerald',
  badges,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  icon: string;
  tone?: V39Tone;
  badges: V39InfoBadge[];
}) {
  const toneStyles = toneClass[tone];

  return (
    <section className={`rounded-3xl border ${toneStyles.border} bg-white p-4 shadow-sm md:p-5`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${toneStyles.bg} text-2xl ring-4 ${toneStyles.ring}`} aria-hidden="true">
            {icon}
          </div>
          <div>
            <p className={`text-xs font-black uppercase tracking-wide ${toneStyles.text}`}>{eyebrow}</p>
            <h2 className="mt-1 text-xl font-black text-slate-950 md:text-2xl">{title}</h2>
            <div className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">{description}</div>
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:w-[34rem] xl:grid-cols-3">
          {badges.map((badge) => <V39StatusBadge key={`${badge.label}-${String(badge.value)}`} {...badge} />)}
        </div>
      </div>
    </section>
  );
}

const journeySteps = [
  { step: 5, label: '지표', icon: '🎯' },
  { step: 6, label: '단서', icon: '🔎' },
  { step: 7, label: '행동', icon: '🧭' },
  { step: 8, label: '역할', icon: '👥' },
  { step: 9, label: '대화', icon: '💬' },
  { step: 10, label: 'AI 초안', icon: '✨' },
  { step: 11, label: '안전선', icon: '🛡️' },
  { step: 12, label: '실행 메모', icon: '✅' },
  { step: 13, label: '질문', icon: '🗣️' },
];

export function V39FlowStrip({ currentStep }: { currentStep: number }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm md:p-4">
      <div className="flex flex-wrap items-center gap-2">
        {journeySteps.map((item, index) => {
          const isCurrent = item.step === currentStep;
          const isDone = item.step < currentStep;
          const badgeClass = isCurrent
            ? 'border-emerald-300 bg-emerald-50 text-emerald-950 shadow-sm'
            : isDone
              ? 'border-slate-200 bg-slate-50 text-slate-700'
              : 'border-slate-100 bg-white text-slate-400';

          return (
            <div key={item.step} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-black ${badgeClass}`} aria-current={isCurrent ? 'step' : undefined}>
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.step}. {item.label}</span>
              </div>
              {index < journeySteps.length - 1 ? <span className="text-xs font-black text-slate-300" aria-hidden="true">→</span> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function V39ActionTriplet({
  previous,
  current,
  next,
}: {
  previous: { title: string; body: ReactNode; icon?: string };
  current: { title: string; body: ReactNode; icon?: string };
  next: { title: string; body: ReactNode; icon?: string };
}) {
  const items = [
    { ...previous, tone: 'sky' as V39Tone, label: '앞에서 가져온 것' },
    { ...current, tone: 'emerald' as V39Tone, label: '지금 할 일' },
    { ...next, tone: 'violet' as V39Tone, label: '다음 화면에서 쓸 것' },
  ];

  return (
    <div className="grid gap-2 md:grid-cols-3">
      {items.map((item) => {
        const toneStyles = toneClass[item.tone];
        return (
          <article key={item.label} className={`rounded-2xl border ${toneStyles.border} ${toneStyles.bg} px-4 py-3 text-xs font-bold leading-5 ${toneStyles.textStrong}`}>
            <p className="font-black text-slate-950">
              {item.icon ? <span className="mr-1" aria-hidden="true">{item.icon}</span> : null}
              {item.label}
            </p>
            <p className="mt-1 font-black">{item.title}</p>
            <div className="mt-1 text-slate-700">{item.body}</div>
          </article>
        );
      })}
    </div>
  );
}

export function V39MinimumChecklist({ items, tone = 'amber' }: { items: string[]; tone?: V39Tone }) {
  const toneStyles = toneClass[tone];

  return (
    <section className={`rounded-2xl border ${toneStyles.borderStrong} ${toneStyles.bg} px-4 py-3 text-xs font-bold leading-5 ${toneStyles.textStrong}`}>
      <p className="font-black text-slate-950">최소로 남길 것</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-2 rounded-2xl bg-white/70 px-3 py-2 text-slate-700">
            <span className={`${toneStyles.text} font-black`} aria-hidden="true">□</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function V39SafetyStrip({ children }: { children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
      <p className="font-black text-slate-950">⚠️ 조심할 점</p>
      <div className="mt-1">{children}</div>
    </section>
  );
}

export function V39MiniFlow({ items }: { items: { title: string; body: string; icon?: string }[] }) {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {items.map((item, index) => (
        <div key={item.title} className="relative rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
          <p className="font-black text-slate-950">
            {item.icon ? <span className="mr-1" aria-hidden="true">{item.icon}</span> : null}
            {item.title}
          </p>
          <p className="mt-1">{item.body}</p>
          {index < items.length - 1 ? <span className="absolute -right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-cyan-100 px-2 py-1 text-cyan-700 md:inline" aria-hidden="true">→</span> : null}
        </div>
      ))}
    </div>
  );
}
