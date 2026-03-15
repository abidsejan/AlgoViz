interface DPTableProps {
  data: Array<Array<string | number>>;
  active?: [number, number] | null;
  completed?: Set<string>;
  rowLabels?: string[];
  colLabels?: string[];
}

export default function DPTable({
  data,
  active = null,
  completed = new Set<string>(),
  rowLabels,
  colLabels,
}: DPTableProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <table className="mx-auto border-collapse">
        {colLabels ? (
          <thead>
            <tr>
              {rowLabels ? <th className="border border-slate-300 bg-slate-100 p-2" /> : null}
              {colLabels.map((label, index) => (
                <th key={index} className="border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {rowLabels ? (
                <th className="border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {rowLabels[rowIndex]}
                </th>
              ) : null}
              {row.map((cell, colIndex) => {
                const key = `${rowIndex}-${colIndex}`;
                const isActive = active?.[0] === rowIndex && active?.[1] === colIndex;

                return (
                  <td
                    key={key}
                    className={`min-w-12 border border-slate-300 px-3 py-2 text-center text-sm font-semibold ${
                      isActive
                        ? "bg-amber-300 text-slate-950"
                        : completed.has(key)
                          ? "bg-emerald-100 text-emerald-950"
                          : "bg-white text-slate-700"
                    }`}
                  >
                    {cell}
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
