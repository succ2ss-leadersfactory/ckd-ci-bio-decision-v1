import { useMemo, useState, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { V36_STORAGE_KEYS } from './journey-v36-preview-config';

type FinalCallPlan = {
  focusDirection?: string;
  customerSegmentPrinciples?: string;
  memberRoles?: string;
  beforeCallMaterials?: string;
  duringCallQuestions?: string;
  afterCallFollowUp?: string;
  crmRecordStandards?: string;
  actionsToAvoid?: string;
  complianceWarnings?: string;
  managerMessage?: string;
};

type CustomerCallPlanSnapshot = {
  selectedFocusSegment?: string;
  selectedDeprioritizedSegment?: string;
  segmentDecisionReason?: string;
  riskTradeoffMemo?: string;
  memberRoles?: Record<string, string>;
  finalCallPlan?: FinalCallPlan;
};

type MemberAction = {
  customerSegment: string;
  roleFocus: string;
  beforeCall: string;
  duringCall: string;
  afterCall24h: string;
  crmStandard: string;
  managerCheck: string;
  doNotDo: string;
};

type ActionMapResponse = {
  actionsByMember: Record<string, MemberAction>;
  teamCheckRhythm: string;
  riskMemo: string;
  aiPrompt: string;
  aiAnswer: string;
  reviewChecks: Record<string, boolean>;
  savedAt: string;
};

const TEAM_MEMBERS = ['신재영 대리', '이대은 대리', '박재욱 사원', '유희관 과장', '김문호 차장', '김재호 차장'];
const SEGMENT_LABELS: Record<string, string> = {
  A: 'A군: 반응 상승 고객군',
  B: 'B군: 관심은 있으나 지연되는 고객군',
  C: 'C군: 안정적 기존 관계 고객군',
  D: 'D군: 반응 낮고 이슈 민감 고객군',
};

const ACTION_TEMPLATES = [
  '콜 전 고객별 확인 질문 2개 준비',
  '공식 자료 범위 내 전달자료 확인',
  '콜 중 고객 니즈와 다음 행동 확인',
  '콜 후 24시간 내 CRM 기록 완료',
  '후속자료 전달 또는 다음 접점 예약',
  '고객 반응 신호를 팀 회의에 공유',
  '리스크 고객군 접근 빈도 조절',
  '팀장에게 장애 요인 1개 보고',
];

const REVIEW_ITEMS = [
  '집중 고객군과 팀원 역할이 연결되어 있는가?',
  '팀원별 행동이 서로 다르게 설계되었는가?',
  '콜 전·콜 중·콜 후 24시간 행동이 포함되어 있는가?',
  'CRM 기록 기준이 명확한가?',
  '팀장이 점검할 리듬이 작성되어 있는가?',
  '하지 않을 행동이 포함되어 있는가?',
  '컴플라이언스 위험 표현이 없는가?',
];

function createDefaultMemberAction(member: string, snapshot: CustomerCallPlanSnapshot): MemberAction {
  const focusSegment = snapshot.selectedFocusSegment || 'A';
  const memberRole = snapshot.memberRoles?.[member] || '고객군별 실행 역할을 선택하세요.';
  return {
    customerSegment: focusSegment,
    roleFocus: memberRole,
    beforeCall: '콜 전 고객별 확인 질문 2개 준비',
    duringCall: '고객의 정보 니즈와 추가 확인 필요사항을 질문',
    afterCall24h: '콜 후 24시간 내 CRM 기록과 후속조치 1개 완료',
    crmStandard: '고객 반응, 요청자료, 다음 행동, 주의 표현 기록',
    managerCheck: '주 1회 10분 점검',
    doNotDo: '효과 단정, 고객 압박, 민감정보 입력 금지',
  };
}

function createDefaultActions(snapshot: CustomerCallPlanSnapshot): Record<string, MemberAction> {
  return Object.fromEntries(TEAM_MEMBERS.map((member) => [member, createDefaultMemberAction(member, snapshot)]));
}

const DEFAULT_RESPONSE: ActionMapResponse = {
  actionsByMember: {},
  teamCheckRhythm: '월요일 10분 실행계획 확인, 금요일 15분 결과 신호 리뷰',
  riskMemo: '',
  aiPrompt: '',
  aiAnswer: '',
  reviewChecks: {},
  savedAt: '',
};

function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-2xl border bg-white p-5 shadow-sm"><h3 className="text-lg font-bold text-slate-900">{title}</h3><div className="mt-4 space-y-4">{children}</div></section>;
}

