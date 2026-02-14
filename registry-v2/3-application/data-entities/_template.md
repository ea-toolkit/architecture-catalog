---
# ─────────────────────────────────────────────────────────────
# Data Entity
# Details a Data Aggregate to level of attributes and types.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: data-entity
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
entity_type: root  # root | child | value-object

# ── Attributes ───────────────────────────────────────────────
attributes: []
# Example:
# attributes:
#   - name: order_id
#     type: string
#     required: true
#   - name: status
#     type: enum
#     values: [pending, confirmed, cancelled]

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆ in): parent aggregate (singular)
parent_data_aggregate: 

# ── Alignment ────────────────────────────────────────────────
archimate_type: data-object
ddd_type: Entity
togaf_type: Physical Data Component
emm_type: Data Entity
capsifi_type: ~
c4_type: ~
---

<!-- Extended description, validations, examples, etc. -->
