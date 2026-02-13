# Configuration Reference

Complete reference for `models/registry-mapping.yaml` — the single source of truth
that drives the entire Architecture Catalog.

---

## File Location

```
models/registry-mapping.yaml
```

This file is read at **build time** by the catalog-ui loader (`registry-loader.ts`).
Changes to this file require a rebuild (`npm run build`) or dev server restart.

---

## Top-Level Structure

```yaml
version: "1.0"                    # Schema version
registry_root: registry-v2       # Path to data folder (relative to project root)

site: { ... }                    # Branding & display
layers: { ... }                  # Architecture layer definitions
relationship_types: { ... }      # ArchiMate relationship verbs
domain_color_palette: [ ... ]    # Auto-assigned domain colors
elements: { ... }                # Element type definitions
```

---

## `site` — Branding

Controls how the catalog appears to users.

```yaml
site:
  name: Architecture Catalog       # Page title, header text
  description: Enterprise registry  # Dashboard subtitle
  logo_text: A                     # Single char in sidebar logo circle
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Shown in `<title>`, sidebar logo tooltip, breadcrumbs |
| `description` | string | yes | Shown on the dashboard landing page |
| `logo_text` | string | yes | Single character rendered in the sidebar icon bar |

---

## `layers` — Architecture Layers

Defines the horizontal layers in your architecture model. Elements are grouped
into these layers for the dashboard distribution bar and breadcrumbs.

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
| `color` | hex string | yes | Primary color for layer badges and distribution bar |
| `bg` | hex string | yes | Light background color for layer cards |
| `icon` | string | yes | Single character icon for compact views |

### Default layers

| Key | Name | Suggested use |
|-----|------|---------------|
| `products_and_services` | Products & Services | Business products, customer-facing services |
| `process_and_organisation` | Process & Organisation | Business processes, capabilities, actors |
| `applications_and_data` | Applications & Data | Systems, APIs, data objects |
| `infrastructure_and_hosting` | Infrastructure & Hosting | Nodes, containers, platforms |

You can rename, add, or remove layers freely. The UI adapts dynamically.

---

## `relationship_types` — ArchiMate Relationships

Defines the vocabulary for relationships between elements.

```yaml
relationship_types:
  <type_key>:
    outgoing: Verb          # e.g., "Composes"
    incoming: Verb          # e.g., "Part of"
    icon: "◇"              # Visual marker for relationship tables
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `outgoing` | string | yes | Verb shown on the source element's detail page |
| `incoming` | string | yes | Verb shown on the target element's detail page |
| `icon` | string | no | Unicode character displayed next to the verb |

### Built-in relationship types

| Key | Outgoing | Incoming | Semantics |
|-----|----------|----------|-----------|
| `composition` | Composes | Part of | Structural containment (tight coupling) |
| `aggregation` | Owns | Owned by | Grouping, logical ownership |
| `realization` | Realizes | Realized by | Implementation of abstract concepts |
| `serving` | Serves | Served by | Service provision, API exposure |
| `assignment` | Assigned to | Assigned from | Infrastructure assignment |
| `access` | Accesses | Accessed by | Data read/write operations |

You can add custom types (e.g., `triggers`, `depends_on`, `flows_to`) — just reference
them in your element relationship definitions.

---

## `domain_color_palette` — Domain Colors

An ordered list of hex colors automatically assigned to domains as they're discovered.

```yaml
domain_color_palette:
  - "#3b82f6"   # first domain gets this color
  - "#8b5cf6"   # second domain
  - "#ec4899"   # third domain
  - "#f59e0b"   # ... cycles back if more domains than colors
```

Domains are auto-discovered from the `domain:` frontmatter field in element files.
Colors are assigned in the order domains are first encountered during the build.

---

## `elements` — Element Type Definitions

This is the core of the mapping. Each entry defines a type of architecture element.

```yaml
elements:
  <element_key>:
    label: Human Name
    layer: <layer_key>
    folder: <relative_path>
    id_field: name
    archimate: <archimate-type>
    graph_rank: <number>
    icon: 🖥️
    badge_category: <category>
    fields: { ... }
    relationships: { ... }
```

### Element properties

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | yes | Human-readable name shown in UI |
| `layer` | string | yes | Must match a key in `layers:` |
| `folder` | string | yes | Path relative to `registry_root` containing `.md` files |
| `id_field` | string | yes | Which frontmatter field uniquely identifies each file |
| `archimate` | string | no | ArchiMate 3.x element type (informational) |
| `graph_rank` | number | yes | Left-to-right position in context graphs (0 = leftmost) |
| `icon` | string | yes | Emoji or character shown in lists and cards |
| `badge_category` | string | yes | Groups element types for filter badges (e.g., "system", "api", "data") |

### `fields` — Metadata Schema

Defines what frontmatter fields the loader should look for in `.md` files.

