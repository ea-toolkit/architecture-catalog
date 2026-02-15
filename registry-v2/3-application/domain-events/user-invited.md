---
type: domain-event
name: User Invited
description: Emitted when a new user is invited to join a tenant workspace, triggering invitation email delivery and access provisioning.
owner: Platform Team
status: active
domain: Customer Management
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - user-management-api
consumed_by_api_endpoints:
  - notification-api

archimate_type: application-event
ddd_type: Domain Event
---

User Invited signals that a tenant administrator has invited a new user to the workspace. This triggers the invitation email workflow and prepares the user's access profile for activation upon acceptance.
