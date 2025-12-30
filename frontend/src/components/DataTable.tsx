import { ReactNode } from 'react';

export interface Column<T> {
  key: keyof T;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  className?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyField,
  onRowClick,
  loading = false,
  className = '',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className={`card ${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`card ${className}`}>
        <div className="flex justify-center items-center py-8 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className={`card overflow-x-auto ${className}`}>
      <table className="w-full">
        <thead className="border-b-2 border-gray-200">
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                  column.width ? `w-${column.width}` : ''
                } text-${column.align || 'left'}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={String(item[keyField]) + index}
              className="hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-200"
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-${
                    column.align || 'left'
                  }`}
                >
                  {column.render
                    ? column.render(item[column.key], item)
                    : String(item[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
