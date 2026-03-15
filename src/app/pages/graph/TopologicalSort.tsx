import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import GraphCanvas from "../../components/sim/GraphCanvas";
import { usePlayback } from "../../components/sim/usePlayback";
import { dagEdges, dagNodes } from "../../data/graphSamples";

interface TopoFrame {
  message: string;
  queue: number[];
  indegree: number[];
  order: number[];
  current: number | null;
  nodeState: Record<number, "idle" | "active" | "visited" | "queued">;
  edgeState: Record<string, "selected">;
}

function edgeKey(a: number, b: number) {
  return `${a}->${b}`;
}

function createFrames(): TopoFrame[] {
  const adjacency = new Map<number, number[]>();
  const indegree = Array(dagNodes.length).fill(0);
  dagNodes.forEach((node) => adjacency.set(node.id, []));
  dagEdges.forEach((edge) => {
    adjacency.get(edge.from)!.push(edge.to);
    indegree[edge.to] += 1;
  });

  const queue = dagNodes.filter((node) => indegree[node.id] === 0).map((node) => node.id);
  const order: number[] = [];
  const frames: TopoFrame[] = [
    {
      message: `Initialize queue with all zero-indegree vertices: [${queue.join(", ")}].`,
      queue: [...queue],
      indegree: [...indegree],
      order: [],
      current: null,
      nodeState: Object.fromEntries(dagNodes.map((node) => [node.id, queue.includes(node.id) ? "queued" : "idle"])),
      edgeState: {},
    },
  ];

  while (queue.length) {
    const current = queue.shift()!;
    order.push(current);
    frames.push({
      message: `Remove ${current} from the queue and append it to the topological order.`,
      queue: [...queue],
      indegree: [...indegree],
      order: [...order],
      current,
      nodeState: Object.fromEntries(
        dagNodes.map((node) => [
          node.id,
          node.id === current ? "active" : order.includes(node.id) ? "visited" : queue.includes(node.id) ? "queued" : "idle",
        ]),
      ),
      edgeState: {},
    });

    for (const neighbor of adjacency.get(current)!) {
      indegree[neighbor] -= 1;
      frames.push({
        message: `Decrease indegree of ${neighbor} after removing incoming edge from ${current}.`,
        queue: [...queue],
        indegree: [...indegree],
        order: [...order],
        current,
        nodeState: Object.fromEntries(
          dagNodes.map((node) => [
            node.id,
            node.id === neighbor ? "active" : order.includes(node.id) ? "visited" : queue.includes(node.id) ? "queued" : "idle",
          ]),
        ),
        edgeState: { [edgeKey(current, neighbor)]: "selected" },
      });

      if (indegree[neighbor] === 0) {
        queue.push(neighbor);
        frames.push({
          message: `Node ${neighbor} now has indegree 0, so enqueue it.`,
          queue: [...queue],
          indegree: [...indegree],
          order: [...order],
          current,
          nodeState: Object.fromEntries(
            dagNodes.map((node) => [
              node.id,
              order.includes(node.id) ? "visited" : queue.includes(node.id) ? "queued" : "idle",
            ]),
          ),
          edgeState: { [edgeKey(current, neighbor)]: "selected" },
        });
      }
    }
  }

  frames.push({
    message: "Topological sort complete.",
    queue: [],
    indegree: [...indegree],
    order: [...order],
    current: null,
    nodeState: Object.fromEntries(dagNodes.map((node) => [node.id, "visited"])),
    edgeState: {},
  });

  return frames;
}

export default function TopologicalSort() {
  const frames = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function topologicalSort(graph) {
  const indegree = Array(graph.length).fill(0);
  for (let u = 0; u < graph.length; u++) {
    for (const v of graph[u]) indegree[v]++;
  }

  const queue = [];
  indegree.forEach((value, vertex) => {
    if (value === 0) queue.push(vertex);
  });

  const order = [];
  while (queue.length) {
    const u = queue.shift();
    order.push(u);
    for (const v of graph[u]) {
      indegree[v]--;
      if (indegree[v] === 0) queue.push(v);
    }
  }

  return order;
}`;

  return (
    <AlgorithmLayout
      title="Topological Sort"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(V + E)", space: "O(V)" }}
      description="This DAG simulation uses Kahn's algorithm, showing indegree updates and the zero-indegree queue that drives the final ordering."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="text-sm text-slate-600">
            Step {playback.currentStep + 1} / {playback.totalSteps}
          </div>

          <GraphCanvas
            nodes={dagNodes}
            edges={dagEdges.map((edge) => ({ ...edge, directed: true }))}
            nodeState={frame.nodeState}
            edgeState={frame.edgeState}
            nodeText={Object.fromEntries(frame.indegree.map((value, index) => [index, String(value)]))}
          />

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            {frame.message}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Queue</p>
              <p className="mt-2 font-semibold text-slate-900">[{frame.queue.join(", ")}]</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm text-slate-500">Topological Order</p>
              <p className="mt-2 font-semibold text-slate-900">{frame.order.join(" → ") || "-"}</p>
            </div>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
