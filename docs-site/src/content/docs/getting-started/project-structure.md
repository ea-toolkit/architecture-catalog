---
title: Project Structure
description: Understand the repo layout and what each folder does.
---

```
architecture-catalog/
|
├── models/
│   └── registry-mapping.yaml    <- THE schema: defines types, fields, relationships
|
├── registry-v2/                 <- YOUR DATA: one .md file per architecture element
│   ├── 1-business/
│   ├── 2-organization/
│   ├── 3-application/
│   │   ├── architecture-area-domains/
│   │   ├── logical-components/
│   │   ├── software-systems/
│   │   ├── software-subsystems/
│   │   ├── physical-apis/
│   │   ├── logical-apis/
│   │   ├── data-concepts/
│   │   ├── data-aggregates/
│   │   ├── data-entities/
│   │   └── domain-events/
│   └── 4-technology/
|
├── catalog-ui/                  <- THE UI: Astro + React static site
│   └── src/
│       ├── lib/
│       │   ├── types.ts             <- TypeScript interfaces
│       │   └── registry-loader.ts   <- Reads YAML + Markdown -> in-memory graph
│       ├── data/
│       │   └── registry.ts          <- Bridge: exports domains, elements, edges
│       ├── pages/                   <- Astro pages (file-based routing)
│       ├── components/
│       │   ├── graphs/              <- React + xyflow graph components
│       │   └── diagrams/            <- draw.io, PlantUML, BPMN renderers
│       └── styles/
│           └── global.css           <- Design tokens + component styles
|
├── scripts/                     <- TOOLING: validation + generation
│   ├── validate.py                  <- Lint registry against mapping
│   └── generate_dashboard.py       <- Generate HTML health dashboard
|
├── views/                       <- DIAGRAMS: architecture diagrams by domain
│   └── customer-management/
|
└── docs-site/                   <- THIS DOCS SITE: Starlight (Astro)
```

## Key files

| File | Purpose |
|------|---------|
| `models/registry-mapping.yaml` | The single source of truth. Defines all element types, fields, relationships, layers, and branding. |
| `catalog-ui/src/lib/registry-loader.ts` | Core loader. Reads the YAML schema, scans Markdown files, resolves references, builds the in-memory graph. |
| `catalog-ui/src/data/registry.ts` | Bridge module. Converts the graph into arrays of domains and elements for Astro pages. |
| `catalog-ui/src/lib/types.ts` | TypeScript interfaces for the entire type system. |

## The three layers

```
Schema Layer    |  registry-mapping.yaml       |  Pure YAML, no code
----------------|------------------------------|
Data Layer      |  registry-v2/**/*.md         |  Pure Markdown, no code
----------------|------------------------------|
UI Layer        |  catalog-ui/src/             |  Reads schema + data
```

Each layer is independent:
- **Schema changes** don't require UI code changes
- **Data additions** don't require schema or UI changes
- **UI changes** don't require data format changes
