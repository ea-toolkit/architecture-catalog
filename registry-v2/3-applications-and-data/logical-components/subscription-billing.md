---
type: logical-component
name: Subscription Billing
description: Handles subscription plan management, recurring billing cycles, invoicing, and payment reconciliation.
owner: Billing Team
status: active
domain: NovaCRM Platform
registered: false
make_or_buy: make

parent_architecture_area_domain: NovaCRM Platform
composes_logical_components: []
owns_data_aggregates:
  - Billing Aggregate
realizes_logical_apis: []
realizes_business_capability: Customer Management
realized_by_software_systems:
  - Billing Engine

archimate_type: application-function
ddd_type: Bounded Context
togaf_type: Information System Service
---

Subscription Billing manages all aspects of recurring revenue including plan selection, upgrades/downgrades, invoicing, and payment processing.
