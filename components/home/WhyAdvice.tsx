import { Body, SectionTitle } from '@/components/Typography';

export default function WhyAdvice() {
  return (
    <div className="space-y-6 text-center">
      <SectionTitle>There’s a lot of advice out there.</SectionTitle>
      <Body className="mx-auto max-w-3xl">
        Most of it loud. Some of it helpful. Very little of it tailored to you.
      </Body>
      <Body className="mx-auto max-w-3xl">
        Taylor-Made Baby Planning delivers calm, thoughtful guidance that helps you prepare
        intentionally — with products, decisions, and timelines that fit your real life.
      </Body>
    </div>
  );
}
