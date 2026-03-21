---
title: Dashboard
description: The homepage dashboard with domain cards, stats, and quick navigation.
---

The dashboard is the landing page of your architecture catalog. It provides a high-level overview of your entire architecture model.

<video src="/videos/Homepage_Overview.mp4" controls muted playsinline style="width:100%;border-radius:8px;border:1px solid var(--sl-color-gray-5);margin:1rem 0"></video>

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

<video src="/videos/Toggle.mp4" controls muted playsinline style="width:100%;border-radius:8px;border:1px solid var(--sl-color-gray-5);margin:1rem 0"></video>
