import { useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type WrapUpResponse = {
  keyInsight: string;
  firstSevenDayAction: string;
  secondSevenDayAction: string;
  thirdSevenDayAction: string;
  thirtyDayCheckCriteria: string;
  supportRequest: string;
  riskToWatch: string;
  managerDeclaration: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const REVIEW_ITEMS = [
  '7일 안에 바로 시작할 행동이 있는가?',
  '팀원 또는 고객 접점 행동으로 표현되어 있는가?',
  '30일 후 확인할 기준이 관찰 가능하게 쓰였는가?',
  '하지 않을 행동 또는 주의할 리스크가 포함되어 있는가?',
  '상사·본사·팀원 중 지원 요청 대상이 명확한가?',
  '팀장 실행 선언이 추상적 다짐이 아니라 행동 언어인가?',
];

const DEFAULT_RESPONSE: WrapUpResponse = {
  keyInsight: '',
  firstSevenDayAction: '',
  secondSevenDayAction: '',
  thirdSevenDayAction: '',
  thirtyDayCheckCriteria: '',
  supportRequest: '',
  riskToWatch: '',
  managerDeclaration: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

export function WrapUpLab() {
  const [response, setResponse] = useStored<WrapUpResponse>(V36_STORAGE_KEYS.wrapUp, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<WrapUpResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const outputText = `v36 실행계획 Wrap-up\n\n[오늘의 핵심 인사이트]\n${response.keyInsight}\n\n[7일 실행행동 1]\n${response.firstSevenDayAction}\n\n[7일 실행행동 2]\n${response.secondSevenDayAction}\n\n[7일 실행행동 3]\n${response.thirdSevenDayAction}\n\n[30일 점검 기준]\n${response.thirtyDayCheckCriteria}\n\n[지원 요청]\n${response.supportRequest}\n\n[주의할 리스크]\n${response.riskToWatch}\n\n[팀장 실행 선언]\n${response.managerDeclaration}`;

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopyMessage('Wrap-up 실행계획을 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 결과 영역을 직접 선택해 복사하세요.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">Wrap-up 목표</p>
        <p className="mt-1">오늘의 AI 활용 경험을 현업 실행으로 연결합니다. 좋은 계획은 멋진 문장이 아니라 7일 안에 시작할 행동과 30일 후 확인할 기준을 남깁니다.</p>
      </div>

      <SectionCard title="오늘의 핵심 인사이트">
        <textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.keyInsight} onChange={(event) => update({ keyInsight: event.target.value })} placeholder="오늘 실습을 통해 영업팀장으로서 AI를 어떻게 활용해야 한다고 느꼈습니까?" />
      </SectionCard>

      <SectionCard title="7일 실행계획">
        <label className="block space-y-1"><FieldLabel>7일 실행행동 1</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.firstSevenDayAction} onChange={(event) => update({ firstSevenDayAction: event.target.value })} placeholder="예: 다음 팀 회의에서 고객군 A~D 우선순위와 하지 않을 행동을 10분 공유한다." /></label>
        <label className="block space-y-1"><FieldLabel>7일 실행행동 2</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.secondSevenDayAction} onChange={(event) => update({ secondSevenDayAction: event.target.value })} placeholder="예: 팀원 1명을 정해 1on1에서 2주 행동 실험을 합의한다." /></label>
        <label className="block space-y-1"><FieldLabel>7일 실행행동 3</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.thirdSevenDayAction} onChange={(event) => update({ thirdSevenDayAction: event.target.value })} placeholder="예: 본사 요청 하나를 팀 실행 언어로 번역해 공유한다." /></label>
      </SectionCard>

      <SectionCard title="30일 점검 기준과 지원 요청">
        <label className="block space-y-1"><FieldLabel>30일 점검 기준</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.thirtyDayCheckCriteria} onChange={(event) => update({ thirtyDayCheckCriteria: event.target.value })} placeholder="30일 후 어떤 행동, 기록, 대화, 실행 결과를 보면 변화가 시작됐다고 판단할 수 있습니까?" /></label>
        <label className="block space-y-1"><FieldLabel>지원 요청</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.supportRequest} onChange={(event) => update({ supportRequest: event.target.value })} placeholder="상사, 본사, 동료 팀장, 팀원에게 요청할 지원을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>주의할 리스크</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.riskToWatch} onChange={(event) => update({ riskToWatch: event.target.value })} placeholder="실행 과정에서 놓치기 쉬운 리스크나 하지 않을 행동을 작성하세요." /></label>
      </SectionCard>

      <SectionCard title="팀장 실행 선언">
        <textarea className="min-h-28 w-full rounded-xl border px-3 py-2" value={response.managerDeclaration} onChange={(event) => update({ managerDeclaration: event.target.value })} placeholder="나는 앞으로 AI를 답변 생성기가 아니라 판단을 정리하고 실행을 구체화하는 도구로 사용하겠습니다. 이를 위해 나는 ..." />
      </SectionCard>

      <SectionCard title="실행계획 점검">
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
      </SectionCard>

      <SectionCard title="최종 결과 복사">
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyOutput}>Wrap-up 결과 복사</button>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <div className="rounded-xl border bg-cyan-50 p-3 text-sm text-cyan-900"><p className="font-bold">강사용 토의 질문</p><p className="mt-1">가장 먼저 실행할 행동은 무엇입니까?</p><p>30일 후 무엇을 확인하면 실행이 실제로 바뀌었다고 볼 수 있습니까?</p><p>AI 활용에서 계속 지켜야 할 안전선은 무엇입니까?</p></div>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.wrapUp} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default WrapUpLab;
