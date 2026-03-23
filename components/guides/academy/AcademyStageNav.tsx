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
    <nav
      aria-label="Academy stages"
      className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4"
    >
      {items.map((item, index) => (
        <a
          key={item.id}
          href={item.href}
          className="group min-w-[11.5rem] snap-start rounded-[1.35rem] border border-[rgba(215,161,175,0.18)] bg-white/82 p-3.5 shadow-[0_18px_55px_rgba(58,36,43,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(58,36,43,0.12)] md:min-w-0 md:rounded-[1.5rem] md:p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(215,161,175,0.14)] text-[0.78rem] font-medium tracking-[0.18em] text-[#9F556D] md:h-10 md:w-10 md:text-sm md:tracking-[0.2em]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-[0.62rem] uppercase tracking-[0.22em] text-[#9F556D] md:text-[0.68rem] md:tracking-[0.28em]">
              {item.label}
            </span>
          </div>
          <h3 className="mt-3 text-[0.92rem] font-medium leading-5 text-[#2F2430] sm:text-lg sm:leading-6">{item.title}</h3>
          <p className="mt-2 hidden text-sm leading-6 text-[#5B4B55] md:block md:leading-7">{item.description}</p>
        </a>
      ))}
    </nav>
  );
}
