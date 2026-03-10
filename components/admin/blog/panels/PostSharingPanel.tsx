import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import { generateSocialSnippets } from '@/lib/blog/socialSnippets';

export default function PostSharingPanel({
  title,
  excerpt,
  category,
  body,
  shareTitle,
  shareDescription,
  onShareTitleChange,
  onShareDescriptionChange,
}: {
  title: string;
  excerpt: string;
  category: string;
  body: string;
  shareTitle: string;
  shareDescription: string;
  onShareTitleChange: (value: string) => void;
  onShareDescriptionChange: (value: string) => void;
}) {
  const snippets = generateSocialSnippets({
    title,
    excerpt,
    shareTitle,
    shareDescription,
    category,
    content: body,
  });

  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">Sharing</p>
        <h2 className="admin-h2">Social metadata</h2>
        <p className="admin-body">Shape the headline and summary that travel with the post across search, social, and email.</p>
      </div>

      <AdminField label="Share title" htmlFor="post-share-title" help="Defaults to the article title if left blank.">
        <AdminInput
          id="post-share-title"
          value={shareTitle}
          onChange={(event) => onShareTitleChange(event.target.value)}
          placeholder="Preparing your registry should feel calmer than this."
        />
      </AdminField>

      <AdminField label="Share description" htmlFor="post-share-description" help="Used for OpenGraph, Twitter, and snippet generation.">
        <AdminTextarea
          id="post-share-description"
          value={shareDescription}
          onChange={(event) => onShareDescriptionChange(event.target.value)}
          className="min-h-[150px]"
          placeholder="A calm, practical guide that explains what matters, what to skip, and which products actually earn a spot on your list."
        />
      </AdminField>

      <div className="space-y-3">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Snippet Generator</p>
          <p className="admin-micro">Generated from the current metadata and draft content.</p>
        </div>

        <div className="space-y-3">
          <div className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
            <p className="admin-micro">Instagram caption</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-admin">{snippets.instagramCaption}</p>
          </div>

          <div className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
            <p className="admin-micro">Pinterest description</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-admin">{snippets.pinterestDescription}</p>
          </div>

          <div className="rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
            <p className="admin-micro">Reddit summary</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-admin">{snippets.redditSummary}</p>
          </div>
        </div>
      </div>
    </AdminSurface>
  );
}
