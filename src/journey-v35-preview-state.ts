import { useCallback } from 'react';
import type { ParticipantInfo } from './journey-entry';
import { getJson, useStored, type JsonRecord } from './journey-storage';
import { createEmptyIssueNotes, V35_STORAGE_KEYS } from './journey-v35-preview-config';
import type { IssueNote } from './journey-components';

const DEFAULT_PARTICIPANT: ParticipantInfo = {
  participantId: `v35-${Date.now()}`,
  sessionCode: '',
  name: '',
  teamName: '',
};

export function resetV35PreviewStorage() {
  Object.values(V35_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  window.location.reload();
}

export function useV35PreviewState() {
  const [step, setStep] = useStored<number>(V35_STORAGE_KEYS.step, 0);
  const [participant, setParticipant] = useStored<ParticipantInfo>(V35_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);
  const [savedState, setSavedState] = useStored<JsonRecord>(V35_STORAGE_KEYS.state, {});
  const [notes, setNotes] = useStored<IssueNote[]>(V35_STORAGE_KEYS.notes, createEmptyIssueNotes());
  const [sourceChecks, setSourceChecks] = useStored<string[]>(V35_STORAGE_KEYS.sourceChecks, []);
  const [sourceRisk, setSourceRisk] = useStored<string>(V35_STORAGE_KEYS.sourceRisk, '');
  const [readinessResult, setReadinessResult] = useStored<string>(V35_STORAGE_KEYS.readinessResult, '');
  const [reportSummary, setReportSummary] = useStored<string>(V35_STORAGE_KEYS.reportSummary, '');
  const [reportLinkOrFileName, setReportLinkOrFileName] = useStored<string>(V35_STORAGE_KEYS.reportLinkOrFileName, '');
  const [slidesSummary, setSlidesSummary] = useStored<string>(V35_STORAGE_KEYS.slidesSummary, '');
  const [slidesLinkOrFileName, setSlidesLinkOrFileName] = useStored<string>(V35_STORAGE_KEYS.slidesLinkOrFileName, '');
  const [presentationChecks, setPresentationChecks] = useStored<string[]>(V35_STORAGE_KEYS.presentationChecks, []);
  const [presentationOneLiner, setPresentationOneLiner] = useStored<string>(V35_STORAGE_KEYS.presentationOneLiner, '');
  const [presentationManagerRequest, setPresentationManagerRequest] = useStored<string>(V35_STORAGE_KEYS.presentationManagerRequest, '');

  const save = useCallback((key: string, payload: JsonRecord) => {
    const currentState = getJson<JsonRecord>(V35_STORAGE_KEYS.state, {});
    const nextState = {
      ...currentState,
      [key]: payload,
      v35AppLastSavedAt: new Date().toISOString(),
    };

    setSavedState(nextState);
  }, [setSavedState]);

  return {
    step,
    setStep,
    participant,
    setParticipant,
    savedState,
    notes,
    setNotes,
    sourceChecks,
    setSourceChecks,
    sourceRisk,
    setSourceRisk,
    readinessResult,
    setReadinessResult,
    reportSummary,
    setReportSummary,
    reportLinkOrFileName,
    setReportLinkOrFileName,
    slidesSummary,
    setSlidesSummary,
    slidesLinkOrFileName,
    setSlidesLinkOrFileName,
    presentationChecks,
    setPresentationChecks,
    presentationOneLiner,
    setPresentationOneLiner,
    presentationManagerRequest,
    setPresentationManagerRequest,
    save,
  };
}
