---
type: data-entity
name: Invoice
description: Financial document representing charges for a billing period, including line items and payment status.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
entity_type: child

parent_data_aggregate: Billing Aggregate

archimate_type: data-object
ddd_type: Entity
togaf_type: Physical Data Component
---

The Invoice entity captures billing period, line items (plan fee, overages, credits), total amount, and payment status.
