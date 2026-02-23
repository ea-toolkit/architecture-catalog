---
type: domain-event
name: Notification Bounced
description: Emitted when a notification delivery permanently fails (email bounce, invalid phone, disabled push), updating delivery preferences.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - notification-api
consumed_by_api_endpoints:
  - customer-data-api
  - customer-health-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Notification Bounced signals that a delivery attempt permanently failed. The customer data platform marks the channel as invalid, the health service factors communication failures into engagement scoring, and the bounce is logged for compliance with email sender reputation requirements.
