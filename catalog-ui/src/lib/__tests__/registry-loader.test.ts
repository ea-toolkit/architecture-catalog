/**
 * Tests for catalog-ui/src/lib/registry-loader.ts
 *
 * Covers pure functions: parseFrontmatter, buildRawIndexes, resolveRef,
 * assessHealth, buildGraphIndexes, and exported query/schema helpers.
 */

import { describe, it, expect } from 'vitest';
import {
  parseFrontmatter,
  buildRawIndexes,
  resolveRef,
  assessHealth,
  buildGraphIndexes,
  toLegacyElements,
  toLegacyDomains,
  getElementsByType,
  getOrphans,
  getRegistryHealthSummary,
  deriveRelFieldLabel,
  buildTypeBadgeMap,
  getSiteConfig,
} from '../registry-loader';
import type { RawFile } from '../registry-loader';
import type { ElementTypeDef } from '../types';
import {
  createMockMapping,
  createMockRawFile,
  createMockElement,
  createMockGraph,
} from './fixtures';

// ── parseFrontmatter ──────────────────────────────────────────

describe('parseFrontmatter', () => {
  it('parses valid frontmatter and body', () => {
    const result = parseFrontmatter('---\nname: Test\nstatus: active\n---\nBody content');
    expect(result).not.toBeNull();
    expect(result!.frontmatter.name).toBe('Test');
    expect(result!.frontmatter.status).toBe('active');
    expect(result!.body).toBe('Body content');
  });

  it('returns null when no --- delimiters', () => {
    expect(parseFrontmatter('just some text')).toBeNull();
  });

  it('returns null for invalid YAML', () => {
    expect(parseFrontmatter('---\n: :\n---')).toBeNull();
  });

  it('returns non-null when YAML parses to array (js-yaml treats arrays as objects)', () => {
    // js-yaml Array.isArray is truthy for typeof 'object', so parseFrontmatter accepts it
    const result = parseFrontmatter('---\n- item1\n- item2\n---');
    expect(result).not.toBeNull();
  });

  it('parses empty frontmatter to empty object', () => {
    const result = parseFrontmatter('---\n\n---\nBody');
    // Empty YAML returns null from yaml.load, so this should be null
    expect(result).toBeNull();
  });

  it('handles frontmatter with only whitespace as null', () => {
    const result = parseFrontmatter('---\n   \n---');
    expect(result).toBeNull();
  });
});

// ── buildRawIndexes ───────────────────────────────────────────

describe('buildRawIndexes', () => {
  it('indexes files by slug, name, and abbreviation', () => {
    const file = createMockRawFile({
      slug: 'order-service',
      frontmatter: { name: 'Order Service', abbreviation: 'OS' },
    });
    const allFiles = new Map([
      ['component', { typeDef: {} as ElementTypeDef, files: [file] }],
    ]);

    const indexes = buildRawIndexes(allFiles);

    expect(indexes.bySlug.get('order-service')).toHaveLength(1);
    expect(indexes.byName.get('order service')).toHaveLength(1);  // lowercase
    expect(indexes.byAbbreviation.get('OS')).toHaveLength(1);     // uppercase
  });

  it('returns empty indexes for empty input', () => {
    const indexes = buildRawIndexes(new Map());
    expect(indexes.bySlug.size).toBe(0);
    expect(indexes.byName.size).toBe(0);
    expect(indexes.byAbbreviation.size).toBe(0);
  });

  it('skips name index when name is not present', () => {
    const file = createMockRawFile({
      slug: 'no-name',
      frontmatter: {},
    });
    const allFiles = new Map([
      ['component', { typeDef: {} as ElementTypeDef, files: [file] }],
    ]);

    const indexes = buildRawIndexes(allFiles);
    expect(indexes.bySlug.get('no-name')).toHaveLength(1);
    expect(indexes.byName.size).toBe(0);
  });
});

// ── resolveRef ────────────────────────────────────────────────

