---
# ─────────────────────────────────────────────────────────────
# Logical Business API
# Capabilities of a Logical Component exposed as an API.
# Grouping of related operations as a single API resource.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: api_contract
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system

# ── Relationships (from draw.io arrows) ──────────────────────
# Realization (⇢ in): logical component that realizes this (singular)
realized_by_component: 

# Assignment (● in): physical APIs that implement this (array)
implemented_by_api_endpoints: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: application-service
ddd_type: Domain Service
togaf_type: Information System Service
emm_type: Conceptual IS Service
software_boundaries_type: Software Component
capsifi_type: ~
---

<!-- Extended description, operations, versioning -->
