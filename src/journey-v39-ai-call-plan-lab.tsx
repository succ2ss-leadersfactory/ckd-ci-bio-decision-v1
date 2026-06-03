import { useMemo, useState } from 'react';
import { V38AiCallPlanLab } from './journey-v38-ai-call-plan-lab';
import {
  type V39MemberRoleResult,
  loadV39MemberRoleResult,
} from './journey-v39-member-role-result-store';

function buildCallPlanContextPrompt(roleResult: V39MemberRoleResult) {
  const savedRoles = Object.values(roleResult.roles).filter((role) => role.roleMission.trim());

  if (savedRoles.length === 0) {
    return [
      '아직 8단계 팀원 역할 배정 결과가 저장되지 않았습니다.',
      '먼저 8단계에서 담당 고객군, 역할 미션, 코칭 초점, 리스크 안전선, 콜플랜 준비물을 정리하세요.',
    ].join('\n');
  }

  return [
    '아래 내용은 교육용 가상 고객군과 팀원 역할 배정 결과입니다.',
    '실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 수치, 개인정보는 포함하지 않습니다.',
    '',
    '8단계 팀원 역할 배정 결과:',
    ...savedRoles.flatMap((role, index) => [
      `${index + 1}. ${role.memberLabel}`,
      `- 담당 고객군: ${role.assignedCustomers || '아직 정리되지 않았습니다.'}`,
      `- 역할 미션: ${role.roleMission || '아직 정리되지 않았습니다.'}`,
      `- 코칭 초점: ${role.coachingFocus || '아직 정리되지 않았습니다.'}`,
      `- 리스크 안전선: ${role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}`,
      `- 콜플랜 준비물: ${role.callPlanPrep || '방문 전 확인 질문과 사용 가능한 자료 범위 확인'}`,
      '',
    ]),
    'AI Call Plan 요청 시 위 내용을 바탕으로 고객군별 2주 콜 우선순위, 팀원별 실행 역할, 방문 전 질문, 컴플라이언스 안전 표현, 리스크 점검표를 작성해 주세요.',
  ].join('\n');
}

function V39MemberRoleCallPlanBridgePanel({ roleResult, onRefresh }: { roleResult: V39MemberRoleResult; onRefresh: () => void }) {
  const savedRoles = Object.values(roleResult.roles).filter((role) => role.roleMission.trim());
  const [copied, setCopied] = useState(false);
  const callPlanContextPrompt = useMemo(() => buildCallPlanContextPrompt(roleResult), [roleResult]);

  const copyBridgePrompt = async () => {
    try {
      await navigator.clipboard.writeText(callPlanContextPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-3xl border border-sky-100 bg-sky-50 p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-sky-700">Member Role Bridge</p>
          <h2 className="mt-2 text-xl font-black text-slate-950">8단계 팀원 역할 배정을 AI Call Plan에 연결</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            8단계에서 저장한 담당 고객군, 역할 미션, 코칭 초점, 리스크 안전선, 콜플랜 준비물을 9단계 AI 프롬프트 작성 전에 다시 확인합니다.
            이 요약은 AI에게 답을 맡기기 위한 자료가 아니라, 팀장이 요청 맥락을 안전하게 정리하기 위한 입력 초안입니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="rounded-full border bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm" onClick={onRefresh}>
            8단계 역할 결과 새로고침
          </button>
          <button type="button" className="rounded-full bg-sky-700 px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-sky-800" onClick={copyBridgePrompt}>
            {copied ? '연결 프롬프트 복사 완료' : '연결 프롬프트 복사'}
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장 상태</p>
          <p className="mt-1 text-sm font-black text-slate-900">{roleResult.updatedAt ? '저장 결과 있음' : '저장 결과 없음'}</p>
          {roleResult.updatedAt ? <p className="mt-1 text-xs font-bold text-slate-500">{roleResult.updatedAt}</p> : null}
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">저장된 역할</p>
          <p className="mt-1 text-sm font-black text-slate-900">{savedRoles.length}개</p>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-xs font-black text-slate-500">다음 단계</p>
          <p className="mt-1 text-sm font-black text-slate-900">AI Call Plan 프롬프트 맥락화</p>
        </div>
      </div>

      {savedRoles.length === 0 ? (
        <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
          8단계에서 9단계 연결용 팀원 역할 배정 결과를 저장하면, 이곳에 AI Call Plan 입력 맥락이 표시됩니다.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 xl:grid-cols-3">
          {savedRoles.slice(0, 6).map((role) => (
            <article key={role.memberRoleId} className="rounded-2xl border bg-white p-4 shadow-sm">
              <p className="font-black text-slate-950">{role.memberLabel}</p>
              <p className="mt-2 text-xs font-black text-sky-700">담당 고객군</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.assignedCustomers || '아직 정리되지 않았습니다.'}</p>
              <p className="mt-2 text-xs font-black text-slate-500">역할 미션</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.roleMission}</p>
              <p className="mt-2 text-xs font-black text-slate-500">콜플랜 준비물</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.callPlanPrep || '방문 전 확인 질문과 사용 가능한 자료 범위 확인'}</p>
              <p className="mt-2 text-xs font-black text-amber-700">리스크 안전선</p>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-700">{role.riskGuardrail || '표현·자료·접촉 강도 안전선 확인'}</p>
            </article>
          ))}
        </div>
      )}

      <label className="mt-4 block rounded-2xl border bg-white p-4 shadow-sm">
        <span className="text-sm font-black text-slate-950">복사해서 AI Call Plan 프롬프트에 붙일 연결 맥락</span>
        <textarea className="mt-3 min-h-80 w-full rounded-2xl border bg-slate-50 px-4 py-3 font-mono text-xs leading-6 text-slate-900" value={callPlanContextPrompt} readOnly />
      </label>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold leading-5 text-amber-950">
        9단계에서도 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보는 입력하지 않습니다.
        AI에게 요청할 때도 교육용 가상 고객군과 팀원 역할 맥락만 사용합니다.
      </div>
    </section>
  );
}

export function V39AiCallPlanLab() {
  const [memberRoleResult, setMemberRoleResult] = useState(() => loadV39MemberRoleResult());

  const refreshMemberRoleResult = () => {
    setMemberRoleResult(loadV39MemberRoleResult());
  };

  return (
    <section className="space-y-4">
      <V39MemberRoleCallPlanBridgePanel roleResult={memberRoleResult} onRefresh={refreshMemberRoleResult} />
      <V38AiCallPlanLab />
    </section>
  );
}
