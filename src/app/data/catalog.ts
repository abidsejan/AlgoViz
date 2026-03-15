import {
  ArrowUpDown,
  Brain,
  Boxes,
  type LucideIcon,
  Network,
  Search,
  TreePine,
} from "lucide-react";

export interface AlgorithmEntry {
  name: string;
  path: string;
  blurb: string;
  complexity?: string;
}

export interface AlgorithmCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  surface: string;
  algorithms: AlgorithmEntry[];
}

export const algorithmCatalog: AlgorithmCategory[] = [
  {
    id: "searching",
    title: "Searching Algorithms",
    description: "Trace how index windows shrink, jump, and converge toward a target.",
    icon: Search,
    accent: "from-cyan-500 via-sky-500 to-blue-600",
    surface: "bg-cyan-500/10 border-cyan-400/30",
    algorithms: [
      {
        name: "Linear Search",
        path: "/linear-search",
        blurb: "Sequential scan with a highlighted active index.",
        complexity: "O(n)",
      },
      {
        name: "Binary Search",
        path: "/binary-search",
        blurb: "Divide-and-conquer search on sorted data.",
        complexity: "O(log n)",
      },
      {
        name: "Ternary Search",
        path: "/ternary-search",
        blurb: "Three-way interval splitting over a sorted array.",
        complexity: "O(log3 n)",
      },
      {
        name: "Jump Search",
        path: "/jump-search",
        blurb: "Block jumps followed by a local linear scan.",
        complexity: "O(sqrt(n))",
      },
      {
        name: "Split Search",
        path: "/split-search",
        blurb: "Jump-search style split blocks for educational comparison.",
        complexity: "O(sqrt(n))",
      },
      {
        name: "Exponential Search",
        path: "/exponential-search",
        blurb: "Range expansion followed by binary search.",
        complexity: "O(log n)",
      },
    ],
  },
  {
    id: "sorting",
    title: "Sorting Algorithms",
    description: "Compare swaps, partitions, merges, heaps, and counting buckets side by side.",
    icon: ArrowUpDown,
    accent: "from-fuchsia-500 via-pink-500 to-rose-500",
    surface: "bg-fuchsia-500/10 border-fuchsia-400/30",
    algorithms: [
      { name: "Bubble Sort", path: "/bubble-sort", blurb: "Repeated adjacent swaps.", complexity: "O(n^2)" },
      { name: "Selection Sort", path: "/selection-sort", blurb: "Select the next minimum each pass.", complexity: "O(n^2)" },
      { name: "Insertion Sort", path: "/insertion-sort", blurb: "Grow a sorted prefix incrementally.", complexity: "O(n^2)" },
      { name: "Merge Sort", path: "/merge-sort", blurb: "Split, sort, and merge recursively.", complexity: "O(n log n)" },
      { name: "Quick Sort", path: "/quick-sort", blurb: "Partition around a pivot.", complexity: "O(n log n)" },
      { name: "Heap Sort", path: "/heap-sort", blurb: "Build and drain a max heap.", complexity: "O(n log n)" },
      { name: "Counting Sort", path: "/counting-sort", blurb: "Count integer frequencies into buckets.", complexity: "O(n + k)" },
    ],
  },
  {
    id: "graphs",
    title: "Graph Algorithms",
    description: "Follow traversals, shortest paths, and minimum spanning trees on node-edge diagrams.",
    icon: Network,
    accent: "from-emerald-500 via-teal-500 to-cyan-600",
    surface: "bg-emerald-500/10 border-emerald-400/30",
    algorithms: [
      { name: "BFS", path: "/bfs", blurb: "Level-order traversal using a queue.", complexity: "O(V + E)" },
      { name: "DFS", path: "/dfs", blurb: "Depth-first traversal with backtracking.", complexity: "O(V + E)" },
      { name: "Dijkstra", path: "/dijkstra", blurb: "Greedy shortest paths for non-negative weights.", complexity: "O((V + E) log V)" },
      { name: "Bellman Ford", path: "/bellman-ford", blurb: "Relax edges repeatedly, including negatives.", complexity: "O(VE)" },
      { name: "Prims", path: "/prims", blurb: "Grow an MST from the current frontier.", complexity: "O(E log V)" },
      { name: "Kruskals", path: "/kruskals", blurb: "Build an MST with sorted edges and Union-Find.", complexity: "O(E log E)" },
      { name: "Topological Sort", path: "/topological-sort", blurb: "Linearize a DAG by dependency order.", complexity: "O(V + E)" },
    ],
  },
  {
    id: "dp",
    title: "Dynamic Programming",
    description: "Inspect table fills, subproblem reuse, and reconstruction paths step by step.",
    icon: Brain,
    accent: "from-amber-500 via-orange-500 to-red-500",
    surface: "bg-amber-500/10 border-amber-400/30",
    algorithms: [
      { name: "LCS", path: "/lcs", blurb: "Build the common subsequence table interactively.", complexity: "O(mn)" },
      { name: "MCM", path: "/mcm", blurb: "Choose optimal matrix multiplication splits.", complexity: "O(n^3)" },
      { name: "N-Queen", path: "/n-queen", blurb: "Backtracking placements with conflict checks.", complexity: "Backtracking" },
      { name: "Knapsack", path: "/knapsack", blurb: "Maximize value under a capacity constraint.", complexity: "O(nW)" },
      { name: "LIS", path: "/lis", blurb: "Track the longest increasing subsequence state.", complexity: "O(n^2)" },
      { name: "Coin Change", path: "/coin-change", blurb: "Compute minimum coins or count combinations.", complexity: "O(n amount)" },
    ],
  },
  {
    id: "structures",
    title: "Data Structures",
    description: "Simulate linear data structures with direct operations and state traces.",
    icon: Boxes,
    accent: "from-slate-700 via-slate-800 to-black",
    surface: "bg-slate-500/10 border-slate-400/30",
    algorithms: [
      { name: "Stack", path: "/stack", blurb: "Push, pop, and peek with LIFO behavior.", complexity: "O(1)" },
      { name: "Queue", path: "/queue", blurb: "Enqueue and dequeue in FIFO order.", complexity: "O(1)" },
      { name: "Circular Queue", path: "/circular-queue", blurb: "Fixed-size queue with wrapped indices.", complexity: "O(1)" },
      { name: "Linked List", path: "/linked-list", blurb: "Insert, delete, and search node chains.", complexity: "O(n)" },
    ],
  },
  {
    id: "trees",
    title: "Tree Algorithms",
    description: "Explore balanced trees, heaps, priority queues, and classic traversal orders.",
    icon: TreePine,
    accent: "from-green-600 via-emerald-500 to-teal-500",
    surface: "bg-green-500/10 border-green-400/30",
    algorithms: [
      { name: "BST", path: "/bst", blurb: "Binary search tree insertion with traversal outputs.", complexity: "O(h)" },
      { name: "AVL Tree", path: "/avl", blurb: "Self-balancing BST with rotations.", complexity: "O(log n)" },
      { name: "Heap / Priority Queue", path: "/heap-tree", blurb: "Max-heap enqueue and dequeue operations.", complexity: "O(log n)" },
      { name: "Tree Traversals", path: "/tree-traversals", blurb: "Inorder, preorder, and postorder comparisons.", complexity: "O(n)" },
    ],
  },
];

export const algorithmCount = algorithmCatalog.reduce(
  (total, category) => total + category.algorithms.length,
  0,
);
