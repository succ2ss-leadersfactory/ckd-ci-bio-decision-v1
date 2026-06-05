import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { V39CustomerPriorityLab } from './journey-v39-customer-priority-lab';
import { V39ActionTriplet, V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS = [
  '7단계 진행 가이드',
  '고객군별 2주 대응 방향',
  '고객군 × 팀원 2주 실행 Map',
  '6단계 고객 Data 확인 List',
  'AI 없이도 할 수 있습니다',
  'AI를 쓰면 좋아지는 점',
  '대응 강도',
  '팀원 연결 기준',
  '실제 연결 후보',
  '8단계는 역할 보완으로 이어집니다',
  '이 단계에서 하는 일',
  '이전 단계에서 가져온 것',
  '다음 단계로 넘길 것',
  '최소 결과물',
  '고객 Data 증거 카드',
  '고객군 후보와 점검 조건을 분리합니다',
  'AI로 2주 실행 Map 초안 만들기',
  '6단계 증거가 7단계 실행 방향으로 바뀌는 방식',
  '고객 Data 증거는 고객군이 아닙니다',
  '6~8단계는 지표를 실행으로 바꾸는 짧은 흐름입니다',
  '고객이 반응했나요? → 반응 확인 고객군',
  '말해도 되는 범위는 어디까지인가요? → 안전선 점검 조건',
  '이번 2주 동안 어디에 먼저 움직일지 정합니다',
  '고객 기록에서 본 단서를 2주 행동으로 바꿉니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39ActionTriplet',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS;

const EVIDENCE_TO_DIRECTION_MAP = [
  {
    evidence: '고객이 반응했나요?',
    direction: '반응 확인 고객군',
    meaning: '질문이나 자료 요청은 있었지만, 실제 관심인지 한 번 더 물어봐야 할 고객군',
  },
  {
    evidence: '다음 만남으로 이어질까요?',
    direction: '다음 접점 고객군',
    meaning: '다음 약속이나 후속 대화 가능성이 있어, 만날 이유와 준비할 자료를 정리해야 할 고객군',
  },
  {
    evidence: '놓친 고객군이 있나요?',
    direction: '정보 보완 고객군',
    meaning: '한동안 만나지 못했거나, 새로 확인해야 하거나, 기존 고객에게만 치우쳐 빠뜨렸을 수 있는 고객군',
  },
  {
    evidence: '방문 외 접점이 작동했나요?',
    direction: '대체 접점 고객군',
    meaning: '방문만 고집하기보다 자료 전달, 전화, 메시지, 비대면 접점까지 함께 봐야 할 고객군',
  },
  {
    evidence: '실행을 막는 제약은 무엇인가요?',
    direction: '제약 해소 고객군',
    meaning: '방문 제한, 일정 변경, 내부 지원 부족처럼 먼저 풀어야 할 장애물이 있는 고객군',
  },
  {
    evidence: '말해도 되는 범위는 어디까지인가요?',
    direction: '안전선 점검 조건',
    meaning: '고객군이 아니라, 어떤 고객을 만나든 먼저 확인해야 할 표현과 자료의 기준',
  },
];

function getSelectedDataCheckCount() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return judgmentResult.selectedCustomerTypeIds.length;
}

function getDataCheckMemoCount() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return Object.values(judgmentResult.decisions).filter((decision) => decision.reason.trim() || decision.judgmentMemo.trim()).length;
}

function getSavedDirectionCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.strategy.trim()).length;
}

function getSavedMemberConnectionCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.memberRole.trim()).length;
}

