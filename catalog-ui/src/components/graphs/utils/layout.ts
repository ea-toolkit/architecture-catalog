// catalog-ui/src/components/graphs/utils/layout.ts
// Dagre layout computation for left-to-right hierarchical graphs
// Following EventCatalog's approach using the original dagre package

import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';

export interface LayoutOptions {
  direction?: 'LR' | 'TB' | 'RL' | 'BT';  // Left-to-right, top-to-bottom, etc.
  ranksep?: number;                         // Space between ranks (columns)
  nodesep?: number;                         // Space between nodes in same rank
  nodeWidth?: number;                       // Default node width for layout calc
  nodeHeight?: number;                      // Default node height for layout calc
  marginx?: number;                         // Margin x
  marginy?: number;                         // Margin y
}

const DEFAULTS: Required<LayoutOptions> = {
  direction: 'LR',
  ranksep: 180,
  nodesep: 50,
  nodeWidth: 220,
  nodeHeight: 80,
  marginx: 40,
  marginy: 40,
};

/**
 * Creates a new dagre graph (following EventCatalog pattern)
 */
export function createDagreGraph(options?: LayoutOptions): dagre.graphlib.Graph {
  const opts = { ...DEFAULTS, ...options };
  const graph = new dagre.graphlib.Graph({ compound: true });
  graph.setGraph({
    rankdir: opts.direction,
    ranksep: opts.ranksep,
    nodesep: opts.nodesep,
    marginx: opts.marginx,
    marginy: opts.marginy,
  });
  graph.setDefaultEdgeLabel(() => ({}));
  return graph;
}

/**
 * Calculate node positions from dagre graph
 */
function calculatedNodes(flow: dagre.graphlib.Graph, nodes: Node[], defaultWidth: number, defaultHeight: number): Node[] {
  return nodes.map((node) => {
    const dagreNode = flow.node(node.id);
    const width = node.measured?.width ?? node.width ?? defaultWidth;
    const height = node.measured?.height ?? node.height ?? defaultHeight;
    return {
      ...node,
      position: {
        x: dagreNode.x - width / 2,
        y: dagreNode.y - height / 2,
      },
    };
  });
}

/**
 * Apply dagre layout to nodes and edges.
 * Returns new arrays with updated positions.
 */
export function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  options?: LayoutOptions
): { nodes: Node[]; edges: Edge[] } {
  const opts = { ...DEFAULTS, ...options };
  const flow = createDagreGraph(opts);

  // Add nodes to dagre graph
  nodes.forEach((node) => {
    const width = node.measured?.width ?? node.width ?? opts.nodeWidth;
    const height = node.measured?.height ?? node.height ?? opts.nodeHeight;
    flow.setNode(node.id, { width, height });
  });

  // Add edges to dagre graph
  edges.forEach((edge) => {
    flow.setEdge(edge.source, edge.target);
  });

  // Run layout algorithm
  dagre.layout(flow);

  // Apply computed positions to nodes
  const layoutedNodes = calculatedNodes(flow, nodes, opts.nodeWidth, opts.nodeHeight);

  return { nodes: layoutedNodes, edges };
}

/**
 * Get bounding box of all nodes for viewport fitting.
 */
export function getGraphBounds(nodes: Node[], padding: number = 50): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 800, height: 600 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodes.forEach((node) => {
    const width = node.measured?.width ?? node.width ?? 220;
    const height = node.measured?.height ?? node.height ?? 80;
    
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + width);
    maxY = Math.max(maxY, node.position.y + height);
  });

  return {
    x: minX - padding,
    y: minY - padding,
    width: maxX - minX + padding * 2,
    height: maxY - minY + padding * 2,
  };
}
