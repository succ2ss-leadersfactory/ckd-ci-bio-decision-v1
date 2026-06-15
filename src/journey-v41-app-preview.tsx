import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { JourneyShell, type JourneyStep } from './journey-shell';
import { V41TaskExecutionBridgeLab } from './journey-v41-task-execution-bridge-lab';
import { V41PeopleSelectionLab } from './journey-v41-people-selection-lab';
import { V41OneOnOnePracticeLab } from './journey-v41-one-on-one-practice-lab';
import { V41FlowStrip, V41StepHero } from './journey-v41-ux-components';
import { V41_PREVIEW_ROUTE, V41_VISIBLE_APP_STEPS, V41_VISIBLE_STEP_LABELS } from './journey-v41-preview-config';

const V41_APP_PREVIEW_MARKERS = [
  'V41AppPreview',
  'journey-v41-app-preview.tsx',
  'v41 preview app shell',
  'V41_PREVIEW_ROUTE',
  'V41_VISIBLE_APP_STEPS',
  'V41TaskExecutionBridgeLab',
  'V41PeopleSelectionLab',
  'V41OneOnOnePracticeLab',
  'typeof document !== undefined',
].join('|');
void V41_APP_PREVIEW_MARKERS;

const steps: JourneyStep[] = V41_VISIBLE_STEP_LABELS.map((label, index) => ({
  id: `v41-step-${index + 1}`,
  title: label,
  description: `${index + 1}단계 / ${V41_VISIBLE_APP_STEPS}단계`,
}));

function V41PlaceholderStep({ currentStep }: { currentStep: number }) {
  const label = V41_VISIBLE_STEP_LABELS[currentStep] ?? 'v41 preview';
  const oneBasedStep = currentStep + 1;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">v41 clean preview shell</p>
      <h3 className="mt-2 text-xl font-black text-slate-950">{oneBasedStep}. {label}</h3>
      <p className="mt-3 text-sm font-bold leading-6 text-slate-600">
        이 화면은 v41 route/app/lab 연결 전, v41 전용 Shell·FlowStrip·Hero·Config가 함께 typecheck되는지 확인하는 깨끗한 preview app shell입니다.
      </p>
      <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-500">
        Route marker: {V41_PREVIEW_ROUTE}
      </p>
    </div>
  );
}

function V41StepBody({ currentStep }: { currentStep: number }) {
  if (currentStep === 5) return <V41TaskExecutionBridgeLab stage="plan" />;
  if (currentStep === 6) return <V41TaskExecutionBridgeLab stage="priority" />;
  if (currentStep === 7) return <V41TaskExecutionBridgeLab stage="boundary" />;
  if (currentStep === 8) return <V41PeopleSelectionLab />;
  if (currentStep === 9) return <V41OneOnOnePracticeLab />;
  return <V41PlaceholderStep currentStep={currentStep} />;
}

export function V41AppPreview() {
  const [currentStep, setCurrentStep] = useState(0);
  const safeStep = Math.min(Math.max(currentStep, 0), V41_VISIBLE_APP_STEPS - 1);

  return (
    <JourneyShell
      title="C1 Bio Journey v41 Preview"
      subtitle="v41 clean preview · isolated foundation shell"
      steps={steps}
      currentStep={safeStep}
      onPrev={() => setCurrentStep((step) => Math.max(step - 1, 0))}
      onNext={() => setCurrentStep((step) => Math.min(step + 1, V41_VISIBLE_APP_STEPS - 1))}
      onStepSelect={setCurrentStep}
      hideStepOverview
    >
      <div className="space-y-4">
        <V41FlowStrip currentStep={safeStep + 1} onStepSelect={(stepNumber) => setCurrentStep(stepNumber - 1)} />
        <V41StepHero
          eyebrow={`v41 preview · step ${safeStep + 1}`}
          title={steps[safeStep]?.title ?? 'v41 preview'}
          description="v41 전용 파일만 사용해 preview foundation을 검증합니다. v39/v40 UX 컴포넌트는 import하지 않습니다."
          icon="🧪"
          tone="cyan"
          badges={[
            { label: 'Route', value: V41_PREVIEW_ROUTE, tone: 'cyan', icon: '🔗' },
            { label: 'Steps', value: V41_VISIBLE_APP_STEPS, tone: 'slate', icon: '🧭' },
            { label: 'Scope', value: 'v41 only', tone: 'emerald', icon: '🛡️' },
          ]}
        />
        <V41StepBody currentStep={safeStep} />
      </div>
    </JourneyShell>
  );
}

const rootElement = typeof document !== 'undefined'
  ? document.getElementById('root')
  : null;

if (rootElement) {
  createRoot(rootElement).render(<V41AppPreview />);
}
