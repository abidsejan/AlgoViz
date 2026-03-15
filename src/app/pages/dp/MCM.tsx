import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import DPTable from "../../components/sim/DPTable";
import { usePlayback } from "../../components/sim/usePlayback";

interface McmFrame {
  message: string;
  table: Array<Array<string | number>>;
  active: [number, number];
  completed: Set<string>;
}

function createFrames() {
  const dims = [10, 20, 30, 40, 30];
  const n = dims.length - 1;
  const dp = Array.from({ length: n }, () => Array(n).fill(0));
  const split = Array.from({ length: n }, () => Array(n).fill(-1));
  const completed = new Set<string>();
  const frames: McmFrame[] = [];

  for (let length = 2; length <= n; length++) {
    for (let i = 0; i <= n - length; i++) {
      const j = i + length - 1;
      dp[i][j] = Infinity;
      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < dp[i][j]) {
          dp[i][j] = cost;
          split[i][j] = k;
        }
        frames.push({
          message: `Evaluate split k=${k + 1} for chain A${i + 1}..A${j + 1}; cost=${cost}.`,
          table: dp.map((row, rowIndex) => row.map((value, colIndex) => (colIndex < rowIndex ? "-" : value === Infinity ? "∞" : value))),
          active: [i, j],
          completed: new Set(completed),
        });
      }
      completed.add(`${i}-${j}`);
      frames.push({
        message: `Commit dp[${i + 1}, ${j + 1}] = ${dp[i][j]} using split k=${split[i][j] + 1}.`,
        table: dp.map((row, rowIndex) => row.map((value, colIndex) => (colIndex < rowIndex ? "-" : value === Infinity ? "∞" : value))),
        active: [i, j],
        completed: new Set(completed),
      });
    }
  }

  frames.unshift({
    message: "Base case: single matrices have multiplication cost 0 on the diagonal.",
    table: dp.map((row, rowIndex) => row.map((value, colIndex) => (colIndex < rowIndex ? "-" : value))),
    active: [0, 0],
    completed: new Set(),
  });

  return { frames, dims };
}

export default function MCM() {
  const { frames, dims } = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function matrixChainMultiplication(dims) {
  const n = dims.length - 1;
  const dp = Array(n).fill(0).map(() => Array(n).fill(0));

  for (let len = 2; len <= n; len++) {
    for (let i = 0; i <= n - len; i++) {
      const j = i + len - 1;
      dp[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[0][n - 1];
}`;

  return (
    <AlgorithmLayout
      title="MCM - Matrix Chain Multiplication"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(n^3)", space: "O(n^2)" }}
      description="MCM fills the cost table by chain length. Each frame shows the subchain being optimized and the split position being tested."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="text-sm text-slate-600">Dimensions: [{dims.join(", ")}]</div>
          <DPTable
            data={frame.table}
            active={frame.active}
            completed={frame.completed}
            rowLabels={["A1", "A2", "A3", "A4"]}
            colLabels={["A1", "A2", "A3", "A4"]}
          />
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950">
            {frame.message}
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
