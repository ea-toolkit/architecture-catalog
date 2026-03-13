---
title: Dashboard
description: The homepage dashboard with domain cards, stats, and quick navigation.
---

The dashboard is the landing page of your architecture catalog. It provides a high-level overview of your entire architecture model.

<!-- VIDEO: #1 Homepage overview — open the app, dark mode, hover domain cards, scroll stats (30s) -->

## What you see

### Stats bar

Four metric cards at the top:

| Metric | Description |
|--------|-------------|
| **Total Entities** | Count of all registered architecture elements |
| **Domains** | Number of auto-discovered domains |
| **Diagrams** | Count of diagrams (PlantUML, BPMN, draw.io) |
| **Pages** | Total generated static pages |

### Domain cards

Each domain gets a card showing:

- **Domain name** with a color-coded left border
- **Element count** per type (revealed on hover)
- **Quick links** to the domain overview, context map, event flow, and heatmap

Domain colors are auto-assigned from the `domain_color_palette` in your mapping YAML. Domains are sorted by element count (largest first).

### Layer distribution

Below the domain cards, a summary shows how elements are distributed across your architecture layers (Business, Organization, Application, Technology — or whatever layers you define).

## Branding

The dashboard header shows your company name and catalog name, configured in `registry-mapping.yaml`:

```yaml
site:
  company: Nova CRM              # main heading
  name: Architecture Catalog     # subtitle
  logo_text: N                   # sidebar icon
```

See [Site Branding](/configuration/branding/) for the full reference.

## Dark mode

The catalog defaults to dark mode with a toggle button in the sidebar icon bar. Theme preference is saved to localStorage and persists across sessions. The toggle also respects the system's `prefers-color-scheme` setting on first visit.

<!-- VIDEO: #6 Dark/Light toggle — toggle theme back and forth on a context map page (15s) -->
