---
type: domain-event
name: Feature Flag Toggled
description: Emitted when a feature flag is enabled or disabled in production, either for all tenants or a specific segment, recording who made the change and when.
owner: Platform Operations Team
status: active
domain: Platform Operations
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/operations/feature-flag-toggled

published_by_api_endpoints:
  - flag-configure
consumed_by_api_endpoints:
  - audit-event-ingest
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Feature Flag Toggled provides an immutable change record for every flag state transition. Analytics can correlate flag toggles with metric movements for A/B test evaluation. The audit trail captures the operator, target scope, and previous flag state for change management compliance.
