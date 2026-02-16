import Link from 'next/link';
import { cn } from './cn';

export type AdminTabItem = {
  label: string;
  href: string;
  value: string;
};

export default function AdminTabs({
  tabs,
  activeValue,
  ariaLabel,
}: {
  tabs: AdminTabItem[];
  activeValue: string;
  ariaLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={ariaLabel}>
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        return (
          <Link
            key={tab.value}
            href={tab.href}
            role="tab"
            tabIndex={isActive ? 0 : -1}
            aria-selected={isActive}
            className={cn('admin-btn admin-btn--secondary admin-tab', isActive && 'is-active')}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
