import { useState, type SetStateAction } from 'react';

export type JsonRecord = Record<string, any>;

export const STORAGE_KEYS = {
  step: 'c1bio_flow_step',
  participant: 'c1bio_flow_participant',
  state: 'c1bio_flow_state',
};

function getLocalStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getJson<T>(key: string, fallback: T): T {
  const storage = getLocalStorage();
  if (!storage) return fallback;
  try {
    return JSON.parse(storage.getItem(key) || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export function setJson<T>(key: string, value: T) {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota, private-mode, or JSON serialization errors should not break the learning flow.
  }
}

export function removeStoredPrefix(prefix: string) {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    const keysToRemove = Array.from({ length: storage.length }, (_, index) => storage.key(index))
      .filter((key): key is string => Boolean(key && key.startsWith(prefix)));
    keysToRemove.forEach((key) => storage.removeItem(key));
  } catch {
    // Ignore storage access errors so reset buttons never break the UI.
  }
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
