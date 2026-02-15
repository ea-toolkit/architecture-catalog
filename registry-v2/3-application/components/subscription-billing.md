---
type: component
name: Subscription Billing
description: Handles subscription plan management, recurring billing cycles, invoicing, and payment reconciliation.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
sourcing: in-house

parent_domain: Billing and Payments
composes_components: []
owns_data_aggregates:
  - Billing Aggregate
realizes_api_contracts: []
realizes_business_capability: Customer Management
realized_by_software_systems:
  - Billing Engine

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
---

Subscription Billing manages all aspects of recurring revenue including plan selection, upgrades/downgrades, invoicing, and payment processing.
