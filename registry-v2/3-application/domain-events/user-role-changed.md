---
type: domain-event
name: User Role Changed
description: Emitted when a user's role or permissions are modified within a tenant, triggering session refresh and audit logging.
owner: Platform Team
status: active
domain: Customer Management
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - user-management-api
consumed_by_api_endpoints: []

archimate_type: application-event
ddd_type: Domain Event
---

User Role Changed signals that a user's permission set has been modified. Active sessions for the affected user are refreshed to reflect the new role, and the change is recorded in the audit log.
