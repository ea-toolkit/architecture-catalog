---
# ─────────────────────────────────────────────────────────────
# Software Component
# Bundling of code units reusable as a whole.
# Not separately deployable; runs as part of a subsystem.
# Maps to Component in C4 model.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: software-component
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
reusable: true  # true | false

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆ in): parent subsystem (singular)
parent_software_subsystem: 

# Composition (◆ out): software code units within (array)
composes_software_code: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: application-component
c4_type: Component
uml_type: Component
ddd_type: Module
togaf_type: ~
emm_type: ~
software_boundaries_type: Software Component
capsifi_type: ~
---

<!-- Extended description, purpose, technology, etc. -->
