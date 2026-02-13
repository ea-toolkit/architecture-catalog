// catalog-ui/src/components/graphs/edges/RelationshipEdge.tsx
// Custom edge component with relationship styling

import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react';
import { getEdgeStyle } from '../utils/colors';

export interface RelationshipEdgeData {
  relationship: string;
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
      {showLabel && style.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              background: 'rgba(255,255,255,0.95)',
              padding: '3px 8px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 500,
              color: '#475569',
              border: '1px solid #cbd5e1',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            {style.label}
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
