/**
 * Shared test fixtures for registry-loader tests.
 *
 * Provides factory functions to build mock RegistryMapping, RawFile,
 * RegistryElement, and RegistryGraph objects for testing without
 * touching the filesystem.
 */

import type {
  RegistryMapping,
  RegistryElement,
  RegistryEdge,
  RegistryGraph,
  ElementTypeDef,
  ElementHealth,
} from '../types';
import type { RawFile } from '../registry-loader';
import { buildGraphIndexes } from '../registry-loader';

/** Minimal valid mapping for tests. */
export function createMockMapping(overrides?: Partial<RegistryMapping>): RegistryMapping {
  return {
    version: '1.0',
    registry_root: 'test-registry',
    site: {
      name: 'Test Catalog',
      description: 'Test description',
      logo_text: 'T',
    },
    layers: {
      application: { name: 'Application', color: '#3b82f6', bg: '#eff6ff', icon: 'A' },
      business: { name: 'Business', color: '#f59e0b', bg: '#fffbeb', icon: 'B' },
    },
    relationship_types: {
      composition: { outgoing: 'Composes', incoming: 'Part of', icon: '◆' },
      realization: { outgoing: 'Realizes', incoming: 'Realized by', icon: '⇢' },
    },
    domain_color_palette: ['#3b82f6', '#10b981', '#f59e0b'],
    elements: {
      component: {
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
          domain: { type: 'string', required: false, label: 'Domain' },
          owner: { type: 'string', required: false, label: 'Owner' },
          status: { type: 'string', required: false, label: 'Status' },
        },
        relationships: {
          realizes_services: {
            target: 'service',
            type: 'realization',
            cardinality: 'many',
            resolve_by: 'slug',
            inverse: null,
            required: false,
          },
        },
      },
      service: {
        label: 'Service',
        layer: 'business',
        folder: '1-business/services',
        id_field: 'name',
        archimate: 'business-service',
        graph_rank: 3,
        icon: '⚙️',
        badge_category: 'service',
        fields: {
          type: { type: 'string', required: true, label: 'Type' },
          name: { type: 'string', required: true, label: 'Name' },
          description: { type: 'string', required: false, label: 'Description' },
          domain: { type: 'string', required: false, label: 'Domain' },
          status: { type: 'string', required: false, label: 'Status' },
        },
        relationships: {},
      },
      domain: {
        label: 'Domain',
        layer: 'application',
        folder: '3-application/domains',
        id_field: 'name',
        archimate: '',
        graph_rank: 0,
        icon: '🏢',
        badge_category: 'domain',
        fields: {
          type: { type: 'string', required: true, label: 'Type' },
          name: { type: 'string', required: true, label: 'Name' },
          description: { type: 'string', required: false, label: 'Description' },
          domain: { type: 'string', required: false, label: 'Domain' },
        },
        relationships: {},
      },
    },
    ...overrides,
  };
}

/** Create a mock RawFile for index-building tests. */
export function createMockRawFile(overrides?: Partial<RawFile>): RawFile {
  return {
    slug: 'test-component',
    path: '/test/test-component.md',
    relativePath: '3-application/components/test-component.md',
    frontmatter: { type: 'component', name: 'Test Component', domain: 'customer-management' },
    body: '',
    ...overrides,
  };
}

/** Create a mock RegistryElement for graph-index tests. */
export function createMockElement(overrides?: Partial<RegistryElement>): RegistryElement {
  return {
    id: 'component--test-component',
    elementType: 'component',
    typeLabel: 'Component',
    layer: 'application',
    archimate: 'application-component',
    graphRank: 2,
    icon: '🧩',
    fields: {
      type: 'component',
      name: 'Test Component',
      description: 'A test component',
      domain: 'customer-management',
      owner: 'Team A',
      status: 'active',
    },
    relationships: [],
    sourcePath: '3-application/components/test-component.md',
    body: '',
    health: {
      hasRequiredFields: true,
      missingFields: [],
      isConnected: false,
      hasBrokenRefs: false,
      brokenRefs: [],
      hasType: true,
    },
    ...overrides,
  };
}

/** Build a RegistryGraph from elements and edges (convenience). */
export function createMockGraph(
  elements: RegistryElement[],
  edges: RegistryEdge[] = [],
  mapping?: RegistryMapping,
): RegistryGraph {
  const elementMap = new Map<string, RegistryElement>();
  for (const el of elements) {
    elementMap.set(el.id, el);
  }
  return {
    elements: elementMap,
    edges,
    indexes: buildGraphIndexes(elementMap, edges),
    mapping: mapping ?? createMockMapping(),
  };
}
