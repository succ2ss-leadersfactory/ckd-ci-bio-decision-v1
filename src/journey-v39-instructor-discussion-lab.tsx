import { useState } from 'react';
import {
  type V39FinalCallPlanResult,
  loadV39FinalCallPlanResult,
} from './journey-v39-final-call-plan-result-store';

const V39_INSTRUCTOR_DISCUSSION_SMOKE_MARKERS = [
  'V39InstructorDiscussionLab',
  'V39InstructorDiscussionPanel',
  '최종 실행 카드를 강사용 토의 질문으로 전환하기',
  '13단계 강사용 토의 연결 요약',
  '강사용 핵심 질문',
  '12단계 최종 카드 새로고침',
  '판단 근거 요약',
  '보완 지점 요약',
  '토의거리 요약',
  '관리 지표 선택 이유 질문',
  '고객 Data 확인 List의 부족 정보 질문',
  '고객군 × 팀원 실행 Map의 배치 기준 질문',
  '고객군별 대응 방향과 팀원 역할 기준 질문',
  '팀원 7명 업무배분 균형 질문',
  '우선 1on1 코칭 계획 질문',
  '팀원 실행 대화의 첫마디 질문',
  '컴플라이언스 수정 포인트 질문',
  '현업 적용 2주 후 리뷰 질문',
].join('|');
void V39_INSTRUCTOR_DISCUSSION_SMOKE_MARKERS;

type DiscussionQuestion = {
  title: string;
  body: string;
  guide: string;
};

function hasFinalCardContext(result: V39FinalCallPlanResult) {
  return Boolean(
    result.updatedAt ||
      result.focusCustomers.trim() ||
      result.memberRoles.trim() ||
      result.twoWeekAction.trim() ||
      result.compliancePoint.trim() ||
      result.firstMessage.trim() ||
      result.discussionMemo.trim(),
  );
}

function buildInstructorDiscussionGuide(result: V39FinalCallPlanResult) {
  if (!hasFinalCardContext(result)) {
    return [
      '아직 12단계 최종 실행 카드가 저장되지 않았습니다.',
      '12단계에서 집중 고객군, 팀원 역할, 2주 실행 우선순위, 컴플라이언스 포인트, 팀원에게 말할 첫 문장을 먼저 저장하세요.',
    ].join('\n');
  }

  return [
    '[13단계 강사용 토의 연결 요약]',
    '',
    '[판단 근거 요약]',
    `- 집중 고객군 판단 근거: ${result.focusCustomers || '아직 작성되지 않았습니다.'}`,
    `- 팀원 역할 배치 근거: ${result.memberRoles || '아직 작성되지 않았습니다.'}`,
    `- 2주 실행 우선순위 근거: ${result.twoWeekAction || '아직 작성되지 않았습니다.'}`,
    '',
    '[보완 지점 요약]',
    `- 컴플라이언스/표현 안전선: ${result.compliancePoint || '아직 작성되지 않았습니다.'}`,
    `- 팀원 실행 대화 첫 문장: ${result.firstMessage || '아직 작성되지 않았습니다.'}`,
    `- 추가 토의 메모: ${result.discussionMemo || '아직 작성되지 않았습니다.'}`,
    '',
    '[강사용 핵심 질문]',
    '1. 관리 지표 선택 이유 질문: 이 참여자는 왜 이 지표를 이번 2주 동안 볼 기준으로 선택했는가?',
    '2. 고객 Data 확인 List의 부족 정보 질문: 고객 Data에서 아직 확인하지 못한 정보는 무엇이며, 그것을 어떻게 확인할 것인가?',
    '3. 고객군별 대응 방향과 팀원 역할 기준 질문: 고객군별 2주 대응 방향과 팀원 역할·지원 기준은 어떤 근거로 연결되었는가?',
    '4. 팀원 7명 업무배분 균형 질문: 특정 팀원에게 부담·기회·리스크가 몰리지는 않았는가?',
    '5. 우선 1on1 코칭 계획 질문: 왜 이 팀원을 먼저 만나야 하며, 코칭 목적은 역할 설명·부담 확인·성장 의미 부여 중 무엇인가?',
    '6. 팀원 실행 대화의 첫마디 질문: 팀원에게 말할 첫 문장은 지시가 아니라 역할 기준과 지원 방식을 담고 있는가?',
    '7. 컴플라이언스 수정 포인트 질문: AI 초안에서 어떤 표현을 수정했고, 왜 더 안전한 문장으로 바꾸었는가?',
    '8. 현업 적용 2주 후 리뷰 질문: 2주 뒤 무엇을 보면 이 실행계획이 작동했는지 판단할 수 있는가?',
  ].join('\n');
}

