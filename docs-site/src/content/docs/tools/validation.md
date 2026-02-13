---
title: Validation
description: Lint your registry with the validation script.
---

## Build-time validation

The Astro build itself is the first line of validation. If the mapping references a folder that doesn't exist, or a relationship targets an unknown element type, the build logs a warning.

```bash
cd catalog-ui
npm run build
```

The build output shows a health summary:

```
Registry loaded: 32 elements, 69 edges
  Healthy: 32  |  Connected: 32  |  Orphans: 0
  Broken refs: 0  |  Missing type: 0
```

## Linter script

For deeper validation, run the Python linter:

```bash
python scripts/validate.py
```

This checks:
- Every `.md` file has required fields (per the mapping)
- All relationship references resolve to existing elements
- No orphan files (files not matching any mapped type)
- Maturity scoring per domain

### Strict mode

Use `--strict` to treat warnings as errors (useful for CI):

```bash
python scripts/validate.py --strict
```

## CI integration

Add both to your CI pipeline:

```yaml
steps:
  - name: Validate registry
    run: python scripts/validate.py --strict

  - name: Build catalog
    working-directory: catalog-ui
    run: npm run build
```
