---
type: domain-event
name: Contact Created
description: Emitted when a new contact record is added to a tenant account, syncing across CRM, notifications, and data platforms.
owner: Platform Team
status: active
domain: Customer Management
event_format: CloudEvents/JSON

published_by_api_endpoints:
  - customer-data-api
consumed_by_api_endpoints:
  - notification-api
  - workflow-api
  - integration-api
  - analytics-query-api

archimate_type: application-event
ddd_type: Domain Event
---

Contact Created signals that a new contact has been added to a tenant's CRM. Downstream consumers use it to send welcome communications, trigger onboarding workflows for the contact, sync data to external CRMs, and update analytics counts.
