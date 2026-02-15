---
type: domain-event
name: Payment Failed
description: Emitted when a payment attempt is declined or fails processing, initiating dunning and retry workflows.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - subscription-api
consumed_by_api_endpoints:
  - tenant-api

archimate_type: application-event
ddd_type: Domain Event
---

Payment Failed indicates that a payment collection attempt was unsuccessful. This triggers dunning workflows including retry scheduling, customer notifications, and potential account suspension after repeated failures.
