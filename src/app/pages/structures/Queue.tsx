import { useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function Queue() {
  const [queue, setQueue] = useState<number[]>([8, 13, 21, 34]);
  const [value, setValue] = useState("55");
  const [message, setMessage] = useState("Front and rear are labeled for FIFO order.");
  const [highlight, setHighlight] = useState<"front" | "rear" | null>("front");
  const [speed, setSpeed] = useState(5);

  const code = `class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }
}`;

  const handleEnqueue = () => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      setMessage("Enter a valid number before enqueue.");
      return;
    }

    setQueue((current) => [...current, parsed]);
    setHighlight("rear");
    setMessage(`Enqueued ${parsed} at the rear.`);
    setValue("");
  };

  const handleDequeue = () => {
    if (!queue.length) {
      setMessage("Queue underflow: nothing to dequeue.");
      setHighlight(null);
      return;
    }

    setMessage(`Dequeued ${queue[0]} from the front.`);
    setQueue((current) => current.slice(1));
    setHighlight("front");
  };

  return (
    <AlgorithmLayout
      title="Queue"
      isPlaying={false}
      onPlay={() => setHighlight("front")}
      onPause={() => undefined}
      onReset={() => {
        setQueue([8, 13, 21, 34]);
        setValue("55");
        setHighlight("front");
        setMessage("Queue reset to the default demo values.");
      }}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: "O(1)", space: "O(n)" }}
      description="A queue follows First-In, First-Out order. New values enter at the rear, while removals happen at the front."
      code={code}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-3">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Value to enqueue"
            className="max-w-xs"
          />
          <Button onClick={handleEnqueue}>Enqueue</Button>
          <Button variant="outline" onClick={handleDequeue}>Dequeue</Button>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex min-h-[160px] min-w-max items-center gap-4">
            {queue.map((item, index) => {
              const front = index === 0;
              const rear = index === queue.length - 1;
              const active = (front && highlight === "front") || (rear && highlight === "rear");

              return (
                <div key={`${item}-${index}`} className="space-y-3 text-center">
                  {(front || rear) ? (
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      {front ? "Front" : "Rear"}
                    </div>
                  ) : (
                    <div className="h-4" />
                  )}
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl border text-lg font-semibold transition ${
                      active
                        ? "border-cyan-500 bg-cyan-500 text-slate-950 shadow-lg"
                        : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {item}
                  </div>
                </div>
              );
            })}
            {!queue.length ? (
              <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-8 text-sm text-slate-500">
                Empty queue
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Front value</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{queue.length ? queue[0] : "-"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Rear value</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {queue.length ? queue[queue.length - 1] : "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Status</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{message}</p>
          </div>
        </div>
      </div>
    </AlgorithmLayout>
  );
}
