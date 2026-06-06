import NewsletterCapture from '@/components/email/NewsletterCapture';

export default function FinalCTA() {
  return (
    <section className="bg-[linear-gradient(180deg,#fdf9f5_0%,#f7efe6_100%)] py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6">
        <NewsletterCapture />
      </div>
    </section>
  );
}
