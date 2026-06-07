import { V39TeamSevenCoachingMap } from './journey-v39-team-seven-coaching-map';
import { V39TeamSevenTextPolish } from './journey-v39-team-seven-text-polish';
import { V39FlowStrip, V39MinimumChecklist, V39MiniFlow, V39SafetyStrip, V39StepHero } from './journey-v39-ux-components';

const V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS = [
  'V39TeamSevenCoachingUxWrapper',
  '코칭 대상 선정',
  '7명 팀원 유형 참고',
  '실제 고민 팀원 익명 등록 가능',
  '누구와 먼저 1on1을 해야 하는지 정합니다',
  '7명 유형을 먼저 본 뒤 익명으로 추가합니다',
  'AI는 관찰 사실과 해석을 분리하는 데 사용합니다',
  '대화 스크립트는 9단계에서 만듭니다',
  '7명 전체는 가볍게, 우선 1on1 2명만 깊게',
  '전체 7명은 업무배분 판단만 남겨도 충분합니다',
  '팀원 7명의 부담과 기회를 먼저 가볍게 훑습니다',
  '누구를 먼저 만날지 고르는 4가지 기준',
  '먼저 만날지 판단하는 한 줄 기준',
  '팀 회의로 다룰 문제와 1on1로 다룰 문제를 구분합니다',
  'V39StepHero',
  'V39FlowStrip',
  'V39MinimumChecklist',
  'V39MiniFlow',
  'V39SafetyStrip',
].join('|');
void V39_TEAM_SEVEN_COACHING_UX_WRAPPER_SMOKE_MARKERS;

const ONE_ON_ONE_SELECTION_CRITERIA = [
  {
    title: '지금 미루면 커질 일인가',
    body: '오늘 지나가도 되는 일인지, 2주 안에 부담·오해·실행 지연으로 커질 일인지 봅니다.',
  },
  {
    title: '이번 2주 실행에 직접 영향을 주는가',
    body: '앞 단계에서 정한 고객 기록, 2주 흐름, 표현 안전선과 실제로 연결되는 팀원인지 봅니다.',
  },
  {
    title: '팀장이 섣불리 단정하고 있지는 않은가',
    body: '의지 부족, 세대 차이, 경험 고집으로 단정하기 전에 확인해야 할 맥락이 있는지 봅니다.',
  },
  {
    title: '1on1로 작게 합의할 수 있는 주제가 있는가',
    body: '팀 회의보다 개별 대화에서 부담, 기준, 지원 조건, 첫 행동을 맞추는 것이 나은지 봅니다.',
  },
];

const MEMBER_SELECTION_CUES = [
  { name: '김재호 차장', cue: '새 기준이 현장에서 어떻게 받아들여지는지 확인해야 할 때 먼저 만납니다.' },
  { name: '김문호 차장', cue: '어려운 일이 계속 몰리는데도 괜찮다고 말할 때 먼저 만납니다.' },
  { name: '유희관 과장', cue: '관찰은 충분한데 다음 행동이 계속 늦어질 때 먼저 만납니다.' },
  { name: '이대은 대리', cue: '안정적이지만 새 접점 시도가 줄어들 때 먼저 만납니다.' },
  { name: '신재영 대리', cue: '속도는 빠르지만 표현 안전선과 고객 부담 신호가 걱정될 때 먼저 만납니다.' },
  { name: '박재욱 사원', cue: '활동은 늘었지만 기록과 후속조치 기준이 아직 약할 때 먼저 만납니다.' },
  { name: '문교원 사원', cue: '의미·기준·피드백이 모호해 실행을 망설이는 신호가 보일 때 먼저 만납니다.' },
];

