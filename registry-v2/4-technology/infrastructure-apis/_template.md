---
# ─────────────────────────────────────────────────────────────
# Infrastructure API
# API by which infrastructure offers its functions.
# Ideally an open standard to prevent vendor lock-in.
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: infrastructure-api
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
standard: open  # open | proprietary
protocol:   # e.g., OAuth, OIDC, SQL, Docker API, OpenTelemetry

# ── Relationships (from draw.io arrows) ──────────────────────
# Realization (⇢ in): infrastructure function this exposes (singular)
realized_by_infrastructure_function: 

# Serving (→ out): software subsystems that use this (array)
serves_software_subsystems: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: technology-service
togaf_type: Technology Service
emm_type: Conceptual TI Service
---

<!-- Extended description, specification, versions, etc. -->
