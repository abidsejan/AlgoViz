export interface GraphNodePosition {
  id: number;
  x: number;
  y: number;
}

export interface WeightedEdge {
  from: number;
  to: number;
  weight: number;
}

export interface PlainEdge {
  from: number;
  to: number;
}

export const traversalNodes: GraphNodePosition[] = [
  { id: 0, x: 120, y: 60 },
  { id: 1, x: 60, y: 160 },
  { id: 2, x: 180, y: 160 },
  { id: 3, x: 20, y: 270 },
  { id: 4, x: 100, y: 270 },
  { id: 5, x: 180, y: 270 },
  { id: 6, x: 260, y: 270 },
].map((node) => ({ ...node, x: node.x * 2, y: node.y }));

export const traversalEdges: PlainEdge[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 2, to: 6 },
];

export const weightedNodes: GraphNodePosition[] = [
  { id: 0, x: 80, y: 170 },
  { id: 1, x: 200, y: 70 },
  { id: 2, x: 200, y: 265 },
  { id: 3, x: 360, y: 120 },
  { id: 4, x: 360, y: 285 },
  { id: 5, x: 540, y: 190 },
];

export const weightedEdges: WeightedEdge[] = [
  { from: 0, to: 1, weight: 4 },
  { from: 0, to: 2, weight: 2 },
  { from: 1, to: 2, weight: 1 },
  { from: 1, to: 3, weight: 5 },
  { from: 2, to: 3, weight: 8 },
  { from: 2, to: 4, weight: 10 },
  { from: 3, to: 4, weight: 2 },
  { from: 3, to: 5, weight: 6 },
  { from: 4, to: 5, weight: 3 },
];

export const dagNodes: GraphNodePosition[] = [
  { id: 0, x: 70, y: 70 },
  { id: 1, x: 220, y: 70 },
  { id: 2, x: 220, y: 190 },
  { id: 3, x: 380, y: 70 },
  { id: 4, x: 380, y: 190 },
  { id: 5, x: 540, y: 130 },
];

export const dagEdges: PlainEdge[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 3 },
  { from: 2, to: 4 },
  { from: 3, to: 5 },
  { from: 4, to: 5 },
];
