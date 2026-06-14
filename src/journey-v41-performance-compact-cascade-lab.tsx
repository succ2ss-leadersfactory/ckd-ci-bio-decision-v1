import { useMemo } from 'react';
import { useStored } from './journey-storage';
import { DEFAULT_PHARMA_RESEARCH_STATE, PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, pharmaTopicOf, pharmaTitleOf, type PharmaStrategyResearchState } from './journey-v41-pharma-research-data';

const V41_PERFORMANCE_COMPACT_MARKERS = [
  'V41PerformanceCompactCascadeLab',
  'v41 performance cascade lab cloned',
  'v41 performance cascade copy refined',
  '팀 기준 만들기',
  '4단계 전사전략과제에서 시작',
  '전사전략을 팀 전략과제로 바꾸기',
  '팀 전략과제 보기 4개',
  '팀 전략과제별 CSF KPI 추진과제 매칭',
  '세부 추진과제와 2주 실행계획 수립',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.pharmaStrategyResearch.v1',
].join('|');
void V41_PERFORMANCE_COMPACT_MARKERS;

type TeamTaskOption = {
  id: string;
  type: string;
  task: string;
  csfs: string[];
  kpis: string[];
  initiatives: string[];
};

type TeamCascadeOption = {
  id: string;
  teamTasks: TeamTaskOption[];
  caution: string;
};

type PerformanceCascadeState = {
  selectedStrategyId: string;
  selectedTeamTaskId: string;
  selectedTeamTask: string;
  customTeamTask: string;
  selectedCsf: string;
  selectedKpi: string;
  selectedInitiative: string;
  teamStandard: string;
  twoWeekFirstAction: string;
  pauseActivity: string;
  midCheckQuestion: string;
  finalExecutionStandard: string;
};

const STORAGE_KEY = 'ckd.v41.performanceCascade.v1';

