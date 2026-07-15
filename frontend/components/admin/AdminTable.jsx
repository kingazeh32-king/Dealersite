import { Children } from 'react';
import { adminThClass } from '@/lib/adminUi';

export default function AdminTable({ columns, children, empty, loading, colSpan }) {
  const span = colSpan || columns.length;
  const rows = Children.toArray(children);
  const isEmpty = rows.length === 0;

  return (
    <div className="overflow-x-auto border border-slate-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-light/40">
          <tr>
            {columns.map((column) => (
              <th key={column} className={adminThClass}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td colSpan={span} className="px-4 py-10 text-center text-slate">
                Loading…
              </td>
            </tr>
          ) : isEmpty ? (
            <tr>
              <td colSpan={span} className="px-4 py-10 text-center text-slate">
                {empty || 'No items yet.'}
              </td>
            </tr>
          ) : (
            rows
          )}
        </tbody>
      </table>
    </div>
  );
}
