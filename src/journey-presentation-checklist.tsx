import React from 'react';
import { CardShell, Chips, TextBox } from './journey-components';

export const PRESENTATION_CHECKS = [
  'one-message-clear',
  'source-backed',
  'do-not-do-included',
  'two-week-experiment-included',
  'member-actions-translated',
  'compliance-risk-removed',
];

export type PresentationChecklistProps = {
  checks: string[];
  setChecks: (checks: string[]) => void;
  oneLiner: string;
  setOneLiner: (value: string) => void;
  managerRequest: string;
  setManagerRequest: (value: string) => void;
};

export function PresentationChecklist({
  checks,
  setChecks,
  oneLiner,
  setOneLiner,
  managerRequest,
  setManagerRequest,
}: PresentationChecklistProps) {
  return (
    <CardShell>
      <h3 className="font-bold">Presentation Checklist</h3>
      <Chips values={PRESENTATION_CHECKS} selected={checks} setSelected={setChecks} />
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <TextBox label="Meeting one-liner" value={oneLiner} setValue={setOneLiner} rows={3} />
        <TextBox label="Manager request" value={managerRequest} setValue={setManagerRequest} rows={3} />
      </div>
    </CardShell>
  );
}
