'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import StatusPill from '@/components/admin/ui/StatusPill';
import StageBadge from '@/components/admin/blog/StageBadge';
import { BLOG_STAGES, BLOG_STAGE_LABELS, type BlogStageValue } from '@/lib/blog/postStage';

type PlannerPost = {
  id: string;
  title: string;
  slug: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED';
  stage: BlogStageValue;
  category: string;
  focusKeyword: string | null;
  updatedAt: string;
  publishedAt: string | null;
  scheduledFor: string | null;
};

const formatUpdated = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

export default function PlannerBoard({ posts }: { posts: PlannerPost[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(posts);
  const [draggedPostId, setDraggedPostId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyStage, setBusyStage] = useState<string | null>(null);

  useEffect(() => {
    setRows(posts);
  }, [posts]);

  const postsByStage = useMemo(
    () =>
      BLOG_STAGES.reduce<Record<BlogStageValue, PlannerPost[]>>((accumulator, stage) => {
        accumulator[stage] = rows.filter((post) => post.stage === stage);
        return accumulator;
      }, {} as Record<BlogStageValue, PlannerPost[]>),
    [rows],
  );

  async function movePost(postId: string, stage: BlogStageValue) {
    setBusyStage(`${postId}:${stage}`);
    setNotice(null);

    try {
      const nextStatus =
        stage === 'PUBLISHED' ? 'PUBLISHED' : stage === 'ARCHIVED' ? 'ARCHIVED' : 'DRAFT';

      const response = await fetch(`/api/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage,
          status: nextStatus,
        }),
      });
      const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

      if (!response.ok || !payload?.id) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to move the post.');
      }

      setRows((currentRows) =>
        currentRows.map((post) =>
          post.id === postId
            ? {
                ...post,
                stage,
                status: nextStatus as PlannerPost['status'],
                updatedAt: typeof payload.updatedAt === 'string' ? payload.updatedAt : post.updatedAt,
              }
            : post,
        ),
      );
      setNotice(`Moved to ${BLOG_STAGE_LABELS[stage].toLowerCase()}.`);
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to move the post.');
    } finally {
      setBusyStage(null);
      setDraggedPostId(null);
    }
  }

  async function createIdea() {
    const title = window.prompt('New idea title', 'Untitled idea');
    if (title === null) {
      return;
    }

    setBusyStage('new-idea');
    setNotice(null);

    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Untitled idea',
          content: '',
          stage: 'IDEA',
          status: 'DRAFT',
        }),
      });
      const payload = (await response.json().catch(() => null)) as Record<string, unknown> | null;

      if (!response.ok || !payload?.id) {
        throw new Error(typeof payload?.error === 'string' ? payload.error : 'Unable to create the idea.');
      }

      setNotice('Idea created.');
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to create the idea.');
    } finally {
      setBusyStage(null);
    }
  }

  return (
    <div className="admin-stack gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="admin-stack gap-1.5">
          <p className="admin-eyebrow">Pipeline</p>
          <p className="admin-body">Drag cards between stages or use the inline stage dropdown for keyboard-friendly updates.</p>
        </div>
        <AdminButton variant="primary" onClick={() => void createIdea()} disabled={busyStage === 'new-idea'}>
          {busyStage === 'new-idea' ? 'Creating…' : 'New Idea'}
        </AdminButton>
      </div>

      {notice ? <p className="admin-micro">{notice}</p> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {BLOG_STAGES.map((stage) => (
          <AdminSurface
            key={stage}
            className="admin-stack gap-4"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (draggedPostId) {
                void movePost(draggedPostId, stage);
              }
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <StageBadge stage={stage} />
                <span className="admin-micro">{postsByStage[stage].length} posts</span>
              </div>
              {stage === 'IDEA' ? (
                <AdminButton size="sm" variant="ghost" onClick={() => void createIdea()}>
                  Add
                </AdminButton>
              ) : null}
            </div>

            <div className="admin-stack gap-3">
              {postsByStage[stage].length === 0 ? <p className="admin-micro">No posts in this stage.</p> : null}

              {postsByStage[stage].map((post) => (
                <div
                  key={post.id}
                  draggable
                  onDragStart={() => setDraggedPostId(post.id)}
                  className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="admin-stack gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="admin-stack gap-1">
                        <p className="text-sm font-medium text-admin">{post.title}</p>
                        <p className="admin-micro">{post.category}</p>
                      </div>
                      <StatusPill status={post.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {post.focusKeyword ? <span className="admin-chip">{post.focusKeyword}</span> : null}
                      <span className="admin-micro">Updated {formatUpdated(post.updatedAt)}</span>
                    </div>

                    <select
                      className="admin-select"
                      value={post.stage}
                      aria-label={`Move ${post.title} to a different stage`}
                      onChange={(event) => void movePost(post.id, event.target.value as BlogStageValue)}
                      disabled={busyStage === `${post.id}:${post.stage}`}
                    >
                      {BLOG_STAGES.map((option) => (
                        <option key={option} value={option}>
                          {BLOG_STAGE_LABELS[option]}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center justify-between gap-3">
                      <p className="admin-table-code">{post.slug}</p>
                      <div className="flex items-center gap-2">
                        <AdminButton asChild size="sm" variant="secondary">
                          <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                        </AdminButton>
                        <AdminButton asChild size="sm" variant="ghost">
                          <Link href={`/admin/blog/${post.id}/preview`}>Preview</Link>
                        </AdminButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSurface>
        ))}
      </div>
    </div>
  );
}
