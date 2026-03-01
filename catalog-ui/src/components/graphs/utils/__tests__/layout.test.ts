/**
 * Tests for catalog-ui/src/components/graphs/utils/layout.ts
 */

import { describe, it, expect } from 'vitest';
import { createDagreGraph, applyDagreLayout, getGraphBounds } from '../layout';
import type { Node, Edge } from '@xyflow/react';

function makeNode(id: string, x = 0, y = 0, width = 160, height = 80): Node {
  return {
    id,
    position: { x, y },
    data: {},
    width,
    height,
  };
}

function makeEdge(source: string, target: string): Edge {
  return { id: `${source}-${target}`, source, target };
}

describe('createDagreGraph', () => {
  it('creates a graph with default options', () => {
    const g = createDagreGraph();
    const graphConfig = g.graph();
    expect(graphConfig.rankdir).toBe('LR');
    expect(graphConfig.ranksep).toBe(180);
    expect(graphConfig.nodesep).toBe(50);
  });

  it('applies custom direction option', () => {
    const g = createDagreGraph({ direction: 'TB' });
    expect(g.graph().rankdir).toBe('TB');
  });

  it('merges partial options with defaults', () => {
    const g = createDagreGraph({ ranksep: 300 });
    const cfg = g.graph();
    expect(cfg.ranksep).toBe(300);
    expect(cfg.nodesep).toBe(50); // default preserved
  });
});

describe('applyDagreLayout', () => {
  it('returns empty arrays for empty input', () => {
    const result = applyDagreLayout([], []);
    expect(result.nodes).toEqual([]);
    expect(result.edges).toEqual([]);
  });

  it('assigns positions to all nodes', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge('a', 'b')];
    const result = applyDagreLayout(nodes, edges);

    expect(result.nodes).toHaveLength(2);
    for (const n of result.nodes) {
      expect(n.position.x).toBeDefined();
      expect(n.position.y).toBeDefined();
    }
  });

  it('respects custom options', () => {
    const nodes = [makeNode('a'), makeNode('b')];
    const edges = [makeEdge('a', 'b')];
    const resultLR = applyDagreLayout(nodes, edges, { direction: 'LR' });
    const resultTB = applyDagreLayout(nodes, edges, { direction: 'TB' });

    // Different directions should produce different layouts
    const lrDiffX = Math.abs(resultLR.nodes[0].position.x - resultLR.nodes[1].position.x);
    const tbDiffY = Math.abs(resultTB.nodes[0].position.y - resultTB.nodes[1].position.y);
    // LR should have more horizontal spread, TB more vertical
    expect(lrDiffX).toBeGreaterThan(0);
    expect(tbDiffY).toBeGreaterThan(0);
  });
});

describe('getGraphBounds', () => {
  it('returns default bounds for empty nodes', () => {
    const bounds = getGraphBounds([]);
    expect(bounds).toEqual({ x: 0, y: 0, width: 800, height: 600 });
  });

  it('computes bounds around single node with default padding', () => {
    const nodes = [makeNode('a', 100, 200, 160, 80)];
    const bounds = getGraphBounds(nodes);
    expect(bounds.x).toBe(50);      // 100 - 50 padding
    expect(bounds.y).toBe(150);     // 200 - 50 padding
    expect(bounds.width).toBe(260); // 160 + 100 padding
    expect(bounds.height).toBe(180);// 80 + 100 padding
  });

  it('computes bounds with custom padding', () => {
    const nodes = [makeNode('a', 0, 0, 100, 50)];
    const bounds = getGraphBounds(nodes, 20);
    expect(bounds.x).toBe(-20);
    expect(bounds.y).toBe(-20);
    expect(bounds.width).toBe(140);  // 100 + 40 padding
    expect(bounds.height).toBe(90);  // 50 + 40 padding
  });

  it('handles negative coordinates', () => {
    const nodes = [makeNode('a', -100, -50, 160, 80)];
    const bounds = getGraphBounds(nodes);
    expect(bounds.x).toBe(-150);
    expect(bounds.y).toBe(-100);
  });

  it('spans multiple nodes', () => {
    const nodes = [
      makeNode('a', 0, 0, 100, 50),
      makeNode('b', 300, 200, 100, 50),
    ];
    const bounds = getGraphBounds(nodes);
    expect(bounds.x).toBe(-50);
    expect(bounds.y).toBe(-50);
    expect(bounds.width).toBe(500);   // (300 + 100) - 0 + 100 padding
    expect(bounds.height).toBe(350);  // (200 + 50) - 0 + 100 padding
  });
});
