// catalog-ui/src/components/graphs/utils/cross-domain-graph-data.ts
// Transform domain + cross-domain integration data → ReactFlow nodes/edges
// for the Architecture Landscape view

import type { Node, Edge } from '@xyflow/react';
import type { Domain } from '../../../data/registry';
import type { CrossDomainEdge } from '../../../lib/cross-domain';
import { NODE_STYLES } from './colors';

/**
 * Build edge label from integration patterns.
 * Shows categories with unique target counts: "API (4) · Events (3)"
 * Uses target count (not edge count) so the number matches the tooltip items.
 */
function buildEdgeLabel(edge: CrossDomainEdge): string {
  return edge.integrations
    .map(i => `${i.category} (${i.targets.length})`)
    .join(' · ');
}

/**
 * Build structured tooltip sections with linkable targets.
 */
function buildTooltipSections(edge: CrossDomainEdge): Array<{ category: string; items: Array<{ id: string; name: string }> }> {
  return edge.integrations.map(i => ({
    category: i.category,
    items: i.targets,
  }));
}

/**
 * Build ReactFlow graph showing domains as nodes and inter-domain
 * integration dependencies as edges.
 */
export function buildCrossDomainGraph(
  domains: Domain[],
  crossDomainEdges: CrossDomainEdge[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

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

  // Edges with integration pattern labels
  for (const edge of crossDomainEdges) {
    const edgeId = `${edge.sourceDomain}--${edge.targetDomain}`;

    // Thicker edges for stronger dependencies
    const strokeWidth = Math.min(1 + Math.floor(edge.totalWeight / 5), 4);

    edges.push({
      id: edgeId,
      source: edge.sourceDomain,
      target: edge.targetDomain,
      type: 'relationshipEdge',
      animated: true,
      style: { strokeWidth },
      data: {
        relationship: 'cross-domain',
        label: buildEdgeLabel(edge),
        tooltipSections: buildTooltipSections(edge),
      },
    });
  }

  return { nodes, edges };
}
