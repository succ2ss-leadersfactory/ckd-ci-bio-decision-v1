import { useState, type SetStateAction } from 'react';

export type JsonRecord = Record<string, any>;

export const STORAGE_KEYS = {
  step: 'c1bio_flow_step',
  participant: 'c1bio_flow_participant',
  state: 'c1bio_flow_state',
};

export function getJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export function setJson<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => getJson(key, fallback));

  const setBoth = (next: SetStateAction<T>) => {
    setValue(currentValue => {
      const nextValue = typeof next === 'function'
        ? (next as (current: T) => T)(currentValue)
        : next;

      setJson(key, nextValue);
      return nextValue;
    });
  };

  return [value, setBoth] as const;
}

export async function callGoogleScript(webAppUrl: string, action: string, payload: JsonRecord = {}) {
  if (!webAppUrl) throw new Error('Google Script Web App URL is not configured.');

  const response = await fetch(webAppUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
  });

  const json = await response.json();
  if (!json.ok) throw new Error(json.error || 'Google Script request failed.');

  return json.data;
}

export function buildResponsePayload({
  responseId,
  participant,
  step,
  screenName,
  activityId,
  activityName,
  outputData,
  promptText = '',
  aiAnswerText = '',
}: {
  responseId: string;
  participant: JsonRecord;
  step: number;
  screenName: string;
  activityId: string;
  activityName: string;
  outputData: JsonRecord;
  promptText?: string;
  aiAnswerText?: string;
}) {
  const now = new Date().toISOString();

  return {
    responseId,
    participantId: participant.participantId,
    sessionCode: participant.sessionCode,
    teamName: participant.teamName,
    screenId: 'J' + String(step + 1).padStart(2, '0'),
    activityId,
    activityName: activityName || screenName,
    outputData,
    promptText,
    aiAnswerText,
    finalText: JSON.stringify(outputData),
    isCompleted: true,
    createdAt: now,
    updatedAt: now,
  };
}
