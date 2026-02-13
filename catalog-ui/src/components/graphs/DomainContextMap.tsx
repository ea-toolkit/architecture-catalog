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
import RelationshipEdge, { EdgeMarkerDefs } from './edges/RelationshipEdge';
import FocusModeModal from './FocusModeModal';
import { applyDagreLayout } from './utils/layout';
import { buildDomainGraph } from './utils/graph-data';
import { NODE_STYLES, EDGE_STYLES } from './utils/colors';
import type { Domain, Element } from '../../data/registry';

// Custom node and edge types
const nodeTypes = {
  baseNode: BaseNode,
};

const edgeTypes = {
  relationshipEdge: RelationshipEdge,
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

  // Legend filter state — which element types are visible
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());

  // All laid-out nodes/edges (unfiltered) for reference
  const [allLayoutedNodes, setAllLayoutedNodes] = useState<Node[]>([]);
  const [allLayoutedEdges, setAllLayoutedEdges] = useState<Edge[]>([]);

  // Build and layout graph on mount
  useEffect(() => {
    const { nodes: rawNodes, edges: rawEdges } = buildDomainGraph(domain, elements);
    const layouted = applyDagreLayout(rawNodes, rawEdges, { direction: 'LR', ranksep: 200, nodesep: 60 });
    setAllLayoutedNodes(layouted.nodes);
    setAllLayoutedEdges(layouted.edges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setIsLayoutReady(true);
  }, [domain, elements, setNodes, setEdges]);

  // Apply type filtering when hiddenTypes changes
  useEffect(() => {
    if (!isLayoutReady) return;
    if (hiddenTypes.size === 0) {
      setNodes(allLayoutedNodes);
      setEdges(allLayoutedEdges);
    } else {
      const visibleNodeIds = new Set(
        allLayoutedNodes.filter(n => !hiddenTypes.has((n.data as any)?.type)).map(n => n.id)
      );
      setNodes(allLayoutedNodes.filter(n => visibleNodeIds.has(n.id)));
      setEdges(allLayoutedEdges.filter(e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)));
    }
  }, [hiddenTypes, allLayoutedNodes, allLayoutedEdges, isLayoutReady, setNodes, setEdges]);

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

  // Toggle element type visibility in the legend
  const toggleType = useCallback((type: string) => {
    setHiddenTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
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

  // Legend items from edge/relationship types in the graph
  const legendEdgeItems = useMemo(() => {
    const types = new Set(edges.map(e => (e.data as any)?.relationship).filter(Boolean));
    return Array.from(types).map(rel => ({
      type: rel,
      style: EDGE_STYLES[rel] || EDGE_STYLES['default'],
      label: (EDGE_STYLES[rel]?.label || rel.replace(/[-_]/g, ' ')),
    }));
  }, [edges]);

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

          {/* Legend Panel — clickable to filter types */}
          <Panel position="bottom-right">
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 11,
              maxWidth: 200,
              maxHeight: 300,
              overflowY: 'auto',
            }}>
              <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Elements</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {legendItems.map(item => {
                  const isHidden = hiddenTypes.has(item.type);
                  return (
                    <div
                      key={item.type}
                      onClick={() => toggleType(item.type)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        cursor: 'pointer',
                        opacity: isHidden ? 0.35 : 1,
                        transition: 'opacity 0.15s',
                        padding: '2px 4px',
                        borderRadius: 4,
                        marginLeft: -4,
                        marginRight: -4,
                      }}
                      title={isHidden ? `Show ${item.label}` : `Hide ${item.label}`}
                    >
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
                  );
                })}
              </div>
              {legendEdgeItems.length > 0 && (
                <>
                  <div style={{ borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />
                  <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Relationships</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {legendEdgeItems.map(item => (
                      <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <svg width="20" height="10" style={{ flexShrink: 0 }}>
                          <line
                            x1="0" y1="5" x2="20" y2="5"
                            stroke={item.style.stroke}
                            strokeWidth={item.style.strokeWidth}
                            strokeDasharray={item.style.strokeDasharray || 'none'}
                          />
                        </svg>
                        <span style={{ color: '#64748b' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Focus Mode - Completely Separate Modal */}
      <FocusModeModal
        isOpen={showFocusMode}
        onClose={closeFocusMode}
        initialNodeId={focusNodeId}
        allNodes={allLayoutedNodes}
        allEdges={allLayoutedEdges}
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
