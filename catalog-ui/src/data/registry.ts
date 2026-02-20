// ═══════════════════════════════════════════════════════════════
// Registry Data Provider — fully schema-driven, zero hardcoding
// ═══════════════════════════════════════════════════════════════
//
// Loads REAL data from registry-v2/ markdown files via the
// schema-driven loader. Everything is derived from registry-mapping.yaml:
//   - Site branding (name, description)
//   - Layers, relationship labels, badge categories, domain colors
//   - Element types, fields, relationships
//
// This runs at Astro BUILD TIME (SSG). All fs access happens
// during `astro build` — the output is pure static HTML.
//
// GRACEFUL DEGRADATION:
//   - Missing/broken references → captured in health, not crashes
//   - Unmapped relationship targets → shows ⚠️ in UI
//   - Unknown layer keys → fallback color
// ═══════════════════════════════════════════════════════════════

import {
  loadRegistry,
  toLegacyElements,
  toLegacyDomains,
  getRegistryHealthSummary,
  getLayerMeta,
  getSiteConfig,
  buildTypeBadgeMap,
  deriveRelFieldLabel,
  getRelTypelabels,
} from '../lib/registry-loader';
import type { RegistryGraph, SiteConfig, LayerDef, RelationshipTypeDef } from '../lib/types';
import { loadEventMapping, resolveEventFlows, type EventFlow, type EventMappingConfig } from '../lib/event-mapping-loader';
import { loadHeatmapMapping, type HeatmapMappingConfig } from '../lib/heatmap-mapping-loader';

// ─────────────────────────────────────────────────────────────
// Types — self-contained, no dependency on mock.ts
// ─────────────────────────────────────────────────────────────

export type LayerKey = string;  // Dynamic — derived from mapping YAML

export interface Domain {
  id: string;
  name: string;
  description: string;
  color: string;
  maturity: 'Excellent' | 'Good' | 'Developing' | 'Initial';
  counts: Record<string, number>;
  totalElements: number;
  diagramCount: number;
  /** Domain documentation markdown from views/<domain>/docs.md */
  docs: string;
}

export interface Element {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  layer: LayerKey;
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
  relationships: { target: string; targetName: string; type: string; fieldKey?: string }[];
  incomingRelationships?: { source: string; sourceName: string; type: string; fieldKey: string }[];
}

// ─────────────────────────────────────────────────────────────
// Load registry graph at module init (build-time singleton)
// ─────────────────────────────────────────────────────────────
let _graph: RegistryGraph | null = null;
let _domains: Domain[] = [];
let _elements: Element[] = [];
let _loadError: string | null = null;
let _eventMapping: EventMappingConfig | null = null;
let _heatmapMapping: HeatmapMappingConfig | null = null;
const _eventFlowCache = new Map<string, EventFlow | null>();

try {
  _graph = await loadRegistry();

  // Convert to legacy shapes
  _domains = toLegacyDomains(_graph) as Domain[];

  // Flatten all elements across all domains
  for (const domainId of _graph.indexes.byDomain.keys()) {
    if (domainId === 'unknown') continue;
    const domainEls = toLegacyElements(_graph, domainId) as Element[];
    _elements.push(...domainEls);
  }

  // Populate incoming relationships from the graph's edge index
  // (must happen AFTER all elements are loaded since edges cross domains)
  for (const el of _elements) {
    const incomingEdges = _graph.indexes.edgesByTarget.get(el.id) ?? [];
    el.incomingRelationships = incomingEdges.map(edge => {
      const sourceEl = _graph!.elements.get(edge.sourceId);
      return {
        source: edge.sourceId,
        sourceName: sourceEl ? (sourceEl.fields.name as string) ?? edge.sourceId : edge.sourceId,
        type: edge.relationshipType,
        fieldKey: edge.fieldKey,
      };
    });
  }

  // Log health summary at build time
  const health = getRegistryHealthSummary(_graph);
  console.log(`\n📊 Registry loaded: ${health.total} elements, ${_graph.edges.length} edges`);
  console.log(`   ✅ Healthy: ${health.healthy}  |  🔗 Connected: ${health.connected}  |  🏝️ Orphans: ${health.orphans}`);
  console.log(`   ⚠️  Broken refs: ${health.brokenRefs}  |  ❌ Missing type: ${health.missingType}`);
  for (const [type, stats] of Object.entries(health.byType)) {
    console.log(`   → ${type}: ${stats.total} total, ${stats.healthy} healthy, ${stats.connected} connected`);
  }
  console.log('');

  // Load optional event mapping
  _eventMapping = loadEventMapping();
  if (_eventMapping) {
    console.log(`🔔 Event mapping loaded: ${_eventMapping.event_type} → ${_eventMapping.service_type}`);
  }

  // Load optional heatmap mapping
  _heatmapMapping = loadHeatmapMapping();
  if (_heatmapMapping) {
    console.log(`🔥 Heatmap mapping loaded: ${_heatmapMapping.capability_type} (${Object.keys(_heatmapMapping.maturity_scale).join(', ')})`);
  }
} catch (err) {
  _loadError = err instanceof Error ? err.message : String(err);
  console.error(`\n❌ Registry load failed: ${_loadError}`);
  console.error('   Falling back to empty data. Check registry-mapping.yaml and registry-v2/ paths.\n');
}

// ─────────────────────────────────────────────────────────────
// Schema-derived metadata — all from mapping YAML, zero hardcoding
// ─────────────────────────────────────────────────────────────

