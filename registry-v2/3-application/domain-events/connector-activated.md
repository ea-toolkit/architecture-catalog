---
type: domain-event
name: Connector Activated
description: Emitted when a tenant enables a new partner connector for the first time and the initial authentication handshake succeeds.
owner: Integration Team
status: active
domain: Integration and Connectivity
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/integration/connector-activated

published_by_api_endpoints:
  - connector-status-get
consumed_by_api_endpoints:
  - analytics-query-api
  - audit-event-ingest

archimate_type: application-event
ddd_type: Domain Event
---

Connector Activated is the first event in the integration lifecycle. It records which connector type and tenant triggered the activation, allowing analytics to track connector adoption rates and the audit trail to log the provisioning action.
