---
type: software-system
name: Billing Engine
description: Subscription billing platform managing plans, invoicing, and payment processing.
owner: Billing Team
status: active
domain: NovaCRM Platform
registered: false
make_or_buy: make

composes_software_subsystems:
  - billing-worker
realizes_logical_component: Subscription Billing

archimate_type: application-component
c4_type: System
togaf_type: Application Component
---

Billing Engine handles the financial aspects of the platform including subscription management, invoice generation, and payment reconciliation.