function FieldLabel({ children }: { children: string }) {
  return <span className="text-xs font-bold text-slate-500">{children}</span>;
}

function getSegmentName(id?: string) {
  return SEGMENT_LABELS[id || ''] || id || '-';
}

function buildActionMapPrompt(snapshot: CustomerCallPlanSnapshot, response: ActionMapResponse) {
  const actionLines = TEAM_MEMBERS.map((member) => {
    const action = response.actionsByMember[member];
    if (!action) return `- ${member}: 미작성`;
    return `- ${member}\n  고객군: ${getSegmentName(action.customerSegment)}\n  역할: ${action.roleFocus}\n  콜 전: ${action.beforeCall}\n  콜 중: ${action.duringCall}\n  콜 후 24시간: ${action.afterCall24h}\n  CRM: ${action.crmStandard}\n  팀장 점검: ${action.managerCheck}\n  하지 않을 행동: ${action.doNotDo}`;
  }).join('\n');

  return `당신은 제약영업 팀장의 2주 실행행동 Map을 점검하는 리더십 코치입니다.\n\n목표:\n고객군 판단과 팀원별 실행 특성을 바탕으로 2주 동안 실제 실행 가능한 행동인지 점검하세요.\n\n[Step 7 고객군 판단]\n- 집중 고객군: ${getSegmentName(snapshot.selectedFocusSegment)}\n- 제외/후순위 고객군: ${getSegmentName(snapshot.selectedDeprioritizedSegment)}\n- 선택 이유: ${snapshot.segmentDecisionReason || '-'}\n- 포기 비용/리스크: ${snapshot.riskTradeoffMemo || '-'}\n\n[Step 7 최종 콜플랜]\n- 2주 집중 방향: ${snapshot.finalCallPlan?.focusDirection || '-'}\n- 고객군별 접근 원칙: ${snapshot.finalCallPlan?.customerSegmentPrinciples || '-'}\n- 콜 후 24시간 내 후속조치: ${snapshot.finalCallPlan?.afterCallFollowUp || '-'}\n- CRM 기록 기준: ${snapshot.finalCallPlan?.crmRecordStandards || '-'}\n- 하지 않을 행동: ${snapshot.finalCallPlan?.actionsToAvoid || '-'}\n- 컴플라이언스 주의 표현: ${snapshot.finalCallPlan?.complianceWarnings || '-'}\n\n[팀원별 실행행동 Map]\n${actionLines}\n\n[팀 점검 리듬]\n${response.teamCheckRhythm || '-'}\n\n검토 요청:\n1. 팀원별 행동이 고객군 판단과 연결되어 있는지 점검하세요.\n2. 각 행동이 2주 안에 실행 가능한지 점검하세요.\n3. 콜 전·콜 중·콜 후 24시간 행동이 충분한지 보완하세요.\n4. CRM 기록 기준과 팀장 점검 리듬을 보완하세요.\n5. 컴플라이언스 위험 표현이나 무리한 행동을 지적하세요.\n\n출력 형식:\n## 1. 강점\n## 2. 빠진 실행 요소\n## 3. 팀원별 보완 제안\n## 4. 점검 리듬 보완\n## 5. 위험 표현과 하지 않을 행동`;
}

