---
# ─────────────────────────────────────────────────────────────
# Application Infrastructure
# Physical system software (mostly bought) offering
# Infrastructure Functions to Software Subsystems.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: application-infrastructure
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
vendor:   # vendor name
license:   # license type

# ── Relationships (from draw.io arrows) ──────────────────────
# Realization (⇢ out): infrastructure functions realized (array)
realizes_infrastructure_functions: []

# Serving (→ out): software subsystems that use this (array)
serves_software_subsystems: []

# Serving (← in): technology infrastructure this runs on (singular)
served_by_cloud_services:

# Serving (← in): hosting nodes this runs on (array)
served_by_infra_nodes: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: system-software
uml_type: Artifact
togaf_type: Physical Technology Component
emm_type: Physical TI Component
software_boundaries_type: Technology System
capsifi_type: Technology Component
---

<!-- Extended description, vendor info, support, etc. -->
