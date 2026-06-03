import { useState } from 'react';
import {
  type V39FinalCallPlanResult,
  loadV39FinalCallPlanResult,
} from './journey-v39-final-call-plan-result-store';

function buildInstructorDiscussionGuide(result: V39FinalCallPlanResult) {
  if (!result.updatedAt) {
    return [
      '아직 12단계 최종 실행 카드가 저장되지 않았습니다.',
      '12단계에서 집중 고객군, 팀원 역할, 2주 실행 우선순위, 컴플라이언스 포인트, 팀원에게 말할 첫 문장을 먼저 저장하세요.',
    ].join('\n');
  }

  return [
    '[13단계 강사용 토의 연결 요약]',
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
    '',
    '[강사용 핵심 질문]',
    '1. 이 참여자는 왜 이 고객군을 우선 실행 대상으로 보았는가?',
    '2. 팀원 역할 배정에서 강점, 부담, 성장 기회를 어떻게 균형 있게 고려했는가?',
    '3. 팀원에게 말할 첫 문장은 대화 목적에 맞게 설계되었는가?',
    '4. AI 초안에서 어떤 표현을 수정했고, 그 이유는 무엇인가?',
    '5. 내일 현업에서 바로 실행할 첫 행동은 무엇인가?',
  ].join('\n');
}

function buildDiscussionQuestions(result: V39FinalCallPlanResult) {
  return [
    {
      title: '고객 실행 판단',
      body: result.focusCustomers || '집중 고객군 요약을 바탕으로 기회 신호, 부족한 정보, 2주 실행 가능성을 토의합니다.',
    },
    {
      title: '팀원 역할 배정',
      body: result.memberRoles || '팀원별 역할이 강점, 부담, 성장 기회, 리스크 안전선을 함께 반영했는지 확인합니다.',
    },
    {
      title: '실행 대화 첫마디',
      body: result.firstMessage || '팀장 첫마디가 팀원을 달래는 말이 아니라 대화 목적, 역할 기준, 지원 방식을 분명히 하는지 토의합니다.',
    },
    {
      title: '컴플라이언스 안전선',
      body: result.compliancePoint || '실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보 없이 안전한 표현으로 수정했는지 확인합니다.',
    },
    {
      title: '현업 실행 전환',
      body: result.twoWeekAction || '2주 실행 우선순위가 내일 바로 실행 가능한 행동으로 충분히 구체화되었는지 확인합니다.',
    },
  ];
}

function V39InstructorDiscussionPanel({ result, onRefresh }: { result: V39FinalCallPlanResult; onRefresh: () => void }) {
  const [copied, setCopied] = useState(false);
  const guide = buildInstructorDiscussionGuide(result);
  const questions = buildDiscussionQuestions(result);

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
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">Instructor Discussion Preparation</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">최종 실행 카드를 강사용 토의 질문으로 전환하기</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            12단계에서 저장한 최종 2주 실행 카드를 바탕으로 강사용 디브리핑 질문을 정리합니다.
            이 화면은 참여자를 점수화하거나 평가하기 위한 화면이 아니라, 판단 근거·포기한 선택지·팀원 실행 대화·안전 문장 수정 이유를 토의하기 위한 운영 화면입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            12단계 최종 카드 새로고침
          </button>
          <button type="button" className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-cyan-800" onClick={copyGuide}>
            {copied ? '토의 요약 복사 완료' : '토의 요약 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.updatedAt ? '최종 카드 있음' : '최종 카드 없음'}</p>
          {result.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{result.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">실행 우선순위</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.twoWeekAction.trim() ? '저장됨' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">첫 문장</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.firstMessage.trim() ? '저장됨' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">안전선</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.compliancePoint.trim() ? '저장됨' : '미작성'}</p>
        </div>
      </div>

      {result.updatedAt ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {questions.map((item) => (
            <article key={item.title} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-cyan-700">{item.title}</p>
              <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{item.body}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          12단계에서 최종 실행 카드를 저장하면, 이곳에 강사용 토의 참고 자료가 표시됩니다.
        </div>
      )}

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">강사용 토의 연결 요약</span>
        <textarea className="mt-3 min-h-80 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={guide} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        이 요약은 참여자 평가용 점수 자료가 아닙니다. 강사는 판단 근거, 포기한 선택지, 팀원 실행 대화 첫마디, 안전 문장 수정 이유, 내일 실행 행동을 중심으로 토의합니다.
      </div>
    </section>
  );
}

export function V39InstructorDiscussionLab() {
  const [result, setResult] = useState(() => loadV39FinalCallPlanResult());

  const refreshFinalCallPlanResult = () => {
    setResult(loadV39FinalCallPlanResult());
  };

  return <V39InstructorDiscussionPanel result={result} onRefresh={refreshFinalCallPlanResult} />;
}
