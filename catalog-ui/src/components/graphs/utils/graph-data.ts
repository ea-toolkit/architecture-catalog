// catalog-ui/src/components/graphs/utils/graph-data.ts
// Transform registry data → ReactFlow nodes/edges for domain context maps
// Uses meta-model config for hierarchy and relationship semantics
// Falls back to schema-derived data from registry-mapping.yaml for unknown types

import type { Node, Edge } from '@xyflow/react';
import type { Element, Domain } from '../../../data/registry';
import { NODE_STYLES, getNodeStyle } from './colors';
import {
  getElementRank,
  getRelationshipSemantics,
  normalizeEdgeForLayout,
} from '../../../config/meta-model.config';

/**
 * Helper: get style for an element using schema-derived fallback
 * Known types get rich hand-crafted styles; unknown types get layer-appropriate colors
 */
function getElementStyle(el: Element) {
  return getNodeStyle(el.type, { bg: el.layerBg, border: el.layerColor });
}

/**
 * Helper: get rank for an element using schema-derived fallback
 */
function getElementGraphRank(el: Element) {
  return getElementRank(el.type, el.graphRank);
}

/**
 * Build the full domain context map nodes + edges.
 * Uses meta-model config to determine hierarchy and edge directions.
 */
export function buildDomainGraph(
  domain: Domain,
  elements: Element[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edgeMap = new Map<string, Edge>();

  // Create element lookup maps
  const elementById = new Map(elements.map(e => [e.id, e]));
  const elementIds = new Set(elements.map(e => e.id));

  // 1. Domain node (anchor at rank 0)
  nodes.push({
    id: domain.id,
    type: 'baseNode',
    position: { x: 0, y: 0 },
    data: {
      label: domain.name,
      type: 'domain',
      elementType: 'Architecture Area',
      catalogUrl: `/domains/${domain.id}`,
      color: domain.color,
      style: NODE_STYLES['domain'] ?? { bg: '#f1f5f9', border: '#64748b', text: '#334155', borderStyle: 'solid', borderRadius: '12px', icon: 'D' },
      rank: 0,
    },
  });

  // 2. Element nodes with rank from schema (meta-model override → YAML fallback)
  for (const el of elements) {
    const style = getElementStyle(el);
    const rank = getElementGraphRank(el);

    nodes.push({
      id: el.id,
      type: 'baseNode',
      position: { x: 0, y: 0 },
      data: {
        label: el.name,
        type: el.type,
        elementType: el.typeLabel,
        catalogUrl: `/catalog/${el.id}`,
        status: el.status,
        sourcing: el.sourcing,
        mappingIcon: el.mappingIcon,
        style,
        rank,
      },
    });
  }

  // 3. Build edges with normalized directions for layout
  const connectedElements = new Set<string>();

  for (const el of elements) {
    for (const rel of el.relationships) {
      // Only add edge if target exists in this domain's elements
      if (!elementIds.has(rel.target)) continue;

      const targetEl = elementById.get(rel.target);
      if (!targetEl) continue;

      // Get relationship semantics from config
      const semantics = getRelationshipSemantics(rel.type);

      // Normalize edge direction for proper dagre layout
      const normalized = normalizeEdgeForLayout(
        el.id,
        el.type,
        rel.target,
        targetEl.type,
        rel.type
      );

      // Create unique edge ID (use original direction for uniqueness)
      const edgeId = `${el.id}--${rel.type}--${rel.target}`;

      if (!edgeMap.has(edgeId)) {
        edgeMap.set(edgeId, {
          id: edgeId,
          source: normalized.source,
          target: normalized.target,
          type: 'relationshipEdge',
          animated: true,
          data: {
            relationship: rel.type,
            label: semantics.label,
            flipped: normalized.flipped,
          },
        });

        // Track both ends as connected
        connectedElements.add(el.id);
        connectedElements.add(rel.target);
      }
    }
  }

  // 4. Connect domain to immediate children (vocabulary-agnostic)
  // Auto-connect unconnected rank-1 elements to the domain anchor using composition
  const targetsWithIncoming = new Set(
    Array.from(edgeMap.values()).map(e => e.target)
  );

  for (const el of elements) {
    const rank = getElementGraphRank(el);

    // Connect domain to rank 1 elements that have no other incoming edges
    if (rank === 1 && !targetsWithIncoming.has(el.id)) {
      const edgeId = `${domain.id}--composition--${el.id}`;
      edgeMap.set(edgeId, {
        id: edgeId,
        source: domain.id,
        target: el.id,
        type: 'relationshipEdge',
        animated: true,
        data: {
          relationship: 'composition',
          label: 'contains',
        },
      });
    }
  }

  return { nodes, edges: Array.from(edgeMap.values()) };
}

/**
 * Build a focus mode graph: center node + immediate parents + immediate children.
 */
export function buildFocusGraph(
  centerId: string,
  allNodes: Node[],
  allEdges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
  const incomingEdges = allEdges.filter(e => e.target === centerId);
  const outgoingEdges = allEdges.filter(e => e.source === centerId);

  const parentIds = incomingEdges.map(e => e.source);
  const childIds = outgoingEdges.map(e => e.target);
  const relevantIds = new Set([centerId, ...parentIds, ...childIds]);

  const focusNodes = allNodes
    .filter(n => relevantIds.has(n.id))
    .map(n => ({
      ...n,
      position: { x: 0, y: 0 }, // Reset for re-layout
      data: {
        ...n.data,
        isFocusCenter: n.id === centerId,
      },
    }));

  const focusEdges = [...incomingEdges, ...outgoingEdges].map(e => ({
    ...e,
    id: `focus-${e.id}`, // Prefix to avoid id collisions
  }));

  return { nodes: focusNodes, edges: focusEdges };
}

/**
 * Build element context graph: the element + all direct relationships.
 * Used on /catalog/[id] page.
 */
export function buildElementGraph(
  element: Element,
  allElements: Element[]
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const addedNodes = new Set<string>();

  // Create lookup map
  const elementById = new Map(allElements.map(e => [e.id, e]));

  // Center node
  const style = getElementStyle(element);
  const rank = getElementGraphRank(element);

  nodes.push({
    id: element.id,
    type: 'baseNode',
    position: { x: 0, y: 0 },
    data: {
      label: element.name,
      type: element.type,
      elementType: element.typeLabel,
      catalogUrl: `/catalog/${element.id}`,
      status: element.status,
      makeBuy: element.make_or_buy,
      mappingIcon: element.mappingIcon,
      style,
      rank,
      isFocusCenter: true,
    },
  });
  addedNodes.add(element.id);

  // Outgoing relationships (this element → target)
  for (const rel of element.relationships) {
    const targetEl = elementById.get(rel.target);
    const tStyle = targetEl ? getElementStyle(targetEl) : getNodeStyle('_unknown');
    const tRank = targetEl ? getElementGraphRank(targetEl) : 1;
    const semantics = getRelationshipSemantics(rel.type);

    if (!addedNodes.has(rel.target)) {
      nodes.push({
        id: rel.target,
        type: 'baseNode',
        position: { x: 0, y: 0 },
        data: {
          label: rel.targetName,
          type: targetEl?.type || 'unknown',
          elementType: targetEl?.typeLabel || 'Element',
          catalogUrl: `/catalog/${rel.target}`,
          status: targetEl?.status,
          sourcing: targetEl?.sourcing,
          mappingIcon: targetEl?.mappingIcon,
          style: tStyle,
          rank: tRank,
        },
      });
      addedNodes.add(rel.target);
    }

    // Normalize edge direction based on meta-model
    const normalized = normalizeEdgeForLayout(
      element.id,
      element.type,
      rel.target,
      targetEl?.type || 'unknown',
      rel.type
    );

    edges.push({
      id: `${element.id}--${rel.type}--${rel.target}`,
      source: normalized.source,
      target: normalized.target,
      type: 'relationshipEdge',
      animated: true,
      data: {
        relationship: rel.type,
        label: semantics.label,
        flipped: normalized.flipped,
      },
    });
  }

  // Incoming relationships (other elements → this element)
  for (const other of allElements) {
    if (other.id === element.id) continue;

    for (const rel of other.relationships) {
      if (rel.target === element.id) {
        const oStyle = getElementStyle(other);
        const oRank = getElementGraphRank(other);
        const semantics = getRelationshipSemantics(rel.type);

        if (!addedNodes.has(other.id)) {
          nodes.push({
            id: other.id,
            type: 'baseNode',
            position: { x: 0, y: 0 },
            data: {
              label: other.name,
              type: other.type,
              elementType: other.typeLabel,
              catalogUrl: `/catalog/${other.id}`,
              status: other.status,
              sourcing: other.sourcing,
              mappingIcon: other.mappingIcon,
              style: oStyle,
              rank: oRank,
            },
          });
          addedNodes.add(other.id);
        }

        // Normalize edge direction based on meta-model
        const normalized = normalizeEdgeForLayout(
          other.id,
          other.type,
          element.id,
          element.type,
          rel.type
        );

        edges.push({
          id: `${other.id}--${rel.type}--${element.id}`,
          source: normalized.source,
          target: normalized.target,
          type: 'relationshipEdge',
          animated: true,
          data: {
            relationship: rel.type,
            label: semantics.label,
            flipped: normalized.flipped,
          },
        });
      }
    }
  }

  return { nodes, edges };
}