export function V39CustomerPriorityUxLab() {
  const selectedDataCheckCount = getSelectedDataCheckCount();
  const dataCheckMemoCount = getDataCheckMemoCount();
  const savedDirectionCount = getSavedDirectionCount();
  const savedMemberConnectionCount = getSavedMemberConnectionCount();

  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={7} />
      <V39StepHero
        eyebrow="7단계 · 이번 2주 동안 어디에 먼저 움직일지 정합니다"
        icon="🧭"
        title="고객 기록에서 본 단서를 2주 행동으로 바꿉니다"
        tone="emerald"
        description="6단계에서 고른 단서는 고객을 줄 세우기 위한 기준이 아닙니다. 지금은 그 단서를 보고, 이번 2주 동안 어떤 고객군은 다시 확인하고, 어떤 조건은 먼저 풀어야 하는지 나누어 봅니다. 말해도 되는 선과 자료 기준은 특정 고객군이 아니라 모든 활동 앞에 놓는 안전장치로 봅니다."
        badges={[
          { label: '앞에서 고른 단서', value: `${selectedDataCheckCount || '전체'}개`, tone: 'sky', icon: '🔎' },
          { label: '확인 메모', value: `${dataCheckMemoCount}건`, tone: 'emerald', icon: '📝' },
          { label: '2주 행동 메모', value: `${savedDirectionCount}건`, tone: 'violet', icon: '🧭' },
          { label: '함께 볼 팀원', value: `${savedMemberConnectionCount}건`, tone: 'amber', icon: '👥' },
        ]}
      />

      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">기록을 행동으로 바꾸는 중간 지점입니다</p>
          <p className="mt-1">6단계에서 고객 활동 기록의 단서를 보았다면, 7단계에서는 그 단서를 2주 행동으로 묶습니다. 8단계에서는 이 일을 어떤 팀원이 맡아도 무리 없이 움직일 수 있도록 역할과 지원을 다듬습니다.</p>
        </div>

        <div className="mt-4 rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">앞 화면의 단서가 이번 2주 행동으로 바뀌는 방식</p>
          <h3 className="mt-1 text-base font-black text-slate-950">기록에서 본 단서는 고객군 자체가 아닙니다</h3>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-700">
            6단계에서 고른 것은 “이 고객군이 좋다/나쁘다”가 아니라, 기록에서 먼저 확인할 단서였습니다. 7단계에서는 그 단서를 바탕으로 이번 2주 동안 다시 확인할 고객군과 먼저 풀어야 할 조건을 나눕니다.
          </p>
          <div className="mt-3">
            <V39MiniFlow
              items={[
                { icon: '🔎', title: '기록에서 단서 보기', body: '반응, 다음 만남, 빠진 정보, 대체 접점, 실행 제약, 말해도 되는 선을 확인합니다.' },
                { icon: '🧭', title: '2주 행동으로 묶기', body: '다시 확인할 고객군과 먼저 풀어야 할 조건을 나눕니다.' },
                { icon: '👥', title: '팀원 역할로 넘기기', body: '다음 화면에서 누가 어떻게 움직일지 다듬습니다.' },
              ]}
            />
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {EVIDENCE_TO_DIRECTION_MAP.map((item) => (
              <div key={item.evidence} className="rounded-2xl border border-white bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
                <p className="font-black text-slate-950">{item.evidence} → {item.direction}</p>
                <p className="mt-1">{item.meaning}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">AI 없이도 할 수 있습니다</p>
            <p className="mt-1">팀장은 고객 활동 기록과 팀원 이야기를 보고, 어디는 다시 확인하고 어디는 잠시 멈춰야 할지 판단할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI를 쓰면 정리가 빨라집니다</p>
            <p className="mt-1">AI는 고객군 후보, 먼저 확인할 조건, 2주 행동, 팀원에게 물어볼 질문, 말해도 되는 선, 다음 회의에서 볼 것을 한눈에 정리해 줍니다.</p>
          </div>
        </div>

        <div className="mt-3">
          <V39ActionTriplet
            previous={{
              icon: '🔎',
              title: '고객 활동 기록에서 본 단서',
              body: '기회로 볼 수 있는 내용, 조심해야 할 내용, 아직 모르는 정보, 팀원에게 물어볼 질문입니다.',
            }}
            current={{
              icon: '🧭',
              title: '이번 2주 동안 움직일 곳과 조건을 나눕니다',
              body: '앞 화면의 단서를 보고 다시 확인할 고객군과 먼저 풀어야 할 조건을 정리합니다.',
            }}
            next={{
              icon: '👥',
              title: '8단계에서 팀원 역할을 다듬습니다',
              body: '2주 행동 방향과 함께 볼 팀원 후보가 다음 화면의 역할 정리로 이어집니다.',
            }}
          />
        </div>

        <div className="mt-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">다음 화면에서는 팀원이 실제로 움직일 수 있게 다듬습니다</p>
          <p className="mt-1">여기서는 “어디에 어떻게 움직일지”와 “누가 함께 보면 좋을지”까지만 정합니다. 다음 화면에서는 그 일이 팀원에게 무리 없이 전달되도록 역할, 지원, 점검 질문을 다듬습니다.</p>
        </div>

        <div className="mt-3">
          <V39MinimumChecklist items={['고객군 후보 또는 먼저 확인할 조건', '확인된 단서', '아직 부족한 정보', '이번 2주 행동', '팀원에게 물어볼 질문', '말해도 되는 선', '다음 회의에서 볼 것']} />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            고객에게 점수를 매기거나 순위를 세우는 시간이 아닙니다. AI가 정리해 준 초안도 그대로 확정하지 않습니다. 확인된 기록을 바탕으로 이번 2주 동안 움직일 곳과 조금 더 살펴볼 조건을 나누는 시간입니다. 팀원 연결도 확정 배정이 아니라 다음 화면에서 다듬을 임시 가설로 봅니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39CustomerPriorityLab />
    </section>
  );
}
