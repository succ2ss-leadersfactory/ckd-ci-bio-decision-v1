export const V39_MEMBER_ROLE_RESULT_SCHEMA_VERSION = 1;

export const V39_MEMBER_ROLE_RESULT_STORAGE_KEY = 'ckd.v39.memberRole.result.v1';

export type V39MemberRoleResultItem = {
  memberRoleId: string;
  memberLabel: string;
  assignedCustomers: string;
  roleMission: string;
  coachingFocus: string;
  riskGuardrail: string;
  callPlanPrep: string;
};

export type V39MemberRoleResult = {
  schemaVersion: number;
  updatedAt: string;
  roles: Record<string, V39MemberRoleResultItem>;
};

export function createEmptyV39MemberRoleItem(memberRoleId: string, memberLabel: string): V39MemberRoleResultItem {
  return {
    memberRoleId,
    memberLabel,
    assignedCustomers: '',
    roleMission: '',
    coachingFocus: '',
    riskGuardrail: '',
    callPlanPrep: '',
  };
}

export function createEmptyV39MemberRoleResult(): V39MemberRoleResult {
  return {
    schemaVersion: V39_MEMBER_ROLE_RESULT_SCHEMA_VERSION,
    updatedAt: '',
    roles: {},
  };
}

function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function normalizeV39MemberRoleItem(
  value: unknown,
  fallbackMemberRoleId: string,
  fallbackMemberLabel: string,
): V39MemberRoleResultItem {
  if (!value || typeof value !== 'object') {
    return createEmptyV39MemberRoleItem(fallbackMemberRoleId, fallbackMemberLabel);
  }

  const source = value as Partial<V39MemberRoleResultItem>;

  return {
    memberRoleId: normalizeText(source.memberRoleId) || fallbackMemberRoleId,
    memberLabel: normalizeText(source.memberLabel) || fallbackMemberLabel,
    assignedCustomers: normalizeText(source.assignedCustomers),
    roleMission: normalizeText(source.roleMission),
    coachingFocus: normalizeText(source.coachingFocus),
    riskGuardrail: normalizeText(source.riskGuardrail),
    callPlanPrep: normalizeText(source.callPlanPrep),
  };
}

export function normalizeV39MemberRoleResult(value: unknown): V39MemberRoleResult {
  if (!value || typeof value !== 'object') return createEmptyV39MemberRoleResult();

  const source = value as Partial<V39MemberRoleResult>;
  const rawRoles = source.roles && typeof source.roles === 'object' ? source.roles : {};
  const roles: Record<string, V39MemberRoleResultItem> = {};

  for (const [memberRoleId, role] of Object.entries(rawRoles)) {
    roles[memberRoleId] = normalizeV39MemberRoleItem(role, memberRoleId, memberRoleId);
  }

  return {
    schemaVersion: V39_MEMBER_ROLE_RESULT_SCHEMA_VERSION,
    updatedAt: normalizeText(source.updatedAt),
    roles,
  };
}

export function saveV39MemberRoleResult(result: V39MemberRoleResult) {
  window.localStorage.setItem(
    V39_MEMBER_ROLE_RESULT_STORAGE_KEY,
    JSON.stringify({
      ...normalizeV39MemberRoleResult(result),
      updatedAt: new Date().toISOString(),
    }),
  );
}

export function loadV39MemberRoleResult(): V39MemberRoleResult {
  const raw = window.localStorage.getItem(V39_MEMBER_ROLE_RESULT_STORAGE_KEY);
  if (!raw) return createEmptyV39MemberRoleResult();

  try {
    return normalizeV39MemberRoleResult(JSON.parse(raw));
  } catch {
    return createEmptyV39MemberRoleResult();
  }
}

export function clearV39MemberRoleResult() {
  window.localStorage.removeItem(V39_MEMBER_ROLE_RESULT_STORAGE_KEY);
}
