// catalog-ui/src/components/graphs/index.ts
// Export all graph components

export { default as DomainContextMap } from './DomainContextMap';
export { default as ElementContextGraph } from './ElementContextGraph';
export { default as BaseNode } from './nodes/BaseNode';
export { default as ArchimateEdge, EdgeMarkerDefs } from './edges/ArchimateEdge';

// Utils
export { applyDagreLayout, getGraphBounds } from './utils/layout';
export { buildDomainGraph, buildFocusGraph, buildElementGraph } from './utils/graph-data';
export { NODE_STYLES, EDGE_STYLES, getNodeStyle, getEdgeStyle } from './utils/colors';
export type { NodeStyle, EdgeStyle } from './utils/colors';
