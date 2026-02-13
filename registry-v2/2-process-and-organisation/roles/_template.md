---
# ─────────────────────────────────────────────────────────────
# Business Role
# The expected function of an actor. An actor may have many roles.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: business-role
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system

# ── Relationships (from EMM arrows) ──────────────────────────
# Association: actors that can perform this role (array)
performed_by_actors: []

# Assignment: process tasks this role performs (array)
performs_process_tasks: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: business-role
togaf_type: Role
capsifi_type: Role
---

<!-- Extended description, responsibilities, permissions, etc. -->
