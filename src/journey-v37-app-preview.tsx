import { createRoot } from 'react-dom/client';
import './index.css';

const rootElement = document.getElementById('journey-root') ?? document.getElementById('root');

function V37RecoveryPage() {
  const currentOrigin = window.location.origin;
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 md:px-8 md:py-10">
      <div className="mx-auto max-w-3xl space-y-4">
        <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm md:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-cyan-200">C1Bio AI Leadership Lab</p>
          <h1 className="mt-3 text-2xl font-black leading-tight md:text-3xl">v37 Preview 복구 화면</h1>
          <p className="mt-3 text-sm leading-6 text-slate-200 md:text-base">
            v37 고객군 판단 개선 화면은 모바일 브라우저에서 로딩 문제가 확인되어 안정화 중입니다. 교육 진행은 아래 안정 경로를 사용해 주세요.
          </p>
        </section>

        <section className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-black text-slate-950">바로 이동</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <a className="rounded-2xl bg-cyan-700 px-4 py-4 text-center text-sm font-black text-white" href={`${currentOrigin}/journey.html`}>
              운영 안정 버전으로 이동
            </a>
            <a className="rounded-2xl border px-4 py-4 text-center text-sm font-black text-slate-800" href={`${currentOrigin}/journey-v36-preview.html`}>
              v36 Preview로 이동
            </a>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 md:p-6">
          <h2 className="text-lg font-black">현재 상태</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">
            <li>v34 운영 화면은 보호합니다.</li>
            <li>v37 고객군 판단 개선안은 정식 React 컴포넌트 방식으로 다시 안정화할 예정입니다.</li>
            <li>기존 브라우저 저장값 때문에 문제가 반복되면 사이트 데이터 삭제 또는 시크릿 탭 접속을 권장합니다.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

if (rootElement) {
  createRoot(rootElement).render(<V37RecoveryPage />);
}
