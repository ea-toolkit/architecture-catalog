---
type: domain-event
name: Gateway Timeout Exceeded
description: Emitted when the API gateway detects that a downstream integration service has exceeded its response time SLA, triggering circuit-breaker logic.
owner: Integration Team
status: active
domain: Integration and Connectivity
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/integration/gateway-timeout-exceeded

published_by_api_endpoints:
  - gateway-health-check
consumed_by_api_endpoints:
  - metrics-query-endpoint
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Gateway Timeout Exceeded activates circuit-breaker patterns to prevent cascading failures. Monitoring systems consume this event to update health dashboards and adjust SLO burn-rate calculations for the affected integration service.
