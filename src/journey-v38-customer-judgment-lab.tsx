import { useMemo, useState } from 'react';

type SignalLabel = '긍정 신호' | '판단 유보' | '주의 신호' | '보완 필요';
type DataCategory = '기회성 Data' | '반응성 Data' | '실행 가능성 Data' | '리스크 Data';

type DataSignal = {
  label: SignalLabel;
  category: DataCategory;
  note: string;
  className: string;
};

type AnalysisState = Record<string, {
  opportunitySignal: string;
  riskSignal: string;
  missingInfo: string;
  memo: string;
}>;

const TYPE_LABELS = ['고객 유형 A', '고객 유형 B', '고객 유형 C', '고객 유형 D', '고객 유형 E', '고객 유형 F'];

const CUSTOMER_TYPES = [
  {
    id: 'A',
    label: '고객 유형 A',
    signals: ['반응 상승', '자료 요청', '후속 가능', '표현 주의'],
    summary: {
      opportunity: '고객 등급 A · 잠재력 높음 · 근거자료 요청 있음',
      response: '최근 콜 반응 긍정 상승 · 후속 미팅 동의',
      feasibility: '후속조치 완료율 90% · CRM 기록 충실',
      risk: '컴플라이언스 중간 · 표현 안전선 확인 필요',
    },
    fullData: ['고객 등급 A', '잠재력 높음', '관계 수준 중간', '최근 방문일 7일 전', '4주 콜 횟수 2회', '접촉 성공률 80%', '최근 콜 반응 긍정 상승', '자료 요청 있음', '후속 미팅 동의', '거절/보류 사유 없음', '후속조치 완료율 90%', 'CRM 기록 충실', '컴플라이언스 중간'],
    firstRead: {
      feature: '반응 상승과 후속 가능성이 뚜렷하게 보이는 유형입니다.',
      strongSignal: '고객 등급 A, 잠재력 높음, 자료 요청, 후속 미팅 동의가 함께 나타납니다.',
      caution: '컴플라이언스 중간 신호가 있어 실행 전 표현과 자료 활용 안전선을 확인해야 합니다.',
      question: '2주 안에 안전하게 후속 대화로 연결할 수 있는가?',
    },
    helper: {
      opportunity: '반응 상승, 자료 요청, 후속 미팅 동의',
      risk: '컴플라이언스 중간, 표현 안전선 확인 필요',
      missing: '사용 가능한 근거자료 범위와 고객 질문의 구체 내용',
      memo: '기회 신호는 강하지만 표현 안전선 확인 없이 바로 밀어붙이면 리스크가 생길 수 있다.',
    },
  },
  {
    id: 'B',
    label: '고객 유형 B',
    signals: ['관심 보류', '니즈 재확인', '자료 활용', '속도 조절'],
    summary: {
      opportunity: '고객 등급 A · 잠재력 높음 · 자료 요청 있음',
      response: '관심 있으나 보류 · 후속 미팅 보류',
      feasibility: '접촉 성공률 60% · 후속조치 완료율 60%',
      risk: '컴플라이언스 낮음 · 기존 치료 유지 선호',
    },
    fullData: ['고객 등급 A', '잠재력 높음', '관계 수준 높음', '최근 방문일 20일 전', '4주 콜 횟수 1회', '접촉 성공률 60%', '최근 콜 반응 관심 있으나 보류', '자료 요청 있음', '후속 미팅 보류', '거절/보류 사유 기존 치료 유지 선호', '후속조치 완료율 60%', 'CRM 기록 보통', '컴플라이언스 낮음'],
    firstRead: {
      feature: '기회성은 높지만 고객이 아직 결정을 보류하는 유형입니다.',
      strongSignal: '고객 등급 A, 잠재력 높음, 관계 수준 높음, 자료 요청이 있습니다.',
      caution: '후속 미팅 보류와 기존 치료 유지 선호가 있어 속도 조절이 필요합니다.',
      question: '지금 밀어붙일 것인가, 보류 이유와 니즈를 먼저 확인할 것인가?',
    },
    helper: {
      opportunity: '잠재력 높음, 관계 수준 높음, 자료 요청',
      risk: '후속 미팅 보류, 기존 치료 유지 선호',
      missing: '보류 이유의 실제 의미와 고객이 비교·확인하려는 기준',
      memo: '관심 신호는 있지만 압박보다 보류 이유와 니즈 재확인이 먼저 필요하다.',
    },
  },
  {
    id: 'C',
    label: '고객 유형 C',
    signals: ['관계 안정', '변화 신호 낮음', '유지 품질', '과잉 접촉 주의'],
    summary: {
      opportunity: '고객 등급 B · 잠재력 중간 · 자료 요청 없음',
      response: '관계 수준 높음 · 안정적 유지',
      feasibility: '접촉 성공률 90% · CRM 기록 충실',
      risk: '컴플라이언스 낮음 · 추가 필요성 낮음',
    },
    fullData: ['고객 등급 B', '잠재력 중간', '관계 수준 높음', '최근 방문일 10일 전', '4주 콜 횟수 2회', '접촉 성공률 90%', '최근 콜 반응 안정적 유지', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 추가 필요성 낮음', '후속조치 완료율 80%', 'CRM 기록 충실', '컴플라이언스 낮음'],
    firstRead: {
      feature: '관계는 안정적이지만 변화 신호는 약한 유형입니다.',
      strongSignal: '관계 수준 높음, 접촉 성공률 높음, CRM 기록 충실이 있습니다.',
      caution: '자료 요청과 후속 미팅이 없어 즉시 실행 신호는 약합니다.',
      question: '집중보다 유지 품질과 반응 변화 관찰이 더 적합한가?',
    },
    helper: {
      opportunity: '관계 수준 높음, 접촉 성공률 높음, CRM 기록 충실',
      risk: '자료 요청 없음, 후속 미팅 없음, 변화 신호 낮음',
      missing: '관계 유지 외에 새롭게 확인할 니즈나 반응 변화 기준',
      memo: '관계는 안정적이지만 변화 신호가 낮아 유지 품질과 관찰 기준을 정리할 필요가 있다.',
    },
  },
  {
    id: 'D',
    label: '고객 유형 D',
    signals: ['접촉 피로', '무반응 증가', '실행 품질 저하', '리스크 관리'],
    summary: {
      opportunity: '고객 등급 B · 잠재력 중간 · 자료 요청 없음',
      response: '무반응 증가 · 접촉 성공률 40%',
      feasibility: '4주 콜 4회이나 후속조치 완료율 30%',
      risk: '컴플라이언스 높음 · 시간 부족/피로감 표현',
    },
    fullData: ['고객 등급 B', '잠재력 중간', '관계 수준 낮음', '최근 방문일 5일 전', '4주 콜 횟수 4회', '접촉 성공률 40%', '최근 콜 반응 무반응 증가', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 시간 부족·피로감 표현', '후속조치 완료율 30%', 'CRM 기록 부족', '컴플라이언스 높음'],
    firstRead: {
      feature: '접촉은 많지만 반응이 낮고 피로 신호가 보이는 유형입니다.',
      strongSignal: '최근 접촉은 많지만 긍정 반응이나 후속 행동으로 이어지지 않았습니다.',
      caution: '무반응 증가, 접촉 성공률 저하, 후속조치 완료율 저하, 컴플라이언스 높음이 있습니다.',
      question: '더 접촉하기보다 접근 강도와 메시지를 줄여야 하는가?',
    },
    helper: {
      opportunity: '최근 접촉 이력은 있으나 긍정 반응은 약함',
      risk: '무반응 증가, 접촉 피로, CRM 기록 부족, 컴플라이언스 높음',
      missing: '무반응 원인, 고객 부담 수준, 최근 메시지의 적절성',
      memo: '접촉을 늘리기보다 접근 강도와 표현을 낮추고 기록과 메시지를 정비해야 한다.',
    },
  },
  {
    id: 'E',
    label: '고객 유형 E',
    signals: ['기회 신호 큼', '질문 증가', '후속 가능', '표현 안전선 중요'],
    summary: {
      opportunity: '고객 등급 A · 잠재력 높음 · 자료 요청 있음',
      response: '질문 증가 · 후속 미팅 동의',
      feasibility: '후속조치 완료율 70% · CRM 기록 보통',
      risk: '컴플라이언스 높음 · 근거자료 확인 필요',
    },
    fullData: ['고객 등급 A', '잠재력 높음', '관계 수준 낮음', '최근 방문일 14일 전', '4주 콜 횟수 1회', '접촉 성공률 70%', '최근 콜 반응 질문 증가', '자료 요청 있음', '후속 미팅 동의', '거절/보류 사유 근거자료 확인 필요', '후속조치 완료율 70%', 'CRM 기록 보통', '컴플라이언스 높음'],
    firstRead: {
      feature: '기회 신호가 강하지만 컴플라이언스 안전선 관리가 중요한 유형입니다.',
      strongSignal: '고객 등급 A, 잠재력 높음, 질문 증가, 후속 미팅 동의가 있습니다.',
      caution: '컴플라이언스 높음과 근거자료 확인 필요가 있어 표현 안전선 관리가 중요합니다.',
      question: '집중하되 어떤 표현과 자료 범위 안에서 움직여야 하는가?',
    },
    helper: {
      opportunity: '질문 증가, 후속 미팅 동의, 잠재력 높음',
      risk: '컴플라이언스 높음, 근거자료 확인 필요, 관계 수준 낮음',
      missing: '허용된 근거자료 범위, 고객 질문의 구체 내용, 표현 안전선',
      memo: '기회는 크지만 안전선 점검 없이 실행하면 가장 위험해질 수 있는 유형이다.',
    },
  },
  {
    id: 'F',
    label: '고객 유형 F',
    signals: ['데이터 부족', '정보 보완', '판단 유보', '기록 정리'],
    summary: {
      opportunity: '고객 등급 C · 잠재력 낮음 · 자료 요청 없음',
      response: '최근 콜 반응 데이터 부족 · 4주 콜 0회',
      feasibility: '후속조치 완료율 20% · CRM 기록 부족',
      risk: '컴플라이언스 중간 · 정보 없음',
    },
    fullData: ['고객 등급 C', '잠재력 낮음', '관계 수준 높음', '최근 방문일 35일 전', '4주 콜 횟수 0회', '접촉 성공률 50%', '최근 콜 반응 데이터 부족', '자료 요청 없음', '후속 미팅 없음', '거절/보류 사유 정보 없음', '후속조치 완료율 20%', 'CRM 기록 부족', '컴플라이언스 중간'],
    firstRead: {
      feature: '관계는 있으나 최근 판단 Data가 부족한 유형입니다.',
      strongSignal: '관계 수준은 높지만 실행 판단 근거는 제한적입니다.',
      caution: '4주 콜 0회, CRM 기록 부족, 후속조치 완료율 낮음이 있습니다.',
      question: '대응 전략보다 정보 보완과 기록 정리가 먼저 필요한가?',
    },
    helper: {
      opportunity: '관계 수준 높음',
      risk: '최근 반응 Data 부족, CRM 기록 부족, 후속조치 완료율 낮음',
      missing: '최근 반응, 실제 니즈, 접촉 공백 이유, CRM 기록',
      memo: '현재 Data만으로 단정하기보다 정보 보완과 기록 정리가 먼저 필요하다.',
    },
  },
];

const SIGNAL_STYLES: Record<SignalLabel, string> = {
  '긍정 신호': 'border-emerald-200 bg-emerald-50 text-emerald-900',
  '판단 유보': 'border-slate-200 bg-slate-50 text-slate-700',
  '주의 신호': 'border-amber-200 bg-amber-50 text-amber-900',
  '보완 필요': 'border-rose-200 bg-rose-50 text-rose-900',
};

const DATA_CATEGORIES: DataCategory[] = ['기회성 Data', '반응성 Data', '실행 가능성 Data', '리스크 Data'];

function makeSignal(label: SignalLabel, category: DataCategory, note: string): DataSignal {
  return { label, category, note, className: SIGNAL_STYLES[label] };
}

function getDataSignal(item: string): DataSignal {
  if (item.includes('고객 등급 A')) return makeSignal('긍정 신호', '기회성 Data', '우선 검토할 가치가 높은 유형입니다. 단, 반응성과 리스크를 함께 봐야 합니다.');
  if (item.includes('고객 등급 B')) return makeSignal('판단 유보', '기회성 Data', '기회가 없는 유형은 아닙니다. 다른 반응 신호가 따라오는지 함께 확인합니다.');
  if (item.includes('고객 등급 C')) return makeSignal('판단 유보', '기회성 Data', '우선순위는 낮을 수 있지만 관계나 정보 보완 필요성과 함께 봐야 합니다.');
  if (item.includes('잠재력 높음')) return makeSignal('긍정 신호', '기회성 Data', '2주 실행 우선순위 후보가 될 수 있습니다. 실제 반응 신호가 따라오는지 확인합니다.');
  if (item.includes('잠재력 중간')) return makeSignal('판단 유보', '기회성 Data', '잠재력만으로 대응 방향을 정하기 어렵습니다. 반응성과 실행 가능성을 함께 봅니다.');
  if (item.includes('잠재력 낮음')) return makeSignal('판단 유보', '기회성 Data', '적극 실행 후보로 보기는 약하지만, 정보 보완이나 관계 유지 필요성은 남아 있을 수 있습니다.');
  if (item.includes('자료 요청 있음')) return makeSignal('긍정 신호', '기회성 Data', '고객의 정보 니즈가 확인된 상태입니다. 승인된 자료 범위 안에서 대응해야 합니다.');
  if (item.includes('자료 요청 없음')) return makeSignal('판단 유보', '기회성 Data', '현재 정보 니즈가 드러나지 않은 상태입니다. 다른 반응 신호가 있는지 확인합니다.');
  if (item.includes('긍정 상승')) return makeSignal('긍정 신호', '반응성 Data', '관심이 살아나는 신호입니다. 후속 질문과 자료 준비가 필요합니다.');
  if (item.includes('질문 증가')) return makeSignal('긍정 신호', '반응성 Data', '고객이 구체적으로 탐색하기 시작한 신호입니다. 근거자료와 답변 범위를 준비합니다.');
  if (item.includes('관심 있으나 보류')) return makeSignal('주의 신호', '반응성 Data', '관심은 있으나 결정 속도가 느립니다. 압박보다 보류 이유를 먼저 확인합니다.');
  if (item.includes('안정적 유지')) return makeSignal('판단 유보', '반응성 Data', '관계는 안정적이지만 변화 신호로 보기는 어렵습니다. 유지 품질을 관리합니다.');
  if (item.includes('무반응 증가')) return makeSignal('주의 신호', '반응성 Data', '반복 접촉보다 원인 확인이 필요합니다. 고객 부담과 접촉 피로를 점검합니다.');
  if (item.includes('데이터 부족')) return makeSignal('보완 필요', '반응성 Data', '최근 반응을 판단할 근거가 부족합니다. 추가 접촉보다 기록과 정보 보완이 먼저입니다.');
  if (item.includes('후속 미팅 동의')) return makeSignal('긍정 신호', '반응성 Data', '2주 안에 실행으로 연결할 수 있는 강한 신호입니다. 준비 품질과 안전선을 함께 봅니다.');
  if (item.includes('후속 미팅 보류')) return makeSignal('주의 신호', '반응성 Data', '후속 행동의 문은 열려 있지만 속도 조절이 필요합니다. 보류 이유를 먼저 확인합니다.');
  if (item.includes('후속 미팅 없음')) return makeSignal('판단 유보', '반응성 Data', '즉시 실행 신호는 약합니다. 자료 요청이나 최근 반응과 함께 판단합니다.');
  if (item.includes('거절/보류 사유 없음')) return makeSignal('판단 유보', '반응성 Data', '뚜렷한 저항은 없지만 적극적 관심 신호로 단정하기는 어렵습니다.');
  if (item.includes('기존 치료 유지 선호')) return makeSignal('주의 신호', '반응성 Data', '현재 선택을 유지하려는 이유가 있습니다. 설득보다 니즈와 판단 기준을 확인합니다.');
  if (item.includes('추가 필요성 낮음')) return makeSignal('판단 유보', '반응성 Data', '변화 필요성이 낮게 표현된 상태입니다. 관계 유지와 관찰이 더 적합할 수 있습니다.');
  if (item.includes('시간 부족') || item.includes('피로감')) return makeSignal('주의 신호', '반응성 Data', '고객 부담이 드러난 신호입니다. 접촉 강도와 메시지 길이를 줄여야 합니다.');
  if (item.includes('근거자료 확인 필요')) return makeSignal('주의 신호', '반응성 Data', '관심은 있지만 근거 검토가 선행되어야 합니다. 승인 자료 범위 안에서 대응합니다.');
  if (item.includes('정보 없음')) return makeSignal('보완 필요', '반응성 Data', '보류 이유나 반응을 해석할 정보가 없습니다. CRM 기록과 현장 확인이 먼저입니다.');
  if (item.includes('최근 방문일')) {
    if (item.includes('35일')) return makeSignal('보완 필요', '실행 가능성 Data', '최근 접촉 공백이 큽니다. 바로 실행하기보다 최신 반응 정보를 먼저 확보합니다.');
    if (item.includes('5일')) return makeSignal('주의 신호', '실행 가능성 Data', '최근 접촉은 있었지만 과잉 접촉이나 피로감 가능성을 함께 점검합니다.');
    return makeSignal('판단 유보', '실행 가능성 Data', '최근 접촉은 있었지만, 방문 자체보다 이후 반응과 후속 행동 여부가 더 중요합니다.');
  }
  if (item.includes('4주 콜 횟수 4회')) return makeSignal('주의 신호', '실행 가능성 Data', '접촉이 많지만 반응이 낮다면 접촉 피로일 수 있습니다. 접근 방식을 재검토합니다.');
  if (item.includes('4주 콜 횟수 0회')) return makeSignal('보완 필요', '실행 가능성 Data', '최근 실행 데이터가 부족합니다. 우선 정보 보완과 접촉 계획을 세워야 합니다.');
  if (item.includes('4주 콜 횟수')) return makeSignal('판단 유보', '실행 가능성 Data', '접촉 빈도만으로는 판단하기 어렵습니다. 반응성과 후속조치를 함께 봅니다.');
  if (item.includes('접촉 성공률 90%') || item.includes('접촉 성공률 80%')) return makeSignal('긍정 신호', '실행 가능성 Data', '대화 연결 가능성이 높은 편입니다. 후속 행동 설계가 가능합니다.');
  if (item.includes('접촉 성공률 70%') || item.includes('접촉 성공률 60%') || item.includes('접촉 성공률 50%')) return makeSignal('판단 유보', '실행 가능성 Data', '접촉은 가능하지만 충분한 실행 신호로 보기는 어렵습니다. 반응 품질을 함께 봅니다.');
  if (item.includes('접촉 성공률 40%')) return makeSignal('주의 신호', '실행 가능성 Data', '접촉 연결성이 낮습니다. 방문 빈도보다 접근 방식과 메시지를 조정해야 합니다.');
  if (item.includes('후속조치 완료율 90%') || item.includes('후속조치 완료율 80%')) return makeSignal('긍정 신호', '실행 가능성 Data', '실행 품질이 좋습니다. 다음 행동으로 이어질 기반이 있습니다.');
  if (item.includes('후속조치 완료율 70%') || item.includes('후속조치 완료율 60%')) return makeSignal('판단 유보', '실행 가능성 Data', '기본 실행은 되고 있지만, 우선순위 판단에는 반응 신호를 더 확인해야 합니다.');
  if (item.includes('후속조치 완료율 30%') || item.includes('후속조치 완료율 20%')) return makeSignal('보완 필요', '실행 가능성 Data', '실행 품질 보완이 필요합니다. 실행 루틴과 기록 정리가 먼저입니다.');
  if (item.includes('CRM 기록 충실')) return makeSignal('긍정 신호', '실행 가능성 Data', '판단 근거가 남아 있어 팀장 코칭과 실행 점검이 가능합니다.');
  if (item.includes('CRM 기록 보통')) return makeSignal('판단 유보', '실행 가능성 Data', '기본 기록은 있으나 다음 행동을 정할 만큼 충분한지 확인해야 합니다.');
  if (item.includes('CRM 기록 부족')) return makeSignal('보완 필요', '실행 가능성 Data', 'Data 분석 전에 기록 정리가 필요합니다. 고객 반응과 후속조치 근거를 보완합니다.');
  if (item.includes('관계 수준 높음')) return makeSignal('긍정 신호', '리스크 Data', '대화 기반은 좋습니다. 다만 관계 안정이 곧 변화 신호는 아닙니다.');
  if (item.includes('관계 수준 중간')) return makeSignal('판단 유보', '리스크 Data', '관계가 약하지는 않지만, 추가 신뢰 형성이 필요한 상태입니다.');
  if (item.includes('관계 수준 낮음')) return makeSignal('주의 신호', '리스크 Data', '관계 기반이 약합니다. 강한 메시지보다 신뢰 회복과 질문 중심 접근이 필요합니다.');
  if (item.includes('컴플라이언스 높음')) return makeSignal('주의 신호', '리스크 Data', '후속 행동 전에 표현, 자료 활용, 메시지 안전선을 반드시 확인해야 합니다.');
  if (item.includes('컴플라이언스 중간')) return makeSignal('주의 신호', '리스크 Data', '실행은 가능하지만 표현과 자료 활용 안전선을 먼저 확인해야 합니다.');
  if (item.includes('컴플라이언스 낮음')) return makeSignal('판단 유보', '리스크 Data', '큰 위험 신호는 낮지만, 실제 대화 표현은 항상 승인 범위 안에서 점검해야 합니다.');
  return makeSignal('판단 유보', '실행 가능성 Data', '단독 판단보다 다른 신호와 함께 봐야 합니다.');
}

function getGroupedData(items: string[]) {
  return DATA_CATEGORIES.map((category) => ({ category, items: items.filter((item) => getDataSignal(item).category === category) })).filter((group) => group.items.length > 0);
}

export function V38CustomerJudgmentLab() {
  const [analysis, setAnalysis] = useState<AnalysisState>({});
  const completedCount = useMemo(
    () => CUSTOMER_TYPES.filter((type) => analysis[type.id]?.memo?.trim()).length,
    [analysis],
  );

  const updateAnalysis = (typeId: string, field: keyof AnalysisState[string], value: string) => {
    setAnalysis((current) => ({
      ...current,
      [typeId]: {
        opportunitySignal: current[typeId]?.opportunitySignal ?? '',
        riskSignal: current[typeId]?.riskSignal ?? '',
        missingInfo: current[typeId]?.missingInfo ?? '',
        memo: current[typeId]?.memo ?? '',
        [field]: value,
      },
    }));
  };

  const applyHelper = (typeId: string) => {
    const type = CUSTOMER_TYPES.find((item) => item.id === typeId);
    if (!type) return;
    setAnalysis((current) => ({
      ...current,
      [typeId]: {
        opportunitySignal: current[typeId]?.opportunitySignal || type.helper.opportunity,
        riskSignal: current[typeId]?.riskSignal || type.helper.risk,
        missingInfo: current[typeId]?.missingInfo || type.helper.missing,
        memo: current[typeId]?.memo || type.helper.memo,
      },
    }));
  };

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Customer Data Analysis</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">고객 Data 분석</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              고객 유형 A~F는 실제 고객이 아니라 유사한 Data 패턴을 가진 교육용 가상 고객 묶음입니다. 각 유형의 기회 신호, 우려 신호, 추가 확인 정보를 읽고 다음 단계에서 대응 전략을 설계합니다.
            </p>
          </div>
          <div className="rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-black text-cyan-800">
            판단 메모 {completedCount} / {CUSTOMER_TYPES.length}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">전체 고객 유형 한눈에 보기</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">아래 요약은 대응 전략이 아니라 Data를 읽기 위한 출발점입니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {CUSTOMER_TYPES.map((type) => (
            <article key={type.id} className="rounded-2xl border bg-slate-50 p-4">
              <p className="font-black text-slate-900">{type.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{type.signals.join(' · ')}</p>
            </article>
          ))}
        </div>
      </div>

      <details className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5 shadow-sm md:p-6">
        <summary className="cursor-pointer text-lg font-black text-slate-950">고객 유형 A~F, 먼저 이렇게 읽어보세요</summary>
        <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
          아래 요약은 정답이 아니라 Data를 읽기 위한 첫 인상입니다. 대응 전략은 다음 단계에서 직접 설계하세요.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {CUSTOMER_TYPES.map((type) => (
            <article key={type.id} className="rounded-2xl border bg-white p-4">
              <p className="font-black text-slate-950">{type.label}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-slate-700"><span className="font-black text-cyan-700">핵심 특징: </span>{type.firstRead.feature}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-emerald-800"><span className="font-black">강한 신호: </span>{type.firstRead.strongSignal}</p>
              <p className="mt-2 text-xs font-bold leading-5 text-amber-800"><span className="font-black">주의 신호: </span>{type.firstRead.caution}</p>
              <p className="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold leading-5 text-slate-700"><span className="font-black">판단 질문: </span>{type.firstRead.question}</p>
            </article>
          ))}
        </div>
      </details>

      {CUSTOMER_TYPES.map((type, index) => {
        const current = analysis[type.id] ?? { opportunitySignal: '', riskSignal: '', missingInfo: '', memo: '' };
        const groupedData = getGroupedData(type.fullData);
        return (
          <details key={type.id} className="rounded-3xl border bg-white shadow-sm" open={index === 0}>
            <summary className="cursor-pointer list-none p-5 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-black text-cyan-700">Data 기반 해석</p>
                  <h3 className="mt-1 text-xl font-black text-slate-950">{type.label}</h3>
                  <p className="mt-2 text-xs font-bold leading-5 text-slate-600">{type.signals.join(' · ')}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{current.memo ? '메모 완료' : '메모 전'}</span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-black text-cyan-800">펼쳐서 Data 분석</span>
                </div>
              </div>
            </summary>

            <div className="border-t px-5 pb-5 md:px-6 md:pb-6">
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <DataBox title="기회성" text={type.summary.opportunity} />
                <DataBox title="반응성" text={type.summary.response} />
                <DataBox title="실행 가능성" text={type.summary.feasibility} />
                <DataBox title="리스크" text={type.summary.risk} />
              </div>

              <details className="mt-4 rounded-2xl border bg-slate-50 p-4">
                <summary className="cursor-pointer text-sm font-black text-slate-800">전체 13개 Data 다시 보기</summary>
                <p className="mt-3 rounded-2xl bg-white p-3 text-xs font-bold leading-5 text-slate-600">
                  아래 평가는 정답이 아니라 판단을 돕기 위한 해석 힌트입니다. 대응 전략은 고객 유형 전체 신호를 함께 보고 결정하세요.
                </p>
                <div className="mt-3 space-y-4">
                  {groupedData.map((dataGroup) => (
                    <section key={dataGroup.category} className="rounded-2xl border bg-white p-3">
                      <h4 className="text-xs font-black text-cyan-700">{dataGroup.category}</h4>
                      <div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                        {dataGroup.items.map((item) => <DataSignalCard key={item} item={item} />)}
                      </div>
                    </section>
                  ))}
                </div>
              </details>

              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-sm font-black text-emerald-900">Data 해석 도우미</p>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  <HelperBox title="Q1. 핵심 기회 신호는?" text={type.helper.opportunity} />
                  <HelperBox title="Q2. 핵심 우려 신호는?" text={type.helper.risk} />
                  <HelperBox title="Q3. 추가 확인 정보는?" text={type.helper.missing} />
                </div>
                <p className="mt-3 rounded-2xl bg-white p-4 text-sm font-bold leading-6 text-slate-700">
                  <span className="font-black text-slate-950">판단 메모 예시: </span>{type.helper.memo}
                </p>
                <button type="button" className="mt-3 rounded-2xl border bg-white px-4 py-2 text-xs font-black text-slate-700" onClick={() => applyHelper(type.id)}>도우미 문장 가져오기</button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">핵심 기회 신호</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900" value={current.opportunitySignal} onChange={(event) => updateAnalysis(type.id, 'opportunitySignal', event.target.value)} placeholder="예: 자료 요청과 후속 미팅 동의가 있어 2주 안에 대화로 연결될 가능성이 있다." />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">핵심 우려 신호</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900" value={current.riskSignal} onChange={(event) => updateAnalysis(type.id, 'riskSignal', event.target.value)} placeholder="예: 컴플라이언스 신호가 있어 표현과 자료 활용 안전선 확인이 필요하다." />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">추가 확인 정보</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900" value={current.missingInfo} onChange={(event) => updateAnalysis(type.id, 'missingInfo', event.target.value)} placeholder="예: 고객 질문의 구체 내용, 사용 가능한 자료 범위, 최근 반응 정보." />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-black text-slate-500">1차 판단 메모</span>
                  <textarea className="min-h-24 w-full rounded-2xl border px-3 py-2 text-sm leading-6 text-slate-900" value={current.memo} onChange={(event) => updateAnalysis(type.id, 'memo', event.target.value)} placeholder="예: 기회는 있지만 안전선 확인 전까지는 조건부로 접근해야 한다." />
                </label>
              </div>
            </div>
          </details>
        );
      })}
    </section>
  );
}

function DataBox({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border bg-slate-50 p-4"><p className="text-xs font-black text-cyan-700">{title}</p><p className="mt-1 text-sm font-bold leading-6 text-slate-800">{text}</p></div>;
}

function DataSignalCard({ item }: { item: string }) {
  const signal = getDataSignal(item);
  return <article className="rounded-2xl border bg-white p-3"><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black text-slate-900">{item}</p><span className={`rounded-full border px-2 py-1 text-[11px] font-black ${signal.className}`}>{signal.label}</span></div><p className="mt-2 text-xs font-bold leading-5 text-slate-600">{signal.note}</p></article>;
}

function HelperBox({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl bg-white p-4"><p className="text-xs font-black text-slate-500">{title}</p><p className="mt-1 text-sm font-bold leading-6 text-emerald-900">{text}</p></div>;
}
