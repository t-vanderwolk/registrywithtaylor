import type { RefObject } from 'react';
import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminTextarea from '@/components/admin/ui/AdminTextarea';
import {
  CONTENT_TEMPLATES,
  type ContentTemplateId,
} from '@/components/admin/blog/contentTemplates';
import {
  STYLED_BLOCKS,
  type StyledBlockId,
} from '@/lib/blog/styledBlocks';

export type ContentFormatAction =
  | 'h2'
  | 'h3'
  | 'bold'
  | 'italic'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'divider'
  | 'link';

export default function PostContentPanel({
  title,
  focusKeyword,
  seoTitle,
  seoDescription,
  canonicalUrl,
  deck,
  excerpt,
  body,
  titleError,
  bodyError,
  onTitleChange,
  onDeckChange,
  onExcerptChange,
  onBodyChange,
  onFocusKeywordChange,
  onSeoTitleChange,
  onSeoDescriptionChange,
  onCanonicalUrlChange,
  onApplyFormat,
  onInsertTemplate,
  onInsertStyledBlock,
  onOpenInternalLinkModal,
  onOpenInlineImagePicker,
  inlineUploadLabel,
  inlineUploadDisabled,
  contentTextareaRef,
}: {
  title: string;
  focusKeyword: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  deck: string;
  excerpt: string;
  body: string;
  titleError?: string;
  bodyError?: string;
  onTitleChange: (value: string) => void;
  onDeckChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onFocusKeywordChange: (value: string) => void;
  onSeoTitleChange: (value: string) => void;
  onSeoDescriptionChange: (value: string) => void;
  onCanonicalUrlChange: (value: string) => void;
  onApplyFormat: (action: ContentFormatAction) => void;
  onInsertTemplate: (templateId: ContentTemplateId) => void;
  onInsertStyledBlock: (blockId: StyledBlockId) => void;
  onOpenInternalLinkModal: () => void;
  onOpenInlineImagePicker: () => void;
  inlineUploadLabel: string;
  inlineUploadDisabled: boolean;
  contentTextareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  return (
    <div className="admin-stack gap-5">
      <AdminField label="Title" htmlFor="post-title" error={titleError}>
        <AdminInput
          id="post-title"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="The Art of the Registry"
        />
      </AdminField>

      <div className="admin-stack gap-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">SEO Essentials</p>
          <p className="admin-micro">Keep keyword and metadata visible while writing.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <AdminField label="Focus keyword" htmlFor="post-focus-keyword">
            <AdminInput
              id="post-focus-keyword"
              value={focusKeyword}
              onChange={(event) => onFocusKeywordChange(event.target.value)}
              placeholder="best baby stroller"
            />
          </AdminField>

          <AdminField label="SEO title" htmlFor="post-seo-title">
            <AdminInput
              id="post-seo-title"
              value={seoTitle}
              onChange={(event) => onSeoTitleChange(event.target.value)}
              placeholder="Best Baby Stroller for Everyday Use | Taylor-Made Baby Co."
            />
          </AdminField>
        </div>

        <AdminField label="Meta description" htmlFor="post-seo-description">
          <AdminTextarea
            id="post-seo-description"
            value={seoDescription}
            onChange={(event) => onSeoDescriptionChange(event.target.value)}
            className="min-h-[120px]"
            placeholder="A practical guide to choosing the right stroller for everyday life without overbuying or overthinking."
          />
        </AdminField>

        <AdminField label="Canonical URL" htmlFor="post-canonical-url" help="Optional. Leave blank to use the public blog URL.">
          <AdminInput
            id="post-canonical-url"
            value={canonicalUrl}
            onChange={(event) => onCanonicalUrlChange(event.target.value)}
            placeholder="https://www.taylormadebabyco.com/blog/post-slug"
          />
        </AdminField>
      </div>

      <AdminField label="Deck" htmlFor="post-deck" help="Optional subtitle or article deck shown in editor and future layouts.">
        <AdminTextarea
          id="post-deck"
          value={deck}
          onChange={(event) => onDeckChange(event.target.value)}
          className="min-h-[110px]"
          placeholder="A calm framework for choosing what matters and ignoring the noise."
        />
      </AdminField>

      <AdminField label="Excerpt" htmlFor="post-excerpt" help="Used on the blog index and article header.">
        <AdminTextarea
          id="post-excerpt"
          value={excerpt}
          onChange={(event) => onExcerptChange(event.target.value)}
          className="min-h-[140px]"
          placeholder="A calm, practical approach to building a registry that fits your real life."
        />
      </AdminField>

      <div className="admin-stack gap-3">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Starter Templates</p>
          <p className="admin-micro">Insert a ready-made article structure at the current cursor position.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {CONTENT_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="admin-stack justify-between gap-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4"
            >
              <div className="admin-stack gap-1.5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-admin">{template.label}</h3>
                <p className="admin-micro">{template.description}</p>
              </div>

              <div className="flex justify-start">
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => onInsertTemplate(template.id)}>
                  Insert template
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-stack gap-3">
        <div className="admin-stack gap-1">
          <p className="admin-eyebrow">Styled Blocks</p>
          <p className="admin-micro">Insert richer visual blocks that render on the public blog without custom HTML.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {STYLED_BLOCKS.map((block) => (
            <div
              key={block.id}
              className="admin-stack justify-between gap-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4"
            >
              <div className="admin-stack gap-1.5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-admin">{block.label}</h3>
                <p className="admin-micro">{block.description}</p>
              </div>

              <div className="flex justify-start">
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => onInsertStyledBlock(block.id)}>
                  Insert block
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AdminField
        label="Body"
        htmlFor="post-content"
        help="Write in markdown. Inline images are inserted at the current cursor position."
        error={bodyError}
      >
        <div className="admin-stack gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('h2')}>
              H2
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('h3')}>
              H3
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('bold')}>
              Bold
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('italic')}>
              Italic
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('bulletList')}>
              Bullets
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('numberedList')}>
              Numbers
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('quote')}>
              Quote
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('link')}>
              Link
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={() => onApplyFormat('divider')}>
              Divider
            </AdminButton>
            <AdminButton type="button" variant="secondary" size="sm" onClick={onOpenInternalLinkModal}>
              Internal link
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={onOpenInlineImagePicker}
              disabled={inlineUploadDisabled}
            >
              {inlineUploadLabel}
            </AdminButton>
            <p className="admin-micro">Add CTA buttons in the right rail, then insert them at the cursor inside the draft.</p>
          </div>

          <AdminTextarea
            ref={contentTextareaRef}
            id="post-content"
            value={body}
            onChange={(event) => onBodyChange(event.target.value)}
            className="min-h-[520px]"
            placeholder="Paste your draft here..."
          />
        </div>
      </AdminField>
    </div>
  );
}
