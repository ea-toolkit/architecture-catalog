---
type: domain-event
name: Subscription Renewed
description: Emitted when a subscription billing cycle completes successfully and the subscription is renewed.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - subscription-api
consumed_by_api_endpoints:
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

The Subscription Renewed event confirms a successful billing cycle. Used to update usage quotas and trigger renewal notifications.
