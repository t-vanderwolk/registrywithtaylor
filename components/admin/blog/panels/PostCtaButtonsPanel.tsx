import AdminButton from '@/components/admin/ui/AdminButton';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import AdminSurface from '@/components/admin/ui/AdminSurface';
import AffiliatePartnerSelect from '@/components/admin/blog/AffiliatePartnerSelect';
import type { AffiliatePartnerOption } from '@/components/admin/blog/postEditorTypes';
import { buildDefaultAffiliateCtaText } from '@/lib/affiliatePartners';
import type { CtaButton } from '@/lib/blog/ctaButtons';

type SaveMode = 'debounced' | 'immediate';

export default function PostCtaButtonsPanel({
  draftButton,
  buttons,
  affiliatePartnerOptions,
  malformed,
  onDraftChange,
  onAddButton,
  onAddAndInsertButton,
  onUpdateButton,
  onRemoveButton,
  onInsertButton,
}: {
  draftButton: CtaButton;
  buttons: CtaButton[];
  affiliatePartnerOptions: AffiliatePartnerOption[];
  malformed: boolean;
  onDraftChange: (partial: Partial<CtaButton>) => void;
  onAddButton: () => void;
  onAddAndInsertButton: () => void;
  onUpdateButton: (index: number, partial: Partial<CtaButton>, saveMode: SaveMode) => void;
  onRemoveButton: (index: number) => void;
  onInsertButton: (buttonId: string) => void;
}) {
  const resolvePartnerDefaults = (partner: AffiliatePartnerOption | null, current: CtaButton) => {
    if (!partner) {
      return { partnerId: null };
    }

    return {
      partnerId: partner.id,
      label: current.label.trim() ? current.label : buildDefaultAffiliateCtaText(partner),
      url: current.url.trim() ? current.url : partner.defaultDestinationUrl ?? partner.baseUrl ?? partner.website ?? '',
    } satisfies Partial<CtaButton>;
  };

  return (
    <AdminSurface className="admin-stack gap-4">
      <div className="admin-stack gap-1.5">
        <p className="admin-eyebrow">CTA Buttons</p>
        <h2 className="admin-h2">Paste final URLs</h2>
        <p className="admin-body">Buttons are stored schema-neutrally inside the post content and rendered consistently on the public article.</p>
      </div>

      <div className="admin-stack gap-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4">
        <div className="grid gap-3">
          <AdminField label="Button label" htmlFor="post-cta-draft-label">
            <AdminInput
              id="post-cta-draft-label"
              value={draftButton.label}
              onChange={(event) => onDraftChange({ label: event.target.value })}
              placeholder="Shop Now"
            />
          </AdminField>

          <AdminField label="Destination URL" htmlFor="post-cta-draft-url">
            <AdminInput
              id="post-cta-draft-url"
              type="url"
              value={draftButton.url}
              onChange={(event) => onDraftChange({ url: event.target.value })}
              placeholder="https://partner.example.com/..."
            />
          </AdminField>

          <div className="grid gap-3 md:grid-cols-2">
            <AdminField label="Style" htmlFor="post-cta-draft-variant">
              <AdminSelect
                id="post-cta-draft-variant"
                value={draftButton.variant}
                onChange={(event) => onDraftChange({ variant: event.target.value as CtaButton['variant'] })}
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="text">Text</option>
              </AdminSelect>
            </AdminField>

            <AffiliatePartnerSelect
              id="post-cta-draft-partner"
              label="Affiliate partner"
              options={affiliatePartnerOptions}
              value={draftButton.partnerId ?? null}
              onChange={(partnerId, partner) => onDraftChange(partnerId ? resolvePartnerDefaults(partner, draftButton) : { partnerId: null })}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="admin-micro">Add a CTA here, then insert it into the markdown at the current cursor position.</p>
          <div className="flex flex-wrap items-center gap-2">
            <AdminButton type="button" variant="secondary" size="sm" onClick={onAddButton}>
              Add CTA
            </AdminButton>
            <AdminButton type="button" variant="primary" size="sm" onClick={onAddAndInsertButton}>
              Add + Insert
            </AdminButton>
          </div>
        </div>
      </div>

      {malformed ? (
        <div className="rounded-2xl border border-[rgba(159,47,47,0.18)] bg-[rgba(159,47,47,0.05)] px-4 py-3 text-sm text-admin-danger">
          Existing CTA data was malformed. Review and re-save the buttons before publishing.
        </div>
      ) : null}

      {buttons.length > 0 ? (
        <div className="space-y-3">
          {buttons.map((button, index) => (
            <div
              key={button.id}
              className="space-y-3 rounded-[24px] border border-[var(--admin-color-border)] bg-white p-4"
            >
              <div className="grid gap-3">
                <AdminField label="Button label" htmlFor={`post-cta-label-${button.id}`}>
                  <AdminInput
                    id={`post-cta-label-${button.id}`}
                    value={button.label}
                    onChange={(event) => onUpdateButton(index, { label: event.target.value }, 'debounced')}
                    placeholder="Shop Now"
                  />
                </AdminField>

                <AdminField label="Destination URL" htmlFor={`post-cta-url-${button.id}`}>
                  <AdminInput
                    id={`post-cta-url-${button.id}`}
                    type="url"
                    value={button.url}
                    onChange={(event) => onUpdateButton(index, { url: event.target.value }, 'debounced')}
                    placeholder="https://partner.example.com/..."
                  />
                </AdminField>

                <div className="grid gap-3 md:grid-cols-2">
                  <AdminField label="Style" htmlFor={`post-cta-style-${button.id}`}>
                    <AdminSelect
                      id={`post-cta-style-${button.id}`}
                      value={button.variant}
                      onChange={(event) =>
                        onUpdateButton(index, { variant: event.target.value as CtaButton['variant'] }, 'immediate')
                      }
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="text">Text</option>
                    </AdminSelect>
                  </AdminField>

                  <AffiliatePartnerSelect
                    id={`post-cta-partner-${button.id}`}
                    label="Affiliate partner"
                    options={affiliatePartnerOptions}
                    value={button.partnerId ?? null}
                    onChange={(partnerId, partner) =>
                      onUpdateButton(
                        index,
                        partnerId ? resolvePartnerDefaults(partner, button) : { partnerId: null },
                        'immediate',
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <div className="flex flex-wrap items-center gap-2">
                  <AdminButton type="button" variant="secondary" size="sm" onClick={() => onInsertButton(button.id)}>
                    Insert into content
                  </AdminButton>
                  <AdminButton type="button" variant="ghost" size="sm" onClick={() => onRemoveButton(index)}>
                    Remove CTA
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="admin-micro">No CTA buttons stored yet.</p>
      )}
    </AdminSurface>
  );
}
