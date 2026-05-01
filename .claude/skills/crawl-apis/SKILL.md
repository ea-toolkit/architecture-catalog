---
name: crawl-apis
description: Scan a target codebase for API definitions (OpenAPI, REST routes, GraphQL schemas) and propose api_contract and api_endpoint registry entries. Presents findings for review before writing files.
argument-hint: "<path-to-scan> [--domain <domain-name>] [--write]"
allowed-tools: Read, Write, Bash, Glob, Grep
model: sonnet
---

# Crawl APIs — Discover and Register API Definitions

Scan a codebase directory for API definitions and propose registry entries.

## Arguments

- `$1` — Path to scan (required). Absolute or relative path to the codebase to crawl.
- `--domain <name>` — Domain to assign discovered APIs to (optional, will ask if omitted).
- `--write` — Write proposed entries to registry immediately (default: preview only).

If no path is provided, ask the user which directory to scan.

## Workflow

### 1. Discover Type-to-Folder Mapping

Read `models/registry-mapping.yaml` to find:
- The folder path for `api_contract` entries
- The folder path for `api_endpoint` entries
- The `_template.md` in each folder for frontmatter structure

**Never hardcode paths.** Always derive from the YAML.

### 2. Scan for API Definitions

Search the target directory for API-related files. Use these detection patterns:

**OpenAPI / Swagger specs:**
```bash
# Find OpenAPI/Swagger YAML and JSON files
```
- Glob: `**/{openapi,swagger}*.{yaml,yml,json}`, `**/api-spec*.{yaml,yml,json}`
- Content match: files containing `openapi:` or `swagger:` at the top level

**REST route definitions (Node.js/Express/Fastify/Hono):**
- Grep for patterns: `router\.(get|post|put|delete|patch)`, `app\.(get|post|put|delete|patch)`, `@Get|@Post|@Put|@Delete` (NestJS decorators)
- Look in: `**/routes/**`, `**/controllers/**`, `**/handlers/**`, `**/api/**`

**GraphQL schemas:**
- Glob: `**/*.graphql`, `**/*.gql`
- Content match: files containing `type Query`, `type Mutation`, `schema {`

**gRPC / Protobuf:**
- Glob: `**/*.proto`
- Content match: `service <Name>` blocks

**Python (FastAPI/Flask/Django REST):**
- Grep for: `@app.route`, `@router.get|post|put|delete`, `@api_view`, `class.*ViewSet`

### 3. Extract API Information

For each discovered API, extract:

| Field | Source |
|-------|--------|
| `name` | OpenAPI `info.title`, route prefix, GraphQL type name, proto service name |
| `description` | OpenAPI `info.description`, JSDoc/docstring if available |
| `protocol` | REST, GraphQL, gRPC, async (inferred from file type) |
| `endpoints` | Individual route paths / operations / queries+mutations |
| `status` | `draft` (always — human reviews and promotes) |

### 4. Check for Duplicates

Before proposing entries, check existing registry entries:
```bash
# List existing api-contract and api-endpoint entries
```
Compare by name (case-insensitive). Flag potential duplicates.

### 5. Present Findings

Show the user a summary table:

```
**API Discovery Results** — scanned: <path>

Found X API definitions:

| # | Name | Protocol | Endpoints | Status |
|---|------|----------|-----------|--------|
| 1 | User API | REST | 5 routes | NEW |
| 2 | Payment API | GraphQL | 3 queries, 2 mutations | NEW |
| 3 | Billing API | REST | 8 routes | DUPLICATE (exists) |

**Proposed Registry Entries:**

For each NEW API, show the proposed frontmatter:
- 1 `api_contract` entry (logical grouping)
- N `api_endpoint` entries (one per route/operation, or grouped by resource)
```

### 6. Write Entries (if --write or user confirms)

For each approved entry:
1. Generate kebab-case filename from the API name
2. Read the `_template.md` for the target type
3. Fill in discovered fields, leave unknowns as TBD
4. Write to the correct registry folder
5. Report what was written

### 7. Post-Scan Report

```
**Written X entries:**
- api_contract: registry-v2/<path>/api-name.md
- api_endpoint: registry-v2/<path>/endpoint-name.md

**Next steps:**
1. Review and fill in TBD fields (owner, relationships)
2. Wire relationships: `implements_api_contract`, `parent_software_subsystem`
3. Run `/validate` to check model consistency
```

## Detection Priority

1. OpenAPI/Swagger specs (highest confidence — structured, complete)
2. GraphQL schema files (high confidence — typed, discoverable)
3. Protobuf service definitions (high confidence — typed)
4. Framework route definitions (medium confidence — may need human review)
5. Generic endpoint patterns (low confidence — present as suggestions)

## Notes

- Always propose as `status: draft` — never auto-promote to active
- Group related endpoints under a single `api_contract` when they share a prefix/resource
- If the scanned codebase is this repo itself, skip `catalog-ui/` and `docs-site/` (they're the UI, not the modeled system)
- Large codebases: limit scan to first 50 API definitions and suggest narrowing the path
