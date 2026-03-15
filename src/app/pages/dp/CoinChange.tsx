import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import { usePlayback } from "../../components/sim/usePlayback";

interface CoinFrame {
  message: string;
  coin: number;
  amount: number;
  dp: number[];
}

function createFrames() {
  const coins = [1, 2, 5];
  const amount = 11;
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  const frames: CoinFrame[] = [
    {
      message: "Initialize dp[0] = 0 and all other amounts to Infinity.",
      coin: 0,
      amount: 0,
      dp: [...dp],
    },
  ];

  for (const coin of coins) {
    for (let currentAmount = coin; currentAmount <= amount; currentAmount++) {
      const candidate = dp[currentAmount - coin] + 1;
      if (candidate < dp[currentAmount]) {
        dp[currentAmount] = candidate;
        frames.push({
          message: `Use coin ${coin}: update dp[${currentAmount}] to ${candidate}.`,
          coin,
          amount: currentAmount,
          dp: [...dp],
        });
      } else {
        frames.push({
          message: `Coin ${coin} does not improve dp[${currentAmount}].`,
          coin,
          amount: currentAmount,
          dp: [...dp],
        });
      }
    }
  }

  return { frames, coins, amount };
}

export default function CoinChange() {
  const { frames, coins, amount } = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (const coin of coins) {
    for (let value = coin; value <= amount; value++) {
      dp[value] = Math.min(dp[value], dp[value - coin] + 1);
    }
  }

  return dp[amount];
}`;

  return (
    <AlgorithmLayout
      title="Coin Change Problem"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(n × amount)", space: "O(amount)" }}
      description="This simulation shows the minimum-coins DP. For each coin, the 1D array is updated left to right so reuse of the same coin is visible."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <div className="text-sm text-slate-600">Coins: [{coins.join(", ")}], target amount: {amount}</div>
          <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-6">
            {frame.dp.map((value, index) => (
              <div
                key={index}
                className={`rounded-2xl border p-4 ${index === frame.amount ? "border-amber-400 bg-amber-100" : "border-slate-200 bg-slate-50"}`}
              >
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Amt {index}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{value === Infinity ? "∞" : value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-fuchsia-200 bg-fuchsia-50 p-4 text-sm text-fuchsia-950">
            {frame.message}
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
