import Link from 'next/link';
import PageViewTracker from '@/components/analytics/PageViewTracker';
import MarketingSection from '@/components/layout/MarketingSection';
import SiteShell from '@/components/SiteShell';
import TravelSystemGenerator from '@/components/tools/TravelSystemGenerator';
import ToolBreadcrumb from '@/components/tools/ToolBreadcrumb';
import ToolContactPrompt from '@/components/tools/ToolContactPrompt';
import { Body, Eyebrow, H1, H2 } from '@/components/ui/MarketingHeading';
import { buildMarketingMetadata } from '@/lib/marketing/metadata';
import { canonicalBrand } from '@/lib/catalog/brandAliases';
import {
  travelSystemStructuredData,
  TRAVEL_SYSTEM_FAQS,
} from '@/lib/marketing/travelSystemStructuredData';
import {
  getTravelSystemCarSeats,
  getTravelSystemStrollers,
} from '@/lib/server/travelSystemCompatibility';

export const dynamic = 'force-dynamic';

// Per-brand metadata so a ?carSeatBrand= (or ?strollerBrand=) view is a distinct,
// indexable page with its own title + self-referencing canonical — the same
// pattern as the Stroller Finder's brand pages.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ carSeatBrand?: string | string[]; strollerBrand?: string | string[] }>;
}) {
  const { carSeatBrand, strollerBrand } = await searchParams;
  const carSeat = (Array.isArray(carSeatBrand) ? carSeatBrand[0] : carSeatBrand)?.trim();
  const stroller = (Array.isArray(strollerBrand) ? strollerBrand[0] : strollerBrand)?.trim();

  if (carSeat) {
    const brand = canonicalBrand(carSeat);
    return buildMarketingMetadata({
      title: `${brand} Car Seat Compatibility — Which Strollers Fit | Taylor-Made Baby Co.`,
      description: `See which strollers work with ${brand} infant car seats — direct-fit and adapter-required — with live prices and where to buy.`,
      path: `/tools/travel-system?carSeatBrand=${encodeURIComponent(brand)}`,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: `${brand} car seat compatibility`,
      keywords: [`${brand} car seat compatibility`, `${brand} compatible strollers`, `${brand} travel system`],
    });
  }

  if (stroller) {
    const brand = canonicalBrand(stroller);
    return buildMarketingMetadata({
      title: `${brand} Stroller Compatibility — Which Car Seats Fit | Taylor-Made Baby Co.`,
      description: `See every infant car seat that works with ${brand} strollers — direct-fit and adapter-required — with live prices and where to buy.`,
      path: `/tools/travel-system?strollerBrand=${encodeURIComponent(brand)}`,
      imagePath: '/assets/hero/hero-03.jpg',
      imageAlt: `${brand} stroller compatibility`,
      keywords: [`${brand} stroller compatibility`, `${brand} compatible car seats`, `${brand} travel system`],
    });
  }

  return buildMarketingMetadata({
    title: 'Stroller & Car Seat Compatibility Checker (Free) | TMBC',
    description:
      'Check stroller & infant car seat compatibility in minutes — free tool by a certified baby gear consultant. Avoid the wrong adapter. Try it free.',
    path: '/tools/travel-system',
    imagePath: '/assets/hero/hero-03.jpg',
    imageAlt: 'Stroller and infant car seat clicking together to form a travel system',
    keywords: [
      'stroller car seat compatibility checker',
      'travel system compatibility tool',
      'what car seat fits my stroller',
      'stroller and car seat adapter finder',
    ],
  });
}

export default async function TravelSystemCompatibilityPage() {
  const [strollers, carSeats] = await Promise.all([
    getTravelSystemStrollers(),
    getTravelSystemCarSeats(),
  ]);

  return (
    <SiteShell currentPath="/tools/travel-system">
      <main className="site-main">
        <PageViewTracker path="/tools/travel-system" pageType="other" />

        {/* Organization + Service + BreadcrumbList + HowTo + FAQPage schema. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(travelSystemStructuredData) }}
        />

        <MarketingSection tone="white" spacing="spacious" reveal={false} variant="full">
          <div className="mx-auto mb-6 max-w-4xl">
            <ToolBreadcrumb current="Travel System Checker" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <Eyebrow>Free Tool</Eyebrow>
            <H1 className="mt-3">
              Stroller &amp; Car Seat Compatibility Checker — Find Your Perfect Travel System Match
            </H1>
            <Body className="mx-auto mt-4 max-w-2xl text-neutral-600">
              Answer a couple of quick questions and know instantly whether your stroller and car seat
              click together — free, no account, no spiraling through 47 tabs.
            </Body>
            {/* GEO / AEO direct-answer: a standalone, extractable definition sentence. */}
            <p className="mx-auto mt-6 max-w-2xl rounded-2xl border-l-[3px] border-[var(--color-accent-dark)] bg-[var(--color-sand)] px-4 py-3 text-left text-[0.95rem] font-medium leading-6 text-[var(--color-charcoal)]">
              A travel system works when your car seat clicks directly onto your stroller, or connects
              with a manufacturer-approved adapter — this free tool tells you which applies to your exact
              setup in under two minutes.
            </p>
          </div>

          <div className="mt-10">
            <TravelSystemGenerator strollers={strollers} carSeats={carSeats} />
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-[0.8rem] leading-6 text-neutral-500">
            Compatibility is based on manufacturer documentation and our current stored data, and reflects
            stated fit — not a physical test by Taylor-Made Baby Co. unless noted. Product generations and
            adapter requirements can change. Confirm the exact model names and follow the car seat and
            stroller manuals before purchase or use. This tool is educational and does not replace guidance
            from a certified Child Passenger Safety Technician (CPST) or professional car seat installation.
          </p>
        </MarketingSection>

        <MarketingSection tone="ivory" spacing="spacious">
          <div className="mx-auto max-w-3xl">
            <Eyebrow>FAQ</Eyebrow>
            <H2 className="mt-3">
              Frequently Asked Questions About Travel System Compatibility
            </H2>
            <dl className="mt-8 space-y-4">
              {TRAVEL_SYSTEM_FAQS.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-[18px] border border-[var(--color-border)] bg-white/70 px-5 py-4 shadow-[0_10px_28px_rgba(70,53,58,0.05)]"
                >
                  <dt className="font-serif text-[1.08rem] font-semibold leading-snug text-[var(--color-charcoal)]">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-[0.95rem] leading-7 text-neutral-600">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </MarketingSection>

        <ToolContactPrompt prompt="Still unsure whether your car seat truly fits your stroller — or which adapter you actually need? Message Taylor and she'll confirm the real-world fit for your setup." />
      </main>
    </SiteShell>
  );
}
