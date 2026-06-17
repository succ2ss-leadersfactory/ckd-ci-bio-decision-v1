import { useMemo, useState } from 'react';

export type V40LiteAiDraft = {
  rawText: string;
  finalText: string;
};

export const V40_LITE_EMPTY_AI_DRAFT: V40LiteAiDraft = {
  rawText: '',
  finalText: '',
};

type InputSummary = {
  label: string;
  value: string;
};

type SeparatedAiResult = {
  usefulPoints: string[];
  cautionPoints: string[];
  followUpQuestions: string[];
  fieldSummary: string;
};

const EMPTY_RESULT: SeparatedAiResult = {
  usefulPoints: ['AI 내용을 붙여넣으면 현장에서 쓸 만한 제안이 이곳에 정리됩니다.'],
  cautionPoints: ['고객명, 기관명, 제품명, 실제 수치가 들어간 표현은 사용하지 않습니다.'],
  followUpQuestions: ['팀장이 더 확인할 질문이 이곳에 정리됩니다.'],
  fieldSummary: 'AI 내용을 붙여넣은 뒤 팀장 관점의 한 줄 정리를 확인합니다.',
};

function cleanLine(line: string) {
  return line
    .replace(/^[-*•\d.\s]+/, '')
    .replace(/^#+\s*/, '')
    .replace(/^[가-힣A-Z]\)\s*/, '')
    .trim();
}

function pushUnique(target: string[], value: string) {
  if (!value) return;
  if (target.includes(value)) return;
  target.push(value);
}

export function separateV40LiteAiResult(rawText: string): SeparatedAiResult {
  const lines = rawText
    .split(/\n+/)
    .map(cleanLine)
    .filter(Boolean)
    .filter((line) => line.length > 2);

  if (lines.length === 0) return EMPTY_RESULT;

  const usefulPoints: string[] = [];
  const cautionPoints: string[] = [];
  const followUpQuestions: string[] = [];
  const summaryCandidates: string[] = [];

  for (const line of lines) {
    const compact = line.replace(/\s/g, '');
    const isCaution = /(주의|조심|위험|금지|민감|고객명|기관명|병원명|제품명|수치|개인|과장|단정|비교|확정|보장)/.test(compact);
    const isQuestion = /(질문|확인|물어|체크|추가로|먼저봐야|더봐야|알아봐야|어떻게)/.test(compact) || line.includes('?') || line.includes('？');
    const isSummary = /(요약|정리|한줄|한문장|결론|핵심은|핵심:)/.test(compact);

    if (isCaution) pushUnique(cautionPoints, line);
    else if (isQuestion) pushUnique(followUpQuestions, line);
    else if (isSummary) pushUnique(summaryCandidates, line);
    else pushUnique(usefulPoints, line);
  }

  if (usefulPoints.length === 0) pushUnique(usefulPoints, 'AI 내용 중 현장에서 바로 써볼 제안을 고릅니다.');
  if (cautionPoints.length === 0) pushUnique(cautionPoints, 'AI 표현에 실제 고객·기관·제품·성과 수치가 들어가지 않았는지 확인합니다.');
  if (followUpQuestions.length === 0) pushUnique(followUpQuestions, '바로 움직이기 전에 팀원이 무엇을 더 확인해야 하는지 질문을 남깁니다.');

  const fieldSummary = summaryCandidates[0] || usefulPoints[0] || 'AI 내용을 팀장 관점에서 다시 짧게 정리합니다.';

  return {
    usefulPoints: usefulPoints.slice(0, 4),
    cautionPoints: cautionPoints.slice(0, 4),
    followUpQuestions: followUpQuestions.slice(0, 4),
    fieldSummary,
  };
}

function buildPrompt(stepTitle: string, contextLines: string[], inputSummary: InputSummary[]) {
  const contextBlock = contextLines.map((line) => `- ${line}`).join('\n');
  const inputBlock = inputSummary
    .map((item) => `- ${item.label}: ${item.value.trim() || '아직 입력하지 않음'}`)
    .join('\n');

  return `당신은 제약영업 팀장의 사고 정리를 돕는 AI 파트너입니다.\n\n[실습 단계]\n${stepTitle}\n\n[현장 맥락]\n${contextBlock}\n\n[팀장이 입력한 내용]\n${inputBlock}\n\n[요청]\n아래 형식으로 짧고 실무적으로 정리해주세요. 실제 고객명, 기관명, 제품명, 개인 정보, 민감한 성과 수치는 쓰지 마세요. 과장되거나 단정적인 표현은 피해주세요.\n\n1. 현장에서 쓸 만한 제안 3개\n2. 조심할 표현 2개\n3. 더 확인할 질문 3개\n4. 팀장 관점 한 줄 정리`;
}

