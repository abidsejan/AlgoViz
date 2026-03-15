import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import BinaryTreeCanvas from "../../components/sim/BinaryTreeCanvas";
import { usePlayback } from "../../components/sim/usePlayback";

interface AvlNode {
  value: number;
  height: number;
  left: AvlNode | null;
  right: AvlNode | null;
}

interface AvlFrame {
  message: string;
  tree: AvlNode | null;
  active: number | null;
}

function height(node: AvlNode | null) {
  return node?.height ?? 0;
}

function clone(node: AvlNode | null): AvlNode | null {
  if (!node) return null;
  return { value: node.value, height: node.height, left: clone(node.left), right: clone(node.right) };
}

function toCanvas(node: AvlNode | null, index = 0, active: number | null = null): Array<{ id: string; value: string; index: number; state: "idle" | "active" | "visited" }> {
  if (!node) return [];
  return [
    { id: `${node.value}-${index}`, value: `${node.value}`, index, state: node.value === active ? "active" : "visited" },
    ...toCanvas(node.left, index * 2 + 1, active),
    ...toCanvas(node.right, index * 2 + 2, active),
  ];
}

function createFrames() {
  const frames: AvlFrame[] = [];
  const values = [30, 20, 10, 25, 27, 5];
  let root: AvlNode | null = null;

  const updateHeight = (node: AvlNode) => {
    node.height = Math.max(height(node.left), height(node.right)) + 1;
  };

  const rotateRight = (y: AvlNode) => {
    const x = y.left!;
    const t2 = x.right;
    x.right = y;
    y.left = t2;
    updateHeight(y);
    updateHeight(x);
    frames.push({ message: `Right rotation at ${y.value}.`, tree: clone(root), active: x.value });
    return x;
  };

  const rotateLeft = (x: AvlNode) => {
    const y = x.right!;
    const t2 = y.left;
    y.left = x;
    x.right = t2;
    updateHeight(x);
    updateHeight(y);
    frames.push({ message: `Left rotation at ${x.value}.`, tree: clone(root), active: y.value });
    return y;
  };

  const insert = (node: AvlNode | null, value: number): AvlNode => {
    if (!node) {
      const created = { value, height: 1, left: null, right: null };
      frames.push({ message: `Insert ${value} as a new AVL node.`, tree: clone(root ?? created), active: value });
      return created;
    }

    if (value < node.value) {
      node.left = insert(node.left, value);
    } else {
      node.right = insert(node.right, value);
    }

    updateHeight(node);
    const balance = height(node.left) - height(node.right);
    frames.push({ message: `Recompute balance at ${node.value}. Balance factor = ${balance}.`, tree: clone(root), active: node.value });

    if (balance > 1 && value < node.left!.value) {
      return rotateRight(node);
    }
    if (balance < -1 && value > node.right!.value) {
      return rotateLeft(node);
    }
    if (balance > 1 && value > node.left!.value) {
      node.left = rotateLeft(node.left!);
      return rotateRight(node);
    }
    if (balance < -1 && value < node.right!.value) {
      node.right = rotateRight(node.right!);
      return rotateLeft(node);
    }

    return node;
  };

  values.forEach((value) => {
    root = insert(root, value);
    frames.push({ message: `AVL tree balanced after inserting ${value}.`, tree: clone(root), active: value });
  });

  return frames;
}

export default function AVL() {
  const frames = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function avlInsert(node, value) {
  node = bstInsert(node, value);
  updateHeight(node);
  const balance = height(node.left) - height(node.right);
  // Apply LL, RR, LR, or RL rotations.
  return rebalance(node, value);
}`;

  return (
    <AlgorithmLayout
      title="AVL Tree"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(log n)", space: "O(n)" }}
      description="AVL maintains BST order but rotates whenever a node becomes unbalanced. This simulation records balance checks and the exact rotations used to restore height balance."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <BinaryTreeCanvas nodes={toCanvas(frame.tree, 0, frame.active)} />
          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 text-sm text-violet-950">{frame.message}</div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
