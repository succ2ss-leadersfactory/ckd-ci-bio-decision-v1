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
  '교육장에서 함께 이야기할 질문',
  '고객 활동 기록에서 아직 모르는 것',
  '말해도 되는 선을 어떻게 고쳤는가',
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
      '아직 12단계 2주 실행 메모가 저장되지 않았습니다.',
      '12단계에서 먼저 볼 고객군/조건, 팀원 역할, 이번 2주에 할 일, 말해도 되는 선, 팀원에게 꺼낼 첫 문장을 먼저 저장하세요.',
    ].join('\n');
  }

  return [
    '[13단계 함께 이야기할 질문 정리]',
    '',
    '[왜 그렇게 봤는지]',
    `- 먼저 볼 고객군/조건: ${result.focusCustomers || '아직 작성되지 않았습니다.'}`,
    `- 팀원 역할과 지원: ${result.memberRoles || '아직 작성되지 않았습니다.'}`,
    `- 이번 2주에 할 일: ${result.twoWeekAction || '아직 작성되지 않았습니다.'}`,
    '',
    '[어디가 막힐 수 있는지]',
    `- 말해도 되는 선: ${result.compliancePoint || '아직 작성되지 않았습니다.'}`,
    `- 팀원에게 꺼낼 첫 문장: ${result.firstMessage || '아직 작성되지 않았습니다.'}`,
    `- 함께 이야기할 질문 메모: ${result.discussionMemo || '아직 작성되지 않았습니다.'}`,
    '',
    '[교육장에서 함께 볼 질문]',
    '1. 이번 2주 동안 이 지표를 먼저 보려는 이유는 무엇인가?',
    '2. 고객 활동 기록에서 아직 모르는 것은 무엇이며, 팀원에게 어떻게 확인할 것인가?',
    '3. 고객군별 2주 행동과 팀원 역할은 어떤 근거로 이어졌는가?',
    '4. 특정 팀원에게 부담, 기회, 조심할 대화가 한쪽으로 몰리지는 않았는가?',
    '5. 왜 이 팀원을 먼저 1on1로 만나야 하며, 대화 목적은 무엇인가?',
    '6. 팀원에게 꺼낼 첫 문장은 지시보다 이유와 지원을 먼저 보여 주는가?',
    '7. AI 초안에서 어떤 표현을 고쳤고, 왜 그 표현이 더 안전한가?',
    '8. 2주 뒤 무엇을 보면 이 실행 메모가 실제로 작동했는지 알 수 있는가?',
  ].join('\n');
}

function buildDiscussionQuestions(result: V39FinalCallPlanResult): DiscussionQuestion[] {
  return [
    {
      title: '왜 이 지표를 보려 했는가',
      body: result.twoWeekAction || '이번 2주에 할 일에 포함된 지표와 실행 기준을 바탕으로, 왜 그 지표를 먼저 보려 했는지 이야기합니다.',
      guide: '방문 횟수처럼 눈에 보이는 활동에만 머물렀는지, 반응의 질과 다음 접점까지 함께 보려 했는지 확인합니다.',
    },
    {
      title: '고객 활동 기록에서 아직 모르는 것',
      body: result.focusCustomers || '먼저 볼 고객군이나 조건을 바탕으로, 기회로 볼 수 있는 단서와 아직 더 물어봐야 할 내용을 나눕니다.',
      guide: '고객을 등급처럼 나누지 않고, 기록의 패턴, 빠진 정보, 섣불리 믿으면 안 되는 해석을 구분했는지 확인합니다.',
    },
    {
      title: '고객군별 행동과 팀원 역할의 연결',
      body: result.memberRoles || '팀원별 역할이 고객군별 2주 행동, 팀원 강점, 부담 가능성, 성장 기회를 함께 반영했는지 확인합니다.',
      guide: '누가 맡는가보다 왜 그 팀원이 그 역할을 맡는지, 팀장이 무엇을 도와야 하는지 묻습니다.',
    },
    {
      title: '팀원 7명의 부담과 기회 균형',
      body: result.memberRoles || '팀원 7명 전체를 놓고 일이 몰린 사람, 기회가 부족한 사람, 조심해야 할 대화가 많은 사람을 함께 봅니다.',
      guide: '잘하는 사람에게만 반복 배정하지 않았는지, 저연차에게 너무 큰 과제가 가지 않았는지, 빠른 실행형 팀원에게 위험한 표현이 필요한 대화가 몰리지 않았는지 확인합니다.',
    },
    {
      title: '먼저 1on1로 맞춰볼 이유',
      body: result.memberRoles || '먼저 만날 팀원, 대화 목적, 팀장이 도와줄 것, 업무배분에서 조심할 점을 확인합니다.',
      guide: '먼저 만날 이유가 분명한지, 대화 목적이 역할 설명인지, 부담 확인인지, 성장 의미 부여인지 구분되어 있는지 묻습니다.',
    },
    {
      title: '팀원에게 꺼낼 첫 문장',
      body: result.firstMessage || '팀장의 첫마디가 지시나 압박이 아니라 대화 목적, 역할 기준, 지원 방식을 분명히 담고 있는지 이야기합니다.',
      guide: '“나 때는 말이야”처럼 들릴 표현이 남아 있는지, 지금 필요한 기준과 지원을 말하는 문장으로 바뀌었는지 확인합니다.',
    },
    {
      title: '말해도 되는 선을 어떻게 고쳤는가',
      body: result.compliancePoint || '실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보 없이 안전한 표현으로 바꿨는지 확인합니다.',
      guide: '처방 유도, 공략, 전환 가능성, 비교 우위 단정, 허가된 범위를 넘는 표현, 세대 단정 표현을 덜어냈는지 봅니다.',
    },
    {
      title: '2주 뒤 무엇으로 확인할 것인가',
      body: result.discussionMemo || '2주 뒤 무엇을 보면 실행 메모가 작동했는지, 무엇을 고쳐야 하는지 이야기합니다.',
      guide: '2주 후 확인 기준을 행동, 고객 활동 기록, 대화 결과, 말해도 되는 선 준수 여부로 나누어 봅니다.',
    },
  ];
}

