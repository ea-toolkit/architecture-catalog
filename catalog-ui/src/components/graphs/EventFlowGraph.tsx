// catalog-ui/src/components/graphs/EventFlowGraph.tsx
// Event flow visualization with ReactFlow
// Shows: Publishers (left) → Events (center) → Consumers (right)

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
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
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Node,
  type Edge,
  type EdgeProps,
  type NodeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import BaseNode from './nodes/BaseNode';
import { EdgeMarkerDefs } from './edges/RelationshipEdge';
import FocusModeModal from './FocusModeModal';
import { applyDagreLayout } from './utils/layout';
import { buildEventFlowGraph } from './utils/event-graph-data';
import type { EventFlow } from '../../data/registry';

// ── Custom edge for event flows (colored by publish/consume) ──
function EventFlowEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data as { color?: string; label?: string } | undefined;
  const color = edgeData?.color || '#64748b';
  const label = edgeData?.label || '';

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: 2,
        }}
        markerEnd={`url(#arrow-${color.replace('#', '')})`}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: 'rgba(255,255,255,0.95)',
              padding: '2px 8px',
              borderRadius: 4,
              fontSize: 10,
              fontWeight: 600,
              color,
              border: `1px solid ${color}40`,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

// Custom marker defs for colored arrows
function EventFlowMarkerDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        {/* Blue arrow for publishes */}
        <marker id="arrow-3b82f6" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M2,2 L10,6 L2,10 L4,6 L2,2" fill="#3b82f6" />
        </marker>
        {/* Green arrow for consumes */}
        <marker id="arrow-10b981" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
          <path d="M2,2 L10,6 L2,10 L4,6 L2,2" fill="#10b981" />
        </marker>
      </defs>
    </svg>
  );
}

// Custom node and edge types
const nodeTypes = { baseNode: BaseNode };
const edgeTypes = { eventFlowEdge: EventFlowEdge };

interface EventFlowGraphProps {
  eventFlow: EventFlow;
  domainName: string;
}

function EventFlowGraphInner({ eventFlow, domainName }: EventFlowGraphProps) {
  const { fitView } = useReactFlow();
  const graphContainerRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Focus mode state
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);

  // All laid-out nodes/edges (unfiltered) for focus mode
  const [allLayoutedNodes, setAllLayoutedNodes] = useState<Node[]>([]);
  const [allLayoutedEdges, setAllLayoutedEdges] = useState<Edge[]>([]);

  // Build and layout graph on mount
  useEffect(() => {
    const { nodes: rawNodes, edges: rawEdges } = buildEventFlowGraph(eventFlow);
    const layouted = applyDagreLayout(rawNodes, rawEdges, {
      direction: 'LR',
      ranksep: 220,
      nodesep: 50,
    });
    setAllLayoutedNodes(layouted.nodes);
    setAllLayoutedEdges(layouted.edges);
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setIsLayoutReady(true);
  }, [eventFlow, setNodes, setEdges]);

  // Fit view when layout is ready
  useEffect(() => {
    if (isLayoutReady) {
      const timer = setTimeout(() => fitView({ padding: 0.2 }), 100);
      return () => clearTimeout(timer);
    }
  }, [isLayoutReady, fitView]);

  // Handle node click - open focus mode
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    if ((event.target as HTMLElement).closest('a')) return;
    setFocusNodeId(node.id);
    setShowFocusMode(true);
  }, []);

  // Close focus mode
  const closeFocusMode = useCallback(() => {
    setShowFocusMode(false);
    setFocusNodeId(null);
  }, []);

  // PNG Export
  const handleExportPng = useCallback(() => {
    const viewport = graphContainerRef.current?.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (!viewport) return;

    toPng(viewport, {
      backgroundColor: '#fafafa',
      pixelRatio: 2,
      filter: (node) => {
        if (node?.classList?.contains('react-flow__minimap')) return false;
        if (node?.classList?.contains('react-flow__controls')) return false;
        return true;
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${domainName.replace(/\s+/g, '-').toLowerCase()}-event-flow.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('PNG export failed:', err);
    });
  }, [domainName]);

  if (!isLayoutReady) {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 400, background: '#fafafa', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading event flow...
      </div>
    );
  }

  return (
    <>
      <div ref={graphContainerRef} style={{ width: '100%', height: '100%', minHeight: 500, position: 'relative', background: '#fafafa', borderRadius: 12, overflow: 'hidden' }}>
        <EventFlowMarkerDefs />
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
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls position="top-left" showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const style = (node.data as Record<string, unknown>)?.style as Record<string, string> | undefined;
            return style?.border || '#94a3b8';
          }}
          maskColor="rgba(0,0,0,0.1)"
          position="bottom-left"
        />

        {/* Export button */}
        <Panel position="top-right">
          <button
            onClick={handleExportPng}
            title="Export as PNG"
            style={{
              padding: '5px 10px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: 'white',
              color: '#64748b',
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            PNG
          </button>
        </Panel>

        {/* Legend */}
        <Panel position="bottom-right">
          <div style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 11,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: '#475569' }}>Event Flow</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="24" height="10" style={{ flexShrink: 0 }}>
                  <line x1="0" y1="5" x2="24" y2="5" stroke="#3b82f6" strokeWidth="2" />
                  <polygon points="20,2 24,5 20,8" fill="#3b82f6" />
                </svg>
                <span style={{ color: '#3b82f6', fontWeight: 500 }}>Publishes</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="24" height="10" style={{ flexShrink: 0 }}>
                  <line x1="0" y1="5" x2="24" y2="5" stroke="#10b981" strokeWidth="2" />
                  <polygon points="20,2 24,5 20,8" fill="#10b981" />
                </svg>
                <span style={{ color: '#10b981', fontWeight: 500 }}>Consumes</span>
              </div>
              <div style={{ borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#fef2f2', border: '2px solid #ef4444', flexShrink: 0 }} />
                <span style={{ color: '#64748b' }}>{eventFlow.eventLabel}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#ecfdf5', border: '2px solid #6ee7b7', flexShrink: 0 }} />
                <span style={{ color: '#64748b' }}>{eventFlow.serviceLabel}</span>
              </div>
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
        allNodes={allLayoutedNodes}
        allEdges={allLayoutedEdges}
      />
    </>
  );
}

// Wrap with ReactFlowProvider
export default function EventFlowGraph(props: EventFlowGraphProps) {
  return (
    <ReactFlowProvider>
      <EventFlowGraphInner {...props} />
    </ReactFlowProvider>
  );
}
