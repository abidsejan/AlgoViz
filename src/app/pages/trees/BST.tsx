import { useMemo } from "react";
import AlgorithmLayout from "../../components/AlgorithmLayout";
import BinaryTreeCanvas from "../../components/sim/BinaryTreeCanvas";
import { usePlayback } from "../../components/sim/usePlayback";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface BstFrame {
  message: string;
  tree: TreeNode | null;
  active: number | null;
  inserted: number[];
}

function cloneTree(node: TreeNode | null): TreeNode | null {
  if (!node) return null;
  return { value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function toCanvasNodes(node: TreeNode | null, index = 0, active: number | null = null): Array<{ id: string; value: number; index: number; state: "idle" | "active" | "visited" }> {
  if (!node) return [];
  const state = node.value === active ? "active" : "visited";
  return [
    { id: `${node.value}-${index}`, value: node.value, index, state },
    ...toCanvasNodes(node.left, index * 2 + 1, active),
    ...toCanvasNodes(node.right, index * 2 + 2, active),
  ];
}

function traverse(node: TreeNode | null, order: "in" | "pre" | "post"): number[] {
  if (!node) return [];
  if (order === "pre") return [node.value, ...traverse(node.left, order), ...traverse(node.right, order)];
  if (order === "post") return [...traverse(node.left, order), ...traverse(node.right, order), node.value];
  return [...traverse(node.left, order), node.value, ...traverse(node.right, order)];
}

function createFrames() {
  const values = [50, 30, 70, 20, 40, 60, 80];
  let root: TreeNode | null = null;
  const inserted: number[] = [];
  const frames: BstFrame[] = [];

  const insert = (value: number) => {
    if (!root) {
      root = { value, left: null, right: null };
      inserted.push(value);
      frames.push({ message: `Insert ${value} as the BST root.`, tree: cloneTree(root), active: value, inserted: [...inserted] });
      return;
    }

    let current = root;
    while (true) {
      frames.push({ message: `Compare ${value} with ${current.value}. ${value < current.value ? "Go left." : "Go right."}`, tree: cloneTree(root), active: current.value, inserted: [...inserted] });
      if (value < current.value) {
        if (!current.left) {
          current.left = { value, left: null, right: null };
          inserted.push(value);
          frames.push({ message: `Place ${value} as the left child of ${current.value}.`, tree: cloneTree(root), active: value, inserted: [...inserted] });
          return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = { value, left: null, right: null };
          inserted.push(value);
          frames.push({ message: `Place ${value} as the right child of ${current.value}.`, tree: cloneTree(root), active: value, inserted: [...inserted] });
          return;
        }
        current = current.right;
      }
    }
  };

  values.forEach(insert);

  return { frames, root };
}

export default function BST() {
  const { frames, root } = useMemo(() => createFrames(), []);
  const playback = usePlayback(frames);
  const frame = playback.currentFrame;

  const code = `function insert(root, value) {
  if (!root) return new Node(value);
  if (value < root.value) root.left = insert(root.left, value);
  else root.right = insert(root.right, value);
  return root;
}`;

  const finalTree = frame?.tree ?? root;

  return (
    <AlgorithmLayout
      title="Binary Search Tree"
      isPlaying={playback.isPlaying}
      onPlay={playback.play}
      onPause={playback.pause}
      onReset={playback.reset}
      onStepForward={playback.stepForward}
      onStepBack={playback.stepBack}
      speed={playback.speed}
      onSpeedChange={playback.setSpeed}
      complexity={{ time: "O(h)", space: "O(n)" }}
      description="This BST module shows insertion decisions step by step and exposes the three standard depth-first traversals on the current tree."
      code={code}
    >
      {frame ? (
        <div className="space-y-6">
          <BinaryTreeCanvas nodes={toCanvasNodes(frame.tree, 0, frame.active)} />
          <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm text-sky-950">{frame.message}</div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Inorder</p>
              <p className="mt-2 font-semibold text-slate-900">{traverse(finalTree, "in").join(" → ")}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Preorder</p>
              <p className="mt-2 font-semibold text-slate-900">{traverse(finalTree, "pre").join(" → ")}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Postorder</p>
              <p className="mt-2 font-semibold text-slate-900">{traverse(finalTree, "post").join(" → ")}</p>
            </div>
          </div>
        </div>
      ) : null}
    </AlgorithmLayout>
  );
}
