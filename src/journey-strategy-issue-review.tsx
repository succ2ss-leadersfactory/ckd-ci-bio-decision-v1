import React from 'react';
import { CardShell, IssueEditor, type IssueNote } from './journey-components';

export type StrategyIssueReviewProps = {
  notes: IssueNote[];
  setNotes: (notes: IssueNote[]) => void;
};

export function StrategyIssueReview({ notes, setNotes }: StrategyIssueReviewProps) {
  return (
    <CardShell>
      <h3 className="font-bold">Strategy Issue Review</h3>
      <IssueEditor notes={notes} setNotes={setNotes} />
    </CardShell>
  );
}
