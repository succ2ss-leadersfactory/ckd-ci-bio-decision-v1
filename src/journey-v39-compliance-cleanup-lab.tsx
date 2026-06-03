import { useMemo, useState } from 'react';
import { V38ComplianceCleanupLab } from './journey-v38-compliance-cleanup-lab';
import {
  type V39AiCallPlanResult,
  loadV39AiCallPlanResult,
} from './journey-v39-ai-call-plan-result-store';

const RISK_GUIDES = [
  '처방 유도 표현',
  '비교 우위 단정',
  '허가 외·미승인 표현',
  '실제 고객명·병원명·의료진명·처방 정보 포함',
  '과도한 약속 또는 압박 표현',
  '승인 자료 범위를 벗어난 설명',
];

function buildCleanupPrompt(result: V39AiCallPlanResult) {
  const savedItems = Object.values(result.items).filter((item) => item.callPlanDraft.trim());

  if (savedItems.length === 0) {
    return [
      '아직 9단계 AI Call Plan 결과가 저장되지 않았습니다.',
      '9단계에서 AI Call Plan 초안, 위험 메모, 10단계 점검 초점을 먼저 저장하세요.',
    ].join('\n');
  }

  return [
    '당신은 제약영업 컴플라이언스 위험 표현을 점검하는 리뷰 파트너입니다.',
    '아래 문장은 교육용 가상 고객군 기준의 AI Call Plan 초안입니다.',
    '실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 수치, 개인정보를 추정하거나 추가하지 마세요.',
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
    '1. 위험 표현 유형을 찾아 주세요.',
    '2. 왜 위험한지 짧게 설명해 주세요.',
    '3. 승인 자료 범위, 질문 중심, 가상 고객군 기준의 안전한 대체 문장으로 바꿔 주세요.',
    '4. 팀장이 최종 확인해야 할 컴플라이언스 체크포인트를 정리해 주세요.',
  ].join('\n');
}

function V39AiCallPlanCleanupBridgePanel({ result, onRefresh }: { result: V39AiCallPlanResult; onRefresh: () => void }) {
  const savedItems = Object.values(result.items).filter((item) => item.callPlanDraft.trim());
  const [copied, setCopied] = useState(false);
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

  return (
    <section className="rounded-3xl border border-rose-100 bg-rose-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-rose-700">Call Plan Cleanup Bridge</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">9단계 AI Call Plan 결과를 컴플라이언스 정리에 연결</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            9단계에서 저장한 AI Call Plan 초안, 위험 메모, 점검 초점을 10단계 컴플라이언스 위험 표현 제거 실습 전에 다시 확인합니다.
            이 연결은 AI 초안을 그대로 쓰기 위한 것이 아니라, 위험 표현을 찾아 안전 문장으로 바꾸기 위한 점검 자료입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            9단계 결과 새로고침
          </button>
          <button type="button" className="rounded-full bg-rose-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-rose-800" onClick={copyCleanupPrompt}>
            {copied ? '점검 프롬프트 복사 완료' : '점검 프롬프트 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.updatedAt ? '저장 결과 있음' : '저장 결과 없음'}</p>
          {result.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{result.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">점검 대상 문장</p>
          <p className="mt-1 text-sm font-black text-slate-900">{savedItems.length}개</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">다음 단계</p>
          <p className="mt-1 text-sm font-black text-slate-900">위험 표현 제거와 안전 문장 수정</p>
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

      {savedItems.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          9단계에서 10단계 연결용 AI Call Plan 결과를 저장하면, 이곳에 컴플라이언스 점검 대상 문장이 표시됩니다.
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
              <p className="mt-3 text-xs font-black text-emerald-700">10단계 점검 초점</p>
              <p className="mt-1 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-700">{item.cleanupFocus || '아직 작성되지 않았습니다.'}</p>
            </article>
          ))}
        </div>
      )}

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">복사해서 컴플라이언스 점검에 사용할 프롬프트</span>
        <textarea className="mt-3 min-h-72 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={cleanupPrompt} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        10단계에서도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        AI Call Plan 초안은 반드시 사람이 위험 표현을 찾아 안전 문장으로 수정합니다.
      </div>
    </section>
  );
}

export function V39ComplianceCleanupLab() {
  const [result, setResult] = useState(() => loadV39AiCallPlanResult());

  const refreshAiCallPlanResult = () => {
    setResult(loadV39AiCallPlanResult());
  };

  return (
    <section className="space-y-4">
      <V39AiCallPlanCleanupBridgePanel result={result} onRefresh={refreshAiCallPlanResult} />
      <V38ComplianceCleanupLab />
    </section>
  );
}
