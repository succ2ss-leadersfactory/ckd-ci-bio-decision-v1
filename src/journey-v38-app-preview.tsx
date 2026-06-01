import { createRoot } from 'react-dom/client';
import './index.css';
import { V38CustomerJudgmentLab } from './journey-v38-customer-judgment-lab';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

function V38PreviewApp() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl space-y-5">
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-cyan-200">C1Bio AI Leadership Lab</p>
          <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">v38 Preview · 고객군 판단 Lab</h1>
          <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
            v38은 DOM 후처리 없이 정식 React 컴포넌트 방식으로 구현합니다. 이 화면은 고객군 후보별 Data 확인과 분류를 한 카드 안에서 완료하도록 재구성한 첫 안정화 버전입니다.
          </p>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm md:p-6">
          <p className="font-black">AI·제약영업 안전선</p>
          <p className="mt-2 text-sm leading-6">
            본 실습은 교육용 가상 자료만 사용합니다. 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 정보, 내부 수치, 민감정보는 입력하지 않습니다.
          </p>
        </section>

        <V38CustomerJudgmentLab />

        <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-black text-slate-950">이동</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <a className="rounded-2xl bg-cyan-700 px-4 py-4 text-center text-sm font-black text-white" href="/journey-v38-preview.html">v38 새로고침</a>
            <a className="rounded-2xl border px-4 py-4 text-center text-sm font-black text-slate-800" href="/journey-v36-preview.html">v36 Preview</a>
            <a className="rounded-2xl border px-4 py-4 text-center text-sm font-black text-slate-800" href="/journey.html">운영 안정 버전</a>
          </div>
        </section>
      </div>
    </main>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V38PreviewApp />);
}
