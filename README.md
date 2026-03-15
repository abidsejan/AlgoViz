# AlgoViz

AlgoViz is an interactive algorithm and data structure visualization platform built with React and Vite. The project is designed to help students, learners, and developers understand how core algorithms work through animated simulations, guided controls, visual state changes, and reference code.

Instead of showing only theory, AlgoViz focuses on step-by-step execution. Users can open a topic, play the simulation, pause it, move forward or backward through important steps, adjust playback speed, and inspect the current state of the algorithm visually.

## Live Preview
Live Preview at - https://algoviz-phi.vercel.app

## Project Overview

This project covers a broad set of computer science fundamentals in one interface:

- Searching algorithms
- Sorting algorithms
- Graph algorithms
- Dynamic programming problems
- Linear data structures
- Tree-based data structures and operations

The home page acts as a visual catalog where users can search topics, browse by category, and quickly jump into any module. Each algorithm page is structured as a learning workspace with controls, complexity labels, explanation text, and visual output.

## Main Features

- Interactive visualizations for algorithms and data structures
- Play, pause, reset, step forward, and step back controls on many modules
- Adjustable playback speed for simulations
- Searchable landing page with category-based navigation
- Time and space complexity badges for each topic
- Built-in reference code panels for quick study
- Color-coded states to highlight comparisons, visited nodes, active pointers, selected edges, balanced trees, and more
- Input controls on many pages so users can test custom values
- Dedicated visual components for graph and tree rendering
- Responsive interface built for modern browsers

## What This Project Covers

AlgoViz currently includes 34 visual modules across 6 major categories.

### 1. Searching Algorithms

- Linear Search
- Binary Search
- Ternary Search
- Jump Search
- Split Search
- Exponential Search

Users can observe how search boundaries move, how comparisons are made, and how the target is located or rejected.

### 2. Sorting Algorithms

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort
- Heap Sort
- Counting Sort

These modules help explain swaps, partitions, merges, heap construction, and counting buckets through animated steps.

### 3. Graph Algorithms

- Breadth-First Search (BFS)
- Depth-First Search (DFS)
- Dijkstra's Algorithm
- Bellman-Ford Algorithm
- Prim's Algorithm
- Kruskal's Algorithm
- Topological Sort

Graph modules visualize traversals, shortest paths, minimum spanning trees, relaxed edges, visited nodes, and dependency ordering.

### 4. Dynamic Programming and Backtracking

- Longest Common Subsequence (LCS)
- Matrix Chain Multiplication (MCM)
- N-Queen
- 0/1 Knapsack
- Longest Increasing Subsequence (LIS)
- Coin Change

These pages focus on table building, subproblem reuse, decision-making, and state transitions in optimization problems.

### 5. Data Structures

- Stack
- Queue
- Circular Queue
- Linked List

Users can perform operations such as push, pop, peek, enqueue, dequeue, insertion, deletion, and traversal while seeing the structure update live.

### 6. Tree Algorithms and Structures

- Binary Search Tree (BST)
- AVL Tree
- Heap / Priority Queue
- Tree Traversals

These visualizers show insertions, rebalancing rotations, heap behavior, and traversal orders in a clearer graphical format.

## Learning Experience

Each module is built to support algorithm understanding, not just animation. Depending on the topic, pages may include:

- A short explanation of how the algorithm works
- Time and space complexity information
- Interactive controls
- Custom input support
- Status messages for the current step
- Visual legends and highlighted states
- Reference implementation code

This makes the project useful for:

- Academic demonstrations
- Personal learning and practice
- Portfolio presentation
- Classroom or tutoring support
- Quick revision before exams or interviews

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI components
- Lucide React icons
- Recharts and supporting UI libraries

## Project Structure

```text
src/
  app/
    components/     # shared UI, layout, graph, tree, and simulation components
    data/           # algorithm catalog and graph sample data
    pages/          # algorithm and data structure visualizer pages
    routes.tsx      # application routes
```

## Running the Project

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Why This Project Matters

AlgoViz turns complex algorithm topics into something easier to see, control, and understand. It combines theory, interaction, and visual feedback in a single educational interface, making it a strong project for both learning and showcasing frontend engineering around computer science concepts.

## Author

Created by Abid Hasan.
