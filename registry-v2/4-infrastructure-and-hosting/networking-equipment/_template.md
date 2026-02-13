---
# ─────────────────────────────────────────────────────────────
# Networking Equipment
# Virtual or physical device offering Networking function.
# Connects Network Zones or Hosting Nodes to zones.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: networking-equipment
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
equipment_type: router  # router | switch | firewall | load-balancer | gateway
virtual: true  # true | false
location:   # physical location or cloud region

# ── Relationships (from draw.io arrows) ──────────────────────
# Realization (⇢ out): infrastructure functions realized (array)
realizes_infrastructure_functions: []

# Aggregation (◇ in): network zones this belongs to (array)
aggregated_by_network_zones: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: device
uml_type: Device
togaf_type: Physical Technology Component
emm_type: Physical TI Component
software_boundaries_type: Hardware
capsifi_type: Technology Component
---

<!-- Extended description, vendor, specs, config, etc. -->
