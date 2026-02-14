// catalog-ui/src/components/graphs/DomainContextMap.tsx
// Full domain context map with ReactFlow - used on /domains/[id] page

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
import { NODE_STYLES, EDGE_STYLES, getNodeStyle } from './utils/colors';
import type { Domain, Element } from '../../data/registry';

// Custom node and edge types
const nodeTypes = {
  baseNode: BaseNode,
};

const edgeTypes = {
  relationshipEdge: RelationshipEdge,
};

// Status filter options — derived from actual data, not hardcoded
type StatusFilter = string;

interface DomainContextMapProps {
  domain: Domain;
  elements: Element[];
}

function DomainContextMapInner({ domain, elements }: DomainContextMapProps) {
  const { fitView } = useReactFlow();
  const graphContainerRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Focus mode state - completely separate from main graph
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null);
  const [showFocusMode, setShowFocusMode] = useState(false);

  // Legend filter state — which element types are visible
  const [hiddenTypes, setHiddenTypes] = useState<Set<string>>(new Set());

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Status filter state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

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

  // Apply combined filtering: hiddenTypes + statusFilter + searchQuery
  useEffect(() => {
    if (!isLayoutReady) return;

    const query = searchQuery.toLowerCase().trim();

    // Filter nodes
    const filteredNodes = allLayoutedNodes.map(n => {
      const d = n.data as Record<string, unknown>;
      const type = d?.type as string;
      const status = d?.status as string;
      const label = (d?.label as string || '').toLowerCase();

      // Hard filter: hidden types completely remove nodes
      if (hiddenTypes.has(type)) return null;

      // Hard filter: status filter removes non-matching nodes (domain nodes always visible)
      if (statusFilter !== 'all' && type !== 'domain' && status && status !== statusFilter) return null;

      // Soft filter: search dims non-matching nodes but keeps them visible
      const matchesSearch = !query || label.includes(query) || (type || '').includes(query);

      return {
        ...n,
        style: { ...n.style, opacity: matchesSearch ? 1 : 0.2, transition: 'opacity 0.2s' },
      };
    }).filter(Boolean) as Node[];

    const visibleNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredEdges = allLayoutedEdges.filter(
      e => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );

    setNodes(filteredNodes);
    setEdges(filteredEdges);
  }, [hiddenTypes, statusFilter, searchQuery, allLayoutedNodes, allLayoutedEdges, isLayoutReady, setNodes, setEdges]);

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

  // PNG Export — uses html-to-image to properly render foreignObject nodes
  const handleExportPng = useCallback(() => {
    const viewport = graphContainerRef.current?.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (!viewport) return;

    toPng(viewport, {
      backgroundColor: '#fafafa',
      pixelRatio: 2,
      filter: (node) => {
        // Exclude minimap and controls from the export
        if (node?.classList?.contains('react-flow__minimap')) return false;
        if (node?.classList?.contains('react-flow__controls')) return false;
        return true;
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${domain.name.replace(/\s+/g, '-').toLowerCase()}-context-map.png`;
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('PNG export failed:', err);
    });
  }, [domain.name]);

  // Status options and counts — derived from actual element data
  const { statusOptions, statusCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const el of elements) {
      const s = el.status || 'active';
      counts[s] = (counts[s] || 0) + 1;
    }
    return {
      statusOptions: ['all', ...Object.keys(counts)],
      statusCounts: { all: elements.length, ...counts },
    };
  }, [elements]);

  // Legend items from node types in the graph
  const legendItems = useMemo(() => {
    const types = new Set(elements.map(e => e.type));
    types.add('domain');
    return Array.from(types).map(type => ({
      type,
      style: NODE_STYLES[type] || getNodeStyle(type),
      label: type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    }));
  }, [elements]);

  // Legend items from edge/relationship types in the graph
  const legendEdgeItems = useMemo(() => {
    const types = new Set(edges.map(e => (e.data as Record<string, unknown>)?.relationship as string).filter(Boolean));
    return Array.from(types).map(rel => ({
      type: rel,
      style: EDGE_STYLES[rel] || EDGE_STYLES['default'],
      label: (EDGE_STYLES[rel]?.label || rel.replace(/[-_]/g, ' ')),
    }));
  }, [edges]);

  if (!isLayoutReady) {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 400, background: '#fafafa', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading graph...
      </div>
    );
  }

  return (
    <>
      <div ref={graphContainerRef} style={{ width: '100%', height: '100%', minHeight: 400, position: 'relative', background: '#fafafa', borderRadius: 12, overflow: 'hidden' }}>
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
          minZoom={0.15}
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

          {/* Toolbar Panel — search, status filter, export */}
          <Panel position="top-right">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Search */}
              <div style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search elements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: 11,
                    width: 130,
                    background: 'transparent',
                    color: '#334155',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 14, lineHeight: 1, padding: 0 }}
                  >
                    x
                  </button>
                )}
              </div>

              {/* Status filter + Export row */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {statusOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      border: `1px solid ${statusFilter === s ? '#3b82f6' : '#e2e8f0'}`,
                      background: statusFilter === s ? '#eff6ff' : 'white',
                      color: statusFilter === s ? '#3b82f6' : '#64748b',
                      fontSize: 10,
                      fontWeight: statusFilter === s ? 600 : 400,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {s}{s !== 'all' && statusCounts[s] > 0 ? ` (${statusCounts[s]})` : ''}
                  </button>
                ))}
                {/* Export button */}
                <button
                  onClick={handleExportPng}
                  title="Export as PNG"
                  style={{
                    padding: '3px 8px',
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                    background: 'white',
                    color: '#64748b',
                    fontSize: 10,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  PNG
                </button>
              </div>
            </div>
          </Panel>

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
