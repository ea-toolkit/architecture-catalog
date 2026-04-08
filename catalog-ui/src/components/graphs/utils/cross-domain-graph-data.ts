// catalog-ui/src/components/graphs/utils/cross-domain-graph-data.ts
// Transform domain + cross-domain edge data → ReactFlow nodes/edges
// for the Architecture Landscape view

import type { Node, Edge } from '@xyflow/react';
import type { Domain } from '../../../data/registry';
import type { CrossDomainEdge } from '../../../lib/cross-domain';
import { NODE_STYLES } from './colors';

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

  // Domain nodes — larger than element nodes, using domain style
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

  // Cross-domain edges with weight labels
  for (const edge of crossDomainEdges) {
    const edgeId = `${edge.sourceDomain}--${edge.targetDomain}`;
    const label = edge.weight === 1
      ? '1 relationship'
      : `${edge.weight} relationships`;

    edges.push({
      id: edgeId,
      source: edge.sourceDomain,
      target: edge.targetDomain,
      type: 'relationshipEdge',
      animated: true,
      data: {
        relationship: 'cross-domain',
        label,
      },
    });
  }

  return { nodes, edges };
}