const TEAM_CASCADE_OPTIONS: TeamCascadeOption[] = [
  {
    id: 'ckd-glp1-obesity-metabolic',
    caution: '고객 반응 수집을 처방 유도나 경쟁사 비교 우위 단정으로 연결하지 않습니다.',
    teamTasks: [
      {
        id: 'market-insight',
        type: '시장 인사이트형',
        task: '비만·대사질환 핵심 고객군의 관심, 우려, 질문을 구조적으로 수집하고 초기 시장 인사이트를 만든다.',
        csfs: ['핵심 고객군 선별: 먼저 반응을 봐야 할 의료진과 병원이 정해져 있어야 한다', '질문 수집 기준 통일: 의료진 질문과 우려를 같은 기준으로 남겨야 한다', '반응 유형 분류: 관심·우려·자료 요청·경쟁 언급을 구분해야 한다'],
        kpis: ['핵심 고객 첫 접점 완료율: 정해진 기간 안에 1차 접점이 완료된 핵심 고객 비율(%)', '고객 질문·우려 기록 건수: 핵심 고객군에서 수집된 질문·우려·관심 반응 건수(건)', '반응 유형 분류율: 고객 반응이 정해진 유형으로 분류된 비율(%)'],
        initiatives: ['담당 구역별 핵심 고객 10명 정리', '고객 질문·우려·관심 반응 기록 기준 통일', '2주 후 초기 시장 반응 공유회의 운영'],
      },
      {
        id: 'value-evidence',
        type: '제품가치 검증형',
        task: '핵심 고객군별 미충족 니즈와 치료제 선택 기준을 파악해 제품 가치 근거 준비에 기여한다.',
        csfs: ['미충족 니즈 파악: 고객이 기존 치료에서 아쉬워하는 지점이 정리되어야 한다', '선택 기준 확인: 효과·안전성·편의성·환자 순응도 중 고객이 중시하는 기준이 확인되어야 한다', '근거 연결성 확보: 수집된 니즈가 제품 가치 근거와 연결되어야 한다'],
        kpis: ['고객 니즈 기록 건수: 핵심 고객에게서 수집된 미충족 니즈 건수(건)', '치료제 선택 기준 분류율: 선택 기준이 유형별로 분류된 고객 반응 비율(%)', '제품 가치 근거 연결 건수: 고객 니즈와 연결된 근거자료 후보 건수(건)'],
        initiatives: ['고객별 치료제 선택 기준 질문 정리', '미충족 니즈 기록 양식 만들기', '제품 가치 근거 연결 메모 작성'],
      },
      {
        id: 'launch-readiness',
        type: '실행준비 점검형',
        task: '의료진 질문과 자료 요청 흐름을 정리해 GLP-1 포트폴리오 출시 준비 상태를 현장에서 검증한다.',
        csfs: ['자료 요청 접수 기준: 어떤 자료 요청을 중요한 신호로 볼지 정해져 있어야 한다', '내부 연결 담당 명확화: 자료·학술·컴플라이언스 확인 담당이 정해져 있어야 한다', '후속 완료 기준: 요청 접수부터 완료까지의 기준과 기한이 있어야 한다'],
        kpis: ['자료 요청 접수 건수: 핵심 고객으로부터 접수된 자료 요청 건수(건)', '자료 요청 후속 완료율: 예정일 안에 완료된 자료 요청·후속 확인 비율(%)', '미처리 요청 건수: 기한 내 처리되지 않은 자료 요청 건수(건)'],
        initiatives: ['자료 요청 접수·전달·완료 상태 점검', '내부 확인 담당과 처리 기준 정리', '자료 요청 후속 지연 사유 확인'],
      },
      {
        id: 'competitive-risk',
        type: '경쟁·리스크 감지형',
        task: '경쟁 제품, 제형 변화, 환자 편의성 관련 고객 반응을 수집해 전사 시장 진입 전략에 반영한다.',
        csfs: ['경쟁 언급 기준 통일: 경쟁 제품 언급을 같은 기준으로 기록해야 한다', '환자 편의성 신호 수집: 제형·투약 편의성 관련 고객 반응이 남아야 한다', '리스크 표현 관리: 경쟁 비교나 과장 표현 없이 사실 중심으로 정리해야 한다'],
        kpis: ['경쟁 제품 언급 기록 건수: 고객 대화에서 확인된 경쟁 제품 언급 건수(건)', '제형·편의성 반응 수집 건수: 경구제·주사제·순응도 관련 반응 건수(건)', '위험 표현 수정 건수: 경쟁 비교·과장 표현을 수정한 건수(건)'],
        initiatives: ['경쟁 제품 언급 기록 기준 정리', '제형·환자 편의성 질문 수집', '위험 표현 예시 공유'],
      },
    ],
  },
  {
    id: 'ckd-core-product-value',
    caution: '경쟁 제품을 비방하거나 고객 의도를 단정하는 표현은 사용하지 않습니다.',
    teamTasks: [
      {
        id: 'value-retention',
        type: '고객가치 유지형',
        task: '주력 제품을 계속 선택하는 이유와 흔들리는 신호를 고객별로 확인해 시장 방어 실행 기준을 만든다.',
        csfs: ['주요 고객별 가치 이유 확인: 고객이 제품을 계속 쓰는 이유가 정리되어 있어야 한다', '고객별 유지 요인 구분: 효과·안전성·경험·편의성 등 유지 이유가 구분되어야 한다', '재접점 우선순위 설정: 가치 흔들림이 보이는 고객부터 볼 수 있어야 한다'],
        kpis: ['주요 고객 가치 이유 정리율: 핵심 고객별 제품 사용 이유가 정리된 비율(%)', '가치 흔들림 신호 기록 건수: 제품 선택 이유가 약해진 신호 건수(건)', '주요 고객 재접점 완료율: 정해진 기간 안에 재접점이 완료된 주요 고객 비율(%)'],
        initiatives: ['핵심 고객별 제품 사용 이유 1줄 정리', '가치 흔들림 신호 기록 기준 통일', '주요 고객 재접점 일정 확정'],
      },
      {
        id: 'message-refine',
        type: '메시지 재정립형',
        task: '핵심 고객별 제품 가치 인식과 경쟁 제품 언급 신호를 수집해 고객가치 메시지 재정립에 기여한다.',
        csfs: ['고객 언어 수집: 고객이 실제로 쓰는 제품 가치 표현이 남아야 한다', '경쟁 질문 분류: 경쟁 제품 관련 질문이 유형별로 정리되어야 한다', '메시지 개선 연결: 수집된 반응이 메시지 개선 후보로 연결되어야 한다'],
        kpis: ['고객 가치 표현 수집 건수: 고객이 말한 제품 가치 표현 건수(건)', '경쟁 질문 분류율: 경쟁 질문이 유형별로 분류된 비율(%)', '메시지 개선 후보 건수: 고객 반응 기반 메시지 개선 후보 건수(건)'],
        initiatives: ['고객 표현 그대로 기록하기', '경쟁 질문 주간 공유 루틴 운영', '메시지 개선 후보 메모 작성'],
      },
      {
        id: 'risk-early-warning',
        type: '처방 위험 조기감지형',
        task: '처방 감소 가능성이 있는 고객군을 조기에 파악하고 재접점 우선순위를 정한다.',
        csfs: ['위험 신호 정의: 감소·대체·관심 저하 신호가 정의되어야 한다', '우선순위 기준 마련: 어떤 고객을 먼저 볼지 기준이 있어야 한다', '지원 필요 상신: 팀장 지원이 필요한 고객이 올라와야 한다'],
        kpis: ['처방 감소 신호 기록 건수: 처방 감소·대체 가능성으로 기록된 신호 건수(건)', '고위험 고객 재접점 완료율: 우선 고객 중 재접점 완료 비율(%)', '팀장 지원 요청 건수: 팀장 개입이 필요한 고객 이슈 건수(건)'],
        initiatives: ['처방 감소·대체 가능성 신호 기록 양식 통일', '고위험 고객 우선순위 정리', '팀장 지원 필요 고객 공유'],
      },
      {
        id: 'competitive-defense',
        type: '경쟁 방어형',
        task: '경쟁 질문과 고객 이탈 신호를 팀 단위로 공유해 주력 제품 시장 방어 활동을 정교화한다.',
        csfs: ['경쟁 질문 공유 기준 통일: 경쟁 제품 관련 질문과 우려가 팀 안에서 빠르게 공유되어야 한다', '사실 중심 대응: 경쟁 질문에 답할 때 근거와 표현 기준을 지켜야 한다', '방어 활동 학습: 반복되는 질문이 팀 대응 기준으로 축적되어야 한다'],
        kpis: ['경쟁 질문 공유 건수: 경쟁 제품 관련 질문·우려가 팀에 공유된 건수(건)', '승인자료 기반 대응률: 승인자료 범위 안에서 진행된 대응 비율(%)', '반복 질문 대응 기준 작성 건수: 팀 대응 기준으로 정리된 반복 질문 수(건)'],
        initiatives: ['경쟁 질문 공유 게시판 운영', '승인자료 기반 답변 문장 정리', '반복 질문 대응 기준 업데이트'],
      },
    ],
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    caution: '개발 성공을 단정하거나 허가 전 적응증을 암시하지 않습니다.',
    teamTasks: [
      {
        id: 'pipeline-question',
        type: '고객 질문 수집형',
        task: '핵심 파이프라인과 미래 성장 스토리에 대해 고객이 궁금해하는 주제를 수집하고 승인된 범위 안에서 설명 기준을 정리한다.',
        csfs: ['설명 가능 범위 확인: 고객에게 말할 수 있는 내용과 확인이 필요한 내용이 구분되어야 한다', '고객 관심 주제 수집: 고객이 궁금해하는 연구·바이오 주제가 기록되어야 한다', '승인자료 기반 설명: 허용된 자료와 표현 범위 안에서만 설명해야 한다'],
        kpis: ['파이프라인 관련 고객 질문 수집 건수: 고객이 물어본 연구·바이오 관련 질문 수(건)', '확인 필요 질문 등록 건수: 즉시 답하지 않고 내부 확인으로 넘긴 질문 수(건)', '승인자료 기반 설명률: 승인된 자료 범위 안에서 진행된 설명 비율(%)'],
        initiatives: ['파이프라인 질문 수집 항목 만들기', '설명 가능/확인 필요/추가 자료 요청으로 질문 분류', '승인자료 기반 설명 문장 정리'],
      },
      {
        id: 'message-upgrade',
        type: '커뮤니케이션 고도화형',
        task: '고객이 묻는 파이프라인 관심 주제를 분류해 전사 커뮤니케이션 메시지 고도화에 기여한다.',
        csfs: ['관심 주제 분류: 고객 질문이 연구, 임상, 사업화, 안전성 등으로 나뉘어야 한다', '반복 질문 식별: 반복되는 질문이 확인되어야 한다', '메시지 개선 연결: 고객 질문이 대외 메시지 개선 후보로 연결되어야 한다'],
        kpis: ['관심 주제 분류율: 고객 질문이 주제별로 분류된 비율(%)', '반복 질문 식별 건수: 반복적으로 확인된 질문 수(건)', '메시지 개선 제안 건수: 고객 질문 기반 메시지 개선 제안 수(건)'],
        initiatives: ['고객 관심 주제 월간 요약 공유', '반복 질문 리스트 작성', '커뮤니케이션 개선 메모 작성'],
      },
      {
        id: 'compliance-boundary',
        type: '표현 경계 관리형',
        task: '설명 가능한 내용과 내부 확인이 필요한 질문을 구분해 허용된 대외 커뮤니케이션 기준을 지킨다.',
        csfs: ['표현 경계 인식: 허용 표현과 금지 표현이 구분되어야 한다', '내부 확인 루틴: 답변 전 확인이 필요한 질문은 내부로 연결되어야 한다', '위험 표현 수정: 허가 전·과장 표현을 줄여야 한다'],
        kpis: ['확인 필요 질문 등록 건수: 내부 확인으로 넘긴 질문 수(건)', '위험 표현 수정 건수: 허가 전·과장 표현을 수정한 건수(건)', '내부 확인 완료율: 확인 요청 후 답변 기준이 정리된 비율(%)'],
        initiatives: ['허용 표현/금지 표현 예시 공유', '내부 확인 질문 분류', '위험 표현 수정 메모 작성'],
      },
      {
        id: 'commercial-signal',
        type: '사업화 신호 보완형',
        task: '신약·바이오 성장 스토리에 대한 고객 반응을 수집해 사업화 연결 가능성을 현장 관점에서 보완한다.',
        csfs: ['고객 수요 신호 수집: 고객 관심과 필요가 확인되어야 한다', '사업화 연결 질문 정리: 제품화 가능성과 관련된 질문이 남아야 한다', '현장 관점 피드백 전달: 고객 반응이 사업화 검토에 전달되어야 한다'],
        kpis: ['사업화 관련 고객 질문 건수: 사업화·적응증·활용 가능성 관련 질문 수(건)', '고객 수요 신호 기록 건수: 현장에서 확인된 수요 신호 건수(건)', '사업화 검토 전달 건수: 내부 검토로 전달된 고객 반응 건수(건)'],
        initiatives: ['사업화 관련 질문 기록 기준 정리', '고객 수요 신호 메모 작성', '내부 검토 전달 항목 정리'],
      },
    ],
  },
  {
    id: 'ckd-data-based-field-execution',
    caution: '방문 수나 기록량만 늘리는 활동을 성과로 보지 않습니다.',
    teamTasks: [
      {
        id: 'execution-management',
        type: '실행관리 표준화형',
        task: '고객 반응, 다음 행동, Follow-up 상태를 같은 기준으로 남겨 팀 실행관리와 의사결정에 활용한다.',
        csfs: ['기록 기준 통일: 고객 반응과 다음 행동을 남기는 기준이 같아야 한다', '후속 상태 가시화: 자료 제공과 Follow-up 상태가 팀장에게 보이도록 관리되어야 한다', '지연 신호 조기 확인: 늦어진 일과 막힌 일을 정기적으로 확인해야 한다'],
        kpis: ['고객 반응 기록률: 고객 반응이 포함된 방문 기록 비율(%)', '다음 행동 입력률: 다음 행동이 입력된 방문 기록 비율(%)', 'Follow-up 기한 준수율: 예정일 안에 완료된 Follow-up 비율(%)'],
        initiatives: ['고객 반응·다음 행동 기록 기준 정리', 'Follow-up 예정일과 완료 상태 입력', '2주 단위 실행 대시보드 점검'],
      },
      {
        id: 'data-standard',
        type: '고객 데이터 표준화형',
        task: '영업 현장의 고객 접점 데이터를 표준화해 전사 고객 인사이트 축적에 기여한다.',
        csfs: ['입력 항목 통일: 팀원들이 같은 항목으로 데이터를 남겨야 한다', '기록 품질 확보: 단순 방문 사실보다 고객 반응과 다음 행동이 포함되어야 한다', '전사 활용 가능성: 기록이 다른 부서에서도 이해 가능해야 한다'],
        kpis: ['표준 항목 입력률: 정해진 항목이 채워진 고객 기록 비율(%)', '기록 품질 충족률: 고객 반응과 다음 행동이 함께 포함된 기록 비율(%)', '전사 공유 가능 기록 건수: 다른 부서와 공유 가능한 인사이트 기록 수(건)'],
        initiatives: ['표준 입력 항목 재정리', '좋은 기록/부족한 기록 예시 비교', '전사 공유 가능 인사이트 표시'],
      },
      {
        id: 'early-warning',
        type: '실행 지연 조기감지형',
        task: '고객 반응과 실행 지연 신호를 조기에 확인해 팀 단위 실행관리 품질을 높인다.',
        csfs: ['지연 기준 명확화: 무엇을 실행 지연으로 볼지 정해져 있어야 한다', '지원 필요 신호 포착: 팀장 지원이 필요한 이슈가 올라와야 한다', '중간 점검 루틴: 주간 점검에서 지연 신호를 확인해야 한다'],
        kpis: ['실행 지연 건수: 예정일을 넘긴 고객 후속 과제 건수(건)', '지원 필요 등록 건수: 팀장 지원이 필요한 이슈 건수(건)', '지연 해소율: 확인된 지연 과제 중 해소된 비율(%)'],
        initiatives: ['지연 과제 주간 확인', '지원 필요 이슈 등록 기준 정리', '지연 해소 상태 점검'],
      },
      {
        id: 'insight-link',
        type: '전략 인사이트 연결형',
        task: '방문 기록을 단순 활동 기록이 아니라 다음 행동과 전략 인사이트로 연결한다.',
        csfs: ['인사이트 전환 기준: 고객 반응이 전략 인사이트로 바뀌는 기준이 있어야 한다', '다음 행동 연결: 기록마다 다음 행동이 붙어야 한다', '반복 신호 요약: 반복되는 고객 반응이 팀 차원에서 요약되어야 한다'],
        kpis: ['전략 인사이트 전환 건수: 고객 반응이 전략 인사이트로 정리된 건수(건)', '다음 행동 연결률: 다음 행동이 포함된 고객 기록 비율(%)', '반복 신호 요약 건수: 팀 차원에서 요약된 반복 신호 수(건)'],
        initiatives: ['고객 반응을 인사이트로 바꾸는 기준 정리', '기록 후 다음 행동 연결 문장 추가', '반복 신호 주간 요약'],
      },
    ],
  },
  {
    id: 'ckd-quality-supply-compliance',
    caution: '확인되지 않은 품질·공급 정보를 단정하거나 고객 불안을 키우는 표현을 쓰지 않습니다.',
    teamTasks: [
      {
        id: 'fact-record',
        type: '문의 사실 기록형',
        task: '품질·공급·컴플라이언스 관련 고객 문의를 사실 중심으로 기록하고, 확인 전 단정 답변을 줄인다.',
        csfs: ['문의 사실 기록: 고객 문의를 해석하지 않고 사실 중심으로 남겨야 한다', '확인 전 답변 제한: 내부 확인이 필요한 내용은 즉시 단정하지 않아야 한다', '위험 표현 점검: 고객에게 불안이나 오해를 줄 표현을 사전에 걸러야 한다'],
        kpis: ['품질·공급 문의 기록 건수: 품질·공급 관련 고객 문의 기록 건수(건)', '미확인 답변 발생 건수: 내부 확인 전 단정 답변으로 기록된 건수(건)', '위험 표현 수정 건수: 고객 커뮤니케이션에서 수정한 위험 표현 건수(건)'],
        initiatives: ['품질·공급 문의 기록 기준 통일', '내부 확인 필요 질문 분류', '위험 표현 예시 공유'],
      },
      {
        id: 'trust-risk',
        type: '신뢰 리스크 관리형',
        task: '품질·공급 문의를 내부 확인 흐름과 연결해 고객 신뢰 리스크를 조기에 관리한다.',
        csfs: ['내부 연결 흐름 확보: 문의가 담당 부서로 빠르게 연결되어야 한다', '처리 기한 명확화: 후속 완료 기준과 기한이 있어야 한다', '고객 불안 완화: 사실 확인 전 불안을 키우지 않아야 한다'],
        kpis: ['고객 문의 후속 완료율: 정해진 기한 안에 완료된 문의 후속 처리 비율(%)', '내부 확인 리드타임: 문의 등록부터 내부 확인 완료까지 평균 일수(일)', '고객 신뢰 리스크 등록 건수: 신뢰 저하 가능성이 있는 문의 건수(건)'],
        initiatives: ['내부 확인 연결 담당 정리', '문의 후속 처리 완료 상태 점검', '고객 신뢰 리스크 신호 공유'],
      },
      {
        id: 'safe-expression',
        type: '안전 표현 정착형',
        task: '고객 커뮤니케이션에서 위험 표현을 줄이고 승인된 표현 기준을 팀 단위로 정착시킨다.',
        csfs: ['위험 표현 인식: 과장, 단정, 허가 외 표현을 구분해야 한다', '승인 표현 활용: 승인된 표현을 기준으로 말해야 한다', '수정 피드백 루틴: 위험 표현이 발견되면 즉시 수정되어야 한다'],
        kpis: ['위험 표현 수정 건수: 고객 커뮤니케이션에서 수정한 위험 표현 건수(건)', '승인 표현 사용률: 승인 표현 기준에 맞게 작성된 고객 메시지 비율(%)', '표현 피드백 반영률: 수정 피드백이 반영된 메시지 비율(%)'],
        initiatives: ['위험 표현 예시 카드 만들기', '승인 표현 문장 공유', '고객 메시지 샘플 점검'],
      },
      {
        id: 'repeat-issue',
        type: '반복 문의 개선형',
        task: '반복되는 고객 문의 유형을 수집해 전사 품질·공급·컴플라이언스 대응 기준 개선에 기여한다.',
        csfs: ['반복 문의 유형화: 반복되는 문의가 유형별로 정리되어야 한다', '개선 필요 항목 전달: 반복 문의가 전사 대응 기준 개선으로 연결되어야 한다', '재발 방지 관점 확보: 같은 문의가 반복되는 이유를 확인해야 한다'],
        kpis: ['반복 문의 유형 분류 건수: 유형화된 반복 문의 건수(건)', '전사 개선 요청 건수: 대응 기준 개선을 위해 전달한 요청 수(건)', '재발 문의 감소율: 동일 유형 문의가 감소한 비율(%)'],
        initiatives: ['반복 문의 유형표 작성', '전사 개선 요청 항목 정리', '동일 유형 재발 여부 점검'],
      },
    ],
  },
];

