'use client';

import { useMemo, useState } from 'react';
import AffiliatePartnerIdentity from '@/components/admin/AffiliatePartnerIdentity';
import AdminField from '@/components/admin/ui/AdminField';
import AdminInput from '@/components/admin/ui/AdminInput';
import AdminSelect from '@/components/admin/ui/AdminSelect';
import type { AffiliatePartnerOption } from '@/components/admin/blog/postEditorTypes';
import { AFFILIATE_CONTEXT_OPTIONS } from '@/lib/affiliatePartners';
import { AFFILIATE_NETWORK_LABELS } from '@/lib/affiliateBrands';

type AffiliatePartnerSelectProps = {
  id: string;
  label: string;
  options: AffiliatePartnerOption[];
  value: string | null;
  onChange: (partnerId: string | null, partner: AffiliatePartnerOption | null) => void;
  defaultContext?: string;
  noneLabel?: string;
};

export default function AffiliatePartnerSelect({
  id,
  label,
  options,
  value,
  onChange,
  defaultContext = 'blog',
  noneLabel = 'None',
}: AffiliatePartnerSelectProps) {
  const [search, setSearch] = useState('');
  const [context, setContext] = useState(defaultContext);

  const selectedPartner = options.find((partner) => partner.id === value) ?? null;
  const filteredOptions = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const matches = options.filter((partner) => {
      const matchesContext =
        context === 'all' || partner.allowedContexts.length === 0 || partner.allowedContexts.includes(context);
      const haystack = [partner.name, partner.network, partner.partnerType, partner.slug].join(' ').toLowerCase();
      return matchesContext && (!needle || haystack.includes(needle));
    });

    if (selectedPartner && !matches.some((partner) => partner.id === selectedPartner.id)) {
      return [selectedPartner, ...matches];
    }

    return matches;
  }, [context, options, search, selectedPartner]);

  return (
    <div className="space-y-3">
      <AdminField label={label} htmlFor={id}>
        <AdminSelect
          id={id}
          value={value ?? ''}
          onChange={(event) => {
            const partnerId = event.target.value || null;
            const partner = options.find((option) => option.id === partnerId) ?? null;
            onChange(partnerId, partner);
          }}
        >
          <option value="">{noneLabel}</option>
          {filteredOptions.map((partner) => (
            <option key={partner.id} value={partner.id}>
              {partner.name} ({AFFILIATE_NETWORK_LABELS[partner.network]})
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_11rem]">
        <AdminField label="Search partners" htmlFor={`${id}-search`}>
          <AdminInput
            id={`${id}-search`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by partner name"
          />
        </AdminField>

        <AdminField label="Usage context" htmlFor={`${id}-context`}>
          <AdminSelect
            id={`${id}-context`}
            value={context}
            onChange={(event) => setContext(event.target.value)}
          >
            <option value="all">All contexts</option>
            {AFFILIATE_CONTEXT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </AdminSelect>
        </AdminField>
      </div>

      {selectedPartner ? (
        <div className="rounded-[20px] border border-[var(--admin-color-border)] bg-white p-3">
          <AffiliatePartnerIdentity
            name={selectedPartner.name}
            network={selectedPartner.network}
            logoUrl={selectedPartner.logoUrl}
            meta={`${selectedPartner.partnerType} • ${selectedPartner.allowedContexts.join(', ') || 'all contexts'}`}
            showNetwork
            size="sm"
          />
        </div>
      ) : (
        <p className="admin-micro">Select an affiliate partner to connect tracking, logo rendering, and disclosure automatically.</p>
      )}
    </div>
  );
}
