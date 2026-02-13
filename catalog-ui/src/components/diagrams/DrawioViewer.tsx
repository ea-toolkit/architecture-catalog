// catalog-ui/src/components/diagrams/DrawioViewer.tsx
// Renders draw.io diagrams by parsing mxGraph XML and rendering as SVG

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface DrawioViewerProps {
  xmlContent: string;
  name: string;
}

export default function DrawioViewer({ xmlContent, name }: DrawioViewerProps) {
  const [showXml, setShowXml] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Try to extract the diagram title from XML
  const titleMatch = xmlContent.match(/name="([^"]+)"/);
  const diagramTitle = titleMatch?.[1] || name;

  // Parse draw.io XML and extract the diagram content
  useEffect(() => {
    async function parseDiagram() {
      try {
        setLoading(true);
        setError(null);

        // Parse the mxfile XML
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlContent, 'text/xml');
        
        // Check for parse errors
        const parseError = doc.querySelector('parsererror');
        if (parseError) {
          throw new Error('Invalid XML format');
        }

        // Find the diagram element
        const diagramEl = doc.querySelector('diagram');
        if (!diagramEl) {
          throw new Error('No diagram found in XML');
        }

        // Check if mxGraphModel is directly nested (uncompressed format)
        let mxGraphModel = diagramEl.querySelector('mxGraphModel');
        
        if (!mxGraphModel) {
          // Try to decode compressed content
          let graphXml = diagramEl.textContent?.trim() || '';
          
          if (graphXml) {
            try {
              // Try base64 decode + inflate
              const decoded = atob(graphXml);
              // Check if it starts with deflate header (0x78)
              if (decoded.charCodeAt(0) === 0x78) {
                // Use pako to inflate
                const pako = await import('pako');
                const inflated = pako.inflate(
                  new Uint8Array([...decoded].map(c => c.charCodeAt(0))),
                  { to: 'string' }
                );
                graphXml = decodeURIComponent(inflated);
              } else {
                graphXml = decodeURIComponent(decoded);
              }
            } catch {
              // Content might already be plain XML or URL-encoded
              try {
                graphXml = decodeURIComponent(graphXml);
              } catch {
                // Keep as-is
              }
            }
            
            // Parse the decoded content
            const graphDoc = parser.parseFromString(graphXml, 'text/xml');
            mxGraphModel = graphDoc.querySelector('mxGraphModel');
          }
        }
        
        if (!mxGraphModel) {
          // Fall back to showing a preview card
          setSvgContent(null);
          setLoading(false);
          return;
        }

        // Extract cells and render as SVG
        const cells = mxGraphModel.querySelectorAll('mxCell');
        const svgElements: string[] = [];
        const edgeElements: string[] = [];
        
        // Store cell positions by ID for edge rendering
        const cellPositions: Map<string, { x: number; y: number; width: number; height: number }> = new Map();
        
        // Store edges to render after vertices
        const edges: Array<{
          source: string;
          target: string;
          style: string;
          value: string;
          geometry: Element | null;
        }> = [];
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        // First pass: calculate bounds and collect cell data
        cells.forEach(cell => {
          const geometry = cell.querySelector('mxGeometry');
          const isEdge = cell.getAttribute('edge') === '1';
          const isVertex = cell.getAttribute('vertex') === '1';
          const cellId = cell.getAttribute('id') || '';
          
          if (geometry && isVertex) {
            const x = parseFloat(geometry.getAttribute('x') || '0');
            const y = parseFloat(geometry.getAttribute('y') || '0');
            const width = parseFloat(geometry.getAttribute('width') || '100');
            const height = parseFloat(geometry.getAttribute('height') || '50');
            
            // Store position for edge connections
            cellPositions.set(cellId, { x, y, width, height });
            
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + width);
            maxY = Math.max(maxY, y + height);
          }
          
          // Collect edges for later rendering
          if (isEdge) {
            edges.push({
              source: cell.getAttribute('source') || '',
              target: cell.getAttribute('target') || '',
              style: cell.getAttribute('style') || '',
              value: cell.getAttribute('value') || '',
              geometry
            });
          }
        });

        // Default bounds if none found
        if (minX === Infinity) {
          minX = 0; minY = 0; maxX = 800; maxY = 600;
        }

        const padding = 40;
        const svgWidth = maxX - minX + padding * 2;
        const svgHeight = maxY - minY + padding * 2;
        const offsetX = -minX + padding;
        const offsetY = -minY + padding;

        // Second pass: render vertices
        cells.forEach(cell => {
          const geometry = cell.querySelector('mxGeometry');
          const style = cell.getAttribute('style') || '';
          const value = cell.getAttribute('value') || '';
          const vertex = cell.getAttribute('vertex') === '1';
          
          if (geometry && vertex) {
            const x = parseFloat(geometry.getAttribute('x') || '0') + offsetX;
            const y = parseFloat(geometry.getAttribute('y') || '0') + offsetY;
            const width = parseFloat(geometry.getAttribute('width') || '100');
            const height = parseFloat(geometry.getAttribute('height') || '50');

            // Parse style for colors
            const fillMatch = style.match(/fillColor=([^;]+)/);
            const strokeMatch = style.match(/strokeColor=([^;]+)/);
            const roundedMatch = style.match(/rounded=1/);
            
            let fill = fillMatch ? fillMatch[1] : '#ffffff';
            let stroke = strokeMatch ? strokeMatch[1] : '#333333';
            
            // Handle 'none' values
            if (fill === 'none') fill = 'transparent';
            if (stroke === 'none') stroke = 'transparent';
            
            const rx = roundedMatch ? 8 : 0;

            // Render rectangle
            svgElements.push(`
              <rect x="${x}" y="${y}" width="${width}" height="${height}" 
                    fill="${fill}" stroke="${stroke}" stroke-width="1.5" rx="${rx}"/>
            `);

            // Render text label
            if (value) {
              const cleanValue = value.replace(/<[^>]+>/g, '').trim();
              if (cleanValue) {
                svgElements.push(`
                  <text x="${x + width/2}" y="${y + height/2}" 
                        text-anchor="middle" dominant-baseline="middle"
                        font-family="Inter, system-ui, sans-serif" font-size="12" fill="#333">
                    ${cleanValue.substring(0, 40)}${cleanValue.length > 40 ? '...' : ''}
                  </text>
                `);
              }
            }
          }
        });

        // Third pass: render edges with animated flow
        edges.forEach((edge, index) => {
          const sourcePos = cellPositions.get(edge.source);
          const targetPos = cellPositions.get(edge.target);
          
          if (sourcePos && targetPos) {
            // Calculate connection points (center of each cell)
            const sx = sourcePos.x + sourcePos.width / 2 + offsetX;
            const sy = sourcePos.y + sourcePos.height / 2 + offsetY;
            const tx = targetPos.x + targetPos.width / 2 + offsetX;
            const ty = targetPos.y + targetPos.height / 2 + offsetY;
            
            // Calculate edge points on cell boundaries
            const angle = Math.atan2(ty - sy, tx - sx);
            
            // Start point: edge of source cell
            const startX = sourcePos.x + sourcePos.width / 2 + Math.cos(angle) * (sourcePos.width / 2) + offsetX;
            const startY = sourcePos.y + sourcePos.height / 2 + Math.sin(angle) * (sourcePos.height / 2) + offsetY;
            
            // End point: edge of target cell
            const endX = targetPos.x + targetPos.width / 2 - Math.cos(angle) * (targetPos.width / 2) + offsetX;
            const endY = targetPos.y + targetPos.height / 2 - Math.sin(angle) * (targetPos.height / 2) + offsetY;
            
            // Parse edge style
            const strokeMatch = edge.style.match(/strokeColor=([^;]+)/);
            const dashedMatch = edge.style.match(/dashed=1/);
            const strokeWidthMatch = edge.style.match(/strokeWidth=(\d+)/);
            
            let strokeColor = strokeMatch ? strokeMatch[1] : '#0066cc';
            if (strokeColor === 'none') strokeColor = '#0066cc';
            const strokeWidth = strokeWidthMatch ? parseInt(strokeWidthMatch[1]) : 2;
            
            // Create a curved path for smoother connections
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const dx = endX - startX;
            const dy = endY - startY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // Add some curve for longer connections
            const curveOffset = dist > 100 ? 20 : 0;
            const perpX = -dy / dist * curveOffset;
            const perpY = dx / dist * curveOffset;
            
            const pathId = `flow-path-${index}`;
            const pathD = curveOffset > 0
              ? `M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`
              : `M ${startX} ${startY} L ${endX} ${endY}`;
            
            // Render the edge with flow animation
            edgeElements.push(`
              <g class="animated-edge">
                <!-- Base path (static) -->
                <path d="${pathD}" 
                      fill="none" 
                      stroke="${strokeColor}" 
                      stroke-width="${strokeWidth}"
                      stroke-opacity="0.3"
                      ${dashedMatch ? 'stroke-dasharray="5,5"' : ''}
                />
                
                <!-- Animated flow path -->
                <path id="${pathId}" 
                      d="${pathD}" 
                      fill="none" 
                      stroke="${strokeColor}" 
                      stroke-width="${strokeWidth}"
                      stroke-dasharray="8,12"
                      class="flow-animation"
                      style="animation: flowAnimation 1.5s linear infinite; animation-delay: ${index * 0.2}s;"
                />
                
                <!-- Arrow marker at end -->
                <polygon 
                  points="${endX},${endY} ${endX - 10 * Math.cos(angle) + 5 * Math.sin(angle)},${endY - 10 * Math.sin(angle) - 5 * Math.cos(angle)} ${endX - 10 * Math.cos(angle) - 5 * Math.sin(angle)},${endY - 10 * Math.sin(angle) + 5 * Math.cos(angle)}"
                  fill="${strokeColor}"
                />
                
                <!-- Animated dot traveling along path -->
                <circle r="4" fill="${strokeColor}" class="flow-dot">
                  <animateMotion dur="2s" repeatCount="indefinite" begin="${index * 0.3}s">
                    <mpath href="#${pathId}"/>
                  </animateMotion>
                </circle>
              </g>
            `);
            
            // Add edge label if present
            if (edge.value) {
              const cleanValue = edge.value.replace(/<[^>]+>/g, '').trim();
              if (cleanValue) {
                edgeElements.push(`
                  <text x="${midX}" y="${midY - 8}" 
                        text-anchor="middle" 
                        font-family="Inter, system-ui, sans-serif" 
                        font-size="10" 
                        fill="#666"
                        style="background: white;">
                    ${cleanValue}
                  </text>
                `);
              }
            }
          }
        });

        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}">
            <style>
              @keyframes flowAnimation {
                from { stroke-dashoffset: 20; }
                to { stroke-dashoffset: 0; }
              }
              .flow-animation {
                animation: flowAnimation 1.5s linear infinite;
              }
              .flow-dot {
                filter: drop-shadow(0 0 3px currentColor);
              }
              .animated-edge:hover .flow-dot {
                r: 6;
              }
              .animated-edge:hover path {
                stroke-width: 3;
              }
            </style>
            <rect width="100%" height="100%" fill="#fafafa"/>
            <!-- Edges rendered first (behind vertices) -->
            ${edgeElements.join('\n')}
            <!-- Vertices on top -->
            ${svgElements.join('\n')}
          </svg>
        `;

        setSvgContent(svg);
        setLoading(false);
      } catch (err: any) {
        console.error('Failed to parse diagram:', err);
        setError(err.message || 'Failed to parse diagram');
        setLoading(false);
      }
    }

    parseDiagram();
  }, [xmlContent]);

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.5));
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
            onClick={() => setShowXml(!showXml)}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: showXml ? '#f1f5f9' : 'white',
              fontSize: 11,
              fontWeight: 500,
              color: '#64748b',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {showXml ? 'Hide XML' : 'View XML'}
          </button>
          <span style={{
            padding: '4px 10px',
            borderRadius: 6,
            background: '#eff6ff',
            color: '#3b82f6',
            fontWeight: 600,
            fontSize: 11,
          }}>
            draw.io
          </span>
        </div>
      </div>

      {/* Diagram viewer */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          height: 'calc(100vh - 280px)',
          minHeight: 450,
          background: '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <div style={{
              width: 40,
              height: 40,
              border: '3px solid #e2e8f0',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 12px',
            }} />
            <div style={{ fontSize: 12 }}>Loading diagram...</div>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: 40 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1" style={{ margin: '0 auto 12px' }}>
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            <div style={{ color: '#ef4444', fontSize: 13 }}>{error}</div>
          </div>
        ) : svgContent ? (
          <div
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          // Fallback preview card when SVG generation fails
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"/>
              </svg>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>
              {diagramTitle}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16, maxWidth: 360 }}>
              This diagram can be viewed by clicking "View XML" above or opening in diagrams.net
            </div>
            <a
              href="https://app.diagrams.net/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 20px',
                borderRadius: 8,
                background: '#3b82f6',
                color: 'white',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Open diagrams.net
            </a>
          </div>
        )}
      </div>

      {/* Raw XML (collapsible) */}
      {showXml && (
        <div style={{
          borderTop: '1px solid #e2e8f0',
          background: '#1e293b',
          maxHeight: 300,
          overflow: 'auto',
        }}>
          <pre style={{
            margin: 0,
            padding: 16,
            fontSize: 10,
            lineHeight: 1.5,
            color: '#e2e8f0',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
          }}>
            {xmlContent}
          </pre>
        </div>
      )}

      {/* Spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