/** Layer metadata — derived from mapping YAML layers section */
export const LAYER_META: Record<string, { name: string; color: string; bg: string; icon: string }> =
  _graph ? getLayerMeta(_graph.mapping) : {};

/** Site config — branding from mapping YAML */
export const SITE_CONFIG: SiteConfig =
  _graph ? getSiteConfig(_graph.mapping) : { name: 'Architecture Catalog', description: '', logo_text: 'A' };

/** Type key → badge category map — from mapping YAML badge_category field */
export const TYPE_BADGES: Record<string, string> =
  _graph ? buildTypeBadgeMap(_graph.mapping) : {};

/** ArchiMate relationship type labels — from mapping YAML relationship_types */
export const REL_TYPE_LABELS: Record<string, { outgoing: string; incoming: string; icon: string }> =
  _graph ? getRelTypelabels(_graph.mapping) : {};

/**
 * Derive a human label for a relationship field key.
 * Uses ArchiMate verb + target type label from the mapping.
 */
export function getRelFieldLabel(fieldKey: string, direction: 'out' | 'in' = 'out'): string {
  if (!_graph) return fieldKey;
  return deriveRelFieldLabel(fieldKey, _graph.mapping, direction);
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

/** All domains derived from registry data */
export const domains: Domain[] = _domains;

/** All elements derived from registry data */
export const elements: Element[] = _elements;

/** Optional: the raw graph for advanced usage */
export const graph: RegistryGraph | null = _graph;

/** Optional: error message if loading failed */
export const loadError: string | null = _loadError;

export function getDomainById(id: string): Domain | undefined {
  return domains.find((d) => d.id === id);
}

export function getElementsByDomain(domainId: string): Element[] {
  return elements.filter((e) => e.domain === domainId);
}

export function getElementById(id: string): Element | undefined {
  return elements.find((e) => e.id === id);
}

export function getElementsByLayer(layer: LayerKey): Element[] {
  return elements.filter((e) => e.layer === layer);
}

export function getModelStats() {
  // Dynamically compute layer counts from whatever layers exist
  const layerCounts: Record<string, number> = {};
  for (const layerKey of Object.keys(LAYER_META)) {
    layerCounts[layerKey] = elements.filter((e) => e.layer === layerKey).length;
  }

  return {
    totalElements: elements.length,
    totalDomains: domains.length,
    totalDiagrams: domains.reduce((sum, d) => sum + d.diagramCount, 0),
    enrichedElements: elements.filter((e) => e.sourcing || e.aggregate).length,
    layerCounts,
  };
}

/**
 * Get additional frontmatter fields for an element that aren't already
 * shown in the standard Properties panel. Filters out:
 * - Fields already rendered (name, type, description, status, sourcing, owner, domain, aggregate)
 * - Relationship fields (defined in the mapping YAML)
 * This is schema-driven — new fields appear automatically.
 */
export function getExtraFields(element: Element): { key: string; label: string; value: unknown }[] {
  // Standard fields already displayed in the Properties panel
  const SHOWN_FIELDS = new Set([
    'name', 'type', 'description', 'status', 'sourcing', 'owner', 'domain', 'aggregate', 'registered',
  ]);

  // Relationship field keys from the mapping YAML
  const relFieldKeys = new Set<string>();
  if (_graph) {
    const typeDef = _graph.mapping.elements[element.type];
    if (typeDef?.relationships) {
      for (const key of Object.keys(typeDef.relationships)) {
        relFieldKeys.add(key);
      }
    }
  }

  const extras: { key: string; label: string; value: unknown }[] = [];
  for (const [key, value] of Object.entries(element.fields)) {
    if (SHOWN_FIELDS.has(key)) continue;
    if (relFieldKeys.has(key)) continue;
    if (value === null || value === undefined || value === '') continue;
    // Arrays that are empty are not interesting
    if (Array.isArray(value) && value.length === 0) continue;

    // Derive a human label: replace underscores with spaces, title-case
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    extras.push({ key, label, value });
  }
  return extras;
}

// ─────────────────────────────────────────────────────────────
// Event Flow API — optional, driven by event-mapping.yaml
// ─────────────────────────────────────────────────────────────

/** Whether event mapping is configured (event-mapping.yaml exists and is valid) */
export const eventMappingEnabled: boolean = _eventMapping !== null;

/**
 * Get the resolved event flows for a domain.
 * Returns null if event mapping is not configured or no events exist in the domain.
 * Results are cached per domain.
 */
export function getEventFlows(domainId: string): EventFlow | null {
  if (!_graph || !_eventMapping) return null;

  if (_eventFlowCache.has(domainId)) {
    return _eventFlowCache.get(domainId)!;
  }

  const result = resolveEventFlows(_graph, _eventMapping, domainId);
  _eventFlowCache.set(domainId, result);
  return result;
}

// Re-export types for consumers
export type { EventFlow, EventNode, ServiceNode, EventEdge } from '../lib/event-mapping-loader';

// ─────────────────────────────────────────────────────────────
// Heatmap API — optional, driven by heatmap-mapping.yaml
// ─────────────────────────────────────────────────────────────

/** Whether heatmap mapping is configured (heatmap-mapping.yaml exists and is valid) */
export const heatmapMappingEnabled: boolean = _heatmapMapping !== null;

/** Get the heatmap mapping config (null if not configured) */
export function getHeatmapConfig(): HeatmapMappingConfig | null {
  return _heatmapMapping;
}

// Re-export types for consumers
export type { HeatmapMappingConfig } from '../lib/heatmap-mapping-loader';
