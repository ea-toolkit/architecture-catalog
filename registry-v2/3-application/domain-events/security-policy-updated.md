---
type: domain-event
name: Security Policy Updated
description: Emitted when a tenant administrator updates a security policy such as password complexity rules, session timeout thresholds, or IP allowlists.
owner: Security Team
status: active
domain: Security and Compliance
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/security/security-policy-updated

published_by_api_endpoints:
  - audit-event-ingest
consumed_by_api_endpoints:
  - access-control-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Security Policy Updated propagates configuration changes to the enforcement layer. The access control service reloads the affected policy immediately, and the audit trail records who made the change, the before/after diff, and the timestamp for compliance reporting.