function buildDiscussionQuestions(result: V39FinalCallPlanResult): DiscussionQuestion[] {
  return [
    {
      title: '관리 지표 선택 이유',
      body: result.twoWeekAction || '2주 실행 우선순위에 포함된 핵심 지표와 실행 기준을 바탕으로, 왜 그 지표를 선택했는지 토의합니다.',
      guide: '방문 건수 같은 활동 지표에 머물렀는지, 전환·품질 지표까지 보려 했는지 확인합니다.',
    },
    {
      title: '고객 Data 확인 List의 부족 정보',
      body: result.focusCustomers || '집중 고객군 요약을 바탕으로 기회 신호, 주의 신호, 아직 부족한 정보, 추가 확인 질문을 토의합니다.',
      guide: '고객을 등급화하지 않고 Data의 패턴·편중·부족 정보를 분리했는지 확인합니다.',
    },
    {
      title: '고객군별 대응 방향과 팀원 역할 기준',
      body: result.memberRoles || '팀원별 역할이 고객군별 2주 대응 방향, 팀원 강점, 부담 가능성, 성장 기회를 함께 반영했는지 확인합니다.',
      guide: '누가 맡는가보다 왜 그 팀원이 그 역할을 맡는지, 팀장이 무엇을 지원할지 묻습니다.',
    },
    {
      title: '팀원 7명 업무배분 균형',
      body: result.memberRoles || '팀원 7명 전체를 놓고 업무배분 판단, 부담 편중, 성장 기회, 표현 리스크가 균형 있게 고려되었는지 토의합니다.',
      guide: '잘하는 사람에게 반복 배정되지 않았는지, 저연차에게 너무 큰 과제가 가지 않았는지, 빠른 실행형 팀원에게 위험 표현이 큰 대화가 몰리지 않았는지 확인합니다.',
    },
    {
      title: '우선 1on1 코칭 계획',
      body: result.memberRoles || '우선 1on1 대상으로 선택한 팀원, 코칭 목적, 팀장 지원, 업무배분 리스크를 확인합니다.',
      guide: '먼저 만날 이유가 분명한지, 대화 목적이 역할 설명인지 부담 확인인지 성장 의미 부여인지 구분되어 있는지 묻습니다.',
    },
    {
      title: '팀원 실행 대화의 첫마디',
      body: result.firstMessage || '팀장 첫마디가 팀원을 달래는 말이 아니라 대화 목적, 역할 기준, 지원 방식을 분명히 하는지 토의합니다.',
      guide: '나 때는 말이야식 표현이 남아 있는지, 지금 필요한 실행 대화로 바뀌었는지 확인합니다.',
    },
    {
      title: '컴플라이언스 수정 포인트',
      body: result.compliancePoint || '실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보 없이 안전한 표현으로 수정했는지 확인합니다.',
      guide: '처방 유도, 공략, 전환 가능성, 비교 우위 단정, 허가 외 표현, 세대 단정 표현을 제거했는지 확인합니다.',
    },
    {
      title: '현업 적용 2주 후 리뷰',
      body: result.discussionMemo || '2주 후 무엇을 보면 실행계획이 작동했는지, 무엇을 수정해야 하는지 토의합니다.',
      guide: '2주 후 리뷰 기준을 행동, Data, 대화 결과, 안전선 준수 여부로 나누어 묻습니다.',
    },
  ];
}

function buildTwoWeekReviewQuestions(result: V39FinalCallPlanResult) {
  return [
    '1. 2주 동안 실제로 본 관리 지표는 무엇이며, 처음 예상과 무엇이 달랐는가?',
    '2. 고객 Data 확인 List에서 가장 부족했던 정보는 무엇이었고, 어떻게 보완했는가?',
    '3. 고객군별 대응 방향과 팀원 역할에서 부담이 특정 팀원에게 몰리지는 않았는가?',
    '4. 팀원 7명 중 업무가 몰린 사람과 기회가 부족했던 사람은 누구였는가?',
    '5. 우선 1on1 대상과 실제로 대화했는가? 대화 목적은 유지되었는가?',
    '6. 팀원에게 말한 첫 문장은 역할 기준과 지원 방식을 충분히 담았는가?',
    '7. AI 초안에서 수정한 안전 문장이 실제 현장에서 도움이 되었는가?',
    `8. 다음 2주에 유지할 것과 바꿀 것은 무엇인가? ${result.twoWeekAction.trim() ? '현재 실행 우선순위와 비교해 답합니다.' : ''}`.trim(),
  ];
}

