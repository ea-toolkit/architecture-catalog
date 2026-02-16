---
# ─────────────────────────────────────────────────────────────
# Data Concept
# Specific data abstraction representing a real-world object.
# Designed and owned in context of Architecture Area Domain.
# Acts as a "namespace" detailed using Data Aggregates/Entities.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: data-concept
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
data_catalog_id:   # data catalog identifier
classification: internal  # pii | business-confidential | internal

# ── Relationships (from draw.io arrows) ──────────────────────
# Owns (← in): architecture area domain that owns this (singular)
owned_by_domain: 

# Composition (◆ out): data aggregates within this concept (array)
composes_data_aggregates: []

# Realization (⇢ in): business info object this realizes (singular)
realizes_business_information_object: 

# ── Alignment ────────────────────────────────────────────────
archimate_type: data-object
togaf_type: Data Entities
emm_type: Data Concept
ddd_type: ~
c4_type: ~
---

<!-- Extended description, lifecycle, ownership -->
