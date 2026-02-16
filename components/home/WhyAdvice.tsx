import { Body, SectionTitle } from '@/components/Typography';

export default function WhyAdvice() {
  return (
    <div className="relative z-10 space-y-6 text-center">
      <SectionTitle className="!text-[var(--text-primary)] !opacity-100">
        There’s a lot of advice out there.
      </SectionTitle>
      <Body className="mx-auto max-w-3xl leading-[1.85]">
        Most of it loud. Some of it helpful. Very little of it tailored to you.
      </Body>
      <Body className="mx-auto max-w-3xl leading-[1.85]">
        Taylor-Made Baby Planning delivers calm, thoughtful guidance that helps you prepare
        intentionally — with products, decisions, and timelines that fit your real life.
      </Body>
    </div>
  );
}
