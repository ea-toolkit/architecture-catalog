# Backlog: Registry Index, LSP, and MCP Server

## Problem

As the registry grows (6-8 domains, 5K+ files), AI agents and skills burn excessive tokens scanning irrelevant files. Every `/example-archi` query currently greps across the entire repo.

## Roadmap (in order)

### Phase 1: JSON Index File (build first — 1 day effort)

At build time, dump the in-memory graph from `registry-loader.ts` to a static index:

```
registry-v2/.index.json
{
  "elements": {
    "logical_component--tenant-management": {
      "name": "Tenant Management",
      "file": "3-application/logical-components/tenant-management.md",
      "domain": "Customer Management",
      "type": "logical_component",
      "relationships": {
        "realized_by_software_systems": ["software_system--novacrm-core"],
        "owns_data_aggregates": ["data_aggregate--tenant-aggregate"]
      }
    }
  },
  "byDomain": { "Customer Management": ["logical_component--tenant-management", ...] },
  "byType": { "logical_component": ["logical_component--tenant-management", ...] }
}
```

**How skills use it:**
1. Read `registry-v2/.index.json` (one file, entire graph)
2. Find the answer in the index
3. Only open the actual `.md` file if you need the full body content

**Generate via:**
- `npm run build` (extend the existing build)
- Or a standalone script: `node scripts/generate-index.js`
- Or a pre-commit hook

**Expected impact:** ~80% token reduction for agent queries.

### Phase 2: MCP Server (month 2-3 — 1 week effort)

Wrap the JSON index in an MCP (Model Context Protocol) server so agents call tools instead of grepping:

```
Tools exposed:
- findElement(name) → returns element metadata + file path
- getRelationships(elementId) → returns all connected elements
- queryByDomain(domain) → returns all elements in a domain
- queryByType(type) → returns all elements of a type
- getHealth() → returns broken refs, orphans, stats
```

Agents call these tools directly instead of reading files. Even more efficient than the JSON index because the agent doesn't even need to parse JSON.

**Expected impact:** ~85% token reduction + cleaner agent code.

### Phase 3: LSP Server (month 4+ — 2-3 weeks effort)

Full Language Server Protocol implementation for live editor intelligence:

- **Autocomplete** — relationship targets, element types, field names
- **Validation** — broken refs shown as red squiggles in real-time
- **Go to Definition** — click a referenced element name, jump to its file
- **Hover preview** — hover over a reference to see the element's description
- **Find References** — "who references this element?"

**Prerequisite:** Schema must be stable. Don't build this while `registry-mapping.yaml` is still changing frequently.

**Expected impact:** ~90% token reduction + live editor validation + best developer experience.

## Decision: When to Start

| Signal | Action |
|--------|--------|
| Registry hits ~200 elements | Build Phase 1 (JSON index) |
| 2-3 people editing registry regularly | Build Phase 2 (MCP server) |
| Schema stable for 4+ weeks | Build Phase 3 (LSP server) |
| Agent token costs become noticeable | Build Phase 1 immediately |

## Comparison

| Approach | Effort | Token savings | Live validation | Autocomplete |
|----------|--------|--------------|-----------------|--------------|
| JSON index | 1 day | ~80% | No | No |
| MCP server | 1 week | ~85% | No | No |
| LSP server | 2-3 weeks | ~90% | Yes | Yes |