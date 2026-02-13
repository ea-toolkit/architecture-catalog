---
name: new-entry
description: Create a new registry entry with guided wizard. Supports components, data-objects, functions, services, and other ArchiMate element types.
argument-hint: [type] [name] e.g., "data-object Payment Record"
allowed-tools: Read, Write, Bash, Glob
model: sonnet
---

# Create New Registry Entry

Guide the user through creating a properly structured registry entry.

## Arguments

- `$1` - Element type: logical-component, software-system, data-concept, data-aggregate, data-entity, domain-event, physical-api, etc.
- `$2+` - Element name (can have spaces)

If arguments not provided, ask the user:
1. What type of element?
2. What is the element name?
3. Which architecture area domain does it belong to?

## Element Type to Folder Mapping

| Type | Folder |
|------|--------|
| architecture-area-domain | registry-v2/3-applications-and-data/architecture-area-domains/ |
| logical-component | registry-v2/3-applications-and-data/logical-components/ |
| software-system | registry-v2/3-applications-and-data/software-systems/ |
| software-subsystem | registry-v2/3-applications-and-data/software-subsystems/ |
| physical-api | registry-v2/3-applications-and-data/physical-apis/ |
| logical-api | registry-v2/3-applications-and-data/logical-apis/ |
| domain-event | registry-v2/3-applications-and-data/domain-events/ |
| data-concept | registry-v2/3-applications-and-data/data-concepts/ |
| data-aggregate | registry-v2/3-applications-and-data/data-aggregates/ |
| data-entity | registry-v2/3-applications-and-data/data-entities/ |
| capability | registry-v2/2-process-and-organisation/capabilities/ |
| process | registry-v2/2-process-and-organisation/processes/ |
| actor | registry-v2/2-process-and-organisation/actors/ |

## Workflow

1. Determine element type and target folder
2. Read `_template.md` in the target folder for structure
3. Read 1-2 existing entries in target folder for pattern reference
4. Create filename: kebab-case of name (e.g., "Payment Record" -> "payment-record.md")
5. Fill frontmatter:
   - name: [provided name]
   - owner: TBD
   - status: draft
   - [type-specific fields and relationships from template]
6. Write file to correct folder
7. Run validation: `python scripts/validate.py`

## Response Format

```
**Created:** registry-v2/3-applications-and-data/data-entities/payment-record.md

**Frontmatter:**
---
type: data-entity
name: Payment Record
owner: TBD
status: draft
parent_data_aggregate: TBD
---

**Next Steps:**
1. Fill in TBD fields (owner, parent_data_aggregate)
2. Add description in the body
3. Run /validate to verify

Would you like me to help fill in any of the TBD fields?
```

## Domain-Specific Fields

For **data** elements (concepts, aggregates, entities), also include:
- Relationship to parent element (data concept -> aggregate -> entity chain)
- classification: internal/business-confidential/pii

For **software** elements (systems, subsystems), also include:
- make_or_buy: make/buy/hybrid
- vendor: (if buy)
- realizes_logical_component: Which LC this system supports

## Notes

- Always use kebab-case for filenames
- Mark unknown fields as TBD rather than guessing
- Run validation after creation to catch issues early
- Suggest wiring relationships as a follow-up action