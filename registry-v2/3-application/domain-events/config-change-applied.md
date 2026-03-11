---
type: domain-event
name: Config Change Applied
description: Emitted when a runtime configuration value is updated and successfully propagated to all running service instances without a redeployment.
owner: Platform Operations Team
status: active
domain: Platform Operations
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/operations/config-change-applied

published_by_api_endpoints:
  - config-values-get
consumed_by_api_endpoints:
  - audit-event-ingest
  - metrics-query-endpoint

archimate_type: application-event
ddd_type: Domain Event
---

Config Change Applied signals that a dynamic configuration update has been fully propagated. The audit trail records the configuration key, old value, new value, and operator for compliance. Monitoring systems can correlate config changes with metric deviations during incident investigation.
