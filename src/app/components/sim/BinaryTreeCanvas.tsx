interface TreeNode {
  id: string;
  value: string | number;
  index: number;
  state?: "idle" | "active" | "visited" | "selected";
}

interface BinaryTreeCanvasProps {
  nodes: TreeNode[];
}

const palette = {
  idle: { fill: "#e2e8f0", text: "#0f172a" },
  active: { fill: "#f59e0b", text: "#111827" },
  visited: { fill: "#22c55e", text: "#052e16" },
  selected: { fill: "#8b5cf6", text: "#faf5ff" },
};

function getPosition(index: number) {
  const level = Math.floor(Math.log2(index + 1));
  const nodesInLevel = 2 ** level;
  const positionInLevel = index - (2 ** level - 1);
  const horizontalGap = 560 / nodesInLevel;
  return {
    x: 40 + horizontalGap / 2 + positionInLevel * horizontalGap,
    y: 60 + level * 86,
  };
}

export default function BinaryTreeCanvas({ nodes }: BinaryTreeCanvasProps) {
  const indexedNodes = Object.fromEntries(nodes.map((node) => [node.index, node]));

  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <svg viewBox="0 0 620 360" className="mx-auto h-auto w-full max-w-3xl">
        {nodes.map((node) => {
          const position = getPosition(node.index);
          const leftChild = indexedNodes[node.index * 2 + 1];
          const rightChild = indexedNodes[node.index * 2 + 2];

          return (
            <g key={`edges-${node.id}`}>
              {leftChild ? (
                <line
                  x1={position.x}
                  y1={position.y}
                  x2={getPosition(leftChild.index).x}
                  y2={getPosition(leftChild.index).y}
                  stroke="#94a3b8"
                  strokeWidth="3"
                />
              ) : null}
              {rightChild ? (
                <line
                  x1={position.x}
                  y1={position.y}
                  x2={getPosition(rightChild.index).x}
                  y2={getPosition(rightChild.index).y}
                  stroke="#94a3b8"
                  strokeWidth="3"
                />
              ) : null}
            </g>
          );
        })}

        {nodes.map((node) => {
          const position = getPosition(node.index);
          const style = palette[node.state ?? "idle"];
          return (
            <g key={node.id}>
              <circle cx={position.x} cy={position.y} r="24" fill={style.fill} stroke="#0f172a" strokeWidth="2.5" />
              <text x={position.x} y={position.y + 5} textAnchor="middle" className="text-[13px] font-bold" fill={style.text}>
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
