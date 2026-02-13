---
title: Introduction
description: What is Architecture Catalog and why does it exist?
---

Architecture Catalog is an open-source tool that turns plain Markdown files into a browsable, interactive architecture catalog. It replaces monolithic tools like Sparx EA and Archi with a simple, Git-native approach.

## The problem

| Challenge | Traditional tools | This project |
|-----------|------------------|-------------|
| Vendor lock-in | Proprietary formats | Plain Markdown + YAML |
| Collaboration | Single-user desktop apps | Git-friendly, PR-based workflow |
| Customization | Fixed schemas, rigid UI | 100% schema-driven, white-label |
| Cost | Per-seat licensing | Free and open source |
| Deployment | Complex servers | Static site — deploy anywhere |

## How it works

The system has three decoupled layers:

```
registry-mapping.yaml    Schema: types, fields, relationships
        |
        v
registry-v2/**/*.md      Data: one Markdown file per element
        |
        v
catalog-ui/              UI: Astro pages, React graphs
```

1. **Define your schema** in `registry-mapping.yaml` — element types, fields, layers, relationships
2. **Add your data** as Markdown files with YAML frontmatter in `registry-v2/`
3. **Build** — the loader reads the schema, scans the files, resolves cross-references, and generates static HTML

Each layer is independently modifiable. Change the schema without touching Markdown. Add data without writing code. Redesign the UI without changing the data format.

## Vocabulary-agnostic

The catalog works with any architecture vocabulary: ArchiMate, TOGAF, C4, or your own custom terminology. Name your layers, element types, and relationships however you want — the UI adapts automatically.

## What you get

- **Dashboard** with model-wide statistics and domain health scores
- **Domain overview** pages with elements grouped by type
- **Element detail** pages with metadata, relationships, and rich Markdown documentation
- **Interactive context graphs** with search, filter, and PNG export
- **Discover page** for searching and filtering across the entire catalog

## Next steps

Ready to try it? Head to the [Installation](/getting-started/installation/) guide.
