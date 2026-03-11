---
type: domain-event
name: Webhook Registered
description: Emitted when a tenant successfully registers a new webhook subscription endpoint, establishing a delivery target for platform events.
owner: Integration Team
status: active
domain: Integration and Connectivity
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/integration/webhook-registered

published_by_api_endpoints:
  - webhook-subscriptions-create
consumed_by_api_endpoints:
  - audit-event-ingest
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Webhook Registered marks the start of an outbound event delivery relationship. The audit trail records the new subscription configuration for compliance, and analytics tracks webhook adoption across tenant segments.
