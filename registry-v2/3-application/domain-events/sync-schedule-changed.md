---
type: domain-event
name: Sync Schedule Changed
description: Emitted when a tenant modifies the sync frequency or schedule window for a connector, taking effect on the next scheduled run.
owner: Integration Team
status: active
domain: Integration and Connectivity
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/integration/sync-schedule-changed

published_by_api_endpoints:
  - sync-schedule-configure
consumed_by_api_endpoints:
  - connector-status-get
  - audit-event-ingest

archimate_type: application-event
ddd_type: Domain Event
---

Sync Schedule Changed notifies the connector orchestration layer that the cadence for a given connector has been updated. The audit trail records the configuration change for operational traceability.
