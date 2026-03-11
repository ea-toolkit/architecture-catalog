---
type: domain-event
name: Payment Refunded
description: Emitted when a refund has been successfully processed and the funds have been returned to the customer's payment method.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - subscription-api
consumed_by_api_endpoints:
  - notification-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Payment Refunded signals that a refund transaction has cleared. Notification services use this to dispatch confirmation emails to the customer, while analytics track refund rates by plan type and billing period.
