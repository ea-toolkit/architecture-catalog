---
# ─────────────────────────────────────────────────────────────
# Software System
# Physical software boundary.
# Maps to System in C4 model.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: software-system
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
make_or_buy: make  # make | buy | hybrid
catalog_id:   # External catalog registration ID

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆ out): subsystems within this system (array)
composes_software_subsystems: []

# Realization (⇢ out): logical component this realizes (singular)
realizes_logical_component: 

# ── Alignment ────────────────────────────────────────────────
archimate_type: application-component
c4_type: System
uml_type: System
togaf_type: Application Component
emm_type: Physical IS Component
software_boundaries_type: Business System
capsifi_type: System
ddd_type: ~
---

<!-- Extended description, vendor info, contracts, architecture decisions -->

