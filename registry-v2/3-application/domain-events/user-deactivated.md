---
type: domain-event
name: User Deactivated
description: Emitted when a user's access is revoked from a tenant workspace, triggering session termination and cleanup.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - user-management-api
consumed_by_api_endpoints:
  - access-control-api
  - audit-api
  - notification-api
  - customer-health-api

archimate_type: application-event
ddd_type: Domain Event
---

User Deactivated signals that a user has been removed from a tenant workspace. Access control revokes all active sessions, the audit service logs the deactivation, a notification is sent to the tenant admin, and the health service recalculates the engagement score.
