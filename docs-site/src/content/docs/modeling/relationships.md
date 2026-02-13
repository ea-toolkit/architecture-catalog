---
title: Relationships
description: How elements connect to each other.
---

Relationships are the edges in your architecture graph. They're declared in `registry-mapping.yaml` and populated in element frontmatter.

## How relationships work

1. **Declare** the relationship in the mapping (which types can connect, how to resolve references)
2. **Populate** the frontmatter field in your Markdown file (with slugs, names, or abbreviations)
3. **The loader resolves** references at build time and creates edges in the graph

## Example

In `registry-mapping.yaml`:

```yaml
elements:
  software_system:
    relationships:
      composes_software_subsystems:
        target: software_subsystem
        type: composition
        cardinality: many
        resolve_by: slug
        inverse: parent_software_system
        required: false
```

In your element's Markdown:

```yaml
---
name: NovaCRM Core
composes_software_subsystems:
  - crm-api-gateway
  - billing-worker
  - analytics-engine
---
```

The loader finds `crm-api-gateway.md`, `billing-worker.md`, and `analytics-engine.md` in the `software_subsystem` folder and creates edges.

## Resolution strategies

| Strategy | Matches against | Example value | Best for |
|----------|----------------|---------------|----------|
| `slug` | Filename (without `.md`) | `billing-worker` | Technical identifiers |
| `name` | `name:` frontmatter field | `Tenant Management` | Human-readable names |
| `abbreviation` | `abbreviation:` field | `NOVA` | System codes |

## Inverse relationships

The `inverse` field automatically creates the reverse link. When you declare:

```yaml
composes_software_subsystems:
  target: software_subsystem
  type: composition
  inverse: parent_software_system   # <- auto-creates reverse on subsystem
```

You only need to declare the relationship once. The loader builds both outgoing and incoming views.

Use `inverse: ~` (tilde) when there's no reverse link.

## Relationship types

Relationship types define the verbs shown in the UI:

```yaml
relationship_types:
  composition:
    outgoing: Composes
    incoming: Part of
    icon: "+"
  serving:
    outgoing: Serves
    incoming: Served by
    icon: "->"
```

You can define any relationship types you want. The defaults are inspired by ArchiMate but you can rename them freely.

| Type | Outgoing verb | Incoming verb | Typical use |
|------|---------------|---------------|-------------|
| `composition` | Composes | Part of | Structural containment |
| `aggregation` | Owns | Owned by | Grouping, ownership |
| `realization` | Realizes | Realized by | Implementation links |
| `serving` | Serves | Served by | API exposure |
| `assignment` | Assigned to | Assigned from | Infrastructure mapping |
| `access` | Accesses | Accessed by | Data read/write |

## Broken references

When a reference can't be resolved, the build continues successfully. The element shows a broken-link indicator and the linter flags it as a warning.

```
# Loader output for unresolved reference:
{ resolved: false, raw: "missing-system" }
```

This graceful degradation means you can add elements incrementally without worrying about dangling references breaking the build.
