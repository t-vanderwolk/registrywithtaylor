import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function DailyUseGearPackAndPlayPage() {
  redirect('/academy/gear/daily-use-gear/pack-and-play');
}