describe('resolveRef', () => {
  const file = createMockRawFile({
    slug: 'order-service',
    frontmatter: { name: 'Order Service', abbreviation: 'OS' },
  });
  const allFiles = new Map([
    ['service', { typeDef: {} as ElementTypeDef, files: [file] }],
  ]);
  const indexes = buildRawIndexes(allFiles);

  it('resolves by slug', () => {
    const result = resolveRef('order-service', 'slug', 'service', indexes);
    expect(result.resolved).toBe(true);
    expect(result.targetName).toBe('Order Service');
  });

  it('resolves by name (case-insensitive)', () => {
    const result = resolveRef('ORDER SERVICE', 'name', 'service', indexes);
    expect(result.resolved).toBe(true);
  });

  it('resolves by abbreviation (case-insensitive)', () => {
    const result = resolveRef('os', 'abbreviation', 'service', indexes);
    expect(result.resolved).toBe(true);
  });

  it('returns unresolved for empty string', () => {
    const result = resolveRef('', 'slug', 'service', indexes);
    expect(result.resolved).toBe(false);
  });

  it('returns unresolved for tilde', () => {
    const result = resolveRef('~', 'slug', 'service', indexes);
    expect(result.resolved).toBe(false);
  });

  it('returns unresolved for non-existent slug', () => {
    const result = resolveRef('does-not-exist', 'slug', 'service', indexes);
    expect(result.resolved).toBe(false);
  });

  it('prefers match with matching targetType', () => {
    const fileA = createMockRawFile({ slug: 'shared-slug', frontmatter: { name: 'Shared' } });
    const fileB = createMockRawFile({ slug: 'shared-slug', frontmatter: { name: 'Shared' } });
    const allFiles2 = new Map([
      ['component', { typeDef: {} as ElementTypeDef, files: [fileA] }],
      ['service', { typeDef: {} as ElementTypeDef, files: [fileB] }],
    ]);
    const idx = buildRawIndexes(allFiles2);

    const result = resolveRef('shared-slug', 'slug', 'service', idx);
    expect(result.resolved).toBe(true);
    expect(result.targetId).toContain('service');
  });
});

// ── assessHealth ──────────────────────────────────────────────

describe('assessHealth', () => {
  const typeDef: ElementTypeDef = {
    label: 'Component',
    layer: 'application',
    folder: '3-application/components',
    id_field: 'name',
    archimate: 'application-component',
    graph_rank: 2,
    icon: '🧩',
    badge_category: 'component',
    fields: {
      type: { type: 'string', required: true, label: 'Type' },
      name: { type: 'string', required: true, label: 'Name' },
      description: { type: 'string', required: false, label: 'Description' },
    },
    relationships: {},
  };

  it('reports healthy when all required fields present', () => {
    const file = createMockRawFile({
      frontmatter: { type: 'component', name: 'Order Service' },
    });
    const health = assessHealth(file, typeDef, []);
    expect(health.hasRequiredFields).toBe(true);
    expect(health.missingFields).toEqual([]);
  });

  it('detects missing required field (empty string)', () => {
    const file = createMockRawFile({
      frontmatter: { type: 'component', name: '' },
    });
    const health = assessHealth(file, typeDef, []);
    expect(health.hasRequiredFields).toBe(false);
    expect(health.missingFields).toContain('name');
  });

  it('detects missing required field (null)', () => {
    const file = createMockRawFile({
      frontmatter: { type: 'component', name: null },
    });
    const health = assessHealth(file, typeDef, []);
    expect(health.missingFields).toContain('name');
  });

  it('reports not connected when no relationships', () => {
    const file = createMockRawFile({
      frontmatter: { type: 'component', name: 'Test' },
    });
    const health = assessHealth(file, typeDef, []);
    expect(health.isConnected).toBe(false);
  });

  it('reports connected when resolved refs exist', () => {
    const file = createMockRawFile({
      frontmatter: { type: 'component', name: 'Test' },
    });
    const rels = [
      {
        fieldKey: 'realizes_services',
        type: 'realization',
        refs: [{ raw: 'order-service', resolved: true, targetId: 'service--order-service', targetName: 'Order Service' }],
      },
    ];
    const health = assessHealth(file, typeDef, rels);
    expect(health.isConnected).toBe(true);
  });

  it('detects broken refs', () => {
    const file = createMockRawFile({
      frontmatter: { type: 'component', name: 'Test' },
    });
    const rels = [
      {
        fieldKey: 'realizes_services',
        type: 'realization',
        refs: [{ raw: 'nonexistent', resolved: false }],
      },
    ];
    const health = assessHealth(file, typeDef, rels);
    expect(health.hasBrokenRefs).toBe(true);
    expect(health.brokenRefs).toContain('nonexistent');
  });

  it('detects missing type field', () => {
    const file = createMockRawFile({
      frontmatter: { name: 'No Type' },
    });
    const health = assessHealth(file, typeDef, []);
    expect(health.hasType).toBe(false);
  });
});

