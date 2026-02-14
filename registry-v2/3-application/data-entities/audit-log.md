---
type: data-entity
name: Audit Log
description: Immutable record of security-relevant actions performed within a tenant, including user changes, permission updates, and data access events.
owner: Platform Team
status: active
domain: Customer Management
registered: false
entity_type: child

parent_data_aggregate: Account Aggregate

archimate_type: data-object
ddd_type: Entity
togaf_type: Physical Data Component
---

Audit Log captures an immutable, time-ordered record of all security-relevant events within a tenant. It tracks user logins, permission changes, data exports, API key rotations, and administrative actions for compliance and forensics.
