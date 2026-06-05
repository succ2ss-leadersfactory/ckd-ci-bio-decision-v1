import { V39ResearchStrategyLab } from './journey-v39-research-strategy-lab';

const V39_NOTEBOOKLM_GUIDED_RESEARCH_SMOKE_MARKERS = [
  'V39NotebookLmGuidedResearchLab',
  'NotebookLM 사용 순서 안내',
  '소스 묶음은 실행 프롬프트가 아닙니다',
  '소스를 추가한 뒤 채팅창에 프롬프트를 붙여넣습니다',
  '5단계로 넘길 실행 질문 확정하기',
  '발표문을 완성하는 시간이 아닙니다',
].join('|');
void V39_NOTEBOOKLM_GUIDED_RESEARCH_SMOKE_MARKERS;

export function V39NotebookLmGuidedResearchLab() {
  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-amber-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700">NotebookLM 사용 순서 안내</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">소스 묶음은 실행 프롬프트가 아닙니다</h2>
        <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">
          NotebookLM에서는 먼저 소스를 추가하고, 그다음 채팅창에 질문을 넣어야 합니다. 소스 묶음을 출처 칸에 붙여넣기만 하면 답변이 실행되지 않습니다.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">1. 소스 묶음 복사</p>
            <p className="mt-1">웹앱의 소스 묶음은 NotebookLM 왼쪽 출처 영역에 추가할 참고자료입니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">2. NotebookLM에 소스 추가</p>
            <p className="mt-1">소스 입력칸에 붙여넣은 뒤 오른쪽 아래 화살표를 눌러 저장된 소스로 추가합니다. 소스 개수가 0이면 아직 추가되지 않은 상태입니다.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">3. 프롬프트는 채팅창에 입력</p>
            <p className="mt-1">소스가 추가된 뒤 웹앱의 NotebookLM 프롬프트를 복사해 가운데 채팅창에 붙여넣고 실행합니다.</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">4단계 최종 점검 안내</p>
        <h2 className="mt-1 text-xl font-black text-slate-950">5단계로 넘길 실행 질문 확정하기</h2>
        <p className="mt-2 max-w-4xl text-sm font-bold leading-6 text-slate-600">
          발표문을 완성하는 시간이 아닙니다. AI 리서치 결과를 팀장 언어로 짧게 정리하고, 다음 단계에서 관리 지표로 바꿀 실행 질문을 확정합니다.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold leading-5 text-emerald-950">
            <p className="font-black">팀장 설명 메모</p>
            <p className="mt-1">전략회의나 팀 회의에서 설명할 핵심 메시지만 3줄 이내로 정리합니다.</p>
          </div>
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-xs font-bold leading-5 text-sky-950">
            <p className="font-black">예상 질문 2개</p>
            <p className="mt-1">상사·본사 관점 질문 1개와 팀원 관점 질문 1개만 잡고 답변 방향을 적습니다.</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs font-bold leading-5 text-amber-950">
            <p className="font-black">최종 확인</p>
            <p className="mt-1">가장 중요한 것은 5단계 관리 지표로 바꿀 실행 질문이 별도 카드에 남았는지입니다.</p>
          </div>
        </div>
      </section>

      <V39ResearchStrategyLab />
    </section>
  );
}
