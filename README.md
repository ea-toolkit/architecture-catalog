<p align="center">
  <img src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" alt="Astro 5" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/ArchiMate-3.x-FF6600" alt="ArchiMate 3" />
  <img src="https://img.shields.io/badge/License-MIT-green?logo=opensourceinitiative&logoColor=white" alt="MIT" />
  <img src="https://img.shields.io/badge/Schema_Driven-YAML-blue" alt="Schema Driven" />
</p>

# Architecture Catalog

**A schema-driven, white-label architecture catalog that turns Markdown files into a beautiful, interactive static site.**

Model your enterprise architecture using plain Markdown files with YAML frontmatter, define your schema in a single YAML mapping, and get a fully navigable catalog — dashboards, domain maps, element details, context graphs, and health scores — with zero custom code.

---

## The Problem

| Challenge | Traditional tools | This project |
|-----------|------------------|-------------|
| Vendor lock-in | Proprietary formats (Sparx, Archi) | Plain Markdown + YAML |
| Collaboration | Single-user desktop apps | Git-friendly, PR-based workflow |
| Customization | Fixed schemas, rigid UI | 100% schema-driven, white-label |
| Cost | Per-seat licensing | Free & open source |
| Deployment | Complex servers | Static site — deploy anywhere |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/your-org/architecture-catalog.git
cd architecture-catalog

# 2. Install dependencies
cd catalog-ui
npm install

# 3. Start the dev server
npm run dev
# → Open http://localhost:4321
```

That's it. The catalog reads your `registry-v2/` folder and renders everything automatically.

---

## Project Structure

```
architecture-catalog/
│
├── models/
│   └── registry-mapping.yaml    ← THE schema: defines types, fields, relationships
│
├── registry-v2/                 ← YOUR DATA: one .md file per architecture element
│   ├── 1-products-and-services/
│   ├── 2-process-and-organisation/
│   ├── 3-applications-and-data/
│   │   ├── architecture-area-domains/
│   │   ├── logical-components/
│   │   ├── software-systems/
│   │   ├── software-subsystems/
│   │   ├── physical-apis/
│   │   ├── logical-apis/
│   │   ├── data-concepts/
│   │   ├── data-aggregates/
│   │   ├── data-entities/
│   │   └── domain-events/
│   └── 4-infrastructure-and-hosting/
│
├── catalog-ui/                  ← THE UI: Astro + React static site
│   ├── astro.config.mjs
│   ├── package.json
│   └── src/
│       ├── lib/
│       │   ├── types.ts             ← TypeScript interfaces (auto-derived from YAML)
│       │   └── registry-loader.ts   ← Reads YAML + Markdown → in-memory graph
│       ├── data/
│       │   └── registry.ts          ← Bridge: exports domains, elements, edges
│       ├── layouts/
│       │   └── Layout.astro         ← Shell with sidebar + icon bar
│       ├── pages/
│       │   ├── index.astro          ← Dashboard
│       │   ├── discover.astro       ← Search & filter all elements
│       │   ├── catalog/[id].astro   ← Element detail page
│       │   └── domains/[id]/
│       │       ├── index.astro      ← Domain overview
│       │       └── context-map.astro← Interactive dependency graph
│       ├── components/
│       │   ├── graphs/              ← React + xyflow graph components
│       │   └── diagrams/            ← draw.io & PlantUML renderers
│       └── styles/
│           └── global.css           ← Design tokens + component styles
│
├── scripts/                     ← TOOLING: validation + generation
│   ├── validate.py                  ← Lint registry against mapping
│   ├── generate_dashboard.py        ← Generate HTML health dashboard
│   ├── generate_library.py          ← Export to ArchiMate XML
│   └── extract_view.py             ← Extract views from draw.io
│
├── agents/                      ← AI AGENTS: persona-based prompts
│   ├── enterprise-architect.md
│   ├── technology-architect.md
│   ├── business-architect.md
│   ├── data-architect.md
│   └── security-architect.md
│
├── views/                       ← DIAGRAMS: draw.io architecture views
│   └── novacrm-platform/
│
└── docs/                        ← DOCUMENTATION
    ├── GETTING-STARTED.md
    ├── CONFIGURATION.md
    ├── ARCHITECTURE.md
    └── CONTRIBUTING.md
