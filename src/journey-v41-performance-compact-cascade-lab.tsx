import { useMemo, type ReactNode } from 'react';
import { useStored } from './journey-storage';
import { DEFAULT_PHARMA_RESEARCH_STATE, PHARMA_STRATEGY_RESEARCH_STORAGE_KEY, pharmaTopicOf, pharmaTitleOf, type PharmaStrategyResearchState } from './journey-v41-pharma-research-data';

const V41_PERFORMANCE_COMPACT_MARKERS = [
  'V41PerformanceCompactCascadeLab',
  '팀 기준 만들기',
  '4단계 전사전략과제에서 시작',
  '4단계 전사 추진과제 후보 연결',
  '팀 전략과제별 CSF KPI 추진과제 매칭',
  'CSF별 KPI 종속 구조',
  'CSF가 바뀌면 KPI도 바뀜',
  '팀 KPI 관리 주기 확인 기준',
  '2주 실행계획 주차별 담당 증거 기준',
  'ckd.v41.performanceCascade.v1',
  'ckd.v41.pharmaStrategyResearch.v1',
].join('|');
void V41_PERFORMANCE_COMPACT_MARKERS;

type TeamKpiOption = {
  label: string;
  cycle: string;
  evidence: string;
  owner: string;
};

type TeamCsfOption = {
  id: string;
  label: string;
  description: string;
  kpis: TeamKpiOption[];
  initiatives: string[];
};

