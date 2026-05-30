import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

type R = Record<string, any>;

const WEBAPP_URL = (import.meta.env.VITE_GOOGLE_SCRIPT_WEBAPP_URL || '') as string;
const CP = '실제 병원명, 의료진명, 제품명, 매출·처방 정보는 입력하지 마세요. 본 실습은 교육용 가상 자료만 사용합니다.';

const screenNames: R = {
  'M-P01': '입장',
  'M-P02': '과정 안내',
  'M-P03': 'AI 안전선 카드',
  'M-P04': '좋은 질문 만들기',
  'M-P05': 'Dashboard Lab',
  'M-P06': '실행행동 Map',
  'M-P07': '이해관계자 메시지',
  'M-P08': '성과대화 감별',
  'M-P09': '콜플랜 요청문',
  'M-P10': '본사 요청 번역',
  'M-P11': '1on1 코칭',
  'M-P12': '실행계획'
};

function Card({ children, className = '' }: any) {
  return <div className={'rounded-2xl border bg-white p-5 shadow-sm ' + className}>{children}</div>;
}

async function callGoogle(action: string, payload: R = {}) {
  if (!WEBAPP_URL) throw new Error('VITE_GOOGLE_SCRIPT_WEBAPP_URL is not configured');
  const response = await fetch(WEBAPP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload })
  });
  const result = await response.json();
  if (!result.ok) throw new Error(result.error || 'Google Script request failed');
  return result.data;
}