function V39OneOnOneSelectionGuide() {
  return (
    <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">선정 기준</p>
      <h3 className="mt-1 text-lg font-black text-slate-950">누구를 먼저 만날지 고르는 4가지 기준</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
        7명 중 마음에 걸리는 사람을 고르기 전에, 먼저 아래 기준으로 봅니다. 느낌만으로 고르지 않고 “왜 지금 이 사람인가”를 설명할 수 있어야 9단계 첫 문장도 자연스럽게 이어집니다.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {ONE_ON_ONE_SELECTION_CRITERIA.map((item, index) => (
          <article key={item.title} className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-xs font-bold leading-5 text-indigo-950">
            <p className="font-black text-slate-950">{index + 1}. {item.title}</p>
            <p className="mt-1">{item.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-3 rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-xs font-bold leading-5 text-cyan-950">
        <p className="font-black text-slate-950">팀 회의와 1on1을 구분합니다</p>
        <p className="mt-1">팀 전체 기준을 맞춰야 하는 문제는 팀 회의에서 다룹니다. 특정 팀원의 부담, 오해, 실행 기준, 성장 고민, 표현 안전선은 1on1에서 먼저 확인합니다.</p>
      </div>
    </section>
  );
}

function V39MemberSelectionCueList() {
  return (
    <section className="rounded-3xl border border-sky-100 bg-white p-4 shadow-sm md:p-5">
      <p className="text-xs font-black uppercase tracking-wide text-sky-700">한 줄 판단 기준</p>
      <h3 className="mt-1 text-lg font-black text-slate-950">7명별 먼저 만날지 판단하는 한 줄 기준</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
        아래 기준은 정답이 아닙니다. 팀장님의 실제 팀 상황과 비교해 “지금 먼저 대화해야 할 사람”을 좁히는 렌즈로만 사용합니다.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {MEMBER_SELECTION_CUES.map((item) => (
          <article key={item.name} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold leading-5 text-slate-700">
            <p className="font-black text-slate-950">{item.name}</p>
            <p className="mt-1">{item.cue}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function V39TeamSevenCoachingUxWrapper() {
  return (
    <section className="space-y-4" data-v39-team-seven-polish="true">
      <V39TeamSevenTextPolish />
      <V39FlowStrip currentStep={8} />
      <V39StepHero
        eyebrow="8단계 · 먼저 앉아 이야기할 사람 고르기"
        icon="👥"
        title="일을 나누기 전에, 먼저 이야기할 팀원을 떠올립니다"
        tone="indigo"
        description="7단계에서 정한 방향을 곧바로 배정표로 만들지 않습니다. 먼저 7명의 장면을 보며 우리 팀에서 떠오르는 사람을 생각해 봅니다. 지금 필요한 것은 일을 맡길 사람을 정하는 것이 아니라, 팀장이 먼저 만나 확인하고 도와야 할 사람을 고르는 일입니다."
        badges={[
          { label: '먼저 볼 것', value: '7명 장면', tone: 'indigo', icon: '👥' },
          { label: '직접 추가', value: '익명으로만', tone: 'sky', icon: '✍️' },
          { label: '오늘 고를 사람', value: '1~2명', tone: 'emerald', icon: '💬' },
          { label: 'AI 사용', value: '생각 정리', tone: 'amber', icon: '🧭' },
        ]}
      />

      <section className="rounded-3xl border border-indigo-100 bg-white p-4 shadow-sm md:p-5">
        <V39MiniFlow
          items={[
            { icon: '👥', title: '7명의 장면을 읽습니다', body: '업무 스타일, 고객 대응, 최근 말과 행동을 보며 실제 팀원이 떠오르는지 살펴봅니다.' },
            { icon: '✍️', title: '필요하면 익명으로 추가합니다', body: '딱 맞는 사람이 없을 때만 이름 없이 역할, 보이는 행동, 강점, 걱정되는 지점을 적습니다.' },
            { icon: '🧭', title: 'AI로 생각을 정리합니다', body: '대화문을 만들기 전에 먼저 만나야 하는 이유와 다음 화면으로 넘길 대화 초점만 정리합니다.' },
          ]}
        />

        <div className="mt-3">
          <V39MinimumChecklist
            tone="indigo"
            items={[
              '7명의 장면 훑어보기',
              '익명 추가 여부 판단',
              '먼저 1on1할 팀원 1~2명',
              '그 사람을 고른 이유',
              '다음 화면으로 넘길 대화 초점',
            ]}
          />
        </div>

        <div className="mt-3">
          <V39SafetyStrip>
            이 화면은 팀원을 평가하거나 줄 세우는 시간이 아닙니다. 성격을 단정하지 말고, 실제로 보인 말과 행동만 보고 판단합니다. 실제 이름, 고객명, 기관명, 제품명, 내부 숫자, 평가등급, 개인 사정은 입력하지 않습니다.
          </V39SafetyStrip>
        </div>
      </section>

      <V39OneOnOneSelectionGuide />
      <V39MemberSelectionCueList />
      <V39TeamSevenCoachingMap />
    </section>
  );
}
