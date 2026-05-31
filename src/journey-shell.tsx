import React from 'react';

export type JourneyStep = {
  id: string;
  title: string;
  description?: string;
};

export type JourneyShellProps = {
  title: string;
  subtitle?: string;
  steps: JourneyStep[];
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  children: React.ReactNode;
};

export function JourneyShell({
  title,
  subtitle,
  steps,
  currentStep,
  onPrev,
  onNext,
  children,
}: JourneyShellProps) {
  const safeStep = Math.min(Math.max(currentStep, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[safeStep];
  const progress = steps.length <= 1 ? 100 : Math.round(((safeStep + 1) / steps.length) * 100);

  return (
    <main className="min-h-screen bg-slate-50 p-4 text-slate-900 md:p-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-2xl bg-slate-900 p-5 text-white shadow-sm">
          <p className="text-sm text-cyan-100">AI Leadership Lab Journey</p>
          <h1 className="mt-1 text-2xl font-bold">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-200">{subtitle}</p> : null}
        </header>

        <section className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-500">Step {safeStep + 1} / {steps.length}</p>
              <h2 className="text-lg font-bold">{activeStep?.title || '-'}</h2>
              {activeStep?.description ? <p className="mt-1 text-sm text-slate-600">{activeStep.description}</p> : null}
            </div>
            <div className="min-w-24 text-right text-sm font-semibold text-cyan-700">{progress}%</div>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-cyan-700" style={{ width: `${progress}%` }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={
                  'rounded-full px-3 py-1 text-xs ' +
                  (index === safeStep ? 'bg-cyan-700 text-white' : index < safeStep ? 'bg-cyan-50 text-cyan-800' : 'bg-slate-100 text-slate-600')
                }
              >
                {index + 1}. {step.title}
              </span>
            ))}
          </div>
        </section>

        <section>{children}</section>

        <nav className="flex items-center justify-between rounded-2xl border bg-white p-4 shadow-sm">
          <button
            className="rounded-xl border px-4 py-2 disabled:opacity-40"
            disabled={safeStep <= 0}
            onClick={onPrev}
          >
            Previous
          </button>
          <button
            className="rounded-xl bg-cyan-700 px-4 py-2 text-white disabled:opacity-40"
            disabled={safeStep >= steps.length - 1}
            onClick={onNext}
          >
            Next
          </button>
        </nav>
      </div>
    </main>
  );
}
