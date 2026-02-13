// catalog-ui/src/components/graphs/ElementContextGraph.tsx
// Small context graph for element detail pages (/catalog/[id])

import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import BaseNode from './nodes/BaseNode';
import RelationshipEdge, { EdgeMarkerDefs } from './edges/RelationshipEdge';
import { applyDagreLayout } from './utils/layout';
import { buildElementGraph } from './utils/graph-data';
import type { Element } from '../../data/registry';

const nodeTypes = {
  baseNode: BaseNode,
};

const edgeTypes = {
  relationshipEdge: RelationshipEdge,
};

interface ElementContextGraphProps {
  element: Element;
  allElements: Element[];
  height?: number;
}

function ElementContextGraphInner({ element, allElements, height = 350 }: ElementContextGraphProps) {
  const { fitView } = useReactFlow();
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [hasRelationships, setHasRelationships] = useState(true);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const { nodes: rawNodes, edges: rawEdges } = buildElementGraph(element, allElements);
    
    if (rawNodes.length <= 1) {
      setHasRelationships(false);
      setIsLayoutReady(true);
      return;
    }
    
    const layouted = applyDagreLayout(rawNodes, rawEdges, { 
      direction: 'LR', 
      ranksep: 150, 
      nodesep: 40,
    });
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setHasRelationships(true);
    setIsLayoutReady(true);
  }, [element, allElements, setNodes, setEdges]);

  useEffect(() => {
    if (isLayoutReady && hasRelationships) {
      const timer = setTimeout(() => fitView({ padding: 0.2 }), 100);
      return () => clearTimeout(timer);
    }
  }, [isLayoutReady, hasRelationships, fitView]);

  // Click node to navigate to its catalog page
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    // Don't navigate if clicking on the doc icon link
    if ((event.target as HTMLElement).closest('a')) return;
    const url = (node.data as any)?.catalogUrl;
    if (url) window.location.href = url;
  }, []);

  if (!isLayoutReady) {
    return (
      <div style={{
        width: '100%',
        height: height,
        background: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: 14,
      }}>
        Loading...
      </div>
    );
  }

  if (!hasRelationships) {
    return (
      <div style={{
        width: '100%',
        height: height,
        background: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: 14,
      }}>
        No direct relationships defined
      </div>
    );
  }

  return (
    <div style={{ 
      width: '100%', 
      height: height, 
      background: '#fafafa', 
      borderRadius: 8, 
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
    }}>
      <EdgeMarkerDefs />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnDrag
        zoomOnScroll
      >
        <Background color="#e2e8f0" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}

export default function ElementContextGraph(props: ElementContextGraphProps) {
  return (
    <ReactFlowProvider>
      <ElementContextGraphInner {...props} />
    </ReactFlowProvider>
  );
}
