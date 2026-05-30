import React from 'react';
import { CardShell, Help, TextBox } from './journey-components';

export type NotebookReadinessCheckProps = {
  promptText: string;
  resultText: string;
  setResultText: (value: string) => void;
};

export function NotebookReadinessCheck({ promptText, resultText, setResultText }: NotebookReadinessCheckProps) {
  return (
    <CardShell>
      <h3 className="font-bold">NotebookLM Readiness Check</h3>
      <Help title="Readiness check">
        This step checks whether the sources are sufficient before creating the Studio report and slide deck.
      </Help>
      <pre className="preline mt-3 rounded-xl bg-slate-100 p-3 text-xs">{promptText}</pre>
      <button className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={() => navigator.clipboard?.writeText(promptText || '')}>
        Copy readiness prompt
      </button>
      <TextBox label="NotebookLM readiness result" value={resultText} setValue={setResultText} rows={6} />
    </CardShell>
  );
}
