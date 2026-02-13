# Architecture Guide

A deep-dive into how the Architecture Catalog works internally.
Read this if you want to extend the UI, understand the data pipeline,
or contribute to the project.

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     BUILD TIME (Astro SSG)                       │
│                                                                 │
│  ┌──────────────────┐    ┌──────────────────┐                   │
│  │ registry-mapping  │    │   registry-v2/   │                   │
│  │     .yaml         │    │    **/*.md        │                   │
│  └────────┬─────────┘    └────────┬─────────┘                   │
│           │                       │                              │
│           ▼                       ▼                              │
│  ┌────────────────────────────────────────────┐                  │
│  │          registry-loader.ts                 │                  │
│  │  • Parses mapping YAML                      │                  │
│  │  • Scans .md files per type folder          │                  │
│  │  • Parses frontmatter                       │                  │
│  │  • Resolves cross-references                │                  │
│  │  • Builds in-memory graph (RegistryGraph)   │                  │
│  └────────────────┬───────────────────────────┘                  │
│                   │                                              │
│                   ▼                                              │
│  ┌────────────────────────────────────────────┐                  │
│  │            registry.ts (bridge)             │                  │
│  │  • Converts graph → Domain[] + Element[]    │                  │
│  │  • Exports LAYER_META, SITE_CONFIG, etc.    │                  │
│  │  • Build-time singleton (runs once)         │                  │
│  └────────────────┬───────────────────────────┘                  │
│                   │                                              │
│                   ▼                                              │
│  ┌────────────────────────────────────────────┐                  │
│  │           Astro Pages (.astro)              │                  │
│  │  • index.astro       → Dashboard            │                  │
│  │  • discover.astro    → Search & filter       │                  │
│  │  • catalog/[id]      → Element detail        │                  │
│  │  • domains/[id]      → Domain overview        │                  │
│  │  • domains/[id]/context-map → Graph view      │                  │
│  └────────────────┬───────────────────────────┘                  │
│                   │                                              │
│                   ▼                                              │
│  ┌────────────────────────────────────────────┐                  │
│  │         Static HTML/CSS/JS (dist/)          │                  │
│  │  • One .html file per element               │                  │
│  │  • React islands for interactive graphs     │                  │
│  │  • Zero runtime dependencies                │                  │
│  └────────────────────────────────────────────┘                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Pipeline

### Phase 1: Schema Loading

**File:** `catalog-ui/src/lib/registry-loader.ts` → `loadMapping()`

Reads `models/registry-mapping.yaml` and parses it into a `RegistryMapping` TypeScript object. This provides:

- Element type definitions (what exists?)
- Field schemas (what metadata?)
- Relationship declarations (how do things connect?)
- Layer definitions (how to group and color?)
- Site config (branding)

### Phase 2: File Discovery

**File:** `registry-loader.ts` → inside `loadRegistry()`

For each element type in the mapping:
1. Resolve the `folder` path relative to `registry_root`
2. Glob for `*.md` files (excluding `_template.md`)
3. Parse YAML frontmatter from each file
4. Create a `RegistryElement` with a composite ID: `<typeKey>--<slug>`

### Phase 3: Index Building

**File:** `registry-loader.ts` → `buildRawIndexes()`

Builds three indexes for fast lookups:

| Index | Key | Value | Purpose |
|-------|-----|-------|---------|
| `byType` | element type key | `RegistryElement[]` | List all elements of a given type |
| `bySlug` | composite slug | `RegistryElement[]` | Resolve references by filename |
| `byDomain` | domain name | `RegistryElement[]` | Group elements for domain views |

**Important:** `bySlug` returns arrays (not single elements) because different types can have the same filename. The `resolveRef` function uses a `targetType` parameter to disambiguate.

### Phase 4: Reference Resolution

**File:** `registry-loader.ts` → `resolveRef()`

For each relationship declared in the mapping:
1. Read the frontmatter field value(s) from the source element
2. Use the `resolve_by` strategy to find target elements:
   - `slug` — match filename
   - `name` — match `name:` frontmatter field
   - `abbreviation` — match `abbreviation:` field
3. The `targetType` from the mapping constrains which type to look in
4. Create a `RegistryEdge` with source, target, type, and fieldKey

**Unresolved references:** If the target can't be found, the edge is created with `resolved: false` and the raw value is preserved. The UI shows a ⚠️ indicator.

### Phase 5: Graph Assembly

**File:** `registry-loader.ts` → `loadRegistry()` returns `RegistryGraph`

```typescript
interface RegistryGraph {
  mapping: RegistryMapping;        // The parsed schema
  elements: Map<string, RegistryElement>;  // ID → element
  edges: RegistryEdge[];           // All resolved + unresolved edges
  indexes: {
    byType: Map<string, RegistryElement[]>;
    bySlug: Map<string, RegistryElement[]>;
    byDomain: Map<string, RegistryElement[]>;
    edgesBySource: Map<string, RegistryEdge[]>;
    edgesByTarget: Map<string, RegistryEdge[]>;
  };
}
```

### Phase 6: Legacy Conversion

**File:** `catalog-ui/src/data/registry.ts`

The bridge module converts the `RegistryGraph` into simpler shapes for page templates:

- `Domain[]` — domain cards with counts, maturity, color
- `Element[]` — flat element list with outgoing + incoming relationships
- Helper maps: `LAYER_META`, `SITE_CONFIG`, `TYPE_BADGES`, `REL_TYPE_LABELS`

---

## Key Data Structures

### RegistryElement

```typescript
interface RegistryElement {
  id: string;           // "software_subsystem--order-routing-engine"
  typeKey: string;      // "software_subsystem"
  slug: string;         // "order-routing-engine"
  fields: Record<string, unknown>;  // All frontmatter data
  body: string;         // Markdown content below frontmatter
  health: {
    hasDescription: boolean;
    hasOwner: boolean;
    missingRequired: string[];
    brokenRefs: string[];
    connected: boolean;
  };
}
```

### RegistryEdge

```typescript
interface RegistryEdge {
  sourceId: string;           // Composite ID of source element
  targetId: string;           // Composite ID of target element
  relationshipType: string;   // Key from relationship_types
  fieldKey: string;           // Frontmatter field that declared this edge
  resolved: boolean;          // Whether the target was found
  raw?: string;               // Original reference value (for broken refs)
}
```

### RegistryMapping (TypeScript)

```typescript
interface RegistryMapping {
  version: string;
  registry_root: string;
  site: SiteConfig;
  layers: Record<string, LayerDef>;
  relationship_types: Record<string, RelationshipTypeDef>;
  domain_color_palette: string[];
  elements: Record<string, ElementTypeDef>;
}
```

---

## Page Architecture

### Astro Pages

Each `.astro` file in `src/pages/` generates one or more HTML pages:

| Page | Route | Data Source |
|------|-------|-------------|
| `index.astro` | `/` | `domains`, `elements`, `LAYER_META`, `SITE_CONFIG` |
| `discover.astro` | `/discover` | `elements`, `TYPE_BADGES` |
| `catalog/[id].astro` | `/catalog/<id>` | `getElementById()`, `TYPE_BADGES`, `REL_TYPE_LABELS` |
| `domains/[id]/index.astro` | `/domains/<id>` | `getDomainById()`, `getElementsByDomain()` |
| `domains/[id]/context-map.astro` | `/domains/<id>/context-map` | Graph edges for the domain |

### React Islands

Interactive components are React "islands" that hydrate on the client:

| Component | Location | Purpose |
|-----------|----------|---------|
| `ContextGraph` | `components/graphs/` | React Flow graph with dagre layout |
| `DrawioViewer` | `components/diagrams/` | Renders draw.io XML diagrams |

These components receive serialized data as props from Astro pages and hydrate
using `client:load` or `client:visible` directives.

---

## Schema-Driven Design

The core principle is that **the UI code has zero knowledge of specific element types, fields, or domains.** Everything is derived from `registry-mapping.yaml` at build time.

### How the UI discovers types

```typescript
// registry-loader.ts
for (const [typeKey, typeDef] of Object.entries(mapping.elements)) {
  // typeKey: "software_system", "data_concept", etc.
  // typeDef: { label, layer, folder, fields, relationships, ... }
  // → UI doesn't need to know what types exist ahead of time
}
```

### How the UI shows relationship labels

```typescript
// The fieldKey "composes_physical_apis" becomes:
//   outgoing: "Composes Physical Business APIs"
//   incoming: "Part of Software Subsystem"
// Derived from: relationship_type verb + target element label
export function deriveRelFieldLabel(
  fieldKey: string,
  mapping: RegistryMapping,
  direction: 'out' | 'in'
): string { ... }
```

### How domain colors are assigned

```typescript
// Domains are auto-discovered from frontmatter `domain:` field.
// Colors cycle through domain_color_palette:
const colorIndex = i % palette.length;
const color = palette[colorIndex];
```

---

## Build-Time vs Runtime

| Aspect | Build-time | Runtime |
|--------|-----------|---------|
| YAML parsing | ✅ | — |
| File system access | ✅ | — |
| Reference resolution | ✅ | — |
| Graph construction | ✅ | — |
| Page rendering | ✅ | — |
| React graph interaction | — | ✅ (client-side) |
| Search/filter | — | ✅ (client-side JS) |
| Navigation | — | ✅ (static HTML + links) |

The resulting `dist/` folder contains only static files. No server, no database,
no API calls.

---

## File Naming & ID Conventions

### File naming

Element files should use kebab-case:

```
billing-worker.md
tenant-api.md
tenant-account.md
```

### Composite IDs

IDs are formed as `<typeKey>--<slug>`:

```
software_subsystem--billing-worker
physical_business_api--tenant-api
data_concept--tenant-account
```

The `--` separator prevents collisions between types. Different types can have
files with the same slug (e.g., `data-concepts/tenant-account.md` and
`domain-events/tenant-account.md`) and they'll get distinct IDs.

### URL paths

Element detail pages use the composite ID:

```
/catalog/software_subsystem--order-routing-engine
```

---

## Error Handling

### Missing mapping

If `registry-mapping.yaml` can't be found, the loader throws and `registry.ts`
catches it, falling back to empty arrays. The build succeeds but the catalog
shows no data.

### Missing folders

If an element type's `folder` doesn't exist, the loader skips it with a
console warning. Other types still load normally.

### Broken references

Unresolved references are captured in the element's `health.brokenRefs` array
and in edge objects (`resolved: false`). The UI renders them with a ⚠️ indicator.
The linter script reports them in validation.

### Unknown fields

Extra frontmatter fields not declared in the mapping are silently preserved
in `fields` but not rendered in the UI unless you add them to the mapping.

---

## Extending the UI

### Adding a new page

1. Create a `.astro` file in `src/pages/`
2. Import data from `../data/registry`
3. Use the `Layout` component for consistent chrome

```astro
---
import Layout from '../layouts/Layout.astro';
import { elements, LAYER_META } from '../data/registry';

const apiElements = elements.filter(e => e.type === 'physical_business_api');
---

<Layout title="API Inventory">
  <h1>All APIs ({apiElements.length})</h1>
  <!-- your content -->
</Layout>
```

### Adding a React component

1. Create a `.tsx` file in `src/components/`
2. Accept serialized data as props
3. Use `client:load` or `client:visible` in the Astro page

```tsx
// src/components/MyChart.tsx
import React from 'react';

interface Props {
  data: { label: string; count: number }[];
}

export default function MyChart({ data }: Props) {
  return (
    <div>
      {data.map(d => (
        <div key={d.label}>{d.label}: {d.count}</div>
      ))}
    </div>
  );
}
```

```astro
---
import MyChart from '../components/MyChart';
---

<MyChart client:load data={chartData} />
```

### Modifying the graph layout

The context graph uses dagre for automatic layout. Key parameters:

```typescript
const g = new dagre.graphlib.Graph();
g.setGraph({
  rankdir: 'LR',     // Left-to-right layout
  nodesep: 30,        // Vertical spacing between nodes
  ranksep: 100,       // Horizontal spacing between ranks
  marginx: 20,
  marginy: 20,
});
```

The `graph_rank` from the mapping determines which dagre rank (column)
each element type is placed in.

---

## Validation Pipeline

### Build validation (automatic)

Astro's build process validates that:
- All imported modules resolve
- TypeScript types are correct
- Dynamic routes have valid `getStaticPaths()` data

### Linter validation (manual)

```bash
python scripts/validate.py
```

The Python linter checks:
- Required fields are present (per mapping)
- Relationship references resolve to existing files
- No orphan files (files not matching any mapped type)
- Domain maturity scores based on enrichment level

### CI validation (recommended)

Add both to your CI pipeline for comprehensive coverage:

```yaml
steps:
  - run: python scripts/validate.py --strict
  - run: cd catalog-ui && npm run build
```

---

## Performance Considerations

- **Build time** scales linearly with element count. 500 elements ≈ 5s.
- **Page output** is pure static HTML. Load time is independent of registry size.
- **React islands** only hydrate on pages that need interactivity (graphs).
- **dagre layout** computation happens once per graph, not per frame.
- **Reference resolution** is O(n) per relationship field, using index lookups.
