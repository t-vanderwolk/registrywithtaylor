import Link from 'next/link';
import Hero from '@/components/ui/Hero';
import prisma from '@/lib/prisma';
import { requireAdminSession } from '@/lib/server/session';

export default async function AdminPage() {
  await requireAdminSession();

  const [totalPosts, publishedPosts, totalViews] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.aggregate({
      _sum: { views: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <Hero
        eyebrow="Admin Dashboard"
        title="Manage content and monitor growth"
        subtitle="Access blog publishing, performance analytics, and partner asset workflows."
        image="/assets/hero/hero-01.jpg"
      />

      <section className="admin-metric-grid">
        <article className="card">
          <h3>Total posts</h3>
          <p className="display">{totalPosts}</p>
        </article>
        <article className="card">
          <h3>Published posts</h3>
          <p className="display">{publishedPosts}</p>
        </article>
        <article className="card">
          <h3>Total views</h3>
          <p className="display">{(totalViews._sum.views ?? 0).toLocaleString()}</p>
        </article>
      </section>

      <section className="card">
        <h2>Quick links</h2>
        <div className="admin-actions-row">
          <Link className="btn btn--primary" href="/admin/blog">
            Manage Blog
          </Link>
          <Link className="btn btn--secondary" href="/admin/analytics">
            View Analytics
          </Link>
          <Link className="btn btn--secondary" href="/admin/affiliates">
            Partnerships
          </Link>
        </div>
      </section>
    </div>
  );
}
