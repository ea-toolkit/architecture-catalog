---
type: logical-component
name: Account Management
description: Manages customer account data, contact records, organization hierarchy, and account-level configuration.
owner: Platform Team
status: active
domain: Customer Management
sourcing: in-house

parent_architecture_area_domain: Customer Management
realized_by_software_systems:
  - Platform Core
owns_data_aggregates:
  - Account Aggregate
realizes_business_capability:
  - Contact Management

archimate_type: application-function
---

Account Management provides the core capabilities for managing customer account data. It handles contact CRUD operations, organization hierarchy, account-level settings, and data enrichment workflows.
