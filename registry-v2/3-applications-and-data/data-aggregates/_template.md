---
# ─────────────────────────────────────────────────────────────
# Data Aggregate
# A graph of Data Entities as a consistency boundary.
# Encapsulates business rules within a Logical Component.
# Has a lifecycle with multiple states.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: data-aggregate
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
lifecycle_states: []  # e.g., [draft, submitted, approved, cancelled]

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆ in): parent data concept (singular)
parent_data_concept: 

# Owns (← in): logical component that owns this (singular)
owned_by_logical_component: 

# Owns (← in): software subsystem that owns this (singular)
owned_by_software_subsystem: 

# Composition (◆ out): data entities within this aggregate (array)
composes_data_entities: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
emm_type: ~
capsifi_type: System
c4_type: ~
---

<!-- Extended description, invariants, business rules, etc. -->
