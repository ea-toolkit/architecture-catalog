---
title: Data Pipeline
description: How Markdown files become an interactive catalog.
---

The data pipeline has six phases, all running at build time.

## Phase 1: Schema loading

**File:** `catalog-ui/src/lib/registry-loader.ts` -- `loadMapping()`

Reads `models/registry-mapping.yaml` and parses it into a `RegistryMapping` TypeScript object. This provides element type definitions, field schemas, relationship declarations, layer definitions, and site config.

## Phase 2: File discovery

**File:** `registry-loader.ts` -- inside `loadRegistry()`

For each element type in the mapping:
1. Resolve the `folder` path relative to `registry_root`
2. Scan for `*.md` files (excluding `_template.md`)
3. Parse YAML frontmatter from each file
4. Create a `RegistryElement` with a composite ID: `<typeKey>--<slug>`

## Phase 3: Index building

**File:** `registry-loader.ts` -- `buildRawIndexes()`

Builds indexes for fast lookups:

| Index | Key | Purpose |
|-------|-----|---------|
| `bySlug` | filename | Resolve references by filename |
| `byName` | name field | Resolve references by display name |
| `byAbbreviation` | abbreviation field | Resolve references by code |

## Phase 4: Reference resolution

**File:** `registry-loader.ts` -- `resolveRef()`

For each relationship declared in the mapping:
1. Read the frontmatter field value(s) from the source element
2. Use the `resolve_by` strategy to find target elements
3. Create a `RegistryEdge` with source, target, type, and fieldKey

Unresolved references get `resolved: false` and the raw value is preserved for display.

## Phase 5: Graph assembly

**File:** `registry-loader.ts` -- `loadRegistry()` returns `RegistryGraph`

```typescript
interface RegistryGraph {
  mapping: RegistryMapping;
  elements: Map<string, RegistryElement>;
  edges: RegistryEdge[];
  indexes: {
    byType, byDomain, byLayer,
    byName, byAbbreviation, bySlug,
    edgesBySource, edgesByTarget
  };
}
```

## Phase 6: Legacy conversion

**File:** `catalog-ui/src/data/registry.ts`

The bridge module converts the `RegistryGraph` into simpler shapes for page templates:

- `Domain[]` -- domain cards with counts, maturity, color
- `Element[]` -- flat element list with outgoing + incoming relationships
- Helper maps: `LAYER_META`, `SITE_CONFIG`, `TYPE_BADGES`, `REL_TYPE_LABELS`

## Performance

- Build time scales linearly with element count. 500 elements builds in under 10 seconds.
- Page output is pure static HTML. Load time is independent of registry size.
- React islands only hydrate on pages that need interactivity (graphs).
- Reference resolution is O(1) per lookup using the pre-built indexes.
