import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DailyUseGearCarriersPage() {
  redirect('/academy/gear/daily-use-gear/carrier');
}
