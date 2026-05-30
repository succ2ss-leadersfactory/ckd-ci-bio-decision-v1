import type { IssueNote } from './journey-components';
import { ISSUE_FIELDS } from './journey-components';
import { MEMBERS, METRIC_ORDER, type Scenario } from './journey-data';

export type JourneyStateLike = Record<string, any>;

export function emptyNotes(): IssueNote[] {
  return Array.from({ length: 3 }, () => ({
    issue: '',
    change: '',
    source: '',
    date: '',
    reliability: '',
    why: '',
    check: '',
    question: '',
    compliance: '',
  }));
}

export function metricLabel(key: string) {
  return key === '성과전환지수' ? '성과 신호 전환지수' : key;
}

export function firstLine(text: string) {
  return (text || '').split('\n').map(line => line.trim()).filter(Boolean)[0] || '';
}

export function valueAfter(section: string, keys: string[]) {
  const lines = section.split('\n').map(line => line.trim()).filter(Boolean);

  for (const key of keys) {
    const found = lines.find(line => line.includes(key));
    if (found) {
      return found
        .replace(/^[-*\d.)\s]*/, '')
        .replace(key, '')
        .replace(/^[:：\s-]+/, '')
        .trim();
    }
  }

  return '';
}

export function splitIssueSections(text: string) {
  const strategyIssueHeaders = Array.from(
    text.matchAll(/(?:^|\n)\s*(?:#{1,6}\s*)?전략\s*이슈\s*(\d+)\s*[:：.-]?[^\n]*\n?/g),
  );

  if (strategyIssueHeaders.length > 0) {
    return strategyIssueHeaders
      .map((header, index) => text.slice(
        (header.index || 0) + header[0].length,
        index + 1 < strategyIssueHeaders.length ? (strategyIssueHeaders[index + 1].index || text.length) : text.length,
      ).trim())
      .filter(Boolean);
  }

  const numberedHeaders = Array.from(text.matchAll(/(?:^|\n)\s*(?:이슈\s*)?(\d+)\s*[.)]\s+[^\n]+\n?/g));

  if (numberedHeaders.length > 0) {
    return numberedHeaders
      .map((header, index) => text.slice(
        (header.index || 0) + header[0].length,
        index + 1 < numberedHeaders.length ? (numberedHeaders[index + 1].index || text.length) : text.length,
      ).trim())
      .filter(Boolean);
  }

  return [text];
}

export function parseResearch(raw: string): IssueNote[] {
  const notes = emptyNotes();
  const text = (raw || '').replace(/\r/g, '').trim();
  if (!text) return notes;

  splitIssueSections(text).slice(0, 3).forEach((section, index) => {
    notes[index] = {
      issue: valueAfter(section, ['이슈명', '이슈']) || firstLine(section),
      change: valueAfter(section, ['핵심 변화', '핵심변화', '변화']),
      source: valueAfter(section, ['근거 출처', '출처']),
      date: valueAfter(section, ['발행 시점', '발행시점', '날짜']),
      reliability: valueAfter(section, ['신뢰도 판단', '신뢰도']),
      why: valueAfter(section, ['영업팀장에게 주는 시사점', '시사점', '우리 팀에 주는 영향']),
      check: valueAfter(section, ['추가 확인', '확인 필요']),
      question: valueAfter(section, ['우리 팀 실행전략으로 번역할 질문', '전략 질문', '우리 팀 전략 질문']),
      compliance: valueAfter(section, ['주의해야 할 컴플라이언스 표현', '컴플라이언스', '주의 표현']),
    };
  });

  return notes;
}

export function parseAiSections(raw: string) {
  const text = (raw || '').trim();
  const pick = (sectionNumber: number) => text.match(
    new RegExp('##\\s*' + sectionNumber + '[\\s\\S]*?(?=##\\s*' + (sectionNumber + 1) + '|$)'),
  )?.[0] || '';

  return {
    hypotheses: pick(1),
    counter: pick(2),
    questions: pick(3),
    experiments: pick(4),
    cautions: pick(5),
  };
}

export function buildSourceSearchQuery(title: string, notes: IssueNote[]) {
  const keywords = notes.map(note => note.issue).filter(Boolean).slice(0, 3).join(' ');
  return `한국 제약영업 환경 변화 ${title} ${keywords} 고객 접점 CRM 데이터 컴플라이언스 영업 실행관리 공식기관 협회 보고서 최근 자료`
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildSourcePackage(state: JourneyStateLike, notes: IssueNote[], checks: string[], sourceRisk: string) {
  return `[교육용 가상 상황]\nC1바이오 영업팀장 AI 리더십 Development Lab\n본 자료는 교육용 가상 자료이며 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 정보는 포함하지 않는다.\n\n[선택한 환경 변화]\n${state.strategyScenarioTitle || '-'}\n\n[Perplexity 기반 전략 이슈]\n${notes.map((note, index) => `전략 이슈 ${index + 1}\n${ISSUE_FIELDS.map(([key, label]) => `- ${label}: ${note[key] || '-'}`).join('\n')}`).join('\n\n')}\n\n[Source Check 결과]\n${checks.length ? checks.map(check => '- ' + check).join('\n') : '- 아직 체크 전'}\n- 출처·표현 위험 메모: ${sourceRisk || '-'}\n\n[팀 데이터 요약]\n${MEMBERS.map(member => `- ${member.name} / ${member.type}: ${member.signal}`).join('\n')}\n\n[지표 설명]\n- 선행 활동: 콜실행률, 담당처커버리지\n- 과정 품질: CRM기록충실도, 후속조치율, 실행지연\n- 고객 반응: 고객반응지수\n- 결과 신호: 성과 신호 전환지수\n- 조직 확산: 팀기여지수\n\n[컴플라이언스 가이드]\n사용 금지: 실제 고객명, 병원명, 의료진명, 제품명, 매출·처방 정보, 처방 유도 표현\n권장 표현: 고객 가치 접점, 정보 제공 품질, 성과 신호, 실행 우선순위, 후속조치 품질`;
}

export function promptSourceCheck() {
  return `업로드된 소스만 근거로 Studio 산출물 생성 전 준비 상태를 확인해주세요.\n\n1. 이 노트북에 포함된 핵심 소스는 무엇인가?\n2. 전략회의 보고서 작성에 쓸 수 있는 근거는 무엇인가?\n3. 소스가 부족하거나 추가 확인이 필요한 부분은 무엇인가?\n4. 컴플라이언스 관점에서 조심해야 할 표현은 무엇인가?\n5. Studio에서 보고서와 슬라이드를 생성할 때 반드시 반영해야 할 핵심 메시지는 무엇인가?\n\n자료에 없는 내용은 추정하지 말고 “소스에서 확인되지 않음”이라고 표시하세요.`;
}

export function promptStudioReport() {
  return 'C1바이오 영업팀장이 전략회의에서 사용할 1페이지 전략 보고서를 만들어주세요. 외부 환경 변화, 우리 팀 영향, 전략 과제, 우리 팀 실행전략 문장, 하지 않을 일, 2주 실행 실험, 리스크와 보완책, 팀장 요청사항을 포함하세요. 실제 고객명, 병원명, 제품명, 처방 유도 표현은 사용하지 마세요.';
}

export function promptStudioSlides() {
  return '전략회의 발표용 8장 내외 슬라이드 자료를 만들어주세요. 메시지 중심으로 구성하고, 각 장은 제목·핵심 메시지·간결한 bullet·시각자료 아이디어가 드러나게 해주세요. 흐름은 1) 오늘의 결론 2) 전략 조정 필요성 3) 외부 환경 변화 4) 우리 팀 현재 신호 5) 전략 과제와 하지 않을 일 6) 우리 팀 실행전략 7) 2주 실행 실험 8) 팀원별 실행 번역과 요청사항입니다. 실제 고객명, 병원명, 제품명, 처방 유도 표현은 사용하지 마세요.';
}

export function promptResearch(scenario: Scenario, focus: string[], extra: string) {
  return `당신은 제약영업 환경 분석을 돕는 리서치 애널리스트입니다.\n\n목표: C1바이오 영업팀장이 다음 분기 팀 실행전략을 수립하기 위해 참고할 외부 환경 변화 이슈를 찾습니다.\n\n검색 범위:\n- 한국 제약산업 및 헬스케어 영업환경\n- 최근 12~24개월 자료 우선\n- 공식기관, 협회, 규제기관, 신뢰도 높은 언론, 산업 보고서 우선\n- 블로그, 홍보성 콘텐츠, 출처 불명 자료는 제외\n\n우선 탐색할 환경 변화:\n${scenario.title}: ${scenario.signal}\n\n참여자 추가 전략 질문:\n${extra || '우리 팀 실행전략으로 번역할 수 있는 변화 요인을 찾아주세요.'}\n\n분석 관점:\n${focus.map((item, index) => `${index + 1}. ${item}`).join('\n')}\n\n출력 규칙: 아래 제목과 항목명을 반드시 그대로 사용하세요. 표를 사용하지 마세요. 전략 이슈는 최대 3개만 제시하세요.\n\n## 전략 이슈 1\n- 이슈명:\n- 핵심 변화:\n- 근거 출처:\n- 발행 시점:\n- 신뢰도 판단:\n- 영업팀장에게 주는 시사점:\n- 우리 팀 실행전략으로 번역할 질문:\n- 주의해야 할 컴플라이언스 표현:\n\n## 전략 이슈 2\n- 이슈명:\n- 핵심 변화:\n- 근거 출처:\n- 발행 시점:\n- 신뢰도 판단:\n- 영업팀장에게 주는 시사점:\n- 우리 팀 실행전략으로 번역할 질문:\n- 주의해야 할 컴플라이언스 표현:\n\n## 전략 이슈 3\n- 이슈명:\n- 핵심 변화:\n- 근거 출처:\n- 발행 시점:\n- 신뢰도 판단:\n- 영업팀장에게 주는 시사점:\n- 우리 팀 실행전략으로 번역할 질문:\n- 주의해야 할 컴플라이언스 표현:\n\n## 추가 확인이 필요한 자료\n1.\n2.\n3.\n\n주의: 실제 고객명, 병원명, 의료진명, 제품명, 내부 수치, 개인정보는 제외하세요. 민감한 영업 표현 대신 고객 가치 접점, 정보 제공 품질, 성과 신호, 실행 우선순위 표현을 사용하세요.`;
}

export function promptMember(member: { name: string; type: string; metrics: Record<string, number> }, state: JourneyStateLike, causal: string, evidence: string[], plan: JourneyStateLike) {
  return `당신은 영업팀장의 데이터 기반 성과진단을 돕는 리더십 코치입니다.\n\n[우리 팀 실행전략]\n${state.teamStrategyStatement || '-'}\n\n[팀원]\n${member.name} / ${member.type}\n\n[지표]\n${METRIC_ORDER.map(key => `${metricLabel(key)}: ${member.metrics[key]}`).join('\n')}\n\n[판단 근거 지표]\n${evidence.map(metricLabel).join(', ') || '-'}\n\n[나의 인과 가설]\n${causal || '-'}\n\n[2주 실행 약속 초안]\n${plan.twoWeekCommitment || '-'}\n\n아래 제목을 그대로 사용해 답하세요.\n## 1. 가능한 인과 가설 3개\n## 2. 이 해석이 틀렸을 가능성 3개\n## 3. 팀장이 확인해야 할 질문 5개\n## 4. 2주 동안 검증할 작은 실행 실험 2개\n## 5. 성급한 판단을 피하기 위한 주의점`;
}
