---
type: data-aggregate
name: Tenant Aggregate
description: Consistency boundary for tenant lifecycle including organization profile, user seats, and feature configuration.
owner: Platform Team
status: active
domain: Customer Management
registered: false
lifecycle_states:
  - provisioning
  - active
  - suspended
  - deactivated

parent_data_concept: Tenant Account
owned_by_logical_component: Tenant Management
composes_data_entities:
  - Tenant
  - User Seat

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

The Tenant Aggregate enforces business rules around tenant provisioning, user seat limits, and feature toggles.
