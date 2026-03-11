---
type: domain-event
name: Payment Method Updated
description: Emitted when a tenant updates their default payment method, allowing dunning recovery workflows to retry previously failed charges.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - subscription-api
consumed_by_api_endpoints:
  - notification-api
  - audit-event-ingest

archimate_type: application-event
ddd_type: Domain Event
---

Payment Method Updated is critical for dunning recovery — when a customer adds a new card, in-flight failed payment workflows can immediately attempt a retry. The audit trail captures the event for PCI compliance purposes.
