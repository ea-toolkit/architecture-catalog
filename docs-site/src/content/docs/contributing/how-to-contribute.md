---
title: How to Contribute
description: Development setup, conventions, and PR workflow.
---

## Development setup

```bash
git clone https://github.com/ea-toolkit/architecture-catalog.git
cd architecture-catalog
cd catalog-ui
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) and verify the catalog renders.

## Types of contributions

### Registry data
Add or improve architecture elements. No code changes needed.

**Where:** `registry-v2/**/*.md`

### Schema changes
Add new element types, fields, or relationship types.

**Where:** `models/registry-mapping.yaml`

### UI changes
Modify the catalog interface, add pages, or update styles.

**Where:** `catalog-ui/src/`

### Documentation
Improve the docs site or fix typos.

**Where:** `docs-site/src/content/docs/`

## Workflow

### Branch naming

```
feat/description      -- New feature
fix/description       -- Bug fix
docs/description      -- Documentation only
schema/description    -- Schema changes
data/description      -- Registry data additions
```

### Commit messages

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
   ```
5. Commit and push
6. Open a PR against `main`

## Code conventions

### TypeScript
- Strict mode -- no `any` types
- All type names, field names, and labels come from the mapping YAML -- never hardcode them
- camelCase for functions/variables, PascalCase for types/interfaces
- kebab-case for page files, PascalCase for React components

### YAML
- 2 spaces indentation
- snake_case keys
- Use `#` comments to explain non-obvious decisions

### Markdown
- YAML frontmatter between `---` markers
- kebab-case filenames
- Every type folder should have a `_template.md`

## Architecture rules

### Schema-driven UI

The UI must never hardcode element type names, field names, or relationship labels. Everything comes from `registry-mapping.yaml`.

```typescript
// Bad
if (element.type === 'software_system') { ... }

// Good
const typeDef = mapping.elements[element.typeKey];
const label = typeDef?.label ?? element.typeKey;
```

### Graceful degradation

Missing data should never break the build:

```typescript
const description = element.fields.description ?? 'No description';
```

### Three-layer separation

- Schema changes should not require UI code changes
- Data additions should not require schema or UI changes
- UI changes should not require data format changes

## Testing

The primary test is a successful build:

```bash
cd catalog-ui && npm run build
```

For UI changes, verify these pages render correctly:
1. Dashboard (`/`)
2. Domain overview (`/domains/<id>`)
3. Element detail (`/catalog/<id>`)
4. Context map (`/domains/<id>/context-map`)
5. Discover (`/discover`)
