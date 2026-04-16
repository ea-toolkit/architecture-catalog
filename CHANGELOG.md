# Changelog

## [1.2.0](https://github.com/ea-toolkit/architecture-catalog/compare/v1.1.0...v1.2.0) (2026-04-16)


### Features

* visual differentiation for planned, deprecated, and external elements in graphs ([#65](https://github.com/ea-toolkit/architecture-catalog/issues/65)) ([7c6c7b8](https://github.com/ea-toolkit/architecture-catalog/commit/7c6c7b87baa90d9777b7e0a6f7305a7deb7cc788)), closes [#58](https://github.com/ea-toolkit/architecture-catalog/issues/58)


### Bug Fixes

* graph node key respects dark mode and uses clearer label ([#67](https://github.com/ea-toolkit/architecture-catalog/issues/67)) ([937a8d2](https://github.com/ea-toolkit/architecture-catalog/commit/937a8d28bfc7e972fbcde555f810f1e1a17392eb))

## [1.1.0](https://github.com/ea-toolkit/architecture-catalog/compare/v1.0.0...v1.1.0) (2026-04-12)


### Features

* add cross-domain architecture landscape view ([#62](https://github.com/ea-toolkit/architecture-catalog/issues/62)) ([dbbdf9b](https://github.com/ea-toolkit/architecture-catalog/commit/dbbdf9bd1abcf344231fcb4fbe10c5cf3288d840))

## v1.0.0 (2026-03-27)

First stable release of Architecture Catalog — a schema-driven, Git-native architecture catalog that turns Markdown files into an interactive static site.

### Core Features
- **Schema-driven registry** — single YAML file (`registry-mapping.yaml`) defines all types, layers, fields, relationships, and branding. Zero code changes to add new element types.
- **4-layer registry structure** — flat layers with typed sub-folders. One Markdown file per architecture element with YAML frontmatter.
- **Vocabulary-agnostic** — works with ArchiMate, TOGAF, C4, or any custom vocabulary. No hardcoded type names in the UI or loader.

### Catalog UI
- **Dashboard** — domain cards with hover stats, element counts, health indicators, enrichment metrics
- **Domain overview** — elements grouped by type, maturity badges, relationship tables
- **Element detail pages** — metadata card, outgoing/incoming relationships, rich Markdown documentation
- **Interactive context maps** — ReactFlow + dagre graphs with search, filter, focus mode, PNG export
- **Animated event flow diagrams** — publish/consume visualization with cross-domain connections
- **Diagram viewer** — PlantUML, BPMN, and draw.io rendered inline with zoom and source view
- **Capability heatmap** — treemap-style domain-scoped capability visualization
- **Discover page** — search and filter across the entire catalog
- **Dark mode** — default dark theme with light mode toggle, consistent across all views
- **White-label** — configurable company name, catalog name, logo text, accent color via YAML

### Tools & Automation
- **Validation script** — checks registry entries against diagrams, reports orphans and errors
- **Dashboard generator** — HTML health dashboard with domain maturity and layer statistics
- **Init registry script** — scaffold a new registry from a mapping YAML
- **Claude Code extensions** — 5 skills, 4 agents, 3 hooks, 2 rules for AI-assisted architecture work

### Infrastructure
- **Astro 5 + React 18** static site generator
- **Firebase Hosting** with multi-site deploy (catalog + docs)
- **GitHub Actions CI/CD** — auto-deploy on push to main
- **81 frontend tests** (Vitest) + Python test suite (pytest)
- **Documentation site** — Starlight-based docs with 25 pages and 8 demo videos

### Example Data
- 6 domains: Customer Management, Billing & Payments, Analytics & Insights, Integration & Connectivity, Security & Compliance, Platform Operations
- 180+ registered elements across all 4 layers
- Architecture diagrams in draw.io format

### Links
- **Live demo:** https://architecture-catalog.web.app
- **Documentation:** https://docs-architecture-catalog.web.app
- **Repository:** https://github.com/ea-toolkit/architecture-catalog
