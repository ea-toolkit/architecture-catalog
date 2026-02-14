---
# ─────────────────────────────────────────────────────────────
# Organisation Unit
# An institution or association comprising legal entities,
# divisions, and departments with a particular purpose.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: organisation-unit
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
org_type: division  # company | division | department | external

# ── Relationships (from EMM arrows) ──────────────────────────
# Composition: parent organisation (singular)
parent_organisation_unit: 

# Composition: child organisations (array)
child_organisation_units: []

# Composition: actors belonging to this unit (array)
composes_actors: []

# Assignment: value streams owned (array)
owns_value_streams: []

# Assignment: E2E processes owned (array)
owns_e2e_processes: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: business-actor
togaf_type: Organization Unit
capsifi_type: Organisation
---

<!-- Extended description, org chart, responsibilities, etc. -->
