---
# ─────────────────────────────────────────────────────────────
# Domain Event
# An event relevant for domain experts and contextual for the domain.
# Expressed as a verb in past tense.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: domain-event
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
event_format: CloudEvents  # CloudEvents | Avro | JSON | other
schema_registry:   # link to schema

# ── Relationships (from draw.io arrows) ──────────────────────
# Triggering (← in): physical APIs that publish this (array)
published_by_physical_apis: []

# Triggering (← in): physical APIs that consume this (array)
consumed_by_physical_apis: []

# Realization (⇢ out): business event this realizes (singular)
realizes_business_event: 

# ── Alignment ────────────────────────────────────────────────
archimate_type: application-event
c4_type: Relation
ddd_type: Domain Event
togaf_type: ~
emm_type: ~
capsifi_type: ~
---

<!-- Extended description, payload schema, versioning, etc. -->
