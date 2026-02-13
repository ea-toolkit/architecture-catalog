---
# ─────────────────────────────────────────────────────────────
# Business Event
# A happening that causes the business to react: arrival of time,
# status change, or external occurrence.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: business-event
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
event_type: state-change  # temporal | state-change | external

# ── Relationships (from EMM arrows) ──────────────────────────
# Triggering: process tasks that trigger this event (array)
triggered_by_process_tasks: []

# Triggering: process tasks this event triggers (array)
triggers_process_tasks: []

# Realization: domain events that realize this (array)
realized_by_domain_events: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: business-event
togaf_type: Event
---

<!-- Extended description, payload, frequency, etc. -->
