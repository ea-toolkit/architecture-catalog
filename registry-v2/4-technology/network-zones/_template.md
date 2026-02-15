---
# ─────────────────────────────────────────────────────────────
# Network Zone
# A (virtual) network connecting Hosting Nodes and Subsystems.
# Represents a trust boundary from security perspective.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: network-zone
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
zone_type: private  # dmz | internal | internet | private
trust_level: medium  # high | medium | low | untrusted

# ── Relationships (from draw.io arrows) ──────────────────────
# Aggregation (◇ out): networking equipment in this zone (array)
aggregates_networking_equipment: []

# Association: hosting nodes within this zone (array)
associated_infra_nodes: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: communication-network
uml_type: Communication Path
togaf_type: Physical Technology Component
emm_type: Physical TI Component
software_boundaries_type: Hardware
capsifi_type: Technology Component
---

<!-- Extended description, security controls, firewall rules, etc. -->
