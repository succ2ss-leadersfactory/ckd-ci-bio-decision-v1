import { createRoot } from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

function V38PreviewApp() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 md:px-8 md:py-10">
      <div className="mx-auto max-w-4xl space-y-4">
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-cyan-200">C1Bio AI Leadership Lab</p>
          <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">v38 Preview Shell</h1>
          <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
            v38은 v37의 DOM 후처리 방식을 버리고, 정식 React 컴포넌트 방식으로 고객군 판단 Lab을 다시 안정화하기 위한 새 미리보기 경로입니다.
          </p>
        </section>

        <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-black text-slate-950">현재 확인할 수 있는 것</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
            <li>v38 route가 독립적으로 열리는지 확인합니다.</li>
            <li>v34 운영 화면과 v35/v36 preview 구조는 건드리지 않습니다.</li>
            <li>다음 단계에서 고객군 판단 Lab을 통합 카드형 React 컴포넌트로 다시 붙입니다.</li>
          </ul>
        </section>

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
