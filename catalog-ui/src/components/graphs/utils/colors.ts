// catalog-ui/src/components/graphs/utils/colors.ts
// Node and edge styling based on ArchiMate meta model element types

export interface NodeStyle {
  bg: string;           // Background color
  border: string;       // Border color
  text: string;         // Text color
  borderStyle: string;  // solid | dashed | dotted
  borderRadius: string; // CSS border-radius
  icon: string;         // Short type abbreviation
}

export const NODE_STYLES: Record<string, NodeStyle> = {
  domain: {
    bg: '#eff6ff', border: '#3b82f6', text: '#1e40af',
    borderStyle: 'solid', borderRadius: '12px', icon: 'D',
  },
  logical_component: {
    bg: '#f5f3ff', border: '#8b5cf6', text: '#5b21b6',
    borderStyle: 'solid', borderRadius: '8px', icon: 'LC',
  },
  software_system: {
    bg: '#ecfdf5', border: '#10b981', text: '#065f46',
    borderStyle: 'solid', borderRadius: '8px', icon: 'SS',
  },
  software_subsystem: {
    bg: '#ecfdf5', border: '#6ee7b7', text: '#065f46',
    borderStyle: 'dashed', borderRadius: '8px', icon: 'Sub',
  },
  logical_business_api: {
    bg: '#eef2ff', border: '#6366f1', text: '#3730a3',
    borderStyle: 'solid', borderRadius: '16px', icon: 'API',
  },
  physical_business_api: {
    bg: '#eef2ff', border: '#a5b4fc', text: '#3730a3',
    borderStyle: 'dashed', borderRadius: '16px', icon: 'pAPI',
  },
  data_concept: {
    bg: '#fffbeb', border: '#f59e0b', text: '#92400e',
    borderStyle: 'solid', borderRadius: '20px', icon: 'DC',
  },
  data_aggregate: {
    bg: '#fffbeb', border: '#fbbf24', text: '#92400e',
    borderStyle: 'dashed', borderRadius: '20px', icon: 'DA',
  },
  data_entity: {
    bg: '#fffbeb', border: '#fde68a', text: '#92400e',
    borderStyle: 'dotted', borderRadius: '20px', icon: 'DE',
  },
  domain_event: {
    bg: '#fef2f2', border: '#ef4444', text: '#991b1b',
    borderStyle: 'solid', borderRadius: '8px', icon: 'Ev',
  },
  business_process_module: {
    bg: '#fffbeb', border: '#f59e0b', text: '#92400e',
    borderStyle: 'solid', borderRadius: '4px', icon: 'BP',
  },
  principle: {
    bg: '#fdf4ff', border: '#d946ef', text: '#86198f',
    borderStyle: 'solid', borderRadius: '8px', icon: 'PR',
  },
  actor: {
    bg: '#fff7ed', border: '#f97316', text: '#9a3412',
    borderStyle: 'solid', borderRadius: '50%', icon: 'A',
  },
  role: {
    bg: '#fff7ed', border: '#fb923c', text: '#9a3412',
    borderStyle: 'dashed', borderRadius: '50%', icon: 'R',
  },
};

// ArchiMate edge styles
export interface EdgeStyle {
  stroke: string;
  strokeDasharray?: string;
  strokeWidth: number;
  label: string;
  markerEnd?: string;
}

export const EDGE_STYLES: Record<string, EdgeStyle> = {
  'composition':   { stroke: '#64748b', strokeWidth: 2, label: 'composes' },
  'realization':   { stroke: '#64748b', strokeWidth: 2, strokeDasharray: '6 3', label: 'realizes' },
  'realized-by':   { stroke: '#64748b', strokeWidth: 2, strokeDasharray: '6 3', label: 'realized by' },
  'aggregation':   { stroke: '#64748b', strokeWidth: 1.5, label: 'aggregates' },
  'access':        { stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: '3 3', label: 'accesses' },
  'accesses':      { stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: '3 3', label: 'accesses' },
  'accessed-by':   { stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: '3 3', label: 'accessed by' },
  'trigger':       { stroke: '#64748b', strokeWidth: 1, label: 'triggers' },
  'automated-by':  { stroke: '#64748b', strokeWidth: 1, label: 'automated by' },
  'supported-by':  { stroke: '#64748b', strokeWidth: 1, label: 'supported by' },
  'realizes':      { stroke: '#64748b', strokeWidth: 2, strokeDasharray: '6 3', label: 'realizes' },
  'serves':        { stroke: '#64748b', strokeWidth: 1, label: 'serves' },
  'default':       { stroke: '#94a3b8', strokeWidth: 1, label: '' },
};

export function getNodeStyle(type: string): NodeStyle {
  return NODE_STYLES[type] || NODE_STYLES['logical_component'];
}

export function getEdgeStyle(relationship: string): EdgeStyle {
  return EDGE_STYLES[relationship] || EDGE_STYLES['default'];
}
