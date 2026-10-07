import type { ReactNode } from 'react';

/**
 * Minimal column-driven table. PrimeNG's `<p-table>` does far more; this keeps
 * the same call shape (columns declared as data, rows rendered from them) so
 * the swap to a real table component is mechanical.
 */

export interface Column<T> {
    /** Stable key, used for the React key and nothing else. */
    key: string;
    header: string;
    /** Cell renderer. Returning a string is the common case. */
    cell: (row: T) => ReactNode;
    /** Right-align numerics; defaults to left. */
    align?: 'left' | 'right';
    /** Render in the monospace face — codes, ids, counts. */
    mono?: boolean;
}

export function DataTable<T>({
    columns,
    rows,
    rowKey,
    caption,
}: {
    columns: readonly Column<T>[];
    rows: readonly T[];
    rowKey: (row: T) => string;
    caption?: string;
}) {
    return (
        <div className="table-scroll">
            <table className="data-table">
                {caption ? <caption className="sr-only">{caption}</caption> : null}
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th key={column.key} scope="col" className={column.align === 'right' ? 'ta-right' : undefined}>
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={rowKey(row)}>
                            {columns.map(column => {
                                const className = [column.align === 'right' ? 'ta-right' : '', column.mono ? 'mono' : '']
                                    .filter(Boolean)
                                    .join(' ');
                                return (
                                    <td key={column.key} className={className || undefined}>
                                        {column.cell(row)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
