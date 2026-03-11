---
type: domain-event
name: Capacity Limit Approaching
description: Emitted when infrastructure capacity utilisation exceeds a warning threshold, giving platform operators time to provision additional resources before hard limits are hit.
owner: Platform Operations Team
status: active
domain: Platform Operations
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/operations/capacity-limit-approaching

published_by_api_endpoints:
  - metrics-query-endpoint
consumed_by_api_endpoints:
  - notification-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Capacity Limit Approaching fires at a configurable warning threshold (typically 80% of capacity) to provide lead time for scaling actions. Notification services alert the operations on-call rotation, while analytics tracks capacity trend data to improve long-term capacity planning models.
