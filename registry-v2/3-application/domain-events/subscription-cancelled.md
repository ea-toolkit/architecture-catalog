---
type: domain-event
name: Subscription Cancelled
description: Emitted when a subscription is cancelled by the customer or automatically after failed dunning cycles, marking the end of the billing relationship.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - subscription-api
consumed_by_api_endpoints:
  - tenant-api
  - notification-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Subscription Cancelled drives offboarding workflows: tenant provisioning systems downgrade the account to a free tier or freeze access, notification services send churn confirmation emails, and analytics record the cancellation reason for cohort analysis.
