---
type: data-aggregate
name: Account Aggregate
description: Consistency boundary for customer account data including contacts, organizations, access roles, and audit trails.
owner: Platform Team
status: active
domain: Customer Management
registered: false
lifecycle_states:
  - prospect
  - active
  - suspended
  - archived

parent_data_concept: Customer Profile
owned_by_logical_component: Account Management
composes_data_entities:
  - Contact
  - Organization
  - Access Role
  - Audit Log

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

Account Aggregate is the consistency boundary for all customer account data. It ensures transactional integrity across contact records, organization hierarchies, role assignments, and audit logs within a single tenant.
