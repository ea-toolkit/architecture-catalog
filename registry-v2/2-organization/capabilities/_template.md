---
# ─────────────────────────────────────────────────────────────
# Business Capability
# What the business can do, independent of how it's implemented.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: business-capability
name: <Business Capability Name>
description: <Brief description>
owner: <owning-team>
domain:
status: draft | active | deprecated
registered: false

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆): Capability composes Business Process Modules
composes_process_modules: []

# Owns: Capability owns Business Information Objects
owns_information_objects: []

# Realization (incoming): Logical Components that realize this capability
realized_by_components: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: business-function
togaf_type: Business Capability
---

# <Business Capability Name>

<Description of the business capability — what the business can do, independent of how it's implemented.>
