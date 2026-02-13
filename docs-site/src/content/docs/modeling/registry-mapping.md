---
title: Registry Mapping
description: The single YAML file that drives everything.
---

`models/registry-mapping.yaml` is the single source of truth for the entire catalog. It declares:

- **Site branding** — name, description, logo
- **Layers** — groupings with colors
- **Element types** — what kinds of things exist
- **Fields** — what metadata each type carries
- **Relationships** — how elements connect
- **Relationship types** — verbs for outgoing/incoming edges

## Minimal example

```yaml
version: "1.0"
registry_root: registry-v2

site:
  name: My Architecture Catalog
  description: Our enterprise architecture registry
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
    icon: "+"
  serving:
    outgoing: Serves
    incoming: Served by
    icon: "->"

domain_color_palette:
  - "#3b82f6"
  - "#8b5cf6"
  - "#ec4899"

elements:
  service:
    label: Service
    layer: technology
    folder: 2-technology/services
    id_field: name
    graph_rank: 1
    icon: S
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
    relationships: {}
```

## What happens when you change it

The mapping is read at **build time** by `registry-loader.ts`. After any change:

1. The loader picks up the new schema
2. File scanning adapts to new folders and types
3. The UI renders new types, fields, and relationship labels automatically

**No code changes required.** The UI never hardcodes type names, field names, or relationship labels.

## Top-level sections

| Section | Purpose |
|---------|---------|
| `site` | Branding: name, description, logo character |
| `layers` | Architecture layers with colors and icons |
| `relationship_types` | Verbs for relationship labels (outgoing/incoming) |
| `domain_color_palette` | Colors auto-assigned to domains |
| `elements` | Element type definitions (fields, relationships, graph position) |

For the full field-by-field reference, see the [Mapping Reference](/configuration/mapping-reference/).
