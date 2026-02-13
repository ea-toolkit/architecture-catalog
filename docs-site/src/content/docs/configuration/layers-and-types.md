---
title: Layers & Types
description: Add custom layers and element types.
---

## Add a new layer

Add an entry under `layers:` in `registry-mapping.yaml`:

```yaml
layers:
  security:
    name: Security & Compliance
    color: "#ef4444"
    bg: "#fef2f2"
    icon: S
```

Create the corresponding folder:

```bash
mkdir -p registry-v2/5-security-and-compliance/
```

## Add a new element type

Add an entry under `elements:`:

```yaml
elements:
  threat_model:
    label: Threat Model
    layer: security
    folder: 5-security-and-compliance/threat-models
    id_field: name
    graph_rank: 1
    icon: S
    badge_category: security
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
      risk_level:
        type: string
        required: false
        label: Risk Level
    relationships:
      applies_to_system:
        target: software_system
        type: association
        cardinality: many
        resolve_by: name
        inverse: ~
        required: false
```

Create the folder and a template:

```bash
mkdir -p registry-v2/5-security-and-compliance/threat-models/
```

Then add Markdown files. **No code changes required.** The loader picks them up automatically.

## Add a new relationship type

Add an entry under `relationship_types:`:

```yaml
relationship_types:
  triggers:
    outgoing: Triggers
    incoming: Triggered by
    icon: "!"
```

Then reference it in any element's `relationships` section with `type: triggers`.
