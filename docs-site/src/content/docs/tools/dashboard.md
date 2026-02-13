---
title: Dashboard Generator
description: Generate an HTML health dashboard from your registry.
---

The dashboard generator creates a standalone HTML report showing model health, coverage gaps, and domain maturity.

## Usage

```bash
python scripts/generate_dashboard.py
```

This produces a `dashboard.html` file you can open in any browser.

## What it shows

- **Element counts** by layer and type
- **Health metrics** -- required field coverage, relationship connectivity
- **Domain maturity** -- per-domain scoring based on enrichment level
- **Orphan detection** -- elements with no relationships
- **Broken references** -- unresolved links in your registry

## When to use it

The dashboard is useful for:
- **Architecture reviews** -- share a snapshot of model health with stakeholders
- **Onboarding** -- show new team members the current state of the architecture
- **Progress tracking** -- monitor enrichment progress over time
