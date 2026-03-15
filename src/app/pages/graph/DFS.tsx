import { useMemo, useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import GraphCanvas from "../../components/sim/GraphCanvas";
import { usePlayback } from "../../components/sim/usePlayback";
import { traversalEdges, traversalNodes } from "../../data/graphSamples";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface DfsFrame {
  message: string;
  stack: number[];
  visited: number[];
  order: number[];
  current: number | null;
  nodeState: Record<number, "idle" | "active" | "visited" | "selected">;
  edgeState: Record<string, "idle" | "selected">;
}

function edgeKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join("-");
}

function createFrames(startNode: number): DfsFrame[] {
  const adjacency = new Map<number, number[]>();
  traversalNodes.forEach((node) => adjacency.set(node.id, []));
  traversalEdges.forEach((edge) => {
    adjacency.get(edge.from)!.push(edge.to);
    adjacency.get(edge.to)!.push(edge.from);
  });
  adjacency.forEach((neighbors) => neighbors.sort((a, b) => a - b));

  const frames: DfsFrame[] = [];
  const stack = [startNode];
  const visited = new Set<number>();
  const order: number[] = [];
  const treeEdges = new Set<string>();

  frames.push({
    message: `Initialize DFS with start node ${startNode}.`,
    stack: [...stack],
    visited: [],
    order: [],
    current: startNode,
    nodeState: Object.fromEntries(traversalNodes.map((node) => [node.id, node.id === startNode ? "active" : "idle"])),
    edgeState: {},
  });

  while (stack.length) {
    const current = stack.pop()!;

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);
    order.push(current);
    frames.push({
      message: `Pop ${current} from the stack and visit it.`,
      stack: [...stack],
      visited: [...visited],
      order: [...order],
      current,
      nodeState: Object.fromEntries(
        traversalNodes.map((node) => [
          node.id,
          node.id === current ? "active" : visited.has(node.id) ? "visited" : stack.includes(node.id) ? "selected" : "idle",
        ]),
      ),
      edgeState: Object.fromEntries(Array.from(treeEdges).map((key) => [key, "selected"])),
    });

    const neighbors = adjacency
      .get(current)!
      .filter((neighbor) => !visited.has(neighbor))
      .sort((a, b) => b - a);

    for (const neighbor of neighbors) {
      stack.push(neighbor);
      treeEdges.add(edgeKey(current, neighbor));
      frames.push({
        message: `Push ${neighbor} onto the stack from ${current}.`,
        stack: [...stack],
        visited: [...visited],
        order: [...order],
        current,
        nodeState: Object.fromEntries(
          traversalNodes.map((node) => [
            node.id,
            node.id === current ? "active" : visited.has(node.id) ? "visited" : stack.includes(node.id) ? "selected" : "idle",
          ]),
        ),
        edgeState: Object.fromEntries(Array.from(treeEdges).map((key) => [key, "selected"])),
      });
    }
  }

  frames.push({
    message: "DFS complete. The stack is empty.",
    stack: [],
    visited: [...visited],
    order: [...order],
    current: null,
    nodeState: Object.fromEntries(traversalNodes.map((node) => [node.id, "visited"])),
    edgeState: Object.fromEntries(Array.from(treeEdges).map((key) => [key, "selected"])),
  });

  return frames;
}

export default function DFS() {
  const [startNodeInput, setStartNodeInput] = useState("0");
  const [startNode, setStartNode] = useState(0);
  const frames = useMemo(() => createFrames(startNode), [startNode]);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function dfs(graph, start) {
  const visited = new Set();
  const stack = [start];
  const order = [];

  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;

    visited.add(node);
    order.push(node);

    for (const neighbor of [...graph[node]].reverse()) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return order;
}`;

  return (
    <AlgorithmLayout
      title="DFS (Depth-First Search)"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(V + E)", space: "O(V)" }}
      description="DFS dives down one branch before backtracking. The simulation shows exact stack contents and the traversal tree as nodes are pushed and popped."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="number"
              min="0"
              max="6"
              value={startNodeInput}
              onChange={(event) => setStartNodeInput(event.target.value)}
              className="w-24"
            />
            <Button
              variant="outline"
              onClick={() => {
                const parsed = Number(startNodeInput);
                setStartNode(Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(6, parsed)));
              }}
            >
              Apply start node
            </Button>
            <div className="text-sm text-slate-600">
              Step {playback.currentStep + 1} / {playback.totalSteps}
            </div>
          </div>

          <GraphCanvas
            nodes={traversalNodes}
            edges={traversalEdges}
            nodeState={frame.nodeState}
            edgeState={frame.edgeState}
          />

          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-950">
            {frame.message}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Stack</p>
              <p className="mt-2 font-semibold text-slate-900">[{frame.stack.join(", ")}]</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Visited</p>
              <p className="mt-2 font-semibold text-slate-900">[{frame.visited.join(", ")}]</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Traversal Order</p>
              <p className="mt-2 font-semibold text-slate-900">{frame.order.join(" → ") || "-"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
