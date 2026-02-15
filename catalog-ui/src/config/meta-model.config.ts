// catalog-ui/src/config/meta-model.config.ts
// Meta-model configuration for graph visualization
// This drives the layout and styling of domain context maps
//
// HOW TO UPDATE:
// 1. When adding new element types to the meta-model (draw.io), add them to ELEMENT_HIERARCHY
// 2. When adding new relationship types, add them to RELATIONSHIP_SEMANTICS
// 3. Optionally update ELEMENT_STYLES for visual styling

/**
 * Element Hierarchy - determines left-to-right positioning in the graph
 * 
 * Rank semantics:
 *   - Negative ranks: appear LEFT of domain (e.g., stakeholders, goals, actors)
 *   - Rank 0: Domain/Architecture Area (anchor point)
 *   - Positive ranks: appear RIGHT of domain (components, systems, data)
 * 
 * The higher the rank, the further RIGHT the element appears.
 * Elements with the same rank appear in the same column.
 */
export const ELEMENT_HIERARCHY: Record<string, number> = {
  // ── Motivation Layer (LEFT of domain) ──
  'stakeholder': -2,
  'goal': -2,
  'principle': -2,
  'driver': -1,
  'assessment': -1,
  'requirement': -1,
  
  // ── Products & Services Layer (LEFT of domain) ──
  'product': -1,
  'market_segment': -2,

  // ── Business Layer (LEFT of domain) ──
  'business_actor': -1,
  'business_role': -1,
  'business_service': -1,

  // ── Domain / Architecture Area (ANCHOR) ──
  'domain': 0,
  'architecture_area': 0,

  // ── Application Layer - Logical (RIGHT of domain) ──
  'component': 1,
  'business_capability': 1,

  // ── Application Layer - Physical (further RIGHT) ──
  'software_system': 2,
  'api_contract': 2,

  // ── Application Layer - Implementation ──
  'software_subsystem': 3,
  'api_endpoint': 3,
  'software_component': 4,
  'software_code': 5,
  
  // ── Data Layer ──
  'data_concept': 1,
  'data_aggregate': 2,
  'data_entity': 3,
  'domain_event': 3,
  
  // ── Infrastructure Layer ──
  'infrastructure_function': 4,
  'infrastructure_api': 4,
  'application_infrastructure': 5,
  'cloud_service': 5,
  'infra_node': 6,
  'network_zone': 6,
  'networking_equipment': 6,
  
  // ── Process Layer ──
  'value_stream': 0,
  'end_to_end_process': 1,
  'business_process_module': 2,
  'process_task': 3,
  'business_event': 3,
  'business_information_object': 2,
};

/**
 * Relationship Semantics - defines how relationships behave in the graph
 * 
 * direction:
 *   - 'forward': edge goes from source to target (source → target)
 *   - 'backward': edge goes from target to source (target → source) for layout
 *   - 'bidirectional': shown but doesn't affect layout ranking
 * 
 * layoutRelevant:
 *   - true: this relationship type affects dagre ranking (hierarchy)
 *   - false: edge is shown but doesn't influence node positioning
 * 
 * inverse: the inverse relationship type (for normalizing bidirectional pairs)
 */
export interface RelationshipSemantics {
  direction: 'forward' | 'backward' | 'bidirectional';
  label: string;
  layoutRelevant: boolean;
  inverse?: string;
  arrowStyle?: 'filled' | 'open' | 'diamond' | 'diamond-filled';
}

