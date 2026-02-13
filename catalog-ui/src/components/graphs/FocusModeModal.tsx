// catalog-ui/src/components/graphs/FocusModeModal.tsx
// Full-page focus mode modal showing immediate parent/child of selected node

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
} from '@xyflow/react';
import BaseNode from './nodes/BaseNode';
import ArchimateEdge, { EdgeMarkerDefs } from './edges/ArchimateEdge';
import { NODE_STYLES } from './utils/colors';

interface FocusModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialNodeId: string | null;
  allNodes: Node[];
  allEdges: Edge[];
}

const nodeTypes = { baseNode: BaseNode };
const edgeTypes = { archimateEdge: ArchimateEdge };

const HORIZONTAL_SPACING = 400;
const VERTICAL_SPACING = 140;

// Get immediate parent and child nodes
function getConnectedNodes(
  centerNodeId: string,
  nodes: Node[],
  edges: Edge[]
): { leftNodes: Node[]; rightNodes: Node[] } {
  const leftIds = new Set<string>();
  const rightIds = new Set<string>();

  edges.forEach((edge) => {
    // incoming edges - sources are parents (left)
    if (edge.target === centerNodeId) {
      leftIds.add(edge.source);
    }
    // outgoing edges - targets are children (right)
    if (edge.source === centerNodeId) {
      rightIds.add(edge.target);
    }
  });

  return {
    leftNodes: nodes.filter((n) => leftIds.has(n.id)),
    rightNodes: nodes.filter((n) => rightIds.has(n.id)),
  };
}

// Build the focus graph with center node and its immediate connections
function buildFocusGraph(
  centerNodeId: string,
  allNodes: Node[],
  allEdges: Edge[]
): { nodes: Node[]; edges: Edge[] } {
  const centerNode = allNodes.find((n) => n.id === centerNodeId);
  if (!centerNode) {
    return { nodes: [], edges: [] };
  }

  const { leftNodes, rightNodes } = getConnectedNodes(centerNodeId, allNodes, allEdges);
  const positionedNodes: Node[] = [];

  // Center node at origin, marked as focus center
  positionedNodes.push({
    ...centerNode,
    position: { x: 0, y: 0 },
    data: { ...centerNode.data, isFocusCenter: true },
  });

  // Left nodes (incoming/parents) - position to the left
  leftNodes.forEach((node, index) => {
    const yOffset = (index - (leftNodes.length - 1) / 2) * VERTICAL_SPACING;
    positionedNodes.push({
      ...node,
      position: { x: -HORIZONTAL_SPACING, y: yOffset },
      data: { ...node.data, isFocusCenter: false },
    });
  });

  // Right nodes (outgoing/children) - position to the right
  rightNodes.forEach((node, index) => {
    const yOffset = (index - (rightNodes.length - 1) / 2) * VERTICAL_SPACING;
    positionedNodes.push({
      ...node,
      position: { x: HORIZONTAL_SPACING, y: yOffset },
      data: { ...node.data, isFocusCenter: false },
    });
  });

  // Add placeholder if no connections
  if (leftNodes.length === 0) {
    positionedNodes.push({
      id: '__placeholder-left__',
      type: 'default',
      position: { x: -HORIZONTAL_SPACING, y: 0 },
      data: { label: 'No incoming connections' },
      draggable: false,
      selectable: false,
      style: {
        background: '#f1f5f9',
        border: '1px dashed #cbd5e1',
        borderRadius: 8,
        padding: '12px 16px',
        fontSize: 12,
        color: '#94a3b8',
      },
    } as Node);
  }

  if (rightNodes.length === 0) {
    positionedNodes.push({
      id: '__placeholder-right__',
      type: 'default',
      position: { x: HORIZONTAL_SPACING, y: 0 },
      data: { label: 'No outgoing connections' },
      draggable: false,
      selectable: false,
      style: {
        background: '#f1f5f9',
        border: '1px dashed #cbd5e1',
        borderRadius: 8,
        padding: '12px 16px',
        fontSize: 12,
        color: '#94a3b8',
      },
    } as Node);
  }

  // Filter edges - only those connected to center node AND have both ends in our set
  const focusedNodeIds = new Set(positionedNodes.map((n) => n.id));
  const filteredEdges = allEdges.filter((edge) => {
    const connectsToCenter = edge.source === centerNodeId || edge.target === centerNodeId;
    const bothEndsExist = focusedNodeIds.has(edge.source) && focusedNodeIds.has(edge.target);
    return connectsToCenter && bothEndsExist;
  });

  return { nodes: positionedNodes, edges: filteredEdges };
}

// Inner component with ReactFlow hooks
function FocusModeContent({
  centerNodeId,
  allNodes,
  allEdges,
  onNodeClick,
}: {
  centerNodeId: string;
  allNodes: Node[];
  allEdges: Edge[];
  onNodeClick: (nodeId: string) => void;
}) {
  const { fitView } = useReactFlow();

  const { nodes, edges } = useMemo(
    () => buildFocusGraph(centerNodeId, allNodes, allEdges),
    [centerNodeId, allNodes, allEdges]
  );

  // Fit view when graph changes
  useEffect(() => {
    const timer = setTimeout(() => fitView({ padding: 0.25, duration: 200 }), 50);
    return () => clearTimeout(timer);
  }, [centerNodeId, fitView]);

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Don't navigate if clicking the doc link
      if ((event.target as HTMLElement).closest('a')) return;
      // Don't click on placeholders
      if (node.id.startsWith('__placeholder')) return;
      onNodeClick(node.id);
    },
    [onNodeClick]
  );

  const centerNode = allNodes.find((n) => n.id === centerNodeId);
  const centerLabel = (centerNode?.data as any)?.label || centerNodeId;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <EdgeMarkerDefs />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeClick={handleNodeClick}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>

      {/* Navigation hint */}
      <div
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: 8,
          fontSize: 12,
          pointerEvents: 'none',
        }}
      >
        Click any connected node to navigate • Currently viewing: <strong>{centerLabel}</strong>
      </div>
    </div>
  );
}

// Main modal component
export default function FocusModeModal({
  isOpen,
  onClose,
  initialNodeId,
  allNodes,
  allEdges,
}: FocusModeModalProps) {
  const [centerNodeId, setCenterNodeId] = useState<string | null>(initialNodeId);

  // Reset when modal opens with new initial node
  useEffect(() => {
    if (isOpen && initialNodeId) {
      setCenterNodeId(initialNodeId);
    }
  }, [isOpen, initialNodeId]);

  // Handle clicking a node in focus mode - make it the new center
  const handleNodeClick = useCallback((nodeId: string) => {
    setCenterNodeId(nodeId);
  }, []);

  // Handle close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !centerNodeId) return null;

  const centerNode = allNodes.find((n) => n.id === centerNodeId);
  const centerLabel = (centerNode?.data as any)?.label || centerNodeId;
  const centerType = (centerNode?.data as any)?.elementType || 'Element';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={handleClose}
      />

      {/* Modal content */}
      <div
        style={{
          position: 'relative',
          margin: '24px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Focus icon */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>

            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>
                Focus Mode
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>
                Exploring: <strong>{centerLabel}</strong> ({centerType})
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              width: 40,
              height: 40,
              border: 'none',
              background: '#f1f5f9',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e2e8f0';
              e.currentTarget.style.color = '#1e293b';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Graph container */}
        <div style={{ flex: 1, background: '#fafafa' }}>
          <ReactFlowProvider>
            <FocusModeContent
              centerNodeId={centerNodeId}
              allNodes={allNodes}
              allEdges={allEdges}
              onNodeClick={handleNodeClick}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}