function V39InstructorDiscussionPanel({ result, onRefresh }: { result: V39FinalCallPlanResult; onRefresh: () => void }) {
  const [copied, setCopied] = useState(false);
  const hasFinalCard = hasFinalCardContext(result);
  const guide = buildInstructorDiscussionGuide(result);
  const questions = buildDiscussionQuestions(result);
  const reviewQuestions = buildTwoWeekReviewQuestions(result);

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
            이 화면은 참여자를 점수화하거나 평가하기 위한 화면이 아니라, 판단 근거·포기한 선택지·고객 Data 부족 정보·팀원 7명 업무배분 균형·우선 1on1 코칭 계획·안전 문장 수정 이유·2주 후 리뷰 기준을 토의하기 위한 운영 화면입니다.
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
          <p className="mt-1 text-sm font-black text-slate-900">{hasFinalCard ? '최종 카드 있음' : '최종 카드 없음'}</p>
          {result.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{result.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">판단 근거</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.focusCustomers.trim() || result.memberRoles.trim() || result.twoWeekAction.trim() ? '있음' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">보완 지점</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.compliancePoint.trim() || result.firstMessage.trim() ? '있음' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">토의거리</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.discussionMemo.trim() ? '있음' : '미작성'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-200 bg-white p-4 text-xs font-bold leading-5 text-cyan-950">
        <p className="font-black">강사용 디브리핑 포인트</p>
        <p className="mt-1">질문은 정답 확인용이 아니라 판단 기준을 꺼내는 용도입니다. “왜 그렇게 보았는가”, “무엇을 아직 모르는가”, “누구에게 일이 몰렸는가”, “왜 이 팀원을 먼저 만나야 하는가”, “어떤 표현을 고쳤는가”, “2주 후 무엇으로 확인할 것인가”를 중심으로 운영합니다.</p>
      </div>

      {hasFinalCard ? (
        <>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-cyan-700">판단 근거 요약</p>
              <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{[result.focusCustomers, result.memberRoles, result.twoWeekAction].filter(Boolean).join('\n\n') || '아직 판단 근거가 충분히 정리되지 않았습니다.'}</p>
            </article>
            <article className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-amber-700">보완 지점 요약</p>
              <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{[result.compliancePoint, result.firstMessage].filter(Boolean).join('\n\n') || '아직 보완 지점이 충분히 정리되지 않았습니다.'}</p>
            </article>
            <article className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-violet-700">토의거리 요약</p>
              <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{result.discussionMemo || '아직 강사용 토의 메모가 정리되지 않았습니다.'}</p>
            </article>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {questions.map((item) => (
              <article key={item.title} className="rounded-2xl border bg-white p-4 shadow-sm">
                <p className="text-xs font-black text-cyan-700">{item.title}</p>
                <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{item.body}</p>
                <p className="mt-3 rounded-2xl bg-cyan-50 px-3 py-2 text-xs font-bold leading-5 text-cyan-900">{item.guide}</p>
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          12단계에서 최종 실행 카드를 저장하면, 이곳에 강사용 토의 참고 자료가 표시됩니다.
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-black text-slate-950">현업 적용 2주 후 리뷰 질문</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {reviewQuestions.map((question) => (
            <div key={question} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">{question}</div>
          ))}
        </div>
      </div>

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">강사용 토의 연결 요약</span>
        <textarea className="mt-3 min-h-80 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={guide} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        이 요약은 참여자 평가용 점수 자료가 아닙니다. 강사는 관리 지표 선택 이유, 고객 Data 확인 List의 부족 정보, 고객군별 대응 방향과 팀원 역할 기준, 팀원 7명 업무배분 균형, 우선 1on1 코칭 계획, 팀원 실행 대화의 첫마디, 컴플라이언스 수정 포인트, 현업 적용 2주 후 리뷰 질문을 중심으로 토의합니다.
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
