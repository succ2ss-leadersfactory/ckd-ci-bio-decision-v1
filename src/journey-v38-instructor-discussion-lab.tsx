const DISCUSSION_GROUPS = [
  {
    title: '1. 고객군 판단 디브리핑',
    purpose: '참여자가 데이터를 어떻게 조합해 고객군을 분류했는지 확인합니다.',
    questions: [
      '어떤 Data 신호가 고객군 분류에 가장 큰 영향을 주었습니까?',
      '고객 등급과 잠재력은 높지만 반응이 보류된 고객군을 어떻게 판단했습니까?',
      '데이터가 부족한 고객군을 과감히 후순위로 둘 때 생길 수 있는 리스크는 무엇입니까?',
      '분류 도우미의 추천과 내 판단이 달랐다면, 어떤 근거로 판단을 유지하거나 바꾸었습니까?',
    ],
  },
  {
    title: '2. 집중/후순위 선택 토의',
    purpose: '우선순위 판단의 기준과 포기 비용을 드러냅니다.',
    questions: [
      '집중 고객군을 하나만 선택해야 한다면 어떤 기준을 가장 우선해야 합니까?',
      '후순위로 둔 고객군에서 놓칠 수 있는 기회비용은 무엇입니까?',
      '관찰/유지 고객군은 방치와 어떻게 구분해야 합니까?',
      '2주라는 시간 제약이 없다면 선택이 달라졌을까요?',
    ],
  },
  {
    title: '3. 팀원별 역할 방향 토의',
    purpose: '고객군 판단이 팀원 실행과 코칭으로 이어지는지 확인합니다.',
    questions: [
      '어떤 팀원에게 집중 고객군을 맡겼습니까? 그 이유는 무엇입니까?',
      '성과 욕구가 높은 팀원에게 기회 고객군을 맡길 때 가장 조심해야 할 점은 무엇입니까?',
      '기록은 꼼꼼하지만 자신감이 낮은 팀원에게 어떤 고객군이 적합합니까?',
      '팀원별 역할을 나눌 때 공정성과 실행 효율성은 어떻게 균형 잡아야 합니까?',
    ],
  },
  {
    title: '4. AI 활용 디브리핑',
    purpose: 'AI를 답변 생성기가 아니라 판단 보조 도구로 사용했는지 확인합니다.',
    questions: [
      'AI에 맡긴 결과물과 사람이 직접 판단한 내용은 어떻게 구분했습니까?',
      'AI 프롬프트에 어떤 판단 맥락을 넣었을 때 결과 품질이 좋아졌습니까?',
      'AI가 그럴듯하지만 현장에 맞지 않는 답을 냈다면 어떻게 수정해야 합니까?',
      'AI 결과를 팀원에게 그대로 전달하면 어떤 문제가 생길 수 있습니까?',
    ],
  },
  {
    title: '5. 컴플라이언스와 최종 실행카드 토의',
    purpose: '최종 산출물이 현장에서 안전하고 실행 가능한지 점검합니다.',
    questions: [
      '최종 콜플랜 카드에서 가장 먼저 삭제해야 할 위험 표현은 무엇이었습니까?',
      '처방 유도와 고객 질문 확인은 문장에서 어떻게 달라집니까?',
      '2주 실행카드가 실제 팀 회의에서 공유 가능한 수준입니까?',
      '내일 현장으로 돌아가면 가장 먼저 바꿀 콜플랜 습관은 무엇입니까?',
    ],
  },
];

const FACILITATION_NOTES = [
  '정답을 맞히게 하지 말고, 판단 근거를 말하게 합니다.',
  '집중 고객군 선택에서는 “왜 이 고객군인가”뿐 아니라 “무엇을 포기했는가”를 묻습니다.',
  'AI 결과물은 완성안이 아니라 초안이며, 팀장의 현장 판단으로 수정되어야 함을 반복합니다.',
  '컴플라이언스 토의는 공포감 조성이 아니라 안전한 실행 언어를 익히는 방향으로 진행합니다.',
  '최종 콜플랜 카드는 발표용 문서가 아니라 2주 행동을 촉발하는 실행 카드로 다룹니다.',
];

export function V38InstructorDiscussionLab() {
  return (
    <section className="space-y-4">
      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-black uppercase tracking-wide text-cyan-700">v38 Instructor Debrief</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">강사용 토의 질문</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          이 단계는 강사가 실습 후 토의를 이끌 때 사용하는 디브리핑 질문입니다. 참여자 화면 부담을 줄이기 위해 접기/펼치기 방식으로 구성했습니다.
        </p>
      </div>

      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-sm md:p-6">
        <h3 className="text-lg font-black">진행 원칙</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-bold leading-6">
          {FACILITATION_NOTES.map((note) => <li key={note}>{note}</li>)}
        </ul>
      </div>

      <div className="space-y-3">
        {DISCUSSION_GROUPS.map((group, index) => (
          <details key={group.title} className="rounded-3xl border bg-white p-5 shadow-sm md:p-6" open={index === 0}>
            <summary className="cursor-pointer text-lg font-black text-slate-950">{group.title}</summary>
            <p className="mt-3 rounded-2xl bg-cyan-50 px-4 py-3 text-sm font-bold leading-6 text-cyan-900">목적: {group.purpose}</p>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm font-bold leading-6 text-slate-700">
              {group.questions.map((question) => <li key={question}>{question}</li>)}
            </ol>
          </details>
        ))}
      </div>

      <div className="rounded-3xl border bg-white p-5 shadow-sm md:p-6">
        <h3 className="text-lg font-black text-slate-950">마무리 한 문장</h3>
        <p className="mt-3 rounded-2xl bg-slate-950 p-4 text-sm font-bold leading-6 text-white">
          AI는 팀장의 판단을 대신하지 않습니다. 좋은 팀장은 AI가 만든 답을 현장 데이터, 팀원 역량, 고객 반응, 컴플라이언스 기준에 맞게 다시 판단합니다.
        </p>
      </div>
    </section>
  );
}
