import Link from 'next/link';
import { Lead, SectionTitle } from '@/components/Typography';

export default function FinalCTA() {
  return (
    <div className="text-center space-y-6">
      <SectionTitle className="section__title">Start with confidence.</SectionTitle>
      <Lead className="hero__subtitle">
        Book a free consultation and discover how thoughtful planning keeps you present for what matters most.
      </Lead>
      <div>
        <Link className="btn btn--primary" href="/contact">
          Book a Free Consultation
        </Link>
      </div>
    </div>
  );
}
