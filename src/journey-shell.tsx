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
  onStepSelect?: (step: number) => void;
  children: React.ReactNode;
};

export function JourneyShell({
  title,
  subtitle,
  steps,
  currentStep,
  onPrev,
  onNext,
  onStepSelect,
  children,
}: JourneyShellProps) {
  const safeStep = Math.min(Math.max(currentStep, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[safeStep];
  const nextStep = steps[safeStep + 1];
  const progress = steps.length <= 1 ? 100 : Math.round(((safeStep + 1) / steps.length) * 100);
  const stepScrollerRef = React.useRef<HTMLDivElement | null>(null);
  const activeChipRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [safeStep]);

  React.useEffect(() => {
    const scroller = stepScrollerRef.current;
    const activeChip = activeChipRef.current;
    if (!scroller || !activeChip) return;

    const chipLeft = activeChip.offsetLeft;
    const chipWidth = activeChip.offsetWidth;
    const targetLeft = Math.max(chipLeft - scroller.clientWidth / 2 + chipWidth / 2, 0);
    scroller.scrollTo({ left: targetLeft, behavior: 'smooth' });
  }, [safeStep]);

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-900 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl space-y-4 pb-28 md:pb-32">
        <header className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-sm">
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-cyan-100">
              <span className="rounded-full bg-white/10 px-3 py-1">AI Leadership Lab Journey</span>
              <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-cyan-50">v36 Preview</span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-50">자동 저장</span>
            </div>
            <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">{title}</h1>
            {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-200 md:text-base">{subtitle}</p> : null}
          </div>
        </header>

        <section className="sticky top-2 z-20 rounded-3xl border bg-white/95 p-4 shadow-sm backdrop-blur md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">Step {safeStep + 1} / {steps.length}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">진행률 {progress}%</span>
              </div>
              <h2 className="mt-2 text-xl font-black leading-tight text-slate-950">{activeStep?.title || '-'}</h2>
              {activeStep?.description ? <p className="mt-1 text-sm leading-6 text-slate-600">{activeStep.description}</p> : null}
              {nextStep ? <p className="mt-2 text-xs font-semibold text-slate-500">다음 단계: {nextStep.title}</p> : <p className="mt-2 text-xs font-semibold text-emerald-700">마지막 단계입니다. 최종 산출물을 확인하세요.</p>}
            </div>
            <div className="w-full md:w-56">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>진행</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-3 rounded-full bg-cyan-700 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div ref={stepScrollerRef} className="mt-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max gap-2">
              {steps.map((step, index) => {
                const isActive = index === safeStep;
                const isDone = index < safeStep;
                const setActiveChip = (node: HTMLElement | null) => {
                  if (isActive) activeChipRef.current = node;
                };
                const className =
                  'rounded-full border px-3 py-2 text-xs font-bold transition ' +
                  (isActive
                    ? 'border-cyan-700 bg-cyan-700 text-white shadow-sm'
                    : isDone
                      ? 'border-cyan-100 bg-cyan-50 text-cyan-800 hover:border-cyan-300'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300');

                if (!onStepSelect) {
                  return (
                    <span key={step.id} ref={setActiveChip} className={className} aria-current={isActive ? 'step' : undefined} title={`${index + 1}. ${step.title}`}>
                      {index + 1}. {step.title}
                    </span>
                  );
                }

                return (
                  <button
                    key={step.id}
                    ref={setActiveChip}
                    type="button"
                    className={className}
                    aria-current={isActive ? 'step' : undefined}
                    aria-label={`${index + 1}단계 ${step.title}로 이동`}
                    title={`${index + 1}. ${step.title}`}
                    onClick={() => onStepSelect(index)}
                  >
                    {index + 1}. {step.title}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section>{children}</section>

        <nav className="sticky bottom-3 z-30 rounded-3xl border bg-white/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur md:p-4 md:pb-4">
          <div className="flex items-center justify-between gap-3">
            <button
              className="min-h-12 flex-1 rounded-2xl border px-4 py-3 text-sm font-black text-slate-700 disabled:opacity-40 md:flex-none md:min-w-32"
              disabled={safeStep <= 0}
              onClick={onPrev}
            >
              이전 단계
            </button>
            <div className="hidden min-w-0 flex-1 text-center md:block">
              <p className="truncate text-sm font-bold text-slate-900">{activeStep?.title || '-'}</p>
              <p className="text-xs text-slate-500">입력 내용은 브라우저에 자동 저장됩니다.</p>
            </div>
            <button
              className="min-h-12 flex-1 rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white disabled:opacity-40 md:flex-none md:min-w-32"
              disabled={safeStep >= steps.length - 1}
              onClick={onNext}
            >
              다음 단계
            </button>
          </div>
        </nav>
      </div>
    </main>
  );
}