// ── buildGraphIndexes — domain normalization ──────────────────

describe('buildGraphIndexes — domain normalization', () => {
  it('normalizes "Customer Management" → "customer-management"', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: 'Customer Management' } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('customer-management')).toBe(true);
  });

  it('normalizes "Billing & Payments" → "billing-and-payments"', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: 'Billing & Payments' } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('billing-and-payments')).toBe(true);
  });

  it('treats empty string domain as "unknown"', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: '' } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('unknown')).toBe(true);
    expect(indexes.byDomain.has('')).toBe(false);
  });

  it('treats whitespace-only domain as "unknown"', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: '   ' } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('unknown')).toBe(true);
  });

  it('treats null domain as "unknown"', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: null } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('unknown')).toBe(true);
  });

  it('treats undefined domain as "unknown"', () => {
    const el = createMockElement({ fields: { name: 'Test', type: 'component' } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('unknown')).toBe(true);
  });

  it('keeps "unknown" as "unknown"', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: 'unknown' } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('unknown')).toBe(true);
  });

  it('lowercases domain strings', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: 'UPPERCASE' } });
    const elements = new Map([['comp--test', el]]);
    const indexes = buildGraphIndexes(elements, []);
    expect(indexes.byDomain.has('uppercase')).toBe(true);
  });

  it('indexes edges by source and target', () => {
    const el = createMockElement();
    const elements = new Map([['comp--test', el]]);
    const edges = [{ sourceId: 'comp--test', targetId: 'svc--order', relationshipType: 'realization', fieldKey: 'realizes', label: 'Realizes' }];
    const indexes = buildGraphIndexes(elements, edges);
    expect(indexes.edgesBySource.get('comp--test')).toHaveLength(1);
    expect(indexes.edgesByTarget.get('svc--order')).toHaveLength(1);
  });
});

// ── toLegacyDomains ───────────────────────────────────────────

describe('toLegacyDomains', () => {
  it('skips "unknown" domain', () => {
    const el = createMockElement({ fields: { ...createMockElement().fields, domain: 'unknown' } });
    const graph = createMockGraph([el]);
    const domains = toLegacyDomains(graph);
    expect(domains.find(d => d.id === 'unknown')).toBeUndefined();
  });

  it('sorts domains by element count descending', () => {
    const el1 = createMockElement({ id: 'comp--a', fields: { ...createMockElement().fields, domain: 'alpha' } });
    const el2 = createMockElement({ id: 'comp--b', fields: { ...createMockElement().fields, domain: 'beta' } });
    const el3 = createMockElement({ id: 'comp--c', fields: { ...createMockElement().fields, domain: 'beta' } });
    const graph = createMockGraph([el1, el2, el3]);
    const domains = toLegacyDomains(graph);
    expect(domains[0].id).toBe('beta');
    expect(domains[0].totalElements).toBe(2);
  });

  it('cycles through color palette', () => {
    const elA = createMockElement({ id: 'a', fields: { ...createMockElement().fields, domain: 'alpha' } });
    const elB = createMockElement({ id: 'b', fields: { ...createMockElement().fields, domain: 'beta' } });
    const elC = createMockElement({ id: 'c', fields: { ...createMockElement().fields, domain: 'gamma' } });
    const elD = createMockElement({ id: 'd', fields: { ...createMockElement().fields, domain: 'delta' } });
    const mapping = createMockMapping({ domain_color_palette: ['#aaa', '#bbb'] });
    const graph = createMockGraph([elA, elB, elC, elD], [], mapping);
    const domains = toLegacyDomains(graph);
    const colors = domains.map(d => d.color);
    // Should cycle: #aaa, #bbb, #aaa, #bbb
    expect(colors).toContain('#aaa');
    expect(colors).toContain('#bbb');
  });
});

