export default function ExpertTipCallout({
  eyebrow = 'Expert Tip',
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <section className="rounded-[1.9rem] border border-[rgba(215,161,175,0.16)] bg-[linear-gradient(135deg,rgba(252,247,249,0.96),rgba(251,245,239,0.96))] p-6 shadow-[0_18px_55px_rgba(58,36,43,0.08)] sm:p-7">
      <p className="text-[0.68rem] uppercase tracking-[0.28em] text-[#A15B72]">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] text-[#2F2430]">{title}</h3>
      <p className="mt-4 max-w-3xl text-base leading-8 text-[#4B3641]">{body}</p>
    </section>
  );
}
