---
# ─────────────────────────────────────────────────────────────
# Technology Infrastructure
# Base-level infrastructure on which Application Infrastructure
# and Software Systems can be deployed.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: cloud_service
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
cloud_provider: GCP  # GCP | Azure | AWS | on-prem | hybrid

# ── Relationships (from draw.io arrows) ──────────────────────
# Realization (⇢ out): infrastructure functions realized (array)
realizes_infrastructure_functions: []

# Serving (→ out): application infrastructure hosted (array)
serves_application_infrastructure: []

# Serving (→ out): software subsystems hosted (array)
serves_software_subsystems: []

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

<!-- Extended description, cloud config, contracts, etc. -->
