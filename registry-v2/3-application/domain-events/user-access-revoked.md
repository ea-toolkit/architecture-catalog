---
type: domain-event
name: User Access Revoked
description: Emitted when a user's access to the platform is revoked, either by deprovisioning, suspension, or tenant removal.
owner: Security Team
domain: Security and Compliance
status: active
registered: false
event_format: CloudEvents
schema_registry: https://schema-registry.internal/security/user-access-revoked

published_by_api_endpoints:
  - auth-token-issue
consumed_by_api_endpoints:
  - access-control-api
  - audit-event-ingest
realizes_business_event:

archimate_type: application-event
ddd_type: Domain Event
---

Raised immediately when a user's identity transitions to suspended or deprovisioned. Downstream consumers (API Gateway, active session stores) consume this event to invalidate existing tokens and revoke active sessions within SLA.
