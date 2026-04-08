// catalog-ui/src/components/graphs/CrossDomainMap.tsx
// Architecture Landscape — cross-domain high-level view
// Shows domains as nodes, inter-domain relationships as weighted edges

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
import type { CrossDomainEdge, IntegrationPattern } from '../../lib/cross-domain';

const nodeTypes = { baseNode: BaseNode };
const edgeTypes = { relationshipEdge: RelationshipEdge };

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

  // Build and layout graph on mount
  useEffect(() => {
    const { nodes: rawNodes, edges: rawEdges } = buildCrossDomainGraph(domains, crossDomainEdges);
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
  }, [domains, crossDomainEdges, setNodes, setEdges]);

  // Fit view when layout is ready
  useEffect(() => {
    if (isLayoutReady) {
      const timer = setTimeout(() => fitView({ padding: 0.2 }), 100);
      return () => clearTimeout(timer);
    }
  }, [isLayoutReady, fitView]);

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

  // Legend items from domains
  const legendItems = useMemo(() => {
    return domains.map(d => ({
      name: d.name,
      color: d.color,
      count: d.totalElements,
    }));
  }, [domains]);

  // Integration category legend — deduplicate from all edges
  const integrationCategories = useMemo(() => {
    const seen = new Map<string, IntegrationPattern>();
    for (const edge of crossDomainEdges) {
      for (const integration of edge.integrations) {
        if (!seen.has(integration.category)) {
          seen.set(integration.category, integration);
        }
      }
    }
    return Array.from(seen.values());
  }, [crossDomainEdges]);

  if (!isLayoutReady) {
    return (
      <div style={{ width: '100%', height: '100%', minHeight: 400, background: '#fafafa', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        Loading landscape...
      </div>
    );
  }

  return (
    <div ref={graphContainerRef} style={{ width: '100%', height: '100%', minHeight: 400, position: 'relative', background: '#fafafa', borderRadius: 12, overflow: 'hidden' }}>
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

        {/* Export button */}
        <Panel position="top-right">
          <button
            onClick={handleExportPng}
            title="Export as PNG"
            className="graph-panel-btn"
            style={{ display: 'flex', alignItems: 'center', gap: 3 }}
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
          <div className="graph-panel-box" style={{
            padding: '10px 14px',
            fontSize: 11,
            maxWidth: 200,
          }}>
            <div className="graph-panel-heading">Domains</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {legendItems.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: item.color,
                    flexShrink: 0,
                  }} />
                  <span className="graph-panel-label" style={{ flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 10, color: 'var(--graph-panel-muted, #94a3b8)' }}>{item.count}</span>
                </div>
              ))}
            </div>
            {integrationCategories.length > 0 && (
              <>
                <div className="graph-panel-divider" />
                <div className="graph-panel-heading">Integration Types</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {integrationCategories.map(cat => (
                    <div key={cat.category} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 12, width: 16, textAlign: 'center' }}>{cat.icon}</span>
                      <span className="graph-panel-label">{cat.category}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            <div className="graph-panel-divider" />
            <div style={{ fontSize: 10, color: 'var(--graph-panel-muted, #94a3b8)' }}>
              {crossDomainEdges.length} domain connections
            </div>
          </div>
        </Panel>
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
