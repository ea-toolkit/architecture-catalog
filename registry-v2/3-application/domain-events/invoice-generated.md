---
type: domain-event
name: Invoice Generated
description: Emitted when a new invoice is created for a billing cycle, triggering payment collection workflows.
owner: Billing Team
status: active
domain: Billing and Payments
registered: false
event_format: CloudEvents/JSON

published_by_physical_apis:
  - subscription-api
consumed_by_physical_apis:
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Invoice Generated signals that a billing cycle has produced a new invoice ready for payment collection. Downstream consumers use this event to update analytics dashboards and trigger payment reminders.
