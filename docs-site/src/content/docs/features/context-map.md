---
title: Context Map
description: Interactive domain dependency graphs with search, filter, and focus mode.
---

The domain context map is an interactive graph showing all elements in a domain and their relationships. It's powered by [React Flow](https://reactflow.dev) with automatic [dagre](https://github.com/dagrejs/dagre) layout.

<video src="/videos/Context_Map.mp4" controls muted playsinline style="width:100%;border-radius:8px;border:1px solid var(--sl-color-gray-5);margin:1rem 0"></video>

## Layout

Elements are arranged left-to-right based on their `graph_rank` from the mapping YAML:

```
rank 0          rank 1           rank 2           rank 3
Domain    ->    Components  ->   Systems     ->   Events
(anchor)        Capabilities     Subsystems       Data
```

The rank determines the column position. Elements with the same rank are stacked vertically.

## Controls

### Toolbar (top-right)

| Control | Description |
|---------|-------------|
| **Search** | Type to dim non-matching nodes (matching nodes stay fully visible) |
| **Status filter** | Toggle between All, Active, Draft, Deprecated |
| **PNG export** | Download the current graph view as a PNG image |

### Legend (bottom-right)

Click any element type in the legend to **hide/show** that type in the graph. This is useful for focusing on specific layers (e.g., hide all data concepts to see only the system landscape).

The legend also shows relationship types with their line styles (solid, dashed, etc.).

### Zoom and pan

- **Scroll** to zoom in/out
- **Click and drag** the background to pan
- **Zoom controls** (top-left) for step-by-step zoom, fit-to-view, and lock

## Focus mode

Double-click any node to enter **focus mode** — a full-screen modal showing only that element and its immediate neighbors (1 hop). Click any connected node to navigate to it, building an exploration path through the graph.

Press **Escape** or click the X to exit focus mode.

## Node design

Each node shows:

- **Header** — colored background with element type icon and name
- **Type label** — uppercase text identifying the element type
- **Status badge** — active/draft/deprecated
- **Sourcing badge** — build/buy/inherit (if set)
- **Doc link** — click to navigate to the element's detail page

Nodes are styled based on their layer color from the mapping YAML. Unknown element types fall back to schema-derived colors automatically.

## Edge labels

Relationship edges show their type label (e.g., "composes", "realizes", "serves"). Edge styles are configured in `meta-model.config.ts` and support solid, dashed, and dotted lines.
