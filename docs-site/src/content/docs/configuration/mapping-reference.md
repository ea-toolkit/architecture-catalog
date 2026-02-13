---
title: registry-mapping.yaml Reference
description: Complete field-by-field reference for the mapping file.
---

## File location

```
models/registry-mapping.yaml
```

Read at **build time** by the catalog-ui loader. Changes require a rebuild or dev server restart.

## Top-level structure

```yaml
version: "1.0"
registry_root: registry-v2

site: { ... }
layers: { ... }
relationship_types: { ... }
domain_color_palette: [ ... ]
elements: { ... }
```

## `site` -- Branding

```yaml
site:
  name: Architecture Catalog       # Page title, header text
  description: Enterprise registry  # Dashboard subtitle
  logo_text: A                     # Single char in sidebar logo
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Shown in page titles, sidebar, breadcrumbs |
| `description` | string | yes | Shown on the dashboard landing page |
| `logo_text` | string | yes | Single character in the sidebar icon bar |

## `layers` -- Architecture Layers

```yaml
layers:
  <layer_key>:
    name: Human-readable Name
    color: "#hex"          # Primary color for badges and charts
    bg: "#hex"             # Light background for cards
    icon: X                # Single character icon
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name in dashboard and navigation |
| `color` | hex string | yes | Primary color for layer badges |
| `bg` | hex string | yes | Light background color for cards |
| `icon` | string | yes | Single character icon |

You can rename, add, or remove layers freely. The UI adapts dynamically.

## `relationship_types` -- Relationship Verbs

```yaml
relationship_types:
  <type_key>:
    outgoing: Verb          # e.g., "Composes"
    incoming: Verb          # e.g., "Part of"
    icon: "symbol"          # Visual marker
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `outgoing` | string | yes | Verb shown on the source element's detail page |
| `incoming` | string | yes | Verb shown on the target element's detail page |
| `icon` | string | no | Unicode character displayed next to the verb |

## `domain_color_palette` -- Domain Colors

```yaml
domain_color_palette:
  - "#3b82f6"   # first domain
  - "#8b5cf6"   # second domain
  - "#ec4899"   # cycles back if more domains than colors
```

## `elements` -- Element Type Definitions

```yaml
elements:
  <element_key>:
    label: Human Name
    layer: <layer_key>
    folder: <relative_path>
    id_field: name
    archimate: <type>       # optional, for documentation only
    graph_rank: <number>
    icon: emoji
    badge_category: <category>
    fields: { ... }
    relationships: { ... }
```

### Element properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | yes | Human-readable name shown in UI |
| `layer` | string | yes | Must match a key in `layers:` |
| `folder` | string | yes | Path relative to `registry_root` |
| `id_field` | string | yes | Which frontmatter field is the file's identity |
| `archimate` | string | no | ArchiMate type (informational only, not used by UI) |
| `graph_rank` | number | yes | Left-to-right position in context graphs (0 = leftmost) |
| `icon` | string | yes | Emoji/character shown in lists and cards |
| `badge_category` | string | yes | Groups element types for filter badges |

### `fields` -- Metadata Schema

```yaml
fields:
  <field_key>:
    type: string         # string | string[] | number | boolean | object[]
    required: true       # whether the linter should warn if missing
    label: Display Name  # shown as the field label in detail pages
```

### `relationships` -- Outgoing Connections

```yaml
relationships:
  <field_key>:
    target: <element_key>          # which element type this points to
    type: <relationship_type_key>  # must match a key in relationship_types
    cardinality: one | many
    resolve_by: slug | name | abbreviation
    inverse: <field_key> | ~       # reverse link field on target (~ = none)
    required: false
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `target` | string | yes | Element key this relationship points to |
| `type` | string | yes | Key from `relationship_types` |
| `cardinality` | `one` or `many` | yes | Scalar or array in frontmatter |
| `resolve_by` | `slug`, `name`, or `abbreviation` | yes | How to match values to targets |
| `inverse` | string or `~` | no | Field name on target for reverse link |
| `required` | boolean | no | Whether the linter warns if missing |

## Tips

1. **Layer keys** must be valid YAML keys (lowercase, underscores). The `name` field provides the display name.
2. **Element keys** should be snake_case and singular (`software_system`, not `software-systems`).
3. **Folder paths** are relative to `registry_root` and use forward slashes.
4. **`graph_rank: 0`** marks the domain anchor element (leftmost in the graph).
5. **`resolve_by`** must match what your data files contain. If filenames are slugified, use `slug`. If you reference by display name, use `name`.
6. **`inverse: ~`** means no automatic inverse relationship.
7. **Adding a new type** requires zero code changes. Add the entry, create the folder, add `.md` files, and rebuild.
