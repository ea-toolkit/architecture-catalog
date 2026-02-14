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
Registry loaded: 34 elements, 69 edges
  Healthy: 34  |  Connected: 34  |  Orphans: 0
  Broken refs: 0
```

## Start the dev server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321). You should see the dashboard with the Customer Management, Billing & Payments, and Analytics & Insights sample domains.

## Brand it for your organization

Open `models/registry-mapping.yaml` and update the `site:` section:

```yaml
site:
  name: Acme Architecture Catalog
  description: Acme Corp enterprise architecture registry
  logo_text: A
```

Restart the dev server and your branding is applied everywhere.

## Next steps

- [Project Structure](/getting-started/project-structure/) — understand the repo layout
- [Registry Mapping](/modeling/registry-mapping/) — learn the schema that drives everything
