// catalog-ui/src/lib/registry-loader.ts
// ═══════════════════════════════════════════════════════════════
// Schema-driven registry loader
// ═══════════════════════════════════════════════════════════════
//
// This module reads the registry-mapping.yaml at Astro build time,
// scans the registry-v2 folders, parses markdown frontmatter, resolves
// cross-references, and produces a typed RegistryGraph.
//
// DESIGN:
//   1. Zero hard-coded element types — everything driven by mapping YAML
//   2. Graceful degradation — broken refs & missing fields are captured, never crash
//   3. Legacy adapter — converts RegistryElement[] to the Element/Domain types
//      that existing DomainContextMap components expect
//
// USAGE IN ASTRO PAGES:
//   import { loadRegistry, toLegacyElements, toLegacyDomains } from '../lib/registry-loader';
//   const graph = await loadRegistry();
//   const elements = toLegacyElements(graph, 'novacrm-platform');
//   const domains = toLegacyDomains(graph);
//
// ═══════════════════════════════════════════════════════════════

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';
import type {
  RegistryMapping,
  ElementTypeDef,
  RelationshipDef,
  RegistryElement,
  RegistryEdge,
  RegistryGraph,
  GraphIndexes,
  ResolvedRef,
  ResolvedRelationship,
  ElementHealth,
  LegacyElement,
  LegacyDomain,
} from './types';

// ─────────────────────────────────────────────────────────────
// 1. YAML & Frontmatter Parsers (using js-yaml)
// ─────────────────────────────────────────────────────────────

/**
 * Parse markdown frontmatter (between --- delimiters).
 * Returns null if no valid frontmatter found.
 */
