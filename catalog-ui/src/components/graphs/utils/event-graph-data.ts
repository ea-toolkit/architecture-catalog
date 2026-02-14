// catalog-ui/src/components/graphs/utils/event-graph-data.ts
// Transform EventFlow data → ReactFlow nodes/edges for event flow visualization
// Layout: Publishers (left) → Events (center) → Consumers (right)

import type { Node, Edge } from '@xyflow/react';
import type { EventFlow } from '../../../data/registry';
import { NODE_STYLES, getNodeStyle } from './colors';

// Event flow edge colors
const PUBLISH_COLOR = '#3b82f6';  // Blue
const CONSUME_COLOR = '#10b981';  // Green

/**
 * Build ReactFlow nodes and edges from an EventFlow.
 * Services that publish are on the left, events in the center,
 * services that consume are on the right.
 */
export function buildEventFlowGraph(
  eventFlow: EventFlow,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Determine which services publish vs consume
  const publisherIds = new Set<string>();
  const consumerIds = new Set<string>();

  for (const edge of eventFlow.edges) {
    if (edge.type === 'publishes') publisherIds.add(edge.serviceId);
    if (edge.type === 'consumes') consumerIds.add(edge.serviceId);
  }

  // Create service nodes
  for (const svc of eventFlow.services) {
    const isPublisher = publisherIds.has(svc.id);
    const isConsumer = consumerIds.has(svc.id);
    const style = getNodeStyle('software_subsystem', { bg: '#ecfdf5', border: '#6ee7b7' });

    // Rank determines position: publishers left (0), both (0), consumers right (2)
    let rank = 0;
    if (isConsumer && !isPublisher) rank = 2;

    nodes.push({
      id: svc.id,
      type: 'baseNode',
      position: { x: 0, y: 0 },
      data: {
        label: svc.name,
        type: 'service',
        elementType: eventFlow.serviceLabel,
        catalogUrl: `/catalog/${svc.id}`,
        status: svc.status,
        mappingIcon: NODE_STYLES['software_subsystem']?.icon ?? 'Sub',
        style: svc.isCrossDomain
          ? { ...style, borderStyle: 'dashed' }
          : style,
        rank,
        crossDomain: svc.isCrossDomain ? svc.domain : undefined,
      },
    });
  }

  // Create event nodes (rank 1 — center)
  for (const evt of eventFlow.events) {
    const style = getNodeStyle('domain_event', { bg: '#fef2f2', border: '#ef4444' });

    nodes.push({
      id: evt.id,
      type: 'baseNode',
      position: { x: 0, y: 0 },
      data: {
        label: evt.name,
        type: 'event',
        elementType: eventFlow.eventLabel,
        catalogUrl: `/catalog/${evt.id}`,
        status: evt.status,
        mappingIcon: NODE_STYLES['domain_event']?.icon ?? 'Ev',
        style,
        rank: 1,
        eventFormat: evt.format,
      },
    });
  }

  // Create edges
  for (const flowEdge of eventFlow.edges) {
    const isPublish = flowEdge.type === 'publishes';
    const edgeId = `${flowEdge.serviceId}--${flowEdge.type}--${flowEdge.eventId}`;

    edges.push({
      id: edgeId,
      // Publish: service → event (left to center)
      // Consume: event → service (center to right)
      source: isPublish ? flowEdge.serviceId : flowEdge.eventId,
      target: isPublish ? flowEdge.eventId : flowEdge.serviceId,
      type: 'eventFlowEdge',
      animated: true,
      data: {
        relationship: flowEdge.type,
        label: isPublish ? 'publishes' : 'consumes',
        color: isPublish ? PUBLISH_COLOR : CONSUME_COLOR,
      },
    });
  }

  return { nodes, edges };
}
