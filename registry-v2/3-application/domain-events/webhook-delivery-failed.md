---
type: domain-event
name: Webhook Delivery Failed
description: Emitted when all retry attempts for a webhook delivery have been exhausted and the event is moved to the dead-letter queue.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/integration/webhook-delivery-failed

published_by_api_endpoints:
  - webhook-subscriptions-list
consumed_by_api_endpoints:
  - notification-api
realizes_business_event:

archimate_type: application-event
ddd_type: Domain Event
---

Raised after the final retry attempt for a webhook delivery fails. Downstream consumers (e.g., notification service) can use this event to alert the customer and mark the subscription as degraded.
