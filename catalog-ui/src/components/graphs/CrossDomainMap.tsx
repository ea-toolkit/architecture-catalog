// catalog-ui/src/components/graphs/CrossDomainMap.tsx
// Architecture Landscape — cross-domain high-level view
// Shows domains as nodes, inter-domain relationships as weighted edges
// Users can toggle domains on/off to manage complexity at scale

import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { toPng } from 'html-to-image';
import {
  ReactFlow,
  Background,
  Controls,
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
import { applyDagreLayout } from './utils/layout';
import { buildCrossDomainGraph } from './utils/cross-domain-graph-data';
import type { Domain } from '../../data/registry';
import type { CrossDomainEdge } from '../../lib/cross-domain';

const nodeTypes = { baseNode: BaseNode };
const edgeTypes = { relationshipEdge: RelationshipEdge };

// SVG icons for integration categories — matches the app's inline SVG style
function IntegrationIcon({ category }: { category: string }) {
  const style = { width: 14, height: 14, flexShrink: 0 as const, color: 'var(--graph-panel-text, #475569)' };
  switch (category) {
    case 'API Integration':
      return <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16v16H4z" /><path d="M4 9h16" /><path d="M9 4v16" /></svg>;
    case 'Event Coupling':
      return <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
    case 'Data Access':
      return <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></svg>;
    case 'Shared Infrastructure':
      return <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>;
    default:
      return <svg {...style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
  }
}

interface CrossDomainMapProps {
  domains: Domain[];
  crossDomainEdges: CrossDomainEdge[];
}

function CrossDomainMapInner({ domains, crossDomainEdges }: CrossDomainMapProps) {
  const { fitView } = useReactFlow();
  const graphContainerRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  // Domain selection — all selected by default
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(
    () => new Set(domains.map(d => d.id))
  );

  // Track layout generation to trigger fitView
  const [layoutVersion, setLayoutVersion] = useState(0);

  // Filter domains and edges based on selection
  const filteredDomains = useMemo(() =>
    domains.filter(d => selectedDomains.has(d.id)),
    [domains, selectedDomains]
  );

  const filteredEdges = useMemo(() =>
    crossDomainEdges.filter(e =>
      selectedDomains.has(e.sourceDomain) && selectedDomains.has(e.targetDomain)
    ),
    [crossDomainEdges, selectedDomains]
  );

  // Toggle a domain on/off
  const toggleDomain = useCallback((domainId: string) => {
    setSelectedDomains(prev => {
      const next = new Set(prev);
      if (next.has(domainId)) {
        next.delete(domainId);
      } else {
        next.add(domainId);
      }
      return next;
    });
  }, []);

  // Select all / clear all
  const selectAll = useCallback(() => {
    setSelectedDomains(new Set(domains.map(d => d.id)));
  }, [domains]);

  const clearAll = useCallback(() => {
    setSelectedDomains(new Set());
  }, []);

  // Build and layout graph when selection changes
  useEffect(() => {
    if (filteredDomains.length === 0) {
      setNodes([]);
      setEdges([]);
      setIsLayoutReady(true);
      return;
    }

    const { nodes: rawNodes, edges: rawEdges } = buildCrossDomainGraph(filteredDomains, filteredEdges);
    const layouted = applyDagreLayout(rawNodes, rawEdges, {
      direction: 'TB',
      ranksep: 250,
      nodesep: 120,
      nodeWidth: 280,
      nodeHeight: 100,
    });
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
    setIsLayoutReady(true);
    setLayoutVersion(v => v + 1);
  }, [filteredDomains, filteredEdges, setNodes, setEdges]);

  // Fit view when layout changes
  useEffect(() => {
    if (isLayoutReady && layoutVersion > 0) {
      const timer = setTimeout(() => fitView({ padding: 0.2 }), 100);
      return () => clearTimeout(timer);
    }
  }, [isLayoutReady, layoutVersion, fitView]);

  // Navigate to domain context map on click
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    if ((event.target as HTMLElement).closest('a')) return;
    const url = (node.data as Record<string, unknown>).catalogUrl as string;
    if (url) window.location.href = url;
  }, []);

  // PNG export
  const handleExportPng = useCallback(() => {
    const viewport = graphContainerRef.current?.querySelector('.react-flow__viewport') as HTMLElement | null;
    if (!viewport) return;

    toPng(viewport, {
      backgroundColor: '#fafafa',
      pixelRatio: 2,
      filter: (node) => {
        if (node?.classList?.contains('react-flow__controls')) return false;
        return true;
      },
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'architecture-landscape.png';
      link.href = dataUrl;
      link.click();
    }).catch((err) => {
      console.error('PNG export failed:', err);
    });
  }, []);

  // Integration category legend — deduplicate from visible edges
  const integrationCategories = useMemo(() => {
    const seen = new Set<string>();
    const categories: string[] = [];
    for (const edge of filteredEdges) {
      for (const integration of edge.integrations) {
        if (!seen.has(integration.category)) {
          seen.add(integration.category);
          categories.push(integration.category);
        }
      }
    }
    return categories;
  }, [filteredEdges]);

  return (
    <div ref={graphContainerRef} style={{ width: '100%', height: '100%', minHeight: 400, position: 'relative', background: '#fafafa', borderRadius: 0, overflow: 'hidden' }}>
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
        <Background color="var(--graph-grid, #e2e8f0)" gap={20} />
        <Controls position="top-left" showInteractive={false} />

        {/* Domain selector + export */}
        <Panel position="top-right">
          <div className="graph-panel-box landscape-domain-selector" style={{ padding: '10px 14px', fontSize: 11 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div className="graph-panel-heading" style={{ margin: 0 }}>Domains</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={selectAll}
                  className="graph-panel-btn"
                  style={{ fontSize: 10, padding: '2px 6px' }}
                >
                  All
                </button>
                <button
                  onClick={clearAll}
                  className="graph-panel-btn"
                  style={{ fontSize: 10, padding: '2px 6px' }}
                >
                  None
                </button>
                <div style={{ width: 1, background: 'var(--graph-panel-divider, #e2e8f0)', margin: '0 2px' }} />
                <button
                  onClick={handleExportPng}
                  title="Export as PNG"
                  className="graph-panel-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, padding: '2px 6px' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  PNG
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {domains.map(d => {
                const isSelected = selectedDomains.has(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDomain(d.id)}
                    className={`landscape-domain-chip ${isSelected ? 'landscape-domain-chip--active' : ''}`}
                    style={{
                      '--chip-color': d.color,
                    } as React.CSSProperties}
                  >
                    <span className="landscape-domain-chip-dot" style={{ background: d.color }} />
                    {d.name}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 8, fontSize: 10, color: 'var(--graph-panel-muted, #94a3b8)' }}>
              {filteredDomains.length} of {domains.length} domains · {filteredEdges.length} connections
            </div>
          </div>
        </Panel>

        {/* Legend — integration types */}
        {integrationCategories.length > 0 && (
          <Panel position="bottom-right">
            <div className="graph-panel-box" style={{ padding: '10px 14px', fontSize: 11, maxWidth: 200 }}>
              <div className="graph-panel-heading">Integration Types</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {integrationCategories.map(cat => (
                  <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IntegrationIcon category={cat} />
                    <span className="graph-panel-label">{cat}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        )}

        {/* Empty state */}
        {filteredDomains.length === 0 && (
          <Panel position="top-left" style={{ top: 60 }}>
            <div style={{
              padding: '24px 32px',
              color: 'var(--graph-panel-muted, #94a3b8)',
              fontSize: 13,
              textAlign: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
              Select domains to view their integrations
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}

export default function CrossDomainMap(props: CrossDomainMapProps) {
  return (
    <ReactFlowProvider>
      <CrossDomainMapInner {...props} />
    </ReactFlowProvider>
  );
}
