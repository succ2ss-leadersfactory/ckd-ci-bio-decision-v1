import React from 'react';
import { CardShell, CopyBlock, Help } from './journey-components';

export type NotebookSourcePrepProps = {
  searchText: string;
  packageText: string;
};

export function NotebookSourcePrep({ searchText, packageText }: NotebookSourcePrepProps) {
  return (
    <CardShell>
      <h3 className="font-bold">NotebookLM Source Prep</h3>
      <Help title="Studio source preparation" tone="orange">
        Create a new NotebookLM notebook first. Use the search query for web sources and add the practice package as a copied text source.
      </Help>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <CopyBlock label="Web Source Search Query" text={searchText} rows={4} />
        <CopyBlock label="Practice Source Package" text={packageText} rows={8} />
      </div>
    </CardShell>
  );
}
