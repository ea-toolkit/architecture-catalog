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

export interface IntegrationTarget {
  id: string;
  name: string;
}

export interface IntegrationPattern {
  /** Human-readable category: "API", "Events", "Data", "Service" */
  category: string;
  /** Number of element-level edges in this category */
  count: number;
  /** Names of the target elements in this category */
  targetNames: string[];
  /** Target elements with IDs for linking */
  targets: IntegrationTarget[];
}

// ── Integration classification ──────────────────────────────
// Maps element types involved in cross-domain edges to meaningful categories.
// Structural relationships (composition, aggregation) are excluded
// because they don't represent cross-domain integration.

const STRUCTURAL_RELATIONSHIP_TYPES = new Set([
  'composition', 'aggregation',
]);

// Classify by the TARGET element type — "what is being depended on?"
// Simplified to 3 categories architects actually think in:
//   API Integration — calls to another domain's APIs
//   Event Coupling  — consuming another domain's events
//   Data Access     — depending on another domain's data
// Everything else (services, components, infra, domains) maps to
// "API Integration" because at the cross-domain level, if you depend
// on another domain's service/component, you're going through its API.
const TARGET_TYPE_TO_CATEGORY: Record<string, { category: string }> = {
  api_contract:       { category: 'API Integration' },
  api_endpoint:       { category: 'API Integration' },
  software_system:    { category: 'API Integration' },
  software_subsystem: { category: 'API Integration' },
  component:          { category: 'API Integration' },
  domain_event:       { category: 'Event Coupling' },
  data_concept:       { category: 'Data Access' },
  data_aggregate:     { category: 'Data Access' },
  data_entity:        { category: 'Data Access' },
  infra_node:         { category: 'Shared Infrastructure' },
  cloud_service:      { category: 'Shared Infrastructure' },
};

// Domain-level references are not meaningful integration — skip them
const SKIP_TARGET_TYPES = new Set(['domain']);

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
  const edgeMap = new Map<string, Map<string, { category: string; count: number; targets: Map<string, string> }>>();

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
    const targetName = (targetEl?.fields.name as string) || edge.targetId;

    // Skip domain-level references — not meaningful integration
    if (SKIP_TARGET_TYPES.has(targetType)) continue;

    const classification = TARGET_TYPE_TO_CATEGORY[targetType];
    if (!classification) continue; // Unknown types are not cross-domain integration

    const existing = categories.get(classification.category);
    if (existing) {
      existing.count++;
      existing.targets.set(edge.targetId, targetName);
    } else {
      categories.set(classification.category, {
        category: classification.category,
        count: 1,
        targets: new Map([[edge.targetId, targetName]]),
      });
    }
  }

  // Convert to array with serializable types (no Set)
  const result: CrossDomainEdge[] = [];
  Array.from(edgeMap.entries()).forEach(([key, categories]) => {
    const [sourceDomain, targetDomain] = key.split('--');
    const integrations: IntegrationPattern[] = Array.from(categories.values())
      .map(c => {
        const targets = Array.from(c.targets.entries())
          .map(([id, name]) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name));
        return {
          category: c.category,
          count: c.count,
          targetNames: targets.map(t => t.name),
          targets,
        };
      })
      .sort((a, b) => b.count - a.count);
    const totalWeight = integrations.reduce((sum, i) => sum + i.count, 0);

    if (totalWeight > 0) {
      result.push({ sourceDomain, targetDomain, integrations, totalWeight });
    }
  });

  return result.sort((a, b) => b.totalWeight - a.totalWeight);
}
