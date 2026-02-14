// catalog-ui/src/lib/types.ts
// ═══════════════════════════════════════════════════════════════
// Schema-driven types — derived from registry-mapping.yaml
// These types are generic; the mapping YAML is the single source of truth.
// ═══════════════════════════════════════════════════════════════

// ── Mapping YAML types (parsed at build time) ────────────────

/** Site branding — change in registry-mapping.yaml for white-label deployment */
export interface SiteConfig {
  name: string;
  description: string;
  logo_text: string;
  logo_image?: string;
}

/** Layer definition from the mapping YAML */
export interface LayerDef {
  name: string;
  color: string;
  bg: string;
  icon: string;
}

/** ArchiMate relationship type labels from the mapping YAML */
export interface RelationshipTypeDef {
  outgoing: string;
  incoming: string;
  icon: string;
}

export interface FieldDef {
  type: 'string' | 'string[]' | 'number' | 'boolean' | 'object[]';
  required: boolean;
  label: string;
}

export interface RelationshipDef {
  target: string;          // element_key of the target type
  type: string;            // ArchiMate relationship type
  cardinality: 'one' | 'many';
  resolve_by: 'slug' | 'name' | 'abbreviation';
  inverse: string | null;  // field name on target that should point back
  required: boolean;
}

export interface ElementTypeDef {
  label: string;
  layer: string;
  folder: string;
  id_field: string;
  archimate: string;
  graph_rank: number;
  icon: string;
  badge_category: string;
  fields: Record<string, FieldDef>;
  relationships: Record<string, RelationshipDef>;
}

export interface RegistryMapping {
  version: string;
  registry_root: string;
  site: SiteConfig;
  layers: Record<string, LayerDef>;
  relationship_types: Record<string, RelationshipTypeDef>;
  domain_color_palette: string[];
  elements: Record<string, ElementTypeDef>;
}

// ── Runtime graph types (what the FE renders) ─────────────────

/**
 * A resolved reference to another registry element.
 * When `resolved` is false, the raw value is kept for display
 * but no edge is drawn — graceful degradation.
 */
export interface ResolvedRef {
  /** The raw value from frontmatter (slug, name, or abbreviation) */
  raw: string;
  /** Whether the reference was successfully resolved to a file */
  resolved: boolean;
  /** The resolved element's unique ID (filename slug), if resolved */
  targetId?: string;
  /** The resolved element's display name, if resolved */
  targetName?: string;
}

/**
 * A resolved relationship — an edge in the graph.
 */
export interface ResolvedRelationship {
  /** Frontmatter key this came from */
  fieldKey: string;
  /** ArchiMate relationship type (composition, realization, etc.) */
  type: string;
  /** Reference resolution results */
  refs: ResolvedRef[];
}

/**
 * A fully loaded registry element — one .md file parsed & resolved.
 */
export interface RegistryElement {
  /** Unique ID = filename slug (e.g., "novacrm-core") */
  id: string;
  /** Element type key from mapping (e.g., "software_system") */
  elementType: string;
  /** Human label from mapping (e.g., "Software System") */
  typeLabel: string;
  /** Layer key (e.g., "applications_and_data") */
  layer: string;
  /** ArchiMate element type */
  archimate: string;
  /** Graph hierarchy rank */
  graphRank: number;
  /** Icon for compact display */
  icon: string;
  /** All frontmatter fields (key → value) — raw, untyped */
  fields: Record<string, unknown>;
  /** Resolved outgoing relationships */
  relationships: ResolvedRelationship[];
  /** Source file path (relative to registry root) */
  sourcePath: string;
  /** Markdown body content below frontmatter */
  body: string;
  /** Health indicators for rendering */
  health: ElementHealth;
}

/**
 * Health status of an element — used for rendering badges & lint scores.
 */
export interface ElementHealth {
  /** Has all required fields */
  hasRequiredFields: boolean;
  /** Missing required field names */
  missingFields: string[];
  /** Has at least one resolved relationship */
  isConnected: boolean;
  /** Has unresolved references */
  hasBrokenRefs: boolean;
  /** List of broken reference values */
  brokenRefs: string[];
  /** Has the `type:` frontmatter field */
  hasType: boolean;
}

/**
 * An edge in the registry graph — derived from resolved relationships.
 */
export interface RegistryEdge {
  sourceId: string;
  targetId: string;
  relationshipType: string;   // ArchiMate type
  fieldKey: string;            // Which frontmatter key produced this
  label: string;               // Human-readable label
}

/**
 * The full loaded registry graph — what the FE works with.
 */
export interface RegistryGraph {
  /** All elements indexed by ID */
  elements: Map<string, RegistryElement>;
  /** All resolved edges */
  edges: RegistryEdge[];
  /** Lookup indexes for fast traversal */
  indexes: GraphIndexes;
  /** The mapping definition that produced this graph */
  mapping: RegistryMapping;
}

/**
 * Pre-built indexes for O(1) lookups.
 */
export interface GraphIndexes {
  /** Elements grouped by type key */
  byType: Map<string, RegistryElement[]>;
  /** Elements grouped by domain */
  byDomain: Map<string, RegistryElement[]>;
  /** Elements grouped by layer */
  byLayer: Map<string, RegistryElement[]>;
  /** Name → element ID lookup (case-insensitive) */
  byName: Map<string, string>;
  /** Abbreviation → element ID lookup */
  byAbbreviation: Map<string, string>;
  /** Slug (filename) → element ID lookup */
  bySlug: Map<string, string>;
  /** Edges grouped by source element ID */
  edgesBySource: Map<string, RegistryEdge[]>;
  /** Edges grouped by target element ID */
  edgesByTarget: Map<string, RegistryEdge[]>;
}

// ── Adapter types for existing graph components ───────────────

/**
 * Compatibility type — maps RegistryElement to the existing
 * Element interface used by DomainContextMap and graph-data.ts.
 * This allows the existing graph components to work with
 * real data without refactoring them.
 */
export interface LegacyElement {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  layer: string;
  domain: string;
  description: string;
  sourcing?: string;
  status: string;
  owner?: string;
  aggregate?: string;
  /** Schema-derived: left-to-right rank from registry-mapping.yaml graph_rank */
  graphRank: number;
  /** Schema-derived: layer border color from registry-mapping.yaml layers */
  layerColor: string;
  /** Schema-derived: layer background color from registry-mapping.yaml layers */
  layerBg: string;
  /** Schema-derived: icon emoji from registry-mapping.yaml icon field */
  mappingIcon: string;
  /** Markdown body content below frontmatter */
  body: string;
  /** All raw frontmatter fields (for displaying additional properties) */
  fields: Record<string, unknown>;
  relationships: { target: string; targetName: string; type: string; fieldKey: string }[];
  /** Incoming edges — elements that point TO this element */
  incomingRelationships: { source: string; sourceName: string; type: string; fieldKey: string }[];
}

/**
 * Compatibility type for Domain summary.
 */
export interface LegacyDomain {
  id: string;
  name: string;
  description: string;
  color: string;
  maturity: 'Excellent' | 'Good' | 'Developing' | 'Initial';
  counts: Record<string, number>;
  totalElements: number;
  diagramCount: number;
}
