import { useMemo, useState } from 'react';
import {
  type V39AiCallPlanResult,
  loadV39AiCallPlanResult,
} from './journey-v39-ai-call-plan-result-store';
import {
  type V39ComplianceCleanupResult,
  loadV39ComplianceCleanupResult,
  saveV39ComplianceCleanupResult,
} from './journey-v39-compliance-cleanup-result-store';

const V39_COMPLIANCE_CLEANUP_SMOKE_MARKERS = [
  'V39ComplianceCleanupLab',
  'V39AiCallPlanCleanupPanel',
  'AI Call Plan의 위험 표현을 안전한 실행 문장으로 바꾸기',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  'AI 실행계획 초안은 반드시 검토·수정해야 합니다',
  '위험 표현 → 안전 문장',
  '처방 유도 표현',
  '비교 우위 단정',
  '허가 외·미승인 표현',
  '팀원 실행 대화 기준',
  '팀원에게 부담을 전가하는 표현',
  '세대 특성으로 팀원을 단정하는 표현',
  '12단계 최종 실행 카드에 반영할 안전 문장 정리',
].join('|');
void V39_COMPLIANCE_CLEANUP_SMOKE_MARKERS;

const RISK_GUIDES = [
  '처방 유도 표현',
  '비교 우위 단정',
  '허가 외·미승인 표현',
  '실제 고객명·병원명·의료진명·처방 정보 포함',
  '과도한 약속 또는 압박 표현',
  '승인 자료 범위를 벗어난 설명',
  '팀원에게 부담을 전가하는 표현',
  '세대 특성으로 팀원을 단정하는 표현',
  '고객을 등급화하거나 공략 대상으로 표현',
  '팀장 판단 없이 AI 초안을 그대로 실행하는 표현',
];

const SAFE_REWRITE_EXAMPLES = [
  {
    risk: '이번 고객은 전환 가능성이 높으니 집중 공략한다.',
    safe: '해당 고객군은 질문과 자료 요청이 있어 추가 확인이 필요합니다. 승인자료 범위 안에서 다음 대화 주제와 확인 질문을 준비합니다.',
  },
  {
    risk: 'MZ 팀원은 책임감이 약하니 강하게 압박한다.',
    safe: '팀원의 현재 실행 준비도와 필요한 지원을 확인하고, 역할 범위와 중간 점검 기준을 함께 합의합니다.',
  },
  {
    risk: '경쟁 제품보다 우수하다는 점을 강조한다.',
    safe: '승인된 자료에서 확인 가능한 정보만 사용하고, 고객의 질문을 바탕으로 필요한 정보를 안내합니다.',
  },
];

function buildCleanupPrompt(result: V39AiCallPlanResult) {
  const savedItems = Object.values(result.items).filter((item) => item.callPlanDraft.trim());

  if (savedItems.length === 0) {
    return [
      '아직 10단계 AI Call Plan 결과가 저장되지 않았습니다.',
      '10단계에서 AI Call Plan 초안, 위험 메모, 11단계 점검 초점을 먼저 저장하세요.',
    ].join('\n');
  }

  return [
    '당신은 제약영업 컴플라이언스와 팀원 실행 대화 위험을 함께 점검하는 리뷰 파트너입니다.',
    '아래 문장은 교육용 가상 고객군 기준의 AI Call Plan 초안입니다.',
    '실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 수치, 개인정보를 추정하거나 추가하지 마세요.',
    'AI 실행계획 초안은 반드시 검토·수정해야 합니다. 그대로 실행 가능한 최종안처럼 보이게 쓰지 마세요.',
    '팀원을 세대 특성으로 단정하거나, 팀원에게 리스크를 전가하는 표현도 함께 점검해 주세요.',
    '',
    '점검 대상:',
    ...savedItems.flatMap((item, index) => [
      `${index + 1}. ${item.title}`,
      `- AI Call Plan 초안: ${item.callPlanDraft}`,
      `- 위험 메모: ${item.riskMemo || '아직 작성되지 않았습니다.'}`,
      `- 점검 초점: ${item.cleanupFocus || '아직 작성되지 않았습니다.'}`,
      '',
    ]),
    '요청:',
    '1. 제약영업 컴플라이언스 관점의 위험 표현 유형을 찾아 주세요.',
    '2. 팀원 실행 대화 관점에서 부담 전가, 세대 단정, 책임 회피처럼 보일 수 있는 표현을 찾아 주세요.',
    '3. 왜 위험한지 짧게 설명해 주세요.',
    '4. 승인 자료 범위, 질문 중심, 가상 고객군 기준, 팀원 실행 대화 기준의 안전한 대체 문장으로 바꿔 주세요.',
    '5. 팀장이 최종 확인해야 할 컴플라이언스와 사람관리 체크포인트를 정리해 주세요.',
  ].join('\n');
}

