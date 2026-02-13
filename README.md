<p align="center">
  <img src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" alt="Astro 5" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/License-MIT-green?logo=opensourceinitiative&logoColor=white" alt="MIT" />
  <img src="https://img.shields.io/badge/Schema_Driven-YAML-blue" alt="Schema Driven" />
</p>

# Architecture Catalog

**A schema-driven, white-label architecture catalog that turns Markdown files into a beautiful, interactive static site.**

Model your enterprise architecture using plain Markdown files with YAML frontmatter, define your schema in a single YAML mapping, and get a fully navigable catalog — dashboards, domain maps, element details, context graphs, and health scores — with zero custom code.

## Quick Start

```bash
git clone https://github.com/ea-toolkit/architecture-catalog.git
cd architecture-catalog/catalog-ui
npm install
npm run dev
# → Open http://localhost:4321
```

The catalog reads your `registry-v2/` folder and renders everything automatically.

## How It Works

```
registry-mapping.yaml   →   registry-v2/**/*.md   →   catalog-ui/
  (Schema)                     (Data)                   (Static site)
```

1. **Define your schema** in `models/registry-mapping.yaml` — types, fields, relationships, layers, branding
2. **Add elements** as Markdown files in `registry-v2/` with YAML frontmatter
3. **Build** — the loader reads the schema, scans every `.md` file, resolves cross-references, and generates a full static site

No databases, no servers, no vendor lock-in. Just files, Git, and a build step.

## Features

- **Dashboard** — element counts, domain cards, health scores, enrichment metrics
- **Domain overview** — elements grouped by type, relationship tables, maturity badges
- **Element detail** — metadata card, relationship tables, rich Markdown documentation
- **Context graphs** — interactive dependency graphs with React Flow + dagre auto-layout
- **Discover** — search and filter across the entire catalog
- **White-label** — change three lines of YAML to brand it as your own
- **Vocabulary-agnostic** — works with ArchiMate, TOGAF, C4, or any custom vocabulary

## Documentation

Full documentation is available in the [docs site](docs-site/):

```bash
cd docs-site
npm install
npm run dev
# → Open http://localhost:4321
```

| Section | What you'll find |
|---------|-----------------|
| [Getting Started](docs-site/src/content/docs/getting-started/) | Installation, project structure |
| [Modeling](docs-site/src/content/docs/modeling/) | Registry mapping, elements, relationships, domains |
| [Configuration](docs-site/src/content/docs/configuration/) | YAML reference, branding, layers & types |
| [Architecture](docs-site/src/content/docs/architecture/) | How it works, data pipeline, extending the UI |
| [Tools](docs-site/src/content/docs/tools/) | Validation, dashboard generator, Claude skills |
| [Deployment](docs-site/src/content/docs/deployment/) | GitHub Pages, Docker, static hosting |
| [Contributing](docs-site/src/content/docs/contributing/) | Dev setup, conventions, PR workflow |

## Contributing

```bash
git checkout -b feat/my-feature
# Make changes (schema, data, or UI)
cd catalog-ui && npm run build   # Validate
```

See the [contributing guide](docs-site/src/content/docs/contributing/how-to-contribute.md) for full details.

## License

MIT — see [LICENSE](LICENSE) for details.
