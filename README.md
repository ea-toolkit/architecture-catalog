<p align="center">
  <img src="https://img.shields.io/badge/Astro-5.x-BC52EE?logo=astro&logoColor=white" alt="Astro 5" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/License-MIT-green?logo=opensourceinitiative&logoColor=white" alt="MIT" />
  <img src="https://img.shields.io/badge/Schema_Driven-YAML-blue" alt="Schema Driven" />
  <a href="https://architecture-catalog.web.app"><img src="https://img.shields.io/badge/Live_Demo-architecture--catalog.web.app-black?logo=firebase&logoColor=white" alt="Live Demo" /></a>
  <a href="https://docs-architecture-catalog.web.app"><img src="https://img.shields.io/badge/Docs-docs--architecture--catalog.web.app-blue?logo=readthedocs&logoColor=white" alt="Documentation" /></a>
</p>

# Architecture Catalog

**A schema-driven, white-label architecture catalog that turns Markdown files into a beautiful, interactive static site.**

<p align="center">
  <img src="docs-site/public/videos/homepage-demo.gif" alt="Architecture Catalog Demo" width="800" />
</p>

> **[Live Demo](https://architecture-catalog.web.app)** — explore a sample catalog with 6 domains and 180+ entities.
>
> **[Documentation](https://docs-architecture-catalog.web.app)** — getting started, features, modeling guide, and deployment.

Model your enterprise architecture using plain Markdown files with YAML frontmatter, define your schema in a single YAML mapping, and get a fully navigable catalog — dashboards, domain maps, element details, context graphs, event flows, and health scores — with zero custom code.

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

- **Dashboard** — domain cards with hover stats, element counts, dark/light theme
- **Domain overview** — elements grouped by type, maturity badges, relationship tables
- **Element detail** — metadata card, outgoing/incoming relationships, rich Markdown docs
- **Context maps** — interactive dependency graphs with search, filter, focus mode, PNG export
- **Event flow maps** — animated publish/consume diagrams with cross-domain connections
- **Diagrams** — PlantUML, BPMN, and draw.io rendered inline with zoom and source view
- **Discover** — search and filter across the entire catalog
- **White-label** — change a few lines of YAML to brand it as your own
- **Vocabulary-agnostic** — works with ArchiMate, TOGAF, C4, or any custom vocabulary
- **Dark mode** — default dark theme with toggle, consistent across all views

## Documentation

Full documentation with demo videos: **[docs-architecture-catalog.web.app](https://docs-architecture-catalog.web.app)**

| Section | What you'll find |
|---------|-----------------|
| [Getting Started](https://docs-architecture-catalog.web.app/getting-started/introduction/) | Installation, project structure, 5-minute quickstart |
| [Features](https://docs-architecture-catalog.web.app/features/dashboard/) | Dashboard, context maps, event flows, diagrams — with videos |
| [Modeling](https://docs-architecture-catalog.web.app/modeling/registry-mapping/) | Registry mapping, elements, relationships, domains |
| [Configuration](https://docs-architecture-catalog.web.app/configuration/mapping-reference/) | YAML reference, branding, layers & types |
| [Architecture](https://docs-architecture-catalog.web.app/architecture/how-it-works/) | How it works, data pipeline, extending the UI |
| [Tools](https://docs-architecture-catalog.web.app/tools/validation/) | Validation, dashboard generator, Claude skills |
| [Deployment](https://docs-architecture-catalog.web.app/deployment/build-and-deploy/) | Firebase, GitHub Pages, Docker, static hosting |

## Contributing

```bash
git checkout -b feat/my-feature
# Make changes (schema, data, or UI)
cd catalog-ui && npm run build   # Validate
```

See the [contributing guide](https://docs-architecture-catalog.web.app/contributing/how-to-contribute/) for full details.

## Acknowledgements

The catalog UI design is inspired by [EventCatalog](https://www.eventcatalog.dev/)
by David Boyne. EventCatalog is an excellent tool for documenting event-driven
architectures — if that's your focus, check it out.

Architecture Catalog takes a different approach: vocabulary-agnostic,
schema-driven, and built for enterprise architecture modelling across
all layers (not just events).

## License

MIT — see [LICENSE](LICENSE) for details.
