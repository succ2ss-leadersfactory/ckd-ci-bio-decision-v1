import React, { useState } from 'react';
import { CardShell, TextBox } from './journey-components';

export type PromptPracticeScreenProps = {
  save: (key: string, payload: Record<string, any>) => void;
};

const DEFAULT_SAFE_PROMPT = '역할: 당신은 영업팀장의 업무관리 코치입니다.\n상황: 교육용 가상 데이터입니다.\n요청: 모호한 업무 지시를 고객 신뢰, 접점 품질, 후속조치 기준이 포함된 실행 요청문으로 바꿔주세요.';

export function PromptPracticeScreen({ save }: PromptPracticeScreenProps) {
  const [prompt, setPrompt] = useState(DEFAULT_SAFE_PROMPT);

  const handleCopyAndSave = () => {
    navigator.clipboard?.writeText(prompt);
    save('J02-prompt', { generatedPrompt: prompt });
  };

  return (
    <CardShell>
      <h2 className="text-xl font-bold">좋은 질문 만들기</h2>
      <TextBox label="안전한 프롬프트" rows={8} value={prompt} setValue={setPrompt} />
      <button className="rounded-xl bg-slate-900 px-4 py-2 text-white" onClick={handleCopyAndSave}>
        복사 및 저장
      </button>
    </CardShell>
  );
}
