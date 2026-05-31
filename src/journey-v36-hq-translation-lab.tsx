import { useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type HqBrief = {
  id: string;
  title: string;
  hqLanguage: string;
  intent: string;
  fieldRisk: string;
  caution: string;
};

type HqTranslationResponse = {
  selectedBriefId: string;
  hqIntent: string;
  possibleMisunderstanding: string;
  teamMessage: string;
  customerContactAction: string;
  actionsToAvoid: string;
  feedbackToHq: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const HQ_BRIEFS: HqBrief[] = [
  {
    id: 'brief-message',
    title: '신규 메시지 방향 전달',
    hqLanguage: '전략 고객군에 신규 핵심 메시지를 빠르게 확산하고 현장 반응을 수집해 주십시오.',
    intent: '현장 접점에서 고객 반응 신호를 확인하고 메시지 적용 가능성을 검증하려는 요청입니다.',
    fieldRisk: '팀원이 “무조건 새 메시지를 밀어야 한다”로 받아들이면 고객 압박이나 단정 표현이 나올 수 있습니다.',
    caution: '공식 자료 범위 내 정보 제공, 고객 반응 확인, 무리한 설득 금지',
  },
  {
    id: 'brief-crm',
    title: 'CRM 기록 품질 개선 요청',
    hqLanguage: '콜 이후 CRM 기록의 완결성과 적시성을 높여 실행 데이터 기반 관리를 강화해 주십시오.',
    intent: '개별 MR의 머릿속 정보가 팀과 본사의 학습 데이터로 남도록 하려는 요청입니다.',
    fieldRisk: '팀원이 감시나 행정 부담으로 받아들이면 기록 품질보다 형식 입력만 늘어날 수 있습니다.',
    caution: '감시가 아니라 고객 반응 학습과 후속조치 품질 개선으로 번역',
  },
  {
    id: 'brief-focus',
    title: '전략 고객군 집중 실행 요청',
    hqLanguage: '2주간 전략 고객군 중심으로 활동 우선순위를 재정렬하고 실행 결과를 공유해 주십시오.',
    intent: '모든 고객을 동일하게 방문하기보다 우선순위와 포기 기준을 명확히 하려는 요청입니다.',
    fieldRisk: '후순위 고객군을 방치하거나 단기성과 고객군만 무리하게 압박할 위험이 있습니다.',
    caution: '집중과 제외의 기준, 관계 리스크 관리, 하지 않을 행동을 함께 제시',
  },
];

const REVIEW_ITEMS = [
  '본사의 의도를 현장 언어로 바꾸었는가?',
  '팀원이 오해할 수 있는 표현을 짚었는가?',
  '고객 접점 행동이 구체적인가?',
  '하지 않을 행동이 포함되어 있는가?',
  '실제 고객명·병원명·제품명·내부 수치가 없는가?',
  '고객 압박·효과 단정·경쟁사 비방 표현이 없는가?',
  '본사에 되돌려줄 현장 피드백이 포함되어 있는가?',
];

const DEFAULT_RESPONSE: HqTranslationResponse = {
  selectedBriefId: HQ_BRIEFS[0].id,
  hqIntent: '',
  possibleMisunderstanding: '',
  teamMessage: '',
  customerContactAction: '',
  actionsToAvoid: '',
  feedbackToHq: '',
  reviewChecks: {},
  savedAt: '',
};

function getBrief(id: string) {
  return HQ_BRIEFS.find((brief) => brief.id === id) ?? HQ_BRIEFS[0];
}

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

export function HqTranslationLab() {
  const [response, setResponse] = useStored<HqTranslationResponse>(V36_STORAGE_KEYS.hqTranslation, DEFAULT_RESPONSE);
  const [copyMessage, setCopyMessage] = useState('');
  const brief = getBrief(response.selectedBriefId);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<HqTranslationResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const outputText = `본사 요청 현장 번역\n\n[선택 Brief]\n${brief.title}\n\n[본사의 의도]\n${response.hqIntent}\n\n[현장에서 오해될 수 있는 지점]\n${response.possibleMisunderstanding}\n\n[팀원에게 전달할 문장]\n${response.teamMessage}\n\n[고객 접점 실행 행동]\n${response.customerContactAction}\n\n[하지 않을 행동]\n${response.actionsToAvoid}\n\n[본사에 다시 피드백할 내용]\n${response.feedbackToHq}`;

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopyMessage('현장 번역 결과를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 결과 영역을 직접 선택해 복사하세요.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-bold">본사 요청 번역 안전선</p>
        <p className="mt-1">본사 요청을 고객 압박, 효과 단정, 경쟁사 비방, 내부 전략 노출로 번역하지 않습니다. 팀원이 바로 실행할 수 있는 행동 언어로 바꿉니다.</p>
      </div>

      <SectionCard title="상황 제시: 본사 요청 현장 번역 Lab">
        <p className="text-sm leading-6 text-slate-700">본사 Brief는 종종 전략 언어로 내려옵니다. 팀장의 역할은 그 문장을 그대로 전달하는 것이 아니라, 팀원이 고객 접점에서 안전하게 실행할 수 있는 말과 행동으로 바꾸는 것입니다.</p>
      </SectionCard>

      <SectionCard title="본사 Brief 선택">
        <label className="block space-y-1">
          <FieldLabel>Brief 선택</FieldLabel>
          <select className="w-full rounded-xl border px-3 py-2" value={response.selectedBriefId} onChange={(event) => update({ selectedBriefId: event.target.value })}>
            {HQ_BRIEFS.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
          </select>
        </label>
        <article className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
          <p className="font-bold text-slate-900">본사 원문</p>
          <p className="mt-1">{brief.hqLanguage}</p>
          <dl className="mt-3 space-y-2">
            <div><dt className="font-semibold">의도</dt><dd>{brief.intent}</dd></div>
            <div><dt className="font-semibold">현장 리스크</dt><dd>{brief.fieldRisk}</dd></div>
            <div><dt className="font-semibold">주의점</dt><dd>{brief.caution}</dd></div>
          </dl>
        </article>
      </SectionCard>

      <SectionCard title="현장 번역 작성">
        <label className="block space-y-1"><FieldLabel>본사의 의도 해석</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.hqIntent} onChange={(event) => update({ hqIntent: event.target.value })} placeholder="본사가 실제로 확인하려는 것은 무엇입니까?" /></label>
        <label className="block space-y-1"><FieldLabel>현장에서 오해될 수 있는 표현</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.possibleMisunderstanding} onChange={(event) => update({ possibleMisunderstanding: event.target.value })} placeholder="팀원이 잘못 받아들이면 어떤 위험 행동으로 이어질 수 있습니까?" /></label>
        <label className="block space-y-1"><FieldLabel>팀원에게 전달할 문장</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.teamMessage} onChange={(event) => update({ teamMessage: event.target.value })} placeholder="팀 회의에서 바로 말할 수 있는 문장으로 바꿔 쓰세요." /></label>
        <label className="block space-y-1"><FieldLabel>고객 접점 실행 행동</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.customerContactAction} onChange={(event) => update({ customerContactAction: event.target.value })} placeholder="콜 전, 콜 중, 콜 후 행동으로 구체화하세요." /></label>
        <label className="block space-y-1"><FieldLabel>하지 않을 행동</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.actionsToAvoid} onChange={(event) => update({ actionsToAvoid: event.target.value })} placeholder="고객 압박, 효과 단정, 내부 전략 노출 등 하지 않을 행동을 작성하세요." /></label>
        <label className="block space-y-1"><FieldLabel>본사에 다시 피드백할 내용</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.feedbackToHq} onChange={(event) => update({ feedbackToHq: event.target.value })} placeholder="현장에서 실행하며 확인해야 할 장애요인이나 지원 요청을 작성하세요." /></label>
      </SectionCard>

      <SectionCard title="번역 품질 점검">
        <div className="grid gap-2 md:grid-cols-2">
          {REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
      </SectionCard>

      <SectionCard title="최종 산출물 및 강사용 요약">
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyOutput}>번역 결과 복사</button>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <div className="rounded-xl border bg-cyan-50 p-3 text-sm text-cyan-900"><p className="font-bold">강사용 토의 질문</p><p className="mt-1">이 Brief가 현장에서 가장 쉽게 오해될 지점은 무엇입니까?</p><p>팀원에게 전달할 문장이 실제 행동을 바꾸는 수준으로 구체적입니까?</p><p>본사에 되돌려줄 피드백이 실행 장애를 설명하고 있습니까?</p></div>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.hqTranslation} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default HqTranslationLab;
