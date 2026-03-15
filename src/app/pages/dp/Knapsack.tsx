import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import DPTable from "../../components/sim/DPTable";
import { usePlayback } from "../../components/sim/usePlayback";

interface KnapsackFrame {
  message: string;
  table: number[][];
  active: [number, number];
  completed: Set<string>;
}

function createFrames() {
  const weights = [2, 3, 4, 5];
  const values = [3, 4, 5, 8];
  const capacity = 8;
  const table = Array.from({ length: weights.length + 1 }, () => Array(capacity + 1).fill(0));
  const completed = new Set<string>();
  const frames: KnapsackFrame[] = [
    {
      message: "Initialize row 0 and column 0 to 0 because no items or no capacity yields value 0.",
      table: table.map((row) => [...row]),
      active: [0, 0],
      completed: new Set(completed),
    },
  ];

  for (let i = 1; i <= weights.length; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        table[i][w] = Math.max(table[i - 1][w], values[i - 1] + table[i - 1][w - weights[i - 1]]);
        frames.push({
          message: `Cell [${i}, ${w}]: choose max(exclude=${table[i - 1][w]}, include=${values[i - 1] + table[i - 1][w - weights[i - 1]]}).`,
          table: table.map((row) => [...row]),
          active: [i, w],
          completed: new Set([...completed, `${i}-${w}`]),
        });
      } else {
        table[i][w] = table[i - 1][w];
        frames.push({
          message: `Cell [${i}, ${w}]: item ${i} is too heavy, so copy ${table[i - 1][w]} from the row above.`,
          table: table.map((row) => [...row]),
          active: [i, w],
          completed: new Set([...completed, `${i}-${w}`]),
        });
      }
      completed.add(`${i}-${w}`);
    }
  }

  frames.push({
    message: `Knapsack complete. Optimal value at capacity ${capacity} is ${table[weights.length][capacity]}.`,
    table: table.map((row) => [...row]),
    active: [weights.length, capacity],
    completed: new Set(completed),
  });

  return { frames, weights, values, capacity };
}

export default function Knapsack() {
  const { frames, weights, values, capacity } = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function knapsack(weights, values, capacity) {
  const dp = Array(weights.length + 1).fill(0)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= weights.length; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[weights.length][capacity];
}`;

  return (
    <AlgorithmLayout
      title="0/1 Knapsack Problem"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(n × W)", space: "O(n × W)" }}
      description="The table fills item by item and capacity by capacity. Each frame shows whether the recurrence includes the current item or excludes it."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="text-sm text-slate-600">
            Items: weights [{weights.join(", ")}], values [{values.join(", ")}], capacity {capacity}
          </div>
          <DPTable
            data={frame.table}
            active={frame.active}
            completed={frame.completed}
            rowLabels={["0", ...weights.map((weight, index) => `i${index + 1} (${weight},${values[index]})`)]}
            colLabels={Array.from({ length: capacity + 1 }, (_, index) => index.toString())}
          />
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950">
            {frame.message}
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
