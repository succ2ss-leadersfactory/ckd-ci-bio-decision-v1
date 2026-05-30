import React from 'react';
import { CardShell, Chips, TextBox } from './journey-components';
import { SOURCE_CHECKS } from './journey-data';

export type SourceCheckSectionProps = {
  checks: string[];
  setChecks: (checks: string[]) => void;
  sourceRisk: string;
  setSourceRisk: (value: string) => void;
};

export function SourceCheckSection({ checks, setChecks, sourceRisk, setSourceRisk }: SourceCheckSectionProps) {
  return (
    <CardShell>
      <h3 className="font-bold">Source Check</h3>
      <Chips values={SOURCE_CHECKS} selected={checks} setSelected={setChecks} />
      <TextBox label="Risk Memo" value={sourceRisk} setValue={setSourceRisk} rows={3} />
    </CardShell>
  );
}
