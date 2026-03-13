---
title: Domain Overview
description: Drill into a domain to see all its elements, grouped by type.
---

Each domain has a dedicated overview page at `/domains/<domain-slug>/`. It shows all elements belonging to that domain, grouped by their element type.

<!-- VIDEO: #2 Domain deep-dive — click a domain, show element list, click into element detail, show relationships (45s) -->

## How to get there

From the dashboard, click any domain card. Or use the sidebar — every domain appears as a navigation group with its element types listed underneath.

## What you see

### Element list

Elements are grouped by type (Components, Software Systems, API Endpoints, Data Concepts, etc.) with counts per group. Each element card shows:

- **Name** and **description**
- **Status** badge (active, draft, deprecated)
- **Sourcing** badge (build, buy, inherit)
- **Link** to the element detail page

### Element detail page

Click any element to see its full detail page at `/catalog/<composite-id>/`. This shows:

- All frontmatter fields rendered as a metadata table
- **Outgoing relationships** — elements this one connects to
- **Incoming relationships** — elements that connect to this one
- **Markdown body** — free-form documentation, ADRs, runbooks

### Navigation links

The domain overview links to:

| View | Route | Description |
|------|-------|-------------|
| Context Map | `/domains/<id>/context-map` | Interactive dependency graph |
| Event Flow | `/domains/<id>/event-flow` | Event publish/consume visualization |
| Heatmap | `/domains/<id>/heatmap` | Capability coverage matrix |
