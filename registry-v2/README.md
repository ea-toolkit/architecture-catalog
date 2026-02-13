# Registry v2

A simplified registry structure aligned 1:1 with the **Enterprise Meta Model**.

## Design Principles

1. **EMM-aligned structure** — 4 layers matching the meta model
2. **Machine-readable frontmatter** — YAML with typed relationship fields
3. **ArchiMate-derived relationships** — Singular/plural based on arrow cardinality
4. **Automation-ready** — `registered` field distinguishes source-system imports from manual entries
5. **Agent-navigable** — Relationship fields enable Claude agents to traverse the graph

## Structure Overview

```
registry-v2/
├── 1-products-and-services/           # Layer 1
│   ├── customer-segments/
│   ├── products/
│   └── business-services/
│
├── 2-process-and-organisation/        # Layer 2
│   ├── actors/
│   ├── roles/
│   ├── capabilities/
│   ├── events/
│   ├── information-objects/
│   ├── value-streams/
│   ├── processes/                     # E2E, Module, Task via process_level field
│   └── organisation-units/
│
├── 3-applications-and-data/           # Layer 3
│   ├── architecture-area-domains/
│   ├── logical-components/
│   ├── software-systems/
│   ├── software-subsystems/
│   ├── software-components/
│   ├── domain-events/
│   ├── logical-apis/
│   ├── physical-apis/
│   ├── data-concepts/
│   ├── data-aggregates/
│   └── data-entities/
│
└── 4-infrastructure-and-hosting/      # Layer 4
    ├── infrastructure-functions/
    ├── application-infrastructure/
    ├── technology-infrastructure/
    ├── infrastructure-apis/
    ├── hosting-nodes/
    ├── network-zones/
    └── networking-equipment/
```

## Template Structure

Each `_template.md` follows this pattern:

```yaml
---
# ── Core Fields ──────────────────────────────────────────────
type: <element-type>           # EMM element type
name:                          # Display name
description:                   # Brief description
owner:                         # Owning team
status: draft                  # draft | active | deprecated
registered: false              # true if from source system

# ── Relationships (from EMM arrows) ──────────────────────────
# Composition: parent (singular)
parent_<element>: 

# Composition: children (array)
child_<elements>: []

# Realization: what this realizes (singular or array)
realizes_<element>: 
realized_by_<elements>: []

# Assignment/Owns (array)
owns_<elements>: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: <archimate-element>
togaf_type: <togaf-element>
# ... other framework alignments
---

<!-- Extended description, diagrams, notes, etc. -->
```

## Relationship Cardinality Rules

Based on ArchiMate arrow types in the EMM diagram:

| Arrow Type | Meaning | Cardinality | Field Format |
|------------|---------|-------------|--------------|
| ◇─ (hollow diamond) | Aggregation | 1:N | `aggregates_<elements>: []` |
| ◆─ (filled diamond) | Composition | 1:N | `composes_<elements>: []` |
| ─▷ (dashed) | Realization | N:1 | `realizes_<element>:` (singular) |
| ─▷ (dashed, reverse) | Realized by | 1:N | `realized_by_<elements>: []` |
| ─► (serving) | Serving/Used by | N:N | `serves_<elements>: []` |
| ●─► (assignment) | Assignment/Owns | 1:N | `owns_<elements>: []` |
| ─► (flow/triggering) | Triggering | N:N | `triggers_<elements>: []` |

## Usage

### Creating a new entry

```bash
cp registry-v2/3-applications-and-data/software-systems/_template.md \
   registry-v2/3-applications-and-data/software-systems/my-system.md
```

### Automation pipeline

```
Source Systems (Catalogs, etc.)
       │
       ▼
   Registry (YAML frontmatter)  ◄── Manual entries (registered: false)
       │
       ├──► XML Shape Library (via generate_library.py)
       │         │
       │         ▼
       │    Draw.io / Archi (shapes with properties)
       │
       └──► Claude Agents (navigation, diagram generation)
```

### Key fields for automation

- `registered: true` — Imported from source system, don't manually edit
- `registered: false` — Manually created, can be edited
- `status: deprecated` — Soft delete, exclude from shape library
- Relationship fields — Used by agents for graph traversal

## Process Levels (APQC Alignment)

The `processes/` folder handles 3 EMM elements via the `process_level` field:

