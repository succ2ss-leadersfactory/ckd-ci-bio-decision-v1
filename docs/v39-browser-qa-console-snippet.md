# v39 Browser QA Console Snippet

이 문서는 `/journey-v39-preview.html` 브라우저 수동 QA 중 localStorage 저장 연결, 화면 핵심 문구, 금지 표현 노출 여부를 빠르게 확인하기 위한 콘솔 스니펫이다.

사용 위치:

```txt
/journey-v39-preview.html
```

사용 방법:

1. `/journey-v39-preview.html`에 접속한다.
2. `docs/v39-browser-qa-runbook.md` 기준으로 5~13단계를 이동하며 최소 입력을 수행한다.
3. 브라우저 개발자도구를 연다.
4. Console 탭에 아래 스니펫을 붙여넣고 실행한다.
5. 출력된 결과를 `docs/v39-browser-qa-result.md`의 근거로 사용한다.

---

## Console snippet

```js
(() => {
  const requiredStorageKeys = [
    'ckd.v39.dashboardAnalysis.result.v1',
    'ckd.v39.customerJudgment.result.v1',
    'ckd.v39.customerStrategy.result.v1',
    'ckd.v39.memberRole.result.v1',
    'ckd.v39.peopleDialogue.result.v1',
    'ckd.v39.aiCallPlan.result.v1',
    'ckd.v39.complianceCleanup.result.v1',
    'ckd.v39.finalCallPlan.result.v1',
  ];

  const expectedScreenMarkers = [
    '고객의 무엇을 확인할 것인가',
    '고객 Data 증거 카드',
    '고객군별 2주 대응 방향',
    'AI 결과 1차 분리 정리',
    '팀원별 실행 보완 Map',
    '팀원 온도차와 실행 대화',
    'AI 실행계획',
    '컴플라이언스',
    '최종 실행 카드',
    '판단 근거',
    '보완 지점',
    '토의거리',
  ];

  const forbiddenScreenTerms = [
    'CRM 기록',
    'CRM Data',
    'CRM 분석',
    'CRM상 고객 등급',
    'CRM 기록 품질',
    '고객 순위표',
    '처방 가능성',
    '전환 가능성',
    '집중 공략',
    '비교 우위 단정',
    '미승인 효능',
    '세대 특성으로 단정',
  ];

  const requiredSafetyTerms = [
    '실제 고객명',
    '병원명',
    '의료진명',
    '제품명',
    '내부 매출',
    '처방 수치',
    '개인정보',
  ];

  const allKeys = Object.keys(localStorage).sort();
  const v39Keys = allKeys.filter((key) => key.startsWith('ckd.v39.'));
  const v34FlowKeys = allKeys.filter((key) => key.startsWith('c1bio_flow_'));
  const missingStorageKeys = requiredStorageKeys.filter((key) => !allKeys.includes(key));

  const parseJson = (key) => {
    const raw = localStorage.getItem(key);
    if (!raw) return { key, exists: false, parseOk: false, value: null, error: 'missing' };
    try {
      return { key, exists: true, parseOk: true, value: JSON.parse(raw), error: null };
    } catch (error) {
      return { key, exists: true, parseOk: false, value: null, error: String(error) };
    }
  };

  const parsed = Object.fromEntries(requiredStorageKeys.map((key) => [key, parseJson(key)]));
  const parseErrors = Object.values(parsed).filter((item) => item.exists && !item.parseOk).map((item) => item.key);

  const countObjectValuesWithText = (record, fields) => {
    if (!record || typeof record !== 'object') return 0;
    return Object.values(record).filter((item) => item && typeof item === 'object' && fields.some((field) => String(item[field] || '').trim())).length;
  };

  const dashboard = parsed['ckd.v39.dashboardAnalysis.result.v1']?.value || {};
  const customerJudgment = parsed['ckd.v39.customerJudgment.result.v1']?.value || {};
  const customerStrategy = parsed['ckd.v39.customerStrategy.result.v1']?.value || {};
  const memberRole = parsed['ckd.v39.memberRole.result.v1']?.value || {};
  const peopleDialogue = parsed['ckd.v39.peopleDialogue.result.v1']?.value || {};
  const aiCallPlan = parsed['ckd.v39.aiCallPlan.result.v1']?.value || {};
  const complianceCleanup = parsed['ckd.v39.complianceCleanup.result.v1']?.value || {};
  const finalCallPlan = parsed['ckd.v39.finalCallPlan.result.v1']?.value || {};

  const storageSignals = {
    dashboardCoreMetrics: dashboard?.metricSelection?.selectedCoreMetricIds?.length || 0,
    dashboardSupportMetrics: dashboard?.metricSelection?.selectedSupportMetricIds?.length || 0,
    dashboardSafetyMetrics: dashboard?.metricSelection?.selectedSafetyMetricIds?.length || 0,
    selectedEvidenceCards: customerJudgment?.selectedCustomerTypeIds?.length || 0,
    customerJudgmentDecisionMemos: countObjectValuesWithText(customerJudgment?.decisions, ['reason', 'missingInfo', 'nextCheck', 'judgmentMemo']),
    customerStrategyItems: countObjectValuesWithText(customerStrategy?.strategies, ['strategy', 'memberRole', 'risk']),
    memberRoleItems: countObjectValuesWithText(memberRole?.roles, ['assignedCustomers', 'roleMission', 'coachingFocus', 'riskGuardrail', 'callPlanPrep']),
    peopleDialogueHasOpening: Boolean(String(peopleDialogue?.purposeFitOpening || peopleDialogue?.dialogueCard?.openingLine || '').trim()),
    aiCallPlanItems: countObjectValuesWithText(aiCallPlan?.items, ['callPlanDraft', 'riskMemo', 'cleanupFocus']),
    complianceCleanupFields: ['riskTypes', 'safeExpression', 'finalChecklist', 'finalCardMemo'].filter((field) => String(complianceCleanup?.[field] || '').trim()).length,
    finalCallPlanFields: ['focusCustomers', 'memberRoles', 'twoWeekAction', 'compliancePoint', 'firstMessage', 'discussionMemo'].filter((field) => String(finalCallPlan?.[field] || '').trim()).length,
  };

  const bodyText = document.body?.innerText || '';
  const missingScreenMarkers = expectedScreenMarkers.filter((marker) => !bodyText.includes(marker));
  const forbiddenTermsFound = forbiddenScreenTerms.filter((term) => bodyText.includes(term));
  const safetyTermsFound = requiredSafetyTerms.filter((term) => bodyText.includes(term));

  const partialInputChecks = {
    roleMissionOptionalPath: storageSignals.memberRoleItems > 0,
    aiPlanDraftOptionalPath: storageSignals.aiCallPlanItems > 0,
    finalCardFieldBasedPath: storageSignals.finalCallPlanFields > 0,
  };

  const pass =
    window.location.pathname.includes('journey-v39-preview') &&
    parseErrors.length === 0 &&
    forbiddenTermsFound.length === 0 &&
    safetyTermsFound.length >= 4 &&
    storageSignals.selectedEvidenceCards >= 1 &&
    storageSignals.customerStrategyItems >= 1 &&
    storageSignals.memberRoleItems >= 1 &&
    storageSignals.aiCallPlanItems >= 1 &&
    storageSignals.complianceCleanupFields >= 1 &&
    storageSignals.finalCallPlanFields >= 1;

  const result = {
    checkedAt: new Date().toISOString(),
    url: window.location.href,
    routeOk: window.location.pathname.includes('journey-v39-preview'),
    v39KeysFound: v39Keys,
    requiredStorageKeys,
    missingStorageKeys,
    parseErrors,
    storageSignals,
    missingScreenMarkers,
    forbiddenTermsFound,
    safetyTermsFound,
    partialInputChecks,
    v34FlowKeysFound: v34FlowKeys,
    pass,
    note: 'missingScreenMarkers can appear when only one step is visible. Use storageSignals and current step context together. v34FlowKeysFound may exist from prior v34 use; pass/fail depends on whether these keys were changed during v39 QA.',
  };

  console.log('v39 Browser QA result:', result);
  console.table({
    routeOk: result.routeOk,
    requiredStorageKeysFound: `${requiredStorageKeys.length - missingStorageKeys.length}/${requiredStorageKeys.length}`,
    missingStorageKeys: missingStorageKeys.join(', ') || 'none',
    parseErrors: parseErrors.join(', ') || 'none',
    forbiddenTermsFound: forbiddenTermsFound.join(', ') || 'none',
    safetyTermsFound: safetyTermsFound.join(', ') || 'none',
    selectedEvidenceCards: storageSignals.selectedEvidenceCards,
    customerStrategyItems: storageSignals.customerStrategyItems,
    memberRoleItems: storageSignals.memberRoleItems,
    aiCallPlanItems: storageSignals.aiCallPlanItems,
    complianceCleanupFields: storageSignals.complianceCleanupFields,
    finalCallPlanFields: storageSignals.finalCallPlanFields,
    pass,
  });

  return result;
})();
```

