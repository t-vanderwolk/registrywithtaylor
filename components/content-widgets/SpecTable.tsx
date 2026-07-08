import type { ReactNode } from 'react';

type SpecTableProps = {
  title?: ReactNode;
  columns: ReactNode[];
  rows: Array<{ label: ReactNode; values: ReactNode[] }>;
};

/**
 * A multi-column spec comparison table for blog posts. The first column is the
 * spec label; each remaining column is a product. Scrolls horizontally on
 * narrow screens so wide comparisons stay readable on mobile.
 */
export default function SpecTable({ title, columns, rows }: SpecTableProps) {
  if (columns.length === 0 || rows.length === 0) return null;

  return (
    <figure className="tmbc-spec-table not-prose">
      {title ? <figcaption className="tmbc-spec-table__title">{title}</figcaption> : null}
      <div className="tmbc-spec-table__scroll">
        <table className="tmbc-spec-table__table">
          <thead>
            <tr>
              <th scope="col" className="tmbc-spec-table__corner">
                Spec
              </th>
              {columns.map((column, index) => (
                <th key={`col-${index}`} scope="col" className="tmbc-spec-table__product">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                <th scope="row" className="tmbc-spec-table__spec">
                  {row.label}
                </th>
                {columns.map((_, colIndex) => (
                  <td key={`cell-${rowIndex}-${colIndex}`} className="tmbc-spec-table__cell">
                    {row.values[colIndex] ?? '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
