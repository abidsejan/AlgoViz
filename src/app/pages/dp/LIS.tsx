import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import { usePlayback } from "../../components/sim/usePlayback";

interface LisFrame {
  message: string;
  array: number[];
  dp: number[];
  parent: number[];
  active: [number, number] | null;
}

function createFrames() {
  const array = [10, 9, 2, 5, 3, 7, 101, 18];
  const dp = Array(array.length).fill(1);
  const parent = Array(array.length).fill(-1);
  const frames: LisFrame[] = [
    {
      message: "Initialize every LIS length to 1 because each value is a subsequence by itself.",
      array,
      dp: [...dp],
      parent: [...parent],
      active: null,
    },
  ];

  for (let i = 1; i < array.length; i++) {
    for (let j = 0; j < i; j++) {
      if (array[j] < array[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;
        frames.push({
          message: `${array[j]} < ${array[i]}, so extend the subsequence ending at index ${j}. LIS[${i}] becomes ${dp[i]}.`,
          array,
          dp: [...dp],
          parent: [...parent],
          active: [j, i],
        });
      } else {
        frames.push({
          message: `Compare index ${j} with ${i}; no better increasing subsequence is formed.`,
          array,
          dp: [...dp],
          parent: [...parent],
          active: [j, i],
        });
      }
    }
  }

  return { frames, array };
}

export default function LIS() {
  const { frames, array } = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;
  const best = frame ? Math.max(...frame.dp) : 0;

  const code = `function lis(arr) {
  const dp = Array(arr.length).fill(1);

  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      if (arr[j] < arr[i]) {
        dp[i] = Math.max(dp[i], dp[j] + 1);
      }
    }
  }

  return Math.max(...dp);
}`;

  return (
    <AlgorithmLayout
      title="LIS - Longest Increasing Subsequence"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(n^2)", space: "O(n)" }}
      description="The DP state LIS[i] stores the best increasing subsequence length ending exactly at index i. Each step compares a candidate predecessor j with i."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="grid gap-3 md:grid-cols-4">
            {array.map((value, index) => {
              const isActive = frame.active?.includes(index);
              return (
                <div
                  key={index}
                  className={`rounded-2xl border p-4 ${isActive ? "border-amber-400 bg-amber-100" : "border-slate-200 bg-slate-50"}`}
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Index {index}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                  <p className="mt-2 text-sm text-slate-600">LIS = {frame.dp[index]}</p>
                  <p className="text-sm text-slate-600">Prev = {frame.parent[index]}</p>
                </div>
              );
            })}
          </div>
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
            {frame.message}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Best LIS Length So Far</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{best}</p>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
