---
name: deploy
description: Build and deploy static sites (catalog-ui, docs-site) to Firebase Hosting. Supports dry-run preview, selective target deployment, and automatic build detection.
argument-hint: "[--dry-run] [--target catalog|docs|all]"
allowed-tools: Bash, Read, Glob
model: haiku
---

# Deploy to Firebase Hosting

Build and deploy the catalog UI and/or docs site to Firebase Hosting.

## Arguments

- `$ARGUMENTS` may contain:
  - `--dry-run` — Build only, skip deploy. Show what would be deployed.
  - `--target catalog` — Deploy only the catalog UI
  - `--target docs` — Deploy only the docs site
  - `--target all` — Deploy both (default)
  - No arguments = build and deploy all targets

## Workflow

### 1. Parse Arguments

Extract flags from `$ARGUMENTS`:
- Check for `--dry-run` flag
- Check for `--target <value>` (default: `all`)

### 2. Validate Prerequisites

Run these checks before proceeding:

```bash
# Check Firebase CLI is installed
which firebase || echo "ERROR: Firebase CLI not installed. Run: npm install -g firebase-tools"

# Check Firebase auth
firebase projects:list --limit 1 2>&1 || echo "ERROR: Not authenticated. Run: firebase login"

# Check firebase.json exists
test -f firebase.json || echo "ERROR: firebase.json not found in project root"
```

If any check fails, report the error and stop.

### 3. Build

Based on `--target`:

**Catalog UI** (target = `catalog` or `all`):
```bash
cd catalog-ui && npm ci && npm run build
```
Report build output size: `du -sh catalog-ui/dist`

**Docs Site** (target = `docs` or `all`):
```bash
cd docs-site && npm ci && npm run build
```
Report build output size: `du -sh docs-site/dist`

### 4. Deploy (skip if --dry-run)

```bash
firebase deploy --only hosting
```

If targeting a specific site:
```bash
firebase deploy --only hosting:catalog
# or
firebase deploy --only hosting:docs
```

### 5. Report

**On dry-run:**
```
**Dry Run Complete**

| Target | Build | Size |
|--------|-------|------|
| Catalog UI | OK | X MB |
| Docs Site | OK | X MB |

Ready to deploy. Run `/deploy` (without --dry-run) to push to Firebase.
```

**On deploy:**
```
**Deployed Successfully**

| Target | URL |
|--------|-----|
| Catalog UI | https://architecture-catalog.web.app |
| Docs Site | https://docs-architecture-catalog.web.app |

Firebase project: ea-toolkit-demo-ac513
```

## Error Handling

- If build fails, show the error output and stop. Do not deploy a broken build.
- If deploy fails, show the Firebase error. Common fix: `firebase login` to re-authenticate.
- If `node_modules/` is missing, `npm ci` handles it automatically.

## Notes

- The CI/CD pipeline (`.github/workflows/deploy.yml`) auto-deploys on push to main. This skill is for manual/preview deployments.
- Firebase project ID: `ea-toolkit-demo-ac513` (from `.firebaserc`)
- Hosting targets: `catalog` → `architecture-catalog`, `docs` → `docs-architecture-catalog`
