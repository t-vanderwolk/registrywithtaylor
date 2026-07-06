import LegalShell, { LegalContact, LegalSection, LegalTable } from '@/components/legal/LegalShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Terms of Service | Taylor-Made Baby Co.',
  description:
    'The terms and conditions governing your use of the Taylor-Made Baby Co. website and consultation services.',
  path: '/terms',
  imagePath: '/og-home.jpg',
  imageAlt: 'Taylor-Made Baby Co. Terms of Service',
});

export default function TermsPage() {
  return (
    <LegalShell
      currentPath="/terms"
      title="Terms of Service"
      subtitle="The terms and conditions governing your use of our website and consultation services."
      effectiveDate="July 1, 2026"
    >
      <LegalSection n="01" title="Acceptance of Terms">
        <p>
          By accessing taylormadebabyco.com, booking a consultation, subscribing to our email list, or
          downloading any of our content, you confirm that:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>You are at least 18 years of age, or are accessing the site under the supervision of a parent or legal guardian.</li>
          <li>You have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.</li>
          <li>You have the legal authority to enter into a binding agreement with Taylor-Made Baby Co.</li>
        </ul>
      </LegalSection>

      <LegalSection n="02" title="Description of Services">
        <p>Taylor-Made Baby Co. offers the following services:</p>
        <LegalTable
          head={['Service', 'Description']}
          rows={[
            [
              'Baby Registry Consultation',
              'A 1-hour virtual consultation via video call with Taylor Vanderwolk, covering stroller selection, car seat safety, nursery planning, feeding gear, and registry strategy. Includes written follow-up notes.',
            ],
            [
              'Baby Prep Starter Guide',
              'A free downloadable guide delivered via email covering registry strategy, gear priorities, and preparation timelines for expecting parents. Provided in exchange for email subscription.',
            ],
            [
              'Journal / Blog Content',
              'Free educational articles and guides published on taylormadebabyco.com covering baby gear, registry strategy, nursery planning, and related topics.',
            ],
            [
              'Tools & Resources',
              'Interactive tools such as the Stroller Finder, published on taylormadebabyco.com for the personal, non-commercial use of expecting parents.',
            ],
          ]}
        />
      </LegalSection>

      <LegalSection n="03" title="Booking, Scheduling & Intake">
        <p>When you book a consultation with Taylor-Made Baby Co., you agree to the following:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            You will complete the pre-session intake form accurately and honestly before your scheduled
            appointment. Taylor uses this information to prepare personalised recommendations — incomplete or
            inaccurate intake information may limit the effectiveness of your session.
          </li>
          <li>
            You are responsible for attending your scheduled session at the confirmed time. If you are unable to
            attend, you must cancel or reschedule in accordance with our Cancellation and Refund Policy (see
            Clause 07 and our separate Refund Policy).
          </li>
          <li>
            Sessions are conducted via video call (Zoom or Google Meet). You are responsible for ensuring you
            have a stable internet connection, a functioning device with camera and microphone, and access to
            the video platform before your session begins.
          </li>
          <li>
            Sessions begin and end at the scheduled time. If you arrive late, the session will still end at the
            originally scheduled time and no partial refund will be issued for time lost due to late arrival.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n="04" title="Payment Terms">
        <p>
          All consultation fees are due in full at the time of booking. By completing a booking, you authorise
          Taylor-Made Baby Co. (or its payment processor) to charge the applicable fee to your provided payment
          method.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Current consultation fee: $75 USD for a 1-hour virtual session (subject to change with notice).</li>
          <li>All prices are listed in US Dollars (USD) and are exclusive of any applicable taxes in your jurisdiction.</li>
          <li>Payment is processed by a third-party payment processor. Taylor-Made Baby Co. does not store your full payment card details.</li>
          <li>If a payment fails, your booking will not be confirmed. You will be notified and given the opportunity to re-submit payment.</li>
        </ul>
      </LegalSection>

      <LegalSection n="05" title="Nature of Advice — Important Disclaimer">
        <p>Specifically, you acknowledge and agree that:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Taylor-Made Baby Co. does not provide medical advice. Any health-related product questions should be directed to your healthcare provider.</li>
          <li>
            Car seat installation must be verified by a certified Child Passenger Safety Technician (CPST). While
            Taylor can advise on car seat selection, she is not a CPST and cannot certify installation.
          </li>
          <li>
            You are responsible for verifying that all products you purchase comply with current safety
            standards, are free of active recalls, and are appropriate for your child&rsquo;s age, weight, and
            developmental stage.
          </li>
          <li>Recommendations are based on information available at the time of your consultation. Product availability, pricing, and safety ratings may change after your session.</li>
          <li>
            Taylor-Made Baby Co. is independent and receives no commission or sponsorship from any product brand.
            All recommendations reflect Taylor&rsquo;s honest professional opinion and are not guarantees of
            product quality or safety outcomes.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n="06" title="Intellectual Property">
        <p>
          All content published on taylormadebabyco.com — including but not limited to written guides, articles,
          tools, images, logos, videos, and the Baby Prep Starter Guide — is the intellectual property of
          Taylor-Made Baby Co. and is protected by applicable copyright and trademark laws.
        </p>
        <p className="font-medium text-charcoal">You may:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Access and read all content for your personal, non-commercial use.</li>
          <li>Share links to our content on social media or via email.</li>
          <li>Print a single copy of a guide for personal reference.</li>
        </ul>
        <p className="font-medium text-charcoal">You may not:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Reproduce, distribute, publish, sell, or create derivative works from our content without our prior written consent.</li>
          <li>Use our content in any commercial context, including paid workshops, coaching programmes, or client-facing materials.</li>
          <li>Claim authorship of or misrepresent the source of our content.</li>
          <li>Scrape, copy, or systematically extract content from our website using automated tools.</li>
        </ul>
      </LegalSection>

      <LegalSection n="07" title="Cancellation Policy — Summary">
        <ul className="list-disc space-y-1 pl-5">
          <li>Cancellations made 24 or more hours before the scheduled session: Full refund issued within 5&ndash;7 business days.</li>
          <li>Cancellations made less than 24 hours before the scheduled session: No refund. You may request a one-time reschedule at Taylor&rsquo;s discretion.</li>
          <li>No-shows (failure to attend without cancellation): No refund.</li>
          <li>Cancellations by Taylor-Made Baby Co.: Full refund issued within 3&ndash;5 business days.</li>
        </ul>
        <p>
          Full details are in our{' '}
          <a href="/refund" className="text-[var(--color-accent-dark)] underline underline-offset-2">
            Refund Policy
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection n="08" title="Limitation of Liability">
        <p>To the fullest extent permitted by applicable law:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Taylor-Made Baby Co. and Taylor Vanderwolk shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of our services or website, even if we have
            been advised of the possibility of such damages.
          </li>
          <li>
            Our total liability to you for any claim arising out of or relating to our services shall not exceed
            the total amount paid by you to Taylor-Made Baby Co. in the 12 months preceding the claim.
          </li>
          <li>
            We are not liable for product defects, recalls, injuries, or damages arising from products you
            purchase based on our recommendations. All product decisions are ultimately your responsibility.
          </li>
          <li>
            We are not responsible for technical failures on your end during a video call session, including
            internet outages, device failures, or platform errors outside our control.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n="09" title="Disclaimer of Warranties">
        <p>
          Our website and services are provided on an &lsquo;as is&rsquo; and &lsquo;as available&rsquo; basis
          without warranties of any kind, either express or implied. Taylor-Made Baby Co. does not warrant that:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Our website will be available uninterrupted, error-free, or free of viruses or other harmful components.</li>
          <li>Any information or recommendations provided will be accurate, complete, or suitable for your specific circumstances.</li>
          <li>Defects in the website will be corrected.</li>
        </ul>
      </LegalSection>

      <LegalSection n="10" title="Governing Law & Dispute Resolution">
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of the State of
          Arizona, United States, without regard to its conflict of law provisions.
        </p>
        <p>
          Any dispute arising from or relating to these Terms or our services shall first be attempted to be
          resolved through good-faith negotiation between the parties. If negotiation fails within 30 days,
          disputes shall be submitted to binding arbitration in Maricopa County, Arizona, under the rules of the
          American Arbitration Association (AAA), except that either party may seek injunctive relief in a court
          of competent jurisdiction.
        </p>
        <p>Nothing in this clause limits your rights as a consumer under applicable consumer protection laws in your jurisdiction.</p>
      </LegalSection>

      <LegalSection n="11" title="Changes to These Terms">
        <p>
          Taylor-Made Baby Co. reserves the right to update these Terms of Service at any time. When we make
          material changes, we will update the Effective Date at the top of this document and, where appropriate,
          notify active clients by email.
        </p>
        <p>
          Your continued use of our website or services after any changes take effect constitutes your acceptance
          of the updated Terms. If you do not agree with the updated Terms, you must discontinue use of our
          services.
        </p>
      </LegalSection>

      <LegalSection n="12" title="Contact Us">
        <p>For questions about these Terms of Service, please contact:</p>
        <LegalContact />
      </LegalSection>
    </LegalShell>
  );
}
