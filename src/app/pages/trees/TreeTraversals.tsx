import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import BinaryTreeCanvas from "../../components/sim/BinaryTreeCanvas";
import { usePlayback } from "../../components/sim/usePlayback";

interface TraversalFrame {
  message: string;
  active: number | null;
  order: number[];
  type: "Inorder" | "Preorder" | "Postorder";
}

const treeNodes = [
  { id: "50", value: 50, index: 0 },
  { id: "30", value: 30, index: 1 },
  { id: "70", value: 70, index: 2 },
  { id: "20", value: 20, index: 3 },
  { id: "40", value: 40, index: 4 },
  { id: "60", value: 60, index: 5 },
  { id: "80", value: 80, index: 6 },
];

function createFrames() {
  const traversals = {
    Inorder: [20, 30, 40, 50, 60, 70, 80],
    Preorder: [50, 30, 20, 40, 70, 60, 80],
    Postorder: [20, 40, 30, 60, 80, 70, 50],
  } as const;

  const frames: TraversalFrame[] = [];
  (Object.entries(traversals) as Array<[TraversalFrame["type"], number[]]>).forEach(([type, sequence]) => {
    const visited: number[] = [];
    sequence.forEach((value) => {
      visited.push(value);
      frames.push({
        message: `${type}: visit ${value} and append it to the traversal output.`,
        active: value,
        order: [...visited],
        type,
      });
    });
  });

  return frames;
}

export default function TreeTraversals() {
  const frames = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `inorder(node) {
  inorder(node.left);
  visit(node);
  inorder(node.right);
}`;

  return (
    <AlgorithmLayout
      title="Tree Traversals"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(n)", space: "O(h)" }}
      description="The traversal module highlights inorder, preorder, and postorder visitation order over the same BST so their differences are easy to compare."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <BinaryTreeCanvas
            nodes={treeNodes.map((node) => ({
              ...node,
              state: node.value === frame.active ? "active" : frame.order.includes(node.value) ? "visited" : "idle",
            }))}
          />
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">{frame.message}</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{frame.type} Output</p>
            <p className="mt-2 font-semibold text-slate-900">{frame.order.join(" → ")}</p>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
