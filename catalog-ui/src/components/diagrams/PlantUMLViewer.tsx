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
  const sourceRef = useRef<HTMLDivElement>(null);

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

  const handleToggleSource = () => {
    const next = !showSource;
    setShowSource(next);
    if (next) {
      setTimeout(() => {
        sourceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  };

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

  return (
    <div className="diagram-viewer-container">
      {/* Toolbar */}
      <div className="diagram-viewer-toolbar">
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <span style={{ fontWeight: 600 }}>{name}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
            <button onClick={handleZoomOut} className="diagram-viewer-btn" title="Zoom out">−</button>
            <span style={{ minWidth: 48, textAlign: 'center', fontSize: 11, fontWeight: 600 }}>{Math.round(zoom * 100)}%</span>
            <button onClick={handleZoomIn} className="diagram-viewer-btn" title="Zoom in">+</button>
            <button onClick={handleReset} className="diagram-viewer-btn" style={{ width: 'auto', padding: '0 10px', fontSize: 11 }} title="Reset view">
              Reset
            </button>
          </div>
          <button onClick={handleToggleSource} className="diagram-viewer-btn" style={{ width: 'auto', padding: '0 10px', fontSize: 11, fontWeight: 500 }}>
            {showSource ? 'Hide Source' : 'View Source'}
          </button>
          <span className="diagram-viewer-format-badge">PlantUML</span>
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
        className="diagram-viewer-canvas"
        style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
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
        <div ref={sourceRef} className="diagram-viewer-source">
          <pre>{source}</pre>
        </div>
      )}
    </div>
  );
}