```

---

## How It Works

The entire system follows three decoupled layers:

```
┌──────────────────────────────────────────────────────────┐
│                    registry-mapping.yaml                  │
│              (Schema: types, fields, rels)                │
└──────────────────────┬───────────────────────────────────┘
                       │ defines
┌──────────────────────▼───────────────────────────────────┐
│                     registry-v2/                          │
│            (Data: one .md file per element)               │
└──────────────────────┬───────────────────────────────────┘
                       │ renders
┌──────────────────────▼───────────────────────────────────┐
│                     catalog-ui/                           │
│          (UI: Astro pages, React graphs)                  │
└──────────────────────────────────────────────────────────┘
```

### 1. Define Your Schema (`registry-mapping.yaml`)

This single file is the source of truth. It declares:

- **Site branding** — name, description, logo
- **Layers** — groupings with colors (e.g., "Applications & Data")
- **Element types** — what kinds of things exist (services, APIs, data objects…)
- **Fields** — what metadata each type carries
- **Relationships** — how elements connect (composition, realization, serving…)
- **Relationship types** — ArchiMate verbs with outgoing/incoming labels

```yaml
# Site branding (change for white-label)
site:
  name: My Architecture Catalog
  description: Our enterprise architecture registry
  logo_text: M

# Define your layers
layers:
  business:
    name: Business
    color: "#f59e0b"
    bg: "#fffbeb"
    icon: B
  technology:
    name: Technology
    color: "#3b82f6"
    bg: "#eff6ff"
    icon: T

# Define an element type
elements:
  microservice:
    label: Microservice
    layer: technology
    folder: technology/microservices
    id_field: name
    archimate: application-component
    graph_rank: 2
    icon: 🖥️
    badge_category: system
    fields:
      name:
        type: string
        required: true
        label: Name
      owner:
        type: string
        required: false
        label: Team Owner
    relationships:
      exposes_apis:
        target: api
        type: serving
        cardinality: many
        resolve_by: slug
        inverse: served_by_microservice
        required: false
```

### 2. Add Your Data (`registry-v2/`)

Each architecture element is a Markdown file with YAML frontmatter:

```markdown
---
type: software-subsystem
name: CRM API Gateway
description: API gateway for tenant and contact management
owner: Platform Team
domain: NovaCRM Platform
status: active
parent_software_system: novacrm-core
composes_physical_apis:
  - tenant-api
---

## Overview

The CRM API Gateway handles all inbound API traffic for
tenant provisioning, contact lookups, and authentication flows.

## Architecture Decisions

- **ADR-001**: Selected API gateway pattern for unified entry point
- **ADR-002**: JWT-based tenant isolation
```

The body (below `---`) is rendered as rich documentation on the element's detail page.

### 3. Build & Browse

```bash
cd catalog-ui
npm run build    # → Static site in dist/
npm run preview  # → Preview at localhost:4321
```

The loader automatically:
1. Reads `registry-mapping.yaml` to learn the schema
2. Scans every `.md` file in `registry-v2/`
3. Parses frontmatter, resolves cross-references, builds an in-memory graph
4. Generates a page for every element, domain, and overview

---

## Features

### Dashboard
The landing page shows model-wide statistics:
- **Element count** per layer with color-coded distribution bar
- **Domain cards** with maturity badges and health scores
- **Enrichment metrics** — how many elements have descriptions, owners, etc.

### Domain Overview
Click any domain to see:
- All elements grouped by type within that domain
- Relationship tables grouped by ArchiMate type (Composition, Realization, Serving…)
- Quick-jump to any element's detail page

### Element Detail
Every element gets a dedicated page with:
- **Metadata card** — all fields from the frontmatter
- **Relationship tables** — outgoing and incoming, with human-readable verbs
- **Rich documentation** — the Markdown body rendered as HTML
- **Breadcrumb navigation** — layer → domain → element

### Context Graphs
Interactive dependency graphs powered by React Flow + dagre auto-layout:
- Nodes colored by domain, sized by connectivity
- Click any node to navigate to its detail page
- Automatic left-to-right layout using `graph_rank`

### Health Scoring
Each domain receives a maturity assessment:
- **Excellent** — ≥90% elements enriched with descriptions + owners
- **Good** — ≥65%
- **Developing** — ≥40%
- **Initial** — <40%

### Discover Page
Search and filter across the entire catalog:
- Free-text search across names and descriptions
- Filter by element type (badge-based)
- Filter by domain
- Sorted by relevance

---

## Customization Guide

### White-Label Branding

Change three lines in `registry-mapping.yaml`:

```yaml
site:
  name: Acme Architecture Catalog     # appears in header + page titles
  description: Acme Corp engineering   # appears on dashboard
  logo_text: A                         # single character in sidebar logo
