# CLAUDE.md

## What is this project?

A lightweight, Git-native architecture catalog. It replaces monolithic tools like Archi with a simple repo structure: architecture elements are registered as Markdown files, diagrams are draw.io files, and Python scripts validate, extract, refresh, and generate dashboards.

The goal is to be an open-source, lightweight alternative for architects who want Git-friendly, AI-readable architecture models without learning a DSL or paying for enterprise tooling.

## Architecture (how it works)

```
registry-mapping.yaml  ──→  registry-loader.ts  ──→  Astro pages
  (schema: types,             (reads .md files,        (static HTML
   fields, relationships)      resolves refs,           at build time)
                               builds graph)
```

**Single source of truth:** `models/registry-mapping.yaml` drives everything — the UI, validation, and data loading. Adding a new element type = add one entry to this YAML file + create a `_template.md`. Zero code changes.

**Data pipeline:** registry-mapping.yaml → `registry-loader.ts` (loadRegistry()) → `registry.ts` (bridge) → Astro pages. The loader builds an in-memory graph with elements, edges, and indexes (byType, byDomain, byLayer).

**Key design:** Framework-agnostic. ArchiMate alignment is optional, not required. Works with any architecture vocabulary. Layers are flat (1 to N), each with sub-folders for element types. No nested child layers.

## Current State

### Registry (registry-v2/)
- **4-layer structure** — flat layers, each with typed sub-folders
- **Template-driven** — each element type has a `_template.md` with typed YAML frontmatter
- **Example domains**: "Customer Management", "Billing & Payments", "Analytics & Insights" — 3 fictional B2B SaaS CRM domains with 71 elements across all 4 layers
- **Health:** 71 healthy, 71 connected, 0 orphans, 0 broken refs, 84 pages

### Catalog UI (catalog-ui/)
- **Astro 5 + React** static site for browsing the registry
- **Schema-driven** — all types, layers, and relationships derived from `models/registry-mapping.yaml`
- **ReactFlow graphs** for visualizing element relationships (via `@xyflow/react` + dagre)
- **Diagram viewer** supporting PlantUML, BPMN, and draw.io formats
- **CSS pattern:** EventCatalog-inspired RGB variable pattern: `--ec-page-bg: 255 255 255` used as `rgb(var(--ec-page-bg))`
- **3-panel layout:** icon bar (56px) + nested sidebar (315px) + main content

### Piece 1 / Piece 2 Strategy
- **Piece 1 (this repo):** registry-mapping.yaml → registry skeleton → UI. Ships first.
- **Piece 2 (future):** meta model → registry-mapping.yaml generation. Convenience tool, not critical path.

---

## Skills (Slash Commands)

| Skill | Usage | Purpose |
|-------|-------|---------|
| `/example-archi` | `/example-archi [question]` | Example domain Q&A, create entries, proposals |
| `/validate` | `/validate` | Run model validation, show errors and orphans |
| `/dashboard` | `/dashboard` | Generate HTML health dashboard |
| `/new-entry` | `/new-entry [type] [name]` | Create registry entry (guided wizard) |

### Examples
```
/example-archi What data does Tenant Management own?
/example-archi Create a registry entry for Payment Gateway
/validate
/dashboard
/new-entry data-object "Payment Record"
```

### Why Skills?
- **Explicit invocation** — Type `/example-archi` to guarantee the right context
- **Scoped search** — Each domain skill searches its own files first, minimizing token usage
- **Pattern for teams** — `/<domain>-archi` is learnable: `/payments-archi`, `/logistics-archi`, etc.

---

## Repo Structure

