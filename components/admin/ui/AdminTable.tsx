import { Children, type ReactNode } from 'react';

export type AdminTableColumn = {
  key: string;
  label: string;
  align?: 'left' | 'right';
  className?: string;
};

type Density = 'compact' | 'comfortable' | 'spacious';

export default function AdminTable({
  columns,
  children,
  emptyState,
  density = 'comfortable',
}: {
  columns: AdminTableColumn[];
  children: ReactNode;
  emptyState?: ReactNode;
  density?: Density;
}) {
  const hasRows = Children.count(children) > 0;

  return (
    <div className="admin-table-wrap">
      <table className={`admin-table admin-table--${density}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={`${column.align === 'right' ? 'text-right' : ''} ${column.className ?? ''}`.trim()}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasRows ? (
            children
          ) : (
            <tr>
              <td colSpan={columns.length}>{emptyState ?? <p className="admin-body">No rows found.</p>}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
