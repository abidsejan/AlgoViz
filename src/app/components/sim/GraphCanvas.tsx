interface GraphNode {
  id: number;
  x: number;
  y: number;
  label?: string;
}

interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
  directed?: boolean;
}

interface GraphCanvasProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  nodeState?: Record<number, "idle" | "active" | "visited" | "queued" | "selected" | "candidate">;
  edgeState?: Record<string, "idle" | "active" | "selected" | "relaxed" | "rejected">;
  nodeText?: Record<number, string>;
}

const nodePalette = {
  idle: { fill: "#e2e8f0", text: "#0f172a" },
  active: { fill: "#f59e0b", text: "#111827" },
  visited: { fill: "#22c55e", text: "#052e16" },
  queued: { fill: "#38bdf8", text: "#082f49" },
  selected: { fill: "#a855f7", text: "#faf5ff" },
  candidate: { fill: "#fb7185", text: "#fff1f2" },
};

const edgePalette = {
  idle: "#b8c4d3",
  active: "#f59e0b",
  selected: "#16a34a",
  relaxed: "#0284c7",
  rejected: "#dc2626",
};

function edgeKey(from: number, to: number, directed?: boolean) {
  return directed ? `${from}->${to}` : [from, to].sort((a, b) => a - b).join("-");
}

export default function GraphCanvas({
  nodes,
  edges,
  nodeState = {},
  edgeState = {},
  nodeText = {},
}: GraphCanvasProps) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fbfc_100%)] p-4">
      <svg viewBox="0 0 640 340" className="mx-auto h-auto w-full max-w-3xl">
        <defs>
          <marker id="arrow-head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const from = nodes.find((node) => node.id === edge.from)!;
          const to = nodes.find((node) => node.id === edge.to)!;
          const state = edgeState[edgeKey(edge.from, edge.to, edge.directed)] ?? "idle";
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;

          return (
            <g key={edgeKey(edge.from, edge.to, edge.directed)}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={edgePalette[state]}
                strokeWidth={state === "selected" ? 4 : 3}
                markerEnd={edge.directed ? "url(#arrow-head)" : undefined}
                opacity={state === "rejected" ? 0.6 : 1}
              />
              {typeof edge.weight === "number" ? (
                <g>
                  <rect x={midX - 13} y={midY - 13} width={26} height={24} rx={12} fill="white" stroke="#d6dee8" />
                  <text x={midX} y={midY + 4} textAnchor="middle" className="fill-slate-700 text-[12px] font-semibold">
                    {edge.weight}
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => {
          const state = nodeState[node.id] ?? "idle";
          const palette = nodePalette[state];

          return (
            <g key={node.id}>
              <circle cx={node.x} cy={node.y} r="28" fill={palette.fill} stroke="#0f172a" strokeWidth="2.5" />
              <text x={node.x} y={node.y - 4} textAnchor="middle" className="text-[14px] font-bold" fill={palette.text}>
                {node.label ?? node.id}
              </text>
              {nodeText[node.id] ? (
                <text x={node.x} y={node.y + 14} textAnchor="middle" className="text-[11px] font-semibold" fill={palette.text}>
                  {nodeText[node.id]}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
