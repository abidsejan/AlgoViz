import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import GraphCanvas from "../../components/sim/GraphCanvas";
import { usePlayback } from "../../components/sim/usePlayback";
import { weightedEdges, weightedNodes } from "../../data/graphSamples";

interface KruskalFrame {
  message: string;
  mstWeight: number;
  chosenEdges: string[];
  currentEdge: string | null;
  edgeState: Record<string, "selected" | "active" | "rejected">;
  nodeState: Record<number, "idle" | "visited" | "active">;
  components: number[];
}

function edgeKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join("-");
}

function createFrames(): KruskalFrame[] {
  const parent = weightedNodes.map((node) => node.id);
  const rank = weightedNodes.map(() => 0);
  const edges = [...weightedEdges].sort((a, b) => a.weight - b.weight);
  const chosenEdges: string[] = [];
  const frames: KruskalFrame[] = [];
  let mstWeight = 0;

  const find = (x: number): number => {
    if (parent[x] !== x) {
      parent[x] = find(parent[x]);
    }
    return parent[x];
  };

  const union = (a: number, b: number) => {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA === rootB) {
      return false;
    }
    if (rank[rootA] < rank[rootB]) {
      parent[rootA] = rootB;
    } else if (rank[rootA] > rank[rootB]) {
      parent[rootB] = rootA;
    } else {
      parent[rootB] = rootA;
      rank[rootA] += 1;
    }
    return true;
  };

  frames.push({
    message: "Sort all edges in non-decreasing order of weight.",
    mstWeight: 0,
    chosenEdges: [],
    currentEdge: null,
    edgeState: {},
    nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, "idle"])),
    components: [...parent],
  });

  edges.forEach((edge) => {
    const key = edgeKey(edge.from, edge.to);
    const activeEdgeState: Record<string, "selected" | "active" | "rejected"> = Object.fromEntries(
      chosenEdges.map((selected) => [selected, "selected" as const]),
    );
    activeEdgeState[key] = "active";

    frames.push({
      message: `Inspect edge ${edge.from} - ${edge.to} with weight ${edge.weight}.`,
      mstWeight,
      chosenEdges: [...chosenEdges],
      currentEdge: key,
      edgeState: activeEdgeState,
      nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, node.id === edge.from || node.id === edge.to ? "active" : "idle"])),
      components: weightedNodes.map((node) => find(node.id)),
    });

    if (union(edge.from, edge.to)) {
      chosenEdges.push(key);
      mstWeight += edge.weight;
      frames.push({
        message: `Add edge ${edge.from} - ${edge.to}; it connects two different components.`,
        mstWeight,
        chosenEdges: [...chosenEdges],
        currentEdge: key,
        edgeState: Object.fromEntries(chosenEdges.map((selected) => [selected, "selected" as const])),
        nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, chosenEdges.some((selected) => selected.includes(String(node.id))) ? "visited" : "idle"])),
        components: weightedNodes.map((node) => find(node.id)),
      });
    } else {
      activeEdgeState[key] = "rejected";
      frames.push({
        message: `Reject edge ${edge.from} - ${edge.to}; it would create a cycle.`,
        mstWeight,
        chosenEdges: [...chosenEdges],
        currentEdge: key,
        edgeState: activeEdgeState,
        nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, "idle"])),
        components: weightedNodes.map((node) => find(node.id)),
      });
    }
  });

  frames.push({
    message: "Kruskal complete. The selected edges form the MST.",
    mstWeight,
    chosenEdges: [...chosenEdges],
    currentEdge: null,
    edgeState: Object.fromEntries(chosenEdges.map((selected) => [selected, "selected" as const])),
    nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, "visited"])),
    components: weightedNodes.map((node) => find(node.id)),
  });

  return frames;
}

export default function Kruskals() {
  const frames = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function kruskal(edges, vertexCount) {
  edges.sort((a, b) => a.weight - b.weight);
  const parent = Array.from({ length: vertexCount }, (_, i) => i);

  function find(x) {
    return parent[x] === x ? x : (parent[x] = find(parent[x]));
  }

  const mst = [];
  for (const edge of edges) {
    const a = find(edge.from);
    const b = find(edge.to);
    if (a !== b) {
      parent[a] = b;
      mst.push(edge);
    }
  }

  return mst;
}`;

  return (
    <AlgorithmLayout
      title="Kruskal's Algorithm"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(E log E)", space: "O(V)" }}
      description="Kruskal processes edges in weight order. The simulation explicitly shows when Union-Find accepts an edge and when it rejects one as a cycle."
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
          />

          <div className="rounded-2xl border border-lime-200 bg-lime-50 p-4 text-sm text-lime-950">
            {frame.message}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Chosen Edges</p>
              <p className="mt-2 font-semibold text-slate-900">{frame.chosenEdges.join(", ") || "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Current MST Weight</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{frame.mstWeight}</p>
            </div>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
