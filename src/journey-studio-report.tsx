import React from 'react';
import { CardShell, CopyBlock, Help, TextBox } from './journey-components';

export type StudioReportSectionProps = {
  promptText: string;
  summary: string;
  setSummary: (value: string) => void;
  linkOrFileName: string;
  setLinkOrFileName: (value: string) => void;
};

export function StudioReportSection({
  promptText,
  summary,
  setSummary,
  linkOrFileName,
  setLinkOrFileName,
}: StudioReportSectionProps) {
  return (
    <CardShell>
      <h3 className="font-bold">Studio Report Output</h3>
      <Help title="Studio output guide" tone="orange">
        Use this prompt in NotebookLM Studio to create the strategy meeting report. Then record the result summary and file name or link.
      </Help>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <CopyBlock label="Studio Report Prompt" text={promptText} rows={7} />
        <div className="grid gap-3">
          <TextBox label="Report result summary" value={summary} setValue={setSummary} rows={5} />
          <TextBox label="Report link or file name" value={linkOrFileName} setValue={setLinkOrFileName} rows={2} />
        </div>
      </div>
    </CardShell>
  );
}
