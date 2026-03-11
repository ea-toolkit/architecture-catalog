---
type: domain-event
name: SLO Breach Detected
description: Emitted when a service's error budget burns faster than the configured threshold, indicating an SLO is at risk of being breached within the alerting window.
owner: Platform Operations Team
domain: Platform Operations
status: active
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/operations/slo-breach-detected

published_by_api_endpoints:
  - metrics-query-endpoint
consumed_by_api_endpoints:
  - notification-api
  - analytics-query-api
realizes_business_event:

archimate_type: application-event
ddd_type: Domain Event
---

Raised by Alertmanager when a multi-window, multi-burn-rate alert fires for a service SLO. Carries the service name, SLO name, current burn rate, and projected time to complete SLO breach. PagerDuty receives this event as a high-priority incident trigger.
