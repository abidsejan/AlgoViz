import { useMemo, useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import GraphCanvas from "../../components/sim/GraphCanvas";
import { usePlayback } from "../../components/sim/usePlayback";
import { weightedEdges, weightedNodes } from "../../data/graphSamples";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface DijkstraFrame {
  message: string;
  current: number | null;
  visited: number[];
  distances: number[];
  parent: Array<number | null>;
  nodeState: Record<number, "idle" | "active" | "visited" | "queued">;
  edgeState: Record<string, "idle" | "selected" | "relaxed">;
}

function edgeKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join("-");
}

function createFrames(startNode: number): DijkstraFrame[] {
  const adjacency = new Map<number, Array<{ to: number; weight: number }>>();
  weightedNodes.forEach((node) => adjacency.set(node.id, []));
  weightedEdges.forEach((edge) => {
    adjacency.get(edge.from)!.push({ to: edge.to, weight: edge.weight });
    adjacency.get(edge.to)!.push({ to: edge.from, weight: edge.weight });
  });

  const frames: DijkstraFrame[] = [];
  const distances = Array(weightedNodes.length).fill(Infinity);
  const parent: Array<number | null> = Array(weightedNodes.length).fill(null);
  const visited = new Set<number>();
  distances[startNode] = 0;

  frames.push({
    message: `Initialize source ${startNode} with distance 0.`,
    current: startNode,
    visited: [],
    distances: [...distances],
    parent: [...parent],
    nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, node.id === startNode ? "active" : "idle"])),
    edgeState: {},
  });

  while (visited.size < weightedNodes.length) {
    let current = -1;
    let best = Infinity;
    for (const node of weightedNodes) {
      if (!visited.has(node.id) && distances[node.id] < best) {
        best = distances[node.id];
        current = node.id;
      }
    }

    if (current === -1) {
      break;
    }

    visited.add(current);
    frames.push({
      message: `Select node ${current} as the next settled vertex with distance ${distances[current]}.`,
      current,
      visited: [...visited],
      distances: [...distances],
      parent: [...parent],
      nodeState: Object.fromEntries(
        weightedNodes.map((node) => [
          node.id,
          node.id === current ? "active" : visited.has(node.id) ? "visited" : distances[node.id] < Infinity ? "queued" : "idle",
        ]),
      ),
      edgeState: Object.fromEntries(
        parent
          .map((from, to) => (from === null ? null : [edgeKey(from, to), "selected"] as const))
          .filter(Boolean) as Array<[string, "selected"]>,
      ),
    });

    for (const neighbor of adjacency.get(current)!) {
      if (visited.has(neighbor.to)) {
        continue;
      }

      const candidate = distances[current] + neighbor.weight;
      if (candidate < distances[neighbor.to]) {
        distances[neighbor.to] = candidate;
        parent[neighbor.to] = current;

        const edgeState: Record<string, "selected" | "relaxed"> = Object.fromEntries(
          parent
            .map((from, to) => (from === null ? null : [edgeKey(from, to), "selected"] as const))
            .filter(Boolean) as Array<[string, "selected"]>,
        );
        edgeState[edgeKey(current, neighbor.to)] = "relaxed";

        frames.push({
          message: `Relax edge ${current} -> ${neighbor.to}. Update distance of ${neighbor.to} to ${candidate}.`,
          current,
          visited: [...visited],
          distances: [...distances],
          parent: [...parent],
          nodeState: Object.fromEntries(
            weightedNodes.map((node) => [
              node.id,
              node.id === current ? "active" : visited.has(node.id) ? "visited" : distances[node.id] < Infinity ? "queued" : "idle",
            ]),
          ),
          edgeState,
        });
      }
    }
  }

  frames.push({
    message: "Dijkstra completed. Every reachable node now has its shortest distance from the source.",
    current: null,
    visited: weightedNodes.map((node) => node.id),
    distances: [...distances],
    parent: [...parent],
    nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, "visited"])),
    edgeState: Object.fromEntries(
      parent
        .map((from, to) => (from === null ? null : [edgeKey(from, to), "selected"] as const))
        .filter(Boolean) as Array<[string, "selected"]>,
    ),
  });

  return frames;
}

export default function Dijkstra() {
  const [startNodeInput, setStartNodeInput] = useState("0");
  const [startNode, setStartNode] = useState(0);
  const frames = useMemo(() => createFrames(startNode), [startNode]);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function dijkstra(graph, start) {
  const dist = Array(graph.length).fill(Infinity);
  const parent = Array(graph.length).fill(null);
  const visited = new Set();
  dist[start] = 0;

  while (visited.size < graph.length) {
    let u = -1;
    for (let v = 0; v < graph.length; v++) {
      if (!visited.has(v) && (u === -1 || dist[v] < dist[u])) {
        u = v;
      }
    }

    if (u === -1 || dist[u] === Infinity) break;
    visited.add(u);

    for (const [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        parent[v] = u;
      }
    }
  }

  return { dist, parent };
}`;

  return (
    <AlgorithmLayout
      title="Dijkstra's Algorithm"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(V^2) or O(E log V)", space: "O(V)" }}
      description="This simulation settles one vertex at a time, relaxes outgoing edges, and highlights the shortest-path tree as distances improve."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="number"
              min="0"
              max="5"
              value={startNodeInput}
              onChange={(event) => setStartNodeInput(event.target.value)}
              className="w-24"
            />
            <Button
              variant="outline"
              onClick={() => {
                const parsed = Number(startNodeInput);
                setStartNode(Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(5, parsed)));
              }}
            >
              Apply source
            </Button>
            <div className="text-sm text-slate-600">
              Step {playback.currentStep + 1} / {playback.totalSteps}
            </div>
          </div>

          <GraphCanvas
            nodes={weightedNodes}
            edges={weightedEdges}
            nodeState={frame.nodeState}
            edgeState={frame.edgeState}
            nodeText={Object.fromEntries(frame.distances.map((distance, index) => [index, distance === Infinity ? "∞" : String(distance)]))}
          />

          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">
            {frame.message}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Settled Nodes</p>
              <p className="mt-2 font-semibold text-slate-900">[{frame.visited.join(", ")}]</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="text-sm text-slate-500">Distances</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm font-semibold text-slate-900">
                {frame.distances.map((distance, index) => (
                  <div key={index}>Node {index}: {distance === Infinity ? "∞" : distance}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
