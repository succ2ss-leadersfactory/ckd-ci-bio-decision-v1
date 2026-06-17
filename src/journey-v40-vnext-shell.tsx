import type { ReactNode } from 'react';
import type { JourneyStep } from './journey-shell';

type V40VNextShellProps = {
  steps: JourneyStep[];
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  children: ReactNode;
};

const V40_VNEXT_SHELL_MARKERS = [
  'V40VNextShell',
  '상단 제목 제거',
  '상단 단계 overview 제거',
  'v40-vNext 보호 기준 박스 제거',
  '하단 이동 버튼 유지',
].join('|');
void V40_VNEXT_SHELL_MARKERS;

export function V40VNextShell({ steps, currentStep, onPrev, onNext, children }: V40VNextShellProps) {
  const safeStep = Math.min(Math.max(currentStep, 0), Math.max(steps.length - 1, 0));
  const activeStep = steps[safeStep];

  return (
    <main className="min-h-screen bg-slate-50 px-3 py-4 text-slate-900 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl space-y-4 pb-28 md:pb-32">
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
