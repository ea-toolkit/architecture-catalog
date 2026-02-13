# ReactFlow Diagrams — Implementation Plan

## Current State (Step 1 — DONE)

ReactFlow is fully integrated with:
- **1 custom node type** (BaseNode) — EventCatalog-style cards with icon, type label, name, status/make-buy badges, doc link
- **1 custom edge type** (ArchimateEdge) — Bezier curves with ArchiMate-style markers (arrows, diamonds), edge labels, 11+ relationship types
- **Dagre layout** — left-to-right hierarchical positioning using element ranks from `meta-model.config.ts`
- **3 graph views:**
  - `DomainContextMap` — full domain graph on `/domains/[id]` page (pan, zoom, minimap, controls, legend)
  - `ElementContextGraph` — small context graph on `/catalog/[id]` detail pages
  - `FocusModeModal` — full-screen modal with center node + immediate parents/children, click-to-navigate
- **14 node type styles** with distinct colors, borders, and icons
- **Status/make-buy badges** on nodes

## Step 2 — Improvements Checklist

### High Priority (demo quality)

- [ ] **Edge hover tooltips** — show relationship type + description on hover
- [ ] **Node hover effect** — subtle highlight/scale on hover (currently only doc icon has hover)
- [ ] **Click-to-navigate from graph** — clicking a node's doc icon navigates to `/catalog/[id]` page
- [ ] **Edge type legend** — add relationship type legend alongside the existing element type legend
- [ ] **Layer grouping visual** — show colored background bands or borders grouping nodes by layer
- [ ] **Better edge label readability** — increase font size at low zoom, or show on hover only

### Medium Priority (polish)

- [ ] **Filter by type** — toggle element types on/off in the legend to filter the graph
- [ ] **Filter by status** — show/hide active/planned/deprecated elements
- [ ] **Search in graph** — type to find and highlight a specific node
- [ ] **Export to PNG/SVG** — download button for the current graph view
- [ ] **Focus mode breadcrumb** — show navigation path when clicking through nodes in focus mode
- [ ] **Keyboard navigation** — arrow keys to move between connected nodes
- [ ] **Responsive layout** — adjust graph sizing for different viewport widths

### Low Priority (nice to have)

- [ ] **Performance: virtualization** — only render visible nodes (matters for 100+ element graphs)
- [ ] **Relationship detail panel** — click an edge to see full relationship metadata
- [ ] **Animation** — smooth transitions when switching focus nodes or filtering
- [ ] **Dark mode** — respect system preference for graph colors
- [ ] **Custom layout modes** — toggle between LR (left-to-right) and TB (top-bottom) layout
- [ ] **Multi-select** — select multiple nodes to see shared relationships

## Files to Modify

| File | Purpose |
|------|---------|
| `catalog-ui/src/components/graphs/nodes/BaseNode.tsx` | Node hover effects, click handlers |
| `catalog-ui/src/components/graphs/edges/ArchimateEdge.tsx` | Edge tooltips, label improvements |
| `catalog-ui/src/components/graphs/DomainContextMap.tsx` | Legend enhancements, filtering, export |
| `catalog-ui/src/components/graphs/FocusModeModal.tsx` | Breadcrumb, keyboard nav |
| `catalog-ui/src/components/graphs/utils/colors.ts` | Layer grouping colors |
| `catalog-ui/src/components/graphs/utils/layout.ts` | Layer band positioning |
| `catalog-ui/src/config/meta-model.config.ts` | Layer-to-color mapping |

## Architecture Notes

- All graph components use `client:only="react"` — they don't run during SSG
- Layout is computed once via dagre, then ReactFlow handles pan/zoom
- Node styles come from `getNodeStyle(type)` in `utils/colors.ts`
- Edge styles come from `getEdgeStyle(relationship)` in `utils/colors.ts`
- Element hierarchy ranks come from `meta-model.config.ts` — these control dagre layer assignment
- Graph data builders are in `utils/graph-data.ts` — `buildDomainGraph()`, `buildElementGraph()`, `buildFocusGraph()`