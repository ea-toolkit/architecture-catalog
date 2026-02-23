---
type: domain-event
name: Webhook Failed
description: Emitted when a webhook delivery fails after exhausting retry attempts, triggering alerts and fallback handling.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - integration-api
consumed_by_api_endpoints:
  - notification-api
  - audit-api
  - customer-health-api

archimate_type: application-event
ddd_type: Domain Event
---

Webhook Failed signals that a webhook delivery could not be completed after all retry attempts. A notification alerts the tenant admin, the failure is logged for compliance, and the health service factors integration failures into the tenant health score.
