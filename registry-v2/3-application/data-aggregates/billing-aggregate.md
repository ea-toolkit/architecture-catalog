---
type: data-aggregate
name: Billing Aggregate
description: Consistency boundary for subscription billing including invoices, payment records, and usage tracking.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
lifecycle_states:
  - trial
  - active
  - past-due
  - cancelled

parent_data_concept: Subscription Plan
owned_by_component: Subscription Billing
composes_data_entities:
  - Invoice
  - Usage Record
  - Payment
  - Credit Note

archimate_type: data-object
ddd_type: Aggregate
togaf_type: Logical Data Component
---

The Billing Aggregate manages the financial lifecycle of a subscription including invoice generation, payment tracking, and usage metering.