type TeamTaskOption = {
  id: string;
  type: string;
  task: string;
  csfs: TeamCsfOption[];
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
  selectedCsfId: string;
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

const kpi = (label: string, cycle: string, evidence: string, owner = '팀장'): TeamKpiOption => ({ label, cycle, evidence, owner });
const csf = (id: string, label: string, description: string, kpis: TeamKpiOption[], initiatives: string[]): TeamCsfOption => ({ id, label, description, kpis, initiatives });

const TEAM_CASCADE_OPTIONS: TeamCascadeOption[] = [
  {
    id: 'ckd-glp1-obesity-metabolic',
    caution: '고객 반응 수집을 처방 유도나 경쟁사 비교 우위 단정으로 연결하지 않습니다.',
    teamTasks: [
      {
        id: 'market-insight',
        type: '시장 인사이트형',
        task: '비만·대사질환 핵심 고객군의 관심, 우려, 질문을 구조적으로 수집하고 초기 시장 인사이트를 만든다.',
        csfs: [
          csf('target-customer', '핵심 고객군 선별', '먼저 반응을 봐야 할 의료진과 병원이 정해져 있어야 한다', [kpi('핵심 고객 리스트 작성률', '주 1회', '담당 구역별 핵심 고객 리스트', '담당자/팀장'), kpi('핵심 고객 첫 접점 완료율', '주 1회', '핵심 고객별 1차 접점 완료 표시', '팀장')], ['담당 구역별 핵심 고객 10명 정리', '고객 우선순위 기준 정리', '1차 접점 일정 확정']),
          csf('question-standard', '질문 수집 기준 통일', '의료진 질문과 우려를 같은 기준으로 남겨야 한다', [kpi('고객 질문·우려 기록 건수', '주 1회', '질문·우려·관심으로 구분된 방문 기록', '팀장'), kpi('기록 기준 충족률', '주 1회', '정해진 기록 항목 충족 여부', '팀장')], ['고객 질문·우려·관심 반응 기록 기준 통일', '좋은 기록과 부족한 기록 예시 비교', '방문 후 24시간 이내 기록 입력']),
          csf('reaction-classify', '반응 유형 분류', '관심·우려·자료 요청·경쟁 언급을 구분해야 한다', [kpi('반응 유형 분류율', '2주 1회', '관심·우려·자료 요청·경쟁 언급 분류표', '팀장'), kpi('반복 반응 요약 건수', '2주 1회', '반복 질문·우려 요약표', '팀장')], ['반응 유형 분류표 만들기', '반복 질문 주간 요약', '경쟁 언급과 자료 요청 별도 표시']),
        ],
      },
      {
        id: 'value-evidence',
        type: '제품가치 검증형',
        task: '핵심 고객군별 미충족 니즈와 치료제 선택 기준을 파악해 제품 가치 근거 준비에 기여한다.',
        csfs: [
          csf('unmet-need', '미충족 니즈 파악', '고객이 기존 치료에서 아쉬워하는 지점이 정리되어야 한다', [kpi('고객 니즈 기록 건수', '주 1회', '고객별 미충족 니즈 메모', '담당자/팀장'), kpi('니즈 유형 분류율', '2주 1회', '효과·안전성·편의성·순응도 분류표', '팀장')], ['고객별 치료제 선택 기준 질문 정리', '미충족 니즈 기록 양식 만들기']),
          csf('choice-criteria', '치료제 선택 기준 확인', '효과·안전성·편의성·환자 순응도 중 고객이 중시하는 기준이 확인되어야 한다', [kpi('치료제 선택 기준 분류율', '2주 1회', '선택 기준 유형별 분류표', '팀장'), kpi('핵심 고객 선택 기준 확인율', '2주 1회', '핵심 고객별 선택 기준 기록', '팀장')], ['선택 기준 질문 리스트 만들기', '고객별 선택 기준 1줄 정리']),
          csf('evidence-link', '근거 연결성 확보', '수집된 니즈가 제품 가치 근거와 연결되어야 한다', [kpi('제품 가치 근거 연결 건수', '2주 1회', '니즈-근거자료 연결 메모', '팀장'), kpi('근거자료 요청 건수', '주 1회', '고객 니즈에 연결된 자료 요청 기록', '담당자')], ['제품 가치 근거 연결 메모 작성', '자료 요청 접수 기준 정리']),
        ],
      },
      {
        id: 'launch-readiness',
        type: '실행준비 점검형',
        task: '의료진 질문과 자료 요청 흐름을 정리해 GLP-1 포트폴리오 출시 준비 상태를 현장에서 검증한다.',
        csfs: [
          csf('request-intake', '자료 요청 접수 기준', '어떤 자료 요청을 중요한 신호로 볼지 정해져 있어야 한다', [kpi('자료 요청 접수 건수', '주 1회', '자료 요청 접수 목록', '담당자'), kpi('핵심 자료 요청 비율', '2주 1회', '핵심 고객 자료 요청 중 중요 요청 표시', '팀장')], ['자료 요청 접수 기준 정리', '자료 요청 기록 항목 만들기']),
          csf('internal-owner', '내부 연결 담당 명확화', '자료·학술·컴플라이언스 확인 담당이 정해져 있어야 한다', [kpi('내부 확인 연결률', '주 1회', '자료 요청별 내부 담당 연결 기록', '팀장'), kpi('내부 확인 리드타임', '2주 1회', '요청일·연결일·답변일 기록', '팀장')], ['내부 확인 담당과 처리 기준 정리', '자료 요청 전달 흐름 점검']),
          csf('followup-complete', '후속 완료 기준', '요청 접수부터 완료까지의 기준과 기한이 있어야 한다', [kpi('자료 요청 후속 완료율', '주 1회', '요청일·예정일·완료일 기록', '팀장'), kpi('미처리 요청 건수', '주 1회', '미처리 요청과 지연 사유 목록', '팀장')], ['자료 요청 완료 상태 점검', '자료 요청 후속 지연 사유 확인']),
        ],
      },
      {
        id: 'competitive-risk',
        type: '경쟁·리스크 감지형',
        task: '경쟁 제품, 제형 변화, 환자 편의성 관련 고객 반응을 수집해 전사 시장 진입 전략에 반영한다.',
        csfs: [
          csf('competitor-mention', '경쟁 언급 기준 통일', '경쟁 제품 언급을 같은 기준으로 기록해야 한다', [kpi('경쟁 제품 언급 기록 건수', '주 1회', '경쟁 제품 언급 메모', '담당자/팀장'), kpi('경쟁 질문 분류율', '2주 1회', '경쟁 질문 유형 분류표', '팀장')], ['경쟁 제품 언급 기록 기준 정리', '경쟁 질문 유형 구분']),
          csf('convenience-signal', '환자 편의성 신호 수집', '제형·투약 편의성 관련 고객 반응이 남아야 한다', [kpi('제형·편의성 반응 수집 건수', '2주 1회', '제형·편의성 관련 고객 반응 목록', '팀장'), kpi('환자 순응도 관련 질문 건수', '2주 1회', '순응도 관련 고객 질문 기록', '팀장')], ['제형·환자 편의성 질문 수집', '순응도 관련 고객 반응 메모 작성']),
          csf('risk-expression', '리스크 표현 관리', '경쟁 비교나 과장 표현 없이 사실 중심으로 정리해야 한다', [kpi('위험 표현 수정 건수', '수시/주 1회', '수정 전후 표현 예시', '팀장'), kpi('사실 중심 기록률', '주 1회', '해석보다 사실 중심으로 작성된 기록 비율', '팀장')], ['위험 표현 예시 공유', '사실 중심 기록 샘플 점검']),
        ],
      },
    ],
  },
  {
    id: 'ckd-core-product-value',
    caution: '경쟁 제품을 비방하거나 고객 의도를 단정하는 표현은 사용하지 않습니다.',
    teamTasks: [
      {
        id: 'value-retention', type: '고객가치 유지형', task: '주력 제품을 계속 선택하는 이유와 흔들리는 신호를 고객별로 확인해 시장 방어 실행 기준을 만든다.',
        csfs: [
          csf('value-reason', '주요 고객별 가치 이유 확인', '고객이 제품을 계속 쓰는 이유가 정리되어 있어야 한다', [kpi('주요 고객 가치 이유 정리율', '2주 1회', '핵심 고객별 제품 사용 이유 1줄 메모'), kpi('고객 가치 표현 수집 건수', '주 1회', '고객이 말한 제품 가치 표현 원문')], ['핵심 고객별 제품 사용 이유 1줄 정리', '고객 표현 그대로 기록하기']),
          csf('risk-signal', '가치 흔들림 신호 포착', '제품 선택 이유가 약해지는 신호가 보여야 한다', [kpi('가치 흔들림 신호 기록 건수', '주 1회', '제품 선택 이유가 약해진 신호 기록'), kpi('처방 감소 신호 기록 건수', '주 1회', '처방 감소·대체 가능성 신호 기록')], ['가치 흔들림 신호 기록 기준 통일', '처방 감소 신호 기록 양식 통일']),
          csf('priority-revisit', '재접점 우선순위 설정', '가치 흔들림이 보이는 고객부터 볼 수 있어야 한다', [kpi('주요 고객 재접점 완료율', '주 1회', '재접점 예정일·완료일 기록'), kpi('고위험 고객 재접점 완료율', '주 1회', '고위험 고객 재접점 완료 목록')], ['주요 고객 재접점 일정 확정', '고위험 고객 우선순위 정리']),
        ],
      },
      {
        id: 'message-refine', type: '메시지 재정립형', task: '핵심 고객별 제품 가치 인식과 경쟁 제품 언급 신호를 수집해 고객가치 메시지 재정립에 기여한다.',
        csfs: [
          csf('customer-language', '고객 언어 수집', '고객이 실제로 쓰는 제품 가치 표현이 남아야 한다', [kpi('고객 가치 표현 수집 건수', '주 1회', '고객 표현 원문 기록'), kpi('고객 표현 재사용 후보 건수', '2주 1회', '메시지 후보로 쓸 수 있는 고객 표현')], ['고객 표현 그대로 기록하기', '고객 언어 기반 메시지 후보 작성']),
          csf('competitive-question', '경쟁 질문 분류', '경쟁 제품 관련 질문이 유형별로 정리되어야 한다', [kpi('경쟁 질문 분류율', '2주 1회', '경쟁 질문 유형 분류표'), kpi('경쟁 질문 공유 건수', '주 1회', '경쟁 질문 공유 목록')], ['경쟁 질문 주간 공유 루틴 운영', '경쟁 질문 유형표 만들기']),
          csf('message-link', '메시지 개선 연결', '수집된 반응이 메시지 개선 후보로 연결되어야 한다', [kpi('메시지 개선 후보 건수', '2주 1회', '고객 반응 기반 메시지 개선 후보'), kpi('승인자료 기반 대응률', '2주 1회', '승인자료 기반 대응 체크')], ['메시지 개선 후보 메모 작성', '승인자료 기반 답변 문장 정리']),
        ],
      },
      {
        id: 'risk-early-warning', type: '처방 위험 조기감지형', task: '처방 감소 가능성이 있는 고객군을 조기에 파악하고 재접점 우선순위를 정한다.',
        csfs: [
          csf('risk-definition', '위험 신호 정의', '감소·대체·관심 저하 신호가 정의되어야 한다', [kpi('처방 감소 신호 기록 건수', '주 1회', '처방 감소·대체 가능성 신호 기록'), kpi('관심 저하 신호 기록 건수', '주 1회', '고객 관심 저하 메모')], ['처방 감소·대체 가능성 신호 기록 양식 통일', '관심 저하 신호 예시 공유']),
          csf('risk-priority', '우선순위 기준 마련', '어떤 고객을 먼저 볼지 기준이 있어야 한다', [kpi('고위험 고객 분류 건수', '주 1회', '고위험 고객 분류표'), kpi('고위험 고객 재접점 완료율', '주 1회', '고위험 고객 재접점 완료 목록')], ['고위험 고객 우선순위 정리', '고위험 고객 재접점 일정 확정']),
          csf('manager-support', '지원 필요 상신', '팀장 지원이 필요한 고객이 올라와야 한다', [kpi('팀장 지원 요청 건수', '주 1회', '팀장 개입 필요 고객 이슈'), kpi('지원 이슈 해소율', '2주 1회', '지원 요청 후 완료 상태')], ['팀장 지원 필요 고객 공유', '지원 이슈 완료 상태 점검']),
        ],
      },
      {
        id: 'competitive-defense', type: '경쟁 방어형', task: '경쟁 질문과 고객 이탈 신호를 팀 단위로 공유해 주력 제품 시장 방어 활동을 정교화한다.',
        csfs: [
          csf('share-question', '경쟁 질문 공유 기준 통일', '경쟁 제품 관련 질문과 우려가 팀 안에서 빠르게 공유되어야 한다', [kpi('경쟁 질문 공유 건수', '주 1회', '경쟁 질문 공유 목록'), kpi('반복 경쟁 질문 식별 건수', '2주 1회', '반복 경쟁 질문 목록')], ['경쟁 질문 공유 게시판 운영', '반복 질문 리스트 작성']),
          csf('fact-response', '사실 중심 대응', '경쟁 질문에 답할 때 근거와 표현 기준을 지켜야 한다', [kpi('승인자료 기반 대응률', '2주 1회', '승인자료 기반 대응 체크'), kpi('위험 표현 수정 건수', '수시/주 1회', '수정 전후 표현 예시')], ['승인자료 기반 답변 문장 정리', '위험 표현 예시 공유']),
          csf('learning-loop', '방어 활동 학습', '반복되는 질문이 팀 대응 기준으로 축적되어야 한다', [kpi('반복 질문 대응 기준 작성 건수', '2주 1회', '반복 질문 대응 기준 문서'), kpi('팀 공유 학습 건수', '2주 1회', '팀 공유 사례 목록')], ['반복 질문 대응 기준 업데이트', '팀 공유 학습 사례 작성']),
        ],
      },
    ],
  },
  {
    id: 'ckd-rnd-bio-pipeline-story',
    caution: '개발 성공을 단정하거나 허가 전 적응증을 암시하지 않습니다.',
    teamTasks: [
      { id: 'pipeline-question', type: '고객 질문 수집형', task: '핵심 파이프라인과 미래 성장 스토리에 대해 고객이 궁금해하는 주제를 수집하고 승인된 범위 안에서 설명 기준을 정리한다.', csfs: [csf('question-collect', '고객 관심 주제 수집', '고객이 궁금해하는 연구·바이오 주제가 기록되어야 한다', [kpi('파이프라인 관련 고객 질문 수집 건수', '주 1회', '파이프라인 질문 기록'), kpi('관심 주제 분류율', '2주 1회', '관심 주제 분류표')], ['파이프라인 질문 수집 항목 만들기', '고객 관심 주제 분류표 작성']), csf('answer-boundary', '설명 가능 범위 확인', '고객에게 말할 수 있는 내용과 확인이 필요한 내용이 구분되어야 한다', [kpi('확인 필요 질문 등록 건수', '주 1회', '확인 필요 질문 목록'), kpi('승인자료 기반 설명률', '2주 1회', '승인자료 사용 체크')], ['설명 가능/확인 필요 질문 분류', '승인자료 기반 설명 문장 정리'])] },
      { id: 'message-upgrade', type: '커뮤니케이션 고도화형', task: '고객이 묻는 파이프라인 관심 주제를 분류해 전사 커뮤니케이션 메시지 고도화에 기여한다.', csfs: [csf('repeat-question', '반복 질문 식별', '반복되는 질문이 확인되어야 한다', [kpi('반복 질문 식별 건수', '2주 1회', '반복 질문 리스트'), kpi('메시지 개선 제안 건수', '월 1회', '메시지 개선 제안 메모')], ['반복 질문 리스트 작성', '커뮤니케이션 개선 메모 작성']), csf('topic-classify', '관심 주제 분류', '고객 질문이 연구·임상·사업화·안전성 등으로 나뉘어야 한다', [kpi('관심 주제 분류율', '2주 1회', '주제별 분류표'), kpi('고객 관심 주제 요약 건수', '월 1회', '월간 요약 자료')], ['고객 관심 주제 월간 요약 공유', '주제별 질문 정리'])] },
      { id: 'compliance-boundary', type: '표현 경계 관리형', task: '설명 가능한 내용과 내부 확인이 필요한 질문을 구분해 허용된 대외 커뮤니케이션 기준을 지킨다.', csfs: [csf('safe-expression', '표현 경계 인식', '허용 표현과 금지 표현이 구분되어야 한다', [kpi('위험 표현 수정 건수', '수시/주 1회', '수정 전후 표현 예시'), kpi('승인 표현 사용률', '2주 1회', '승인 표현 기준 체크')], ['허용 표현/금지 표현 예시 공유', '고객 메시지 샘플 점검']), csf('internal-check', '내부 확인 루틴', '답변 전 확인이 필요한 질문은 내부로 연결되어야 한다', [kpi('내부 확인 완료율', '2주 1회', '확인 요청 완료 기록'), kpi('확인 필요 질문 등록 건수', '주 1회', '내부 확인 질문 목록')], ['내부 확인 질문 분류', '확인 요청 완료 상태 점검'])] },
      { id: 'commercial-signal', type: '사업화 신호 보완형', task: '신약·바이오 성장 스토리에 대한 고객 반응을 수집해 사업화 연결 가능성을 현장 관점에서 보완한다.', csfs: [csf('demand-signal', '고객 수요 신호 수집', '고객 관심과 필요가 확인되어야 한다', [kpi('고객 수요 신호 기록 건수', '2주 1회', '고객 수요 신호 메모'), kpi('사업화 관련 고객 질문 건수', '2주 1회', '사업화 관련 질문 기록')], ['고객 수요 신호 메모 작성', '사업화 관련 질문 기록 기준 정리']), csf('feedback-transfer', '현장 관점 피드백 전달', '고객 반응이 사업화 검토에 전달되어야 한다', [kpi('사업화 검토 전달 건수', '월 1회', '내부 전달 항목 목록'), kpi('전달 후 검토 회신 건수', '월 1회', '검토 회신 기록')], ['내부 검토 전달 항목 정리', '검토 회신 기록 남기기'])] },
    ],
  },
  {
    id: 'ckd-data-based-field-execution',
    caution: '방문 수나 기록량만 늘리는 활동을 성과로 보지 않습니다.',
    teamTasks: [
      { id: 'execution-management', type: '실행관리 표준화형', task: '고객 반응, 다음 행동, Follow-up 상태를 같은 기준으로 남겨 팀 실행관리와 의사결정에 활용한다.', csfs: [csf('reaction-record', '기록 기준 통일', '고객 반응과 다음 행동을 남기는 기준이 같아야 한다', [kpi('고객 반응 기록률', '주 1회', '고객 반응이 포함된 방문 기록'), kpi('다음 행동 입력률', '주 1회', '다음 행동이 입력된 기록')], ['고객 반응·다음 행동 기록 기준 정리', '좋은 기록/부족한 기록 예시 비교']), csf('followup-visible', '후속 상태 가시화', '자료 제공과 Follow-up 상태가 팀장에게 보이도록 관리되어야 한다', [kpi('Follow-up 기한 준수율', '주 1회', 'Follow-up 예정일·완료일 기록'), kpi('미완료 Follow-up 건수', '주 1회', '미완료 후속 과제 목록')], ['Follow-up 예정일과 완료 상태 입력', '2주 단위 실행 대시보드 점검'])] },
      { id: 'data-standard', type: '고객 데이터 표준화형', task: '영업 현장의 고객 접점 데이터를 표준화해 전사 고객 인사이트 축적에 기여한다.', csfs: [csf('input-standard', '입력 항목 통일', '팀원들이 같은 항목으로 데이터를 남겨야 한다', [kpi('표준 항목 입력률', '주 1회', '표준 입력 항목 충족 여부'), kpi('기록 누락 건수', '주 1회', '필수 항목 누락 목록')], ['표준 입력 항목 재정리', '입력 누락 체크 기준 만들기']), csf('insight-quality', '기록 품질 확보', '단순 방문 사실보다 고객 반응과 다음 행동이 포함되어야 한다', [kpi('기록 품질 충족률', '주 1회', '좋은 기록/부족한 기록 샘플'), kpi('전사 공유 가능 기록 건수', '2주 1회', '공유 가능 인사이트 표시')], ['좋은 기록/부족한 기록 예시 비교', '전사 공유 가능 인사이트 표시'])] },
      { id: 'early-warning', type: '실행 지연 조기감지형', task: '고객 반응과 실행 지연 신호를 조기에 확인해 팀 단위 실행관리 품질을 높인다.', csfs: [csf('delay-standard', '지연 기준 명확화', '무엇을 실행 지연으로 볼지 정해져 있어야 한다', [kpi('실행 지연 건수', '주 1회', '지연 과제와 지연 사유 목록'), kpi('지연 사유 기록률', '주 1회', '지연 사유가 기록된 과제 비율')], ['지연 과제 주간 확인', '지연 사유 기록 기준 정리']), csf('support-signal', '지원 필요 신호 포착', '팀장 지원이 필요한 이슈가 올라와야 한다', [kpi('지원 필요 등록 건수', '주 1회', '지원 필요 이슈 등록'), kpi('지연 해소율', '2주 1회', '지연 해소 완료 기록')], ['지원 필요 이슈 등록 기준 정리', '지연 해소 상태 점검'])] },
      { id: 'insight-link', type: '전략 인사이트 연결형', task: '방문 기록을 단순 활동 기록이 아니라 다음 행동과 전략 인사이트로 연결한다.', csfs: [csf('insight-convert', '인사이트 전환 기준', '고객 반응이 전략 인사이트로 바뀌는 기준이 있어야 한다', [kpi('전략 인사이트 전환 건수', '2주 1회', '고객 반응→인사이트 전환 메모'), kpi('반복 신호 요약 건수', '2주 1회', '반복 신호 요약표')], ['고객 반응을 인사이트로 바꾸는 기준 정리', '반복 신호 주간 요약']), csf('next-action', '다음 행동 연결', '기록마다 다음 행동이 붙어야 한다', [kpi('다음 행동 연결률', '주 1회', '다음 행동 연결 문장'), kpi('다음 행동 미입력 건수', '주 1회', '다음 행동이 없는 기록 목록')], ['기록 후 다음 행동 연결 문장 추가', '다음 행동 없는 기록 찾기'])] },
    ],
  },
  {
    id: 'ckd-quality-supply-compliance',
    caution: '확인되지 않은 품질·공급 정보를 단정하거나 고객 불안을 키우는 표현을 쓰지 않습니다.',
    teamTasks: [
      { id: 'fact-record', type: '문의 사실 기록형', task: '품질·공급·컴플라이언스 관련 고객 문의를 사실 중심으로 기록하고, 확인 전 단정 답변을 줄인다.', csfs: [csf('fact-only', '문의 사실 기록', '고객 문의를 해석하지 않고 사실 중심으로 남겨야 한다', [kpi('품질·공급 문의 기록 건수', '주 1회', '품질·공급 문의 기록'), kpi('사실 중심 기록률', '주 1회', '해석보다 사실 중심으로 작성된 기록 비율')], ['품질·공급 문의 기록 기준 통일', '사실 중심 기록 샘플 점검']), csf('no-unchecked-answer', '확인 전 답변 제한', '내부 확인이 필요한 내용은 즉시 단정하지 않아야 한다', [kpi('미확인 답변 발생 건수', '주 1회', '미확인 답변 사례'), kpi('내부 확인 질문 등록 건수', '주 1회', '내부 확인 필요 질문 목록')], ['내부 확인 필요 질문 분류', '확인 전 답변 금지 표현 공유'])] },
      { id: 'trust-risk', type: '신뢰 리스크 관리형', task: '품질·공급 문의를 내부 확인 흐름과 연결해 고객 신뢰 리스크를 조기에 관리한다.', csfs: [csf('internal-flow', '내부 연결 흐름 확보', '문의가 담당 부서로 빠르게 연결되어야 한다', [kpi('내부 확인 리드타임', '2주 1회', '등록일·확인완료일 기록'), kpi('내부 연결 누락 건수', '주 1회', '담당 부서 미연결 문의 목록')], ['내부 확인 연결 담당 정리', '문의 전달 흐름 점검']), csf('complete-followup', '처리 기한 명확화', '후속 완료 기준과 기한이 있어야 한다', [kpi('고객 문의 후속 완료율', '주 1회', '문의 후속 완료 상태'), kpi('고객 신뢰 리스크 등록 건수', '주 1회', '신뢰 리스크 문의 목록')], ['문의 후속 처리 완료 상태 점검', '고객 신뢰 리스크 신호 공유'])] },
      { id: 'safe-expression', type: '안전 표현 정착형', task: '고객 커뮤니케이션에서 위험 표현을 줄이고 승인된 표현 기준을 팀 단위로 정착시킨다.', csfs: [csf('risky-expression', '위험 표현 인식', '과장, 단정, 허가 외 표현을 구분해야 한다', [kpi('위험 표현 수정 건수', '수시/주 1회', '수정 전후 표현 예시'), kpi('표현 피드백 반영률', '2주 1회', '피드백 반영 전후 문장')], ['위험 표현 예시 카드 만들기', '고객 메시지 샘플 점검']), csf('approved-expression', '승인 표현 활용', '승인된 표현을 기준으로 말해야 한다', [kpi('승인 표현 사용률', '2주 1회', '승인 표현 기준 체크'), kpi('승인 표현 문장 공유 건수', '2주 1회', '팀 공유 문장 목록')], ['승인 표현 문장 공유', '승인 표현 기준 점검'])] },
      { id: 'repeat-issue', type: '반복 문의 개선형', task: '반복되는 고객 문의 유형을 수집해 전사 품질·공급·컴플라이언스 대응 기준 개선에 기여한다.', csfs: [csf('repeat-classify', '반복 문의 유형화', '반복되는 문의가 유형별로 정리되어야 한다', [kpi('반복 문의 유형 분류 건수', '2주 1회', '반복 문의 유형표'), kpi('재발 문의 감소율', '월 1회', '동일 유형 문의 추이')], ['반복 문의 유형표 작성', '동일 유형 재발 여부 점검']), csf('improvement-request', '개선 필요 항목 전달', '반복 문의가 전사 대응 기준 개선으로 연결되어야 한다', [kpi('전사 개선 요청 건수', '월 1회', '전사 개선 요청 항목'), kpi('개선 요청 회신 건수', '월 1회', '개선 요청에 대한 회신 기록')], ['전사 개선 요청 항목 정리', '개선 요청 회신 기록'])] },
    ],
  },
];

const DEFAULT_STATE: PerformanceCascadeState = {
  selectedStrategyId: '',
  selectedTeamTaskId: '',
  selectedTeamTask: '',
  customTeamTask: '',
  selectedCsfId: '',
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

function splitLines(value: string) {
  return value.split(/\r?\n/).map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim()).filter(Boolean).slice(0, 6);
}

function Field({ label, help, children }: { label: string; help?: string; children: ReactNode }) {
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
  const enterpriseInitiatives = useMemo(() => splitLines(researchState.issueTwo), [researchState.issueTwo]);
  const cascade = useMemo(() => teamCascadeOf(researchState.selectedTopicId), [researchState.selectedTopicId]);
  const selectedTeamTaskId = state.selectedTeamTaskId || cascade.teamTasks[0].id;
  const selectedTeamOption = cascade.teamTasks.find((item) => item.id === selectedTeamTaskId) ?? cascade.teamTasks[0];
  const selectedCsfId = state.selectedCsfId || selectedTeamOption.csfs[0].id;
  const selectedCsf = selectedTeamOption.csfs.find((item) => item.id === selectedCsfId) ?? selectedTeamOption.csfs[0];
  const selectedKpi = selectedCsf.kpis.find((item) => item.label === state.selectedKpi) ?? selectedCsf.kpis[0];
  const selectedInitiative = state.selectedInitiative || selectedCsf.initiatives[0];
  const teamTask = state.customTeamTask.trim() || selectedTeamOption.task;

  const makeDraft = () => {
    update({
      teamStandard: `전사 전략과제: ${enterpriseTitle}\n팀 전략과제: ${teamTask}\n- 유형: ${selectedTeamOption.type}\n- 팀 CSF: ${selectedCsf.label}: ${selectedCsf.description}\n- 팀 KPI: ${selectedKpi.label}\n- 관리 주기: ${selectedKpi.cycle}\n- 확인 기준/증거: ${selectedKpi.evidence}\n- 담당/확인: ${selectedKpi.owner}\n- 세부 추진과제: ${selectedInitiative}\n- 주의: ${cascade.caution}`,
      twoWeekFirstAction: `1주차: 담당자별로 '${selectedInitiative}' 실행 기준을 맞추고 첫 기록을 남긴다.\n2주차: '${selectedKpi.label}' 기준으로 결과를 모아 지연·지원 필요를 확인한다.\n담당: ${selectedKpi.owner}\n증거: ${selectedKpi.evidence}`,
      pauseActivity: '전사 전략과제와 직접 연결되지 않는 방문 수 늘리기, 장문 보고, 목적 없는 자료 전달은 잠시 줄인다.',
      midCheckQuestion: `이번 주 실행에서 '${selectedCsf.label}'가 보이는 증거는 무엇인가요? '${selectedKpi.evidence}'로 확인하면 어느 담당자 또는 고객군에서 보완이 필요한가요?`,
      finalExecutionStandard: `다음 단계에서는 '${selectedInitiative}'를 팀원이 실행할 업무지시로 바꾸고, '${selectedKpi.label}'의 관리 주기(${selectedKpi.cycle})와 확인 증거(${selectedKpi.evidence})를 포함한다.`,
    });
  };

  return (
    <section className="space-y-4">
      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-emerald-700">팀 기준 만들기</p>
        <h3 className="mt-1 text-xl font-black text-slate-950">4단계 전사전략을 팀 기준으로 바꾸기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">4단계에서 선택한 전사 전략과제와 추진과제 후보를 확인한 뒤, 우리 팀의 전략과제·CSF·KPI·세부 추진과제·2주 실행계획으로 내립니다.</p>
      </section>

      <section className="rounded-3xl border border-cyan-100 bg-cyan-50 p-4 text-sm font-bold leading-6 text-cyan-950 shadow-sm md:p-5">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">4단계에서 가져온 전사 기준</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">{enterpriseTitle}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-3"><p className="font-black text-cyan-900">전사 추진과제 후보</p>{enterpriseInitiatives.length ? <ul className="mt-2 space-y-1 text-xs">{enterpriseInitiatives.map((item) => <li key={item}>- {item}</li>)}</ul> : <p className="mt-2 text-xs text-slate-500">4단계 NotebookLM 결과에서 [전사 추진과제 후보]를 정리하면 이곳에 연결됩니다.</p>}</div>
          <div className="rounded-2xl bg-white p-3"><p className="font-black text-cyan-900">전사 CSF</p><ul className="mt-2 space-y-1 text-xs">{enterpriseTopic.csfs.map((item) => <li key={item}>- {item}</li>)}</ul></div>
          <div className="rounded-2xl bg-white p-3"><p className="font-black text-cyan-900">전사 KPI</p><ul className="mt-2 space-y-1 text-xs">{enterpriseTopic.kpis.map((item) => <li key={item}>- {item}</li>)}</ul></div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Field label="팀 전략과제 보기 4개" help="전사 추진과제와 전사 KPI에 기여할 수 있는 팀 역할을 고릅니다. 선택에 따라 CSF가 바뀌고, CSF가 바뀌면 KPI와 추진과제도 함께 바뀝니다.">
          <div className="space-y-2">{cascade.teamTasks.map((teamTaskOption) => <label key={teamTaskOption.id} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={selectedTeamOption.id === teamTaskOption.id} onChange={() => update({ selectedTeamTaskId: teamTaskOption.id, selectedTeamTask: teamTaskOption.task, customTeamTask: '', selectedCsfId: '', selectedCsf: '', selectedKpi: '', selectedInitiative: '' })} /><span><span className="mr-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-700">{teamTaskOption.type}</span>{teamTaskOption.task}</span></label>)}</div>
        </Field>
        <Field label="우리 팀 전략과제 직접 수정" help="선택한 보기 문장을 우리 팀 언어로 다듬어도 됩니다."><TextArea value={state.customTeamTask} onChange={(value) => update({ customTeamTask: value })} placeholder={selectedTeamOption.task} /></Field>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">팀 CSF 선택</h3>
        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">전략과제 유형: {selectedTeamOption.type}</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {selectedTeamOption.csfs.map((item) => <label key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold"><input className="mr-2" type="radio" checked={selectedCsf.id === item.id} onChange={() => update({ selectedCsfId: item.id, selectedCsf: `${item.label}: ${item.description}`, selectedKpi: '', selectedInitiative: '' })} /><span className="font-black text-slate-950">{item.label}</span><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></label>)}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">선택한 CSF를 측정할 팀 KPI</h3>
        <p className="mt-1 text-xs font-bold leading-5 text-slate-500">선택한 CSF: {selectedCsf.label}</p>
        <div className="mt-4 space-y-2">{selectedCsf.kpis.map((item) => <label key={item.label} className="flex gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold"><input type="radio" checked={selectedKpi.label === item.label} onChange={() => update({ selectedKpi: item.label })} /><span>{item.label}<span className="mt-1 block text-xs text-slate-500">관리 주기: {item.cycle} · 확인 기준: {item.evidence} · 담당/확인: {item.owner}</span></span></label>)}</div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">선택한 CSF를 실행할 세부 추진과제</h3>
        <div className="space-y-2">{selectedCsf.initiatives.map((initiative) => <label key={initiative} className="flex gap-2 rounded-xl bg-white p-2 text-sm font-bold"><input type="radio" checked={selectedInitiative === initiative} onChange={() => update({ selectedInitiative: initiative })} />{initiative}</label>)}</div>
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-950">주의: {cascade.caution}</div>
        <button type="button" className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-black text-white" onClick={makeDraft}>CSF 기반 2주 실행계획 만들기</button>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-black text-slate-950">팀 기준과 2주 실행계획</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label="팀 기준 초안"><TextArea value={state.teamStandard} onChange={(value) => update({ teamStandard: value })} placeholder="전사 전략과제, 팀 전략과제, 팀 CSF, 팀 KPI, 관리 주기, 확인 증거를 정리합니다." /></Field>
          <Field label="2주 실행계획"><TextArea value={state.twoWeekFirstAction} onChange={(value) => update({ twoWeekFirstAction: value })} placeholder="1주차/2주차/담당/증거 기준으로 정리합니다." /></Field>
          <Field label="이번 2주 동안 잠시 줄일 일"><TextArea value={state.pauseActivity} onChange={(value) => update({ pauseActivity: value })} placeholder="예: 전사 전략과제와 직접 연결되지 않는 활동은 잠시 줄인다." /></Field>
          <Field label="팀장이 중간에 물어볼 확인 질문"><TextArea value={state.midCheckQuestion} onChange={(value) => update({ midCheckQuestion: value })} placeholder="예: 이번 주 실행에서 팀 CSF가 보이는 증거는 무엇인가요?" /></Field>
          <Field label="다음 단계에서 업무지시로 바꿀 기준"><TextArea value={state.finalExecutionStandard} onChange={(value) => update({ finalExecutionStandard: value })} placeholder="예: 업무지시에는 KPI 관리 주기와 확인 증거를 포함합니다." /></Field>
        </div>
      </section>
    </section>
  );
}
