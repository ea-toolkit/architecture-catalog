---
title: Diagrams
description: View PlantUML, BPMN, and draw.io diagrams inline in the catalog.
---

The catalog includes a diagram viewer that renders PlantUML, BPMN, and draw.io diagrams directly in the browser. Diagrams are organized by domain and displayed on the `/diagrams` page.

<video src="/videos/Diagrams.mp4" controls muted playsinline style="width:100%;border-radius:8px;border:1px solid var(--sl-color-gray-5);margin:1rem 0"></video>

## Supported formats

| Format | Renderer | Source |
|--------|----------|--------|
| **PlantUML** | SVG via public PlantUML server | `.puml` source in data file |
| **BPMN** | [bpmn-js](https://bpmn.io/toolkit/bpmn-js/) | `.bpmn` XML in data file |
| **draw.io** | Native XML renderer | `.drawio` XML in data file |

## Viewer controls

All diagram viewers share a consistent toolbar:

| Control | Description |
|---------|-------------|
| **Zoom in/out** | Step-by-step zoom buttons |
| **Fit / Reset** | Fit diagram to viewport or reset zoom level |
| **Zoom percentage** | Shows current zoom level |
| **Format badge** | Shows the diagram type (PlantUML, BPMN, draw.io) |

### PlantUML extras

- **View Source** button toggles the raw PlantUML source code below the diagram
- **Zoom + pan** — hold Ctrl/Cmd + scroll to zoom, click-drag to pan when zoomed in

### BPMN extras

- Full interactive BPMN viewer with process flow visualization
- Supports all standard BPMN 2.0 elements

## Adding diagrams

Diagrams are defined in `catalog-ui/src/data/diagrams-mock.ts`. Each diagram entry specifies:

```typescript
{
  id: 'my-diagram',
  name: 'System Architecture',
  domain: 'customer-management',
  format: 'plantuml',
  source: `@startuml
    ...
  @enduml`,
}
```

## Dark mode behavior

Diagram canvases maintain a light background regardless of the theme setting. This ensures that diagram elements (arrows, text, shapes) rendered by external libraries (PlantUML server, bpmn-js) remain visible, since these renderers produce light-mode output natively.
