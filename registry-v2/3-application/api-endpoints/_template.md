---
# ─────────────────────────────────────────────────────────────
# Physical Business API
# Actual API schema/contract implementing a Logical Business API.
# Multiple physical endpoints possible (EventAPI, WebAPI, GraphQL).
# ─────────────────────────────────────────────────────────────

# ── Core Fields ──────────────────────────────────────────────
type: api_endpoint
name: 
description: 
owner: 
status: draft  # draft | active | deprecated
registered: false  # true if imported from source system
api_catalog_id:   # Kong / API catalog identifier
protocol: REST  # REST | gRPC | GraphQL | async | event
auth_method: OAuth2  # mTLS | OAuth2 | API-Key

# ── Relationships (from draw.io arrows) ──────────────────────
# Composition (◆ in): software subsystem that owns this (singular)
parent_software_subsystem: 

# Assignment (● out): logical API this implements (singular)
implements_api_contract: 

# Triggering (→ out): domain events published (array)
publishes_domain_events: []

# Triggering (→ out): domain events consumed (array)
consumes_domain_events: []

# ── Alignment ────────────────────────────────────────────────
archimate_type: application-interface
uml_type: Interface
ddd_type: Application Service
togaf_type: Information System Service
emm_type: ~
---

<!-- Extended description, endpoints, authentication, versioning -->
