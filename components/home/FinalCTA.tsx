import Link from 'next/link';
import { Lead, SectionTitle } from '@/components/Typography';

export default function FinalCTA() {
  return (
    <div className="final-cta-glow text-center space-y-6 bg-[radial-gradient(ellipse_at_top,rgba(255,248,242,0.98)_0%,rgba(251,238,232,0.8)_48%,rgba(248,244,240,0.58)_100%)]">
      <SectionTitle className="section__title final-cta-glow__title !text-[clamp(2.4rem,3vw,3.6rem)]">
        Start with confidence.
      </SectionTitle>
      <Lead className="hero__subtitle mx-auto text-center">
        Book a free consultation and discover how thoughtful planning keeps you present for what matters most.
      </Lead>
      <div>
        <Link
          className="btn btn--primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent-dark)]"
          href="/contact"
        >
          Book a Free Consultation
        </Link>
      </div>
      <p className="final-cta-glow__reassurance">
        30 minutes · Virtual · Calm guidance · No obligation
      </p>
    </div>
  );
}
