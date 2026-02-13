# Contributing Guide

Thank you for considering a contribution to Architecture Catalog!
This guide covers development setup, coding conventions, and the PR workflow.

---

## Development Setup

### Prerequisites

- Node.js 18+ (20 recommended)
- npm 9+
- Git 2.30+
- Python 3.9+ (for validation scripts)

### Quick Start

```bash
git clone https://github.com/your-org/architecture-catalog.git
cd architecture-catalog
cd catalog-ui
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) and verify the catalog renders.

---

## Types of Contributions

### 1. Registry Data

Add or improve architecture elements. No code changes needed.

**Where:** `registry-v2/**/*.md`

```bash
# Create a new element
cp registry-v2/3-applications-and-data/software-systems/_template.md \
   registry-v2/3-applications-and-data/software-systems/my-new-system.md

# Edit and fill in the frontmatter
code registry-v2/3-applications-and-data/software-systems/my-new-system.md
```

### 2. Schema Changes

Add new element types, fields, or relationship types.

**Where:** `models/registry-mapping.yaml`

See the [Configuration Reference](CONFIGURATION.md) for the full YAML schema.

### 3. UI Changes

Modify the catalog interface, add pages, or update styles.

**Where:** `catalog-ui/src/`

### 4. Validation & Tooling

Improve the linter, dashboard generator, or add new scripts.

**Where:** `scripts/`

### 5. Documentation

Improve these docs, add examples, or fix typos.

**Where:** `docs/` and `README.md`

---

## Development Workflow

### Branch naming

```
feat/description      — New feature
fix/description       — Bug fix
docs/description      — Documentation only
schema/description    — Schema (registry-mapping.yaml) changes
data/description      — Registry data additions/updates
```

### Commit messages

Use clear, descriptive commit messages:

```
feat: add dark mode toggle to catalog UI
fix: resolve slug collision for cross-type duplicates
docs: add deployment guide for Docker
schema: add domain_event element type
data: add 15 physical APIs for Order Management domain
```

### Pull request process

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes
4. Run validation:
   ```bash
   cd catalog-ui && npm run build
   python scripts/validate.py
   ```
5. Commit and push
6. Open a PR against `main`
7. Fill in the PR template describing your changes
8. Wait for review

---

## Code Conventions

### TypeScript (catalog-ui)

- **Strict mode** — all types must be explicit, no `any`
- **Imports** — use relative paths from `src/`
- **Naming** — camelCase for functions/variables, PascalCase for types/interfaces
- **File naming** — kebab-case for pages, PascalCase for React components
- **No hardcoding** — all type names, field names, and labels come from the mapping YAML

### YAML (registry-mapping.yaml)

- **Indentation** — 2 spaces
- **Keys** — snake_case
- **Comments** — use `#` comments to explain non-obvious decisions
- **Sections** — use the horizontal rule pattern for readability:
  ```yaml
  # ─────────────────────────────────────────────────────────────
  # Section Name
  # ─────────────────────────────────────────────────────────────
  ```

### Markdown (registry-v2)

- **Frontmatter** — required YAML between `---` markers
- **File naming** — kebab-case matching the element's identifier
- **Templates** — every type folder should have a `_template.md`
- **Body content** — standard Markdown: headings, lists, code blocks, links

### Python (scripts)

- **Python 3.9+** compatible
- **Standard library only** — no pip dependencies for core scripts
- **Type hints** — use type annotations for function signatures

---

## Architecture Rules

These rules keep the project maintainable and open-source-ready:

### 1. Schema-driven UI

The UI must never hardcode element type names, field names, domain names,
or relationship labels. Everything comes from `registry-mapping.yaml`.

**Before (bad):**
```typescript
if (element.type === 'software_system') { ... }
```

**After (good):**
```typescript
const typeDef = mapping.elements[element.typeKey];
const label = typeDef?.label ?? element.typeKey;
```

### 2. Graceful degradation

Missing data should never break the build. Use optional chaining and fallbacks:

```typescript
const description = element.fields.description ?? 'No description';
const owner = element.fields.owner ?? 'Unassigned';
```

### 3. Three-layer separation

- **Schema changes** should not require UI code changes
- **Data additions** should not require schema or UI changes
- **UI changes** should not require data format changes

### 4. Composite IDs

Always use the `typeKey--slug` format for element IDs. Never assume slugs
are globally unique across types.

---

## Testing

### Build test

The primary test is a successful build:

```bash
cd catalog-ui
npm run build
```

This validates:
- All TypeScript compiles
- All pages generate successfully
- All dynamic routes have valid data
- The mapping YAML is parseable

### Linter test

```bash
python scripts/validate.py
```

Validates:
- Required fields are present
- References resolve to existing elements
- No orphan files

### Manual testing

For UI changes, verify these pages render correctly:

1. Dashboard (`/`) — stats, layer bar, domain cards
2. Domain overview (`/domains/<id>`) — element tables, relationships
3. Element detail (`/catalog/<id>`) — metadata, relationships, body
4. Context map (`/domains/<id>/context-map`) — interactive graph
5. Discover (`/discover`) — search, filter badges

---

## Adding a New Element Type

This is the most common contribution. Follow these steps:

### 1. Add to mapping

In `models/registry-mapping.yaml`, add under `elements:`:

```yaml
elements:
  my_new_type:
    label: My New Type
    layer: applications_and_data    # match an existing layer key
    folder: 3-applications-and-data/my-new-types
    id_field: name
    archimate: application-component
    graph_rank: 2
    icon: 🆕
    badge_category: system
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
      domain:
        type: string
        required: false
        label: Domain
      status:
        type: string
        required: false
        label: Status
    relationships: {}
```

### 2. Create the folder

```bash
mkdir -p registry-v2/3-applications-and-data/my-new-types/
```

### 3. Create a template

```bash
cat > registry-v2/3-applications-and-data/my-new-types/_template.md << 'EOF'
---
type: my-new-type
name:
description:
owner:
domain:
status: draft
---
EOF
```

### 4. Add your first element

```bash
cp registry-v2/3-applications-and-data/my-new-types/_template.md \
   registry-v2/3-applications-and-data/my-new-types/first-element.md
# Edit and fill in the data
```

### 5. Build and verify

```bash
cd catalog-ui
npm run build
```

The new type appears automatically — no code changes needed.

---

## Project Structure (for contributors)

```
catalog-ui/src/
├── lib/
│   ├── types.ts              ← All TypeScript interfaces
│   └── registry-loader.ts    ← Core: YAML + Markdown → RegistryGraph
├── data/
│   └── registry.ts           ← Bridge: exports data for pages
├── layouts/
│   └── Layout.astro          ← App shell (sidebar, header, chrome)
├── pages/
│   ├── index.astro           ← Dashboard
│   ├── discover.astro        ← Search/filter
│   ├── catalog/[id].astro    ← Element detail (dynamic route)
│   └── domains/[id]/
│       ├── index.astro       ← Domain overview
│       └── context-map.astro ← Interactive graph
├── components/
│   ├── graphs/               ← React Flow + dagre
│   └── diagrams/             ← draw.io renderer
└── styles/
    └── global.css            ← Design tokens + component styles
```

---

## Questions?

- Open a [GitHub Issue](https://github.com/your-org/architecture-catalog/issues) for bugs or feature requests
- Open a [Discussion](https://github.com/your-org/architecture-catalog/discussions) for questions or ideas
- Tag your PR with the appropriate label: `schema`, `data`, `ui`, `docs`, `tooling`

---

## Code of Conduct

Be kind, be constructive, be respectful. We follow the
[Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/).
