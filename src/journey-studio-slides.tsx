import React from 'react';
import { CardShell, CopyBlock, Help, TextBox } from './journey-components';

export type StudioSlidesSectionProps = {
  promptText: string;
  summary: string;
  setSummary: (value: string) => void;
  linkOrFileName: string;
  setLinkOrFileName: (value: string) => void;
};

export function StudioSlidesSection({
  promptText,
  summary,
  setSummary,
  linkOrFileName,
  setLinkOrFileName,
}: StudioSlidesSectionProps) {
  return (
    <CardShell>
      <h3 className="font-bold">Studio Slide Deck Output</h3>
      <Help title="Studio slide guide" tone="orange">
        Use this prompt in NotebookLM Studio to create the strategy meeting slide deck. Then record the slide summary and file name or link.
      </Help>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <CopyBlock label="Studio Slide Prompt" text={promptText} rows={7} />
        <div className="grid gap-3">
          <TextBox label="Slide deck result summary" value={summary} setValue={setSummary} rows={5} />
          <TextBox label="Slide deck link or file name" value={linkOrFileName} setValue={setLinkOrFileName} rows={2} />
        </div>
      </div>
    </CardShell>
  );
}
