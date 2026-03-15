import { createBrowserRouter } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import LinearSearch from "./pages/searching/LinearSearch";
import BinarySearch from "./pages/searching/BinarySearch";
import TernarySearch from "./pages/searching/TernarySearch";
import JumpSearch from "./pages/searching/JumpSearch";
import SplitSearch from "./pages/searching/SplitSearch";
import ExponentialSearch from "./pages/searching/ExponentialSearch";
import BubbleSort from "./pages/sorting/BubbleSort";
import SelectionSort from "./pages/sorting/SelectionSort";
import InsertionSort from "./pages/sorting/InsertionSort";
import MergeSort from "./pages/sorting/MergeSort";
import QuickSort from "./pages/sorting/QuickSort";
import HeapSort from "./pages/sorting/HeapSort";
import CountingSort from "./pages/sorting/CountingSort";
import BFS from "./pages/graph/BFS";
import DFS from "./pages/graph/DFS";
import Dijkstra from "./pages/graph/Dijkstra";
import BellmanFord from "./pages/graph/BellmanFord";
import Prims from "./pages/graph/Prims";
import Kruskals from "./pages/graph/Kruskals";
import TopologicalSort from "./pages/graph/TopologicalSort";
import LCS from "./pages/dp/LCS";
import MCM from "./pages/dp/MCM";
import NQueen from "./pages/dp/NQueen";
import Knapsack from "./pages/dp/Knapsack";
import LIS from "./pages/dp/LIS";
import CoinChange from "./pages/dp/CoinChange";
import Stack from "./pages/structures/Stack";
import Queue from "./pages/structures/Queue";
import CircularQueue from "./pages/structures/CircularQueue";
import LinkedList from "./pages/structures/LinkedList";
import BST from "./pages/trees/BST";
import AVL from "./pages/trees/AVL";
import HeapTree from "./pages/trees/Heap";
import TreeTraversals from "./pages/trees/TreeTraversals";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/linear-search",
        Component: LinearSearch,
      },
      {
        path: "/binary-search",
        Component: BinarySearch,
      },
      {
        path: "/ternary-search",
        Component: TernarySearch,
      },
      {
        path: "/jump-search",
        Component: JumpSearch,
      },
      {
        path: "/split-search",
        Component: SplitSearch,
      },
      {
        path: "/exponential-search",
        Component: ExponentialSearch,
      },
      {
        path: "/bubble-sort",
        Component: BubbleSort,
      },
      {
        path: "/selection-sort",
        Component: SelectionSort,
      },
      {
        path: "/insertion-sort",
        Component: InsertionSort,
      },
      {
        path: "/merge-sort",
        Component: MergeSort,
      },
      {
        path: "/quick-sort",
        Component: QuickSort,
      },
      {
        path: "/heap-sort",
        Component: HeapSort,
      },
      {
        path: "/counting-sort",
        Component: CountingSort,
      },
      {
        path: "/bfs",
        Component: BFS,
      },
      {
        path: "/dfs",
        Component: DFS,
      },
      {
        path: "/dijkstra",
        Component: Dijkstra,
      },
      {
        path: "/bellman-ford",
        Component: BellmanFord,
      },
      {
        path: "/prims",
        Component: Prims,
      },
      {
        path: "/kruskals",
        Component: Kruskals,
      },
      {
        path: "/topological-sort",
        Component: TopologicalSort,
      },
      {
        path: "/lcs",
        Component: LCS,
      },
      {
        path: "/mcm",
        Component: MCM,
      },
      {
        path: "/n-queen",
        Component: NQueen,
      },
      {
        path: "/knapsack",
        Component: Knapsack,
      },
      {
        path: "/lis",
        Component: LIS,
      },
      {
        path: "/coin-change",
        Component: CoinChange,
      },
      {
        path: "/stack",
        Component: Stack,
      },
      {
        path: "/queue",
        Component: Queue,
      },
      {
        path: "/circular-queue",
        Component: CircularQueue,
      },
      {
        path: "/linked-list",
        Component: LinkedList,
      },
      {
        path: "/bst",
        Component: BST,
      },
      {
        path: "/avl",
        Component: AVL,
      },
      {
        path: "/heap-tree",
        Component: HeapTree,
      },
      {
        path: "/tree-traversals",
        Component: TreeTraversals,
      },
    ],
  },
]);
