// catalog-ui/src/components/diagrams/BPMNViewer.tsx
// Renders BPMN diagrams using bpmn-js with zoom controls

import React, { useEffect, useRef, useState } from 'react';

interface BPMNViewerProps {
  xmlContent: string;
  name: string;
}

export default function BPMNViewer({ xmlContent, name }: BPMNViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  useEffect(() => {
    let mounted = true;

    async function render() {
      try {
        // Dynamic import to avoid SSR issues
        const BpmnJS = (await import('bpmn-js')).default;

        if (!mounted || !containerRef.current) return;

        const viewer = new BpmnJS({
          container: containerRef.current,
        });
        viewerRef.current = viewer;

        const { warnings } = await viewer.importXML(xmlContent);
        
        if (warnings?.length) {
          console.warn('BPMN import warnings:', warnings);
        }

        const canvas = viewer.get('canvas') as any;
        canvas.zoom('fit-viewport');
        setZoomLevel(Math.round((canvas.zoom() as number) * 100));
        
        if (mounted) {
          setLoading(false);
        }
      } catch (err: any) {
        console.error('BPMN render error:', err);
        if (mounted) {
          setError(err.message || 'Failed to render BPMN diagram');
          setLoading(false);
        }
      }
    }

    render();

    return () => {
      mounted = false;
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {}
      }
    };
  }, [xmlContent]);

  const handleZoomIn = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get('canvas') as any;
      canvas.zoom(canvas.zoom() + 0.25);
      setZoomLevel(Math.round((canvas.zoom() as number) * 100));
    }
  };

  const handleZoomOut = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get('canvas') as any;
      canvas.zoom(Math.max(0.25, canvas.zoom() - 0.25));
      setZoomLevel(Math.round((canvas.zoom() as number) * 100));
    }
  };

  const handleReset = () => {
    if (viewerRef.current) {
      const canvas = viewerRef.current.get('canvas') as any;
      canvas.zoom('fit-viewport');
      setZoomLevel(Math.round((canvas.zoom() as number) * 100));
    }
  };

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
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18M9 21V9"/>
          </svg>
          <span style={{ fontWeight: 600, color: '#334155' }}>{name}</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Zoom controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginRight: 8 }}>
            <button onClick={handleZoomOut} style={btnStyle} title="Zoom out">−</button>
            <span style={{ minWidth: 48, textAlign: 'center', fontSize: 11, fontWeight: 600 }}>{zoomLevel}%</span>
            <button onClick={handleZoomIn} style={btnStyle} title="Zoom in">+</button>
            <button onClick={handleReset} style={{ ...btnStyle, width: 'auto', padding: '0 10px', fontSize: 11 }} title="Fit to viewport">
              Fit
            </button>
          </div>
          <span style={{
            padding: '4px 10px',
            borderRadius: 6,
            background: '#ecfdf5',
            color: '#065f46',
            fontWeight: 600,
            fontSize: 11,
          }}>
            BPMN
          </span>
        </div>
      </div>

      {/* Viewer container */}
      <div style={{ position: 'relative', height: 'calc(100vh - 280px)', minHeight: 450 }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f8fafc',
            zIndex: 10,
          }}>
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <div style={{
                width: 32,
                height: 32,
                border: '3px solid #e2e8f0',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 12px',
              }} />
              <div style={{ fontSize: 12 }}>Loading diagram...</div>
            </div>
          </div>
        )}

        {error ? (
          <div style={{
            padding: 40,
            textAlign: 'center',
            color: '#ef4444',
            fontSize: 13,
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ margin: '0 auto 12px' }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <div>Error: {error}</div>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{
              width: '100%',
              height: '100%',
              background: '#fafafa',
            }}
          />
        )}
      </div>

      {/* Add spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
