// catalog-ui/src/components/graphs/DomainContextMap.tsx
// Full domain context map with ReactFlow - used on /domains/[id] page

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  type Node,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import BaseNode from './nodes/BaseNode';
import ArchimateEdge, { EdgeMarkerDefs } from './edges/ArchimateEdge';
import FocusModeModal from './FocusModeModal';
import { applyDagreLayout } from './utils/layout';
import { buildDomainGraph } from './utils/graph-data';
import { NODE_STYLES } from './utils/colors';
import type { Domain, Element } from '../../data/registry';

// Custom node and edge types
const nodeTypes = {
  baseNode: BaseNode,
};

const edgeTypes = {
  archimateEdge: ArchimateEdge,
};

interface DomainContextMapProps {
  domain: Domain;
  elements: Element[];
}

function DomainContextMapInner({ domain, elements }: DomainContextMapProps) {
  const { fitView } = useReactFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  
  // Focus mode state - completely separate from main graph
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);

  // Build and layout graph on mount
  useEffect(() => {
    const { nodes: rawNodes, edges: rawEdges } = buildDomainGraph(domain, elements);
    const layouted = applyDagreLayout(rawNodes, rawEdges, { direction: 'LR', ranksep: 200, nodesep: 60 });
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setIsLayoutReady(true);
  }, [domain, elements, setNodes, setEdges]);

  // Fit view when layout is ready
  useEffect(() => {
    if (isLayoutReady) {
      const timer = setTimeout(() => fitView({ padding: 0.15 }), 100);
      return () => clearTimeout(timer);
    }
  }, [isLayoutReady, fitView]);

  // Handle node click - open focus mode
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    // Don't trigger focus mode if clicking on doc icon
    if ((event.target as HTMLElement).closest('a')) return;
    
    setFocusNodeId(node.id);
    setShowFocusMode(true);
  }, []);

  // Close focus mode
  const closeFocusMode = useCallback(() => {
    setShowFocusMode(false);
    setFocusNodeId(null);
  }, []);

  // Legend items from node types in the graph
  const legendItems = useMemo(() => {
    const types = new Set(elements.map(e => e.type));
    types.add('domain');
    return Array.from(types).map(type => ({
      type,
      style: NODE_STYLES[type] || NODE_STYLES['logical_component'],
      label: type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    }));
  }, [elements]);

  if (!isLayoutReady) {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 500, background: '#fafafa', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading graph...
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '100%', height: '100%', minHeight: 500, position: 'relative', background: '#fafafa', borderRadius: 12, overflow: 'hidden' }}>
        <EdgeMarkerDefs />
        
        {/* Main Domain Map */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e2e8f0" gap={20} />
          <Controls position="top-left" showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              const style = (node.data as any)?.style;
              return style?.border || '#94a3b8';
            }}
            maskColor="rgba(0,0,0,0.1)"
            position="bottom-left"
          />
          
          {/* Legend Panel */}
          <Panel position="bottom-right">
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 11,
              maxWidth: 200,
            }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Legend</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {legendItems.map(item => (
                  <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: item.style.bg,
                      border: `2px solid ${item.style.border}`,
                      flexShrink: 0,
                    }} />
                    <span style={{ color: '#64748b' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Focus Mode - Completely Separate Modal */}
      <FocusModeModal
        isOpen={showFocusMode}
        onClose={closeFocusMode}
        initialNodeId={focusNodeId}
        allNodes={nodes}
        allEdges={edges}
      />
    </>
  );
}

// Wrap with ReactFlowProvider
export default function DomainContextMap(props: DomainContextMapProps) {
  return (
    <ReactFlowProvider>
      <DomainContextMapInner {...props} />
    </ReactFlowProvider>
  );
}
