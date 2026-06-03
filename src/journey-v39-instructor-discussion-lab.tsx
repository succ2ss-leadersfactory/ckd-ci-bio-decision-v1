import { useState } from 'react';
import { V38InstructorDiscussionLab } from './journey-v38-instructor-discussion-lab';
import {
  type V39FinalCallPlanResult,
  loadV39FinalCallPlanResult,
} from './journey-v39-final-call-plan-result-store';

function buildInstructorDiscussionGuide(result: V39FinalCallPlanResult) {
  if (!result.updatedAt) {
    return [
      '아직 11단계 최종 실행 카드 요약이 저장되지 않았습니다.',
      '11단계에서 집중 고객군, 팀원 역할, 2주 실행 우선순위, 컴플라이언스 포인트를 먼저 저장하세요.',
    ].join('\n');
  }

  return [
    '[강사용 토의 연결 요약]',
    '',
    '[집중 고객군]',
    result.focusCustomers || '아직 작성되지 않았습니다.',
    '',
    '[팀원별 역할]',
    result.memberRoles || '아직 작성되지 않았습니다.',
    '',
    '[2주 실행 우선순위]',
    result.twoWeekAction || '아직 작성되지 않았습니다.',
    '',
    '[컴플라이언스 포인트]',
    result.compliancePoint || '아직 작성되지 않았습니다.',
    '',
    '[팀원에게 말할 첫 문장]',
    result.firstMessage || '아직 작성되지 않았습니다.',
    '',
    '[강사용 토의 메모]',
    result.discussionMemo || '아직 작성되지 않았습니다.',
  ].join('\n');
}

function V39FinalCardInstructorBridgePanel({ result, onRefresh }: { result: V39FinalCallPlanResult; onRefresh: () => void }) {
  const [copied, setCopied] = useState(false);
  const guide = buildInstructorDiscussionGuide(result);

  const copyGuide = async () => {
    try {
      await navigator.clipboard.writeText(guide);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Instructor Discussion Bridge</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">11단계 최종 실행 카드를 강사용 토의 화면에 연결</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            11단계에서 저장한 집중 고객군, 팀원 역할, 2주 실행 우선순위, 컴플라이언스 포인트, 첫 실행 문장을 강사용 디브리핑 전에 확인합니다.
            이 요약은 평가 자료가 아니라, 참여자의 판단 근거와 현업 적용 포인트를 토의하기 위한 참고 자료입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            11단계 최종 카드 새로고침
          </button>
          <button type="button" className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-cyan-800" onClick={copyGuide}>
            {copied ? '토의 요약 복사 완료' : '토의 요약 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.updatedAt ? '최종 카드 요약 있음' : '최종 카드 요약 없음'}</p>
          {result.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{result.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">실행 우선순위</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.twoWeekAction.trim() ? '저장됨' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">컴플라이언스 포인트</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.compliancePoint.trim() ? '저장됨' : '미작성'}</p>
        </div>
      </div>

      {result.updatedAt ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <article className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-cyan-700">집중 고객군</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.focusCustomers || '아직 작성되지 않았습니다.'}</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-cyan-700">팀원별 역할</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.memberRoles || '아직 작성되지 않았습니다.'}</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-cyan-700">2주 실행 우선순위</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.twoWeekAction || '아직 작성되지 않았습니다.'}</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 shadow-sm">
            <p className="text-xs font-black text-amber-700">컴플라이언스 포인트</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.compliancePoint || '아직 작성되지 않았습니다.'}</p>
          </article>
          <article className="rounded-2xl border bg-white p-4 shadow-sm md:col-span-2">
            <p className="text-xs font-black text-slate-500">팀원에게 말할 첫 문장</p>
            <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-slate-800">{result.firstMessage || '아직 작성되지 않았습니다.'}</p>
          </article>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          11단계에서 12단계 연결용 최종 실행 카드 요약을 저장하면, 이곳에 강사용 토의 참고 자료가 표시됩니다.
        </div>
      )}

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">강사용 토의 연결 요약</span>
        <textarea className="mt-3 min-h-64 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={guide} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        이 요약은 참여자 평가용 점수 자료가 아닙니다. 강사는 판단 근거, 포기한 선택지, 안전 문장 수정 이유, 내일 실행 행동을 중심으로 토의합니다.
      </div>
    </section>
  );
}

export function V39InstructorDiscussionLab() {
  const [result, setResult] = useState(() => loadV39FinalCallPlanResult());

  const refreshFinalCallPlanResult = () => {
    setResult(loadV39FinalCallPlanResult());
  };

  return (
    <section className="space-y-4">
      <V39FinalCardInstructorBridgePanel result={result} onRefresh={refreshFinalCallPlanResult} />
      <V38InstructorDiscussionLab />
    </section>
  );
}
