// catalog-ui/src/components/graphs/nodes/BaseNode.tsx
// EventCatalog-style node component with clean header and card design

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { NodeStyle } from '../utils/colors';

export interface BaseNodeData {
  label: string;
  type: string;
  elementType: string;
  catalogUrl: string;
  style?: NodeStyle;
  status?: string;
  makeBuy?: string;
  color?: string;
  isFocusCenter?: boolean;
  opacity?: number;
  /** Schema-derived icon emoji from registry-mapping.yaml — used as fallback */
  mappingIcon?: string;
}

// Icon mapping for different element types
const ELEMENT_ICONS: Record<string, React.ReactNode> = {
  business_capability: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  business_process_module: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="M4 12h16" />
      <path d="M12 4v16" />
    </svg>
  ),
  logical_component: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 8h16" />
    </svg>
  ),
  software_system: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  ),
  software_subsystem: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="5" width="16" height="12" rx="2" />
      <path d="M8 17h8" />
    </svg>
  ),
  logical_business_api: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h16" />
      <path d="M9 4v16" />
    </svg>
  ),
  physical_business_api: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l10 6v8l-10 6-10-6V8l10-6z" />
    </svg>
  ),
  data_concept: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  ),
  data_aggregate: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18" />
      <path d="M3 9h18" />
    </svg>
  ),
  data_entity: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 10h16" />
    </svg>
  ),
  domain_event: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  product: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  customer_segment: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  business_service: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  hosting_node: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  ),
  technology_infrastructure: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
    </svg>
  ),
  default: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  ),
};

export default function BaseNode({ data, id }: NodeProps) {
  const d = data as BaseNodeData;
  const style = d.style;
  const isFocused = d.isFocusCenter;
  // Use hardcoded SVG icon if available, then mappingIcon emoji from YAML, then generic default
  const icon = ELEMENT_ICONS[d.type] || (
    d.mappingIcon && d.mappingIcon !== '▪'
      ? <span style={{ fontSize: 14, lineHeight: 1 }}>{d.mappingIcon}</span>
      : ELEMENT_ICONS.default
  );
  const [hovered, setHovered] = React.useState(false);

  const defaultShadow = '0 1px 4px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)';
  const hoverShadow = `0 4px 12px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)`;
  const focusShadow = `0 0 0 3px ${style?.border}40, 0 4px 12px rgba(0,0,0,0.12)`;

  return (
    <div
      className="base-node"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        border: `2px solid ${style?.border || '#e2e8f0'}`,
        borderRadius: '8px',
        minWidth: 200,
        maxWidth: 280,
        fontFamily: 'Inter, system-ui, sans-serif',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s, border-color 0.2s, transform 0.2s',
        transform: hovered && !isFocused ? 'translateY(-1px)' : 'none',
        boxShadow: isFocused ? focusShadow : hovered ? hoverShadow : defaultShadow,
        position: 'relative',
        opacity: d.opacity ?? 1,
        overflow: 'hidden',
      }}
    >
      {/* Handles for edges - smaller and cleaner */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: style?.border || '#94a3b8',
          width: 10,
          height: 10,
          border: '2px solid white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: style?.border || '#94a3b8',
          width: 10,
          height: 10,
          border: '2px solid white',
          boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        }}
      />

      {/* Header section with colored background */}
      <div
        style={{
          background: style?.bg || '#f8fafc',
          padding: '10px 14px',
          borderBottom: `1px solid ${style?.border}30`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {/* Icon in colored circle */}
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: `${style?.border}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: style?.border || '#64748b',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>

        {/* Type and name */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: style?.text || '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: 2,
            }}
          >
            {d.elementType}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#1e293b',
              lineHeight: 1.25,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {d.label}
          </div>
        </div>
      </div>

      {/* Content section */}
      <div style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Status / Make-Buy badges */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {d.status && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 4,
                background: d.status === 'active' ? '#dcfce7' : d.status === 'planned' ? '#dbeafe' : '#fee2e2',
                color: d.status === 'active' ? '#166534' : d.status === 'planned' ? '#1e40af' : '#991b1b',
              }}
            >
              {d.status}
            </span>
          )}
          {d.makeBuy && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 4,
                background: d.makeBuy === 'make' ? '#f3e8ff' : d.makeBuy === 'buy' ? '#fef3c7' : '#e0e7ff',
                color: d.makeBuy === 'make' ? '#7c3aed' : d.makeBuy === 'buy' ? '#b45309' : '#4338ca',
              }}
            >
              {d.makeBuy}
            </span>
          )}
          {!d.status && !d.makeBuy && (
            <span style={{ fontSize: 10, color: '#94a3b8' }}>—</span>
          )}
        </div>

        {/* Doc link icon */}
        <a
          href={d.catalogUrl}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            background: '#f1f5f9',
            color: '#64748b',
            textDecoration: 'none',
            transition: 'all 0.15s',
            flexShrink: 0,
          }}
          title={`View ${d.label} details`}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = style?.border || '#3b82f6';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.color = '#64748b';
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </a>
      </div>

      {/* Focus indicator line at top */}
      {isFocused && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: style?.border || '#3b82f6',
          }}
        />
      )}
    </div>
  );
}
