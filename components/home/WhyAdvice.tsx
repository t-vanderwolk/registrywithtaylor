import { Body, SectionTitle } from '@/components/Typography';

export default function WhyAdvice() {
  return (
    <div className="relative z-10 mx-auto max-w-4xl space-y-6 rounded-[1.75rem] border border-[#eadfce]/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.92)_0%,rgba(249,242,233,0.6)_100%)] px-6 py-8 text-center shadow-[0_20px_48px_rgba(133,107,92,0.08)] md:px-10 md:py-10">
      <SectionTitle className="!text-[var(--text-primary)] !opacity-100">
        There’s a lot of advice out there.
      </SectionTitle>
      <Body className="mx-auto max-w-3xl leading-[1.92] md:leading-[1.98]">
        Most of it loud. Some of it helpful. Very little of it tailored to you.
      </Body>
      <Body className="mx-auto max-w-3xl leading-[1.92] md:leading-[1.98]">
        Taylor-Made Baby Planning delivers calm, thoughtful guidance that helps you prepare
        intentionally — with products, decisions, and timelines that fit your real life.
      </Body>
    </div>
  );
}
