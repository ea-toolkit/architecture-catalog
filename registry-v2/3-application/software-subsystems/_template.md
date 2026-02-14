---
# ─────────────────────────────────────────────────────────────
# Software Subsystem
# Deployable unit within a Software System.
# Maps to Container in C4 model.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: software-subsystem
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
catalog_id:   # External catalog registration ID

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆ in): parent software system (singular)
parent_software_system: 

# Composition (◆ out): software components within (array)
composes_software_components: []

# Composition (◆ out): physical APIs exposed (array)
composes_physical_apis: []

# Owns: data aggregates owned (array)
owns_data_aggregates: []

# Serving (← in): infrastructure that serves this (arrays)
served_by_application_infrastructure: []
served_by_technology_infrastructure: []
served_by_infrastructure_apis: []
served_by_hosting_nodes: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: application-component
c4_type: Container
uml_type: SubSystem
togaf_type: Application Component
emm_type: Physical IS Component
software_boundaries_type: Software Subsystem
capsifi_type: ~
---

<!-- Extended description, deployment, runtime config -->
