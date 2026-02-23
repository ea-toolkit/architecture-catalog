---
type: domain-event
name: Tenant Suspended
description: Emitted when a tenant account is suspended due to billing issues, policy violations, or administrative action.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - tenant-api
consumed_by_api_endpoints:
  - access-control-api
  - notification-api
  - integration-api
  - customer-health-api
  - audit-api

archimate_type: application-event
ddd_type: Domain Event
---

Tenant Suspended signals that a tenant has been placed in suspended state. Access control blocks all API requests except billing, notifications alert tenant admins, integrations are paused, health scores are frozen, and the suspension is logged for compliance.
