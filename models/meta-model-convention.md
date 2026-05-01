# Meta-Model Diagram Convention

This document defines how to draw a meta-model diagram in draw.io that can be parsed by `scripts/generate_metamodel.py` to generate `registry-mapping.yaml`.

## Overview

A meta-model diagram is a visual representation of your architecture vocabulary. It defines:
- **Element types** (shapes) — the kinds of things in your architecture (e.g., Component, Service, Data Entity)
- **Layers** (swimlanes/containers) — groupings of element types (e.g., Business, Application, Technology)
- **Relationships** (arrows) — how element types connect (e.g., Component realizes Capability)

## Drawing Convention

### Layers (Swimlanes)

Use **horizontal swimlanes** or **container rectangles** to represent layers.

- **Label:** The layer name (e.g., "Business", "Application", "Technology")
- **Style property `layer`:** Set to the layer key (e.g., `business`, `application`)
- **Style property `layerColor`:** Hex color for the layer (e.g., `#3b82f6`)
- **Style property `layerBg`:** Hex background color (e.g., `#eff6ff`)
- **Style property `layerIcon`:** Single character icon (e.g., `B`, `A`, `T`)

If style properties are not set, the script infers:
- Layer key from the label (lowercased, spaces to underscores)
- Color from a default palette
- Icon from the first letter of the label

### Element Types (Shapes)

Use **rectangles** inside a layer swimlane. Each rectangle represents an element type.

**Required properties** (set via draw.io shape label or custom properties):
- **Label:** The element type display name (e.g., "Business Capability", "Software System")

**Optional custom properties** (Edit → Edit Data in draw.io):
- `key` — Element type key (e.g., `business_capability`). Auto-generated from label if omitted.
- `icon` — Emoji icon (e.g., `🧩`). Defaults to a generic icon per layer.
- `graph_rank` — Integer for left-to-right layout position. Auto-assigned if omitted.
- `id_field` — Which frontmatter field is the file identity (default: `name`)
- `folder` — Override the auto-generated folder path
- `badge_category` — Badge grouping label (auto-generated from key if omitted)

**Standard fields** (name, description, owner, domain, status) are added automatically to every element type. You only need to declare **extra fields** as child shapes or in custom properties:
- `fields` — Comma-separated list of extra field definitions: `field_name:type:label` (e.g., `sourcing:string:Sourcing,maturity:string:Maturity`)

### Relationships (Arrows)

Use **arrows/connectors** between element type shapes to define relationships.

**Arrow label:** The relationship field name on the source element (e.g., `realizes_components`, `composes_subsystems`)

**Required custom properties** (Edit → Edit Data on the arrow):
- `type` — Relationship type key (e.g., `composition`, `realization`, `serving`)

**Optional custom properties:**
- `cardinality` — `one` or `many` (default: `many`)
- `resolve_by` — `slug`, `name`, or `abbreviation` (default: `name`)
- `inverse` — Field name on the target that points back (e.g., `parent_domain`)
- `required` — `true` or `false` (default: `false`)

### Relationship Types

Define relationship type semantics by placing a **table/list shape** anywhere on the canvas with the custom property `metamodel_type: relationship_types`.

Each row defines: `key | outgoing_verb | incoming_verb | icon`

Example:
```
composition | Composes | Part of | ◇
realization | Realizes | Realized by | ▲
serving     | Serves   | Served by   | →
```

If not present, the script uses ArchiMate-inspired defaults.

## Example

A minimal meta-model diagram might contain:

```
┌─── Business Layer ──────────────────────┐
│  ┌──────────────┐  ┌──────────────────┐ │
│  │ Product      │  │ Business Service │ │
│  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────┘
┌─── Application Layer ───────────────────┐
│  ┌──────────┐  ┌──────────────┐        │
│  │ Domain   │──│ Component    │────────→│→ Software System
│  └──────────┘  └──────────────┘        │
└─────────────────────────────────────────┘
```

With arrows labeled `composes_components` (Domain → Component, type: composition) and `realized_by_software_systems` (Component → Software System, type: realization).

## Running the Generator

```bash
python scripts/generate_metamodel.py models/meta-model.drawio
python scripts/generate_metamodel.py models/meta-model.drawio --output models/registry-mapping.yaml
python scripts/generate_metamodel.py models/meta-model.drawio --validate  # Check without writing
```

## Output

The script generates a complete `registry-mapping.yaml` with:
- `version`, `registry_root`, `site` metadata
- `layers` section from swimlanes
- `relationship_types` section
- `domain_color_palette` (default)
- `elements` section with all types, fields, and relationships
