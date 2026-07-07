import LegalShell, { LegalContact, LegalSection, LegalTable } from '@/components/legal/LegalShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Refund Policy | Taylor-Made Baby Co.',
  description:
    'Our commitment to fair, transparent, and straightforward refunds for Taylor-Made Baby Co. consultations.',
  path: '/refund',
  imagePath: '/og-home.jpg',
  imageAlt: 'Taylor-Made Baby Co. Refund Policy',
});

const Yes = () => <span className="font-semibold text-emerald-700">Full</span>;
const No = () => <span className="font-semibold text-neutral-500">None</span>;

export default function RefundPage() {
  return (
    <LegalShell
      currentPath="/refund"
      title="Refund Policy"
      subtitle="Our commitment to fair, transparent, and straightforward refunds."
      effectiveDate="July 1, 2026"
    >
      <LegalSection n="01" title="Refund Summary — At a Glance">
        <p>The following table summarises our refund policy for all consultation bookings:</p>
        <LegalTable
          head={['Situation', 'Refund', 'Timeline / Notes']}
          rows={[
            ['Cancellation 24+ hours before session', <Yes key="1" />, 'Refund within 5–7 business days to original payment method.'],
            ['Cancellation less than 24 hours before session', <No key="2" />, 'No refund. One-time reschedule may be offered at Taylor’s discretion.'],
            ['No-show (missed without cancellation)', <No key="3" />, 'No refund. No reschedule offered.'],
            ['Session cut short by Taylor-Made Baby Co.', <Yes key="4" />, 'Full refund or free reschedule, at your choice, within 3–5 business days.'],
            ['Technical failure on our end', <Yes key="5" />, 'Full refund or free reschedule if the session cannot continue due to our technical failure.'],
            ['Technical failure on your end', <No key="6" />, 'No refund if session is disrupted by client-side internet, device, or platform issues.'],
            ['Taylor cancels with less than 24 hours notice', <Yes key="7" />, 'Full refund + complimentary 30-min follow-up session offered as courtesy.'],
            ['Dissatisfied with consultation outcomes', <span key="8" className="font-semibold text-amber-700">Reviewed</span>, 'See Clause 05 — Satisfaction Policy. Reviewed case-by-case.'],
            ['Free Baby Prep Starter Guide', 'N/A', 'Free resource — no payment required or refundable.'],
            ['Future services (if offered)', 'Per terms', 'Refund terms for any future multi-session packages or courses will be stated at the time of purchase.'],
          ]}
        />
      </LegalSection>

      <LegalSection n="02" title="Consultation Cancellation — Full Details">
        <p className="font-medium text-charcoal">Cancellations made 24 or more hours before the scheduled session</p>
        <p>
          You will receive a full refund of the consultation fee paid. Refunds are processed within 5&ndash;7
          business days to the original payment method used at booking. We cannot expedite this timeline as it is
          subject to your bank or card provider&rsquo;s processing times.
        </p>
        <p>
          To cancel, please email info@taylormadebabyco.com or use the cancellation link in your booking
          confirmation. Please include your name and booking date in your cancellation request.
        </p>
        <p className="font-medium text-charcoal">Cancellations made less than 24 hours before the scheduled session</p>
        <p>
          No refund will be issued. The consultation fee is forfeited to cover the preparation time Taylor has
          already invested in reviewing your intake form and preparing personalised recommendations for your
          session.
        </p>
        <p>
          We understand that emergencies happen. If you experience a genuine emergency (hospitalisation, birth
          complications, or a similar urgent circumstance), please contact us at info@taylormadebabyco.com with
          details. We will review reschedule requests in these circumstances on a compassionate, case-by-case
          basis.
        </p>
      </LegalSection>

      <LegalSection n="03" title="Rescheduling a Consultation">
        <p>We understand that pregnancy schedules change. The following rescheduling terms apply:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Rescheduling requests made 24 or more hours before the session: Accepted at no charge. Reschedule to any available time within 90 days of the original booking.</li>
          <li>Rescheduling requests made less than 24 hours before the session: Accepted at Taylor&rsquo;s discretion only. A $25 late reschedule fee may apply.</li>
          <li>Maximum reschedules per booking: You may reschedule a single booking up to two times. After two reschedules, the booking will be forfeited without refund.</li>
          <li>How to reschedule: Email info@taylormadebabyco.com or use the rescheduling link in your booking confirmation. Please provide at least two preferred alternative dates and times.</li>
        </ul>
      </LegalSection>

      <LegalSection n="04" title="Cancellation by Taylor-Made Baby Co.">
        <p>In the unlikely event that Taylor-Made Baby Co. needs to cancel your scheduled consultation, we will:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Notify you as soon as reasonably possible by email.</li>
          <li>Issue a full refund to your original payment method within 3&ndash;5 business days, regardless of how much notice we provide.</li>
          <li>Offer you priority access to the next available booking slot.</li>
          <li>If Taylor cancels with less than 24 hours notice, we will additionally offer you a complimentary 30-minute follow-up session at your next booking as a courtesy.</li>
        </ul>
      </LegalSection>

      <LegalSection n="05" title="Satisfaction Policy">
        <p>
          We are committed to providing genuine value in every consultation. Taylor prepares personally for each
          session by reviewing your intake form and tailoring her recommendations to your specific situation.
        </p>
        <p>If you feel that your consultation did not deliver value, we ask that you:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Contact us within 7 days of your session at info@taylormadebabyco.com with a description of your concern.</li>
          <li>Give us the opportunity to address your feedback — in many cases, we can resolve concerns with a follow-up call or written clarification at no additional charge.</li>
        </ul>
        <p>
          We do not offer automatic refunds based on dissatisfaction with product recommendation outcomes, as
          purchasing decisions are ultimately made by the client. However, we review all satisfaction concerns
          with genuine care and will offer partial or full credits at our discretion in cases where we have
          clearly failed to deliver the session as described.
        </p>
      </LegalSection>

      <LegalSection n="06" title="Free Resources & Digital Guides">
        <p>
          The Baby Prep Starter Guide and any other free downloadable resources are provided at no charge and are
          therefore non-refundable (no payment is taken). If you experience a technical issue downloading or
          accessing a free resource, please contact us at info@taylormadebabyco.com and we will resend it
          promptly.
        </p>
        <p>
          If Taylor-Made Baby Co. introduces paid digital products in the future (such as e-books, courses, or
          templates), the specific refund terms for those products will be clearly stated at the point of purchase
          and will form an addendum to this Refund Policy.
        </p>
      </LegalSection>

      <LegalSection n="07" title="How to Request a Refund">
        <p>To request a refund, please follow these steps:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Email info@taylormadebabyco.com with the subject line: &lsquo;Refund Request — [Your Name] — [Booking Date]&rsquo;.</li>
          <li>Include your full name, the email address used to book your consultation, your booking date and time, and a brief description of your reason for requesting a refund.</li>
          <li>Taylor-Made Baby Co. will acknowledge your request within 2 business days.</li>
          <li>If your refund is approved, it will be processed to your original payment method within 5&ndash;7 business days (for client cancellations 24+ hours in advance) or 3&ndash;5 business days (for cancellations by us).</li>
          <li>You will receive an email confirmation once your refund has been processed. The time for the funds to appear in your account depends on your bank or card provider and may take an additional 3&ndash;5 business days beyond our processing time.</li>
        </ol>
      </LegalSection>

      <LegalSection n="08" title="Chargebacks & Payment Disputes">
        <p>
          We ask that you contact us directly at info@taylormadebabyco.com before initiating a chargeback or
          payment dispute with your bank or card provider. In our experience, all legitimate refund concerns can
          be resolved quickly when raised with us directly.
        </p>
        <p>If a chargeback is filed without prior contact:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>We will provide all relevant documentation to the payment processor, including your intake form, session confirmation, and any post-session communications.</li>
          <li>Clients who file chargebacks without first contacting Taylor-Made Baby Co. may be declined future bookings at our discretion.</li>
        </ul>
      </LegalSection>

      <LegalSection n="09" title="Contact & Refund Enquiries">
        <p>For all refund requests, questions, or concerns, please contact:</p>
        <LegalContact />
        <p>Response time: Within 2 business days.</p>
      </LegalSection>
    </LegalShell>
  );
}
