import React, { useState } from 'react';

export interface GraphLegendProps {
  defaultOpen?: boolean;
}

export default function GraphLegend({ defaultOpen = false }: GraphLegendProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        background: 'var(--legend-bg, rgba(255,255,255,0.96))',
        border: '1px solid var(--legend-border, #e2e8f0)',
        borderRadius: 8,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 12,
        color: 'var(--legend-text, #334155)',
        overflow: 'hidden',
        maxWidth: 220,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Collapse legend' : 'Expand legend'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '8px 12px',
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          font: 'inherit',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        <span>Legend</span>
        <span aria-hidden="true" style={{ fontSize: 10, opacity: 0.7 }}>
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open && (
        <div style={{ padding: '4px 12px 12px', display: 'grid', gap: 10 }}>
          <LegendRow swatch={<Swatch borderStyle="solid" />} label="Active" />
          <LegendRow swatch={<Swatch borderStyle="dashed" />} label="Planned (draft)" />
          <LegendRow swatch={<Swatch borderStyle="solid" muted />} label="Deprecated" />
          <LegendRow swatch={<CloudSwatch />} label="External / SaaS" />
        </div>
      )}
    </div>
  );
}

function LegendRow({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {swatch}
      <span>{label}</span>
    </div>
  );
}

function Swatch({ borderStyle, muted = false }: { borderStyle: 'solid' | 'dashed'; muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-block',
        width: 20,
        height: 14,
        border: `2px ${borderStyle} ${muted ? '#94a3b8' : '#64748b'}`,
        borderRadius: 3,
        background: 'var(--legend-swatch-bg, #f8fafc)',
        opacity: muted ? 0.55 : 1,
        flexShrink: 0,
      }}
    />
  );
}

function CloudSwatch() {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 14,
        border: '1px solid #64748b',
        borderRadius: 3,
        color: '#64748b',
        flexShrink: 0,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    </span>
  );
}
