import { useMemo, useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import GraphCanvas from "../../components/sim/GraphCanvas";
import { usePlayback } from "../../components/sim/usePlayback";
import { traversalEdges, traversalNodes } from "../../data/graphSamples";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface BfsFrame {
  message: string;
  queue: number[];
  visited: number[];
  order: number[];
  current: number | null;
  nodeState: Record<number, "idle" | "active" | "visited" | "queued">;
  edgeState: Record<string, "idle" | "selected">;
}

function edgeKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join("-");
}

function createFrames(startNode: number): BfsFrame[] {
  const adjacency = new Map<number, number[]>();
  traversalNodes.forEach((node) => adjacency.set(node.id, []));
  traversalEdges.forEach((edge) => {
    adjacency.get(edge.from)!.push(edge.to);
    adjacency.get(edge.to)!.push(edge.from);
  });
  adjacency.forEach((neighbors) => neighbors.sort((a, b) => a - b));

  const frames: BfsFrame[] = [];
  const queue = [startNode];
  const visited = new Set<number>([startNode]);
  const order: number[] = [];
  const treeEdges = new Set<string>();

  frames.push({
    message: `Initialize BFS with start node ${startNode}.`,
    queue: [...queue],
    visited: [...visited],
    order: [],
    current: startNode,
    nodeState: Object.fromEntries(traversalNodes.map((node) => [node.id, node.id === startNode ? "active" : "idle"])),
    edgeState: {},
  });

  while (queue.length) {
    const current = queue.shift()!;
    order.push(current);

    frames.push({
      message: `Dequeue node ${current} and visit it.`,
      queue: [...queue],
      visited: [...visited],
      order: [...order],
      current,
      nodeState: Object.fromEntries(
        traversalNodes.map((node) => [
          node.id,
          node.id === current ? "active" : visited.has(node.id) ? "visited" : queue.includes(node.id) ? "queued" : "idle",
        ]),
      ),
      edgeState: Object.fromEntries(Array.from(treeEdges).map((key) => [key, "selected"])),
    });

    for (const neighbor of adjacency.get(current)!) {
      if (visited.has(neighbor)) {
        continue;
      }

      visited.add(neighbor);
      queue.push(neighbor);
      treeEdges.add(edgeKey(current, neighbor));

      frames.push({
        message: `Discover ${neighbor} from ${current}; enqueue it and mark the tree edge.`,
        queue: [...queue],
        visited: [...visited],
        order: [...order],
        current,
        nodeState: Object.fromEntries(
          traversalNodes.map((node) => [
            node.id,
            node.id === current
              ? "active"
              : node.id === neighbor
                ? "queued"
                : visited.has(node.id)
                  ? "visited"
                  : queue.includes(node.id)
                    ? "queued"
                    : "idle",
          ]),
        ),
        edgeState: Object.fromEntries(Array.from(treeEdges).map((key) => [key, "selected"])),
      });
    }
  }

  frames.push({
    message: "BFS complete. The queue is empty.",
    queue: [],
    visited: [...visited],
    order: [...order],
    current: null,
    nodeState: Object.fromEntries(traversalNodes.map((node) => [node.id, "visited"])),
    edgeState: Object.fromEntries(Array.from(treeEdges).map((key) => [key, "selected"])),
  });

  return frames;
}

export default function BFS() {
  const [startNodeInput, setStartNodeInput] = useState("0");
  const [startNode, setStartNode] = useState(0);
  const frames = useMemo(() => createFrames(startNode), [startNode]);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return order;
}`;

  return (
    <AlgorithmLayout
      title="BFS (Breadth-First Search)"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(V + E)", space: "O(V)" }}
      description="BFS explores the graph level by level. Each frame shows queue growth, the visited set, and the traversal tree edge that was just chosen."
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

          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
            {frame.message}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Queue</p>
              <p className="mt-2 font-semibold text-slate-900">[{frame.queue.join(", ")}]</p>
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
