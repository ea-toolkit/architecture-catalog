---
# ─────────────────────────────────────────────────────────────
# Infrastructure Node
# Hardware device or software execution environment.
# Offers Infrastructure Functions of Compute and/or Storage.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: infra_node
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
node_type: vm  # vm | physical-server | container-host | serverless
cloud_provider:   # GCP | Azure | AWS | on-prem

# ── Relationships (from draw.io arrows) ──────────────────────
# Realization (⇢ out): infrastructure functions realized (array)
realizes_infrastructure_functions: []

# Serving (→ out): application infrastructure hosted (array)
serves_application_infrastructure: []

# Serving (→ out): technology infrastructure hosted (array)
serves_cloud_services: []

# Serving (→ out): software subsystems deployed (array)
serves_software_subsystems: []

# Association: network zone this belongs to (singular)
in_network_zone: 

# ── Alignment ────────────────────────────────────────────────
archimate_type: node
uml_type: Node
togaf_type: Physical Technology Component
emm_type: Physical TI Component
software_boundaries_type: Hardware
capsifi_type: Technology Component
---

<!-- Extended description, specs, location, config -->
