import { useCallback } from 'react';
import { EntryScreen, type ParticipantInfo } from './journey-entry';
import { JourneyShell, type JourneyStep } from './journey-shell';
import { getJson, setJson, useStored, type JsonRecord } from './journey-storage';

const V35_STORAGE_KEYS = {
  step: 'c1bio_v35_preview_step',
  participant: 'c1bio_v35_preview_participant',
  state: 'c1bio_v35_preview_state',
};

const V35_APP_STEPS: JourneyStep[] = [
  {
    id: 'entry',
    title: '입장',
    description: '참여자 정보와 세션 정보를 localStorage에 저장하는 v35 독립 실행 준비 단계입니다.',
  },
];

const DEFAULT_PARTICIPANT: ParticipantInfo = {
  participantId: `v35-${Date.now()}`,
  sessionCode: '',
  name: '',
  teamName: '',
};

function clampStep(step: number) {
  return Math.min(Math.max(step, 0), Math.max(V35_APP_STEPS.length - 1, 0));
}

export function FullFlowJourneyV35App() {
  const [step, setStep] = useStored<number>(V35_STORAGE_KEYS.step, 0);
  const [participant, setParticipant] = useStored<ParticipantInfo>(V35_STORAGE_KEYS.participant, DEFAULT_PARTICIPANT);

  const safeStep = clampStep(step);

  const save = useCallback((key: string, payload: JsonRecord) => {
    const currentState = getJson<JsonRecord>(V35_STORAGE_KEYS.state, {});

    setJson(V35_STORAGE_KEYS.state, {
      ...currentState,
      [key]: payload,
      v35AppLastSavedAt: new Date().toISOString(),
    });
  }, []);

  return (
    <JourneyShell
      title="종근당/C1바이오 영업팀장 AI 리더십 Lab Journey v35"
      subtitle="v34 운영 화면에 연결하지 않은 v35 독립 실행 준비용 최소 앱입니다."
      steps={V35_APP_STEPS}
      currentStep={safeStep}
      onPrev={() => setStep(clampStep(safeStep - 1))}
      onNext={() => setStep(clampStep(safeStep + 1))}
    >
      <EntryScreen participant={participant} setParticipant={setParticipant} save={save} />
    </JourneyShell>
  );
}

export default FullFlowJourneyV35App;