export const RELATIONSHIP_SEMANTICS: Record<string, RelationshipSemantics> = {
  // ── Structural Relationships ──
  'composition': {
    direction: 'forward',
    label: 'contains',
    layoutRelevant: true,
    arrowStyle: 'diamond-filled',
  },
  'aggregation': {
    direction: 'forward',
    label: 'aggregates',
    layoutRelevant: true,
    arrowStyle: 'diamond',
  },
  
  // ── Dependency Relationships ──
  'realization': {
    direction: 'backward',  // Implementation points TO abstraction, but layout goes abstraction → implementation
    label: 'realizes',
    layoutRelevant: true,
    inverse: 'realized-by',
    arrowStyle: 'open',
  },
  'realized-by': {
    direction: 'forward',
    label: 'realized by',
    layoutRelevant: true,
    inverse: 'realization',
    arrowStyle: 'open',
  },
  'realizes': {
    direction: 'backward',
    label: 'realizes',
    layoutRelevant: true,
    inverse: 'realized-by',
    arrowStyle: 'open',
  },
  
  // ── Access Relationships ──
  'access': {
    direction: 'forward',
    label: 'accesses',
    layoutRelevant: false,  // Data access doesn't define hierarchy
    arrowStyle: 'open',
  },
  'accesses': {
    direction: 'forward',
    label: 'accesses',
    layoutRelevant: false,
    arrowStyle: 'open',
  },
  'accessed-by': {
    direction: 'backward',
    label: 'accessed by',
    layoutRelevant: false,
    inverse: 'accesses',
    arrowStyle: 'open',
  },
  
  // ── Serving Relationships ──
  'serving': {
    direction: 'forward',
    label: 'serves',
    layoutRelevant: true,
    arrowStyle: 'open',
  },
  'served-by': {
    direction: 'backward',
    label: 'served by',
    layoutRelevant: true,
    inverse: 'serving',
    arrowStyle: 'open',
  },
  
  // ── Assignment Relationships ──
  'assignment': {
    direction: 'forward',
    label: 'assigned to',
    layoutRelevant: true,
    arrowStyle: 'filled',
  },
  
  // ── Triggering Relationships ──
  'triggers': {
    direction: 'forward',
    label: 'triggers',
    layoutRelevant: false,  // Event triggers don't define hierarchy
    arrowStyle: 'filled',
  },
  'triggered-by': {
    direction: 'backward',
    label: 'triggered by',
    layoutRelevant: false,
    inverse: 'triggers',
    arrowStyle: 'filled',
  },
  
  // ── Flow Relationships ──
  'flow': {
    direction: 'forward',
    label: 'flows to',
    layoutRelevant: false,
    arrowStyle: 'filled',
  },
  
  // ── Association Relationships ──
  'association': {
    direction: 'bidirectional',
    label: 'associated with',
    layoutRelevant: false,
    arrowStyle: 'open',
  },
  'owns': {
    direction: 'forward',
    label: 'owns',
    layoutRelevant: true,
    arrowStyle: 'open',
  },
  
  // ── Process Relationships ──
  'automated-by': {
    direction: 'forward',
    label: 'automated by',
    layoutRelevant: true,
    arrowStyle: 'open',
  },
  'supported-by': {
    direction: 'forward',
    label: 'supported by',
    layoutRelevant: false,
    arrowStyle: 'open',
  },
  
  // ── Event Relationships ──
  'publishes': {
    direction: 'forward',
    label: 'publishes',
    layoutRelevant: false,
    arrowStyle: 'filled',
  },
  'consumes': {
    direction: 'forward',
    label: 'consumes',
    layoutRelevant: false,
    arrowStyle: 'filled',
  },
};

/**
 * Get the hierarchy rank for an element type.
 * Checks hardcoded overrides first, then uses schema-derived fallbackRank
 * from registry-mapping.yaml graph_rank field.
 */
export function getElementRank(type: string, fallbackRank?: number): number {
  const normalizedType = type.toLowerCase().replace(/-/g, '_').replace(/ /g, '_');
  return ELEMENT_HIERARCHY[normalizedType] ?? fallbackRank ?? 1;
}

/**
 * Get relationship semantics
 * Returns default forward semantics if relationship type is unknown
 */
export function getRelationshipSemantics(type: string): RelationshipSemantics {
  const normalizedType = type.toLowerCase().replace(/ /g, '-');
  return RELATIONSHIP_SEMANTICS[normalizedType] ?? {
    direction: 'forward',
    label: type.replace(/-/g, ' '),
    layoutRelevant: false,
    arrowStyle: 'open',
  };
}

/**
 * Determine if an edge should be included in layout calculations
 * Based on relationship semantics and element hierarchy
 */
export function shouldIncludeEdgeInLayout(
  sourceType: string,
  targetType: string,
  relationshipType: string
): boolean {
  const semantics = getRelationshipSemantics(relationshipType);
  if (!semantics.layoutRelevant) return false;
  
  // For layout-relevant edges, only include if it respects hierarchy
  const sourceRank = getElementRank(sourceType);
  const targetRank = getElementRank(targetType);
  
  // Forward edges should go from lower rank to higher rank
  if (semantics.direction === 'forward') {
    return sourceRank <= targetRank;
  }
  
  // Backward edges go from higher to lower (but we flip them for layout)
  if (semantics.direction === 'backward') {
    return sourceRank >= targetRank;
  }
  
  return false;
}

/**
 * Normalize an edge direction for dagre layout
 * Returns { source, target } in the correct order for left-to-right layout
 */
export function normalizeEdgeForLayout(
  sourceId: string,
  sourceType: string,
  targetId: string,
  targetType: string,
  relationshipType: string
): { source: string; target: string; flipped: boolean } {
  const semantics = getRelationshipSemantics(relationshipType);
  const sourceRank = getElementRank(sourceType);
  const targetRank = getElementRank(targetType);
  
  // For backward relationships, flip the edge for layout
  if (semantics.direction === 'backward') {
    return { source: targetId, target: sourceId, flipped: true };
  }
  
  // For forward/bidirectional, keep original direction but ensure lower rank → higher rank
  if (sourceRank > targetRank) {
    return { source: targetId, target: sourceId, flipped: true };
  }
  
  return { source: sourceId, target: targetId, flipped: false };
}
