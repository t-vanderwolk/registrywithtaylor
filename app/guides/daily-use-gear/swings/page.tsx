import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DailyUseGearSwingsPage() {
  redirect('/academy/gear/daily-use-gear/swing-bouncer');
}
