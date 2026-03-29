import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DailyUseGearHubPage() {
  redirect('/academy/gear/daily-use-gear');
}