function safeParse(value: any) {
  if (!value || typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
}

function byParticipant(rows: any[]) {
  const map: R = {};
  rows.forEach((row) => {
    const pid = row.participantId || 'unknown';
    if (!map[pid]) map[pid] = [];
    map[pid].push(row);
  });
  return map;
}

function latestScreen(rows: any[]) {
  const sorted = [...rows].sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')));
  return sorted[0]?.screenId || '-';
}

function App() {
  const [sessionCode, setSessionCode] = useState('C1BIO-1차');
  const [data, setData] = useState<R | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const participants = data?.Participants || [];
  const responses = data?.Responses || [];
  const progress = data?.ModuleProgress || [];
  const grouped = byParticipant(responses);
  const participantCount = participants.length;
  const responseCount = responses.length;
  const activeParticipantCount = Object.keys(grouped).length;
  const latestUpdated = responses.map((r: any) => r.updatedAt || r.createdAt).filter(Boolean).sort().reverse()[0] || '-';

  async function refresh() {
    setLoading(true);
    try {
      const result = await callGoogle('getDashboardData', { sessionCode });
      setData(result);
      setLogs((x) => [`✅ ${new Date().toLocaleTimeString()} 데이터 조회 성공`, ...x].slice(0, 20));
    } catch (error: any) {
      setLogs((x) => [`❌ ${new Date().toLocaleTimeString()} 조회 실패: ${String(error?.message || error)}`, ...x].slice(0, 20));
    } finally {
      setLoading(false);
    }
  }

  function copySummary() {
    navigator.clipboard?.writeText(JSON.stringify(data, null, 2));
    setLogs((x) => [`📋 ${new Date().toLocaleTimeString()} 전체 데이터 복사`, ...x].slice(0, 20));
  }

  return <div className="mx-auto max-w-7xl p-5">
    <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold">C1바이오 강사용 Live Dashboard</h1>
        <p className="text-slate-600">Google Sheets 데이터를 불러와 여러 참여자의 진행 상황을 확인합니다.</p>
      </div>
      <div className="flex gap-2">
        <button className="rounded-xl border px-4 py-2" onClick={() => location.href = '/'}>참여자 앱</button>
        <button className="rounded-xl bg-cyan-700 px-4 py-2 text-white" onClick={() => location.href = '/?view=check'}>사전점검</button>
      </div>
    </header>

    <div className="safe mb-4 rounded-xl px-4 py-3 text-sm font-medium">{CP}</div>

    <Card>
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <label>
          <b className="text-sm">세션코드</b>
          <input className="mt-1 w-full rounded-xl border p-3" value={sessionCode} onChange={(e) => setSessionCode(e.target.value)} />
        </label>
        <button className="self-end rounded-xl bg-slate-900 px-5 py-3 text-white" onClick={refresh} disabled={loading}>{loading ? '조회 중...' : 'Sheets 데이터 불러오기'}</button>
        <button className="self-end rounded-xl border px-5 py-3" onClick={copySummary}>전체 데이터 복사</button>
      </div>
      <p className="mt-3 text-sm text-slate-600">Google Script URL: <b>{WEBAPP_URL ? '설정됨' : '미설정'}</b></p>
    </Card>

    <div className="mt-4 grid gap-4 md:grid-cols-4">
      <Card><b>참여자 수</b><br /><span className="text-2xl font-bold text-cyan-800">{participantCount}</span></Card>
      <Card><b>응답 수</b><br /><span className="text-2xl font-bold text-cyan-800">{responseCount}</span></Card>
      <Card><b>응답 참여자</b><br /><span className="text-2xl font-bold text-cyan-800">{activeParticipantCount}</span></Card>
      <Card><b>최근 저장</b><br /><span className="text-sm text-slate-700">{latestUpdated}</span></Card>
    </div>

    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="text-lg font-bold">참여자 진행 요약</h2>
        {participants.length === 0 && <p className="mt-3 text-sm text-slate-500">아직 조회된 참여자 데이터가 없습니다.</p>}
        <div className="mt-3 grid gap-2">
          {participants.map((p: any) => {
            const rows = grouped[p.participantId] || [];
            const last = latestScreen(rows);
            return <details key={p.participantId} className="rounded-xl border p-3">
              <summary className="cursor-pointer font-semibold">{p.name || '이름 없음'} · {p.teamName || '-'} · 응답 {rows.length}건 · 최근 {screenNames[last] || last}</summary>
              <div className="mt-3 grid gap-2">
                {rows.map((r: any, idx: number) => <div key={idx} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <b>{screenNames[r.screenId] || r.screenId}</b> · {r.activityName}<br />
                  <span className="text-slate-500">{r.updatedAt || r.createdAt}</span>
                </div>)}
              </div>
            </details>;
          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-bold">모듈별 응답 현황</h2>
        <div className="mt-3 grid gap-2">
          {Object.keys(screenNames).map((screenId) => {
            const count = responses.filter((r: any) => r.screenId === screenId).length;
            return <div key={screenId} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span>{screenNames[screenId]}</span>
              <b>{count}건</b>
            </div>;
          })}
        </div>
      </Card>
    </div>

    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <Card>
        <h2 className="text-lg font-bold">최근 응답 상세</h2>
        <div className="mt-3 grid gap-2">
          {[...responses].reverse().slice(0, 12).map((r: any, idx: number) => {
            const output = safeParse(r.outputData);
            return <details key={idx} className="rounded-xl border p-3">
              <summary className="cursor-pointer font-semibold">{screenNames[r.screenId] || r.screenId} · {r.teamName || '-'} · {r.participantId}</summary>
              <pre className="preline mt-2 max-h-72 overflow-auto rounded-xl bg-slate-100 p-3 text-xs">{JSON.stringify(output || r, null, 2)}</pre>
            </details>;
          })}
        </div>
      </Card>
      <Card>
        <h2 className="text-lg font-bold">운영 로그</h2>
        <pre className="preline mt-3 max-h-72 overflow-auto rounded-xl bg-slate-100 p-3 text-xs">{logs.join('\n')}</pre>
        <h2 className="mt-5 text-lg font-bold">원본 데이터</h2>
        <pre className="preline mt-3 max-h-72 overflow-auto rounded-xl bg-slate-100 p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
      </Card>
    </div>
  </div>;
}

createRoot(document.getElementById('instructor-live-root')!).render(<App />);