```

Optionally set your domain color palette:

```yaml
domain_color_palette:
  - "#1e40af"   # your brand blue
  - "#7c3aed"   # your brand purple
  - "#dc2626"   # your brand red
```

### Add a New Layer

Add an entry under `layers:`:

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

### Add a New Element Type

Add an entry under `elements:`:

```yaml
elements:
  threat_model:
    label: Threat Model
    layer: security
    folder: 5-security-and-compliance/threat-models
    id_field: name
    archimate: assessment
    graph_rank: 1
    icon: 🛡️
    badge_category: security
    fields:
      name:
        type: string
        required: true
        label: Name
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

Create the folder and template:

```bash
mkdir -p registry-v2/5-security-and-compliance/threat-models/
```

Then add Markdown files — **no code changes required.** The loader picks them up automatically.

### Add a New Domain

Domains are auto-discovered from the `domain` field in your Markdown files.
Simply set `domain: My New Domain` in any element's frontmatter, and a new domain
appears in the sidebar, dashboard, and navigation.

### Add a New Relationship Type

Add an entry under `relationship_types:`:

```yaml
relationship_types:
  triggers:
    outgoing: Triggers
    incoming: Triggered by
    icon: "⚡"
```

Then reference it in any element's `relationships` section with `type: triggers`.

---

## Architecture Principles

### Schema-Driven Everything

| Aspect | Driven by |
|--------|-----------|
| Element types & labels | `registry-mapping.yaml → elements.*.label` |
| Fields & validation | `registry-mapping.yaml → elements.*.fields` |
| Relationship verbs | `registry-mapping.yaml → relationship_types` |
| Layer colors & names | `registry-mapping.yaml → layers` |
| Site branding | `registry-mapping.yaml → site` |
| Badge categories | `registry-mapping.yaml → elements.*.badge_category` |
| Domain colors | `registry-mapping.yaml → domain_color_palette` |

**The UI code has zero hardcoded type names, field names, or domain names.**

### Graceful Degradation

Every field and relationship is optional. Missing data shows a subtle placeholder
instead of breaking the build. This means you can start with a single element and
grow your registry incrementally.

### Three-Layer Architecture

```
Schema Layer    │  registry-mapping.yaml          │  Pure YAML, no code
────────────────┼─────────────────────────────────┤
Data Layer      │  registry-v2/**/*.md            │  Pure Markdown, no code
────────────────┼─────────────────────────────────┤
UI Layer        │  catalog-ui/src/                │  Reads schema + data
```

Each layer is independently modifiable. You can:
- Change the schema without touching any Markdown files
- Add data files without writing any code
- Redesign the UI without changing the data format

---

## Element File Reference

### Frontmatter Fields

Every `.md` file has a YAML frontmatter block between `---` markers:

```yaml
---
type: software-system          # matches an element key in the mapping
name: NovaCRM Core             # required — the element's identity
description: Core CRM platform # optional — shown in cards and detail
owner: Platform Team           # optional — ownership info
domain: NovaCRM Platform       # optional — auto-groups into domains
status: active                 # draft | active | deprecated
---
```

