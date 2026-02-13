# Getting Started

A step-by-step guide to setting up the Architecture Catalog from scratch for your organization.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ (20 recommended) | `node --version` |
| npm | 9+ | `npm --version` |
| Git | 2.30+ | `git --version` |
| Python | 3.9+ (optional, for validation) | `python3 --version` |

---

## Step 1: Clone & Install

```bash
git clone https://github.com/your-org/architecture-catalog.git
cd architecture-catalog
cd catalog-ui
npm install
```

## Step 2: Verify the Default Build

Before making changes, confirm the project builds with the included sample data:

```bash
npm run build
```

You should see output like:

```
▶ Building...
✓ 244 pages built in 3.2s
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser. You should see the dashboard with sample domains and elements.

---

## Step 3: Brand It for Your Organization

Open `models/registry-mapping.yaml` and update the `site:` section:

```yaml
site:
  name: Acme Architecture Catalog
  description: Acme Corp enterprise architecture registry
  logo_text: A
```

Update the domain color palette to match your brand:

```yaml
domain_color_palette:
  - "#1e40af"   # primary
  - "#7c3aed"   # secondary
  - "#dc2626"   # accent
  - "#059669"   # success
  - "#d97706"   # warning
```

Restart the dev server and your branding is applied everywhere.

---

## Step 4: Define Your Architecture Layers

The default setup uses ArchiMate layers. Customize them under `layers:` in the mapping:

```yaml
layers:
  business:
    name: Business Architecture
    color: "#f59e0b"
    bg: "#fffbeb"
    icon: B
  application:
    name: Application Architecture
    color: "#3b82f6"
    bg: "#eff6ff"
    icon: A
  technology:
    name: Technology Architecture
    color: "#10b981"
    bg: "#ecfdf5"
    icon: T
  data:
    name: Data Architecture
    color: "#8b5cf6"
    bg: "#faf5ff"
    icon: D
```

Create corresponding folders under `registry-v2/`:

```bash
mkdir -p registry-v2/1-business/
mkdir -p registry-v2/2-application/
mkdir -p registry-v2/3-technology/
mkdir -p registry-v2/4-data/
```

---

## Step 5: Define Your Element Types

For each kind of architecture element, add an entry under `elements:` in the mapping.

Here's an example for a "Microservice" type:

```yaml
elements:
  microservice:
    label: Microservice
    layer: application               # must match a key in layers:
    folder: 2-application/microservices  # relative to registry-v2/
    id_field: name
    archimate: application-component
    graph_rank: 2                    # position in left-to-right graph layout
    icon: 🖥️
    badge_category: system           # grouping for filter badges
    fields:
      type:
        type: string
        required: false
        label: Element Type
      name:
        type: string
        required: true
        label: Name
      description:
        type: string
        required: false
        label: Description
      owner:
        type: string
        required: false
        label: Team Owner
      domain:
        type: string
        required: false
        label: Domain
      status:
        type: string
        required: false
        label: Status
    relationships:
      exposes_apis:
        target: api_endpoint          # must match another element key
        type: serving
        cardinality: many
        resolve_by: slug
        inverse: served_by
        required: false
```

Create the folder:

```bash
mkdir -p registry-v2/2-application/microservices/
```

---

## Step 6: Create Your First Element

Create a Markdown file in the appropriate folder:

```markdown
---
type: microservice
name: Order Service
description: Handles order creation, validation, and lifecycle management
owner: Team Commerce
domain: Order Management
status: active
exposes_apis:
  - create-order-api
  - get-order-api
---

## Overview

The Order Service is the core microservice responsible for managing
the complete order lifecycle from creation through delivery.

## Architecture Decisions

- **ADR-001**: Event sourcing for order state management
- **ADR-002**: Saga pattern for distributed transactions
```

Save this as `registry-v2/2-application/microservices/order-service.md`.

Rebuild and it appears in the catalog:

```bash
npm run dev
```

---

## Step 7: Add Relationships

Relationships are resolved automatically. When you set:

```yaml
exposes_apis:
  - create-order-api
```

The loader looks for a file named `create-order-api.md` in the folder mapped to `api_endpoint` (via the `resolve_by: slug` strategy).

### Resolution strategies

| Strategy | What it matches | When to use |
|----------|----------------|-------------|
| `slug` | Filename (without `.md`) | Best for technical identifiers |
| `name` | The `name:` frontmatter field | Best for human-readable names |
| `abbreviation` | The `abbreviation:` field | Best for system codes like "NOVA" |

---

## Step 8: Run Validation (Optional)

```bash
python scripts/validate.py
```

Reports missing required fields, broken references, orphan files, and domain maturity scores.

---

## Step 9: Deploy

### GitHub Pages

Push to GitHub, enable Pages with GitHub Actions, and use the workflow in the main README.

### Docker

```bash
cd catalog-ui && npm run build
npx serve dist
```

### Any static host

Upload `catalog-ui/dist/` to Netlify, Vercel, S3, or any static file server.

---

## Step 10: Iterate

```
1. Edit models/registry-mapping.yaml    ← change the schema
2. Add/edit registry-v2/**/*.md         ← add/update data
3. npm run build                        ← rebuild catalog
4. git commit + push                    ← share with team
```

No code changes needed for steps 1 and 2. The catalog adapts automatically.

---

## Common Patterns

### Multiple teams, one catalog

Each team owns a domain. Use the `domain:` frontmatter field to auto-group elements. Git branch protection rules keep teams scoped.

### Incremental adoption

Start with names and statuses. Add descriptions, relationships, and metadata over time. Health scoring shows your progress.

### CI/CD integration

```yaml
- name: Validate architecture registry
  run: python scripts/validate.py --strict

- name: Build catalog
  working-directory: catalog-ui
  run: npm run build
```

---

## Next Steps

- [Configuration Reference](CONFIGURATION.md) — full registry-mapping.yaml documentation
- [Architecture Guide](ARCHITECTURE.md) — how the code works internally
- [Contributing Guide](CONTRIBUTING.md) — development setup and conventions
