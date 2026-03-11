---
type: data-aggregate
name: Identity Record Aggregate
description: Consistency boundary for a single user or service account identity, including credentials, role assignments, MFA devices, and active sessions.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
lifecycle_states:
  - pending
  - active
  - suspended
  - deprovisioned

parent_data_concept: Identity Record
owned_by_component: Identity and Access Management
owned_by_software_subsystem: iam-api
composes_data_entities:
  - User Profile
  - Role Assignment

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Identity Record Aggregate enforces the invariant that a user must have at least one verified authentication factor and one active tenant membership before transitioning to the active state. Deprovisioning triggers a cascading session revocation.
