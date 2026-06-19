"use client";

interface Column {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  keyField: string;
}

export default function DataTable({
  columns,
  data,
  keyField,
}: DataTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border-dark">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-dark bg-card">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-text-secondary font-medium px-4 py-3"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={String(row[keyField])}
              className={`border-b border-border-dark hover:bg-brand/5 transition-colors ${
                idx % 2 === 0 ? "bg-card" : "bg-card2"
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-text-primary">
                  {col.render ? col.render(row) : String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
