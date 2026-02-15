---
type: software-subsystem
name: Billing Worker
description: Background processing service for subscription billing, invoice generation, and payment webhooks.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false

parent_software_system: Billing Engine
composes_api_endpoints:
  - subscription-api
consumes_apis: []

archimate_type: application-component
c4_type: Container
togaf_type: Application Component
---

Billing Worker runs scheduled jobs for recurring billing cycles and processes payment provider webhook events.
