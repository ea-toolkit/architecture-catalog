// catalog-ui/src/lib/cross-domain.ts
// Derives domain-to-domain integration dependencies from element-level edges.
// Used by the Architecture Landscape page to show how domains interconnect.
//
// This is a MAP view (tier 2) — intentionally type-aware.
// At the cross-domain level, architects care about integration patterns:
//   - API dependencies (who calls whose APIs)
//   - Event coupling (who consumes whose events)
//   - Data dependencies (who accesses whose data)
//   - Shared infrastructure (who shares tech components)
//
// Structural relationships (composition, aggregation) are filtered out
// because they describe internal hierarchy, not cross-domain integration.

import type { RegistryGraph } from './types';

/** A meaningful integration dependency between two domains */
export interface CrossDomainEdge {
  sourceDomain: string;
  targetDomain: string;
  /** Integration patterns found between these domains */
  integrations: IntegrationPattern[];
  /** Total element-level edges contributing to this domain link */
  totalWeight: number;
}

export interface IntegrationPattern {
  /** Human-readable category: "API", "Events", "Data", "Service" */
  category: string;
  /** Number of element-level edges in this category */
  count: number;
}

// ── Integration classification ──────────────────────────────
// Maps element types involved in cross-domain edges to meaningful categories.
// Structural relationships (composition, aggregation) are excluded
// because they don't represent cross-domain integration.

const STRUCTURAL_RELATIONSHIP_TYPES = new Set([
  'composition', 'aggregation',
]);

// Classify by the TARGET element type — "what is being depended on?"
const TARGET_TYPE_TO_CATEGORY: Record<string, { category: string }> = {
  api_contract:       { category: 'API' },
  api_endpoint:       { category: 'API' },
  domain_event:       { category: 'Events' },
  data_concept:       { category: 'Data' },
  data_aggregate:     { category: 'Data' },
  data_entity:        { category: 'Data' },
  software_system:    { category: 'Service' },
  software_subsystem: { category: 'Service' },
  component:          { category: 'Service' },
  infra_node:         { category: 'Infrastructure' },
  cloud_service:      { category: 'Infrastructure' },
};

const DEFAULT_CATEGORY = { category: 'Dependency' };

/**
 * Derive meaningful cross-domain integration dependencies.
 * Filters out internal structural relationships and categorizes
 * the remaining edges by integration pattern.
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

  // Aggregate cross-domain edges by domain pair + category
  const edgeMap = new Map<string, Map<string, { category: string; count: number }>>();

  for (const edge of graph.edges) {
    // Skip structural relationships — not meaningful at cross-domain level
    if (STRUCTURAL_RELATIONSHIP_TYPES.has(edge.relationshipType)) continue;

    const sourceDomain = elementToDomain.get(edge.sourceId);
    const targetDomain = elementToDomain.get(edge.targetId);

    if (!sourceDomain || !targetDomain) continue;
    if (sourceDomain === targetDomain) continue;

    const key = `${sourceDomain}--${targetDomain}`;
    let categories = edgeMap.get(key);
    if (!categories) {
      categories = new Map();
      edgeMap.set(key, categories);
    }

    // Classify by target element type
    const targetEl = graph.elements.get(edge.targetId);
    const targetType = targetEl?.elementType || '';
    const classification = TARGET_TYPE_TO_CATEGORY[targetType] || DEFAULT_CATEGORY;

    const existing = categories.get(classification.category);
    if (existing) {
      existing.count++;
    } else {
      categories.set(classification.category, { category: classification.category, count: 1 });
    }
  }

  // Convert to array
  const result: CrossDomainEdge[] = [];
  Array.from(edgeMap.entries()).forEach(([key, categories]) => {
    const [sourceDomain, targetDomain] = key.split('--');
    const integrations = Array.from(categories.values())
      .sort((a, b) => b.count - a.count);
    const totalWeight = integrations.reduce((sum, i) => sum + i.count, 0);

    if (totalWeight > 0) {
      result.push({ sourceDomain, targetDomain, integrations, totalWeight });
    }
  });

  return result.sort((a, b) => b.totalWeight - a.totalWeight);
}
