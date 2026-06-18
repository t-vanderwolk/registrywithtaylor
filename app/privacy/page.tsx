import SiteShell from '@/components/SiteShell';
import MarketingSection from '@/components/layout/MarketingSection';
import Hero from '@/components/ui/Hero';
import { H2 } from '@/components/ui/MarketingHeading';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';

export const metadata = buildMarketingMetadata({
  title: 'Privacy Policy | Taylor-Made Baby Co.',
  description:
    'How Taylor-Made Baby Co. collects, uses, and protects your personal information.',
  path: '/privacy',
  imagePath: '/og-home.jpg',
  imageAlt: 'Taylor-Made Baby Co. Privacy Policy',
});

export default function PrivacyPage() {
  return (
    <SiteShell currentPath="/privacy">
      <Hero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we handle your information."
      />

      <MarketingSection className="max-w-2xl mx-auto py-16 px-6">
        <p className="text-sm text-neutral-500 mb-10">Last updated: June 2026</p>

        <div className="space-y-10 text-neutral-700 leading-relaxed">

          <section>
            <H2 className="text-xl font-semibold mb-3">1. Information We Collect</H2>
            <p>
              We collect information you provide directly to us — such as your name, email address,
              due date, and baby preparation details — when you complete a consultation request,
              register for the TMBC Academy, or contact us through any form on this site.
            </p>
            <p className="mt-3">
              We also collect basic usage data automatically, including pages visited, session
              duration, and device type, through Google Analytics. This data is aggregated and
              not linked to individual identities.
            </p>
          </section>

          <section>
            <H2 className="text-xl font-semibold mb-3">2. How We Use Your Information</H2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Respond to your consultation requests and inquiries</li>
              <li>Deliver the TMBC Academy and member-only content</li>
              <li>Send email updates you have opted into</li>
              <li>Improve our website, tools, and services</li>
            </ul>
            <p className="mt-3">
              We do not sell, rent, or share your personal information with third parties for
              their marketing purposes.
            </p>
          </section>

          <section>
            <H2 className="text-xl font-semibold mb-3">3. Cookies and Analytics</H2>
            <p>
              This site uses cookies to support site functionality and to gather anonymous
              analytics data via Google Analytics. You may disable cookies in your browser
              settings; some site features may not function correctly without them.
            </p>
          </section>

          <section>
            <H2 className="text-xl font-semibold mb-3">4. Affiliate Links</H2>
            <p>
              Some links on this site are affiliate links, including links to Babylist and
              Amazon. If you make a purchase through one of these links, we may earn a small
              commission at no additional cost to you. This helps support the free content and
              tools on this site. We only recommend products we believe in.
            </p>
          </section>

          <section>
            <H2 className="text-xl font-semibold mb-3">5. Data Retention</H2>
            <p>
              We retain your information for as long as is reasonably necessary to provide our
              services or as required by law. You may request deletion of your account and
              associated data at any time by emailing us directly.
            </p>
          </section>

          <section>
            <H2 className="text-xl font-semibold mb-3">6. Third-Party Services</H2>
            <p>
              We use the following third-party services, each governed by their own privacy
              policies: Google Analytics (usage tracking), Resend (transactional email),
              and Stripe or similar providers for any future payment processing. We encourage
              you to review their policies independently.
            </p>
          </section>

          <section>
            <H2 className="text-xl font-semibold mb-3">7. Your Rights</H2>
            <p>
              You have the right to access, correct, or delete the personal information we hold
              about you. To exercise any of these rights, please contact us at the email below.
            </p>
          </section>

          <section>
            <H2 className="text-xl font-semibold mb-3">8. Contact</H2>
            <p>
              Questions about this policy or your data? Reach us at{' '}
              <a
                href="mailto:hello@taylormadebabyco.com"
                className="text-[var(--color-accent-dark)] underline underline-offset-2"
              >
                hello@taylormadebabyco.com
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-neutral-400 pt-6 border-t border-neutral-100">
            This policy may be updated periodically. Continued use of the site after any changes
            constitutes acceptance of the revised policy.
          </p>
        </div>
      </MarketingSection>
    </SiteShell>
  );
}
