import type { ReactNode } from 'react';
import '../../admin/admin.css';

export const metadata = {
  title: 'Reviewer Dashboard • Taylor-Made Baby Co.',
  robots: { index: false, follow: false },
};

export default function ReviewerDashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
