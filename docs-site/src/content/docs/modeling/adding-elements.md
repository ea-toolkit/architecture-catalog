---
title: Adding Elements
description: Create architecture elements as Markdown files.
---

Each architecture element is a Markdown file with YAML frontmatter. The frontmatter contains structured metadata; the body is free-form documentation.

## Create your first element

1. Find the right folder for the element type (defined in `registry-mapping.yaml`)
2. Copy the `_template.md` file in that folder
3. Fill in the frontmatter fields
4. Add documentation in the body

### Example

```markdown
---
type: software-subsystem
name: CRM API Gateway
description: API gateway for tenant and contact management
owner: Platform Team
domain: Customer Management
status: active
parent_software_system: platform-core
composes_physical_apis:
  - tenant-api
---

## Overview

The CRM API Gateway handles all inbound API traffic for
tenant provisioning, contact lookups, and authentication flows.

## Architecture Decisions

- **ADR-001**: Selected API gateway pattern for unified entry point
- **ADR-002**: JWT-based tenant isolation
```

Save as `registry-v2/3-application/software-subsystems/crm-api-gateway.md`.

## Frontmatter fields

Every `.md` file has a YAML frontmatter block between `---` markers:

```yaml
---
type: software-system          # matches an element key in the mapping
name: Platform Core             # required - the element's identity
description: Core CRM platform # optional - shown in cards and detail
owner: Platform Team           # optional - ownership info
domain: Customer Management    # optional - auto-groups into domains
status: active                 # optional - free-text status value
---
```

Additional fields depend on the element type. Check `registry-mapping.yaml` for the full list per type.

## Body content

Everything below the frontmatter `---` is standard Markdown. It's rendered as rich documentation on the element's detail page. Use it for:

- Architecture Decision Records (ADRs)
- Integration notes and API documentation
- Diagrams (embedded images or links)
- Team-specific runbooks

## File naming

Use kebab-case for filenames:

```
billing-worker.md
tenant-api.md
tenant-account.md
```

The filename (without `.md`) becomes the element's slug, used for reference resolution and URL generation.

## Composite IDs

Internally, each element gets a composite ID: `<type_key>--<slug>`

```
software_subsystem--billing-worker
physical_business_api--tenant-api
data_concept--tenant-account
```

The `--` separator prevents collisions. Different element types can have files with the same slug.

## Templates

Every type folder should have a `_template.md` with all available fields pre-filled as empty values. This makes it easy to create new elements:

```bash
cp registry-v2/3-application/software-systems/_template.md \
   registry-v2/3-application/software-systems/my-new-system.md
```
