---
type: domain-event
name: Health Score Changed
description: Emitted when a tenant's health score crosses a significant threshold, triggering alerts and automated interventions.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - customer-health-api
consumed_by_api_endpoints:
  - notification-api
  - workflow-api
  - customer-data-api
  - integration-api

archimate_type: application-event
ddd_type: Domain Event
---

Health Score Changed signals that a tenant's composite health score has moved across a defined threshold (e.g., healthy → at-risk, at-risk → critical). Downstream systems use it to alert CSMs, trigger retention workflows, update the customer profile, and notify external CRM systems.
