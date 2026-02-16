---
type: actor
name: <Actor Name>
description: <Brief description>
owner: <owning-team>
domain:
status: draft | active | deprecated
registered: false

# Relationships (ArchiMate arrows)
plays_roles: []                    # → Role (assignment) - roles this actor performs
belongs_to_organisation_unit:      # → Organisation Unit (aggregation) - parent org

# Classification
actor_type: internal | external | system

# ── Alignment ────────────────────────────────────────────────
archimate_type: business-actor
togaf_type: Actor
uml_type: Actor
---

# <Actor Name>

<Description of the actor — a concrete person, organization, or system that interacts with the business.>

## Context

<Why this actor exists and what they do in the ecosystem.>
