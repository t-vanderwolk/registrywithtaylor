export default function AdminToast({
  children,
  tone = 'default',
}: {
  children: string;
  tone?: 'default' | 'success' | 'warning';
}) {
  const toneClass =
    tone === 'success'
      ? 'text-admin-success'
      : tone === 'warning'
        ? 'text-admin-warning'
        : 'text-admin-micro';

  return <p className={`admin-micro ${toneClass}`}>{children}</p>;
}