function buildTwoWeekReviewQuestions(result: V39FinalCallPlanResult) {
  return [
    '1. 2주 동안 실제로 본 관리 지표는 무엇이며, 처음 예상과 무엇이 달랐는가?',
    '2. 방문·면담 기록에서 가장 부족했던 정보는 무엇이었고, 어떻게 보완했는가?',
    '3. 고객군별 행동과 팀원 역할에서 부담이 특정 팀원에게 몰리지는 않았는가?',
    '4. 팀원 7명 중 일이 몰린 사람과 기회가 부족했던 사람은 누구였는가?',
    '5. 먼저 만나기로 한 팀원과 실제로 대화했는가? 대화 목적은 유지되었는가?',
    '6. 팀원에게 꺼낸 첫 문장은 역할 기준과 지원 방식을 충분히 담았는가?',
    '7. AI 초안에서 고친 안전한 문장이 실제 현장에서 도움이 되었는가?',
    `8. 다음 2주에 유지할 것과 바꿀 것은 무엇인가? ${result.twoWeekAction.trim() ? '현재 2주 실행 메모와 비교해 답합니다.' : ''}`.trim(),
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
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">13단계 · 함께 이야기할 질문 준비</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">2주 실행 메모를 교육장 질문으로 바꿉니다</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            12단계에서 저장한 2주 실행 메모를 바탕으로 함께 이야기할 질문을 정리합니다.
            이 화면은 참여자를 점수화하거나 평가하기 위한 화면이 아닙니다. 왜 그렇게 봤는지, 어디가 막힐 수 있는지, 어떤 말은 더 안전하게 고쳐야 하는지, 2주 뒤 무엇으로 확인할지를 함께 보기 위한 화면입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            12단계 메모 다시 불러오기
          </button>
          <button type="button" className="rounded-full bg-cyan-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-cyan-800" onClick={copyGuide}>
            {copied ? '질문 메모 복사 완료' : '질문 메모 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{hasFinalCard ? '2주 실행 메모 있음' : '2주 실행 메모 없음'}</p>
          {result.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{result.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">왜 그렇게 봤는지</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.focusCustomers.trim() || result.memberRoles.trim() || result.twoWeekAction.trim() ? '있음' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">어디가 막힐 수 있는지</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.compliancePoint.trim() || result.firstMessage.trim() ? '있음' : '미작성'}</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">함께 물어볼 질문</p>
          <p className="mt-1 text-sm font-black text-slate-900">{result.discussionMemo.trim() ? '있음' : '미작성'}</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-cyan-200 bg-white p-4 text-xs font-bold leading-5 text-cyan-950">
        <p className="font-black">교육장에서 함께 볼 질문</p>
        <p className="mt-1">질문은 정답을 맞히기 위한 것이 아닙니다. “왜 그렇게 보았는가”, “무엇을 아직 모르는가”, “누구에게 일이 몰렸는가”, “왜 이 팀원을 먼저 만나야 하는가”, “어떤 표현을 고쳤는가”, “2주 후 무엇으로 확인할 것인가”를 중심으로 이야기합니다.</p>
      </div>

      {hasFinalCard ? (
        <>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <article className="rounded-2xl border border-cyan-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-cyan-700">왜 그렇게 봤는지</p>
              <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{[result.focusCustomers, result.memberRoles, result.twoWeekAction].filter(Boolean).join('\n\n') || '아직 판단 근거가 충분히 정리되지 않았습니다.'}</p>
            </article>
            <article className="rounded-2xl border border-amber-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-amber-700">어디가 막힐 수 있는지</p>
              <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{[result.compliancePoint, result.firstMessage].filter(Boolean).join('\n\n') || '아직 보완할 지점이 충분히 정리되지 않았습니다.'}</p>
            </article>
            <article className="rounded-2xl border border-violet-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black text-violet-700">함께 물어볼 질문</p>
              <p className="mt-2 whitespace-pre-wrap text-xs font-bold leading-5 text-slate-800">{result.discussionMemo || '아직 함께 이야기할 질문 메모가 정리되지 않았습니다.'}</p>
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
          12단계에서 2주 실행 메모를 저장하면, 이곳에 함께 이야기할 질문 자료가 표시됩니다.
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <p className="text-sm font-black text-slate-950">2주 뒤 다시 볼 질문</p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {reviewQuestions.map((question) => (
            <div key={question} className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">{question}</div>
          ))}
        </div>
      </div>

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">함께 이야기할 질문 메모</span>
        <textarea className="mt-3 min-h-80 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={guide} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        이 메모는 참여자 평가용 점수 자료가 아닙니다. 강사는 이번 2주 동안 볼 지표, 방문·면담 기록에서 아직 모르는 것, 고객군별 행동과 팀원 역할의 연결, 팀원 7명의 부담과 기회 균형, 먼저 1on1로 맞춰볼 이유, 팀원에게 꺼낼 첫 문장, 말해도 되는 선을 고친 이유, 2주 뒤 확인 질문을 중심으로 대화를 이끕니다.
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
