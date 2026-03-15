import { useMemo, useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import GraphCanvas from "../../components/sim/GraphCanvas";
import { usePlayback } from "../../components/sim/usePlayback";
import { weightedEdges, weightedNodes } from "../../data/graphSamples";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface BellmanFordFrame {
  message: string;
  pass: number;
  edgeIndex: number;
  currentEdge: [number, number] | null;
  distances: number[];
  nodeState: Record<number, "idle" | "active" | "visited" | "queued">;
  edgeState: Record<string, "idle" | "relaxed" | "active" | "rejected">;
}

function edgeKey(a: number, b: number) {
  return [a, b].sort((x, y) => x - y).join("-");
}

function createFrames(startNode: number): BellmanFordFrame[] {
  const directedEdges = [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 2, weight: 2 },
    { from: 2, to: 1, weight: 1 },
    { from: 1, to: 3, weight: 5 },
    { from: 2, to: 4, weight: 10 },
    { from: 4, to: 3, weight: -2 },
    { from: 3, to: 5, weight: 3 },
    { from: 4, to: 5, weight: 1 },
  ];

  const distances = Array(weightedNodes.length).fill(Infinity);
  distances[startNode] = 0;
  const frames: BellmanFordFrame[] = [
    {
      message: `Initialize Bellman-Ford with source ${startNode}.`,
      pass: 0,
      edgeIndex: -1,
      currentEdge: null,
      distances: [...distances],
      nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, node.id === startNode ? "active" : "idle"])),
      edgeState: {},
    },
  ];

  for (let pass = 1; pass <= weightedNodes.length - 1; pass++) {
    let updated = false;
    directedEdges.forEach((edge, edgeIndex) => {
      const edgeState: Record<string, "active" | "relaxed" | "rejected"> = {};
      edgeState[edgeKey(edge.from, edge.to)] = "active";

      if (distances[edge.from] !== Infinity && distances[edge.from] + edge.weight < distances[edge.to]) {
        distances[edge.to] = distances[edge.from] + edge.weight;
        edgeState[edgeKey(edge.from, edge.to)] = "relaxed";
        updated = true;
        frames.push({
          message: `Pass ${pass}: relax edge ${edge.from} -> ${edge.to}, updating node ${edge.to} to ${distances[edge.to]}.`,
          pass,
          edgeIndex,
          currentEdge: [edge.from, edge.to],
          distances: [...distances],
          nodeState: Object.fromEntries(
            weightedNodes.map((node) => [
              node.id,
              node.id === edge.to ? "active" : distances[node.id] < Infinity ? "queued" : "idle",
            ]),
          ),
          edgeState,
        });
      } else {
        edgeState[edgeKey(edge.from, edge.to)] = "rejected";
        frames.push({
          message: `Pass ${pass}: edge ${edge.from} -> ${edge.to} does not improve the distance.`,
          pass,
          edgeIndex,
          currentEdge: [edge.from, edge.to],
          distances: [...distances],
          nodeState: Object.fromEntries(
            weightedNodes.map((node) => [node.id, node.id === edge.to ? "active" : distances[node.id] < Infinity ? "queued" : "idle"]),
          ),
          edgeState,
        });
      }
    });

    if (!updated) {
      break;
    }
  }

  frames.push({
    message: "Bellman-Ford complete. Distances are stable after repeated relaxations.",
    pass: weightedNodes.length - 1,
    edgeIndex: -1,
    currentEdge: null,
    distances: [...distances],
    nodeState: Object.fromEntries(weightedNodes.map((node) => [node.id, distances[node.id] < Infinity ? "visited" : "idle"])),
    edgeState: {},
  });

  return frames;
}

export default function BellmanFord() {
  const [startNodeInput, setStartNodeInput] = useState("0");
  const [startNode, setStartNode] = useState(0);
  const frames = useMemo(() => createFrames(startNode), [startNode]);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function bellmanFord(edges, vertexCount, start) {
  const dist = Array(vertexCount).fill(Infinity);
  dist[start] = 0;

  for (let i = 1; i < vertexCount; i++) {
    let updated = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        updated = true;
      }
    }
    if (!updated) break;
  }

  return dist;
}`;

  return (
    <AlgorithmLayout
      title="Bellman-Ford Algorithm"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(VE)", space: "O(V)" }}
      description="Bellman-Ford relaxes every edge up to V-1 times. Each frame shows the active edge and whether that edge actually improved a shortest-path estimate."
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
            edges={weightedEdges.map((edge) => ({ ...edge, directed: false }))}
            edgeState={frame.edgeState}
            nodeState={frame.nodeState}
            nodeText={Object.fromEntries(frame.distances.map((distance, index) => [index, distance === Infinity ? "∞" : String(distance)]))}
          />

          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950">
            {frame.message}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Current Pass</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{frame.pass}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
