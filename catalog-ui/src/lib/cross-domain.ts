// catalog-ui/src/lib/cross-domain.ts
// Derives domain-to-domain relationships from element-level edges.
// Used by the Architecture Landscape page to show how domains interconnect.

import type { RegistryGraph } from './types';

export interface CrossDomainEdge {
  sourceDomain: string;
  targetDomain: string;
  weight: number;
  /** Relationship types with their counts, sorted by count desc */
  typeCounts: { type: string; count: number }[];
}

/**
 * Walk all element-level edges and aggregate into domain-to-domain edges.
 * If element A (in domain X) has a relationship to element B (in domain Y),
 * that produces a domain-level edge X → Y with weight = number of such element edges.
 */
export function deriveCrossDomainEdges(graph: RegistryGraph): CrossDomainEdge[] {
  // Build element ID → domain slug lookup
  const elementToDomain = new Map<string, string>();
  Array.from(graph.indexes.byDomain.entries()).forEach(([domainSlug, elements]) => {
    if (domainSlug === 'unknown') return;
    for (const el of elements) {
      elementToDomain.set(el.id, domainSlug);
    }
  });

  // Aggregate cross-domain edges with per-type counts
  const edgeMap = new Map<string, Map<string, number>>();

  for (const edge of graph.edges) {
    const sourceDomain = elementToDomain.get(edge.sourceId);
    const targetDomain = elementToDomain.get(edge.targetId);

    if (!sourceDomain || !targetDomain) continue;
    if (sourceDomain === targetDomain) continue;

    const key = `${sourceDomain}--${targetDomain}`;
    let typeCounts = edgeMap.get(key);
    if (!typeCounts) {
      typeCounts = new Map<string, number>();
      edgeMap.set(key, typeCounts);
    }
    typeCounts.set(edge.relationshipType, (typeCounts.get(edge.relationshipType) || 0) + 1);
  }

  // Convert to array, sorted by total weight descending
  const result: CrossDomainEdge[] = [];
  Array.from(edgeMap.entries()).forEach(([key, typeCounts]) => {
    const [sourceDomain, targetDomain] = key.split('--');
    const counts = Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
    const weight = counts.reduce((sum, c) => sum + c.count, 0);

    result.push({
      sourceDomain,
      targetDomain,
      weight,
      typeCounts: counts,
    });
  });

  return result.sort((a, b) => b.weight - a.weight);
}
