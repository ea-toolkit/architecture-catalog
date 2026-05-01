---
name: crawl-data
description: Scan a target codebase for data model definitions (SQL schemas, ORM models, TypeScript interfaces, Pydantic models) and propose data_concept, data_aggregate, and data_entity registry entries. Presents findings for review before writing files.
argument-hint: "<path-to-scan> [--domain <domain-name>] [--write]"
allowed-tools: Read, Write, Bash, Glob, Grep
model: sonnet
---

# Crawl Data — Discover and Register Data Models

Scan a codebase directory for data model definitions and propose registry entries.

## Arguments

- `$1` — Path to scan (required). Absolute or relative path to the codebase to crawl.
- `--domain <name>` — Domain to assign discovered models to (optional, will ask if omitted).
- `--write` — Write proposed entries to registry immediately (default: preview only).

If no path is provided, ask the user which directory to scan.

## Workflow

### 1. Discover Type-to-Folder Mapping

Read `models/registry-mapping.yaml` to find:
- The folder path for `data_concept` entries
- The folder path for `data_aggregate` entries
- The folder path for `data_entity` entries
- The `_template.md` in each folder for frontmatter structure

**Never hardcode paths.** Always derive from the YAML.

### 2. Scan for Data Model Definitions

Search the target directory for data model files. Use these detection patterns:

**SQL Schema files:**
- Glob: `**/*.sql`, `**/migrations/**/*.sql`, `**/schema/**/*.sql`
- Content match: `CREATE TABLE`, `ALTER TABLE`
- Extract: table name, column names/types, constraints, foreign keys

**Prisma models:**
- Glob: `**/schema.prisma`, `**/*.prisma`
- Content match: `model <Name> {`
- Extract: model name, fields with types, relations (`@relation`)

**TypeORM / Sequelize / Drizzle (TypeScript ORMs):**
- Grep for: `@Entity()`, `@Table`, `Model.init`, `pgTable(`, `mysqlTable(`
- Look in: `**/models/**`, `**/entities/**`, `**/schema/**`
- Extract: class/table name, decorated columns, relations

**Pydantic / dataclass models (Python):**
- Grep for: `class.*BaseModel`, `@dataclass`, `class.*Model.*models.Model` (Django)
- Look in: `**/models/**`, `**/schemas/**`, `**/domain/**`
- Extract: class name, field names/types, validators

**TypeScript interfaces / types:**
- Grep for: `export interface`, `export type.*=.*{`
- Look in: `**/types/**`, `**/interfaces/**`, `**/models/**`
- Extract: interface/type name, property names/types

**Protobuf messages:**
- Glob: `**/*.proto`
- Content match: `message <Name> {`
- Extract: message name, fields with types

### 3. Extract Data Model Information

For each discovered model, extract:

| Field | Source |
|-------|--------|
| `name` | Table/class/interface name, converted to Title Case |
| `description` | JSDoc/docstring/comment above definition, or TBD |
| `entity_type` | `root` if standalone, `child` if has foreign key to parent, `value-object` if embedded |
| `attributes` | Column/field definitions with name, type, required status |
| `classification` | `pii` if field names suggest personal data (email, phone, ssn, address), `internal` otherwise |

### 4. Build Data Hierarchy

Group discovered models into the three-level registry hierarchy:

1. **Data Concept** — High-level business concept (e.g., "Customer", "Order", "Payment")
   - Inferred from: table name prefixes, module/folder grouping, foreign key clusters
   - One concept per logical grouping

2. **Data Aggregate** — Bounded collection of entities (DDD aggregate root + children)
   - Inferred from: root tables with child tables referencing them
   - If unclear, each standalone table/model becomes its own aggregate

3. **Data Entity** — Individual table/model with attributes
   - Direct mapping from discovered models
   - Includes extracted attributes array

### 5. Check for Duplicates

Before proposing entries, check existing registry entries:
- List existing data_concept, data_aggregate, and data_entity entries
- Compare by name (case-insensitive)
- Flag potential duplicates

### 6. Present Findings

Show the user a summary:

```
**Data Model Discovery Results** — scanned: <path>

Found X data models:

**Proposed Hierarchy:**

📦 Customer (Data Concept)
  └─ 🗃️ Customer Aggregate (Data Aggregate)
       ├─ 📝 Customer (root entity, 8 attributes)
       ├─ 📝 Customer Address (child entity, 5 attributes)
       └─ 📝 Customer Preference (value-object, 3 attributes)

📦 Order (Data Concept)
  └─ 🗃️ Order Aggregate (Data Aggregate)
       ├─ 📝 Order (root entity, 12 attributes)
       └─ 📝 Order Line Item (child entity, 6 attributes)

**Duplicates:** (if any)
- "Customer" already exists in registry as data-concepts/customer.md

**Classification hints:**
- Customer → PII detected (email, phone fields)
- Order → internal
```

### 7. Write Entries (if --write or user confirms)

For each approved entry:
1. Generate kebab-case filename from the model name
2. Read the `_template.md` for the target type
3. Fill in discovered fields:
   - `name`, `description`, `status: draft`
   - `classification` for data_concept
   - `entity_type` and `attributes` for data_entity
   - Parent relationships (`parent_data_concept`, `parent_data_aggregate`)
4. Write to the correct registry folder
5. Report what was written

### 8. Post-Scan Report

```
**Written X entries:**
- data_concept: registry-v2/<path>/concept-name.md
- data_aggregate: registry-v2/<path>/aggregate-name.md
- data_entity: registry-v2/<path>/entity-name.md

**Next steps:**
1. Review and fill in TBD fields (owner, description)
2. Verify classification (PII, business-confidential, internal)
3. Wire component relationships: `owned_by_component`
4. Run `/validate` to check model consistency
```

## Detection Priority

1. SQL CREATE TABLE statements (highest confidence — explicit schema)
2. Prisma models (high confidence — typed, complete)
3. ORM entity decorators (high confidence — structured)
4. Protobuf messages (high confidence — typed)
5. Pydantic/dataclass models (medium confidence — may be DTOs not domain models)
6. TypeScript interfaces (lower confidence — may be API shapes not data models)

## Notes

- Always propose as `status: draft` — never auto-promote to active
- PII classification is a hint based on field names — human must verify
- If a model has no clear parent, make it both a data_concept and data_aggregate (flat hierarchy)
- Skip migration files — focus on current model state, not history
- Skip test fixtures and mock data files
- Large codebases: limit scan to first 100 models and suggest narrowing the path