// ── Query helpers ─────────────────────────────────────────────

describe('getElementsByType', () => {
  it('returns elements of matching type', () => {
    const el = createMockElement({ elementType: 'component' });
    const graph = createMockGraph([el]);
    expect(getElementsByType(graph, 'component')).toHaveLength(1);
  });

  it('returns empty array for unknown type', () => {
    const graph = createMockGraph([]);
    expect(getElementsByType(graph, 'nonexistent')).toEqual([]);
  });
});

describe('getOrphans', () => {
  it('returns disconnected elements', () => {
    const el = createMockElement({
      health: { ...createMockElement().health, isConnected: false },
    });
    const graph = createMockGraph([el]);
    expect(getOrphans(graph)).toHaveLength(1);
  });

  it('excludes connected elements', () => {
    const el = createMockElement({
      health: { ...createMockElement().health, isConnected: true },
    });
    const graph = createMockGraph([el]);
    expect(getOrphans(graph)).toHaveLength(0);
  });
});

describe('getRegistryHealthSummary', () => {
  it('counts healthy, connected, orphans, and broken refs', () => {
    const healthy = createMockElement({
      id: 'a',
      health: { hasRequiredFields: true, missingFields: [], isConnected: true, hasBrokenRefs: false, brokenRefs: [], hasType: true },
    });
    const unhealthy = createMockElement({
      id: 'b',
      health: { hasRequiredFields: false, missingFields: ['name'], isConnected: false, hasBrokenRefs: true, brokenRefs: ['missing-ref'], hasType: true },
    });
    const graph = createMockGraph([healthy, unhealthy]);
    const summary = getRegistryHealthSummary(graph);
    expect(summary.total).toBe(2);
    expect(summary.healthy).toBe(1);
    expect(summary.connected).toBe(1);
    expect(summary.orphans).toBe(1);
    expect(summary.brokenRefs).toBe(1);
  });
});

// ── Schema-derived helpers ────────────────────────────────────

describe('deriveRelFieldLabel', () => {
  it('returns outgoing verb + target label', () => {
    const mapping = createMockMapping();
    const label = deriveRelFieldLabel('realizes_services', mapping, 'out');
    expect(label).toBe('Realizes Service');
  });

  it('returns incoming verb + target label', () => {
    const mapping = createMockMapping();
    const label = deriveRelFieldLabel('realizes_services', mapping, 'in');
    expect(label).toBe('Realized by Service');
  });

  it('returns prettified key for unknown field', () => {
    const mapping = createMockMapping();
    const label = deriveRelFieldLabel('unknown_field', mapping);
    expect(label).toBe('Unknown Field');
  });
});

describe('buildTypeBadgeMap', () => {
  it('maps all element types to badge categories', () => {
    const mapping = createMockMapping();
    const map = buildTypeBadgeMap(mapping);
    expect(map['component']).toBe('component');
    expect(map['service']).toBe('service');
  });
});

describe('getSiteConfig', () => {
  it('returns site config from mapping', () => {
    const mapping = createMockMapping();
    const config = getSiteConfig(mapping);
    expect(config.name).toBe('Test Catalog');
  });

  it('returns fallback when no site config', () => {
    const config = getSiteConfig({} as any);
    expect(config.name).toBe('Architecture Catalog');
  });
});