export function ActionMapLab() {
  const [snapshot] = useStored<CustomerCallPlanSnapshot>(V36_STORAGE_KEYS.customerCallPlan, {});
  const [storedResponse, setResponse] = useStored<ActionMapResponse>(V36_STORAGE_KEYS.actionMap, DEFAULT_RESPONSE);
  const hydratedActions = Object.keys(storedResponse.actionsByMember ?? {}).length ? storedResponse.actionsByMember : createDefaultActions(snapshot);
  const response = { ...DEFAULT_RESPONSE, ...storedResponse, actionsByMember: hydratedActions, reviewChecks: storedResponse.reviewChecks ?? {} };
  const [copyMessage, setCopyMessage] = useState('');
  const prompt = useMemo(() => response.aiPrompt || buildActionMapPrompt(snapshot, response), [snapshot, response]);
  const checkedCount = REVIEW_ITEMS.filter((item) => response.reviewChecks[item]).length;

  const update = (patch: Partial<ActionMapResponse>) => {
    setResponse({ ...response, ...patch, savedAt: new Date().toISOString() });
  };

  const updateMemberAction = (member: string, patch: Partial<MemberAction>) => {
    update({ actionsByMember: { ...response.actionsByMember, [member]: { ...response.actionsByMember[member], ...patch } } });
  };

  const resetFromCallPlan = () => {
    update({ actionsByMember: createDefaultActions(snapshot) });
    setCopyMessage('Step 7 콜플랜 기준으로 팀원별 실행행동 Map을 다시 불러왔습니다.');
  };

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyMessage('실행행동 Map 점검 프롬프트를 복사했습니다.');
    } catch {
      setCopyMessage('복사가 차단되었습니다. 프롬프트 영역을 직접 선택해 복사하세요.');
    }
  };

  const outputText = `[2주 실행행동 Map]\n\n[집중 고객군]\n${getSegmentName(snapshot.selectedFocusSegment)}\n\n[제외/후순위 고객군]\n${getSegmentName(snapshot.selectedDeprioritizedSegment)}\n\n[팀원별 실행행동]\n${TEAM_MEMBERS.map((member) => {
    const action = response.actionsByMember[member];
    return `${member}: ${getSegmentName(action.customerSegment)} / ${action.roleFocus} / 콜 전: ${action.beforeCall} / 콜 후: ${action.afterCall24h}`;
  }).join('\n')}\n\n[팀 점검 리듬]\n${response.teamCheckRhythm}\n\n[리스크 메모]\n${response.riskMemo}`;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-bold">실행행동 Map Lab</p>
        <p className="mt-1">Step 7의 고객군 판단과 콜플랜을 팀원별 2주 실행행동으로 번역합니다. 목표는 좋은 계획이 아니라 월요일부터 움직일 행동을 정하는 것입니다.</p>
      </div>

      <SectionCard title="1단계: Step 7 고객군 판단 불러오기">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-900">집중 고객군</p><p className="mt-2">{getSegmentName(snapshot.selectedFocusSegment)}</p><p className="mt-2 text-slate-600">{snapshot.segmentDecisionReason || '선택 이유가 아직 없습니다.'}</p></div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-900">제외/후순위 고객군</p><p className="mt-2">{getSegmentName(snapshot.selectedDeprioritizedSegment)}</p><p className="mt-2 text-slate-600">{snapshot.riskTradeoffMemo || '포기 비용/리스크 메모가 아직 없습니다.'}</p></div>
        </div>
        <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white" onClick={resetFromCallPlan}>Step 7 콜플랜 기준으로 다시 불러오기</button>
      </SectionCard>

      <SectionCard title="2단계: 팀원별 2주 실행행동 설계">
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">각 팀원에게 고객군, 역할, 콜 전·콜 중·콜 후 24시간 행동, CRM 기준, 팀장 점검 방식을 다르게 배정합니다.</div>
        <div className="space-y-4">
          {TEAM_MEMBERS.map((member) => {
            const action = response.actionsByMember[member];
            return (
              <article key={member} className="rounded-2xl border bg-white p-4 text-sm shadow-sm">
                <h4 className="font-black text-slate-900">{member}</h4>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <label className="block space-y-1"><FieldLabel>담당 고객군</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={action.customerSegment} onChange={(event) => updateMemberAction(member, { customerSegment: event.target.value })}>{Object.entries(SEGMENT_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
                  <label className="block space-y-1"><FieldLabel>역할 초점</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={action.roleFocus} onChange={(event) => updateMemberAction(member, { roleFocus: event.target.value })} /></label>
                  <label className="block space-y-1"><FieldLabel>콜 전 준비</FieldLabel><select className="w-full rounded-xl border px-3 py-2" value={action.beforeCall} onChange={(event) => updateMemberAction(member, { beforeCall: event.target.value })}>{ACTION_TEMPLATES.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
                  <label className="block space-y-1"><FieldLabel>콜 중 행동</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={action.duringCall} onChange={(event) => updateMemberAction(member, { duringCall: event.target.value })} /></label>
                  <label className="block space-y-1"><FieldLabel>콜 후 24시간 내 행동</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={action.afterCall24h} onChange={(event) => updateMemberAction(member, { afterCall24h: event.target.value })} /></label>
                  <label className="block space-y-1"><FieldLabel>CRM 기록 기준</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={action.crmStandard} onChange={(event) => updateMemberAction(member, { crmStandard: event.target.value })} /></label>
                  <label className="block space-y-1"><FieldLabel>팀장 점검 방식</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={action.managerCheck} onChange={(event) => updateMemberAction(member, { managerCheck: event.target.value })} /></label>
                  <label className="block space-y-1"><FieldLabel>하지 않을 행동</FieldLabel><input className="w-full rounded-xl border px-3 py-2" value={action.doNotDo} onChange={(event) => updateMemberAction(member, { doNotDo: event.target.value })} /></label>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="3단계: 팀 점검 리듬과 리스크 정리">
        <label className="block space-y-1"><FieldLabel>팀 점검 리듬</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.teamCheckRhythm} onChange={(event) => update({ teamCheckRhythm: event.target.value })} /></label>
        <label className="block space-y-1"><FieldLabel>리스크 메모</FieldLabel><textarea className="min-h-24 w-full rounded-xl border px-3 py-2" value={response.riskMemo} onChange={(event) => update({ riskMemo: event.target.value })} placeholder="무리한 접촉, 고객 압박, CRM 지연, 팀원별 과부하 등 점검할 리스크를 작성하세요." /></label>
      </SectionCard>

      <SectionCard title="4단계: AI로 실행가능성 점검">
        <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm text-slate-600">팀원별 실행행동 Map이 2주 안에 실행 가능한지 AI로 점검합니다.</p><button className="rounded-xl bg-cyan-700 px-4 py-2 text-sm font-bold text-white" onClick={copyPrompt}>점검 프롬프트 복사</button></div>
        {copyMessage ? <p className="text-sm font-semibold text-cyan-700">{copyMessage}</p> : null}
        <textarea className="min-h-32 w-full rounded-xl border px-3 py-2" value={prompt} onChange={(event) => update({ aiPrompt: event.target.value })} />
        <textarea className="min-h-40 w-full rounded-xl border px-3 py-2" value={response.aiAnswer} onChange={(event) => update({ aiAnswer: event.target.value })} placeholder="AI 점검 답변을 붙여넣고, 필요한 보완점을 팀원별 행동에 반영하세요." />
      </SectionCard>

      <SectionCard title="최종 점검과 산출물">
        <div className="grid gap-2 md:grid-cols-2">{REVIEW_ITEMS.map((item) => <label key={item} className="flex items-start gap-2 rounded-xl border p-3 text-sm"><input type="checkbox" className="mt-1" checked={Boolean(response.reviewChecks[item])} onChange={(event) => update({ reviewChecks: { ...response.reviewChecks, [item]: event.target.checked } })} /><span>{item}</span></label>)}</div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">점검 완료: {checkedCount} / {REVIEW_ITEMS.length}</div>
        <pre className="whitespace-pre-wrap rounded-2xl bg-slate-900 p-4 text-xs leading-5 text-slate-100">{outputText}</pre>
        <p className="text-xs text-slate-500">자동 저장 키: {V36_STORAGE_KEYS.actionMap} / 마지막 저장: {response.savedAt || '아직 입력 전'}</p>
      </SectionCard>
    </div>
  );
}

export default ActionMapLab;
