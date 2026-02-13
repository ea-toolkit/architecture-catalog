// catalog-ui/src/components/diagrams/PlantUMLViewer.tsx
// Renders PlantUML diagrams via the public PlantUML server with zoom/pan controls

import React, { useMemo, useState, useRef, useCallback } from 'react';
import plantumlEncoder from 'plantuml-encoder';

interface PlantUMLViewerProps {
  source: string;
  name: string;
  serverUrl?: string;
}

const ZOOM_STEP = 0.25;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

export default function PlantUMLViewer({
  source,
  name,
  serverUrl = 'https://www.plantuml.com/plantuml',
}: PlantUMLViewerProps) {
  const [showSource, setShowSource] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const imageUrl = useMemo(() => {
    try {
      const encoded = plantumlEncoder.encode(source);
      return `${serverUrl}/svg/${encoded}`;
    } catch {
      return null;
    }
  }, [source, serverUrl]);

  const handleZoomIn = () => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = () => setIsPanning(false);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom(z => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z + delta)));
    }
  }, []);

  const btnStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    border: '1px solid #e2e8f0',
    background: 'white',
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 600,
    color: '#64748b',
  };

  return (
    <div style={{
      width: '100%',
      background: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Toolbar */}
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: '#64748b',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={{ fontWeight: 600, color: '#334155' }}>{name}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
            <button onClick={handleZoomOut} style={btnStyle} title="Zoom out">−</button>
            <span style={{ minWidth: 48, textAlign: 'center', fontSize: 11, fontWeight: 600 }}>{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} style={btnStyle} title="Zoom in">+</button>
            <button onClick={handleReset} style={{ ...btnStyle, width: 'auto', padding: '0 10px', fontSize: 11 }} title="Reset view">
              Reset
            </button>
          </div>
          <button
            onClick={() => setShowSource(!showSource)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: showSource ? '#f1f5f9' : 'white',
              fontSize: 11,
              fontWeight: 500,
              color: '#64748b',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {showSource ? 'Hide Source' : 'View Source'}
          </button>
          <span style={{
            padding: '4px 10px',
            borderRadius: 6,
            background: '#fef3c7',
            color: '#92400e',
            fontWeight: 600,
            fontSize: 11,
          }}>
            PlantUML
          </span>
        </div>
      </div>

      {/* Diagram with zoom/pan */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{
          padding: 24,
          height: 'calc(100vh - 280px)',
          minHeight: 400,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {imageError || !imageUrl ? (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <div style={{ marginTop: 8, fontSize: 13 }}>Failed to render diagram</div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={name}
            draggable={false}
            style={{
              maxWidth: zoom === 1 ? '100%' : 'none',
              height: 'auto',
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out',
              userSelect: 'none',
            }}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Source code (collapsible) */}
      {showSource && (
        <div style={{
          borderTop: '1px solid #e2e8f0',
          background: '#1e293b',
          maxHeight: 300,
          overflow: 'auto',
        }}>
          <pre style={{
            margin: 0,
            padding: 16,
            fontSize: 11,
            lineHeight: 1.6,
            color: '#e2e8f0',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            whiteSpace: 'pre-wrap',
          }}>
            {source}
          </pre>
        </div>
      )}
    </div>
  );
}
