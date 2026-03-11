---
type: component
name: Data Sync Engine
description: Orchestrates scheduled and near-real-time bi-directional data synchronization between the platform and external systems, handling conflict resolution and transformation.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
sourcing: in-house

parent_domain: Integration and Connectivity
composes_components: []
owns_data_aggregates:
  - Sync Job Aggregate
realizes_api_contracts:
  - Data Sync API
realizes_business_capability: Partner Connectivity
realized_by_software_systems:
  - Integration Middleware

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
emm_type: Logical IS Component
---

Data Sync Engine schedules and executes data synchronization jobs between the Enterprise Platform and configured third-party systems. It applies field-level transformation rules, detects conflicts using a last-write-wins or custom policy, and maintains sync audit logs.