```
.claude/
  skills/
    example-archi/SKILL.md          # /example-archi skill
    validate/SKILL.md               # /validate skill
    dashboard/SKILL.md              # /dashboard skill
    new-entry/SKILL.md              # /new-entry skill
  agents/
    example-domain.md               # Auto-delegation fallback
  hooks/
    welcome.sh                      # Shows skills on session start
  settings.json                     # Hook configuration

registry-v2/                # Element registry — one .md file per architecture element
  1-business/                # Layer 1: Business
  2-organization/            # Layer 2: Organization
  3-application/             # Layer 3: Application (primary focus)
  4-technology/              # Layer 4: Technology

views/                       # Architecture diagrams by domain
  customer-management/       # Example domain diagrams

models/
  registry-mapping.yaml        # Schema mapping (types → folders → UI) — THE source of truth

catalog-ui/                  # Astro 5 + React catalog UI
  src/
    data/registry.ts           # Schema-driven data provider (bridge module)
    lib/registry-loader.ts     # Builds in-memory graph from registry-v2/
    lib/types.ts               # TypeScript interfaces
    config/meta-model.config.ts # Graph layout config (hierarchy ranks, relationship semantics)

scripts/
  validate.py                # Validates diagrams against registry
  generate_dashboard.py      # HTML health dashboard
  refresh_diagrams.py        # Sync registry to diagrams
  extract_view.py            # Extract YAML from .drawio
  generate_library.py        # Generate draw.io library

docs-site/                   # Starlight documentation site
  src/content/docs/            # All documentation pages (Markdown)
```

---

## Key Scripts

```bash
python scripts/validate.py              # Validate model
python scripts/generate_dashboard.py    # Generate dashboard.html
python scripts/refresh_diagrams.py      # Sync registry to diagrams
python scripts/extract_view.py <file>   # Extract YAML from diagram
```

---

## Catalog UI

```bash
cd catalog-ui
npm install
npm run dev      # Start dev server on port 4321
npm run build    # Build static site
```

The UI is fully schema-driven via `models/registry-mapping.yaml`. Adding a new element type requires:
1. Add entry to `registry-mapping.yaml`
2. Create `_template.md` in the appropriate `registry-v2/` subfolder
3. Rebuild — zero code changes needed

---

## Adding New Domains

1. Create skill: `.claude/skills/<domain>-archi/SKILL.md`
2. Create sub-agent: `.claude/agents/<domain>.md`
3. Create views folder: `views/<domain>/`
4. Create registry entries in `registry-v2/3-application/`
5. Update welcome hook to show new skill

See `docs-site/src/content/docs/contributing/how-to-contribute.md` for detailed instructions.

---

## Development Principles

- Build incrementally — 1% at a time, prove each piece works
- Keep it simple — no servers, no databases, just files, Git, and Python
- Don't make architects learn new tools — draw.io, Markdown, and Git are enough
- AI integration is a side effect of the format, not a feature to build
- Domain-scoped skills — each domain gets `/<domain>-archi` to avoid searching everything
- Schema-driven — zero hardcoded types. Everything flows from registry-mapping.yaml

### Vocabulary-Agnostic Principle (CRITICAL)

This project MUST remain vocabulary-agnostic. Users can use ArchiMate, TOGAF, C4, or any custom vocabulary. The UI and loader code must NEVER contain logic that depends on specific type names, layer names, or relationship names.

**Rules for all code changes:**

1. **No type-name conditionals** — Never write `if (type === 'component')` or `type.includes('data')`. Behavior must be driven by schema properties (`graph_rank`, `layer`, `icon`) not by type key strings.
2. **No layer-name conditionals** — Never write `if (layer === 'applications_and_data')`. Layer colors and metadata come from `registry-mapping.yaml`.
3. **No relationship-name conditionals** — Never write `if (rel === 'composition')` in data/rendering logic. Relationship semantics come from `meta-model.config.ts` which reads from the YAML.
4. **Hardcoded style maps are optional enrichments** — `NODE_STYLES`, `ELEMENT_ICONS`, `ELEMENT_HIERARCHY` in TypeScript provide rich styling for known types, but unknown types MUST fall back to schema-derived values (layer color, `graph_rank`, `icon` emoji from the YAML). A user who defines a brand-new element type in `registry-mapping.yaml` should see it render correctly without touching any `.ts` or `.tsx` file.
5. **Domain anchor = `graph_rank: 0`** — The domain/area anchor element is identified by having `graph_rank: 0` in the YAML, not by checking for a specific type key like `domain`.
6. **The `archimate:` field in registry-mapping.yaml is optional metadata** — It exists for documentation/reference for ArchiMate users. The UI and loader NEVER read it.

**Test:** If a user renames every element type, layer, and relationship in `registry-mapping.yaml` to completely custom names, the catalog UI must still build and render correctly.