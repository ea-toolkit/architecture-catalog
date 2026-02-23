---
type: software-subsystem
name: Customer Health Service
description: Computes and maintains real-time customer health scores based on usage patterns, support interactions, and engagement signals.
owner: Platform Team
status: active
domain: Customer Management
environments:
  - production
  - staging

parent_software_system: Platform Core
composes_api_endpoints:
  - customer-health-api

archimate_type: application-component
---

Customer Health Service aggregates signals from product usage, support tickets, NPS responses, and billing events to compute a composite health score per tenant. Scores are updated in near-real-time and feed into churn prediction and account expansion workflows.
