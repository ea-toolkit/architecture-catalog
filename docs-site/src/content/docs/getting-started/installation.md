---
title: Installation
description: Set up Architecture Catalog from scratch.
---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18+ (20 recommended) | `node --version` |
| npm | 9+ | `npm --version` |
| Git | 2.30+ | `git --version` |
| Python | 3.9+ (optional, for validation) | `python3 --version` |

## Clone and install

```bash
git clone https://github.com/ea-toolkit/architecture-catalog.git
cd architecture-catalog
cd catalog-ui
npm install
```

## Verify the build

Before making changes, confirm the project builds with the included sample data:

```bash
npm run build
```

You should see output like:

```
Registry loaded: 182 elements, 340 edges
  Healthy: 182  |  Connected: 182  |  Orphans: 0
  Broken refs: 0
286 page(s) built
```

## Start the dev server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). You should see the dashboard with 6 sample domains including Customer Management, Billing & Payments, Analytics & Insights, Integration & Connectivity, Security & Compliance, and Platform Operations.

<!-- VIDEO: #1 Homepage overview — open the app, dark mode, hover domain cards, scroll stats (30s) -->

## Brand it for your organization

Open `models/registry-mapping.yaml` and update the `site:` section:

```yaml
site:
  name: Architecture Catalog       # subtitle / catalog name
  company: Acme Corp               # main heading on homepage
  description: Enterprise architecture registry
  logo_text: A                     # single character in sidebar logo
```

When `company` is set, the homepage shows it as the main title with the catalog `name` as subtitle. Restart the dev server and your branding is applied everywhere.

## Next steps

- [Project Structure](/getting-started/project-structure/) — understand the repo layout
- [Registry Mapping](/modeling/registry-mapping/) — learn the schema that drives everything
