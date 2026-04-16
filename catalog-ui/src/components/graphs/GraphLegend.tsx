import React, { useState } from 'react';

export interface GraphLegendProps {
  defaultOpen?: boolean;
  title?: string;
}

export default function GraphLegend({
  defaultOpen = false,
  title = 'Node key',
}: GraphLegendProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="graph-panel-box"
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 12,
        overflow: 'hidden',
        maxWidth: 220,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
        className="graph-panel-heading"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '8px 12px',
          margin: 0,
          background: 'transparent',
          border: 'none',
          font: 'inherit',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <span>{title}</span>
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
      <span className="graph-panel-label">{label}</span>
    </div>
  );
}

function Swatch({ borderStyle, muted = false }: { borderStyle: 'solid' | 'dashed'; muted?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="graph-legend-swatch"
      style={{
        display: 'inline-block',
        width: 20,
        height: 14,
        borderWidth: 2,
        borderStyle,
        borderRadius: 3,
        opacity: muted ? 0.55 : 1,
        flexShrink: 0,
      }}
      data-muted={muted ? 'true' : undefined}
    />
  );
}

function CloudSwatch() {
  return (
    <span
      aria-hidden="true"
      className="graph-legend-swatch graph-legend-cloud"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 14,
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 3,
        flexShrink: 0,
      }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" />
      </svg>
    </span>
  );
}
