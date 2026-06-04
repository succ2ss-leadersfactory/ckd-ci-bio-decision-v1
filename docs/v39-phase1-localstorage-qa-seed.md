# v39 Phase 1 빠른 화면 확인용 localStorage 입력 스크립트

## 1. 이 문서는 언제 쓰나

`/journey-v39-preview.html`에서 5~13단계 연결 상태를 빠르게 확인하고 싶을 때 사용한다.

일일이 모든 칸을 입력하지 않고, 브라우저 콘솔에 아래 스크립트를 한 번 붙여 넣으면 5~13단계에 가상 확인 데이터가 들어간다.

## 2. 사용 방법

1. Chrome에서 `/journey-v39-preview.html`을 연다.
2. 개발자 도구 Console을 연다.
3. 아래 스크립트를 그대로 붙여 넣는다.
4. Enter를 누른다.
5. 화면을 새로고침한다.
6. 5~13단계를 이동하면서 상단 상태 카드가 제대로 바뀌는지 본다.

## 3. 입력 스크립트

```js
(() => {
  const now = new Date().toISOString();
  const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  localStorage.setItem('ckd.v39.participant.v1', JSON.stringify({
    name: 'QA리더01',
    teamName: '3팀',
    roleAccepted: true,
  }));
  localStorage.setItem('ckd.v39.progress.v1', JSON.stringify({ step: 4 }));

  set('ckd.v39.dashboardAnalysis.result.v1', {
    schemaVersion: 'v39-dashboard-result-v1',
    updatedAt: now,
    teamSituations: ['execution-gap'],
    metricResult: {
      rawAiMetricSuggestion: 'QA metric suggestion',
      aiRecommendedCoreMetrics: '후속 실행 메모',
      aiRecommendedSupportMetrics: '고객 반응 기록',
      aiRecommendedSafetyMetrics: '안전 표현 점검',
      fitForOurTeam: '실행 편차 확인에 적합',
      excludedMetrics: '단순 활동량',
      additionalMetricIdea: '확인 질문 완료율',
      aiRecommendedQuestions: '다음 행동 기준은 무엇인가',
      parseNotice: '',
    },
    metricSelection: {
      selectedCoreMetricIds: ['core-followup'],
      selectedSupportMetricIds: ['support-response'],
      selectedSafetyMetricIds: ['safety-expression'],
      metricRationale: '실행 기준 정렬 확인',
    },
    memberResult: {
      selectedMemberTypeIds: ['member-a'],
      rawAiSignalResult: 'QA member signal',
      memberSplitNotice: '',
      memberPreps: {
        'member-a': {
          observedSignal: '실행 속도 차이',
          strengthSignal: '고객 반응 기록 성실',
          concernSignal: '기준 불명확',
          checkQuestion: '이번 2주 기준은 무엇인가요?',
          doNotAssume: '의지가 낮다고 단정하지 않기',
          aiDraft: '역할 초안',
          finalPrep: '확인 질문 중심 역할 부여',
        },
      },
      selectedDeliverables: { 'member-a': ['check-question'] },
      rawAiPrepResult: 'QA prep result',
      prepSplitNotice: '',
    },
  });

  set('ckd.v39.customerJudgment.result.v1', {
    schemaVersion: 1,
    updatedAt: now,
    customerContextSelections: ['followup-request'],
    judgmentCriteriaSelections: ['opportunity-risk'],
    selectedCustomerTypeIds: ['customer-a'],
    rawAiSignalResult: 'QA customer signal',
    decisions: {
      'customer-a': {
        customerTypeId: 'customer-a',
        customerLabel: '자료 요청 고객군',
        priorityDecision: 'focus',
        reason: '후속 확인 필요',
        nextCheck: '다음 행동 가능성 확인',
        complianceNote: '단정 표현 제외',
        opportunitySignal: '자료 요청 증가',
        riskSignal: '성과 가능성 과잉 해석 위험',
        missingInfo: '다음 미팅 가능성',
        twoWeekDirection: '확인 질문으로 우선순위 좁히기',
        judgmentMemo: '반응보다 다음 행동 기준 확인',
      },
    },
  });

  set('ckd.v39.customerStrategy.result.v1', {
    schemaVersion: 1,
    updatedAt: now,
    strategies: {
      'customer-a': {
        customerTypeId: 'customer-a',
        customerLabel: '자료 요청 고객군',
        priority: 'focus',
        strategy: '후속 질문으로 필요 자료 확인',
        memberRole: '확인 질문 표준화',
        risk: '반응을 성과로 단정하지 않기',
      },
    },
  });

  set('ckd.v39.memberRole.result.v1', {
    schemaVersion: 1,
    updatedAt: now,
    roles: {
      'member-a': {
        memberRoleId: 'member-a',
        memberLabel: '실행 기준 정렬 담당',
        assignedCustomers: '자료 요청 고객군',
        roleMission: '확인 질문과 후속 행동 기준 정리',
        coachingFocus: '해석보다 질문 먼저',
        riskGuardrail: '팀원 간 속도 비교 금지',
        callPlanPrep: '고객군별 확인 질문 3개 준비',
      },
    },
  });

  set('ckd.v39.peopleDialogue.result.v1', {
    schemaVersion: 2,
    updatedAt: now,
    cultureShiftSelections: ['speed-gap'],
    leaderFeelingSelections: ['pressure'],
    newGenSignalSelections: ['needs-clarity'],
    existingMemberSignalSelections: ['needs-standard'],
    conflictTypeSelections: ['execution-gap'],
    dialogueStrategySelections: ['align-standard'],
    conversationSituationId: 'execution-gap-talk',
    dialoguePurposeId: 'set-boundary',
    familiarOpeningId: 'speed-up',
    familiarOpeningCustom: '',
    perceivedByNewGen: '느린 사람으로 지목됐다고 느낄 수 있음',
    perceivedByExistingMember: '기준 없이 압박받는다고 느낄 수 있음',
    missingInformation: '각자 막힌 지점',
    purposeFitOpening: '이번 2주는 속도보다 확인 기준을 맞추겠습니다.',
    rawAiDialogueResult: 'QA dialogue result',
    dialogueCard: {
      targetMember: '팀원 전체',
      expectedReaction: '기준 확인 요청',
      leaderMisreadRisk: '의지 문제로 오해',
      realNeed: '명확한 기준',
      openingLine: '이번 2주는 기준 정렬이 우선입니다.',
      likelyQuestions: '무엇을 우선 확인해야 하나요?',
      leaderResponse: '고객군별 확인 질문부터 맞춥니다.',
      agreementCriteria: '질문 3개와 후속 기준 합의',
      leaderSupport: '방문 전 질문 점검',
      avoidPhrase: '더 빨리 움직이세요',
      alternativePhrase: '확인 기준을 먼저 맞춥시다',
    },
    teamNorms: '속도 비교보다 기준 정렬',
  });

  set('ckd.v39.aiCallPlan.result.v1', {
    schemaVersion: 1,
    updatedAt: now,
    items: {
      'plan-a': {
        id: 'plan-a',
        title: '2주 실행계획',
        callPlanDraft: '1주차 기준 정리, 2주차 후속 행동 점검',
        riskMemo: '단정 표현과 비교 압박 주의',
        cleanupFocus: '안전 표현과 팀원 수용성',
      },
    },
  });

  set('ckd.v39.complianceCleanup.result.v1', {
    schemaVersion: 1,
    updatedAt: now,
    riskTypes: '단정 표현, 실행 압박 표현',
    safeExpression: '확인 가능한 정보와 다음 행동 기준 중심',
    finalChecklist: '단정 없음, 비교 없음, 책임 전가 없음',
    finalCardMemo: '고객 실행과 팀원 수용성 함께 고려',
  });

  set('ckd.v39.finalCallPlan.result.v1', {
    schemaVersion: 1,
    updatedAt: now,
    focusCustomers: '자료 요청 후 다음 행동이 불명확한 고객군',
    memberRoles: '확인 질문과 후속 행동 기준 역할 배분',
    twoWeekAction: '1주차 기준 정리, 2주차 후속 행동 점검',
    compliancePoint: '확인 가능한 정보 중심 표현',
    firstMessage: '이번 2주는 기준을 맞추는 데 집중하겠습니다.',
    discussionMemo: '실행 속도보다 기준 정렬이 중요한 이유 토의',
  });

  console.log('v39 Phase 1 QA seed complete. Reload the page and check steps 5-13.');
})();
```

