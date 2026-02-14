// catalog-ui/src/lib/event-mapping-loader.ts
// ═══════════════════════════════════════════════════════════════
// Event Mapping Loader
// ═══════════════════════════════════════════════════════════════
//
// Reads the optional models/event-mapping.yaml and resolves
// event-to-service flows by traversing the registry graph.
//
// The event-mapping.yaml bridges vocabulary-agnostic registry
// types to semantic event-flow roles using element type KEYS
// from registry-mapping.yaml.
//
// Auto-traversal: if events connect to services through
// intermediate hops (e.g. event → API → subsystem), the loader
// BFS-traverses to find the nearest ancestor of the target type.
// ═══════════════════════════════════════════════════════════════

import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import yaml from 'js-yaml';
import type { RegistryGraph, RegistryElement, RegistryEdge } from './types';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface EventMappingConfig {
  service_type: string;       // element type key for "service" role
  event_type: string;         // element type key for "event" role
  publishes_field: string;    // relationship fieldKey on events → publishers
  consumes_field: string;     // relationship fieldKey on events → consumers
  service_label?: string;     // optional display override
  event_label?: string;       // optional display override
}

export interface EventNode {
  id: string;
  name: string;
  description: string;
  status: string;
  format: string;
  domain: string;
}

export interface ServiceNode {
  id: string;
  name: string;
  status: string;
  domain: string;
  isCrossDomain: boolean;
}

export interface EventEdge {
  serviceId: string;
  eventId: string;
  type: 'publishes' | 'consumes';
}

export interface EventFlow {
  events: EventNode[];
  services: ServiceNode[];
  edges: EventEdge[];
  serviceLabel: string;
  eventLabel: string;
}

// ─────────────────────────────────────────────────────────────
// Loader
// ─────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = resolve(import.meta.dirname ?? __dirname, '..', '..', '..');

/**
 * Load the event-mapping.yaml config.
 * Returns null if the file doesn't exist (feature is optional).
 */