function buildDefaultComplianceCleanupResult(result: V39AiCallPlanResult, current: V39ComplianceCleanupResult): Partial<V39ComplianceCleanupResult> {
  const savedItems = Object.values(result.items).filter((item) => item.callPlanDraft.trim());
  const firstItem = savedItems[0];

  return {
    riskTypes: current.riskTypes || '처방 유도 표현, 비교 우위 단정, 허가 외·미승인 표현, 민감정보 포함, 고객을 등급화하거나 공략 대상으로 표현하는 문장, 팀원에게 부담을 전가하는 표현, 세대 특성 단정 표현을 확인합니다.',
    safeExpression: current.safeExpression || (firstItem
      ? `${firstItem.callPlanDraft}\n\n위 문장은 승인 자료 범위, 질문 중심, 가상 고객군 기준, 팀원 실행 대화 기준으로 다시 수정합니다. 고객을 평가하거나 공략 대상으로 표현하지 않고, 확인할 Data와 다음 질문 중심으로 바꿉니다.`
      : 'AI Call Plan 초안을 승인 자료 범위, 질문 중심, 가상 고객군 기준, 팀원 실행 대화 기준으로 안전하게 수정합니다.'),
    finalChecklist: current.finalChecklist || '실제 고객명·병원명·의료진명·제품명·매출·처방 수치가 제거되었는지 확인합니다. 처방 유도, 비교 우위 단정, 허가 외 표현이 없는지 확인합니다. 고객을 등급화하거나 공략 대상으로 표현하지 않았는지 확인합니다. 팀원을 세대 특성으로 단정하거나 실행 부담을 일방적으로 전가하는 문장이 없는지 확인합니다.',
    finalCardMemo: current.finalCardMemo || '최종 실행 카드에는 안전하게 수정한 문장, 팀장이 직접 확인한 컴플라이언스 체크포인트, 팀원 실행 대화 기준, 중간 점검 질문만 반영합니다.',
  };
}

