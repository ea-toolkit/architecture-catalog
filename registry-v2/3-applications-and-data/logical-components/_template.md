---
# ─────────────────────────────────────────────────────────────
# Logical Component
# Ideal software system boundary. Autonomous enough to support
# a Business Process Module. See also Bounded Context in DDD.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: logical-component
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
make_or_buy: make  # make | buy | hybrid

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆ in): belongs to architecture area domain (singular)
parent_architecture_area_domain: 

# Composition (◆ out): child logical components (array) - self-reference
composes_logical_components: []

# Owns: data aggregates owned by this component (array)
owns_data_aggregates: []

# Realization (⇢ out): logical APIs this component realizes (array)
realizes_logical_apis: []

# Realization (⇢ out): business capability realized (singular)
realizes_business_capability: 

# Realization (⇢ in): software systems that realize this (array)
realized_by_software_systems: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
software_boundaries_type: ~
capsifi_type: Logical Applications
---

<!-- Extended description, boundaries, responsibilities -->