---

## 판정 기준

### 통과 가능

아래 조건을 모두 만족하면 `docs/v39-browser-qa-result.md`의 Console 확인 항목을 통과로 기록할 수 있다.

- `routeOk`가 `true`다.
- `parseErrors`가 비어 있다.
- `forbiddenTermsFound`가 비어 있다.
- `safetyTermsFound`에 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출, 처방 수치, 개인정보 중 주요 안내 문구가 확인된다.
- `selectedEvidenceCards`가 1 이상이다.
- `customerStrategyItems`가 1 이상이다.
- `memberRoleItems`가 1 이상이다.
- `aiCallPlanItems`가 1 이상이다.
- `complianceCleanupFields`가 1 이상이다.
- `finalCallPlanFields`가 1 이상이다.

### 조건부 통과

아래 상황은 조건부 통과로 기록할 수 있다.

- `missingScreenMarkers`가 있으나 현재 한 단계만 표시되는 UI 구조 때문임이 확인된다.
- `v34FlowKeysFound`가 있으나 v39 QA 이전부터 존재한 운영 key이며 v39 조작 중 변경되지 않았다.
- 일부 저장 key가 아직 없지만 해당 단계 입력을 수행하지 않은 것이 원인임이 확인된다.

### 보류

아래 조건 중 하나라도 있으면 보류한다.

- `/journey-v39-preview.html`이 아닌 route에서 실행했다.
- JSON parse error가 발생한다.
- 금지 표현이 참여자 화면에 노출된다.
- 5~13단계 최소 입력 후에도 핵심 저장 신호가 0이다.
- Console runtime error가 있다.
- 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출·처방 수치, 개인정보 입력 금지 안내가 주요 화면에서 확인되지 않는다.

---

## QA 결과 기록 예시

`docs/v39-browser-qa-result.md`에는 아래처럼 기록한다.

```txt
Console snippet 실행: 통과
routeOk: true
missingStorageKeys: none
parseErrors: none
forbiddenTermsFound: none
safetyTermsFound: 실제 고객명, 병원명, 의료진명, 제품명, 내부 매출, 처방 수치, 개인정보
selectedEvidenceCards: 1 이상
customerStrategyItems: 1 이상
memberRoleItems: 1 이상
aiCallPlanItems: 1 이상
complianceCleanupFields: 1 이상
finalCallPlanFields: 1 이상
pass: true
```
