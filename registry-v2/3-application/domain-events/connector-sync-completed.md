---
type: domain-event
name: Connector Sync Completed
description: Emitted when a partner connector sync job finishes successfully, including the count of created, updated, and deleted records.
owner: Integration Team
domain: Integration and Connectivity
status: active
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/integration/connector-sync-completed

published_by_api_endpoints:
  - connector-status-get
consumed_by_api_endpoints: []
realizes_business_event:

archimate_type: application-event
ddd_type: Domain Event
---

Published when a connector sync run reaches a terminal success state. Carries a summary payload with records_created, records_updated, records_deleted, and duration_ms. Analytics domain consumes this event for integration health metrics.
