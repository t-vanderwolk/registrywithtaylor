'use client';

import type { AcademyPlanningQuestion } from '@/lib/guides/strollerAcademy';

export default function PlanningQuestionCard({
  question,
  questionNumber,
  total,
  selectedOptionId,
  onSelect,
}: {
  question: AcademyPlanningQuestion;
  questionNumber: number;
  total: number;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
}) {
  return (
    <section className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:p-7">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">
        Question {questionNumber} of {total}
      </p>
      <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#2F2430] sm:text-[2rem]">{question.prompt}</h3>
      <p className="mt-4 text-base leading-8 text-[#5B4B55]">{question.description}</p>

      <div className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={[
                'rounded-[1.35rem] border px-5 py-4 text-left transition duration-300',
                isSelected
                  ? 'border-[rgba(161,91,114,0.42)] bg-[rgba(250,239,243,0.95)] shadow-[0_14px_40px_rgba(58,36,43,0.08)]'
                  : 'border-[rgba(215,161,175,0.16)] bg-[rgba(252,247,249,0.88)] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(58,36,43,0.08)]',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-medium text-[#2F2430]">{option.label}</p>
                  <p className="mt-2 text-sm leading-7 text-[#5B4B55]">{option.description}</p>
                </div>
                <span
                  className={[
                    'mt-1 inline-flex h-5 w-5 flex-none rounded-full border',
                    isSelected ? 'border-[#A15B72] bg-[#A15B72]' : 'border-[rgba(161,91,114,0.22)] bg-white',
                  ].join(' ')}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
