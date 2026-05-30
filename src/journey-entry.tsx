import React from 'react';
import { CardShell, Help } from './journey-components';

export type ParticipantInfo = {
  participantId: string;
  sessionCode: string;
  name: string;
  teamName: string;
};

export type EntryScreenProps = {
  participant: ParticipantInfo;
  setParticipant: (participant: ParticipantInfo) => void;
  save: (key: string, payload: Record<string, any>) => void;
};

const ENTRY_FIELDS: Array<[keyof ParticipantInfo, string]> = [
  ['sessionCode', '세션코드'],
  ['name', '이름'],
  ['teamName', '팀명'],
];

export function EntryScreen({ participant, setParticipant, save }: EntryScreenProps) {
  return (
    <CardShell>
      <h2 className="text-xl font-bold">입장</h2>
      <Help title="조별 운영 안내">
        최종 산출물은 NotebookLM Studio에서 생성하는 전략회의 보고서와 슬라이드 자료입니다. 웹앱은 소스 준비, Studio 생성 가이드, 산출물 기록을 돕습니다.
      </Help>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {ENTRY_FIELDS.map(([key, label]) => (
          <label key={key}>
            <b>{label}</b>
            <input
              className="mt-1 w-full rounded-xl border p-3"
              value={participant[key] || ''}
              onChange={event => setParticipant({ ...participant, [key]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <button className="mt-3 rounded-xl bg-cyan-700 px-4 py-2 text-white" onClick={() => save('J01-entry', { consentChecked: true })}>
        확인 저장
      </button>
    </CardShell>
  );
}
