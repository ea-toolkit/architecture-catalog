---
# ─────────────────────────────────────────────────────────────
# Infrastructure Function
# Distinct infrastructural capability as part of the foundation
# needed to run Software Subsystems.
# The infrastructure counterpart of a Logical Component.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: infrastructure-function
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system

# ── Relationships (from draw.io arrows) ──────────────────────
# Realization (⇢ in): app infrastructure that realizes this (array)
realized_by_application_infrastructure: []

# Realization (⇢ in): tech infrastructure that realizes this (array)
realized_by_cloud_services: []

# Realization (⇢ in): hosting nodes that realize this (array)
realized_by_infra_nodes: []

# Realization (⇢ in): networking equipment that realizes this (array)
realized_by_networking_equipment: []

# Realization (⇢ out): infrastructure APIs exposed (array)
realizes_infrastructure_apis: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: technology-function
togaf_type: Logical Technology Component
emm_type: Logical TI Component
capsifi_type: ~
---

<!-- Extended description, capabilities offered, etc. -->