const DEFAULT_STATE: PerformanceCascadeState = {
  selectedStrategyId: '',
  selectedTeamTaskId: '',
  selectedTeamTask: '',
  customTeamTask: '',
  selectedCsf: '',
  selectedKpi: '',
  selectedInitiative: '',
  teamStandard: '',
  twoWeekFirstAction: '',
  pauseActivity: '',
  midCheckQuestion: '',
  finalExecutionStandard: '',
};

function teamCascadeOf(topicId: string) {
  return TEAM_CASCADE_OPTIONS.find((item) => item.id === topicId) ?? TEAM_CASCADE_OPTIONS[0];
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label className="block rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <span className="text-sm font-black text-slate-950">{label}</span>
      {help ? <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{help}</p> : null}
      <div className="mt-3">{children}</div>
    </label>
  );
}

function TextArea({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <textarea className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />;
}

export function V41PerformanceCompactCascadeLab() {
  const [state, setState] = useStored<PerformanceCascadeState>(STORAGE_KEY, DEFAULT_STATE);
  const [researchState] = useStored<PharmaStrategyResearchState>(PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, DEFAULT_PHARMA_RESEARCH_STATE);
  const update = (patch: Partial<PerformanceCascadeState>) => setState({ ...state, ...patch });
  const enterpriseTopic = useMemo(() => pharmaTopicOf(researchState.selectedTopicId), [researchState.selectedTopicId]);
  const enterpriseTitle = useMemo(() => pharmaTitleOf(researchState), [researchState.selectedTopicId, researchState.customTopic]);
  const cascade = useMemo(() => teamCascadeOf(researchState.selectedTopicId), [researchState.selectedTopicId]);
  const selectedTeamTaskId = state.selectedTeamTaskId || cascade.teamTasks[0].id;
  const selectedTeamOption = cascade.teamTasks.find((item) => item.id === selectedTeamTaskId) ?? cascade.teamTasks[0];
  const teamTask = state.customTeamTask.trim() || selectedTeamOption.task;

  const makeDraft = () => {
    const csf = state.selectedCsf || selectedTeamOption.csfs[0];
    const kpi = state.selectedKpi || selectedTeamOption.kpis[0];
    const initiative = state.selectedInitiative || selectedTeamOption.initiatives[0];
    update({
      teamStandard: `전사 전략과제: ${enterpriseTitle}\n팀 전략과제: ${teamTask}\n- 유형: ${selectedTeamOption.type}\n- 팀 CSF: ${csf}\n- 팀 KPI: ${kpi}\n- 세부 추진과제: ${initiative}\n- 주의: ${cascade.caution}`,
      twoWeekFirstAction: `이번 2주 동안 '${initiative}'를 먼저 실행하고, '${kpi}'로 진행 여부를 확인한다.`,
      pauseActivity: '전사 전략과제와 직접 연결되지 않는 방문 수 늘리기, 장문 보고, 목적 없는 자료 전달은 잠시 줄인다.',
      midCheckQuestion: `이번 주 실행에서 '${csf}'가 보이는 증거는 무엇이고, '${kpi}'로 확인하면 어디가 부족한가요?`,
      finalExecutionStandard: `다음 단계에서는 '${initiative}'를 팀원이 실행할 업무지시로 바꾸고, '${kpi}'와 연결되는 확인 기준을 넣는다.`,
    });
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">팀 기준 만들기</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">4단계 전사전략을 팀 기준으로 바꾸기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">4단계에서 선택한 전사 전략과제, 전사 CSF, 전사 KPI를 확인한 뒤 우리 팀의 전략과제, 팀 CSF, 팀 KPI, 세부 추진과제로 내립니다.</p>
      </section>

      <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">4단계에서 가져온 전사 기준</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">{enterpriseTitle}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-3">
            <p className="font-black text-cyan-900">전사 CSF</p>
            <ul className="mt-2 space-y-1 text-xs">{enterpriseTopic.csfs.map((csf) => <li key={csf}>- {csf}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-white p-3">
            <p className="font-black text-cyan-900">전사 KPI</p>
            <ul className="mt-2 space-y-1 text-xs">{enterpriseTopic.kpis.map((kpi) => <li key={kpi}>- {kpi}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Field label="팀 전략과제 보기 4개" help="전사 전략과제를 수행하기 위해 우리 팀이 맡을 수 있는 전략과제 중 하나를 고릅니다. 선택에 따라 팀 CSF, 팀 KPI, 세부 추진과제가 달라집니다.">
          <div className="space-y-2">{cascade.teamTasks.map((teamTaskOption) => <label key={teamTaskOption.id} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={selectedTeamOption.id === teamTaskOption.id} onChange={() => update({ selectedTeamTaskId: teamTaskOption.id, selectedTeamTask: teamTaskOption.task, customTeamTask: '', selectedCsf: '', selectedKpi: '', selectedInitiative: '' })} /><span><span className="mr-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">{teamTaskOption.type}</span>{teamTaskOption.task}</span></label>)}</div>
        </Field>
        <Field label="우리 팀 전략과제 직접 수정" help="선택한 보기 문장을 우리 팀 언어로 다듬어도 됩니다.">
          <TextArea value={state.customTeamTask} onChange={(value) => update({ customTeamTask: value })} placeholder={selectedTeamOption.task} />
        </Field>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">선택한 팀 전략과제에 맞는 팀 CSF와 팀 KPI</h3>
        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">전략과제 유형: {selectedTeamOption.type}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="팀 CSF" help="선택한 팀 전략과제가 성공하려면 반드시 갖춰져야 할 조건입니다.">
            <div className="space-y-2">{selectedTeamOption.csfs.map((csf) => <label key={csf} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedCsf || selectedTeamOption.csfs[0]) === csf} onChange={() => update({ selectedCsf: csf })} />{csf}</label>)}</div>
          </Field>
          <Field label="팀 KPI" help="선택한 팀 전략과제에 맞춰 팀장이 주간·2주 단위로 볼 수 있는 실행 지표입니다.">
            <div className="space-y-2">{selectedTeamOption.kpis.map((kpi) => <label key={kpi} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedKpi || selectedTeamOption.kpis[0]) === kpi} onChange={() => update({ selectedKpi: kpi })} />{kpi}</label>)}</div>
          </Field>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">선택한 팀 전략과제에 맞는 세부 추진과제</h3>
        <Field label="세부 추진과제" help="선택한 팀 전략과제를 실제로 시작하기 위한 추진과제를 고릅니다.">
          <div className="space-y-2">{selectedTeamOption.initiatives.map((initiative) => <label key={initiative} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={(state.selectedInitiative || selectedTeamOption.initiatives[0]) === initiative} onChange={() => update({ selectedInitiative: initiative })} />{initiative}</label>)}</div>
        </Field>
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">주의: {cascade.caution}</div>
        <button type="button" className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={makeDraft}>팀 기준과 2주 실행계획 만들기</button>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">팀 기준과 2주 실행계획</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="팀 기준 초안"><TextArea value={state.teamStandard} onChange={(value) => update({ teamStandard: value })} placeholder="전사 전략과제, 팀 전략과제, 팀 CSF, 팀 KPI, 세부 추진과제를 한 번에 정리합니다." /></Field>
          <Field label="이번 2주 동안 먼저 할 일"><TextArea value={state.twoWeekFirstAction} onChange={(value) => update({ twoWeekFirstAction: value })} placeholder="예: 선택한 세부 추진과제를 먼저 실행하고, 팀 KPI로 진행 여부를 확인한다." /></Field>
          <Field label="이번 2주 동안 잠시 줄일 일"><TextArea value={state.pauseActivity} onChange={(value) => update({ pauseActivity: value })} placeholder="예: 전사 전략과제와 직접 연결되지 않는 활동은 잠시 줄인다." /></Field>
          <Field label="팀장이 중간에 물어볼 확인 질문"><TextArea value={state.midCheckQuestion} onChange={(value) => update({ midCheckQuestion: value })} placeholder="예: 이번 주 실행에서 팀 CSF가 보이는 증거는 무엇인가요?" /></Field>
          <Field label="다음 단계에서 업무지시로 바꿀 기준"><TextArea value={state.finalExecutionStandard} onChange={(value) => update({ finalExecutionStandard: value })} placeholder="예: 세부 추진과제를 팀원이 실행할 업무지시로 바꿀 기준을 정리합니다." /></Field>
        </div>
      </section>
    </section>
  );
}
