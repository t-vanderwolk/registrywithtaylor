import LegalShell, { LegalContact, LegalSection, LegalTable } from '@/components/legal/LegalShell';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Privacy Policy | Taylor-Made Baby Co.',
  description:
    'How Taylor-Made Baby Co. collects, uses, protects, and respects your personal information.',
  path: '/privacy',
  imagePath: '/og-home.jpg',
  imageAlt: 'Taylor-Made Baby Co. Privacy Policy',
});

export default function PrivacyPage() {
  return (
    <LegalShell
      currentPath="/privacy"
      title="Privacy Policy"
      subtitle="How we collect, use, protect, and respect your personal information."
      effectiveDate="July 1, 2026"
    >
      <LegalSection n="01" title="Who We Are">
        <p>
          Taylor-Made Baby Co. is a baby registry consulting service operated by Taylor Vanderwolk, based in
          Phoenix, Arizona, United States. We provide virtual baby registry consultations, free baby gear guides,
          and related educational content for expecting parents across the United States.
        </p>
        <p>For questions about this Privacy Policy or your personal data, contact us at:</p>
        <LegalContact />
        <p>Location: Phoenix, AZ, United States</p>
      </LegalSection>

      <LegalSection n="02" title="Information We Collect">
        <p>We collect information in the following ways:</p>
        <LegalTable
          head={['Category', 'What We Collect & Why']}
          rows={[
            ['Contact Information', 'Name, email address, and any other details you provide when booking a consultation, filling out our intake form, or subscribing to our email list. Used to schedule your session, send follow-up notes, and deliver requested content.'],
            ['Booking & Intake Form Data', 'Due date, home setup details, vehicle type, budget range, stroller/gear questions, and current registry items. Used solely to prepare personalised recommendations before your consultation.'],
            ['Payment Information', 'Payment is processed by a third-party processor (e.g., Stripe or Square). We do not store your full credit card number, CVV, or bank account details on our servers.'],
            ['Email Subscription Data', 'Email address and preferences provided when signing up for our free Baby Prep Starter Guide or newsletter. Used to deliver the requested content and relevant updates.'],
            ['Website Usage Data', 'Pages visited, time on site, device type, browser, and IP address — collected automatically via cookies and analytics tools (e.g., Google Analytics). Used to improve our website experience.'],
            ['Communications', 'Any messages, emails, or enquiries you send us directly. Used to respond to your questions and provide support.'],
          ]}
        />
      </LegalSection>

      <LegalSection n="03" title="How We Use Your Information">
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>To schedule, confirm, and deliver your baby registry consultation</li>
          <li>To send pre-session intake confirmations and post-session follow-up notes</li>
          <li>To process payment for your consultation booking</li>
          <li>To deliver the free Baby Prep Starter Guide and any other requested content</li>
          <li>To send relevant email updates, tips, and service announcements (with your consent)</li>
          <li>To improve our website, content, and services based on usage patterns</li>
          <li>To respond to your questions, feedback, or support requests</li>
          <li>To comply with legal obligations and enforce our Terms of Service</li>
        </ul>
      </LegalSection>

      <LegalSection n="04" title="When We Share Your Information">
        <p>We share your personal information only in the following limited circumstances:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-charcoal">Service Providers:</span> We use trusted third-party tools
            to operate our business, including scheduling software (e.g., Calendly), email marketing (e.g.,
            Flodesk or Mailchimp), payment processing (e.g., Stripe or Square), and website hosting. These
            providers access your data only as needed to perform services on our behalf and are bound by
            confidentiality obligations.
          </li>
          <li>
            <span className="font-medium text-charcoal">Legal Requirements:</span> We may disclose information if
            required to do so by law, regulation, legal process, or governmental request.
          </li>
          <li>
            <span className="font-medium text-charcoal">Business Transfers:</span> In the event of a merger,
            acquisition, or sale of all or part of our business, your personal information may be transferred to
            the new entity. We will notify you before your information is transferred and becomes subject to a
            different privacy policy.
          </li>
          <li>
            <span className="font-medium text-charcoal">With Your Consent:</span> We may share your information
            for any other purpose with your explicit prior consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection n="05" title="Cookies & Tracking Technologies">
        <p>
          Our website uses cookies and similar tracking technologies to improve your browsing experience,
          understand how visitors use our site, and measure the effectiveness of our content.
        </p>
        <LegalTable
          head={['Cookie Type', 'Purpose']}
          rows={[
            ['Essential Cookies', 'Required for the website to function. Cannot be disabled without affecting site performance.'],
            ['Analytics Cookies', 'Google Analytics — helps us understand how visitors navigate our site so we can improve content and user experience.'],
            ['Marketing Cookies', 'Only used if you have provided consent. May track visits across sites to deliver relevant content.'],
          ]}
        />
        <p>
          You can control cookies through your browser settings. Disabling certain cookies may affect your ability
          to use some features of our website. Most browsers allow you to refuse cookies or delete cookies already
          stored.
        </p>
      </LegalSection>

      <LegalSection n="06" title="How Long We Keep Your Data">
        <p>We retain your personal information for as long as necessary to provide our services and comply with legal obligations:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Consultation booking and intake data: Retained for 3 years from the date of your session, then securely deleted.</li>
          <li>Payment records: Retained for 7 years as required by US financial and tax regulations.</li>
          <li>Email subscription data: Retained until you unsubscribe. You may unsubscribe at any time via the link in any email we send.</li>
          <li>Website analytics data: Retained in aggregate form for up to 26 months as per Google Analytics default settings.</li>
          <li>Direct communications: Retained for up to 2 years from the date of last contact.</li>
        </ul>
      </LegalSection>

      <LegalSection n="07" title="Your Privacy Rights">
        <p>Depending on your location, you may have the following rights regarding your personal information:</p>
        <LegalTable
          head={['Right', 'What It Means']}
          rows={[
            ['Right to Access', 'Request a copy of the personal information we hold about you.'],
            ['Right to Correction', 'Request that we correct inaccurate or incomplete information.'],
            ['Right to Deletion', 'Request that we delete your personal information, subject to legal retention requirements.'],
            ['Right to Opt-Out', 'Opt out of marketing emails at any time by clicking ‘Unsubscribe’ in any email or contacting us directly.'],
            ['Right to Data Portability', 'Request a copy of your data in a portable, machine-readable format (where technically feasible).'],
            ['California Rights (CCPA)', 'California residents have additional rights under the California Consumer Privacy Act, including the right to know, delete, and opt out of the sale of personal information. We do not sell personal information.'],
          ]}
        />
        <p>
          To exercise any of these rights, contact us at hello@taylormadebabyco.com. We will respond within 30
          days.
        </p>
      </LegalSection>

      <LegalSection n="08" title="Children’s Privacy">
        <p>
          Our website and services are not directed to children under the age of 13. We do not knowingly collect
          personal information from children under 13. If you believe we have inadvertently collected information
          from a child under 13, please contact us immediately at hello@taylormadebabyco.com and we will delete
          the information as quickly as possible.
        </p>
      </LegalSection>

      <LegalSection n="09" title="How We Protect Your Information">
        <p>
          We take reasonable technical and organisational measures to protect your personal information against
          unauthorised access, loss, misuse, or alteration. These measures include:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>HTTPS encryption across the entire taylormadebabyco.com website</li>
          <li>Secure, trusted third-party payment processing — we never store full card details ourselves</li>
          <li>Limited access to personal data — only Taylor Vanderwolk and necessary service providers access your information</li>
          <li>Regular review of data security practices and service provider agreements</li>
        </ul>
        <p>
          However, no method of transmission over the internet or electronic storage is 100% secure. While we
          strive to protect your personal information, we cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection n="10" title="Third-Party Links & Services">
        <p>
          Our website may contain links to third-party websites, partner brands, and services (such as Strolleria,
          BabyQuip, Spotify, or Babylist). This Privacy Policy applies only to taylormadebabyco.com. We are not
          responsible for the privacy practices of any third-party website. We encourage you to review the privacy
          policies of any external site you visit.
        </p>
      </LegalSection>

      <LegalSection n="11" title="Changes to This Privacy Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices, services, or
          legal requirements. When we make material changes, we will update the &lsquo;Effective Date&rsquo; at the
          top of this page and, where appropriate, notify you by email.
        </p>
        <p>
          Your continued use of our website or services after any changes take effect constitutes your acceptance
          of the updated Privacy Policy.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
