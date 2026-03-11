---
type: domain-event
name: Plan Upgraded
description: Emitted when a tenant upgrades their subscription to a higher tier plan, triggering quota increases and proration adjustments.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - subscription-api
consumed_by_api_endpoints:
  - tenant-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Plan Upgraded triggers proration billing for the current cycle and instructs the tenant provisioning service to expand resource quotas immediately. Analytics records upgrade events to measure expansion revenue and identify upgrade triggers in the customer journey.
