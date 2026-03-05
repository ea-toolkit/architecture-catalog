---
globs: catalog-ui/src/**
---

# Vocabulary-Agnostic Principle (Quick Reference)

See CLAUDE.md "Vocabulary-Agnostic Principle (CRITICAL)" for full rules.

**2-Tier Design:**
- **Core registry rendering** (driven by `registry-mapping.yaml`): STRICTLY vocab-agnostic. No type-name, layer-name, or relationship-name conditionals. Unknown types fall back to schema-derived values (layer color, graph_rank, icon emoji). Domain anchor = graph_rank: 0, not type key.
- **Map views** (driven by `event-mapping.yaml`, `heatmap-mapping.yaml`, future maps): Intentionally type-aware. An event map needs to know what events are. A heatmap needs to know what capabilities are. These are opinionated analytical views — type-awareness is the point.

**Hardcoded style maps** (NODE_STYLES, EDGE_STYLES, ELEMENT_HIERARCHY) are optional enrichment. Unknown types MUST get sensible fallbacks.
