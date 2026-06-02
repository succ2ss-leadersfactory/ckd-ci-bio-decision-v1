import type { V38TeamMember } from './journey-v38-dashboard-analysis-data';
import type { V38MemberPrep } from './journey-v38-dashboard-analysis-parsers';
import { V38PrepTextarea as PrepTextarea } from './journey-v38-dashboard-analysis-ui';

export function V38SelectedMemberPrepPanel({
  member,
  current,
  defaultOpen,
  onUpdate,
}: {
  member: V38TeamMember;
  current: V38MemberPrep;
  defaultOpen: boolean;
  onUpdate: (field: keyof V38MemberPrep, value: string) => void;
}) {
  return (
    <details className="rounded-3xl border bg-slate-50 shadow-sm" open={defaultOpen}>
      <summary className="cursor-pointer list-none p-4">
        <p className="font-black text-slate-950">{member.name}</p>
        <p className="mt-1 text-xs font-bold text-slate-600">{member.profile}</p>
      </summary>
      <div className="border-t p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <PrepTextarea label="팀원별 관찰 신호" value={current.observedSignal} onChange={(value) => onUpdate('observedSignal', value)} />
          <PrepTextarea label="강점으로 볼 수 있는 신호" value={current.strengthSignal} onChange={(value) => onUpdate('strengthSignal', value)} />
          <PrepTextarea label="우려 또는 확인이 필요한 신호" value={current.concernSignal} onChange={(value) => onUpdate('concernSignal', value)} />
          <PrepTextarea label="추가로 확인해야 할 질문" value={current.checkQuestion} onChange={(value) => onUpdate('checkQuestion', value)} />
          <PrepTextarea label="성급하게 단정하면 안 되는 점" value={current.doNotAssume} onChange={(value) => onUpdate('doNotAssume', value)} />
        </div>
      </div>
    </details>
  );
}
