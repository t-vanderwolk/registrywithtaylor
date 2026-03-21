export type AcademyStageNavItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  href: string;
};

export default function AcademyStageNav({
  items,
}: {
  items: AcademyStageNavItem[];
}) {
  return (
    <nav aria-label="Academy stages" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => (
        <a
          key={item.id}
          href={item.href}
          className="group rounded-[1.65rem] border border-[rgba(215,161,175,0.18)] bg-white/82 p-5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,36,43,0.12)]"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-sm font-medium tracking-[0.2em] text-[#9F556D]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[0.68rem] uppercase tracking-[0.28em] text-[#9F556D]">{item.label}</span>
          </div>
          <h3 className="mt-5 text-lg font-medium text-[#2F2430]">{item.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[#5B4B55]">{item.description}</p>
        </a>
      ))}
    </nav>
  );
}
