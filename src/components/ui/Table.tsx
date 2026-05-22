import { type ReactNode } from "react";

interface Column<T> {
  key: keyof T | "actions";
  label: string;
  align?: "left" | "center" | "right";
  bold?: boolean;
  render?: (value: any, row: T) => ReactNode;
  width?: string; // e.g. "w-32" tailwind class
}

interface TableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = "id" as keyof T,
  loading = false,
  emptyMessage = "No data found",
  onRowClick,
  className = "",
}: TableProps<T>) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={[
        "w-full overflow-x-auto rounded-2xl border border-white/10",
        className,
      ].join(" ")}
    >
      <table className="w-full text-sm border-collapse">
        {/* Head */}
        <thead>
          <tr className="border-b border-white/8 bg-white/3">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={[
                  "px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap",
                  alignClass[col.align ?? "left"],
                  col.width ?? "",
                ].join(" ")}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            // Skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-white/5">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-5 py-4">
                    <div
                      className="h-4 bg-white/5 rounded-lg animate-pulse"
                      style={{ width: `${60 + Math.random() * 40}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-16 text-gray-500"
              >
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">{emptyMessage}</p>
              </td>
            </tr>
          ) : (
            data.map((row, ri) => (
              <tr
                key={String(row[keyField] ?? ri)}
                className={[
                  "border-b border-white/5 transition-colors duration-150",
                  onRowClick
                    ? "cursor-pointer hover:bg-purple-900/10"
                    : "hover:bg-white/3",
                ].join(" ")}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => {
                  const value = row[col.key as keyof T];
                  return (
                    <td
                      key={String(col.key)}
                      className={[
                        "px-5 py-4 whitespace-nowrap",
                        alignClass[col.align ?? "left"],
                        col.bold ? "text-white font-semibold" : "text-gray-300",
                      ].join(" ")}
                    >
                      {col.render
                        ? col.render(value, row)
                        : String(value ?? "—")}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
