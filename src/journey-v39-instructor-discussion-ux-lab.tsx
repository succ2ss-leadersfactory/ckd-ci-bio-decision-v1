import { loadV39FinalCallPlanResult } from './journey-v39-final-call-plan-result-store';
import { V39InstructorDiscussionLab } from './journey-v39-instructor-discussion-lab';
import { V39ActionTriplet, V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_INSTRUCTOR_DISCUSSION_UX_SMOKE_MARKERS = [
  '13단계 진행 가이드',
  '최종 실행 카드를 강사용 토의 질문으로 전환합니다',
  '판단 근거·보완 지점·토의거리로 나누어 봅니다',
  '판단 근거',
  '보완 지점',
  '토의거리',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '교육장에서 함께 이야기할 질문거리로 바꿉니다',
  '왜 그렇게 판단했는지, 어디가 막힐지 함께 봅니다',
  '2주 실행 메모 → 함께 볼 질문 → 2주 후 회고',
  '동료 팀장들과 함께 복기할 질문으로 바꿉니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39ActionTriplet',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_INSTRUCTOR_DISCUSSION_UX_SMOKE_MARKERS;

function hasFinalCardContext(result: { focusCustomers: string; memberRoles: string; twoWeekAction: string; compliancePoint: string; firstMessage: string; discussionMemo: string }) {
  return Boolean(
    result.focusCustomers.trim() ||
      result.memberRoles.trim() ||
      result.twoWeekAction.trim() ||
      result.compliancePoint.trim() ||
      result.firstMessage.trim() ||
      result.discussionMemo.trim(),
  );
}

function getInstructorDiscussionStatus() {
  const result = loadV39FinalCallPlanResult();
  const completedFieldCount = [
    result.focusCustomers,
    result.memberRoles,
    result.twoWeekAction,
    result.compliancePoint,
    result.firstMessage,
    result.discussionMemo,
  ].filter((value) => value.trim()).length;
  const hasFinalCard = Boolean(result.updatedAt || hasFinalCardContext(result));

  return {
    finalUpdatedAt: result.updatedAt,
    hasFinalCard,
    completedFieldCount,
    hasExecutionPriority: result.twoWeekAction.trim().length > 0,
    hasFirstMessage: result.firstMessage.trim().length > 0,
    hasCompliancePoint: result.compliancePoint.trim().length > 0,
    hasDiscussionMemo: result.discussionMemo.trim().length > 0,
  };
}

export function V39InstructorDiscussionUxLab() {
  const status = getInstructorDiscussionStatus();
  const finalCardStateLabel = status.hasFinalCard ? '메모 있음' : '메모 없음';
  const discussionReadyLabel = status.completedFieldCount >= 5 ? '함께 볼 준비됨' : '조금 더 보완 필요';

  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={13} />
      <V39StepHero
        eyebrow="13단계 · 함께 복기할 질문 만들기"
        icon="🗣️"
        title="왜 그렇게 봤는지, 어디서 막힐지 함께 이야기합니다"
        tone="cyan"
        description="마지막 화면은 평가표가 아닙니다. 내가 만든 2주 메모를 놓고, 어떤 근거로 그렇게 판단했는지, 실제 현장에서는 어디서 막힐 수 있는지, 동료 팀장이라면 무엇을 다르게 볼지 함께 이야기할 질문을 남깁니다."
        badges={[
          { label: '2주 메모', value: finalCardStateLabel, tone: 'cyan', icon: '✅' },
          { label: '함께 볼 거리', value: `${status.completedFieldCount}개 항목`, tone: 'violet', icon: '🗣️' },
          { label: '마무리', value: discussionReadyLabel, tone: 'emerald', icon: '📌' },
        ]}
      />

      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '✅', title: '내 2주 메모 보기', body: '앞 화면에서 만든 실행 메모를 가져옵니다.' },
            { icon: '🗣️', title: '함께 물어볼 질문 만들기', body: '왜 그렇게 봤는지, 어디가 막힐지, 다르게 볼 수 있는 점을 나눕니다.' },
            { icon: '🔁', title: '2주 후 다시 보기', body: '현업에서 해 본 뒤 유지할 것과 바꿀 것을 다시 봅니다.' },
          ]}
        />

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">내 판단을 한 번 더 꺼내 봅니다</p>
          <p className="mt-1">최종 메모를 다시 읽는 화면이 아닙니다. “왜 이렇게 봤는가”, “현장에서 어디가 막힐 수 있는가”, “다른 팀장이라면 무엇을 다르게 볼 수 있는가”를 함께 나눠 보는 화면입니다.</p>
        </div>

        <div className="mt-3">
          <V39ActionTriplet
            previous={{
              icon: '✅',
              title: '2주 실행 메모',
              body: '다시 볼 고객 흐름, 먼저 만날 팀원, 2주 행동, 말해도 되는 선, 첫 문장을 가져옵니다.',
            }}
            current={{
              icon: '🗣️',
              title: '함께 볼 질문으로 바꿉니다',
              body: '왜 그렇게 봤는지, 어디가 막힐 수 있는지, 다른 팀장은 무엇을 다르게 볼지 묻습니다.',
            }}
            next={{
              icon: '🔁',
              title: '2주 후 다시 봅니다',
              body: '실행해 본 뒤 유지할 것과 바꿀 것을 회고합니다.',
            }}
          />
        </div>

        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">2주 동안 먼저 할 일</p>
            <p className="mt-1">{status.hasExecutionPriority ? '정리됨' : '미작성'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀원에게 꺼낼 말</p>
            <p className="mt-1">{status.hasFirstMessage ? '정리됨' : '미작성'}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">조심할 표현</p>
            <p className="mt-1">{status.hasCompliancePoint ? '정리됨' : '미작성'}</p>
          </div>
        </div>

        <div className="mt-3">
          <V39MinimumChecklist
            tone="cyan"
            items={[
              '왜 그렇게 봤는지',
              '어디가 막힐 수 있는지',
              '동료 팀장에게 물어볼 질문',
              '2주 후 다시 볼 질문',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            이 화면은 평가표가 아닙니다. 교육장을 나간 뒤 실제 팀 회의와 1on1에서 어디가 어려울지, 어떤 표현을 더 안전하게 바꿀지, 팀장이 무엇을 다시 확인해야 할지 이야기하기 위한 자료입니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39InstructorDiscussionLab />
    </section>
  );
}
