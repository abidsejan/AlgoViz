import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import GraphCanvas from "../../components/sim/GraphCanvas";
import { usePlayback } from "../../components/sim/usePlayback";
import { weightedEdges, weightedNodes } from "../../data/graphSamples";

interface PrimFrame {
  message: string;
  selected: number[];
  key: number[];
  parent: Array<number | null>;
  current: number | null;
  nodeState: Record<number, "idle" | "active" | "visited" | "queued">;
  edgeState: Record<string, "selected" | "relaxed">;
}

function edgeKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join("-");
}

function createFrames(): PrimFrame[] {
  const adjacency = new Map<number, Array<{ to: number; weight: number }>>();
  weightedNodes.forEach((node) => adjacency.set(node.id, []));
  weightedEdges.forEach((edge) => {
    adjacency.get(edge.from)!.push({ to: edge.to, weight: edge.weight });
    adjacency.get(edge.to)!.push({ to: edge.from, weight: edge.weight });
  });

  const key = Array(weightedNodes.length).fill(Infinity);
  const parent: Array<number | null> = Array(weightedNodes.length).fill(null);
  const inMst = new Set<number>();
  const frames: PrimFrame[] = [];
  key[0] = 0;

  frames.push({
    message: "Initialize Prim's algorithm with node 0 as the starting tree root.",
    selected: [],
    key: [...key],
    parent: [...parent],
    current: 0,
    nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, node.id === 0 ? "active" : "idle"])),
    edgeState: {},
  });

  while (inMst.size < weightedNodes.length) {
    let current = -1;
    let best = Infinity;
    for (const node of weightedNodes) {
      if (!inMst.has(node.id) && key[node.id] < best) {
        best = key[node.id];
        current = node.id;
      }
    }

    if (current === -1) {
      break;
    }

    inMst.add(current);
    frames.push({
      message: `Add node ${current} to the MST frontier using key ${key[current]}.`,
      selected: [...inMst],
      key: [...key],
      parent: [...parent],
      current,
      nodeState: Object.fromEntries(
        weightedNodes.map((node) => [
          node.id,
          node.id === current ? "active" : inMst.has(node.id) ? "visited" : key[node.id] < Infinity ? "queued" : "idle",
        ]),
      ),
      edgeState: Object.fromEntries(
        parent
          .map((from, to) => (from === null || !inMst.has(to) ? null : [edgeKey(from, to), "selected"] as const))
          .filter(Boolean) as Array<[string, "selected"]>,
      ),
    });

    for (const neighbor of adjacency.get(current)!) {
      if (inMst.has(neighbor.to) || neighbor.weight >= key[neighbor.to]) {
        continue;
      }

      key[neighbor.to] = neighbor.weight;
      parent[neighbor.to] = current;

      const edgeState: Record<string, "selected" | "relaxed"> = Object.fromEntries(
        parent
          .map((from, to) => (from === null || !inMst.has(to) ? null : [edgeKey(from, to), "selected"] as const))
          .filter(Boolean) as Array<[string, "selected"]>,
      );
      edgeState[edgeKey(current, neighbor.to)] = "relaxed";

      frames.push({
        message: `Update key of ${neighbor.to} to ${neighbor.weight} via edge ${current} - ${neighbor.to}.`,
        selected: [...inMst],
        key: [...key],
        parent: [...parent],
        current,
        nodeState: Object.fromEntries(
          weightedNodes.map((node) => [
            node.id,
            node.id === current ? "active" : inMst.has(node.id) ? "visited" : key[node.id] < Infinity ? "queued" : "idle",
          ]),
        ),
        edgeState,
      });
    }
  }

  frames.push({
    message: "Prim's algorithm complete. The selected edges form a minimum spanning tree.",
    selected: [...inMst],
    key: [...key],
    parent: [...parent],
    current: null,
    nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, "visited"])),
    edgeState: Object.fromEntries(
      parent
        .map((from, to) => (from === null ? null : [edgeKey(from, to), "selected"] as const))
        .filter(Boolean) as Array<[string, "selected"]>,
    ),
  });

  return frames;
}

export default function Prims() {
  const frames = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function prim(graph) {
  const inMst = Array(graph.length).fill(false);
  const key = Array(graph.length).fill(Infinity);
  const parent = Array(graph.length).fill(null);
  key[0] = 0;

  for (let i = 0; i < graph.length; i++) {
    let u = -1;
    for (let v = 0; v < graph.length; v++) {
      if (!inMst[v] && (u === -1 || key[v] < key[u])) u = v;
    }

    inMst[u] = true;
    for (const [v, w] of graph[u]) {
      if (!inMst[v] && w < key[v]) {
        key[v] = w;
        parent[v] = u;
      }
    }
  }

  return parent;
}`;

  return (
    <AlgorithmLayout
      title="Prim's Algorithm"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(V^2) or O(E log V)", space: "O(V)" }}
      description="Prim grows the MST one frontier edge at a time. Keys represent the cheapest known attachment cost for every node outside the tree."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="text-sm text-slate-600">
            Step {playback.currentStep + 1} / {playback.totalSteps}
          </div>

          <GraphCanvas
            nodes={weightedNodes}
            edges={weightedEdges}
            nodeState={frame.nodeState}
            edgeState={frame.edgeState}
            nodeText={Object.fromEntries(frame.key.map((value, index) => [index, value === Infinity ? "∞" : String(value)]))}
          />

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
            {frame.message}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">MST Nodes</p>
              <p className="mt-2 font-semibold text-slate-900">[{frame.selected.join(", ")}]</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Key Values</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm font-semibold text-slate-900">
                {frame.key.map((value, index) => (
                  <div key={index}>Node {index}: {value === Infinity ? "∞" : value}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
