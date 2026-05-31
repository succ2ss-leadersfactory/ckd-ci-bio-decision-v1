import type { Dispatch, SetStateAction } from 'react';
import type { ParticipantInfo } from './journey-entry';
import type { JsonRecord } from './journey-storage';
import type { IssueNote } from './journey-components';

export type V35Save = (key: string, payload: JsonRecord) => void;

export type V35PreviewState = {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  participant: ParticipantInfo;
  setParticipant: Dispatch<SetStateAction<ParticipantInfo>>;
  savedState: JsonRecord;
  notes: IssueNote[];
  setNotes: Dispatch<SetStateAction<IssueNote[]>>;
  sourceChecks: string[];
  setSourceChecks: Dispatch<SetStateAction<string[]>>;
  sourceRisk: string;
  setSourceRisk: Dispatch<SetStateAction<string>>;
  readinessResult: string;
  setReadinessResult: Dispatch<SetStateAction<string>>;
  reportSummary: string;
  setReportSummary: Dispatch<SetStateAction<string>>;
  reportLinkOrFileName: string;
  setReportLinkOrFileName: Dispatch<SetStateAction<string>>;
  slidesSummary: string;
  setSlidesSummary: Dispatch<SetStateAction<string>>;
  slidesLinkOrFileName: string;
  setSlidesLinkOrFileName: Dispatch<SetStateAction<string>>;
  presentationChecks: string[];
  setPresentationChecks: Dispatch<SetStateAction<string[]>>;
  presentationOneLiner: string;
  setPresentationOneLiner: Dispatch<SetStateAction<string>>;
  presentationManagerRequest: string;
  setPresentationManagerRequest: Dispatch<SetStateAction<string>>;
  save: V35Save;
};