function parseFrontmatter(content: string): Record<string, unknown> | null {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  try {
    const parsed = yaml.load(match[1]);
    return (parsed && typeof parsed === 'object') ? parsed as Record<string, unknown> : null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. Mapping Loader
// ─────────────────────────────────────────────────────────────

/** Workspace root — two levels up from catalog-ui/src/lib/ */
const WORKSPACE_ROOT = resolve(import.meta.dirname ?? __dirname, '..', '..', '..');

/**
 * Load and parse the registry-mapping.yaml.
 * Falls back to a default path relative to workspace root.
 */
export function loadMapping(customPath?: string): RegistryMapping {
  const mappingPath = customPath ?? join(WORKSPACE_ROOT, 'models', 'registry-mapping.yaml');

  if (!existsSync(mappingPath)) {
    throw new Error(`Registry mapping not found at: ${mappingPath}`);
  }

  const raw = readFileSync(mappingPath, 'utf-8');
  const parsed = yaml.load(raw) as RegistryMapping;

  // Normalize: ensure elements map exists
  if (!parsed.elements || typeof parsed.elements !== 'object') {
    throw new Error('registry-mapping.yaml is missing "elements" section');
  }

  return parsed;
}

// ─────────────────────────────────────────────────────────────
// 3. File Scanner
// ─────────────────────────────────────────────────────────────

interface RawFile {
  slug: string;          // filename without .md
  path: string;          // full absolute path
  relativePath: string;  // relative to registry root
  frontmatter: Record<string, unknown>;
}

/**
 * Scan a folder for .md files and parse their frontmatter.
 * Skips _template.md and files without valid frontmatter.
 */
function scanFolder(folderPath: string, registryRoot: string): RawFile[] {
  if (!existsSync(folderPath)) return [];

  const files: RawFile[] = [];

  for (const entry of readdirSync(folderPath)) {
    if (!entry.endsWith('.md')) continue;
    if (entry === '_template.md') continue;

    const fullPath = join(folderPath, entry);
    const content = readFileSync(fullPath, 'utf-8');
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) continue;

    files.push({
      slug: entry.replace(/\.md$/, ''),
      path: fullPath,
      relativePath: fullPath.replace(registryRoot + '/', ''),
      frontmatter,
    });
  }

  return files;
}

// ─────────────────────────────────────────────────────────────
// 4. Reference Resolution
// ─────────────────────────────────────────────────────────────

/**
 * Build lookup indexes from all loaded raw files.
 * These indexes enable O(1) reference resolution by slug, name, or abbreviation.
 */
function buildRawIndexes(
  allFiles: Map<string, { typeDef: ElementTypeDef; files: RawFile[] }>
): {
  bySlug: Map<string, { typeKey: string; file: RawFile }[]>;
  byName: Map<string, { typeKey: string; file: RawFile }[]>;
  byAbbreviation: Map<string, { typeKey: string; file: RawFile }[]>;
} {
  const bySlug = new Map<string, { typeKey: string; file: RawFile }[]>();
  const byName = new Map<string, { typeKey: string; file: RawFile }[]>();
  const byAbbreviation = new Map<string, { typeKey: string; file: RawFile }[]>();

  for (const [typeKey, { files }] of allFiles) {
    for (const file of files) {
      // Slug index — collect all entries per slug (multiple types may share a slug)
      const slugList = bySlug.get(file.slug) ?? [];
      slugList.push({ typeKey, file });
      bySlug.set(file.slug, slugList);

      // Name index (case-insensitive)
      const name = file.frontmatter.name as string | undefined;
      if (name) {
        const nameList = byName.get(name.toLowerCase()) ?? [];
        nameList.push({ typeKey, file });
        byName.set(name.toLowerCase(), nameList);
      }

      // Abbreviation index
      const abbr = file.frontmatter.abbreviation as string | undefined;
      if (abbr) {
        const abbrList = byAbbreviation.get(abbr.toUpperCase()) ?? [];
        abbrList.push({ typeKey, file });
        byAbbreviation.set(abbr.toUpperCase(), abbrList);
      }
    }
  }

  return { bySlug, byName, byAbbreviation };
}

/**
 * Resolve a single reference value to a target element.
 * When multiple elements share a slug/name, prefer the one matching targetType.
 */
function resolveRef(
  rawValue: string,
  resolveBy: 'slug' | 'name' | 'abbreviation',
  targetType: string,
  indexes: ReturnType<typeof buildRawIndexes>
): ResolvedRef {
  if (!rawValue || rawValue === '~') {
    return { raw: rawValue, resolved: false };
  }

  let matches: { typeKey: string; file: RawFile }[] | undefined;

  switch (resolveBy) {
    case 'slug':
      matches = indexes.bySlug.get(rawValue);
      break;
    case 'name':
      matches = indexes.byName.get(rawValue.toLowerCase());
      break;
    case 'abbreviation':
      matches = indexes.byAbbreviation.get(rawValue.toUpperCase());
      break;
  }

  if (matches && matches.length > 0) {
    // Prefer match whose typeKey matches the expected target type
    const match = matches.find(m => m.typeKey === targetType) ?? matches[0];
    const uniqueId = `${match.typeKey}--${match.file.slug}`;
    return {
      raw: rawValue,
      resolved: true,
      targetId: uniqueId,
      targetName: (match.file.frontmatter.name as string) ?? match.file.slug,
    };
  }

  // Graceful degradation: reference exists but target not found
  return { raw: rawValue, resolved: false };
}

/**
 * Resolve all relationships for a file based on its type definition.
 */
function resolveRelationships(
  file: RawFile,
  typeDef: ElementTypeDef,
  indexes: ReturnType<typeof buildRawIndexes>
): ResolvedRelationship[] {
  const results: ResolvedRelationship[] = [];

  for (const [fieldKey, relDef] of Object.entries(typeDef.relationships ?? {})) {
    const rawValue = file.frontmatter[fieldKey];

    // Skip null/undefined/empty
    if (rawValue === null || rawValue === undefined || rawValue === '~' || rawValue === '') {
      continue;
    }

    // Normalize to array
    const rawValues: string[] = Array.isArray(rawValue)
      ? (rawValue as string[]).filter((v) => v && v !== '~')
      : [String(rawValue)];

    if (rawValues.length === 0) continue;

    const refs = rawValues.map((v) => resolveRef(v, relDef.resolve_by, relDef.target, indexes));

    results.push({
      fieldKey,
      type: relDef.type,
      refs,
    });
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// 5. Health Assessment
// ─────────────────────────────────────────────────────────────

function assessHealth(
  file: RawFile,
  typeDef: ElementTypeDef,
  relationships: ResolvedRelationship[]
): ElementHealth {
  const missingFields: string[] = [];

  // Check required fields
  for (const [key, fieldDef] of Object.entries(typeDef.fields ?? {})) {
    if (fieldDef.required && (file.frontmatter[key] === undefined || file.frontmatter[key] === null || file.frontmatter[key] === '')) {
      missingFields.push(key);
    }
  }

  // Check for broken refs
  const brokenRefs: string[] = [];
  for (const rel of relationships) {
    for (const ref of rel.refs) {
      if (!ref.resolved) {
        brokenRefs.push(ref.raw);
      }
    }
  }

  // Check connectivity
  const hasAnyResolvedRef = relationships.some((r) => r.refs.some((ref) => ref.resolved));

  return {
    hasRequiredFields: missingFields.length === 0,
    missingFields,
    isConnected: hasAnyResolvedRef,
    hasBrokenRefs: brokenRefs.length > 0,
    brokenRefs,
    hasType: file.frontmatter.type !== undefined && file.frontmatter.type !== null,
  };
}

// ─────────────────────────────────────────────────────────────
// 6. Main Loader
// ─────────────────────────────────────────────────────────────

/**
 * Load the entire registry into a typed graph.
 * This is the main entry point — call from Astro pages at build time.
 *
 * @param mappingPath - Optional custom path to registry-mapping.yaml
 * @param registryRootPath - Optional custom path to registry-v2/
 */
export async function loadRegistry(
  mappingPath?: string,
  registryRootPath?: string
): Promise<RegistryGraph> {
  // 1. Load mapping
  const mapping = loadMapping(mappingPath);
  const registryRoot = registryRootPath ?? join(WORKSPACE_ROOT, mapping.registry_root);

  // 2. Scan all folders
  const allFiles = new Map<string, { typeDef: ElementTypeDef; files: RawFile[] }>();

  for (const [typeKey, typeDef] of Object.entries(mapping.elements)) {
    const folderPath = join(registryRoot, typeDef.folder);
    const files = scanFolder(folderPath, registryRoot);
    allFiles.set(typeKey, { typeDef, files });
  }

  // 3. Build resolution indexes
  const rawIndexes = buildRawIndexes(allFiles);

  // 4. Resolve relationships & build elements
  const elements = new Map<string, RegistryElement>();
  const edges: RegistryEdge[] = [];

  for (const [typeKey, { typeDef, files }] of allFiles) {
    for (const file of files) {
      const relationships = resolveRelationships(file, typeDef, rawIndexes);
      const health = assessHealth(file, typeDef, relationships);
      const uniqueId = `${typeKey}--${file.slug}`;

      const element: RegistryElement = {
        id: uniqueId,
        elementType: typeKey,
        typeLabel: typeDef.label,
        layer: typeDef.layer,
        archimate: typeDef.archimate,
        graphRank: typeDef.graph_rank,
        icon: typeDef.icon,
        fields: file.frontmatter,
        relationships,
        sourcePath: file.relativePath,
        health,
      };

      elements.set(uniqueId, element);

      // Build edges from resolved relationships
      for (const rel of relationships) {
        for (const ref of rel.refs) {
          if (ref.resolved && ref.targetId) {
            edges.push({
              sourceId: uniqueId,
              targetId: ref.targetId,
              relationshipType: rel.type,
              fieldKey: rel.fieldKey,
              label: relationshipLabel(rel.type, rel.fieldKey),
            });
          }
        }
      }
    }
  }

  // 5. Build indexes
  const indexes = buildGraphIndexes(elements, edges);

  return { elements, edges, indexes, mapping };
}

/**
 * Human-readable label for a relationship.
 */
function relationshipLabel(archimateType: string, fieldKey: string): string {
  const labels: Record<string, string> = {
    composition: 'contains',
    aggregation: 'aggregates',
    realization: 'realizes',
    serving: 'serves',
    assignment: 'assigned to',
    access: 'accesses',
  };
  return labels[archimateType] ?? fieldKey.replace(/_/g, ' ');
}

/**
 * Build all indexes for O(1) lookups.
 */
function buildGraphIndexes(
  elements: Map<string, RegistryElement>,
  edges: RegistryEdge[]
): GraphIndexes {
  const byType = new Map<string, RegistryElement[]>();
  const byDomain = new Map<string, RegistryElement[]>();
  const byLayer = new Map<string, RegistryElement[]>();
  const byName = new Map<string, string>();
  const byAbbreviation = new Map<string, string>();
  const bySlug = new Map<string, string>();
  const edgesBySource = new Map<string, RegistryEdge[]>();
  const edgesByTarget = new Map<string, RegistryEdge[]>();

  for (const [id, el] of elements) {
    // By type
    const typeList = byType.get(el.elementType) ?? [];
    typeList.push(el);
    byType.set(el.elementType, typeList);

    // By domain
    const domain = (el.fields.domain as string) ?? 'unknown';
    const domainList = byDomain.get(domain) ?? [];
    domainList.push(el);
    byDomain.set(domain, domainList);

    // By layer
    const layerList = byLayer.get(el.layer) ?? [];
    layerList.push(el);
    byLayer.set(el.layer, layerList);

    // Name index
    const name = el.fields.name as string | undefined;
    if (name) {
      byName.set(name.toLowerCase(), id);
    }

    // Abbreviation index
    const abbr = el.fields.abbreviation as string | undefined;
    if (abbr) {
      byAbbreviation.set(abbr.toUpperCase(), id);
    }

    // Slug index
    bySlug.set(id, id);
  }

  // Edge indexes
  for (const edge of edges) {
    const srcList = edgesBySource.get(edge.sourceId) ?? [];
    srcList.push(edge);
    edgesBySource.set(edge.sourceId, srcList);

    const tgtList = edgesByTarget.get(edge.targetId) ?? [];
    tgtList.push(edge);
    edgesByTarget.set(edge.targetId, tgtList);
  }

  return {
    byType,
    byDomain,
    byLayer,
    byName,
    byAbbreviation,
    bySlug,
    edgesBySource,
    edgesByTarget,
  };
}

// ─────────────────────────────────────────────────────────────
// 7. Legacy Adapters
// ─────────────────────────────────────────────────────────────
// Convert RegistryGraph to the Element/Domain types that existing
// DomainContextMap and graph-data.ts components expect.
// This allows gradual migration — existing components work as-is.

/**
 * Convert registry elements for a domain into LegacyElement[].
 * Suitable for passing to buildDomainGraph() in graph-data.ts.
 */
export function toLegacyElements(
  graph: RegistryGraph,
  domainId: string
): LegacyElement[] {
  const domainElements = graph.indexes.byDomain.get(domainId) ?? [];

  return domainElements.map((el) => ({
    id: el.id,
    name: (el.fields.name as string) ?? el.id,
    type: el.elementType.replace(/_/g, '-'),  // software_system → software-system
    typeLabel: el.typeLabel,
    layer: el.layer as LegacyElement['layer'],
    domain: domainId,
    description: (el.fields.description as string) ?? '',
    make_or_buy: el.fields.make_or_buy as LegacyElement['make_or_buy'],
    status: (el.fields.status as LegacyElement['status']) ?? 'active',
    owner: el.fields.owner as string | undefined,
    relationships: el.relationships.flatMap((rel) =>
      rel.refs
        .filter((ref) => ref.resolved && ref.targetId)
        .map((ref) => ({
          target: ref.targetId!,
          targetName: ref.targetName ?? ref.raw,
          type: rel.type,
          fieldKey: rel.fieldKey,
        }))
    ),
    // Incoming edges — populated below
    incomingRelationships: [],
  }));
}

/**
 * Build LegacyDomain summaries from the loaded graph.
 * Groups elements by domain and computes counts per type.
 * Domain colors are auto-assigned from the palette in registry-mapping.yaml.
 */
export function toLegacyDomains(graph: RegistryGraph): LegacyDomain[] {
  const palette = graph.mapping.domain_color_palette ?? ['#6b7280'];

  const domains: LegacyDomain[] = [];
  let colorIdx = 0;

  for (const [domainId, elements] of graph.indexes.byDomain) {
    if (domainId === 'unknown') continue;

    // Count by type label
    const counts: Record<string, number> = {};
    for (const el of elements) {
      const label = el.typeLabel;
      counts[label] = (counts[label] ?? 0) + 1;
    }

    // Find domain description from architecture-area-domain file
    const domainElement = elements.find((e) => e.elementType === 'architecture_area_domain');
    const description = domainElement
      ? (domainElement.fields.description as string) ?? ''
      : '';

    // Simple maturity heuristic based on health
    const healthyCount = elements.filter((e) => e.health.hasRequiredFields && e.health.hasType).length;
    const connectedCount = elements.filter((e) => e.health.isConnected).length;
    const ratio = elements.length > 0 ? (healthyCount + connectedCount) / (elements.length * 2) : 0;
    const maturity: LegacyDomain['maturity'] =
      ratio > 0.8 ? 'Excellent' : ratio > 0.6 ? 'Good' : ratio > 0.3 ? 'Developing' : 'Initial';

    domains.push({
      id: domainId,
      name: domainElement ? (domainElement.fields.name as string) ?? domainId : domainId,
      description,
      color: palette[colorIdx % palette.length],
      maturity,
      counts,
      totalElements: elements.length,
      diagramCount: 0,  // Diagrams are a separate concern
    });
    colorIdx++;
  }

  // Sort by element count descending
  domains.sort((a, b) => b.totalElements - a.totalElements);
  return domains;
}

// ─────────────────────────────────────────────────────────────
// 8. Query Helpers
// ─────────────────────────────────────────────────────────────

/**
 * Get all elements of a specific type.
 */
export function getElementsByType(graph: RegistryGraph, typeKey: string): RegistryElement[] {
  return graph.indexes.byType.get(typeKey) ?? [];
}

/**
 * Get an element by its ID (filename slug).
 */
export function getElementById(graph: RegistryGraph, id: string): RegistryElement | undefined {
  return graph.elements.get(id);
}

/**
 * Get all edges coming out of an element.
 */
export function getOutgoingEdges(graph: RegistryGraph, elementId: string): RegistryEdge[] {
  return graph.indexes.edgesBySource.get(elementId) ?? [];
}

/**
 * Get all edges pointing into an element.
 */
export function getIncomingEdges(graph: RegistryGraph, elementId: string): RegistryEdge[] {
  return graph.indexes.edgesByTarget.get(elementId) ?? [];
}

/**
 * Get direct neighbors (parents + children) of an element.
 */
export function getNeighbors(
  graph: RegistryGraph,
  elementId: string
): { parents: RegistryElement[]; children: RegistryElement[] } {
  const parents: RegistryElement[] = [];
  const children: RegistryElement[] = [];

  for (const edge of getIncomingEdges(graph, elementId)) {
    const el = graph.elements.get(edge.sourceId);
    if (el) parents.push(el);
  }

  for (const edge of getOutgoingEdges(graph, elementId)) {
    const el = graph.elements.get(edge.targetId);
    if (el) children.push(el);
  }

  return { parents, children };
}

/**
 * Get all orphan elements (no incoming or outgoing edges).
 */
export function getOrphans(graph: RegistryGraph): RegistryElement[] {
  return Array.from(graph.elements.values()).filter((el) => !el.health.isConnected);
}

/**
 * Get a health summary for the entire registry.
 */
export function getRegistryHealthSummary(graph: RegistryGraph): {
  total: number;
  healthy: number;
  connected: number;
  orphans: number;
  brokenRefs: number;
  missingType: number;
  byType: Record<string, { total: number; healthy: number; connected: number }>;
} {
  let healthy = 0;
  let connected = 0;
  let orphans = 0;
  let brokenRefs = 0;
  let missingType = 0;
  const byType: Record<string, { total: number; healthy: number; connected: number }> = {};

  for (const el of graph.elements.values()) {
    // Per-type stats
    const typeStats = byType[el.elementType] ?? { total: 0, healthy: 0, connected: 0 };
    typeStats.total++;

    if (el.health.hasRequiredFields && el.health.hasType) {
      healthy++;
      typeStats.healthy++;
    }
    if (el.health.isConnected) {
      connected++;
      typeStats.connected++;
    }
    if (!el.health.isConnected) orphans++;
    if (el.health.hasBrokenRefs) brokenRefs++;
    if (!el.health.hasType) missingType++;

    byType[el.elementType] = typeStats;
  }

  return {
    total: graph.elements.size,
    healthy,
    connected,
    orphans,
    brokenRefs,
    missingType,
    byType,
  };
}

// ─────────────────────────────────────────────────────────────
// 9. Schema-Derived Helpers (zero hardcoding)
// ─────────────────────────────────────────────────────────────
// These functions derive UI labels, badges, and metadata purely
// from the mapping YAML — so any new types, relationships, or
// layers work out of the box without touching code.

/**
 * Get the layer metadata from the mapping YAML.
 * Returns the same shape as the old hardcoded LAYER_META.
 */
export function getLayerMeta(mapping: RegistryMapping): Record<string, { name: string; color: string; bg: string; icon: string }> {
  return mapping.layers ?? {};
}

/**
 * Get the site branding config from the mapping YAML.
 */
export function getSiteConfig(mapping: RegistryMapping): { name: string; description: string; logo_text: string } {
  return mapping.site ?? { name: 'Architecture Catalog', description: 'Enterprise architecture registry', logo_text: 'A' };
}

/**
 * Get the badge category for an element type key.
 * Falls back to 'default' for unmapped types.
 */
export function getTypeBadge(mapping: RegistryMapping, typeKey: string): string {
  return mapping.elements[typeKey]?.badge_category ?? 'default';
}

/**
 * Build a type-key → badge-category map from the mapping YAML.
 * Used by pages that need the full lookup table.
 */
export function buildTypeBadgeMap(mapping: RegistryMapping): Record<string, string> {
  const map: Record<string, string> = {};
  for (const [key, def] of Object.entries(mapping.elements)) {
    map[key] = def.badge_category ?? 'default';
  }
  return map;
}

/**
 * Derive a human label for a relationship fieldKey.
 * Uses the ArchiMate type verb + target type label from the mapping.
 * Falls back to prettifying the raw key name.
 */
export function deriveRelFieldLabel(
  fieldKey: string,
  mapping: RegistryMapping,
  direction: 'out' | 'in' = 'out'
): string {
  const relTypes = mapping.relationship_types ?? {};

  // Find which element type defines this relationship key
  for (const typeDef of Object.values(mapping.elements)) {
    const relDef = typeDef.relationships?.[fieldKey];
    if (relDef) {
      const verbDef = relTypes[relDef.type];
      const targetLabel = mapping.elements[relDef.target]?.label ?? relDef.target;
      if (verbDef) {
        const verb = direction === 'out' ? verbDef.outgoing : verbDef.incoming;
        return `${verb} ${targetLabel}`;
      }
      // No verb def — just use target label
      return targetLabel;
    }
  }

  // Fallback: prettify the key
  return fieldKey
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Get ArchiMate relationship type labels from the mapping.
 * Returns the same shape as the old hardcoded REL_TYPE_LABELS.
 */
export function getRelTypelabels(
  mapping: RegistryMapping
): Record<string, { outgoing: string; incoming: string; icon: string }> {
  return mapping.relationship_types ?? {};
}
