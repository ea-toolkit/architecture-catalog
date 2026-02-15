---
type: domain-event
name: Tenant Deactivated
description: Emitted when a tenant account is fully decommissioned after offboarding, triggering downstream cleanup and billing finalization.
owner: Platform Team
status: active
domain: Customer Management
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - tenant-api
consumed_by_api_endpoints:
  - subscription-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Tenant Deactivated signals that a tenant workspace has been fully decommissioned. Downstream systems use this event to finalize billing, archive analytics data, and clean up infrastructure resources.
