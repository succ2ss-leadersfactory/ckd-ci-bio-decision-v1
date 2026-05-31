import { useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type StakeholderMessageResponse = {
  selectedStrategy: string;
  strategySummary: string;
  seniorMessage: string;
  hqMessage: string;
  teamMessage: string;
  peerMessage: string;
  consistencyCheck: string;
  safetyRevision: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const STRATEGY_OPTIONS = [
  '2주간 A군 고객군에 집중하고 D군 접근 빈도는 낮춰 관계 리스크를 관리한다.',
  'CRM 기록 품질을 높여 후속조치와 팀 학습을 강화한다.',
  '신규 메시지는 공식 자료 범위 안에서 고객의 정보 니즈 확인 중심으로 적용한다.',
];

const STAKEHOLDERS = [
  { name: '상사', interest: '성과 방향, 리스크 관리, 우선순위의 타당성', focus: '짧고 명확한 의사결정 보고' },
  { name: '본사', interest: '실행 정합성, 현장 피드백, 지원 필요사항', focus: '현장 실행 장애와 필요한 지원 전달' },
  { name: '팀원', interest: '우선순위, 실행 가능성, 하지 않을 행동', focus: '무엇을 하고 무엇을 줄일지 명확화' },
  { name: '동료 팀장', interest: '협업, 자원 조율, 고객 접점 충돌 방지', focus: '중복과 충돌을 줄이는 협업 요청' },
];

const REVIEW_ITEMS = [
  '상사 메시지는 방향과 리스크를 짧게 담고 있는가?',
  '본사 메시지는 현장 피드백과 지원 요청을 담고 있는가?',
  '팀원 메시지는 실행 행동과 하지 않을 행동을 담고 있는가?',
  '동료 팀장 메시지는 협업 요청으로 들리는가?',
  '네 메시지의 핵심 방향이 서로 모순되지 않는가?',
  '민감정보나 단정적 표현을 제거했는가?',
];

const DEFAULT_RESPONSE: StakeholderMessageResponse = {
  selectedStrategy: STRATEGY_OPTIONS[0],
  strategySummary: '',
  seniorMessage: '',
  hqMessage: '',
  teamMessage: '',
  peerMessage: '',
  consistencyCheck: '',
  safetyRevision: '',
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

export function StakeholderMessageLab() {
  const [response, setResponse] = useStored<StakeholderMessageResponse>(V36_STORAGE_KEYS.stakeholderMessage, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<StakeholderMessageResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const outputText = `이해관계자 메시지 정렬\n\n[전략 요약]\n${response.strategySummary || response.selectedStrategy}\n\n[상사 메시지]\n${response.seniorMessage}\n\n[본사 메시지]\n${response.hqMessage}\n\n[팀원 메시지]\n${response.teamMessage}\n\n[동료 팀장 메시지]\n${response.peerMessage}\n\n[일관성 점검]\n${response.consistencyCheck}\n\n[안전 표현 수정]\n${response.safetyRevision}`;

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopyMessage('이해관계자 메시지를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 결과 영역을 직접 선택해 복사하세요.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-bold">이해관계자 메시지 안전선</p>
        <p className="mt-1">같은 전략도 대상에 따라 언어가 달라져야 합니다. 실제 고객·기관명, 내부 수치, 단정적 표현은 사용하지 않습니다.</p>
      </div>

      <SectionCard title="상황 제시: 이해관계자 메시지 Lab">
        <p className="text-sm leading-6 text-slate-700">하나의 실행전략을 상사, 본사, 팀원, 동료 팀장에게 각각 다르게 설명합니다. 목적은 설득이 아니라 방향 정렬과 실행 협조입니다.</p>
      </SectionCard>

      <SectionCard title="이해관계자별 관심사">
        <div className="grid gap-3 md:grid-cols-2">
          {STAKEHOLDERS.map((item) => (
            <article key={item.name} className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
              <h4 className="font-bold text-slate-900">{item.name}</h4>
              <p className="mt-2"><span className="font-semibold">관심사:</span> {item.interest}</p>
              <p className="mt-1"><span className="font-semibold">메시지 초점:</span> {item.focus}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="전략 선택 및 메시지 작성">
        <label className="block space-y-1">
          <FieldLabel>정렬할 전략</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedStrategy} onChange={(event) => update({ selectedStrategy: event.target.value })}>
            {STRATEGY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="block space-y-1"><FieldLabel>전략 요약</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.strategySummary} onChange={(event) => update({ strategySummary: event.target.value })} placeholder="우리 팀 상황에 맞게 한 문단으로 요약하세요." /></label>
        <label className="block space-y-1"><FieldLabel>상사 메시지</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.seniorMessage} onChange={(event) => update({ seniorMessage: event.target.value })} placeholder="방향, 근거, 리스크 관리 중심으로 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>본사 메시지</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.hqMessage} onChange={(event) => update({ hqMessage: event.target.value })} placeholder="현장 피드백과 필요한 지원 중심으로 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>팀원 메시지</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.teamMessage} onChange={(event) => update({ teamMessage: event.target.value })} placeholder="이번 2주 동안 무엇을 하고 무엇을 줄일지 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>동료 팀장 메시지</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.peerMessage} onChange={(event) => update({ peerMessage: event.target.value })} placeholder="협업과 자원 조율 요청 중심으로 작성하세요." /></label>
      </SectionCard>

      <SectionCard title="메시지 정렬 점검">
        <label className="block space-y-1"><FieldLabel>메시지 간 일관성 점검</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.consistencyCheck} onChange={(event) => update({ consistencyCheck: event.target.value })} placeholder="네 메시지가 같은 방향을 말하고 있는지 점검하세요." /></label>
        <label className="block space-y-1"><FieldLabel>안전 표현 수정</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.safetyRevision} onChange={(event) => update({ safetyRevision: event.target.value })} placeholder="민감정보나 단정적 표현을 어떻게 수정했는지 작성하세요." /></label>
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
      </SectionCard>

      <SectionCard title="최종 산출물 및 강사용 요약">
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyOutput}>메시지 결과 복사</button>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <div className="rounded-xl border bg-cyan-50 p-3 text-sm text-cyan-900"><p className="font-bold">강사용 토의 질문</p><p className="mt-1">같은 전략이 대상별로 어떻게 달라졌습니까?</p><p>팀원 메시지는 실제 행동을 바꾸는 수준으로 구체적입니까?</p><p>네 메시지 사이에 충돌하는 표현은 없습니까?</p></div>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.stakeholderMessage} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default StakeholderMessageLab;
