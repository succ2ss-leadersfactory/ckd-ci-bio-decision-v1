import { useEffect, useMemo, useRef, type ReactNode } from 'react';

type StorageKeyPair = {
  sourceKey: string;
  scopedKey: string;
};

const V41_LAB_STORAGE_SCOPE_MARKERS = [
  'V41LabStorageScope',
  'v41 inherited lab storage isolation',
  'ckd.v40-vnext.promptPracticeReview.v2 -> ckd.v41.promptPracticeReview.v2',
  'ckd.v40-vnext.pharmaStrategyResearch.v1 -> ckd.v41.pharmaStrategyResearch.v1',
  'ckd.v40-vnext.performanceCascade.v1 -> ckd.v41.performanceCascade.v1',
  'ckd.v40-vnext.taskManagement.v10 -> ckd.v41.taskManagement.v10',
  'ckd.v40-vnext.peopleManagement.v2 -> ckd.v41.peopleManagement.v2',
  'ckd.v40-vnext.finalExecutionMemo.v1 -> ckd.v41.finalExecutionMemo.v1',
].join('|');
void V41_LAB_STORAGE_SCOPE_MARKERS;

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readStorage(key: string) {
  if (!canUseLocalStorage()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string | null) {
  if (!canUseLocalStorage()) return;
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Ignore localStorage failures so v41 preview remains usable in restricted browsers.
  }
}

function cloneScopedToSource(pairs: StorageKeyPair[]) {
  for (const pair of pairs) {
    writeStorage(pair.sourceKey, readStorage(pair.scopedKey));
  }
}

function cloneSourceToScoped(pairs: StorageKeyPair[]) {
  for (const pair of pairs) {
    const value = readStorage(pair.sourceKey);
    if (value !== null) writeStorage(pair.scopedKey, value);
  }
}

function restoreSource(snapshot: Map<string, string | null>) {
  for (const [key, value] of snapshot.entries()) {
    writeStorage(key, value);
  }
}

export const V41_STORAGE_SCOPE_KEYS = {
  promptPractice: { sourceKey: 'ckd.v40-vnext.promptPracticeReview.v2', scopedKey: 'ckd.v41.promptPracticeReview.v2' },
  pharmaResearch: { sourceKey: 'ckd.v40-vnext.pharmaStrategyResearch.v1', scopedKey: 'ckd.v41.pharmaStrategyResearch.v1' },
  performanceCascade: { sourceKey: 'ckd.v40-vnext.performanceCascade.v1', scopedKey: 'ckd.v41.performanceCascade.v1' },
  taskManagement: { sourceKey: 'ckd.v40-vnext.taskManagement.v10', scopedKey: 'ckd.v41.taskManagement.v10' },
  peopleManagement: { sourceKey: 'ckd.v40-vnext.peopleManagement.v2', scopedKey: 'ckd.v41.peopleManagement.v2' },
  finalExecutionMemo: { sourceKey: 'ckd.v40-vnext.finalExecutionMemo.v1', scopedKey: 'ckd.v41.finalExecutionMemo.v1' },
} as const;

export function V41LabStorageScope({ pairs, children }: { pairs: StorageKeyPair[]; children: ReactNode }) {
  const stablePairs = useMemo(() => pairs, [pairs]);
  const snapshotRef = useRef<Map<string, string | null> | null>(null);

  if (canUseLocalStorage() && snapshotRef.current === null) {
    const snapshot = new Map<string, string | null>();
    for (const pair of stablePairs) snapshot.set(pair.sourceKey, readStorage(pair.sourceKey));
    snapshotRef.current = snapshot;
    cloneScopedToSource(stablePairs);
  }

  useEffect(() => {
    cloneScopedToSource(stablePairs);
    const timer = window.setInterval(() => cloneSourceToScoped(stablePairs), 500);

    return () => {
      window.clearInterval(timer);
      cloneSourceToScoped(stablePairs);
      if (snapshotRef.current) restoreSource(snapshotRef.current);
    };
  }, [stablePairs]);

  return <>{children}</>;
}
