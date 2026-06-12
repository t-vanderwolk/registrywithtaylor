import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import SiteShell from '@/components/SiteShell';
import { authOptions } from '@/lib/server/authOptions';
import RegisterForm from './RegisterForm';
import styles from './RegisterPage.module.scss';

export const metadata = {
  title: 'Create Account | Taylor-Made Baby Co.',
  description: 'Join the Taylor-Made Baby Academy — a calm, structured way to prepare for baby.',
};

const PILLARS = [
  {
    icon: '✓',
    text: 'Four structured learning paths: Registry, Nursery, Gear, and Postpartum.',
  },
  {
    icon: '✓',
    text: 'Strategy-first content — context before decisions, every time.',
  },
  {
    icon: '✓',
    text: 'Built-in workbook so you capture what matters as you go.',
  },
  {
    icon: '✓',
    text: 'No overwhelm. No sponsored checklists. Just real, useful guidance.',
  },
];

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  // Already logged in — send to their dashboard
  if (session) {
    if (session.user.role === 'ADMIN')    redirect('/admin');
    if (session.user.role === 'REVIEWER') redirect('/dashboard/reviewer');
    redirect('/dashboard');
  }

  return (
    <SiteShell currentPath="/register">
      <div className={styles.page}>
        <div className={styles.layout}>

          {/* ── Editorial left ───────────────────────────────────────────── */}
          <div className={styles.editorial}>
            <p className={styles.editorialEyebrow}>Taylor-Made Baby Academy</p>
            <h1 className={styles.editorialTitle}>
              Prepare with clarity, not chaos.
            </h1>
            <p className={styles.editorialBody}>
              The Academy is built around one idea: you need context before you can make good decisions.
              Start with a free account and explore at your own pace.
            </p>
            <ul className={styles.pillars}>
              {PILLARS.map((p, i) => (
                <li key={i} className={styles.pillar}>
                  <span className={styles.pillarIcon} aria-hidden="true">{p.icon}</span>
                  <span className={styles.pillarText}>{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Form right ───────────────────────────────────────────────── */}
          <div className={styles.formWrap}>
            <p className={styles.formEyebrow}>Get started — it&apos;s free</p>
            <h2 className={styles.formTitle}>Create your account</h2>
            <p className={styles.formSubtext}>
              Free accounts include preview lessons and three standalone courses.
              Upgrade any time to unlock the full Academy.
            </p>

            <Suspense>
              <RegisterForm />
            </Suspense>
          </div>

        </div>
      </div>
    </SiteShell>
  );
}
