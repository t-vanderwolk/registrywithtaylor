import type { ReactNode } from 'react';
import AdminSurface from '@/components/admin/ui/AdminSurface';

export type PostEditorTabId = 'content' | 'media' | 'seo' | 'editorial';

type TabConfig<TTabId extends string> = {
  id: TTabId;
  label: string;
  badge?: string;
};

export default function PostEditorLayout<TTabId extends string>({
  tabs,
  activeTab,
  onTabChange,
  leftColumn,
  rightColumn,
}: {
  tabs: TabConfig<TTabId>[];
  activeTab: TTabId;
  onTabChange: (tabId: TTabId) => void;
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}) {
  return (
    <div className="admin-editor-layout">
      <AdminSurface className="admin-stack gap-5">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`admin-btn admin-btn--secondary admin-tab ${isActive ? 'is-active' : ''}`}
                aria-pressed={isActive}
              >
                {tab.label}
                {tab.badge ? <span className="ml-2 admin-chip">{tab.badge}</span> : null}
              </button>
            );
          })}
        </div>

        <div className="admin-divider" />
        {leftColumn}
      </AdminSurface>

      <div className="admin-editor-rail">{rightColumn}</div>
    </div>
  );
}