## 4. 새로고침 후 확인할 것

```text
5단계: 팀 실행 흐름 메모가 보이는가
6단계: 고객 반응 판단 메모가 보이는가
7단계: 6단계 고객 판단이 이어져 보이는가
8단계: 5단계 팀 신호와 7단계 고객 대응안이 이어져 보이는가
9단계: 8단계 역할 메모가 이어져 보이는가
10단계: 8단계 역할 메모와 9단계 대화 메모가 이어져 보이는가
11단계: 10단계 AI 초안이 이어져 보이는가
12단계: 8단계 역할, 9단계 대화, 11단계 안전 문장이 이어져 보이는가
13단계: 12단계 최종 카드가 토의거리로 이어져 보이는가
```

## 5. 입력값 지우기

화면의 진행 초기화 버튼을 누르거나, Console에 아래 스크립트를 붙여 넣는다.

```js
[
  'ckd.v39.participant.v1',
  'ckd.v39.progress.v1',
  'ckd.v39.dashboardAnalysis.result.v1',
  'ckd.v39.customerJudgment.result.v1',
  'ckd.v39.customerStrategy.result.v1',
  'ckd.v39.memberRole.result.v1',
  'ckd.v39.peopleDialogue.result.v1',
  'ckd.v39.aiCallPlan.result.v1',
  'ckd.v39.complianceCleanup.result.v1',
  'ckd.v39.finalCallPlan.result.v1',
].forEach((key) => localStorage.removeItem(key));
location.reload();
```