Additional fields depend on the element type — check `registry-mapping.yaml` for
the full list per type.

### Reference Resolution

Relationships are resolved using one of three strategies:

| Strategy | Matches against | Example value | Resolves to |
|----------|----------------|---------------|------------|
| `slug` | Filename (without `.md`) | `billing-worker` | `software-subsystems/billing-worker.md` |
| `name` | `name:` frontmatter field | `Tenant Management` | `logical-components/tenant-management.md` |
| `abbreviation` | `abbreviation:` field | `NOVA` | `software-systems/novacrm-core.md` |

**When a reference can't be resolved:** the UI shows the raw value with a broken-link
indicator (⚠️) and the linter flags it as a warning. The build never fails due to
unresolved references.

### Body Content

Everything below the frontmatter `---` is standard Markdown. It's rendered as rich
documentation on the element's detail page. Use it for:
- Architecture Decision Records (ADRs)
- Integration notes
- Diagrams (embedded images or draw.io links)
- Team-specific runbooks

---

## Relationship System

### ArchiMate Types

The catalog supports standard ArchiMate 3.x relationship types:

| Type | Icon | Outgoing verb | Incoming verb | Use case |
|------|------|---------------|---------------|----------|
| Composition | ◇ | Composes | Part of | Structural containment |
| Aggregation | ◆ | Owns | Owned by | Grouping, ownership |
| Realization | ▲ | Realizes | Realized by | Implementation links |
| Serving | → | Serves | Served by | API exposure |
| Assignment | ⊕ | Assigned to | Assigned from | Infrastructure mapping |
| Access | ⊙ | Accesses | Accessed by | Data read/write |

### Inverse Relationships

When you declare a relationship on element A pointing to element B, the `inverse`
field automatically creates the reverse link. For example:

```yaml
# On software_system:
composes_software_subsystems:
  target: software_subsystem
  type: composition
  cardinality: many
  resolve_by: slug
  inverse: parent_software_system    # ← auto-creates reverse link on subsystem
```

