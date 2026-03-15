import { useState } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

const capacity = 6;

export default function CircularQueue() {
  const [items, setItems] = useState<(number | null)[]>([14, 28, 42, null, null, null]);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(2);
  const [size, setSize] = useState(3);
  const [value, setValue] = useState("56");
  const [message, setMessage] = useState("Indices wrap around when the rear reaches the end.");
  const [speed, setSpeed] = useState(5);

  const code = `class CircularQueue {
  constructor(capacity) {
    this.items = Array(capacity).fill(null);
    this.front = 0;
    this.rear = -1;
    this.size = 0;
  }

  enqueue(value) {
    if (this.size === this.items.length) return false;
    this.rear = (this.rear + 1) % this.items.length;
    this.items[this.rear] = value;
    this.size++;
    return true;
  }

  dequeue() {
    if (!this.size) return null;
    const value = this.items[this.front];
    this.items[this.front] = null;
    this.front = (this.front + 1) % this.items.length;
    this.size--;
    return value;
  }
}`;

  const handleEnqueue = () => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      setMessage("Enter a valid number before enqueue.");
      return;
    }

    if (size === capacity) {
      setMessage("Circular queue overflow: all slots are full.");
      return;
    }

    const nextRear = (rear + 1) % capacity;
    const nextItems = [...items];
    nextItems[nextRear] = parsed;
    setItems(nextItems);
    setRear(nextRear);
    if (size === 0) {
      setFront(nextRear);
    }
    setSize((current) => current + 1);
    setMessage(`Enqueued ${parsed} at slot ${nextRear}.`);
    setValue("");
  };

  const handleDequeue = () => {
    if (!size) {
      setMessage("Circular queue underflow: no active element.");
      return;
    }

    const removed = items[front];
    const nextItems = [...items];
    nextItems[front] = null;
    const nextFront = size === 1 ? 0 : (front + 1) % capacity;
    setItems(nextItems);
    setFront(nextFront);
    setSize((current) => current - 1);
    if (size === 1) {
      setRear(0);
    }
    setMessage(`Dequeued ${removed} from slot ${front}.`);
  };

  return (
    <AlgorithmLayout
      title="Circular Queue"
      isPlaying={false}
      onPlay={() => undefined}
      onPause={() => undefined}
      onReset={() => {
        setItems([14, 28, 42, null, null, null]);
        setFront(0);
        setRear(2);
        setSize(3);
        setValue("56");
        setMessage("Circular queue reset to the default demo values.");
      }}
      speed={speed}
      onSpeedChange={setSpeed}
      complexity={{ time: "O(1)", space: "O(n)" }}
      description="A circular queue reuses freed slots by wrapping the front and rear indices around a fixed-size buffer."
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

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => {
            const isFront = size > 0 && index === front;
            const isRear = size > 0 && index === rear;

            return (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
                  <span>Slot {index}</span>
                  <span>{isFront ? "Front" : isRear ? "Rear" : "Idle"}</span>
                </div>
                <div
                  className={`mt-4 flex h-24 items-center justify-center rounded-2xl border text-xl font-semibold ${
                    isFront
                      ? "border-cyan-500 bg-cyan-500 text-slate-950"
                      : isRear
                        ? "border-fuchsia-500 bg-fuchsia-500 text-white"
                        : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  {item ?? "-"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Front index</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{size ? front : "-"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Rear index</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{size ? rear : "-"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Size</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{size}</p>
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
