export default function AdminToast({
  children,
  tone = 'default',
}: {
  children: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'text-[var(--admin-color-success)]'
      : tone === 'warning'
        ? 'text-[var(--admin-color-warning)]'
        : 'text-[var(--admin-color-text-micro)]';

  return <p className={`admin-micro ${toneClass}`}>{children}</p>;
}