| process_level | apqc_level | EMM Element | Description |
|---------------|------------|-------------|-------------|
| `e2e` | L3 | E2E Process | How a Business Service is offered |
| `module` | L4 | Business Process Module | Reusable tasks within a capability |
| `task` | L5 | Process Task | Smallest unit (OTOPOP) |

Hierarchy is maintained via `parent_process` and `child_processes` relationships.

## Quick Reference

| EMM Element | Folder | Template |
|-------------|--------|----------|
| Customer / Market Segment | `1-products-and-services/customer-segments/` | [_template.md](1-products-and-services/customer-segments/_template.md) |
| Product | `1-products-and-services/products/` | [_template.md](1-products-and-services/products/_template.md) |
| Business Service | `1-products-and-services/business-services/` | [_template.md](1-products-and-services/business-services/_template.md) |
| Actor | `2-process-and-organisation/actors/` | [_template.md](2-process-and-organisation/actors/_template.md) |
| Business Role | `2-process-and-organisation/roles/` | [_template.md](2-process-and-organisation/roles/_template.md) |
| Business Capability | `2-process-and-organisation/capabilities/` | [_template.md](2-process-and-organisation/capabilities/_template.md) |
| Business Event | `2-process-and-organisation/events/` | [_template.md](2-process-and-organisation/events/_template.md) |
| Business Information Object | `2-process-and-organisation/information-objects/` | [_template.md](2-process-and-organisation/information-objects/_template.md) |
| Value Stream | `2-process-and-organisation/value-streams/` | [_template.md](2-process-and-organisation/value-streams/_template.md) |
| Process (E2E/Module/Task) | `2-process-and-organisation/processes/` | [_template.md](2-process-and-organisation/processes/_template.md) |
| Organization Unit | `2-process-and-organisation/organisation-units/` | [_template.md](2-process-and-organisation/organisation-units/_template.md) |
| Architecture Area Domain | `3-applications-and-data/architecture-area-domains/` | [_template.md](3-applications-and-data/architecture-area-domains/_template.md) |
| Logical Component | `3-applications-and-data/logical-components/` | [_template.md](3-applications-and-data/logical-components/_template.md) |
| Software System | `3-applications-and-data/software-systems/` | [_template.md](3-applications-and-data/software-systems/_template.md) |
| Software SubSystem | `3-applications-and-data/software-subsystems/` | [_template.md](3-applications-and-data/software-subsystems/_template.md) |
| Software Component | `3-applications-and-data/software-components/` | [_template.md](3-applications-and-data/software-components/_template.md) |
| Domain Event | `3-applications-and-data/domain-events/` | [_template.md](3-applications-and-data/domain-events/_template.md) |
| Logical Business API | `3-applications-and-data/logical-apis/` | [_template.md](3-applications-and-data/logical-apis/_template.md) |
| Physical Business API | `3-applications-and-data/physical-apis/` | [_template.md](3-applications-and-data/physical-apis/_template.md) |
| Data Concept | `3-applications-and-data/data-concepts/` | [_template.md](3-applications-and-data/data-concepts/_template.md) |
| Data Aggregate | `3-applications-and-data/data-aggregates/` | [_template.md](3-applications-and-data/data-aggregates/_template.md) |
| Data Entity | `3-applications-and-data/data-entities/` | [_template.md](3-applications-and-data/data-entities/_template.md) |
| Infrastructure Function | `4-infrastructure-and-hosting/infrastructure-functions/` | [_template.md](4-infrastructure-and-hosting/infrastructure-functions/_template.md) |
| Application Infrastructure | `4-infrastructure-and-hosting/application-infrastructure/` | [_template.md](4-infrastructure-and-hosting/application-infrastructure/_template.md) |
| Technology Infrastructure | `4-infrastructure-and-hosting/technology-infrastructure/` | [_template.md](4-infrastructure-and-hosting/technology-infrastructure/_template.md) |
| Infrastructure API | `4-infrastructure-and-hosting/infrastructure-apis/` | [_template.md](4-infrastructure-and-hosting/infrastructure-apis/_template.md) |
| Hosting Node | `4-infrastructure-and-hosting/hosting-nodes/` | [_template.md](4-infrastructure-and-hosting/hosting-nodes/_template.md) |
| Network Zone | `4-infrastructure-and-hosting/network-zones/` | [_template.md](4-infrastructure-and-hosting/network-zones/_template.md) |
| Networking Equipment | `4-infrastructure-and-hosting/networking-equipment/` | [_template.md](4-infrastructure-and-hosting/networking-equipment/_template.md) |
