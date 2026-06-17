import { loadV39CustomerJudgmentResult } from './journey-v39-customer-judgment-result-store';
import { loadV39CustomerStrategyResult } from './journey-v39-customer-strategy-result-store';
import { V39CustomerPriorityLab } from './journey-v39-customer-priority-lab';
import { V39FlowStrip, V39MinimumChecklist, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS = [
  'V39CustomerPriorityUxLab',
  '7단계 진행 가이드',
  '고객군별 2주 대응 방향',
  '6단계 고객 Data 확인 List',
  '8단계는 코칭 대상 선정으로 이어집니다',
  '고객 Data 증거는 고객군이 아닙니다',
  '이번 2주 동안 어디에 먼저 움직일지 정합니다',
  '8단계에서 먼저 1on1로 맞춰볼 코칭 대상을 고릅니다',
  '다음 단계',
  '코칭 대상 선정',
].join('|');
void V39_CUSTOMER_PRIORITY_UX_SMOKE_MARKERS;

const EVIDENCE_TO_DIRECTION_MAP = [
  { id: 'A', evidence: '고객이 반응했나요?', direction: '반응을 다시 볼 흐름', meaning: '질문이나 자료 요청이 실제 관심인지 다시 확인합니다.' },
  { id: 'B', evidence: '다음 만남으로 이어질까요?', direction: '다음 접점을 잡아볼 흐름', meaning: '다음 약속과 준비 자료가 필요한지 확인합니다.' },
  { id: 'C', evidence: '놓친 고객군이 있나요?', direction: '정보를 더 채울 흐름', meaning: '한동안 만나지 못했거나 새로 확인할 접점을 봅니다.' },
  { id: 'D', evidence: '방문 외 접점이 작동했나요?', direction: '다른 접점으로 이어볼 흐름', meaning: '자료 전달, 전화, 메시지 이후 실제 반응을 봅니다.' },
  { id: 'E', evidence: '실행을 막는 제약은 무엇인가요?', direction: '막힌 조건부터 풀 흐름', meaning: '일정 변경, 방문 제한, 내부 지원 부족처럼 먼저 풀 것을 확인합니다.' },
  { id: 'F', evidence: '말해도 되는 범위는 어디까지인가요?', direction: '표현과 자료를 조심해서 볼 조건', meaning: '고객을 나누는 기준이 아니라, 먼저 지켜야 할 표현의 선입니다.' },
];

function getSelectedEvidenceItems() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return EVIDENCE_TO_DIRECTION_MAP.filter((item) => judgmentResult.selectedCustomerTypeIds.includes(item.id));
}

function getDataCheckMemoCount() {
  const judgmentResult = loadV39CustomerJudgmentResult();
  return Object.values(judgmentResult.decisions).filter((decision) => decision.reason.trim() || decision.judgmentMemo.trim()).length;
}

function getSavedDirectionCount() {
  const strategyResult = loadV39CustomerStrategyResult();
  return Object.values(strategyResult.strategies).filter((strategy) => strategy.strategy.trim()).length;
}

export function V39CustomerPriorityUxLab() {
  const selectedEvidenceItems = getSelectedEvidenceItems();
  const selectedDataCheckCount = loadV39CustomerJudgmentResult().selectedCustomerTypeIds.length;
  const dataCheckMemoCount = getDataCheckMemoCount();
  const savedDirectionCount = getSavedDirectionCount();

  return (
    <section className="space-y-4">
      <V39FlowStrip currentStep={7} />
      <V39StepHero
        eyebrow="7단계 · 이번 2주에 다시 볼 흐름"
        icon="🧭"
        title="고객을 나누기보다, 어디부터 다시 볼지 정합니다"
        tone="emerald"
        description="앞 화면에서 고른 단서를 바탕으로 이번 2주 동안 어디부터 다시 확인할지 정합니다. 누가 맡을지 정하는 화면이 아닙니다. 다음 화면에서는 이 일을 움직이게 하려면 누구와 먼저 이야기해야 할지 고릅니다."
        badges={[
          { label: '앞에서 고른 단서', value: `${selectedDataCheckCount}개`, tone: 'sky', icon: '🔎' },
          { label: '확인 메모', value: `${dataCheckMemoCount}건`, tone: 'emerald', icon: '📝' },
          { label: '2주 메모', value: `${savedDirectionCount}건`, tone: 'violet', icon: '🧭' },
          { label: '다음', value: '1on1 대상', tone: 'amber', icon: '👥' },
        ]}
      />

      <section className="rounded-3xl border border-cyan-100 bg-white p-4 shadow-sm md:p-5">
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
          <p className="font-black">기록에서 본 단서가 곧 고객 구분은 아닙니다</p>
          <p className="mt-1">6단계에서 고른 것은 고객을 평가하는 기준이 아니라 고객 활동 기록에서 다시 확인할 단서입니다. 7단계에서는 그 단서를 이번 2주 동안 어디부터 볼지 정하는 방향으로 바꿉니다.</p>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">앞에서 가져온 것</p>
            <p className="mt-1">고객 기록에서 다시 봐야 할 단서와 팀원에게 물어볼 질문입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">지금 정할 것</p>
            <p className="mt-1">이번 2주 동안 어디부터 다시 확인할지 정합니다.</p>
          </div>
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 text-xs font-bold leading-5 text-violet-950">
            <p className="font-black">다음에 이어질 것</p>
            <p className="mt-1">8단계에서 먼저 1on1로 맞춰볼 코칭 대상을 고를 재료입니다.</p>
          </div>
        </div>

        <div className="mt-4 rounded-3xl border border-cyan-100 bg-cyan-50 p-4">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">앞에서 고른 단서</p>
          <h3 className="mt-1 text-base font-black text-slate-950">이 단서를 2주 움직임으로 바꿔 봅니다</h3>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {selectedEvidenceItems.length > 0 ? selectedEvidenceItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-700 shadow-sm">
                <p className="font-black text-slate-950">{item.evidence} → {item.direction}</p>
                <p className="mt-1">{item.meaning}</p>
              </div>
            )) : (
              <div className="rounded-2xl border border-dashed border-cyan-200 bg-white px-4 py-3 text-xs font-bold leading-5 text-slate-600 md:col-span-2">
                6단계에서 선택한 단서가 아직 없습니다. 지금도 아래에서 전체 후보를 보며 진행할 수 있지만, 먼저 6단계에서 1~2개 단서를 고르면 7단계의 방향이 더 분명해집니다.
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">팀장이 직접 봐도 됩니다</p>
            <p className="mt-1">고객 활동 기록과 팀원 이야기를 보고, 어디를 다시 확인하고 어디를 잠시 멈춰야 할지 판단할 수 있습니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">AI로 한 번 정리해 볼 수 있습니다</p>
            <p className="mt-1">확인할 단서, 부족한 정보, 2주 행동, 팀원에게 물어볼 질문, 말해도 되는 선을 빠르게 묶어 볼 수 있습니다.</p>
          </div>
        </div>

        <div className="mt-3">
          <V39MinimumChecklist items={['다시 볼 흐름 또는 조건', '확인된 단서', '아직 부족한 정보', '이번 2주 행동', '팀원에게 물어볼 질문', '말해도 되는 선']} />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            고객에게 점수를 매기거나 순위를 세우는 시간이 아닙니다. 확인된 기록을 바탕으로 이번 2주 동안 다시 확인할 흐름을 정합니다. 8단계의 코칭 대상 선정은 이 흐름을 실행으로 옮기기 위해 먼저 대화가 필요한 사람을 고르는 과정입니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39CustomerPriorityLab />
    </section>
  );
}
