---
type: component
name: Tenant Management
description: Manages tenant lifecycle including onboarding, configuration, and offboarding of B2B customers.
owner: Platform Team
status: active
domain: Customer Management
registered: false
sourcing: in-house

parent_domain: Customer Management
composes_components: []
owns_data_aggregates:
  - Tenant Aggregate
realizes_api_contracts: []
realizes_business_capability: Customer Management
realized_by_software_systems:
  - Platform Core

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
---

Tenant Management handles the complete lifecycle of B2B tenant accounts, from initial signup through configuration and eventual offboarding.
