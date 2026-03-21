'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import AcademyProgressBar from '@/components/guides/academy/AcademyProgressBar';
import PlanningQuestionCard from '@/components/guides/academy/PlanningQuestionCard';
import PlanningResultCard from '@/components/guides/academy/PlanningResultCard';
import type { AcademyPlanningQuestion, StrollerAcademyLane } from '@/lib/guides/strollerAcademy';
import { STROLLER_CATEGORY_GUIDE_SLUGS } from '@/lib/guides/strollerCluster';

function getLaneOrder(slug: string) {
  return STROLLER_CATEGORY_GUIDE_SLUGS.indexOf(slug as (typeof STROLLER_CATEGORY_GUIDE_SLUGS)[number]);
}

export default function PlanningFlow({
  title,
  description,
  questions,
  lanes,
}: {
  title: string;
  description: string;
  questions: AcademyPlanningQuestion[];
  lanes: StrollerAcademyLane[];
}) {
  const prefersReducedMotion = useReducedMotion();
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = React.useState(0);

  const answeredCount = questions.filter((question) => answers[question.id]).length;
  const isComplete = answeredCount === questions.length;
  const currentQuestion = questions[activeIndex];

  const scoreByLane = lanes.reduce<Record<string, number>>((accumulator, lane) => {
    accumulator[lane.slug] = 0;
    return accumulator;
  }, {});

  questions.forEach((question) => {
    const selectedOptionId = answers[question.id];
    const selectedOption = question.options.find((option) => option.id === selectedOptionId);
    if (!selectedOption) {
      return;
    }

    Object.entries(selectedOption.laneScores).forEach(([laneSlug, score]) => {
      scoreByLane[laneSlug] = (scoreByLane[laneSlug] ?? 0) + (score ?? 0);
    });
  });

  const rankedLanes = [...lanes].sort(
    (left, right) =>
      (scoreByLane[right.slug] ?? 0) - (scoreByLane[left.slug] ?? 0) || getLaneOrder(left.slug) - getLaneOrder(right.slug),
  );
  const primaryLane = rankedLanes[0] ?? null;
  const alsoConsiderLane =
    rankedLanes.find((lane) => lane.slug !== primaryLane?.slug && (scoreByLane[lane.slug] ?? 0) > 0) ?? rankedLanes[1] ?? null;

  const whyThisFits =
    primaryLane
      ? questions
          .flatMap((question) => {
            const selectedOptionId = answers[question.id];
            const selectedOption = question.options.find((option) => option.id === selectedOptionId);
            const score = selectedOption?.laneScores[primaryLane.slug] ?? 0;
            if (!selectedOption || score <= 0) {
              return [];
            }

            return [{ score, insight: selectedOption.insight }];
          })
          .sort((left, right) => right.score - left.score)
          .map((item) => item.insight)
          .filter((insight, index, collection) => collection.indexOf(insight) === index)
          .slice(0, 3)
      : [];

  const watchouts = primaryLane?.notBestFitBullets.slice(0, 3) ?? [];

  function handleSelect(questionIndex: number, optionId: string) {
    const question = questions[questionIndex];
    if (!question) {
      return;
    }

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [question.id]: optionId,
    }));

    if (questionIndex < questions.length - 1) {
      setActiveIndex(questionIndex + 1);
    }
  }

  function handleReset() {
    setAnswers({});
    setActiveIndex(0);
  }

  function handleStepClick(index: number) {
    setActiveIndex(index);
  }

  return (
    <section className="space-y-6">
      <div className="max-w-3xl">
        <p className="text-[0.72rem] uppercase tracking-[0.34em] text-[#A15B72]">Planning Flow</p>
        <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-[#2F2430] sm:text-[2.4rem]">{title}</h2>
        <p className="mt-4 text-base leading-8 text-[#5B4B55]">{description}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(19rem,0.62fr)] xl:items-start">
        <div className="space-y-5">
          <section className="rounded-[1.6rem] border border-[rgba(215,161,175,0.18)] bg-white/90 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:p-6">
            <AcademyProgressBar current={answeredCount} total={questions.length} label="Decision Progress" />

            <div className="mt-5 flex flex-wrap gap-2">
              {questions.map((question, index) => {
                const answered = Boolean(answers[question.id]);
                const isActive = activeIndex === index;

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => handleStepClick(index)}
                    className={[
                      'inline-flex min-h-[38px] items-center rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition duration-300',
                      isActive
                        ? 'border-[rgba(161,91,114,0.42)] bg-[rgba(250,239,243,0.95)] text-[#8F4C62]'
                        : answered
                          ? 'border-[rgba(161,91,114,0.16)] bg-white/84 text-[#6C5560]'
                          : 'border-[rgba(215,161,175,0.14)] bg-[rgba(252,247,249,0.72)] text-[#90707B]',
                    ].join(' ')}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </button>
                );
              })}
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.24, ease: 'easeOut' }}
            >
              <PlanningQuestionCard
                question={currentQuestion}
                questionNumber={activeIndex + 1}
                total={questions.length}
                selectedOptionId={answers[currentQuestion.id]}
                onSelect={(optionId) => handleSelect(activeIndex, optionId)}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-5 xl:sticky xl:top-8">
          {primaryLane && isComplete ? (
            <PlanningResultCard
              primaryLane={primaryLane}
              alsoConsiderLane={alsoConsiderLane}
              whyThisFits={whyThisFits.length > 0 ? whyThisFits : primaryLane.worksForBullets.slice(0, 3)}
              watchouts={watchouts}
              onReset={handleReset}
            />
          ) : (
            <section className="rounded-[1.9rem] border border-[rgba(215,161,175,0.18)] bg-white/92 p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">Current Signals</p>
              <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#2F2430]">A calmer result is coming into focus.</h3>
              <p className="mt-4 text-base leading-8 text-[#5B4B55]">
                Answer the questions honestly and the lane pattern usually gets much clearer. This is a planning tool, not a gimmicky quiz.
              </p>

              <div className="mt-6 space-y-3">
                {questions
                  .filter((question) => answers[question.id])
                  .map((question) => {
                    const selectedOption = question.options.find((option) => option.id === answers[question.id]);
                    if (!selectedOption) {
                      return null;
                    }

                    return (
                      <div key={question.id} className="rounded-[1.2rem] bg-[rgba(252,247,249,0.9)] px-4 py-4">
                        <p className="text-[0.68rem] uppercase tracking-[0.22em] text-[#A15B72]">{question.prompt}</p>
                        <p className="mt-2 text-sm font-medium text-[#2F2430]">{selectedOption.label}</p>
                        <p className="mt-1 text-sm leading-7 text-[#5B4B55]">{selectedOption.description}</p>
                      </div>
                    );
                  })}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex min-h-[40px] items-center rounded-full border border-[rgba(215,161,175,0.18)] bg-[rgba(252,247,249,0.92)] px-4 py-2 font-mono text-[0.68rem] text-[#7C5663]">
                  [COMPARE_CTA_PLACEHOLDER: Compare Strollers]
                </span>
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