function V39AiCallPlanCleanupPanel({ result, onRefresh }: { result: V39AiCallPlanResult; onRefresh: () => void }) {
  const savedItems = Object.values(result.items).filter((item) => item.callPlanDraft.trim());
  const [copied, setCopied] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(() => loadV39ComplianceCleanupResult());
  const cleanupPrompt = useMemo(() => buildCleanupPrompt(result), [result]);

  const copyCleanupPrompt = async () => {
    try {
      await navigator.clipboard.writeText(cleanupPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const updateCleanupResult = (patch: Partial<V39ComplianceCleanupResult>) => {
    setCleanupResult((current) => {
      const next = { ...current, ...patch };
      saveV39ComplianceCleanupResult(next);
      return next;
    });
  };

  const applyCleanupDraft = () => {
    updateCleanupResult(buildDefaultComplianceCleanupResult(result, cleanupResult));
  };

  return (
    <section className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Compliance Review</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">AI Call Plan의 위험 표현을 안전한 실행 문장으로 바꾸기</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            10단계에서 저장한 AI Call Plan 초안, 위험 메모, 점검 초점을 바탕으로 11단계 컴플라이언스 위험 표현 제거 실습을 진행합니다.
            이 단계는 AI 초안을 그대로 쓰기 위한 것이 아니라, 제약영업 안전선과 팀원 실행 대화 기준에 맞게 문장을 다시 점검하고 수정하는 과정입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            AI Call Plan 새로고침
          </button>
          <button type="button" className="rounded-full bg-rose-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-rose-800" onClick={copyCleanupPrompt}>
            {copied ? '점검 프롬프트 복사 완료' : '점검 프롬프트 복사'}
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700">
          <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
          <p className="mt-1">팀장은 AI 초안을 읽고, 제약영업 컴플라이언스 기준과 팀원 실행 대화 기준에 맞지 않는 표현을 직접 찾아 고칠 수 있습니다.</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
          <p className="font-black">AI를 쓰면 좋아지는 점</p>
          <p className="mt-1">위험 표현 후보를 빠르게 분류하고, 왜 위험한지와 안전한 대체 문장을 초안으로 받아 검토 시간을 줄일 수 있습니다.</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
        <p className="font-black">AI 실행계획 초안은 반드시 검토·수정해야 합니다</p>
        <p className="mt-1">AI가 만든 문장은 현장 맥락을 그럴듯하게 정리할 수 있지만, 제약영업 표현 안전선과 팀원 수용성을 놓칠 수 있습니다. 이 단계의 결과물은 “검토 완료된 안전 문장”입니다.</p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">AI Call Plan 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.updatedAt ? '정리 결과 있음' : '정리 결과 없음'}</p>
          {result.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{result.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">점검 대상 문장</p>
          <p className="mt-1 text-sm font-black text-slate-900">{savedItems.length}개</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">12단계 실행 카드 준비</p>
          <p className="mt-1 text-sm font-black text-slate-900">{cleanupResult.updatedAt ? '정리 결과 있음' : '정리 결과 없음'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-black text-amber-950">우선 점검할 위험 표현 유형</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {RISK_GUIDES.map((guide) => (
            <span key={guide} className="rounded-full border border-amber-200 bg-white px-3 py-2 text-xs font-black text-amber-900">{guide}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-black text-slate-950">위험 표현 → 안전 문장 예시</p>
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
          {SAFE_REWRITE_EXAMPLES.map((example) => (
            <article key={example.risk} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-bold leading-5 text-slate-700">
              <p className="font-black text-rose-700">위험 표현</p>
              <p className="mt-1">{example.risk}</p>
              <p className="mt-3 font-black text-emerald-700">안전 문장</p>
              <p className="mt-1">{example.safe}</p>
            </article>
          ))}
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          10단계에서 AI Call Plan 결과를 저장하면, 이곳에 11단계 컴플라이언스 점검 대상 문장이 표시됩니다.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 xl:grid-cols-2">
          {savedItems.map((item) => (
            <article key={item.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="font-black text-slate-950">{item.title}</p>
              <p className="mt-2 text-xs font-black text-rose-700">AI Call Plan 초안</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{item.callPlanDraft}</p>
              <p className="mt-3 text-xs font-black text-amber-700">위험 메모</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{item.riskMemo || '아직 작성되지 않았습니다.'}</p>
              <p className="mt-3 text-xs font-black text-emerald-700">11단계 점검 초점</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{item.cleanupFocus || '아직 작성되지 않았습니다.'}</p>
            </article>
          ))}
        </div>
      )}

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">복사해서 컴플라이언스 점검에 사용할 프롬프트</span>
        <textarea className="mt-3 min-h-72 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={cleanupPrompt} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Final Card Preparation</p>
            <h3 className="text-lg font-black text-slate-950">12단계 최종 실행 카드에 반영할 안전 문장 정리</h3>
            <p className="mt-1 text-xs font-bold leading-5 text-slate-600">
              안전하게 수정한 문장과 최종 체크포인트를 12단계 2주 콜플랜 카드에 반영하기 위한 요약으로 저장합니다.
            </p>
          </div>
          <button type="button" className="rounded-2xl border bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-800" onClick={applyCleanupDraft}>
            안전 문장 초안 가져오기
          </button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">위험 유형 요약</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={cleanupResult.riskTypes} onChange={(event) => updateCleanupResult({ riskTypes: event.target.value })} />
          </label>
          <label className="space-y-1">
            <span className="text-xs font-black text-slate-500">최종 체크리스트</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={cleanupResult.finalChecklist} onChange={(event) => updateCleanupResult({ finalChecklist: event.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">안전하게 수정한 문장</span>
            <textarea className="min-h-28 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={cleanupResult.safeExpression} onChange={(event) => updateCleanupResult({ safeExpression: event.target.value })} />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-black text-slate-500">최종 카드 메모</span>
            <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6" value={cleanupResult.finalCardMemo} onChange={(event) => updateCleanupResult({ finalCardMemo: event.target.value })} />
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        11단계에서도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        AI Call Plan 초안은 반드시 사람이 위험 표현과 실행 대화 리스크를 찾아 안전 문장으로 수정합니다.
      </div>
    </section>
  );
}

export function V39ComplianceCleanupLab() {
  const [result, setResult] = useState(() => loadV39AiCallPlanResult());

  const refreshAiCallPlanResult = () => {
    setResult(loadV39AiCallPlanResult());
  };

  return <V39AiCallPlanCleanupPanel result={result} onRefresh={refreshAiCallPlanResult} />;
}
