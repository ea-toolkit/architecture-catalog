---
type: domain-event
name: Webhook Delivered
description: Emitted when an outbound webhook is successfully delivered to an external endpoint, confirming integration sync.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - integration-api
consumed_by_api_endpoints:
  - audit-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Webhook Delivered confirms that an outbound webhook payload was accepted by the external endpoint (HTTP 2xx). The audit trail records the delivery for compliance, and analytics tracks delivery success rates and latency.