```yaml
fields:
  <field_key>:
    type: string         # string | string[] | number | boolean | object[]
    required: true       # whether the linter should warn if missing
    label: Display Name  # shown as the field label in detail pages
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | yes | Data type: `string`, `string[]`, `number`, `boolean`, `object[]` |
| `required` | boolean | yes | If true, the linter warns when missing |
| `label` | string | yes | Human-readable label shown in the UI |

### `relationships` — Outgoing Connections

Declares how this element type connects to other types.

```yaml
relationships:
  <field_key>:                    # the frontmatter field name
    target: <element_key>         # which element type this points to
    type: <relationship_type_key> # must match a key in relationship_types
    cardinality: one | many       # single value or array
    resolve_by: slug | name | abbreviation
    inverse: <field_key> | ~      # reverse link field on target (~ = none)
    required: false               # whether the linter should warn if missing
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `target` | string | yes | Element key this relationship points to |
| `type` | string | yes | Key from `relationship_types` |
| `cardinality` | `one` \| `many` | yes | Whether the frontmatter field is a scalar or array |
| `resolve_by` | `slug` \| `name` \| `abbreviation` | yes | How to match the value to a target element |
| `inverse` | string \| `~` | no | Field name on the target type for the reverse link. `~` means no inverse. |
| `required` | boolean | no | Whether the linter warns if this field is missing or empty |

---

## Composite Element IDs

Internally, each element receives a composite ID in the format:

```
<element_key>--<slug>
```

For example: `software_subsystem--order-routing-engine`

This prevents collisions when different element types share similar file names
(e.g., `data-concepts/tenant-account.md` and `domain-events/tenant-account.md` produce
distinct IDs: `data_concept--tenant-account` and `domain_event--tenant-account`).

---

## Full Example

Here's a minimal but complete mapping with two layers and three element types:

```yaml
version: "1.0"
registry_root: registry-v2

site:
  name: My Architecture Catalog
  description: Team platform architecture
  logo_text: M

layers:
  business:
    name: Business
    color: "#f59e0b"
    bg: "#fffbeb"
    icon: B
  technology:
    name: Technology
    color: "#3b82f6"
    bg: "#eff6ff"
    icon: T

relationship_types:
  composition:
    outgoing: Composes
    incoming: Part of
    icon: "◇"
  serving:
    outgoing: Serves
    incoming: Served by
    icon: "→"

domain_color_palette:
  - "#3b82f6"
  - "#8b5cf6"
  - "#ec4899"

elements:
  capability:
    label: Business Capability
    layer: business
    folder: 1-business/capabilities
    id_field: name
    archimate: business-function
    graph_rank: 0
    icon: 🎯
    badge_category: capability
    fields:
      name:
        type: string
        required: true
        label: Name
      description:
        type: string
        required: false
        label: Description
      domain:
        type: string
        required: false
        label: Domain
      status:
        type: string
        required: false
        label: Status
    relationships:
      realized_by_services:
        target: service
        type: serving
        cardinality: many
        resolve_by: slug
        inverse: realizes_capability
        required: false

  service:
    label: Service
    layer: technology
    folder: 2-technology/services
    id_field: name
    archimate: application-component
    graph_rank: 1
    icon: 🖥️
    badge_category: system
    fields:
      name:
        type: string
        required: true
        label: Name
      description:
        type: string
        required: false
        label: Description
      domain:
        type: string
        required: false
        label: Domain
      status:
        type: string
        required: false
        label: Status
    relationships:
      realizes_capability:
        target: capability
        type: serving
        cardinality: one
        resolve_by: name
        inverse: realized_by_services
        required: false
      exposes_apis:
        target: api
        type: composition
        cardinality: many
        resolve_by: slug
        inverse: parent_service
        required: false

  api:
    label: API
    layer: technology
    folder: 2-technology/apis
    id_field: name
    archimate: application-interface
    graph_rank: 2
    icon: 🔌
    badge_category: api
    fields:
      name:
        type: string
        required: true
        label: Name
      description:
        type: string
        required: false
        label: Description
      domain:
        type: string
        required: false
        label: Domain
      status:
        type: string
        required: false
        label: Status
      protocol:
        type: string
        required: false
        label: Protocol
    relationships:
      parent_service:
        target: service
        type: composition
        cardinality: one
        resolve_by: name
        inverse: exposes_apis
        required: false
```

---

## Tips

1. **Layer keys** must be valid YAML keys (lowercase, underscores). The `name` field provides the display name.

2. **Element keys** should be snake_case and singular (`software_system`, not `software-systems`).

3. **Folder paths** are relative to `registry_root` and use forward slashes.

4. **`graph_rank`** determines the left-to-right position in context graphs. Use 0 for root/anchor elements and higher numbers for dependent elements.

5. **`badge_category`** groups element types for the filter chips on the Discover page. Multiple element types can share the same badge category.

6. **`resolve_by`** must match what your data files actually contain. If filenames are slugified, use `slug`. If you reference by display name, use `name`.

7. **`inverse: ~`** (tilde) means "no automatic inverse." Use this for one-way or cross-layer relationships where the target type isn't mapped yet.

8. **Adding a new type** requires zero code changes. Add the entry to `elements:`, create the folder, add `.md` files, and rebuild.
