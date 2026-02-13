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
}

export interface Element {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  layer: LayerKey;
  domain: string;
  description: string;
  make_or_buy?: 'make' | 'buy' | 'mixed';
  status: 'active' | 'planned' | 'deprecated';
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
    enrichedElements: elements.filter((e) => e.make_or_buy || e.aggregate).length,
    layerCounts,
  };
}