export function loadEventMapping(): EventMappingConfig | null {
  const configPath = join(WORKSPACE_ROOT, 'models', 'event-mapping.yaml');
  if (!existsSync(configPath)) return null;

  try {
    const raw = readFileSync(configPath, 'utf-8');
    const parsed = yaml.load(raw) as Record<string, unknown>;

    if (!parsed || typeof parsed !== 'object') return null;

    const config: EventMappingConfig = {
      service_type: String(parsed.service_type ?? ''),
      event_type: String(parsed.event_type ?? ''),
      publishes_field: String(parsed.publishes_field ?? ''),
      consumes_field: String(parsed.consumes_field ?? ''),
      service_label: parsed.service_label as string | undefined,
      event_label: parsed.event_label as string | undefined,
    };

    // Validate required fields
    if (!config.service_type || !config.event_type || !config.publishes_field || !config.consumes_field) {
      console.warn('⚠️  event-mapping.yaml is missing required fields (service_type, event_type, publishes_field, consumes_field)');
      return null;
    }

    return config;
  } catch (err) {
    console.warn(`⚠️  Failed to parse event-mapping.yaml: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Graph Traversal — find services through intermediate hops
// ─────────────────────────────────────────────────────────────

/**
 * Given an element, find the nearest ancestor(s) of a target type
 * by BFS-traversing incoming edges (edgesByTarget → who points TO
 * the intermediate element, i.e., the intermediate is a target).
 *
 * The chain is: event --[publishes_field]--> API --[parent_*]--> subsystem
 * In graph terms: event is source, API is target of event's edge.
 * Then API is SOURCE of its parent edge, subsystem is TARGET.
 * So from API we follow edgesBySource to find its parent.
 *
 * Max depth of 3 to avoid infinite loops.
 */
function findAncestorsOfType(
  startId: string,
  targetType: string,
  graph: RegistryGraph,
  maxDepth: number = 3,
): RegistryElement[] {
  const results: RegistryElement[] = [];
  const visited = new Set<string>();

  // BFS queue: [elementId, currentDepth]
  const queue: [string, number][] = [[startId, 0]];

  while (queue.length > 0) {
    const [currentId, depth] = queue.shift()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const element = graph.elements.get(currentId);
    if (!element) continue;

    // Check if this element matches the target type
    if (element.elementType === targetType && currentId !== startId) {
      results.push(element);
      continue; // Don't traverse further past a match
    }

    // Don't go deeper than max
    if (depth >= maxDepth) continue;

    // Follow outgoing edges (element is source → target is parent)
    const outEdges = graph.indexes.edgesBySource.get(currentId) ?? [];
    for (const edge of outEdges) {
      if (!visited.has(edge.targetId)) {
        queue.push([edge.targetId, depth + 1]);
      }
    }
  }

  return results;
}

// ─────────────────────────────────────────────────────────────
// Resolver
// ─────────────────────────────────────────────────────────────

/**
 * Resolve event flows for a specific domain.
 * Returns the events, services, and publish/consume edges.
 */
export function resolveEventFlows(
  graph: RegistryGraph,
  config: EventMappingConfig,
  domainId: string,
): EventFlow | null {
  // Get all events of the configured type in this domain
  const allEventsOfType = graph.indexes.byType.get(config.event_type) ?? [];
  const domainEvents = allEventsOfType.filter(el => {
    const rawDomain = (el.fields.domain as string) ?? '';
    const normalizedDomain = rawDomain.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');
    return normalizedDomain === domainId;
  });

  if (domainEvents.length === 0) return null;

  const eventNodes: EventNode[] = [];
  const serviceMap = new Map<string, ServiceNode>();
  const edges: EventEdge[] = [];

  for (const event of domainEvents) {
    const eventNode: EventNode = {
      id: event.id,
      name: (event.fields.name as string) ?? event.id,
      description: (event.fields.description as string) ?? '',
      status: (event.fields.status as string) ?? 'active',
      format: (event.fields.event_format as string) ?? '',
      domain: domainId,
    };
    eventNodes.push(eventNode);

    // Resolve publishers: follow publishes_field edges from this event
    resolveServiceEdges(
      event,
      config.publishes_field,
      config.service_type,
      'publishes',
      domainId,
      graph,
      serviceMap,
      edges,
    );

    // Resolve consumers: follow consumes_field edges from this event
    resolveServiceEdges(
      event,
      config.consumes_field,
      config.service_type,
      'consumes',
      domainId,
      graph,
      serviceMap,
      edges,
    );
  }

  // Derive labels from mapping YAML or config overrides
  const serviceLabel = config.service_label ?? graph.mapping.elements[config.service_type]?.label ?? 'Service';
  const eventLabel = config.event_label ?? graph.mapping.elements[config.event_type]?.label ?? 'Event';

  return {
    events: eventNodes,
    services: Array.from(serviceMap.values()),
    edges,
    serviceLabel,
    eventLabel,
  };
}

/**
 * For a given event, follow a specific relationship field to find
 * connected services (possibly through intermediate hops).
 */
function resolveServiceEdges(
  event: RegistryElement,
  fieldKey: string,
  serviceType: string,
  edgeType: 'publishes' | 'consumes',
  domainId: string,
  graph: RegistryGraph,
  serviceMap: Map<string, ServiceNode>,
  edges: EventEdge[],
): void {
  // Find edges from this event that match the fieldKey
  const eventEdges = graph.indexes.edgesBySource.get(event.id) ?? [];
  const relevantEdges = eventEdges.filter(e => e.fieldKey === fieldKey);

  for (const edge of relevantEdges) {
    const target = graph.elements.get(edge.targetId);
    if (!target) continue;

    // If the target IS the service type, use it directly
    if (target.elementType === serviceType) {
      addServiceNode(target, serviceType, domainId, graph, serviceMap);
      edges.push({ serviceId: target.id, eventId: event.id, type: edgeType });
      continue;
    }

    // Otherwise, auto-traverse to find service ancestors
    const ancestors = findAncestorsOfType(target.id, serviceType, graph);
    for (const ancestor of ancestors) {
      addServiceNode(ancestor, serviceType, domainId, graph, serviceMap);
      edges.push({ serviceId: ancestor.id, eventId: event.id, type: edgeType });
    }
  }
}

/**
 * Add a service node to the map if not already present.
 */
function addServiceNode(
  element: RegistryElement,
  _serviceType: string,
  domainId: string,
  _graph: RegistryGraph,
  serviceMap: Map<string, ServiceNode>,
): void {
  if (serviceMap.has(element.id)) return;

  const rawDomain = (element.fields.domain as string) ?? '';
  const normalizedDomain = rawDomain.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-');

  serviceMap.set(element.id, {
    id: element.id,
    name: (element.fields.name as string) ?? element.id,
    status: (element.fields.status as string) ?? 'active',
    domain: normalizedDomain,
    isCrossDomain: normalizedDomain !== domainId,
  });
}
