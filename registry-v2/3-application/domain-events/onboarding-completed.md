---
type: domain-event
name: Onboarding Completed
description: Emitted when a tenant completes all onboarding steps and the account is fully operational.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - onboarding-api
consumed_by_api_endpoints:
  - customer-health-api
  - notification-api
  - integration-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Onboarding Completed signals that a tenant has finished all required onboarding steps. This triggers a health score baseline calculation, sends a completion notification, activates configured integrations, and initializes analytics dashboards.
