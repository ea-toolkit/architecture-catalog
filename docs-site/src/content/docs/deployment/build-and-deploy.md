---
title: Build & Deploy
description: Build the catalog and deploy it anywhere.
---

## Build

```bash
cd catalog-ui
npm run build
```

The output goes to `catalog-ui/dist/` -- pure static HTML, CSS, and JS.

## Preview locally

```bash
npm run preview
```

Opens a local server at `http://localhost:4321` serving the built site.

## GitHub Pages

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

## Docker

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

## Static hosting (S3, Netlify, Vercel)

```bash
cd catalog-ui
npm run build
# Upload dist/ to your static hosting provider
```

The output is a fully self-contained static site with no external API calls, no telemetry, and no runtime dependencies. It works behind a VPN or on an air-gapped network.
