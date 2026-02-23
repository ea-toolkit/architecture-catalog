---
type: domain-event
name: Permission Policy Changed
description: Emitted when a tenant's access control policies or role definitions are modified, triggering policy propagation.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - access-control-api
consumed_by_api_endpoints:
  - user-management-api
  - audit-api
  - notification-api

archimate_type: application-event
ddd_type: Domain Event
---

Permission Policy Changed signals that a tenant's RBAC/ABAC policies have been updated. The user management service refreshes cached permissions, the audit trail records the policy change, and affected administrators receive a notification about the policy update.
