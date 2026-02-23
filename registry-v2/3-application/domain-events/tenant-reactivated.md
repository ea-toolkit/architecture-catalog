---
type: domain-event
name: Tenant Reactivated
description: Emitted when a suspended tenant account is restored to active status after issue resolution.
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
  - onboarding-api

archimate_type: application-event
ddd_type: Domain Event
---

Tenant Reactivated signals that a previously suspended tenant has been restored. Access is re-enabled, the tenant admin is notified, integrations resume, health scores are recalculated, and a re-onboarding checklist may be triggered.