This means you only need to declare the relationship once. The loader builds both
outgoing and incoming views.

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| [Astro](https://astro.build) | 5.x | Static site generation, file-based routing |
| [React](https://react.dev) | 18.x | Interactive components (graphs, diagrams) |
| [React Flow](https://reactflow.dev) | 12.x | Graph visualization with drag & zoom |
| [dagre](https://github.com/dagrejs/dagre) | 0.8.x | Automatic graph layout (left-to-right) |
| [js-yaml](https://github.com/nodeca/js-yaml) | 4.x | YAML parsing for frontmatter + mapping |
| Python 3 | 3.9+ | Validation scripts, dashboard generation |

---

## Validation

### Build-Time Validation

The Astro build itself validates the registry. If the mapping references a folder
that doesn't exist, or a relationship targets an unknown element type, the build
logs a warning.

### Linter Script

```bash
python scripts/validate.py
```

This checks:
- Every `.md` file has required fields (per the mapping)
- All relationship references resolve to existing elements
- No orphan files (files not matching any mapped type)
- Maturity scoring per domain

### Dashboard Generation

```bash
python scripts/generate_dashboard.py
```

Generates an HTML report showing model health, coverage gaps, and domain maturity
trends.

---

## Deployment

### GitHub Pages

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install & Build
        working-directory: catalog-ui
        run: |
          npm ci
          npm run build

      - uses: actions/upload-pages-artifact@v3
        with:
          path: catalog-ui/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY catalog-ui/package*.json ./
RUN npm ci
COPY catalog-ui/ ./
COPY models/ ../models/
COPY registry-v2/ ../registry-v2/
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

### Static Hosting (S3, Netlify, Vercel)

```bash
cd catalog-ui
npm run build
# Upload dist/ to your static hosting provider
```

---

## AI Integration

The `agents/` directory contains prompt templates for AI-assisted architecture governance:

| Agent | Role |
|-------|------|
| `enterprise-architect.md` | Strategic alignment, portfolio governance |
| `technology-architect.md` | Solution design, technology selection |
| `business-architect.md` | Capability mapping, process alignment |
| `data-architect.md` | Data governance, entity modeling |
| `security-architect.md` | Threat modeling, compliance review |

These agents can be used with any LLM (ChatGPT, Claude, Copilot) to provide
context-aware architecture guidance based on your registry data.

---

## FAQ

<details>
<summary><strong>Can I use this without ArchiMate knowledge?</strong></summary>

Yes. The catalog works with any element types you define. ArchiMate alignment is
optional — you can use custom relationship types and layer names that match your
organization's vocabulary.
</details>

<details>
<summary><strong>How do I migrate from an existing tool (Sparx EA, Archi)?</strong></summary>

Export your model to XML/CSV, then write a simple script to generate Markdown files
with the appropriate frontmatter. The `scripts/generate_library.py` script shows
how to export to ArchiMate XML — the reverse process is similar.
</details>

<details>
<summary><strong>Can multiple teams contribute simultaneously?</strong></summary>

Absolutely. Each element is a separate file, so merge conflicts are rare. Use
standard Git branching and PR workflows. The validation script can run in CI to
catch broken references before merge.
</details>

<details>
<summary><strong>How many elements can it handle?</strong></summary>

The catalog is a static site generator, so all processing happens at build time.
We've tested with 500+ elements and builds complete in under 10 seconds. The
resulting static site loads instantly regardless of registry size.
</details>

<details>
<summary><strong>Can I add custom pages beyond the auto-generated ones?</strong></summary>

Yes. Add any `.astro` or `.md` file under `catalog-ui/src/pages/` and Astro will
include it in the build with file-based routing.
</details>

<details>
<summary><strong>How do I change the visual theme?</strong></summary>

Edit `catalog-ui/src/styles/global.css`. All colors use CSS custom properties
(design tokens), so you can swap the entire palette by changing a few variables.
</details>

<details>
<summary><strong>Can I deploy this as an internal tool behind a VPN?</strong></summary>

Yes. The output is a static site with no external API calls, no telemetry, and no
runtime dependencies. Host it on any internal web server.
</details>

<details>
<summary><strong>What happens if I delete a referenced element?</strong></summary>

The build continues successfully. The referencing element shows a broken-link
indicator (⚠️) for the unresolved reference. Run the linter to find all broken
references.
</details>

<details>
<summary><strong>Can I use this for C4 modeling instead of ArchiMate?</strong></summary>

Yes. The schema is fully flexible. Set up layers like "Context", "Container",
"Component" and define element types for System, Container, Component, etc.
The ArchiMate terminology is just the default.
</details>

<details>
<summary><strong>Is there a database behind this?</strong></summary>

No. The entire model is plain text files (Markdown + YAML). Everything is
Git-versioned, diffable, and works offline. The "database" is your file system.
</details>

---

## Contributing

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for development setup, coding
conventions, and pull request guidelines.

**Quick contribution workflow:**

```bash
# 1. Fork & clone
# 2. Create a feature branch
git checkout -b feat/my-feature

# 3. Make changes (schema, data, or UI)
# 4. Validate
cd catalog-ui && npm run build
python scripts/validate.py

# 5. Submit a PR
```

---

## Roadmap

- [x] Schema-driven element types and fields
- [x] Interactive context graphs with React Flow
- [x] Domain auto-discovery and health scoring
- [x] Relationship grouping by ArchiMate type
- [x] Full white-label support (zero hardcoded names)
- [x] Inverse relationship resolution
- [ ] Dark mode toggle
- [ ] Full-text search with fuzzy matching
- [ ] Export to PlantUML / Mermaid diagrams
- [ ] Version history per element (Git blame integration)
- [ ] Multi-registry support (compose multiple teams)
- [ ] GraphQL API for programmatic access
- [ ] Automated CI validation action

---

## License

MIT — see [LICENSE](LICENSE) for details.

Use it, fork it, brand it, ship it. No attribution required (but appreciated).
