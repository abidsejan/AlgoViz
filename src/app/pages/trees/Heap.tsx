import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import BinaryTreeCanvas from "../../components/sim/BinaryTreeCanvas";
import { usePlayback } from "../../components/sim/usePlayback";

interface HeapFrame {
  message: string;
  heap: number[];
  active: number | null;
}

function createFrames() {
  const values = [18, 7, 25, 3, 12, 30, 1];
  const heap: number[] = [];
  const frames: HeapFrame[] = [];

  const bubbleUp = (index: number) => {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (heap[parent] >= heap[current]) break;
      [heap[parent], heap[current]] = [heap[current], heap[parent]];
      frames.push({ message: `Swap ${heap[current]} with parent ${heap[parent]} to restore the max-heap property.`, heap: [...heap], active: heap[parent] });
      current = parent;
    }
  };

  values.forEach((value) => {
    heap.push(value);
    frames.push({ message: `Insert ${value} at the end of the heap array (priority queue enqueue).`, heap: [...heap], active: value });
    bubbleUp(heap.length - 1);
  });

  const removed = heap[0];
  heap[0] = heap[heap.length - 1];
  heap.pop();
  frames.push({ message: `Priority queue dequeue removes max element ${removed}. Move the last element to the root.`, heap: [...heap], active: heap[0] ?? null });

  let current = 0;
  while (true) {
    const left = current * 2 + 1;
    const right = current * 2 + 2;
    let largest = current;
    if (left < heap.length && heap[left] > heap[largest]) largest = left;
    if (right < heap.length && heap[right] > heap[largest]) largest = right;
    if (largest === current) break;
    [heap[current], heap[largest]] = [heap[largest], heap[current]];
    frames.push({ message: `Sift down after dequeue: swap with child to keep the max at the root.`, heap: [...heap], active: heap[current] });
    current = largest;
  }

  return frames;
}

export default function Heap() {
  const frames = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `class MaxHeap {
  insert(value) { /* push + bubble up */ }
  extractMax() { /* swap root, pop, sift down */ }
  peek() { return this.heap[0]; }
}`;

  return (
    <AlgorithmLayout
      title="Heap and Priority Queue"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(log n)", space: "O(n)" }}
      description="This module treats a max heap as a priority queue. It visualizes enqueue via bubble-up and dequeue via sift-down, while keeping the tree and backing array in sync."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <BinaryTreeCanvas
            nodes={frame.heap.map((value, index) => ({
              id: `${value}-${index}`,
              value,
              index,
              state: value === frame.active ? "active" : "visited",
            }))}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">{frame.message}</div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Heap Array</p>
            <p className="mt-2 font-semibold text-slate-900">[{frame.heap.join(", ")}]</p>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
