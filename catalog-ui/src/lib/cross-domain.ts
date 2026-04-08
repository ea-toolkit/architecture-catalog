// catalog-ui/src/lib/cross-domain.ts
// Derives domain-to-domain relationships from element-level edges.
// Used by the Architecture Landscape page to show how domains interconnect.

import type { RegistryGraph } from './types';

export interface CrossDomainEdge {
  sourceDomain: string;
  targetDomain: string;
  weight: number;
  relationshipTypes: string[];
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

  // Aggregate cross-domain edges
  const edgeMap = new Map<string, { weight: number; types: Set<string> }>();

  for (const edge of graph.edges) {
    const sourceDomain = elementToDomain.get(edge.sourceId);
    const targetDomain = elementToDomain.get(edge.targetId);

    if (!sourceDomain || !targetDomain) continue;
    if (sourceDomain === targetDomain) continue;

    const key = `${sourceDomain}--${targetDomain}`;
    const existing = edgeMap.get(key);
    if (existing) {
      existing.weight++;
      existing.types.add(edge.relationshipType);
    } else {
      edgeMap.set(key, { weight: 1, types: new Set([edge.relationshipType]) });
    }
  }

  // Convert to array, sorted by weight descending
  const result: CrossDomainEdge[] = [];
  Array.from(edgeMap.entries()).forEach(([key, value]) => {
    const [sourceDomain, targetDomain] = key.split('--');
    result.push({
      sourceDomain,
      targetDomain,
      weight: value.weight,
      relationshipTypes: Array.from(value.types),
    });
  });

  return result.sort((a, b) => b.weight - a.weight);
}
