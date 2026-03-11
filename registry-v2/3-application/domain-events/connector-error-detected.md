---
type: domain-event
name: Connector Error Detected
description: Emitted when a connector sync run encounters a non-fatal error that is retryable, such as a rate-limit response or transient network failure.
owner: Integration Team
status: active
domain: Integration and Connectivity
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/integration/connector-error-detected

published_by_api_endpoints:
  - connector-status-get
consumed_by_api_endpoints:
  - metrics-query-endpoint
  - notification-api

archimate_type: application-event
ddd_type: Domain Event
---

Connector Error Detected provides observability for partial sync failures before they escalate to terminal states. Monitoring systems track error frequency to surface degraded connectors, and notifications may alert the tenant if the error persists beyond a threshold.
