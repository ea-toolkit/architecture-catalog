// catalog-ui/src/components/graphs/utils/cross-domain-graph-data.ts
// Transform domain + cross-domain edge data → ReactFlow nodes/edges
// for the Architecture Landscape view

import type { Node, Edge } from '@xyflow/react';
import type { Domain } from '../../../data/registry';
import type { CrossDomainEdge } from '../../../lib/cross-domain';
import { NODE_STYLES } from './colors';

/**
 * Build a readable label for the edge showing top relationship types.
 * e.g., "serves (5), accesses (3)" or "14 relationships" for many types
 */
function buildEdgeLabel(edge: CrossDomainEdge): string {
  const counts = edge.typeCounts;
  if (counts.length <= 2) {
    // Show all types with counts
    return counts
      .map(c => `${c.type.replace(/-/g, ' ')} (${c.count})`)
      .join(', ');
  }
  // Show top 2 types + remaining count
  const top = counts.slice(0, 2);
  const rest = edge.weight - top.reduce((s, c) => s + c.count, 0);
  const label = top.map(c => `${c.type.replace(/-/g, ' ')} (${c.count})`).join(', ');
  return rest > 0 ? `${label} +${rest} more` : label;
}

/**
 * Build a tooltip showing the full breakdown of relationship types.
 * e.g., "serves: 5\naccesses: 3\ncomposition: 2"
 */
function buildEdgeTooltip(edge: CrossDomainEdge): string {
  const lines = edge.typeCounts.map(c =>
    `${c.type.replace(/-/g, ' ')}: ${c.count}`
  );
  lines.push(`─────────`);
  lines.push(`Total: ${edge.weight} relationships`);
  return lines.join('\n');
}

/**
 * Build ReactFlow graph showing domains as nodes and inter-domain
 * relationships as weighted edges.
 */
export function buildCrossDomainGraph(
  domains: Domain[],
  crossDomainEdges: CrossDomainEdge[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Domain nodes — using domain style with per-domain color
  const domainStyle = NODE_STYLES['domain'] ?? {
    bg: '#eff6ff', border: '#3b82f6', text: '#1e40af',
    borderStyle: 'solid', borderRadius: '12px', icon: 'D',
  };

  for (const domain of domains) {
    nodes.push({
      id: domain.id,
      type: 'baseNode',
      position: { x: 0, y: 0 },
      data: {
        label: domain.name,
        type: 'domain',
        elementType: `${domain.totalElements} elements`,
        catalogUrl: `/domains/${domain.id}/context-map`,
        color: domain.color,
        style: { ...domainStyle, border: domain.color },
      },
    });
  }

  // Cross-domain edges with descriptive labels and tooltips
  for (const edge of crossDomainEdges) {
    const edgeId = `${edge.sourceDomain}--${edge.targetDomain}`;

    edges.push({
      id: edgeId,
      source: edge.sourceDomain,
      target: edge.targetDomain,
      type: 'relationshipEdge',
      animated: true,
      data: {
        relationship: 'cross-domain',
        label: buildEdgeLabel(edge),
        tooltip: buildEdgeTooltip(edge),
      },
    });
  }

  return { nodes, edges };
}
