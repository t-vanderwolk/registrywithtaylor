'use client';

import { useEffect, useRef, useState } from 'react';
import { RETAILER_FIELDS } from '@/lib/checklist/retailerPreferences';
import { isHttpUrl } from '@/lib/retailerLinks';

export default function ChecklistRetailerPriority({ first = '', second = '' }: { first?: string; second?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);
  const [primary, setPrimary] = useState(first);
  const [secondary, setSecondary] = useState(second);
  useEffect(() => {
    const form = root.current?.closest('form');
    if (!form) return;
    const update = () => {
      const data = new FormData(form);
      const names = ['Babylist', 'Amazon', String(data.get('secondaryRetailer') || 'Other retailer'), ...[1, 2, 3].map((n) => String(data.get(`extraRetailer${n}`) || `Retailer ${n + 3}`))];
      setOptions(RETAILER_FIELDS.flatMap((field, index) => isHttpUrl(data.get(field)) ? [{ value: field, label: names[index] }] : []));
    };
    update();
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    return () => { form.removeEventListener('input', update); form.removeEventListener('change', update); };
  }, []);
  return <div ref={root} className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
    <label className="flex flex-col gap-1 text-sm text-neutral-600">First shopping button
      <select name="firstRetailer" value={options.some((option) => option.value === primary) ? primary : ''}
        onChange={(event) => { setPrimary(event.target.value); if (event.target.value === secondary) setSecondary(''); }}
        className="rounded-md border border-neutral-200 px-3 py-2">
        <option value="">Saved link order</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
    <label className="flex flex-col gap-1 text-sm text-neutral-600">Second shopping button
      <select name="secondRetailer" value={options.some((option) => option.value === secondary) ? secondary : ''}
        onChange={(event) => setSecondary(event.target.value)} className="rounded-md border border-neutral-200 px-3 py-2">
        <option value="">Saved link order</option>
        {options.filter((option) => option.value !== primary).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  </div>;
}