function ResultList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
      {items.map((item) => (
        <li key={item} className="rounded-2xl bg-slate-50 px-3 py-2">{item}</li>
      ))}
    </ul>
  );
}

export function V40LiteAiWorkflow({
  stepTitle,
  contextLines,
  inputSummary,
  aiDraft,
  onAiDraftChange,
  finalPlaceholder,
}: {
  stepTitle: string;
  contextLines: string[];
  inputSummary: InputSummary[];
  aiDraft: V40LiteAiDraft;
  onAiDraftChange: (next: V40LiteAiDraft) => void;
  finalPlaceholder: string;
}) {
  const [copied, setCopied] = useState(false);
  const promptText = useMemo(() => buildPrompt(stepTitle, contextLines, inputSummary), [stepTitle, contextLines, inputSummary]);
  const separated = useMemo(() => separateV40LiteAiResult(aiDraft.rawText), [aiDraft.rawText]);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-cyan-700">AI 활용 · 자동분리</p>
          <h4 className="mt-2 text-xl font-black text-slate-950">AI에 묻고, 받은 내용을 현장 언어로 다시 정리합니다</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">AI가 대신 결정하지 않습니다. 팀장이 넣은 맥락을 바탕으로 초안을 받고, 쓸 것과 조심할 것을 나눈 뒤 마지막 문장은 직접 고칩니다.</p>
        </div>
        <button type="button" onClick={copyPrompt} className="rounded-2xl bg-cyan-700 px-4 py-3 text-sm font-black text-white shadow-sm hover:bg-cyan-800">
          {copied ? '프롬프트 복사됨' : 'AI 질문 복사'}
        </button>
      </div>

      <details className="mt-4 rounded-2xl border bg-slate-50 p-4">
        <summary className="cursor-pointer text-sm font-black text-slate-900">AI에게 붙여넣을 질문 보기</summary>
        <pre className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-xs leading-6 text-slate-700">{promptText}</pre>
      </details>

      <label className="mt-4 block">
        <span className="text-sm font-black text-slate-900">AI가 준 내용을 여기에 붙여넣기</span>
        <p className="mt-1 text-sm leading-6 text-slate-600">붙여넣으면 아래에 자동으로 나뉘어 보입니다. 민감 정보가 들어간 내용은 붙여넣지 않습니다.</p>
        <textarea
          className="mt-3 min-h-36 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-600 focus:bg-white focus:ring-2 focus:ring-cyan-100"
          value={aiDraft.rawText}
          onChange={(event) => onAiDraftChange({ ...aiDraft, rawText: event.target.value })}
          placeholder="AI가 준 내용을 붙여넣으면 현장에서 쓸 만한 제안, 조심할 표현, 더 확인할 질문으로 자동 정리됩니다."
        />
      </label>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <p className="font-black text-slate-950">현장에서 쓸 만한 제안</p>
          <ResultList items={separated.usefulPoints} />
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="font-black text-slate-950">조심할 표현</p>
          <ResultList items={separated.cautionPoints} />
        </div>
        <div className="rounded-2xl border bg-white p-4">
          <p className="font-black text-slate-950">더 확인할 질문</p>
          <ResultList items={separated.followUpQuestions} />
        </div>
        <div className="rounded-2xl border bg-slate-900 p-4 text-white">
          <p className="font-black text-cyan-100">AI 내용 한 줄 정리</p>
          <p className="mt-3 text-sm leading-6 text-slate-100">{separated.fieldSummary}</p>
        </div>
      </div>

      <label className="mt-4 block rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
        <span className="text-sm font-black text-cyan-950">팀장 최종 문장</span>
        <p className="mt-1 text-sm leading-6 text-cyan-900">AI 내용을 그대로 쓰지 말고, 우리 팀 회의나 팀원 대화에서 실제로 쓸 말로 바꿔 씁니다.</p>
        <textarea
          className="mt-3 min-h-28 w-full rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-cyan-700 focus:ring-2 focus:ring-cyan-100"
          value={aiDraft.finalText}
          onChange={(event) => onAiDraftChange({ ...aiDraft, finalText: event.target.value })}
          placeholder={finalPlaceholder}
        />
      </label>
    </section>
  );
}
