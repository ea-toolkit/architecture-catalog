// catalog-ui/src/components/graphs/edges/RelationshipEdge.tsx
// Custom edge component with relationship styling and styled tooltips

import React, { useState, useRef, useEffect } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { getEdgeStyle } from '../utils/colors';

export interface RelationshipEdgeData {
  relationship: string;
  /** Custom label override — if set, takes priority over the style-derived label */
  label?: string;
  /** Tooltip content — either plain text or structured integration data */
  tooltip?: string;
  /** Structured tooltip data for rich rendering */
  tooltipSections?: Array<{ category: string; items: Array<{ id: string; name: string } | string> }>;
  showLabel?: boolean;
}

export default function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const edgeData = data as RelationshipEdgeData | undefined;
  const relationship = edgeData?.relationship || 'default';
  const style = getEdgeStyle(relationship);
  const showLabel = edgeData?.showLabel !== false;
  const displayLabel = edgeData?.label || style.label;
  const tooltipSections = edgeData?.tooltipSections;
  const hasTooltip = tooltipSections && tooltipSections.length > 0;

  const [showTooltip, setShowTooltip] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = () => {
    if (!hasTooltip) return;
    clearTimeout(hideTimeout.current);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => setShowTooltip(false), 150);
  };

  useEffect(() => {
    return () => clearTimeout(hideTimeout.current);
  }, []);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#3b82f6' : style.stroke,
          strokeWidth: selected ? style.strokeWidth + 1 : style.strokeWidth,
          strokeDasharray: style.strokeDasharray,
        }}
        markerEnd="url(#arrowhead)"
      />
      {showLabel && displayLabel && (
        <EdgeLabelRenderer>
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: 'var(--edge-label-bg, rgba(255,255,255,0.95))',
              padding: '3px 8px',
              borderRadius: 0,
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--edge-label-text, #475569)',
              border: '1px solid var(--edge-label-border, #cbd5e1)',
              pointerEvents: hasTooltip ? 'auto' : 'none',
              whiteSpace: 'nowrap',
              cursor: hasTooltip ? 'pointer' : 'default',
            }}
          >
            {displayLabel}

            {/* Custom styled tooltip */}
            {hasTooltip && showTooltip && (
              <div
                className="edge-tooltip"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {tooltipSections.map((section) => (
                  <div key={section.category} className="edge-tooltip-section">
                    <div className="edge-tooltip-category">{section.category}</div>
                    {section.items.map((item) => {
                      const isLinked = typeof item === 'object' && item.id;
                      const name = typeof item === 'string' ? item : item.name;
                      const key = typeof item === 'string' ? item : item.id;
                      return (
                        <div key={key} className="edge-tooltip-item">
                          <span className="edge-tooltip-arrow">&rarr;</span>
                          {isLinked ? (
                            <a
                              href={`/catalog/${(item as { id: string }).id}`}
                              className="edge-tooltip-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {name}
                            </a>
                          ) : name}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

// SVG marker definition for arrowheads - add to ReactFlow wrapper
export function EdgeMarkerDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <marker
          id="arrowhead"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path
            d="M2,2 L10,6 L2,10 L4,6 L2,2"
            fill="#64748b"
          />
        </marker>
        <marker
          id="arrowhead-selected"
          markerWidth="12"
          markerHeight="12"
          refX="10"
          refY="6"
          orient="auto"
        >
          <path
            d="M2,2 L10,6 L2,10 L4,6 L2,2"
            fill="#3b82f6"
          />
        </marker>
        <marker
          id="diamond"
          markerWidth="16"
          markerHeight="16"
          refX="8"
          refY="8"
          orient="auto"
        >
          <path
            d="M1,8 L8,1 L15,8 L8,15 Z"
            fill="#64748b"
          />
        </marker>
        <marker
          id="diamond-open"
          markerWidth="16"
          markerHeight="16"
          refX="8"
          refY="8"
          orient="auto"
        >
          <path
            d="M1,8 L8,1 L15,8 L8,15 Z"
            fill="white"
            stroke="#64748b"
            strokeWidth="1.5"
          />
        </marker>
      </defs>
    </svg>
  );
}
