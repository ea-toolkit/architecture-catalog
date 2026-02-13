---
title: How It Works
description: The architecture of Architecture Catalog.
---

## System overview

```
                      BUILD TIME (Astro SSG)

  registry-mapping.yaml        registry-v2/**/*.md
         |                            |
         v                            v
  +-----------------------------------------+
  |        registry-loader.ts               |
  |  - Parses mapping YAML                  |
  |  - Scans .md files per type folder      |
  |  - Parses frontmatter                   |
  |  - Resolves cross-references            |
  |  - Builds in-memory graph               |
  +-----------------------------------------+
                    |
                    v
  +-----------------------------------------+
  |         registry.ts (bridge)            |
  |  - Converts graph -> Domain[] + Element[]|
  |  - Exports LAYER_META, SITE_CONFIG      |
  |  - Build-time singleton (runs once)     |
  +-----------------------------------------+
                    |
                    v
  +-----------------------------------------+
  |        Astro Pages (.astro)             |
  |  - index.astro      -> Dashboard        |
  |  - discover.astro   -> Search & filter  |
  |  - catalog/[id]     -> Element detail   |
  |  - domains/[id]     -> Domain overview  |
  |  - domains/[id]/context-map -> Graph    |
  +-----------------------------------------+
                    |
                    v
  +-----------------------------------------+
  |      Static HTML/CSS/JS (dist/)         |
  |  - One .html file per element           |
  |  - React islands for interactive graphs |
  |  - Zero runtime dependencies            |
  +-----------------------------------------+
```

## Build-time vs runtime

| Aspect | Build-time | Runtime |
|--------|-----------|---------|
| YAML parsing | Yes | -- |
| File system access | Yes | -- |
| Reference resolution | Yes | -- |
| Graph construction | Yes | -- |
| Page rendering | Yes | -- |
| React graph interaction | -- | Yes (client-side) |
| Search/filter | -- | Yes (client-side JS) |
| Navigation | -- | Yes (static HTML + links) |

The resulting `dist/` folder contains only static files. No server, no database, no API calls.

## Tech stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Astro](https://astro.build) | 5.x | Static site generation, file-based routing |
| [React](https://react.dev) | 18.x | Interactive components (graphs, diagrams) |
| [React Flow](https://reactflow.dev) | 12.x | Graph visualization with drag and zoom |
| [dagre](https://github.com/dagrejs/dagre) | 0.8.x | Automatic graph layout (left-to-right) |
| [js-yaml](https://github.com/nodeca/js-yaml) | 4.x | YAML parsing for frontmatter + mapping |
| Python 3 | 3.9+ | Validation scripts, dashboard generation |
