import Link from 'next/link';
import { Lead, SectionTitle } from '@/components/Typography';

export default function FinalCTA() {
  return (
    <div className="final-cta-glow text-center space-y-6">
      <SectionTitle className="section__title final-cta-glow__title">Start with confidence.</SectionTitle>
      <Lead className="hero__subtitle mx-auto text-center">
        Book a free consultation and discover how thoughtful planning keeps you present for what matters most.
      </Lead>
      <div>
        <Link className="btn btn--primary" href="/contact">
          Book a Free Consultation
        </Link>
      </div>
      <p className="final-cta-glow__reassurance">
        Free Consult · Virtual · Calm guidance · No obligation
      </p>
    </div>
  );
}
